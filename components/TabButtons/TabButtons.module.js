/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.TabButtons', ['js!SBIS3.CONTROLS.RadioGroupBase', 'js!SBIS3.CONTROLS.TabButton'], function(RadioGroupBase, TabButton) {

   'use strict';

   /**
    * Контрол, отображающий корешки закладок
    * @class SBIS3.CONTROLS.TabButtons
    * @extends SBIS3.CONTROLS.RadioGroupBase
    * @author Крайнов Дмитрий Олегович
    */

   var TabButtons = RadioGroupBase.extend( /** @lends SBIS3.CONTROLS.TabButtons.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      },

      _getItemTemplate : function() {
         return '<component data-component="SBIS3.CONTROLS.TabButton">' +
            '<option name="caption">{{=it.item.get("title")}}</option>'+
            '</component>';
      }
   });

   return TabButtons;

});