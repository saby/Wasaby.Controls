define('js!WSControls/Input/Text',
   [
      'Core/Control',
      'tmpl!WSControls/Input/Text/Text',
      'js!WS.Data/Type/descriptor',
      'css!SBIS3.CONTROLS.TextBox'
   ],
   function(Control, template, types) {

      'use strict';

      var TextBox = Control.extend({
         /**
          * @class WSControls.Input.Text
          * @extends Core/Control
          * @control
          * @public
          * @category Input
          * @author Журавлев Максим Сергеевич
          *
          * @event onTagClick Происходит при клике по тегу.
          * @event onTagHover Происходит когда курсор мыши входит в область тега.
          * @event onChangeValue Происходит при изменении текста в поле ввода.
          * @event onInputFinish Происходит при завершении ввода.
          *
          * @name WSControls.Input.Text#value
          * @cfg {String} Значение поля.
          *
          * @name WSControls.Input.Text#trim
          * @cfg {Boolean} Устанавливает режим обрезки пробелов в начале и конце добавляемого текста.
          * @variant true Обрезать пробелы.
          * @variant false Не обрезать пробелы.
          *
          * @name WSControls.Input.Text#tagStyle
          * @cfg {String} Набор цветов для иконки
          * @variant primary #587AB0.
          * @variant done #72BE44.
          * @variant attention #FEC63F.
          * @variant error #EF463A.
          * @variant info #999999.
          *
          * @name WSControls.Input.Text#maxLength
          * @cfg {Number} Устанавливает максимальное количество символов, которое может содержать поле ввода.
          *
          * @name WSControls.Input.Text#placeholder
          * @cfg {String} Устанавливает текст подсказки внутри поля ввода.
          *
          * @name WSControls.Input.Text#selectOnClick
          * @cfg {Boolean} Определяет режим выделения текста в поле ввода при получении фокуса.
          * @variant true Выделять текст.
          * @variant false Не выделять текст.
          *
          * @name WSControls.Input.Text#constraint
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
         _controlName: 'WSControls/Input/Text',

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