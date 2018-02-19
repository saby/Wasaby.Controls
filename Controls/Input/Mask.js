define('Controls/Input/Mask',
   [
      'Core/Control',
      'Controls/Input/Mask/ViewModel',
      'tmpl!Controls/Input/Mask/Mask',
      'Controls/Input/resources/InputRender/InputRender',
      'tmpl!Controls/Input/resources/input'
   ],
   function(Control, ViewModel, MaskTpl) {

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
       * разделителей, кванторов +, *, ?, {n[, m]} и специальных конструкций |, (?:...).
       * Перед квантором и специальной конструкцией нужно поставить \.
       * Исключением является (?:...). В таком случае нужно писать \(?:...\).
       * Кванторы и специальные конструкции должны применяться к ключам.
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

      var Mask = Control.extend({
         _template: MaskTpl,

         _viewModel: null,

         constructor: function(options) {
            Mask.superclass.constructor.call(this, options);

            this._viewModel = new ViewModel({
               mask: options.mask,
               replacer: options.replacer,
               formatMaskChars: {
                  'L': '[А-ЯA-ZЁ]',
                  'l': '[а-яa-zё]',
                  'd': '[0-9]',
                  'x': '[А-ЯA-Zа-яa-z0-9ёЁ]'
               }
            });
         },

         _beforeUpdate: function(newOptions) {
            if (!(newOptions.mask === this._options.mask && newOptions.replacer === this._options.replacer)) {
               this._viewModel.updateOptions({
                  mask: newOptions.mask,
                  replacer: newOptions.replacer
               });
            }
         }
      });

      return Mask;
   });