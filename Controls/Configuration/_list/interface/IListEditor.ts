import {IControlOptions} from 'UI/Base';

export interface IListEditorItem {
    name: string;
    icon: string;
    caption: string;
    templateName: string;
    templateOptions: Record<string, any>;
}

export interface IListEditorOptions extends IControlOptions {
    selectedKey: string;
    items: IListEditorItem[];
}