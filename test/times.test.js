const fs = require('fs');
var expect = require("chai").expect;
var adhan = require("../Adhan.js");
var moment = require("moment");

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
	} else if (method == "Gulf") {
		params = adhan.CalculationMethod.Gulf();
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

describe("Validate prayer times", function() {
	fs.readdirSync("Shared/Times").forEach( function (filename) {
		it("compares against the prayer times in " + filename, function() {
        	var file_contents = fs.readFileSync("Shared/Times/" + filename)
        	var data = JSON.parse(file_contents);
        	var coordinates = new adhan.Coordinates(data["params"]["latitude"], data["params"]["longitude"]);
			var params = parseParams(data["params"]);
			data["times"].forEach(function(time) {
				var date = moment(time["date"], "YYYY-MM-DD").toDate();
				var p = new adhan.PrayerTimes(coordinates, date, params);
				expect(moment(p.fajr).tz(data["params"]["timezone"]).format("h:mm A")).to.equal(time["fajr"]);
				expect(moment(p.sunrise).tz(data["params"]["timezone"]).format("h:mm A")).to.equal(time["sunrise"]);
				expect(moment(p.dhuhr).tz(data["params"]["timezone"]).format("h:mm A")).to.equal(time["dhuhr"]);
				expect(moment(p.asr).tz(data["params"]["timezone"]).format("h:mm A")).to.equal(time["asr"]);
				expect(moment(p.maghrib).tz(data["params"]["timezone"]).format("h:mm A")).to.equal(time["maghrib"]);
				expect(moment(p.isha).tz(data["params"]["timezone"]).format("h:mm A")).to.equal(time["isha"]);
			});
		});
	});
});

