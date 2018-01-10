/**
 * Created by iv.cheremushkin on 12.08.2014.
 */

define('SBIS3.CONTROLS/Tooltip', ['Lib/Control/Control'], function(Control) {

   'use strict';

   /**
    * Всплывающая подсказка.
    * @class SBIS3.CONTROLS/Tooltip
    * @extends Lib/Control/Control
    * @author Крайнов Д.О.
    */

   var Tooltip = Control.Control.extend( /** @lends SBIS3.CONTROLS/Tooltip.prototype*/ {
      $protected: {
         _options: {
            /**
             * @cfg {String}  Текст на кнопке
             * @translatable
             */
            text: ''
         }
      },

      $constructor: function() {

      }
   });

   return Tooltip;

});