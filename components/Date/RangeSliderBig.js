/*global define*/
define('SBIS3.CONTROLS/Date/RangeSliderBig', [
   'SBIS3.CONTROLS/Date/RangeSliderBase',
   'SBIS3.CONTROLS/Mixins/DateRangeBigChoosePickerMixin',
   'SBIS3.CONTROLS/Utils/ControlsValidators'
], function (DateRangeSliderBase, DateRangeBigChoosePickerMixin, ControlsValidators) {
   'use strict';
   /**
    * Контрол позволяющий выбирать произвольный диапазон дат.
    * SBIS3.CONTROLS/Date/RangeSliderBig
    * @class SBIS3.CONTROLS/Date/RangeSliderBig
    * @extends SBIS3.CONTROLS/Date/RangeSliderBase
    *
    * @mixes SBIS3.CONTROLS/Mixins/DateRangeBigChoosePickerMixin
    *
    * @author Миронов А.Ю.
    *
    * @control
    * @public
    * @category Date/Time
    * @demo SBIS3.CONTROLS.Demo.MyDateRangeSliderBig
    */
   var DateRangeSliderBig = DateRangeSliderBase.extend([DateRangeBigChoosePickerMixin], /** @lends SBIS3.CONTROLS/Date/RangeSliderBig.prototype */{
      _modifyOptions: function (opts) {
         opts = DateRangeSliderBig.superclass._modifyOptions.apply(this, arguments);
         opts._caption = this._getCaption(opts);
         return opts;
      },

      _setPickerConfig: function() {
         var config = DateRangeSliderBig.superclass._setPickerConfig.apply(this, arguments);
         config.className = 'controls-DateRangeBigChoose__picker';
         return config;
      },

      _getDateRangeBigChooseConfig: function (element) {
         var config = DateRangeSliderBig.superclass._getDateRangeBigChooseConfig.apply(this, arguments),
            getValidator = function (validator) {
               return {
                  option: 'text',
                  validator: validator.validator,
                  errorMessage: validator.errorMessage,
                  params: validator.params
               };
            };
         // Пробрасываем required валидаторы полей startValue и endValue в выпадашку.
         config.startValueValidators = this._options.validators.filter(function (validator) {
            return validator.option === 'startValue' && validator.validator &&
               validator.validator === ControlsValidators.required;
         }).map(getValidator);

         config.endValueValidators = this._options.validators.filter(function (validator) {
            return validator.option === 'endValue' && validator.validator &&
               validator.validator === ControlsValidators.required;
         }).map(getValidator);
         return config;
      }
   });
   return DateRangeSliderBig;
});
