define('Controls/Input/Text',
   [
      'Core/Control',
      'Controls/Utils/tmplNotify',
      'wml!Controls/Input/Text/Text',
      'WS.Data/Type/descriptor',
      'Controls/Input/Text/ViewModel',
      'Controls/Input/resources/InputHelper',

      'css!Controls/Input/resources/InputRender/InputRender',
      'wml!Controls/Input/resources/input'
   ],
   function(Control, tmplNotify, template, types, TextViewModel, inputHelper) {

      'use strict';

      /**
       * A component for entering single-line text.
       * You may want to restrict user input to a limited define of characters. In this case, you should use the option {@link constraint}.
       * You can {@link trim remove extra spaces} at the beginning and end when the {@link inputCompleted input is completed}.
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
       * @demo Controls-demo/Input/Text/Text
       *
       * @author Зайцев А.С.
       */


      /**
       * @name Controls/Input/Text#maxLength
       * @cfg {Number} Maximum number of characters that user can enter in the field.
       */

      /**
       * @name Controls/Input/Text#trim
       * @cfg {Boolean} Determines whether removes white spaces from both sides of a string when input is completed.
       */

      /**
       * @name Controls/Input/Text#selectOnClick
       * @cfg {Boolean} Determines whether text is selected when input is clicked.
       * @default true
       */

      /**
       * @name  Controls/Input/Text#constraint
       * @cfg {String} Regular expression for input filtration.
       * @remark
       * Every entered character is checked with a given regular expression.
       * If symbol does not match with the expression, then he will not be entered.
       * @example
       * Allow only digits:
       * <pre class="brush:xml">
       *    <Controls.Input.Text constraint="[0-9]"/>
       * </pre>
       * Allow only cyrillic letters:
       * <pre class="brush:xml">
       *    <Controls.Input.Text constraint="[а-яА-ЯёЁ]"/>
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
