/**
 * Created by iv.cheremushkin on 12.08.2014.
 */

define('js!SBIS3.Engine.FloatAreaTemplateOnline', ['js!SBIS3.CONTROLS.DialogTemplate'], function(DialogTemplate) {

   'use strict';

   /**
    * Шаблон плавающей панели с 2 областями, заголовком и крестиком.
    * Используется для отображения плавающих панелей с крестиком и заголовком в макетах online.sbis.ru
    * @class SBIS3.Engine.FloatAreaTemplateOnline
    * @extends SBIS3.CONTROLS.DialogTemplate
    * @control
    * @author Крайнов Дмитрий Олегович
    */

   var FloatAreaTemplateOnline = DialogTemplate.extend( /** @lends SBIS3.Engine.FloatAreaTemplateOnline.prototype*/ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      }
   });

   return FloatAreaTemplateOnline;

});