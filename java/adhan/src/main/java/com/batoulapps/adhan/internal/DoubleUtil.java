package com.batoulapps.adhan.internal;

class DoubleUtil {

  static double normalizeWithBound(double value, double max) {
    return value - (max * (Math.floor(value / max)));
  }

  static double unwindAngle(double value) {
    return normalizeWithBound(value, 360);
  }

  static double closestAngle(double angle) {
    if (angle >= -180 && angle <= 180) {
      return angle;
    }
    return angle - (360 * Math.round(angle / 360));
  }
}
