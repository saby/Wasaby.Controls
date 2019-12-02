import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Slider/Base/SliderBaseFormatsDemo);
import 'css!Controls-demo/Controls-demo';


class SliderBaseFormatsDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    private _minValue: undefined;
    private _maxValue: undefined;
    private _scaleStep: undefined;
    private _sizeSource: null;
    private _size: '';
    private _precision: undefined;
    private _borderVisible: false;
    private _readOnly: false;
    private _event: 'none';
    private _value: undefined;

    _beforeMount: function(opts){
        this._minValue = 0;
        this._maxValue = 100;
        this._scaleStep = 20;
        this._precision = 0;
        this._value = 80;
        this._size = 'm';
        this._sizeSource = new source.Memory({
            keyProperty: 'title',
            data: [
                {
                    title: 's'
                },
                {
                    title: 'm'
                }
            ]
        });
    };
    static _theme: string[] = ['Controls/Classes'];
}
export default SliderBaseFormatsDemo;