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
        let params = CalculationMethod.northAmerica.params
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
        
        /*
         Night: 8:32 PM to 4:43 AM
         Duration: 8 hours, 11 minutes
         Middle = 8:32 PM + 4 hours, 5.5 minutes = 12:37:30 AM which rounds to 12:38 AM
         Last Third = 8:32 PM + 5 hours, 27.3 minutes = 1:59:20 AM which rounds to 1:59 AM
        */
        let sunnahTimes = SunnahTimes(from: todayPrayers)!
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.middleOfTheNight), "7/13/15, 12:38 AM")
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.lastThirdOfTheNight), "7/13/15, 1:59 AM")
    }
    
    func testSunnahTimesLondon() {
        let params = CalculationMethod.moonsightingCommittee.params
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
        XCTAssertEqual(dateFormatter.string(from: todayPrayers.maghrib), "12/31/16, 4:04 PM")
        
        var comps2 = DateComponents()
        comps2.year = 2017
        comps2.month = 1
        comps2.day = 1
        
        let tomorrowPrayers = PrayerTimes(coordinates: coordinates, date: comps2, calculationParameters: params)!
        XCTAssertEqual(dateFormatter.string(from: tomorrowPrayers.fajr), "1/1/17, 6:25 AM")
        
        /*
         Night: 4:04 PM to 6:25 AM
         Duration: 14 hours, 21 minutes
         Middle = 4:04 PM + 7 hours, 10.5 minutes = 11:14:30 PM which rounds to 11:15 PM
         Last Third = 4:04 PM + 9 hours, 34 minutes = 1:38 AM
        */
        let sunnahTimes = SunnahTimes(from: todayPrayers)!
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.middleOfTheNight), "12/31/16, 11:15 PM")
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.lastThirdOfTheNight), "1/1/17, 1:38 AM")
    }
    
    func testSunnahTimesOslo() {
        var params = CalculationMethod.muslimWorldLeague.params
        params.highLatitudeRule = .middleOfTheNight
        let coordinates = Coordinates(latitude: 59.9094, longitude: 10.7349)
        
        let dateFormatter = DateFormatter()
        dateFormatter.timeZone = TimeZone(identifier: "Europe/Oslo")!
        dateFormatter.dateStyle = .short
        dateFormatter.timeStyle = .short
        
        var comps1 = DateComponents()
        comps1.year = 2016
        comps1.month = 7
        comps1.day = 1
        
        let todayPrayers = PrayerTimes(coordinates: coordinates, date: comps1, calculationParameters: params)!
        XCTAssertEqual(dateFormatter.string(from: todayPrayers.maghrib), "7/1/16, 10:41 PM")
        
        var comps2 = DateComponents()
        comps2.year = 2016
        comps2.month = 7
        comps2.day = 2
        
        let tomorrowPrayers = PrayerTimes(coordinates: coordinates, date: comps2, calculationParameters: params)!
        XCTAssertEqual(dateFormatter.string(from: tomorrowPrayers.fajr), "7/2/16, 1:20 AM")
        
        /*
         Night: 10:41 PM to 1:20 AM
         Duration: 2 hours, 39 minutes
         Middle = 10:41 PM + 1 hours, 19.5 minutes = 12:00:30 AM which rounds to 12:01 AM
         Last Third = 10:41 PM + 1 hours, 46 minutes = 12:27 AM
        */
        
        let sunnahTimes = SunnahTimes(from: todayPrayers)!
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.middleOfTheNight), "7/2/16, 12:01 AM")
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.lastThirdOfTheNight), "7/2/16, 12:27 AM")
    }
    
    func testSunnahTimesDST1() {
        let params = CalculationMethod.northAmerica.params
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
        
        /*
         Night: 6:13 PM PST to 6:13 AM PDT
         Duration: 11 hours (1 hour is skipped due to DST)
         Middle = 6:13 PM + 5 hours, 30 minutes = 11:43 PM
         Last Third = 6:13 PM + 7 hours, 20 minutes = 1:33 AM
        */
        let sunnahTimes = SunnahTimes(from: todayPrayers)!
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.middleOfTheNight), "3/11/17, 11:43 PM")
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.lastThirdOfTheNight), "3/12/17, 1:33 AM")
    }
    
    func testSunnahTimesDST2() {
        var params = CalculationMethod.muslimWorldLeague.params
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
        
        /*
         Night: 6:45 PM CEST to 5:40 AM CET
         Duration: 11 hours 55 minutes (1 extra hour is added due to DST)
         Middle = 6:45 PM + 5 hours, 57.5 minutes = 12:42:30 AM which rounds to 12:43 AM
         Last Third = 6:45 PM + 7 hours, 56 minutes, 40 seconds = 2:41:40 AM which rounds to 2:42 AM  
        */
        let sunnahTimes = SunnahTimes(from: todayPrayers)!
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.middleOfTheNight), "10/25/15, 12:43 AM")
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.lastThirdOfTheNight), "10/25/15, 2:42 AM")
    }
}
