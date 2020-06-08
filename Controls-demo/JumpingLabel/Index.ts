import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/JumpingLabel/JumpingLabel');

import 'Controls/input';

class JumpingLabel extends Control<IControlOptions> {
    private _name: string = 'Maxim';
    protected _template: TemplateFunction = controlTemplate;

    static _theme: string[] = ['Controls/Classes'];
    static _styles: string[] = ['Controls-demo/Controls-demo'];
}

export default JumpingLabel;
