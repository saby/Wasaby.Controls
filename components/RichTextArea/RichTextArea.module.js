define('js!SBIS3.CONTROLS.RichTextArea', ['js!SBIS3.CONTROLS.TextArea'], function(TextArea) {

   'use strict';
   /**
    * Класс, определяющий многострочное поле с редактором в виде CKEditor
    * @class SBIS3.CONTROLS.RichTextArea
    * @extends SBIS3.CONTROLS.TextArea
    * @author Крайнов Дмитрий Олегович
    */

   var RichTextArea = TextArea.extend( /** @lends SBIS3.CONTROLS.RichTextArea.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      }

   });

   return RichTextArea;

});