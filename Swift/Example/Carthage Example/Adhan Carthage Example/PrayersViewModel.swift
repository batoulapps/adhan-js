//
//  PrayersViewModel.swift
//  Carthage Example
//
//  Created by Basem Emara on 6/17/17.
//  Copyright © 2017 Batoul Apps. All rights reserved.
//

import Adhan

struct PrayersViewModel {

    let prayers: PrayerTimes
    let times: [(type: Prayer, date: Date)]
    
    let dateComponents: DateComponents
    let coordinates: Coordinates
    let params: CalculationParameters
    let formatter: DateFormatter

    init?() {
        let cal = Calendar(identifier: .gregorian)
        
        self.dateComponents = cal.dateComponents([.year, .month, .day], from: Date())
        self.coordinates = Coordinates(latitude: 35.78056, longitude: -78.6389)
        
        var params = CalculationMethod.muslimWorldLeague.params
        params.madhab = .hanafi
        self.params = params
        
        self.formatter = DateFormatter()
        self.formatter.timeZone = TimeZone(identifier: "America/New_York")!
        self.formatter.timeStyle = .short
        
        guard let prayers = PrayerTimes(
            coordinates: coordinates,
            date: dateComponents,
            calculationParameters: params)
            else { return  nil }
        
        self.prayers = prayers
        
        self.times = [
            (.fajr, prayers.fajr),
            (.sunrise, prayers.sunrise),
            (.dhuhr, prayers.dhuhr),
            (.asr, prayers.asr),
            (.maghrib, prayers.maghrib),
            (.isha, prayers.isha)
        ]
    }
}

extension PrayersViewModel {

    func display(for prayer: Prayer) -> String {
        return "\(prayer)".capitalized
    }
    
    func display(for time: Date) -> String {
        return formatter.string(from: time)
    }
}
