## Upgrading from 3.0.0 to 4.0.0
Upgrading to 4.0.0 introduces breaking API changes. 

The `adhan.Date.formattedTime` convenience function is no longer provided by this library. 
These functions obscure the difficulty in dealing with Daylight Savings Time
and other timezone issues.

Instead you should use a timezone aware date formatting library like [moment](https://momentjs.com).
 
**Before**:

```js
adhan.Date.formattedTime(prayerTimes.fajr); // no longer available
```

**After**:

```js
moment(prayerTimes.fajr).tz('America/New_York').format('h:mm A'); // Recommended method
```
