# Calculation Parameters Guide

## Calculation parameters

To calculate Prayer Times, a `CalculatonParameters` object is required. Instead of manually initializing this object it is recommended to use one of the pre-populated objects in the `CalculationMethod` object. You can then further customize the calculation parameters if needed.

```js
var params = adhan.CalculationMethod.MuslimWorldLeague();
params.madhab = adhan.Madhab.Hanafi;
params.polarCircleResolution = adhan.PolarCircleResolution.AqrabYaum;
params.adjustments.fajr = 2;
```

| Property              | Description                                                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| method                | CalculationMethod name.                                                                                                                                             |
| fajrAngle             | Angle of the sun used to calculate Fajr.                                                                                                                            |
| maghribAngle          | Angle of the sun used to calculate Maghrib (this is used by the Tehran method).                                                                                     |
| ishaAngle             | Angle of the sun used to calculate Isha.                                                                                                                            |
| ishaInterval          | Minutes after Maghrib (if set, the time for Isha will be Maghrib plus ishaInterval).                                                                                |
| madhab                | Value from the Madhab object, used to calculate Asr. `Shafi` is the default value.                                                                                  |
| highLatitudeRule      | Value from the HighLatitudeRule object, used to set a minimum time for Fajr and a max time for Isha.                                                                |
| adjustments           | Object with custom prayer time adjustments (in minutes) for each prayer time.                                                                                       |
| rounding              | The behavior for rounding prayer times. Either to nearest minute, to the higher minute, or none. `Nearest` is the default value.                                    |
| polarCircleResolution | Value from the PolarCircleResolution object, strategy used to resolve undefined prayer times for areas located in polar circles. `AqrabBalad` is the default value. |
| shafaq                | Used by the MoonsightingCommittee method to determine how to calculate Isha. See explanation of values below. `General` is the default value.                       |
| elevationFromHorizon  | Height in meters of the observer above the horizon, used for sunrise and sunset. A number or `{ sunrise, sunset }`. `0` is the default value. See below.            |

#### CalculationMethod

| Value                                           | Description                                                                                                                                                                                                                                                                                                           |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| adhan.CalculationMethod.MuslimWorldLeague()     | Muslim World League. Standard Fajr time with an angle of 18°. Earlier Isha time with an angle of 17°.                                                                                                                                                                                                                 |
| adhan.CalculationMethod.Egyptian()              | Egyptian General Authority of Survey. Early Fajr time using an angle 19.5° and a slightly earlier Isha time using an angle of 17.5°.                                                                                                                                                                                  |
| adhan.CalculationMethod.Karachi()               | University of Islamic Sciences, Karachi. A generally applicable method that uses standard Fajr and Isha angles of 18°.                                                                                                                                                                                                |
| adhan.CalculationMethod.UmmAlQura()             | Umm al-Qura University, Makkah. Uses a fixed interval of 90 minutes from maghrib to calculate Isha. And a slightly earlier Fajr time with an angle of 18.5°. _Note: you should add a +30 minute custom adjustment for Isha during Ramadan._                                                                           |
| adhan.CalculationMethod.Dubai()                 | Used in the UAE. Slightly earlier Fajr time and slightly later Isha time with angles of 18.2° for Fajr and Isha in addition to 3 minute offsets for sunrise, Dhuhr, Asr, and Maghrib.                                                                                                                                 |
| adhan.CalculationMethod.Qatar()                 | Same Isha interval as `ummAlQura` but with the standard Fajr time using an angle of 18°.                                                                                                                                                                                                                              |
| adhan.CalculationMethod.Kuwait()                | Standard Fajr time with an angle of 18°. Slightly earlier Isha time with an angle of 17.5°.                                                                                                                                                                                                                           |
| adhan.CalculationMethod.MoonsightingCommittee() | Method developed by Khalid Shaukat, founder of Moonsighting Committee Worldwide. Uses standard 18° angles for Fajr and Isha in addition to seasonal adjustment values. This method automatically applies the 1/7 approximation rule for locations at or above 55° latitude. Recommended for North America and the UK. |
| adhan.CalculationMethod.Singapore()             | Used in Singapore, Malaysia, and Indonesia. Early Fajr time with an angle of 20° and standard Isha time with an angle of 18°.                                                                                                                                                                                         |
| adhan.CalculationMethod.Turkey()                | An approximation of the Diyanet method used in Turkey. This approximation is less accurate outside the region of Turkey.                                                                                                                                                                                              |
| adhan.CalculationMethod.Tehran()                | Institute of Geophysics, University of Tehran. Early Isha time with an angle of 14°. Slightly later Fajr time with an angle of 17.7°. Calculates Maghrib based on the sun reaching an angle of 4.5° below the horizon.                                                                                                |
| adhan.CalculationMethod.NorthAmerica()          | Also known as the ISNA method. Can be used for North America, but the moonsightingCommittee method is preferable. Gives later Fajr times and early Isha times with angles of 15°.                                                                                                                                     |
| adhan.CalculationMethod.Other()                 | Defaults to angles of 0°, should generally be used for making a custom method and setting your own values.                                                                                                                                                                                                            |

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

