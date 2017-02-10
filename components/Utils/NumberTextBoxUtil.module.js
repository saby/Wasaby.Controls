/**
 * Created by vs.romanov on 09.01.2017.
 */
define('js!SBIS3.CONTROLS.Utils.NumberTextBoxUtil', [],
    function () {
        return {
            checkMaxLength: function (value, maxLength) {
                var length = value ? value.replace(/[\s.-]/g, '').length : 0;
                return !(maxLength && length > maxLength);
            },

            numberPress: function(b, e, currentVal, delimiters, integers, decimals, keyCode, maxLength){
                var dotPosition = currentVal.indexOf('.'),
                    oldValue = currentVal,
                    symbol = String.fromCharCode(keyCode),
                    integerCount =  this._getIntegersCount(currentVal),
                    checkMaxLengthResult = this.checkMaxLength(currentVal, maxLength),
                    newCaretPosition = b,
                    replaceFirstZero = false;

                if (((currentVal[0] == 0 && b == 1) || (currentVal[0] == '-' && currentVal[1] == 0 && b == 2)) && b == e ){ // заменяем первый ноль если курсор после него
                    newCaretPosition--;
                    replaceFirstZero = true;
                }
                if ((b <= dotPosition && e <= dotPosition) || dotPosition == -1) { //до точки
                    if (b == e) {
                        if (checkMaxLengthResult) {
                            if (integerCount == integers) {
                                return {value: currentVal, caretPosition: b};
                            }
                            (delimiters && integerCount % 3 == 0 && currentVal.length) ? newCaretPosition += 2 : newCaretPosition++;
                            currentVal = currentVal.substr(0, replaceFirstZero ? (this._isNumberPositive(currentVal) ? 0 : 1) : b) + symbol + currentVal.substr(e);
                        }
                    } else {
                        currentVal = currentVal.substr(0, b) + symbol + currentVal.substr(e);
                        newCaretPosition++;
                    }
                } else
                if (b > dotPosition && e > dotPosition){ // после точки
                    if (b == e) {
                        if(checkMaxLengthResult || (e <= dotPosition + decimals)) {
                            currentVal = currentVal.substr(0, b) + symbol + currentVal.substr(e + ((decimals !== 0) ? 1 : 0));
                        }
                    } else {
                        currentVal = currentVal.substr(0, b) + symbol + ((decimals > 0) ? this._getZeroString(e - b - 1) : '') + currentVal.substr(e);
                    }
                    newCaretPosition++;
                } else { // точка в выделении
                    currentVal = currentVal.substr(0, b) + symbol + '.' + ((decimals > 0) ? this._getZeroString(e - dotPosition - 1) : '') + currentVal.substr(e);
                    newCaretPosition = currentVal.indexOf('.');
                }
                currentVal = currentVal.replace(/\s/g, '');

                if(!this.checkMaxLength(currentVal, maxLength)){
                    currentVal = oldValue;
                }

                return {value: currentVal, caretPosition: newCaretPosition};
            },

            deletPressed: function (b, e, currentVal, delimiters, decimals) {
                var dotPosition = currentVal.indexOf('.'),
                    newCaretPosition = e, step;

                (currentVal[b] == ' ') ? step = 2 : step = 1;
                if (b === 0 && e === currentVal.length) {
                    currentVal = '';
                    newCaretPosition = b;
                } else {
                    if ((b <= dotPosition && e <= dotPosition) || dotPosition == -1) { //до точки
                        if (b == e) {
                            if (b == dotPosition) {
                                newCaretPosition++;
                            }
                            if (!(decimals > 0) || (decimals && b != dotPosition)) {
                                currentVal = currentVal.substr(0, b) + currentVal.substr(e + step);
                            }
                        } else {
                            currentVal = currentVal.substr(0, b) + currentVal.substr(e);
                            newCaretPosition = b;
                        }
                        if (delimiters && this._getIntegersCount(currentVal) % 3 == 0 && b != dotPosition) {
                            newCaretPosition--;
                        }
                    } else if (b > dotPosition && e > dotPosition) { // после точки
                        if (b == e) {
                            currentVal = currentVal.substr(0, b) + currentVal.substr(e + 1);
                        } else {
                            currentVal = currentVal.substr(0, b) + currentVal.substr(e);
                            newCaretPosition = b;
                        }
                    } else { // точка в выделении
                        currentVal = currentVal.substr(0, b) + (decimals > 0 ? '.' : '') + currentVal.substr(e);
                        newCaretPosition = b;
                    }
                }
                currentVal = currentVal.replace(/\s/g, '');

                if (newCaretPosition == -1 && this._getIntegersCount(currentVal) == 0){ // если первый 0 перемещаем через него каретку
                    newCaretPosition += 2;
                }
                return {value: currentVal, caretPosition: newCaretPosition, step: step};
            },

            backspacePressed: function (b, e, currentVal, delimiters, decimals, onlyInteger) {
                var dotPosition = currentVal.indexOf('.'),
                    newCaretPosition = b, step;

                (currentVal[b - 1] == ' ') ? step = 2 : step = 1;
                if(b === 0 && e === currentVal.length){
                    currentVal = '';
                } else {
                    if ((b <= dotPosition && e <= dotPosition) || dotPosition == -1) { //до точки
                        if (b == e) {
                            currentVal = currentVal.substr(0, b - step) + currentVal.substr(e);
                            // При удалении последнего символа целой части дроби каретку нужно оставить после 0
                            // т.к. если каретку установить перед 0, то при вводе 0 не затрется; было |0.12 стало 0|.12
                            if(this._getIntegersCount(currentVal) !== 0 && !onlyInteger) {
                                (delimiters && this._getIntegersCount(currentVal) % 3 == 0) ? newCaretPosition -= 2 : newCaretPosition--;
                            }
                        } else {
                            currentVal = currentVal.substr(0, b) + currentVal.substr(e);
                            newCaretPosition = b;
                        }
                    } else if (b > dotPosition && e > dotPosition) { // после точки
                        if (b == e) {
                            if (!(b == dotPosition + 1 && decimals > 0)) {
                                currentVal = currentVal.substr(0, b - 1) + currentVal.substr(e);
                            }
                            newCaretPosition = dotPosition === b - 2 ? newCaretPosition - 2 : newCaretPosition - 1;
                        } else {
                            currentVal = currentVal.substr(0, b) + currentVal.substr(e);
                            newCaretPosition = b;
                        }
                    } else { // точка в выделении
                        currentVal = currentVal.substr(0, b) + (decimals > 0 ? '.' : '') + currentVal.substr(e);
                        newCaretPosition = b;
                    }
                }
                currentVal = currentVal.replace(/\s/g, '');

                return {value: currentVal, caretPosition: newCaretPosition, step: step};
            },

            _isNumberPositive: function(value) {
                value  = value + '';

                if(value[0] == '-'){
                    return false;
                }
                return true;
            },
            
            _getZeroString: function(length){
                return '000000000000000000000000000000000'.substr(0, length);
            },

            _getIntegersCount: function(value){
                var dotPosition = (value.indexOf('.') != -1) ? value.indexOf('.') : value.length;
                return value.substr(0, dotPosition).replace(/\s|-/g, '').length;
            }
        }
    });