/**
 * Created by ps.borisov on 08.09.2016.
 */

define('js!SBIS3.CONTROLS.FilterPanelDataRange',
   [
      'js!SBIS3.CONTROLS.IFilterItem',
      'js!SBIS3.CONTROLS.SliderInput'
   ], function(IFilterItem, SliderInput) {
      'use strict';
      var
         FilterPanelDataRange = SliderInput.extend([IFilterItem], /** @lends SBIS3.CONTROLS.FilterPanelDataRange.prototype */{
            $protected: {
               _options: {
                  value: []
               },
               _notifyValueChange: null
            },

            _modifyOptions: function(options) {
               options = SliderInput.superclass._modifyOptions.apply(this, arguments);
               options.startValue = options.value[0];
               options.endValue = options.value[1];
               return options;
            },

            $constructor: function() {
               this._notifyValueChange =  this._notifyValueChangeFn.debounce(0);
            },

            setValue: function(value) {
               if (value[0] === this.getStartValue() && value[1] === this.getEndValue()) {
                  return;
               }
               this.setStartValue(value[0]);
               this.setEndValue(value[1]);
               this._options.value = value;
            },

            _prepareTextValue: function(value) {
               var
                  result = '';
               if (value[0] !== null) {
                  result += 'от ' + value[0]
               }
               if (value[1] !== null) {
                  result += (value[0] !== null ? ' до ' : 'до ') + value[1];
               }
               return result;
            },

            getValue: function() {
               return this._options.value;
            },

            setStartValue: function(value) {
               if (value !== this._options.value[0]) {
                  this.setTextValue(this._prepareTextValue([value, this._options.value[1]]));
                  this._options.value = [value, this._options.value[1]];
                  FilterPanelDataRange.superclass.setStartValue.apply(this, [value]);
                  this._notifyValueChange();
               } else {
                  this._redrawInput(value, this._startTextBox);
               }
            },

            setEndValue: function(value) {
               if (value !== this._options.value[1]) {
                  this.setTextValue(this._prepareTextValue([this._options.value[0], value]));
                  this._options.value = [this._options.value[0], value];
                  FilterPanelDataRange.superclass.setEndValue.apply(this, [value]);
                  this._notifyValueChange();
               } else {
                  this._redrawInput(value, this._endTextBox);
               }
            },

            _notifyValueChangeFn: function () {
               this._notifyOnPropertyChanged('value');
            },

            getTextValue: function() {
               return this._options.textValue;
            },

            setTextValue: function(textValue) {
               if (textValue !== this._options.textValue) {
                  this._options.textValue = textValue;
                  this._notifyOnPropertyChanged('textValue');
               }
            },

            _redrawInput: function(value, input) {
               this._redraw();
               input.setText(value);
            }
         });
      return FilterPanelDataRange;
   });
