//
//  AdhanObjc.swift
//  Adhan
//
//  Created by Ameir Al-Zoubi on 4/26/16.
//  Copyright © 2016 Batoul Apps. All rights reserved.
//

import Foundation

@objc public enum BAPrayer: Int {
    case Fajr = 0
    case Sunrise = 1
    case Dhuhr = 2
    case Asr = 3
    case Maghrib = 4
    case Isha = 5
    case None = 6
}

@objc public class BAPrayerTimes: NSObject {
    public var fajr: NSDate?
    public var sunrise: NSDate?
    public var dhuhr: NSDate?
    public var asr: NSDate?
    public var maghrib: NSDate?
    public var isha: NSDate?
    
    private let prayerTimes: PrayerTimes?
    
    public init(coordinates: BACoordinates, date: NSDateComponents, calculationParameters: BACalculationParameters) {
        prayerTimes = PrayerTimes(coordinates: Coordinates(latitude: coordinates.latitude, longitude: coordinates.longitude), date: date, calculationParameters: calculationParameters.calculationParameters())
        if let prayerTimes = prayerTimes {
            self.fajr = prayerTimes.fajr
            self.sunrise = prayerTimes.sunrise
            self.dhuhr = prayerTimes.dhuhr
            self.asr = prayerTimes.asr
            self.maghrib = prayerTimes.maghrib
            self.isha = prayerTimes.isha
        }
        super.init()
    }
    
    public func currentPrayer(time: NSDate?) -> BAPrayer {
        guard let prayerTimes = prayerTimes else {
            return .None
        }
        
        let _time = time ?? NSDate()
        return BAPrayerForPrayer(prayerTimes.currentPrayer(_time))
    }
    
    public func nextPrayer(time: NSDate?) -> BAPrayer {
        guard let prayerTimes = prayerTimes else {
            return .None
        }
        
        let _time = time ?? NSDate()
        return BAPrayerForPrayer(prayerTimes.nextPrayer(_time))
    }
    
    public func timeForPrayer(prayer: BAPrayer) -> NSDate? {
        return prayerTimes?.timeForPrayer(prayerForBAPrayer(prayer))
    }
    
    private func prayerForBAPrayer(baPrayer: BAPrayer) -> Prayer {
        switch baPrayer {
        case BAPrayer.None:
            return Prayer.None
        case BAPrayer.Fajr:
            return Prayer.Fajr
        case BAPrayer.Sunrise:
            return Prayer.Sunrise
        case BAPrayer.Dhuhr:
            return Prayer.Dhuhr
        case BAPrayer.Asr:
            return Prayer.Asr
        case BAPrayer.Maghrib:
            return Prayer.Maghrib
        case BAPrayer.Isha:
            return Prayer.Isha
        }
    }
    
    private func BAPrayerForPrayer(prayer: Prayer) -> BAPrayer {
        switch prayer {
        case Prayer.None:
            return BAPrayer.None
        case Prayer.Fajr:
            return BAPrayer.Fajr
        case Prayer.Sunrise:
            return BAPrayer.Sunrise
        case Prayer.Dhuhr:
            return BAPrayer.Dhuhr
        case Prayer.Asr:
            return BAPrayer.Asr
        case Prayer.Maghrib:
            return BAPrayer.Maghrib
        case Prayer.Isha:
            return BAPrayer.Isha
        }
    }
}

@objc public class BACalculationParameters: NSObject {
    public var method: BACalculationMethod = .Other
    public var fajrAngle: Double
    public var ishaAngle: Double
    public var ishaInterval: Int = 0
    public var madhab: BAMadhab = .Shafi
    public var highLatitudeRule: BAHighLatitudeRule = .MiddleOfTheNight
    public var adjustments: BAPrayerAdjustments = BAPrayerAdjustments()
    
    public init(fajrAngle: Double, ishaAngle: Double, ishaInterval: Int) {
        self.fajrAngle = fajrAngle
        self.ishaAngle = ishaAngle
        self.ishaInterval = ishaInterval
        super.init()
    }
    
