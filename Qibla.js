(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
} else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.qibla = factory();
  }
}(this, function () {
  var degreesToRadians = function(degrees) {
    return degrees * (Math.PI / 180);
  };

  var radiansToDegrees = function(radians) {
    return radians * (180 / Math.PI);
  };

  var normalizeWithBound = function(number, max) {
    return number - (max * (Math.floor(number / max)));
  };

  var unwindAngle = function(angle) {
    return normalizeWithBound(angle, 360.0);
  };

  var makkah = { latitude: 21.4225241, longitude: 39.8261818 };

  var calculate = function(coordinates) {
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
  };

  return calculate;
}))
