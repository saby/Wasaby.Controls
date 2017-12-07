define('js!Controls/Input/Text', [
      'Core/Control',
      'Controls/Input/resources/Helper',
      'tmpl!Controls/Input/Text/Text',
      'WS.Data/Type/descriptor',
      'Controls/Input/resources/PrepareData',

      'css!SBIS3.CONTROLS.TextBox',
      'tmpl!Controls/Input/resources/input'
   ], function(Control,
               Helper,
               template,
               types,
               PrepareData) {

      'use strict';

      /**
       * Однострочное текстовое поле ввода.
       * @class Controls/Input/Text
       * @extends Controls/Control
       * @mixes Controls/Input/interface/IInputText
       * @mixes Controls/Input/interface/IInputPlaceholder
       * @mixes Controls/Input/interface/IValidationError
       * @mixes Controls/Input/interface/IInputTag
       * @control
       * @public
       * @category Input
       * @author Журавлев Максим Сергеевич
       */


      /**
       * @name Controls/Input/Text#maxLength
       * @cfg {Number} Максимальное количество символов, которое может содержать поле ввода
       */

      /**
       * @name Controls/Input/Text#trim
       * @cfg {Boolean} Режим обрезки пробелов в начале и конце добавляемого текста
       * @variant true Обрезать пробелы.
       * @variant false Не обрезать пробелы.
       */

         /**
          * @name Controls/Input/Text#selectOnClick
          * @cfg {Boolean} Определяет режим выделения текста в поле ввода при получении фокуса
          * @variant true Выделять текст.
          * @variant false Не выделять текст.
          */

         /**
          * @name  Controls/Input/Text#constraint
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

            if (this.config.constraint) {
               insert = Helper.constraint(insert, this.config.constraint);
            }

            if(this.config.maxLength){
               insert = Helper.maxLength(insert, splitValue, this.config.maxLength);
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

            this._prepareData = new PrepareData(options, _private.prepareData);
         },

         _beforeUpdate: function(newOptions) {
            this._value = newOptions.value;
         },

         _setValue: function(value){
            this._value = value;
         },

         _changeValueHandler: function(event, value) {
            this._setValue(value);
            this._notify('onChangeValue', value);
         },

         _inputCompletedHandler: function(){
            //Если стоит опция trim, то перед завершением удалим лишние пробелы и ещё раз стрельнем valueChanged
            if(this._options.trim){
               var newValue = this._value.trim();
               if(newValue !== this._value){
                  this._setValue(newValue);
                  this._notify('onChangeValue', newValue);
               }
            }

            this._notify('inputCompleted', this._value);
         },

         _notifyHandler: function(event, value) {
            this._notify(value);
         },

         _focusHandler: function(e) {
            if (this._options.selectOnClick) {
               e.target.select();
            }
         }
      });

      TextBox.getDefaultOptions = function() {
         return {
            value: '',
            trim: false,
            selectOnClick: true
         };
      };

      //TODO расскоментировать когда полечат https://online.sbis.ru/opendoc.html?guid=e53e46a0-9478-4026-b7d1-75cc5ac0398b
      /*TextBox.getOptionTypes = function() {
       return {
       trim: types(Boolean),
       selectOnClick: types(Boolean),
       placeholder: types(String),
       constraint: types(String),
       value: types(String),
       maxLength: types(Number)
       };
       };*/

      return TextBox;
   }
);