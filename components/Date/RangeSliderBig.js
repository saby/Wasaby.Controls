/*global define*/
define('SBIS3.CONTROLS/Date/RangeSliderBig', [
   'Core/helpers/Object/isEmpty',
   'SBIS3.CONTROLS/Date/RangeSliderBase',
   'SBIS3.CONTROLS/Date/RangeBigChoose/resources/Utils',
   'SBIS3.CONTROLS/Mixins/DateRangeBigChoosePickerMixin',
   'SBIS3.CONTROLS/Mixins/RangeSelectableViewMixin',
   'SBIS3.CONTROLS/Utils/ControlsValidators',
   'css!SBIS3.CONTROLS/Date/RangeSliderBig/RangeSliderBig'
], function (isEmpty, DateRangeSliderBase, rangeBigChooseUtils, DateRangeBigChoosePickerMixin, RangeSelectableViewMixin, ControlsValidators) {
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
    * @demo Examples/DateRangeSliderBig/MyDateRangeSliderBig/MyDateRangeSliderBig
    */
   var DateRangeSliderBig = DateRangeSliderBase.extend([DateRangeBigChoosePickerMixin], /** @lends SBIS3.CONTROLS/Date/RangeSliderBig.prototype */{
      $protected: {
         _options: {

            // Достаточно одной опции emptyCaption. Но если так делать, то надо немного менять api.
            // Либо делать что бы одни и те же опции в разных компонентах работали немного по разному.
            // В новых компонентах надо учесть этот нюанс, в старых что то менять нет смысла.
            /**
             * @cfg {Boolean} Отображать ли текстовую информацию о том, что период не задан. Если равна true и период
             * не указан, то в качестве значения будет от бражаться соответсвующая надпись, иначе пустая строка.
             * @see emptyCaption
             */
            showUndefined: false
         }
      },
      _modifyOptions: function (opts) {
         opts = DateRangeSliderBig.superclass._modifyOptions.apply(this, arguments);
         opts._caption = this._getCaption(opts);
         if (isEmpty(opts.quantum) && opts.selectionType === RangeSelectableViewMixin.selectionTypes.single) {
            opts.quantum.days = [1];
         }
         return opts;
      },

      _setPickerConfig: function() {
         var config = DateRangeSliderBig.superclass._setPickerConfig.apply(this, arguments),
            cssClass = 'controls-DateRangeSliderBig__picker';

         cssClass += this._options.showPrevArrow ? '-withPrevButton' : '-withoutPrevButton';
         cssClass += rangeBigChooseUtils.isStateButtonDisplayed(this._options) ? '-withStateButton' : '-withoutStateButton';

         config.className = cssClass;
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
