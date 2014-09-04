/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CORE.Button', ['js!SBIS3.CORE.ButtonBase', 'html!SBIS3.CORE.Button', 'css!SBIS3.CORE.Button'], function(ButtonBase, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий обычную кнопку
    * @class SBIS3.CORE.Button
    * @extends SBIS3.CORE.ButtonBase
    * @control
    */

   var Button = ButtonBase.extend( /** @lends SBIS3.CORE.Button.prototype */ {
      _dotTplFn : dotTplFn,
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      }
   });

   return Button;

});