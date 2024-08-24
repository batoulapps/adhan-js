# Calculation Parameters Guide

## Calculation parameters

To calculate Prayer Times, a `CalculatonParameters` object is required. Instead of manually initializing this object it is recommended to use one of the pre-populated objects in the `CalculationMethod` object. You can then further customize the calculation parameters if needed.

```js
var params = adhan.CalculationMethod.MuslimWorldLeague();
params.madhab = adhan.Madhab.Hanafi;
params.polarCircleResolution = adhan.PolarCircleResolution.AqrabYaum;
params.adjustments.fajr = 2;
```

| Property              | Description                                                                                                                                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| method                | CalculationMethod name.                                                                                                                                                                                                |
| fajrAngle             | Angle of the sun used to calculate Fajr.                                                                                                                                                                               |
| maghribAngle          | Angle of the sun used to calculate Maghrib (this is used by the Tehran method).                                                                                                                                        |
| ishaAngle             | Angle of the sun used to calculate Isha.                                                                                                                                                                               |
| ishaInterval          | Minutes after Maghrib (if set, the time for Isha will be Maghrib plus ishaInterval).                                                                                                                                   |
| madhab                | Value from the Madhab object, used to calculate Asr. `Shafi` is the default value.                                                                                                                                     |
| highLatitudeRule      | Value from the HighLatitudeRule object, used to set a minimum time for Fajr and a max time for Isha.                                                                                                                   |
| highLatitudeFajrRule  | Value from the HighLatitudeFajrRule object, provides support for AqrabYaum during perpetual twilight in high latitude regions. `Default` is the default value which falls back to the value set for `HighLatitudeRule` |
| adjustments           | Object with custom prayer time adjustments (in minutes) for each prayer time.                                                                                                                                          |
| rounding              | The behavior for rounding prayer times. Either to nearest minute, to the higher minute, or none. `Nearest` is the default value.                                                                                       |
| polarCircleResolution | Value from the PolarCircleResolution object, strategy used to resolve undefined prayer times for areas located in polar circles. `Unresolved` is the default value.                                                    |
| shafaq                | Used by the MoonsightingCommittee method to determine how to calculate Isha. See explanation of values below. `General` is the default value.                                                                          |

#### CalculationMethod

| Value                                           | Description                                                                                                                                                                                                                                                                                                     |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| adhan.CalculationMethod.MuslimWorldLeague()     | Muslim World League. Standard Fajr time with an angle of 18°. Earlier Isha time with an angle of 17°.                                                                                                                                                                                                           |
| adhan.CalculationMethod.Egyptian()              | Egyptian General Authority of Survey. Early Fajr time using an angle 19.5° and a slightly earlier Isha time using an angle of 17.5°.                                                                                                                                                                            |
| adhan.CalculationMethod.Karachi()               | University of Islamic Sciences, Karachi. A generally applicable method that uses standard Fajr and Isha angles of 18°.                                                                                                                                                                                          |
| adhan.CalculationMethod.UmmAlQura()             | Umm al-Qura University, Makkah. Uses a fixed interval of 90 minutes from maghrib to calculate Isha. And a slightly earlier Fajr time with an angle of 18.5°. _Note: you should add a +30 minute custom adjustment for Isha during Ramadan._                                                                     |
| adhan.CalculationMethod.Dubai()                 | Used in the UAE. Slightly earlier Fajr time and slightly later Isha time with angles of 18.2° for Fajr and Isha in addition to 3 minute offsets for sunrise, Dhuhr, Asr, and Maghrib.                                                                                                                           |
| adhan.CalculationMethod.Qatar()                 | Same Isha interval as `ummAlQura` but with the standard Fajr time using an angle of 18°.                                                                                                                                                                                                                        |
| adhan.CalculationMethod.Kuwait()                | Standard Fajr time with an angle of 18°. Slightly earlier Isha time with an angle of 17.5°.                                                                                                                                                                                                                     |
| adhan.CalculationMethod.MoonsightingCommittee() | Method developed by Khalid Shaukat, founder of Moonsighting Committee Worldwide. Uses standard 18° angles for Fajr and Isha in addition to seasonal adjustment values. This method automatically applies the 1/7 approximation rule for locations above 55° latitude. Recommended for North America and the UK. |
| adhan.CalculationMethod.Singapore()             | Used in Singapore, Malaysia, and Indonesia. Early Fajr time with an angle of 20° and standard Isha time with an angle of 18°.                                                                                                                                                                                   |
| adhan.CalculationMethod.Turkey()                | An approximation of the Diyanet method used in Turkey. This approximation is less accurate outside the region of Turkey.                                                                                                                                                                                        |
| adhan.CalculationMethod.Tehran()                | Institute of Geophysics, University of Tehran. Early Isha time with an angle of 14°. Slightly later Fajr time with an angle of 17.7°. Calculates Maghrib based on the sun reaching an angle of 4.5° below the horizon.                                                                                          |
| adhan.CalculationMethod.NorthAmerica()          | Also known as the ISNA method. Can be used for North America, but the moonsightingCommittee method is preferable. Gives later Fajr times and early Isha times with angles of 15°.                                                                                                                               |
| adhan.CalculationMethod.UnitedKingsom()         | Also known as the Wifaqul Ulama method. Used in the United Kingdom. Fajr is 18° and Aqrabul Yaum during perpetual twilight. Isha 15° and Seventh of the night during perpetual twilight conditions. Adds 4 minutes to Dhuhr and 5 minutes to Maghrib to factor refraction.                                      |
| adhan.CalculationMethod.Other()                 | Defaults to angles of 0°, should generally be used for making a custom method and setting your own values.                                                                                                                                                                                                      |

