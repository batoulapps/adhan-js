## Upgrading from 3.0.0 to 4.0.0

Upgrading to 4.0.0 introduces breaking API changes.

The `adhan.Date.formattedTime` convenience function is no longer provided by this library.
These utility functions obscure the complexity of handling time zones and Daylight Saving Time (DST) shifts.

When formatting your results, never assume the user's current device timezone matches the timezone of the coordinates you passed to Adhan.

If a user living in New York calculates prayer times for London, using the device's default locale settings will incorrectly display London's times using New York's UTC offset. To prevent broken schedules and skipped calculations during seasonal DST transitions, you must explicitly bind your formatting to a specific, location-aware Time Zone Identifier (like Europe/London or America/New_York) that mirrors your geographic coordinates.

We recommend utilizing the native Temporal API (along with an environment polyfill if required) to cleanly handle this timezone mapping.

**Before**:

```js
adhan.Date.formattedTime(prayerTimes.fajr); // no longer available
```

**After**:

```js
// Recommended modern method using native Temporal
Temporal.Instant.fromEpochMilliseconds(prayerTimes.fajr.getTime())
  .toZonedDateTimeISO('America/New_York')
  .toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
```
