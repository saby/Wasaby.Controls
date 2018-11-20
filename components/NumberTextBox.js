/**
 * Created by iv.cheremushkin on 28.08.2014.
 */

define('SBIS3.CONTROLS/NumberTextBox', [
   'Core/constants',
   'SBIS3.CONTROLS/Utils/NumberTextBoxUtil',
   'SBIS3.CONTROLS/TextBox',
   'SBIS3.CONTROLS/NumberTextBox/resources/FormatText',
   'SBIS3.CONTROLS/Utils/ConfigByClasses',
   'css!Controls/Input/resources/InputRender/InputRender',
   'css!SBIS3.CONTROLS/NumberTextBox/NumberTextBox'
], function(constants, NumberTextBoxUtil, TextBox, FormatText, ConfigByClasses) {
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
    *    <li>{@link text начальное значение}.</li>
    * </ol>
    * @class SBIS3.CONTROLS/NumberTextBox
    * @extends SBIS3.CONTROLS/TextBox
    * @author Журавлев М.С.
    * @demo Examples/NumberTextBox/MyNumberTextBox/MyNumberTextBox
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
    * @category Input
    * @initial
    * <component data-component='SBIS3.CONTROLS/NumberTextBox'>
    *     <option name="text">0</option>
    * </component>
    */

   function hideEmptyDecimals(value) {
      value = value + '';

      while (value && value.indexOf('.') !== -1 && (value[value.length - 1] == '0' || value[value.length - 1] == '.')) {
         value = value.substr(0, value.length - 1);
      }
      return value;
   }

   var NumberTextBox = TextBox.extend(/** @lends SBIS3.CONTROLS/NumberTextBox.prototype */ {
      $protected: {
         _inputField: null,
         _caretPosition: [0, 0],
         _SHIFT_KEY: false,
         _CTRL_KEY: false,
         _options: {

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
             * @see setOnlyInteger
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
            integers: 14,

            /**
             * @cfg {Boolean} Прятать нулевую дробную часть
             * Опция позволяет скрыть нулевую дробную часть.
             * @example
             * <pre>
             *     <option name="hideEmptyDecimals">true</option>
             * <pre>
             * @see decimals
             */
            hideEmptyDecimals: true,

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
            numericValue: null,

            /**
             * @cfg {Boolean} Учитывать знак "-" при проверке длины числа
             * @see maxLength
             */
            countMinusInLength: false
         },
         _inputMirror: null,
         _dotOverstep: true
      },

      _addOptionsFromClass: function(opts, attrToMerge) {
         var
            classes = (attrToMerge && attrToMerge.class) || (opts.element && opts.element.className) || opts.className || '',
            params = [
               {
                  class: 'controls-NumberTextBox__text-align-right', optionName: 'textAlign', value: 'right', defaultValue: 'left'
               }
            ];
         ConfigByClasses(opts, params, classes);
      },

      _modifyOptions: function(baseCfg, parsedOptions, attrToMerge) {
         var
            options = NumberTextBox.superclass._modifyOptions.apply(this, arguments),
            value = (options.numericValue != undefined) ? options.numericValue : options.text;
         if (typeof value !== 'undefined' && value !== null) {
            options.text = FormatText.formatText(
               value,
               options.text,
               options.onlyInteger,
               options.decimals,
               options.integers,
               options.delimiters,
               options.onlyPositive,
               options.maxLength,
               options.hideEmptyDecimals,
               options.countMinusInLength
            );
         }
         if (options.hideEmptyDecimals && options.text) {
            options.text = hideEmptyDecimals(options.text);
         }

	      options.cssClassName += ' controls-NumberTextBox';
         this._addOptionsFromClass(options, attrToMerge);
         return options;
      },

      $constructor: function() {
         var self = this;
         if (this._options.maxLength) {
            this.setMaxLength(this._options.maxLength);
         }
         this._createMirrorInput();

         this._inputField.bind('blur', function() {
            self._blurHandler();
         });
         if (this._options.text && !this._options.numericValue) {
            this.setNumericValue(this._options.text);
         }
         this._inputField.on('input', function() {
            // При вставке спец. символов не стреляет никаких событий, кроме input. Так что буду тут дёргать setText,
            // чтобы отфильтровать лишнее
            if (!self._pasteProcessing) {
               self._setText(self._getInputValue());
               self._setCaretPosition(self._caretPosition[0] + 1, self._caretPosition[1] + 1);
            }
         });
         this._initMirrorInput();
      },

      _createMirrorInput: function() {
         var mirrorContainer = $('.controls-NumberTextBox__mirror');
         if (mirrorContainer.length) {
            this._inputMirror = mirrorContainer;
         } else {
            this._inputMirror = $('<span class="controls-NumberTextBox__mirror"></span>');
            $('body').append(this._inputMirror);
         }
      },

      _initMirrorInput: function() {
         var self = this;

         // TODO https://online.sbis.ru/opendoc.html?guid=f30c45a4-49f5-4125-b743-d391331b6587
         // временное решения в версию для скролла в поле ввода,
         // сейчас браузерный скролл ломает preventDefalt - его нельзя удалить т.к. мы обрабатываем все нажатия и иначе цифры будут дублироваться
         this._inputField.on('keyup click focus', function(event) {
            var off = self._getCaretPosition()[0],
               containerWidth, cursorOffset, scrollLeft;

            self._inputMirror.text(self._getInputValue().substring(0, off).replace(/\s/g, '\u00a0'));
            containerWidth = self._inputField[0].clientWidth;
            cursorOffset = self._inputMirror.outerWidth();
            scrollLeft = cursorOffset - containerWidth;
            self._inputField.scrollLeft(scrollLeft > 0 ? scrollLeft + 1 : 0); // +1px на ширину каретки
         });

         this._publish('onChangeNumericValue');
      },

      _blurHandler: function() {
         // Прятать нулевую дробную часть при потере фокуса
         this._hideEmptyDecimals();
      },

      _focusOutHandler: function() {
         // Сбрасываем CTRL_KEY и SHIFT_KEY так как keyUp не отработает при потере фокуса
         // Ошибка: https://online.sbis.ru/opendoc.html?guid=2891bd28-e697-4866-be9a-ab7612eaa901
         this._CTRL_KEY = this._SHIFT_KEY = false;
         NumberTextBox.superclass._focusOutHandler.apply(this, arguments);
      },

      _inputFocusInHandler: function() {
         var
            text = this._getInputValue();

         // Показывать нулевую дробную часть при фокусировки не зависимо от опции hideEmptyDecimals
         if (this._options.enabled) {
            this._options.text = this._formatText(this._options.text);
            if (text !== this._options.text) {
               this._setInputValue(this._options.text);
            }
         }
         NumberTextBox.superclass._inputFocusInHandler.apply(this, arguments);
      },

      _moveCursorAfterActivation: function() {
         var dotPosition = this._options.text.indexOf('.');

         // По стандарту, если фокус пришёл не по клику, то курсор должен вставать либо перед точкой,
         // либо после неё, в зависимости от количества цифр в целой части.
         // Поэтому если фокус пришёл не по клику, то подвинем курсор в нужное место.
         if (this._options.integers === NumberTextBoxUtil._getIntegersCount(this._options.text)) {
            this._setCaretPosition(dotPosition + 1);
         } else {
            this._setCaretPosition(dotPosition);
         }
      },

      _setText: function(text) {
         if (text !== '-' && text !== '.' && text !== '') {
            text = this._formatText(text);
            if (text.indexOf('.') === text.length - 1) {
               this._setInputValue(text);
               this._setCaretPosition(this._caretPosition[0] + 1, this._caretPosition[1] + 1);
               return;
            }
         }
         this._setNumericValue(text);
         this._setInputValue(text);
         this._setCaretPosition(this._caretPosition[0], this._caretPosition[1]);
      },

      setText: function(text) {
         var newText = this._isEmptyValue(text) ? text : this._formatText(text);
         if (newText !== this._options.text) {
            this._setNumericValue(newText);
         }
         NumberTextBox.superclass.setText.call(this, newText);
         if (!this.isActive() && this._options.hideEmptyDecimals) {
            this._hideEmptyDecimals();
         }
      },

      /**
       * Задает отображение разделителей триад
       * @param {Boolean} flag
       */
      setDelimiters: function(flag) {
         this._options.delimiters = flag;
      },

      /**
       * Задает режим отображения нулевой дробной части
       * @param {Boolean} flag
       */
      setHideEmptyDecimals: function(flag) {
         this._options.hideEmptyDecimals = flag;
      },

      _hideEmptyDecimals: function() {
         var value = this._getInputValue();
         if (value) {
            if (this._options.hideEmptyDecimals && (value && value.indexOf('.') != -1)) {
               value = hideEmptyDecimals(value);
            }
            this._options.text = value;

            this._setInputValue(value);
         }
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
      getNumericValue: function() {
         var val = this._options.numericValue;
         return (isNaN(val)) ? null : val;
      },

      setNumericValue: function(value) {
         if (value !== this._options.numericValue && value < 9007199254740992) { // проверка на вернюю границу 2^53
            this._setNumericValue(value);
            this.setText(value + '');
         }
      },

      _setNumericValue: function(value) {
         if (typeof (value) === 'string') {
            value = value.replace(/\s+/g, '');
         }
         if (this._options.onlyInteger) {
            this._options.numericValue = parseInt(value, 10);
         } else {
            this._options.numericValue = parseFloat(value);
         }
         this._notifyOnPropertyChanged('numericValue');
         this._notify('onChangeNumericValue', this._options.numericValue);
      },

      /**
       * Установить количество знаков после запятой
       * @param decimals Количество знаков после запятой
       */
      setDecimals: function(decimals) {
         if (typeof decimals === 'number') {
            this._options.decimals = decimals;
            this.setText(this._options.text);
         }
      },

      /**
       * Установить количество знаков до запятой
       * @param integers Количество знаков до запятой
       */
      setIntegers: function(integers) {
         if (typeof integers === 'number') {
            this._options.integers = integers;
            this.setText(this._options.text);
         }
      },

      /**
       * Установить возможность ввода только целых чисел
       * @param {Boolean} onlyInteger Ввод только целых чисел
       * @see onlyInteger
       */
      setOnlyInteger: function(onlyInteger) {
         this._options.onlyInteger = Boolean(onlyInteger);
      },

      /**
       * Получить количество знаков после запятой
       */
      getDecimals: function() {
         return this._options.decimals;
      },

      _formatText: function(value) {
         return FormatText.formatText(
            value,
            this._options.text,
            this._options.onlyInteger,
            this._options.decimals,
            this._options.integers,
            this._options.delimiters,
            this._options.onlyPositive,
            this._options.maxLength,
            this._options.hideEmptyDecimals,
            this._options.countMinusInLength
         );
      },

      _keyDownBind: function(event) {
         if (!this.isEnabled()) {
            return false;
         }
         this._caretPosition = this._getCaretPosition();
         if (event.shiftKey) {
            this._SHIFT_KEY = true;
         }
         if (event.ctrlKey) {
            this._CTRL_KEY = true;
         }
         if (event.which == constants.key.f5 || // F5, не отменяем действие по-умолчанию
            event.which == constants.key.f12 || // F12,не отменяем действие по-умолчанию
            event.which == constants.key.left || // не отменяем arrow keys (влево, вправо)
            event.which == constants.key.right ||
            event.which == constants.key.end || // не отменяем home, end
            event.which == constants.key.home
         ) {
            return true;
         }
         var keyCode = (event.which >= 96 && event.which <= 105) ? event.which - 48 : event.which;

         /* точка */
         if ((keyCode == 190 || keyCode == 110 || keyCode == 191 || keyCode == 188) && (!event.key || event.key == ',' || event.key == '.' || event.key == 'б' || event.key == 'ю' || event.key == 'Decimal')) {
            this._dotHandler(event);
            return;
         }
         if (keyCode == 189 || keyCode == 173 || keyCode == 109/* минус 173 - firefox, 109 - NumPad */) {
            this._toggleMinus();
            event.preventDefault();
         }

         if (keyCode == 46) { /* Delete */
            this._deleteHandler();
         } else if (keyCode == 8) { /* Backspace */
            this._backspaceHandler();
         } else if (keyCode >= 48 && keyCode <= 57 && !this._SHIFT_KEY) { /* Numbers */
            event.preventDefault();
            this._numberPressHandler(keyCode);
            return true;
         }
         if (this._getInputValue().indexOf('.') === 0) {
            this._setText('0' + this._getInputValue());
            this._setCaretPosition(1);
         }
         if (this._CTRL_KEY || (this._SHIFT_KEY && keyCode === 45) /* insert */) {
            return true;
         }
         event.preventDefault();
      },

      _numberPressHandler: function(keyCode) {
         var b = this._caretPosition[0], // начало выделения
            e = this._caretPosition[1], // конец выделения
            currentVal = this._getInputValue(),
            newState = NumberTextBoxUtil.numberPress(
               b,
               e,
               currentVal,
               this._options.delimiters,
               this._options.integers,
               this._options.decimals,
               keyCode,
               this._options.maxLength,
               this._options.countMinusInLength
            );

         this._setText(newState.value);
         this._setCaretPosition(newState.caretPosition);
      },

      _deleteHandler: function() {
         var b = this._caretPosition[0], // начало выделения
            e = this._caretPosition[1], // конец выделения
            currentVal = this._getInputValue(),
            newState = NumberTextBoxUtil.deletPressed(b,
               e,
               currentVal,
               this._options.delimiters,
               this._options.decimals);

         this._setText(newState.value);
         this._setCaretPosition(newState.caretPosition + newState.step - 1);
      },

      _backspaceHandler: function() {
         var b = this._caretPosition[0], // начало выделения
            e = this._caretPosition[1], // конец выделения
            currentVal = this._getInputValue(),
            newState = NumberTextBoxUtil.backspacePressed(
               b,
               e,
               currentVal,
               this._options.delimiters,
               this._options.decimals,
               this._dotOverstep
            );

         this._setText(newState.value);
         this._setCaretPosition(newState.caretPosition + newState.step - 1);
      },

      _dotHandler: function(event) {
         if (!this._options.onlyInteger && this._options.decimals !== 0) {
            var currentVal = this._getInputValue(),
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

      _keyUpBind: function(e) {
         NumberTextBox.superclass._keyUpBind.apply(this, arguments);
         if (e.which == 16) {
            this._SHIFT_KEY = false;
         }
         if (e.which == 17) {
            this._CTRL_KEY = false;
         }
      },

      // Метод вызывается после ввода в  NTB знака минус и меняет положение каретки/выделения
      _getNewCaretPosition: function() {
         var
            cpStart = this._caretPosition[0],
            cpEnd = this._caretPosition[1],
            value = this._getInputValue(),
            step;

         // это надо т.к. при смене знака каретка должна остаться на месте
         // если в поле ввода не было значения, то появится "-0" -> сдвиг 2 в остальных случаях сдвиг на 1
         step = value ? 1 : 2;

         // Если в числе не было минуса, то смещаем коретку вправо, чтобы сохранить её позицию относительно числа
         if (value.indexOf('-') === -1) {
            cpStart = cpStart + step;
            cpEnd = cpEnd + step;

         // Если в числе был минус, то смещаем коретку влево, чтобы сохранить её позицию относительно числа
         } else {
            cpStart = Math.max(0, cpStart - 1);
            cpEnd = Math.max(0, cpEnd - 1);
         }

         return [cpStart, cpEnd];
      },

      _toggleMinus: function() {
         var value = this._getInputValue(),
            newCaretPosition;

         if (!this._options.onlyPositive) {
            if (!NumberTextBoxUtil.checkMaxLength(value, this._options.maxLength, this._options.countMinusInLength)) {
               return;
            }

            // Получаем новое положение коретки
            newCaretPosition = this._getNewCaretPosition();

            if (!value) {
               value = '0';
            }

            if (value.indexOf('-') == -1) {
               this._setText('-' + value);
            } else {
               this._setText(value.substr(1));
            }
            this._setCaretPosition(newCaretPosition[0], newCaretPosition[1]);
            TextBox.superclass.setText.call(this, this._getInputValue());
         }
      },

      /**
       * Возвращает массив содержащий координаты выделения
       * @return {Array} массив содержащий координаты выделения
       */
      _getCaretPosition: function() {
         var
            obj = this._inputField.get(0),
            b,
            e,
            l;
         if (constants.browser.isIE && constants.browser.IEVersion < 9) { // IE
            var range = document.selection.createRange();
            l = range.text.length;
            range.moveStart('textedit', -1);
            e = range.text.length;
            range.moveEnd('textedit', -1);
            b = e - l;
         } else {
            b = obj.selectionStart;
            e = obj.selectionEnd;
         }
         return [b, e];
      },

      /**
       * Выставляет каретку в переданное положение
       * @param {Number}  pos    позиция, в которую выставляется курсор
       * @param {Number} [pos2]  позиция правого края выделения
       */
      _setCaretPosition: function(pos, pos2) {
         pos2 = pos2 || pos;
         var obj = this._inputField.get(0);
         if (constants.browser.isIE && constants.browser.IEVersion < 9) { // IE
            var r = obj.createTextRange();
            r.collapse(true);
            r.moveStart('character', pos);
            r.moveEnd('character', pos2 - pos); // Оказывается moveEnd определяет сдвиг, а не позицию
            r.select();
         } else {
            obj.setSelectionRange(pos, pos2);
            obj.focus();
         }
      },

      setMaxLength: function(num) {
         NumberTextBox.superclass.setMaxLength.call(this, num);

         // IE - единственный браузер, который навешивает :invalid, если через js поставить текст, превышаюший maxLength
         // Т.к. мы показываем плейсхолдер, если на поле ввода висит :invalid, то он не скрывается.
         // Поэтому для IE просто не будем навешивать аттрибут maxLength
         this._inputField.attr('maxlength', constants.browser.isIE && !constants.browser.isIE12 ? null : num);
      }
   });

   return NumberTextBox;
});
