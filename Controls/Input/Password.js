define('Controls/Input/Password',
   [
      'Core/Control',
      'WS.Data/Type/descriptor',
      'Controls/Utils/tmplNotify',
      'wml!Controls/Input/Password/Password',
      'Controls/Input/resources/InputRender/BaseViewModel',

      'css!Controls/Input/Password/Password'
   ],

   function(Control, types, tmplNotify, template, BaseViewModel) {

      /**
       *  Component that shows all entered characters as stars. Visibility of entered
       *  text can be toggled by clicking on 'eye' icon.
       *  <a href="/materials/demo-ws4-input">Configured Inputs Demo.</a>.
       *
       * @class Controls/Input/Password
       * @extends Core/Control
       * @mixes Controls/Input/interface/IInputText
       * @mixes Controls/Input/interface/IInputPlaceholder
       * @mixes Controls/Input/interface/IValidation
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
            this._simpleViewModel = new BaseViewModel({
               value: options.value
            });
         },

         _beforeUpdate: function(newOptions) {
            this._simpleViewModel.updateOptions({
               value: newOptions.value
            });
         },

         _toggleVisibilityHandler: function() {
            this._passwordVisible = !this._passwordVisible;
         }
      });

      PasswordInput.getDefaultOptions = function() {
         return {
            value: ''
         };
      };

      PasswordInput.getOptionTypes = function getOptionsTypes() {
         return {

            /*placeholder: types(String) вернуть проверку типов, когда будет поддержка проверки на 2 типа https://online.sbis.ru/opendoc.html?guid=00ca0ce3-d18f-4ceb-b98a-20a5dae21421*/
         };
      };

      return PasswordInput;
   });
