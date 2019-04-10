import {TimeInterval} from 'Types/entity';

interface IFormatMaskChars {
    D: string;
    H: string;
    m: string;
    s: string;
    U: string;
}

interface IFound {
    end: number;
    value: number;
}

export interface IOptions {
    mask: string;
    value: TimeInterval;
}

export class ViewModel {
    autoComplete(): boolean {
        if (this.value !== null) {
            if (this.value.toString() !== 'P0DT0H0M0S') {
                this.displayValue = this._convertToDisplayValue(this.value);
            }
        }
        return false;
    }

    protected _convertToValue(displayValue: string) {
        var result;
        if (typeof displayValue === 'string') {
            result = _private.valueToTimeIntervalConverter(this, displayValue);
        } else {
            result = displayValue;
        }
        return result;
    }

    private valueToTimeIntervalConverter(value: string): TimeInterval {
        const parsedValue: Array<number|string> = this._displayValueParser(value);
        let formatTimeInterval: string = 'P0DT';

        const numHours: number = this._options.mask.match(/H/g).length;
        const hours: string = parsedValue
            .slice(0, numHours)
            .filter((item) => typeof item === 'number')
            .join('');

        formatTimeInterval = ViewModel._addItemFormat(formatTimeInterval, hours, 'H');

        const numMinutes: number = this._options.mask.match(/m/g).length;
        let minutes: string = parsedValue
            .slice(numHours, numHours + numMinutes)
            .filter((item) => typeof item === 'number')
            .join('');

        const maxValueOfMinutesAndSeconds: number = 59;

        if (parseInt(minutes, 10) > maxValueOfMinutesAndSeconds) {
            minutes = maxValueOfMinutesAndSeconds.toString();
        }

        formatTimeInterval = ViewModel._addItemFormat(formatTimeInterval, minutes, 'M');

        const secondMask: string[]|null = this._options.mask.match(/s/g);

        if (secondMask === null) {
            return new TimeInterval(formatTimeInterval);
        }

        const numSeconds: number = secondMask.length;
        let seconds: string = parsedValue
            .slice(numHours + numMinutes, numHours + numMinutes + numSeconds)
            .filter((item) => typeof item === 'number')
            .join('');

        if (parseInt(seconds, 10) > maxValueOfMinutesAndSeconds) {
            seconds = maxValueOfMinutesAndSeconds.toString();
        }

        formatTimeInterval = ViewModel._addItemFormat(formatTimeInterval, seconds, 'S');

        return new TimeInterval(formatTimeInterval);
    }

    private _displayValueParser(value): Array<number|string> {
        var clearValue;
        var clearArray = [];
        self._format = FormatBuilder.getFormat(self._options.mask, self.formatMaskChars, self.replacer);
        clearValue = Formatter.getClearData(self._format, value);
        for (var i = 0; i < clearValue.value.length; i++) {
            var item = parseInt(clearValue.value[i]);
            if (typeof item === 'number' && !isNaN(item)) {
                clearArray.push(item);
            } else {
                clearArray.push(self.replacer);
            }
        }
        return clearArray;
    }

    private static formatMaskChars: IFormatMaskChars = {
        D: '[0-9]',
        H: '[0-9]',
        m: '[0-9]',
        s: '[0-9]',
        U: '[0-9]'
    };

    private static replacer: string = ' ';

    private static _addItemFormat(original: string, value: string, id: string): string {
        return original + (value || '0') + id;
    }

    private static _foundTimeUnits(value: Array<number|string>, start: number, count: number): IFound {
        const numTimeUnits: number = mask.match(/H/g).length;
        const hours: string = parsedValue
            .slice(0, numHours)
            .filter((item) => typeof item === 'number')
            .join('');
    }
}
