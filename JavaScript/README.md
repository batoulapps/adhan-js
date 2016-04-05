# Adhan JavaScript

The Adhan JavaScript implementation is written to be compatible with the latest version of all major browsers.

## Usage

To get prayer times initialize a new `PrayerTimes` object passing in coordinates,
date, and calculation parameters.

```js
var prayerTimes = new PrayerTimes(coordinates, date, params);
```

### Initialization parameters

#### Coordinates

Create a `Coordinates` object with the latitude and longitude for the location
you want prayer times for.

```js
var coordinates = new Coordinates(35.78056, -78.6389);
```

#### Date

The date parameter passed in should be an instance of the JavaScript `Date`
object. The year, month, and day values need to be populated. All other
values will be ignored. The year, month and day values should be for the local date
that you want prayer times for. These date values are expected to be for the Gregorian calendar.

```js
var date = new Date();
var date = new Date(2015, 11, 1);
```

#### Calculation parameters

The rest of the needed information is contained within the `CalculationParameters` object.
Instead of manually initializing this object it is recommended to use one of the pre-populated
instances in the `CalculationMethod` object. You can then further
customize the calculation parameters if needed.

```js
var params = CalculationMethod.MuslimWorldLeague();
params.madhab = Madhab.Hanafi;
params.adjustments.fajr = 2;
```

| Parameter | Description |
| --------- | ----------- |
| method    | CalculationMethod name |
| fajrAngle | Angle of the sun used to calculate Fajr |
| ishaAngle | Angle of the sun used to calculate Isha |
| ishaInterval | Minutes after Maghrib (if set, the time for Isha will be Maghrib plus ishaInterval) |
| madhab | Value from the Madhab object, used to calculate Asr |
| highLatitudeRule | Value from the HighLatitudeRule object, used to set a minimum time for Fajr and a max time for Isha |
| adjustments | JavaScript object with custom prayer time adjustments in minutes for each prayer time |

**CalculationMethod**

| Value | Description |
| ----- | ----------- |
| MuslimWorldLeague | Muslim World League. Fajr angle: 18, Isha angle: 17 |
| Egyptian | Egyptian General Authority of Survey. Fajr angle: 19.5, Isha angle: 17.5 |
| Karachi | University of Islamic Sciences, Karachi. Fajr angle: 18, Isha angle: 18 |
| UmmAlQura | Umm al-Qura University, Makkah. Fajr angle: 18, Isha interval: 90. *Note: you should add a +30 minute custom adjustment for Isha during Ramadan.* |
| Gulf | The Gulf Region. Fajr angle: 19.5, Isha interval: 90. |
| MoonsightingCommittee | Moonsighting Committee. Fajr angle: 18, Isha angle: 18. Also uses seasonal adjustment values. |
| NorthAmerica | Referred to as the ISNA method. This method is included for completeness but is not recommended. Fajr angle: 15, Isha angle: 15 |
| Other | Fajr angle: 0, Isha angle: 0. This is the default value for `method` when initializing a `CalculationParameters` object. |

**Madhab**

| Value | Description |
| ----- | ----------- |
| Shafi | Earlier Asr time |
| Hanafi | Later Asr time |

**HighLatitudeRule**

| Value | Description |
| ----- | ----------- |
| MiddleOfTheNight | Fajr will never be earlier than the middle of the night and Isha will never be later than the middle of the night |
| SeventhOfTheNight | Fajr will never be earlier than the beginning of the last seventh of the night and Isha will never be later than the end of the first seventh of the night |
| TwilightAngle | Similar to SeventhOfTheNight, but instead of 1/7, the fraction of the night used is fajrAngle/60 and ishaAngle/60 |


### Prayer Times

Once the `PrayerTimes` object has been initialized it will contain values
for all five prayer times and the time for sunrise. The prayer times will be 
Date object instances initialized with UTC values. To display these
times for the local timezone, a formatting and timezone conversion extension
to the Date object has been provided. Call `formattedTime()` on the date
instances and pass in the UTC offset in hours for the appropriate timezone.
There is also a second optional parameter of style, if you pass in '24h' the
times will be formatted in 24 hour mode.

```js
prayerTimes.fajr.formattedTime(-4);
prayerTimes.fajr.formattedTime(-4, '24h');
```

## Full Example

```js
var date = new Date();
var coordinates = new Coordinates(35.78056, -78.6389);
var params = CalculationMethod.MuslimWorldLeague();
params.madhab = Madhab.Hanafi;
var prayerTimes = new PrayerTimes(coordinates, date, params);
document.write('Fajr: ' + prayerTimes.fajr.formattedTime(-4) + '\n');
document.write('Sunrise: ' + prayerTimes.sunrise.formattedTime(-4) + '\n');
document.write('Dhuhr: ' + prayerTimes.dhuhr.formattedTime(-4) + '\n');
document.write('Asr: ' + prayerTimes.asr.formattedTime(-4) + '\n');
document.write('Maghrib: ' + prayerTimes.maghrib.formattedTime(-4) + '\n');
document.write('Isha: ' + prayerTimes.isha.formattedTime(-4) + '\n');
```