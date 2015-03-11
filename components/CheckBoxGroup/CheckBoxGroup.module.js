/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.CheckBoxGroup', ['js!SBIS3.CONTROLS.CheckBoxGroupBase', 'html!SBIS3.CONTROLS.CheckBoxGroup', 'js!SBIS3.CONTROLS.CheckBox'], function(CheckBoxGroupBase, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий группу чекбоксов
    * @class SBIS3.CONTROLS.CheckBoxGroup
    * @extends SBIS3.CONTROLS.CheckBoxGroupBase
    * @mixes SBIS3.CONTROLS.FormWidgetMixin
    */

   var CheckBoxGroup = CheckBoxGroupBase.extend( /** @lends SBIS3.CONTROLS.CheckBoxGroup.prototype */ {
      _dotTplFn : dotTplFn,
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      },

      _getItemTemplate : function(item) {
         var caption = item.get(this._options.captionField);
         return '<component data-component="SBIS3.CONTROLS.CheckBox">' +
                  '<option name="caption">'+caption+'</option>'+
                '</component>';
      }
   });

   return CheckBoxGroup;

});