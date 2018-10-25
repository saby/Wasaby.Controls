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
      var Money = Base.extend({
         _viewModel: ViewModel,

         _readOnlyFieldTemplate: readOnlyFieldTemplate,

         _getViewModelOptions: function(options) {
            return {
               showEmptyDecimals: true,
               onlyPositive: options.onlyPositive
            };
         }
      });

      return Money;
   }
);
