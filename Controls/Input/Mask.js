define('Controls/Input/Mask',
   [
      'Core/Control',
      'Core/helpers/Object/isEqual',
      'Controls/Input/Mask/ViewModel',
      'Core/helpers/Function/runDelayed',
      'tmpl!Controls/Input/Mask/Mask',
      'Controls/Input/resources/InputRender/InputRender',
      'tmpl!Controls/Input/resources/input'
   ],
   function(Control, isEqual, ViewModel, runDelayed, MaskTpl) {

      'use strict';

      /**
       * Поле ввода строки заранее определенного формата.
       * В поле уже заранее будут введены символы, определяющие формат, и останется ввести только недостающие символы.
       * @class Controls/Input/Mask
       * @extends Controls/Control
       * @mixes Controls/Input/interface/IInputTag
       * @mixes Controls/Input/interface/IInputText
       * @mixes Controls/Input/interface/IValidation
       * @mixes Controls/Input/interface/IInputPlaceholder
       * @control
       * @public
       * @category Input
       */

      /**
       * @name Controls/Input/Mask#mask
       * @cfg {String} Маска ввода текстового значения.
       * Маска может состоять из ключей,
       * <ol>
       *    <li>d - цифра.</li>
       *    <li>L - заглавная буква.</li>
       *    <li>l - строчная буква.</li>
       *    <li>x - буква или цифра.</li>
       * </ol>
       * разделителей, кванторов +, *, ?, {n[, m]}.
       * Перед квантором нужно поставить \.
       * Кванторы должны применяться к ключам.
       * Задается в формате схожем с регулярным выражением.
       * В случае регулярного выражения отличие состоит в том, что в качестве обычных символов используются ключи маски и разделители.
       * @example
       * <pre>
       *    1. 'dd.dd' - маска ввода времени.
       *    2. 'dd.dd.dddd' - маска ввода даты.
       * </pre>
       */

      /**
       * @name Controls/Input/Mask#replacer
       * @cfg {String} Символ для замены недостающих символов для полного заполнения маски.
       * @example
       * <pre>
       *    Зададим mask='dd.dd', replacer=' ', value='12.34'.
       *    Если стереть все значение из поля, то в нем после удаления вместо '12.34' появится '  .  '
       * </pre>
       */

      var
         _private = {
            findLastUserEnteredCharPosition: function(value, replacer) {
               var position;

               if (replacer) {
                  position = value.indexOf(replacer);

                  return position === -1 ? value.length : position;
               } else {
                  return value.length;
               }
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
            }
         },
         Mask = Control.extend({
            _template: MaskTpl,

            _viewModel: null,

            constructor: function(options) {
               Mask.superclass.constructor.call(this, options);

               this._viewModel = new ViewModel({
                  value: options.value,
                  mask: options.mask,
                  replacer: options.replacer,
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
                     replacer: newOptions.replacer,
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
            }
         };
      };

      Mask._private = _private;

      return Mask;
   });
