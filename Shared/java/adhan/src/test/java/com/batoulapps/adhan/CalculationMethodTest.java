package com.batoulapps.adhan;

import org.junit.Test;

import static com.google.common.truth.Truth.assertThat;

public class CalculationMethodTest {

  @Test
  public void testCalculationMethods() {
    CalculationParameters params = CalculationMethod.MUSLIM_WORLD_LEAGUE.getParameters();
    assertThat(params.fajrAngle).isWithin(0.000001).of(18);
    assertThat(params.ishaAngle).isWithin(0.000001).of(17);
    assertThat(params.ishaInterval).isEqualTo(0);
    assertThat(params.method).isEqualTo(CalculationMethod.MUSLIM_WORLD_LEAGUE);

    params = CalculationMethod.EGYPTIAN.getParameters();
    assertThat(params.fajrAngle).isWithin(0.000001).of(20);
    assertThat(params.ishaAngle).isWithin(0.000001).of(18);
    assertThat(params.ishaInterval).isEqualTo(0);
    assertThat(params.method).isEqualTo(CalculationMethod.EGYPTIAN);

    params = CalculationMethod.KARACHI.getParameters();
    assertThat(params.fajrAngle).isWithin(0.000001).of(18);
    assertThat(params.ishaAngle).isWithin(0.000001).of(18);
    assertThat(params.ishaInterval).isEqualTo(0);
    assertThat(params.method).isEqualTo(CalculationMethod.KARACHI);

    params = CalculationMethod.UMM_AL_QURA.getParameters();
    assertThat(params.fajrAngle).isWithin(0.000001).of(18.5);
    assertThat(params.ishaAngle).isWithin(0.000001).of(0);
    assertThat(params.ishaInterval).isEqualTo(90);
    assertThat(params.method).isEqualTo(CalculationMethod.UMM_AL_QURA);

    params = CalculationMethod.GULF.getParameters();
    assertThat(params.fajrAngle).isWithin(0.000001).of(19.5);
    assertThat(params.ishaAngle).isWithin(0.000001).of(0);
    assertThat(params.ishaInterval).isEqualTo(90);
    assertThat(params.method).isEqualTo(CalculationMethod.GULF);

    params = CalculationMethod.MOON_SIGHTING_COMMITTEE.getParameters();
    assertThat(params.fajrAngle).isWithin(0.000001).of(18);
    assertThat(params.ishaAngle).isWithin(0.000001).of(18);
    assertThat(params.ishaInterval).isEqualTo(0);
    assertThat(params.method).isEqualTo(CalculationMethod.MOON_SIGHTING_COMMITTEE);

    params = CalculationMethod.NORTH_AMERICA.getParameters();
    assertThat(params.fajrAngle).isWithin(0.000001).of(15);
    assertThat(params.ishaAngle).isWithin(0.000001).of(15);
    assertThat(params.ishaInterval).isEqualTo(0);
    assertThat(params.method).isEqualTo(CalculationMethod.NORTH_AMERICA);

    params = CalculationMethod.KUWAIT.getParameters();
    assertThat(params.fajrAngle).isWithin(0.000001).of(18);
    assertThat(params.ishaAngle).isWithin(0.000001).of(17.5);
    assertThat(params.ishaInterval).isEqualTo(0);
    assertThat(params.method).isEqualTo(CalculationMethod.KUWAIT);

    params = CalculationMethod.QATAR.getParameters();
    assertThat(params.fajrAngle).isWithin(0.000001).of(18);
    assertThat(params.ishaAngle).isWithin(0.000001).of(0);
    assertThat(params.ishaInterval).isEqualTo(90);
    assertThat(params.method).isEqualTo(CalculationMethod.QATAR);    

    params = CalculationMethod.OTHER.getParameters();
    assertThat(params.fajrAngle).isWithin(0.000001).of(0);
    assertThat(params.ishaAngle).isWithin(0.000001).of(0);
    assertThat(params.ishaInterval).isEqualTo(0);
    assertThat(params.method).isEqualTo(CalculationMethod.OTHER);
  }
}