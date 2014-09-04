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
         _options: {

         }
      },

      $constructor: function() {

      }

   });

   return ToggleButton;

});