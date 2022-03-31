import Astronomical from '../src/Astronomical';
import TimeComponents from '../src/TimeComponents';
import Coordinates from '../src/Coordinates';
import SolarTime from '../src/SolarTime';
import SolarCoordinates from '../src/SolarCoordinates';
import { unwindAngle } from '../src/MathUtils';
import { dayOfYear } from '../src/DateUtils';

function timeString(hours) {
	const comps = new TimeComponents(hours);
    if (isNaN(comps.hours) || isNaN(comps.minutes) || isNaN(comps.seconds)) {
        return "";
    }

    // round to the nearest minute
    let minutes = (comps.minutes + Math.round((comps.seconds)/60)).toString();
    if (minutes.length === 1) {
		minutes = "0" + minutes;
    }
    return comps.hours + ":" + minutes;
}

test("Calculate solar coordinate values",() => {
	// values from Astronomical Algorithms page 165

	let jd = Astronomical.julianDay(1992, 10, 13);
	let solar = new SolarCoordinates(jd);

	let T = Astronomical.julianCentury(jd);
	let L0 = Astronomical.meanSolarLongitude(T);
	let E0 = Astronomical.meanObliquityOfTheEcliptic(T);
	const Eapp = Astronomical.apparentObliquityOfTheEcliptic(T, E0);
	const M = Astronomical.meanSolarAnomaly(T);
	const C = Astronomical.solarEquationOfTheCenter(T, M);
	const Lambda = Astronomical.apparentSolarLongitude(T, L0);
	const Delta = solar.declination;
	const Alpha = unwindAngle(solar.rightAscension);

	expect(T).toBeCloseTo(-0.072183436, 9);
	expect(L0).toBeCloseTo(201.80720, 4);
	expect(E0).toBeCloseTo(23.44023, 4);
	expect(Eapp).toBeCloseTo(23.43999, 4);
	expect(M).toBeCloseTo(278.99397, 4);
	expect(C).toBeCloseTo(-1.89732, 4);
	expect(Lambda).toBeCloseTo(199.90895, 4);
	expect(Delta).toBeCloseTo(-7.78507, 4);
	expect(Alpha).toBeCloseTo(198.38083, 4);

	// values from Astronomical Algorithms page 88

	jd = Astronomical.julianDay(1987, 4, 10);
	solar = new SolarCoordinates(jd);
	T = Astronomical.julianCentury(jd);

	const Theta0 = Astronomical.meanSiderealTime(T);
	const Thetaapp = solar.apparentSiderealTime;
	const Omega = Astronomical.ascendingLunarNodeLongitude(T);
	E0 = Astronomical.meanObliquityOfTheEcliptic(T);
	L0 = Astronomical.meanSolarLongitude(T);
	const Lp = Astronomical.meanLunarLongitude(T);
	const dPsi = Astronomical.nutationInLongitude(T, L0, Lp, Omega);
	const dE = Astronomical.nutationInObliquity(T, L0, Lp, Omega);
	const E = E0 + dE;

	expect(Theta0).toBeCloseTo(197.693195, 5);
	expect(Thetaapp).toBeCloseTo(197.6922295833, 3);

	// values from Astronomical Algorithms page 148

	expect(Omega).toBeCloseTo(11.2531, 3);
	expect(dPsi).toBeCloseTo(-0.0010522, 3);
	expect(dE).toBeCloseTo(0.0026230556, 4);
	expect(E0).toBeCloseTo(23.4409463889, 5);
	expect(E).toBeCloseTo(23.4435694444, 4);
});

test("Calculate the Altitude Of Celestial Body",() => {
	const Phi = 38 + (55 / 60) + (17.0 / 3600);
	const Delta = -6 - (43 / 60) - (11.61 / 3600);
	const H = 64.352133;
	const altitude = Astronomical.altitudeOfCelestialBody(Phi, Delta, H);
	expect(altitude).toBeCloseTo(15.1249, 3);
});

