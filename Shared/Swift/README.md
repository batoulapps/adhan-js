# Adhan Swift

The Adhan Swift implementation uses Swift 4 and has an Objective-C compatible wrapper.

## Installation

### CocoaPods

Adhan supports [CocoaPods](https://cocoapods.org/). Simply add the following line to your [Podfile](https://guides.cocoapods.org/syntax/podfile.html):

```ruby
pod 'Adhan'
```

### Carthage

Adhan supports [Carthage](https://github.com/Carthage/Carthage). Simply add the following line to your [Cartfile](https://github.com/Carthage/Carthage/blob/master/Documentation/Artifacts.md#cartfile):

```ruby
github "batoulapps/Adhan" "master"
```



### Manual

You can also manually add Adhan.

- Download the source.
- Add Adhan.xcodeproj as a subproject in your app's project.
- Drag Adhan.framework to "Linked Frameworks and Libraries" in your app's target.


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
let cal = Calendar(identifier: Calendar.Identifier.gregorian)
let date = cal.dateComponents([.year, .month, .day], from: Date())
```

#### Calculation parameters

The rest of the needed information is contained within the `CalculationParameters` struct.
Instead of manually initializing this struct it is recommended to use one of the pre-populated
instances by calling the `params` var on the `CalculationMethod` enum. You can then further
customize the calculation parameters if needed.

```swift
var params = CalculationMethod.moonsightingCommittee.params
params.madhab = .hanafi
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
| muslimWorldLeague | Muslim World League. Fajr angle: 18, Isha angle: 17 |
| egyptian | Egyptian General Authority of Survey. Fajr angle: 19.5, Isha angle: 17.5 |
| karachi | University of Islamic Sciences, Karachi. Fajr angle: 18, Isha angle: 18 |
| ummAlQura | Umm al-Qura University, Makkah. Fajr angle: 18.5, Isha interval: 90. *Note: you should add a +30 minute custom adjustment for Isha during Ramadan.* |
| gulf | Modified version of Umm al-Qura used in UAE. Fajr angle: 19.5, Isha interval: 90. |
| qatar | Modified version of Umm al-Qura used in Qatar. Fajr angle: 18, Isha interval: 90. |
| kuwait | Method used by the country of Kuwait. Fajr angle: 18, Isha angle: 17.5 |
| moonsightingCommittee | Moonsighting Committee. Fajr angle: 18, Isha angle: 18. Also uses seasonal adjustment values. |
| northAmerica | Referred to as the ISNA method. This method is included for completeness but is not recommended. Fajr angle: 15, Isha angle: 15 |
| other | Fajr angle: 0, Isha angle: 0. This is the default value for `method` when initializing a `CalculationParameters` struct. |

**Madhab**

| Value | Description |
| ----- | ----------- |
| shafi | Earlier Asr time |
| hanafi | Later Asr time |

**HighLatitudeRule**

| Value | Description |
| ----- | ----------- |
| middleOfTheNight | Fajr will never be earlier than the middle of the night and Isha will never be later than the middle of the night |
| seventhOfTheNight | Fajr will never be earlier than the beginning of the last seventh of the night and Isha will never be later than the end of the first seventh of the night |
| twilightAngle | Similar to SeventhOfTheNight, but instead of 1/7, the fraction of the night used is fajrAngle/60 and ishaAngle/60 |


### Prayer Times

Once the `PrayerTimes` struct has been initialized it will contain members
for all five prayer times and the time for sunrise. The prayer times will be instances
of NSDate and as such will refer to a fixed point in universal time. To display these
times for the local timezone you will need to create a date formatter and set
the appropriate timezone.

```swift
let formatter = DateFormatter()
formatter.timeStyle = .medium
formatter.timeZone = TimeZone(identifier: "America/New_York")!

NSLog("fajr %@", formatter.string(from: prayers.fajr))
```

## Full Example

```swift
let cal = Calendar(identifier: Calendar.Identifier.gregorian)
let date = cal.dateComponents([.year, .month, .day], from: Date())
let coordinates = Coordinates(latitude: 35.78056, longitude: -78.6389)
var params = CalculationMethod.moonsightingCommittee.params
params.madhab = .hanafi
if let prayers = PrayerTimes(coordinates: coordinates, date: date, calculationParameters: params) {
    let formatter = DateFormatter()
    formatter.timeStyle = .medium
    formatter.timeZone = TimeZone(identifier: "America/New_York")!
    
    NSLog("fajr %@", formatter.string(from: prayers.fajr))
    NSLog("sunrise %@", formatter.string(from: prayers.sunrise))
    NSLog("dhuhr %@", formatter.string(from: prayers.dhuhr))
    NSLog("asr %@", formatter.string(from: prayers.asr))
    NSLog("maghrib %@", formatter.string(from: prayers.maghrib))
    NSLog("isha %@", formatter.string(from: prayers.isha))
}
```