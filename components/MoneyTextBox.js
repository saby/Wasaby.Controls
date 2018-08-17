/**
 * Created by iv.cheremushkin on 28.08.2014.
 */

define('SBIS3.CONTROLS/MoneyTextBox', [
   'Core/defaultRenders',
   'Core/constants',
   'SBIS3.CONTROLS/NumberTextBox',
   'SBIS3.CONTROLS/Utils/NumberTextBoxUtil',
   'tmpl!SBIS3.CONTROLS/MoneyTextBox/resources/textFieldWrapper',
   'is!msIe?Deprecated/Controls/FieldString/resources/ext/ierange-m2-min',
   'css!SBIS3.CONTROLS/MoneyTextBox/MoneyTextBox'
], function (cDefaultRenders, constants, NumberTextBox, NumberTextBoxUtil, textFieldWrapper) {

   'use strict';

   function formatText(value, text, integers, maxLength, onlyPositive, countMinusInLength, decimals){
      // Вырезаем переносы строк и теги.
      value = typeof value === 'string' ? value.replace(/\n/gm, '').replace(/<.*?>/g, '') : value;
      value = value + '';

      value = cDefaultRenders.numeric(
          value,
          integers,
          true,
          decimals,
          onlyPositive,
          maxLength,
          true
      );

      if(!NumberTextBoxUtil.checkMaxLength(value, maxLength, countMinusInLength)){
         return text;
      }

      return value || '';
   }

    /**
     * Класс контрола "Поле ввода денег".
     *
     * @class SBIS3.CONTROLS/MoneyTextBox
     * @extends SBIS3.CONTROLS/NumberTextBox
     * @mixes SBIS3.CONTROLS/MoneyTextBoxDocs
     * @public
     * @control
     * @author Зайцев А.С.
     *
     */
   var MoneyTextBox = NumberTextBox.extend(/** @lends SBIS3.CONTROLS/MoneyTextBox.prototype */ {
      $protected: {
         _options: {
            /**
             * @cfg {string} Выравнивание текста относительно контейнера
             * <pre>
             *     <option name="textAlign">left</option>
             * </pre>
             */
            textAlign: 'right',
            _paddingClass: ' controls-Text-InputRender_paddingBoth controls-TextBox_paddingBoth',
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
            /**
             * @cfg {Boolean} Требуется ли скрывать пустую дробную часть
             * @example
             * <pre>
             *     <option name="hideEmptyDecimals">true</option>
             * <pre>
             */
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
         },
         _dotOverstep: false
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
                options.maxLength,
                options.onlyPositive,
                options.countMinusInLength,
                options.decimals
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

      _setNumericValue: function(value) {
         value = (value+ '').replace(/\s+/g,'');
         this._options.numericValue = parseFloat(value);
         this._options.moneyValue = value;

         this._notifyOnPropertyChanged('moneyValue');
      },

       /**
        * Переопределяем метод TextBox.
        * Потому что в нем сравнивается text и значение, которое возвращает метод _getInputValue,
        * а в money он возвращает значение без тегов и если вставить одно и то же значние, что и в поле, но как верстку,
        * то перерисовки не произойдет и вставиться значние из бувера.
        * Сделано по задаче
        * https://online.sbis.ru/opendoc.html?guid=6fdfa7d2-963c-4c9d-bdcd-775cd04ac0ad.
        * Решение является костылем и должно быть переделано по задаче
        * https://online.sbis.ru/opendoc.html?guid=2709dd59-2240-4761-b0ab-04a013be80d9
        * @param text
        * @private
        */
       _drawText: function(text) {
          if (this._inputField[0].innerHTML != text) {
             this._setInputValue(text || '');
          }
       },

      _getInputValue: function() {
         var value = this._inputField[0].innerHTML;

         return value.replace(/\n/gm, '').replace(/<.*?>/g, '');
      },

      _setInputValue: function(value) {
         var newText = (value === null ||typeof value === 'undefined') ? '' : value + '';
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
             this._options.maxLength,
             this._options.onlyPositive,
             this._options.countMinusInLength,
             this._options.decimals
         );
      },
      /**
       * Возвращает массив содержащий координаты выделения
       * @return {Array} массив содержащий координаты выделения
       */
      _getCaretPosition : function(){
         var selection, selectionRange, b, e;

         selection = constants.browser.isIE10 ? window.getSelectionForIE() : window.getSelection();

          if (selection.rangeCount > 0) {
              try {
                  selectionRange = selection.getRangeAt(0);
                  b = selectionRange.startOffset;
                  if (!constants.browser.firefox) {
                      e = selectionRange.endOffset;
                  } else {
                      // TODO перейти на общий механизм работы с FormattedTextBoxBase
                      e = b + selection.toString().length;
                  }
              }catch(e){
                 return this._caretPosition;
              }
          }
         return [b,e];
      },
      /**
       * Выставляет каретку в переданное положение
       * @param {Number}  pos    позиция, в которую выставляется курсор
       * @param {Number} [pos2]  позиция правого края выделения
       */
      _setCaretPosition : function(pos, pos2) {
         if (pos < 0) {
            //Safari (и iOS, и macOS) зависает, если позвать selection.collapse с отрицательным caretPosition
            pos = 0;
         }
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
