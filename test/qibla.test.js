import qibla from '../src/Qibla';

test("finding Qibla in North America", () => {
	const washingtonDC = { latitude: 38.9072, longitude: -77.0369 };
	expect(qibla(washingtonDC)).toBeCloseTo(56.560, 3);

	const nyc = { latitude: 40.7128, longitude: -74.0059 };
	expect(qibla(nyc)).toBeCloseTo(58.4817, 3);

	const sanFrancisco = { latitude: 37.7749, longitude: -122.4194 };
	expect(qibla(sanFrancisco)).toBeCloseTo(18.8438, 3);

	const anchorage = { latitude: 61.2181, longitude: -149.9003 };
	expect(qibla(anchorage)).toBeCloseTo(350.883, 3);
});

test("finding Qibla in the South Pacific", () => {
	const sydney = { latitude: -33.8688, longitude: 151.2093 };
	expect(qibla(sydney)).toBeCloseTo(277.4996, 3);
	
	const auckland = { latitude: -36.8485, longitude: 174.7633 };
	expect(qibla(auckland)).toBeCloseTo(261.197, 3);
});

test("finding Qibla in Europe", () => {
	const london = { latitude: 51.5074, longitude: -0.1278 };
	expect(qibla(london)).toBeCloseTo(118.987, 3);
	
	const paris = { latitude: 48.8566, longitude: 2.3522 };
	expect(qibla(paris)).toBeCloseTo(119.163, 3);
	
	const oslo = { latitude: 59.9139, longitude: 10.7522 };
	expect(qibla(oslo)).toBeCloseTo(139.0278, 3);
});

test("finding Qibla in Asia", () => {
	const islamabad = { latitude: 33.7294, longitude: 73.0931 };
	expect(qibla(islamabad)).toBeCloseTo(255.882, 3);
	
	const tokyo = { latitude: 35.6895, longitude: 139.6917 };
	expect(qibla(tokyo)).toBeCloseTo(293.021, 3);
});

