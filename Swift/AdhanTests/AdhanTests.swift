//
//  AdhanTests.swift
//  AdhanTests
//
//  Created by Ameir Al-Zoubi on 2/21/16.
//  Copyright © 2016 Batoul Apps. All rights reserved.
//

import XCTest
@testable import Adhan

/* prayer times for comparison

http://www.mosken.se/b%C3%B6netider // Malmo, Sweden
http://www.uoif-online.com/horaires-de-prieres/ // Paris 12 degrees

*/

extension Double {
    func timeString() -> String {
        guard let comps = self.timeComponents() else {
            return ""
        }
        
        // round to the nearest minute
        let minutes = Int(Double(comps.minutes) + (Double(comps.seconds)/60).rounded())
        
        return String(format: "%d:%02d", comps.hours, minutes)
    }
}

func date(year: Int, month: Int, day: Int, hours: Double = 0) -> DateComponents {
    var cal = Calendar(identifier: Calendar.Identifier.gregorian)
    cal.timeZone = TimeZone(identifier: "UTC")!
    var comps = DateComponents()
    (comps as NSDateComponents).calendar = cal
    comps.year = year
    comps.month = month
    comps.day = day
    comps.hour = Int(hours)
    comps.minute = Int((hours - floor(hours)) * 60)
    return comps
}


class AdhanTests: XCTestCase {
    
    func testNightPortion() {
        var p1 = CalculationParameters(fajrAngle: 18, ishaAngle: 18)
        p1.highLatitudeRule = .middleOfTheNight
        XCTAssertEqual(p1.nightPortions().fajr, 0.5)
        XCTAssertEqual(p1.nightPortions().isha, 0.5)
        
        var p2 = CalculationParameters(fajrAngle: 18, ishaAngle: 18)
        p2.highLatitudeRule = .seventhOfTheNight
        XCTAssertEqual(p2.nightPortions().fajr, 1/7)
        XCTAssertEqual(p2.nightPortions().isha, 1/7)
        
        var p3 = CalculationParameters(fajrAngle: 10, ishaAngle: 15)
        p3.highLatitudeRule = .twilightAngle
        XCTAssertEqual(p3.nightPortions().fajr, 10/60)
        XCTAssertEqual(p3.nightPortions().isha, 15/60)
    }
    
    func testCalculationMethods() {
        let p1 = CalculationMethod.muslimWorldLeague.params
        XCTAssertEqual(p1.fajrAngle, 18)
        XCTAssertEqual(p1.ishaAngle, 17)
        XCTAssertEqual(p1.ishaInterval, 0)
        XCTAssertEqual(p1.method, CalculationMethod.muslimWorldLeague)
        
        let p2 = CalculationMethod.egyptian.params
        XCTAssertEqual(p2.fajrAngle, 19.5)
        XCTAssertEqual(p2.ishaAngle, 17.5)
        XCTAssertEqual(p2.ishaInterval, 0)
        XCTAssertEqual(p2.method, CalculationMethod.egyptian)
        
        let p3 = CalculationMethod.karachi.params
        XCTAssertEqual(p3.fajrAngle, 18)
        XCTAssertEqual(p3.ishaAngle, 18)
        XCTAssertEqual(p3.ishaInterval, 0)
        XCTAssertEqual(p3.method, CalculationMethod.karachi)
        
        let p4 = CalculationMethod.ummAlQura.params
        XCTAssertEqual(p4.fajrAngle, 18.5)
        XCTAssertEqual(p4.ishaAngle, 0)
        XCTAssertEqual(p4.ishaInterval, 90)
        XCTAssertEqual(p4.method, CalculationMethod.ummAlQura)
        
        let p5 = CalculationMethod.gulf.params
        XCTAssertEqual(p5.fajrAngle, 19.5)
        XCTAssertEqual(p5.ishaAngle, 0)
        XCTAssertEqual(p5.ishaInterval, 90)
        XCTAssertEqual(p5.method, CalculationMethod.gulf)
        
        let p6 = CalculationMethod.moonsightingCommittee.params
        XCTAssertEqual(p6.fajrAngle, 18)
        XCTAssertEqual(p6.ishaAngle, 18)
        XCTAssertEqual(p6.ishaInterval, 0)
        XCTAssertEqual(p6.method, CalculationMethod.moonsightingCommittee)
        
        let p7 = CalculationMethod.northAmerica.params
        XCTAssertEqual(p7.fajrAngle, 15)
        XCTAssertEqual(p7.ishaAngle, 15)
        XCTAssertEqual(p7.ishaInterval, 0)
        XCTAssertEqual(p7.method, CalculationMethod.northAmerica)
        
        let p8 = CalculationMethod.other.params
        XCTAssertEqual(p8.fajrAngle, 0)
        XCTAssertEqual(p8.ishaAngle, 0)
        XCTAssertEqual(p8.ishaInterval, 0)
        XCTAssertEqual(p8.method, CalculationMethod.other)
        
        let p9 = CalculationMethod.kuwait.params
        XCTAssertEqual(p9.fajrAngle, 18)
        XCTAssertEqual(p9.ishaAngle, 17.5)
        XCTAssertEqual(p9.ishaInterval, 0)
        XCTAssertEqual(p9.method, CalculationMethod.kuwait)
        
        let p10 = CalculationMethod.qatar.params
        XCTAssertEqual(p10.fajrAngle, 18)
        XCTAssertEqual(p10.ishaAngle, 0)
        XCTAssertEqual(p10.ishaInterval, 90)
        XCTAssertEqual(p10.method, CalculationMethod.qatar)
    }
    