test("Calculate the Transit and Hour Angle",() => {
	// values from Astronomical Algorithms page 103
	const longitude = -71.0833;
	const Theta = 177.74208;
	const Alpha1 = 40.68021;
	const Alpha2 = 41.73129;
	const Alpha3 = 42.78204;
	const m0 = Astronomical.approximateTransit(longitude, Theta, Alpha2);

	expect(m0).toBeCloseTo(0.81965, 4);

	const transit = Astronomical.correctedTransit(m0, longitude, Theta, Alpha2, Alpha1, Alpha3) / 24;

	expect(transit).toBeCloseTo(0.81980, 4);

	const Delta1 = 18.04761;
	const Delta2 = 18.44092;
	const Delta3 = 18.82742;
	const coordinates = new Coordinates(42.3333, longitude);

	const rise = Astronomical.correctedHourAngle(m0, -0.5667, coordinates, false, Theta, Alpha2, Alpha1, Alpha3, Delta2, Delta1, Delta3) / 24;
	expect(rise).toBeCloseTo(0.51766, 4);
});

test("calculate Solar Time values",() => {
	// Comparison values generated from http://aa.usno.navy.mil/rstt/onedaytable?form=1&ID=AA&year=2015&month=7&day=12&state=NC&place=raleigh
	const coordinates = new Coordinates(35 + 47/60, -78 - 39/60);
	const solar = new SolarTime(new Date(2015, 6, 12), coordinates);

	const transit = solar.transit;
	const sunrise = solar.sunrise;
	const sunset = solar.sunset;
	const twilightStart = solar.hourAngle(-6, false);
	const twilightEnd = solar.hourAngle(-6, true);
	const invalid = solar.hourAngle(-36, true);
	expect(timeString(twilightStart)).toBe("9:38");
	expect(timeString(sunrise)).toBe("10:08");
	expect(timeString(transit)).toBe("17:20");
	expect(timeString(sunset)).toBe("24:32");
	expect(timeString(twilightEnd)).toBe("25:02");
	expect(timeString(invalid)).toBe("");
});

test("verify Right Ascension Edge Case",() => {
	const coordinates = new Coordinates(35 + 47/60, -78 - 39/60);
	const solar = [];
	for (let i = 0; i <= 365; i++) {
		solar.push(new SolarTime(new Date(2016, 0, i), coordinates));
	}

	for (let i = 1; i < solar.length; i++) {
		const time = solar[i];
		const previousTime = solar[i-1];
		expect(Math.abs(time.transit - previousTime.transit)).toBeLessThan(1/60);
		expect(Math.abs(time.sunrise - previousTime.sunrise)).toBeLessThan(2/60);
		expect(Math.abs(time.sunset - previousTime.sunset)).toBeLessThan(2/60);
	}
});

test("verify the correct calendar date is being used for calculations",() => {
	// generated from http://aa.usno.navy.mil/data/docs/RS_OneYear.php for KUKUIHAELE, HAWAII
	const coordinates = new Coordinates(20 + 7/60, -155 - 34/60);
	const day1solar = new SolarTime(new Date(2015, 3, 2), coordinates);
	const day2solar = new SolarTime(new Date(2015, 3, 3), coordinates);

	const day1 = day1solar.sunrise;
	const day2 = day2solar.sunrise;

	expect(timeString(day1)).toBe("16:15")
	expect(timeString(day2)).toBe("16:14")
});

test("interpolate a value given previous and next values along with an interpolation factor",() => {
	const interpolatedValue = Astronomical.interpolate(0.877366, 0.884226, 0.870531, 4.35/24)
	expect(interpolatedValue).toBeCloseTo(0.876125, 5);

	const i1 = Astronomical.interpolate(1, -1, 3, 0.6);
	expect(i1).toBeCloseTo(2.2, 5);

	const i2 = Astronomical.interpolateAngles(1, -1, 3, 0.6);
	expect(i2).toBeCloseTo(2.2, 5);

	const i3 = Astronomical.interpolateAngles(1, 359, 3, 0.6);
	expect(i3).toBeCloseTo(2.2, 5);
});

