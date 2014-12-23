/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.MenuItem', ['js!SBIS3.CONTROLS.ButtonBase', 'html!SBIS3.CONTROLS.MenuItem'], function(RadioButtonBase, dotTplFn) {

   'use strict';
   /**
    * Контрол, отображающий корешок закладки. Работает только в составе группы. В джине не вытаскивается
    * @class SBIS3.CONTROLS.ButtonBase
    * @extends SBIS3.CONTROLS.RadioButtonBase
    */
   var MenuItem = RadioButtonBase.extend( /** @lends SBIS3.CONTROLS.MenuItem.prototype */ {
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