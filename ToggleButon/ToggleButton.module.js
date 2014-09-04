/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CORE.ToggleButton', ['js!SBIS3.CORE.ToggleButtonBase', 'html!SBIS3.CORE.ToggleButton', 'css!SBIS3.CORE.Button', 'css!SBIS3.CORE.ToggleButton'], function(ToggleButtonBase, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий кнопку с залипанием.
    * @class SBIS3.CORE.ToggleButton
    * @extends SBIS3.CORE.ToggleButtonBase
    * @control
    */

   var ToggleButton = ToggleButtonBase.extend( /** @lends SBIS3.CORE.ToggleButton.prototype */ {
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