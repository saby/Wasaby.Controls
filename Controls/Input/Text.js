define('Controls/Input/Text',
   [
      'Core/Control',
      'Controls/Utils/tmplNotify',
      'tmpl!Controls/Input/Text/Text',
      'WS.Data/Type/descriptor',
      'Controls/Input/Text/ViewModel',
      'Controls/Input/resources/InputHelper',

      'css!Controls/Input/resources/InputRender/InputRender',
      'tmpl!Controls/Input/resources/input'
   ],
   function(Control, tmplNotify, template, types, TextViewModel, inputHelper) {

      'use strict';

      /**
       * Single-line text input.
       * <a href="/materials/demo-ws4-input">Демо-пример</a>.
       *
       * @class Controls/Input/Text
       * @extends Core/Control
       * @mixes Controls/Input/interface/IInputText
       * @mixes Controls/Input/interface/IInputPlaceholder
       * @mixes Controls/Input/interface/IValidation
       * @mixes Controls/Input/interface/IInputTag
       * @mixes Controls/Input/resources/InputRender/InputRenderStyles
       * @control
       * @public
       * @category Input
       * @author Журавлев Максим Сергеевич
       * @demo Controls-demo/Input/Text/Text
       */


      /**
       * @name Controls/Input/Text#maxLength
       * @cfg {Number} Maximum number of characters that user can enter in the field.
       */

      /**
       * @name Controls/Input/Text#trim
       * @cfg {Boolean} If true, removes whitespaces from both sides of a string when input is completed.
       * @variant true Remove whitespaces.
       * @variant false Do not remove whitespaces.
       * @default false
       */

      /**
       * @name Controls/Input/Text#selectOnClick
       * @cfg {Boolean} If true, text is selected when input is clicked.
       * @variant true Select text on click.
       * @variant false Do not select text on click.
       */

      /**
       * @name  Controls/Input/Text#constraint
       * @cfg {String} Regular expression for input filtration.
       * @remark
       * Every entered character is checked with a given regular expression. If symbol does not
       * comply with the expression, if will not be entered.
       * @example
       * Allow only digits:
       * <pre class="brush:xml">
       *     <option name="constraint">[0-9]</option>
       * </pre>
       * Allow only cyrillic letters:
       * <pre class="brush:xml">
       *     <option name="constraint">[а-яА-ЯёЁ]</option>
       * </pre>
       */

      var TextBox = Control.extend({
         _template: template,
         _caretPosition: null,

         constructor: function(options) {
            TextBox.superclass.constructor.call(this, options);

            this._textViewModel = new TextViewModel({
               constraint: options.constraint,
               maxLength: options.maxLength,
               value: options.value
            });
         },

         _beforeUpdate: function(newOptions) {
            this._textViewModel.updateOptions({
               constraint: newOptions.constraint,
               maxLength: newOptions.maxLength,
               value: newOptions.value
            });
         },

         _afterUpdate: function(oldOptions) {
            if ((oldOptions.value !== this._options.value) && this._caretPosition) {
               this._children['input'].setSelectionRange(this._caretPosition, this._caretPosition);
               this._caretPosition = null;
            }
         },

         _inputCompletedHandler: function() {
            //Если стоит опция trim, то перед завершением удалим лишние пробелы и ещё раз стрельнем valueChanged
            if (this._options.trim) {
               var newValue = this._options.value.trim();
               if (newValue !== this._options.value) {
                  this._notify('valueChanged', [newValue]);
               }
            }

            this._notify('inputCompleted', [this._options.value]);
         },


          _notifyHandler: tmplNotify,
         paste: function(text) {
            this._caretPosition = inputHelper.pasteHelper(this._children['inputRender'], this._children['input'], text);
         }
      });

      TextBox.getDefaultOptions = function() {
         return {
            value: '',
            trim: false,
            selectOnClick: true
         };
      };

      TextBox.getOptionTypes = function() {
         return {
            trim: types(Boolean),
            selectOnClick: types(Boolean),
            placeholder: types(String),
            constraint: types(String),
            value: types(String),
            maxLength: types(Number)
         };
      };

      return TextBox;
   }
);
