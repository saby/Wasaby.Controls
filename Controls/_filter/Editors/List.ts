import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {SyntheticEvent} from 'Vdom/Vdom';
import DateRangeTemplate = require('wml!Controls/_filter/Editors/List');
import * as ColumnTemplate from 'wml!Controls/_filter/Editors/resources/ColumnTemplate';
import * as clone from 'Core/core-clone';

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
        this._columns = this._getColumns(options.columns, options.displayProperty, options.propertyValue);
    }

    protected _beforeUpdate(options?: IControlOptions): void {
        this._columns = this._getColumns(options.columns, options.displayProperty, options.propertyValue);
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

    private _getColumns(columns: object[], displayProperty: string, propertyValue: number|string|unknown[]): object[] {
        const customColumns = clone(columns) || [];
        const additionalParameters = {template: ColumnTemplate, selected: propertyValue};
        const firstColumn = columns ? customColumns.shift() : {displayProperty};
        customColumns.unshift({...additionalParameters, ...firstColumn});
        return customColumns;
    }

    static _theme: string[] = ['Controls/filter', 'Controls/toggle'];
}
export default ListEditor;
