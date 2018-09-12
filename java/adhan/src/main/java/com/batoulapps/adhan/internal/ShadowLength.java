package com.batoulapps.adhan.internal;

public enum ShadowLength {
  SINGLE(1.0),
  DOUBLE(2.0);

  private final double shadowLength;

  ShadowLength(double shadowLength) {
    this.shadowLength = shadowLength;
  }

  public double getShadowLength() {
    return this.shadowLength;
  }
}
