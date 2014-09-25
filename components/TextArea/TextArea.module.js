define('js!SBIS3.CONTROLS.TextArea', ['js!SBIS3.CONTROLS.TextBoxBase'], function(TextBoxBase) {

   'use strict';

   /**
    * Класс, определяющий многострочное поле ввода с возможностью задать количество строк, столбцов, включить авторесайз
    * @class SBIS3.CONTROLS.TextArea
    * @extends SBIS3.CONTROLS.TextBoxBase
    * @control
    */

   var TextArea = TextBoxBase.extend( /** @lends SBIS3.CONTROLS.TextArea.prototype */ {
      $protected: {
         _options: {
            /**
             * @cfg {Number} Количество столбцов
             */
            cols: null,
            /**
             * @cfg {Number} Количество строк
             */
            rows: null,
            /**
             * @cfg {Boolean} авторесайз по высоте, если текст не помещается
             */
            autoResize: false
         }
      },

      $constructor: function() {

      }

   });

   return TextArea;

});