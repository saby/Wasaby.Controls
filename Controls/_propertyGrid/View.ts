import {Control, TemplateFunction} from 'UI/Base';
import {IPropertyGridOptions} from './IPropertyGrid';
import * as template from 'wml!Controls/_propertyGrid/View/View';
import {GroupItem, TreeItem, Tree, Collection} from 'Controls/display';
import {SyntheticEvent} from 'Vdom/Vdom';
import {RecordSet} from 'Types/collection';
import PropertyGridItem from './PropertyGridItem';
import {Model} from 'Types/entity';
import {default as IPropertyGridItem} from './IProperty';
import {object} from 'Types/util';
import {PROPERTY_GROUP_FIELD, PROPERTY_NAME_FIELD, PROPERTY_VALUE_FIELD} from './Constants';
import {view as constView} from 'Controls/Constants';

interface IPropertyGridViewOptions extends IPropertyGridOptions {
    nodeProperty: string;
    parentProperty: string;
}

export default class PropertyGridView extends Control<IPropertyGridViewOptions> {
    protected _template: TemplateFunction = template;
    protected _listModel: Tree<PropertyGridItem> | Collection<PropertyGridItem>;
    protected _collapsedGroups: Record<string, boolean> = {};

    protected _beforeMount(
        {
            nodeProperty,
            parentProperty,
            editingObject,
            source,
            collapsedGroups
        }: IPropertyGridOptions
    ): void {
        this._collapsedGroups = this._getCollapsedGroups(collapsedGroups);
        this._listModel = this._getCollection(nodeProperty, parentProperty, editingObject, source);
    }

    protected _beforeUpdate(newOptions: IPropertyGridOptions): void {
        if (newOptions.collapsedGroups !== this._options.collapsedGroups) {
            this._collapsedGroups = this._getCollapsedGroups(newOptions.collapsedGroups);
            this._listModel.setFilter(this._displayFilter.bind(this));
        }
        if (newOptions.editingObject !== this._options.editingObject || newOptions.source !== this._options.source) {
            this._listModel = this._getCollection(
                newOptions.nodeProperty,
                newOptions.parentProperty,
                newOptions.editingObject,
                newOptions.source
            );
        }
    }

    private _getCollection(
        nodeProperty: string,
        parentProperty: string,
        editingObject: Record<string, any>,
        source: IPropertyGridItem[]
    ): Tree<PropertyGridItem> | Collection<PropertyGridItem> {
        const propertyGridItems = this._getPropertyGridItems(source, editingObject);
        if (nodeProperty && parentProperty) {
            return new Tree({
                collection: propertyGridItems,
                parentProperty,
                nodeProperty,
                root: null,
                group: this._groupCallback,
                filter: this._displayFilter.bind(this)
            });
        } else {
            return new Collection({
                collection: propertyGridItems,
                group: this._groupCallback,
                filter: this._displayFilter.bind(this)
            });
        }
    }

    private _groupCallback(item: PropertyGridItem): string {
        return item.get(PROPERTY_GROUP_FIELD);
    }

    private _displayFilter(itemContents: PropertyGridItem | string,): boolean {
        if (itemContents instanceof PropertyGridItem) {
            const group = itemContents.get(PROPERTY_GROUP_FIELD);
            return !this._collapsedGroups[group];
        }
        return true;
    }

    private _getCollapsedGroups(collapsedGroups: Array<string | number> = []): Record<string, boolean> {
        return collapsedGroups.reduce((acc: Record<string, boolean>, key: string): Record<string, boolean> => {
            acc[key] = true;
            return acc;
        }, {});
    }

    private _getPropertyGridItems(
        items: IPropertyGridItem[],
        editingObject: Record<string, any>
    ): RecordSet<PropertyGridItem> {
        const itemsWithPropertyValue = items.map((item: IPropertyGridItem): IPropertyGridItem => {
            const sourceItem = object.clone(item);
            const defaultItem = PropertyGridView.getDefaultPropertyGridItem();
            defaultItem.propertyValue = editingObject[sourceItem.name];
            return {
                ...defaultItem,
                ...sourceItem
            };
        });

        return new RecordSet({
            rawData: itemsWithPropertyValue,
            keyProperty: PROPERTY_NAME_FIELD,
            model: PropertyGridItem
        });
    }

    protected _propertyValueChanged(event: SyntheticEvent<Event>, item: PropertyGridItem, value: any): void {
        const name = item.get(PROPERTY_NAME_FIELD);
        const editingObjectClone = object.clone(this._options.editingObject);
        const itemClone = item.clone(true);

        editingObjectClone[name] = value;
        itemClone.set(PROPERTY_VALUE_FIELD, value);

        (this._listModel.getCollection().getRecordById(name) as Model).set(PROPERTY_VALUE_FIELD, value);

        event.stopPropagation();
        this._notify('editingObjectChanged', [editingObjectClone]);
    }

    protected _itemClick(
        event: SyntheticEvent<Event>,
        displayItem: GroupItem<PropertyGridItem> | TreeItem<PropertyGridItem>,
        clickEvent: SyntheticEvent<MouseEvent>
    ): void {
        if (displayItem instanceof GroupItem) {
            const isExpandClick = clickEvent?.target.closest('.controls-PropertyGrid__groupExpander');
            if (isExpandClick) {
                displayItem.toggleExpanded();
            }
        }
    }

    static getDefaultPropertyGridItem(): IPropertyGridItem {
        return {
            name: undefined,
            caption: undefined,
            editorTemplateName: undefined,
            editorOptions: undefined,
            editorClass: undefined,
            type: undefined,
            group: constView.hiddenGroup,
            propertyValue: undefined
        };
    }
}