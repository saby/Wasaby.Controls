export default {
    round: function (val, perc) {
        return parseFloat(val.toFixed(perc));
    },
    getRatio: function(pos, left, width) {
        return (pos - left) / width;
    },
    calcValue: function (minValue, maxValue, ratio) {
        const rangeLength = maxValue - minValue;
        const val = Math.max(Math.min(ratio, 1), 0) * rangeLength;
        return minValue + val;
    }
};
