import {Control, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Menu/Popup/CloseButtonVisibility/Index');

class CloseButtonVisibility extends Control {
    protected _template: TemplateFunction = controlTemplate;

    static _theme: string[] = ['Controls/Classes'];
    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
export default CloseButtonVisibility;
