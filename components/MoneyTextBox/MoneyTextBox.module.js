/**
 * Created by iv.cheremushkin on 28.08.2014.
 */

define('js!SBIS3.CONTROLS.MoneyTextBox', [
   'Core/defaultRenders',
   'Core/constants',
   'js!SBIS3.CONTROLS.NumberTextBox',
   'js!SBIS3.CONTROLS.Utils.NumberTextBoxUtil',
   'tmpl!SBIS3.CONTROLS.MoneyTextBox/resources/textFieldWrapper',
   'css!SBIS3.CONTROLS.MoneyTextBox'
], function (cDefaultRenders, constants, NumberTextBox, NumberTextBoxUtil, textFieldWrapper) {

   'use strict';

   function formatText(value, text, integers, maxLength){
      // Вырезаем переносы строк и теги.
      value = typeof value === 'string' ? value.replace(/\n/gm, '').replace(/<.*?>/g, '') : value;
      value = value + '';

      value = cDefaultRenders.numeric(
          value,
          integers,
          true,
          2,
          false,
          maxLength,
          true
      );

      if(!NumberTextBoxUtil.checkMaxLength(value, maxLength)){
         return text;
      }

      return value || '';
   }

    /**
     * Класс контрола "Поле ввода денег".
     *
     * @class SBIS3.CONTROLS.MoneyTextBox
     * @extends SBIS3.CONTROLS.NumberTextBox
     * @public
     * @control
     * @author Романов Валерий Сергеевич
     *
     */
   var MoneyTextBox = NumberTextBox.extend(/** @lends SBIS3.CONTROLS.MoneyTextBox.prototype */ {
      $protected: {
         _options: {
            _paddingClass: ' controls-TextBox__paddingBoth',
            textFieldWrapper: textFieldWrapper,
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
            decimals: 2,
            hideEmptyDecimals: false,
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
            delimiters: true,
            /**
             * @cfg {String} Денежное значение контрола
             * @example
             * <pre>
             *     <option name="moneyValue">123.456</option>
             * </pre>
             * @see text
             */
             moneyValue: null,
             _decimalsPart: null,
             _integersPart: null
         }
      },

      _modifyOptions: function(options){
         var value,
             dotPos;
         options = MoneyTextBox.superclass._modifyOptions.apply(this, arguments);
         options.cssClassName += ' controls-MoneyTextBox';

         value = options.text || options.moneyValue;
         if (typeof value !== 'undefined' && value !== null){
            options.text = formatText(
                value,
                options.text,
                options.integers,
                options.maxLength
            );
             dotPos = options.text.indexOf('.');
             if(dotPos){
                 options._integersPart = options.text.substring(0, options.text.length - 3);
                 options._decimalsPart = options.text.substring(options.text.length - 2);
             }
         }
         return options;
      },

      $constructor: function () {
      },

      _setEnabled: function(enabled){
         this._inputField[0].contentEditable = enabled;
         this._setInputValue(this._options.text);
         MoneyTextBox.superclass._setEnabled.apply(this, arguments);
      },

       _createMirrorInput: function () {
       },
       _initMirrorInput: function () {
       },

      _blurHandler: function() {
         MoneyTextBox.superclass._blurHandler.apply(this, arguments);
         // имитация стандартного поведения поля ввода
         // т.к. браузер обрезает содержимое contenteditable контейнера без возвожности прокрутки
         if(this._inputField) {
             this._inputField[0].scrollLeft = 0;
         }
      },
      /**
       * Возвращает текущее значение денежного поля ввода.
       * @returns {String} Текущее значение денежного поля ввода.
       */
      getMoneyValue: function(){
         return this._options.moneyValue;
      },
      /**
       * Устанавливает значение денежного поля ввода.
       * @param value Новое значение поля ввода.
       */
      setMoneyValue: function(value){
         value = (value+ '').replace(/\s+/g,'');
         if (value !== this._options.moneyValue){
            this.setText(value + '');
         }
      },

      _useNativePlaceHolder: function () {
        return false;
      },

      _setNumericValue: function(value) {
         value = (value+ '').replace(/\s+/g,'');
         this._options.numericValue = parseFloat(value);
         this._options.moneyValue = value;

         this._notifyOnPropertyChanged('moneyValue');
      },

      _getInputValue: function() {
         var value = this._inputField[0].innerHTML;

         return value.replace(/\n/gm, '').replace(/<.*?>/g, '');
      },

      _setInputValue: function(value) {
         var newText = (value === null ||typeof value === 'undefined') ? '' : value + '';
         this._updateCompatiblePlaceholderState();
         if(!this.isEnabled()) {
            this._inputField[0].innerHTML = this._getIntegerPart(newText) + '<span class="controls-MoneyTextBox__decimals">' + newText.substring(newText.length - 3, newText.length) + '</span>';
         }else{
            this._inputField[0].innerHTML = newText;
         }
      },

      _getInputField: function() {
         return $('.js-MoneyTextBox__input', this.getContainer().get(0));
      },

       _getIntegerPart: function(value) {
        var dotPosition = (value.indexOf('.') != -1) ? value.indexOf('.') : value.length;
        return value.substr(0, dotPosition);
      },

      _formatText: function(value){
         return formatText(
             value,
             this._options.text,
             this._options.integers,
             this._options.maxLength
         );
      },
      /**
       * Возвращает массив содержащий координаты выделения
       * @return {Array} массив содержащий координаты выделения
       */
      _getCaretPosition : function(){
         var selection,
             selectionRange,
             b,
             e,
             l;

         if(window.getSelection){
            selection = window.getSelection();
            selectionRange = selection.getRangeAt(0);
            b = selectionRange.startOffset;
            if(!constants.browser.firefox) {
                e = selectionRange.endOffset;
            }else {
                // TODO перейти на общий механизм работы с FormattedTextBoxBase
               e = b + selection.toString().length;
            }

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
