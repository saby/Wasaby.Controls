/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.RadioButtonBase', ['js!WSControls/Buttons/ButtonBase', 'js!SBIS3.CONTROLS.Checkable'], function(WSButtonBase, Checkable) {

   'use strict';

   /**
    * Поведенческий класс, определяющий поведение одной(!!) радиокнопки. Нельзя использовать как отдельный контрол.
    * Работает только в составе группы радиокнопок.
    * При клике, если состояние не checked, то проставить true, иначе ничего не делать.
    * @class SBIS3.CONTROLS.RadioButtonBase
    * @extends WSControls/Buttons/ButtonBase
    *
    * @public
    *
    * @mixes SBIS3.CONTROLS.Checkable
    *
    * @author Крайнов Дмитрий Олегович
    */

   var RadioButtonBase = WSButtonBase.extend([Checkable], /** @lends SBIS3.CONTROLS.RadioButtonBase.prototype */ {
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