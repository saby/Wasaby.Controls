define('js!Controls/Input/Text',
   [
      'Core/Control',
      'js!Controls/Input/resources/Helper',
      'tmpl!Controls/Input/Text/Text',
      'js!WS.Data/Type/descriptor',
      'css!SBIS3.CONTROLS.TextBox',
      'tmpl!Controls/Input/resources/input'
   ],
   function(Control, Helper, template, types) {

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

         //Валидирует и подготавливает новое значение по splitValue
         prepareData: function(splitValue) {
            var insert = splitValue.insert;

            if (this._options.constraint) {
               insert = Helper.constraint(insert, this._options.constraint);
            }

            if (this._options.trim) {
               insert = insert.trim();
            }

            if(this._options.maxLength){
               insert = Helper.maxLength(insert, splitValue, this._options.maxLength);
            }

            return {
               value: splitValue.before + insert + splitValue.after,
               position: splitValue.before.length + insert.length
            };
         }

      };

      var TextBox = Control.extend({

         _controlName: 'Controls/Input/Text',
         _template: template,

         constructor: function(options) {
            TextBox.superclass.constructor.call(this, options);

            this._value = options.value;
            this._prepareData = _private.prepareData.bind(this);
         },

         _beforeUpdate: function(newOptions) {
            this._value = newOptions.value;
         },

         _changeValueHandler: function(event, value) {
            this._value = value;
            this._notify('onChangeValue', value);
         },

         _inputCompletedHandler: function(){
            //Если стоит опция trim, то перед завершением удалим лишние пробелы и ещё раз стрельнем valueChanged
            if(this._options.trim){
               var newValue = this._value.trim();
               if(newValue !== this._value){
                  this._value = newValue;
                  this._notify('onChangeValue', newValue);
               }
            }

            this._notify('inputCompleted', this._value);
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