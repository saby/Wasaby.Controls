define('js!WSControls/TextBoxes/TextBox',
   [
      'js!WSControls/TextBoxes/TextBoxBase',
      'tmpl!WSControls/TextBoxes/TextBox',
      'tmpl!WSControls/TextBoxes/resources/textFieldWrapper',
      'js!WS.Data/Type/descriptor',
      'css!WSControls/TextBoxes/TextBox'
   ],
   function(TextBoxBase, template, textFieldWrapper, types) {

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

         /**
          * Обновление текста. Переобпределяется в наследниках, если нужно изменить значение текста, в соответствии с опциями.
          * @param options
          * @private
          */
         _updateText: function(options) {
            this._text = this._calcText(options.text, options);
         },

         /**
          * Обновление позиций выделения.
          * @param target
          * @private
          */
         _updateSelectionPosition: function(target) {
            this._selectionStart = target.selectionStart;
            this._selectionEnd = target.selectionEnd;
         },

         _updateSelectionPositionTarget: function(target, position) {
            target.selectionStart = target.selectionEnd = position;
         },

         /**
          * Обработчик ввода.
          * @param event
          * @private
          */
         _inputHandler: function(event) {
            /**
             * При вводе текста компонент должен расчитать новое текстовое значение и проверить изменилось ли оно.
             *
             * Для расчета нужно определить введенный текст.
             * Если произошло удаление, то введённого текста нет.
             * В противном случае будем действовать по следующему алгоритму:
             *    1. Определяем текст после введённого(end). Им является текст после введённого в новом текстовом значении.
             *    2. Определяем текст до введенного(start). Им является текст до end в старом текстовом значении с учетом,
             *    что могло быть выделение и часть start была заменена введённым текстом.
             *    3. Определяем введённый текст. Им является текст между start и end в новом текстовом значении.
             *    4. Производим расчет введённого текста и полученное значение вставляем между текстом start и end.
             * Так получаем искомый результат.
             *
             * Для проверки изменилось ли новое текстовое значение, сравним старое текстовое значение и текст полученный во
             * время расчета.
             * Такая проверка нужна для ситуаций, когда был выделен текст и вставлен тот же самый выделенный текст.
             */
            var
               target = event.target,
               isChangeText = true,
               caretPosition = target.selectionEnd,
               oldText, newText, inputText,
               startText, validText, endText;

            if (event.nativeEvent.inputType !== 'deleteContentBackward') {
               newText = target.value;
               oldText = this._text;

               if (newText !== oldText) {
                  endText = newText.substring(caretPosition);
                  startText = oldText.substring(0, oldText.length - endText.length - this._selectionEnd + this._selectionStart);
                  inputText = newText.substring(startText.length, newText.length - endText.length);
                  validText = this._calcText(inputText, this._options);
                  caretPosition += validText.length - inputText.length;
                  target.value = startText + validText + endText;
                  this._updateSelectionPositionTarget(target, caretPosition);

                  if (target.value === oldText) {
                     isChangeText = false;
                  }
               } else {
                  isChangeText = false;
               }
            }

            this._updateSelectionPosition(target);

            if (isChangeText) {
               TextBox.superclass._inputHandler.call(this, event);
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
            this._updateSelectionPosition(event.target);
         },

         /**
          * Обработчик клика.
          * @param event
          * @private
          */
         _clickHandler: function(event) {
            this._updateSelectionPosition(event.target);
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
               this._updateSelectionPosition(event.target);
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

            return validText;
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
         optionTypes.textTransform = types(String).oneOf([
            'uppercase',
            'lowercase'
         ]);

         return optionTypes;
      };
      return TextBox;
   }
);