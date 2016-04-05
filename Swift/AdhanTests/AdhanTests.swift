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
        let minutes = Int(Double(comps.minutes) + round(Double(comps.seconds)/60))
        
        return String(format: "%d:%02d", comps.hours, minutes)
    }
}

func date(year year: Int, month: Int, day: Int, hours: Double = 0) -> NSDateComponents {
    let cal = NSCalendar(calendarIdentifier: NSCalendarIdentifierGregorian)!
    cal.timeZone = NSTimeZone(name: "UTC")!
    let comps = NSDateComponents()
    comps.calendar = cal
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
        p1.highLatitudeRule = .MiddleOfTheNight
        XCTAssertEqual(p1.nightPortions().fajr, 0.5)
        XCTAssertEqual(p1.nightPortions().isha, 0.5)
        
        var p2 = CalculationParameters(fajrAngle: 18, ishaAngle: 18)
        p2.highLatitudeRule = .SeventhOfTheNight
        XCTAssertEqual(p2.nightPortions().fajr, 1/7)
        XCTAssertEqual(p2.nightPortions().isha, 1/7)
        
        var p3 = CalculationParameters(fajrAngle: 10, ishaAngle: 15)
        p3.highLatitudeRule = .TwilightAngle
        XCTAssertEqual(p3.nightPortions().fajr, 10/60)
        XCTAssertEqual(p3.nightPortions().isha, 15/60)
    }
    
    func testCalculationMethods() {
        let p1 = CalculationMethod.MuslimWorldLeague.params
        XCTAssertEqual(p1.fajrAngle, 18)
        XCTAssertEqual(p1.ishaAngle, 17)
        XCTAssertEqual(p1.ishaInterval, 0)
        XCTAssertEqual(p1.method, CalculationMethod.MuslimWorldLeague)
        
        let p2 = CalculationMethod.Egyptian.params
        XCTAssertEqual(p2.fajrAngle, 19.5)
        XCTAssertEqual(p2.ishaAngle, 17.5)
        XCTAssertEqual(p2.ishaInterval, 0)
        XCTAssertEqual(p2.method, CalculationMethod.Egyptian)
        
        let p3 = CalculationMethod.Karachi.params
        XCTAssertEqual(p3.fajrAngle, 18)
        XCTAssertEqual(p3.ishaAngle, 18)
        XCTAssertEqual(p3.ishaInterval, 0)
        XCTAssertEqual(p3.method, CalculationMethod.Karachi)
        
        let p4 = CalculationMethod.UmmAlQura.params
        XCTAssertEqual(p4.fajrAngle, 18.5)
        XCTAssertEqual(p4.ishaAngle, 0)
        XCTAssertEqual(p4.ishaInterval, 90)
        XCTAssertEqual(p4.method, CalculationMethod.UmmAlQura)
        
        let p5 = CalculationMethod.Gulf.params
        XCTAssertEqual(p5.fajrAngle, 19.5)
        XCTAssertEqual(p5.ishaAngle, 0)
        XCTAssertEqual(p5.ishaInterval, 90)
        XCTAssertEqual(p5.method, CalculationMethod.Gulf)
        
        let p6 = CalculationMethod.MoonsightingCommittee.params
        XCTAssertEqual(p6.fajrAngle, 18)
        XCTAssertEqual(p6.ishaAngle, 18)
        XCTAssertEqual(p6.ishaInterval, 0)
        XCTAssertEqual(p6.method, CalculationMethod.MoonsightingCommittee)
        
        let p7 = CalculationMethod.NorthAmerica.params
        XCTAssertEqual(p7.fajrAngle, 15)
        XCTAssertEqual(p7.ishaAngle, 15)
        XCTAssertEqual(p7.ishaInterval, 0)
        XCTAssertEqual(p7.method, CalculationMethod.NorthAmerica)
        
        let p8 = CalculationMethod.Other.params
        XCTAssertEqual(p8.fajrAngle, 0)
        XCTAssertEqual(p8.ishaAngle, 0)
        XCTAssertEqual(p8.ishaInterval, 0)
        XCTAssertEqual(p8.method, CalculationMethod.Other)
    }
    
    func testPrayerTimes() {
        let comps = NSDateComponents()
        comps.year = 2015
        comps.month = 7
        comps.day = 12
        var params = CalculationMethod.NorthAmerica.params
        params.madhab = .Hanafi
        let p = PrayerTimes(coordinates: Coordinates(latitude: 35.7750, longitude: -78.6336), date: comps, calculationParameters: params)!
        
        let dateFormatter = NSDateFormatter()
        dateFormatter.timeZone = NSTimeZone(name: "America/New_York")!
        dateFormatter.dateStyle = .NoStyle
        dateFormatter.timeStyle = .ShortStyle
        
        XCTAssertEqual(dateFormatter.stringFromDate(p.fajr), "4:42 AM")
        XCTAssertEqual(dateFormatter.stringFromDate(p.sunrise), "6:08 AM")
        XCTAssertEqual(dateFormatter.stringFromDate(p.dhuhr), "1:21 PM")
        XCTAssertEqual(dateFormatter.stringFromDate(p.asr), "6:22 PM")
        XCTAssertEqual(dateFormatter.stringFromDate(p.maghrib), "8:32 PM")
        XCTAssertEqual(dateFormatter.stringFromDate(p.isha), "9:57 PM")
    }
    
    func testOffsets() {
        
        let dateFormatter = NSDateFormatter()
        dateFormatter.timeZone = NSTimeZone(name: "America/New_York")!
        dateFormatter.dateStyle = .NoStyle
        dateFormatter.timeStyle = .ShortStyle
        
        let comps = NSDateComponents()
        comps.year = 2015
        comps.month = 12
        comps.day = 1
        
        var params = CalculationMethod.MuslimWorldLeague.params
        params.madhab = .Shafi
        if let p = PrayerTimes(coordinates: Coordinates(latitude: 35.7750, longitude: -78.6336), date: comps, calculationParameters: params) {
            XCTAssertEqual(dateFormatter.stringFromDate(p.fajr), "5:35 AM")
            XCTAssertEqual(dateFormatter.stringFromDate(p.sunrise), "7:06 AM")
            XCTAssertEqual(dateFormatter.stringFromDate(p.dhuhr), "12:05 PM")
            XCTAssertEqual(dateFormatter.stringFromDate(p.asr), "2:42 PM")
            XCTAssertEqual(dateFormatter.stringFromDate(p.maghrib), "5:01 PM")
            XCTAssertEqual(dateFormatter.stringFromDate(p.isha), "6:26 PM")
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
            XCTAssertEqual(dateFormatter.stringFromDate(p2.fajr), "5:45 AM")
            XCTAssertEqual(dateFormatter.stringFromDate(p2.sunrise), "7:16 AM")
            XCTAssertEqual(dateFormatter.stringFromDate(p2.dhuhr), "12:15 PM")
            XCTAssertEqual(dateFormatter.stringFromDate(p2.asr), "2:52 PM")
            XCTAssertEqual(dateFormatter.stringFromDate(p2.maghrib), "5:11 PM")
            XCTAssertEqual(dateFormatter.stringFromDate(p2.isha), "6:36 PM")
        } else {
            XCTAssert(false)
        }
        
        params.adjustments = PrayerAdjustments()
        if let p3 = PrayerTimes(coordinates: Coordinates(latitude: 35.7750, longitude: -78.6336), date: comps, calculationParameters: params) {
            XCTAssertEqual(dateFormatter.stringFromDate(p3.fajr), "5:35 AM")
            XCTAssertEqual(dateFormatter.stringFromDate(p3.sunrise), "7:06 AM")
            XCTAssertEqual(dateFormatter.stringFromDate(p3.dhuhr), "12:05 PM")
            XCTAssertEqual(dateFormatter.stringFromDate(p3.asr), "2:42 PM")
            XCTAssertEqual(dateFormatter.stringFromDate(p3.maghrib), "5:01 PM")
            XCTAssertEqual(dateFormatter.stringFromDate(p3.isha), "6:26 PM")
        } else {
            XCTAssert(false)
        }
    }
    
    func testMoonsightingMethod() {
        // Values from http://www.moonsighting.com/pray.php
        let comps = NSDateComponents()
        comps.year = 2016
        comps.month = 1
        comps.day = 31
        let p = PrayerTimes(coordinates: Coordinates(latitude: 35.7750, longitude: -78.6336), date: comps, calculationParameters: CalculationMethod.MoonsightingCommittee.params)!
        
        let dateFormatter = NSDateFormatter()
        dateFormatter.timeZone = NSTimeZone(name: "America/New_York")!
        dateFormatter.dateStyle = .NoStyle
        dateFormatter.timeStyle = .ShortStyle
        
        XCTAssertEqual(dateFormatter.stringFromDate(p.fajr), "5:48 AM")
        XCTAssertEqual(dateFormatter.stringFromDate(p.sunrise), "7:16 AM")
        XCTAssertEqual(dateFormatter.stringFromDate(p.dhuhr), "12:33 PM")
        XCTAssertEqual(dateFormatter.stringFromDate(p.asr), "3:20 PM")
        XCTAssertEqual(dateFormatter.stringFromDate(p.maghrib), "5:43 PM")
        XCTAssertEqual(dateFormatter.stringFromDate(p.isha), "7:05 PM")
    }
    
    func testMoonsightingMethodHighLat() {
        // Values from http://www.moonsighting.com/pray.php
        let comps = NSDateComponents()
        comps.year = 2016
        comps.month = 1
        comps.day = 1
        var params = CalculationMethod.MoonsightingCommittee.params
        params.madhab = .Hanafi
        let p = PrayerTimes(coordinates: Coordinates(latitude: 59.9094, longitude: 10.7349), date: comps, calculationParameters: params)!
        
        let dateFormatter = NSDateFormatter()
        dateFormatter.timeZone = NSTimeZone(name: "Europe/Oslo")!
        dateFormatter.dateStyle = .NoStyle
        dateFormatter.timeStyle = .ShortStyle
        
        XCTAssertEqual(dateFormatter.stringFromDate(p.fajr), "7:34 AM")
        XCTAssertEqual(dateFormatter.stringFromDate(p.sunrise), "9:19 AM")
        XCTAssertEqual(dateFormatter.stringFromDate(p.dhuhr), "12:25 PM")
        XCTAssertEqual(dateFormatter.stringFromDate(p.asr), "1:36 PM")
        XCTAssertEqual(dateFormatter.stringFromDate(p.maghrib), "3:25 PM")
        XCTAssertEqual(dateFormatter.stringFromDate(p.isha), "5:02 PM")
    }
}
