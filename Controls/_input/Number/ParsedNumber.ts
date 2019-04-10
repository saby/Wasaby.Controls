import splitIntoTriads = require('Controls/Utils/splitIntoTriads');

import {IText, pasteWithRepositioning, remove, removeWithRepositioning} from 'Controls/_input/Base/Util';

interface INumberLength {
    precision: number;
    integersLength: number;
}

interface INumberDisplay {
    useGrouping: boolean;
}

interface INumberSign {
    onlyPositive: boolean;
}

interface IFilteredData {
    value: string[];
    splitterPosition: number;
}

interface IDataAfterLimiting {
    value: string;
    position: number;
    movedValue: string;
}

interface IPosition {
    absolute: number;
    relative: number;
}

interface IParsedNumber {
    readonly integer: string;
    readonly fractional: string;

    readonly negative: number;

    parse(value: string): this;

    format(options: NumberOptions, carriagePosition: number): IText;
}

type Parts = 'integer' | 'fractional';
type NumberOptions = INumberLength & INumberDisplay & INumberSign;

export default class ParsedNumber implements IParsedNumber {
    protected _integer: string;
    protected _fractional: string;
    protected _negative: boolean;

    constructor(value: string = '') {
        this._parseNumber(value);
    }

    get integer(): string {
        return this._integer;
    }

    get fractional(): string {
        return this._fractional;
    }

    get negative(): number {
        return +this._negative;
    }

    /**
     * Parse the value into parts: sign, integer part, fractional part.
     */
    parse(value: string): this {
        this._parseNumber(value);

        return this;
    }

    /**
     * Format state by options.
     */
    format(options: NumberOptions, carriagePosition: number): IText {
        let position: number = this._correctSign(options, carriagePosition);
        position = this._correctIntegerPart(options, position);
        position = this._correctFractionalPart(options, position);

        return this._concat(options, position);
    }

    private _parseNumber(value: string): void {
        const words: string[] = ParsedNumber._validate(value);

        this._negative = words[0] === '-';

        /**
         * We found all valid constructs. They can contain multiple splitters.
         * We just need the first one, the rest we need to clean up.
         */
        const filteredData: IFilteredData = ParsedNumber._filterSplitters(words);

        this._calcParts(filteredData);
    }

    /**
     * Calculate the integer and fractional part of the value.
     */
    private _calcParts({value, splitterPosition}: IFilteredData): void {
        this._integer = value.slice(this.negative, splitterPosition).join('');
        this._fractional = value.slice(splitterPosition + 1).join('');
    }

    private _correctSign({onlyPositive}: INumberSign, carriagePosition: number): number {
        let position: number = carriagePosition;

        if (onlyPositive) {
            position -= this.negative;
            this._negative = false;
        }

        return position;
    }

    private _correctIntegerPart(options: INumberLength, carriagePosition: number): number {
        const needlessChars: number = this._calcNeedlessChars('integer', options);
        const positionRelativeIntegerPart: number = this._getPositionRelativePart('integer', carriagePosition);

        const limitedValue: IDataAfterLimiting = ParsedNumber._limitValue(this._integer, {
            absolute: carriagePosition,
            relative: positionRelativeIntegerPart
        }, needlessChars);

        const position: number = this._moveIntegerToFractional({
            value: limitedValue.movedValue,
            carriagePosition: limitedValue.position
        }, limitedValue.value);

        const processedData: IText = ParsedNumber._handleInsignificantZero(
            options, {
                value: limitedValue.value,
                carriagePosition: position
            }, this.negative
        );

        /**
         * If the integer part contains the number of numbers corresponding to the limit,
         * the cursor automatically passes through the splitter and is set before the first
         * character in the fractional part.
         */
        if (needlessChars === 0 && this.negative + processedData.value.length === processedData.carriagePosition) {
            processedData.carriagePosition += ParsedNumber.splitter.length;
        }

        this._integer = processedData.value;

        return processedData.carriagePosition;
    }

    private _correctFractionalPart(options: INumberLength, carriagePosition: number): number {
        const needlessChars: number = this._calcNeedlessChars('fractional', options);
        const positionRelativeIntegerPart: number = this._getPositionRelativePart('fractional', carriagePosition);

        const limitedValue: IDataAfterLimiting = ParsedNumber._limitValue(this._fractional, {
            absolute: carriagePosition,
            relative: positionRelativeIntegerPart
        }, needlessChars);

        this._fractional = ParsedNumber._handleVoid(options, limitedValue.value);

        return limitedValue.position;
    }

    /**
     * Get the number of needless characters in a part number.
     */
    private _calcNeedlessChars(part: Parts, numberLength: INumberLength): number {
        const {
            precision = Number.MAX_SAFE_INTEGER,
            integersLength = Number.MAX_SAFE_INTEGER
        }: INumberLength = numberLength;

        const maxLength: number = part === 'integer' ? integersLength : precision;
        const needlessChars: number = this[part].length - maxLength;

        return needlessChars > -1 ? needlessChars : null;
    }

