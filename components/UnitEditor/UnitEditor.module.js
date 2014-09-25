/**
 * Created by iv.cheremushkin on 25.09.2014.
 */

define('js!SBIS3.CONTROLS.UnitEditor', ['js!SBIS3.CONTROLS.NumberTextBox', 'html!SBIS3.CONTROLS.UnitEditor'], function (NumberTextBox, dotTplFn) {

   'use strict';
   /**
    * Поле ввода, куда можно вводить только числовые значения
    * @class SBIS3.CONTROLS.UnitEditor
    * @extends SBIS3.CONTROLS.NumberTextBox
    * @control
    */

   var UnitEditor;
   UnitEditor = NumberTextBox.extend(/** @lends SBIS3.CONTROLS.UnitEditor.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {

         }
      },

      $constructor: function () {

      }

   });

   return UnitEditor;

});
