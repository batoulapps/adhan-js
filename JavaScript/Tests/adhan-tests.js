

QUnit.test("Prayer Times", function(assert) {
	var date = new Date(2015, 6, 12);
	var params = CalculationMethod.NorthAmerica;
	params.madhab = Madhab.Hanafi;
	var p = new PrayerTimes(new Coordinates(35.7750, -78.6336), date, params);

	assert.notEqual(p.fajr.toString(), null);

	/*
        let comps = NSDateComponents()
        comps.year = 2015
        comps.month = 7
        comps.day = 12
        var params = CalculationMethod.NorthAmerica.params
        params.madhab = .Hanafi
        let p = PrayerTimes(coordinates: Coordinates(latitude: 35.7750, longitude: -78.6336), date: comps, calculationParameters: params)!
        
        let dateFormatter = NSDateFormatter()
        dateFormatter.timeZone = NSTimeZone(name: "America/New_York")!
        dateFormatter.dateStyle = .NoStyle
        dateFormatter.timeStyle = .ShortStyle
        
        XCTAssertEqual(dateFormatter.stringFromDate(p.fajr), "4:42 AM")
        XCTAssertEqual(dateFormatter.stringFromDate(p.sunrise), "6:08 AM")
        XCTAssertEqual(dateFormatter.stringFromDate(p.dhuhr), "1:21 PM")
        XCTAssertEqual(dateFormatter.stringFromDate(p.asr), "6:22 PM")
        XCTAssertEqual(dateFormatter.stringFromDate(p.maghrib), "8:32 PM")
        XCTAssertEqual(dateFormatter.stringFromDate(p.isha), "9:57 PM")

	*/
});
