define('js!SBIS3.CONTROLS.SearchString', ['js!SBIS3.CORE.Control'], function (CompoundControl) {

   'use strict';

   /**
    * Cтрока поиска, поле ввода + кнопка поиска
    * @class SBIS3.CONTROLS.SearchString
    * @extends SBIS3.CORE.Control
    * @control
    * @category Inputs
    */

   var SearchString = Control.Control.extend(/** @lends SBIS3.CONTROLS.SearchString.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {String} Текст на кнопке поиска
             */
            btnCaption: '',
            /**
             * @cfg {String} Подсказка в поле ввода
             */
            placeholder: '',
            /**
             * @cfg {Number} При каком колчистве символов начинать поиск
             */
            countStart: null
         }
      },

      $constructor: function () {

      },

      /**
       * Начать поиск с тем текстом, что введен
       */
      apply: function() {

      },

      /**
       * Сбросить поиск
       */
      reset: function(){

      }

   });

   return SearchString;

});