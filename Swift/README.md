# Adhan Swift

The Adhan Swift implementation uses Swift 2

## Usage

To get prayer times initialize the `PrayerTimes` struct passing in coordinates,
date, and calculation parameters.

```swift
let prayers = PrayerTimes(coordinates: coordinates, date: date, calculationParameters: params)
```

### Initialization parameters

#### Coordinates

Create a `Coordinates` struct with the latitude and longitude for the location
you want prayer times for.

```swift
let coordinates = Coordinates(latitude: 35.78056, longitude: -78.6389)
```

#### Date

To avoid confusion with timezones the date parameter passed in should be an instance of
NSDateComponents. The year, month, and day components need to be populated. All other
components will be ignored. The year, month and day values should be for the local date
that you want prayer times for. These date components are expected to be for the Gregorian calendar.

```swift
let cal = NSCalendar(identifier: NSCalendarIdentifierGregorian)!
let date = cal.components([.Year, .Month, .Day], fromDate: NSDate())
```

#### Calculation parameters

The rest of the needed information is contained within the `CalculationParameters` struct.
Instead of manually initializing this struct it is recommended to use one of the pre-populated
instances by calling the `params` var on the `CalculationMethod` enum. You can then further
customize the calculation parameters if needed.

```swift
var params = CalculationMethod.MoonsightingCommittee.params
params.madhab = .Hanafi
params.adjustments.fajr = 2
```

| Parameter | Description |
| --------- | ----------- |
| method    | Member of CalculationMethod enum |
| fajrAngle | Angle of the sun used to calculate Fajr |
| ishaAngle | Angle of the sun used to calculate Isha |
| ishaInterval | Minutes after Maghrib (if set, the time for Isha will be Maghrib plus ishaInterval) |
| madhab | Member of the Madhab enum, used to calculate Asr |
| highLatitudeRule | Member of the HighLatitudeRule enum, used to set a minimum time for Fajr and a max time for Isha |
| adjustments | PrayerAdjustments struct with custom prayer time adjustments in minutes for each prayer time |

**CalculationMethod**

| Value | Description |
| ----- | ----------- |
| MuslimWorldLeague | Muslim World League. Fajr angle: 18, Isha angle: 17 |
| Egyptian | Egyptian General Authority of Survey. Fajr angle: 19.5, Isha angle: 17.5 |
| Karachi | University of Islamic Sciences, Karachi. Fajr angle: 18, Isha angle: 18 |
| UmmAlQura | Umm al-Qura University, Makkah. Fajr angle: 18.5, Isha interval: 90. *Note: you should add a +30 minute custom adjustment for Isha during Ramadan.* |
| Gulf | Modified version of Umm al-Qura used in UAE. Fajr angle: 19.5, Isha interval: 90. |
| Qatar | Modified version of Umm al-Qura used in Qatar. Fajr angle: 18, Isha interval: 90. |
| Kuwait | Method used by the country of Kuwait. Fajr angle: 18, Isha angle: 17.5 |
| MoonsightingCommittee | Moonsighting Committee. Fajr angle: 18, Isha angle: 18. Also uses seasonal adjustment values. |
| NorthAmerica | Referred to as the ISNA method. This method is included for completeness but is not recommended. Fajr angle: 15, Isha angle: 15 |
| Other | Fajr angle: 0, Isha angle: 0. This is the default value for `method` when initializing a `CalculationParameters` struct. |

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

Once the `PrayerTimes` struct has been initialized it will contain members
for all five prayer times and the time for sunrise. The prayer times will be instances
of NSDate and as such will refer to a fixed point in universal time. To display these
times for the local timezone you will need to create a date formatter and set
the appropriate timezone.

```swift
let formatter = NSDateFormatter()
formatter.timeStyle = .MediumStyle
formatter.timeZone = NSTimeZone(name: "America/New_York")!

NSLog("fajr %@", formatter.stringFromDate(prayers.fajr))
```

## Full Example

```swift
let cal = NSCalendar(identifier: NSCalendarIdentifierGregorian)!
let date = cal.components([.Year, .Month, .Day], fromDate: NSDate())
let coordinates = Coordinates(latitude: 35.78056, longitude: -78.6389)
var params = CalculationMethod.MoonsightingCommittee.params
params.madhab = .Hanafi
if let prayers = PrayerTimes(coordinates: coordinates, date: date, calculationParameters: params) {
    let formatter = NSDateFormatter()
    formatter.timeStyle = .MediumStyle
    formatter.timeZone = NSTimeZone(name: "America/New_York")!
    
    NSLog("fajr %@", formatter.stringFromDate(prayers.fajr))
    NSLog("sunrise %@", formatter.stringFromDate(prayers.sunrise))
    NSLog("dhuhr %@", formatter.stringFromDate(prayers.dhuhr))
    NSLog("asr %@", formatter.stringFromDate(prayers.asr))
    NSLog("maghrib %@", formatter.stringFromDate(prayers.maghrib))
    NSLog("isha %@", formatter.stringFromDate(prayers.isha))
}
```