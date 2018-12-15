define('Controls/Input/Money',
   [
      'Controls/Input/Base',
      'Controls/Input/Money/ViewModel',

      'wml!Controls/Input/Money/ReadOnly',

      'css!theme?Controls/Input/Money/Money'
   ],
   function(Base, ViewModel, readOnlyFieldTemplate) {

      'use strict';

      /**
       * Input for entering currency.
       *
       * @class Controls/Input/Money
       * @mixes Controls/Input/interface/IInputText
       * @mixes Controls/Input/interface/IValidation
       * @mixes Controls/Input/interface/IInputTag
       * @control
       * @public
       * @author Журавлев М.С.
       * @category Input
       */
      var _private = {
         PRECISION: 2,

         integerPart: function(value) {
            return value.slice(0, -_private.precision);
         },

         fractionPart: function(value) {
            return value.slice(-_private.precision);
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

      return Money;
   }
);
