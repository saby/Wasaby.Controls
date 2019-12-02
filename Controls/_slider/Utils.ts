import {Logger} from 'UI/Utils';
import {ISliderBaseOptions} from './Base';
import {ISliderRangeOptions} from './Range';
import {SyntheticEvent} from 'Vdom/Vdom';
export interface IScaleData {
    value: number;
    position: number;
}
export interface ILineData {
   position: number;
   width: number;
}
export interface IPointData {
   name: string;
   position: number;
}
export type IPointDataList = IPointData[];
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
    checkOptions(opts: ISliderBaseOptions | ISliderRangeOptions): void {
        if (opts.minValue >= opts.maxValue) {
            Logger.error('Slider: minValue must be less than maxValue.');
        }
        if (opts.scaleStep < 0) {
            Logger.error('Slider: scaleStep must positive.');
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
    },

    getNativeEventPageX(event: SyntheticEvent<MouseEvent | TouchEvent>): number {
        let targetX = 0;
        if (event.type === 'mousedown' || event.type === 'mousemove') {
            targetX = event.nativeEvent.pageX;
        } else if (event.type === 'touchstart') {
            targetX = event.nativeEvent.touches[0].pageX;
        } else {
            Logger.error('Slider: Event type must be mousedown of touchstart.');
        }
        return targetX;
    }
};
