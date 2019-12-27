import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Popup/Edit/SyncWithApplication');
import 'css!Controls-demo/Controls-demo';

class SyncWithApplication extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    static _theme: string[] = ['Controls/Classes'];
}
export default SyncWithApplication;