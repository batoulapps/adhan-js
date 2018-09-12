package com.batoulapps.adhan;

import com.batoulapps.adhan.data.CalendarUtil;
import com.batoulapps.adhan.data.DateComponents;
import com.batoulapps.adhan.data.TimeComponents;
import com.batoulapps.adhan.internal.SolarTime;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.TimeZone;

public class PrayerTimes {
  public final Date fajr;
  public final Date sunrise;
  public final Date dhuhr;
  public final Date asr;
  public final Date maghrib;
  public final Date isha;

  /**
   * Calculate PrayerTimes
   * @param coordinates the coordinates of the location
   * @param date the date components for that location
   * @param params the parameters for the calculation
   */
  public PrayerTimes(Coordinates coordinates, DateComponents date, CalculationParameters params) {
    this(coordinates, CalendarUtil.resolveTime(date), params);
  }

  private PrayerTimes(Coordinates coordinates, Date date, CalculationParameters parameters) {
    Date tempFajr = null;
    Date tempSunrise = null;
    Date tempDhuhr = null;
    Date tempAsr = null;
    Date tempMaghrib = null;
    Date tempIsha = null;

    Calendar calendar = GregorianCalendar.getInstance(TimeZone.getTimeZone("UTC"));
    calendar.setTime(date);

    final int year = calendar.get(Calendar.YEAR);
    final int dayOfYear = calendar.get(Calendar.DAY_OF_YEAR);

    SolarTime solarTime = new SolarTime(date, coordinates);

    TimeComponents timeComponents = TimeComponents.fromDouble(solarTime.transit);
    Date transit = timeComponents == null ? null : timeComponents.dateComponents(date);

    timeComponents = TimeComponents.fromDouble(solarTime.sunrise);
    Date sunriseComponents = timeComponents == null ? null : timeComponents.dateComponents(date);

    timeComponents = TimeComponents.fromDouble(solarTime.sunset);
    Date sunsetComponents = timeComponents == null ? null : timeComponents.dateComponents(date);

    boolean error = transit == null || sunriseComponents == null || sunsetComponents == null;
    if (!error) {
      tempDhuhr = transit;
      tempSunrise = sunriseComponents;
      tempMaghrib = sunsetComponents;

      timeComponents = TimeComponents.fromDouble(
          solarTime.afternoon(parameters.madhab.getShadowLength()));
      if (timeComponents != null) {
        tempAsr = timeComponents.dateComponents(date);
      }

      // get night length
      Date tomorrowSunrise = CalendarUtil.add(sunriseComponents, 1, Calendar.DAY_OF_YEAR);
      long night = tomorrowSunrise.getTime() - sunsetComponents.getTime();

      timeComponents = TimeComponents
          .fromDouble(solarTime.hourAngle(-parameters.fajrAngle, false));
      if (timeComponents != null) {
        tempFajr = timeComponents.dateComponents(date);
      }

      if (parameters.method == CalculationMethod.MOON_SIGHTING_COMMITTEE &&
          coordinates.latitude >= 55) {
        tempFajr = CalendarUtil.add(
            sunriseComponents, -1 * (int) (night / 7000), Calendar.SECOND);
      }

      final CalculationParameters.NightPortions nightPortions = parameters.nightPortions();

      final Date safeFajr;
      if (parameters.method == CalculationMethod.MOON_SIGHTING_COMMITTEE) {
        safeFajr = seasonAdjustedMorningTwilight(coordinates.latitude, dayOfYear, year, sunriseComponents);
      } else {
        double portion = nightPortions.fajr;
        long nightFraction = (long) (portion * night / 1000);
        safeFajr = CalendarUtil.add(
            sunriseComponents, -1 * (int) nightFraction, Calendar.SECOND);
      }

      if (tempFajr == null || tempFajr.before(safeFajr)) {
        tempFajr = safeFajr;
      }

      // Isha calculation with check against safe value
      if (parameters.ishaInterval > 0) {
        tempIsha = CalendarUtil.add(tempMaghrib, parameters.ishaInterval * 60, Calendar.SECOND);
      } else {
        timeComponents = TimeComponents.fromDouble(
            solarTime.hourAngle(-parameters.ishaAngle, true));
        if (timeComponents != null) {
          tempIsha = timeComponents.dateComponents(date);
        }

        if (parameters.method == CalculationMethod.MOON_SIGHTING_COMMITTEE &&
            coordinates.latitude >= 55) {
          long nightFraction = night / 7000;
          tempIsha = CalendarUtil.add(sunsetComponents, (int) nightFraction, Calendar.SECOND);
        }

        final Date safeIsha;
        if (parameters.method == CalculationMethod.MOON_SIGHTING_COMMITTEE) {
            safeIsha = PrayerTimes.seasonAdjustedEveningTwilight(
                coordinates.latitude, dayOfYear, year, sunsetComponents);
        } else {
          double portion = nightPortions.isha;
          long nightFraction = (long) (portion * night / 1000);
          safeIsha = CalendarUtil.add(sunsetComponents, (int) nightFraction, Calendar.SECOND);
        }

        if (tempIsha == null || (tempIsha.after(safeIsha))) {
          tempIsha = safeIsha;
        }
      }
    }

    // method based offsets
    final int dhuhrOffsetInMinutes;
    if (parameters.method == CalculationMethod.MOON_SIGHTING_COMMITTEE) {
      // Moonsighting Committee requires 5 minutes for the sun to pass
      // the zenith and dhuhr to enter
      dhuhrOffsetInMinutes = 5;
    } else if (parameters.method == CalculationMethod.UMM_AL_QURA ||
               parameters.method == CalculationMethod.GULF ||
               parameters.method == CalculationMethod.QATAR) {
      // UmmAlQura and derivatives don't add
      // anything to zenith for dhuhr
      dhuhrOffsetInMinutes = 0;
    } else {
      dhuhrOffsetInMinutes = 1;
    }

    final int maghribOffsetInMinutes;
    if (parameters.method == CalculationMethod.MOON_SIGHTING_COMMITTEE) {
      // Moonsighting Committee adds 3 minutes to sunset time to account for light refraction
      maghribOffsetInMinutes = 3;
    } else {
      maghribOffsetInMinutes = 0;
    }

    if (error || tempAsr == null) {
      // if we don't have all prayer times then initialization failed
      this.fajr = null;
      this.sunrise = null;
      this.dhuhr = null;
      this.asr = null;
      this.maghrib = null;
      this.isha = null;
    } else {
      // Assign final times to public struct members with all offsets
      this.fajr = CalendarUtil.roundedMinute(CalendarUtil.add(
          tempFajr, parameters.adjustments.fajr, Calendar.MINUTE));
      this.sunrise = CalendarUtil.roundedMinute(
          CalendarUtil.add(tempSunrise, parameters.adjustments.sunrise, Calendar.MINUTE));
      this.dhuhr = CalendarUtil.roundedMinute(CalendarUtil.add(
          tempDhuhr, parameters.adjustments.dhuhr + dhuhrOffsetInMinutes, Calendar.MINUTE));
      this.asr = CalendarUtil.roundedMinute(CalendarUtil.add(
          tempAsr, parameters.adjustments.asr, Calendar.MINUTE));
      this.maghrib = CalendarUtil.roundedMinute(CalendarUtil.add(
          tempMaghrib, parameters.adjustments.maghrib + maghribOffsetInMinutes, Calendar.MINUTE));
      this.isha = CalendarUtil.roundedMinute(CalendarUtil.add(
          tempIsha, parameters.adjustments.isha, Calendar.MINUTE));
    }
  }

