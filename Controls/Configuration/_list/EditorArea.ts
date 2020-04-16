import {Control, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/Configuration/_list/EditorArea/EditorArea';
import * as tabItemTemplate from 'wml!Controls/Configuration/_list/EditorArea/TabItemTemplate';
import tmplNotify = require('Controls/Utils/tmplNotify');
import {Memory} from 'Types/source';
import 'css!Controls/Configuration/_list/EditorArea/EditorArea';
import {IListEditorOptions, IListEditorItem} from './interface/IListEditor';

interface IListEditorCurrentTemplate {
    templateName: string;
    templateOptions: Record<string, any>;
}

export default class ListEditor extends Control<IListEditorOptions> {
    protected _template: TemplateFunction = template;
    protected _tabItemTemplate: TemplateFunction = tabItemTemplate;
    protected _notifyHandler: Function = tmplNotify;
    protected _currentTemplate: IListEditorCurrentTemplate = null;
    protected _tabSource: Memory = null;

    private _getTabsSource(items: IListEditorItem[]): Memory {
        return new Memory({
            keyProperty: 'name',
            data: items.map(({name, caption, icon }: IListEditorItem) => {
                return {
                    name,
                    caption,
                    icon
                };
            })
        });
    }

    private _getCurrentItemTemplate(selectedKey: string, items: IListEditorItem[]): IListEditorCurrentTemplate {
        const currentItem = items.find((item: IListEditorItem) => item.name === selectedKey);
        if (!currentItem) {
            // todo error throw;
        }
        return currentItem;
    }

    protected _beforeMount(options: IListEditorOptions): void {
        this._tabSource = this._getTabsSource(options.items);
        this._currentTemplate = this._getCurrentItemTemplate(options.selectedKey, options.items);
    }

    protected _beforeUpdate(options: IListEditorOptions): void {
        if (this._options.items !== options.items) {
            this._tabSource = this._getTabsSource(options.items);
            this._currentTemplate = this._getCurrentItemTemplate(options.selectedKey, options.items);
        }
    }
}