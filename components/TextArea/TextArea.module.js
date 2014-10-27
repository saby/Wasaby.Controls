define('js!SBIS3.CONTROLS.TextArea', ['js!SBIS3.CONTROLS.TextBoxBase', 'html!SBIS3.CONTROLS.TextArea', 'is!browser?js!SBIS3.CORE.FieldText/resources/Autosize-plugin'], function(TextBoxBase, dotTplFn) {

   'use strict';

   /**
    * Класс, определяющий многострочное поле ввода с возможностью задать количество строк, столбцов, включить авторесайз
    * @class SBIS3.CONTROLS.TextArea
    * @extends SBIS3.CONTROLS.TextBoxBase
    */

   var TextArea = TextBoxBase.extend( /** @lends SBIS3.CONTROLS.TextArea.prototype */ {
      $protected: {
         _dotTplFn: dotTplFn,
         _inputField: null,
         _options: {
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
         this._inputField = $('.controls-TextArea__inputField', this._container);
         if (this._options.autoResize) {
            this._inputField.autosize();
         }
      }

   });

   return TextArea;

});