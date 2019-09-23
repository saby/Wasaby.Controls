import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/BlockLayouts/BlockLayouts');
import 'css!Controls-demo/Controls-demo';
import 'css!Controls-demo/BlockLayouts/BlockLayouts';

class BlockLayouts extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    static _theme: string[] = ['Controls/Classes'];
}

export default BlockLayouts;
