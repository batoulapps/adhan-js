import {Rounding} from './Rounding'
import {ValueOf} from './type-utils'

type Hours = number

export default class TimeComponents {
  hours: number
  minutes: number
  seconds: number
  constructor(num: Hours) {
    this.hours = Math.floor(num)
    let rest = num - this.hours
    this.minutes = Math.floor(rest * 60)
    rest = rest * 60 - this.minutes
    this.seconds = Math.floor(rest * 60)
    return this
  }

  utcDate(year: number, month: number, day: number): Date {
    return new Date(
      Date.UTC(year, month, day, this.hours, this.minutes, this.seconds),
    )
  }

  toSeconds(): number {
    return this.hours * 60 * 60 + this.minutes * 60 + this.seconds
  }

  toHours(): Hours {
    return this.hours + this.minutes / 60 + this.seconds / 3600
  }

  greaterThan(time: TimeComponents): boolean {
    return this.toSeconds() > time.toSeconds()
  }

  smallerThan(time: TimeComponents): boolean {
    return this.toSeconds() < time.toSeconds()
  }

  static addSeconds(time: TimeComponents, seconds: number): TimeComponents {
    return new TimeComponents(time.toHours() + seconds / 3600)
  }
  static addMinutes(time: TimeComponents, minutes: number): TimeComponents {
    return this.addSeconds(time, minutes * 60)
  }

  static roundedMinute(
    time: TimeComponents,
    rounding: ValueOf<typeof Rounding> = Rounding.Nearest,
  ): TimeComponents {
    const seconds = time.seconds
    let offset = seconds >= 30 ? 60 - seconds : -1 * seconds
    if (rounding === Rounding.Up) {
      offset = 60 - seconds
    } else if (rounding === Rounding.None) {
      offset = 0
    }
    return TimeComponents.addSeconds(time, offset)
  }
}
