import Coordinates from './Coordinates'
import { degreesToRadians, radiansToDegrees, unwindAngle } from './MathUtils'

export default function qibla(coordinates) {
    const makkah = new Coordinates(21.4225241, 39.8261818);

    // Equation from "Spherical Trigonometry For the use of colleges and schools" page 50
    const term1 = (
        Math.sin(degreesToRadians(makkah.longitude) -
        degreesToRadians(coordinates.longitude))
    );
    const term2 = (
        Math.cos(degreesToRadians(coordinates.latitude)) *
        Math.tan(degreesToRadians(makkah.latitude))
    );
    const term3 = (
        Math.sin(degreesToRadians(coordinates.latitude)) *
        Math.cos(degreesToRadians(makkah.longitude) -
        degreesToRadians(coordinates.longitude))
    );
    const angle = Math.atan2(term1, term2 - term3);

    return unwindAngle(radiansToDegrees(angle));
}
