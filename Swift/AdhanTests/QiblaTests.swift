//
//  QiblaTests.swift
//  Adhan
//
//  Created by Ameir Al-Zoubi on 4/18/17.
//  Copyright © 2017 Batoul Apps. All rights reserved.
//

import XCTest
@testable import Adhan

class QiblaTests: XCTestCase {
    
    func testNorthAmerica() {
        let washingtonDC = Coordinates(latitude: 38.9072, longitude: -77.0369)
        XCTAssertEqualWithAccuracy(Qibla(coordinates: washingtonDC).direction, 56.560, accuracy: 0.001)
        
        let nyc = Coordinates(latitude: 40.7128, longitude: -74.0059)
        XCTAssertEqualWithAccuracy(Qibla(coordinates: nyc).direction, 58.481, accuracy: 0.001)
        
        let sanFrancisco = Coordinates(latitude: 37.7749, longitude: -122.4194)
        XCTAssertEqualWithAccuracy(Qibla(coordinates: sanFrancisco).direction, 18.843, accuracy: 0.001)
        
        let anchorage = Coordinates(latitude: 61.2181, longitude: -149.9003)
        XCTAssertEqualWithAccuracy(Qibla(coordinates: anchorage).direction, 350.883, accuracy: 0.001)
    }
    
    func testSouthPacific() {
        let sydney = Coordinates(latitude: -33.8688, longitude: 151.2093)
        XCTAssertEqualWithAccuracy(Qibla(coordinates: sydney).direction, 277.499, accuracy: 0.001)
        
        let auckland = Coordinates(latitude: -36.8485, longitude: 174.7633)
        XCTAssertEqualWithAccuracy(Qibla(coordinates: auckland).direction, 261.197, accuracy: 0.001)
    }
    
    func testEurope() {
        let london = Coordinates(latitude: 51.5074, longitude: -0.1278)
        XCTAssertEqualWithAccuracy(Qibla(coordinates: london).direction, 118.987, accuracy: 0.001)
        
        let paris = Coordinates(latitude: 48.8566, longitude: 2.3522)
        XCTAssertEqualWithAccuracy(Qibla(coordinates: paris).direction, 119.163, accuracy: 0.001)
        
        let oslo = Coordinates(latitude: 59.9139, longitude: 10.7522)
        XCTAssertEqualWithAccuracy(Qibla(coordinates: oslo).direction, 139.027, accuracy: 0.001)
    }
    
    func testAsia() {
        let islamabad = Coordinates(latitude: 33.7294, longitude: 73.0931)
        XCTAssertEqualWithAccuracy(Qibla(coordinates: islamabad).direction, 255.882, accuracy: 0.001)
        
        let tokyo = Coordinates(latitude: 35.6895, longitude: 139.6917)
        XCTAssertEqualWithAccuracy(Qibla(coordinates: tokyo).direction, 293.021, accuracy: 0.001)
    }
}
