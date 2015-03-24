/**
 * Created by iv.cheremushkin on 28.08.2014.
 */

define('js!SBIS3.CONTROLS.NumberTextBox', ['js!SBIS3.CONTROLS.TextBox', 'html!SBIS3.CONTROLS.NumberTextBox/resources/NumberTextBoxArrows'], function (TextBox, arrowTpl) {

   'use strict';
   /**
    * Поле ввода числа
    * Можно настроить:
    * <ol>
    *    <li>{@link integers количество знаков в целой части};</li>
    *    <li>{@link decimals количество знаков после запятой};</li>
    *    <li>{@link hideEmptyDecimals прятать ли пустую дробную часть};</li>
    *    <li>{@link onlyPositive запрещение ввода отрицательных чисел};</li>
    *    <li>{@link onlyInteger запрещение ввода дробных чисел};</li>
    *    <li>{@link enableArrows отображать ли стрелки для увеличения/уменьшения числа};</li>
    * </ol>
    * @class SBIS3.CONTROLS.NumberTextBox
    * @extends SBIS3.CONTROLS.TextBox
    * @control
    * @public
    * @demo SBIS3.Demo.Control.MyNumberTextBox
    * @ignoreOptions independentContext contextRestriction
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
             * @cfg {Boolean} Ввод только положительных чисел
             * Возможные значения:
             * <ul>
             *    <li>true - ввод только положительных чисел;</li>
             *    <li>false - нет ограничения на знак вводимых чисел.</li>
             * </ul>
             * @example
             * <pre>
             *     <option name="onlyPositive">true</option>
             * </pre>
             */
            onlyPositive: false,
            /**
             * @cfg {Boolean} Ввод только целых чисел
             * Возможные значения:
             * <ul>
             *    <li>true - ввод только целых чисел;</li>
             *    <li>false - возможен ввод дробных чисел.</li>
             * </ul>
             * @example
             * <pre>
             *     <option name="onlyIntegers">true</option>
             * </pre>
             * @see decimals
             * @see hideEmptyDecimals
             */
            onlyInteger: false,
            /**
             * @cfg {Number} Количество знаков после запятой
             * Опция задаёт ограничение количества знаков дробной части числа.
             * @example
             * <pre>
             *     <option name="decimals">3</option>
             * </pre>
             * @see integers
             * @see hideEmptyDecimals
             */
            decimals: -1,
            /**
             * @cfg {Number} Количество знаков до запятой
             * Опция задаёт ограничение количества знаков в целой части числа.
             * @example
             * <pre>
             *     <option name="integers">4</option>
             * </pre>
             * @see decimals
             */
            integers: 16,
            /**
             * @cfg {Boolean} Прятать нулевую дробную часть
             * Опция позволяет скрыть нулевую дробную часть.
             * @example
             * <pre>
             *     <option name="hideEmtyDecimals">true</option>
             * <pre>
             * @see decimals
             */
            hideEmptyDecimals: false,
            /**
             * @cfg {Boolean} Показать стрелки
             * С помощью стрелок можно увеличивать/уменьшать целую часть числа на 1.
             * @example
             * <pre>
             *     <option name="enableArrows"></option>
             * </pre>
             */
            enableArrows: false,
            /**
             * @cfg {Boolean} Показать разделители триад
             */
            delimiters: false
         }
      },

      $constructor: function () {
         var self = this;
         this.getContainer().addClass('controls-NumberTextBox');
         $('.js-controls-NumberTextBox__arrowDown', this.getContainer().get(0)).click(function () {
            if (self.isEnabled()) {
               self._arrowDownClick();
            }
         });

         $('.js-controls-NumberTextBox__arrowUp', this.getContainer().get(0)).click(function () {
            if (self.isEnabled()) {
               self._arrowUpClick();
            }
         });

         this._options.text = this._formatValue(this._options.text);
         this._inputField.val(this._options.text);
      },

      _setText: function(text){
         if (text !== '-' && text !== '.' && text !== ''){
            if (text.indexOf('.') === text.length - 1) {
               text = this._formatValue(text) + '.';
               this._inputField.val(text);
               this._setCaretPosition(this._caretPosition[0] + 1, this._caretPosition[1] + 1);
               return;
            } else {
               text = this._formatValue(text);
            }
         }
         this._inputField.val(text);
         this._setCaretPosition(this._caretPosition[0], this._caretPosition[1]);
      },

      getNumericValue: function(){
         var val = this._options.text.replace(/\s/g, '');
         if (this._options.onlyInteger) {
            val = parseInt(val);
         } else {
            val = parseFloat(val);
         }
        return (isNaN(val)) ? null : val;
      },

      _formatValue: function(value, fromFocusOut){
         var decimals = (this._options.onlyInteger) ? 0 : this._options.decimals;
         value = $ws.render.defaultColumn.numeric(
            value,
            this._options.integers,
            this._options.delimiters,
            decimals,
            this._options.onlyPositive,
            this._options.maxLength
         );
         if (this._options.hideEmptyDecimals && !(value.indexOf('.') == -1) && fromFocusOut ){
            while (value[value.length - 1] == '0'){
               value = value.substr(0, value.length - 1);
            }
         }
         return value || '';
      },

      _arrowUpClick: function(){
         this.setText(this._getSibling(1));
      },

      _arrowDownClick: function(){
         if (!(this._options.onlyPositive && this.getNumericValue() < 1)) {
            this.setText(this._getSibling(-1));
         }
      },

      _keyDownBind: function (event) {
         this._caretPosition = this._getCaretPosition();
         if (event.shiftKey){
            this._SHIFT_KEY = true;
         }
         if (event.ctrlKey){
            this._CTRL_KEY = true;
         }
         if (event.which == $ws._const.key.f5   || // F5, не отменяем действие по-умолчанию
            event.which == $ws._const.key.f12   || // F12,не отменяем действие по-умолчанию
            event.which == $ws._const.key.left  || // не отменяем arrow keys (влево, вправо)
            event.which == $ws._const.key.right ||
            event.which == $ws._const.key.end   || // не отменяем home, end
            event.which == $ws._const.key.home
         ) {
            return true;
         }
         var symbol = String.fromCharCode(event.which);
         if(event.which == 190 /*точка*/){
            this._dotHandler(event);
            return;
         }
         if(event.which == 189 /*минус*/){
            this._toggleMinus();
            event.preventDefault();
         }
         if (/[0-9]/.test(symbol)){
            this._numberPressHandler(event);
            return true;
         } else if (event.which == 46 /*Delete*/){
            this._deleteHandler();
         } else if (event.which == 8 /*Backspace*/){
            this._backspaceHandler();
         }
         if (this._inputField.val().indexOf('.') == 0){
            this._setText('0' + this._inputField.val());
            this._setCaretPosition(1)
         }
         if (this._CTRL_KEY){
            return true;
         }
         event.preventDefault();
      },

      _numberPressHandler: function (event) {
         var b = this._caretPosition[0], //начало выделения
            e = this._caretPosition[1],  //конец выделения
            currentVal = this._inputField.val(),
            dotPosition = currentVal.indexOf('.'),
            symbol = String.fromCharCode(event.which),
            spaceCount = currentVal.split(' ').length - 1,
            newCaretPosition = b;
         event.preventDefault();
         if (currentVal[0] == 0 && b == e && b == 1){ // заменяем первый ноль если курсор после него
            newCaretPosition--;
         }
         if ((b <= dotPosition && e <= dotPosition) || dotPosition == -1) { //до точки
            if (b == e) {
               if (dotPosition == this._options.integers + spaceCount || (dotPosition == -1 && currentVal.length - spaceCount == this._options.integers)){
                  return;
               }
               (this._options.delimiters && this._getIntegersCount(currentVal) % 3 == 0) ? newCaretPosition+=2 : newCaretPosition++;
               currentVal = currentVal.substr(0, b) + symbol + currentVal.substr(e);
            } else {
               currentVal = currentVal.substr(0, b - 1) + symbol + currentVal.substr(e);
               newCaretPosition++;
            }
         } else
         if (b > dotPosition && e > dotPosition){ // после точки
            if (b == e){
               currentVal = currentVal.substr(0, b) + symbol + currentVal.substr(e + ((this._options.decimals > 0) ? 1 : 0));
            } else {
               currentVal = currentVal.substr(0, b) + symbol + ((this._options.decimals > 0) ? this._getZeroString(e - b - 1) : '') + currentVal.substr(e);
            }
            newCaretPosition++;
         } else { // точка в выделении
            currentVal = currentVal.substr(0, b) + symbol + '.' + ((this._options.decimals > 0) ? this._getZeroString(e - dotPosition - 1) : '') + currentVal.substr(e);
            newCaretPosition = currentVal.indexOf('.') - 1;
         }
         currentVal = currentVal.replace(/\s/g, '');
         this._setText(currentVal);
         this._setCaretPosition(newCaretPosition);
      },

      _deleteHandler: function(){
         var b = this._caretPosition[0], //начало выделения
            e = this._caretPosition[1],  //конец выделения
            currentVal = this._inputField.val(),
            dotPosition = currentVal.indexOf('.'),
            newCaretPosition = e, step;
         (currentVal[b] == ' ') ? step = 2 : step = 1;
         if ((b <= dotPosition && e <= dotPosition) || dotPosition == -1) { //до точки
            if (b == e) {
               if (b == dotPosition){
                  newCaretPosition++;
               }
               if (!(this._options.decimals > 0) || (this._options.decimals && b != dotPosition)) {
                  currentVal = currentVal.substr(0, b) + currentVal.substr(e + step);
               }
            } else {
               currentVal = currentVal.substr(0, b) + currentVal.substr(e);
            }
            if (this._options.delimiters && this._getIntegersCount(currentVal) % 3 == 0){
               newCaretPosition--;
            }
         } else
         if (b > dotPosition && e > dotPosition){ // после точки
            if (b == e){
               currentVal = currentVal.substr(0, b) + (this._options.decimals > 0 ? '0' : '') + currentVal.substr(e + 1);
               (this._options.decimals > 0) ? newCaretPosition++ : newCaretPosition;
            } else {
               currentVal = currentVal.substr(0, b) + (this._options.decimals > 0 ? this._getZeroString(e - b) : '') + currentVal.substr(e);
            }
         } else { // точка в выделении
            currentVal = currentVal.substr(0, b) + (this._options.decimals > 0 ?  '.' + this._getZeroString(e - dotPosition - 1) : '') + currentVal.substr(e);
            newCaretPosition = (currentVal.indexOf('.') != -1) ? currentVal.indexOf('.') - 1 : currentVal.length;
         }
         currentVal = currentVal.replace(/\s/g, '');
         this._setText(currentVal);
         if (newCaretPosition == -1 && this._getIntegersCount(currentVal) == 0){ // если первый 0 перемещаем через него каретку
            newCaretPosition+=2;
         }
         this._setCaretPosition(newCaretPosition + step - 1);
      },

      _backspaceHandler: function(){
         var b = this._caretPosition[0], //начало выделения
            e = this._caretPosition[1],  //конец выделения
            currentVal = this._inputField.val(),
            dotPosition = currentVal.indexOf('.'),
            newCaretPosition = b, step;
         (currentVal[b - 1] == ' ') ? step = 2 : step = 1;
         if ((b <= dotPosition && e <= dotPosition) || dotPosition == -1) { //до точки
            if (b == e) {
               currentVal = currentVal.substr(0, b - step) + currentVal.substr(e);
            } else {
               currentVal = currentVal.substr(0, b) + currentVal.substr(e);
            }
            (this._options.delimiters && this._getIntegersCount(currentVal) % 3 == 0) ? newCaretPosition-=2 : newCaretPosition--;
         } else
         if (b > dotPosition && e > dotPosition){ // после точки
            if (b == e){
               if (!(b == dotPosition + 1 && this._options.decimals > 0)) {
                  currentVal = currentVal.substr(0, b - 1) + (this._options.decimals > 0 ? '0' : '') + currentVal.substr(e);
               }
               newCaretPosition--;
            } else {
               currentVal = currentVal.substr(0, b) + (this._options.decimals > 0 ? this._getZeroString(e - b) : '') + currentVal.substr(e);
            }
         } else { // точка в выделении
            currentVal = currentVal.substr(0, b) +  (this._options.decimals > 0 ? '.' + this._getZeroString(e - dotPosition - 1) : '') + currentVal.substr(e);
            newCaretPosition = (currentVal.indexOf('.') != -1) ? currentVal.indexOf('.') - 1 : currentVal.length;
         }
         currentVal = currentVal.replace(/\s/g, '');
         this._setText(currentVal);
         this._setCaretPosition(newCaretPosition - (step - 1));
      },

      _getZeroString: function(length){
         return '000000000000000000000000000000000'.substr(0, length);
      },

      _getIntegersCount: function(value){
        var dotPosition = (value.indexOf('.') != -1) ? value.indexOf('.') : value.length;
         return value.substr(0, dotPosition).replace(/\s/g, '').length;
      },

      _dotHandler: function(event){
         if (!this._options.onlyInteger) {
            var currentVal = this._inputField.val(),
               dotPosition = currentVal.indexOf('.');
            if (dotPosition != -1) {
               this._setCaretPosition(dotPosition + 1);
            } else {
               currentVal = currentVal.substr(0, this._caretPosition[0]) + '.' + currentVal.substr(this._caretPosition[1]);
               this._setText(currentVal);
            }
         }
         event.preventDefault();
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

      _toggleMinus: function(){
         if (!this._options.onlyPositive) {
            if (this._options.text.indexOf('-') == -1) {
               this._setText('-' + this._inputField.val());
               this._setCaretPosition(this._caretPosition[0] + 1, this._caretPosition[1] + 1);
            } else {
               this._setText(this._inputField.val().substr(1));
               this._setCaretPosition(this._caretPosition[0] - 1, this._caretPosition[1] - 1);
            }
            TextBox.superclass.setText.call(this, this._inputField.val());
         }
      },

      _getSibling: function (a) {
         return this.getNumericValue() + a;
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