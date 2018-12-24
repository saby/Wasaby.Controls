define('Controls/Input/Mask',
   [
      'Core/IoC',
      'Controls/Utils/tmplNotify',
      'Core/Control',
      'Core/helpers/Object/isEqual',
      'Controls/Input/Mask/ViewModel',
      'Core/helpers/Function/runDelayed',
      'wml!Controls/Input/Mask/Mask',

      'Controls/Input/resources/InputRender/InputRender',
      'wml!Controls/Input/resources/input',
      'css!Controls/Input/Mask/Mask'
   ],
   function(IoC, tmplNotify, Control, isEqual, ViewModel, runDelayed, MaskTpl) {

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
       * @mixes Controls/Input/interface/IInputText
       * @mixes Controls/Input/interface/IValidation
       * @mixes Controls/Input/interface/IInputPlaceholder
       * @mixes Controls/Input/resources/InputRender/InputRenderStyles
       * @control
       * @public
       * @author Миронов А.Ю.
       * @category Input
       * @demo Controls-demo/Input/Mask/Mask
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

      // Temporarily hid the option. Need to think about api. Probably, the width must be set for all fields
      // that have the replacer option set. Maybe this option should be implemented at the InputRender level.
      /**
       * @name Controls/Input/Mask#autoWidth
       * @cfg {Boolean} If the option is true, then the width of the field adjusts to the text entered.
       *
       * @remark This option can be used with the replacer option.
       * If the replacer option is specified, the text entered in the field is always the same width.
       * If you enable autoWidth, this width will be set automatically.
       *
       * @example
       * <pre>
       *    <Controls.Input.Mask mask="dd.dd", replacer=" ", value="12.34" autoWidth="{{true}}}}"/>
       *    The width of the field will be such that the text '12.34' to '  .  ' would fit.
       * </pre>
       * @noShow
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

            /**
             * If there's no symbol at selected position,
             * set caret to the position following the last user-entered character.
             * @param input
             * @param selectedPosition
             * @param value
             * @param replacer
             */
            setCaretPosition: function(input, selectedPosition, value, replacer) {
               var position = _private.findLastUserEnteredCharPosition(value, replacer);

               if (position < selectedPosition) {
                  input.setSelectionRange(position, position);
               }

               // ВРЕМЕННОЕ РЕШЕНИЕ, заведена ошибка https://online.sbis.ru/opendoc.html?guid=d1e449c5-835d-4c01-a63c-24879056aa9d

               runDelayed(function() {
                  var rp = new RegExp('[' + replacer + '.:-]', 'g');
                  if (replacer && !value.replace(rp, '')) {
                     input.setSelectionRange(0, 0);
                  }
               });
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
         Mask = Control.extend({
            _template: MaskTpl,

            _viewModel: null,
            _notifyHandler: tmplNotify,

            _beforeMount: function(options) {
               this._viewModel = new ViewModel({
                  value: options.value,
                  mask: options.mask,
                  replacer: _private.calcReplacer(options.replacer, options.mask),
                  formatMaskChars: options.formatMaskChars
               });
            },

            _beforeUpdate: function(newOptions) {
               if (!(
                  newOptions.value === this._options.value &&
                  newOptions.mask === this._options.mask &&
                  newOptions.replacer === this._options.replacer &&
                  isEqual(newOptions.formatMaskChars, this._options.formatMaskChars))
               ) {
                  this._viewModel.updateOptions({
                     value: newOptions.value,
                     mask: newOptions.mask,
                     replacer: _private.calcReplacer(newOptions.replacer, newOptions.mask),
                     formatMaskChars: newOptions.formatMaskChars
                  });
               }
            },

            _focusinHandler: function() {
               var
                  input = this._children.input,
                  value = this._options.value,
                  replacer = this._options.replacer;

               /**
                * At the moment of focus, the selectionEnd property is not set.
                */
               runDelayed(function() {
                  _private.setCaretPosition(input, input.selectionEnd, value, replacer);
               });
            }
         });

      Mask.getDefaultOptions = function() {
         return {
            value: '',
            replacer: '',
            formatMaskChars: {
               'L': '[А-ЯA-ZЁ]',
               'l': '[а-яa-zё]',
               'd': '[0-9]',
               'x': '[А-ЯA-Zа-яa-z0-9ёЁ]'
            },
            selectOnClick: false,
            autoWidth: false
         };
      };

      Mask._private = _private;

      return Mask;
   });
