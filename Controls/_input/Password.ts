import Base = require('Controls/_input/Base');
import entity = require('Types/entity');
import ViewModel = require('Controls/_input/Password/ViewModel');
import passwordVisibilityButtonTemplate = require('wml!Controls/_input/Password/PasswordVisibilityButton');
      /**
       *  Control that hides all entered characters and shows replacer-symbols in place of them.
       *  Visibility of entered text can be toggled by clicking on 'eye' icon.
       *  <a href="/materials/demo-ws4-input">Configured Inputs Demo.</a>.
       *
       * @class Controls/_input/Password
       * @extends Controls/_input/Base
       *
       * @mixes Controls/interface/IInputBase
       * @mixes Controls/_input/Password/PasswordStyles
       *
       * @public
       * @demo Controls-demo/Input/Password/PasswordPG
       *
       * @author Журавлев М.С.
       */

      /**
       * @name Controls/_input/Password#revealable
       * @cfg {Boolean} Determines whether to enables the reveal toggle button that will show the password in clear text.
       * @default true
       * @remark
       *
       * The button does not appear in {@link readOnly read mode} or in an empty field.
       */

      

      var _private = {
         calculateType: function(passwordVisible, autoComplete) {
            return passwordVisible || !autoComplete ? 'text' : 'password';
         },

         isVisibleButton: function() {
            return !this._options.readOnly && this._options.value && this._options.revealable;
         },

         isVisiblePassword: function() {
            return this._passwordVisible;
         },
         getTheme: function() {
            return this._options.theme;
         }
      };

      var Password = Base.extend({
         _passwordVisible: false,

         _getViewModelOptions: function(options) {
            return {
               autoComplete: options.autoComplete,
               passwordVisible: this._passwordVisible
            };
         },

         _getViewModelConstructor: function() {
            return ViewModel;
         },

         _initProperties: function(options) {
            Password.superclass._initProperties.apply(this, arguments);

            this._type = _private.calculateType(this._passwordVisible, options.autoComplete);

            this._afterFieldWrapper.template = passwordVisibilityButtonTemplate;
            this._afterFieldWrapper.scope.getTheme = _private.getTheme.bind(this);
            this._afterFieldWrapper.scope.isVisibleButton = _private.isVisibleButton.bind(this);
            this._afterFieldWrapper.scope.isVisiblePassword = _private.isVisiblePassword.bind(this);
         },

         _getTooltip: function() {
            /**
             * If the password is hidden, there should be no tooltip. Otherwise, the tooltip is defined as usual.
             */
            if (this._passwordVisible) {
               return Password.superclass._getTooltip.apply(this, arguments);
            }

            return '';
         },

         _toggleVisibilityHandler: function() {
            var passwordVisible = !this._passwordVisible;

            this._passwordVisible = passwordVisible;
            this._forceUpdate();
            this._type = _private.calculateType(passwordVisible, this._options.autoComplete);
         },

         _getDisplayValue: function() {
            var passwordVisible = this._passwordVisible;
            var autoComplete = this._options.autoComplete;
            var displayValue = this._viewModel.displayValue;

            /**
             * If auto-completion is true, then the displayed value can be saved to the browser history.
             * Therefore, the field must have a value that is not replaced by •.
             */
            return autoComplete || passwordVisible ? displayValue : '•'.repeat(displayValue.length);
         }
      });

      Password._theme = Base._theme.concat(['Controls/input']);

      Password.getDefaultOptions = function() {
         var defaultOptions = Base.getDefaultOptions();

         defaultOptions.value = '';
         defaultOptions.revealable = true;
         defaultOptions.autoComplete = true;

         return defaultOptions;
      };

      Password.getOptionTypes = function getOptionsTypes() {
         var optionTypes = Base.getOptionTypes();

         optionTypes.revealable = entity.descriptor(Boolean);

         return optionTypes;
      };

      export = Password;
   
