/**
 * Created by iv.cheremushkin on 03.09.2014.
 */
define('js!SBIS3.CONTROLS.ColorPicker',
   ['js!SBIS3.CONTROLS.TextBox',
    'js!SBIS3.CONTROLS._PickerMixin',
    'html!SBIS3.CONTROLS.ColorPicker',
    'css!SBIS3.CONTROLS.ColorPicker',
    'js!SBIS3.CONTROLS.ColorPicker/resources/colpick',
    'css!SBIS3.CONTROLS.ColorPicker/resources/colpick'
   ], function(TextBox, _PickerMixin, dotTpl) {

   'use strict';

   /**
    * Контрол, позволяющий выбрать цвет. Можно задать как шестадцатеричный код в виде текста, так и выбрать из выпадающего блока
    * @class SBIS3.CONTROLS.ColorPicker
    * @extends SBIS3.CONTROLS.TextBox
    * @mixes SBIS3.CONTROLS._PickerMixin
    * @control
    */

   var ColorPicker = TextBox.extend( [_PickerMixin],/** @lends SBIS3.CONTROLS.ColorPicker.prototype */{
      _dotTplFn : dotTpl,
      $protected: {
         _colorBox: null,
         _byKeyUp: true,
         _wasCreated: false,
         _options: {

         }
      },

      $constructor: function() {
         var self = this;
         self._colorBox = $('.js-controls-ColorPicker__currentColor', this.getContainer().get(0));
         self._colorBox.bind('click',function(){
            self.togglePicker();
         });
      },

      setMaxLength: function(){

      },

      setText: function(text){
         var self = this;
         ColorPicker.superclass.setText.call(this,text);
         self._colorBox.css('background','#' + text);
         self._picker.getContainer().colpickSetColor(self.getText());
      },

      togglePicker: function() {
         var self = this;
         if (!self._wasCreated){
            self._createColpick();
            self._wasCreated = true;
         }
         ColorPicker.superclass.togglePicker.call(this);
      },

      _createColpick: function(){
         var self = this;
         self._picker.getContainer().colpick({
            flat:true,
            layout:'hex',
            color: '000000',
            onSubmit:function(col,hex) {
               self.hidePicker();
               ColorPicker.superclass.setText.call(self,hex);
               self._colorBox.css('background','#' + hex);
            },
            onChange:function(hsb,hex) {
               self._colorBox.css('background','#' + hex);
               if(!self._byKeyUp) {
                  ColorPicker.superclass.setText.call(self,hex);
               }
               self._byKeyUp = false;
            }
         });
      },

      _keyUpBind: function(){
         var self = this;
         if (!self._wasCreated){
            self._createColpick();
            self._wasCreated = true;
         }
         self._byKeyUp = true;
         ColorPicker.superclass._keyUpBind.call(self);
         self._picker.getContainer().colpickSetColor(self.getText());
      }

   });

   return ColorPicker;

});