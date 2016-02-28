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
    
    func testMoonsightingMethod() {
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
}
