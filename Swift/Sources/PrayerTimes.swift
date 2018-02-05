//
//  PrayerTimes.swift
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

/* Prayer times for a location and date using the given calculation parameters.
 All prayer times are in UTC and should be display using a DateFormatter that
 has the correct timezone set. */
public struct PrayerTimes {
    public let fajr: Date
    public let sunrise: Date
    public let dhuhr: Date
    public let asr: Date
    public let maghrib: Date
    public let isha: Date

    public let coordinates: Coordinates
    public let date: DateComponents
    public let calculationParameters: CalculationParameters

    public init?(coordinates: Coordinates, date: DateComponents, calculationParameters: CalculationParameters) {

        var tempFajr: Date? = nil
        var tempSunrise: Date? = nil
        var tempDhuhr: Date? = nil
        var tempAsr: Date? = nil
        var tempMaghrib: Date? = nil
        var tempIsha: Date? = nil
        let cal: Calendar = .gregorianUTC

        guard let prayerDate = cal.date(from: date), let tomorrowDate = cal.date(byAdding: .day, value: 1, to: prayerDate) else {
            return nil
        }

        let tomorrow = cal.dateComponents([.year, .month, .day], from: tomorrowDate)

        self.coordinates = coordinates
        self.date = date
        self.calculationParameters = calculationParameters

        let solarTime = SolarTime(date: date, coordinates: coordinates)
        let tomorrowSolarTime = SolarTime(date: tomorrow, coordinates: coordinates)

        guard let transit = solarTime.transit.timeComponents()?.dateComponents(date),
            let sunriseComponents = solarTime.sunrise.timeComponents()?.dateComponents(date),
            let sunsetComponents = solarTime.sunset.timeComponents()?.dateComponents(date),
            let sunriseDate = cal.date(from: sunriseComponents),
            let sunsetDate = cal.date(from: sunsetComponents),
            let tomorrowSunriseComponents = tomorrowSolarTime.sunrise.timeComponents()?.dateComponents(tomorrow),
            let tomorrowSunrise = cal.date(from: tomorrowSunriseComponents) else {
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
        let night = tomorrowSunrise.timeIntervalSince(sunsetDate)

        if let fajrComponents = solarTime.hourAngle(angle: -calculationParameters.fajrAngle, afterTransit: false).timeComponents()?.dateComponents(date) {
            tempFajr = cal.date(from: fajrComponents)
        }

        // special case for moonsighting committee above latitude 55
        if calculationParameters.method == .moonsightingCommittee && coordinates.latitude >= 55 {
            let nightFraction = night / 7
            tempFajr = sunriseDate.addingTimeInterval(-nightFraction)
        }

        let safeFajr: Date = {
            guard calculationParameters.method != .moonsightingCommittee else {
                let dayOfYear = cal.ordinality(of: .day, in: .year, for: prayerDate)
                return Astronomical.seasonAdjustedMorningTwilight(latitude: coordinates.latitude, day: dayOfYear!, year: date.year!, sunrise: sunriseDate)
            }

            let portion = calculationParameters.nightPortions().fajr
            let nightFraction = portion * night

            return sunriseDate.addingTimeInterval(-nightFraction)
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
                guard calculationParameters.method != .moonsightingCommittee else {
                    let dayOfYear = cal.ordinality(of: .day, in: .year, for: prayerDate)
                    return Astronomical.seasonAdjustedEveningTwilight(latitude: coordinates.latitude, day: dayOfYear!, year: date.year!, sunset: sunsetDate)
                }

                let portion = calculationParameters.nightPortions().isha
                let nightFraction = portion * night

                return sunsetDate.addingTimeInterval(nightFraction)
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
