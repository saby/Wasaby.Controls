import rk = require('i18n!Controls');
import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {SyntheticEvent} from 'Vdom/Vdom';
import * as ListTemplate from 'wml!Controls/_filter/Editors/List';
import * as ColumnTemplate from 'wml!Controls/_filter/Editors/resources/ColumnTemplate';
import * as clone from 'Core/core-clone';
import {isEqual} from 'Types/object';
import {StackOpener} from 'Controls/popup';
import {factory} from 'Types/chain';
import {Model} from 'Types/entity';
import {object} from 'Types/util';
/**
 * Контрол используют в качестве редактора для выбора единичного значения из списка на {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list-environment/filter-search/filter-view/base-settings/#step-3 панели фильтров}.
 * @class Controls/_filter/Editors/NumberRange
 * @extends Core/Control
 * @author Мельникова Е.А.
 * @public
 */
class ListEditor extends Control<IControlOptions> {
    protected _template: TemplateFunction = ListTemplate;
    protected _columns: object[] = null;
    protected _navigation: object = null;
    protected _buttonMoreCaption: string = '';
    protected _stackOpener: StackOpener = null;
    protected _needShowMoreButton: boolean = false;

    protected _beforeMount(options: IControlOptions): void {
        this._columns = this._getColumns(options.columns, options.displayProperty, options.propertyValue);
        this._buttonMoreCaption = rk(options.buttonMoreCaption);
        this._navigation = {
            source: 'page',
            view: 'page',
            sourceConfig: {
                pageSize: options.pageSize,
                page: 0,
                hasMore: false
            }
        };
        this._needShowMoreButton = options.selectorTemplate && options.source.data.length > options.pageSize;
    }

    protected _beforeUpdate(options: IControlOptions): void {
        if (isEqual(options.columns, this._options.columns) || options.propertyValue !== this._options.propertyValue) {
            this._columns = this._getColumns(options.columns, options.displayProperty, options.propertyValue);
        }
        if (options.buttonMoreCaption !== this._options.buttonMoreCaption) {
            this._buttonMoreCaption = rk(options.buttonMoreCaption);
        }
        if (options.pageSize !== this._options.pageSize) {
            this._navigation.sourceConfig.pageSize = options.pageSize;
        }
        this._needShowMoreButton = options.selectorTemplate && options.source.data.length > options.pageSize;
    }

    protected _handleMarkedKeyChanged(event: SyntheticEvent, value: string|number): void {
        const extendedValue = {
            value,
            textValue: this._getTextValue(value)
        };
        this._notify('propertyValueChanged', [extendedValue], {bubbling: true});
    }

    protected _handleSelectorResult(result: Model[]): void {
        this._handleMarkedKeyChanged(null, this._getSelectedKey(result, this._options.keyProperty));
    }

    protected _handleFooterClick(event: SyntheticEvent): void {
        const templateOptions = {
            ...{markedKey: this._options.propertyValue},
            ...this._options.selectorTemplate.templateOptions
        };
        this._getStackOpener().open({
            ...{
                opener: this,
                templateOptions,
                template: this._options.selectorTemplate.templateName,
                eventHandlers: {
                    onResult: this._handleSelectorResult.bind(this)
                }
            },
            ...this._options.popupOptions
        });
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

    private _getColumns(columns: object[], displayProperty: string, propertyValue: number|string|unknown[]): object[] {
        const customColumns = clone(columns);
        const additionalParameters = {template: ColumnTemplate, selected: propertyValue};
        const firstColumn = columns.length ? customColumns.shift() : {displayProperty};
        customColumns.unshift({...additionalParameters, ...firstColumn});
        return customColumns;
    }

    static _theme: string[] = ['Controls/filter', 'Controls/toggle'];

    static getDefaultOptions(): object {
        return {
            buttonMoreCaption: 'Другие',
            columns: [],
            pageSize: 3
        };
    }
}
export default ListEditor;
