var formattedTime = adhan.Date.formattedTime;
var dateByAddingSeconds = adhan.Date.dateByAddingSeconds;

QUnit.test("Night Portion", function(assert) {
    var p1 = new adhan.CalculationParameters(18, 18);
    p1.highLatitudeRule = adhan.HighLatitudeRule.MiddleOfTheNight;
    assert.equal(p1.nightPortions().fajr, 0.5);
    assert.equal(p1.nightPortions().isha, 0.5);

    var p2 = new adhan.CalculationParameters(18, 18);
    p2.highLatitudeRule = adhan.HighLatitudeRule.SeventhOfTheNight;
    assert.equal(p2.nightPortions().fajr, 1/7);
    assert.equal(p2.nightPortions().isha, 1/7);

    var p3 = new adhan.CalculationParameters(10, 15);
    p3.highLatitudeRule = adhan.HighLatitudeRule.TwilightAngle;
    assert.equal(p3.nightPortions().fajr, 10/60);
    assert.equal(p3.nightPortions().isha, 15/60);
});

QUnit.test("Calculation Method", function(assert) {
    var p1 = adhan.CalculationMethod.MuslimWorldLeague();
    assert.equal(p1.fajrAngle, 18);
    assert.equal(p1.ishaAngle, 17);
    assert.equal(p1.ishaInterval, 0);
    assert.equal(p1.method, "MuslimWorldLeague");

    var p2 = adhan.CalculationMethod.Egyptian();
    assert.equal(p2.fajrAngle, 19.5);
    assert.equal(p2.ishaAngle, 17.5);
    assert.equal(p2.ishaInterval, 0);
    assert.equal(p2.method, "Egyptian");

    var p3 = adhan.CalculationMethod.Karachi();
    assert.equal(p3.fajrAngle, 18);
    assert.equal(p3.ishaAngle, 18);
    assert.equal(p3.ishaInterval, 0);
    assert.equal(p3.method, "Karachi");

    var p4 = adhan.CalculationMethod.UmmAlQura();
    assert.equal(p4.fajrAngle, 18.5);
    assert.equal(p4.ishaAngle, 0);
    assert.equal(p4.ishaInterval, 90);
    assert.equal(p4.method, "UmmAlQura");

    var p5 = adhan.CalculationMethod.Gulf();
    assert.equal(p5.fajrAngle, 19.5);
    assert.equal(p5.ishaAngle, 0);
    assert.equal(p5.ishaInterval, 90);
    assert.equal(p5.method, "Gulf");

    var p6 = adhan.CalculationMethod.MoonsightingCommittee();
    assert.equal(p6.fajrAngle, 18);
    assert.equal(p6.ishaAngle, 18);
    assert.equal(p6.ishaInterval, 0);
    assert.equal(p6.method, "MoonsightingCommittee");

    var p7 = adhan.CalculationMethod.NorthAmerica();
    assert.equal(p7.fajrAngle, 15);
    assert.equal(p7.ishaAngle, 15);
    assert.equal(p7.ishaInterval, 0);
    assert.equal(p7.method, "NorthAmerica");

    var p8 = adhan.CalculationMethod.Other();
    assert.equal(p8.fajrAngle, 0);
    assert.equal(p8.ishaAngle, 0);
    assert.equal(p8.ishaInterval, 0);
    assert.equal(p8.method, "Other");

    var p9 = adhan.CalculationMethod.Kuwait();
    assert.equal(p9.fajrAngle, 18);
    assert.equal(p9.ishaAngle, 17.5);
    assert.equal(p9.ishaInterval, 0);
    assert.equal(p9.method, "Kuwait");

    var p10 = adhan.CalculationMethod.Qatar();
    assert.equal(p10.fajrAngle, 18);
    assert.equal(p10.ishaAngle, 0);
    assert.equal(p10.ishaInterval, 90);
    assert.equal(p10.method, "Qatar");
});

