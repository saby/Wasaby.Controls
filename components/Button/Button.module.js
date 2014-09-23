/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.Button', ['js!SBIS3.CONTROLS.ButtonBase', 'html!SBIS3.CONTROLS.Button'], function(ButtonBase, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий обычную кнопку
    * @class SBIS3.CONTROLS.Button
    * @extends SBIS3.CONTROLS.ButtonBase
    * @control
    */

   var Button = ButtonBase.extend( /** @lends SBIS3.CONTROLS.Button.prototype */ {
      _dotTplFn : dotTplFn,
      $protected: {
         _button: null,
         _options: {

         }
      },

      $constructor: function() {
         var self = this;
         this._button = this._container;
         this._container.mouseup(function () {
            self._container.removeClass('controls-Button__active');
         }).mousedown(function () {
               self._container.addClass('controls-Button__active');
            });
      },

      setCaption: function(captionTxt){
         Button.superclass.setCaption.call(this, captionTxt);
         this._button.html(captionTxt || '');
      }

   });

   return Button;

});