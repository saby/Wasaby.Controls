import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/TagStyles/TagStyles');
import 'css!Controls-demo/Controls-demo';

class TagStyles extends Control<IControlOptions> {
    private _primaryValue = TagStyles._defaultValue;
    private _secondaryValue = TagStyles._defaultValue;
    private _successValue = TagStyles._defaultValue;
    private _warningValue = TagStyles._defaultValue;
    private _dangerValue = TagStyles._defaultValue;
    private _placeholder = 'Tooltip';

    protected _template: TemplateFunction = controlTemplate;

    private static _defaultValue = 'text';
    static _theme: string[] = ['Controls/Classes'];
}
export default TagStyles;
