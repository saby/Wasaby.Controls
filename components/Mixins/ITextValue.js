/* global define */
define('SBIS3.CONTROLS/Mixins/ITextValue', [], function () {
   'use strict';

   /**
    * Интерфейс контрола, который может отдавать выбранное в нем значение в виде текста
    * @mixin SBIS3.CONTROLS/Mixins/ITextValue
    * @public
    * @author Крайнов Д.О.
    */

   var ITextValue = /** @lends SBIS3.CONTROLS/Mixins/ITextValue.prototype */{
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
