import { radiansToDegrees, degreesToRadians, normalizeToScale, unwindAngle, quadrantShiftAngle } from '../src/MathUtils';
import { roundedMinute, dateByAddingDays } from '../src/DateUtils';
import TimeComponents from '../src/TimeComponents';
import { Rounding } from '../src/Rounding';

test("converting between degrees and radians", () => {
    expect(radiansToDegrees(Math.PI)).toBe(180);
    expect(degreesToRadians(180)).toBe(Math.PI);
    expect(radiansToDegrees(Math.PI/2)).toBe(90);
    expect(degreesToRadians(90)).toBe(Math.PI/2);
});

test("normalizes the number to be inside the specified scale", () => {
    expect(normalizeToScale(2.0, -5)).toBe(-3);
    expect(normalizeToScale(-4, -5)).toBe(-4);
    expect(normalizeToScale(-6, -5)).toBe(-1);

    expect(normalizeToScale(-1, 24)).toBe(23);
    expect(normalizeToScale(1, 24)).toBe(1);
    expect(normalizeToScale(49.0, 24)).toBe(1);

    expect(normalizeToScale(361, 360)).toBe(1);
    expect(normalizeToScale(360, 360)).toBe(0);
    expect(normalizeToScale(259, 360)).toBe(259);
    expect(normalizeToScale(2592.0, 360)).toBe(72);

    expect(unwindAngle(-45)).toBe(315);
    expect(unwindAngle(361.0)).toBe(1);
    expect(unwindAngle(360)).toBe(0);
    expect(unwindAngle(259.0)).toBe(259);
    expect(unwindAngle(2592)).toBe(72);

    expect(normalizeToScale(360.1, 360)).toBeCloseTo(0.1, 9);
});

test("find the same angle constrained within the first and fourth quadrants", () => {
    expect(quadrantShiftAngle(360.0)).toBe(0);
    expect(quadrantShiftAngle(361.0)).toBe(1);
    expect(quadrantShiftAngle(1.0)).toBe(1);
    expect(quadrantShiftAngle(-1.0)).toBe(-1);
    expect(quadrantShiftAngle(-181.0)).toBe(179);
    expect(quadrantShiftAngle(180.0)).toBe(180);
    expect(quadrantShiftAngle(359.0)).toBe(-1);
    expect(quadrantShiftAngle(-359.0)).toBe(1);
    expect(quadrantShiftAngle(1261.0)).toBe(-179);
    expect(quadrantShiftAngle(-360.1)).toBeCloseTo(-0.1, 9);
});

test("break down an hour value into separate hour, minute, and second values", () => {
    const comps1 = new TimeComponents(15.199)
    expect(comps1.hours).toBe(15);
    expect(comps1.minutes).toBe(11);
    expect(comps1.seconds).toBe(56);

    const comps2 = new TimeComponents(1.0084);
    expect(comps2.hours).toBe(1);
    expect(comps2.minutes).toBe(0);
    expect(comps2.seconds).toBe(30);

    const comps3 = new TimeComponents(1.0083);
    expect(comps3.hours).toBe(1);
    expect(comps3.minutes).toBe(0);

    const comps4 = new TimeComponents(2.1);
    expect(comps4.hours).toBe(2);
    expect(comps4.minutes).toBe(6);

    const comps5 = new TimeComponents(3.5);
    expect(comps5.hours).toBe(3);
    expect(comps5.minutes).toBe(30);
});

test("rounding a date to the closest minute", () => {
    const date1 = roundedMinute(new Date(2015, 0, 1, 10, 2, 29));
    expect(date1.getMinutes()).toBe(2);
    expect(date1.getSeconds()).toBe(0);

    const date2 = roundedMinute(new Date(2015, 0, 1, 10, 2, 31));
    expect(date2.getMinutes()).toBe(3);
    expect(date2.getSeconds()).toBe(0);

    const date3 = roundedMinute(new Date(2015, 0, 1, 10, 2, 29), Rounding.Up);
    expect(date3.getMinutes()).toBe(3);
    expect(date3.getSeconds()).toBe(0);

    const date4 = roundedMinute(new Date(2015, 0, 1, 10, 2, 29), Rounding.None);
    expect(date4.getMinutes()).toBe(2);
    expect(date4.getSeconds()).toBe(29);

    const date5 = roundedMinute(new Date(2015, 0, 1, 10, 2, 29), Rounding.Nearest);
    expect(date5.getMinutes()).toBe(2);
    expect(date5.getSeconds()).toBe(0);
});

test("adding days to date", () => {
    const date1 = new Date(2015, 10, 1, 0, 0, 0);
    expect(date1.getDate()).toBe(1);

    const date2 = dateByAddingDays(date1, 1);
    expect(date2.getDate()).toBe(2);
});