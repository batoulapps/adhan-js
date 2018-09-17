var expect = require("chai").expect;
var adhan = require("../Adhan.js");
var unwindAngle = adhan.Math.unwindAngle;
var timeComponents = adhan.Math.timeComponents;
var dayOfYear = adhan.Date.dayOfYear;
var julianDate = adhan.Date.julianDate;

function timeString(hours) {
	var comps = timeComponents(hours);
    if (isNaN(comps.hours) || isNaN(comps.minutes) || isNaN(comps.seconds)) {
        return "";
    }

    // round to the nearest minute
    var minutes = (comps.minutes + Math.round((comps.seconds)/60)).toString();
    if (minutes.length == 1) {
    	minutes = "0" + minutes;
    }
    return comps.hours + ":" + minutes;
}

describe("Astronomical Equations", function() {
    it("Calculates solar coordinate values", function() {
		// values from Astronomical Algorithms page 165

		var jd = adhan.Astronomical.julianDay(1992, 10, 13);
		var solar = new adhan.SolarCoordinates(jd);

		var T = adhan.Astronomical.julianCentury(jd);
		var L0 = adhan.Astronomical.meanSolarLongitude(T);
		var E0 = adhan.Astronomical.meanObliquityOfTheEcliptic(T);
		var Eapp = adhan.Astronomical.apparentObliquityOfTheEcliptic(T, E0);
		var M = adhan.Astronomical.meanSolarAnomaly(T);
	    var C = adhan.Astronomical.solarEquationOfTheCenter(T, M);
	    var Lambda = adhan.Astronomical.apparentSolarLongitude(T, L0);
	    var Delta = solar.declination;
	    var Alpha = unwindAngle(solar.rightAscension);

		expect(T).to.be.closeTo(-0.072183436, 0.00000000001);
		expect(L0).to.be.closeTo(201.80720, 0.00001);
		expect(E0).to.be.closeTo(23.44023, 0.00001);
		expect(Eapp).to.be.closeTo(23.43999, 0.00001);
		expect(M).to.be.closeTo(278.99397, 0.00001);
		expect(C).to.be.closeTo(-1.89732, 0.00001);
		expect(Lambda).to.be.closeTo(199.90895, 0.00002);
	    expect(Delta).to.be.closeTo(-7.78507, 0.00001);
	    expect(Alpha).to.be.closeTo(198.38083, 0.00001);

	    // values from Astronomical Algorithms page 88

	    jd = adhan.Astronomical.julianDay(1987, 4, 10);
	    solar = new adhan.SolarCoordinates(jd);
	    T = adhan.Astronomical.julianCentury(jd);

	    var Theta0 = adhan.Astronomical.meanSiderealTime(T);
	    var Thetaapp = solar.apparentSiderealTime;
	    var Omega = adhan.Astronomical.ascendingLunarNodeLongitude(T);
	    E0 = adhan.Astronomical.meanObliquityOfTheEcliptic(T);
	    L0 = adhan.Astronomical.meanSolarLongitude(T);
	    var Lp = adhan.Astronomical.meanLunarLongitude(T);
	    var dPsi = adhan.Astronomical.nutationInLongitude(T, L0, Lp, Omega);
	    var dE = adhan.Astronomical.nutationInObliquity(T, L0, Lp, Omega);
	    var E = E0 + dE;

		expect(Theta0).to.be.closeTo(197.693195, 0.000001);
	    expect(Thetaapp).to.be.closeTo(197.6922295833, 0.0001);

	    // values from Astronomical Algorithms page 148

	    expect(Omega).to.be.closeTo(11.2531, 0.0001);
	    expect(dPsi).to.be.closeTo(-0.0010522,  0.0001);
	    expect(dE).to.be.closeTo(0.0026230556, 0.00001);
	    expect(E0).to.be.closeTo(23.4409463889, 0.000001);
	    expect(E).to.be.closeTo(23.4435694444, 0.00001);
	});

	it("Calculates the Altitude Of Celestial Body", function() {
		var Phi = 38 + (55 / 60) + (17.0 / 3600);
    	var Delta = -6 - (43 / 60) - (11.61 / 3600);
    	var H = 64.352133;
    	var altitude = adhan.Astronomical.altitudeOfCelestialBody(Phi, Delta, H);
		expect(altitude).to.be.closeTo(15.1249, 0.0001);
	});

	it("Calculates the Transit and Hour Angle", function() {
		// values from Astronomical Algorithms page 103
		var longitude = -71.0833;
		var Theta = 177.74208;
		var Alpha1 = 40.68021;
		var Alpha2 = 41.73129;
		var Alpha3 = 42.78204;
		var m0 = adhan.Astronomical.approximateTransit(longitude, Theta, Alpha2);

		expect(m0).to.be.closeTo(0.81965, 0.00001);

	    var transit = adhan.Astronomical.correctedTransit(m0, longitude, Theta, Alpha2, Alpha1, Alpha3) / 24;

	    expect(transit).to.be.closeTo(0.81980, 0.00001);

	    var Delta1 = 18.04761;
	    var Delta2 = 18.44092;
	    var Delta3 = 18.82742;
	    var coordinates = new adhan.Coordinates(42.3333, longitude);

	    var rise = adhan.Astronomical.correctedHourAngle(m0, -0.5667, coordinates, false, Theta, Alpha2, Alpha1, Alpha3, Delta2, Delta1, Delta3) / 24;
	    expect(rise).to.be.closeTo(0.51766, 0.00001);
	});

	it("calculates Solar Time values", function() {
	    // Comparison values generated from http://aa.usno.navy.mil/rstt/onedaytable?form=1&ID=AA&year=2015&month=7&day=12&state=NC&place=raleigh
	    var coordinates = new adhan.Coordinates(35 + 47/60, -78 - 39/60);
	    var solar = new adhan.SolarTime(new Date(2015, 6, 12), coordinates);

	    var transit = solar.transit;
	    var sunrise = solar.sunrise;
	    var sunset = solar.sunset;
	    var twilightStart = solar.hourAngle(-6, false);
	    var twilightEnd = solar.hourAngle(-6, true);
	    var invalid = solar.hourAngle(-36, true);
	    expect(timeString(twilightStart)).to.equal("9:38");
	    expect(timeString(sunrise)).to.equal("10:08");
	    expect(timeString(transit)).to.equal("17:20");
	    expect(timeString(sunset)).to.equal("24:32");
	    expect(timeString(twilightEnd)).to.equal("25:02");
	    expect(timeString(invalid)).to.equal("");
	});

	it("verifies Right Ascension Edge Case", function() {
	    var coordinates = new adhan.Coordinates(35 + 47/60, -78 - 39/60);
	    var solar = [];
	    for (var i = 0; i <= 365; i++) {
	        solar.push(new adhan.SolarTime(new Date(2016, 0, i), coordinates));
	    }

	    for (var i = 1; i < solar.length; i++) {
	        var time = solar[i];
	        var previousTime = solar[i-1];
	        expect(Math.abs(time.transit - previousTime.transit) < 1/60).to.be.true;
	        expect(Math.abs(time.sunrise - previousTime.sunrise) < 2/60).to.be.true;
	        expect(Math.abs(time.sunset - previousTime.sunset) < 2/60).to.be.true;
	    }
	});

	it("verifies the correct calendar date is being used for calculations", function() {
		// generated from http://aa.usno.navy.mil/data/docs/RS_OneYear.php for KUKUIHAELE, HAWAII
	    var coordinates = new adhan.Coordinates(20 + 7/60, -155 - 34/60);
	    var day1solar = new adhan.SolarTime(new Date(2015, 3, 2), coordinates);
	    var day2solar = new adhan.SolarTime(new Date(2015, 3, 3), coordinates);

	    var day1 = day1solar.sunrise;
	    var day2 = day2solar.sunrise;

	    expect(timeString(day1)).to.equal("16:15")
	    expect(timeString(day2)).to.equal("16:14")
	});

	it("interpolates a value given previous and next values along with an interpolation factor", function() {
		var interpolatedValue = adhan.Astronomical.interpolate(0.877366, 0.884226, 0.870531, 4.35/24)
		expect(interpolatedValue).to.be.closeTo(0.876125, 0.000001);

	    var i1 = adhan.Astronomical.interpolate(1, -1, 3, 0.6);
	    expect(i1).to.be.closeTo(2.2, 0.000001);

	    var i2 = adhan.Astronomical.interpolateAngles(1, -1, 3, 0.6);
	    expect(i2).to.be.closeTo(2.2, 0.000001);

	    var i3 = adhan.Astronomical.interpolateAngles(1, 359, 3, 0.6);
	    expect(i3).to.be.closeTo(2.2, 0.000001);
	});

	it("calculates the Julian day for a given Gregorian date", function() {
		// Comparison values generated from http://aa.usno.navy.mil/data/docs/JulianDate.php
		expect(adhan.Astronomical.julianDay(2010, 1, 2)).to.equal(2455198.500000);
		expect(adhan.Astronomical.julianDay(2011, 2, 4)).to.equal(2455596.500000);
		expect(adhan.Astronomical.julianDay(2012, 3, 6)).to.equal(2455992.500000);
		expect(adhan.Astronomical.julianDay(2013, 4, 8)).to.equal(2456390.500000);
		expect(adhan.Astronomical.julianDay(2014, 5, 10)).to.equal(2456787.500000);
		expect(adhan.Astronomical.julianDay(2015, 6, 12)).to.equal(2457185.500000);
		expect(adhan.Astronomical.julianDay(2016, 7, 14)).to.equal(2457583.500000);
		expect(adhan.Astronomical.julianDay(2017, 8, 16)).to.equal(2457981.500000);
		expect(adhan.Astronomical.julianDay(2018, 9, 18)).to.equal(2458379.500000);
		expect(adhan.Astronomical.julianDay(2019, 10, 20)).to.equal(2458776.500000);
		expect(adhan.Astronomical.julianDay(2020, 11, 22)).to.equal(2459175.500000);
		expect(adhan.Astronomical.julianDay(2021, 12, 24)).to.equal(2459572.500000);

		var jdVal = 2457215.67708333;
		expect(adhan.Astronomical.julianDay(2015, 7, 12, 4.25)).to.be.closeTo(jdVal, 0.000001);

	    var date = new Date(2015, 6, 12, 4, 15);
	    expect(julianDate(date), jdVal, 0.000001);

		expect(adhan.Astronomical.julianDay(2015, 7, 12, 8.0)).to.be.closeTo(2457215.833333, 0.000001);
		expect(adhan.Astronomical.julianDay(1992, 10, 13, 0.0)).to.be.closeTo(2448908.5, 0.000001);

		var j1 = adhan.Astronomical.julianDay(2010, 1, 3);
		var j2 = adhan.Astronomical.julianDay(2010, 1, 1, 48);
		expect(j1).to.equal(j2);
	});

	it("determines if a year is a leap year", function() {
		expect(adhan.Astronomical.isLeapYear(2015)).to.be.false;
		expect(adhan.Astronomical.isLeapYear(2016)).to.be.true;
		expect(adhan.Astronomical.isLeapYear(1600)).to.be.true;
		expect(adhan.Astronomical.isLeapYear(2000)).to.be.true;
		expect(adhan.Astronomical.isLeapYear(2400)).to.be.true;
		expect(adhan.Astronomical.isLeapYear(1700)).to.be.false;
		expect(adhan.Astronomical.isLeapYear(1800)).to.be.false;
		expect(adhan.Astronomical.isLeapYear(1900)).to.be.false;
		expect(adhan.Astronomical.isLeapYear(2100)).to.be.false;
		expect(adhan.Astronomical.isLeapYear(2200)).to.be.false;
		expect(adhan.Astronomical.isLeapYear(2300)).to.be.false;
		expect(adhan.Astronomical.isLeapYear(2500)).to.be.false;
		expect(adhan.Astronomical.isLeapYear(2600)).to.be.false;
	});

	it("gets the day of the year for a date", function() {
		expect(dayOfYear(new Date(2015, 0, 1))).to.equal(1);
		expect(dayOfYear(new Date(2015, 11, 31))).to.equal(365);
		expect(dayOfYear(new Date(2016, 11, 31))).to.equal(366);
		expect(dayOfYear(new Date(2015, 1, 1))).to.equal(32);
	});

	it("calculates the days since the winter or summer solstice", function() {
		expect(adhan.Astronomical.daysSinceSolstice(dayOfYear(new Date(2016, 0, 1)), 2016, 1)).to.equal(11);
		expect(adhan.Astronomical.daysSinceSolstice(dayOfYear(new Date(2015, 11, 31)), 2015, 1)).to.equal(10);
		expect(adhan.Astronomical.daysSinceSolstice(dayOfYear(new Date(2016, 11, 31)), 2016, 1)).to.equal(10);
		expect(adhan.Astronomical.daysSinceSolstice(dayOfYear(new Date(2016, 11, 21)), 2016, 1)).to.equal(0);
		expect(adhan.Astronomical.daysSinceSolstice(dayOfYear(new Date(2016, 11, 22)), 2016, 1)).to.equal(1);
		expect(adhan.Astronomical.daysSinceSolstice(dayOfYear(new Date(2016, 2, 1)), 2016, 1)).to.equal(71);
		expect(adhan.Astronomical.daysSinceSolstice(dayOfYear(new Date(2015, 2, 1)), 2015, 1)).to.equal(70);
		expect(adhan.Astronomical.daysSinceSolstice(dayOfYear(new Date(2016, 11, 20)), 2016, 1)).to.equal(365);
		expect(adhan.Astronomical.daysSinceSolstice(dayOfYear(new Date(2015, 11, 20)), 2015, 1)).to.equal(364);

		expect(adhan.Astronomical.daysSinceSolstice(dayOfYear(new Date(2015, 5, 21)), 2015, -1)).to.equal(0);
		expect(adhan.Astronomical.daysSinceSolstice(dayOfYear(new Date(2016, 5, 21)), 2016, -1)).to.equal(0);
		expect(adhan.Astronomical.daysSinceSolstice(dayOfYear(new Date(2015, 5, 20)), 2015, -1)).to.equal(364);
		expect(adhan.Astronomical.daysSinceSolstice(dayOfYear(new Date(2016, 5, 20)), 2016, -1)).to.equal(365);
	});
});
