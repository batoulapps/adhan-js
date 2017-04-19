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
        XCTAssertEqualWithAccuracy(Qibla(coordinates: washingtonDC).direction, 56.56, accuracy: 0.001)
    }
}
