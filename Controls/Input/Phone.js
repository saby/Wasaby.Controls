define('Controls/Input/Phone',
   [
      'Core/Control',
      'Controls/Input/Phone/ViewModel',
      'tmpl!Controls/Input/Mask/Mask'
   ],
   function(Control, ViewModel, template) {

      'use strict';

      /**
       * A component for entering phone number. Depending on the characters you enter, the phone number format changes.
       * This behavior is described in the {@link http://axure.tensor.ru/standarts/v7/%D0%BF%D0%BE%D0%BB%D0%B5_%D0%B2%D0%B2%D0%BE%D0%B4%D0%B0__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_03_.html standard}.
       * You can {@link validationErrors validate} the inputed text. If the text does not pass validation, the input field will change its appearance.
       * If you want a hint of what text is expected in the input field, you can use {@link Controls/Label labels} or {@link placeholder placeholder}.
       * If this is not enough, use {@link tagStyle tags}.
       * You can make the entry field {@link readOnly inactive}. In this case, the text input will be prohibited and the appearance of the field will be changed.
       * <a href="/materials/demo-ws4-input">Демо-пример</a>.
       *
       * @class Controls/Input/Phone
       * @extends Core/Control
       * @mixes Controls/Input/interface/IInputTag
       * @mixes Controls/Input/interface/IInputText
       * @mixes Controls/Input/interface/IValidation
       * @mixes Controls/Input/interface/IInputPlaceholder
       * @mixes Controls/Input/resources/InputRender/InputRenderStyles
       * @control
       * @public
       * @category Input
       * @demo Controls-demo/Input/Phone/Phone
       *
       * @author Журавлев Максим Сергеевич
       */

      var Phone = Control.extend({
         _template: template,

         _viewModel: null,

         constructor: function(options) {
            Phone.superclass.constructor.call(this, options);

            this._viewModel = new ViewModel({
               value: options.value
            });
         },

         _beforeUpdate: function(newOptions) {
            if (this._options.value !== newOptions.value) {
               this._viewModel.updateOptions({
                  value: newOptions.value
               });
            }
         },

         _focusinHandler: function() {}
      });

      Phone.getDefaultOptions = function() {
         return {
            value: ''
         };
      };
      
      return Phone;
   }
);
