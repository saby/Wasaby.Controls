/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.CheckBox', ['js!SBIS3.CONTROLS.ToggleButtonBase', 'html!SBIS3.CONTROLS.CheckBox', 'css!SBIS3.CONTROLS.CheckBox'], function(ToggleButtonBase, dotTplFn) {

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
         _options: {

         }
      },

      $constructor: function() {

      }

   });

   return CheckBox;

});