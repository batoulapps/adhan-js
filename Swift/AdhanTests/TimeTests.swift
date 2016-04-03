//
//  TimeTests.swift
//  Adhan
//
//  Created by Ameir Al-Zoubi on 4/2/16.
//  Copyright © 2016 Batoul Apps. All rights reserved.
//

import XCTest
@testable import Adhan

class TimeTests: XCTestCase {

    func parseParams(data: NSDictionary) -> CalculationParameters {
        var params: CalculationParameters!

        let method = data["method"] as! String
        
        if method == "MuslimWorldLeague" {
            params = CalculationMethod.MuslimWorldLeague.params
        } else if method == "Egyptian" {
            params = CalculationMethod.Egyptian.params
        } else if method == "Karachi" {
            params = CalculationMethod.Karachi.params
        } else if method == "UmmAlQura" {
            params = CalculationMethod.UmmAlQura.params
        } else if method == "Gulf" {
            params = CalculationMethod.Gulf.params
        } else if method == "MoonsightingCommittee" {
            params = CalculationMethod.MoonsightingCommittee.params
        } else if method == "NorthAmerica" {
            params = CalculationMethod.NorthAmerica.params
        } else {
            params = CalculationMethod.Other.params
        }
        
        let madhab = data["madhab"] as! String
        
        if madhab == "Shafi" {
            params.madhab = .Shafi
        } else if madhab == "Hanafi" {
            params.madhab = .Hanafi
        }
        
        let highLatRule = data["highLatitudeRule"] as! String
        
        if highLatRule == "SeventhOfTheNight" {
            params.highLatitudeRule = .SeventhOfTheNight
        } else if highLatRule == "TwilightAngle" {
            params.highLatitudeRule = .TwilightAngle
        } else {
            params.highLatitudeRule = .MiddleOfTheNight
        }
        
        return params
    }
    
    func testTimes() {
        let bundle = NSBundle(forClass: self.dynamicType)
        let paths = bundle.pathsForResourcesOfType("json", inDirectory: "Times")
        for path in paths {
            let data = NSData(contentsOfFile: path)
            let json = try! NSJSONSerialization.JSONObjectWithData(data!, options: .AllowFragments) as! NSDictionary
            let params = json["params"] as! NSDictionary
            let lat = params["latitude"] as! NSNumber
            let lon = params["longitude"] as! NSNumber
            let zone = params["timezone"] as! String
            let timezone = NSTimeZone(name: zone)!
            
            let coordinates = Coordinates(latitude: lat.doubleValue, longitude: lon.doubleValue)
            let calculationParameters = parseParams(params)
            
            let cal = NSCalendar(calendarIdentifier: NSCalendarIdentifierGregorian)!
            
            let dateFormatter = NSDateFormatter()
            dateFormatter.dateFormat = "YYYY-MM-dd"
            dateFormatter.timeZone = NSTimeZone(name: "UTC")!
            
            let timeFormatter = NSDateFormatter()
            timeFormatter.dateFormat = "h:mm a"
            timeFormatter.timeZone = timezone
         
            let times = json["times"] as! [NSDictionary]
            for time in times {
                let date = dateFormatter.dateFromString(time["date"] as! String)!
                let prayerTimes = PrayerTimes(coordinates: coordinates, date: cal.components([.Year, .Month, .Day], fromDate: date), calculationParameters: calculationParameters)!
                XCTAssertEqual(timeFormatter.stringFromDate(prayerTimes.fajr), time["fajr"] as? String, "Incorrect Fajr on \(time["date"])")
                XCTAssertEqual(timeFormatter.stringFromDate(prayerTimes.sunrise), time["sunrise"] as? String, "Incorrect Sunrise on \(time["date"])")
                XCTAssertEqual(timeFormatter.stringFromDate(prayerTimes.dhuhr), time["dhuhr"] as? String, "Incorrect Dhuhr on \(time["date"])")
                XCTAssertEqual(timeFormatter.stringFromDate(prayerTimes.asr), time["asr"] as? String, "Incorrect Asr on \(time["date"])")
                XCTAssertEqual(timeFormatter.stringFromDate(prayerTimes.maghrib), time["maghrib"] as? String, "Incorrect Maghrib on \(time["date"])")
                XCTAssertEqual(timeFormatter.stringFromDate(prayerTimes.isha), time["isha"] as? String, "Incorrect Isha on \(time["date"])")
            }
        }
    }

}
