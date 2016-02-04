/* global define */
define('js!SBIS3.CONTROLS.ITextValue', [], function () {
   'use strict';

   /**
    * Интерфейс контрола, который может отдавать выбранное в нем значение в виде текста
    * @mixin SBIS3.CONTROLS.ITextValue
    * @public
    * @author Крайнов Дмитрий
    */

   var ITextValue = /** @lends SBIS3.CONTROLS.ITextValue */{
      /**
       * Возвращает текстовое значение контрола
       * @returns {String}
       */
      getTextValue: function () {
         throw new Error('Method must be implemented');
      }
   };

   return ITextValue;
});
