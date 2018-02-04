//
//  Double+Extension.swift
//  Adhan
//
//  Copyright © 2018 Batoul Apps. All rights reserved.
//

import Foundation

extension Double {

    func degreesToRadians() -> Double {
        return (self * .pi) / 180.0
    }

    func radiansToDegrees() -> Double {
        return (self * 180.0) / .pi
    }

    func normalizeWithBound(max: Double) -> Double {
        return self - (max * (floor(self / max)))
    }

    func unwindAngle() -> Double {
        return self.normalizeWithBound(max: 360)
    }

    func closestAngle() -> Double {
        if self >= -180 && self <= 180 {
            return self
        }

        return self - (360 * (self/360).rounded())
    }

    func timeComponents() -> TimeComponents? {
        guard self.isNormal else {
            return nil
        }

        let hours = floor(self)
        let minutes = floor((self - hours) * 60)
        let seconds = floor((self - (hours + minutes/60)) * 60 * 60)

        return TimeComponents(hours: Int(hours), minutes: Int(minutes), seconds: Int(seconds))
    }
}
