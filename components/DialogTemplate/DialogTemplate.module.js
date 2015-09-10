/**
 * Created by iv.cheremushkin on 12.08.2014.
 */

define('js!SBIS3.CONTROLS.DialogTemplate', ['js!SBIS3.CORE.Control'], function(Control) {

   'use strict';

   /**
    * Шаблон диалога с одной областью, заголовком и крестиком. Используется для отображения диалоговых окон с крестиком и заголовком.
    * @class SBIS3.CONTROLS.DialogTemplate
    * @extends $ws.proto.Control
    * @author Крайнов Дмитрий Олегович
    */

   var DialogTemplate = Control.Control.extend( /** @lends SBIS3.CONTROLS.DialogTemplate.prototype*/ {
      $protected: {
         _options: {
            /**
             * @cfg {String}  Текст заголовка
             */
            caption: ''
         }
      },

      $constructor: function() {

      },

      /**
       * Установить заголовок
       * @param caption
       */
      setCaption: function(caption){

      }
   });

   return DialogTemplate;
   
});