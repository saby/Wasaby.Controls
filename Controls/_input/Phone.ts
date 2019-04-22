import Base = require('Controls/_input/Base');
import ViewModel = require('Controls/_input/Phone/ViewModel');
      

      /**
       * A component for entering a phone number. Depending on the characters you enter, the phone number format changes.
       * This behavior is described in the {@link http://axure.tensor.ru/standarts/v7/%D0%BF%D0%BE%D0%BB%D0%B5_%D0%B2%D0%B2%D0%BE%D0%B4%D0%B0__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_03_.html standard}.
       * <a href="/materials/demo-ws4-input">Демо-пример</a>.
       * @remark
       * If you want the phone field without changing the format, you should use the
       * {@link Controls/_input/Mask mask) control. For example, a field to enter a mobile phone or home.
       *
       * @class Controls/_input/Phone
       * @extends Controls/_input/Base
       *
       * @mixes Controls/interface/IInputBase
       *
       * @public
       * @demo Controls-demo/Input/Phone/PhonePG
       *
       * @author Миронов А.Ю.
       */

      var _private = {
         isMoveCarriage: function(self) {
            var model = self._viewModel;
            var hasSelection = model.selection.start !== model.selection.end;

            /**
             * If we first clicked in the field, after deactivation, the user did not select anything and
             * you do not need to select a value and the mask is not completely filled,
             * then you need to move the cursor to the end.
             */
            return self._firstClick && !hasSelection && !model.isFilled() && !self._options.selectOnClick;
         }
      };

      var Phone = Base.extend({
         _getViewModelConstructor: function() {
            return ViewModel;
         },

         _clickHandler: function() {
            if (_private.isMoveCarriage(this)) {
               this._viewModel.moveCarriageToEnd();
               return;
            }

            Phone.superclass._clickHandler.apply(this, arguments);
         }
      });

      Phone.getDefaultOptions = function() {
         var defaultOptions = Base.getDefaultOptions();

         defaultOptions.value = '';

         return defaultOptions;
      };

      export = Phone;
   
