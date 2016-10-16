//
//  Adhan.swift
//  Adhan
//
//  Created by Ameir Al-Zoubi on 2/21/16.
//  Copyright © 2016 Batoul Apps. All rights reserved.
//

import Foundation

public enum Prayer {
    case fajr
    case sunrise
    case dhuhr
    case asr
    case maghrib
    case isha
    case none
}

/* Madhab for determining how Asr is calculated */
public enum Madhab {
    case shafi
    case hanafi
    
    var shadowLength: ShadowLength {
        switch(self) {
        case .shafi:
            return .single
        case .hanafi:
            return .double
        }
    }
}

/* Rule for approximating Fajr and Isha at high latitudes */
public enum HighLatitudeRule {
    case middleOfTheNight
    case seventhOfTheNight
    case twilightAngle
}

/* Latitude and longitude */
public struct Coordinates {
    let latitude: Double
    let longitude: Double
    
    public init(latitude: Double, longitude: Double) {
        self.latitude = latitude
        self.longitude = longitude
    }
}

/* Adjustment value for prayer times, in minutes */
public struct PrayerAdjustments {
    public var fajr: Int = 0
    public var sunrise: Int = 0
    public var dhuhr: Int = 0
    public var asr: Int = 0
    public var maghrib: Int = 0
    public var isha: Int = 0
    
    public init(fajr: Int = 0, sunrise: Int = 0, dhuhr: Int = 0, asr: Int = 0, maghrib: Int = 0, isha: Int = 0) {
        self.fajr = fajr
        self.sunrise = sunrise
        self.dhuhr = dhuhr
        self.asr = asr
        self.maghrib = maghrib
        self.isha = isha
    }
}

/* All customizable parameters for calculating prayer times */
public struct CalculationParameters {
    public var method: CalculationMethod = .other
    public var fajrAngle: Double
    public var ishaAngle: Double
    public var ishaInterval: Int = 0
    public var madhab: Madhab = .shafi
    public var highLatitudeRule: HighLatitudeRule = .middleOfTheNight
    public var adjustments: PrayerAdjustments = PrayerAdjustments()
    
    init(fajrAngle: Double, ishaAngle: Double) {
        self.fajrAngle = fajrAngle
        self.ishaAngle = ishaAngle
    }
    
    init(fajrAngle: Double, ishaInterval: Int) {
        self.init(fajrAngle: fajrAngle, ishaAngle: 0)
        self.ishaInterval = ishaInterval
    }
    
    init(fajrAngle: Double, ishaAngle: Double, method: CalculationMethod) {
        self.init(fajrAngle: fajrAngle, ishaAngle: ishaAngle)
        self.method = method
    }
    
    init(fajrAngle: Double, ishaInterval: Int, method: CalculationMethod) {
        self.init(fajrAngle: fajrAngle, ishaInterval: ishaInterval)
        self.method = method
    }
    
    func nightPortions() -> (fajr: Double, isha: Double) {
        switch self.highLatitudeRule {
        case .middleOfTheNight:
            return (1/2, 1/2)
        case .seventhOfTheNight:
            return (1/7, 1/7)
        case .twilightAngle:
            return (self.fajrAngle / 60, self.ishaAngle / 60)
        }
    }
}

/* Preset calculation parameters */
public enum CalculationMethod {
    
    // Muslim World League
    case muslimWorldLeague
    
    //Egyptian General Authority of Survey
    case egyptian
    
    // University of Islamic Sciences, Karachi
    case karachi
    
    // Umm al-Qura University, Makkah
    case ummAlQura
    
    // The Gulf Region
    case gulf
    
    // Moonsighting Committee
    case moonsightingCommittee
    
    // ISNA
    case northAmerica
    
    // Kuwait
    case kuwait
    
    // Qatar
    case qatar
    
    // Other
    case other
    
    public var params: CalculationParameters {
        switch(self) {
        case .muslimWorldLeague:
            return CalculationParameters(fajrAngle: 18, ishaAngle: 17, method: self)
        case .egyptian:
            return CalculationParameters(fajrAngle: 19.5, ishaAngle: 17.5, method: self)
        case .karachi:
            return CalculationParameters(fajrAngle: 18, ishaAngle: 18, method: self)
        case .ummAlQura:
            return CalculationParameters(fajrAngle: 18.5, ishaInterval: 90, method: self)
        case .gulf:
            return CalculationParameters(fajrAngle: 19.5, ishaInterval: 90, method: self)
        case .moonsightingCommittee:
            return CalculationParameters(fajrAngle: 18, ishaAngle: 18, method: self)
        case .northAmerica:
            return CalculationParameters(fajrAngle: 15, ishaAngle: 15, method: self)
        case .kuwait:
            return CalculationParameters(fajrAngle: 18, ishaAngle: 17.5, method: self)
        case .qatar:
            return CalculationParameters(fajrAngle: 18, ishaInterval: 90, method: self)
        case .other:
            return CalculationParameters(fajrAngle: 0, ishaAngle: 0, method: self)
        }
    }
}

