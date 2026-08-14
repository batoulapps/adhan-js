import Coordinates from './Coordinates.js';
import {
  degreesToRadians,
  radiansToDegrees,
  unwindAngle,
} from './MathUtils.js';

// The Kaaba (Makkah) — the fixed point every Qibla direction points to.
// Official coordinates: 21°25'21.1"N, 39°49'34.3"E.
const MAKKAH_LATITUDE = 21.4225241;
const MAKKAH_LONGITUDE = 39.8261818;

export default function qibla(coordinates: Coordinates) {
  const makkah = new Coordinates(MAKKAH_LATITUDE, MAKKAH_LONGITUDE);

  // Equation from "Spherical Trigonometry For the use of colleges and schools" page 50
  const term1 = Math.sin(
    degreesToRadians(makkah.longitude) -
      degreesToRadians(coordinates.longitude),
  );
  const term2 =
    Math.cos(degreesToRadians(coordinates.latitude)) *
    Math.tan(degreesToRadians(makkah.latitude));
  const term3 =
    Math.sin(degreesToRadians(coordinates.latitude)) *
    Math.cos(
      degreesToRadians(makkah.longitude) -
        degreesToRadians(coordinates.longitude),
    );
  const angle = Math.atan2(term1, term2 - term3);

  return unwindAngle(radiansToDegrees(angle));
}
