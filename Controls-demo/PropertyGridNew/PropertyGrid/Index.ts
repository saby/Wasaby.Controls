import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridNew/PropertyGrid/Index';
import {showType} from 'Controls/Utils/Toolbar';
import {IItemAction} from 'Controls/itemActions';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import {getEditingObject, getSource} from '../resources/Data';
import {default as IPropertyGridItem} from 'Controls/_propertyGrid/IProperty';
import 'wml!Controls-demo/PropertyGridNew/ItemActions/ItemTemplate';

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
                id: 1,
                icon: 'icon-Edit',
                iconStyle: 'secondary',
                title: 'edit',
                showType: showType.MENU,
                handler: (item) => alert(`Edit clicked at ${item.getId()}`)
            },
            {
                id: 3,
                icon: 'icon-Erase',
                iconStyle: 'danger',
                showType: 2,
                title: 'Remove',
                handler: (item: Model) => {
                    const key = item.getKey();
                    source.remove(source.getRecordById(key));
                }
            },
            {
                id: 4,
                icon: 'icon-ArrowUp',
                iconStyle: 'danger',
                showType: 2,
                title: 'Вверх',
                handler: (item: Model) => {
                    // source.move(1, 0);
                }
            }
        ];
    }

    static _styles: string[] = ['Controls-demo/PropertyGridNew/Editors/HighlightOnHover/Index',
        'Controls-demo/PropertyGridNew/PropertyGrid'];
}
