export function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180.0;
}

export function radiansToDegrees(radians: number) {
  return (radians * 180.0) / Math.PI;
}

export function normalizeToScale(num: number, max: number) {
  return num - max * Math.floor(num / max);
}

export function unwindAngle(angle: number) {
  return normalizeToScale(angle, 360.0);
}

export function quadrantShiftAngle(angle: number) {
  if (angle >= -180 && angle <= 180) {
    return angle;
  }

  return angle - 360 * Math.round(angle / 360);
}
