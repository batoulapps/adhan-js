import Coordinates from './Coordinates';
import PrayerTimes from './PrayerTimes';
import Prayer from './Prayer';
import { Madhab } from './Madhab';
import HighLatitudeRule from './HighLatitudeRule';
import CalculationMethod from './CalculationMethod';
import CalculationParameters from './CalculationParameters';
import qibla from './Qibla';
import SunnahTimes from './SunnahTimes';

const adhan = {
    Prayer: Prayer,
    Madhab: Madhab,
    HighLatitudeRule: HighLatitudeRule,
    Coordinates: Coordinates,
    CalculationParameters: CalculationParameters,
    CalculationMethod: CalculationMethod,
    PrayerTimes: PrayerTimes,
    SunnahTimes: SunnahTimes,
    Qibla: qibla
};

export default adhan;