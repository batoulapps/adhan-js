# Adhan JS

[![badge-version][]][npm]

Adhan JS is a well tested and well documented library for calculating Islamic prayer times in JavaScript using Node or a web browser.

All astronomical calculations are high precision equations directly from the book _“Astronomical Algorithms” by Jean Meeus_. This book is recommended by the Astronomical Applications Department of the U.S. Naval Observatory and the Earth System Research Laboratory of the National Oceanic and Atmospheric Administration.

Implementations of Adhan in other languages can be found in the parent repo [Adhan](https://github.com/batoulapps/Adhan).

## Features

- 📦 **Dual Package Support:** Native distribution for both modern ES Modules (`import`) and legacy CommonJS (`require`).
- 🚀 **Environment Agnostic:** Runs flawlessly across Node.js, modern browsers, Bun, Deno, and frameworks like Next.js or Vite.
- ⛑️ **Type Safe:** Ships with native TypeScript declarations included out of the box.
- 🎯 **High Precision:** Implements strict, rigorous astronomical algorithms for pinpoint accuracy.

---

## Installation

Adhan was designed to work seamlessly in both browser and server environments.

### Browser

We provide both ESM and UMD bundles for native use in the browser via CDN.

#### ES Modules

```html
<script type="module">
  import {
    Coordinates,
    CalculationMethod,
    PrayerTimes,
  } from 'https://unpkg.com/adhan/lib/bundles/adhan.esm.js';

  const coordinates = new Coordinates(35.789751, -78.691249);
  const params = CalculationMethod.NorthAmerica();
  const prayerTimes = new PrayerTimes(coordinates, new Date(), params);

  console.log(prayerTimes.fajr);
</script>
```

#### UMD global

```html
<script src="https://unpkg.com/adhan/lib/bundles/adhan.umd.min.js"></script>
<script>
  const coordinates = new adhan.Coordinates(35.789751, -78.691249);
  const params = adhan.CalculationMethod.NorthAmerica();
  const prayerTimes = new adhan.PrayerTimes(coordinates, new Date(), params);
</script>
```

### Node

Install the package via your preferred package manager.

```
npm install adhan
```

#### ES Modules

```js
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

const coordinates = new Coordinates(35.789751, -78.691249);
const params = CalculationMethod.MoonsightingCommittee();
const prayerTimes = new PrayerTimes(coordinates, new Date(), params);

console.log(prayerTimes.fajr);
```

#### CommonJS

```js
const adhan = require('adhan');

const coordinates = new adhan.Coordinates(35.789751, -78.691249);
const params = adhan.CalculationMethod.MoonsightingCommittee();
const prayerTimes = new adhan.PrayerTimes(coordinates, new Date(), params);

console.log(prayerTimes.fajr);
```

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

The date parameter passed in should be an instance of the JavaScript `Date` object. The year, month, and day values need to be populated. All other values will be ignored. The year, month and day values should be for the date that you want prayer times for. These date values are expected to be for the Gregorian calendar.

```js
const date = new Date(); // current date
const date = new Date(2026, 0, 1); // specific date
```

#### Calculation parameters

The rest of the needed information is contained within the `CalculationParameters` object.

[Calculation Parameters & Methods Guide](METHODS.md)

### Prayer Times

The `PrayerTimes` object outputs raw JavaScript `Date` instances initialized to absolute UTC values.

Never assume the user's local device timezone matches the calculation coordinates. Always format prayer times with a specific Time Zone Identifier (e.g., `Europe/London` or `America/New_York`) to ensure the times display correctly and match with local daylight savings time (DST) adjustments.

We highly recommend utilizing the modern, native Temporal API (with a fallback polyfill if your target environment requires it):

```js
Temporal.Instant.fromEpochMilliseconds(prayerTimes.fajr)
  .toZonedDateTimeISO('America/New_York')
  .toLocaleString('en-US', { hour: 'numeric', minute: '2-digit' });
```

### Convenience Utilities

The `PrayerTimes` object has functions for getting the current prayer and the next prayer. You can also get the time for a specified prayer, making it easier to dynamically show countdowns until the next prayer.

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

var middleOfTheNight = Temporal.Instant.fromEpochMilliseconds(
  sunnahTimes.middleOfTheNight,
)
  .toZonedDateTimeISO('America/New_York')
  .toLocaleString('en-US', { hour: 'numeric', minute: '2-digit' });

var lastThirdOfTheNight = Temporal.Instant.fromEpochMilliseconds(
  sunnahTimes.lastThirdOfTheNight,
)
  .toZonedDateTimeISO('America/New_York')
  .toLocaleString('en-US', { hour: 'numeric', minute: '2-digit' });
```

### Qibla Direction

Get the direction, in degrees from North, of the Qibla from a given set of coordinates.

```js
var coordinates = new Coordinates(35.78056, -78.6389);
var qiblaDirection = Qibla(coordinates);
```

### Full Example

See `example.html` for a full browser based example.

## Migration

Migrating from version 3.x? Read the [migration guide](MIGRATION.md)

## Contributing

Adhan is made publicly available to provide a well tested and well documented library for Islamic prayer times to all developers. We accept feature contributions provided that they are properly documented and include the appropriate unit tests. We are also looking for contributions in the form of unit tests of of prayer times for different locations, we do ask that the source of the comparison values be properly documented.

**Note:** Commit messages should follow the [commit message convention](./.github/COMMIT_CONVENTIONS.md) so that changelogs can be automatically generated. Commit messages will be automatically validated upon commit. **If you are not familiar with the commit message convention, you should use `npm run commit` instead of `git commit`**, which provides an interactive CLI for generating proper commit messages.

## License

Adhan is available under the MIT license. See the LICENSE file for more info.

[badge-version]: https://img.shields.io/npm/v/adhan.svg
[npm]: https://www.npmjs.org/package/adhan
