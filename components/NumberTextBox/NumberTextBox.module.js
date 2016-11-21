/**
 * Created by iv.cheremushkin on 28.08.2014.
 */

define('js!SBIS3.CONTROLS.NumberTextBox', [
   "Core/defaultRenders",
   "Core/constants",
   "js!SBIS3.CONTROLS.TextBox",
   "html!SBIS3.CONTROLS.NumberTextBox/resources/NumberTextBoxArrows"
], function ( cDefaultRenders, constants,TextBox, arrowTpl) {

   'use strict';
   /**
    * Поле ввода числа.
    * Можно настроить:
    * <ol>
    *    <li>количество знаков {@link integers в целой части};</li>
    *    <li>количество знаков {@link decimals после запятой};</li>
    *    <li>{@link hideEmptyDecimals прятать ли пустую дробную часть};</li>
    *    <li>запрещение ввода {@link onlyPositive отрицательных чисел};</li>
    *    <li>запрещение ввода {@link onlyInteger дробных чисел};</li>
    *    <li>{@link enableArrows наличие стрелок} для увеличения/уменьшения числа;</li>
    *    <li>{@link text начальное значение}.</li>
    * </ol>
    * @class SBIS3.CONTROLS.NumberTextBox
    * @extends SBIS3.CONTROLS.TextBox
    * @author Крайнов Дмитрий Олегович
    * @demo SBIS3.CONTROLS.Demo.MyNumberTextBox
    *
    * @ignoreOptions independentContext contextRestriction isContainerInsideParent owner stateKey subcontrol textTransform
    * @ignoreOptions element linkedContext handlers parent autoHeight autoWidth horizontalAlignment verticalAlignment
    *
    * @ignoreMethods applyEmptyState applyState findParent getAlignment getEventHandlers getEvents
    * @ignoreMethods getId getLinkedContext getMinHeight getMinSize getMinWidth getOwner getOwnerId getParentByClass
    * @ignoreMethods getParentByName getParentByWindow getStateKey getTopParent getUserData hasEvent hasEventHandlers
    * @ignoreMethods isDestroyed isSubControl makeOwnerName once sendCommand setOwner setStateKey setUserData setValue
    * @ignoreMethods subscribe unbind unsubscribe
    *
    * @ignoreEvents onDragIn onDragMove onDragOut onDragStart onDragStop onStateChanged onChange onReady
    *
    * @cssModifier controls-NumberTextBox__text-align-right Выравнивает содержимое поля ввода по правому краю.
    *
    * @control
    * @public
    * @category Inputs
    * @initial
    * <component data-component='SBIS3.CONTROLS.NumberTextBox'>
    *     <option name="text">0</option>
    * </component>
    */

   var NumberTextBox;
   NumberTextBox = TextBox.extend(/** @lends SBIS3.CONTROLS.NumberTextBox.prototype */ {
      $protected: {
         _inputField: null,
         _caretPosition: [0, 0],
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
             *     <option name="onlyInteger">true</option>
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
             *     <option name="hideEmptyDecimals">true</option>
             * <pre>
             * @see decimals
             */
            hideEmptyDecimals: false,
            /**
             * @cfg {Boolean} Использовать ли кнопки для изменения значения
             * С помощью кнопок можно увеличивать/уменьшать целую часть числа на 1.
             * @example
             * <pre>
             *     <option name="enableArrows">true</option>
             * </pre>
             * @see integers
             * @see onlyInteger
             */
            enableArrows: false,
            /**
             * @cfg {Boolean} Показать разделители триад
             * @example
             * <pre>
             *     <option name="delimiters">true</option>
             * </pre>
             * @see integers
             * @see onlyInteger
             * @see decimals
             */
            delimiters: false,
            /**
             * @cfg {Number} Числовое значение контрола
             * Если установлено, то значение опции text игнорируется.
             * @example
             * <pre>
             *     <option name="numericValue">123.456</option>
             * </pre>
             * @see text
             */
            numericValue: null
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

         this._inputField.bind('blur', function(){
            // Прятать нулевую дробную часть при потере фокуса
            self._hideEmptyDecimals();
         });

         if (typeof this._options.numericValue === 'number' && !isNaN(this._options.numericValue)) {
            this._options.text = this._options.numericValue + '';
         }
         this._options.text = this._formatText(this._options.text, this._options.hideEmptyDecimals);
         this._setNumericValue(this._options.text);
         this._inputField.val(this._options.text);
      },

      init: function() {
         NumberTextBox.superclass.init.apply(this, arguments);
         this._hideEmptyDecimals();
      },

      _inputFocusInHandler: function() {
         // Показывать нулевую дробную часть при фокусировки не зависимо от опции hideEmptyDecimals
         if (this._options.hideEmptyDecimals && this._options.enabled) {
            this._options.text = this._formatText(this._options.text);
            this._inputField.val(this._options.text);
         }
         NumberTextBox.superclass._inputFocusInHandler.apply(this, arguments);
      },

      _checkMaxLength: function(value){
         var
             length = value ? value.replace(/\s/g,'').length : 0;
         return !(this._options.maxLength && length > this._options.maxLength);
      },

      _setText: function(text){
         if (text !== '-' && text !== '.' && text !== ''){
            text = this._formatText(text);
            if (text.indexOf('.') === text.length - 1) {
               this._inputField.val(text);
               this._setCaretPosition(this._caretPosition[0] + 1, this._caretPosition[1] + 1);
               return;
            }
         }
         this._setNumericValue(text);
         this._inputField.val(text);
         this._setCaretPosition(this._caretPosition[0], this._caretPosition[1]);
      },

      setText: function(text){
         var newText = this._isEmptyValue(text) ? text : this._formatText(text);
         this._setNumericValue(newText);
         NumberTextBox.superclass.setText.call(this, newText);
         if(!this.isActive() && this._options.hideEmptyDecimals) {
            this._hideEmptyDecimals();
         }
      },

      _hideEmptyDecimals: function () {
         var value = this._inputField.val();
         if (this._options.hideEmptyDecimals && (value && value.indexOf('.') != -1)){
            while (value[value.length - 1] == '0' || value[value.length - 1] == '.'){
               value = value.substr(0, value.length - 1);
               if (value.indexOf('.') == -1) { // удаляем только дробную часть
                  break;
               }
            }
         }
         this._inputField.val(value);
      },

       /**
        * Возвращает текущее числовое значение поля ввода.
        * @returns {Number} Текущее значение поля ввода числа.
        * @example
        * <pre>
        *     if (control.getNumericValue() < 19) {
        *        textBox.setEnabled("false");
        *     }
        * </pre>
        */
      getNumericValue: function(){
        var val = this._options.numericValue;
        return (isNaN(val)) ? null : val;
      },

      setNumericValue: function(value) {
         if (value !== this._options.numericValue){
            this._setNumericValue(value);
            this.setText(value + '');
         }
      },

      _setNumericValue: function(value){
         if (typeof(value) == 'string'){
             value = value.replace(/\s+/g,"");
         }
         if (this._options.onlyInteger) {
            this._options.numericValue = parseInt(value);
         } else {
            this._options.numericValue = parseFloat(value);
         }
         this._notifyOnPropertyChanged('numericValue');
      },
      /**
       * Установить количество знаков после запятой
       * @param decimals Количество знаков после запятой
       */
      setDecimals: function(decimals) {
         if (typeof decimals === 'number') {
            this._options.decimals = decimals;
         }
      },

      _updateCompatPlaceholderVisibility: function() {
         if (this._compatPlaceholder) {
            if (typeof this._options.numericValue === 'number' && !isNaN(this._options.numericValue)) {
               this._compatPlaceholder.hide();
            } else {
               NumberTextBox.superclass._updateCompatPlaceholderVisibility.apply(this, arguments);
            }
         }
      },

      /**
       * Получить количество знаков после запятой
       */
      getDecimals: function() {
         return this._options.decimals;
      },

      _formatText: function(value){
         var decimals = this._options.onlyInteger ? 0 : this._options.decimals,
             isDotLast = value.length ? value.indexOf('.') === value.length - 1 : false;

         if (value == '-') {
            return value;
         }
         value = cDefaultRenders.numeric(
            value,
            this._options.integers,
            this._options.delimiters,
            decimals,
            this._options.onlyPositive,
            this._options.maxLength,
            true
         );
         if(isDotLast){
            value = value ? value + '.' : '.';
         }
         if(!this._checkMaxLength(value)){
            return this._options.text;
         }
         return value || '';
      },

      _arrowUpClick: function(){
         this.setNumericValue(this._getSibling(1));
      },

      _arrowDownClick: function(){
         if (!(this._options.onlyPositive && this.getNumericValue() < 1)) {
            this.setNumericValue(this._getSibling(-1));
         }
      },

      _keyDownBind: function (event) {

         if (!this.isEnabled()){
            return false;
         }
         this._caretPosition = this._getCaretPosition();
         if (event.shiftKey){
            this._SHIFT_KEY = true;
         }
         if (event.ctrlKey){
            this._CTRL_KEY = true;
         }
         if (event.which == constants.key.f5   || // F5, не отменяем действие по-умолчанию
            event.which == constants.key.f12   || // F12,не отменяем действие по-умолчанию
            event.which == constants.key.left  || // не отменяем arrow keys (влево, вправо)
            event.which == constants.key.right ||
            event.which == constants.key.end   || // не отменяем home, end
            event.which == constants.key.home
         ) {
            return true;
         }
         var keyCode = (event.which >= 96 && event.which <= 105) ? event.which - 48 : event.which;
         /*точка*/
         if ((keyCode == 190 || keyCode == 110 || keyCode == 191 || keyCode == 188) && (!event.key || event.key == ',' || event.key == '.'|| event.key == 'Decimal')) {
            this._dotHandler(event);
            return;
         }
         if(keyCode == 189 || keyCode == 173 || keyCode == 109/*минус 173 - firefox, 109 - NumPad*/){
            this._toggleMinus();
            event.preventDefault();
         }

         if (keyCode == 46){ /*Delete*/
            this._deleteHandler();
         } else if (keyCode == 8){ /*Backspace*/
            this._backspaceHandler();
         } else if (keyCode >= 48 && keyCode <= 57){ /*Numbers*/
            event.preventDefault();
            this._numberPressHandler(keyCode);
            return true;
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

      _numberPressHandler: function (keyCode) {
         var b = this._caretPosition[0], //начало выделения
            e = this._caretPosition[1],  //конец выделения
            currentVal = this._inputField.val(),
            dotPosition = currentVal.indexOf('.'),
            symbol = String.fromCharCode(keyCode),
            spaceCount = currentVal.split(' ').length - 1,
            checkMaxLength = this._checkMaxLength(currentVal),
            newCaretPosition = b;
         if (currentVal[0] == 0 && b == e && b == 1){ // заменяем первый ноль если курсор после него
            newCaretPosition--;
         }
         if ((b <= dotPosition && e <= dotPosition) || dotPosition == -1) { //до точки
               if (b == e) {
                  if (checkMaxLength) {
                     if (dotPosition == this._options.integers + spaceCount || (dotPosition == -1 && currentVal.length - spaceCount == this._options.integers)) {
                        return;
                     }
                     (this._options.delimiters && this._getIntegersCount(currentVal) % 3 == 0 && currentVal.length) ? newCaretPosition += 2 : newCaretPosition++;
                     currentVal = currentVal.substr(0, b) + symbol + currentVal.substr(e);
                  }
               } else {
                  currentVal = currentVal.substr(0, b) + symbol + currentVal.substr(e);
                  newCaretPosition++;
               }
         } else
         if (b > dotPosition && e > dotPosition){ // после точки
               if (b == e) {
                  if(checkMaxLength || (e <= dotPosition + this._options.decimals)) {
                     currentVal = currentVal.substr(0, b) + symbol + currentVal.substr(e + ((this._options.decimals > 0) ? 1 : 0));
                  }
               } else {
                  currentVal = currentVal.substr(0, b) + symbol + ((this._options.decimals > 0) ? this._getZeroString(e - b - 1) : '') + currentVal.substr(e);
               }
               newCaretPosition++;
         } else { // точка в выделении
            currentVal = currentVal.substr(0, b) + symbol + '.' + ((this._options.decimals > 0) ? this._getZeroString(e - dotPosition - 1) : '') + currentVal.substr(e);
            newCaretPosition = currentVal.indexOf('.');
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
         if(b === 0 && e === currentVal.length){
            currentVal = '';
            newCaretPosition = b;
         } else {
            if ((b <= dotPosition && e <= dotPosition) || dotPosition == -1) { //до точки
               if (b == e) {
                  if (b == dotPosition) {
                     newCaretPosition++;
                  }
                  if (!(this._options.decimals > 0) || (this._options.decimals && b != dotPosition)) {
                     currentVal = currentVal.substr(0, b) + currentVal.substr(e + step);
                  }
               } else {
                  currentVal = currentVal.substr(0, b) + currentVal.substr(e);
               }
               if (this._options.delimiters && this._getIntegersCount(currentVal) % 3 == 0) {
                  newCaretPosition--;
               }
            } else if (b > dotPosition && e > dotPosition) { // после точки
               if (b == e) {
                  currentVal = currentVal.substr(0, b) + (this._options.decimals > 0 ? '0' : '') + currentVal.substr(e + 1);
                  (this._options.decimals > 0) ? newCaretPosition++ : newCaretPosition;
               } else {
                  currentVal = currentVal.substr(0, b) + (this._options.decimals > 0 ? this._getZeroString(e - b) : '') + currentVal.substr(e);
               }
            } else { // точка в выделении
               currentVal = currentVal.substr(0, b) + (this._options.decimals > 0 ? '.' + this._getZeroString(e - dotPosition - 1) : '') + currentVal.substr(e);
               newCaretPosition = (currentVal.indexOf('.') != -1) ? currentVal.indexOf('.') - 1 : currentVal.length;
            }
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
         if(b === 0 && e === currentVal.length){
            currentVal = '';
         } else {
            if ((b <= dotPosition && e <= dotPosition) || dotPosition == -1) { //до точки
               if (b == e) {
                  currentVal = currentVal.substr(0, b - step) + currentVal.substr(e);
               } else {
                  currentVal = currentVal.substr(0, b) + currentVal.substr(e);
               }
               // При удалении последнего символа целой части дроби каретку нужно оставить после 0
               // т.к. если каретку установить перед 0, то при вводе 0 не затрется; было |0.12 стало 0|.12
               if(this._getIntegersCount(currentVal) !== 0 && !this._options.onlyInteger) {
                  (this._options.delimiters && this._getIntegersCount(currentVal) % 3 == 0) ? newCaretPosition -= 2 : newCaretPosition--;
               }
            } else if (b > dotPosition && e > dotPosition) { // после точки
               if (b == e) {
                  if (!(b == dotPosition + 1 && this._options.decimals > 0)) {
                     currentVal = currentVal.substr(0, b - 1) + (this._options.decimals > 0 ? '0' : '') + currentVal.substr(e);
                  }
                  newCaretPosition--;
               } else {
                  currentVal = currentVal.substr(0, b) + (this._options.decimals > 0 ? this._getZeroString(e - b) : '') + currentVal.substr(e);
               }
            } else { // точка в выделении
               currentVal = currentVal.substr(0, b) + (this._options.decimals > 0 ? '.' + this._getZeroString(e - dotPosition - 1) : '') + currentVal.substr(e);
               newCaretPosition = (currentVal.indexOf('.') != -1) ? currentVal.indexOf('.') - 1 : currentVal.length;
            }
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
         return value.substr(0, dotPosition).replace(/\s|-/g, '').length;
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
         NumberTextBox.superclass._keyUpBind.apply(this, arguments);
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
               this._setCaretPosition(this._caretPosition[0] + 1);
            } else {
               this._setText(this._inputField.val().substr(1));
               this._setCaretPosition(this._caretPosition[0] - 1);
            }
            TextBox.superclass.setText.call(this, this._inputField.val());
         }
      },

      _getSibling: function (a) {
         var sibling = this.getNumericValue();
         if ((sibling < 1 && sibling > 0 && a == -1) ||
             (sibling > -1 && sibling < 0 && a == 1)){
            this._toggleMinus();
            return -sibling;
         } else {
            return sibling + a;
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
         if (constants.browser.isIE && constants.browser.IEVersion < 9) { //IE
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
         if (constants.browser.isIE && constants.browser.IEVersion < 9) { //IE
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
