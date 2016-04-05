QUnit.test("Night Portion", function(assert) {
    var p1 = new CalculationParameters(18, 18);
    p1.highLatitudeRule = HighLatitudeRule.MiddleOfTheNight;
    assert.equal(p1.nightPortions().fajr, 0.5);
    assert.equal(p1.nightPortions().isha, 0.5);

    var p2 = new CalculationParameters(18, 18);
    p2.highLatitudeRule = HighLatitudeRule.SeventhOfTheNight;
    assert.equal(p2.nightPortions().fajr, 1/7);
    assert.equal(p2.nightPortions().isha, 1/7);

    var p3 = new CalculationParameters(10, 15);
    p3.highLatitudeRule = HighLatitudeRule.TwilightAngle;
    assert.equal(p3.nightPortions().fajr, 10/60);
    assert.equal(p3.nightPortions().isha, 15/60);
});

QUnit.test("Calculation Method", function(assert) {
    var p1 = CalculationMethod.MuslimWorldLeague();
    assert.equal(p1.fajrAngle, 18);
    assert.equal(p1.ishaAngle, 17);
    assert.equal(p1.ishaInterval, 0);
    assert.equal(p1.method, "MuslimWorldLeague");

    var p2 = CalculationMethod.Egyptian();
    assert.equal(p2.fajrAngle, 19.5);
    assert.equal(p2.ishaAngle, 17.5);
    assert.equal(p2.ishaInterval, 0);
    assert.equal(p2.method, "Egyptian");

    var p3 = CalculationMethod.Karachi();
    assert.equal(p3.fajrAngle, 18);
    assert.equal(p3.ishaAngle, 18);
    assert.equal(p3.ishaInterval, 0);
    assert.equal(p3.method, "Karachi");

    var p4 = CalculationMethod.UmmAlQura();
    assert.equal(p4.fajrAngle, 18.5);
    assert.equal(p4.ishaAngle, 0);
    assert.equal(p4.ishaInterval, 90);
    assert.equal(p4.method, "UmmAlQura");

    var p5 = CalculationMethod.Gulf();
    assert.equal(p5.fajrAngle, 19.5);
    assert.equal(p5.ishaAngle, 0);
    assert.equal(p5.ishaInterval, 90);
    assert.equal(p5.method, "Gulf");

    var p6 = CalculationMethod.MoonsightingCommittee();
    assert.equal(p6.fajrAngle, 18);
    assert.equal(p6.ishaAngle, 18);
    assert.equal(p6.ishaInterval, 0);
    assert.equal(p6.method, "MoonsightingCommittee");

    var p7 = CalculationMethod.NorthAmerica();
    assert.equal(p7.fajrAngle, 15);
    assert.equal(p7.ishaAngle, 15);
    assert.equal(p7.ishaInterval, 0);
    assert.equal(p7.method, "NorthAmerica");

    var p8 = CalculationMethod.Other();
    assert.equal(p8.fajrAngle, 0);
    assert.equal(p8.ishaAngle, 0);
    assert.equal(p8.ishaInterval, 0);
    assert.equal(p8.method, "Other");
});

QUnit.test("Prayer Times", function(assert) {
	var date = new Date(2015, 6, 12);
	var params = CalculationMethod.NorthAmerica();
	params.madhab = Madhab.Hanafi;
	var p = new PrayerTimes(new Coordinates(35.7750, -78.6336), date, params);

	assert.equal(p.fajr.formattedTime(-4), "4:42 AM");
    assert.equal(p.sunrise.formattedTime(-4), "6:08 AM");
    assert.equal(p.dhuhr.formattedTime(-4), "1:21 PM");
    assert.equal(p.asr.formattedTime(-4), "6:22 PM");
    assert.equal(p.maghrib.formattedTime(-4), "8:32 PM");
    assert.equal(p.isha.formattedTime(-4), "9:57 PM");
    assert.equal(p.isha.formattedTime(-4, '24h'), "21:57");
    assert.equal(moment(p.isha).tz("America/New_York").format("h:mm A"), "9:57 PM");
});

QUnit.test("Offset", function(assert) {
    var date = new Date(2015, 11, 1);
    var params = CalculationMethod.MuslimWorldLeague();
    params.madhab = Madhab.Shafi;
    var p = new PrayerTimes(new Coordinates(35.7750, -78.6336), date, params);
    assert.equal(p.fajr.formattedTime(-5), "5:35 AM");
    assert.equal(p.sunrise.formattedTime(-5), "7:06 AM");
    assert.equal(p.dhuhr.formattedTime(-5), "12:05 PM");
    assert.equal(p.asr.formattedTime(-5), "2:42 PM");
    assert.equal(p.maghrib.formattedTime(-5), "5:01 PM");
    assert.equal(p.isha.formattedTime(-5), "6:26 PM");

    params.adjustments.fajr = 10;
    params.adjustments.sunrise = 10;
    params.adjustments.dhuhr = 10;
    params.adjustments.asr = 10;
    params.adjustments.maghrib = 10;
    params.adjustments.isha = 10;

    var p2 = new PrayerTimes(new Coordinates(35.7750, -78.6336), date, params);
    assert.equal(p2.fajr.formattedTime(-5), "5:45 AM");
    assert.equal(p2.sunrise.formattedTime(-5), "7:16 AM");
    assert.equal(p2.dhuhr.formattedTime(-5), "12:15 PM");
    assert.equal(p2.asr.formattedTime(-5), "2:52 PM");
    assert.equal(p2.maghrib.formattedTime(-5), "5:11 PM");
    assert.equal(p2.isha.formattedTime(-5), "6:36 PM");
});

QUnit.test("Moonsighting Committee", function(assert) {
    // Values from http://www.moonsighting.com/pray.php
    var date = new Date(2016, 0, 31);
    var p = new PrayerTimes(new Coordinates(35.7750, -78.6336), date, CalculationMethod.MoonsightingCommittee());
    assert.equal(p.fajr.formattedTime(-5), "5:48 AM");
    assert.equal(p.sunrise.formattedTime(-5), "7:16 AM");
    assert.equal(p.dhuhr.formattedTime(-5), "12:33 PM");
    assert.equal(p.asr.formattedTime(-5), "3:20 PM");
    assert.equal(p.maghrib.formattedTime(-5), "5:43 PM");
    assert.equal(p.isha.formattedTime(-5), "7:05 PM");
});

QUnit.test("Moonsighting Committee High Latitude", function(assert) {
    // Values from http://www.moonsighting.com/pray.php
    var date = new Date(2016, 0, 1);
    var params = CalculationMethod.MoonsightingCommittee();
    params.madhab = Madhab.Hanafi;
    var p = new PrayerTimes(new Coordinates(59.9094, 10.7349), date, params);
    assert.equal(moment(p.fajr).tz("Europe/Oslo").format("h:mm A"), "7:34 AM");
    assert.equal(moment(p.sunrise).tz("Europe/Oslo").format("h:mm A"), "9:19 AM");
    assert.equal(moment(p.dhuhr).tz("Europe/Oslo").format("h:mm A"), "12:25 PM");
    assert.equal(moment(p.asr).tz("Europe/Oslo").format("h:mm A"), "1:36 PM");
    assert.equal(moment(p.maghrib).tz("Europe/Oslo").format("h:mm A"), "3:25 PM");
    assert.equal(moment(p.isha).tz("Europe/Oslo").format("h:mm A"), "5:02 PM");
});