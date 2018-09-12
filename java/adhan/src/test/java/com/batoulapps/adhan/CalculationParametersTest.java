package com.batoulapps.adhan;

import org.junit.Test;

import static com.google.common.truth.Truth.assertThat;

public class CalculationParametersTest {

  @Test
  public void testNightPortion() throws Exception {
    CalculationParameters parameters = new CalculationParameters(18, 18);
    parameters.highLatitudeRule = HighLatitudeRule.MIDDLE_OF_THE_NIGHT;
    assertThat(parameters.nightPortions().fajr).isWithin(0.001).of(0.5);
    assertThat(parameters.nightPortions().isha).isWithin(0.001).of(0.5);

    parameters = new CalculationParameters(18.0, 18.0);
    parameters.highLatitudeRule = HighLatitudeRule.SEVENTH_OF_THE_NIGHT;
    assertThat(parameters.nightPortions().fajr).isWithin(0.001).of(1.0/7.0);
    assertThat(parameters.nightPortions().isha).isWithin(0.001).of(1.0/7.0);

    parameters = new CalculationParameters(10.0, 15.0);
    parameters.highLatitudeRule = HighLatitudeRule.TWILIGHT_ANGLE;
    assertThat(parameters.nightPortions().fajr).isWithin(0.001).of(10.0/60.0);
    assertThat(parameters.nightPortions().isha).isWithin(0.001).of(15.0/60.0);
  }
}