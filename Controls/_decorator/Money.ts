import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {INumberFormatOptions, INumberFormat, ITooltipOptions, ITooltip, IFontColorStyle, IFontColorStyleOptions, IFontSize, IFontSizeOptions, IFontWeight, IFontWeightOptions} from 'Controls/interface';
import {Logger} from 'UI/Utils';
import {descriptor} from 'Types/entity';
import {moneyOptions, moneyUseGrouping, moneyValue, moneyStyle} from 'Controls/_decorator/ActualAPI';
import numberToString from 'Controls/Utils/Formatting/numberToString';
import splitIntoTriads from 'Controls/Utils/splitIntoTriads';
//@ts-ignore
import * as template from 'wml!Controls/_decorator/Money/Money';

type TValue = string | number | null;

interface IPaths {
    integer: string;
    fraction: string;
    number: string;
}


/**
 * @interface Controls/_decorator/Money/IMoneyOptions
 * @public
 * @author Красильников А.С.
 */
export interface IMoneyOptions extends IControlOptions, INumberFormatOptions, ITooltipOptions, IFontColorStyleOptions, IFontWeightOptions, IFontSizeOptions {
    number: number;
    delimiters: boolean;
    title: string;
    /**
     * Декорируемое число.
     * @type string|number|null
     * @default null
     * @demo Controls-demo/Decorator/Money/Value/Index
     */
    value: TValue;
    /**
     * @name Controls/_decorator/Money#fontSize
     * @cfg {String} Размер шрифта.
     * @variant l
     * @variant m
     * @variant s
     * @default m
     * @demo Controls-demo/Decorator/Money/FontSize/Index
     */
}

/**
 * Графический контрол, декорирующий число таким образом, что оно приводится к денежному формату.
 * Денежным форматом является число с неограниченной целой частью, и двумя знаками в дробной части.
 *
 * @class Controls/_decorator/Money
 * @extends UI/Base:Control
 *
 * @mixes Controls/interface:ITooltip
 * @mixes Controls/interface:IFontColorStyle
 * @mixes Control/interface:IFontWeight
 * @mixes Control/interface:IFontSize
 * @mixes Controls/interface:INumberFormat
 * @mixes Controls/_decorator/Money/IMoneyOptions
 * @implements Controls/_decorator/Money/IFontSize
 *
 * @public
 * @demo Controls-demo/Decorator/Money/Index
 *
 * @author Красильников А.С.
 */
class Money extends Control<IMoneyOptions> implements INumberFormat, ITooltip {
    private _value: TValue;
    private _useGrouping: boolean;
    private _tooltip: string;
    private _parsedNumber: IPaths;
    private _fontColorStyle: string;
    private _fontSize: string;
    private _readOnly: boolean;
    private _fontWeight: string;

    readonly '[Controls/_interface/ITooltip]' = true;
    readonly '[Controls/_interface/INumberFormat]' = true;

    protected _options: IMoneyOptions;
    protected _template: TemplateFunction = template;

    // Used in template
    private _isDisplayFractionPath(value: string, showEmptyDecimals: boolean): boolean {
        return showEmptyDecimals || value !== '.00';
    }


    private _getTooltip(options: IMoneyOptions): string {
        const actualOptions = moneyOptions(options);

        if (actualOptions.hasOwnProperty('tooltip')) {
            return actualOptions.tooltip;
        }

        return this._parsedNumber.number;
    }

    private _changeState(options: IMoneyOptions, useLogging: boolean): boolean {
        const value = moneyValue(options.number, options.value, useLogging);
        const useGrouping = moneyUseGrouping(options.delimiters, options.useGrouping, useLogging);

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

    private _getStyle(options: { fontColorStyle?: string, fontSize?: string, readOnly?: boolean, fontWeight?: string }): void {
        this._fontSize = options.fontSize;
        this._fontColorStyle = options.fontColorStyle;
        this._fontWeight = options.fontWeight;
        this._readOnly = options.readOnly;
    }

    protected _beforeMount(options: IMoneyOptions): void {
        this._changeState(options, true);
        this._parsedNumber = this._parseNumber();
        this._tooltip = this._getTooltip(options);
        const styles = moneyStyle(options);
        this._getStyle(styles);
    }

    protected _beforeUpdate(newOptions): void {
        if (this._changeState(newOptions, false)) {
            this._parsedNumber = this._parseNumber();
        }
        this._tooltip = this._getTooltip(newOptions);
        const styles = moneyStyle(newOptions);
        this._getStyle(styles);
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
            value: null,
            fontColorStyle: 'default',
            fontSize: 'm',
            fontWeight: 'normal',
            useGrouping: true,
            showEmptyDecimals: true
        };
    }

    static getOptionTypes() {
        return {
            fontColorStyle: descriptor(String),
            fontSize: descriptor(String),
            fontWeight: descriptor(String),
            useGrouping: descriptor(Boolean),
            showEmptyDecimals: descriptor(Boolean),
            value: descriptor(String, Number, null)
        };
    }

    static _theme = ['Controls/decorator'];
}

export default Money;
