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
    * @mixes SBIS3.CONTROLS._FormWidgetMixin
    */

   var RadioGroup = RadioGroupBase.extend( /** @lends SBIS3.CONTROLS.RadioGroup.prototype */ {
      _dotTplFn : dotTpl,
      $protected: {
         _options: {
            disposition: 'vertical'
         }
      },

      _getItemClass : function() {
         return 'js!SBIS3.CONTROLS.RadioButton';
      }
   });

   return RadioGroup;

});