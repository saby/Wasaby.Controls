import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Spoiler/View/HeaderContentTemplate/HeaderTemplate/template/Template');
import notifyHandler = require('Controls/Utils/tmplNotify');
import 'css!Controls-demo/Spoiler/View/HeaderContentTemplate/HeaderTemplate/headerTemplate';
import 'css!Controls-demo/Controls-demo';

class Template extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _notifyHandler: Function = notifyHandler;
    static _theme: string[] = ['Controls/Classes'];
}
export default Template;
