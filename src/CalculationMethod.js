import CalculationParameters from './CalculationParameters';

const CalculationMethod = {
    // Muslim World League
    MuslimWorldLeague() {
        const params = new CalculationParameters("MuslimWorldLeague", 18, 17);
        params.methodAdjustments = { dhuhr: 1 };
        return params;
    },

    // Egyptian General Authority of Survey
    Egyptian() {
        const params = new CalculationParameters("Egyptian", 19.5, 17.5);
        params.methodAdjustments = { dhuhr: 1 };
        return params;
    },

    // University of Islamic Sciences, Karachi
    Karachi() {
        const params = new CalculationParameters("Karachi", 18, 18);
        params.methodAdjustments = { dhuhr: 1 };
        return params;
    },

    // Umm al-Qura University, Makkah
    UmmAlQura() {
        return new CalculationParameters("UmmAlQura", 18.5, 0, 90);
    },

    // Dubai
    Dubai() {
        const params = new CalculationParameters("Dubai", 18.2, 18.2);
        params.methodAdjustments = { sunrise: -3, dhuhr: 3, asr: 3, maghrib: 3 };
        return params;
    },

    // Moonsighting Committee
    MoonsightingCommittee() {
        const params = new CalculationParameters("MoonsightingCommittee", 18, 18);
        params.methodAdjustments = { dhuhr: 5, maghrib: 3 };
        return params;
    },

    // ISNA
    NorthAmerica() {
        const params = new CalculationParameters("NorthAmerica", 15, 15);
        params.methodAdjustments = { dhuhr: 1 };
        return params;
    },

    // Kuwait
    Kuwait() {
        return new CalculationParameters("Kuwait", 18, 17.5);
    },

    // Qatar
    Qatar() {
        return new CalculationParameters("Qatar", 18, 0, 90);
    },

    // Singapore
    Singapore() {
        const params = new CalculationParameters("Singapore", 20, 18);
        params.methodAdjustments = { dhuhr: 1 };
        return params;
    },

    // Institute of Geophysics, University of Tehran
    Tehran() {
        const params = new CalculationParameters("Tehran", 17.7, 14, 0, 4.5);
        return params;
    },

    // Dianet
    Turkey() {
        const params = new CalculationParameters("Turkey", 18, 17);
        params.methodAdjustments = { sunrise: -7, dhuhr: 5, asr: 4, maghrib: 7 };
        return params;
    },

    // Other
    Other() {
        return new CalculationParameters("Other", 0, 0);
    }
};

export default CalculationMethod;