/* Prayer times for a location and date using the given calculation parameters.
All prayer times are in UTC and should be display using an NSDateFormatter that
has the correct timezone set. */
public struct PrayerTimes {
    public let fajr: Date
    public let sunrise: Date
    public let dhuhr: Date
    public let asr: Date
    public let maghrib: Date
    public let isha: Date
    
    public init?(coordinates: Coordinates, date: DateComponents, calculationParameters: CalculationParameters) {
        
        var tempFajr: Date? = nil
        var tempSunrise: Date? = nil
        var tempDhuhr: Date? = nil
        var tempAsr: Date? = nil
        var tempMaghrib: Date? = nil
        var tempIsha: Date? = nil
        
        // all calculations are done using a gregorian calendar with the UTC timezone
        var cal = Calendar(identifier: Calendar.Identifier.gregorian)
        cal.timeZone = TimeZone(identifier: "UTC")!
        
        guard let prayerDate = cal.date(from: date) else {
            return nil
        }
        
        let solarTime = SolarTime(date: date, coordinates: coordinates)
        
        guard let transit = solarTime.transit.timeComponents()?.dateComponents(date),
            let sunriseComponents = solarTime.sunrise.timeComponents()?.dateComponents(date),
            let sunsetComponents = solarTime.sunset.timeComponents()?.dateComponents(date),
            let sunriseDate = cal.date(from: sunriseComponents),
            let sunsetDate = cal.date(from: sunsetComponents) else {
                // unable to determine transit, sunrise and sunset aborting calculations
                return nil
        }
        
        tempDhuhr = cal.date(from: transit)
        tempSunrise = cal.date(from: sunriseComponents)
        tempMaghrib = cal.date(from: sunsetComponents)
        
        if let asrComponents = solarTime.afternoon(shadowLength: calculationParameters.madhab.shadowLength).timeComponents()?.dateComponents(date) {
            tempAsr = cal.date(from: asrComponents)
        }
        
        // get night length
        let tomorrowSunrise = (cal as NSCalendar).date(byAdding: .day, value: 1, to: sunriseDate, options: [])
        guard let night = tomorrowSunrise?.timeIntervalSince(sunsetDate) else {
            return nil
        }
        
        if let fajrComponents = solarTime.hourAngle(angle: -calculationParameters.fajrAngle, afterTransit: false).timeComponents()?.dateComponents(date) {
            tempFajr = cal.date(from: fajrComponents)
        }
        
        // special case for moonsighting committee above latitude 55
        if calculationParameters.method == .moonsightingCommittee && coordinates.latitude >= 55 {
            let nightFraction = night / 7
            tempFajr = sunriseDate.addingTimeInterval(-nightFraction)
        }
        
        let safeFajr: Date = {
            if calculationParameters.method == .moonsightingCommittee {
                let dayOfYear = (cal as NSCalendar).ordinality(of: .day, in: .year, for: prayerDate)
                return Astronomical.seasonAdjustedMorningTwilight(latitude: coordinates.latitude, day: dayOfYear, year: date.year!, sunrise: sunriseDate)
            } else {
                let portion = calculationParameters.nightPortions().fajr
                let nightFraction = portion * night
                
                return sunriseDate.addingTimeInterval(-nightFraction)
            }
        }()
        
        if tempFajr == nil || tempFajr?.compare(safeFajr) == .orderedAscending {
            tempFajr = safeFajr
        }
        
        
        // Isha calculation with check against safe value
        if calculationParameters.ishaInterval > 0 {
            tempIsha = tempMaghrib?.addingTimeInterval(calculationParameters.ishaInterval.timeInterval())
        } else {
            if let ishaComponents = solarTime.hourAngle(angle: -calculationParameters.ishaAngle, afterTransit: true).timeComponents()?.dateComponents(date) {
                tempIsha = cal.date(from: ishaComponents)
            }
            
            // special case for moonsighting committee above latitude 55
            if calculationParameters.method == .moonsightingCommittee && coordinates.latitude >= 55 {
                let nightFraction = night / 7
                tempIsha = sunsetDate.addingTimeInterval(nightFraction)
            }
            
            let safeIsha: Date = {
                if calculationParameters.method == .moonsightingCommittee {
                    let dayOfYear = (cal as NSCalendar).ordinality(of: .day, in: .year, for: prayerDate)
                    return Astronomical.seasonAdjustedEveningTwilight(latitude: coordinates.latitude, day: dayOfYear, year: date.year!, sunset: sunsetDate)
                } else {
                    let portion = calculationParameters.nightPortions().isha
                    let nightFraction = portion * night
                    
                    return sunsetDate.addingTimeInterval(nightFraction)
                }
            }()
            
            if tempIsha == nil || tempIsha?.compare(safeIsha) == .orderedDescending {
                tempIsha = safeIsha
            }
        }
        
        
        // method based offsets
        let dhuhrOffset: TimeInterval = {
            switch(calculationParameters.method) {
            case .moonsightingCommittee:
                // Moonsighting Committee requires 5 minutes for
                // the sun to pass the zenith and dhuhr to enter
                return 5 * 60
            case .ummAlQura, .gulf, .qatar:
                // UmmAlQura and derivatives don't add
                // anything to zenith for dhuhr
                return 0
            default:
                // Default behavior waits 1 minute for the
                // sun to pass the zenith and dhuhr to enter
                return 60
            }
        }()
        
        let maghribOffset: TimeInterval = {
            switch(calculationParameters.method) {
            case .moonsightingCommittee:
                // Moonsighting Committee adds 3 minutes to
                // sunset time to account for light refraction
                return 3 * 60
            default:
                return 0
            }
        }()
        
        
        // if we don't have all prayer times then initialization failed
        guard let fajr = tempFajr,
            let sunrise = tempSunrise,
            let dhuhr = tempDhuhr,
            let asr = tempAsr,
            let maghrib = tempMaghrib,
            let isha = tempIsha else {
                return nil
        }
        
        
        // Assign final times to public struct members with all offsets
        self.fajr = fajr.addingTimeInterval(calculationParameters.adjustments.fajr.timeInterval()).roundedMinute()
        self.sunrise = sunrise.addingTimeInterval(calculationParameters.adjustments.sunrise.timeInterval()).roundedMinute()
        self.dhuhr = dhuhr.addingTimeInterval(calculationParameters.adjustments.dhuhr.timeInterval()).addingTimeInterval(dhuhrOffset).roundedMinute()
        self.asr = asr.addingTimeInterval(calculationParameters.adjustments.asr.timeInterval()).roundedMinute()
        self.maghrib = maghrib.addingTimeInterval(calculationParameters.adjustments.maghrib.timeInterval()).addingTimeInterval(maghribOffset).roundedMinute()
        self.isha = isha.addingTimeInterval(calculationParameters.adjustments.isha.timeInterval()).roundedMinute()
    }
    
