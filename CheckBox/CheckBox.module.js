/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CORE.CheckBox', ['js!SBIS3.CORE.ToggleButtonBase', 'html!SBIS3.CORE.CheckBox', 'css!SBIS3.CORE.CheckBox'], function(ToggleButtonBase, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий стандартный чекбокс.
    * @class SBIS3.CORE.CheckBox
    * @extends SBIS3.CORE.ToggleButtonBase
    * @mixes SBIS3.CORE._FormWidgetMixin
    * @control
    */

   var CheckBox = ToggleButtonBase.extend( /** @lends SBIS3.CORE.CheckBox.prototype */ {
      $protected: {
         _dotTplFn : dotTplFn,
         _options: {

         }
      },

      $constructor: function() {

      }

   });

   return CheckBox;

});