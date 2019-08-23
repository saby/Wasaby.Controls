import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Paste/Paste');
import 'css!Controls-demo/Controls-demo';

class Paste extends Control<IControlOptions> {
    private _placeholder = 'Tooltip';

    private _pasteSmile(): void {
        this._children.field.paste('👌');
    }

    protected _template: TemplateFunction = controlTemplate;

    static _theme: string[] = ['Controls/Classes'];
}

export default Paste;
