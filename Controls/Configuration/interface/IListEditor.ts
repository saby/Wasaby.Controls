import {Memory} from 'Types/source';
import {IControlOptions, TemplateFunction} from 'UI/Base';

export type TViewSettingsValue = Record<string, number | string>;

export interface IListEditorTemplate {
    templateName: string;
    templateOptions: Record<string, any>;
    editorOptions: IVewSettingsEditorOptions;
}

export interface IViewSettingsEditorSourceItem {
    name: string;
    group: string;
    caption: string;
    isGroupProperty: boolean;
    resetValue: any;
    value: any;
    editorTemplate: string;
    editorOptions: {
        source: Memory;
        itemTemplate: string | TemplateFunction;
    };
}

export interface IVewSettingsEditorOptions extends IControlOptions {
    source: IViewSettingsEditorSourceItem[];
    value: TViewSettingsValue;
}

export interface IListEditorOptions extends IControlOptions {
    tileTemplate: IListEditorTemplate;
    tableTemplate: IListEditorTemplate;
    listTemplate: IListEditorTemplate;
    tabItems: ITabItem;
    selectedKey: string;
    rightTemplate: TemplateFunction;
}

export interface ListEditorItemTemplate {
    previewTemplate: TemplateFunction;
    editorTemplate: TemplateFunction;
}

