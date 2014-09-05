/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.ToggleButton', ['js!SBIS3.CONTROLS.ToggleButtonBase', 'html!SBIS3.CONTROLS.ToggleButton', 'css!SBIS3.CONTROLS.Button', 'css!SBIS3.CONTROLS.ToggleButton'], function(ToggleButtonBase, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий кнопку с залипанием.
    * @class SBIS3.CONTROLS.ToggleButton
    * @extends SBIS3.CONTROLS.ToggleButtonBase
    * @control
    */

   var ToggleButton = ToggleButtonBase.extend( /** @lends SBIS3.CONTROLS.ToggleButton.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _button: null,
         _options: {

         }
      },

      $constructor: function() {
         var self = this;
         this._button = this._container;
      },

      setCaption: function(captionTxt){
         ToggleButton.superclass.setCaption.call(this, captionTxt);
         this._button.html(captionTxt || '');
      }

   });

   return ToggleButton;

});