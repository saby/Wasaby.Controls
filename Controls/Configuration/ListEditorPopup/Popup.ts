import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import * as template from 'wml!Controls/Configuration/ListEditorPopup/Popup/Popup';
import 'css!Controls/Configuration/ListEditorPopup/Popup/Popup';

export default class ListEditorPopup extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _removeClick(): void {
        //todo
    }
    protected _saveClick(): void {
        //todo
    }
    protected _resetClick(): void {
        //todo
    }
}