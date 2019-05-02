## Upgrading from 1.0.1 to 2.0.0
Upgrading to 2.0.0 introduces breaking API changes. 

JavaScript `Date` and `Number` prototypes are no longer patched by this library. 
The library should now be pure without any side effects.

This means you can no longer depend on methods like `formattedTime` being directly accessible on the Date instance. For example,
 
**Before**:

```js
prayerTimes.fajr.formattedTime(); // no longer works
```

**After**:

```js
adhan.Date.formattedTime(prayerTimes.fajr); // works
```
