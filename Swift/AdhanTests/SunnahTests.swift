//
//  SunnahTests.swift
//  Adhan
//
//  Created by Basem Emara on 4/21/17.
//  Copyright © 2017 Batoul Apps. All rights reserved.
//

import XCTest
@testable import Adhan

class SunnahTests: XCTestCase {
    
    func testSunnahTimesNY() {
        var params = CalculationMethod.northAmerica.params
        params.madhab = .hanafi
        params.highLatitudeRule = .middleOfTheNight
        let coordinates = Coordinates(latitude: 35.7750, longitude: -78.6336)
        
        let dateFormatter = DateFormatter()
        dateFormatter.timeZone = TimeZone(identifier: "America/New_York")!
        dateFormatter.dateStyle = .short
        dateFormatter.timeStyle = .short
        
        var comps1 = DateComponents()
        comps1.year = 2015
        comps1.month = 7
        comps1.day = 12
        
        let todayPrayers = PrayerTimes(coordinates: coordinates, date: comps1, calculationParameters: params)!
        XCTAssertEqual(dateFormatter.string(from: todayPrayers.maghrib), "7/12/15, 8:32 PM")
        
        var comps2 = DateComponents()
        comps2.year = 2015
        comps2.month = 7
        comps2.day = 13
        
        let tomorrowPrayers = PrayerTimes(coordinates: coordinates, date: comps2, calculationParameters: params)!
        XCTAssertEqual(dateFormatter.string(from: tomorrowPrayers.fajr), "7/13/15, 4:43 AM")
        
        let sunnahTimes = SunnahTimes(from: todayPrayers)!
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.middleOfTheNight), "7/13/15, 12:37 AM")
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.lastThirdOfTheNight), "7/13/15, 1:59 AM")
    }
    
    func testSunnahTimesLondon() {
        var params = CalculationMethod.muslimWorldLeague.params
        params.madhab = .shafi
        params.highLatitudeRule = .twilightAngle
        let coordinates = Coordinates(latitude: 51.5074, longitude: -0.1278)
        
        let dateFormatter = DateFormatter()
        dateFormatter.timeZone = TimeZone(identifier: "Europe/London")!
        dateFormatter.dateStyle = .short
        dateFormatter.timeStyle = .short
        
        var comps1 = DateComponents()
        comps1.year = 2016
        comps1.month = 12
        comps1.day = 31
        
        let todayPrayers = PrayerTimes(coordinates: coordinates, date: comps1, calculationParameters: params)!
        XCTAssertEqual(dateFormatter.string(from: todayPrayers.maghrib), "12/31/16, 4:01 PM")
        
        var comps2 = DateComponents()
        comps2.year = 2017
        comps2.month = 1
        comps2.day = 1
        
        let tomorrowPrayers = PrayerTimes(coordinates: coordinates, date: comps2, calculationParameters: params)!
        XCTAssertEqual(dateFormatter.string(from: tomorrowPrayers.fajr), "1/1/17, 6:03 AM")
        
        let sunnahTimes = SunnahTimes(from: todayPrayers)!
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.middleOfTheNight), "12/31/16, 11:02 PM")
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.lastThirdOfTheNight), "1/1/17, 1:22 AM")
    }
    
    func testSunnahTimesDST1() {
        var params = CalculationMethod.northAmerica.params
        params.madhab = .hanafi
        let coordinates = Coordinates(latitude: 37.7749, longitude: -122.4194)
        
        let dateFormatter = DateFormatter()
        dateFormatter.timeZone = TimeZone(identifier: "America/Los_Angeles")!
        dateFormatter.dateStyle = .short
        dateFormatter.timeStyle = .short
        
        var comps1 = DateComponents()
        comps1.year = 2017
        comps1.month = 3
        comps1.day = 11
        
        let todayPrayers = PrayerTimes(coordinates: coordinates, date: comps1, calculationParameters: params)!
        XCTAssertEqual(dateFormatter.string(from: todayPrayers.fajr), "3/11/17, 5:14 AM")
        XCTAssertEqual(dateFormatter.string(from: todayPrayers.maghrib), "3/11/17, 6:13 PM")
        
        var comps2 = DateComponents()
        comps2.year = 2017
        comps2.month = 3
        comps2.day = 12
        
        let tomorrowPrayers = PrayerTimes(coordinates: coordinates, date: comps2, calculationParameters: params)!
        XCTAssertEqual(dateFormatter.string(from: tomorrowPrayers.fajr), "3/12/17, 6:13 AM")
        XCTAssertEqual(dateFormatter.string(from: tomorrowPrayers.maghrib), "3/12/17, 7:14 PM")
        
        let sunnahTimes = SunnahTimes(from: todayPrayers)!
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.middleOfTheNight), "3/11/17, 11:43 PM")
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.lastThirdOfTheNight), "3/12/17, 1:33 AM")
    }
    
    func testSunnahTimesDST2() {
        var params = CalculationMethod.muslimWorldLeague.params
        params.madhab = .shafi
        params.highLatitudeRule = .seventhOfTheNight
        let coordinates = Coordinates(latitude: 48.8566, longitude: 2.3522)
        
        let dateFormatter = DateFormatter()
        dateFormatter.timeZone = TimeZone(identifier: "Europe/Paris")!
        dateFormatter.dateStyle = .short
        dateFormatter.timeStyle = .short
        
        var comps1 = DateComponents()
        comps1.year = 2015
        comps1.month = 10
        comps1.day = 24
        
        let todayPrayers = PrayerTimes(coordinates: coordinates, date: comps1, calculationParameters: params)!
        XCTAssertEqual(dateFormatter.string(from: todayPrayers.fajr), "10/24/15, 6:38 AM")
        XCTAssertEqual(dateFormatter.string(from: todayPrayers.maghrib), "10/24/15, 6:45 PM")
        
        var comps2 = DateComponents()
        comps2.year = 2015
        comps2.month = 10
        comps2.day = 25
        
        let tomorrowPrayers = PrayerTimes(coordinates: coordinates, date: comps2, calculationParameters: params)!
        XCTAssertEqual(dateFormatter.string(from: tomorrowPrayers.fajr), "10/25/15, 5:40 AM")
        XCTAssertEqual(dateFormatter.string(from: tomorrowPrayers.maghrib), "10/25/15, 5:43 PM")
        
        let sunnahTimes = SunnahTimes(from: todayPrayers)!
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.middleOfTheNight), "10/25/15, 12:42 AM")
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.lastThirdOfTheNight), "10/25/15, 2:41 AM")
    }
}
