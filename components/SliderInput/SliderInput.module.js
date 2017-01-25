/**
 * Created by ps.borisov on 08.09.2016.
 */

define('js!SBIS3.CONTROLS.SliderInput',
   [
      'js!SBIS3.CONTROLS.Slider',
      'html!SBIS3.CONTROLS.SliderInput',
      'Core/constants',
      'js!SBIS3.CONTROLS.NumberTextBox',
      'css!SBIS3.CONTROLS.SliderInput'
   ], function(Slider, dotTplFn, cConstants) {
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
               this._startTextBox.subscribe('onKeyPressed', this._textBoxKeyDown.bind(this));
               this._endTextBox.subscribe('onKeyPressed', this._textBoxKeyDown.bind(this));
            },

            setStartValue: function(value) {
               SliderInput.superclass.setStartValue.apply(this, [value]);
               this._startTextBox.setText(value);
            },

            setEndValue: function(value) {
               SliderInput.superclass.setEndValue.apply(this, [value]);
               this._endTextBox.setText(value);
            },

            _textBoxStartFocusOut: function () {
               this._textBoxFocusOut(this._startTextBox, 'start');
            },

            _textBoxEndFocusOut: function () {
               this._textBoxFocusOut(this._endTextBox, 'end');
            },

            _sliderDrawChange: function(event, start, end) {
               if (!(!this._options.startValue && start == this._options.minValue)) { //если стартовая величина не задана, и start стоит на maxValue => левую часть фильтра не трогали
                  this._startTextBox.setText(start);
               }
               if (!(!this._options.endValue && end == this._options.maxValue)) { //если конечная величина не задана, и end стоит на endValue => правую часть фильтра не трогали
                  this._endTextBox.setText(end);
               }
            },

            _textBoxFocusOut: function(input, side) {
               if (input.isChanged()) {
                  this._setPreparedValue(input.getNumericValue(), side);
                  this._pointsContainers.start.removeClass('lastActivePoint');
                  this._pointsContainers.end.removeClass('lastActivePoint');
                  this._pointsContainers[side].addClass('lastActivePoint');
               }
            },

            _setPreparedValue : function(value, side){
               value = value || value === 0 ? this._prepareValue(value, side) : value;
               side === 'start' ? this.setStartValue(value) : this.setEndValue(value);
            },

            _drawValue: function(value, side) {
               var
                  input = side === 'start' ? this._startTextBox : this._endTextBox;
               SliderInput.superclass._drawValue.apply(this, arguments);
               value = value || value === 0 ? this._prepareValue(value, side) : value;
               input.setText(value);
            },

            _textBoxKeyDown: function(descriptor, event) {
               if (event.which == cConstants.key.enter) {
                  if (descriptor._target.getName() == 'EndTextBox') {
                     this._textBoxFocusOut(this._endTextBox, 'end');
                  } else {
                     this._endTextBox.setActive(true);
                  }
               }
            },

            _updateMinMaxValue: function(value, side){
               var
                  input = side === 'min' ?  this._startTextBox : this._endTextBox;
               SliderInput.superclass._updateMinMaxValue.apply(this, arguments);
               input.setPlaceholder(value);
            }
         });
      return SliderInput;
   });
