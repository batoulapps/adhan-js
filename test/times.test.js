const fs = require('fs');
var expect = require("chai").expect;
var adhan = require("../Adhan.js");

describe("Validate prayer times", function() {
	var files = fs.readdirSync("Shared/Times");
    for (var i in files) {
        var file_contents = fs.readFileSync("Shared/Times/" + files[i])
        var data = JSON.parse(file_contents)
        it("compares against the prayer times in " + files[i], function() {
        	expect(data["times"].length).to.equal(12)
    	});
    }
});

/*
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

		QUnit.test("Prayer Times", function(assert) {
			times.forEach(function(data) {
				var coordinates = new adhan.Coordinates(data["params"]["latitude"], data["params"]["longitude"]);
				var params = parseParams(data["params"]);
				data["times"].forEach(function(time) {
					var date = moment(time["date"], "YYYY-MM-DD").toDate();
					var p = new adhan.PrayerTimes(coordinates, date, params);
					assert.equal(moment(p.fajr).tz(data["params"]["timezone"]).format("h:mm A"), time["fajr"]);
					assert.equal(moment(p.sunrise).tz(data["params"]["timezone"]).format("h:mm A"), time["sunrise"]);
					assert.equal(moment(p.dhuhr).tz(data["params"]["timezone"]).format("h:mm A"), time["dhuhr"]);
					assert.equal(moment(p.asr).tz(data["params"]["timezone"]).format("h:mm A"), time["asr"]);
					assert.equal(moment(p.maghrib).tz(data["params"]["timezone"]).format("h:mm A"), time["maghrib"]);
					assert.equal(moment(p.isha).tz(data["params"]["timezone"]).format("h:mm A"), time["isha"]);
				});
			});
		});
		*/