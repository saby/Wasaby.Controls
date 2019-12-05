import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {INumberFormatOptions, INumberFormat} from 'Controls/interface';
import {Logger} from 'UI/Utils';
import {descriptor} from 'Types/entity';
import numberToString from 'Controls/Utils/Formatting/numberToString';
import * as splitIntoTriads from 'Controls/Utils/splitIntoTriads';
import * as template from 'wml!Controls/_decorator/Money/Money';

type TValue = string | number | null;
type TStyle =
    'default'
    | 'accentResults'
    | 'noAccentResults'
    | 'group'
    | 'basicRegistry'
    | 'noBasicRegistry'
    | 'accentRegistry'
    | 'noAccentRegistry'
    | 'error';

interface IPaths {
    integer: string;
    fraction: string;
    number: string;
}

interface IDeprecatedOptions {
    number: number;
    delimiters: boolean;
}

export interface IMoneyOptions extends IControlOptions, INumberFormatOptions, IDeprecatedOptions {
    /**
     * @name Controls/_decorator/Money#value
     * Значение в числовом формате для преобразования.
     */
    value: TValue;
    /**
     * @name Controls/_decorator/Money#style
     * Стиль отображения числа в денежном формате.
     * @demo Controls-demo/Decorator/Money/Styles/Index
     */
    style: TStyle;
    title: string;
}

/**
 * Преобразует значение в денежный формат.
 *
 * @class Controls/_decorator/Money
 * @extends UI/_base/Control
 *
 * @mixes Controls/_interface/INumberFormat
 *
 * @public
 * @demo Controls-demo/Decorator/Money/Styles/Index
 *
 * @author Красильников А.С.
 */
class Money extends Control<IMoneyOptions> implements INumberFormat {
    private _value: TValue;
    private _useGrouping: boolean;
    private _title: string;
    private _parsedNumber: IPaths;

    readonly '[Controls/_interface/INumberFormat]' = true;

    protected _options: IMoneyOptions;
    protected _template: TemplateFunction = template;

    // Used in template
    private _isDisplayFractionPath(value: string, showEmptyDecimals: boolean): boolean {
        return showEmptyDecimals || value !== '.00';
    }

    private _isUseGrouping(options: IMoneyOptions, useLogging: boolean): boolean {
        if ('delimiters' in options) {
            if (useLogging) {
                Logger.warn('Controls/_decorator/Money: Опция delimiters устарела, используйте useGrouping.', this);
            }

            return options.delimiters;
        }

        return options.useGrouping;
    }

    _getValue(options: IMoneyOptions, useLogging: boolean) {
        if ('number' in options) {
            if (useLogging) {
                Logger.warn('Controls/_decorator/Money: Опция number устарела, используйте value.', this);
            }

            return options.number.toString();
        }

        return options.value;
    }

    private _getTitle(options: IMoneyOptions): string {
        if (options.hasOwnProperty('title')) {
            return options.title;
        }

        return this._parsedNumber.number;
    }

    private _changeState(options: IMoneyOptions, useLogging: boolean): boolean {
        const value = this._getValue(options, useLogging);
        const useGrouping = this._isUseGrouping(options, useLogging);

        if (this._value !== value || this._useGrouping !== useGrouping) {
            this._value = value;
            this._useGrouping = useGrouping;

            return true;
        }

        return false;
    }

    private _parseNumber(): IPaths {
        const value = Money.toFormat(Money.toString(this._value));
        let exec: RegExpExecArray | string[] = Money.SEARCH_PATHS.exec(value);

        if (!exec) {
            Logger.error('Controls/_decorator/Money: That is not a valid option value: ' + this._value + '.', this);
            exec = ['0.00', '0', '.00'];
        }

        const integer = this._useGrouping ? splitIntoTriads(exec[1]) : exec[1];
        const fraction = exec[2];

        return {
            integer: integer,
            fraction: fraction,
            number: integer + fraction
        };
    }

    protected _beforeMount(options: IMoneyOptions): void {
        this._changeState(options, true);
        this._parsedNumber = this._parseNumber();
        this._title = this._getTitle(options);
    }

    protected _beforeUpdate(newOptions): void {
        if (this._changeState(newOptions, false)) {
            this._parsedNumber = this._parseNumber();
        }
        this._title = this._getTitle(newOptions);
    }

    private static FRACTION_LENGTH = 2;
    private static ZERO_FRACTION_PATH = '0'.repeat(Money.FRACTION_LENGTH);
    private static SEARCH_PATHS = new RegExp(`(-?[0-9]*?)(\\.[0-9]{${Money.FRACTION_LENGTH}})`);

    private static toString(value: TValue): string {
        if (value === null) {
            return '0.' + Money.ZERO_FRACTION_PATH;
        }
        if (typeof value === 'number') {
            return numberToString(value);
        }

        return value;
    }

    /**
     * Приводит value к формату:
     * 1. Значение должно иметь {Money.FRACTION_LENGTH} знака в дробной части. Недостоющие знаки заменяются нулями.
     */
    private static toFormat(value: string): string {
        const dotPosition = value.indexOf('.');

        if (dotPosition === -1) {
            return value + `.${Money.ZERO_FRACTION_PATH}`;
        }

        const fractionLength = value.length - dotPosition - 1;
        if (fractionLength < Money.FRACTION_LENGTH) {
            return value + '0'.repeat(Money.FRACTION_LENGTH - fractionLength);
        }

        return value;
    }

    static getDefaultOptions() {
        return {
            style: 'default',
            useGrouping: true,
            showEmptyDecimals: true,
            value: null
        };
    }

    static getOptionTypes() {
        return {
            style: descriptor(String).oneOf([
                'default', 'accentResults', 'noAccentResults',
                'group', 'basicRegistry', 'noBasicRegistry',
                'accentRegistry', 'noAccentRegistry', 'error'
            ]),
            useGrouping: descriptor(Boolean),
            showEmptyDecimals: descriptor(Boolean),
            value: descriptor(String, Number, null)
        };
    }

    static _theme = ['Controls/decorator']
}

export default Money;
