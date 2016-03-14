# Adhan Java

Adhan Java is written to be compatible with Java and Android devices of all api versions. It compiles against Java 7 to ensure compatibility with Android. It has a small method overhead, and has no external dependencies.

## Usage

_Note - we intend to push this to jCenter in the near future insha'Allah, which should make this process much easier_.

To use this in your project, get the repository, then run `mvn install`. You can then use this in any gradle project by adding `mavenLocal()` under `repositories` and then using:

```
compile 'com.batoulapps.adhan:adhan:1.0-SNAPSHOT'
```

or in any maven project using:

```
<dependency>
   <groupId>com.batoulapps.adhan</groupId>
   <artifactId>adhan</artifactId>
   <version>1.0-SNAPSHOT</version>
</dependency>
```

To get prayer times, initialize a new `PrayerTimes` object passing in coordinates, date, and calculation parameters.

```java
PrayerTimes prayerTimes = new PrayerTimes(coordinates, date, params);
```

### Initialization parameters

#### Coordinates

Create a `Coordinates` object with the latitude and longitude for the location you want prayer times for.

```java
Coordinates coordinates = new Coordinates(35.78056, -78.6389);
```

#### Date

The date parameter passed in should be an instance of the `DateComponents` object. The year, month, and day values need to be populated. All other values will be ignored. The year, month and day values should be for the  local date that you want prayer times for. These date values are expected to be for the Gregorian calendar. There's also a convenience method for converting a `java.util.Date` to `DateComponents`.

```java
DateComponents date = new DateComponents(2015, 11, 1);
DateComponents date = DateComponents.from(new Date());
```

#### Calculation parameters

The rest of the needed information is contained within the `CalculationParameters` class. Instead of manually initializing this class, it is recommended to use one of the pre-populated instances in the `CalculationMethod` class. You can then further customize the calculation parameters if needed.

```java
CalculationParameters params =
     CalculationMethod.MUSLIM_WORLD_LEAGUE.getParameters();
params.madhab = Madhab.HANAFI;
params.adjustments.fajr = 2;
```

| Parameter | Description |
| --------- | ----------- |
| `method`    | CalculationMethod name |
| `fajrAngle` | Angle of the sun used to calculate Fajr |
| `ishaAngle` | Angle of the sun used to calculate Isha |
| `ishaInterval` | Minutes after Maghrib (if set, the time for Isha will be Maghrib plus ishaInterval) |
| `madhab` | Value from the Madhab object, used to calculate Asr |
| `highLatitudeRule` | Value from the HighLatitudeRule object, used to set a minimum time for Fajr and a max time for Isha |
| `adjustments` | JavaScript object with custom prayer time adjustments in minutes for each prayer time |

**CalculationMethod**

| Value | Description |
| ----- | ----------- |
| `MUSLIM_WORLD_LEAGUE` | Muslim World League. Fajr angle: 18, Isha angle: 17 |
| `EGYPTIAN` | Egyptian General Authority of Survey. Fajr angle: 19.5, Isha angle: 17.5 |
| `KARACHI` | University of Islamic Sciences, Karachi. Fajr angle: 18, Isha angle: 18 |
| `UMM_AL_QURA` | Umm al-Qura University, Makkah. Fajr angle: 18, Isha interval: 90. *Note: you should add a +30 minute custom adjustment for Isha during Ramadan.* |
| `GULF` | The Gulf Region. Fajr angle: 19.5, Isha interval: 90. |
| `MOONSIGHTING_COMMITTEE` | Moonsighting Committee. Fajr angle: 18, Isha angle: 18. Also uses seasonal adjustment values. |
| `NORTH_AMERICA` | Referred to as the ISNA method. This method is included for completeness but is not recommended. Fajr angle: 15, Isha angle: 15 |
| `KUWAIT` | Kuwait. Fajr angle: 18, Isha angle: 17.5 |
| `OTHER` | Fajr angle: 0, Isha angle: 0. This is the default value for `method` when initializing a `CalculationParameters` object. |

**Madhab**

| Value | Description |
| ----- | ----------- |
| `SHAFI` | Earlier Asr time |
| `HANAFI` | Later Asr time |

**HighLatitudeRule**

| Value | Description |
| ----- | ----------- |
| `MIDDLE_OF_THE_NIGHT` | Fajr will never be earlier than the middle of the night and Isha will never be later than the middle of the night |
| `SEVENTH_OF_THE_NIGHT` | Fajr will never be earlier than the beginning of the last seventh of the night and Isha will never be later than the end of the first seventh of the night |
| `TWILIGHT_ANGLE` | Similar to `SEVENTH_OF_THE_NIGHT`, but instead of 1/7, the fraction of the night used is fajrAngle/60 and ishaAngle/60 |


### Prayer Times

Once the `PrayerTimes` object has been initialized it will contain values
for all five prayer times and the time for sunrise. The prayer times will be 
Date object instances initialized with UTC values. To display these
times for the local timezone, a formatting and timezone conversion formatter
should be used, for example `java.text.SimpleDateFormat`.

```java
SimpleDateFormat formatter = new SimpleDateFormat("hh:mm a");
formatter.setTimeZone(TimeZone.getTimeZone("America/New_York"));
formatter.format(prayerTimes.fajr);
```

## Full Example

See an example in the `samples` module.
