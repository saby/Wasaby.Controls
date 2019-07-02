import {IoC} from 'Env/Env';
import {ISliderBaseOptions} from './Base';
export interface IScaleData {
    value: number;
    position: number;
}
const maxPercentValue = 100;
const stepDenominator = 2;
export default {
    getRatio(pos: number, left: number, width: number): number {
        return (pos - left) / width;
    },
    calcValue(minValue: number, maxValue: number, ratio: number, perc: number): number {
        const rangeLength = maxValue - minValue;
        const val = minValue + Math.max(Math.min(ratio, 1), 0) * rangeLength;
        return parseFloat(val.toFixed(perc));
    },
    checkOptions(opts: ISliderBaseOptions): void {
        if (opts.minValue >= opts.maxValue) {
            IoC.resolve('ILogger').error('Slider', 'minValue must be less than maxValue.');
        }
        if (opts.scaleStep < 0) {
            IoC.resolve('ILogger').error('Slider', 'scaleStep must positive.');
        }
    },
    getScaleData(minValue: number, maxValue: number, scaleStep: number): IScaleData[] {
        const scaleData: IScaleData[] = [];
        if (scaleStep > 0) {
            const scaleRange = maxValue - minValue;
            scaleData.push({value: minValue, position: 0});
            for (let i = minValue + scaleStep; i <= maxValue - scaleStep / stepDenominator; i += scaleStep) {
                scaleData.push({value: i, position: (i - minValue) / scaleRange * maxPercentValue});
            }
            scaleData.push({value: maxValue, position: 100});
        }
        return scaleData;
    }
};