QUnit.test("Prayer Times", function(assert) {
	var date = new Date(2015, 6, 12);
	var params = adhan.CalculationMethod.NorthAmerica();
	params.madhab = adhan.Madhab.Hanafi;
	var p = new adhan.PrayerTimes(new adhan.Coordinates(35.7750, -78.6336), date, params);

	assert.equal(formattedTime(p.fajr, -4), "4:42 AM");
    assert.equal(formattedTime(p.sunrise, -4), "6:08 AM");
    assert.equal(formattedTime(p.dhuhr, -4), "1:21 PM");
    assert.equal(formattedTime(p.asr, -4), "6:22 PM");
    assert.equal(formattedTime(p.maghrib, -4), "8:32 PM");
    assert.equal(formattedTime(p.isha, -4), "9:57 PM");
    assert.equal(formattedTime(p.isha, -4, '24h'), "21:57");
    assert.equal(moment(p.isha).tz("America/New_York").format("h:mm A"), "9:57 PM");
});

QUnit.test("Offset", function(assert) {
    var date = new Date(2015, 11, 1);
    var params = adhan.CalculationMethod.MuslimWorldLeague();
    params.madhab = adhan.Madhab.Shafi;
    var p = new adhan.PrayerTimes(new adhan.Coordinates(35.7750, -78.6336), date, params);
    assert.equal(formattedTime(p.fajr, -5), "5:35 AM");
    assert.equal(formattedTime(p.sunrise, -5), "7:06 AM");
    assert.equal(formattedTime(p.dhuhr, -5), "12:05 PM");
    assert.equal(formattedTime(p.asr, -5), "2:42 PM");
    assert.equal(formattedTime(p.maghrib, -5), "5:01 PM");
    assert.equal(formattedTime(p.isha, -5), "6:26 PM");

    params.adjustments.fajr = 10;
    params.adjustments.sunrise = 10;
    params.adjustments.dhuhr = 10;
    params.adjustments.asr = 10;
    params.adjustments.maghrib = 10;
    params.adjustments.isha = 10;

    var p2 = new adhan.PrayerTimes(new adhan.Coordinates(35.7750, -78.6336), date, params);
    assert.equal(formattedTime(p2.fajr, -5), "5:45 AM");
    assert.equal(formattedTime(p2.sunrise, -5), "7:16 AM");
    assert.equal(formattedTime(p2.dhuhr, -5), "12:15 PM");
    assert.equal(formattedTime(p2.asr, -5), "2:52 PM");
    assert.equal(formattedTime(p2.maghrib, -5), "5:11 PM");
    assert.equal(formattedTime(p2.isha, -5), "6:36 PM");
});

QUnit.test("Moonsighting Committee", function(assert) {
    // Values from http://www.moonsighting.com/pray.php
    var date = new Date(2016, 0, 31);
    var p = new adhan.PrayerTimes(new adhan.Coordinates(35.7750, -78.6336), date, adhan.CalculationMethod.MoonsightingCommittee());
    assert.equal(formattedTime(p.fajr, -5), "5:48 AM");
    assert.equal(formattedTime(p.sunrise, -5), "7:16 AM");
    assert.equal(formattedTime(p.dhuhr, -5), "12:33 PM");
    assert.equal(formattedTime(p.asr, -5), "3:20 PM");
    assert.equal(formattedTime(p.maghrib, -5), "5:43 PM");
    assert.equal(formattedTime(p.isha, -5), "7:05 PM");
});

QUnit.test("Moonsighting Committee High Latitude", function(assert) {
    // Values from http://www.moonsighting.com/pray.php
    var date = new Date(2016, 0, 1);
    var params = adhan.CalculationMethod.MoonsightingCommittee();
    params.madhab = adhan.Madhab.Hanafi;
    var p = new adhan.PrayerTimes(new adhan.Coordinates(59.9094, 10.7349), date, params);
    assert.equal(moment(p.fajr).tz("Europe/Oslo").format("h:mm A"), "7:34 AM");
    assert.equal(moment(p.sunrise).tz("Europe/Oslo").format("h:mm A"), "9:19 AM");
    assert.equal(moment(p.dhuhr).tz("Europe/Oslo").format("h:mm A"), "12:25 PM");
    assert.equal(moment(p.asr).tz("Europe/Oslo").format("h:mm A"), "1:36 PM");
    assert.equal(moment(p.maghrib).tz("Europe/Oslo").format("h:mm A"), "3:25 PM");
    assert.equal(moment(p.isha).tz("Europe/Oslo").format("h:mm A"), "5:02 PM");
});

