//
// Astronomical Tests
//

QUnit.test("Interpolation", function(assert) {
	var interpolatedValue = interpolate(0.877366, 0.884226, 0.870531, 4.35/24)
	QUnit.close(interpolatedValue, 0.876125, 0.000001);
});

QUnit.test("Julian Day", function(assert) {
	/*
	Comparison values generated from http://aa.usno.navy.mil/data/docs/JulianDate.php
	*/
	assert.equal(julianDay(2010, 1, 2), 2455198.500000);
	assert.equal(julianDay(2011, 2, 4), 2455596.500000);
	assert.equal(julianDay(2012, 3, 6), 2455992.500000);
	assert.equal(julianDay(2013, 4, 8), 2456390.500000);
	assert.equal(julianDay(2014, 5, 10), 2456787.500000);
	assert.equal(julianDay(2015, 6, 12), 2457185.500000);
	assert.equal(julianDay(2016, 7, 14), 2457583.500000);
	assert.equal(julianDay(2017, 8, 16), 2457981.500000);
	assert.equal(julianDay(2018, 9, 18), 2458379.500000);
	assert.equal(julianDay(2019, 10, 20), 2458776.500000);
	assert.equal(julianDay(2020, 11, 22), 2459175.500000);
	assert.equal(julianDay(2021, 12, 24), 2459572.500000);

	QUnit.close(julianDay(2015, 7, 12, 4.25), 2457215.67708333, 0.000001);
	QUnit.close(julianDay(2015, 7, 12, 8.0), 2457215.833333, 0.000001);
	QUnit.close(julianDay(1992, 10, 13, 0.0), 2448908.5, 0.000001);
});

QUnit.test("Julian Hours", function(assert) {
	var j1 = julianDay(2010, 1, 3);
	var j2 = julianDay(2010, 1, 1, 48);
	assert.equal(j1, j2);
});

QUnit.test("Leap Year", function(assert) {
	assert.notOk(isLeapYear(2015));
	assert.ok(isLeapYear(2016));
	assert.ok(isLeapYear(1600));
	assert.ok(isLeapYear(2000));
	assert.ok(isLeapYear(2400));
	assert.notOk(isLeapYear(1700));
	assert.notOk(isLeapYear(1800));
	assert.notOk(isLeapYear(1900));
	assert.notOk(isLeapYear(2100));
	assert.notOk(isLeapYear(2200));
	assert.notOk(isLeapYear(2300));
	assert.notOk(isLeapYear(2500));
	assert.notOk(isLeapYear(2600));
});

//
// Math tests
//

QUnit.test("Angle Conversion", function(assert) {
	assert.equal(Math.PI.radiansToDegrees(), 180);
	assert.equal((180).degreesToRadians(), Math.PI);
	assert.equal((Math.PI/2).radiansToDegrees(), 90);
	assert.equal((90).degreesToRadians(), Math.PI/2);
});

QUnit.test("Normalizing", function(assert) {
	assert.equal((2.0).normalizeWithBound(-5), -3);
	assert.equal((-4).normalizeWithBound(-5), -4);
	assert.equal((-6).normalizeWithBound(-5), -1);

	assert.equal((-1).normalizeWithBound(24), 23);
	assert.equal((1).normalizeWithBound(24), 1);
	assert.equal((49.0).normalizeWithBound(24), 1);

	assert.equal((361).normalizeWithBound(360), 1);
	assert.equal((360).normalizeWithBound(360), 0);
	assert.equal((259).normalizeWithBound(360), 259);
	assert.equal((2592.0).normalizeWithBound(360), 72);

	assert.equal((-45).unwindAngle(), 315)
	assert.equal((361.0).unwindAngle(), 1)
	assert.equal((360).unwindAngle(), 0)
	assert.equal((259.0).unwindAngle(), 259)
	assert.equal((2592).unwindAngle(), 72)
});