    public func currentPrayer(at time: Date = Date()) -> Prayer {
        if isha.timeIntervalSince(time) <= 0 {
            return .isha
        } else if maghrib.timeIntervalSince(time) <= 0 {
            return .maghrib
        } else if asr.timeIntervalSince(time) <= 0 {
            return .asr
        } else if dhuhr.timeIntervalSince(time) <= 0 {
            return .dhuhr
        } else if sunrise.timeIntervalSince(time) <= 0 {
            return .sunrise
        } else if fajr.timeIntervalSince(time) <= 0 {
            return .fajr
        } else {
            return .none
        }
    }
    
    public func nextPrayer(at time: Date = Date()) -> Prayer {
        if isha.timeIntervalSince(time) <= 0 {
            return .none
        } else if maghrib.timeIntervalSince(time) <= 0 {
            return .isha
        } else if asr.timeIntervalSince(time) <= 0 {
            return .maghrib
        } else if dhuhr.timeIntervalSince(time) <= 0 {
            return .asr
        } else if sunrise.timeIntervalSince(time) <= 0 {
            return .dhuhr
        } else if fajr.timeIntervalSince(time) <= 0 {
            return .sunrise
        } else {
            return .fajr
        }
    }
    
    public func time(for prayer: Prayer) -> Date? {
        switch prayer {
        case .none:
            return nil
        case .fajr:
            return fajr
        case .sunrise:
            return sunrise
        case .dhuhr:
            return dhuhr
        case .asr:
            return asr
        case .maghrib:
            return maghrib
        case .isha:
            return isha
        }
    }
}

