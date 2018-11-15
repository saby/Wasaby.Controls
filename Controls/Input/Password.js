define('Controls/Input/Password',
   [
      'Core/Control',
      'Controls/Utils/tmplNotify',
      'wml!Controls/Input/Password/Password',
      'Controls/Input/Password/ViewModel',

      'css!theme?Controls/Input/Password/Password'
   ],

   function(Control, tmplNotify, template, ViewModel) {

      /**
       *  Control that hides all entered characters and shows replacer-symbols in place of them.
       *  Visibility of entered text can be toggled by clicking on 'eye' icon.
       *  <a href="/materials/demo-ws4-input">Configured Inputs Demo.</a>.
       *
       * @class Controls/Input/Password
       * @extends Core/Control
       * @mixes Controls/Input/interface/IInputText
       * @mixes Controls/Input/interface/IInputPlaceholder
       * @mixes Controls/Input/interface/IInputTag
       * @mixes Controls/Input/Password/PasswordStyles
       * @mixes Controls/Input/resources/InputRender/InputRenderStyles
       * @control
       * @public
       * @category Input
       * @demo Controls-demo/Input/Password/Password
       * @demo Controls-demo/Input/Password/Password
       *
       * @author Журавлев М.С.
       */

      'use strict';

      var PasswordInput = Control.extend({
         _template: template,

         _notifyHandler: tmplNotify,

         _passwordVisible: false,

         _beforeMount: function(options) {
            this._simpleViewModel = new ViewModel({
               value: options.value,
               autoComplete: options.autocomplete,
               passwordVisible: this._passwordVisible
            });

            /**
             * Browsers use autocomplete to the fields with the previously stored name.
             * Therefore, if all of the fields will be one name, then AutoFill will apply to the first field.
             * To avoid this, we will translate the name of the control to the name of the tag.
             * https://habr.com/company/mailru/blog/301840/
             */
            this._inputName = options.name || 'input';
         },

         _beforeUpdate: function(newOptions) {
            this._simpleViewModel.updateOptions({
               value: newOptions.value,
               autoComplete: newOptions.autocomplete,
               passwordVisible: this._passwordVisible
            });
         },

         _toggleVisibilityHandler: function() {
            this._passwordVisible = !this._passwordVisible;
         },

         _calculateType: function() {
            return this._passwordVisible || !this._options.autocomplete ? 'text' : 'password';
         }
      });

      PasswordInput.getDefaultOptions = function() {
         return {
            value: '',
            autocomplete: true,
            selectOnClick: false
         };
      };

      PasswordInput.getOptionTypes = function getOptionsTypes() {
         return {

            /*placeholder: types(String) вернуть проверку типов, когда будет поддержка проверки на 2 типа https://online.sbis.ru/opendoc.html?guid=00ca0ce3-d18f-4ceb-b98a-20a5dae21421*/
         };
      };

      return PasswordInput;
   });
