import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/TextAlignments/TextAlignments');
import 'css!Controls-demo/Controls-demo';

class TextAlignments extends Control<IControlOptions> {
    private _rightValue = TextAlignments._defaultValue;
    private _leftValue = TextAlignments._defaultValue;
    private _placeholder = 'Tooltip';

    protected _template: TemplateFunction = controlTemplate;

    private static _defaultValue = 'text';
    static _theme: string[] = ['Controls/Classes'];
}

export default TextAlignments;
