/**
 * Created by iv.cheremushkin on 14.08.2014.
 */

define('js!SBIS3.Engine.NavigationOnline', ['js!SBIS3.CORE.Control'], function(Control) {

   'use strict';

   /**
    * Контрол, отображающий навигационнаю панель в виде “правого аккордеона”
    * @class SBIS3.Engine.NavigationOnline
    * @extends SBIS3.CORE.Control
    * @control
    */

   var NavigationOnline = Control.Control.extend(/** @lends SBIS3.Engine.NavigationOnline.prototype */{
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      }
   });

   return NavigationOnline;

});