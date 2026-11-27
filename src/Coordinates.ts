export default class Coordinates {
  /**
   * @param latitude Degrees (value must be between -90 and 90).
   * @param longitude Degrees (value must be between -180 and 180).
   * @param utcOffset The location's offset from UTC in hours (value must be
   *   between -12 and 14). Required for locations near the International Date
   *   Line.
   */
  constructor(
    public latitude: number,
    public longitude: number,
    public utcOffset?: number,
  ) {}
}
