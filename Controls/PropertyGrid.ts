import Control = require('Core/Control');
import ItemsViewModel = require('Controls/List/ItemsViewModel');
import template = require('wml!Controls/PropertyGrid/PropertyGrid');
import defaultGroupTemplate = require('wml!Controls/PropertyGrid/groupTemplate');
import PropertyGridItem = require('Controls/PropertyGrid/PropertyGridItem');

import { factory } from 'Types/chain';
import { object } from 'Types/util';
import { RecordSet } from 'Types/collection';

import IPropertyGridOptions from './PropertyGrid/IPropertyGridOptions';
import IProperty from './PropertyGrid/IProperty';

interface IPropertyGridItem extends IProperty {
    propertyValue: any;
}

type PropertyGridItems = RecordSet<PropertyGridItem>;

interface IPropertyGridItemDefault extends IPropertyGridItem {
    name: undefined;
    caption: undefined;
    editorTemplateName: undefined;
    editorOptions: undefined;
    type: undefined;
    group: undefined;
    propertyValue: undefined;
}

const PROPERTY_NAME_FIELD: string = 'name';
const PROPERTY_GROUP_FIELD: string = 'group';
const PROPERTY_VALUE_FIELD: string = 'propertyValue';

function getPropertyItemDefault(): IPropertyGridItemDefault {
    return {
        name: undefined,
        caption: undefined,
        editorTemplateName: undefined,
        editorOptions: undefined,
        type: undefined,
        group: undefined,
        propertyValue: undefined
    };
}

function checkRequiredOptions(options: IPropertyGridOptions): void {
    if (!options.editingObject) {
        throw new Error('PropertyGrid::editingObject is required');
    }
}

function getConfigFromSourceByName(name: string, source: IProperty[]): IProperty|void {
    let sourceConfig;

    factory(source).each((element) => {
        if (!sourceConfig && name === object.getPropertyValue(element, PROPERTY_NAME_FIELD)) {
            sourceConfig = element;
        }
    });

    return sourceConfig;
}

function getPropertyGridItems(editingObject: Object, source: IProperty[]): PropertyGridItems {
    const itemsArray: IPropertyGridItem[] = [];
    let result: RecordSet<Record>;

    let propertyGridItemDefault: IPropertyGridItem;
    let propertyGridItemConfig: IProperty|void;

    for (const propName in editingObject) {
        if (editingObject.hasOwnProperty(propName)) {
            propertyGridItemDefault = getPropertyItemDefault();
            propertyGridItemConfig = getConfigFromSourceByName(propName, source);

            propertyGridItemDefault.propertyValue = editingObject[propName];
            propertyGridItemDefault.name = propName;

            if (propertyGridItemConfig) {
                Object.assign(propertyGridItemDefault, propertyGridItemConfig);
            }

            itemsArray.push(propertyGridItemDefault);
        }
    }

    result = new RecordSet({
        rawData: itemsArray,
        model: PropertyGridItem,
        idProperty: PROPERTY_NAME_FIELD
    });
    return result;
}
function groupingKeyCallback(item: Record): string {
    return item.get(PROPERTY_GROUP_FIELD);
}

function getGroupingKeyCallback(items: PropertyGridItems): Function|null {
    let hasGroup: boolean = false;

    items.each((item: Record): void => {
        if (!hasGroup) {
            hasGroup = !!item.get(PROPERTY_GROUP_FIELD);
        }
    });

    return hasGroup ? groupingKeyCallback : null;
}

/**
 * Represents a control that allows users to inspect and edit the properties of an object.
 * You can use the standard editors that are provided with the PropertyGrid or you can use custom editors.
 * By default the propertyGrid will autogenerateall the properties for a given object
 * @class Controls/PropertyGrid
 * @extends Core/Control
 * @interface Controls/PropertyGrid/IPropertyGridOptions
 * @control
 * @public
 * @author Герасимов А.М.
 */

// @ts-ignore
class PropertyGrid extends Control  {
    protected _options: IPropertyGridOptions;
    protected _template: Function = template;
    protected _defaultGroupTemplate: Function = defaultGroupTemplate;

    private items: PropertyGridItems;
    private itemsViewModel: ItemsViewModel;

    _beforeMount(options: IPropertyGridOptions): void {
        checkRequiredOptions(options);

        this.items = getPropertyGridItems(options.editingObject, options.source);
        this.itemsViewModel = new ItemsViewModel({
            items: this.items,
            keyProperty: PROPERTY_NAME_FIELD,
            groupingKeyCallback: getGroupingKeyCallback(this.items)
        });
    }

    _beforeUpdate(newOptions: IPropertyGridOptions): void {
        checkRequiredOptions(newOptions);

        if (newOptions.editingObject !== this._options.editingObject || newOptions.source !== this._options.source) {
            this.items = getPropertyGridItems(newOptions.editingObject, newOptions.source);
            this.itemsViewModel.setItems(this.items);
            this.itemsViewModel.setGroupingKeyCallback(getGroupingKeyCallback(this.items));
        }
    }

    _propertyValueChanged(event: Event, item: PropertyGridItem, value: any): void {
        const name = item.get(PROPERTY_NAME_FIELD);
        const editingObjectClone = {...this._options.editingObject};
        const itemClone = item.clone(true);

        editingObjectClone[name] = value;
        itemClone.set(PROPERTY_VALUE_FIELD, value);

        this.items.getRecordById(name).merge(item);

        event.stopPropagation();
        this._notify('editingObjectChanged', [editingObjectClone]);
    }
}

PropertyGrid._theme = ['Controls/PropertyGrid/PropertyGrid'];

export = PropertyGrid;