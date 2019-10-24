import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/NotificationDemo/ConfirmationTemplate');
import 'css!Controls-demo/Controls-demo';
import 'css!Controls-demo/NotificationDemo/NotificationTemplate';

class ConfirmationTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    static _theme: string[] = ['Controls/Classes'];
}
export default ConfirmationTemplate;