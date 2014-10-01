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
            _currentUnit: 'px',
            _units: [
               {
                  key: '0',
                  title: 'px'
               },
               {
                  key: '1',
                  title: '%'
               },
               {
                  key: '2',
                  title: 'auto'
               }
            ],
            _unitSelector: null,
            _options: {}
         },

         $constructor: function () {
            var self = this;

            this._unitSelector = $('.js-controls-UnitEditor__unitSelector', this._container);
            this._unitSelector.html(this._units[0].title);
            this._currentUnit = this._units[0].title;
            this._drawUnits();
            //Устанавливаем нормальное значение если текст передан в опции
            if (this._options.text){
               var p = this._parseUnit(this._options.text);
               this._options.text = p[0];
               $('.controls-TextBox__field', this.getContainer().get(0)).attr('value', p[0] || '');
               if (p[1] !== '') {
                  this._setUnit(this._unitToKey(p[1]));
               }
            }

            this._unitSelector.click(function () {
               self.togglePicker();
            });
            $('.controls-UnitEditor__unit', this._picker._container).click(function (e) {
               self._setUnit($(e.target).attr('data-key'));
               self.hidePicker();
            });
         },

         getText: function () {
            var text = UnitEditor.superclass.getText.call(this);
            if (text == 'auto') {
               return text;
            } else {
               return text + this._currentUnit;
            }
         },

         setText: function (text) {
            var p = this._parseUnit(text);
            UnitEditor.superclass.setText.call(this, p[0]);
            if (p[1] !== '') {
               this._setUnit(this._unitToKey(p[1]));
            }
         },

         //Разделяем текст на число и единицу измерения
         _parseUnit: function(text){
            var value = parseFloat(text),
               unit = text.split(value)[1];
            if (isNaN(value)) {
               value = 'auto';
            }
            return [value, unit];
         },

         //Получить id по единице измерения
         _unitToKey: function (unit) {
            switch (unit) {
               case 'px':
                  return '0';
               case '%':
                  return '1';
               default:
                  return '2';
            }
         },

         //Установить единицу измерения по Id
         _setUnit: function (rowId) {
            var self = this;
            switch (rowId) {
               case '0':
               case '1':
                  self._unitSelector.html(self._units[rowId].title);
                  if (self._currentUnit == 'auto') {
                     UnitEditor.superclass.setText.call(this, 100);
                  }
                  self._currentUnit = self._units[rowId].title;
                  break;
               default :
                  self._unitSelector.html('-');
                  self._currentUnit = self._units[rowId].title;
                  UnitEditor.superclass.setText.call(this, 'auto');
                  break;
            }
         },

         _drawUnits: function () {
            for (var i = 0; i < 3; i++) {
               this._picker.getContainer().append('<div class="controls-UnitEditor__unit" data-key="' + this._units[i].key + '">' + this._units[i].title + '</div>');
               this._picker.getContainer().addClass('controls-UnitEditor__units');
            }
         }

      });

      return UnitEditor;

   });