//
// MARK: Astronomical equations
//

struct SolarTime {
    
    let date: DateComponents
    let observer: Coordinates
    let solar: SolarCoordinates
    let transit: Double
    let sunrise: Double
    let sunset: Double
    
    private let prevSolar: SolarCoordinates
    private let nextSolar: SolarCoordinates
    private let approxTransit: Double
    
    init(date: DateComponents, coordinates: Coordinates) {
        // calculations need to occur at 0h0m UTC
        var midnightDate = date
        midnightDate.hour = 0
        midnightDate.minute = 0
        
        let cal = Calendar(identifier: Calendar.Identifier.gregorian)
        let today = cal.date(from: date)!
        
        let tomorrow = (cal as NSCalendar).date(byAdding: .day, value: 1, to: today, options: [])!
        let next = (cal as NSCalendar).components([.year, .month, .day], from: tomorrow)
        
        let yesterday = (cal as NSCalendar).date(byAdding: .day, value: -1, to: today, options: [])!
        let previous = (cal as NSCalendar).components([.year, .month, .day], from: yesterday)
        
        let prevSolar = SolarCoordinates(julianDay: previous.julianDate())
        let solar = SolarCoordinates(julianDay: date.julianDate())
        let nextSolar = SolarCoordinates(julianDay: next.julianDate())
        let m0 = Astronomical.approximateTransit(longitude: coordinates.longitude, siderealTime: solar.apparentSiderealTime, rightAscension: solar.rightAscension)
        let solarAltitude = -50.0 / 60.0
        
        self.date = midnightDate
        self.observer = coordinates
        self.solar = solar
        self.prevSolar = prevSolar
        self.nextSolar = nextSolar
        self.approxTransit = m0
        self.transit = Astronomical.correctedTransit(approximateTransit: m0, longitude: coordinates.longitude, siderealTime: solar.apparentSiderealTime,
            rightAscension: solar.rightAscension, previousRightAscension: prevSolar.rightAscension, nextRightAscension: nextSolar.rightAscension)
        self.sunrise = Astronomical.correctedHourAngle(approximateTransit: m0, angle: solarAltitude, coordinates: coordinates, afterTransit: false, siderealTime: solar.apparentSiderealTime,
            rightAscension: solar.rightAscension, previousRightAscension: prevSolar.rightAscension, nextRightAscension: nextSolar.rightAscension,
            declination: solar.declination, previousDeclination: prevSolar.declination, nextDeclination: nextSolar.declination)
        self.sunset = Astronomical.correctedHourAngle(approximateTransit: m0, angle: solarAltitude, coordinates: coordinates, afterTransit: true, siderealTime: solar.apparentSiderealTime,
            rightAscension: solar.rightAscension, previousRightAscension: prevSolar.rightAscension, nextRightAscension: nextSolar.rightAscension,
            declination: solar.declination, previousDeclination: prevSolar.declination, nextDeclination: nextSolar.declination)
    }
    
    func hourAngle(angle: Double, afterTransit: Bool) -> Double {
        return Astronomical.correctedHourAngle(approximateTransit: approxTransit, angle: angle, coordinates: observer, afterTransit: afterTransit, siderealTime: solar.apparentSiderealTime,
            rightAscension: solar.rightAscension, previousRightAscension: prevSolar.rightAscension, nextRightAscension: nextSolar.rightAscension,
            declination: solar.declination, previousDeclination: prevSolar.declination, nextDeclination: nextSolar.declination)
    }
    
    // hours from transit
    func afternoon(shadowLength: ShadowLength) -> Double {
        // TODO source shadow angle calculation
        let tangent = fabs(observer.latitude - solar.declination)
        let inverse = shadowLength.rawValue + tan(tangent.degreesToRadians())
        let angle = atan(1.0 / inverse).radiansToDegrees()
        
        return hourAngle(angle: angle, afterTransit: true)
    }
}

struct SolarCoordinates {
    
    /* The declination of the sun, the angle between
    the rays of the Sun and the plane of the Earth's
    equator, in degrees. */
    let declination: Double
    
    /* Right ascension of the Sun, the angular distance on the
    celestial equator from the vernal equinox to the hour circle,
    in degrees. */
    let rightAscension: Double
    
