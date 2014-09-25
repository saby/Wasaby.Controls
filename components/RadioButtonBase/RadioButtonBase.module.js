/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.RadioButtonBase', ['js!SBIS3.CONTROLS.ToggleButtonBase'], function(ToggleButtonBase) {

   'use strict';

   /**
    * Поведенческий класс, определяющий поведение одной(!!) радиокнопки. Нельзя использовать как отдельный контрол.
    * Работает только в составе группы радиокнопок. При клике, если состояние не checked, то проставить true, иначе ничего не делать.
    * @class SBIS3.CONTROLS.RadioButtonBase
    * @extends SBIS3.CONTROLS.ToggleButtonBase
    */

   var RadioButtonBase = ToggleButtonBase.extend( /** @lends SBIS3.CONTROLS.RadioButtonBase.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      },

      _clickHandler : function() {
         if (!this._checked){
            this.setChecked(true);
         }
      }

   });

   return RadioButtonBase;

});