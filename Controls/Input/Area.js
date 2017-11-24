define('js!Controls/Input/Area', [
   'Core/Control',
   'Core/constants',
   'js!WS.Data/Type/descriptor',
   'js!Controls/Input/resources/ValidateHelper',
   'Core/detection',
   'tmpl!Controls/Input/Area/Area',
   'css!Controls/Input/Area/Area'
], function(Control, constants, types, ValidateHelper, detection, template) {

   'use strict';

   /**
    *
    * Многострочное поле ввода - это текстовое поле с автовысотой.
    * Данное поле может автоматически менять высоту в зависимости от количества введённой информации.
    * @class Controls/Input/Area
    * @extends Controls/Input/Text
    * @control
    * @public
    * @category Input
    * @author Степин Павел Владимирович
    */

   /**
    * @name Controls/Input/Area#minLines
    * @cfg {Number} Минимальное количество строк
    */

   /**
    * @name Controls/Input/Area#maxLines
    * @cfg {Number} Максимальное количество строк
    */

   /**
    * @name Controls/Input/Area#newLineKey
    * @cfg {String} Сочетание клавиш, для перехода на новую строку
    * @variant enter По нажатию Enter
    * @variant ctrlEnter По нажатию Ctrl + Enter
    * @variant shiftEnter По нажатию Shift + Enter.
    */

   var _private = {

      setValue: function(value){
         this._value = value;
         this._children.fakeAreaValue.innerHTML = value;
      },

      //Обновляет наличие скролла, в зависимости от того, есть ли скролл на фейковой текст арии
      updateScroll: function(){
         var fakeArea = this._children.fakeArea;
         var needScroll = fakeArea.scrollHeight - fakeArea.clientHeight > 1;

         //Для IE, текст мы показываем из fakeArea, поэтому обновим скролл.
         if(needScroll && detection.isIE){
            fakeArea.scrollTop = this._children.realArea.scrollTop;
         }

         if(needScroll !== this._hasScroll){
            this._hasScroll = needScroll;
            this._forceUpdate();
         }
      },

      //Валидирует и подготавливает новое значение по splitValue
      prepareValue: function(splitValue) {
         var input = splitValue.input;

         if (this._options.constraint) {
            input = ValidateHelper.constraint(input, this._options.constraint);
         }

         if(this._options.maxLength){
            input = ValidateHelper.maxLength(input, splitValue, this._options.maxLength);
         }

         return {
            value: splitValue.before + input + splitValue.after,
            position: splitValue.before.length + input.length
         };
      }
   };

   var Area = Control.extend({

      _controlName: 'Controls/Input/Area',
      _template: template,

      constructor: function(options) {
         Area.superclass.constructor.apply(this, arguments);

         this._value = options.value;
         this._hasScroll = false;
         this._prepareValue = _private.prepareValue.bind(this);
      },

      _afterMount: function() {
         _private.updateScroll.call(this);
      },

      _beforeUpdate: function(newOptions) {
         _private.setValue.call(this, newOptions.value);
         _private.updateScroll.call(this);
      },

      _changeValueHandler: function(e, value){
         _private.setValue.call(this, value);
         _private.updateScroll.call(this);
         this._notify('valueChanged', value);
      },

      _inputCompletedHandler: function(){
         //Если стоит опция trim, то перед завершением удалим лишние пробелы и ещё раз стрельнем valueChanged
         if(this._options.trim){
            var newValue = this._value.trim();
            if(newValue !== this._value){
               _private.setValue.call(this, newValue);
               _private.updateScroll.call(this);
               this._notify('valueChanged', newValue);
               this._forceUpdate();
            }
         }

         this._notify('inputCompleted', this._value);
      },

      _notifyHandler: function(event, value) {
         this._notify(value);
      },

      _keyDownHandler: function(e){

         //В режиме newLineKey === 'ctrlEnter' будем эмулировать переход на новую строку в ручную
         if(e.nativeEvent.keyCode === constants.key.enter && this._options.newLineKey === 'ctrlEnter'){

            //Обычный enter прерываем
            if(!e.nativeEvent.shiftKey && !e.nativeEvent.ctrlKey){
               e.preventDefault();
            }

            //Вроде не очень хорошо. Но если хотим перенести на новую строку сами, придется вмешиваться.
            if(e.nativeEvent.ctrlKey){
               e.target.value += '\n';
               this._children.inputRender._inputHandler(e);
            }
         }

      }

   });

   Area.getDefaultOptions = function() {
      return {
         value: '',
         trim: false,
         selectOnClick: false,
         newLineKey: 'enter'
      };
   };

   Area.getOptionTypes = function() {
      return {
         value: types(String),
         trim: types(Boolean),
         placeholder: types(String),
         selectOnClick: types(Boolean),
         constraint: types(String),
         minLines: types(Number),
         maxLines: types(Number),
         maxLength: types(Number),
         tagStyle: types(String),
         newLineKey: types(String).oneOf([
          'enter',
          'ctrlEnter'
         ])
      };
   };

   return Area;

});