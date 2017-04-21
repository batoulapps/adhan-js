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
    
    func testSunnahTimes() {
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
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.midnight), "12:37 AM")
        XCTAssertEqual(dateFormatter.string(from: sunnahTimes.lastThird), "1:59 AM")
    }
}
