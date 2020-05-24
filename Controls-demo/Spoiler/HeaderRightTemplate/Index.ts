import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Spoiler/HeaderRightTemplate/Template');
import notifyHandler = require('Controls/Utils/tmplNotify');

class Template extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _notifyHandler: Function = notifyHandler;
    static _theme: string[] = ['Controls/Classes'];
    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
export default Template;
