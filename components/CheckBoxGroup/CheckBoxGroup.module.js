/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.CheckBoxGroup', ['js!SBIS3.CONTROLS.CheckBoxGroupBase', 'js!SBIS3.CONTROLS.CheckBox'], function(CheckBoxGroupBase, CheckBox) {

   'use strict';

   /**
    * Контрол, отображающий группу чекбоксов
    * @class SBIS3.CONTROLS.CheckBoxGroup
    * @extends SBIS3.CONTROLS.CheckBoxGroupBase
    * @mixes SBIS3.CONTROLS._FormWidgetMixin
    * @control
    * @category Select
    */

   var CheckBoxGroup = CheckBoxGroupBase.extend( /** @lends SBIS3.CONTROLS.CheckBoxGroup.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      },

      _createInstance : function(item, insContainer) {
         insContainer.addClass('controls-ButtonGroup__item__pos-vertical');
         return new CheckBox({
            caption : item.title,
            checked : false,
            element : insContainer,
            parent: this
         });
      }

   });

   return CheckBoxGroup;

});