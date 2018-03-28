define('Controls/Input/Text', [
      'Core/Control',
      'tmpl!Controls/Input/Text/Text',
      /*'WS.Data/Type/descriptor',*/
      'Controls/Input/Text/ViewModel',
      'Controls/Input/resources/InputHelper',

      'css!Controls/Input/resources/InputRender/InputRender',
      'tmpl!Controls/Input/resources/input'
   ], function(Control,
               template,
               /*types,*/
               TextViewModel,
               inputHelper) {

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
         _template: template,
         _caretPosition: null,

         constructor: function(options) {
            TextBox.superclass.constructor.call(this, options);

            this._textViewModel = new TextViewModel({
               constraint: options.constraint,
               maxLength: options.maxLength,
               value: options.value
            });
         },

         _beforeUpdate: function(newOptions) {
            this._textViewModel.updateOptions({
               constraint: newOptions.constraint,
               maxLength: newOptions.maxLength,
               value: newOptions.value
            });
         },

         _afterUpdate: function(oldOptions) {
            if ((oldOptions.value !== this._options.value) && this._caretPosition) {
               this._children['input'].setSelectionRange(this._caretPosition, this._caretPosition);
               this._caretPosition = null;
            }
         },

         _inputCompletedHandler: function(){
            //Если стоит опция trim, то перед завершением удалим лишние пробелы и ещё раз стрельнем valueChanged
            if(this._options.trim){
               var newValue = this._options.value.trim();
               if(newValue !== this._options.value){
                  this._notify('valueChanged', [newValue]);
               }
            }

            this._notify('inputCompleted', [this._options.value]);
         },

         _notifyHandler: function(event, value) {
            this._notify(value);
         },

         _valueChangedHandler: function(e, value) {
            this._notify('valueChanged', [value]);
         },

         paste: function(text) {
            this._caretPosition = inputHelper.pasteHelper(this._children['inputRender'], this._children['input'], text);
         }
      });

      TextBox.getDefaultOptions = function() {
         return {
            trim: false,
            selectOnClick: true
         };
      };

      //TODO расскоментировать этот блок + зависимость types когда полечат https://online.sbis.ru/opendoc.html?guid=1416c4da-b0e0-402b-9e02-a3885dc6cdb8
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