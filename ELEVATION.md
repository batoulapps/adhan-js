# Elevation

This document explains the `elevationFromHorizon` calculation parameter: what it means, how the adjustment is calculated, why only sunrise and sunset are adjusted, and the references used. See [issue #146](https://github.com/batoulapps/adhan-js/issues/146) for the original discussion.

- [Summary](#summary)
- [What the value means](#what-the-value-means)
- [What changes](#what-changes)
- [How the adjustment is calculated](#how-the-adjustment-is-calculated)
- [Why Fajr and Isha are not adjusted](#why-fajr-and-isha-are-not-adjusted)
- [Accuracy and limitations](#accuracy-and-limitations)
- [References](#references)

## Summary

An observer who is higher than the horizon they are looking at sees the sun rise earlier and set later than an observer at the same level as the horizon. Setting `elevationFromHorizon` to that height difference, in meters, adjusts sunrise, sunset, and Maghrib accordingly.

```js
const params = adhan.CalculationMethod.MuslimWorldLeague();
// 450 meters above both the eastern and western horizon
params.elevationFromHorizon = 450;
// or different values for the eastern (sunrise) and western (sunset) horizon
params.elevationFromHorizon = { sunrise: 450, sunset: 0 };
```

The default value is `0`, which leaves every prayer time unchanged.

## What the value means

`elevationFromHorizon` is the height of the observer **above the horizon they are looking at**, not their elevation above sea level. Mohammad Odeh describes three cases in section 4 of _Calculating Prayer Times_ [[2]](#references) (translated):

1. "The horizon of the elevated area is the sea or an area at sea level, as applies to some mountains, for example. In this case the equations above can be applied directly."
2. "The horizon of the elevated area is at the same height as the area, as applies to wide plateaus. The area may be 500 m above sea level, but the whole surrounding area is at the same height, so the view for the observer is level. In this case the elevation above sea level does not affect the time of sunrise or sunset, meaning the area must be treated as being at sea level."
3. "The area is between the two previous cases, such as an area at 1000 m while the surrounding areas are at 600 m. Then the height of the area must be taken as the difference between the two heights, i.e. only 400 m above sea level."

In other words:

| Situation                                           | Value                         |
| --------------------------------------------------- | ----------------------------- |
| Hill, tower, or mountain overlooking the sea        | Height above sea level        |
| City on a wide plateau (e.g. Denver, Mexico City)   | `0`                           |
| Town at 1000 m surrounded by land at 600 m          | `400`                         |
| Valley, or anywhere the horizon is above the viewer | `0`                           |
| Sea to the west, mountains to the east              | `{ sunrise: 0, sunset: 450 }` |

**Do not pass the altitude reported by a device's GPS or an elevation lookup for the user's coordinates.** For cities on plateaus such as Denver (1609 m), Mexico City (2240 m), Addis Ababa (2355 m), or Sana'a (2250 m), using the elevation above sea level would make sunset and Maghrib about 7 to 9 minutes too late, and sunrise about as much too early.

The `sunrise` value describes the eastern horizon and the `sunset` value describes the western horizon. A single number applies to both.

Hills, mountains, or buildings that block the view of the horizon are not taken into account, and negative values are not accepted. Odeh notes in section 7-2 that the sun disappearing behind a distant hill or mountain is not sunset, and that "neglecting mountains or high ground is what is practiced in calculating sunrise and sunset in all Islamic countries to our knowledge" [[2]](#references).

## What changes

| Time                                                        | Effect                                                      |
| ----------------------------------------------------------- | ----------------------------------------------------------- |
| Sunrise                                                     | Earlier, using the `sunrise` value                          |
| Sunset and Maghrib                                          | Later, using the `sunset` value                             |
| Fajr, Dhuhr, Asr, Isha                                      | Unchanged                                                   |
| Maghrib using `maghribAngle` (Tehran)                       | Unchanged                                                   |
| Isha using `ishaInterval`                                   | Follows Maghrib, since it is defined from it                |
| High latitude rules, Moonsighting Committee seasonal limits | Follow sunrise and sunset, since they are defined from them |
| Sunnah times                                                | Follow Maghrib, since the night starts there                |

Approximate shift of sunrise (earlier) and sunset (later) in minutes. The two are equal to within a few seconds.

| Latitude | Date   | 10 m | 100 m | 450 m | 1000 m | 2000 m |
| -------- | ------ | ---- | ----- | ----- | ------ | ------ |
| 0°       | Mar 20 | 0.5  | 1.4   | 3.0   | 4.5    | 6.3    |
| 0°       | Jun 21 | 0.5  | 1.6   | 3.3   | 4.9    | 6.9    |
| 21.4°N   | Mar 20 | 0.5  | 1.5   | 3.2   | 4.8    | 6.8    |
| 21.4°N   | Jun 21 | 0.5  | 1.7   | 3.6   | 5.3    | 7.5    |
| 36.3°N   | Mar 20 | 0.6  | 1.8   | 3.7   | 5.5    | 7.8    |
| 36.3°N   | Jun 21 | 0.6  | 2.0   | 4.3   | 6.5    | 9.2    |
| 51.5°N   | Mar 20 | 0.7  | 2.3   | 4.8   | 7.2    | 10.2   |
| 51.5°N   | Jun 21 | 0.9  | 3.0   | 6.5   | 9.7    | 13.8   |

## How the adjustment is calculated

### Standard sunrise and sunset

Sunrise and sunset are the times when the upper edge of the sun's disc is on the horizon. Since the horizon refracts the sun's light by about 0°34' and the sun's radius is about 0°16', this happens when the center of the sun is at a true altitude of

```
h0 = -0°50' = -0.8333°
```

This is from _Astronomical Algorithms_ chapter 15, page 101 [[1]](#references), and is what the library has always used.

### Elevated observer

An observer above their horizon sees the sun rise earlier and set later for two reasons, which Odeh gives in section 4 [[2]](#references) (translated):

> The horizon is lowered for the observer as a result of elevation above sea level, so an observer in an area above sea level sees the sun rise before an observer at sea level, and sees it set after it has set for the observer at sea level. The value of the dip of the horizon in degrees for an observer at a height of h meters is calculated by the following equation:
>
> D' = 0.02917° √h
>
> When the observer is above sea level, the sun's rays undergo an additional refraction given by the following equation:
>
> RR = 0.00617° √h
>
> So the total correction resulting from elevation above sea level is given by the following equation:
>
> D = 0.035333° √h ... (8)

The library lowers the sunrise and sunset altitude by equation (8):

```
h0 = -0.8333° - 0.035333° × √h
```

where `h` is `elevationFromHorizon` in meters. In arcminutes, the dip is 1.75'√h, the additional refraction is 0.37'√h, and the total is 2.12'√h. Odeh's worked example, a zenith angle of 91.948° at 1000 m, is reproduced in the tests. Odeh also subtracts the sun's horizontal parallax (0.0024°, under a second of time), which the library does not include, as before.

### Why the correction is larger than the dip

The dip of the horizon is the angle between the observer's level line of sight and their visible horizon. It is the quantity navigators subtract from sextant altitudes, and is 1.75'√h to 1.78'√h according to Odeh [[2]](#references) and Smart [[4]](#references). The sunrise and sunset correction is larger because of how the light from the sun reaches the observer.

Chauvenet describes the line of sight to the visible horizon in article 123 [[3]](#references):

> The curved path of a ray of light from the point T to the eye at A, is the same as that of a ray from A to T; and this is a portion of the whole path of a ray (as from a star S) which passes through the point A, and is tangent to the earth's surface at T.

Here A is the observer and T is the point on their visible horizon. When the sun is on the observer's visible horizon, its light travels along this ray, grazing the Earth at T. Beyond T, this is exactly the ray that an observer standing at sea level at T sees on their own horizon, which happens when the sun is at the standard -0°50' for them. The vertical at A is tilted from the vertical at T by the angle ACT at the center of the Earth (C), so for the observer at A the sun is lower than -0°50' by that angle.

Smart derives this angle in section 178 [[4]](#references), calling it φ and the dip θ. Assuming the light's path is a circular arc whose bending is a fraction β of φ, with β "deduced to be 1/13 approximately", he shows that φ(1 − 2β) = θ. That makes φ about 13/11 ≈ 1.18 times the dip, or about 2.1'√h. This agrees with Odeh's total of 2.12'√h: the dip plus the additional refraction. The geometric dip `cos(dip) = R / (R + h)` (about 1.93'√h), which ignores the atmosphere, would under-correct.

Put another way, the sun on the visible horizon is seen below the observer's level line of sight, so its light passes through more air and is refracted more than the standard 0°34'. Chauvenet notes this in article 157 when timing the sun touching the sea horizon: "the refraction should be taken for the zenith distance 90° + D", although for "so rude a method" at sea he uses the mean horizontal refraction instead [[3]](#references). Young explains where the additional refraction comes from: the light passes through the air below the observer twice, down to the point where it grazes the Earth and back up, so "the total refraction at the apparent horizon increases with eye height" [[7]](#references). For an observer 450 m above the sea, 37% of the refraction at the sea horizon comes from the air below them.

_The Air Almanac_ independently confirms the size of the correction. Its table 2 on page A151 gives the depression of the sun at sunrise and sunset for observers at various heights, starting from 0.8° at sea level [[8]](#references). Odeh's equation (8) agrees with every row to within 0.1°, while the geometric dip falls short:

| Height            | Table 2 | Odeh  | Geometric dip |
| ----------------- | ------- | ----- | ------------- |
| 500 ft (152 m)    | 1.3°    | 1.27° | 1.23°         |
| 1000 ft (305 m)   | 1.5°    | 1.45° | 1.39°         |
| 2000 ft (610 m)   | 1.7°    | 1.71° | 1.63°         |
| 5000 ft (1524 m)  | 2.2°    | 2.21° | 2.09°         |
| 10000 ft (3048 m) | 2.8°    | 2.78° | 2.61°         |
| 20000 ft (6096 m) | 3.6°    | 3.59° | 3.34°         |

## Why Fajr and Isha are not adjusted

Fajr and Isha are defined by a level of light in the sky, the first light of dawn spreading along the horizon and the disappearance of twilight. The angles specified by each calculation method are values that produce that level of light for an observer at the same elevation as their horizon. Whether they should change for an elevated observer has no settled answer. Odeh addresses this directly in section 7-4 [[2]](#references) (translated):

> It is known that sunrise and sunset are affected by elevation above sea level, and this is settled. As for whether the Fajr and Isha prayers are affected by elevation above sea level, this is still not fully resolved. Ilyas states in his book [14] that the greater the elevation above sea level, the thinner the atmosphere, so scattering decreases, and therefore the time of Fajr is delayed and the time of Isha is brought forward. On the other hand, Schaefer [21] affirmed that Fajr and Isha are not affected by elevation above sea level. Other references tend toward the effect of elevation on Fajr and Isha being negligible [19, 20]. From this we see the difference between the various opinions, and we see the need for a real study to determine the effect of elevation on Fajr and Isha. After reviewing the argument of each side, we lean toward Fajr and Isha not being affected by elevation above sea level.

Odeh's references are Ilyas's _Astronomy of Islamic Times for the Twenty-first Century_ [14], _The Air Almanac_ table 3 on page A151 [19], the _Supplement to the 1946 American Ephemeris_ [20], and a personal communication from Bradley Schaefer, a researcher on sky brightness and visibility [21]. In his high accuracy calculations (section 5-1), Odeh applies the elevation correction to sunrise and Maghrib only, and uses 90° + 18° for both Fajr and Isha.

_The Air Almanac_ is the only one of these that can be checked today. We could not find Ilyas's books or the 1946 supplement in digitized form, and Schaefer's comment was never published. Section 14 of _The Air Almanac_ explains [[8]](#references):

> The duration of twilight (i.e., the time between sunset and a particular level of illumination) will rapidly diminish as the height increases. It is difficult, however, to give numerical values, to the depressions corresponding at various heights to illuminations associated with particular twilights at ground level, owing both to limitations of physical theory and to the variety of practical applications. A particular level of illumination will, however, always be associated at a particular height with a particular value of the depression; once the user has determined, from experience, the depression corresponding to the height and the conditions of illumination he requires, the times can be found from the graphs in the same way as for rising and setting.

Its table 3 gives this depression for civil twilight (6°) alongside table 2 for sunrise and sunset. Over the heights where people live, civil twilight barely changes while sunrise and sunset change by up to 2°:

| Height            | Sunrise and sunset (table 2) | Civil twilight (table 3) |
| ----------------- | ---------------------------- | ------------------------ |
| 0                 | 0.8°                         | 6.0°                     |
| 1000 ft (305 m)   | 1.5°                         | 6.0°                     |
| 2000 ft (610 m)   | 1.7°                         | 6.1°                     |
| 5000 ft (1524 m)  | 2.2°                         | 6.2°                     |
| 10000 ft (3048 m) | 2.8°                         | 6.3°                     |

The almanac does not give values for the deeper twilight used for Fajr and Isha.

| Source                                                        | Effect of elevation on dawn                            |
| ------------------------------------------------------------- | ------------------------------------------------------ |
| Ilyas, as cited by Odeh                                       | Later                                                  |
| Schaefer, as cited by Odeh                                    | None                                                   |
| _Supplement to the 1946 American Ephemeris_, as cited by Odeh | Negligible                                             |
| _The Air Almanac_ [[8]](#references)                          | Earlier for civil twilight, but much less than sunrise |
| Odeh [[2]](#references)                                       | None                                                   |
| Muwaqqit [[5]](#references), Time4J [[6]](#references)        | Earlier, by the dip                                    |

The physical reason for the disagreement is that the argument above for sunrise and sunset applies exactly to something seen _on_ the horizon, such as the edge of the sun. Twilight is light scattered by air tens of kilometers up and hundreds of kilometers away. Raising the observer a few hundred meters barely changes how much of that air is lit by the sun, and only adds the strip of sky between their level line of sight and their lower horizon. The real effect depends on where in the sky the first light of dawn or the last light of dusk is perceived, and we found no measurements of this for Fajr and Isha.

The uncertainty in the twilight angles themselves is also much larger than the elevation correction. Calculation methods use angles from 14° to 20°, and each degree moves Fajr and Isha by roughly 4 minutes or more. Following Odeh, the library does not adjust Fajr, Isha, or an angle based Maghrib for elevation.

## Accuracy and limitations

- Refraction near the horizon depends on the temperature and pressure of the air. Meeus notes that "a change of temperature from winter to summer can shift the times of sunrise and sunset by about 20 seconds in mid-northern and mid-southern latitudes", and that a range of barometric pressures varies the times by "a dozen seconds" (page 101) [[1]](#references). The dip itself also depends on the temperature of the air between the observer and the horizon, as Chauvenet shows in article 123 [[3]](#references).
- Terrain is not modeled. The value describes a single height difference between the observer and a level horizon.
- The correction is only as good as the value supplied. An error in the height difference matters most for small values, since the correction grows with the square root of the height: at 100 m, an error of 50 m changes the times by about half a minute.

## References

1. Jean Meeus, _Astronomical Algorithms_, 2nd edition, Willmann-Bell, 1998. Chapter 15 "Rising, Transit, and Setting", page 101; chapter 13, page 96.
2. Mohammad Shawkat Odeh, _Calculating Prayer Times_ (حساب مواقيت الصلاة), International Astronomical Center, October 2001, revised September 2004. Sections 4, 5-1, 7-2, and 7-4. https://www.astronomycenter.net/article/2001_salat.html
3. William Chauvenet, _A Manual of Spherical and Practical Astronomy_, Volume I, J. B. Lippincott, 1891 (first published 1863). Articles 121 to 123 "Dip of the Horizon", pages 172 to 176, and article 157, page 220. https://archive.org/details/manualofspherica031436mbp
4. W. M. Smart, _Text-Book on Spherical Astronomy_, 4th edition, Cambridge University Press, 1944 (reprinted 1949). Section 178 "Corrections to the observed altitude", pages 317 to 318. https://archive.org/details/dli.ernet.240942
5. Muwaqqit documentation, Fajr and Isha. https://docs.muwaqqit.com
6. Time4J, `net.time4j.calendar.astro.SolarTime`. https://github.com/MenoData/Time4J
7. Andrew T. Young, "Sunset Science. IV. Low-Altitude Refraction", _The Astronomical Journal_ 127, 3622 to 3637, 2004. Sections 4.3 and 5. https://doi.org/10.1086/420806
8. HM Nautical Almanac Office and U.S. Naval Observatory, _The Air Almanac 2026_. Explanation section 14 "Corrections for Height of Observer", page A12, and tables 2 and 3 "Depression of Sun at Various Heights", page A151. https://aa.usno.navy.mil/downloads/publications/aira26_all.pdf
