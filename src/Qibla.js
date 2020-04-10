import Coordinates from './Coordinates'
import { degreesToRadians, radiansToDegrees, unwindAngle } from './MathUtils'

export default function qibla(coordinates) {
    var makkah = new Coordinates(21.4225241, 39.8261818);

    // Equation from "Spherical Trigonometry For the use of colleges and schools" page 50
    var term1 = (
        Math.sin(degreesToRadians(makkah.longitude) -
        degreesToRadians(coordinates.longitude))
    );
    var term2 = (
        Math.cos(degreesToRadians(coordinates.latitude)) *
        Math.tan(degreesToRadians(makkah.latitude))
    );
    var term3 = (
        Math.sin(degreesToRadians(coordinates.latitude)) *
        Math.cos(degreesToRadians(makkah.longitude) -
        degreesToRadians(coordinates.longitude))
    );
    var angle = Math.atan2(term1, term2 - term3);

    return unwindAngle(radiansToDegrees(angle));
}
