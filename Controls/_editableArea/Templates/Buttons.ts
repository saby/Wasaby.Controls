import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import ButtonsTemplate = require('wml!Controls/_editableArea/Templates/Buttons');
import * as tmplNotify from 'Controls/Utils/tmplNotify';

class Buttons extends Control<IControlOptions> {
    protected _template: TemplateFunction = ButtonsTemplate;
    protected _tmplNotify: Function = tmplNotify;
    static _theme: string[] = ['Controls/editableArea'];
}

export default Buttons;