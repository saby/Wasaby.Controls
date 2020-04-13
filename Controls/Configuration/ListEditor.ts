import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import * as template from 'wml!Controls/Configuration/ListEditor/ListEditor';
import * as tabItemTemplate from 'wml!Controls/Configuration/ListEditor/TabItemTemplate';
import * as areaItemTemplate from 'wml!Controls/Configuration/ListEditor/AreaItemTemplate';
import tmplNotify = require('Controls/Utils/tmplNotify');
import {Memory} from 'Types/source';
import 'css!Controls/Configuration/ListEditor/ListEditor';

interface IListTemplate {
    templateName: string;
    templateOptions: Record<string, any>;
}

interface IListEditorOptions extends IControlOptions {
    selectedKey: string;
    tileTemplate: IListTemplate;
    tableTemplate: IListTemplate;
    listTemplate: IListTemplate;
}

export default class ListEditor extends Control<IListEditorOptions> {
    protected _template: TemplateFunction = template;
    protected _tabItemTemplate: TemplateFunction = tabItemTemplate;
    protected _notifyHandler: Function = tmplNotify;
    protected _areaItemTemplate: TemplateFunction = areaItemTemplate;
    protected _tabSource: Memory = new Memory({
        keyProperty: 'id',
        data: [
            {
                id: 'tile',
                title: 'Плитка',
                icon: 'ArrangePreview'
            },
            {
                id: 'table',
                title: 'Таблица',
                icon: 'TableCreate'
            },
            {
                id: 'list',
                title: 'Список',
                icon: 'InputHistory'
            }
        ]
    });
    protected _switchableItems: Array<Record<string, any>> = [];

    private _getSwitchableItems(
        {
            tableTemplate,
            listTemplate,
            tileTemplate
        }: IListEditorOptions
    ): Array<Record<string, any>> {
        return [
            {
                id: 'tile',
                itemTemplate: tileTemplate.templateName,
                templateOptions: tileTemplate.templateOptions
            },
            {
                id: 'table',
                itemTemplate: tableTemplate.templateName,
                templateOptions: tableTemplate.templateOptions
            },
            {
                id: 'list',
                itemTemplate: listTemplate.templateName,
                templateOptions: listTemplate.templateOptions
            }
        ];
    }

    protected _beforeMount(options: IListEditorOptions): void {
        this._switchableItems = this._getSwitchableItems(options);
    }

    protected _beforeUpdate(options: IListEditorOptions): void {
        if (
            options.tileTemplate !== this._options.tileTemplate ||
            options.tableTemplate !== this._options.tableTemplate ||
            options.listTemplate !== this._options.listTemplate
        ) {
            this._switchableItems = this._getSwitchableItems(options);
        }
    }
}