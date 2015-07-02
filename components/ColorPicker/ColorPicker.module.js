/**
 * Created by iv.cheremushkin on 03.09.2014.
 */
define('js!SBIS3.CONTROLS.ColorPicker',
   ['js!SBIS3.CONTROLS.TextBox',
    'js!SBIS3.CONTROLS.PickerMixin',
    'html!SBIS3.CONTROLS.ColorPicker/resources/ColorSquare',
    'is!browser?js!SBIS3.CONTROLS.ColorPicker/resources/colpick',
    'is!browser?css!SBIS3.CONTROLS.ColorPicker/resources/colpick'
   ], function(TextBox, PickerMixin, ColorSquareTpl) {

   'use strict';

   /**
    * Контрол, позволяющий выбрать цвет.
    * Можно задать как шестадцатеричный код в виде текста, так и выбрать из выпадающего блока.
    * @class SBIS3.CONTROLS.ColorPicker
    * @public
    * @author Крайнов Дмитрий Олегович
    * @control
    * @extends SBIS3.CONTROLS.TextBox
    * @mixes SBIS3.CONTROLS.PickerMixin
    */

   var ColorPicker = TextBox.extend( [PickerMixin],/** @lends SBIS3.CONTROLS.ColorPicker.prototype */{
      $protected: {
         _colorBox: null,
         _byKeyUp: true,
         _wasCreated: false,
         _options: {
            afterFieldWrapper: ColorSquareTpl,
            textTransform: 'uppercase',
            maxLength: 6
         }
      },

      $constructor: function() {
         var self = this;
         self.getContainer().addClass('controls-ColorPicker');
         self._colorBox = $('.js-controls-ColorPicker__currentColor', this.getContainer().get(0));
         self._colorBox.css('background', '#' + self._options.text || '000000');
         self._colorBox.bind('click', function () {
            if (self.isEnabled()) {
               if (self._options.text) {
                  self.togglePicker(self._options.text);
               } else {
                  self.togglePicker('000000');
               }
            }
         });
      },

      setMaxLength: function(){

      },

      setText: function(text){
         ColorPicker.superclass.setText.call(this, text);
         this._colorBox.css('background','#' + text || '000000');
         if (this._picker) {
            this._picker.getContainer().colpickSetColor(this.getText());
         }
      },

      _initializePicker: function(color){
         var self = this;
         ColorPicker.superclass._initializePicker.call(self);
         if (!self._wasCreated) {
            self._picker.getContainer().colpick({
               flat: true,
               layout: 'hex',
               color: color,
               onSubmit: function (col, hex) {
                  self.hidePicker();
                  ColorPicker.superclass.setText.call(self, hex);
                  self._colorBox.css('background', '#' + hex);
               },
               onChange: function (hsb, hex) {
                  self._colorBox.css('background', '#' + hex);
                  if (!self._byKeyUp) {
                     ColorPicker.superclass.setText.call(self, hex);
                  }
                  self._byKeyUp = false;
               }
            });
            self._wasCreated = true;
         }
      },

      _keyUpBind: function(){
         var self = this;
         self._byKeyUp = true;
         ColorPicker.superclass._keyUpBind.call(self);
         if(!self._picker){
            self._initializePicker(self.getText());
            return;
         }
         self._picker.getContainer().colpickSetColor(self.getText());
      }

   });

   return ColorPicker;

});