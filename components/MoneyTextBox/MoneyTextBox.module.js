/**
 * Created by iv.cheremushkin on 28.08.2014.
 */

define('js!SBIS3.CONTROLS.MoneyTextBox', [
   "Core/defaultRenders",
   "Core/constants",
   "js!SBIS3.CONTROLS.NumberTextBox",
   'html!SBIS3.CONTROLS.MoneyTextBox/resources/textFieldWrapper'
], function (cDefaultRenders, constants, NumberTextBox, textFieldWrapper) {

   'use strict';

   function formatText(value, integers, maxLength){
      value = value + "";

      value = cDefaultRenders.numeric(
          value,
          integers,
          true,
          2,
          false,
          maxLength,
          true
      );

      return value || '';
   }

   var MoneyTextBox = NumberTextBox.extend(/** @lends SBIS3.CONTROLS.NumberTextBox.prototype */ {
      $protected: {
         _decimalsContainer: null,
         _options: {
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
             className: 'controls-MoneyTextBox'
         }
      },

      _modifyOptions: function(options){
         options = MoneyTextBox.superclass._modifyOptions.apply(this, arguments);
         if (options.text){
            options.text = formatText(
                options.text,
                options.integers,
                options.maxLength
            );
         }
         return options;
      },

      $constructor: function () {
         this._decimalsContainer = $('.js-MoneyTextBox__decimals', this.getContainer().get(0));
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
            this._decimalsContainer.toggleClass('ws-hidden', enabled);
            MoneyTextBox.superclass.setEnabled.apply(this, arguments);
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
         if (value !== this._options.moneyValue){
            this._setNumericValue(value);
            this.setText(value + '');
         }
      },

      _setNumericValue: function(value) {
         if (typeof(value) == 'string'){
            value = value.replace(/\s+/g,"");
         }
         this._options.numericValue = parseFloat(value);
         this._options.moneyValue = value;

         this._notifyOnPropertyChanged('moneyValue');
      },

      _getInputValue: function() {
         return this._inputField[0].innerHTML;
      },

      _setInputValue: function(value) {
         this._inputField[0].innerHTML = value;
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
