import Coordinates from '../src/Coordinates.js';
import CalculationMethod from '../src/CalculationMethod.js';
import { computePrayerTimesForDay } from '../src/PrayerTimesCalculation.js';
import {
  PolarCircleResolution,
  resolvePolarCircle,
} from '../src/PolarCircleResolution.js';
import { describe, it, expect } from 'vitest';

// A misconfigured ishaInterval (< the 5 minute minimum gap) makes maghrib and
// isha collide everywhere, at any latitude or date - including the equator.
// This is used below to force AqrabBalad to search all the way down to (and
// including) the equator without ever finding a valid candidate.
const impossibleParams = () => {
  const params = CalculationMethod.MuslimWorldLeague();
  params.ishaInterval = 1;
  return params;
};

describe('resolvePolarCircle: AqrabBalad equator boundary', () => {
  it('sanity check: the impossible params are actually invalid at the equator directly', () => {
    const result = computePrayerTimesForDay(
      new Coordinates(0, 0),
      new Date(2026, 0, 1),
      impossibleParams(),
    );
    expect(result.isValid).toBe(false);
  });

  it('searches all the way to the equator and returns null rather than stopping early', () => {
    const resolved = resolvePolarCircle(
      PolarCircleResolution.AqrabBalad,
      new Coordinates(70, 10),
      new Date(2026, 0, 1),
      impossibleParams(),
    );
    expect(resolved).toBeNull();
  });

  it('never crosses into the other hemisphere: terminates cleanly from a starting latitude smaller than one search step, in both hemispheres', () => {
    // 0.3 is less than the 0.5 degree search step - without clamping to 0,
    // stepping toward the equator would overshoot past it into the opposite
    // sign and could oscillate forever instead of ever hitting the
    // termination check. This must return null (not hang or overflow).
    const north = resolvePolarCircle(
      PolarCircleResolution.AqrabBalad,
      new Coordinates(0.3, 10),
      new Date(2026, 0, 1),
      impossibleParams(),
    );
    expect(north).toBeNull();

    const south = resolvePolarCircle(
      PolarCircleResolution.AqrabBalad,
      new Coordinates(-0.3, 10),
      new Date(2026, 0, 1),
      impossibleParams(),
    );
    expect(south).toBeNull();
  });

  it('still resolves normally for a real polar location with valid parameters', () => {
    const resolved = resolvePolarCircle(
      PolarCircleResolution.AqrabBalad,
      new Coordinates(-84.996, 0.01013), // Amundsen-Scott South Pole Station
      new Date(2020, 11, 21), // polar night
      CalculationMethod.MuslimWorldLeague(),
    );
    expect(resolved).not.toBeNull();
    expect(resolved?.isValid).toBe(true);
  });
});

describe('resolvePolarCircle: AqrabYaum exhaustion', () => {
  it('returns null when no day of the year produces valid times', () => {
    const resolved = resolvePolarCircle(
      PolarCircleResolution.AqrabYaum,
      new Coordinates(70, 10),
      new Date(2026, 0, 1),
      impossibleParams(),
    );
    expect(resolved).toBeNull();
  });
});

describe('resolvePolarCircle: unresolved/unknown resolver', () => {
  it('returns null without searching', () => {
    const resolved = resolvePolarCircle(
      PolarCircleResolution.Unresolved,
      new Coordinates(70, 10),
      new Date(2026, 0, 1),
      CalculationMethod.MuslimWorldLeague(),
    );
    expect(resolved).toBeNull();
  });
});
