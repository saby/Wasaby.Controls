define('Controls/Input/Area', [
   'Controls/Input/Text',
   'Core/constants',
   /*'WS.Data/Type/descriptor',*/
   'Core/detection',
   'tmpl!Controls/Input/Area/Area',
   'Controls/Input/resources/InputHelper',

   'css!Controls/Input/Area/Area'
], function(Text,
            constants,
            /*types,*/
            detection,
            template,
            inputHelper) {

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

      setFakeAreaValue: function(value){
         this._children.fakeAreaValue.innerHTML = value;
      },

      /*
      * Обновляет наличие скролла, в зависимости от того, есть ли скролл на фейковой текст арии
      */
      updateScroll: function(){
         var fakeArea = this._children.fakeArea;
         var fakeAreaWrapper = this._children.fakeAreaWrapper;
         var needScroll = fakeArea.scrollHeight - fakeArea.clientHeight > 1;

         //Определим количество строк в Area сравнив высоты fakeArea и ее обертки
         this._multiline = fakeArea.clientHeight > fakeAreaWrapper.clientHeight;

         //Для IE, текст мы показываем из fakeArea, поэтому сдвинем скролл.
         if(needScroll && detection.isIE){
            fakeArea.scrollTop = this._children.realArea.scrollTop;
         }

         if(needScroll !== this._hasScroll){
            this._hasScroll = needScroll;
            this._forceUpdate();
         }
      }
   };

   var Area = Text.extend({

      _template: template,

      _hasScroll: false,

      _caretPosition: null,

      _multiline: undefined,

      constructor: function(options) {
         Area.superclass.constructor.call(this, options);
         this._multiline = options.minLines > 1;
      },

      _afterMount: function() {
         Area.superclass._afterMount.apply(this, arguments);
         _private.updateScroll.call(this);
      },

      _beforeUpdate: function(newOptions) {
         Area.superclass._beforeUpdate.apply(this, arguments);
         _private.setFakeAreaValue.call(this, newOptions.value);
         _private.updateScroll.call(this);
      },

      _afterUpdate: function(oldOptions) {
         if ((oldOptions.value !== this._options.value) && this._caretPosition) {
            this._children['realArea'].setSelectionRange(this._caretPosition, this._caretPosition);
            this._caretPosition = null;
         }
      },

      _valueChangedHandler: function(e, value){
         _private.setFakeAreaValue.call(this, value);
         _private.updateScroll.call(this);
         this._notify('valueChanged', [value]);
      },

      _setValue: function(value){
         Area.superclass._setValue.apply(this, arguments);
         _private.setFakeAreaValue.call(this, value);
         _private.updateScroll.call(this);
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

      },

      _scrollHandler: function(){
         _private.updateScroll.call(this);
      },

      //TODO убрать (и подписку из Area.tmpl) после выполнения ошибки https://online.sbis.ru/opendoc.html?guid=04b9c78b-7237-4c5a-9045-887a170d8427
      _focusHandler: function(e) {
         this._children.inputRender._focusHandler(e);
      },

      paste: function(text) {
         this._caretPosition = inputHelper.pasteHelper(this._children['inputRender'], this._children['realArea'], text);
      }

   });

   Area.getDefaultOptions = function() {
      return {
         newLineKey: 'enter'
      };
   };

   //TODO раскомментировать этот блок + зависимость types когда полечат https://online.sbis.ru/opendoc.html?guid=1416c4da-b0e0-402b-9e02-a3885dc6cdb8
   /*Area.getOptionTypes = function() {
      return {
         minLines: types(Number),
         maxLines: types(Number),
         newLineKey: types(String).oneOf([
          'enter',
          'ctrlEnter'
         ])
      };
   };*/

   return Area;

});