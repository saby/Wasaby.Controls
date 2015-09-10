/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.Engine.ConfirmBox', ['js!SBIS3.Engine.DialogTemplateOnline'], function(DialogTemplateOnline) {

   'use strict';

   /**
    * Диалог-оповещение с заданым шаблоном
    * @class SBIS3.Engine.ConfirmBox
    * @extends SBIS3.Engine.DialogTemplateOnline
    * @control
    * @author Крайнов Дмитрий Олегович
    */

   var ConfirmBox = DialogTemplateOnline.extend( /** @lends SBIS3.Engine.ConfirmBox.prototype*/ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      }
   });

   return ConfirmBox;

});