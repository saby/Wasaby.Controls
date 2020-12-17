import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {IoC} from 'Env/Env';
import controlTemplate = require('wml!Controls-demo/Buttons/Baseline/Template');
import {receiveLinksArray} from 'Controls/decorator';
import {wrapLinksInString} from 'Controls/_decorator/Markup/resources/linkDecorateUtils';


class ViewModes extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    static _styles: string[] = ['Controls-demo/Buttons/Baseline/Style'];
    static _theme: string[] = ['Controls/Classes'];

    protected _clickHandler() {
        wrapLinksInString('my page on vk.com is vk.com/id0', ['p', 'my page on vk.com is vk.com/id0']);
        receiveLinksArray('my page on vk.com is vk.com/id0');
    }
}
export default ViewModes;
