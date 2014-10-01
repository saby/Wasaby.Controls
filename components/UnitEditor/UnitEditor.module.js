/**
 * Created by iv.cheremushkin on 25.09.2014.
 */

define('js!SBIS3.Genie.UnitEditor',
     ['js!SBIS3.CONTROLS.NumberTextBox',
      'js!SBIS3.CONTROLS._PickerMixin',
      'html!SBIS3.Genie.UnitEditor',
      'css!SBIS3.Genie.UnitEditor'], function (NumberTextBox, PickerMixin, dotTplFn) {

      'use strict';

      /**
       * Редактор с поддержкой единиц измереиния.
       * Можно устанавливать значения вида 96px/50%/auto
       * @class SBIS3.Genie.UnitEditor
       * @extends SBIS3.CONTROLS.NumberTextBox
       * @mixes SBIS3.CONTROLS._PickerMixin
       * @control
       */

      var UnitEditor;
      UnitEditor = NumberTextBox.extend([PickerMixin], /** @lends SBIS3.Genie.UnitEditor.prototype */ {
         _dotTplFn: dotTplFn,
         $protected: {
            _currentUnit: null,
            _units: ['px','%','-'],
            _unitSelector: null,
            _options: {}
         },

         $constructor: function () {
            var self = this;

            this._unitSelector = $('.js-controls-UnitEditor__unitSelector', this._container);
            this._currentUnit = this._units[0];
            this._unitSelector.html(this._currentUnit);
            this._drawUnits();

            //Устанавливаем нормальное значение если текст передан в опции
            if (this._options.text){
               this._currentUnit = this._parseUnit(this._options.text)[1];
               this._options.text = this._parseUnit(this._options.text)[0];
               if (this._options.text == 'auto'){
                  $('.controls-TextBox__field', this.getContainer().get(0)).attr('value', 'auto');
               } else {
                  $('.controls-TextBox__field', this.getContainer().get(0)).attr('value', this._options.text);
               }
               this._setUnit(this._currentUnit);
            }

            this._unitSelector.click(function () {
               self.togglePicker();
            });

            $('.controls-UnitEditor__unit', this._picker._container).click(function (e) {
               self.setText(self._options.text + $(e.target).html());
               self.hidePicker();
            });
         },

         getText: function () {
            var text = UnitEditor.superclass.getText.call(this);
            if (this._currentUnit == '-') {
               return 'auto';
            } else {
               return text + this._currentUnit;
            }
         },

         setText: function (text) {
            var p = this._parseUnit(text);
            UnitEditor.superclass.setText.call(this,p[0]);
            this._setUnit(p[1]);
         },

         _arrowUpClick: function(){
            this.setText(this._changeNumberByOne(-1, parseFloat(this.getText())) + this._currentUnit);
         },

         _arrowDownClick: function(){
            this.setText(this._changeNumberByOne(1, parseFloat(this.getText())) + this._currentUnit);
         },

         //Разделяем текст на число и единицу измерения
         _parseUnit: function(text){
            var value = parseFloat(text),
               unit = text.split(value)[1];
            if (unit === '') {
               unit = '-';
            }
            if (isNaN(value)){
               unit = '-';
            }
            return [value.toString(), unit];
         },

         _setUnit: function(unit){
            this._unitSelector.html(unit);
            this._currentUnit = unit;
            if (unit == '-'){
               UnitEditor.superclass.setText.call(this,'auto');
               this._inputField.attr('readonly','readonly');
               this._options.text = 100;
            } else {
               this._inputField.removeAttr('readonly');
            }
         },

         _drawUnits: function () {
            for (var i = 0; i < 3; i++) {
               this._picker.getContainer().append('<div class="controls-UnitEditor__unit">' + this._units[i] + '</div>');
               this._picker.getContainer().addClass('controls-UnitEditor__units');
            }
         }

      });

      return UnitEditor;

   });
