import CalculationParameters from './CalculationParameters';

const CalculationMethod = {
    // Muslim World League
    MuslimWorldLeague: function() {
        let params = new CalculationParameters(18, 17, 0, "MuslimWorldLeague");
        params.methodAdjustments = { dhuhr: 1 };
        return params;
    },

    // Egyptian General Authority of Survey
    Egyptian: function() {
        let params = new CalculationParameters(19.5, 17.5, 0, "Egyptian");
        params.methodAdjustments = { dhuhr: 1 };
        return params;
    },

    // University of Islamic Sciences, Karachi
    Karachi: function() {
        let params = new CalculationParameters(18, 18, 0, "Karachi");
        params.methodAdjustments = { dhuhr: 1 };
        return params;
    },

    // Umm al-Qura University, Makkah
    UmmAlQura: function() {
        return new CalculationParameters(18.5, 0, 90, "UmmAlQura");
    },

    // Dubai
    Dubai: function() {
        let params = new CalculationParameters(18.2, 18.2, 0, "Dubai");
        params.methodAdjustments = { sunrise: -3, dhuhr: 3, asr: 3, maghrib: 3 };
        return params;
    },

    // Moonsighting Committee
    MoonsightingCommittee: function() {
        let params = new CalculationParameters(18, 18, 0, "MoonsightingCommittee");
        params.methodAdjustments = { dhuhr: 5, maghrib: 3 };
        return params;
    },

    // ISNA
    NorthAmerica: function() {
        let params = new CalculationParameters(15, 15, 0, "NorthAmerica");
        params.methodAdjustments = { dhuhr: 1 };
        return params;
    },

    // Kuwait
    Kuwait: function() {
        return new CalculationParameters(18, 17.5, 0, "Kuwait");
    },

    // Qatar
    Qatar: function() {
        return new CalculationParameters(18, 0, 90, "Qatar");
    },

    // Singapore
    Singapore: function() {
        let params = new CalculationParameters(20, 18, 0, "Singapore");
        params.methodAdjustments = { dhuhr: 1 };
        return params;
    },

    // Other
    Other: function() {
        return new CalculationParameters(0, 0, 0, "Other");
    }
};

export default CalculationMethod;