//
//  SunnahTimes.swift
//  Adhan
//
//  Copyright © 2018 Batoul Apps. All rights reserved.
//

import Foundation

/* Sunnah times for a location and date using the given prayer times.
 All prayer times are in UTC and should be display using a DateFormatter that
 has the correct timezone set. */
public struct SunnahTimes {

    /* The midpoint between Maghrib and Fajr */
    public let middleOfTheNight: Date

    /* The beginning of the last third of the period between Maghrib and Fajr,
     a recommended time to perform Qiyam */
    public let lastThirdOfTheNight: Date

    public init?(from prayerTimes: PrayerTimes) {
        let date = Calendar.gregorianUTC.date(from: prayerTimes.date)!
        let tomorrow = Calendar.gregorianUTC.date(byAdding: .day, value: 1, to: date)!

        guard let nextDayPrayers = PrayerTimes(
            coordinates: prayerTimes.coordinates,
            date: Calendar.gregorianUTC.dateComponents([.year, .month, .day], from: tomorrow),
            calculationParameters: prayerTimes.calculationParameters) else {
                // unable to determine tomorrow prayer times
                return nil
        }

        let nightDuration = nextDayPrayers.fajr.timeIntervalSince(prayerTimes.maghrib)
        self.middleOfTheNight = prayerTimes.maghrib.addingTimeInterval(nightDuration / 2).roundedMinute()
        self.lastThirdOfTheNight = prayerTimes.maghrib.addingTimeInterval(nightDuration * (2 / 3)).roundedMinute()
    }
}