test("calculate the Julian day for a given Gregorian date",() => {
	// Comparison values generated from http://aa.usno.navy.mil/data/docs/JulianDate.php
	expect(Astronomical.julianDay(2010, 1, 2)).toBe(2455198.500000);
	expect(Astronomical.julianDay(2011, 2, 4)).toBe(2455596.500000);
	expect(Astronomical.julianDay(2012, 3, 6)).toBe(2455992.500000);
	expect(Astronomical.julianDay(2013, 4, 8)).toBe(2456390.500000);
	expect(Astronomical.julianDay(2014, 5, 10)).toBe(2456787.500000);
	expect(Astronomical.julianDay(2015, 6, 12)).toBe(2457185.500000);
	expect(Astronomical.julianDay(2016, 7, 14)).toBe(2457583.500000);
	expect(Astronomical.julianDay(2017, 8, 16)).toBe(2457981.500000);
	expect(Astronomical.julianDay(2018, 9, 18)).toBe(2458379.500000);
	expect(Astronomical.julianDay(2019, 10, 20)).toBe(2458776.500000);
	expect(Astronomical.julianDay(2020, 11, 22)).toBe(2459175.500000);
	expect(Astronomical.julianDay(2021, 12, 24)).toBe(2459572.500000);

	const jdVal = 2457215.67708333;
	expect(Astronomical.julianDay(2015, 7, 12, 4.25)).toBeCloseTo(jdVal, 5);

	expect(Astronomical.julianDay(2015, 7, 12, 8.0)).toBeCloseTo(2457215.833333, 5);
	expect(Astronomical.julianDay(1992, 10, 13, 0.0)).toBeCloseTo(2448908.5, 5);

	const j1 = Astronomical.julianDay(2010, 1, 3);
	const j2 = Astronomical.julianDay(2010, 1, 1, 48);
	expect(j1).toBe(j2);
});

test("determine if a year is a leap year",() => {
	expect(Astronomical.isLeapYear(2015)).toBeFalsy();
	expect(Astronomical.isLeapYear(2016)).toBeTruthy();
	expect(Astronomical.isLeapYear(1600)).toBeTruthy();
	expect(Astronomical.isLeapYear(2000)).toBeTruthy();
	expect(Astronomical.isLeapYear(2400)).toBeTruthy();
	expect(Astronomical.isLeapYear(1700)).toBeFalsy();
	expect(Astronomical.isLeapYear(1800)).toBeFalsy();
	expect(Astronomical.isLeapYear(1900)).toBeFalsy();
	expect(Astronomical.isLeapYear(2100)).toBeFalsy();
	expect(Astronomical.isLeapYear(2200)).toBeFalsy();
	expect(Astronomical.isLeapYear(2300)).toBeFalsy();
	expect(Astronomical.isLeapYear(2500)).toBeFalsy();
	expect(Astronomical.isLeapYear(2600)).toBeFalsy();
});

test("get the day of the year for a date",() => {
	expect(dayOfYear(new Date(2015, 0, 1))).toBe(1);
	expect(dayOfYear(new Date(2015, 11, 31))).toBe(365);
	expect(dayOfYear(new Date(2016, 11, 31))).toBe(366);
	expect(dayOfYear(new Date(2015, 1, 1))).toBe(32);
});

test("calculate the days since the winter or summer solstice",() => {
	expect(Astronomical.daysSinceSolstice(dayOfYear(new Date(2016, 0, 1)), 2016, 1)).toBe(11);
	expect(Astronomical.daysSinceSolstice(dayOfYear(new Date(2015, 11, 31)), 2015, 1)).toBe(10);
	expect(Astronomical.daysSinceSolstice(dayOfYear(new Date(2016, 11, 31)), 2016, 1)).toBe(10);
	expect(Astronomical.daysSinceSolstice(dayOfYear(new Date(2016, 11, 21)), 2016, 1)).toBe(0);
	expect(Astronomical.daysSinceSolstice(dayOfYear(new Date(2016, 11, 22)), 2016, 1)).toBe(1);
	expect(Astronomical.daysSinceSolstice(dayOfYear(new Date(2016, 2, 1)), 2016, 1)).toBe(71);
	expect(Astronomical.daysSinceSolstice(dayOfYear(new Date(2015, 2, 1)), 2015, 1)).toBe(70);
	expect(Astronomical.daysSinceSolstice(dayOfYear(new Date(2016, 11, 20)), 2016, 1)).toBe(365);
	expect(Astronomical.daysSinceSolstice(dayOfYear(new Date(2015, 11, 20)), 2015, 1)).toBe(364);

	expect(Astronomical.daysSinceSolstice(dayOfYear(new Date(2015, 5, 21)), 2015, -1)).toBe(0);
	expect(Astronomical.daysSinceSolstice(dayOfYear(new Date(2016, 5, 21)), 2016, -1)).toBe(0);
	expect(Astronomical.daysSinceSolstice(dayOfYear(new Date(2015, 5, 20)), 2015, -1)).toBe(364);
	expect(Astronomical.daysSinceSolstice(dayOfYear(new Date(2016, 5, 20)), 2016, -1)).toBe(365);
});

