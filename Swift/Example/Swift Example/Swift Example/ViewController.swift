//
//  ViewController.swift
//  Swift Example
//
//  Created by Ameir Al-Zoubi on 4/26/16.
//  Copyright © 2016 Batoul Apps. All rights reserved.
//

import UIKit
import Adhan

class ViewController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let cal = Calendar(identifier: Calendar.Identifier.gregorian)
        let date = cal.dateComponents([.year, .month, .day], from: Date())
        let coordinates = Coordinates(latitude: 35.78056, longitude: -78.6389)
        var params = CalculationMethod.muslimWorldLeague.params
        params.madhab = .hanafi
        if let prayers = PrayerTimes(coordinates: coordinates, date: date, calculationParameters: params) {
            let formatter = DateFormatter()
            formatter.timeStyle = .medium
            formatter.timeZone = TimeZone(identifier: "America/New_York")!
            
            NSLog("fajr %@", formatter.string(from: prayers.fajr))
            NSLog("sunrise %@", formatter.string(from: prayers.sunrise))
            NSLog("dhuhr %@", formatter.string(from: prayers.dhuhr))
            NSLog("asr %@", formatter.string(from: prayers.asr))
            NSLog("maghrib %@", formatter.string(from: prayers.maghrib))
            NSLog("isha %@", formatter.string(from: prayers.isha))
        }
    }
}
