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

    func parseParams(_ data: NSDictionary) -> CalculationParameters {
        var params: CalculationParameters!

        let method = data["method"] as! String
        
        if method == "MuslimWorldLeague" {
            params = CalculationMethod.muslimWorldLeague.params
        } else if method == "Egyptian" {
            params = CalculationMethod.egyptian.params
        } else if method == "Karachi" {
            params = CalculationMethod.karachi.params
        } else if method == "UmmAlQura" {
            params = CalculationMethod.ummAlQura.params
        } else if method == "Gulf" {
            params = CalculationMethod.gulf.params
        } else if method == "MoonsightingCommittee" {
            params = CalculationMethod.moonsightingCommittee.params
        } else if method == "NorthAmerica" {
            params = CalculationMethod.northAmerica.params
        } else if method == "Kuwait" {
            params = CalculationMethod.kuwait.params
        } else if method == "Qatar" {
            params = CalculationMethod.qatar.params
        } else {
            params = CalculationMethod.other.params
        }
        
        let madhab = data["madhab"] as! String
        
        if madhab == "Shafi" {
            params.madhab = .shafi
        } else if madhab == "Hanafi" {
            params.madhab = .hanafi
        }
        
        let highLatRule = data["highLatitudeRule"] as! String
        
        if highLatRule == "SeventhOfTheNight" {
            params.highLatitudeRule = .seventhOfTheNight
        } else if highLatRule == "TwilightAngle" {
            params.highLatitudeRule = .twilightAngle
        } else {
            params.highLatitudeRule = .middleOfTheNight
        }
        
        return params
    }
    
    func testTimes() {
        var output = "################\nTime Test Output\n"
        let bundle = Bundle(for: type(of: self))
        let paths = bundle.paths(forResourcesOfType: "json", inDirectory: "Times")
        for path in paths {
            let data = try? Data(contentsOf: URL(fileURLWithPath: path))
            let json = try! JSONSerialization.jsonObject(with: data!, options: .allowFragments) as! NSDictionary
            let params = json["params"] as! NSDictionary
            let lat = params["latitude"] as! NSNumber
            let lon = params["longitude"] as! NSNumber
            let zone = params["timezone"] as! String
            let timezone = TimeZone(identifier: zone)!
            
            let coordinates = Coordinates(latitude: lat.doubleValue, longitude: lon.doubleValue)
            let calculationParameters = parseParams(params)
            
            var cal = Calendar(identifier: Calendar.Identifier.gregorian)
            cal.timeZone = TimeZone(identifier: "UTC")!
            
            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "YYYY-MM-dd"
            dateFormatter.timeZone = TimeZone(identifier: "UTC")!
            
            let timeFormatter = DateFormatter()
            timeFormatter.dateFormat = "h:mm a"
            timeFormatter.timeZone = timezone
            
            let dateTimeFormatter = DateFormatter()
            dateTimeFormatter.dateFormat = "YYYY-MM-dd h:mm a"
            dateTimeFormatter.timeZone = timezone
         
            let times = json["times"] as! [NSDictionary]
            output += "Times for \((path as NSString).lastPathComponent) - \(params["method"]!)\n"
            print("Testing \((path as NSString).lastPathComponent) (\(times.count) days)")
            var totalDiff = 0.0
            var maxDiff = 0.0
            for time in times {
                let date = dateFormatter.date(from: time["date"] as! String)!
                let components = (cal as NSCalendar).components([.year, .month, .day], from: date)
                let prayerTimes = PrayerTimes(coordinates: coordinates, date: components, calculationParameters: calculationParameters)!
                XCTAssertEqual(timeFormatter.string(from: prayerTimes.fajr), time["fajr"] as? String, "Incorrect Fajr on \(time["date"])")
                XCTAssertEqual(timeFormatter.string(from: prayerTimes.sunrise), time["sunrise"] as? String, "Incorrect Sunrise on \(time["date"])")
                XCTAssertEqual(timeFormatter.string(from: prayerTimes.dhuhr), time["dhuhr"] as? String, "Incorrect Dhuhr on \(time["date"])")
                XCTAssertEqual(timeFormatter.string(from: prayerTimes.asr), time["asr"] as? String, "Incorrect Asr on \(time["date"])")
                XCTAssertEqual(timeFormatter.string(from: prayerTimes.maghrib), time["maghrib"] as? String, "Incorrect Maghrib on \(time["date"])")
                XCTAssertEqual(timeFormatter.string(from: prayerTimes.isha), time["isha"] as? String, "Incorrect Isha on \(time["date"])")
                
                let fajrDiff = prayerTimes.fajr.timeIntervalSince(dateTimeFormatter.date(from: "\(time["date"]!) \(time["fajr"]!)")!)/60
                let sunriseDiff = prayerTimes.sunrise.timeIntervalSince(dateTimeFormatter.date(from: "\(time["date"]!) \(time["sunrise"]!)")!)/60
                let dhuhrDiff = prayerTimes.dhuhr.timeIntervalSince(dateTimeFormatter.date(from: "\(time["date"]!) \(time["dhuhr"]!)")!)/60
                let asrDiff = prayerTimes.asr.timeIntervalSince(dateTimeFormatter.date(from: "\(time["date"]!) \(time["asr"]!)")!)/60
                let maghribDiff = prayerTimes.maghrib.timeIntervalSince(dateTimeFormatter.date(from: "\(time["date"]!) \(time["maghrib"]!)")!)/60
                let ishaDiff = prayerTimes.isha.timeIntervalSince(dateTimeFormatter.date(from: "\(time["date"]!) \(time["isha"]!)")!)/60
                totalDiff += fabs(fajrDiff) + fabs(sunriseDiff) + fabs(dhuhrDiff) + fabs(asrDiff) + fabs(maghribDiff) + fabs(ishaDiff)
                maxDiff = max(fabs(fajrDiff), fabs(sunriseDiff), fabs(dhuhrDiff), fabs(asrDiff), fabs(maghribDiff), fabs(ishaDiff), maxDiff)
                
                output += "\(components.year)-\(components.month)-\(components.day)\n"
                output += "F: \(timeFormatter.string(from: prayerTimes.fajr))  \t\(time["fajr"]!)  \tDiff: \(fajrDiff)\n"
                output += "S: \(timeFormatter.string(from: prayerTimes.sunrise))  \t\(time["sunrise"]!)  \tDiff: \(sunriseDiff)\n"
                output += "D: \(timeFormatter.string(from: prayerTimes.dhuhr))  \t\(time["dhuhr"]!)  \tDiff: \(dhuhrDiff)\n"
                output += "A: \(timeFormatter.string(from: prayerTimes.asr))  \t\(time["asr"]!)  \tDiff: \(asrDiff)\n"
                output += "M: \(timeFormatter.string(from: prayerTimes.maghrib))  \t\(time["maghrib"]!)  \tDiff: \(maghribDiff)\n"
                output += "I: \(timeFormatter.string(from: prayerTimes.isha))  \t\(time["isha"]!)  \tDiff: \(ishaDiff)\n"
            }
            output += "Average difference: \(totalDiff/Double(times.count * 6))\n"
            output += "Max difference: \(maxDiff)\n"
            output += "\n"
        }
        print(output)
    }

}
