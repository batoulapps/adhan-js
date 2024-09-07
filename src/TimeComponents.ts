export default class TimeComponents {
  hours: number;
  minutes: number;
  seconds: number;

  constructor(num: number) {
    this.hours = Math.floor(num);
    this.minutes = Math.floor((num - this.hours) * 60);
    this.seconds = Math.floor(
      (num - (this.hours + this.minutes / 60)) * 60 * 60,
    );
    return this;
  }

  utcDate(date: Date) {
    return new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        this.hours,
        this.minutes,
        this.seconds,
      ),
    );
  }
}
