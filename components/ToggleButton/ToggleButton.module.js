/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.ToggleButton', ['js!SBIS3.CONTROLS.ToggleButtonBase', 'html!SBIS3.CONTROLS.ToggleButton'], function(ToggleButtonBase, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий кнопку с залипанием.
    * @class SBIS3.CONTROLS.ToggleButton
    * @extends SBIS3.CONTROLS.ToggleButtonBase
    * @control
    * @public
    * @category Buttons
    */

   var ToggleButton = ToggleButtonBase.extend( /** @lends SBIS3.CONTROLS.ToggleButton.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {

         }
      },

      $constructor: function() {
         var self = this;
         this._buttonText = $('.js-controls-Button__text', this._container.get(0));
         this._container.mouseup(function () {
            self._container.removeClass('controls-Button__active');
         }).mousedown(function () {
               self._container.addClass('controls-Button__active');
            });

      },

      setCaption: function(captionTxt){
         ToggleButton.superclass.setCaption.call(this, captionTxt);
         this._buttonText.text(captionTxt || '');
      }

   });

   return ToggleButton;

});