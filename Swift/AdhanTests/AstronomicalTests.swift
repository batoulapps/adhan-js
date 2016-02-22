//
//  AstronomicalTests.swift
//  Adhan
//
//  Created by Ameir Al-Zoubi on 2/21/16.
//  Copyright © 2016 Batoul Apps. All rights reserved.
//

import XCTest
@testable import Adhan

class AstronomicalTests: XCTestCase {
    
    func testSolarCoordinates() {
        
        // values from Astronomical Algorithms page 165
        
        var jd = julianDay(year: 1992, month: 10, day: 13)
        var solar = SolarCoordinates(julianDay: jd)
        
        var T = julianCentury(julianDay: jd)
        var L0 = meanSolarLongitude(julianCentury: T)
        var ε0 = meanObliquityOfTheEcliptic(julianCentury: T)
        let εapp = apparentObliquityOfTheEcliptic(julianCentury: T, meanObliquityOfTheEcliptic: ε0)
        let M = meanSolarAnomaly(julianCentury: T)
        let C = solarEquationOfTheCenter(julianCentury: T, meanAnomaly: M)
        let λ = apparentSolarLongitude(julianCentury: T, meanLongitude: L0)
        let δ = solar.declination
        let α = solar.rightAscension
        
        XCTAssertEqualWithAccuracy(T, -0.072183436,
            accuracy: 0.00000000001)
        
        XCTAssertEqualWithAccuracy(L0, 201.80720,
            accuracy: 0.00001)
        
        XCTAssertEqualWithAccuracy(ε0, 23.44023,
            accuracy: 0.00001)
        
        XCTAssertEqualWithAccuracy(εapp, 23.43999,
            accuracy: 0.00001)
        
        XCTAssertEqualWithAccuracy(M, 278.99397,
            accuracy: 0.00001)
        
        XCTAssertEqualWithAccuracy(C, -1.89732,
            accuracy: 0.00001)
        
        // lower accuracy than desired
        XCTAssertEqualWithAccuracy(λ, 199.90895,
            accuracy: 0.00002)
        
        XCTAssertEqualWithAccuracy(δ, -7.78507,
            accuracy: 0.00001)
        
        XCTAssertEqualWithAccuracy(α, 198.38083,
            accuracy: 0.00001)
        
        // values from Astronomical Algorithms page 88
        
        jd = julianDay(year: 1987, month: 4, day: 10)
        solar = SolarCoordinates(julianDay: jd)
        T = julianCentury(julianDay: jd)
        
        let θ0 = meanSiderealTime(julianCentury: T)
        let θapp = solar.apparentSiderealTime
        let Ω = ascendingLunarNodeLongitude(julianCentury: T)
        ε0 = meanObliquityOfTheEcliptic(julianCentury: T)
        L0 = meanSolarLongitude(julianCentury: T)
        let Lp = meanLunarLongitude(julianCentury: T)
        let ΔΨ = nutationInLongitude(julianCentury: T, solarLongitude: L0, lunarLongitude: Lp, ascendingNode: Ω)
        let Δε = nutationInObliquity(julianCentury: T, solarLongitude: L0, lunarLongitude: Lp, ascendingNode: Ω)
        let ε = ε0 + Δε
        
        XCTAssertEqualWithAccuracy(θ0, 197.693195,
            accuracy: 0.000001)
        
        XCTAssertEqualWithAccuracy(θapp, 197.6922295833,
            accuracy: 0.0001)
        
        // values from Astronomical Algorithms page 148
        
        XCTAssertEqualWithAccuracy(Ω, 11.2531,
            accuracy: 0.0001)
        
        XCTAssertEqualWithAccuracy(ΔΨ, -0.0010522,
            accuracy:  0.0001)
        
        XCTAssertEqualWithAccuracy(Δε, 0.0026230556,
            accuracy: 0.00001)
        
        XCTAssertEqualWithAccuracy(ε0, 23.4409463889,
            accuracy: 0.000001)
        
        XCTAssertEqualWithAccuracy(ε, 23.4435694444,
            accuracy: 0.00001)
    }
    
    func testAltitudeOfCelestialBody() {
        let φ = 38 + (55 / 60) + (17.0 / 3600)
        let δ = -6 - (43 / 60) - (11.61 / 3600)
        let H = 64.352133
        let h = altitudeOfCelestialBody(observerLatitude: φ, declination: δ, localHourAngle: H)
        XCTAssertEqualWithAccuracy(h, 15.1249,
            accuracy: 0.0001)
    }
    
    func testTransitAndHourAngle() {
        // values from Astronomical Algorithms page 103
        let longitude = -71.0833
        let Θ = 177.74208
        let α1 = 40.68021
        let α2 = 41.73129
        let α3 = 42.78204
        let m0 = approximateTransit(longitude: longitude, siderealTime: Θ, rightAscension: α2)
        
        XCTAssertEqualWithAccuracy(m0, 0.81965,
            accuracy: 0.00001)
        
        let transit = correctedTransit(approximateTransit: m0, longitude: longitude, siderealTime: Θ, rightAscension: α2, previousRightAscension: α1, nextRightAscension: α3) / 24
        
        XCTAssertEqualWithAccuracy(transit, 0.81980,
            accuracy: 0.00001)
        
        let δ1 = 18.04761
        let δ2 = 18.44092
        let δ3 = 18.82742
        
        let rise = correctedHourAngle(approximateTransit: m0, angle: -0.5667, coordinates: Coordinates(latitude: 42.3333, longitude: longitude), afterTransit: false, siderealTime: Θ,
            rightAscension: α2, previousRightAscension: α1, nextRightAscension: α3, declination: δ2, previousDeclination: δ1, nextDeclination: δ3) / 24
        XCTAssertEqualWithAccuracy(rise, 0.51766,
            accuracy: 0.00001)
    }
    