#### Madhab

| Value               | Description      |
| ------------------- | ---------------- |
| adhan.Madhab.Shafi  | Earlier Asr time |
| adhan.Madhab.Hanafi | Later Asr time   |

#### HighLatitudeRule

| Value                                    | Description                                                                                                                                                                                                                                                                         |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| adhan.HighLatitudeRule.MiddleOfTheNight  | Fajr will never be earlier than the middle of the night and Isha will never be later than the middle of the night.                                                                                                                                                                  |
| adhan.HighLatitudeRule.SeventhOfTheNight | Fajr will never be earlier than the beginning of the last seventh of the night and Isha will never be later than the end of the first seventh of the night. This is recommended to use for locations above 48° latitude to prevent prayer times that would be difficult to perform. |
| adhan.HighLatitudeRule.TwilightAngle     | The night is divided into portions of roughly 1/3. The exact value is derived by dividing the fajr/isha angles by 60. This can be used to prevent difficult fajr and isha times at certain locations.                                                                               |

You can get the recommended High Latitude Rule for a location by calling the `adhan.HighLatitudeRule.recommended()` function and passing in the coordinates for the location.

#### PolarCircleResolution

| Value                                  | Description                                                                                            |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| adhan.PolarCircleResolution.AqrabBalad | Finds the closest location for which sunrise and sunset prayer times can be computed                   |
| adhan.PolarCircleResolution.AqrabYaum  | Finds the closest date (forward or backward) for which sunrise and sunset prayer times can be computed |
| adhan.PolarCircleResolution.Unresolved | (default) Leaves sunrise and sunset prayer times `undefined` when they can't be computed               |

#### Shafaq

Shafaq is used by the MoonsightingCommittee method to determine what type of twilight to use in order to determine the time for Isha.

| Value                | Description                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| adhan.Shafaq.General | General is a combination of Ahmer and Abyad. This is the defualt value and will provide more reasonable times for locations at higher latitudes.   |
| adhan.Shafaq.Ahmer   | Ahmer means the twilight is the red glow in the sky. Used by the Shafi, Maliki, and Hanbali madhabs. This generally produces an earlier Isha time. |
| adhan.Shafaq.Abyad   | Abyad means the twilight is the white glow in the sky. Used by the Hanafi madhab. This generally produces a later Isha time.                       |
