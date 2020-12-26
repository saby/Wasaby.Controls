import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/AreaAlignments/AreaAlignments');

class TextAlignments extends Control<IControlOptions> {
    static _theme: string[] = ['Controls/Classes'];
    static _styles: string[] = ['Controls-demo/Controls-demo', 'Controls-demo/Input/AreaAlignments/AreaAligments'];
    private static _defaultValue = 'text';
    protected _rightValue = TextAlignments._defaultValue;
    protected _leftValue = TextAlignments._defaultValue;
    protected _centerValue = TextAlignments._defaultValue;
    protected _template: TemplateFunction = controlTemplate;
}

export default TextAlignments;
