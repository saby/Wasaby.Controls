/**
 * Created by ps.borisov on 08.09.2016.
 */

define('js!SBIS3.CONTROLS.SliderInput',
   [
      'js!SBIS3.CONTROLS.Slider',
      'html!SBIS3.CONTROLS.SliderInput',
      'js!SBIS3.CONTROLS.NumberTextBox'
   ], function(Slider, dotTplFn) {
      'use strict';
      var
         /**
          * Класс контрола "Слайдер с полям ввода".
          * @class SBIS3.CONTROLS.SliderInput
          * @extends SBIS3.CONTROLS.Slider
          *
          * @author Борисов Петр Сергеевич
          *
          * @demo SBIS3.CONTROLS.Demo.SliderInputDemo
          */
         SliderInput = Slider.extend(/** @lends SBIS3.CONTROLS.SliderInput.prototype */{
            _dotTplFn : dotTplFn,
            $protected: {
               _options: {
                  /**
                   * @cfg {String} Устанавливает подпись перед первым полем ввода.
                   * @see middleLabel
                   * @see endLabel
                   */
                  startLabel: '',
                   /**
                    * @cfg {String} Устанавливает подпись между первым и вторым полем ввода.
                    * @see startLabel
                    * @see endLabel
                    */
                  middleLabel: '',
                   /**
                    * @cfg {String} Устанавливает подпись после второго поля ввода.
                    * @see startLabel
                    * @see middleLabel
                    */
                  endLabel: ''
               },
               _endTextBox: undefined,
               _startTextBox: undefined
            },

            init: function() {
               SliderInput.superclass.init.call(this);
               this._endTextBox = this.getChildControlByName('EndTextBox');
               this._startTextBox = this.getChildControlByName('StartTextBox');
               this._startTextBox.subscribe('onFocusOut', this._textBoxStartFocusOut.bind(this));
               this._endTextBox.subscribe('onFocusOut', this._textBoxEndFocusOut.bind(this));
               this.subscribe('onDrawValueChange', this._sliderDrawChange.bind(this));
            },

            setStartValue: function(value) {
               SliderInput.superclass.setStartValue.apply(this, [value]);
               this._startTextBox.setText(value);
            },

            setEndValue: function(value) {
               SliderInput.superclass.setEndValue.apply(this, [value]);
               this._endTextBox.setText(value);
            },

            setMaxValue: function(value) {
               SliderInput.superclass.setMaxValue.apply(this, [value]);
               this._endTextBox.setPlaceholder(value);
            },

            setMinValue: function(value) {
               SliderInput.superclass.setMinValue.apply(this, [value]);
               this._startTextBox.setPlaceholder(value);
            },

            _textBoxStartFocusOut: function () {
               if (this._startTextBox._textChanged) {
                  this._setPreparedStartVale(this._startTextBox.getNumericValue());
                  this._pointsContainers.right.removeClass('lastActivePoint');
                  this._pointsContainers.left.addClass('lastActivePoint');
               }
            },

            _textBoxEndFocusOut: function () {
               if (this._endTextBox._textChanged) {
                  this._setPreparedEndVale(this._endTextBox.getNumericValue());
                  this._pointsContainers.left.removeClass('lastActivePoint');
                  this._pointsContainers.right.addClass('lastActivePoint');
               }
            },

            _sliderDrawChange: function(event, start, end) {
               if (!(!this._options.startValue && start == this._options.minValue)) { //если стартовая величина не задана, и start стоит на maxValue => левую часть фильтра не трогали
                  this._startTextBox.setText(start);
               }
               if (!(!this._options.endValue && end == this._options.maxValue)) { //если конечная величина не задана, и end стоит на endValue => правую часть фильтра не трогали
                  this._endTextBox.setText(end);
               }
            },

            _setPreparedStartVale : function(value){
               value = value || value === 0 ? this._prepareValue(value, 'left') : value;
               this.setStartValue(value);
            },

            _setPreparedEndVale : function(value){
               value = value || value === 0 ? this._prepareValue(value, 'right') : value
               this.setEndValue(value);
            }
         });
      return SliderInput;
   });
