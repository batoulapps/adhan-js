
//
// Astronomical Tests
//

QUnit.test("Solar Coordinates", function(assert) {
	// values from Astronomical Algorithms page 165

	var jd = Solar.julianDay(1992, 10, 13);
	
	var T = Solar.julianCentury(jd);
	var L0 = Solar.meanSolarLongitude(T);

	QUnit.close(T, -0.072183436, 0.00000000001);
	QUnit.close(L0, 201.80720, 0.00001);
});

QUnit.test("Interpolation", function(assert) {
	var interpolatedValue = Solar.interpolate(0.877366, 0.884226, 0.870531, 4.35/24)
	QUnit.close(interpolatedValue, 0.876125, 0.000001);
});

QUnit.test("Julian Day", function(assert) {
	/*
	Comparison values generated from http://aa.usno.navy.mil/data/docs/JulianDate.php
	*/
	assert.equal(Solar.julianDay(2010, 1, 2), 2455198.500000);
	assert.equal(Solar.julianDay(2011, 2, 4), 2455596.500000);
	assert.equal(Solar.julianDay(2012, 3, 6), 2455992.500000);
	assert.equal(Solar.julianDay(2013, 4, 8), 2456390.500000);
	assert.equal(Solar.julianDay(2014, 5, 10), 2456787.500000);
	assert.equal(Solar.julianDay(2015, 6, 12), 2457185.500000);
	assert.equal(Solar.julianDay(2016, 7, 14), 2457583.500000);
	assert.equal(Solar.julianDay(2017, 8, 16), 2457981.500000);
	assert.equal(Solar.julianDay(2018, 9, 18), 2458379.500000);
	assert.equal(Solar.julianDay(2019, 10, 20), 2458776.500000);
	assert.equal(Solar.julianDay(2020, 11, 22), 2459175.500000);
	assert.equal(Solar.julianDay(2021, 12, 24), 2459572.500000);

	QUnit.close(Solar.julianDay(2015, 7, 12, 4.25), 2457215.67708333, 0.000001);
	QUnit.close(Solar.julianDay(2015, 7, 12, 8.0), 2457215.833333, 0.000001);
	QUnit.close(Solar.julianDay(1992, 10, 13, 0.0), 2448908.5, 0.000001);
});

QUnit.test("Julian Hours", function(assert) {
	var j1 = Solar.julianDay(2010, 1, 3);
	var j2 = Solar.julianDay(2010, 1, 1, 48);
	assert.equal(j1, j2);
});

QUnit.test("Leap Year", function(assert) {
	assert.notOk(Solar.isLeapYear(2015));
	assert.ok(Solar.isLeapYear(2016));
	assert.ok(Solar.isLeapYear(1600));
	assert.ok(Solar.isLeapYear(2000));
	assert.ok(Solar.isLeapYear(2400));
	assert.notOk(Solar.isLeapYear(1700));
	assert.notOk(Solar.isLeapYear(1800));
	assert.notOk(Solar.isLeapYear(1900));
	assert.notOk(Solar.isLeapYear(2100));
	assert.notOk(Solar.isLeapYear(2200));
	assert.notOk(Solar.isLeapYear(2300));
	assert.notOk(Solar.isLeapYear(2500));
	assert.notOk(Solar.isLeapYear(2600));
});
