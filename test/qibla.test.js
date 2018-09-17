var expect = require("chai").expect;
var qibla = require("../Adhan.js").Qibla;

describe("Qibla direction calculation", function() {
    it("finds Qibla in North America", function() {
      	var washingtonDC = { latitude: 38.9072, longitude: -77.0369 };
		expect(qibla(washingtonDC)).to.be.closeTo(56.560, 0.001);

		var nyc = { latitude: 40.7128, longitude: -74.0059 };
  		expect(qibla(nyc)).to.be.closeTo(58.481, 0.001);

		var sanFrancisco = { latitude: 37.7749, longitude: -122.4194 };
		expect(qibla(sanFrancisco)).to.be.closeTo(18.843, 0.001);

		var anchorage = { latitude: 61.2181, longitude: -149.9003 };
		expect(qibla(anchorage)).to.be.closeTo(350.883, 0.001);
	});

	it("finds Qibla in the South Pacific", function() {
		var sydney = { latitude: -33.8688, longitude: 151.2093 };
		expect(qibla(sydney)).to.be.closeTo(277.499, 0.001);
        
        var auckland = { latitude: -36.8485, longitude: 174.7633 };
        expect(qibla(auckland)).to.be.closeTo(261.197, 0.001);
	});

	it("finds Qibla in Europe", function() {
		var london = { latitude: 51.5074, longitude: -0.1278 };
		expect(qibla(london)).to.be.closeTo(118.987, 0.001);
        
        var paris = { latitude: 48.8566, longitude: 2.3522 };
        expect(qibla(paris)).to.be.closeTo(119.163, 0.001);
        
        var oslo = { latitude: 59.9139, longitude: 10.7522 };
        expect(qibla(oslo)).to.be.closeTo(139.027, 0.001);
	});

	it("finds Qibla in Asia", function() {
		var islamabad = { latitude: 33.7294, longitude: 73.0931 };
		expect(qibla(islamabad)).to.be.closeTo(255.882, 0.001);
        
        var tokyo = { latitude: 35.6895, longitude: 139.6917 };
        expect(qibla(tokyo)).to.be.closeTo(293.021, 0.001);
	});
});
