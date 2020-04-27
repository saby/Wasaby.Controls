import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/ResizingLine/Widths/Widths');
import 'css!Controls-demo/Controls-demo';
import 'css!Controls-demo/ResizingLine/Widths/Width';

class Widths extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    static _theme: string[] = ['Controls/Classes'];
}

export default Widths;
