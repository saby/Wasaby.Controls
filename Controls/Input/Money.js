define('Controls/Input/Money',
   [
      'Controls/Input/Base',
      'Controls/Input/Money/ViewModel',

      'wml!Controls/Input/Money/ReadOnly',

      'css!Controls/Input/Money/Money'
   ],
   function(Base, ViewModel, readOnlyTemplate) {

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

         _readOnlyTemplate: readOnlyTemplate,

         _getViewModelOptions: function(options) {
            return {
               onlyPositive: options.onlyPositive
            };
         }
      });

      return Money;
   }
);
