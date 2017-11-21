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
          /**
           * Класс контрола "Диапазон выбора значений", который применяется для панели фильтров {@link SBIS3.CONTROLS.FilterPanel}.
           * Создан на основе контрола {@link SBIS3.CONTROLS.SliderInput}.
           * @class SBIS3.CONTROLS.FilterPanelDataRange
           * @extends SBIS3.CONTROLS.SliderInput
           * @public
           *
           * @author Борисов Петр Сергеевич
           *
           * @mixes SBIS3.CONTROLS.IFilterItem
           */
         FilterPanelDataRange = SliderInput.extend([IFilterItem], /** @lends SBIS3.CONTROLS.FilterPanelDataRange.prototype */{
            $protected: {
               _options: {
                  /**
                   * @cfg {Array} Устанавливает фильтр: начальное и конечное значение.
                   * @remark
                   * Первый и второй элементы массива устанавливают начальное и конечное значение диапазона дат соответственно.
                   */
                  value: []
               },
               _notifyValueChange: null
            },

            _modifyOptions: function(options) {
               options.startValue = options.value[0];
               options.endValue = options.value[1];
               options = SliderInput.superclass._modifyOptions.apply(this, arguments);
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
               this._setPointValue(value, 0);
            },

            setEndValue: function(value) {
               this._setPointValue(value, 1);
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

            _setPointValue: function(value, index) {
               var
                  valueArr = index === 0 ? [value, this._options.value[1]] : [this._options.value[0], value],
                  methodName = index === 0 ? 'setStartValue' : 'setEndValue',
                  input = index === 0 ? this._startTextBox : this._endTextBox;
               if (value !== this._options.value[index]) {
                  this.setTextValue(this._prepareTextValue(valueArr));
                  this._options.value = valueArr;
                  FilterPanelDataRange.superclass[methodName].apply(this, [value]);
                  this._notifyValueChange();
               } else {
                  this._redraw();
                  input.setText(value);
               }
            }
         });
      return FilterPanelDataRange;
   });