    public convenience init(method: BACalculationMethod) {
        let params = BACalculationParameters.calculationMethodForBACalculationMethod(method).params
        self.init(fajrAngle: params.fajrAngle, ishaAngle: params.ishaAngle, ishaInterval: params.ishaInterval)
        self.method = method
    }
    
    private func calculationParameters() -> CalculationParameters {
        var params = CalculationParameters(fajrAngle: self.fajrAngle, ishaAngle: self.ishaAngle)
        params.method = BACalculationParameters.calculationMethodForBACalculationMethod(self.method)
        params.ishaInterval = self.ishaInterval
        params.adjustments = self.adjustments.prayerAdjustments()
        
        switch self.madhab {
        case BAMadhab.Shafi:
            params.madhab = Madhab.Shafi
        case BAMadhab.Hanafi:
            params.madhab = Madhab.Hanafi
        }
        
        switch self.highLatitudeRule {
        case BAHighLatitudeRule.MiddleOfTheNight:
            params.highLatitudeRule = HighLatitudeRule.MiddleOfTheNight
        case BAHighLatitudeRule.SeventhOfTheNight:
            params.highLatitudeRule = HighLatitudeRule.SeventhOfTheNight
        case BAHighLatitudeRule.TwilightAngle:
            params.highLatitudeRule = HighLatitudeRule.TwilightAngle
        }
        
        return params
    }
    
    private static func calculationMethodForBACalculationMethod(baMethod: BACalculationMethod) -> CalculationMethod {
        switch baMethod {
        case .MuslimWorldLeague:
            return CalculationMethod.MuslimWorldLeague
        case .Egyptian:
            return CalculationMethod.Egyptian
        case .Karachi:
            return CalculationMethod.Karachi
        case .UmmAlQura:
            return CalculationMethod.UmmAlQura
        case .Gulf:
            return CalculationMethod.Gulf
        case .MoonsightingCommittee:
            return CalculationMethod.MoonsightingCommittee
        case .NorthAmerica:
            return CalculationMethod.NorthAmerica
        case .Kuwait:
            return CalculationMethod.Kuwait
        case .Qatar:
            return CalculationMethod.Qatar
        case .Other:
            return CalculationMethod.Other
        }
    }
}

@objc public enum BACalculationMethod: Int {
    case MuslimWorldLeague
    case Egyptian
    case Karachi
    case UmmAlQura
    case Gulf
    case MoonsightingCommittee
    case NorthAmerica
    case Kuwait
    case Qatar
    case Other
}

@objc public enum BAMadhab: Int {
    case Shafi
    case Hanafi
}

@objc public enum BAHighLatitudeRule: Int {
    case MiddleOfTheNight
    case SeventhOfTheNight
    case TwilightAngle
}

@objc public class BAPrayerAdjustments: NSObject {
    public var fajr: Int = 0
    public var sunrise: Int = 0
    public var dhuhr: Int = 0
    public var asr: Int = 0
    public var maghrib: Int = 0
    public var isha: Int = 0
    
    public init(fajr: Int = 0, sunrise: Int = 0, dhuhr: Int = 0, asr: Int = 0, maghrib: Int = 0, isha: Int = 0) {
        self.fajr = fajr
        self.sunrise = sunrise
        self.dhuhr = dhuhr
        self.asr = asr
        self.maghrib = maghrib
        self.isha = isha
        super.init()
    }
    
    private func prayerAdjustments() -> PrayerAdjustments {
        return PrayerAdjustments(fajr: self.fajr, sunrise: self.sunrise, dhuhr: self.dhuhr, asr: self.asr, maghrib: self.maghrib, isha: self.isha)
    }
}

@objc public class BACoordinates: NSObject {
    public var latitude: Double
    public var longitude: Double
    
    public init(latitude: Double, longitude: Double) {
        self.latitude = latitude
        self.longitude = longitude
        super.init()
    }
}
