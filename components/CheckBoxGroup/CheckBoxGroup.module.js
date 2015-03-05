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
    * @control
    * @demo SBIS3.Demo.Control.MyCheckBoxGroup
    * @public
    * @initial
    * <component data-component='SBIS3.CONTROLS.CheckBoxGroup'>
    *    <options name="items" type="array">
    *       <options>
    *          <option name="id">1</option>
    *          option name="title">CheckBox 1</option>
    *       </options>
    *       <options>
    *          <option name="id">2</option>
    *          <option name="title">CheckBox 2</option>
    *       </options>
    *    </options>
    * </component>
    */

   var CheckBoxGroup = CheckBoxGroupBase.extend( /** @lends SBIS3.CONTROLS.CheckBoxGroup.prototype */ {
      _dotTplFn : dotTplFn,
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      },

      _getItemClass : function() {
         return 'js!SBIS3.CONTROLS.CheckBox';
      }
   });

   return CheckBoxGroup;

});