QUnit.test("Time For Prayer", function(assert) {
    var date = new Date(2016, 6, 1);
    var params = adhan.CalculationMethod.MuslimWorldLeague();
    params.madhab = adhan.Madhab.Hanafi;
    params.highLatitudeRule = adhan.HighLatitudeRule.TwilightAngle;
    var p = new adhan.PrayerTimes(new adhan.Coordinates(59.9094, 10.7349), date, params);
    assert.equal(p.fajr, p.timeForPrayer(adhan.Prayer.Fajr));
    assert.equal(p.sunrise, p.timeForPrayer(adhan.Prayer.Sunrise));
    assert.equal(p.dhuhr, p.timeForPrayer(adhan.Prayer.Dhuhr));
    assert.equal(p.asr, p.timeForPrayer(adhan.Prayer.Asr));
    assert.equal(p.maghrib, p.timeForPrayer(adhan.Prayer.Maghrib));
    assert.equal(p.isha, p.timeForPrayer(adhan.Prayer.Isha));
    assert.equal(null, p.timeForPrayer(adhan.Prayer.None));
});

QUnit.test("Current Prayer", function(assert) {
    var date = new Date(2015, 8, 1);
    var params = adhan.CalculationMethod.Karachi();
    params.madhab = adhan.Madhab.Hanafi;
    params.highLatitudeRule = adhan.HighLatitudeRule.TwilightAngle;
    var p = new adhan.PrayerTimes(new adhan.Coordinates(33.720817, 73.090032), date, params);
    assert.equal(p.currentPrayer(dateByAddingSeconds(p.fajr, -1)), adhan.Prayer.None);
    assert.equal(p.currentPrayer(p.fajr), adhan.Prayer.Fajr);
    assert.equal(p.currentPrayer(dateByAddingSeconds(p.fajr, 1)), adhan.Prayer.Fajr);
    assert.equal(p.currentPrayer(dateByAddingSeconds(p.sunrise, 1)), adhan.Prayer.Sunrise);
    assert.equal(p.currentPrayer(dateByAddingSeconds(p.dhuhr, 1)), adhan.Prayer.Dhuhr);
    assert.equal(p.currentPrayer(dateByAddingSeconds(p.asr, 1)), adhan.Prayer.Asr);
    assert.equal(p.currentPrayer(dateByAddingSeconds(p.maghrib, 1)), adhan.Prayer.Maghrib);
    assert.equal(p.currentPrayer(dateByAddingSeconds(p.isha, 1)), adhan.Prayer.Isha);
});

QUnit.test("Next Prayer", function(assert) {
    var date = new Date(2015, 8, 1);
    var params = adhan.CalculationMethod.Karachi();
    params.madhab = adhan.Madhab.Hanafi;
    params.highLatitudeRule = adhan.HighLatitudeRule.TwilightAngle;
    var p = new adhan.PrayerTimes(new adhan.Coordinates(33.720817, 73.090032), date, params);
    assert.equal(p.nextPrayer(dateByAddingSeconds(p.fajr, -1)), adhan.Prayer.Fajr);
    assert.equal(p.nextPrayer(p.fajr), adhan.Prayer.Sunrise);
    assert.equal(p.nextPrayer(dateByAddingSeconds(p.fajr, 1)), adhan.Prayer.Sunrise);
    assert.equal(p.nextPrayer(dateByAddingSeconds(p.sunrise, 1)), adhan.Prayer.Dhuhr);
    assert.equal(p.nextPrayer(dateByAddingSeconds(p.dhuhr, 1)), adhan.Prayer.Asr);
    assert.equal(p.nextPrayer(dateByAddingSeconds(p.asr, 1)), adhan.Prayer.Maghrib);
    assert.equal(p.nextPrayer(dateByAddingSeconds(p.maghrib, 1)), adhan.Prayer.Isha);
    assert.equal(p.nextPrayer(dateByAddingSeconds(p.isha, 1)), adhan.Prayer.None);
});
