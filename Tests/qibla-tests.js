QUnit.test('Test North America', function(assert) {
  var washingtonDC = { latitude: 38.9072, longitude: -77.0369 };
  assert.equal(qibla(washingtonDC), 56.560468214635996);

  var nyc = { latitude: 40.7128, longitude: -74.0059 };
  assert.equal(qibla(nyc), 58.48176358718943);

  var sanFrancisco = { latitude: 37.7749, longitude: -122.4194 };
  assert.equal(qibla(sanFrancisco), 18.843822245692426);

  var anchorage = { latitude: 61.2181, longitude: -149.9003 };
  assert.equal(qibla(anchorage), 350.8830761159853);
});

QUnit.test('Test South Pacific', function(assert) {
  var sydney = { latitude: -33.8688, longitude: 151.2093 };
  assert.equal(qibla(sydney), 277.4996044487399);

  var auckland = { latitude: -36.8485, longitude: 174.7633 };
  assert.equal(qibla(auckland), 261.19732640365845);
});

QUnit.test('Test Europe', function(assert) {
  var london = { latitude: 51.5074, longitude: -0.1278 };
  assert.equal(qibla(london), 118.98721898131991);

  var paris = { latitude: 48.8566, longitude: 2.3522 };
  assert.equal(qibla(paris), 119.16313542183347);

  var oslo = { latitude: 59.9139, longitude: 10.7522 };
  assert.equal(qibla(oslo), 139.02785605537514);
});

QUnit.test('Test Asia', function(assert) {
  var islamabad = { latitude: 33.7294, longitude: 73.0931 };
  assert.equal(qibla(islamabad), 255.88161567854362);

  var tokyo = { latitude: 35.6895, longitude: 139.6917 };
  assert.equal(qibla(tokyo), 293.02072441441163);
});
