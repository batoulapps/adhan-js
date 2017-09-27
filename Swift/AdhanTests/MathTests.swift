//
//  MathTests.swift
//  Adhan
//
//  Created by Ameir Al-Zoubi on 2/21/16.
//  Copyright © 2016 Batoul Apps. All rights reserved.
//

import XCTest
@testable import Adhan

class MathTests: XCTestCase {
    
    func testAngleConversion() {
        XCTAssertEqual(Double.pi.radiansToDegrees(), 180.0)
        XCTAssertEqual(180.0.degreesToRadians(), Double.pi)
        XCTAssertEqual((Double.pi / 2).radiansToDegrees(), 90.0)
        XCTAssertEqual(90.0.degreesToRadians(), (Double.pi / 2))
    }
    
    func testNormalizing() {
        XCTAssertEqual(2.0.normalizeWithBound(max: -5), -3)
        XCTAssertEqual((-4.0).normalizeWithBound(max: -5), -4)
        XCTAssertEqual((-6.0).normalizeWithBound(max: -5), -1)
        
        XCTAssertEqual((-1.0).normalizeWithBound(max: 24), 23)
        XCTAssertEqual(1.0.normalizeWithBound(max: 24), 1)
        XCTAssertEqual(49.0.normalizeWithBound(max: 24), 1)
        
        XCTAssertEqual(361.0.normalizeWithBound(max: 360), 1)
        XCTAssertEqual(360.0.normalizeWithBound(max: 360), 0)
        XCTAssertEqual(259.0.normalizeWithBound(max: 360), 259)
        XCTAssertEqual(2592.0.normalizeWithBound(max: 360), 72)
        
        XCTAssertEqual((-45.0).unwindAngle(), 315)
        XCTAssertEqual(361.0.unwindAngle(), 1)
        XCTAssertEqual(360.0.unwindAngle(), 0)
        XCTAssertEqual(259.0.unwindAngle(), 259)
        XCTAssertEqual(2592.0.unwindAngle(), 72)
        
        XCTAssertEqual(360.1.normalizeWithBound(max: 360), 0.1, accuracy: 0.01)
    }
    
    func testClosestAngle() {
        XCTAssertEqual(360.0.closestAngle(), 0)
        XCTAssertEqual(361.0.closestAngle(), 1)
        XCTAssertEqual(1.0.closestAngle(), 1)
        XCTAssertEqual((-1.0).closestAngle(), -1)
        XCTAssertEqual((-181.0).closestAngle(), 179)
        XCTAssertEqual(180.0.closestAngle(), 180)
        XCTAssertEqual(359.0.closestAngle(), -1)
        XCTAssertEqual((-359.0).closestAngle(), 1)
        XCTAssertEqual(1261.0.closestAngle(), -179)
        XCTAssertEqual((-360.1).closestAngle(), -0.1, accuracy: 0.01)
    }
    
    func testTimeComponents() {
        let comps1 = 15.199.timeComponents()!
        XCTAssertEqual(comps1.hours, 15)
        XCTAssertEqual(comps1.minutes, 11)
        XCTAssertEqual(comps1.seconds, 56)
        
        let comps2 = 1.0084.timeComponents()!
        XCTAssertEqual(comps2.hours, 1)
        XCTAssertEqual(comps2.minutes, 0)
        XCTAssertEqual(comps2.seconds, 30)
        
        let comps3 = 1.0083.timeComponents()!
        XCTAssertEqual(comps3.hours, 1)
        XCTAssertEqual(comps3.minutes, 0)
        
        let comps4 = 2.1.timeComponents()!
        XCTAssertEqual(comps4.hours, 2)
        XCTAssertEqual(comps4.minutes, 6)
        
        let comps5 = 3.5.timeComponents()!
        XCTAssertEqual(comps5.hours, 3)
        XCTAssertEqual(comps5.minutes, 30)
    }
    
    func testMinuteRounding() {
        let cal = Calendar(identifier: Calendar.Identifier.gregorian)
        
        let comps1 = DateComponents(year: 2015, month: 1, day: 1, hour: 10, minute: 2, second: 29)
        let date1 = cal.date(from: comps1)!.roundedMinute()
        XCTAssertEqual(cal.component(.minute, from: date1), 2)
        XCTAssertEqual(cal.component(.second, from: date1), 0)
        
        let comps2 = DateComponents(year: 2015, month: 1, day: 1, hour: 10, minute: 2, second: 31)
        let date2 = cal.date(from: comps2)!.roundedMinute()
        XCTAssertEqual(cal.component(.minute, from: date2), 3)
        XCTAssertEqual(cal.component(.second, from: date2), 0)
    }
}
