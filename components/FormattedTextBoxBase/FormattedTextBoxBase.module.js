define(
   'js!SBIS3.CONTROLS.FormattedTextBoxBase',
   [
      'js!SBIS3.CONTROLS.TextBoxBase',
      'is!msIe?js!SBIS3.CONTROLS.FormattedTextBoxBase/resources/ext/ierange-m2-min'
   ],
   function (TextBoxBase) {

   'use strict';

   /**
    * очищает выделение из полученных координат,
    * заменяя спектр выделения символом-заполнителем (placeholder)
    * @param positionObjStart
    * @param positionObjEnd
    * @private
    */
   var _clearSelect = function(positionObjStart, positionObjEnd) {
         var nodeValue, nodeValueSplit;
         for (var i = $(positionObjEnd.container).parent().index(); i >= $(positionObjStart.container).parent().index(); i = i - 2) {
            nodeValue = this._inputField.get(0).childNodes[i].childNodes[0].nodeValue
            for (var j = (i == $(positionObjEnd.container).parent().index() ? positionObjEnd.position : nodeValue.toString().length); j > (i == $(positionObjStart.container).parent().index() ? positionObjStart.position : 0); j--) {
               nodeValueSplit = nodeValue.split('');
               nodeValueSplit[j-1] = this._maskReplacer;
               this._inputField.get(0).childNodes[i].childNodes[0].nodeValue = nodeValueSplit.join('');
            }
         }
      },
      /**
       * Скорректировать регистр строки в соответствии с маской. Строка должна точно соответствовать маске по длине
       * и местоположению разделяющих и управляющих символов (поэтому данный метод используется только после проверки
       * на соответствие строки маске)
       * @param text
       * @returns {string}
       * @private
       */
      _correctRegister = function(text) {
         var
            ctrlChar,
            textSplit = text.split('');
         for (var c in textSplit) {
            ctrlChar = this._controlCharactersSet[this._primalMask[c]];
            if (ctrlChar == 'l' || ctrlChar == 'L') {
               textSplit[c] = ctrlChar == 'L' ? textSplit[c].toUpperCase() : textSplit[c].toLowerCase();
            }
         }
         return textSplit.join('');
      },
      /**
       * Замещает символ в определенном контейнере в определённой позиции
       * @param container контейнер
       * @param position позиция замещаемого символа
       * @param character новый символ
       * @private
       */
      _replaceCharacter = function(container, position, character) {
         var buffer = container.nodeValue.split('');
         buffer[position] = character;
         container.nodeValue = buffer.join('');
         this._updateText();
      },
      /**
       * Вычисляет котейнет и позицир для установки курсора в начало
       * @param {Object} positionObject
       * @private
       */
      _getHomePosition = function (positionObject) {
         positionObject.container = _getContainerByIndex.call(this, 0);
         if (!$(positionObject.container.parentNode).hasClass('controls-FormattedTextBox__field-placeholder')) {
            positionObject.container = nextSibling.childNodes[0];
         }
         positionObject.position = 0;
      },

      /**
       * Вычисляет котейнер и позицию для установки курсора в конец
       * @param {Object} positionObject
       * @private
       */
      _getEndPosition = function (positionObject) {
         positionObject.container = _getContainerByIndex.call(this, this._inputField.get(0).childNodes.length - 1);
         if (!$(positionObject.container.parentNode).hasClass('controls-FormattedTextBox__field-placeholder')) {
            positionObject.container = positionObject.container.parentNode.previousSibling.childNodes[0];
         }
         positionObject.position = positionObject.container.nodeValue.length;
      },
      _getPreviousPosition = function (positionObject) {
         var prevSibling = positionObject.container.parentNode.previousSibling;
         if (positionObject.position === 0) {
            if (prevSibling && prevSibling.previousSibling) {
               positionObject.container = prevSibling.previousSibling.childNodes[0];
               positionObject.position = positionObject.container.nodeValue.length - 1;
            }
         } else {
            positionObject.position--;
         }
      },
      _getNextPosition = function (positionObject) {
         var nextSibling = positionObject.container.parentNode.nextSibling;
         if (positionObject.position == positionObject.container.nodeValue.length) {
            if (nextSibling && nextSibling.nextSibling) {
               positionObject.container = nextSibling.nextSibling.childNodes[0];
               positionObject.position = 0;
            }
         } else {
            positionObject.position++;
         }
      },
      /**
       * Передвинуть курсор к заданной позиции
       * @param container блок
       * @param position позиция в блоке
       * @private
       */
         //TODO переделать на (groupNum, posInGroup)
      _moveCursor = function(container, position) {
         if ($ws._const.browser.isIE) {
            var rng = document.body.createTextRange();
            rng.moveToElementText(container.parentNode);
            rng.move('character', position);
            rng.select();
         } else {
            var selection = window.getSelection();
            selection.collapse(container, position);
         }
      },
      /**
       * Проверить значение на соответствие данной маске
       * @private
       */
      _checkTextByMask = function(text) {
         // Регулярное выражение, соответствующее изначальной маске.
         // Сначала допустимым управляющим символам ставятся в соотвествие основные управляющие символы,
         // затем на основании основных управляющих символов строится само регулярное выражение.
         // Пример (для DatePicker):
         //    Если маска 'DD:MM:YY', то регулярное выражение: /[0-9][0-9]:[0-9][0-9]:[0-9][0-9]/
         //    т.к. допустимым управляющим символам 'D', 'M', 'Y' соответствует основной управляющий символ 'd',
         //    который представляет собой целое число (т.е. для которого регулярное выражение /[0-9]/).
         var maskRegExp = _getRegExpByMask.call(this, this._primalMask);
         return new RegExp(maskRegExp).test(text);
      },
      /**
       * Конвертирует символ маски в регулярное выражение для данного символа
       * @param {String} c символ маски
       * @return {String}
       * @private
       */
      _charToRegExp = function(c) {
         var regexp;
         switch(c) {
            case 'd':
               regexp = '[0-9]';
               break;
            case 'L':
            case 'l':
               regexp = '[А-ЯA-Zа-яa-zёЁ]';
               break;
            case 'x':
            default:
               regexp = '[А-ЯA-Zа-яa-z0-9ёЁ]';
               break;
         }
         return regexp;
      },
      /**
       * Получить контейнер по порядковому номеру
       * @param idx
       * @returns {*}
       * @private
       */
      _getContainerByIndex = function(idx) {
         return this._inputField.get(0).childNodes[parseInt(idx, 10)].childNodes[0];
      },
      /**
       * Получить регулярное выражение, соответсвующие маске. В основном, используется this._primalMask, но можно
       * использовать для формирования регулярного выражения любой маски, записанной допустимыми управляющими символами
       * @param mask
       * @returns {RegExp}
       * @private
       */
      _getRegExpByMask = function (mask) {
         var
            controlCharactersRegExp = new RegExp('['+this._controlCharacters+']'),
            specialCharactersRegExp = /^[\\\/\[\])(}{}+?*^|.$]$/,
            maskSplit = mask.split('');
         for (var c in maskSplit) {
            if (controlCharactersRegExp.test(maskSplit[c])) {
               maskSplit[c] = _charToRegExp(this._controlCharactersSet[maskSplit[c]]);
            } else if (specialCharactersRegExp.test(maskSplit[c])) {
               maskSplit[c] = '\\' + maskSplit[c];
            }
         }
         return new RegExp('^' + maskSplit.join('') + '$');
      },
      /**
       * Возвращает чистую строку по маске
       * Изначально отображаемый текст в созданном контролле, то есть, по сути, маска, где каждый
       * управляющий символ заменён на символ-заполнитель
       * Пример: если маска контролла DatePicker имеет вид 'DD:MM:YYYY', то чистая маска будет иметь вид '__:__:____',
       * если символом-заполнителем является знак нижней черты.
       * @returns {string}
       * @private
       */
      _getClearMask = function() {
         //return this._primalMask.replace(new RegExp('['+this._controlCharacters+']', 'g'), this._maskReplacer);
         return this.formatModel.getStrMask().replace(new RegExp('['+this._controlCharacters+']', 'g'), this._maskReplacer);
      },
      /**
       * Получить положение курсора
       * @param {Boolean} position Позиция: true — начала, false — конца
       * @returns {Array} Массив положений [номер контейнера, сдвиг]
       * @protected
       */
      _getCursor = function(position) {
         var selection = window.getSelection().getRangeAt(0);
         return (position ?
            _getCursorContainerAndPosition.call(this, selection.startContainer, selection.startOffset) :
            _getCursorContainerAndPosition.call(this, selection.endContainer, selection.endOffset)
         );
      },

      /**
       * Возвращает массив индексов положения курсора
       * @param container
       * @param position
       * @return {Array} Массив [номер группы, номер символа]
       */
      _getCursorContainerAndPosition = function(container, position) {
         var
            // [Number] индекс контейнера <em> во wrapper'е
            buf = $(container.parentNode).index(),
            // [Number] является ли контейнер разделителем (1) или вводимым блоком (0)
            isSepCont = (buf + this._isSeparatorContainerFirst) % 2,
            // [Number] если контейнер - разделитель, то возвращается положение следующего контейнера
            cnt = isSepCont ? buf + 1 : buf,
            // [Number] если контейнер - разделитель, то возвращается начальная позиция курсора в контейнере
            pos = isSepCont ? 0 : position,
            // поле ввода
            input = this._inputField.get(0);
            // если контейнер - разделитель и он последний
         if (cnt >= input.childNodes.length) {
            cnt -= 2;
            pos = input.childNodes[cnt].childNodes[0].length;
         }
         return [cnt, pos];
      };


   /**
    * Абстрактный класс для контроллов, в которых необходим ввод особого формата (телефон, дата, время, etc).
    * В конечный контролл передается маска с помощью опции mask. Управляющие символы в маске, определяющие,
    * какие символы могут вводиться, определяются предназначением контролла.
    * @class SBIS3.CONTROLS.FormattedTextBoxBase
    * @extends $ws.proto.Control
    * @public
    */

   var FormattedTextBoxBase = TextBoxBase.extend(/** @lends SBIS3.CONTROLS.FormattedTextBoxBase.prototype */ {
      $protected: {
         /**
          * Изначальная маска (либо задается в опциях при создании, либо берется по умолчанию)
          */
         _primalMask: '',
         /**
          * Логическое, определяющее, является ли первый контейнер контейнером-разделителем
          */
         _isSeparatorContainerFirst: false,
         /**
          * Html-элемент, в который будет добавлена динамически создаваемая, в зависимости от маски, html-разметка
          */
         _inputField: null,
         /**
          * Символ-заполнитель, на который замещаются все управляющие символы в маске для последующего отображения на странице.
          * В маске изначально не должны присутствовать символы-заполнители. По умолчанию -- знак нижнего подчёркивания.
          * Нельзя использовать знак вопроса.
          */
         _maskReplacer: '_',
         /**
          * Набор допустимых управляющих символов в маске. Задаются отдельно в каждом контролле в зависимости от контекста.
          * Пример:
          *       Для контролла DatePicker это: Y(год), M(месяц), D(день), H(час), I(минута), S(секунда), U(доля секунды).
          * Каждому допустимому символу ставится в соответствие основной
          * управляющий символ, в зависимости от которого определяется, какой тип символа может вводиться.
          * Условные обозначения основных управляющих символов:
          *     1. d - Цифра
          *     2. L - Заглавная буква
          *     3. l - Строчная буква
          *     4. x - Буква или цифра
          * Если допустимые управляющие символы не заданы, используются основные управляющие символы.
          * Сами управляющие символы используются для задании маски при создании контролла в опции mask.
          * Любой символ, не являющийся управляющим трактуется как разделитель.
          * Набор указывается строго символ к символу. Пример:
          *       Для контролла DatePicker
          *             _controlCharactersSet: {
          *                   'Y' : 'd',
          *                   'M' : 'd',
          *                   'D' : 'd',
          *                   'H' : 'd',
          *                   'I' : 'd',
          *                   'H' : 'd',
          *                   'U' : 'd'
          *             }
          */
         _controlCharactersSet: {
            'd': 'd',
            'L': 'L',
            'l': 'l',
            'x': 'x'
         },
         /**
          * Строка всех допустимых управляющих символов, создается автоматически из набора _controlCharactersSet,
          * используется в регулярных выражениях.
          * Пример: для DatePicker будет:
          *       _controlCharacters: 'DMYHISU'
          */
         _controlCharacters: '',
         /**
          * Опции создаваемого контролла
          */
         _options: {
         },

         _KEYS: {
            DELETE: 46,
            TAB: 9,
            BACKSPACE: 8,
            ARROW_LEFT: 37,
            ARROW_RIGHT: 39,
            END: 35,
            HOME: 36
         },

         /**
          * Модель форматного поля
          */
         formatModel: {
            /** Параметры по-умолчанию для модели форматного поля */
            params: {
            },
            _maskReplacer: '.',
            controlCharactersSet: null,
            //groupCharactersRegExp: /[Lldx]/,
            model: [],
            /** позиция курсора
             * FIXME ? храним позицию символа вместе с маской либо группу + позцию в ней
             */
            cursorPosition: {
               start: 0,
               end: 0
            },
            setMaskReplacer: function(maskReplacer) {
               if (!maskReplacer) {
                  throw new Error('setMaskReplacer. Не задан символ замены');
               }
               this._maskReplacer = maskReplacer;
            },

            setControlCharactersSet: function(controlCharactersSet) {
               this.controlCharactersSet = controlCharactersSet;
            },
            /** Задать маску */
            setMask: function(strMask) {
               //FIXME убрать отладку
               console.log(strMask);
               //+++LLLlll///ddd---ddddddd===xxx
               var group = [],
                   groupInner = [],
                   separator = [],
                   maskSplit = strMask.split(''),
                   groupCharactersRegExp = /[Lldx]/,
                   innerChar;
                   //textSplit = groupMask.split('');
               //FIXME убрать отладку
               if (strMask == 'DD.MM.YYYY') {
                  strMask = strMask;
               }
               this.model = [];
               for (var c in maskSplit) {
                  //заменяем символы маски на внутренние, например HH:MM на dd:dd
                  innerChar = maskSplit[c];
                  if (innerChar in this.controlCharactersSet) {
                     innerChar = this.controlCharactersSet[maskSplit[c]]
                  }
                  if (groupCharactersRegExp.test(innerChar)) {
                     if (separator.length) {
                        this.addSeparator(separator.join(''));
                        separator = [];
                     }
                     group.push(maskSplit[c]);
                     groupInner.push(innerChar);
                  } else {
                     if (group.length) {
                        this.addGroup(group.join(''), groupInner.join(''));
                        group = [];
                        groupInner = [];
                     }
                     separator.push(maskSplit[c]);
                  }
               }
               if (group.length) {
                  this.addGroup(group.join(''), groupInner.join(''));
               }
               if (separator.length) {
                  this.addSeparator(separator.join(''));
               }
               return this;
            },

            /** Добавить группу символов в модель
             * @param groupMask подмаска группы, например LLddd
             */
            addGroup: function(groupMask, innerMask) {
               //console.log('addGroup', this.formatModelParams.escapeChar, '.');
               if ( !groupMask) {
                  return this;
               }
               //var innerMask = '',
               //    textSplit = groupMask.split('');
               var group = {
                  type:'group',
                  mask: groupMask,
                  //TODO сделать замену на внутренние символы
                  //innerMask: textSplit.join(''),
                  innerMask: innerMask,
                  //TODO символы будут храниться в массиве, чтобы позволить не введённые места в группе
                  value: [],
                  getReplaced: function(replaceChar) {
                     return this.innerMask.replace(/./ig, replaceChar);
                  }
               };
               if ( ! this.model) {
                  this.model = [];
               }
               this.model.push(group);
               return this;
            },

            /* Добавить разделитель в модель*/
            addSeparator: function(strSeparator) {
               //console.log('addSeparator');
               if ( !strSeparator) {
                  return this;
               }
               var separator = {
                  type:'separator',
                  innerMask: strSeparator
               };
               if ( ! this.model) {
                  this.model = [];
               }
               this.model.push(separator);
               return this;
            },

            /** Маска с управляющими символами строкой, например 'Lddd=xx' */
            getStrMask: function() {
               var strMask = '';
               for (var i = 0; i < this.model.length; i++) {
                  strMask += this.model[i].innerMask;
               }
               return strMask;
            }
         }
      },

      $constructor: function () {
         var
            inputValue,
            self = this,
            clearMask,
            key;
         this._inputField = $('.js-controls-FormattedTextBox__field', this.getContainer().get(0));
         this._primalMask = this._getMask();
         // [string] строка всех допустимых управляющих символов (без пробелов). Если набор допустимых символов не задан, то задается
         // набор основных управляющих символов, а так же возвращается строка из них
         this._controlCharacters = Object.keys(this._controlCharactersSet).join('');
         this.formatModel.setControlCharactersSet(this._controlCharactersSet);
         this.formatModel.setMask(this._options.mask);//lllxx=ddd:ddd,LLlll
         console.log(this.formatModel);
         clearMask = _getClearMask.call(this);
         // [boolean] Получить логическое, определяющее, является ли первый контейнер разделителем или вводимым блоком.
         // true: первый контейнер - разделитель, false: вводимый блок
         this._isSeparatorContainerFirst = clearMask[0] != this._maskReplacer;
         this._inputField.html(this._getHtmlMask());
         if (this._options.text) {
            this.setText(this._options.text);
         }
         this._container.bind('focusin', function () {
            self._focusHandler();
         });
         this._inputField.keypress(function (event) {
            event.preventDefault();
         });
         this._inputField.keyup(function (event) {
            event.preventDefault();
         });
         this._inputField.keydown(function (event) {
            key = event.which || event.keyCode;
            // сдвиг на 48 позиций по символьной таблице для корректного определения
            // цифровых значений на NumLock'е
            if (key >= 96 && key <= 105) {
               key -= 48;
            }
            if (key == self._KEYS.HOME && !event.shiftKey) {
               event.preventDefault();
               self._keyPressHandler(key, 'home');
            } else if (key == self._KEYS.END && !event.shiftKey) {
               event.preventDefault();
               self._keyPressHandler(key, 'end');
            } else if (key == self._KEYS.DELETE) {
               event.preventDefault();
               self._keyPressHandler(key, 'delete');
            } else if (key == self._KEYS.BACKSPACE) {
               event.preventDefault();
               self._keyPressHandler(key, 'backspace');
            } else if (key == self._KEYS.ARROW_LEFT && !event.shiftKey) {
               event.preventDefault();
               self._keyPressHandler(key, 'arrow_left');
            } else if (key == self._KEYS.ARROW_RIGHT && !event.shiftKey) {
               event.preventDefault();
               self._keyPressHandler(key, 'arrow_right');
            } else if (!event.ctrlKey &&
               key != self._KEYS.END && key != self._KEYS.HOME &&
               key != self._KEYS.ARROW_LEFT && key != self._KEYS.ARROW_RIGHT) {
               event.preventDefault();
               self._keyPressHandler(key, 'character', event.shift);
            }
         });
         this._inputField.bind('paste', function() {
            self._pasteProcessing++;
            window.setTimeout(function() {
               self._pasteProcessing--;
               if (!self._pasteProcessing) {
                  inputValue = self._inputField.text();
                  if (_checkTextByMask.call(self, inputValue)) {
                     self.setText(inputValue);
                  } else {
                     self.setText(self._options.text);
                     throw new Error('Устанавливаемое значение не удовлетворяет маске данного контролла');
                  }
               }
            }, 100);
         });
      },

      /**
       * Обновляяет значение this._options.text
       * null если есть хотя бы одно незаполненное место (плэйсхолдер)
       * @protected
       */
      _updateText:function() {
         var
            text = $(this._inputField.get(0)).text(),
            expr = new RegExp('(' + this._maskReplacer + ')', 'ig');
         // если есть незаполненные места, то опция text = null
         this._options.text = expr.test(text) ? '' : text;
      },

      _updateModelData: function() {
         //TODO читаем html с текстом, обновляем value в группах
      },

      /**
       * Получить текущую используемую маску.
       * @private
       */
      _getMask: function() {
         /*Method must be implemented*/
      },


      /**
       * Возвращает html-разметку для заданной маски
       * @param {string} text необязательный параметр, текст для установки (должен удовлетворять маске "символ в символ")
       * @returns {string} html-разметка
       * @private
       */
      _getHtmlMask: function(text) {
         var
            self = this,
            clearMask = _getClearMask.call(this),
            splitMask = clearMask.split(new RegExp('([^_]+)')),
            offset = 0,
            value = '',
            htmlMask = '';
         text = text || clearMask;
         splitMask.forEach(function(item){
            // если разделителя нет вначале и конце строки, то split возвращает пустой элемент массива
            if (!item) {
               return;
            }
            value = text.substr(offset, item.length);
            htmlMask += '<em class="controls-FormattedTextBox__field-symbol';
            // в em с плейсхолдером должен быть специальный класс для идентификации
            if (item[0] === self._maskReplacer) {
               htmlMask += ' controls-FormattedTextBox__field-placeholder';
            }
            htmlMask += '">' + value + '</em>';
            offset += item.length;
         });

         var newHtmlMask = '';
         if ( !this.formatModel || !this.formatModel.model) {
            return '';
         }
         var model = this.formatModel.model;
         for (var i = 0; i < model.length; i++) {
            newHtmlMask += '<em class="controls-FormattedTextBox__field-symbol';
            if (model[i].type == 'group') {
               newHtmlMask += ' controls-FormattedTextBox__field-placeholder';
               //TODO если данные есть, то нужно возвратить их, а не очищенную маску value = model[i].value;
               value = model[i].getReplaced(self._maskReplacer);
            } else {
               value = model[i].innerMask;
            }
            newHtmlMask += '">' + value + '</em>';
         }
         //FIXME убрать отладку
         console.log('_getHtmlMask=',htmlMask);
         console.log('newHtmlMask =',newHtmlMask);
         if (htmlMask == newHtmlMask) {
            console.info('равны');
         } else {
            console.error('НЕ равны');
         }
         return htmlMask;
      },


      /**
       * Обработка события фокусировки на элементе
       * TODO пока работает только в IE8+ и FireFox
       * @private
       */
      _focusHandler: function() {
         var
            child = this._isSeparatorContainerFirst ? 1 : 0,
            startContainer = this._inputField.get(0).childNodes[child].childNodes[0],
            startPosition = 0;
         _moveCursor(startContainer, startPosition);
      },

      /**
       * Обработка события нажатия клавиши
       * @param key
       * @param type
       * @param isShiftPressed
       * @private
       */
      _keyPressHandler: function(key, type, isShiftPressed) {
         var
            positionIndexesBegin = _getCursor.call(this, true),
            positionIndexesEnd = _getCursor.call(this, false),
            positionObject = {
               container: _getContainerByIndex.call(this, positionIndexesBegin[0]),
               position: positionIndexesBegin[1]
            },
            positionObjEnd = {
               container: _getContainerByIndex.call(this, positionIndexesEnd[0]),
               position: positionIndexesEnd[1]
            },
            regexp = this._keyExp(positionIndexesBegin[0], positionIndexesBegin[1]),
            character = String.fromCharCode(key),
            nextSibling = positionObject.container.parentNode.nextSibling;

         _clearSelect.call(this, positionObject, positionObjEnd);
         //получить группу модели
         var group = this.formatModel.model[positionIndexesBegin[0]],
             maskChar,
             newGroup;

         //курсор идёт вправо
         if (group.mask.length === positionObject.position  &&  type != 'backspace'  &&  type != 'arrow_left') {
            //ищем следующую группу
            positionIndexesBegin[0] += 2;
            group = this.formatModel.model[positionIndexesBegin[0]];
            positionObject.position = 0;
         }
         //курсор идёт влево
         if (type == 'backspace'  ||  type == 'arrow_left') {
            if (positionObject.position === 0) {
               //ищем предыдущую группу
               positionIndexesBegin[0] -= 2;
               newGroup = this.formatModel.model[positionIndexesBegin[0]];
               if (newGroup) {
                  group = newGroup;
                  positionObject.container = _getContainerByIndex.call(this, positionIndexesBegin[0]);
                  positionObject.position = group.mask.length;
               } else {
                  //positionObject.position = 0;
               }
            } else {
               positionObject.position--;
            }
         }

         if (type == 'character') {
            if ( !group) {
               return;
            }
            maskChar = group.innerMask.charAt(positionObject.position);
            // Обработка зажатой кнопки shift (-> в букву верхнего регистра)
            character = isShiftPressed ? character.toUpperCase() : character.toLowerCase();
            //получить для позиции символ маски и регулярное выражение для проверки
            var regExpChar = new RegExp(_charToRegExp(maskChar));
            //соответствует ли символ регулярному выражению
            if (!regExpChar.test(character)) {
               return;
            }
            character = (maskChar == 'L') ? character.toUpperCase() : character;
            character = (maskChar == 'l') ? character.toLowerCase() : character;

            //записываем символ в модель
            group.value[positionObject.position] = character;

            //записываем символ в html
            positionObject.container = _getContainerByIndex.call(this, positionIndexesBegin[0]);
            _replaceCharacter.call(this, positionObject.container, positionObject.position, character);
            positionObject.position++;
         } else if (type == 'delete') {
            //удалить символ в модели
            group.value[positionObject.position] = undefined;

            //обновить html
            positionObject.container = _getContainerByIndex.call(this, positionIndexesBegin[0]);
            _replaceCharacter.call(this, positionObject.container, positionObject.position, this._maskReplacer);
            positionObject.position++;
            positionObject = positionObjEnd;
         } else if (type == 'backspace') {
            //TODO удалить символ в модели

            //TODO обновить html
            //_getPreviousPosition(positionObject);
            _replaceCharacter.call(this, positionObject.container, positionObject.position, this._maskReplacer);
         } else if (type == 'arrow_left')   {
            //FIXME если курсов в конце последней группы - курсор прыгает через символы
            _getPreviousPosition(positionObject);
         } else if (type == 'arrow_right') {
            _getNextPosition(positionObject);
         } else if (type == 'home') {
            _getHomePosition.call(this, positionObject);
         } else if (type == 'end') {
            _getEndPosition.call(this, positionObject);
         }
         _moveCursor(positionObject.container, positionObject.position);
      },

      /**
       * возвращает RegExp для сравнения с символом нажатой клавиши
       * @param {Number} container порядковый номер блока, в котором находится символ
       * @param {Number} position порядковый номер символа в контейнере
       * @return {Array}
       */
      _keyExp: function(container, position) {
         if (this._isSeparatorContainerFirst) {
            container--;
         }
         if (container) {
            container /= 2;
         }
         var
            regexp = new RegExp('['+this._controlCharacters+']+', 'g'),
            array = this._primalMask.match(regexp),
            primalCharacter = array[container].charAt(position),
            controlCharacter = this._controlCharactersSet[primalCharacter],
            transform = { 'L': 'toUpperCase', 'l': 'toLowerCase' };
         return [new RegExp(_charToRegExp(controlCharacter)), transform[controlCharacter] || false];
      },

      _setEnabled: function(enabled) {
         FormattedTextBoxBase.superclass._setEnabled.call(this, enabled);
         this._inputField.attr('contenteditable', !!enabled);
      },
      /**
       * Установить значение в поле. Значение вводится в точности с маской, включая разделяющие символы
       * Пример. Если маска 'd(ddd)ddd-dd-dd', то setText('8(111)888-11-88')
       * @param text Строка нового значения
       * @protected
       */
      setText: function(text) {
         text = text ? text : '';
         if (typeof text == 'string') {
            if (text == '' || _checkTextByMask.call(this, text)) {
               text = text == '' ? '' : _correctRegister.call(this, text);
               this._inputField.html(this._getHtmlMask(text));
               FormattedTextBoxBase.superclass.setText.call(this, text);
            } else {
               throw new Error('Устанавливаемое значение не удовлетворяет маске данного контролла');
            }
         } else {
            throw new Error('Аргументом должна являться строка');
         }
      }

   });

   return FormattedTextBoxBase;

});