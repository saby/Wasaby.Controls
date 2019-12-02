define('Controls-demo/Slider/Base/SliderBaseFormatsDemo',
    [
        'Core/Control',
        'Types/source',
        'wml!Controls-demo/Slider/Base/SliderBaseFormatsDemo',
        'Controls/slider'
    ],
    function(Control, source, template) {
        'use strict';
        var SliderBaseFormatsDemo = Control.extend({
            _template: template,
            _minValue: undefined,
            _maxValue: undefined,
            _scaleStep: undefined,
            _sizeSource: null,
            _size: '',
            _format: '',
            _precision: undefined,
            _borderVisible: false,
            _readOnly: false,
            _event: 'none',
            _value: undefined,
            _beforeMount: function(opts){
                this._minValue = 11;
                this._maxValue = 17;
                this._scaleStep = 1;
                this._precision = 0;
                this._value = 13;
                this._size = 'm';
                this._format= 'hour';
            },

            changeValue: function(e, val) {
                this._value = val;
                this._event = 'valueChanged';
            },
            changePrecision: function(e, val) {
                this._precision = val;
            },


        });

        return SliderBaseFormatsDemo;
    }
);
