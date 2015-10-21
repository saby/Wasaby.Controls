/**
 * Created by iv.cheremushkin on 25.09.2014.
 */

define('js!SBIS3.CONTROLS.UnitEditor',
     ['js!SBIS3.CONTROLS.NumberTextBox',
      'js!SBIS3.CONTROLS.PickerMixin',
      'js!SBIS3.CONTROLS.FloatArea',
      'html!SBIS3.CONTROLS.UnitEditor'], function (NumberTextBox, PickerMixin, FloatArea, dotTplFn) {

      'use strict';

      /**
       * Редактор с поддержкой единиц измерения.
       * Можно устанавливать значения вида 96px/50%/auto
       * @class SBIS3.CONTROLS.UnitEditor
       * @extends SBIS3.CONTROLS.NumberTextBox
       * @mixes SBIS3.CONTROLS.PickerMixin
       * @control
       * @author Крайнов Дмитрий Олегович
       * @public
       */

      var UnitEditor;
      UnitEditor = NumberTextBox.extend([PickerMixin], /** @lends SBIS3.CONTROLS.UnitEditor.prototype */ {
         $protected: {
            _currentUnit: null,
            _units: ['px','%','-'],
            _unitSelector: null,
            _unitText: null,
            _options: {
               afterFieldWrapper: dotTplFn
            }
         },

         $constructor: function () {
            var self = this;

            this._unitSelector = $('.js-controls-UnitEditor__unitSelector', this._container);
            this._unitText = $('.js-controls-UnitEditor__unitText', this._container);
            this._currentUnit = this._units[0];
            this._unitText.html(this._currentUnit);
            this._container.addClass('controls-UnitEditor');
            //Устанавливаем нормальное значение если текст передан в опции
            if (this._options.text){
               this._currentUnit = this._parseUnit(this._options.text)[1];
               this._options.text = this._parseUnit(this._options.text)[0];
               if (this._options.text == 'auto'){
                  this._inputField.attr('value', 'auto');
               } else {
                  this._inputField.attr('value', this._options.text);
               }
               this._setUnit(this._currentUnit);
            }

            this._unitSelector.click(function () {
               self._unitSelector.toggleClass('controls-UnitEditor__unitSelector__toggled controls-UnitEditor__unitSelector__untoggled');
               self.togglePicker();
            });

            this._unitSelector.bind('mousedown',function () {
               return false;
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
            if (p[1] == '-'){
               UnitEditor.superclass.setText.call(this,'auto');
               this._inputField.attr('readonly','readonly');
               this._options.text = 100;
            } else {
               this._inputField.removeAttr('readonly');
               UnitEditor.superclass.setText.call(this,p[0]);
            }
            this._setUnit(p[1]);
         },

         _arrowUpClick: function(){
            this.setText(this._getSibling(parseFloat(this.getText()),-1)+ this._currentUnit);
         },

         _arrowDownClick: function(){
            this.setText(this._getSibling(parseFloat(this.getText()),1)+ this._currentUnit);
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
            this._unitText.html(unit);
            this._currentUnit = unit;
         },

         _setPickerContent: function () {
            var self = this;
            for (var i = 0; i < 3; i++) {
               this._picker.getContainer().append('<div class="controls-UnitEditor__unit">' + this._units[i] + '</div>');
            }
            this._picker.getContainer().append($('<div class="controls-UnitEditor__whiteBorder"></div>'));
            this._picker.getContainer().addClass('controls-UnitEditor__units');

            $('.controls-UnitEditor__unit', this._picker._container).click(function (e) {
               self.setText(self._options.text + $(e.target).html());
               self.hidePicker();   
            });
         },

         _createPicker: function(pickerContainer){
            var self = this;
            var picker = new FloatArea({
               visible: false,
               element : pickerContainer,
               target : this._container,
               corner: 'br',
               verticalAlign: {
                  side: 'top',
                  offset: -2
               },
               horizontalAlign: {
                  side: 'right',
                  offset: -16
               },
               closeByExternalClick: true
            });
            picker.subscribe('onClose',function(){
               if (self._unitSelector.hasClass('controls-UnitEditor__unitSelector__toggled')){
                  self._unitSelector.toggleClass('controls-UnitEditor__unitSelector__toggled controls-UnitEditor__unitSelector__untoggled');
               }
            });
            return picker;
         }

      });

      return UnitEditor;

   });