| Value                                  | Description                                                                                                                                                                  |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| adhan.PolarCircleResolution.AqrabBalad | (default) Finds the closest location for which sunrise and sunset prayer times can be computed                                                                               |
| adhan.PolarCircleResolution.AqrabYaum  | Finds the closest date (forward or backward) for which sunrise and sunset prayer times can be computed                                                                       |
| adhan.PolarCircleResolution.Unresolved | Leaves all prayer times as an invalid `Date` when they can't be computed. Check `prayerTimes.isValid` before using the times, see [README](README.md#polar-circle-locations) |

#### Shafaq

Shafaq is used by the MoonsightingCommittee method to determine what type of twilight to use in order to determine the time for Isha.

| Value                | Description                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| adhan.Shafaq.General | General is a combination of Ahmer and Abyad. This is the defualt value and will provide more reasonable times for locations at higher latitudes.   |
| adhan.Shafaq.Ahmer   | Ahmer means the twilight is the red glow in the sky. Used by the Shafi, Maliki, and Hanbali madhabs. This generally produces an earlier Isha time. |
| adhan.Shafaq.Abyad   | Abyad means the twilight is the white glow in the sky. Used by the Hanafi madhab. This generally produces a later Isha time.                       |

#### elevationFromHorizon

An observer who is higher than the horizon can see further around the curve of the Earth, so the sun rises earlier and sets later for them, and twilight begins earlier and ends later. `elevationFromHorizon` is the height in meters of the observer **above the horizon they are looking at**. It lowers the sunrise and sunset altitude and the Fajr, Isha, and Maghrib twilight angles by the dip of the horizon, using the `sunrise` value for Fajr and sunrise and the `sunset` value for sunset, Maghrib, and Isha. Times derived from these (Isha when using `ishaInterval`, and the night length used by high latitude rules and Sunnah times) shift with them. Dhuhr and Asr are not affected.

```js
var params = adhan.CalculationMethod.MuslimWorldLeague();
// 450 meters above both the eastern and western horizon
params.elevationFromHorizon = 450;
// or different values for the eastern (sunrise) and western (sunset) horizon
params.elevationFromHorizon = { sunrise: 450, sunset: 0 };
```

**This is not the elevation of the observer above sea level.** Do not pass the altitude reported by a device's GPS or an elevation lookup for the user's coordinates. A city on a plateau (e.g. Denver, Mexico City, Addis Ababa, or Sana'a) is at the same elevation as its horizon, so the correct value is `0`. Using its elevation above sea level would make sunset, Maghrib, and Isha about 6 to 7 minutes too late, and sunrise and Fajr about as much too early. Only use this value when the height above the horizon is actually known, such as a tower or hill with an open view of a sea level horizon.

The adjustment is the geometric dip of the horizon, `cos(dip) = R / (R + h)`, using the mean radius of the Earth `R = 6371 km`. It is subtracted from the standard sunrise and sunset altitude of `-0°50'` and added to the twilight angles. At mid latitudes, 450 meters moves sunrise, sunset, Fajr, and Isha by roughly 3 to 4 minutes. The calculation assumes nothing between the observer and the horizon rises above the line of sight, so only the height difference matters. Hills, buildings, or ridges that block part of the view are not taken into account.
