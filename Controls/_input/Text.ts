import Env = require('Env/Env');
import Base = require('Controls/_input/Base');
import entity = require('Types/entity');
import ViewModel = require('Controls/_input/Text/ViewModel');
      

      /**
       * Controls that allows user to enter single-line text.
       * <a href="/materials/demo-ws4-input">Demo examples.</a>.
       *
       * @class Controls/_input/Text
       * @extends Controls/_input/Base
       *
       * @mixes Controls/Input/interface/IInputText
       * @mixes Controls/Input/interface/IInputBase
       *
       * @public
       * @demo Controls-demo/Input/Text/TextPG
       *
       * @author Журавлев М.С.
       */

      var _private = {
         validateConstraint: function(constraint) {
            if (constraint && !/^\[.+?\]$/.test(constraint)) {
               Env.IoC.resolve('ILogger').error('Controls/_input/Text', 'The constraint options are not set correctly. More on https://wi.sbis.ru/docs/js/Controls/_input/Text/options/constraint/');
               return false;
            }

            return true;
         }
      };

      var Text = Base.extend({
         _getViewModelOptions: function(options) {
            return {
               maxLength: options.maxLength,
               constraint: options.constraint
            };
         },

         _getViewModelConstructor: function() {
            return ViewModel;
         },

         _changeHandler: function() {
            if (this._options.trim) {
               var trimmedValue = this._viewModel.displayValue.trim();

               if (trimmedValue !== this._viewModel.displayValue) {
                  this._viewModel.displayValue = trimmedValue;
                  this._notifyValueChanged();
               }
            }

            Text.superclass._changeHandler.apply(this, arguments);
         },

         _beforeMount: function(options) {
            Text.superclass._beforeMount.apply(this, arguments);

            _private.validateConstraint(options.constraint);
         },

         _beforeUpdate: function(newOptions) {
            Text.superclass._beforeUpdate.apply(this, arguments);

            if (this._options.constraint !== newOptions.constraint) {
               _private.validateConstraint(newOptions.constraint);
            }
         }
      });

      Text.getDefaultOptions = function() {
         var defaultOptions = Base.getDefaultOptions();

         defaultOptions.value = '';
         defaultOptions.trim = false;

         return defaultOptions;
      };

      Text.getOptionTypes = function() {
         var optionTypes = Base.getOptionTypes();

         /**
          * https://online.sbis.ru/opendoc.html?guid=00ca0ce3-d18f-4ceb-b98a-20a5dae21421
          * optionTypes.maxLength = descriptor(Number|null);
          */
         optionTypes.trim = entity.descriptor(Boolean);
         optionTypes.constraint = entity.descriptor(String);

         return optionTypes;
      };

      export = Text;
   
