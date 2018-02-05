//
//  Astronomical.swift
//  Adhan
//
//  Copyright © 2018 Batoul Apps. All rights reserved.
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.
//

import Foundation

struct Astronomical {

    /* The geometric mean longitude of the sun in degrees. */
    static func meanSolarLongitude(julianCentury T: Double) -> Double {
        /* Equation from Astronomical Algorithms page 163 */
        let term1 = 280.4664567
        let term2 = 36000.76983 * T
        let term3 = 0.0003032 * pow(T, 2)
        let L0 = term1 + term2 + term3
        return L0.unwindAngle()
    }

    /* The geometric mean longitude of the moon in degrees. */
    static func meanLunarLongitude(julianCentury T: Double) -> Double {
        /* Equation from Astronomical Algorithms page 144 */
        let term1 = 218.3165
        let term2 = 481267.8813 * T
        let Lp = term1 + term2
        return Lp.unwindAngle()
    }

    static func ascendingLunarNodeLongitude(julianCentury T: Double) -> Double {
        /* Equation from Astronomical Algorithms page 144 */
        let term1 = 125.04452
        let term2 = 1934.136261 * T
        let term3 = 0.0020708 * pow(T, 2)
        let term4 = pow(T, 3) / 450000
        let Ω = term1 - term2 + term3 + term4
        return Ω.unwindAngle()
    }

    /* The mean anomaly of the sun. */
    static func meanSolarAnomaly(julianCentury T: Double) -> Double {
        /* Equation from Astronomical Algorithms page 163 */
        let term1 = 357.52911
        let term2 = 35999.05029 * T
        let term3 = 0.0001537 * pow(T, 2)
        let M = term1 + term2 - term3
        return M.unwindAngle()
    }

    /* The Sun's equation of the center in degrees. */
    static func solarEquationOfTheCenter(julianCentury T: Double, meanAnomaly M: Double) -> Double {
        /* Equation from Astronomical Algorithms page 164 */
        let Mrad = M.degreesToRadians()
        let term1 = (1.914602 - (0.004817 * T) - (0.000014 * pow(T, 2))) * sin(Mrad)
        let term2 = (0.019993 - (0.000101 * T)) * sin(2 * Mrad)
        let term3 = 0.000289 * sin(3 * Mrad)
        return term1 + term2 + term3
    }

    /* The apparent longitude of the Sun, referred to the
     true equinox of the date. */
    static func apparentSolarLongitude(julianCentury T: Double, meanLongitude L0: Double) -> Double {
        /* Equation from Astronomical Algorithms page 164 */
        let longitude = L0 + Astronomical.solarEquationOfTheCenter(julianCentury: T, meanAnomaly: Astronomical.meanSolarAnomaly(julianCentury: T))
        let Ω = 125.04 - (1934.136 * T)
        let λ = longitude - 0.00569 - (0.00478 * sin(Ω.degreesToRadians()))
        return λ.unwindAngle()
    }

    /* The mean obliquity of the ecliptic, formula
     adopted by the International Astronomical Union.
     Represented in degrees. */
    static func meanObliquityOfTheEcliptic(julianCentury T: Double) -> Double {
        /* Equation from Astronomical Algorithms page 147 */
        let term1 = 23.439291
        let term2 = 0.013004167 * T
        let term3 = 0.0000001639 * pow(T, 2)
        let term4 = 0.0000005036 * pow(T, 3)
        return term1 - term2 - term3 + term4
    }

    /* The mean obliquity of the ecliptic, corrected for
     calculating the apparent position of the sun, in degrees. */
    static func apparentObliquityOfTheEcliptic(julianCentury T: Double, meanObliquityOfTheEcliptic ε0: Double) -> Double {
        /* Equation from Astronomical Algorithms page 165 */
        let O: Double = 125.04 - (1934.136 * T)
        return ε0 + (0.00256 * cos(O.degreesToRadians()))
    }

    /* Mean sidereal time, the hour angle of the vernal equinox, in degrees. */
    static func meanSiderealTime(julianCentury T: Double) -> Double {
        /* Equation from Astronomical Algorithms page 165 */
        let JD = (T * 36525) + 2451545.0
        let term1 = 280.46061837
        let term2 = 360.98564736629 * (JD - 2451545)
        let term3 = 0.000387933 * pow(T, 2)
        let term4 = pow(T, 3) / 38710000
        let θ = term1 + term2 + term3 - term4
        return θ.unwindAngle()
    }

    static func nutationInLongitude(solarLongitude L0: Double, lunarLongitude Lp: Double, ascendingNode Ω: Double) -> Double {
        /* Equation from Astronomical Algorithms page 144 */
        let term1 = (-17.2/3600) * sin(Ω.degreesToRadians())
        let term2 =  (1.32/3600) * sin(2 * L0.degreesToRadians())
        let term3 =  (0.23/3600) * sin(2 * Lp.degreesToRadians())
        let term4 =  (0.21/3600) * sin(2 * Ω.degreesToRadians())
        return term1 - term2 - term3 + term4
    }

