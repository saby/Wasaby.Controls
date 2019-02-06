define('Controls/Input/Mask',
   [
      'Core/IoC',
      'Controls/Utils/tmplNotify',
      'Controls/Input/Base',
      'Core/detection',
      'Core/helpers/Object/isEqual',
      'Controls/Input/Mask/ViewModel',
      'Core/helpers/Function/runDelayed',
      'Types/entity',
      'wml!Controls/Input/Base/Base',
      'wml!Controls/Input/Mask/Mask',

      'css!Controls/Input/Mask/Mask'
   ],
   function(IoC, tmplNotify, Base, cDetection, isEqual, ViewModel, runDelayed, entity, baseTemplate, MaskTpl) {

      'use strict';

      /**
       * A component for entering text in a {@link mask specific format}.
       * Characters that are not yet entered in the field can be replaced by another {@link replacer character}.
       * If the input character does not fit the format, then character won't be added.
       * <a href="/materials/demo-ws4-input">Демо-пример</a>.
       *
       * @class Controls/Input/Mask
       * @extends Core/Control
       * @mixes Controls/Input/interface/IInputTag
       * @mixes Controls/Input/interface/IInputMaskValue
       * @mixes Controls/Input/interface/IValidation
       * @mixes Controls/Input/interface/IInputPlaceholder
       * @mixes Controls/Input/resources/InputRender/InputRenderStyles
       * @control
       * @public
       * @author Миронов А.Ю.
       * @category Input
       * @demo Controls-demo/Input/Mask/MaskPG
       */

      /**
       * @name Controls/Input/Mask#mask
       * @cfg {String} Input mask.
       *
       * Mask can use the following keys:
       * <ol>
       *    <li>d - digit.</li>
       *    <li>L - uppercase letter.</li>
       *    <li>l - lowercase letter.</li>
       *    <li>x - letter or digit.</li>
       * </ol>
       * delimeters and quantifiers +, *, ?, {n[, m]}.
       * Quantifiers should be preceded with \\.
       * Quantifiers should be applied to keys.
       * Format is similar to regular expressions.
       *
       * @example
       * The input mask time:
       * <pre class="brush:xml">
       *    <Controls.Input.Mask mask="dd.dd"/>
       * </pre>
       * The input mask date:
       * <pre class="brush:xml">
       *    <Controls.Input.Mask mask="dd.dd.dddd"/>
       * </pre>
       * The input mask from 1-3 digits followed by 1-3 letters.
       * <pre class="brush:xml">
       *    <Controls.Input.Mask mask="d\{1,3}l\{1,3}"/>
       * </pre>
       * The input mask infinity number of digits:
       * <pre class="brush:xml">
       *    <Controls.Input.Mask mask="d\*"/>
       * </pre>
       *
       * @see formatMaskChars
       */

      /**
       * @name Controls/Input/Mask#replacer
       * @cfg {String} Symbol that will be shown when character is not entered.
       *
       * @remark If quantifiers are used in the mask, the replacer cannot be set.
       * Correct operation is not supported.
       *
       * @example
       * <pre>
       *    <Controls.Input.Mask mask="dd.dd", replacer=" ", value="12.34"/>
       *    If you erase everything from input, the field will change from '12.34' to '  .  '.
       * </pre>
       */

      /**
       * @name Controls/Input/Mask#formatMaskChars
       * @cfg {Object} Object, where keys are mask characters, and values are regular expressions that will be used to filter input characters for corresponding keys.
       *
       * @example
       * js:
       * <pre>
       *    _beforeMount: function() {
       *       var formatMaskChars = {
       *          '+': '[+]',
       *          'd': '[0-9]'
       *       }
       *
       *       this._formatMaskChars = formatMaskChars;
       * </pre>
       * tmpl:
       * <pre>
       *    <Controls.Input.Mask mask="+?d (ddd)ddd-dd-dd" formatMaskChars={{_formatMaskChars}}/>
       * </pre>
       */

      // Add the interface "Controls/Input/interface/IInputBase" and delete "Controls/Input/Mask#tooltip" after remake base control to 'Controls/Input/Base'.
      /**
       * @name Controls/Input/Mask#tooltip
       * @cfg {String} Text of the tooltip shown when the control is hovered over.
       * @remark
       * "Title" attribute added to the control's root node and default browser tooltip is shown on hover.
       * @example
       * In this example, when you hover over the field, "Enter your name" tooltip will be shown.
       * <pre>
       *    <Controls.Input.Mask tooltip="Enter your name"/>
       * </pre>
       */

      var
         _private = {
            regExpQuantifiers: /\\({.*?}|.)/,

            findLastUserEnteredCharPosition: function(value, replacer) {
               var position;

               if (replacer) {
                  position = value.indexOf(replacer);

                  return position === -1 ? value.length : position;
               }
               return value.length;
            },
            validateReplacer: function(replacer, mask) {
               var validation;

               if (replacer && _private.regExpQuantifiers.test(mask)) {
                  validation = false;
                  IoC.resolve('ILogger').error('Mask', 'Used not empty replacer and mask with quantifiers. More on https://wi.sbis.ru/docs/js/Controls/Input/Mask/options/replacer/');
               } else {
                  validation = true;
               }

               return validation;
            },
            calcReplacer: function(replacer, mask) {
               return _private.validateReplacer(replacer, mask) ? replacer : '';
            }
         },
         Mask = Base.extend({
            _template: MaskTpl,
            _baseTemplate: baseTemplate,
            _viewModel: null,
            _notifyHandler: tmplNotify,

            _maskWrapperCss: null,

            _getViewModelOptions: function(options) {
               return {
                  value: options.value,
                  mask: options.mask,
                  replacer: _private.calcReplacer(options.replacer, options.mask),
                  formatMaskChars: options.formatMaskChars
               };
            },
            _getViewModelConstructor: function() {
               return ViewModel;
            },

            _initProperties: function(options) {
               Mask.superclass._initProperties.apply(this, arguments);
            },

            _beforeUpdate: function(options) {
               this._options.mask = options.mask;
               Mask.superclass._beforeUpdate.apply(this, arguments);
            },

            _changeHandler: function() {
               Mask.superclass._changeHandler.apply(this, arguments);
               this._notifyValueChanged();
            },

            _focusInHandler: function() {
               Mask.superclass._focusInHandler.apply(this, arguments);
               this._notifyValueChanged();
            },

            _isAutoWidth: function() {
               return Boolean(this._options.replacer);
            }
         });

      Mask.getDefaultOptions = function() {
         var defaultOptions = Base.getDefaultOptions();
         defaultOptions.value = '';
         defaultOptions.replacer = '';
         defaultOptions.formatMaskChars = {
            'L': '[А-ЯA-ZЁ]',
            'l': '[а-яa-zё]',
            'd': '[0-9]',
            'x': '[А-ЯA-Zа-яa-z0-9ёЁ]'
         };
         defaultOptions.selectOnClick = false;
         defaultOptions.autoWidth = false;

         return defaultOptions;
      };

      Mask.getOptionTypes = function getOptionTypes() {
         var optionTypes = Base.getOptionTypes();

         optionTypes.mask = entity.descriptor(String).required();
         return optionTypes;
      };

      Mask._private = _private;

      return Mask;
   });
