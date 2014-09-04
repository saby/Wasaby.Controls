/**
 * Created by iv.cheremushkin on 12.08.2014.
 */

define('js!SBIS3.CONTROLS.Panel', ['js!SBIS3.CORE.Control'], function(Control) {

   'use strict';

   /**
    * Контрол, которые реализует поведение “дырки”.
    * При его размещении внутри контрола, появляется область, в которой можно разместить произвольный набор других контролов.
    * @class SBIS3.CONTROLS.Panel
    * @extends SBIS3.CORE.Control
    * @control
    */

   var Panel = Control.Control.extend( /** @lends SBIS3.CONTROLS.Panel.prototype*/ {
      $protected: {
         _options: {
            /**
             * @cfg {String} xhtml разметка, задающая внутренности области
             */
            content: ''
         }
      },

      $constructor: function() {

      }
   });

   return Panel;
   
});
