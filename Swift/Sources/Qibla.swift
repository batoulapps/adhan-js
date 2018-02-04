//
//  Qibla.swift
//  Adhan
//
//  Copyright © 2018 Batoul Apps. All rights reserved.
//

import Foundation

public struct Qibla {
    /* The heading to the Qibla from True North */
    public let direction: Double

    public init(coordinates: Coordinates) {
        let makkah = Coordinates(latitude: 21.4225241, longitude: 39.8261818)

        /* Equation from "Spherical Trigonometry For the use of colleges and schools" page 50 */
        let term1 = sin(makkah.longitude.degreesToRadians() - coordinates.longitude.degreesToRadians())
        let term2 = cos(coordinates.latitude.degreesToRadians()) * tan(makkah.latitude.degreesToRadians())
        let term3 = sin(coordinates.latitude.degreesToRadians()) * cos(makkah.longitude.degreesToRadians() - coordinates.longitude.degreesToRadians())

        let angle = atan2(term1, term2 - term3)
        direction = angle.radiansToDegrees().unwindAngle()
    }
}
