import adhan from '../src/Adhan';
import moment from 'moment-timezone';

test("getting sunnah times for the New York timezone", () => {
	let coords = new adhan.Coordinates(35.7750, -78.6336);
	let params = adhan.CalculationMethod.NorthAmerica();

	let date1 = new Date(2015, 6, 12);
    let p1 = new adhan.PrayerTimes(coords, date1, params);
	expect(moment(p1.maghrib).tz("America/New_York").format("M/D/YY, h:mm A")).toBe("7/12/15, 8:32 PM");
	
	let date2 = new Date(2015, 6, 13);
    let p2 = new adhan.PrayerTimes(coords, date2, params);
	expect(moment(p2.fajr).tz("America/New_York").format("M/D/YY, h:mm A")).toBe("7/13/15, 4:43 AM");
	
	let sunnah = new adhan.SunnahTimes(p1);
	expect(moment(sunnah.middleOfTheNight).tz("America/New_York").format("M/D/YY, h:mm A")).toBe("7/13/15, 12:38 AM");
	expect(moment(sunnah.lastThirdOfTheNight).tz("America/New_York").format("M/D/YY, h:mm A")).toBe("7/13/15, 1:59 AM");
});

test("getting sunnah times for the London timezone", () => {
	let coords = new adhan.Coordinates(51.5074, -0.1278);
	let params = adhan.CalculationMethod.MoonsightingCommittee();

	let date1 = new Date(2016, 11, 31);
    let p1 = new adhan.PrayerTimes(coords, date1, params);
	expect(moment(p1.maghrib).tz("Europe/London").format("M/D/YY, h:mm A")).toBe("12/31/16, 4:04 PM");
	
	let date2 = new Date(2017, 0, 1);
    let p2 = new adhan.PrayerTimes(coords, date2, params);
	expect(moment(p2.fajr).tz("Europe/London").format("M/D/YY, h:mm A")).toBe("1/1/17, 6:25 AM");
	
	let sunnah = new adhan.SunnahTimes(p1);
	expect(moment(sunnah.middleOfTheNight).tz("Europe/London").format("M/D/YY, h:mm A")).toBe("12/31/16, 11:15 PM");
	expect(moment(sunnah.lastThirdOfTheNight).tz("Europe/London").format("M/D/YY, h:mm A")).toBe("1/1/17, 1:38 AM");
});

test("getting sunnah times for the Oslo timezone", () => {
	let coords = new adhan.Coordinates(59.9094, 10.7349);
	let params = adhan.CalculationMethod.MuslimWorldLeague();
	params.highLatitudeRule = adhan.HighLatitudeRule.MiddleOfTheNight;

	let date1 = new Date(2016, 6, 1);
    let p1 = new adhan.PrayerTimes(coords, date1, params);
	expect(moment(p1.maghrib).tz("Europe/Oslo").format("M/D/YY, h:mm A")).toBe("7/1/16, 10:41 PM");
	
	let date2 = new Date(2016, 6, 2);
    let p2 = new adhan.PrayerTimes(coords, date2, params);
	expect(moment(p2.fajr).tz("Europe/Oslo").format("M/D/YY, h:mm A")).toBe("7/2/16, 1:20 AM");
	
	let sunnah = new adhan.SunnahTimes(p1);
	expect(moment(sunnah.middleOfTheNight).tz("Europe/Oslo").format("M/D/YY, h:mm A")).toBe("7/2/16, 12:01 AM");
	expect(moment(sunnah.lastThirdOfTheNight).tz("Europe/Oslo").format("M/D/YY, h:mm A")).toBe("7/2/16, 12:27 AM");
});

test("getting sunnah times for US DST change", () => {
	let coords = new adhan.Coordinates(37.7749, -122.4194);
	let params = adhan.CalculationMethod.NorthAmerica();

	let date1 = new Date(2017, 2, 11);
    let p1 = new adhan.PrayerTimes(coords, date1, params);
	expect(moment(p1.fajr).tz("America/Los_Angeles").format("M/D/YY, h:mm A")).toBe("3/11/17, 5:14 AM");
	expect(moment(p1.maghrib).tz("America/Los_Angeles").format("M/D/YY, h:mm A")).toBe("3/11/17, 6:13 PM");
	
	let date2 = new Date(2017, 2, 12);
    let p2 = new adhan.PrayerTimes(coords, date2, params);
	expect(moment(p2.fajr).tz("America/Los_Angeles").format("M/D/YY, h:mm A")).toBe("3/12/17, 6:13 AM");
	expect(moment(p2.maghrib).tz("America/Los_Angeles").format("M/D/YY, h:mm A")).toBe("3/12/17, 7:14 PM");
	
	let sunnah = new adhan.SunnahTimes(p1);
	expect(moment(sunnah.middleOfTheNight).tz("America/Los_Angeles").format("M/D/YY, h:mm A")).toBe("3/11/17, 11:43 PM");
	expect(moment(sunnah.lastThirdOfTheNight).tz("America/Los_Angeles").format("M/D/YY, h:mm A")).toBe("3/12/17, 1:33 AM");
});

test("getting sunnah times for Europe DST change", () => {
	let coords = new adhan.Coordinates(48.8566, 2.3522);
	let params = adhan.CalculationMethod.MuslimWorldLeague();
	params.highLatitudeRule = adhan.HighLatitudeRule.SeventhOfTheNight;

	let date1 = new Date(2015, 9, 24);
    let p1 = new adhan.PrayerTimes(coords, date1, params);
	expect(moment(p1.fajr).tz("Europe/Paris").format("M/D/YY, h:mm A")).toBe("10/24/15, 6:38 AM");
	expect(moment(p1.maghrib).tz("Europe/Paris").format("M/D/YY, h:mm A")).toBe("10/24/15, 6:45 PM");
	
	let date2 = new Date(2015, 9, 25);
    let p2 = new adhan.PrayerTimes(coords, date2, params);
	expect(moment(p2.fajr).tz("Europe/Paris").format("M/D/YY, h:mm A")).toBe("10/25/15, 5:40 AM");
	expect(moment(p2.maghrib).tz("Europe/Paris").format("M/D/YY, h:mm A")).toBe("10/25/15, 5:43 PM");
	
	let sunnah = new adhan.SunnahTimes(p1);
	expect(moment(sunnah.middleOfTheNight).tz("Europe/Paris").format("M/D/YY, h:mm A")).toBe("10/25/15, 12:43 AM");
	expect(moment(sunnah.lastThirdOfTheNight).tz("Europe/Paris").format("M/D/YY, h:mm A")).toBe("10/25/15, 2:42 AM");
});
