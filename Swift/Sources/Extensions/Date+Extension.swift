//
//  Date+Extension.swift
//  Adhan
//
//  Copyright © 2018 Batoul Apps. All rights reserved.
//

import Foundation

extension Date {

    func roundedMinute() -> Date {
        let cal: Calendar = .gregorianUTC
        var components = cal.dateComponents([.year, .month, .day, .hour, .minute, .second], from: self)

        let minute: Double = Double(components.minute ?? 0)
        let second: Double = Double(components.second ?? 0)

        components.minute = Int(minute + round(second/60))
        components.second = 0

        return cal.date(from: components)!
    }
}
