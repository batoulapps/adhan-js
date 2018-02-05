//
//  SunnahTimes.swift
//  Adhan
//
//  Copyright © 2018 Batoul Apps. All rights reserved.
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.
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
