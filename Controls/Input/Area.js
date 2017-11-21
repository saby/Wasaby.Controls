define('js!Controls/Input/Area', [
   'Core/Control',
   'Core/constants',
   'js!WS.Data/Type/descriptor',
   'js!Controls/Input/resources/ValidateHelper',
   'tmpl!Controls/Input/Area/Area',
   'css!Controls/Input/Area/Area'
], function(Control, constants, types, ValidateHelper, template) {

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
         var fakeArea = this._container.children().find('.controls-TextArea__fakeField');
         fakeArea[0].children[0].innerText = value;
         _private.checkScroll.call(this);
      },

      checkScroll: function(){
         var fakeArea = this._container.children().find('.controls-TextArea__fakeField')[0];
         var needScroll = fakeArea.scrollHeight - fakeArea.clientHeight > 1;

         if(needScroll !== this._hasScroll){
            this._hasScroll = needScroll;
            this._forceUpdate();
         }
      },

      prepareValue: function(splitValue) {
         var calcValue = splitValue.inputValue;

         if (this._options.constraint) {
            calcValue = ValidateHelper.constraint(calcValue, splitValue, this._options.constraint);
         }

         if (this._options.trim) {
            calcValue = ValidateHelper.trim(calcValue);
         }

         if(this._options.maxLength){
            calcValue = ValidateHelper.maxLength(calcValue, splitValue, this._options.maxLength);
         }

         return {
            value: splitValue.beforeInputValue + calcValue + splitValue.afterInputValue,
            position: splitValue.beforeInputValue.length + calcValue.length
         };
      }
   };

   'use strict';

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
         _private.checkScroll.call(this);
      },

      _beforeUpdate: function(newOptions) {
         _private.setValue.call(this, newOptions.value);
      },

      _changeValueHandler: function(e, value){
         _private.setValue.call(this, value);
         this._notify('valueChanged', value);
      },

      _notifyHandler: function(event, value) {
         this._notify(value);
      },

      _keyDownHandler: function(e){
         if(e.nativeEvent.keyCode === constants.key.enter){
            switch(this._options.newLineKey){
               case 'shiftEnter':
                  !e.nativeEvent.shiftKey && e.preventDefault();
                  break;
               case 'enter':
                  e.nativeEvent.shiftKey && e.preventDefault();
                  break;
            }
          }
      }

   });

   Area.getDefaultOptions = function() {
      return {
         value: '',
         trim: false,
         selectOnClick: true,
         newLineKey: 'enter'
      };
   };

   /*Area.getOptionTypes = function() {
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
          'ctrlEnter',
          'shiftEnter'
          ])
      };
   };*/

   return Area;

});