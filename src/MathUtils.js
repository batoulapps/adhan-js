export function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180.0;
}

export function radiansToDegrees(radians) {
    return (radians * 180.0) / Math.PI;
}

export function normalizeToScale(number, max) {
    return number - (max * (Math.floor(number / max)))
}

export function unwindAngle(angle) {
    return normalizeToScale(angle, 360.0);
}

export function quadrantShiftAngle(angle) {
    if (angle >= -180 && angle <= 180) {
        return angle;
    }

    return angle - (360 * Math.round(angle/360));
}
