//
//  ViewController.swift
//  Sample
//
//  Created by Ameir Al-Zoubi on 2/21/16.
//  Copyright © 2016 Batoul Apps. All rights reserved.
//

import UIKit
import Adhan

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        
        let date = NSDateComponents()
        date.year = 2016
        date.month = 2
        date.day = 21
        var params = CalculationMethod.MoonsightingCommittee.params
        params.offsets = [0, 0, 0, 0, 0, 0]
        let prayers = PrayerTimes(coordinates: Coordinates(latitude: 51.5155, longitude: -0.0922), date: date, calculationParameters: params)!
        
        NSLog("fajr %@", prayers.fajr)
        NSLog("sunrise %@", prayers.sunrise)
        NSLog("dhuhr %@", prayers.dhuhr)
        NSLog("asr %@", prayers.asr)
        NSLog("maghrib %@", prayers.maghrib)
        NSLog("isha %@", prayers.isha)
    }
}

