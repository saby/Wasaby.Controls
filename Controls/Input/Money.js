define('Controls/Input/Money',
   [
      'Controls/Input/Base',
      'Controls/Input/Money/ViewModel',

      'wml!Controls/Input/Money/ReadOnly',

      'css!Controls/Input/Money/Money'
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
         precision: 2,

         integerPath: function(value) {
            return value.slice(0, -_private.precision);
         },

         fractionPath: function(value) {
            return value.slice(-_private.precision);
         }
      };
      
      var Money = Base.extend({
         _viewModel: ViewModel,

         _readOnlyField: {
            template: readOnlyFieldTemplate
         },

         _beforeMount: function() {
            Money.superclass._beforeMount.apply(this, arguments);

            this._readOnlyField.scope.integerPath = _private.integerPath;
            this._readOnlyField.scope.fractionPath = _private.fractionPath;
         },

         _getViewModelOptions: function(options) {
            return {
               showEmptyDecimals: true,
               precision: _private.precision,
               onlyPositive: options.onlyPositive
            };
         }
      });

      return Money;
   }
);
