/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.MenuBar', ['js!SBIS3.CORE.Control'], function( Control ) {

   'use strict';

   /**
    * Контрол, отображающий горизонтальное меню
    * @class SBIS3.CONTROLS.MenuBar
    * @extends $ws.proto.Control
    * @mixes SBIS3.CONTROLS._CollectionMixin
    */

   var MenuBar = Control.Control.extend( /** @lends SBIS3.CONTROLS.MenuBar.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      }

   });

   return MenuBar;

});