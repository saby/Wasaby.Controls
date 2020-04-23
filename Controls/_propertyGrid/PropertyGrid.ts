import {Control, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/_propertyGrid/PropertyGrid');
import defaultGroupTemplate = require('wml!Controls/_propertyGrid/groupTemplate');
import PropertyGridItem = require('Controls/_propertyGrid/PropertyGridItem');
import 'wml!Controls/_propertyGrid/itemTemplate';

import {factory} from 'Types/chain';
import {RecordSet} from 'Types/collection';

import {IPropertyGridOptions} from 'Controls/_propertyGrid/IPropertyGrid';
import IProperty from 'Controls/_propertyGrid/IProperty';

import {view as constView} from 'Controls/Constants';
import {SyntheticEvent} from 'Vdom/Vdom';
import {Tree, GroupItem, TreeItem} from 'Controls/display';

interface IPropertyGridItem extends IProperty {
    propertyValue: any;
}

type PropertyGridItems = RecordSet<PropertyGridItem>;

interface IPropertyGridItemDefault extends IPropertyGridItem {
    name: undefined;
    caption: undefined;
    editorTemplateName: undefined;
    editorOptions: undefined;
    editorClass: undefined;
    type: undefined;
    group: string;
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
        editorClass: undefined,
        type: undefined,
        group: constView.hiddenGroup,
        propertyValue: undefined
    };
}

function checkRequiredOptions(options: IPropertyGridOptions): void {
    if (!options.editingObject) {
        throw new Error('PropertyGrid::editingObject is required');
    }
}

function getPropertyGridItems(editingObject: Object, source: IProperty[]): RecordSet<PropertyGridItem> {
    const itemsArray: IPropertyGridItem[] = [];
    let result: RecordSet<Record>;

    let propertyGridItemDefault: IPropertyGridItem;

    factory(source).each((config: IProperty) => {
        propertyGridItemDefault = getPropertyItemDefault();
        propertyGridItemDefault.propertyValue = editingObject[config[PROPERTY_NAME_FIELD]];

        propertyGridItemDefault = {...propertyGridItemDefault, ...config};
        itemsArray.push(propertyGridItemDefault);
    });

    result = new RecordSet({
        rawData: itemsArray,
        model: PropertyGridItem,
        keyProperty: PROPERTY_NAME_FIELD
    });
    return result;
}

/**
 * Контрол, который позволяет пользователям просматривать и редактировать свойства объекта.
 * Вы можете использовать стандартные редакторы PropertyGrid или специальные редакторы.
 * По умолчанию propertyGrid будет автоматически генерировать все свойства для данного объекта.
 * @class Controls/_propertyGrid/PropertyGrid
 * @extends Core/Control
 * @mixes Controls/_propertyGrid/IPropertyGrid
 * @demo Controls-demo/PropertyGridNew/Group/Expander/Index
 * @control
 * @public
 * @author Герасимов А.М.
 */

/*
 * Represents a control that allows users to inspect and edit the properties of an object.
 * You can use the standard editors that are provided with the PropertyGrid or you can use custom editors.
 * By default the propertyGrid will autogenerate all the properties for a given object
 * @class Controls/_propertyGrid/PropertyGrid
 * @extends Core/Control
 * @mixes Controls/_propertyGrid/IPropertyGrid
 * @control
 * @public
 * @author Герасимов А.М.
 */

class PropertyGrid extends Control<IPropertyGridOptions>  {
    protected _template: TemplateFunction = template;
    protected _defaultGroupTemplate: TemplateFunction = defaultGroupTemplate;

    private items: RecordSet<PropertyGridItem>;
    private itemsViewModel: Tree<PropertyGridItem>;

    _beforeMount(options: IPropertyGridOptions): void {
        checkRequiredOptions(options);
        this._getItemStyles = this._getItemStyles.bind(this);
        this.items = getPropertyGridItems(options.editingObject, options.source);
        this.itemsViewModel = this.getViewModel(this.items, options.parentProperty, options.nodeProperty);
    }

    _beforeUpdate(newOptions: IPropertyGridOptions): void {
        checkRequiredOptions(newOptions);

        if (newOptions.editingObject !== this._options.editingObject || newOptions.source !== this._options.source) {
            this.items = getPropertyGridItems(newOptions.editingObject, newOptions.source);
            this.itemsViewModel = this.getViewModel(this.items, newOptions.parentProperty, newOptions.nodeProperty);
        }

        if (newOptions.collapsedGroups !== this._options.collapsedGroups) {
            this.itemsViewModel.setCollapsedGroups(newOptions.collapsedGroups);
        }
    }

    _propertyValueChanged(event: Event, item: PropertyGridItem, value: any): void {
        const name = item.get(PROPERTY_NAME_FIELD);
        const editingObjectClone = {...this._options.editingObject};
        const itemClone = item.clone(true);

        editingObjectClone[name] = value;
        itemClone.set(PROPERTY_VALUE_FIELD, value);

        (this.items.getRecordById(name) as PropertyGridItem).set(PROPERTY_VALUE_FIELD, value);

        event.stopPropagation();
        this._notify('editingObjectChanged', [editingObjectClone]);
    }

    private _groupCallback(item: PropertyGridItem): string {
        return item.get(PROPERTY_GROUP_FIELD);
    }

    protected _groupClick(
        event: SyntheticEvent<Event>,
        collectionItem: GroupItem<PropertyGridItem> | TreeItem<PropertyGridItem>
    ): void {
        if (collectionItem instanceof GroupItem) {
            const isExpandClick = event.target.closest('.controls-PropertyGrid__groupExpander');
            if (isExpandClick) {
                collectionItem.toggleExpanded();
            }
        }
    }

    protected _getItemStyles(
        item: GroupItem<PropertyGridItem> | TreeItem<PropertyGridItem>,
        columnIndex: number
    ): string {
        const itemIndex = this.itemsViewModel.getIndex(item);
        if (item instanceof GroupItem) {
            return `-ms-grid-column: 1;
                    -ms-grid-column-span: 3;
                    grid-column-start: 1;
                    grid-column-end: 3;
                    grid-row: ${itemIndex + 1};`;
        } else {
            return `grid-column: ${columnIndex};
                grid-row: ${itemIndex + 1};
                -ms-grid-column: ${columnIndex};
                -ms-grid-row: ${itemIndex + 1};`;
        }
    }

    getViewModel(
        items: RecordSet<PropertyGridItem>,
        parentProperty: string,
        nodeProperty: string,
        collapsedGroups: Array<string | number>
    ): Tree<PropertyGridItem> {
        const collection = new Tree({
            collection: this.items as IEnumerable,
            keyProperty: PROPERTY_NAME_FIELD,
            root: null,
            parentProperty,
            nodeProperty,
            group: this._groupCallback
        });
        return collection;
    }
}

PropertyGrid._theme = ['Controls/propertyGrid'];

export = PropertyGrid;
