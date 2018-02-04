//
//  SolarTime.swift
//  Adhan
//
//  Copyright © 2018 Batoul Apps. All rights reserved.
//

import Foundation

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
        var date = date
        date.hour = 0
        date.minute = 0

        let cal: Calendar = .gregorianUTC
        let today = cal.date(from: date)!

        let tomorrow = cal.date(byAdding: .day, value: 1, to: today)!
        let next = cal.dateComponents([.year, .month, .day], from: tomorrow)

        let yesterday = cal.date(byAdding: .day, value: -1, to: today)!
        let previous = cal.dateComponents([.year, .month, .day], from: yesterday)

        let prevSolar = SolarCoordinates(julianDay: previous.julianDate())
        let solar = SolarCoordinates(julianDay: date.julianDate())
        let nextSolar = SolarCoordinates(julianDay: next.julianDate())
        let m0 = Astronomical.approximateTransit(longitude: coordinates.longitude, siderealTime: solar.apparentSiderealTime, rightAscension: solar.rightAscension)
        let solarAltitude = -50.0 / 60.0

        self.date = date
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
