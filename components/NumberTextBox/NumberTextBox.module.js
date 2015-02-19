/**
 * Created by iv.cheremushkin on 28.08.2014.
 */

define('js!SBIS3.CONTROLS.NumberTextBox', ['js!SBIS3.CONTROLS.TextBox', 'html!SBIS3.CONTROLS.NumberTextBox/resources/NumberTextBoxArrows'], function (TextBox, arrowTpl) {

   'use strict';
   /**
    * Поле ввода, куда можно вводить только числовые значения
    * @class SBIS3.CONTROLS.NumberTextBox
    * @extends SBIS3.CONTROLS.TextBox
    * @control
    * @public
    */

   var NumberTextBox;
   NumberTextBox = TextBox.extend(/** @lends SBIS3.CONTROLS.NumberTextBox.prototype */ {
      $protected: {
         _inputField: null,
         _caretPosition: null,
         _SHIFT_KEY: false,
         _CTRL_KEY: false,
         _options: {
            afterFieldWrapper: arrowTpl,
            /**
             * @cfg {Boolean} Признак ввода только положительных чисел
             * Возможные значения:
             * <ul>
             *    <li>true - ввод только положительных чисел;</li>
             *    <li>false - нет ограничения на знак вводимых чисел.</li>
             * </ul>
             */
            onlyPositive: false,
            /**
             * @cfg {Boolean} Признак ввода только целых чисел
             * Возможные значения:
             * <ul>
             *    <li>true - ввод только целых чисел;</li>
             *    <li>false - возможен ввод дробных чисел.</li>
             * </ul>
             */
            onlyInteger: false,
            /**
             * @cfg {Number} Количество знаков после запятой
             * <wiTag group='Управление'>
             */
            decimals: 0,
            /**
             * @cfg {Number} Количество знаков до запятой
             * <wiTag group='Управление'>
             */
            integers: 16,
            /**
             * @cfg {Boolean} Прятать пустые копейки
             * <wiTag group='Управление'>
             */
            hideEmptyDecimals: false,
            /**
             * @cfg {Boolean} Показать стрелки
             */
            enableArrows: false
         }
      },

      $constructor: function () {
         var self = this;
         this.getContainer().addClass('controls-NumberTextBox');
         $('.js-controls-NumberTextBox__arrowDown', this.getContainer().get(0)).click(function () {
            if (self.isEnabled()) {
               self._arrowUpClick();
            }
         });

         $('.js-controls-NumberTextBox__arrowUp', this.getContainer().get(0)).click(function () {
            if (self.isEnabled()) {
               self._arrowDownClick();
            }
         });

         // Сразу отрезаем лишнее
         if (this._options.decimals && !this._options.onlyInteger){
            this._options.text = parseFloat(this._options.text).toFixed(self._options.decimals);
            if (isNaN(this._options.text)){
               this._options.text = '';
            }
            this._inputField.val(this._options.text);
         }

         if (this._options.onlyInteger && this._options.text.indexOf('.') != -1){
            this._options.text = this._options.text.substr(0, this._options.text.indexOf('.'));
            this._inputField.val(this._options.text);
         }
      },

      setText: function (text) {
         var self = this;
         if (self._options.decimals && !self._options.onlyInteger) {
            text = parseFloat(text).toFixed(self._options.decimals);
         }
         NumberTextBox.superclass.setText.call(self, text);
      },

      getText: function(){
         if (this._options.onlyInteger) {
            return parseInt(this._options.text, 10);
         } else {
            return parseFloat(this._options.text);
         }
      },

      _pasteHandler: function(){
         var buff;
         if (this._options.onlyInteger) {
            TextBox.superclass.setText.call(this, parseInt(this._inputField.val(), 10) || '0');
            this._inputField.val(parseInt(this._inputField.val(), 10) || '0');
         } else {
            buff =  parseFloat(this._inputField.val()).toFixed(this._options.decimals);
            if (isNaN(buff)){
               TextBox.superclass.setText.call(this, '');
               this._inputField.val('');
            } else {
               TextBox.superclass.setText.call(this, parseFloat(this._inputField.val()).toFixed(this._options.decimals) || '0');
               this._inputField.val(parseFloat(this._inputField.val()).toFixed(this._options.decimals) || '0');
            }
         }
      },

      _arrowUpClick: function(){
         this.setText(this._getSibling(this.getText(), -1));
      },

      _arrowDownClick: function(){
         this.setText(this._getSibling(this.getText(), 1));
      },

      _keyDownBind: function (e) {

         if (e.which == 16){
            this._SHIFT_KEY = true;
         }
         if (e.which == 17){
            this._CTRL_KEY = true;
         }
         var symbol = String.fromCharCode(e.which);
         this._caretPosition = this._getCaretPosition();

         if(e.which == 190 && !this._options.onlyInteger){
            this._dotHandler(e);
            return;
         }
         if(e.which == 189 && !this._options.onlyPositive){
            this._toggleMinus();
            e.preventDefault();
         }
         if (/[0-9]/.test(symbol)){
            this._numberPressHandler(e);
            return true;
         }

         if (e.which == 46){
            this._deleteHandler();
         } else if (e.which == 8){
            this._backspaceHandler();
         } else
         if (  e.which == $ws._const.key.f5    || // F5, не отменяем действие по-умолчанию
               e.which == $ws._const.key.f12   || // F12,не отменяем действие по-умолчанию
               e.which == $ws._const.key.left  || // не отменяем arrow keys (влево, вправо)
               e.which == $ws._const.key.right ||
               e.which == $ws._const.key.end   || // не отменяем home, end
               e.which == $ws._const.key.home
         ) {
            return true;
         }
         if (this._inputField.val().indexOf('.') == 0){
            this._inputField.val('0' + this._inputField.val());
            this._setCaretPosition(1)
         } else if (this._inputField.val().indexOf('.') == this._inputField.val().length - 1){
            this._inputField.val(this._inputField.val().substr(0, this._inputField.val().length - 1));
         }
         if (this._CTRL_KEY){
            return true;
         }
         e.preventDefault();
      },

      _deleteHandler: function(){
         var b = this._caretPosition[0], //начало выделения
            e = this._caretPosition[1],  //конец выделения
            currentVal = this._inputField.val(),
            dotPosition = currentVal.indexOf('.'), buff;
         // не удаляем точку
         if (b == e && b == dotPosition){
            this._setCaretPosition(b + 1);
            return;
         }
         // заменяем нулями дробную часть при удалении
         if (!this._options.onlyInteger && this._options.decimals && dotPosition < b) {
            if (e == b && b != currentVal.length ) {
               buff = currentVal.substr(0, b) + this._getZeroString(e - b + 1) + currentVal.substr(e + 1);
               this._inputField.val(buff);
               this._setCaretPosition(e + 1);
            } else {
               buff = currentVal.substr(0, b) + this._getZeroString(e - b) + currentVal.substr(e);
               this._inputField.val(buff);
               this._setCaretPosition(e);
            }
         } else
         if (dotPosition >= b && dotPosition < e) {
            buff = currentVal.substr(0, b) + '.' + this._getZeroString(e - dotPosition - 1) + currentVal.substr(e);
            this._inputField.val(buff);
            this._setCaretPosition(b);
         } else {
            if (b == e) {
               buff = currentVal.substr(0, b) + currentVal.substr(e + 1);
            } else {
               buff = currentVal.substr(0, b) + currentVal.substr(e);
            }
            this._inputField.val(buff);
            this._setCaretPosition(b);
         }
      },

      _backspaceHandler: function(){
         var b = this._caretPosition[0], //начало выделения
            e = this._caretPosition[1],  //конец выделения
            currentVal = this._inputField.val(),
            dotPosition = currentVal.indexOf('.'), buff;
         // не удаляем точку
         if (b == e && b == dotPosition + 1){
            this._setCaretPosition(b - 1);
            return;
         }
         // заменяем нулями дробную часть при удалении
         if (!this._options.onlyInteger && this._options.decimals && dotPosition + 1 < b) {
            if (e == b) {
               buff = currentVal.substr(0, b - 1) + this._getZeroString(e - b + 1) + currentVal.substr(e);
               this._inputField.val(buff);
               this._setCaretPosition(b - 1);
            } else {
               buff = currentVal.substr(0, b) + this._getZeroString(e - b) + currentVal.substr(e);
               this._inputField.val(buff);
               this._setCaretPosition(b);
            }
         } else
         if (dotPosition > b && dotPosition < e) {
            buff = currentVal.substr(0, b) + '.' + this._getZeroString(e - dotPosition - 1) + currentVal.substr(e);
            this._inputField.val(buff);
            this._setCaretPosition(b);
         } else if (((dotPosition > b && dotPosition >= e) || this._options.onlyInteger) && b != e) {
            buff = currentVal.substr(0, b) + currentVal.substr(e);
            this._inputField.val(buff);
            this._setCaretPosition(b);
         } else
         if (b == e){
            buff = currentVal.substr(0, b - 1) + currentVal.substr(e);
            this._inputField.val(buff);
            this._setCaretPosition(b - 1);
         }
      },

      _getZeroString: function(length){
         return '000000000000000000000000000000000'.substr(0, length);
      },

      _dotHandler: function(event){
         var dotPosition = this._inputField.val().indexOf('.');
         if (dotPosition != -1) {
            this._setCaretPosition(dotPosition + 1);
            event.preventDefault();
         }
      },

      _keyUpBind: function(e){
         NumberTextBox.superclass._keyUpBind.call(this);
         if (e.which == 16){
            this._SHIFT_KEY = false;
         }
         if (e.which == 17){
            this._CTRL_KEY = false;
         }
      },

      _numberPressHandler: function(event){
         var b = this._caretPosition[0], //начало выделения
            e = this._caretPosition[1],  //конец выделения
            currentVal = this._inputField.val(),
            dotPosition = currentVal.indexOf('.'), buff;

         if (!this._options.onlyInteger) {
            // добаляем нули в пустое поле
            if (currentVal == ''){
               this._inputField.val('.' + this._getZeroString(this._options.decimals));
               this._setCaretPosition(0);
               return true;
            }

            // если точка в выделении
            if (dotPosition >= b && dotPosition < e) {
               buff = currentVal.substr(0, b) + '.' + this._getZeroString(e - dotPosition - 1) + currentVal.substr(e);
               if (dotPosition == b) {
                  event.preventDefault();
               }
               this._inputField.val(buff);
               this._setCaretPosition(b);
            } else

            // если выделение после точки
            if (this._options.decimals && dotPosition < b) {
               if (b !== e) {
                  buff = currentVal.substr(0, b) + this._getZeroString(e - b - 1) + currentVal.substr(e);
                  this._inputField.val(buff);
                  this._setCaretPosition(b);
               } else if (b != currentVal.length) {
                  buff = currentVal.substr(0, b) +
                  currentVal.substr(b + 1, currentVal.length);
                  this._inputField.val(buff);
                  this._setCaretPosition(b);
               } else {
                  // если установлено количество знаков после запятой, не даем вводить больше
                  if (this._options.decimals) {
                     event.preventDefault();
                  }
               }
            } else

            // если выделение до точки
            if (dotPosition >= e) {
               if (dotPosition >= this._options.integers && b == e) {
                  event.preventDefault();
               }
            }
         } else {
            if (this._options.integers && currentVal.length - (e - b) >= this._options.integers){
               event.preventDefault();
            }
         }
         // не даем вводить нули в начало
         if (((b == e && b == 0) || (this._inputField.val().indexOf('0') == 0 && b == e && b == 1)) && event.which == 48){
            event.preventDefault();
         }
         // заменяем первый ноль
         if (this._inputField.val().indexOf('0') == 0 && b == e && b == 1){
            this._inputField.val(this._inputField.val().substr(1));
            this._setCaretPosition(0);
         }
      },

      _toggleMinus: function(){
         if (this._options.text.indexOf('-') == -1){
            this._inputField.val('-' + this._inputField.val());
            this._setCaretPosition(this._caretPosition[0] + 1, this._caretPosition[1] + 1);
         } else {
            this._inputField.val(this._inputField.val().substr(1));
            this._setCaretPosition(this._caretPosition[0] - 1, this._caretPosition[1] - 1);
         }
         TextBox.superclass.setText.call(this, this._inputField.val());
      },

      _getSibling: function ( val, a) {
         var self = this,
             value = val;
         if (value === '') {
            value = '0';
         }
         if (a == 1) {
            value = parseFloat(value) + 1;
         }
         if (a == -1 && !(self._options.onlyPositive && parseFloat(value) < 1 )) {
            value = parseFloat(value) - 1;
         }
         if (self._options.decimals && !self._options.onlyInteger) {
            return(parseFloat(value).toFixed(self._options.decimals));
         } else {
            return(value.toString());
         }
      },

      /**
       * Возвращает массив содержащий координаты выделения
       * @return {Array} массив содержащий координаты выделения
       */
      _getCaretPosition : function(){
         var
            obj = this._inputField.get(0),
            b,
            e,
            l;
         if (document.selection){                        //IE
            var range = document.selection.createRange();
            l = range.text.length;
            range.moveStart('textedit', -1);
            e = range.text.length;
            range.moveEnd('textedit', -1);
            b = e - l;
         }
         else
         {
            b = obj.selectionStart;
            e = obj.selectionEnd;
         }
         return [b,e];
      },
      /**
       * Выставляет каретку в переданное положение
       * @param {Number}  pos    позиция, в которую выставляется курсор
       * @param {Number} [pos2]  позиция правого края выделения
       */
      _setCaretPosition : function(pos, pos2){
         pos2 = pos2 || pos;
         var obj = this._inputField.get(0);
         if(document.selection){              // IE
            var r = obj.createTextRange();
            r.collapse(true);
            r.moveStart("character", pos);
            r.moveEnd("character", pos2-pos); // Оказывается moveEnd определяет сдвиг, а не позицию
            r.select();
         }
         else
         {
            obj.setSelectionRange(pos, pos2);
            obj.focus();
         }
      }

   });

   return NumberTextBox;

});