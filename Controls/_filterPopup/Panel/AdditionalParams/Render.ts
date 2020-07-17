import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {Collection, CollectionItem, GroupItem} from 'Controls/display';
import Clone = require('Core/core-clone');
import * as template from 'wml!Controls/_filterPopup/Panel/AdditionalParams/Render/Render';
import * as itemTemplate from 'wml!Controls/_filterPopup/Panel/AdditionalParams/Render/resources/ItemTemplate';
import * as groupTemplate from 'wml!Controls/_filterPopup/Panel/AdditionalParams/Render/resources/GroupTemplate';
import {ICloneable} from 'Types/entity';
import {IEnumerable} from 'Types/collection';

type TAdditionalItem = Record<string, any>;
type TAdditionalSource = ICloneable & IEnumerable<TAdditionalItem, string>;
interface IAdditionalRenderOptions extends IControlOptions {
    columnProperty: string;
    groupProperty: string;
    keyProperty: string;
    source: TAdditionalSource;
}

export default class AdditionalParamsRender extends Control<IAdditionalRenderOptions> {
    protected _template: TemplateFunction = template;
    protected _collection: Collection<TAdditionalItem> =  null;
    protected _itemTemplate: TemplateFunction = itemTemplate;
    protected _groupTemplate: TemplateFunction = groupTemplate;

    private _getCollection(options: IAdditionalRenderOptions): Collection<TAdditionalItem> {
        const items = Clone(options.source);
        return new Collection({
            keyProperty: options.keyProperty,
            collection: items,
            group: (item): string => {
                return item[options.groupProperty];
            }
        });
    }

    protected _beforeMount(options: IAdditionalRenderOptions): void {
        this._collection = this._getCollection(options);
    }

    protected _isGroup(item: CollectionItem<IFilterItem>): boolean {
        return item instanceof GroupItem;
    }

    protected _beforeUpdate(options: IAdditionalRenderOptions): void {
        if (this._options.source !== options.source) {
            this._collection = this._getCollection(options);
        }
    }

    protected _clickSeparatorHandler(): void {
        this._notify('arrowClick', []);
    }

    protected _propertyChanged(event: Event, item: IFilterItem, property: string, value: any): void {
        this._notify('propertyChanged', [item, property, value]);
    }

    static _theme: string[] = ['Controls/filterPopup'];
}
