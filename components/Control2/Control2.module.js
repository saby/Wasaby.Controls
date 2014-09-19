/**
 * Created by iv.cheremushkin on 19.09.2014.
 */

define('js!SBIS3.CONTROLS.Control2', ['js!SBIS3.CORE.Control'], function(Control) {

   'use strict';

   /**
    * Контрол, отображающий вложенные компоненты в виде диалоговго окна
    * @class SBIS3.CONTROLS.Control2
    * @extends SBIS3.CORE.Control
    */

   var Control2 = Control.Control.extend(/** @lends SBIS3.CONTROLS.Control2.prototype*/ {
      $protected: {
         _options: {

         }
      },

      toggle: function(){
         if (this.isVisible()){
            this.hide();
         } else {
            this.show();
         }
      }

   });

   return Control2;

});