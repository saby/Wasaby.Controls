/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.Menu', ['js!SBIS3.CORE.Control'], function( Control ) {

   'use strict';

   /**
    * Контрол, отображающий меню всплывающее в определенном месте страницы
    * @class SBIS3.CONTROLS.Menu
    * @extends $ws.proto.Control
    * @mixes SBIS3.CONTROLS._PopupMixin
    */

   var Menu = Control.Control.extend( /** @lends SBIS3.CONTROLS.Menu.prototype */ {
      $protected: {
         _options: {
            /**
             * @cfg {Number} Задержка перед открытием
             */
            showDelay: null,
            /**
             * @cfg {Number} Задержка перед закрытием
             */
            hideDelay: null
         }
      },

      $constructor: function() {

      }

   });

   return Menu;

});