define('js!WSControls/TextBoxes/TextBox',
   [
      'js!WSControls/TextBoxes/TextBoxBase',
      'tmpl!WSControls/TextBoxes/TextBox',
      'tmpl!WSControls/TextBoxes/resources/textFieldWrapper',
      'js!WS.Data/Type/descriptor',
      'Core/detection',
      'js!SBIS3.CONTROLS.Utils.GetTextWidth',
      'css!WSControls/TextBoxes/TextBox'
   ],
   function(TextBoxBase, template, textFieldWrapper, types, detection, getTextWidth) {

      'use strict';

      var TextBox = TextBoxBase.extend({
         /**
          * beforeFieldWrapper
          * @cfg {Function} Шаблон до поля ввода текста.
          *
          * textFieldWrapper
          * @cfg {Function} Шаблон поля ввода текста.
          *
          * afterFieldWrapper
          * @cfg {Function} Шаблон после поля ввода текста.
          *
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
          * informationIconColor
          * @cfg {String} Включает отображение информационной иконки в поле ввода.
          * @remark
          * Для взаимодействия с информационной иконкой используются два события
          * (@see onInformationIconMouseEnter) и (@see onInformationIconActivated).
          * @variation done
          * @variation attention
          * @variation disabled
          * @variation error
          * @variation primary
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
          *
          * textTransform
          * @cfg {String} Устанавливает форматирование регистра текстового значения в поле ввода.
          * @variant uppercase Все символы верхним регистром.
          * @variant lowercase Все символы нижним регистром.
          */
         _controlName: 'WSControls/TextBoxes/TextBox',

         _template: template,

         _type: 'text',

         constructor: function(options) {
            TextBox.superclass.constructor.call(this, options);

            this._publish('onInformationIconMouseEnter', 'onInformationIconActivated');
         },

         _updateState: function(options) {
            this._text = this._calcText(options.text, options);
         },

         _mouseenterInformationIconHandler: function() {
            this._notify('onInformationIconMouseEnter');
         },

         _activatedInformationIconHandler: function() {
            this._notify('onInformationIconActivated');
         },

         _inputHandler: function(event) {
            var
               target = event.target,
               caretPosition = target.selectionEnd,
               defaultText, pathTwo, pathOne, validText,
               selectSize, text, inputText, isChangeText = true;

            if (event.nativeEvent.inputType !== 'deleteContentBackward') {
               text = target.value;
               defaultText = this._text;

               if (text !== defaultText) {
                  selectSize = this._selectionEnd - this._selectionStart;
                  pathTwo = text.substring(caretPosition);
                  pathOne = defaultText.substring(0, defaultText.length - pathTwo.length - selectSize);
                  inputText = text.slice(pathOne.length, -pathTwo.length || text.length);
                  validText = this._calcText(inputText, this._options);
                  caretPosition += validText.length - inputText.length;
                  target.value = pathOne + validText + pathTwo;

                  if (!validText) {
                     isChangeText = false;
                  }
               } else {
                  isChangeText = false;
               }
            }

            target.selectionStart = target.selectionEnd = this._selectionStart = this._selectionEnd = caretPosition;

            if (isChangeText) {
               TextBox.superclass._inputHandler.call(this, event);
            }
         },

         _mouseenterHandler: function(event) {
            var target = event.target;
            this._tooltip = this._calcTooltip(target.scrollWidth, target.clientWidth, this._options);
         },

         _focusHandler: function(event) {
            if (!this._options.selectOnClick) {
               event.target.select();
            }
         },

         _selectHandler: function(event) {
            var target = event.target;

            this._selectionStart = target.selectionStart;
            this._selectionEnd = target.selectionEnd;
         },

         _keydownHandler: function(event) {
            var caretPosition;

            switch (event.nativeEvent.keyCode) {
               case 37:
                  caretPosition = this._selectionStart - 1;
                  break;
               case 38:
                  caretPosition = 0;
                  break;
               case 39:
                  caretPosition = this._selectionEnd + 1;
                  break;
               case 40:
                  caretPosition = this._text.length;
                  break;
               default:
                  return;
            }

            this._selectionStart = this._selectionEnd = caretPosition;
         },

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

            return validText;
         },

         _calcTooltip: function(scrollWidth, clientWidth, options) {
            var
               tooltip = options.tooltip,
               text = this._text;

            if (detection.isIE) {
               scrollWidth = getTextWidth(text);
            }

            return scrollWidth > clientWidth ? text : tooltip;
         }
      });

      TextBox.getDefaultOptions = function() {
         return {
            textFieldWrapper: textFieldWrapper,
            text: ''
         };
      };

      TextBox.getOptionTypes = function() {
         var optionTypes = TextBoxBase.getOptionTypes();

         optionTypes.trim = types(Boolean);
         optionTypes.textFieldWrapper = types(Function);
         optionTypes.selectOnClick = types(Boolean);
         optionTypes.placeholder = types(String);
         optionTypes.inputRegExp = types(String);
         optionTypes.informationIconColor = types(String).oneOf([
            'done',
            'attention',
            'disabled',
            'error',
            'primary'
         ]);
         optionTypes.textTransform = types(String).oneOf([
            'uppercase',
            'lowercase'
         ]);

         return optionTypes;
      };
      return TextBox;
   }
);