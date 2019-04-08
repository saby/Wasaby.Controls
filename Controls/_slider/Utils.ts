export default {
    getRatio(pos, left, width) {
        return (pos - left) / width;
    },
    calcValue (minValue, maxValue, ratio, perc) {
        const rangeLength = maxValue - minValue;
        const val = minValue + Math.max(Math.min(ratio, 1), 0) * rangeLength;
        return parseFloat(val.toFixed(perc));
    },
    checkOptions(opts) {
        if (opts.minValue >= opts.maxValue) {
            Env.IoC.resolve('ILogger').error('Slider', 'minValue must be less than maxValue.');
        }
        if (opts.scaleStep < 0) {
            Env.IoC.resolve('ILogger').error('Slider', 'scaleStep must positive.');
        }
    },
    getScaleData: function(minValue, maxValue, scaleStep) {
        var scaleData = [];
        if (scaleStep) {
            const scaleRange = maxValue - minValue;
            scaleData.push({value: minValue, position: 0});
            for (let i = minValue + scaleStep; i <= maxValue - scaleStep / 2; i += scaleStep) {
                scaleData.push({value: i, position: (i - minValue) / scaleRange * 100});
            }
            scaleData.push({value: maxValue, position: 100});
        }
        return scaleData;
    }
};
