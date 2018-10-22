define('Controls/Input/Money',
   [
      'Controls/Input/Base',
      'Controls/Input/Money/ViewModel'
   ],
   function(Base, ViewModel) {

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

         _getViewModelOptions: function(options) {
            return {
               onlyPositive: options.onlyPositive
            };
         }
      });

      return Money;
   }
);
