import { Madhab } from './Madhab';
import HighLatitudeRule from './HighLatitudeRule';
import { PolarCircleResolution } from './PolarCircleResolution';
import { Rounding } from './Rounding';
import { Shafaq } from './Shafaq';

export default class CalculationParameters {
    constructor(methodName, fajrAngle, ishaAngle, ishaInterval, maghribAngle) {
        // Name of the method, can be used to apply special behavior in calculations.
        // This property should not be manually modified.
        this.method = methodName || "Other";

        // Angle of the sun below the horizon used for calculating Fajr.
        this.fajrAngle = fajrAngle || 0;

        // Angle of the sun below the horizon used for calculating Isha.
        this.ishaAngle = ishaAngle || 0;

        // Minutes after Maghrib to determine time for Isha
        // if this value is greater than 0 then ishaAngle is not used.
        this.ishaInterval = ishaInterval || 0;

        // Angle of the sun below the horizon used for calculating Maghrib.
        // Only used by the Tehran method to account for lightness in the sky.
        this.maghribAngle = maghribAngle;

        // Madhab to determine how Asr is calculated.
        this.madhab = Madhab.Shafi;

        // Rule to determine the earliest time for Fajr and latest time for Isha
        // needed for high latitude locations where Fajr and Isha may not truly exist
        // or may present a hardship unless bound to a reasonable time.
        this.highLatitudeRule = HighLatitudeRule.MiddleOfTheNight;

        // Manual adjustments (in minutes) to be added to each prayer time.
        this.adjustments = { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 };

        // Adjustments set by a calculation method. This value should not be manually modified.
        this.methodAdjustments = { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 };

        // Rule to determine how to resolve prayer times inside the Polar Circle
        // where daylight or night may persist for more than 24 hours depending
        // on the season
        this.polarCircleResolution = PolarCircleResolution.Unresolved;

        // How seconds are rounded when calculating prayer times
        this.rounding = Rounding.Nearest;

        // Used by the MoonsightingCommittee method to determine how to calculate Isha
        this.shafaq = Shafaq.General;
    }

    nightPortions() {
        switch (this.highLatitudeRule) {
            case HighLatitudeRule.MiddleOfTheNight:
                return { fajr: 1 / 2, isha: 1 / 2 };
            case HighLatitudeRule.SeventhOfTheNight:
                return { fajr: 1 / 7, isha: 1 / 7 };
            case HighLatitudeRule.TwilightAngle:
                return { fajr: this.fajrAngle / 60, isha: this.ishaAngle / 60 };
            default:
                throw(`Invalid high latitude rule found when attempting to compute night portions: ${this.highLatitudeRule}`);
        }
    }
}
