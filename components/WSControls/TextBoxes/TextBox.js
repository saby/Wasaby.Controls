define('js!WSControls/TextBoxes/TextBox',
   [
      'js!WSControls/TextBoxes/TextBoxBase',
      'tmpl!WSControls/TextBoxes/TextBox',
      'tmpl!WSControls/TextBoxes/resources/textFieldWrapper',
      'js!WS.Data/Type/descriptor',
      'js!WSControls/TextBoxes/resources/CalcInputText',
      'js!WSControls/TextBoxes/resources/SelectionUtil',
      'css!SBIS3.CONTROLS.TextBox'
   ],
   function(TextBoxBase, template, textFieldWrapper, types, calcInputText, SelectionUtils) {

      'use strict';

      var selectionUtils = new SelectionUtils();

      function setText(target, text, position) {
         this._text = target.value = text;
         selectionUtils.updateSelectionPositionTarget(target, position, position);
         selectionUtils.updateSelectionPosition(target);
         this._notify('onChangeText', text);
      }
      
      function getInputText(target) {
         var
            oldText = this._text,
            newText = target.value,
            caretPosition = target.selectionEnd,
            splitText, inputText, calcText;

         if (oldText === newText) {
            inputText = {
               text: newText,
               position: caretPosition
            }
         } else {
            splitText = calcInputText.getSplitInputText(oldText, newText, caretPosition, selectionUtils.selectionEnd - selectionUtils.selectionStart);
            calcText = this._calcText(splitText.inputText, this._options);
            inputText = {
               text: splitText.beforeInputText + calcText + splitText.afterInputText,
               position: splitText.beforeInputText.length + calcText.length
            };
         }

         return inputText;
      }

      var TextBox = TextBoxBase.extend({
         /**
          * trim
          * @cfg {Boolean} Устанавливает режим обрезки пробелов в начале и конце добавляемого текста.
          * @variant true Обрезать пробелы.
          * @variant false Не обрезать пробелы.
          *
          * placeholder
          * @cfg {String} Устанавливает текст подсказки внутри поля ввода.
          *
          * selectOnClick
          * @cfg {Boolean} Определяет режим выделения текста в поле ввода при получении фокуса.
          * @variant true Выделять текст.
          * @variant false Не выделять текст.
          *
          * inputRegExp
          * @cfg {String} Устанавливает регулярное выражение, в соответствии с которым будет осуществляться валидация вводимых символов.
          * @remark
          * Служит для фильтрации вводимых символов в поле ввода по условию, установленному регулярным выражением.
          * Каждый вводимый символ будет проверяться на соответствие указанному в этой опции регулярному выражению;
          * несоответствующие символы ввести будет невозможно.
          * @example
          * Разрешен ввод только цифр:
          * <pre class="brush:xml">
          *     <option name="inputRegExp">[0-9]</option>
          * </pre>
          * Разрешен ввод только кириллицы:
          * <pre class="brush:xml">
          *     <option name="inputRegExp">[а-яА-ЯёЁ]</option>
          * </pre>
          */
         _controlName: 'WSControls/TextBoxes/TextBox',

         _template: template,

         _textFieldWrapper: textFieldWrapper,

         /**
          * Обновление текста. Переобпределяется в наследниках, если нужно изменить значение текста, в соответствии с опциями.
          * @param options
          * @private
          */
         _updateText: function(options) {
            this._text = this._calcText(options.text, options);
         },

         /**
          * Обработчик ввода.
          * @param event
          * @private
          */
         _inputHandler: function(event) {
            var target = event.target, inputText;

            if (target.value === this._text) {
               return;
            }

            if (event.nativeEvent.inputType === 'deleteContentBackward') {
               inputText = {
                  text: target.value,
                  position: target.selectionEnd
               };
            } else {
               inputText = getInputText.call(this, target);
            }

            if (this._text !== inputText.text) {
               setText.call(this, target, inputText.text, inputText.position);
            }
         },

         /**
          * Обработчик фокусировки элемента.
          * @param event
          * @private
          */
         _focusHandler: function(event) {
            if (this._options.selectOnClick) {
               event.target.select();
            }
         },

         /**
          * Обработчик выделения элемента.
          * @param event
          * @private
          */
         _selectHandler: function(event) {
            selectionUtils.updateSelectionPosition(event.target);
         },

         /**
          * Обработчик клика.
          * @param event
          * @private
          */
         _clickHandler: function(event) {
            selectionUtils.updateSelectionPosition(event.target);
         },

         /**
          * Обработчик поднятия клавиш.
          * @param event
          * @private
          */
         _keyupHandler: function(event) {
            var keyCode = event.nativeEvent.keyCode;

            // При нажатии стрелок происходит смещение курсора.
            if (keyCode > 36 && keyCode < 41) {
               selectionUtils.updateSelectionPosition(event.target);
            }
         },

         /**
          * Метод расчета текста.
          * @param text текст.
          * @param options опции.
          * @returns {String}
          * @private
          */
         _calcText: function(text, options) {
            var
               isTrim = options.trim,
               inputRegExp = options.inputRegExp,
               validText;

            if (inputRegExp) {
               validText = '';

               text.replace(new RegExp(inputRegExp, 'g'), function(validSymbol) {
                  validText += validSymbol;
               });
            } else {
               validText = text;
            }

            if (isTrim) {
               validText = validText.trim();
            }

            return validText.substring(0, options.maxLength);
         }
      });

      TextBox.getDefaultOptions = function() {
         return {
            text: ''
         };
      };

      TextBox.getOptionTypes = function() {
         var optionTypes = TextBoxBase.getOptionTypes();

         optionTypes.trim = types(Boolean);
         optionTypes.selectOnClick = types(Boolean);
         optionTypes.placeholder = types(String);
         optionTypes.inputRegExp = types(String);

         return optionTypes;
      };
      return TextBox;
   }
);