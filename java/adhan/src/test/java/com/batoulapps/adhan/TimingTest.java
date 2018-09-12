package com.batoulapps.adhan;

import com.batoulapps.adhan.data.TimingFile;
import com.batoulapps.adhan.data.TimingInfo;
import com.batoulapps.adhan.data.TimingParameters;
import com.batoulapps.adhan.data.DateComponents;
import com.batoulapps.adhan.internal.TestUtils;
import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;

import org.junit.Before;
import org.junit.Test;

import java.io.File;
import java.io.FileFilter;
import java.text.SimpleDateFormat;
import java.util.TimeZone;

import okio.Okio;

import static com.google.common.truth.Truth.assertThat;

public class TimingTest {

  private static final String PATH = "../../Times/";

  private JsonAdapter<TimingFile> jsonAdapter;

  @Before
  public void setup() {
    Moshi moshi = new Moshi.Builder().build();
    jsonAdapter = moshi.adapter(TimingFile.class);
  }

  @Test
  public void testTimes() throws Exception {
    File timingDirectory = new File(PATH);
    File[] files = timingDirectory.listFiles(new FileFilter() {
      public boolean accept(File pathname) {
        return pathname.getName().endsWith(".json");
      }
    });

    for (File timingFile : files) {
      testTimingFile(timingFile);
    }
  }

  private void testTimingFile(File jsonFile) throws Exception {
    System.out.println("testing timings for " + jsonFile.getName());
    TimingFile timingFile = jsonAdapter.fromJson(Okio.buffer(Okio.source(jsonFile)));
    assertThat(timingFile).isNotNull();

    Coordinates coordinates = new Coordinates(
        timingFile.params.latitude, timingFile.params.longitude);
    CalculationParameters parameters = parseParameters(timingFile.params);

    SimpleDateFormat formatter = new SimpleDateFormat("h:mm a");
    formatter.setTimeZone(TimeZone.getTimeZone(timingFile.params.timezone));

    for (TimingInfo info : timingFile.times) {
      DateComponents dateComponents = TestUtils.getDateComponents(info.date);
      PrayerTimes prayerTimes = new PrayerTimes(coordinates, dateComponents, parameters);
      assertThat(formatter.format(prayerTimes.fajr)).isEqualTo(info.fajr);
      assertThat(formatter.format(prayerTimes.sunrise)).isEqualTo(info.sunrise);
      assertThat(formatter.format(prayerTimes.dhuhr)).isEqualTo(info.dhuhr);
      assertThat(formatter.format(prayerTimes.asr)).isEqualTo(info.asr);
      assertThat(formatter.format(prayerTimes.maghrib)).isEqualTo(info.maghrib);
      assertThat(formatter.format(prayerTimes.isha)).isEqualTo(info.isha);
    }
  }

  private CalculationParameters parseParameters(TimingParameters timingParameters) {
    final CalculationMethod method;
    switch (timingParameters.method) {
      case "MuslimWorldLeague": {
        method = CalculationMethod.MUSLIM_WORLD_LEAGUE;
        break;
      }
      case "Egyptian": {
        method = CalculationMethod.EGYPTIAN;
        break;
      }
      case "Karachi": {
        method = CalculationMethod.KARACHI;
        break;
      }
      case "UmmAlQura": {
        method = CalculationMethod.UMM_AL_QURA;
        break;
      }
      case "Gulf": {
        method = CalculationMethod.GULF;
        break;
      }
      case "MoonsightingCommittee": {
        method = CalculationMethod.MOON_SIGHTING_COMMITTEE;
        break;
      }
      case "NorthAmerica": {
        method = CalculationMethod.NORTH_AMERICA;
        break;
      }
      case "Kuwait": {
        method = CalculationMethod.KUWAIT;
        break;
      }
      case "Qatar": {
        method = CalculationMethod.QATAR;
        break;
      }
      case "Singapore": {
        method = CalculationMethod.SINGAPORE;
        break;
      }
      default: {
        method = CalculationMethod.OTHER;
      }
    }

    CalculationParameters parameters = method.getParameters();
    if ("Shafi".equals(timingParameters.madhab)) {
      parameters.madhab = Madhab.SHAFI;
    } else if ("Hanafi".equals(timingParameters.madhab)) {
      parameters.madhab = Madhab.HANAFI;
    }

    if ("SeventhOfTheNight".equals(timingParameters.highLatitudeRule)) {
      parameters.highLatitudeRule = HighLatitudeRule.SEVENTH_OF_THE_NIGHT;
    } else if ("TwilightAngle".equals(timingParameters.highLatitudeRule)) {
      parameters.highLatitudeRule = HighLatitudeRule.TWILIGHT_ANGLE;
    } else {
      parameters.highLatitudeRule = HighLatitudeRule.MIDDLE_OF_THE_NIGHT;
    }

    return parameters;
  }

}