    func testPrayerTimes() {
        var comps = DateComponents()
        comps.year = 2015
        comps.month = 7
        comps.day = 12
        var params = CalculationMethod.northAmerica.params
        params.madhab = .hanafi
        let p = PrayerTimes(coordinates: Coordinates(latitude: 35.7750, longitude: -78.6336), date: comps, calculationParameters: params)!
        
        let dateFormatter = DateFormatter()
        dateFormatter.timeZone = TimeZone(identifier: "America/New_York")!
        dateFormatter.dateStyle = .none
        dateFormatter.timeStyle = .short
        
        XCTAssertEqual(dateFormatter.string(from: p.fajr), "4:42 AM")
        XCTAssertEqual(dateFormatter.string(from: p.sunrise), "6:08 AM")
        XCTAssertEqual(dateFormatter.string(from: p.dhuhr), "1:21 PM")
        XCTAssertEqual(dateFormatter.string(from: p.asr), "6:22 PM")
        XCTAssertEqual(dateFormatter.string(from: p.maghrib), "8:32 PM")
        XCTAssertEqual(dateFormatter.string(from: p.isha), "9:57 PM")
    }
    
    func testOffsets() {
        
        let dateFormatter = DateFormatter()
        dateFormatter.timeZone = TimeZone(identifier: "America/New_York")!
        dateFormatter.dateStyle = .none
        dateFormatter.timeStyle = .short
        
        var comps = DateComponents()
        comps.year = 2015
        comps.month = 12
        comps.day = 1
        
        var params = CalculationMethod.muslimWorldLeague.params
        params.madhab = .shafi
        if let p = PrayerTimes(coordinates: Coordinates(latitude: 35.7750, longitude: -78.6336), date: comps, calculationParameters: params) {
            XCTAssertEqual(dateFormatter.string(from: p.fajr), "5:35 AM")
            XCTAssertEqual(dateFormatter.string(from: p.sunrise), "7:06 AM")
            XCTAssertEqual(dateFormatter.string(from: p.dhuhr), "12:05 PM")
            XCTAssertEqual(dateFormatter.string(from: p.asr), "2:42 PM")
            XCTAssertEqual(dateFormatter.string(from: p.maghrib), "5:01 PM")
            XCTAssertEqual(dateFormatter.string(from: p.isha), "6:26 PM")
        } else {
            XCTAssert(false)
        }
        
        params.adjustments.fajr = 10
        params.adjustments.sunrise = 10
        params.adjustments.dhuhr = 10
        params.adjustments.asr = 10
        params.adjustments.maghrib = 10
        params.adjustments.isha = 10
        if let p2 = PrayerTimes(coordinates: Coordinates(latitude: 35.7750, longitude: -78.6336), date: comps, calculationParameters: params) {
            XCTAssertEqual(dateFormatter.string(from: p2.fajr), "5:45 AM")
            XCTAssertEqual(dateFormatter.string(from: p2.sunrise), "7:16 AM")
            XCTAssertEqual(dateFormatter.string(from: p2.dhuhr), "12:15 PM")
            XCTAssertEqual(dateFormatter.string(from: p2.asr), "2:52 PM")
            XCTAssertEqual(dateFormatter.string(from: p2.maghrib), "5:11 PM")
            XCTAssertEqual(dateFormatter.string(from: p2.isha), "6:36 PM")
        } else {
            XCTAssert(false)
        }
        
        params.adjustments = PrayerAdjustments()
        if let p3 = PrayerTimes(coordinates: Coordinates(latitude: 35.7750, longitude: -78.6336), date: comps, calculationParameters: params) {
            XCTAssertEqual(dateFormatter.string(from: p3.fajr), "5:35 AM")
            XCTAssertEqual(dateFormatter.string(from: p3.sunrise), "7:06 AM")
            XCTAssertEqual(dateFormatter.string(from: p3.dhuhr), "12:05 PM")
            XCTAssertEqual(dateFormatter.string(from: p3.asr), "2:42 PM")
            XCTAssertEqual(dateFormatter.string(from: p3.maghrib), "5:01 PM")
            XCTAssertEqual(dateFormatter.string(from: p3.isha), "6:26 PM")
        } else {
            XCTAssert(false)
        }
    }
    
