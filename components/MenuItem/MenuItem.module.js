
define('js!SBIS3.CONTROLS.MenuItem', ['js!SBIS3.CONTROLS.ButtonBase', 'html!SBIS3.CONTROLS.MenuItem'], function(ButtonBase, dotTplFn) {

   'use strict';
   /**
    * Контрол, отображающий элемент меню. Работает только в составе группы. В джине не вытаскивается
    * @class SBIS3.CONTROLS.MenuItem
    * @public
    * @extends SBIS3.CONTROLS.ButtonBase
    * @author Крайнов Дмитрий Олегович
    */
   var MenuItem = ButtonBase.extend( /** @lends SBIS3.CONTROLS.MenuItem.prototype */ {
      _dotTplFn : dotTplFn,
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      }

   });

   return MenuItem;

});