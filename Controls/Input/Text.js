define('js!Controls/Input/Text',
   [
      'Core/Control',
      'js!Controls/Input/resources/ValidateHelper',
      'tmpl!Controls/Input/Text/Text',
      'js!WS.Data/Type/descriptor',
      'css!SBIS3.CONTROLS.TextBox'
   ],
   function(Control, ValidateHelper, template, types) {

      'use strict';

      /**
       * Однострочное текстовое поле ввода.
       * @class Controls/Input/Text
       * @extends Controls/Control
       * @mixes Controls/Input/interface/IInputText
       * @mixes Controls/Input/interface/IInputPlaceholder
       * @mixes Controls/Input/interface/IValidation
       * @mixes Controls/Input/interface/IInputTag
       * @control
       * @public
       * @category Input
       * @author Журавлев Максим Сергеевич
       */

      /**
       * @name Controls/Input/Text#maxLength
       * @cfg {Number} Максимальное количество символов, которое может содержать поле ввода.
       */

      /**
       * @name Controls/Input/Text#trim
       * @cfg {Boolean} Режим обрезки пробелов в начале и конце добавляемого текста.
       * @variant true Обрезать пробелы.
       * @variant false Не обрезать пробелы.
       */

      /**
       * @name Controls/Input/Text#selectOnClick
       * @cfg {Boolean} Определяет режим выделения текста в поле ввода при получении фокуса.
       * @variant true Выделять текст.
       * @variant false Не выделять текст.
       */

      /**
       * @name Controls/Input/Text#inputCharRegExp
       * @cfg {String} Регулярное выражение, в соответствии с которым будет осуществляться валидация вводимых символов.
       */

      /**
       * @name Controls/Input/Text#constraint
       * @cfg {String} Устанавливает регулярное выражение, в соответствии с которым будет осуществляться валидация вводимых символов.
       * @remark
       * Служит для фильтрации вводимых символов в поле ввода по условию, установленному регулярным выражением.
       * Каждый вводимый символ будет проверяться на соответствие указанному в этой опции регулярному выражению;
       * несоответствующие символы ввести будет невозможно.
       * @example
       * Разрешен ввод только цифр:
       * <pre class="brush:xml">
       *     <option name="constraint">[0-9]</option>
       * </pre>
       * Разрешен ввод только кириллицы:
       * <pre class="brush:xml">
       *     <option name="constraint">[а-яА-ЯёЁ]</option>
       * </pre>
       */


      var _private = {

         prepareValue: function(splitValue) {
            var inputValue = splitValue.inputValue;

            if (this._options.constraint) {
               inputValue = ValidateHelper.constraint(inputValue, this._options.constraint);
            }

            if (this._options.trim) {
               inputValue = inputValue.trim();
            }

            if(this._options.maxLength){
               inputValue = ValidateHelper.maxLength(inputValue, splitValue, this._options.maxLength);
            }

            return {
               value: splitValue.beforeInputValue + inputValue + splitValue.afterInputValue,
               position: splitValue.beforeInputValue.length + inputValue.length
            };
         }

      };

      var TextBox = Control.extend({

         _controlName: 'Controls/Input/Text',
         _template: template,

         constructor: function(options) {
            TextBox.superclass.constructor.call(this, options);

            this._value = options.value;
            this._prepareValue = _private.prepareValue.bind(this);
         },

         _beforeUpdate: function(newOptions) {
            this._value = newOptions.value;
         },

         _changeValueHandler: function(event, value) {
            this._value = value;
            this._notify('onChangeValue', value);
         },

         _notifyHandler: function(event, value) {
            this._notify(value);
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
            constraint: types(String),
            value: types(String),
            maxLength: types(Number)
         };
      };

      return TextBox;
   }
);