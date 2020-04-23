import {Control, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/Configuration/_list/EditorArea/EditorArea';
import * as tabItemTemplate from 'wml!Controls/Configuration/_list/EditorArea/TabItemTemplate';
import tmplNotify = require('Controls/Utils/tmplNotify');
import {Memory} from 'Types/source';
import 'css!Controls/Configuration/_list/EditorArea/EditorArea';
import {IListEditorOptions, IListEditorItem, IEditorValue} from './interface/IListEditor';
import {ITEM_SETTINGS} from './Constants';
import {object} from 'Types/util';
import {SyntheticEvent} from 'Vdom/Vdom';

interface IListEditorCurrentTemplate {
    templateName: string;
    templateOptions: Record<string, any>;
}

export default class ListEditor extends Control<IListEditorOptions> {
    protected _template: TemplateFunction = template;
    protected _tabItemTemplate: TemplateFunction = tabItemTemplate;
    protected _notifyHandler: Function = tmplNotify;
    protected _items: unknown[];
    protected _editorValue: Record<string, any>;
    protected _currentTemplate: IListEditorCurrentTemplate = null;
    protected _tabSource: Memory = null;

    private _getItems(options: IListEditorOptions): any[] {
        const {tileTemplate, tableTemplate, listTemplate} = options;
        const items = [];
        if (tileTemplate) {
            items.push(this._getItem('tile', tileTemplate));
        }
        if (tableTemplate) {
            items.push(this._getItem('table', tileTemplate));
        }
        if (listTemplate) {
            items.push(this._getItem('list', tileTemplate));
        }
        return items;
    }

    private _getItem(name: string, itemSettings: IListEditorCurrentTemplate): unknown {
        return {
            ...ITEM_SETTINGS[name],
            ...itemSettings
        };
    }

    private _getEditorValue(editorValue: IEditorValue, templateName: string, viewMode: string): Record<string, any> {
        const valueOnTemplate = editorValue.templatesSettings?.[templateName] || {};
        return valueOnTemplate[viewMode] || {};
    }

    private _getCurrentItemTemplate(viewMode: string, items: any[]): IListEditorCurrentTemplate {
        return items.find((item: IListEditorItem) => item.id === viewMode);
    }

    protected _beforeMount(options: IListEditorOptions): void {
        this._items = this._getItems(options);
        this._editorValue = this._getEditorValue(options.editorValue, options.templateName, options.viewMode);
        this._tabSource = new Memory({
            keyProperty: 'id',
            data: this._items
        });
        this._currentTemplate = this._getCurrentItemTemplate(options.viewMode, this._items);
    }

    protected _beforeUpdate(options: IListEditorOptions): void {
        if (this._options.viewMode !== options.viewMode) {
            this._currentTemplate = this._getCurrentItemTemplate(options.viewMode, this._items);
            this._editorValue = this._getEditorValue(options.editorValue, options.templateName, options.viewMode);
        }
        if (this._options.editorValue !== options.editorValue) {
            this._editorValue = this._getEditorValue(options.editorValue, options.templateName, options.viewMode);
        }
        if (this._options.listTemplate !== options.listTemplate ||
            this._options.tableTemplate !== options.tableTemplate ||
            this._options.tileTemplate !== options.tileTemplate
        ) {
            this._items = this._getItems(options);
            this._editorValue = this._getEditorValue(options.editorValue, options.templateName, options.viewMode);
            this._tabSource = new Memory({
                keyProperty: 'id',
                data: this._items
            });
            this._currentTemplate = this._getCurrentItemTemplate(options.viewMode, this._items);
        }
    }

    protected _editorValueChanged(event: SyntheticEvent<Event>, value: Record<string, any>): void {
        const editorValue = object.clone(this._options.editorValue);
        const valueOnTemplate = editorValue.templatesSettings?.[this._options.templateName] || {};
        valueOnTemplate[this._options.viewMode] = value;
        this._notify('editorValueChanged', [valueOnTemplate]);
    }
}