//
//  DateComponents+Extension.swift
//  Adhan
//
//  Copyright © 2018 Batoul Apps. All rights reserved.
//

import Foundation

extension DateComponents {

    func julianDate() -> Double {
        let year = self.year ?? 0
        let month = self.month ?? 0
        let day = self.day ?? 0
        let hour: Double = Double(self.hour ?? 0)
        let minute: Double = Double(self.minute ?? 0)

        return Astronomical.julianDay(year: year, month: month, day: day, hours: hour + (minute / 60))
    }
}
