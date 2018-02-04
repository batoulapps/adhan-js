//
//  TimeComponents.swift
//  Adhan
//
//  Copyright © 2018 Batoul Apps. All rights reserved.
//

import Foundation

struct TimeComponents {
    let hours: Int
    let minutes: Int
    let seconds: Int

    func dateComponents(_ date: DateComponents) -> DateComponents {
        var comps = DateComponents()
        comps.year = date.year
        comps.month = date.month
        comps.day = date.day
        comps.hour = self.hours
        comps.minute = self.minutes
        comps.second = self.seconds

        return comps
    }
}
