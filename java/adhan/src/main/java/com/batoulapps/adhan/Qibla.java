package com.batoulapps.adhan;

import com.batoulapps.adhan.internal.QiblaUtil;

public class Qibla {
  private final static Coordinates MAKKAH = new Coordinates(21.4225241, 39.8261818);

  public final double direction;

  public Qibla(Coordinates coordinates) {
    direction = QiblaUtil.calculateQiblaDirection(coordinates);
  }
}