  public Prayer currentPrayer() {
    return currentPrayer(new Date());
  }

  public Prayer currentPrayer(Date time) {
    long when = time.getTime();
    if (this.isha.getTime() - when <= 0) {
      return Prayer.ISHA;
    } else if (this.maghrib.getTime() - when <= 0) {
      return Prayer.MAGHRIB;
    } else if (this.asr.getTime() - when <= 0) {
      return Prayer.ASR;
    } else if (this.dhuhr.getTime() - when <= 0) {
      return Prayer.DHUHR;
    } else if (this.sunrise.getTime() - when <= 0) {
      return Prayer.SUNRISE;
    } else if (this.fajr.getTime() - when <= 0) {
      return Prayer.FAJR;
    } else {
      return Prayer.NONE;
    }
  }

  public Prayer nextPrayer() {
    return nextPrayer(new Date());
  }

  public Prayer nextPrayer(Date time) {
    long when = time.getTime();
    if (this.isha.getTime() - when <= 0) {
      return Prayer.NONE;
    } else if (this.maghrib.getTime() - when <= 0) {
      return Prayer.ISHA;
    } else if (this.asr.getTime() - when <= 0) {
      return Prayer.MAGHRIB;
    } else if (this.dhuhr.getTime() - when <= 0) {
      return Prayer.ASR;
    } else if (this.sunrise.getTime() - when <= 0) {
      return Prayer.DHUHR;
    } else if (this.fajr.getTime() - when <= 0) {
      return Prayer.SUNRISE;
    } else {
      return Prayer.FAJR;
    }
  }

