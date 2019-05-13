import Env = require('Env/Env');
import tmplNotify = require('Controls/Utils/tmplNotify');
import Base = require('Controls/_input/Base');
import isEqual = require('Core/helpers/Object/isEqual');
import ViewModel = require('Controls/_input/Mask/ViewModel');
import runDelayed = require('Core/helpers/Function/runDelayed');
import entity = require('Types/entity');
import baseTemplate = require('wml!Controls/_input/Base/Base');
import MaskTpl = require('wml!Controls/_input/Mask/Mask');

      

      /**
       * A component for entering text in a {@link mask specific format}.
       * Characters that are not yet entered in the field can be replaced by another {@link replacer character}.
       * If the input character does not fit the format, then character won't be added.
       * <a href="/materials/demo-ws4-input">Демо-пример</a>.
       *
       * @class Controls/_input/Mask
       * @extends Controls/_input/Base
       *
       * @mixes Controls/interface/IInputBase
       * @mixes Controls/interface/IInputMaskValue
       * @public
       * @author Миронов А.Ю.
       * @demo Controls-demo/Input/Mask/MaskPG
       */

      /**
       * @name Controls/_input/Mask#mask
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
       *    <Controls._input.Mask mask="dd.dd"/>
       * </pre>
       * The input mask date:
       * <pre class="brush:xml">
       *    <Controls._input.Mask mask="dd.dd.dddd"/>
       * </pre>
       * The input mask from 1-3 digits followed by 1-3 letters.
       * <pre class="brush:xml">
       *    <Controls._input.Mask mask="d\{1,3}l\{1,3}"/>
       * </pre>
       * The input mask infinity number of digits:
       * <pre class="brush:xml">
       *    <Controls._input.Mask mask="d\*"/>
       * </pre>
       *
       * @see formatMaskChars
       */

      /**
       * @name Controls/_input/Mask#replacer
       * @cfg {String} Symbol that will be shown when character is not entered.
       *
       * @remark If quantifiers are used in the mask, the replacer cannot be set.
       * Correct operation is not supported.
       *
       * @example
       * <pre>
       *    <Controls._input.Mask mask="dd.dd", replacer=" ", value="12.34"/>
       *    If you erase everything from input, the field will change from '12.34' to '  .  '.
       * </pre>
       */

      /**
       * @name Controls/_input/Mask#formatMaskChars
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
       *    <Controls._input.Mask mask="+?d (ddd)ddd-dd-dd" formatMaskChars={{_formatMaskChars}}/>
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
                  Env.IoC.resolve('ILogger').error('Mask', 'Used not empty replacer and mask with quantifiers. More on https://wi.sbis.ru/docs/js/Controls/_input/Mask/options/replacer/');
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

            _isAutoWidth: function() {
               return Boolean(this._options.replacer) ? 'absolute' : 'relative';
            },

            _focusInHandler: function() {
               Mask.superclass._focusInHandler.apply(this, arguments);
               var field = this._getField();
               var position = _private.findLastUserEnteredCharPosition(this._viewModel.displayValue, this._options.replacer);
               this._viewModel.selection = {
                   start: position,
                   end: position
               }
               runDelayed(function() {
                  field.setSelectionRange(position, position);
               });
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
         defaultOptions.autoWidth = false;

         return defaultOptions;
      };

      Mask.getOptionTypes = function getOptionTypes() {
         var optionTypes = Base.getOptionTypes();

         optionTypes.mask = entity.descriptor(String).required();
         return optionTypes;
      };

      Mask._private = _private;

      Mask._theme.push('Controls/input');

      export = Mask;
   
