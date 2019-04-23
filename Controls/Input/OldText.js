define('Controls/Input/OldText',
   [
      'Core/Control',
      'Controls/Utils/tmplNotify',
      'wml!Controls/Input/OldText/OldText',
      'Types/entity',
      'Controls/Input/OldText/OldViewModel',
      'Controls/Input/resources/InputHelper',

      'css!theme?Controls/Input/resources/InputRender/InputRender',
      'wml!Controls/Input/resources/input'
   ],
   function(Control, tmplNotify, template, entity, TextViewModel, inputHelper) {

      'use strict';

      /**
       * Controls that allows user to enter single-line text.
       * <a href="/materials/demo-ws4-input">Demo examples.</a>.
       *
       * @class Controls/input:Text
       * @extends Core/Control
       *
       * @mixes Controls/interface/IInputTag
       * @mixes Controls/Input/interface/IInputField
       * @mixes Controls/interface/IPaste
       * @mixes Controls/interface/IInputBase
       * @mixes Controls/interface/IInputPlaceholder
       * @mixes Controls/Input/resources/InputRender/InputRenderStyles
       *
       * @private
       * @demo Controls-demo/Input/Text/TextPG
       *
       * @author Колесова П.С.
       */


      /**
       * @name Controls.input:Text#maxLength
       * @cfg {Number} Maximum number of characters that can be entered in the field.
       * @remark
       * If user tries to enter text longer than the value of maxLength, control will prevent input.
       * @example
       * In this example, only 20 characters can be entered in the field.
       * <pre>
       *    <Controls.input:Text maxLength="{{20}}"/>
       * </pre>
       */

      /**
       * @name Controls.input:Text#trim
       * @cfg {Boolean} Determines whether the field value should be trimmed when input is completed.
       * @default false
       * @remark
       * String is trimmed only when input is completed.
       * If you bind control's state to the value in the field, the state will contain spaces when user types, and will be trimmed only when input is completed.
       * true - removes whitespaces from both ends of the string when input is completed.
       * false - does not do anything.
       * @example
       * In this example, extra spaces with both side will be trimmed when the focus leaves the text box.
       * <pre>
       *    <Controls.input:Text trim="{{true}}" bind:value="_fieldValue" on:inputCompleted="_inputCompletedHandler()"/>
       * </pre>
       *
       * <pre>
       *    Control.extend({
       *       ...
       *       _fieldValue: '',
       *
       *       _inputCompletedHandler(value) {
       *          // When event fires, both value and _fieldValue will contain trimmed field value
       *       }
       *       ...
       *    });
       * </pre>
       * @see Controls/Input/interface/IInputField#inputCompleted
       */

      /**
       * @name  Controls.input:Text#constraint
       * @cfg {String} Regular expression for input filtration.
       * @remark
       * This regular expression is applied to every character that user enters. If entered character doesn't match regular expression, it is not added to the field. When user pastes a value with multiple characters to the field, we check the value characters by characters, and only add the characters that pass regular expression. For example, if you try to paste "1ab2cd" to the field with constraint "[0-9]", only "12" will be inserted in the field.
       * @example
       * In this example, the user will be able to enter only numbers in the field.
       * <pre>
       *    <Controls.input:Text constraint="[0-9]"/>
       * </pre>
       */

      var TextBox = Control.extend({
         _template: template,
         _caretPosition: null,

         _beforeMount: function(options) {
            this._textViewModel = new TextViewModel({
               constraint: options.constraint,
               maxLength: options.maxLength,
               value: options.value
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
            this._textViewModel.updateOptions({
               constraint: newOptions.constraint,
               maxLength: newOptions.maxLength,
               value: newOptions.value
            });
         },

         _afterUpdate: function(oldOptions) {
            if ((oldOptions.value !== this._options.value) && this._caretPosition) {
               this._children[this._inputName].setSelectionRange(this._caretPosition, this._caretPosition);
               this._caretPosition = null;
            }
         },

         _inputCompletedHandler: function() {
            // Если стоит опция trim, то перед завершением удалим лишние пробелы и ещё раз стрельнем valueChanged
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
            this._caretPosition = inputHelper.pasteHelper(this._children['inputRender'], this._children[this._inputName], text);
         }
      });

      TextBox.getDefaultOptions = function() {
         return {
            value: '',
            trim: false,
            selectOnClick: false
         };
      };

      TextBox.getOptionTypes = function() {
         return {
            trim: entity.descriptor(Boolean),
            selectOnClick: entity.descriptor(Boolean),

            /*placeholder: types(String), вернуть проверку типов, когда будет поддержка проверки на 2 типа https://online.sbis.ru/opendoc.html?guid=00ca0ce3-d18f-4ceb-b98a-20a5dae21421*/
            constraint: entity.descriptor(String),
            value: entity.descriptor(String),
            maxLength: entity.descriptor(Number)
         };
      };

      return TextBox;
   });
