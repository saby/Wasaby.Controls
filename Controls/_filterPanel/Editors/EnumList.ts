import rk = require('i18n!Controls');
import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {SyntheticEvent} from 'Vdom/Vdom';
import * as ListTemplate from 'wml!Controls/_filterPanel/Editors/EnumList';
import * as ColumnTemplate from 'wml!Controls/_filterPanel/Editors/resources/ColumnTemplate';
import {StackOpener} from 'Controls/popup';
import {factory} from 'Types/chain';
import {Model} from 'Types/entity';
import {object} from 'Types/util';
import {IFilterOptions, ISourceOptions, INavigationOptions, IItemActionsOptions, ISelectorDialogOptions} from 'Controls/interface';
import {IList} from 'Controls/list';
import {IColumn} from 'Controls/grid';

interface IListEditorOptions extends IControlOptions, IFilterOptions, ISourceOptions, INavigationOptions,
    IItemActionsOptions, IList, IColumn, ISelectorDialogOptions {
    propertyValue: number|string;
    showSelectorCaption?: string;
    additionalData: string;
}

/**
 * Контрол используют в качестве редактора для выбора единичного значения из списка на {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list-environment/filter-search/filter-view/base-settings/#step-3 панели фильтров}.
 * @class Controls/_filterPanel/Editors/EnumList
 * @extends Core/Control
 * @author Мельникова Е.А.
 * @public
 */
class ListEditor extends Control<IListEditorOptions> {
    protected _template: TemplateFunction = ListTemplate;
    protected _columns: object[] = null;
    protected _stackOpener: StackOpener = null;

    protected _beforeMount(options: IListEditorOptions): void {
        this._setColumns(options.displayProperty, options.propertyValue, options.additionalData);
    }

    protected _beforeUpdate(options: IListEditorOptions): void {
        const valueChanged = options.propertyValue !== this._options.propertyValue;
        const displayPropertyChanged = options.displayProperty !== this._options.displayProperty;
        const additionalDataChanged = options.additionalData !== this._options.additionalData;

        if (additionalDataChanged || valueChanged || displayPropertyChanged) {
            this._setColumns(options.displayProperty, options.propertyValue, options.additionalData);
        }
    }

    protected _handleMarkedKeyChanged(event: SyntheticEvent, value: string|number): void {
        const extendedValue = {
            value,
            textValue: this._getTextValue(value),
            needColapse: true
        };
        this._notify('propertyValueChanged', [extendedValue], {bubbling: true});
    }

    protected _handleSelectorResult(result: Model[]): void {
        this._handleMarkedKeyChanged(null, this._getSelectedKey(result, this._options.keyProperty));
    }

    protected _handleFooterClick(event: SyntheticEvent): void {
        const selectorOptions = this._options.selectorTemplate;
        this._getStackOpener().open({
            ...{
                opener: this,
                templateOptions: selectorOptions.templateOptions,
                template: selectorOptions.templateName,
                eventHandlers: {
                    onResult: this._handleSelectorResult.bind(this)
                }
            },
            ...selectorOptions.popupOptions
        });
    }

    protected _beforeUnmount(): void {
        if (this._stackOpener) {
            this._stackOpener.destroy();
        }
    }

    private _getSelectedKey(items: Model[], keyProperty: string): string|number {
        let key;
        factory(items).each((item) => {
            key = object.getPropertyValue(item, keyProperty);
        });
        return key;
    }

    private _getStackOpener(): StackOpener {
        if (!this._stackOpener) {
            this._stackOpener = new StackOpener();
        }
        return this._stackOpener;
    }

    private _getTextValue(value: string|number): string {
        const item = this._options.source.data.find((item) => {
            return item[this._options.keyProperty] === value;
        });
        return item[this._options.displayProperty];
    }

    private _setColumns(displayProperty: string, propertyValue: number|string|unknown[], additionalData: string): object[] {
        this._columns = [{template: ColumnTemplate, selected: propertyValue, displayProperty}]
        if (additionalData) {
            this._columns.push({align: 'right', displayProperty: additionalData});
        }
    }

    static _theme: string[] = ['Controls/filter', 'Controls/toggle'];

    static getDefaultOptions(): object {
        return {
            showSelectorCaption: rk('Другие')
        };
    }
}
export default ListEditor;
