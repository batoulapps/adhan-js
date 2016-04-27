//
//  AdhanObjc.swift
//  Adhan
//
//  Created by Ameir Al-Zoubi on 4/26/16.
//  Copyright © 2016 Batoul Apps. All rights reserved.
//

import Foundation
import CoreLocation

public class BAPrayerTimes: NSObject {
    public var fajr: NSDate?
    public var sunrise: NSDate?
    public var dhuhr: NSDate?
    public var asr: NSDate?
    public var maghrib: NSDate?
    public var isha: NSDate?
    
    public init(coordinates: CLLocationCoordinate2D, date: NSDateComponents) {
        super.init()
        
        if let prayers = PrayerTimes(coordinates: Coordinates(latitude: coordinates.latitude, longitude: coordinates.longitude), date: date, calculationParameters: CalculationMethod.MuslimWorldLeague.params) {
            self.fajr = prayers.fajr
            self.sunrise = prayers.sunrise  
            self.dhuhr = prayers.dhuhr
            self.asr = prayers.asr
            self.maghrib = prayers.maghrib
            self.isha = prayers.isha
        }
    }
}

public class BACalculationParameters: NSObject {

}

public class BACalculationMethod: NSObject {
    static func MuslimWorldLeague() -> BACalculationParameters {
        return BACalculationParameters()
    }
    /*
     case MuslimWorldLeague
     
     //Egyptian General Authority of Survey
     case Egyptian
     
     // University of Islamic Sciences, Karachi
     case Karachi
     
     // Umm al-Qura University, Makkah
     case UmmAlQura
     
     // The Gulf Region
     case Gulf
     
     // Moonsighting Committee
     case MoonsightingCommittee
     
     // ISNA
     case NorthAmerica
     
     // Kuwait
     case Kuwait
     
     // Qatar
     case Qatar
     
     // Other
     case Other
 */
}