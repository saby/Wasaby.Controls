/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.RadioGroup', ['js!SBIS3.CONTROLS.RadioGroupBase', 'js!SBIS3.CONTROLS.RadioButton'], function(RadioGroupBase, RadioButton) {

   'use strict';

   /**
    * Контрол задающий оформление выбора одного из нескольких значений в виде классических радиокнопок
    * @class SBIS3.CONTROLS.RadioGroup
    * @extends SBIS3.CONTROLS.RadioGroupBase
    * @mixes SBIS3.CONTROLS._FormWidgetMixin
    * @control
    * @category Select
    */

   var RadioGroup = RadioGroupBase.extend( /** @lends SBIS3.CONTROLS.RadioGroup.prototype */ {
      $protected: {
         _options: {
            disposition: 'vertical'
         }
      },
      _createInstance : function(item, insContainer) {
         if (this._options.disposition != 'horizontal') {
            insContainer.addClass('controls-ButtonGroup__item__pos-vertical')
         }
         return new RadioButton({
            caption : item.title,
            checked : false,
            element : insContainer,
            parent: this
         });
      }

   });

   return RadioGroup;

});