/* eslint-disable complexity */
import fs from 'fs';
import adhan from '../src/Adhan';
import moment from 'moment-timezone';

function parseParams(data) {
	let params;

	const method = data["method"];
	if (method === "MuslimWorldLeague") {
		params = adhan.CalculationMethod.MuslimWorldLeague();
	} else if (method === "Egyptian") {
		params = adhan.CalculationMethod.Egyptian();
	} else if (method === "Karachi") {
		params = adhan.CalculationMethod.Karachi();
	} else if (method === "UmmAlQura") {
		params = adhan.CalculationMethod.UmmAlQura();
	} else if (method === "Dubai") {
		params = adhan.CalculationMethod.Dubai();
	} else if (method === "MoonsightingCommittee") {
		params = adhan.CalculationMethod.MoonsightingCommittee();
	} else if (method === "NorthAmerica") {
		params = adhan.CalculationMethod.NorthAmerica();
	} else if (method === "Kuwait") {
		params = adhan.CalculationMethod.Kuwait();
	} else if (method === "Qatar") {
		params = adhan.CalculationMethod.Qatar();
	} else if (method === "Singapore") {
		params = adhan.CalculationMethod.Singapore();
	} else if (method === "Turkey") {
		params = adhan.CalculationMethod.Turkey();
	} else if (method === "Tehran") {
		params = adhan.CalculationMethod.Tehran();
	} else {
		params = adhan.CalculationMethod.Other();
	}

	const madhab = data["madhab"];
	if (madhab === "Shafi") {
		params.madhab = adhan.Madhab.Shafi;
	} else if (madhab === "Hanafi") {
		params.madhab = adhan.Madhab.Hanafi;
	}

	const highLatRule = data["highLatitudeRule"];
	if (highLatRule === "SeventhOfTheNight") {
		params.highLatitudeRule = adhan.HighLatitudeRule.SeventhOfTheNight;
	} else if (highLatRule === "TwilightAngle") {
		params.highLatitudeRule = adhan.HighLatitudeRule.TwilightAngle;
	} else {
		params.highLatitudeRule = adhan.HighLatitudeRule.MiddleOfTheNight;
	}

	return params;
}

expect.extend({
	toBeWithinRange(intialDate, comparisonDate, variance) {
		const initalValue = intialDate.getTime();
		const varianceValue = variance * 60 * 1000;
		const floor = comparisonDate.getTime() - varianceValue;
		const ceiling = comparisonDate.getTime() + varianceValue;
		const pass = (initalValue >= floor && initalValue <= ceiling);
		if (pass) {
			return {
				message: () =>
				`expected ${intialDate} not to be within range ${comparisonDate} and a variance of ${variance} minute`,
				pass: true,
			};
		} else {
			return {
				message: () =>
				`expected ${intialDate} to be within range ${comparisonDate} and a variance of ${variance} minute`,
				pass: false,
			};
		}
	},
  });

fs.readdirSync("Shared/Times").forEach( function (filename) {
	test(`compare calculated times against the prayer times in ${filename}`, () => {
		const file_contents = fs.readFileSync("Shared/Times/" + filename)
		const data = JSON.parse(file_contents);
		const coordinates = new adhan.Coordinates(data["params"]["latitude"], data["params"]["longitude"]);
		const params = parseParams(data["params"]);
		const variance = data["variance"] || 0;
		data["times"].forEach(function(time) {
			const date = moment(time["date"], "YYYY-MM-DD").toDate();
			const p = new adhan.PrayerTimes(coordinates, date, params);

			const testFajr = moment.tz(time["date"] + " " + time["fajr"], "YYYY-MM-DD h:mm A", data["params"]["timezone"]).toDate();
			const testSunrise = moment.tz(time["date"] + " " + time["sunrise"], "YYYY-MM-DD h:mm A", data["params"]["timezone"]).toDate();
			const testDhuhr = moment.tz(time["date"] + " " + time["dhuhr"], "YYYY-MM-DD h:mm A", data["params"]["timezone"]).toDate();
			const testAsr = moment.tz(time["date"] + " " + time["asr"], "YYYY-MM-DD h:mm A", data["params"]["timezone"]).toDate();
			const testMaghrib = moment.tz(time["date"] + " " + time["maghrib"], "YYYY-MM-DD h:mm A", data["params"]["timezone"]).toDate();
			const testIsha = moment.tz(time["date"] + " " + time["isha"], "YYYY-MM-DD h:mm A", data["params"]["timezone"]).toDate();

			expect(p.fajr).toBeWithinRange(testFajr, variance);
			expect(p.sunrise).toBeWithinRange(testSunrise, variance);
			expect(p.dhuhr).toBeWithinRange(testDhuhr, variance);
			expect(p.asr).toBeWithinRange(testAsr, variance);
			expect(p.maghrib).toBeWithinRange(testMaghrib, variance);
			expect(p.isha).toBeWithinRange(testIsha, variance);
		});
	});
});


