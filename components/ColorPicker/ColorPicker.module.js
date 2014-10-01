/**
 * Created by iv.cheremushkin on 03.09.2014.
 */
define('js!SBIS3.CONTROLS.ColorPicker',
   ['js!SBIS3.CONTROLS.TextBox',
    'js!SBIS3.CONTROLS._PickerMixin',
    'html!SBIS3.CONTROLS.ColorPicker/resources/ColorSquare',
    'js!SBIS3.CONTROLS.ColorPicker/resources/colpick',
    'css!SBIS3.CONTROLS.ColorPicker/resources/colpick'
   ], function(TextBox, _PickerMixin, ColorSquareTpl) {

   'use strict';

   /**
    * Контрол, позволяющий выбрать цвет. Можно задать как шестадцатеричный код в виде текста, так и выбрать из выпадающего блока
    * @class SBIS3.CONTROLS.ColorPicker
    * @extends SBIS3.CONTROLS.TextBox
    * @mixes SBIS3.CONTROLS._PickerMixin
    */

   var ColorPicker = TextBox.extend( [_PickerMixin],/** @lends SBIS3.CONTROLS.ColorPicker.prototype */{
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
         self._colorBox.bind('click',function(){
            if (self._options.text) {
               self.togglePicker(self._options.text);
            } else {
               self.togglePicker('000000');
            }
         });
      },

      setMaxLength: function(){

      },

      setText: function(text){
         var self = this;
         ColorPicker.superclass.setText.call(this,text);
         self._colorBox.css('background','#' + text || '000000');
         self._picker.getContainer().colpickSetColor(self.getText());
      },

      togglePicker: function(color) {
         var self = this;
         self._createColpick(color);
         ColorPicker.superclass.togglePicker.call(this);
      },

      _createColpick: function(color){
         var self = this;
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
         self._createColpick();
         self._byKeyUp = true;
         ColorPicker.superclass._keyUpBind.call(self);
         self._picker.getContainer().colpickSetColor(self.getText());
      }

   });

   return ColorPicker;

});