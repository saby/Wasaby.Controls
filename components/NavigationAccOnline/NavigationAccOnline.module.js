/**
 * Created by iv.cheremushkin on 14.08.2014.
 */

define('js!SBIS3.Engine.NavigationAccOnline', ['js!SBIS3.CORE.Control'], function(Control) {

   'use strict';

   /**
    * Контрол, отображающий навигационнаю панель в виде “левого аккордеона”
    * @class SBIS3.Engine.NavigationAccOnline
    * @extends $ws.proto.Control
    * @control
    * @author Крайнов Дмитрий Олегович
    * @public
    */

   var NavigationAccOnline = Control.Control.extend(/** @lends SBIS3.Engine.NavigationAccOnline.prototype */{
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      }
   });

   return NavigationAccOnline;

});