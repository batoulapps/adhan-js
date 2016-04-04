
//
// Astronomical Tests
//

function timeString(hours) {
	var comps = hours.timeComponents();
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

QUnit.test("Solar Coordinates", function(assert) {
	// values from Astronomical Algorithms page 165

	var jd = Astronomical.julianDay(1992, 10, 13);
	var solar = new SolarCoordinates(jd);

	var T = Astronomical.julianCentury(jd);
	var L0 = Astronomical.meanSolarLongitude(T);
	var E0 = Astronomical.meanObliquityOfTheEcliptic(T);
	var Eapp = Astronomical.apparentObliquityOfTheEcliptic(T, E0);
	var M = Astronomical.meanSolarAnomaly(T);
    var C = Astronomical.solarEquationOfTheCenter(T, M);
    var Lambda = Astronomical.apparentSolarLongitude(T, L0);
    var Delta = solar.declination;
    var Alpha = solar.rightAscension.unwindAngle();

	QUnit.close(T, -0.072183436, 0.00000000001);
	QUnit.close(L0, 201.80720, 0.00001);
	QUnit.close(E0, 23.44023, 0.00001);
	QUnit.close(Eapp, 23.43999, 0.00001);
	QUnit.close(M, 278.99397, 0.00001);
	QUnit.close(C, -1.89732, 0.00001);
	QUnit.close(Lambda, 199.90895, 0.00002);
    QUnit.close(Delta, -7.78507, 0.00001);
    QUnit.close(Alpha, 198.38083, 0.00001);

    // values from Astronomical Algorithms page 88
    
    jd = Astronomical.julianDay(1987, 4, 10);
    solar = new SolarCoordinates(jd);
    T = Astronomical.julianCentury(jd);

    var Theta0 = Astronomical.meanSiderealTime(T);
    var Thetaapp = solar.apparentSiderealTime;
    var Omega = Astronomical.ascendingLunarNodeLongitude(T);
    E0 = Astronomical.meanObliquityOfTheEcliptic(T);
    L0 = Astronomical.meanSolarLongitude(T);
    var Lp = Astronomical.meanLunarLongitude(T);
    var dPsi = Astronomical.nutationInLongitude(T, L0, Lp, Omega);
    var dE = Astronomical.nutationInObliquity(T, L0, Lp, Omega);
    var E = E0 + dE;

	QUnit.close(Theta0, 197.693195, 0.000001);        
    QUnit.close(Thetaapp, 197.6922295833, 0.0001);
    
    // values from Astronomical Algorithms page 148
    
    QUnit.close(Omega, 11.2531, 0.0001);
    QUnit.close(dPsi, -0.0010522,  0.0001);
    QUnit.close(dE, 0.0026230556, 0.00001);
    QUnit.close(E0, 23.4409463889, 0.000001);
    QUnit.close(E, 23.4435694444, 0.00001);
});

QUnit.test("Altitude Of Celestial Body", function(assert) {
	var Phi = 38 + (55 / 60) + (17.0 / 3600);
    var Delta = -6 - (43 / 60) - (11.61 / 3600);
    var H = 64.352133;
    var altitude = Astronomical.altitudeOfCelestialBody(Phi, Delta, H);
	QUnit.close(altitude, 15.1249, 0.0001);
});

QUnit.test("Transit and Hour Angle", function(assert) {
	// values from Astronomical Algorithms page 103
	var longitude = -71.0833;
	var Theta = 177.74208;
	var Alpha1 = 40.68021;
	var Alpha2 = 41.73129;
	var Alpha3 = 42.78204;
	var m0 = Astronomical.approximateTransit(longitude, Theta, Alpha2);

	QUnit.close(m0, 0.81965, 0.00001);

    var transit = Astronomical.correctedTransit(m0, longitude, Theta, Alpha2, Alpha1, Alpha3) / 24;
        
    QUnit.close(transit, 0.81980, 0.00001);

    var Delta1 = 18.04761;
    var Delta2 = 18.44092;
    var Delta3 = 18.82742;
    var coordinates = new Coordinates(42.3333, longitude);
    
    var rise = Astronomical.correctedHourAngle(m0, -0.5667, coordinates, false, Theta, Alpha2, Alpha1, Alpha3, Delta2, Delta1, Delta3) / 24;
    QUnit.close(rise, 0.51766, 0.00001);

});

QUnit.test("Solar Time", function(assert) {
    /*
    Comparison values generated from http://aa.usno.navy.mil/rstt/onedaytable?form=1&ID=AA&year=2015&month=7&day=12&state=NC&place=raleigh
    */
    var coordinates = new Coordinates(35 + 47/60, -78 - 39/60);
    var solar = new SolarTime(new Date(2015, 6, 12), coordinates);
    
    var transit = solar.transit;
    var sunrise = solar.sunrise;
    var sunset = solar.sunset;
    var twilightStart = solar.hourAngle(-6, false);
    var twilightEnd = solar.hourAngle(-6, true);
    var invalid = solar.hourAngle(-36, true);
    assert.equal(timeString(twilightStart), "9:38");
    assert.equal(timeString(sunrise), "10:08");
    assert.equal(timeString(transit), "17:20");
    assert.equal(timeString(sunset), "24:32");
    assert.equal(timeString(twilightEnd), "25:02");
    assert.equal(timeString(invalid), "");
});

QUnit.test("Right Ascension Edge Case", function(assert) {
    var coordinates = new Coordinates(35 + 47/60, -78 - 39/60);
    var solar = [];
    for (var i = 0; i <= 365; i++) {
        solar.push(new SolarTime(new Date(2016, 0, i), coordinates));
    }

    for (var i = 1; i < solar.length; i++) {
        var time = solar[i];
        var previousTime = solar[i-1];
        assert.ok(Math.abs(time.transit - previousTime.transit) < 1/60);
        assert.ok(Math.abs(time.sunrise - previousTime.sunrise) < 2/60);
        assert.ok(Math.abs(time.sunset - previousTime.sunset) < 2/60);
    }
});

QUnit.test("Calendrical Date", function(assert) {
	// generated from http://aa.usno.navy.mil/data/docs/RS_OneYear.php for KUKUIHAELE, HAWAII
    var coordinates = new Coordinates(20 + 7/60, -155 - 34/60);
    var day1solar = new SolarTime(new Date(2015, 3, 2), coordinates);
    var day2solar = new SolarTime(new Date(2015, 3, 3), coordinates);
    
    var day1 = day1solar.sunrise;
    var day2 = day2solar.sunrise;
    
    assert.equal(timeString(day1), "16:15")
    assert.equal(timeString(day2), "16:14")
});

QUnit.test("Interpolation", function(assert) {
	var interpolatedValue = Astronomical.interpolate(0.877366, 0.884226, 0.870531, 4.35/24)
	QUnit.close(interpolatedValue, 0.876125, 0.000001);

    var i1 = Astronomical.interpolate(1, -1, 3, 0.6);
    QUnit.close(i1, 2.2, 0.000001);
});

QUnit.test("Angle Interpolation", function(assert) {
    var i1 = Astronomical.interpolateAngles(1, -1, 3, 0.6);
    QUnit.close(i1, 2.2, 0.000001);
    
    var i2 = Astronomical.interpolateAngles(1, 359, 3, 0.6);
    QUnit.close(i2, 2.2, 0.000001);
});

QUnit.test("Julian Day", function(assert) {
	/*
	Comparison values generated from http://aa.usno.navy.mil/data/docs/JulianDate.php
	*/
	assert.equal(Astronomical.julianDay(2010, 1, 2), 2455198.500000);
	assert.equal(Astronomical.julianDay(2011, 2, 4), 2455596.500000);
	assert.equal(Astronomical.julianDay(2012, 3, 6), 2455992.500000);
	assert.equal(Astronomical.julianDay(2013, 4, 8), 2456390.500000);
	assert.equal(Astronomical.julianDay(2014, 5, 10), 2456787.500000);
	assert.equal(Astronomical.julianDay(2015, 6, 12), 2457185.500000);
	assert.equal(Astronomical.julianDay(2016, 7, 14), 2457583.500000);
	assert.equal(Astronomical.julianDay(2017, 8, 16), 2457981.500000);
	assert.equal(Astronomical.julianDay(2018, 9, 18), 2458379.500000);
	assert.equal(Astronomical.julianDay(2019, 10, 20), 2458776.500000);
	assert.equal(Astronomical.julianDay(2020, 11, 22), 2459175.500000);
	assert.equal(Astronomical.julianDay(2021, 12, 24), 2459572.500000);

	var jdVal = 2457215.67708333;
	QUnit.close(Astronomical.julianDay(2015, 7, 12, 4.25), jdVal, 0.000001);
	        
    var date = new Date(2015, 6, 12, 4, 15);
    QUnit.close(date.julianDate(), jdVal, 0.000001);

	QUnit.close(Astronomical.julianDay(2015, 7, 12, 8.0), 2457215.833333, 0.000001);
	QUnit.close(Astronomical.julianDay(1992, 10, 13, 0.0), 2448908.5, 0.000001);
});

QUnit.test("Julian Hours", function(assert) {
	var j1 = Astronomical.julianDay(2010, 1, 3);
	var j2 = Astronomical.julianDay(2010, 1, 1, 48);
	assert.equal(j1, j2);
});

QUnit.test("Leap Year", function(assert) {
	assert.notOk(Astronomical.isLeapYear(2015));
	assert.ok(Astronomical.isLeapYear(2016));
	assert.ok(Astronomical.isLeapYear(1600));
	assert.ok(Astronomical.isLeapYear(2000));
	assert.ok(Astronomical.isLeapYear(2400));
	assert.notOk(Astronomical.isLeapYear(1700));
	assert.notOk(Astronomical.isLeapYear(1800));
	assert.notOk(Astronomical.isLeapYear(1900));
	assert.notOk(Astronomical.isLeapYear(2100));
	assert.notOk(Astronomical.isLeapYear(2200));
	assert.notOk(Astronomical.isLeapYear(2300));
	assert.notOk(Astronomical.isLeapYear(2500));
	assert.notOk(Astronomical.isLeapYear(2600));
});

QUnit.test("Day of Year", function(assert) {
	assert.equal(1, new Date(2015, 0, 1).dayOfYear());
	assert.equal(365, new Date(2015, 11, 31).dayOfYear());
	assert.equal(366, new Date(2016, 11, 31).dayOfYear());
	assert.equal(32, new Date(2015, 1, 1).dayOfYear());
});

QUnit.test("Days since solstice", function(assert) {
	assert.equal(11, Astronomical.daysSinceSolstice(new Date(2016, 0, 1).dayOfYear(), 2016, 1));
	assert.equal(10, Astronomical.daysSinceSolstice(new Date(2015, 11, 31).dayOfYear(), 2015, 1));
	assert.equal(10, Astronomical.daysSinceSolstice(new Date(2016, 11, 31).dayOfYear(), 2016, 1));
	assert.equal(0, Astronomical.daysSinceSolstice(new Date(2016, 11, 21).dayOfYear(), 2016, 1));
	assert.equal(1, Astronomical.daysSinceSolstice(new Date(2016, 11, 22).dayOfYear(), 2016, 1));
	assert.equal(71, Astronomical.daysSinceSolstice(new Date(2016, 2, 1).dayOfYear(), 2016, 1));
	assert.equal(70, Astronomical.daysSinceSolstice(new Date(2015, 2, 1).dayOfYear(), 2015, 1));
	assert.equal(365, Astronomical.daysSinceSolstice(new Date(2016, 11, 20).dayOfYear(), 2016, 1));
	assert.equal(364, Astronomical.daysSinceSolstice(new Date(2015, 11, 20).dayOfYear(), 2015, 1));

	assert.equal(0, Astronomical.daysSinceSolstice(new Date(2015, 5, 21).dayOfYear(), 2015, -1));
	assert.equal(0, Astronomical.daysSinceSolstice(new Date(2016, 5, 21).dayOfYear(), 2016, -1));
	assert.equal(364, Astronomical.daysSinceSolstice(new Date(2015, 5, 20).dayOfYear(), 2015, -1));
	assert.equal(365, Astronomical.daysSinceSolstice(new Date(2016, 5, 20).dayOfYear(), 2016, -1));
});