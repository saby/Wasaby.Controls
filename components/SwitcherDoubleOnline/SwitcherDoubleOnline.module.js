/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.Engine.SwitcherDoubleOnline', ['js!SBIS3.CONTROLS.SwitcherBase'], function(SwitcherBase) {

   'use strict';
   /**
    * Класс определяет отображение двухпозиционного переключателя для поддержания макетов online.sbis.ru
    * @class SBIS3.Engine.SwitcherDoubleOnline
    * @extends SBIS3.CONTROLS.SwitcherBase
    * @mixes SBIS3.CONTROLS._FormWidgetMixin
    * @control
    */
   var SwitcherDoubleOnline = SwitcherBase.extend( /** @lends SBIS3.Engine.SwitcherDoubleOnline.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      }
   });

   return SwitcherDoubleOnline;

});