    /**
     * Get position with respect to the integer or fractional part.
     */
    private _getPositionRelativePart(part: Parts, positionAbsolute: number): number {
        /**
         * The relative position is the difference between the absolute position and the beginning of the part.
         * The number is presented as {sing}{integer}{splitter}{fractional}.
         */
        let positionRelative: number = positionAbsolute - this.negative;

        if (part === 'fractional') {
            positionRelative -= this.integer.length + ParsedNumber.splitter.length;
        }

        /**
         * The position relative to one of the parts, integer or fractional,
         * must be greater than 0 or less their length.
         */
        return Math.max(0, Math.min(positionRelative, this[part].length));
    }

    /**
     * Move the integer part to the beginning of the fractional part.
     */
    private _moveIntegerToFractional(text: IText, integer): number {
        if (!text.value) {
            return text.carriagePosition;
        }

        const {value: fractional, carriagePosition: shiftedPosition}: IText = pasteWithRepositioning({
            value: this._fractional,
            carriagePosition: text.carriagePosition
        }, text.value, 0);

        this._fractional = fractional;

        const movedValuePosition: number = this.negative + integer.length +
            ParsedNumber.splitter.length + text.value.length;

        return Math.max(shiftedPosition, movedValuePosition);
    }

    private _concat({useGrouping}: INumberDisplay, carriagePosition: number): IText {
        const value: string[] = [];
        let integer: string = this._integer;
        let position: number = carriagePosition;

        if (this._negative) {
            value.push('-');
        }

        if (useGrouping) {
            const countTriads = ParsedNumber._getCountTriads(integer.length);
            const positionRelativeIntegerPart: number = this._getPositionRelativePart('integer', carriagePosition);
            const countTriadsAfterCarriage = ParsedNumber._getCountTriads(integer.length - positionRelativeIntegerPart);

            integer = splitIntoTriads(this._integer);
            position += countTriads - countTriadsAfterCarriage;
        }

        value.push(integer);

        if (this._fractional) {
            value.push(ParsedNumber.splitter, this._fractional);
        }

        return {
            value: value.join(''),
            carriagePosition: position
        };
    }

    static splitter: string = '.';
    static splitters: string = '.,';

    private static _numbersInTriad: number = 3;
    private static _significantDigit: RegExp = /[1-9]/;
    private static _validWordsRegExp: RegExp = new RegExp(`^-|[0-9]+|[${ParsedNumber.splitters}]`, 'g');

    private static _validate(value: string): string[] {
        const matchingValues: string[] | null = value.match(ParsedNumber._validWordsRegExp);

        return matchingValues === null ? [] : matchingValues;
    }

    private static _filterSplitters(value: string[]): IFilteredData {
        const filteredData: IFilteredData = {
            value: null,
            splitterPosition: value.length
        };

        /**
         * Remove all splitters except the first. Find his position.
         */
        filteredData.value = value.filter((item, index) => {
            if (ParsedNumber.splitters.includes(item)) {
                if (filteredData.splitterPosition > index) {
                    filteredData.splitterPosition = index;

                    return true;
                }

                return false;
            }

            return true;
        });

        return filteredData;
    }

    /**
     * Remove needless characters from the value.
     */
    private static _limitValue(value: string, position: IPosition, needlessChars: number): IDataAfterLimiting {
        if (!needlessChars) {
            return {value, position: position.absolute, movedValue: ''};
        }

        /**
         * The needless characters can be removed from the entered value or from
         * the value after it by replacing part of it with part of the entered value.
         * The entered value is in front of the cursor.
         *
         * The number of characters to replace is determined by the number of needless characters.
         * It cannot exceed the length of the value whose characters are replaced.
         */
        const replacingChars: number = Math.min(needlessChars, value.length - position.relative);
        const removingChars: number = needlessChars - replacingChars;
        const removeStartPosition: number = position.relative - removingChars;

        return {
            position: position.absolute - removingChars,
            movedValue: value.substring(removeStartPosition, position.relative),
            value: remove(value, removeStartPosition, position.relative + replacingChars)
        };
    }

    /**
     * Remove all zeros at the beginning. If the value consists only of zeros, then leave one.
     */
    private static _handleInsignificantZero({precision}: INumberLength, data: IText, negative: number): IText {
        const {value, carriagePosition}: IText = data;
        const firstSignificantDigitPosition: number = ParsedNumber._calcFirstSignificantDigit(value);

        let {value: formattedValue, carriagePosition: formattedPosition}: IText = removeWithRepositioning({
            value,
            carriagePosition: carriagePosition - negative
        }, 0, firstSignificantDigitPosition);

        if (precision !== 0 && formattedValue === '') {
            formattedValue = '0';
            formattedPosition++;
        }

        return {
            value: formattedValue,
            carriagePosition: formattedPosition + negative
        };
    }

    /**
     * Calculate the position of the first non-zero character.
     */
    private static _calcFirstSignificantDigit(value: string): number {
        const position = value.search(ParsedNumber._significantDigit);

        return position === -1 ? value.length : position;
    }

    /**
     * Convert an empty value to zero if its maximum length is not zero.
     */
    private static _handleVoid({precision}: INumberLength, value: string): string {
        /**
         * According to the standard, the empty fractional part should be replaced by "0".
         */
        if (precision !== 0 && value === '') {
            return '0';
        }

        return value;
    }

    private static _getCountTriads(valueLength: number): number {
        return Math.max(0, Math.floor((valueLength - 1) / ParsedNumber._numbersInTriad));
    }
}
