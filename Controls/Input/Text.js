define('js!Controls/Input/Text', [
      'Core/Control',
      'tmpl!Controls/Input/Text/Text',
      /*'WS.Data/Type/descriptor',*/
      'Controls/Input/Text/ViewModel',

      'css!SBIS3.CONTROLS/TextBox',
      'tmpl!Controls/Input/resources/input'
   ], function(Control,
               template,
               /*types,*/
               TextViewModel) {

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

      var TextBox = Control.extend({
         _controlName: 'Controls/Input/Text',
         _template: template,

         constructor: function(options) {
            TextBox.superclass.constructor.call(this, options);

            this._value = options.value;

            this._textViewModel = new TextViewModel({
               constraint: options.constraint,
               maxLength: options.maxLength
            });
         },

         _beforeUpdate: function(newOptions) {
            this._value = newOptions.value;
         },

         _setValue: function(value){
            this._value = value;
         },

         _changeValueHandler: function(event, value) {
            this._setValue(value);
            this._notify('valueChanged', value);
         },

         _inputCompletedHandler: function(){
            //Если стоит опция trim, то перед завершением удалим лишние пробелы и ещё раз стрельнем valueChanged
            if(this._options.trim){
               var newValue = this._value.trim();
               if(newValue !== this._value){
                  this._setValue(newValue);
                  this._notify('valueChanged', newValue);
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

      //TODO расскоментировать этот блок + зависимость types когда полечат https://online.sbis.ru/opendoc.html?guid=e53e46a0-9478-4026-b7d1-75cc5ac0398b
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