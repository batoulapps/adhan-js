package com.batoulapps.adhan.internal;

import com.batoulapps.adhan.Coordinates;

public class QiblaUtil {
  private final static Coordinates MAKKAH = new Coordinates(21.4225241, 39.8261818);

  public static double calculateQiblaDirection(Coordinates coordinates) {
    // Equation from "Spherical Trigonometry For the use of colleges and schools" page 50
    final double longitudeDelta =
        Math.toRadians(MAKKAH.longitude) - Math.toRadians(coordinates.longitude);
    final double latitudeRadians = Math.toRadians(coordinates.latitude);
    final double term1 = Math.sin(longitudeDelta);
    final double term2 = Math.cos(latitudeRadians) * Math.tan(Math.toRadians(MAKKAH.latitude));
    final double term3 = Math.sin(latitudeRadians) * Math.cos(longitudeDelta);

    final double angle = Math.atan2(term1, term2 - term3);
    return DoubleUtil.unwindAngle(Math.toDegrees(angle));
  }
}
