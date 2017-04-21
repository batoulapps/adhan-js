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
        let coordinates = Coordinates(latitude: 35.7750, longitude: -78.6336)
        
        let dateFormatter = DateFormatter()
        dateFormatter.timeZone = TimeZone(identifier: "America/New_York")!
        dateFormatter.dateStyle = .none
        dateFormatter.timeStyle = .short
        
        var comps1 = DateComponents()
        comps1.year = 2015
        comps1.month = 7
        comps1.day = 12
        
        let todayPrayers = PrayerTimes(coordinates: coordinates, date: comps1, calculationParameters: params)!
        XCTAssertEqual(dateFormatter.string(from: todayPrayers.maghrib), "8:32 PM")
        
        var comps2 = DateComponents()
        comps2.year = 2015
        comps2.month = 7
        comps2.day = 13
        
        let tomorrowPrayers = PrayerTimes(coordinates: coordinates, date: comps2, calculationParameters: params)!
        XCTAssertEqual(dateFormatter.string(from: tomorrowPrayers.fajr), "4:43 AM")
        
        let sunnahTimes = SunnahTimes(from: todayPrayers)!
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.middleOfTheNight), "12:37 AM")
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.lastThirdOfTheNight), "1:59 AM")
    }
    
    func testSunnahTimesLondon() {
        var params = CalculationMethod.muslimWorldLeague.params
        params.madhab = .hanafi
        params.highLatitudeRule = .twilightAngle
        let coordinates = Coordinates(latitude: 51.5074, longitude: -0.1278)
        
        let dateFormatter = DateFormatter()
        dateFormatter.timeZone = TimeZone(identifier: "Europe/London")!
        dateFormatter.dateStyle = .none
        dateFormatter.timeStyle = .short
        
        var comps1 = DateComponents()
        comps1.year = 2016
        comps1.month = 12
        comps1.day = 31
        
        let todayPrayers = PrayerTimes(coordinates: coordinates, date: comps1, calculationParameters: params)!
        XCTAssertEqual(dateFormatter.string(from: todayPrayers.maghrib), "4:01 PM")
        
        var comps2 = DateComponents()
        comps2.year = 2017
        comps2.month = 1
        comps2.day = 1
        
        let tomorrowPrayers = PrayerTimes(coordinates: coordinates, date: comps2, calculationParameters: params)!
        XCTAssertEqual(dateFormatter.string(from: tomorrowPrayers.fajr), "6:03 AM")
        
        let sunnahTimes = SunnahTimes(from: todayPrayers)!
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.middleOfTheNight), "11:02 PM")
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.lastThirdOfTheNight), "1:22 AM")
        
        // TODO: Verify above tests are correct
        XCTFail()
    }
    
    func testSunnahTimesDST1() {
        var params = CalculationMethod.northAmerica.params
        params.madhab = .shafi
        let coordinates = Coordinates(latitude: 37.7749, longitude: -122.4194)
        
        let dateFormatter = DateFormatter()
        dateFormatter.timeZone = TimeZone(identifier: "America/Los_Angeles")!
        dateFormatter.dateStyle = .none
        dateFormatter.timeStyle = .short
        
        var comps1 = DateComponents()
        comps1.year = 2017
        comps1.month = 3
        comps1.day = 11
        
        let todayPrayers = PrayerTimes(coordinates: coordinates, date: comps1, calculationParameters: params)!
        XCTAssertEqual(dateFormatter.string(from: todayPrayers.maghrib), "6:13 PM")
        
        var comps2 = DateComponents()
        comps2.year = 2017
        comps2.month = 3
        comps2.day = 12
        
        let tomorrowPrayers = PrayerTimes(coordinates: coordinates, date: comps2, calculationParameters: params)!
        XCTAssertEqual(dateFormatter.string(from: tomorrowPrayers.fajr), "6:13 AM")
        
        let sunnahTimes = SunnahTimes(from: todayPrayers)!
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.middleOfTheNight), "11:43 PM")
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.lastThirdOfTheNight), "1:33 AM")
        
        // TODO: Verify above tests are correct
        XCTFail()
    }
    
    func testSunnahTimesDST2() {
        var params = CalculationMethod.northAmerica.params
        params.madhab = .shafi
        let coordinates = Coordinates(latitude: 48.8566, longitude: 2.3522)
        
        let dateFormatter = DateFormatter()
        dateFormatter.timeZone = TimeZone(identifier: "Europe/Paris")!
        dateFormatter.dateStyle = .none
        dateFormatter.timeStyle = .short
        
        var comps1 = DateComponents()
        comps1.year = 2015
        comps1.month = 10
        comps1.day = 24
        
        let todayPrayers = PrayerTimes(coordinates: coordinates, date: comps1, calculationParameters: params)!
        XCTAssertEqual(dateFormatter.string(from: todayPrayers.maghrib), "6:45 PM")
        
        var comps2 = DateComponents()
        comps2.year = 2015
        comps2.month = 10
        comps2.day = 25
        
        let tomorrowPrayers = PrayerTimes(coordinates: coordinates, date: comps2, calculationParameters: params)!
        XCTAssertEqual(dateFormatter.string(from: tomorrowPrayers.fajr), "5:58 AM")
        
        let sunnahTimes = SunnahTimes(from: todayPrayers)!
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.middleOfTheNight), "12:51 AM")
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.lastThirdOfTheNight), "2:53 AM")
        
        // TODO: Verify above tests are correct
        XCTFail()
    }
}
