define('Controls/Input/Money',
   [
      'Controls/Input/Base',
      'Controls/Input/Money/ViewModel',

      'wml!Controls/Input/Money/ReadOnly'
   ],
   function(Base, ViewModel, readOnlyFieldTemplate) {
      'use strict';

      /**
       * Input for entering currency.
       *
       * @class Controls/Input/Money
       * @mixes Controls/Input/interface/IInputField
       * @mixes Controls/Input/interface/IValidation
       * @mixes Controls/Input/interface/IInputTag
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

      var Money = Base.extend({
         _initProperties: function() {
            Money.superclass._initProperties.apply(this, arguments);

            this._readOnlyField.template = readOnlyFieldTemplate;
            this._readOnlyField.scope.integerPart = _private.integerPart;
            this._readOnlyField.scope.fractionPart = _private.fractionPart;
         },

         _getViewModelOptions: function(options) {
            return {
               showEmptyDecimals: true,
               precision: _private.PRECISION,
               onlyPositive: options.onlyPositive
            };
         },

         _getViewModelConstructor: function() {
            return ViewModel;
         }
      });

      Money._theme.push('Controls/Input/Money/Money');

      return Money;
   });
