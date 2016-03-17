

QUnit.test("Prayer Times", function(assert) {
	var date = new Date(2015, 6, 12);
	var params = CalculationMethod.NorthAmerica;
	params.madhab = Madhab.Hanafi;
	var p = new PrayerTimes(new Coordinates(35.7750, -78.6336), date, params);

	assert.equal(p.fajr.formattedTime(-4), "4:42 AM");
        assert.equal(p.sunrise.formattedTime(-4), "6:08 AM");
        assert.equal(p.dhuhr.formattedTime(-4), "1:21 PM");
        assert.equal(p.asr.formattedTime(-4), "6:22 PM");
        assert.equal(p.maghrib.formattedTime(-4), "8:32 PM");
        assert.equal(p.isha.formattedTime(-4), "9:57 PM");
        assert.equal(p.isha.formattedTime(-4, '24h'), "21:57");
});
