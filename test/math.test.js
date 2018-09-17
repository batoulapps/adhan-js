var expect = require("chai").expect;
var adhan = require("../Adhan.js");

var degreesToRadians = adhan.Math.degreesToRadians;
var radiansToDegrees = adhan.Math.radiansToDegrees;
var normalizeToScale = adhan.Math.normalizeToScale;
var unwindAngle = adhan.Math.unwindAngle;
var quadrantShiftAngle = adhan.Math.quadrantShiftAngle;
var timeComponents = adhan.Math.timeComponents;
var roundedMinute = adhan.Date.roundedMinute;

describe("Angle Conversion", function() {
    it("converts between degrees and radians", function() {
        expect(radiansToDegrees(Math.PI)).to.equal(180);
        expect(degreesToRadians(180)).to.equal(Math.PI);
        expect(radiansToDegrees(Math.PI/2)).to.equal(90);
        expect(degreesToRadians(90)).to.equal(Math.PI/2);
    });
});

describe("Normalize a numerical value", function() {
    it("normalizes the number to be inside the specified scale", function() {
        expect(normalizeToScale(2.0, -5)).to.equal(-3);
        expect(normalizeToScale(-4, -5)).to.equal(-4);
        expect(normalizeToScale(-6, -5)).to.equal(-1);

        expect(normalizeToScale(-1, 24)).to.equal(23);
        expect(normalizeToScale(1, 24)).to.equal(1);
        expect(normalizeToScale(49.0, 24)).to.equal(1);

        expect(normalizeToScale(361, 360)).to.equal(1);
        expect(normalizeToScale(360, 360)).to.equal(0);
        expect(normalizeToScale(259, 360)).to.equal(259);
        expect(normalizeToScale(2592.0, 360)).to.equal(72);

        expect(unwindAngle(-45)).to.equal(315);
        expect(unwindAngle(361.0)).to.equal(1);
        expect(unwindAngle(360)).to.equal(0);
        expect(unwindAngle(259.0)).to.equal(259);
        expect(unwindAngle(2592)).to.equal(72);

        expect(normalizeToScale(360.1, 360)).to.be.closeTo(0.1, 0.00000001);
    });
});

describe("Quadrant Shift Angle", function() {
    it("finds the same angle constrained within the first and fourth quadrants", function() {
        expect(quadrantShiftAngle(360.0)).to.equal(0);
        expect(quadrantShiftAngle(361.0)).to.equal(1);
        expect(quadrantShiftAngle(1.0)).to.equal(1);
        expect(quadrantShiftAngle(-1.0)).to.equal(-1);
        expect(quadrantShiftAngle(-181.0)).to.equal(179);
        expect(quadrantShiftAngle(180.0)).to.equal(180);
        expect(quadrantShiftAngle(359.0)).to.equal(-1);
        expect(quadrantShiftAngle(-359.0)).to.equal(1);
        expect(quadrantShiftAngle(1261.0)).to.equal(-179);
        expect(quadrantShiftAngle(-360.1)).to.be.closeTo(-0.1, 0.00000001);
    });
});

describe("Time Components", function() {
    it("breaks down an hour value into separate hour, minute, and second values", function() {
        var comps1 = timeComponents(15.199)
        expect(comps1.hours).to.equal(15);
        expect(comps1.minutes).to.equal(11);
        expect(comps1.seconds).to.equal(56);

        var comps2 = timeComponents(1.0084);
        expect(comps2.hours).to.equal(1);
        expect(comps2.minutes).to.equal(0);
        expect(comps2.seconds).to.equal(30);

        var comps3 = timeComponents(1.0083);
        expect(comps3.hours).to.equal(1);
        expect(comps3.minutes).to.equal(0);

        var comps4 = timeComponents(2.1);
        expect(comps4.hours).to.equal(2);
        expect(comps4.minutes).to.equal(6);

        var comps5 = timeComponents(3.5);
        expect(comps5.hours).to.equal(3);
        expect(comps5.minutes).to.equal(30);
    });
});

describe("Minute Rounding", function() {
    it("rounds a date to the closest minute", function() {
        var date1 = roundedMinute(new Date(2015, 0, 1, 10, 2, 29));
        expect(date1.getMinutes()).to.equal(2);
        expect(date1.getSeconds()).to.equal(0);

        var date2 = roundedMinute(new Date(2015, 0, 1, 10, 2, 31));
        expect(date2.getMinutes()).to.equal(3);
        expect(date2.getSeconds()).to.equal(0);
    });
});

