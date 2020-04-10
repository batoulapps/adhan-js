import fs from 'fs';
import adhan from '../src/Adhan';
import moment from 'moment-timezone';

function parseParams(data) {
	var params;

	var method = data["method"];
	if (method == "MuslimWorldLeague") {
		params = adhan.CalculationMethod.MuslimWorldLeague();
	} else if (method == "Egyptian") {
		params = adhan.CalculationMethod.Egyptian();
	} else if (method == "Karachi") {
		params = adhan.CalculationMethod.Karachi();
	} else if (method == "UmmAlQura") {
		params = adhan.CalculationMethod.UmmAlQura();
	} else if (method == "Dubai") {
		params = adhan.CalculationMethod.Dubai();
	} else if (method == "MoonsightingCommittee") {
		params = adhan.CalculationMethod.MoonsightingCommittee();
	} else if (method == "NorthAmerica") {
		params = adhan.CalculationMethod.NorthAmerica();
	} else if (method == "Kuwait") {
		params = adhan.CalculationMethod.Kuwait();
	} else if (method == "Qatar") {
		params = adhan.CalculationMethod.Qatar();
	} else if (method == "Singapore") {
		params = adhan.CalculationMethod.Singapore();
	} else {
		params = adhan.CalculationMethod.Other();
	}

	var madhab = data["madhab"];
	if (madhab == "Shafi") {
    	params.madhab = adhan.Madhab.Shafi;
	} else if (madhab == "Hanafi") {
    	params.madhab = adhan.Madhab.Hanafi;
	}

    var highLatRule = data["highLatitudeRule"];
	if (highLatRule == "SeventhOfTheNight") {
    	params.highLatitudeRule = adhan.HighLatitudeRule.SeventhOfTheNight;
    } else if (highLatRule == "TwilightAngle") {
    	params.highLatitudeRule = adhan.HighLatitudeRule.TwilightAngle;
	} else {
    	params.highLatitudeRule = adhan.HighLatitudeRule.MiddleOfTheNight;
	}

	return params;
}

expect.extend({
	toBeWithinRange(received, floor, ceiling) {
	  const pass = received >= floor && received <= ceiling;
	  if (pass) {
		return {
		  message: () =>
			`expected ${received} not to be within range ${floor} - ${ceiling}`,
		  pass: true,
		};
	  } else {
		return {
		  message: () =>
			`expected ${received} to be within range ${floor} - ${ceiling}`,
		  pass: false,
		};
	  }
	},
  });

fs.readdirSync("Shared/Times").forEach( function (filename) {
	test(`compare calculated times against the prayer times in ${filename}`, () => {
		var file_contents = fs.readFileSync("Shared/Times/" + filename)
		var data = JSON.parse(file_contents);
		var coordinates = new adhan.Coordinates(data["params"]["latitude"], data["params"]["longitude"]);
		var params = parseParams(data["params"]);
		var variance = (data["variance"] || 0) * 60;
		data["times"].forEach(function(time) {
			var date = moment(time["date"], "YYYY-MM-DD").toDate();
			var p = new adhan.PrayerTimes(coordinates, date, params);

			var testFajr = moment.tz(time["date"] + " " + time["fajr"], "YYYY-MM-DD h:mm A", data["params"]["timezone"]).toDate().getTime() / 1000.0;
			var testSunrise = moment.tz(time["date"] + " " + time["sunrise"], "YYYY-MM-DD h:mm A", data["params"]["timezone"]).toDate().getTime() / 1000.0;
			var testDhuhr = moment.tz(time["date"] + " " + time["dhuhr"], "YYYY-MM-DD h:mm A", data["params"]["timezone"]).toDate().getTime() / 1000.0;
			var testAsr = moment.tz(time["date"] + " " + time["asr"], "YYYY-MM-DD h:mm A", data["params"]["timezone"]).toDate().getTime() / 1000.0;
			var testMaghrib = moment.tz(time["date"] + " " + time["maghrib"], "YYYY-MM-DD h:mm A", data["params"]["timezone"]).toDate().getTime() / 1000.0;
			var testIsha = moment.tz(time["date"] + " " + time["isha"], "YYYY-MM-DD h:mm A", data["params"]["timezone"]).toDate().getTime() / 1000.0;

			var fajr = moment(p.fajr).tz(data["params"]["timezone"]).toDate().getTime() / 1000.0;
			var sunrise = moment(p.sunrise).tz(data["params"]["timezone"]).toDate().getTime() / 1000.0;
			var dhuhr = moment(p.dhuhr).tz(data["params"]["timezone"]).toDate().getTime() / 1000.0;
			var asr = moment(p.asr).tz(data["params"]["timezone"]).toDate().getTime() / 1000.0;
			var maghrib = moment(p.maghrib).tz(data["params"]["timezone"]).toDate().getTime() / 1000.0;
			var isha = moment(p.isha).tz(data["params"]["timezone"]).toDate().getTime() / 1000.0;

			expect(fajr).toBeWithinRange(testFajr - variance, testFajr + variance);
			expect(sunrise).toBeWithinRange(testSunrise - variance, testSunrise + variance);
			expect(dhuhr).toBeWithinRange(testDhuhr - variance, testDhuhr + variance);
			expect(asr).toBeWithinRange(testAsr - variance, testAsr + variance);
			expect(maghrib).toBeWithinRange(testMaghrib - variance, testMaghrib + variance);
			expect(isha).toBeWithinRange(testIsha - variance, testIsha + variance);
		});
	});
});


