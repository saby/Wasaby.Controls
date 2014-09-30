/**
 * Created by iv.cheremushkin on 25.09.2014.
 */

define('js!SBIS3.CONTROLS.UnitEditor',
   ['js!SBIS3.CONTROLS.NumberTextBox',
      'js!SBIS3.CONTROLS._PickerMixin',
      'html!SBIS3.CONTROLS.UnitEditor',
      'css!SBIS3.CONTROLS.UnitEditor'], function (NumberTextBox, PickerMixin, dotTplFn) {


      'use strict';
      /**
       * Поле ввода, куда можно вводить только числовые значения
       * @class SBIS3.CONTROLS.UnitEditor
       * @extends SBIS3.CONTROLS.NumberTextBox
       * @mixes SBIS3.CONTROLS._PickerMixin
       * @control
       */

      var UnitEditor;
      UnitEditor = NumberTextBox.extend([PickerMixin], /** @lends SBIS3.CONTROLS.UnitEditor.prototype */ {
         _dotTplFn: dotTplFn,
         $protected: {
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
            if (!this.getText()) {
               this.setText('100');
            }
            this._unitSelector = $('.js-controls-UnitEditor__unitSelector', this._container);
            this._unitSelector.html(this._units[0].title);
            this._drawUnits();
            this._unitSelector.click(function () {
               self.togglePicker();
            });
            $('.controls-UnitEditor__unit', this._picker._container).click(function (e) {
               self._setUnit($(e.target).attr('data-key'));
               self.hidePicker();
            });
         },

         //Установить еденицу измерения по Id
         _setUnit: function (rowId) {
            var self = this;
            switch (rowId) {
               case '0':
               case '1':
                  self._unitSelector.html(self._units[rowId].title);
                  self.setText('100');
                  break;
               case '2':
                  self._unitSelector.html('-');
                  self.setText(self._units[rowId].title);
                  break;
               default :
                  self._unitSelector.html(self._units[0].title);
                  self.setText('100');
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
