import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {SyntheticEvent} from 'Vdom/Vdom';
import DateRangeTemplate = require('wml!Controls/_filter/Editors/List');

/**
 * Контрол используют в качестве редактора для выбора единичного значения из списка на {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list-environment/filter-search/filter-view/base-settings/#step-3 панели фильтров}.
 * @class Controls/_filter/Editors/NumberRange
 * @extends Core/Control
 * @author Мельникова Е.А.
 * @public
 */
class ListEditor extends Control<IControlOptions> {
    protected _template: TemplateFunction = DateRangeTemplate;
    protected _columns: object[] = null;

    protected _beforeMount(options?: IControlOptions): void {
        this._columns = options.columns ? options.columns : [{displayProperty: options.displayProperty}];
    }

    protected _beforeUpdate(options?: IControlOptions): void {
        this._columns = options.columns ? options.columns : [{displayProperty: options.displayProperty}];
    }

    protected _handleMarkedKeyChanged(event: SyntheticEvent, value: number): void {
        const extendedValue = {
            value,
            textValue: this._getTextValue(value)
        };
        this._notify('propertyValueChanged', [extendedValue], {bubbling: true});
    }

    private _getTextValue(value: string|number): string {
        const item = this._options.source.data.find((item) => {
            return item[this._options.keyProperty] === value;
        });
        return item[this._options.displayProperty];
    }
}
export default ListEditor;
