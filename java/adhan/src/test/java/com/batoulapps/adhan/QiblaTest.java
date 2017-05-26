package com.batoulapps.adhan;

import org.junit.Test;

import static com.google.common.truth.Truth.assertThat;

public class QiblaTest {

  @Test
  public void testNorthAmerica() {
    final Coordinates washingtonDC = new Coordinates(38.9072, -77.0369);
    assertThat(new Qibla(washingtonDC).direction).isWithin(0.001).of(56.560);

    final Coordinates nyc = new Coordinates(40.7128, -74.0059);
    assertThat(new Qibla(nyc).direction).isWithin(0.001).of(58.481);

    final Coordinates sanFrancisco = new Coordinates(37.7749, -122.4194);
    assertThat(new Qibla(sanFrancisco).direction).isWithin(0.001).of(18.843);

    final Coordinates anchorage = new Coordinates(61.2181, -149.9003);
    assertThat(new Qibla(anchorage).direction).isWithin(0.001).of(350.883);

  }

  @Test
  public void testSouthPacific() {
    final Coordinates sydney = new Coordinates(-33.8688, 151.2093);
    assertThat(new Qibla(sydney).direction).isWithin(0.001).of(277.499);


    final Coordinates auckland = new Coordinates(-36.8485, 174.7633);
    assertThat(new Qibla(auckland).direction).isWithin(0.001).of(261.197);

  }

  @Test
  public void testEurope() {
    final Coordinates london = new Coordinates(51.5074, -0.1278);
    assertThat(new Qibla(london).direction).isWithin(0.001).of(118.987);


    final Coordinates paris = new Coordinates(48.8566, 2.3522);
    assertThat(new Qibla(paris).direction).isWithin(0.001).of(119.163);


    final Coordinates oslo = new Coordinates(59.9139, 10.7522);
    assertThat(new Qibla(oslo).direction).isWithin(0.001).of(139.027);

  }

  @Test
  public void testAsia() {
    final Coordinates islamabad = new Coordinates(33.7294, 73.0931);
    assertThat(new Qibla(islamabad).direction).isWithin(0.001).of(255.882);


    final Coordinates tokyo = new Coordinates(35.6895, 139.6917);
    assertThat(new Qibla(tokyo).direction).isWithin(0.001).of(293.021);

  }

  @Test
  public void testAfrica() {
    final Coordinates capeTown = new Coordinates(33.9249, 18.4241);
    assertThat(new Qibla(capeTown).direction).isWithin(0.001).of(118.004);

    
    final Coordinates cairo = new Coordinates(30.0444, 31.2357);
    assertThat(new Qibla(cairo).direction).isWithin(0.001).of(136.137);

  }

}
