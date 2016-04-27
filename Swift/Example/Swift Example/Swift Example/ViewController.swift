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
        
        let cal = NSCalendar(identifier: NSCalendarIdentifierGregorian)!
        let date = cal.components([.Year, .Month, .Day], fromDate: NSDate())
        let coordinates = Coordinates(latitude: 35.78056, longitude: -78.6389)
        var params = CalculationMethod.MuslimWorldLeague.params
        params.madhab = .Hanafi
        if let prayers = PrayerTimes(coordinates: coordinates, date: date, calculationParameters: params) {
            let formatter = NSDateFormatter()
            formatter.timeStyle = .MediumStyle
            formatter.timeZone = NSTimeZone(name: "America/New_York")!
            
            NSLog("fajr %@", formatter.stringFromDate(prayers.fajr))
            NSLog("sunrise %@", formatter.stringFromDate(prayers.sunrise))
            NSLog("dhuhr %@", formatter.stringFromDate(prayers.dhuhr))
            NSLog("asr %@", formatter.stringFromDate(prayers.asr))
            NSLog("maghrib %@", formatter.stringFromDate(prayers.maghrib))
            NSLog("isha %@", formatter.stringFromDate(prayers.isha))
        }
    }
}
