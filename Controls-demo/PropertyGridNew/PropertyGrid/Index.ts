import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridNew/PropertyGrid/Index';
import {showType} from 'Controls/Utils/Toolbar';
import {IItemAction} from 'Controls/itemActions';
import {Enum, RecordSet} from 'Types/collection';
import { Model } from 'Types/entity';
import {default as IPropertyGridItem} from 'Controls/_propertyGrid/IProperty';
import {getEditingObject} from 'Controls-demo/PropertyGridNew/resources/Data';
import * as CaptionTemplate from 'wml!Controls-demo/PropertyGridNew/PropertyGrid/CaptionTemplate';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: Model = new Model<IPropertyGridItem>({
        rawData: getEditingObject()
    });
    protected _source: RecordSet = new RecordSet<IPropertyGridItem>({
        rawData: [
            {
                name: 'tileView',
                caption: 'Список плиткой',
                group: 'boolean',
                captionTemplate: CaptionTemplate
            },
            {
                name: 'showBackgroundImage',
                caption: 'Показывать изображение',
                group: 'boolean',
                captionTemplate: CaptionTemplate
            },
            {
                caption: 'URL',
                name: 'siteUrl',
                group: 'string',
                captionTemplate: CaptionTemplate
            },
            {
                caption: 'Источник видео',
                name: 'videoSource',
                group: 'string',
                captionTemplate: CaptionTemplate
            },
            {
                caption: 'Тип фона',
                name: 'backgroundType',
                group: 'enum',
                editorClass: 'controls-demo-pg-enum-editor',
                captionTemplate: CaptionTemplate
            }],
        keyProperty: 'name'
    });
    protected _itemActions: IItemAction[];

    protected _beforeMount(): void {
        const source = this._source;
        this._itemActions = [
            {
                id: 2,
                icon: 'icon-ArrowUp',
                iconStyle: 'secondary',
                showType: showType.MENU,
                title: 'Переместить вверх',
                handler: (item: Model) => {
                    const sourceItemIndex = this._getSourceItemIndex(source, item);
                    source.move(sourceItemIndex, sourceItemIndex - 1);
                }
            },
            {
                id: 3,
                icon: 'icon-ArrowDown',
                iconStyle: 'secondary',
                showType: showType.MENU,
                title: 'Переместить вниз',
                handler: (item: Model) => {
                    const sourceItemIndex = this._getSourceItemIndex(source, item);
                    source.move(sourceItemIndex, sourceItemIndex + 1);
                }
            },
            {
                id: 1,
                icon: 'icon-Erase',
                iconStyle: 'danger',
                showType: showType.MENU,
                title: 'Удалить',
                handler: (item: Model) => {
                    const key = item.getKey();
                    source.remove(source.getRecordById(key));
                }
            }
        ];
    }

    private _getSourceItemIndex(source: RecordSet, item: Model): number {
        const key = item.getKey();
        const sourceItem = source.getRecordById(key);
        return source.getIndex(sourceItem);
    }

    static _styles: string[] = ['Controls-demo/PropertyGridNew/Editors/HighlightOnHover/Index',
        'Controls-demo/PropertyGridNew/PropertyGrid'];
}
