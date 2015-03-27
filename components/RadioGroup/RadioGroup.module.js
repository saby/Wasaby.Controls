/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.RadioGroup', ['js!SBIS3.CONTROLS.RadioGroupBase','html!SBIS3.CONTROLS.RadioGroup', 'js!SBIS3.CONTROLS.RadioButton'],
function(RadioGroupBase, dotTpl) {

   'use strict';

   /**
    * Контрол задающий оформление выбора одного из нескольких значений в виде классических радиокнопок
    * @class SBIS3.CONTROLS.RadioGroup
    * @extends SBIS3.CONTROLS.RadioGroupBase
    * @mixes SBIS3.CONTROLS.FormWidgetMixin
    * @control
    * @public
    * @initial
    * <component data-component='SBIS3.CONTROLS.RadioGroup'>
    *    <option name="captionField">title</option>
    *    <option name="keyField">id</option>
    *    <options name="items" type="array">
    *       <options>
    *          <option name="id">1</option>
    *          <option name="title">RadioButton 1</option>
    *       </options>
    *       <options>
    *          <option name="id">2</option>
    *          <option name="title">RadioButton 2</option>
    *       </options>
    *    </options>
    * </component>
    */

   var RadioGroup = RadioGroupBase.extend( /** @lends SBIS3.CONTROLS.RadioGroup.prototype */ {
      _dotTplFn : dotTpl,
      $protected: {
         _options: {

         }
      },

      _getItemTemplate : function(item) {
         var caption = item.get(this._options.captionField);
         return '<component data-component="SBIS3.CONTROLS.RadioButton">' +
               '<option name="caption">'+caption+'</option>'+
            '</component>';
      }
   });

   return RadioGroup;

});