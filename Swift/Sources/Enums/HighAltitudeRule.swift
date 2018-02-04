//
//  HighAltitudeRule.swift
//  Adhan
//
//  Copyright © 2018 Batoul Apps. All rights reserved.
//

import Foundation

/* Rule for approximating Fajr and Isha at high latitudes */
public enum HighLatitudeRule {
    case middleOfTheNight
    case seventhOfTheNight
    case twilightAngle
}