    static func nutationInObliquity(solarLongitude L0: Double, lunarLongitude Lp: Double, ascendingNode Ω: Double) -> Double {
        /* Equation from Astronomical Algorithms page 144 */
        let term1 =  (9.2/3600) * cos(Ω.degreesToRadians())
        let term2 = (0.57/3600) * cos(2 * L0.degreesToRadians())
        let term3 = (0.10/3600) * cos(2 * Lp.degreesToRadians())
        let term4 = (0.09/3600) * cos(2 * Ω.degreesToRadians())
        return term1 + term2 + term3 - term4
    }

    static func altitudeOfCelestialBody(observerLatitude φ: Double, declination δ: Double, localHourAngle H: Double) -> Double {
        /* Equation from Astronomical Algorithms page 93 */
        let term1 = sin(φ.degreesToRadians()) * sin(δ.degreesToRadians())
        let term2 = cos(φ.degreesToRadians()) * cos(δ.degreesToRadians()) * cos(H.degreesToRadians())
        return asin(term1 + term2).radiansToDegrees()
    }

    static func approximateTransit(longitude L: Double, siderealTime Θ0: Double, rightAscension α2: Double) -> Double {
        /* Equation from page Astronomical Algorithms 102 */
        let Lw = L * -1
        return ((α2 + Lw - Θ0) / 360).normalizeWithBound(max: 1)
    }

    /* The time at which the sun is at its highest point in the sky (in universal time) */
    static func correctedTransit(approximateTransit m0: Double, longitude L: Double, siderealTime Θ0: Double,
                                 rightAscension α2: Double, previousRightAscension α1: Double, nextRightAscension α3: Double) -> Double {
        /* Equation from page Astronomical Algorithms 102 */
        let Lw = L * -1
        let θ = (Θ0 + (360.985647 * m0)).unwindAngle()
        let α = Astronomical.interpolateAngles(value: α2, previousValue: α1, nextValue: α3, factor: m0).unwindAngle()
        let H = (θ - Lw - α).closestAngle()
        let Δm = H / -360
        return (m0 + Δm) * 24
    }

    static func correctedHourAngle(approximateTransit m0: Double, angle h0: Double, coordinates: Coordinates, afterTransit: Bool, siderealTime Θ0: Double,
                                   rightAscension α2: Double, previousRightAscension α1: Double, nextRightAscension α3: Double,
                                   declination δ2: Double, previousDeclination δ1: Double, nextDeclination δ3: Double) -> Double {
        /* Equation from page Astronomical Algorithms 102 */
        let Lw = coordinates.longitude * -1
        let term1 = sin(h0.degreesToRadians()) - (sin(coordinates.latitude.degreesToRadians()) * sin(δ2.degreesToRadians()))
        let term2 = cos(coordinates.latitude.degreesToRadians()) * cos(δ2.degreesToRadians())
        let H0 = acos(term1 / term2).radiansToDegrees()
        let m = afterTransit ? m0 + (H0 / 360) : m0 - (H0 / 360)
        let θ = (Θ0 + (360.985647 * m)).unwindAngle()
        let α = Astronomical.interpolateAngles(value: α2, previousValue: α1, nextValue: α3, factor: m).unwindAngle()
        let δ = Astronomical.interpolate(value: δ2, previousValue: δ1, nextValue: δ3, factor: m)
        let H = (θ - Lw - α)
        let h = Astronomical.altitudeOfCelestialBody(observerLatitude: coordinates.latitude, declination: δ, localHourAngle: H)
        let term3 = h - h0
        let term4 = 360 * cos(δ.degreesToRadians()) * cos(coordinates.latitude.degreesToRadians()) * sin(H.degreesToRadians())
        let Δm = term3 / term4
        return (m + Δm) * 24
    }

    /* Interpolation of a value given equidistant
     previous and next values and a factor
     equal to the fraction of the interpolated
     point's time over the time between values. */
    static func interpolate(value y2: Double, previousValue y1: Double, nextValue y3: Double, factor n: Double) -> Double {
        /* Equation from Astronomical Algorithms page 24 */
        let a = y2 - y1
        let b = y3 - y2
        let c = b - a
        return y2 + ((n/2) * (a + b + (n * c)))
    }

    /* Interpolation of three angles, accounting for
     angle unwinding. */
    static func interpolateAngles(value y2: Double, previousValue y1: Double, nextValue y3: Double, factor n: Double) -> Double {
        /* Equation from Astronomical Algorithms page 24 */
        let a = (y2 - y1).unwindAngle()
        let b = (y3 - y2).unwindAngle()
        let c = b - a
        return y2 + ((n/2) * (a + b + (n * c)))
    }

