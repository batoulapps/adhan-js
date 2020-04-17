export const Madhab = {
    Shafi: 'shafi',
    Hanafi: 'hanafi'
};

export function shadowLength(madhab) {
    switch (madhab) {
        case Madhab.Shafi:
            return 1;
        case Madhab.Hanafi:
            return 2
        default:
            throw "Invalid Madhab";
    }
}
