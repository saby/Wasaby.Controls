define('Controls/Input/Money',
   [
      'Types/entity',
      'Controls/input',
      'Controls/Input/Number/ViewModel',

      'wml!Controls/Input/Money/ReadOnly'
   ],
   function(entity, input, ViewModel, readOnlyFieldTemplate) {
      'use strict';

      /**
       * Input for entering currency.
       *
       * @class Controls/Input/Money
       * @extends Controls/input:Base
       *
       * @mixes Controls/interface/IInputBase
       * @mixes Controls/interface/IOnlyPositive
       *
       * @public
       * @demo Controls-demo/Input/Money/Money
       *
       * @author Журавлев М.С.
       */
      var _private = {
         PRECISION: 2,

         integerPart: function(value) {
            return value.slice(0, -_private.PRECISION);
         },

         fractionPart: function(value) {
            return value.slice(-_private.PRECISION);
         }
      };

      var Money = input.Base.extend({
         _initProperties: function() {
            Money.superclass._initProperties.apply(this, arguments);

            this._readOnlyField.template = readOnlyFieldTemplate;
            this._readOnlyField.scope.integerPart = _private.integerPart;
            this._readOnlyField.scope.fractionPart = _private.fractionPart;
         },

         _getViewModelOptions: function(options) {
            return {
               useGrouping: true,
               showEmptyDecimals: true,
               useAdditionToMaxPrecision: true,
               precision: _private.PRECISION,
               onlyPositive: options.onlyPositive
            };
         },

         _getViewModelConstructor: function() {
            return ViewModel;
         }
      });

      Money.getDefaultOptions = function() {
         var defaultOptions = input.Base.getDefaultOptions();

         defaultOptions.onlyPositive = false;

         return defaultOptions;
      };

      Money.getOptionTypes = function() {
         var optionTypes = input.Base.getOptionTypes();

         optionTypes.onlyPositive = entity.descriptor(Boolean);

         return optionTypes;
      };

      Money._theme.push('Controls/Input/Money/Money');

      return Money;
   });
