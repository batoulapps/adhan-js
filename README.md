# Adhan JavaScript

[![badge-version][]][npm] [![badge-travis][]][travis] [![badge-cov][]][codecov] [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Adhan JavaScript is a well tested and well documented library for calculating Islamic prayer times in JavaScript using Node or a web browser.

All astronomical calculations are high precision equations directly from the book [“Astronomical Algorithms” by Jean Meeus](http://www.willbell.com/math/mc1.htm). This book is recommended by the Astronomical Applications Department of the U.S. Naval Observatory and the Earth System Research Laboratory of the National Oceanic and Atmospheric Administration.

Implementations of Adhan in other languages can be found in the parent repo [Adhan](https://github.com/batoulapps/Adhan).

## Installation

Adhan was designed to work in both the browser and NodeJS applications.

### Browser

We provide both ESM and UMD bundles for use in the browser.

Download the latest release and check under `package/lib/bundles`.

```html
<script src="adhan.umd.min.js"></script>
<script>
  var prayerTimes = new adhan.PrayerTimes(coordinates, date, params);
</script>
```

### Node

Both CommonJS and ES Module libraries are provided.

```
npm install adhan
```

CommonJS:

```js
const adhan = require('adhan');
const prayerTimes = new adhan.PrayerTimes(coordinates, date, params);
```

ES Modules:

```js
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
const coordinates = new Coordinates(35.7897507, -78.6912485);
const params = CalculationMethod.MoonsightingCommittee();
const date = new Date(2022, 3, 20);
const prayerTimes = new PrayerTimes(coordinates, date, params);
```

## Migration

Migrating from version 3.x? Read the [migration guide](MIGRATION.md)

## Usage

To get prayer times initialize a new `PrayerTimes` object passing in coordinates,
date, and calculation parameters.

```js
const prayerTimes = new PrayerTimes(coordinates, date, params);
```

### Initialization parameters

#### Coordinates

Create a `Coordinates` object with the latitude and longitude for the location
you want prayer times for.

```js
const coordinates = new Coordinates(35.78056, -78.6389);
```

#### Date

The date parameter passed in should be an instance of the JavaScript `Date`
object. The year, month, and day values need to be populated. All other
values will be ignored. The year, month and day values should be for the date
that you want prayer times for. These date values are expected to be for the
Gregorian calendar.

```js
const date = new Date();
const date = new Date(2015, 11, 1);
```

#### Calculation parameters

The rest of the needed information is contained within the `CalculationParameters` object.

[Calculation Parameters & Methods Guide](METHODS.md)

### Prayer Times

Once the `PrayerTimes` object has been initialized it will contain values
for all five prayer times and the time for sunrise. The prayer times will be
Date object instances initialized with UTC values. You will then need to format
the times for the correct timezone. You can do that by using a timezone aware
date formatting library like [moment](https://momentjs.com/docs/).

```js
moment(prayerTimes.fajr).tz('America/New_York').format('h:mm A');
```

### Full Example

```ts
import {
  Coordinates,
  CalculationMethod,
  PrayerTimes,
  SunnahTimes,
  Prayer,
  Qibla,
} from 'adhan';
import moment from 'moment-timezone';

const coordinates = new Coordinates(35.7897507, -78.6912485);
const params = CalculationMethod.MoonsightingCommittee();
const date = new Date();
const prayerTimes = new PrayerTimes(coordinates, date, params);
const sunnahTimes = new SunnahTimes(prayerTimes);
```

[![Edit Adhan Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/adhan-example-88v549?fontsize=14&hidenavigation=1&theme=dark)

### Convenience Utilities

The `PrayerTimes` object has functions for getting the current prayer and the next prayer. You can also get the time for a specified prayer, making it
easier to dynamically show countdowns until the next prayer.

```js
var prayerTimes = new PrayerTimes(coordinates, date, params);

var current = prayerTimes.currentPrayer();
var next = prayerTimes.nextPrayer();
var nextPrayerTime = prayerTimes.timeForPrayer(next);
```

### Sunnah Times

The Adhan library can also calulate Sunnah times. Given an instance of `PrayerTimes`, you can get a `SunnahTimes` object with the times for Qiyam.

```js
var sunnahTimes = new SunnahTimes(prayerTimes);
var middleOfTheNight = moment(sunnahTimes.middleOfTheNight)
  .tz('America/New_York')
  .format('h:mm A');
var lastThirdOfTheNight = moment(sunnahTimes.lastThirdOfTheNight)
  .tz('America/New_York')
  .format('h:mm A');
```

### Qibla Direction

Get the direction, in degrees from North, of the Qibla from a given set of coordinates.

```js
var coordinates = new Coordinates(35.78056, -78.6389);
var qiblaDirection = Qibla(coordinates);
```

## Contributing

Adhan is made publicly available to provide a well tested and well documented library for Islamic prayer times to all
developers. We accept feature contributions provided that they are properly documented and include the appropriate
unit tests. We are also looking for contributions in the form of unit tests of of prayer times for different
locations, we do ask that the source of the comparison values be properly documented.

**Note:** Commit messages should follow the [commit message convention](./.github/COMMIT_CONVENTIONS.md) so that changelogs can be automatically generated. Commit messages will be automatically validated upon commit. **If you are not familiar with the commit message convention, you should use `npm run commit` instead of `git commit`**, which provides an interactive CLI for generating proper commit messages.

## License

Adhan is available under the MIT license. See the LICENSE file for more info.

[badge-version]: https://img.shields.io/npm/v/adhan.svg
[badge-travis]: https://travis-ci.org/batoulapps/adhan-js.svg?branch=master
[badge-cov]: https://codecov.io/gh/batoulapps/adhan-js/branch/master/graph/badge.svg
[travis]: https://travis-ci.org/batoulapps/adhan-js
[npm]: https://www.npmjs.org/package/adhan
[codecov]: https://codecov.io/gh/batoulapps/adhan-js
