# Adhan Swift

The Adhan Swift implementation uses Swift 2.1

## Usage

To get prayer times initialize the ```PrayerTimes``` struct passing in coordinates,
date, and calculation parameters.

```swift
let prayers = PrayerTimes(coordinates: coordinates, date: date, calculationParameters: params)
```

### Initialization parameters

#### Coordinates

Create a ```Coordinates``` struct with the latitude and longitude for the location
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

The rest of the needed information is contained within the ```CalculationParameters``` struct.
Instead of manually initializing this struct it is recommended to use one of the pre-populated
instances by calling the ```params``` var on the ```CalculationMethod``` enum. You can then further
customize the calculation parameters if needed.

```swift
var params = CalculationMethod.MoonsightingCommittee.params
params.madhab = .Hanafi
```

### Prayer Times

Once the ```PrayerTimes``` struct has been initialized it will contain members
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