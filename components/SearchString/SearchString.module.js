define('js!SBIS3.CONTROLS.SearchString', ['js!SBIS3.CORE.Control'], function (CompoundControl) {

   'use strict';

   /**
    * Cтрока поиска, поле ввода + кнопка поиска.
    * @class SBIS3.CONTROLS.SearchString
    * @extends $ws.proto.Control
    * @public
    * @control
    * @demo SBIS3.Demo.Control.MySearchString
    * @author Крайнов Дмитрий Олегович
    */

   var SearchString = Control.Control.extend(/** @lends SBIS3.CONTROLS.SearchString.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {String} Текст на кнопке поиска
             * @example
             * <pre>
             *     <option name="btnCaption">Найти</option>
             * </pre>
             */
            btnCaption: '',
            /**
             * @cfg {String} Подсказка в поле ввода
             * @example
             * <pre>
             *     <option name="placeholder">Введите ФИО полностью</option>
             * </pre>
             */
            placeholder: '',
            /**
             * @cfg {Number} При каком колчистве символов начинать поиск
             * @example
             * <pre>
             *     <option name="countStart">5</option>
             * </pre>
             * @see apply
             * @see reset
             */
            countStart: null
         }
      },

      $constructor: function () {

      },

      /**
       * Начать поиск с тем текстом, что введен
       * @see reset
       * @see countStart
       */
      apply: function() {

      },

      /**
       * Сбросить поиск
       * @see apply
       */
      reset: function(){

      }

   });

   return SearchString;

});