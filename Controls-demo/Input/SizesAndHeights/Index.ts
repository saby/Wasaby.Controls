import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/SizesAndHeights/SizesAndHeights');
import 'css!Controls-demo/Controls-demo';

class SizesAndHeights extends Control<IControlOptions> {
    private _sizeAndHeightXSValue = SizesAndHeights._defaultValue;
    private _sizeAndHeightSValue = SizesAndHeights._defaultValue;
    private _sizeAndHeightMValue = SizesAndHeights._defaultValue;
    private _sizeAndHeightLValue = SizesAndHeights._defaultValue;
    private _sizeAndHeightXLValue = SizesAndHeights._defaultValue;
    private _sizeAndHeight2XLValue = SizesAndHeights._defaultValue;
    private _sizeAndHeight3XLValue = SizesAndHeights._defaultValue;
    private _sizeAndHeight4XLValue = SizesAndHeights._defaultValue;
    private _placeholder = 'Tooltip';

    protected _template: TemplateFunction = controlTemplate;

    private static _defaultValue = 'text';
    static _theme: string[] = ['Controls/Classes'];
}

export default SizesAndHeights;
