import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridNew/PropertyGrid/Index';
import {showType} from 'Controls/Utils/Toolbar';
import {IItemAction} from 'Controls/itemActions';
import {RecordSet} from 'Types/collection';
import { Model } from 'Types/entity';
import {default as IPropertyGridItem} from 'Controls/_propertyGrid/IProperty';
import {getEditingObject, getSource} from 'Controls-demo/PropertyGridNew/resources/Data';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: Model = new Model<IPropertyGridItem>({
        rawData: getEditingObject()
    });
    protected _source: RecordSet = new RecordSet<IPropertyGridItem>({
        rawData: getSource(),
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

    protected _handleItemClick(event, item) {
        alert(`Clicked at ${item.getContents().getId()}`);
    }

    static _styles: string[] = ['Controls-demo/PropertyGridNew/Editors/HighlightOnHover/Index',
        'Controls-demo/PropertyGridNew/PropertyGrid'];
}