  public Date timeForPrayer(Prayer prayer) {
    switch (prayer) {
      case FAJR:
        return this.fajr;
      case SUNRISE:
        return this.sunrise;
      case DHUHR:
        return this.dhuhr;
      case ASR:
        return this.asr;
      case MAGHRIB:
        return this.maghrib;
      case ISHA:
        return this.isha;
      case NONE:
      default:
        return null;
    }
  }

  private static Date seasonAdjustedMorningTwilight(
      double latitude, int day, int year, Date sunrise) {
    final double a = 75 + ((28.65 / 55.0) * Math.abs(latitude));
    final double b = 75 + ((19.44 / 55.0) * Math.abs(latitude));
    final double c = 75 + ((32.74 / 55.0) * Math.abs(latitude));
    final double d = 75 + ((48.10 / 55.0) * Math.abs(latitude));

    final double adjustment;
    final int dyy = PrayerTimes.daysSinceSolstice(day, year, latitude);
    if ( dyy < 91) {
      adjustment = a + ( b - a ) / 91.0 * dyy;
    } else if ( dyy < 137) {
      adjustment = b + ( c - b ) / 46.0 * ( dyy - 91 );
    } else if ( dyy < 183 ) {
      adjustment = c + ( d - c ) / 46.0 * ( dyy - 137 );
    } else if ( dyy < 229 ) {
      adjustment = d + ( c - d ) / 46.0 * ( dyy - 183 );
    } else if ( dyy < 275 ) {
      adjustment = c + ( b - c ) / 46.0 * ( dyy - 229 );
    } else {
      adjustment = b + ( a - b ) / 91.0 * ( dyy - 275 );
    }

    return CalendarUtil.add(sunrise, -(int) Math.round(adjustment * 60.0), Calendar.SECOND);
  }

  private static Date seasonAdjustedEveningTwilight(
      double latitude, int day, int year, Date sunset) {
    final double a = 75 + ((25.60 / 55.0) * Math.abs(latitude));
    final double b = 75 + ((2.050 / 55.0) * Math.abs(latitude));
    final double c = 75 - ((9.210 / 55.0) * Math.abs(latitude));
    final double d = 75 + ((6.140 / 55.0) * Math.abs(latitude));

    final double adjustment;
    final int dyy = PrayerTimes.daysSinceSolstice(day, year, latitude);
    if ( dyy < 91) {
      adjustment = a + ( b - a ) / 91.0 * dyy;
    } else if ( dyy < 137) {
      adjustment = b + ( c - b ) / 46.0 * ( dyy - 91 );
    } else if ( dyy < 183 ) {
      adjustment = c + ( d - c ) / 46.0 * ( dyy - 137 );
    } else if ( dyy < 229 ) {
      adjustment = d + ( c - d ) / 46.0 * ( dyy - 183 );
    } else if ( dyy < 275 ) {
      adjustment = c + ( b - c ) / 46.0 * ( dyy - 229 );
    } else {
      adjustment = b + ( a - b ) / 91.0 * ( dyy - 275 );
    }

    return CalendarUtil.add(sunset, (int) Math.round(adjustment * 60.0), Calendar.SECOND);
  }

  static int daysSinceSolstice(int dayOfYear, int year, double latitude) {
    int daysSinceSolistice;
    final int northernOffset = 10;
    boolean isLeapYear = CalendarUtil.isLeapYear(year);
    final int southernOffset = isLeapYear ? 173 : 172;
    final int daysInYear = isLeapYear ? 366 : 365;

    if (latitude >= 0) {
      daysSinceSolistice = dayOfYear + northernOffset;
      if (daysSinceSolistice >= daysInYear) {
        daysSinceSolistice = daysSinceSolistice - daysInYear;
      }
    } else {
      daysSinceSolistice = dayOfYear - southernOffset;
      if (daysSinceSolistice < 0) {
        daysSinceSolistice = daysSinceSolistice + daysInYear;
      }
    }
    return daysSinceSolistice;
  }
}
