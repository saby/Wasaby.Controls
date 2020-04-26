import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Spoiler/View/HeaderContentTemplate/template/Template');
import 'css!Controls-demo/Controls-demo';

class Template extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    static _theme: string[] = ['Controls/Classes'];
    protected _expandedChangeCallback: Function;

    protected _beforeMount(options?: IControlOptions, contexts?: object, receivedState?: void): Promise<void> | void {
        this._expandedChangeCallback = options.expandedChangeCallback;
    }
}
export default Template;
