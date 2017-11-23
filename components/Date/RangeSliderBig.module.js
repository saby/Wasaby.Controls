/*global define*/
define('js!SBIS3.CONTROLS.DateRangeSliderBig', [
   'js!SBIS3.CONTROLS.DateRangeSliderBase',
   'js!SBIS3.CONTROLS.DateRangeBigChoosePickerMixin',
   'js!SBIS3.CONTROLS.ControlsValidators'
], function (DateRangeSliderBase, DateRangeBigChoosePickerMixin, ControlsValidators) {
   'use strict';
   /**
    * Контрол позволяющий выбирать произвольный диапазон дат.
    * SBIS3.CONTROLS.DateRangeSliderBig
    * @class SBIS3.CONTROLS.DateRangeSliderBig
    * @extends SBIS3.CONTROLS.DateRangeSliderBase
    *
    * @mixes SBIS3.CONTROLS.DateRangeBigChoosePickerMixin
    *
    * @author Миронов Александр Юрьевич
    *
    * @control
    * @public
    * @category Date/Time
    * @demo SBIS3.CONTROLS.Demo.MyDateRangeSliderBig
    */
   var DateRangeSliderBig = DateRangeSliderBase.extend([DateRangeBigChoosePickerMixin], /** @lends SBIS3.CONTROLS.DateRangeSliderBig.prototype */{
      _modifyOptions: function (opts) {
         opts = DateRangeSliderBig.superclass._modifyOptions.apply(this, arguments);
         opts._caption = this._getCaption(opts);
         return opts;
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
