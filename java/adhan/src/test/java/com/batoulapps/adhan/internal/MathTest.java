package com.batoulapps.adhan.internal;

import com.batoulapps.adhan.data.CalendarUtil;
import com.batoulapps.adhan.data.TimeComponents;

import org.junit.Test;

import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

import static com.google.common.truth.Truth.assertThat;

public class MathTest {

  @Test
  public void testAngleConversion() {
    assertThat(Math.toDegrees(Math.PI)).isWithin(0.00001).of(180.0);
    assertThat(Math.toDegrees(Math.PI / 2)).isWithin(0.00001).of(90.0);
  }

  @Test
  public void testNormalizing() {
    assertThat(DoubleUtil.normalizeWithBound(2.0, -5)).isWithin(0.00001).of(-3);
    assertThat(DoubleUtil.normalizeWithBound(-4.0, -5.0)).isWithin(0.00001).of(-4);
    assertThat(DoubleUtil.normalizeWithBound(-6.0, -5.0)).isWithin(0.00001).of(-1);

    assertThat(DoubleUtil.normalizeWithBound(-1.0, 24)).isWithin(0.00001).of(23);
    assertThat(DoubleUtil.normalizeWithBound(1.0, 24.0)).isWithin(0.00001).of(1);
    assertThat(DoubleUtil.normalizeWithBound(49.0, 24)).isWithin(0.00001).of(1);

    assertThat(DoubleUtil.normalizeWithBound(361.0, 360)).isWithin(0.00001).of(1);
    assertThat(DoubleUtil.normalizeWithBound(360.0, 360)).isWithin(0.00001).of(0);
    assertThat(DoubleUtil.normalizeWithBound(259.0, 360)).isWithin(0.00001).of(259);
    assertThat(DoubleUtil.normalizeWithBound(2592.0, 360)).isWithin(0.00001).of(72);

    assertThat(DoubleUtil.unwindAngle(-45.0)).isWithin(0.00001).of(315);
    assertThat(DoubleUtil.unwindAngle(361.0)).isWithin(0.00001).of(1);
    assertThat(DoubleUtil.unwindAngle(360.0)).isWithin(0.00001).of(0);
    assertThat(DoubleUtil.unwindAngle(259.0)).isWithin(0.00001).of(259);
    assertThat(DoubleUtil.unwindAngle(2592.0)).isWithin(0.00001).of(72);

    assertThat(DoubleUtil.normalizeWithBound(360.1, 360)).isWithin(0.01).of(0.1);
  }

  @Test
  public void testClosestAngle() {
    assertThat(DoubleUtil.closestAngle(360.0)).isWithin(0.000001).of(0);
    assertThat(DoubleUtil.closestAngle(361.0)).isWithin(0.000001).of(1);
    assertThat(DoubleUtil.closestAngle(1.0)).isWithin(0.000001).of(1);
    assertThat(DoubleUtil.closestAngle(-1.0)).isWithin(0.000001).of(-1);
    assertThat(DoubleUtil.closestAngle(-181.0)).isWithin(0.000001).of(179);
    assertThat(DoubleUtil.closestAngle(180.0)).isWithin(0.000001).of(180);
    assertThat(DoubleUtil.closestAngle(359.0)).isWithin(0.000001).of(-1);
    assertThat(DoubleUtil.closestAngle(-359.0)).isWithin(0.000001).of(1);
    assertThat(DoubleUtil.closestAngle(1261.0)).isWithin(0.000001).of(-179);
    assertThat(DoubleUtil.closestAngle(-360.1)).isWithin(0.01).of(-0.1);
  }

  @Test
  public void testTimeComponents() {
    final TimeComponents comps1 = TimeComponents.fromDouble(15.199);
    assertThat(comps1).isNotNull();
    assertThat(comps1.hours).isEqualTo(15);
    assertThat(comps1.minutes).isEqualTo(11);
    assertThat(comps1.seconds).isEqualTo(56);

    final TimeComponents comps2 = TimeComponents.fromDouble(1.0084);
    assertThat(comps2).isNotNull();
    assertThat(comps2.hours).isEqualTo(1);
    assertThat(comps2.minutes).isEqualTo(0);
    assertThat(comps2.seconds).isEqualTo(30);

    final TimeComponents comps3 = TimeComponents.fromDouble(1.0083);
    assertThat(comps3).isNotNull();
    assertThat(comps3.hours).isEqualTo(1);
    assertThat(comps3.minutes).isEqualTo(0);

    final TimeComponents comps4 = TimeComponents.fromDouble(2.1);
    assertThat(comps4).isNotNull();
    assertThat(comps4.hours).isEqualTo(2);
    assertThat(comps4.minutes).isEqualTo(6);

    final TimeComponents comps5 = TimeComponents.fromDouble(3.5);
    assertThat(comps5).isNotNull();
    assertThat(comps5.hours).isEqualTo(3);
    assertThat(comps5.minutes).isEqualTo(30);
  }

  @Test
  public void testMinuteRounding() {
    final Date comps1 = TestUtils.makeDate(2015, 1, 1, 10, 2, 29);
    final Date rounded1 = CalendarUtil.roundedMinute(comps1);

    Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("UTC"));
    calendar.setTime(rounded1);
    assertThat(calendar.get(Calendar.MINUTE)).isEqualTo(2);
    assertThat(calendar.get(Calendar.SECOND)).isEqualTo(0);

    final Date comps2 = TestUtils.makeDate(2015, 1, 1, 10, 2, 31);
    final Date rounded2 = CalendarUtil.roundedMinute(comps2);
    calendar.setTime(rounded2);
    assertThat(calendar.get(Calendar.MINUTE)).isEqualTo(3);
    assertThat(calendar.get(Calendar.SECOND)).isEqualTo(0);
  }
}
