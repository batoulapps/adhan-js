export default class TimeComponents {
    constructor(number) {
        this.hours = Math.floor(number);
        this.minutes = Math.floor((number - this.hours) * 60);
        this.seconds = Math.floor((number - (this.hours + this.minutes / 60)) * 60 * 60);
        return this;
    }
    
    utcDate(year, month, date) {
        return new Date(Date.UTC(year, month, date, this.hours, this.minutes, this.seconds));
    }
}
