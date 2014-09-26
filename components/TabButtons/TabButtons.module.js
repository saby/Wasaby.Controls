/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.TabButtons', ['js!SBIS3.CONTROLS.RadioGroupBase', 'js!SBIS3.CONTROLS.TabButton'], function(RadioGroupBase, TabButton) {

   'use strict';

   /**
    * Контрол, отображающий корешки закладок
    * @class SBIS3.CONTROLS.TabButtons
    * @extends SBIS3.CONTROLS.RadioGroupBase
    * @control
    * @category Containers
    */

   var TabButtons = RadioGroupBase.extend( /** @lends SBIS3.CONTROLS.TabButtons.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      },
      _createInstance : function(item, insContainer) {
         return new TabButton({
            caption : item.title,
            checked : false,
            element : insContainer,
            parent: this
         });
      }
   });

   return TabButtons;

});