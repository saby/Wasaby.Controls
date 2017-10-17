define('js!WSControls/TextBoxes/TextBox',
   [
      'Core/Control',
      'tmpl!WSControls/TextBoxes/TextBox',
      'tmpl!WSControls/TextBoxes/resources/textFieldWrapper',
      'js!WS.Data/Type/descriptor',
      'js!WSControls/TextBoxes/resources/CalcInputValue',
      'js!WSControls/TextBoxes/resources/SelectionUtil',
      'Core/Validators/IValidatable',
      'css!SBIS3.CONTROLS.TextBox'
   ],
   function(Control, template, textFieldWrapper, types, calcInputValue, SelectionUtils, Validatable) {

      'use strict';

      var selectionUtils, TextBox;

      function setValue(value) {
         this._value = value;
         this._notify('onChangeValue', value);
      }

      function setValueTarget(target, value, position) {
         target.value = value;
         selectionUtils.updateSelectionPositionTarget(target, position, position);
         selectionUtils.updateSelectionPosition(target);
      }

      function getInputValue(target) {
         var
            oldValue = this._value,
            newValue = target.value,
            caretPosition = target.selectionEnd,
            splitValue, calcValue;

         splitValue = calcInputValue.getSplitInputValue(oldValue, newValue, caretPosition, selectionUtils.selectionEnd - selectionUtils.selectionStart);
         calcValue = this._calcValue(splitValue.inputValue, this._options);

         return {
            value: splitValue.beforeInputValue + calcValue + splitValue.afterInputValue,
            position: splitValue.beforeInputValue.length + calcValue.length
         };
      }

      selectionUtils = new SelectionUtils();

      TextBox = Control.extend([Validatable], {
         /**
          * @event onTagClick Происходит при клике по тегу.
          * @event onTagHover Происходит когда курсор мыши входит в область тега.
          * @event onChangeValue Происходит при изменении текста в поле ввода.
          * @event onInputFinish Происходит при завершении ввода.
          *
          * value
          * @cfg {String} Значение поля.
          *
          * trim
          * @cfg {Boolean} Устанавливает режим обрезки пробелов в начале и конце добавляемого текста.
          * @variant true Обрезать пробелы.
          * @variant false Не обрезать пробелы.
          *
          * tagStyle
          * @cfg {String} Набор цветов для иконки
          * @variant primary #587AB0.
          * @variant done #72BE44.
          * @variant attention #FEC63F.
          * @variant error #EF463A.
          * @variant info #999999.
          *
          * maxLength
          * @cfg {Number} Устанавливает максимальное количество символов, которое может содержать поле ввода.
          *
          * placeholder
          * @cfg {String} Устанавливает текст подсказки внутри поля ввода.
          *
          * selectOnClick
          * @cfg {Boolean} Определяет режим выделения текста в поле ввода при получении фокуса.
          * @variant true Выделять текст.
          * @variant false Не выделять текст.
          *
          * maskRe
          * @cfg {String} Устанавливает регулярное выражение, в соответствии с которым будет осуществляться валидация вводимых символов.
          * @remark
          * Служит для фильтрации вводимых символов в поле ввода по условию, установленному регулярным выражением.
          * Каждый вводимый символ будет проверяться на соответствие указанному в этой опции регулярному выражению;
          * несоответствующие символы ввести будет невозможно.
          * @example
          * Разрешен ввод только цифр:
          * <pre class="brush:xml">
          *     <option name="maskRe">[0-9]</option>
          * </pre>
          * Разрешен ввод только кириллицы:
          * <pre class="brush:xml">
          *     <option name="maskRe">[а-яА-ЯёЁ]</option>
          * </pre>
          */
         _controlName: 'WSControls/TextBoxes/TextBox',

         _template: template,

         _textFieldWrapper: textFieldWrapper,

         _valueHolder: '_value',

         constructor: function(options) {
            TextBox.superclass.constructor.call(this, options);

            this._publish('onChangeValue', 'onInputFinish', 'onTagClick', 'onTagHover');
         },

         _beforeMount: function(options) {
            this._value = options.value;
         },

         _beforeUpdate: function(newOptions) {
            this._value = newOptions.value;
         },

         /**
          * Обработчик ввода.
          * @param event
          * @private
          */
         _inputHandler: function(event) {
            var target = event.target, inputValue;

            if (target.value === this._value) {
               return;
            }

            if (event.nativeEvent.inputType === 'deleteContentBackward') {
               setValue.call(this, target.value);
            } else {
               inputValue = getInputValue.call(this, target);
               setValueTarget.call(this, target, inputValue.value, inputValue.position);
               if (this._value !== inputValue.value) {
                  setValue.call(this, inputValue.value);
               }
            }
         },

         /**
          * Обработчик завершения ввода.
          * @param event
          * @private
          */
         _changeHandler: function(event) {
            this._notify('onInputFinish');
         },

         _notifyHandler: function(event, value) {
            this._notify(value);
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
          * @param value текст.
          * @param options опции.
          * @returns {String}
          * @private
          */
         _calcValue: function(value, options) {
            var
               isTrim = options.trim,
               maskRe = options.maskRe,
               validValue;

            if (maskRe) {
               validValue = '';

               value.replace(new RegExp(maskRe, 'g'), function(validSymbol) {
                  validValue += validSymbol;
               });
            } else {
               validValue = value;
            }

            if (isTrim) {
               validValue = validValue.trim();
            }

            return validValue.substring(0, options.maxLength);
         }
      });

      TextBox.getDefaultOptions = function() {
         return {
            value: ''
         };
      };

      TextBox.getOptionTypes = function() {
         return {
            trim: types(Boolean),
            selectOnClick: types(Boolean),
            placeholder: types(String),
            maskRe: types(String),
            value: types(String),
            maxLength: types(Number)
         };
      };
      return TextBox;
   }
);