    func testMoonsightingMethod() {
        // Values from http://www.moonsighting.com/pray.php
        var comps = DateComponents()
        comps.year = 2016
        comps.month = 1
        comps.day = 31
        let p = PrayerTimes(coordinates: Coordinates(latitude: 35.7750, longitude: -78.6336), date: comps, calculationParameters: CalculationMethod.moonsightingCommittee.params)!
        
        let dateFormatter = DateFormatter()
        dateFormatter.timeZone = TimeZone(identifier: "America/New_York")!
        dateFormatter.dateStyle = .none
        dateFormatter.timeStyle = .short
        
        XCTAssertEqual(dateFormatter.string(from: p.fajr), "5:48 AM")
        XCTAssertEqual(dateFormatter.string(from: p.sunrise), "7:16 AM")
        XCTAssertEqual(dateFormatter.string(from: p.dhuhr), "12:33 PM")
        XCTAssertEqual(dateFormatter.string(from: p.asr), "3:20 PM")
        XCTAssertEqual(dateFormatter.string(from: p.maghrib), "5:43 PM")
        XCTAssertEqual(dateFormatter.string(from: p.isha), "7:05 PM")
    }
    
    func testMoonsightingMethodHighLat() {
        // Values from http://www.moonsighting.com/pray.php
        var comps = DateComponents()
        comps.year = 2016
        comps.month = 1
        comps.day = 1
        var params = CalculationMethod.moonsightingCommittee.params
        params.madhab = .hanafi
        let p = PrayerTimes(coordinates: Coordinates(latitude: 59.9094, longitude: 10.7349), date: comps, calculationParameters: params)!
        
        let dateFormatter = DateFormatter()
        dateFormatter.timeZone = TimeZone(identifier: "Europe/Oslo")!
        dateFormatter.dateStyle = .none
        dateFormatter.timeStyle = .short
        
        XCTAssertEqual(dateFormatter.string(from: p.fajr), "7:34 AM")
        XCTAssertEqual(dateFormatter.string(from: p.sunrise), "9:19 AM")
        XCTAssertEqual(dateFormatter.string(from: p.dhuhr), "12:25 PM")
        XCTAssertEqual(dateFormatter.string(from: p.asr), "1:36 PM")
        XCTAssertEqual(dateFormatter.string(from: p.maghrib), "3:25 PM")
        XCTAssertEqual(dateFormatter.string(from: p.isha), "5:02 PM")
    }
    
