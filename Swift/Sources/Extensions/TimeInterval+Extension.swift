//
//  TimeInterval+Extension.swift
//  Adhan
//
//  Copyright © 2018 Batoul Apps. All rights reserved.
//

import Foundation

extension Int {
    func timeInterval() -> TimeInterval {
        return Double(self) * 60
    }
}
