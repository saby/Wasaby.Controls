import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {SyntheticEvent} from 'Vdom/Vdom';
import DateRangeTemplate = require('wml!Controls/_filter/Editors/NumberRange');

/**
 * Контрол используют в качестве редактора для выбора диапазона чисел на {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list-environment/filter-search/filter-view/base-settings/#step-3 панели фильтров}.
 * @class Controls/_filter/Editors/NumberRange
 * @extends Core/Control
 * @author Мельникова Е.А.
 * @public
 */
class NumberRangeEditor extends Control<IControlOptions> {
    protected _template: TemplateFunction = DateRangeTemplate;
    protected _minValue: number|null = null;
    protected _maxValue: number|null = null;

    protected _beforeMount(options?: IControlOptions): void {
        this._updateValues(options.propertyValue);
    }

    protected _beforeUpdate(newOptions?: IControlOptions): void {
        this._updateValues(newOptions.propertyValue);
    }

    protected _handleMinValueChanged(event: SyntheticEvent, value: number): void {
        this._notifyExtendedValue([value, this._options.propertyValue[1]]);
    }

    protected _handleMaxValueChanged(event: SyntheticEvent, value: number): void {
        this._notifyExtendedValue([this._options.propertyValue[0], value]);
    }

    private _updateValues(newValue: number[]): void {
        this._minValue = newValue[0] !== undefined ? newValue[0] : null;
        this._maxValue = newValue[1] !== undefined ? newValue[1] : null;
    }

    private _notifyExtendedValue(value: number[]): void {
        const extendedValue = {
            value,
            textValue: value[0] + ' - ' + value[1]
        };
        this._notify('propertyValueChanged', [extendedValue], {bubbling: true});
    }
}
export default NumberRangeEditor;

/**
 * @name Controls/_filter/Editors/NumberRange#value
 * @cfg {Array<Date>} Массив из двух значений - число "от" и число "до".
 * @see resetValue
 */

/**
 * @name Controls/_filter/Editors/NumberRange#resetValue
 * @cfg {Array<Date>} Массив из двух значений - число "от" и число "до", которые применятся при сбросе.
 * @see value
 */
