//
//  Madhab.swift
//  Adhan
//
//  Copyright © 2018 Batoul Apps. All rights reserved.
//

import Foundation

/* Madhab for determining how Asr is calculated */
public enum Madhab {
    case shafi
    case hanafi

    var shadowLength: ShadowLength {
        switch(self) {
        case .shafi:
            return .single
        case .hanafi:
            return .double
        }
    }
}
