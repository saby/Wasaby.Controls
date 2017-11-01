define('js!Controls/Input/Text',
   [
      'Core/Control',
      'tmpl!Controls/Input/Text/Text',
      'js!WS.Data/Type/descriptor',
      'css!SBIS3.CONTROLS.TextBox'
   ],
   function(Control, template, types) {

      'use strict';

      var TextBox = Control.extend({

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
         
         _controlName: 'Controls/Input/Text',

         _template: template,

         constructor: function(options) {
            TextBox.superclass.constructor.call(this, options);

            this._publish('onChangeValue', 'onInputFinish', 'onTagClick', 'onTagHover');
         },

         _beforeMount: function(options) {
            this._value = options.value;
            this._getInputData = this._getInputData.bind(this);
         },

         _beforeUpdate: function(newOptions) {
            this._value = newOptions.value;
         },

         /**
          * Обработчик ввода.
          * @param event
          * @private
          */
         _inputHandler: function(event, newValue) {
            if (this._value !== newValue) {
               updateValue.call(this, newValue);
            }
         },


         _getInputData: function (splitValue) {
            var calcValue = calcValueFn(splitValue.inputValue, this._options);

            return {
               value: splitValue.beforeInputValue + calcValue + splitValue.afterInputValue,
               position: splitValue.beforeInputValue.length + calcValue.length
            };
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

      function updateValue(value) {
         this._value = value;
         this._notify('onChangeValue', value);
      }

      /**
       * Метод расчета текста.
       * @param value текст.
       * @param options опции.
       * @returns {String}
       * @private
       */
      function calcValueFn(value, options) {
         var
            isTrim = options.trim,
            constraint = options.constraint,
            validValue;

         if (constraint) {
            validValue = '';

            value.replace(new RegExp(constraint, 'g'), function(validSymbol) {
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

      return TextBox;
   }
);