    /* The Julian Day for a given Gregorian date. */
    static func julianDay(year: Int, month: Int, day: Int, hours: Double = 0) -> Double {

        /* Equation from Astronomical Algorithms page 60 */

        // NOTE: Casting to Int is done intentionally for the purpose of decimal truncation

        let Y: Int = month > 2 ? year : year - 1
        let M: Int = month > 2 ? month : month + 12
        let D: Double = Double(day) + (hours / 24)

        let A: Int = Y/100
        let B: Int = 2 - A + (A/4)

        let i0: Int = Int(365.25 * (Double(Y) + 4716))
        let i1: Int = Int(30.6001 * (Double(M) + 1))
        return Double(i0) + Double(i1) + D + Double(B) - 1524.5
    }

    /* Julian century from the epoch. */
    static func julianCentury(julianDay JD: Double) -> Double {
        /* Equation from Astronomical Algorithms page 163 */
        return (JD - 2451545.0) / 36525
    }

    /* Whether or not a year is a leap year (has 366 days). */
    static func isLeap(year: Int) -> Bool {
        if year % 4 != 0 {
            return false
        }

        if year % 100 == 0 && year % 400 != 0 {
            return false
        }

        return true
    }

    static func seasonAdjustedMorningTwilight(latitude: Double, day: Int, year: Int, sunrise: Date) -> Date {
        let a: Double = 75 + ((28.65 / 55.0) * fabs(latitude))
        let b: Double = 75 + ((19.44 / 55.0) * fabs(latitude))
        let c: Double = 75 + ((32.74 / 55.0) * fabs(latitude))
        let d: Double = 75 + ((48.10 / 55.0) * fabs(latitude))

        let adjustment: Double = {
            let dyy = Double(Astronomical.daysSinceSolstice(dayOfYear: day, year: year, latitude: latitude))
            if ( dyy < 91) {
                return a + ( b - a ) / 91.0 * dyy
            } else if ( dyy < 137) {
                return b + ( c - b ) / 46.0 * ( dyy - 91 )
            } else if ( dyy < 183 ) {
                return c + ( d - c ) / 46.0 * ( dyy - 137 )
            } else if ( dyy < 229 ) {
                return d + ( c - d ) / 46.0 * ( dyy - 183 )
            } else if ( dyy < 275 ) {
                return c + ( b - c ) / 46.0 * ( dyy - 229 )
            } else {
                return b + ( a - b ) / 91.0 * ( dyy - 275 )
            }
        }()

        return sunrise.addingTimeInterval(round(adjustment * -60.0))
    }

    static func seasonAdjustedEveningTwilight(latitude: Double, day: Int, year: Int, sunset: Date) -> Date {
        let a: Double = 75 + ((25.60 / 55.0) * fabs(latitude))
        let b: Double = 75 + ((2.050 / 55.0) * fabs(latitude))
        let c: Double = 75 - ((9.210 / 55.0) * fabs(latitude))
        let d: Double = 75 + ((6.140 / 55.0) * fabs(latitude))

        let adjustment: Double = {
            let dyy = Double(Astronomical.daysSinceSolstice(dayOfYear: day, year: year, latitude: latitude))
            if ( dyy < 91) {
                return a + ( b - a ) / 91.0 * dyy
            } else if ( dyy < 137) {
                return b + ( c - b ) / 46.0 * ( dyy - 91 )
            } else if ( dyy < 183 ) {
                return c + ( d - c ) / 46.0 * ( dyy - 137 )
            } else if ( dyy < 229 ) {
                return d + ( c - d ) / 46.0 * ( dyy - 183 )
            } else if ( dyy < 275 ) {
                return c + ( b - c ) / 46.0 * ( dyy - 229 )
            } else {
                return b + ( a - b ) / 91.0 * ( dyy - 275 )
            }
        }()

        return sunset.addingTimeInterval(round(adjustment * 60.0))
    }

    static func daysSinceSolstice(dayOfYear: Int, year: Int, latitude: Double) -> Int {
        var daysSinceSolstice = 0
        let northernOffset = 10
        let southernOffset = Astronomical.isLeap(year: year) ? 173 : 172
        let daysInYear = Astronomical.isLeap(year: year) ? 366 : 365

        if (latitude >= 0) {
            daysSinceSolstice = dayOfYear + northernOffset
            if (daysSinceSolstice >= daysInYear) {
                daysSinceSolstice = daysSinceSolstice - daysInYear
            }
        } else {
            daysSinceSolstice = dayOfYear - southernOffset
            if (daysSinceSolstice < 0) {
                daysSinceSolstice = daysSinceSolstice + daysInYear
            }
        }

        return daysSinceSolstice
    }
}
