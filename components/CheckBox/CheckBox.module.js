/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.CheckBox', ['js!SBIS3.CONTROLS.ToggleButtonBase', 'html!SBIS3.CONTROLS.CheckBox'], function(ToggleButtonBase, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий стандартный чекбокс.
    * @class SBIS3.CONTROLS.CheckBox
    * @extends SBIS3.CONTROLS.ToggleButtonBase
    * @mixes SBIS3.CONTROLS._FormWidgetMixin
    * @control
    */

   var CheckBox = ToggleButtonBase.extend( /** @lends SBIS3.CONTROLS.CheckBox.prototype */ {
      $protected: {
         _dotTplFn : dotTplFn,
         _checkBoxCaption: null,
         _options: {

         }
      },

      $constructor: function() {
         var self = this;
         this._checkBoxCaption = $('.js-controls-CheckBox__caption', self._container);
      },

      setCaption: function(captionTxt){
         CheckBox.superclass.setCaption.call(this,captionTxt);
         this._checkBoxCaption.html(captionTxt || '');
      }

   });

   return CheckBox;

});