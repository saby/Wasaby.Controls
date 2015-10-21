/**
 * Created by iv.cheremushkin on 12.08.2014.
 */

define('js!SBIS3.Engine.DialogTemplateOnline', ['js!SBIS3.CONTROLS.DialogTemplate'], function(DialogTemplate) {

   'use strict';

   /**
    * Шаблон диалога с 2 областями, заголовком и крестиком.
    * Используется для отображения диалоговых окон с крестиком и заголовком в макетах online.sbis.ru
    * @class SBIS3.Engine.DialogTemplateOnline
    * @extends SBIS3.CONTROLS.DialogTemplate
    * @control
    * @author Крайнов Дмитрий Олегович
    */

   var DialogTemplateOnline = DialogTemplate.extend( /** @lends SBIS3.Engine.DialogTemplateOnline.prototype*/ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      }
   });

   return DialogTemplateOnline;

});