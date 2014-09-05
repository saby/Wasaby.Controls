/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.RadioButton', ['js!SBIS3.CONTROLS.RadioButtonBase', 'html!SBIS3.CONTROLS.RadioButton', 'css!SBIS3.CONTROLS.RadioButton'], function(RadioButtonBase,dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий стандартный радиобаттон. Работает только в составе группы. В джине не вытаскивается
    * @class SBIS3.CONTROLS.RadioButton
    * @extends SBIS3.CONTROLS.RadioButtonBase
    * @control
    */

   var RadioButton = RadioButtonBase.extend( /** @lends SBIS3.CONTROLS.RadioButton.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _radioButtonCaption: '',
         _options: {

         }
      },

      $constructor: function() {
         var self = this;
         this._radioButtonCaption = $('.controls-RadioButton__caption', self._container);
      },

      setCaption: function(captionTxt){
         RadioButton.superclass.setCaption.call(this,captionTxt);
         this._radioButtonCaption.html(captionTxt || '');
      }

   });

   return RadioButton;

});