import rk = require('i18n!Controls');
import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {SyntheticEvent} from 'Vdom/Vdom';
import * as ListTemplate from 'wml!Controls/_filterPanel/Editors/ListBase';
import * as ColumnTemplate from 'wml!Controls/_filterPanel/Editors/resources/ColumnTemplate';
import {StackOpener} from 'Controls/popup';
import {Model} from 'Types/entity';
import {IFilterOptions, ISourceOptions, INavigationOptions, IItemActionsOptions, ISelectorDialogOptions} from 'Controls/interface';
import {IList} from 'Controls/list';
import {IColumn} from 'Controls/grid';

interface IListEditorOptions extends IControlOptions, IFilterOptions, ISourceOptions, INavigationOptions,
    IItemActionsOptions, IList, IColumn, ISelectorDialogOptions {
    propertyValue: number|string;
    showSelectorCaption?: string;
    additionalData: object;
}

abstract class ListEditorBase extends Control<IListEditorOptions> {
    protected _template: TemplateFunction = ListTemplate;
    protected _columns: object[] = null;
    protected _stackOpener: StackOpener = null;

    protected abstract _handleMarkedKeyChanged(event: SyntheticEvent, value: string|number|string[]|number[]): void;

    protected abstract _handleSelectorResult(result: Model[]): void;

    protected abstract _getTextValue(value: string|number|string[]|number[]): Promise<string>;

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

    private _getStackOpener(): StackOpener {
        if (!this._stackOpener) {
            this._stackOpener = new StackOpener();
        }
        return this._stackOpener;
    }

    private _setColumns(displayProperty: string, propertyValue: number|string|unknown[], additionalData: object): object[] {
        this._columns = [{template: ColumnTemplate, selected: propertyValue, displayProperty}];
        if (additionalData) {
            this._columns.push({ ...{align: 'right'}, ...additionalData});
        }
    }

    static _theme: string[] = ['Controls/filterPanel', 'Controls/toggle'];

    static getDefaultOptions(): object {
        return {
            showSelectorCaption: rk('Другие')
        };
    }
}
export default ListEditorBase;
