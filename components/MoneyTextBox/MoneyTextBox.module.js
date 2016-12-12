define('js!SBIS3.CONTROLS.MoneyTextBox', [
   "Core/defaultRenders",
   "Core/constants",
   "js!SBIS3.CONTROLS.TextBox",
   "js!SBIS3.CONTROLS.NumberTextBoxMixin",
   "html!SBIS3.CONTROLS.MoneyTextBox"
], function (cDefaultRenders, constants,TextBox, NumberTextBoxMixin, dotTplFn) {

   'use strict';
   /**
    * Денежное поле ввода.
    * @class SBIS3.CONTROLS.MoneyTextBox
    * @extends SBIS3.CONTROLS.TextBox
    * @author Крайнов Дмитрий Олегович
    * @demo SBIS3.CONTROLS.Demo.MyMoneyTextBox
    *
    * @control
    * @public
    * @category Inputs
    * @initial
    * <component data-component='SBIS3.CONTROLS.MoneyTextBox'>
    *     <option name="text">0</option>
    * </component>
    */

   var MoneyTextBox = TextBox.extend([NumberTextBoxMixin],/** @lends SBIS3.CONTROLS.MoneyTextBox.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            delimiters: true,
            decimals: 2,
            money: ''
         },
         _decimalsContainer: null
      },

      $constructor: function () {
         var container = this.getContainer();
         this._inputField = container.find('.controls-MoneyTextBox__input');
         this._decimalsContainer = container.find('.controls-MoneyTextBox__decimals');
         this.setText(this._options.text);
      },

      init: function() {
         MoneyTextBox.superclass.init.apply(this, arguments);
      },

      setEnabled: function(enabled){
         var text = this._inputField.text();
         if(enabled !== this._options.enabled) {
            this._inputField[0].contentEditable = enabled;
             if(!enabled) {
                 this._decimalsContainer[0].innerHTML = text.substring(text.length - 3, text.length);
                 this._setInputValue(this._getIntegerPart(this._getInputValue()));
             }else{
                this._setInputValue(this._options.text);
             }
             MoneyTextBox.superclass.setEnabled.apply(this, arguments);
         }
      },

      _setBindValue: function(value){
         if (typeof(value) == 'string'){
            value = value.replace(/\s+/g,"");
         }
         this._options.money = value;
         this._notifyOnPropertyChanged('moneyValue');
      },

      _getInputValue: function() {
         return this._inputField[0].innerHTML;
      },

      _setInputValue: function(value) {
         this._inputField[0].innerHTML = value;
      },

       _getIntegerPart: function(value) {
           var dotPosition = (value.indexOf('.') != -1) ? value.indexOf('.') : value.length;
           return value.substr(0, dotPosition);
       },

      _formatText: function(value){
         value = value + "";
         var dotPos = value.indexOf('.'),
             integerPart = (dotPos != -1 ? value.substring(0, dotPos) : value).replace(/\s/g,''),
             newText = cDefaultRenders.integer(integerPart, false);
         if( dotPos != -1) {
            newText += (value + "00").substr(dotPos, 3);
         }else {
            newText += ".00";
         }
         return newText;
      },

      /**
       * Возвращает массив содержащий координаты выделения
       * @return {Array} массив содержащий координаты выделения
       */
      _getCaretPosition : function(){
         var selection,
             b,
             e,
             l;

         if(window.getSelection){
            selection = window.getSelection().getRangeAt(0);
            b = selection.startOffset;
            e = selection.endOffset;
         }
         else if(document.selection){
            selection = document.selection.createRange();
            l = selection.text.length;
            selection.moveStart('textedit', -1);
            e = selection.text.length;
            selection.moveEnd('textedit', -1);
            b = e - l;
         }
         return [b,e];
      },
      /**
       * Выставляет каретку в переданное положение
       * @param {Number}  pos    позиция, в которую выставляется курсор
       * @param {Number} [pos2]  позиция правого края выделения
       */
      _setCaretPosition : function(pos, pos2) {
         var input = this._inputField[0].firstChild,
             selection = window.getSelection();

         if(!input){
            return;
         }
         //Оборачиваем вызов selection.collapse в try из за нативной баги FireFox(https://bugzilla.mozilla.org/show_bug.cgi?id=773137)
         try {
            selection.collapse(input, pos);
         } catch (e) {}
      }
   });

   return MoneyTextBox;
});