    func testTimeForPrayer() {
        var comps = DateComponents()
        comps.year = 2016
        comps.month = 7
        comps.day = 1
        var params = CalculationMethod.muslimWorldLeague.params
        params.madhab = .hanafi
        params.highLatitudeRule = .twilightAngle
        let p = PrayerTimes(coordinates: Coordinates(latitude: 59.9094, longitude: 10.7349), date: comps, calculationParameters: params)!
        XCTAssertEqual(p.fajr, p.time(for: .fajr))
        XCTAssertEqual(p.sunrise, p.time(for: .sunrise))
        XCTAssertEqual(p.dhuhr, p.time(for: .dhuhr))
        XCTAssertEqual(p.asr, p.time(for: .asr))
        XCTAssertEqual(p.maghrib, p.time(for: .maghrib))
        XCTAssertEqual(p.isha, p.time(for: .isha))
        XCTAssertNil(p.time(for: .none))
    }
    
    func testCurrentPrayer() {
        var comps = DateComponents()
        comps.year = 2015
        comps.month = 9
        comps.day = 1
        var params = CalculationMethod.karachi.params
        params.madhab = .hanafi
        params.highLatitudeRule = .twilightAngle
        let p = PrayerTimes(coordinates: Coordinates(latitude: 33.720817, longitude: 73.090032), date: comps, calculationParameters: params)!
        XCTAssertEqual(p.currentPrayer(at: p.fajr.addingTimeInterval(-1)), Prayer.none)
        XCTAssertEqual(p.currentPrayer(at: p.fajr), Prayer.fajr)
        XCTAssertEqual(p.currentPrayer(at: p.fajr.addingTimeInterval(1)), Prayer.fajr)
        XCTAssertEqual(p.currentPrayer(at: p.sunrise.addingTimeInterval(1)), Prayer.sunrise)
        XCTAssertEqual(p.currentPrayer(at: p.dhuhr.addingTimeInterval(1)), Prayer.dhuhr)
        XCTAssertEqual(p.currentPrayer(at: p.asr.addingTimeInterval(1)), Prayer.asr)
        XCTAssertEqual(p.currentPrayer(at: p.maghrib.addingTimeInterval(1)), Prayer.maghrib)
        XCTAssertEqual(p.currentPrayer(at: p.isha.addingTimeInterval(1)), Prayer.isha)
    }
    
    func testNextPrayer() {
        var comps = DateComponents()
        comps.year = 2015
        comps.month = 9
        comps.day = 1
        var params = CalculationMethod.karachi.params
        params.madhab = .hanafi
        params.highLatitudeRule = .twilightAngle
        let p = PrayerTimes(coordinates: Coordinates(latitude: 33.720817, longitude: 73.090032), date: comps, calculationParameters: params)!
        XCTAssertEqual(p.nextPrayer(at: p.fajr.addingTimeInterval(-1)), Prayer.fajr)
        XCTAssertEqual(p.nextPrayer(at: p.fajr), Prayer.sunrise)
        XCTAssertEqual(p.nextPrayer(at: p.fajr.addingTimeInterval(1)), Prayer.sunrise)
        XCTAssertEqual(p.nextPrayer(at: p.sunrise.addingTimeInterval(1)), Prayer.dhuhr)
        XCTAssertEqual(p.nextPrayer(at: p.dhuhr.addingTimeInterval(1)), Prayer.asr)
        XCTAssertEqual(p.nextPrayer(at: p.asr.addingTimeInterval(1)), Prayer.maghrib)
        XCTAssertEqual(p.nextPrayer(at: p.maghrib.addingTimeInterval(1)), Prayer.isha)
        XCTAssertEqual(p.nextPrayer(at: p.isha.addingTimeInterval(1)), Prayer.none)
    }
}
