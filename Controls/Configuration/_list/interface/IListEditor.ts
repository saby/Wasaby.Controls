import {IControlOptions} from 'UI/Base';
import {IProperty as IPropertyGridItem} from 'Controls/propertyGrid';
import {ICrudPlus} from 'Types/source';

type NodeKey = string | number;
type ViewOptions = Record<string, any>;
type AvailableViewMode = 'tile' | 'table' | 'list';
type Access = 'external'| 'internal' | 'clients';

export interface IEditorValue {
    nodesTemplates: Record<NodeKey, keyof ITemplatesSettings>;
    templatesSettings: ITemplatesSettings;
}

export interface ITemplatesSettings {
    [templateName: string]: ITemplateOptions;
}

export interface ITemplateOptions {
    tile: ViewOptions;
    list: ViewOptions;
    table: ViewOptions;
    settings: {
        access: Access
        defaultViewMode: AvailableViewMode
    };
}

export interface IItemEditorOptions {
    source: IPropertyGridItem[];
    parentProperty: string;
    nodeProperty: string;
    root: string | number;
    captionTemplateName: string;
    captionTemplateOptions: {
        width: string;
        compatibleWidth: string;
    };
    editorTemplateOptions: {
        width: string;
        compatibleWidth: string;
    };
}

export interface IListEditorItem {
    templateName: string;
    templateOptions: Record<string, any>;
    editorOptions: IItemEditorOptions;
}

export interface IListEditorOptions extends IControlOptions {
    viewMode: string;
    templateName: string;
    tileTemplate: IListEditorItem;
    tableTemplate: IListEditorItem;
    listTemplate: IListEditorItem;
    editorValue: IEditorValue;
    settingsTemplateOptions: {
        source: ICrudPlus;
    };
}