    /* Apparent sidereal time, the hour angle of the vernal
    equinox, in degrees. */
    let apparentSiderealTime: Double
    
    init(julianDay: Double) {
        
        let T = Astronomical.julianCentury(julianDay: julianDay)
        let L0 = Astronomical.meanSolarLongitude(julianCentury: T)
        let Lp = Astronomical.meanLunarLongitude(julianCentury: T)
        let Ω = Astronomical.ascendingLunarNodeLongitude(julianCentury: T)
        let λ = Astronomical.apparentSolarLongitude(julianCentury: T, meanLongitude: L0).degreesToRadians()
        
        let θ0 = Astronomical.meanSiderealTime(julianCentury: T)
        let ΔΨ = Astronomical.nutationInLongitude(solarLongitude: L0, lunarLongitude: Lp, ascendingNode: Ω)
        let Δε = Astronomical.nutationInObliquity(solarLongitude: L0, lunarLongitude: Lp, ascendingNode: Ω)
        
        let ε0 = Astronomical.meanObliquityOfTheEcliptic(julianCentury: T)
        let εapp = Astronomical.apparentObliquityOfTheEcliptic(julianCentury: T, meanObliquityOfTheEcliptic: ε0).degreesToRadians()
        
        /* Equation from Astronomical Algorithms page 165 */
        self.declination = asin(sin(εapp) * sin(λ)).radiansToDegrees()
        
        /* Equation from Astronomical Algorithms page 165 */
        self.rightAscension = atan2(cos(εapp) * sin(λ), cos(λ)).radiansToDegrees().unwindAngle()
        
        /* Equation from Astronomical Algorithms page 88 */
        self.apparentSiderealTime = θ0 + (((ΔΨ * 3600) * cos((ε0 + Δε).degreesToRadians())) / 3600)
    }
}

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
        
        // NOTE: Integer conversion is done intentionally for the purpose of decimal truncation
        
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

enum ShadowLength: Double {
    case single = 1.0
    case double = 2.0
}

//
// MARK: Math convenience extensions
//

struct TimeComponents {
    let hours: Int
    let minutes: Int
    let seconds: Int
    
    func dateComponents(_ date: DateComponents) -> DateComponents {
        var comps = DateComponents()
        comps.year = date.year
        comps.month = date.month
        comps.day = date.day
        comps.hour = self.hours
        comps.minute = self.minutes
        comps.second = self.seconds
        
        return comps
    }
}

extension Date {
    
    func roundedMinute() -> Date {
        let cal = Calendar(identifier: Calendar.Identifier.gregorian)
        var components = (cal as NSCalendar).components([.year, .month, .day, .hour, .minute, .second], from: self)
        
        let minute: Double = components.minute! != NSDateComponentUndefined ? Double(components.minute!) : 0
        let second: Double = components.second! != NSDateComponentUndefined ? Double(components.second!) : 0
        
        components.minute = Int(minute + round(second/60))
        components.second = 0
        
        return cal.date(from: components)!
    }
}

extension DateComponents {
    
    func julianDate() -> Double {
        let year = self.year ?? 0
        let month = self.month ?? 0
        let day = self.day ?? 0
        let hour: Double = Double(self.hour ?? 0)
        let minute: Double = Double(self.minute ?? 0)
        
        return Astronomical.julianDay(year: year, month: month, day: day, hours: hour + (minute / 60))
    }
}

extension Int {
    func timeInterval() -> TimeInterval {
        return Double(self) * 60
    }
}

extension Double {
    
    func degreesToRadians() -> Double {
        return (self * M_PI) / 180.0
    }
    
    func radiansToDegrees() -> Double {
        return (self * 180.0) / M_PI
    }
    
    func normalizeWithBound(max: Double) -> Double {
        return self - (max * (floor(self / max)))
    }
    
    func unwindAngle() -> Double {
        return self.normalizeWithBound(max: 360)
    }
    
    func closestAngle() -> Double {
        if self >= -180 && self <= 180 {
            return self
        }
        
        return self - (360 * (self/360).rounded())
    }
    
    func timeComponents() -> TimeComponents? {
        guard self.isNormal else {
            return nil
        }
        
        let hours = floor(self)
        let minutes = floor((self - hours) * 60)
        let seconds = floor((self - (hours + minutes/60)) * 60 * 60)
        
        return TimeComponents(hours: Int(hours), minutes: Int(minutes), seconds: Int(seconds))
    }
}
