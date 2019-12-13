import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Decorator/Highlight/ClassName/ClassName');
import 'css!Controls-demo/Controls-demo';
import 'css!Controls-demo/Decorator/Highlight/ClassName/ClassName';

class ClassName extends Control<IControlOptions> {
    private _value = 'Наша мама мыла раму.\n' +
        'Кто бы вымыл нашу маму?\n' +
        'Вся она в песке и пенке,\n' +
        'Поцарапаны коленки.\n' +
        'Если я вдруг магом стану,\n' +
        'Сможет рама вымыть маму.';
    private _highlightedValue = 'мама маму рама';
    protected _template: TemplateFunction = controlTemplate;

    static _theme: string[] = ['Controls/Classes'];
}

export default ClassName;
