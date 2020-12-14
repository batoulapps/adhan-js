import Astronomical from './Astronomical';

export function dateByAddingDays(date, days) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate() + days;
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return new Date(year, month, day, hours, minutes, seconds);
}

export function dateByAddingMinutes(date, minutes) {
    return dateByAddingSeconds(date, minutes * 60);
}

export function dateByAddingSeconds(date, seconds) {
    return new Date(date.getTime() + (seconds * 1000));
}

export function roundedMinute(date) {
    const seconds = date.getUTCSeconds();
    const offset = seconds >= 30 ? 60 - seconds : -1 * seconds;
    return dateByAddingSeconds(date, offset);
}

export function dayOfYear(date) {
    let returnedDayOfYear = 0;
    const feb = Astronomical.isLeapYear(date.getFullYear()) ? 29 : 28;
    const months = [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (let i = 0; i < date.getMonth(); i++) {
        returnedDayOfYear += months[i];
    }

    returnedDayOfYear += date.getDate();

    return returnedDayOfYear;
}

export function isValidDate(date) {
    return date instanceof Date && !isNaN(date.valueOf());
}
