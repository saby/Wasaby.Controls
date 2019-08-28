import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/CompoundMask/CompoundMask');
import 'css!Controls-demo/Controls-demo';

class CompoundMask extends Control<IControlOptions> {
    private _controlReplacer = '';
    private _controlMask = 'ddd-ddd-dddddd';
    private _controlValue = '874-998-877546';

    protected _template: TemplateFunction = controlTemplate;

    static _theme: string[] = ['Controls/Classes'];
}

export default CompoundMask;
