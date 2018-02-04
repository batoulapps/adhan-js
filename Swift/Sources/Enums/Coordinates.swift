//
//  Coordinates.swift
//  Adhan
//
//  Copyright © 2018 Batoul Apps. All rights reserved.
//

import Foundation

/* Latitude and longitude */
public struct Coordinates {
    let latitude: Double
    let longitude: Double

    public init(latitude: Double, longitude: Double) {
        self.latitude = latitude
        self.longitude = longitude
    }
}