    func testSolarTime() {
        /*
        Comparison values generated from http://aa.usno.navy.mil/rstt/onedaytable?form=1&ID=AA&year=2015&month=7&day=12&state=NC&place=raleigh
        */
        
        let coordinates = Coordinates(latitude: 35 + 47/60, longitude: -78 - 39/60)
        let solar = SolarTime(date: date(year: 2015, month: 7, day: 12, hours: 0), coordinates: coordinates)
        
        let transit = solar.transit
        let sunrise = solar.sunrise
        let sunset = solar.sunset
        let twilightStart = solar.hourAngle(-6, afterTransit: false)
        let twilightEnd = solar.hourAngle(-6, afterTransit: true)
        let invalid = solar.hourAngle(-36, afterTransit: true)
        XCTAssertEqual(twilightStart.timeString(), "9:38")
        XCTAssertEqual(sunrise.timeString(), "10:08")
        XCTAssertEqual(transit.timeString(), "17:20")
        XCTAssertEqual(sunset.timeString(), "24:32")
        XCTAssertEqual(twilightEnd.timeString(), "25:02")
        XCTAssertEqual(invalid.timeString(), "")
    }
    
    func testCalendricalDate() {
        // generated from http://aa.usno.navy.mil/data/docs/RS_OneYear.php for KUKUIHAELE, HAWAII
        let coordinates = Coordinates(latitude: 20 + 7/60, longitude: -155 - 34/60)
        let day1solar = SolarTime(date: date(year: 2015, month: 4, day: 2, hours: 0), coordinates: coordinates)
        let day2solar = SolarTime(date: date(year: 2015, month: 4, day: 3, hours: 0), coordinates: coordinates)
        
        let day1 = day1solar.sunrise
        let day2 = day2solar.sunrise
        
        XCTAssertEqual(day1.timeString(), "16:15")
        XCTAssertEqual(day2.timeString(), "16:14")
    }
    
    func testInterpolation() {
        
        // values from Astronomical Algorithms page 25
        
        let interpolatedValue = interpolate(value: 0.877366, previousValue: 0.884226, nextValue: 0.870531, factor: 4.35/24)
        XCTAssertEqualWithAccuracy(interpolatedValue, 0.876125,
            accuracy: 0.000001)
    }
    
    func testJulianDay() {
        /*
        Comparison values generated from http://aa.usno.navy.mil/data/docs/JulianDate.php
        */
        
        XCTAssertEqual(julianDay(year: 2010, month: 1, day: 2), 2455198.500000)
        XCTAssertEqual(julianDay(year: 2011, month: 2, day: 4), 2455596.500000)
        XCTAssertEqual(julianDay(year: 2012, month: 3, day: 6), 2455992.500000)
        XCTAssertEqual(julianDay(year: 2013, month: 4, day: 8), 2456390.500000)
        XCTAssertEqual(julianDay(year: 2014, month: 5, day: 10), 2456787.500000)
        XCTAssertEqual(julianDay(year: 2015, month: 6, day: 12), 2457185.500000)
        XCTAssertEqual(julianDay(year: 2016, month: 7, day: 14), 2457583.500000)
        XCTAssertEqual(julianDay(year: 2017, month: 8, day: 16), 2457981.500000)
        XCTAssertEqual(julianDay(year: 2018, month: 9, day: 18), 2458379.500000)
        XCTAssertEqual(julianDay(year: 2019, month: 10, day: 20), 2458776.500000)
        XCTAssertEqual(julianDay(year: 2020, month: 11, day: 22), 2459175.500000)
        XCTAssertEqual(julianDay(year: 2021, month: 12, day: 24), 2459572.500000)
        
        let jdVal = 2457215.67708333
        XCTAssertEqualWithAccuracy(julianDay(year: 2015, month: 7, day: 12, hours: 4.25), jdVal, accuracy: 0.000001)
        
        let components = NSDateComponents()
        components.year = 2015
        components.month = 7
        components.day = 12
        components.hour = 4
        components.minute = 15
        XCTAssertEqualWithAccuracy(components.julianDate(), jdVal, accuracy: 0.000001)
        
        XCTAssertEqualWithAccuracy(julianDay(year: 2015, month: 7, day: 12, hours: 8.0), 2457215.833333, accuracy: 0.000001)
        XCTAssertEqualWithAccuracy(julianDay(year: 1992, month: 10, day: 13, hours: 0.0), 2448908.5, accuracy: 0.000001)
    }
    
    func testJulianHours() {
        let j1 = julianDay(year: 2010, month: 1, day: 3)
        let j2 = julianDay(year: 2010, month: 1, day: 1, hours: 48)
        XCTAssertEqual(j1, j2)
    }
    
}
