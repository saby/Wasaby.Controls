/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.Engine.MessageBox', ['js!SBIS3.Engine.DialogTemplateOnline'], function(DialogTemplateOnline) {

   'use strict';

   /**
    * Диалоги в виде сообщения и вопроса с ответами да/нет
    * @class SBIS3.Engine.MessageBox
    * @extends SBIS3.Engine.DialogTemplateOnline
    * @control
    * @author Крайнов Дмитрий Олегович
    */

   var MessageBox = DialogTemplateOnline.extend( /** @lends SBIS3.Engine.MessageBox.prototype*/ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      }
   });

   return MessageBox;

});