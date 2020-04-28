# Adhan JavaScript

[![badge-version][]][npm] [![badge-travis][]][travis] [![badge-cov][]][codecov]

Adhan JavaScript is a well tested and well documented library for calculating Islamic prayer times in JavaScript using Node or a web browser.

All astronomical calculations are high precision equations directly from the book [“Astronomical Algorithms” by Jean Meeus](http://www.willbell.com/math/mc1.htm). This book is recommended by the Astronomical Applications Department of the U.S. Naval Observatory and the Earth System Research Laboratory of the National Oceanic and Atmospheric Administration.

Implementations of Adhan in other languages can be found in the parent repo [Adhan](https://github.com/batoulapps/Adhan).

## Installation

Adhan was designed to work in the browser and in Node.js

### Browser

```
<script src="Adhan.js"></script>
<script>
    var prayerTimes = new adhan.PrayerTimes(coordinates, date, params);
</script>
```

### Node

```
npm install adhan
```

```
var adhan = require('adhan')
var prayerTimes = new adhan.PrayerTimes(coordinates, date, params);
```

## Migration

Migrating from version 3.x? Read the [migration guide](MIGRATION.md)

## Usage

To get prayer times initialize a new `PrayerTimes` object passing in coordinates,
date, and calculation parameters.

```js
var prayerTimes = new adhan.PrayerTimes(coordinates, date, params);
```

### Initialization parameters

#### Coordinates

Create a `Coordinates` object with the latitude and longitude for the location
you want prayer times for.

```js
var coordinates = new adhan.Coordinates(35.78056, -78.6389);
```

#### Date

The date parameter passed in should be an instance of the JavaScript `Date`
object. The year, month, and day values need to be populated. All other
values will be ignored. The year, month and day values should be for the date
that you want prayer times for. These date values are expected to be for the 
Gregorian calendar.

```js
var date = new Date();
var date = new Date(2015, 11, 1);
```

#### Calculation parameters

The rest of the needed information is contained within the `CalculationParameters` object.
Instead of manually initializing this object it is recommended to use one of the pre-populated
objects in the `CalculationMethod` object. You can then further
customize the calculation parameters if needed.

```js
var params = adhan.CalculationMethod.MuslimWorldLeague();
params.madhab = adhan.Madhab.Hanafi;
params.adjustments.fajr = 2;
```

| Property | Description |
| --------- | ----------- |
| method    | CalculationMethod name |
| fajrAngle | Angle of the sun used to calculate Fajr |
| ishaAngle | Angle of the sun used to calculate Isha |
| ishaInterval | Minutes after Maghrib (if set, the time for Isha will be Maghrib plus ishaInterval) |
| madhab | Value from the Madhab object, used to calculate Asr |
| highLatitudeRule | Value from the HighLatitudeRule object, used to set a minimum time for Fajr and a max time for Isha |
| adjustments | Object with custom prayer time adjustments (in minutes) for each prayer time |

#### CalculationMethod

| Value | Description |
| ----- | ----------- |
| adhan.CalculationMethod.MuslimWorldLeague() | Muslim World League. Standard Fajr time with an angle of 18°. Earlier Isha time with an angle of 17°. |
| adhan.CalculationMethod.Egyptian() | Egyptian General Authority of Survey. Early Fajr time using an angle 19.5° and a slightly earlier Isha time using an angle of 17.5°. |
| adhan.CalculationMethod.Karachi() | University of Islamic Sciences, Karachi. A generally applicable method that uses standard Fajr and Isha angles of 18°. |
| adhan.CalculationMethod.UmmAlQura() | Umm al-Qura University, Makkah. Uses a fixed interval of 90 minutes from maghrib to calculate Isha. And a slightly earlier Fajr time with an angle of 18.5°. *Note: you should add a +30 minute custom adjustment for Isha during Ramadan.* |
| adhan.CalculationMethod.Dubai() | Used in the UAE. Slightly earlier Fajr time and slightly later Isha time with angles of 18.2° for Fajr and Isha in addition to 3 minute offsets for sunrise, Dhuhr, Asr, and Maghrib. |
| adhan.CalculationMethod.Qatar() | Same Isha interval as `ummAlQura` but with the standard Fajr time using an angle of 18°. |
| adhan.CalculationMethod.Kuwait() | Standard Fajr time with an angle of 18°. Slightly earlier Isha time with an angle of 17.5°. |
| adhan.CalculationMethod.MoonsightingCommittee() | Method developed by Khalid Shaukat, founder of Moonsighting Committee Worldwide. Uses standard 18° angles for Fajr and Isha in addition to seasonal adjustment values. This method automatically applies the 1/7 approximation rule for locations above 55° latitude. Recommended for North America and the UK. |
| adhan.CalculationMethod.Singapore() | Used in Singapore, Malaysia, and Indonesia. Early Fajr time with an angle of 20° and standard Isha time with an angle of 18°. |
| adhan.CalculationMethod.Turkey() | An approximation of the Diyanet method used in Turkey. This approximation is less accurate outside the region of Turkey. |
| adhan.CalculationMethod.Tehran() | Institute of Geophysics, University of Tehran. Early Isha time with an angle of 14°. Slightly later Fajr time with an angle of 17.7°. Calculates Maghrib based on the sun reaching an angle of 4.5° below the horizon. |
| adhan.CalculationMethod.NorthAmerica() | Also known as the ISNA method. Can be used for North America, but the moonsightingCommittee method is preferable. Gives later Fajr times and early Isha times with angles of 15°. |
| adhan.CalculationMethod.Other() | Defaults to angles of 0°, should generally be used for making a custom method and setting your own values. |

#### Madhab

| Value | Description |
| ----- | ----------- |
| adhan.Madhab.Shafi | Earlier Asr time |
| adhan.Madhab.Hanafi | Later Asr time |

#### HighLatitudeRule

| Value | Description |
| ----- | ----------- |
| adhan.HighLatitudeRule.MiddleOfTheNight | Fajr will never be earlier than the middle of the night and Isha will never be later than the middle of the night |
| adhan.HighLatitudeRule.SeventhOfTheNight | Fajr will never be earlier than the beginning of the last seventh of the night and Isha will never be later than the end of the first seventh of the night |
| adhan.HighLatitudeRule.TwilightAngle | Similar to SeventhOfTheNight, but instead of 1/7, the fraction of the night used is fajrAngle/60 and ishaAngle/60 |


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

```js
var date = new Date();
var coordinates = new adhan.Coordinates(35.78056, -78.6389);
var params = adhan.CalculationMethod.MuslimWorldLeague();
params.madhab = adhan.Madhab.Hanafi;
var prayerTimes = new adhan.PrayerTimes(coordinates, date, params);

var fajrTime = moment(prayerTimes.fajr).tz('America/New_York').format('h:mm A');
var sunriseTime = moment(prayerTimes.sunrise).tz('America/New_York').format('h:mm A');
var dhuhrTime = moment(prayerTimes.dhuhr).tz('America/New_York').format('h:mm A');
var asrTime = moment(prayerTimes.asr).tz('America/New_York').format('h:mm A');
var maghribTime = moment(prayerTimes.maghrib).tz('America/New_York').format('h:mm A');
var ishaTime = moment(prayerTimes.isha).tz('America/New_York').format('h:mm A');
```

### Convenience Utilities

The `PrayerTimes` object has functions for getting the current prayer and the next prayer. You can also get the time for a specified prayer, making it
easier to dynamically show countdowns until the next prayer.

```js
var prayerTimes = new adhan.PrayerTimes(coordinates, date, params);

var current = prayerTimes.currentPrayer();
var next = prayerTimes.nextPrayer();
var nextPrayerTime = prayerTimes.timeForPrayer(next);
```

### Sunnah Times

The Adhan library can also calulate Sunnah times. Given an instance of `PrayerTimes`, you can get a `SunnahTimes` object with the times for Qiyam.

```js
var sunnahTimes = new adhan.SunnahTimes(prayerTimes);
var middleOfTheNight = moment(sunnahTimes.middleOfTheNight).tz('America/New_York').format('h:mm A');
var lastThirdOfTheNight = moment(sunnahTimes.lastThirdOfTheNight).tz('America/New_York').format('h:mm A');
```

### Qibla Direction

Get the direction, in degrees from North, of the Qibla from a given set of coordinates.

```js
var coordinates = new adhan.Coordinates(35.78056, -78.6389);
var qiblaDirection = adhan.Qibla(coordinates);
```

## Contributing

Adhan is made publicly available to provide a well tested and well documented library for Islamic prayer times to all 
developers. We accept feature contributions provided that they are properly documented and include the appropriate 
unit tests. We are also looking for contributions in the form of unit tests of of prayer times for different 
locations, we do ask that the source of the comparison values be properly documented.

## License

Adhan is available under the MIT license. See the LICENSE file for more info.

[badge-version]: https://img.shields.io/npm/v/adhan.svg
[badge-travis]: https://travis-ci.org/batoulapps/adhan-js.svg?branch=master
[badge-cov]: https://codecov.io/gh/batoulapps/adhan-js/branch/master/graph/badge.svg
[travis]: https://travis-ci.org/batoulapps/adhan-js
[npm]: https://www.npmjs.org/package/adhan
[codecov]: https://codecov.io/gh/batoulapps/adhan-js
