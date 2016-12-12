/**
 * Created by vs.romanov on 16.12.2016.
 */
define('js!SBIS3.CONTROLS.NumberTextBoxMixin', [
    "Core/constants"
], function (constants) {
    'use strict';

    /**
     * Миксин обработки нажатия клавиш в числовых полях ввода. Переопределяет базовое поведение курсора в поле ввода и действие клавиш.
     *
     * @mixin SBIS3.CONTROLS.NumberTextBoxMixin
     * @public
     * @author Крайнов Дмитрий Олегович
     */

    function checkMaxLength(value, maxLength){
        var length = value ? value.replace(/[\s-]/g,'').length : 0;
        return !(maxLength && length > maxLength);
    }

    var NumberTextBoxMixin = /** @lends SBIS3.CONTROLS.NumberTextBoxMixin.prototype */{
        $protected: {
            _options: {
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
                 * @cfg {Boolean} Показать разделители триад
                 * @example
                 * <pre>
                 *     <option name="delimiters">true</option>
                 * </pre>
                 * @see integers
                 * @see onlyInteger
                 * @see decimals
                 */
                delimiters: false
            },
            _inputField: null,
            _caretPosition: [0, 0],
            _SHIFT_KEY: false,
            _CTRL_KEY: false
        },
        before: {
            _setText: function(text){
                if (text !== '-' && text !== '.' && text !== ''){
                    text = this._formatText(text);
                    if (text.indexOf('.') === text.length - 1) {
                        this._setInputValue(text);
                        this._setCaretPosition(this._caretPosition[0] + 1, this._caretPosition[1] + 1);
                        return;
                    }
                }
                this._setBindValue(text);
                this._setInputValue(text);
                this._setCaretPosition(this._caretPosition[0], this._caretPosition[1]);
            },

            setText: function(text){
                var newText = this._isEmptyValue(text) ? text : this._formatText(text);
                this._setBindValue(newText);
                if(!this.isActive() && this._options.hideEmptyDecimals) {
                    this._hideEmptyDecimals();
                }
            },

            _inputFocusInHandler: function() {
                // Показывать нулевую дробную часть при фокусировки не зависимо от опции hideEmptyDecimals
                if (this._options.enabled) {
                    this._options.text = this._formatText(this._options.text);
                    this._setInputValue(this._options.text);
                }
            }
        },

        around : {
            _keyDownBind: function (parentFnc, event) {
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
                /*точка*/
                if ((keyCode == 190 || keyCode == 110 || keyCode == 191 || keyCode == 188) && (!event.key || event.key == ',' || event.key == '.' || event.key == 'Decimal')) {
                    this._dotHandler(event);
                    return;
                }
                if (keyCode == 189 || keyCode == 173 || keyCode == 109/*минус 173 - firefox, 109 - NumPad*/) {
                    this._toggleMinus();
                    event.preventDefault();
                }

                if (keyCode == 46) { /*Delete*/
                    this._deleteHandler();
                } else if (keyCode == 8) { /*Backspace*/
                    this._backspaceHandler();
                } else if (keyCode >= 48 && keyCode <= 57) { /*Numbers*/
                    event.preventDefault();
                    this._numberPressHandler(keyCode);
                    return true;
                }
                if (this._getInputValue().indexOf('.') == 0) {
                    this._setText('0' + this._getInputValue());
                    this._setCaretPosition(1)
                }
                if (this._CTRL_KEY) {
                    return true;
                }
                event.preventDefault();
            }
        },
        after: {
            _keyUpBind: function (e) {
                if (e.which == 16) {
                    this._SHIFT_KEY = false;
                }
                if (e.which == 17) {
                    this._CTRL_KEY = false;
                }
            }
        },

        _numberPressHandler: function (keyCode) {
            var b = this._caretPosition[0], //начало выделения
                e = this._caretPosition[1],  //конец выделения
                currentVal = this._getInputValue(),
                dotPosition = currentVal.indexOf('.'),
                symbol = String.fromCharCode(keyCode),
                integerCount =  this._getIntegersCount(currentVal),
                checkMaxLengthResult = checkMaxLength(currentVal, this._options.maxLength),
                newCaretPosition = b;
            if (currentVal[0] == 0 && b == e && b == 1){ // заменяем первый ноль если курсор после него
                newCaretPosition--;
            }
            if ((b <= dotPosition && e <= dotPosition) || dotPosition == -1) { //до точки
                if (b == e) {
                    if (checkMaxLengthResult) {
                        if (integerCount == this._options.integers) {
                            return;
                        }
                        (this._options.delimiters && integerCount % 3 == 0 && currentVal.length) ? newCaretPosition += 2 : newCaretPosition++;
                        currentVal = currentVal.substr(0, b) + symbol + currentVal.substr(e);
                    }
                } else {
                    currentVal = currentVal.substr(0, b) + symbol + currentVal.substr(e);
                    newCaretPosition++;
                }
            } else
            if (b > dotPosition && e > dotPosition){ // после точки
                if (b == e) {
                    if(checkMaxLengthResult || (e <= dotPosition + this._options.decimals)) {
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
                currentVal = this._getInputValue(),
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
                    if (this._options.delimiters && this._getIntegersCount(currentVal) % 3 == 0 && b != dotPosition) {
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
                currentVal = this._getInputValue(),
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

        _dotHandler: function(event){
            if (!this._options.onlyInteger) {
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

        _getIntegersCount: function(value){
            var dotPosition = (value.indexOf('.') != -1) ? value.indexOf('.') : value.length;
            return value.substr(0, dotPosition).replace(/\s|-/g, '').length;
        },

        _getZeroString: function(length){
            return '000000000000000000000000000000000'.substr(0, length);
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

    };

    return NumberTextBoxMixin;
});
