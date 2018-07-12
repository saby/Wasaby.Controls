define(
   'SBIS3.CONTROLS/FormattedTextBox/FormattedTextBoxBase',
   [
      'Core/IoC',
      'Core/constants',
      'Core/core-extend',
      'SBIS3.CONTROLS/Utils/IfEnabled',
      'SBIS3.CONTROLS/TextBox/TextBoxBase',
      'tmpl!SBIS3.CONTROLS/FormattedTextBox/FormattedTextBoxBase_mask',
      'Core/helpers/Function/forAliveOnly',
      'is!msIe?Deprecated/Controls/FieldString/resources/ext/ierange-m2-min'
   ],
   function (IoC, constants, cExtend, ifEnabled, TextBoxBase, maskTemplateFn, forAliveOnly) {

   'use strict';

      var
         createModel = function(controlCharactersSet, mask, regExp) {
            return new FormatModel({controlCharactersSet: controlCharactersSet, mask: mask, regExp: regExp});
         };

      var
      /**
       * Замещает символ в определенном контейнере в определённой позиции
       * @param container контейнер
       * @param position позиция замещаемого символа
       * @param character новый символ
       * @private
       * @author Крайнов Д.О.
       */
      _replaceCharacter = function(container, position, character) {
         var buffer = container.nodeValue.split('');
         buffer[position] = character;
         container.nodeValue = buffer.join('');
         this._updateText();
      },
      /**
       * Вычисляет котейнет и позицир и устанавливает курсора в начало
       * @private
       */
      _setHomePosition = function () {
         var group = this._getFormatModel().model[0];
         _moveCursor(_getContainerByIndex.call(this, (group  &&  group.isGroup) ? 0 : 1), 0);
      },

      /**
       * Вычисляет котейнер и позицию и устанавливает курсора в конец
       * @private
       */
      _setEndPosition = function () {
         var
             formatModel = this._getFormatModel(),
             groupInd = formatModel.model.length - 1,
             group = formatModel.model[groupInd];
         _moveCursor(_getContainerByIndex.call(this, (group  &&  group.isGroup) ? groupInd : --groupInd), formatModel.model[groupInd].mask.length);
      },
      _setPreviousPosition = function () {
         var cursor = this._getCursor(true),
             container = _getContainerByIndex.call(this, cursor[0]),
             prevSibling = container.parentNode.previousSibling,
             position = cursor[1];

         if (position === 0) {
            if (prevSibling && prevSibling.previousSibling) {
               container = prevSibling.previousSibling.childNodes[0];
               position = container.nodeValue.length - 1;
            }
         } else {
            position--;
         }
         _moveCursor(container, position);
      },
      _setNextPosition = function () {
         var cursor = this._getCursor(true),
             container = _getContainerByIndex.call(this, cursor[0]),
             nextSibling = container.parentNode.nextSibling,
             position = cursor[1];

         if (position == container.nodeValue.length) {
            if (nextSibling && nextSibling.nextSibling) {
               container = nextSibling.nextSibling.childNodes[0];
               position = 0;
            }
         } else {
            position++;
         }
         _moveCursor(container, position);
      },
      /**
       * Передвинуть курсор к заданной позиции
       * @param container блок
       * @param position позиция в блоке
       * @private
       */
      _moveCursor = function(container, position) {
         if (constants.browser.isIE  &&  constants.browser.IEVersion < 12) { //в Edge (ie12) не работает createTextRange
            var rng = document.body.createTextRange();
            rng.moveToElementText(container.parentNode);
            rng.move('character', position);
            rng.select();
         } else {
            var selection = window.getSelection();
            //Оборачиваем вызов selection.collapse в try из за нативной баги FireFox(https://bugzilla.mozilla.org/show_bug.cgi?id=773137)
            try {
               if (position < 0) {
                  //Safari (и iOS, и macOS) зависает, если позвать selection.collapse с отрицательным caretPosition
                  position = 0;
               }
               selection.collapse(container, position);
            } catch (e) {
            }
         }
      },
      /**
       * Конвертирует символ маски в регулярное выражение для данного символа
       * @param {String} c символ маски
       * @return {String}
       * @private
       */

      _charToRegExp = function(c, customRegExp) {
         var regexp;
         switch(c) {
            case 'r':
               regexp = customRegExp;
               break;
            case 'd':
               regexp = '[0-9]';
               break;
            case 'L':
            case 'l':
               regexp = '[А-ЯA-Zа-яa-zёЁ]';
               break;
            case 'X':
               regexp = '[A-Za-z0-9]';
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
         //TODO если в основном шаблоне или шаблоне маски есть пробелы или переносы строк, они собъют этот порядок
         return this._inputField.get(0).childNodes[parseInt(idx, 10)].childNodes[0];
      },

      /**
       * Возвращает массив индексов положения курсора
       * @param container
       * @param position
       * @return {Array} Массив [номер группы, номер символа]
       */
       //TODO: Изначально данный метод был полностью скопирован из ws FieldFormatAbstract, затем после рефакторинга
       //из него удалилась одна ветка. Иногда получается так что container приходит не em а conteneditable блок(например
       //после перехода на tab в firefox, скорее всего есть ещё случаи). Выпилинная ветка как раз обробатывала данный случай.
       //Нужно разобраться каким образом в разных браузерах работает window.getSelection() при различных условиях(переход на tab,
       //переход мышью, setActive...) и написать более универсальный метод.
      _getCursorContainerAndPosition = function(container, position) {
         var
            buf,// [Number] индекс контейнера <em> во wrapper'е
            isSepCont,// [Number] является ли контейнер разделителем (1) или вводимым блоком (0)
            cnt,// [Number] если контейнер - разделитель, то возвращается положение следующего контейнера
            pos = position,// [Number] если контейнер - разделитель, то возвращается начальная позиция курсора в контейнере
            sepFirst = !this._getFormatModel().model[0].isGroup,
            input = this._inputField.get(0);// поле ввода
         if (container.parentNode.childNodes.length > 1) {
            for (var i = 0; i < container.parentNode.childNodes.length; i++){
               if (container == container.parentNode.childNodes[i]){
                  pos = (i + sepFirst) % 2 ? 0 : i ? container.firstChild.length : position ? container.firstChild.length : position;
                  cnt = (i + sepFirst) % 2 ? i + 1 : i;
                  buf = container.parentNode.childNodes[cnt];
                  if (pos >= (buf.firstChild && buf.firstChild.length || 0)) {
                     pos = buf.nextSibling ? 0 : pos;
                     cnt = buf.nextSibling ? cnt + 2 : cnt;
                  }
               }
            }
         } else {
            buf = $(container.parentNode).index();
            isSepCont = (buf + !this._getFormatModel().model[0].isGroup) % 2;
            cnt = isSepCont ? buf + 1 : buf;
            pos = isSepCont ? 0 : position;
            // если контейнер - разделитель и он последний
            if (cnt >= input.childNodes.length) {
               cnt -= 2;
               pos = input.childNodes[cnt].childNodes[0].length;
            }
         }
         if (container === input){
            cnt = position ? position - 1 : 0;
            pos = position ? input.childNodes[cnt].childNodes[0].length : 0;
            return _getCursorContainerAndPosition.call(this, input.childNodes[cnt].childNodes[0], pos); // Вызывемся ещё раз с уточнёнными параметрами
         }
         return [cnt, pos];
      };

   /**
    * Класс для модели форматного поля
    * @class SBIS3.CONTROLS.FormatModel
    * @author Крайнов Д.О.
    */
   var FormatModel = cExtend({}, /** @lends SBIS3.CONTROLS.FormatModel.prototype */{
      $protected: {
         _options: {
            /* позиция курсора: храним индекс группы в модели + позцию символа в ней. */
            cursorPosition: {
               group: 0,
               position: 0
            }
         },
         //хранит текст, который прилетел через setText
         _settedText: '',
         /* модель хранит объекты разделителей и групп, порядок совпадает с порядком в маске */
         model: []
      },

      $constructor: function () {
         this.setMask(this._options.mask);
      },
      /**
       * Задать маску и создать модель
       * @param strMask маска, например '+++LLLlll///ddd---ddddddd===xxx' или 'HH:MM'
       */
      setMask: function(strMask) {
         var group = [],
            groupInner = [],
            separator = [],
            groupCharactersRegExp = /[LldxXr]/,
            maskChar,
            innerChar;

         this.model = [];

         //Явно преобразуем маску к строке, т.к. при построении на сервере, в ней лежит объект rk.
         strMask = '' + strMask;


         for (var i = 0; i < strMask.length; i++) {
            maskChar = strMask.charAt(i);
            //заменяем символы маски на внутренние, например HH:MM на dd:dd
            innerChar = maskChar;
            if (innerChar in this._options.controlCharactersSet) {
               innerChar = this._options.controlCharactersSet[maskChar];
            }
            if (groupCharactersRegExp.test(innerChar)) {
               if (separator.length) {
                  this._addItem(false, separator.join(''));
                  separator = [];
               }
               group.push(maskChar);
               groupInner.push(innerChar);
            } else {
               if (group.length) {
                  this._addItem(true, group.join(''), groupInner.join(''));
                  group = [];
                  groupInner = [];
               }
               separator.push(maskChar);
            }
         }
         if (group.length) {
            this._addItem(true, group.join(''), groupInner.join(''));
         }
         if (separator.length) {
            this._addItem(false, separator.join(''));
         }
         return this;
      },

      /**
       * Добавляет группу или разделитель в модель
       * @param isGroup true - элемент является группой, false - разделитель
       * @param mask первичная маска, например HH
       * @param innerMask внутренняя маска, например dd. Используем только для групп
       * @returns {boolean}
       * @private
       */
      _addItem: function(isGroup, mask, innerMask) {
         if ( !mask) {
            return false;
         }
         if ( ! this.model) {
            this.model = [];
         }
         var item = {
            isGroup: isGroup,
            mask: mask,
            innerMask: (isGroup) ? innerMask : mask,
            //символы хранятся в массиве, чтобы позволить вводить символы произвольно и разделять где символ не введён
            value: (isGroup) ? [] : mask.split('')
         };

         this.model.push(item);
         return true;
      },
      /**
       * Маска с управляющими символами строкой, например 'Lddd=xx'
       * @param clearChar опционально символ замены управляющих символов, можно использовать для получения чистой маски
       * вида '__:__'
       * @returns {string}
       */
      getStrMask: function(clearChar) {
         var strMask = '';
         for (var i = 0; i < this.model.length; i++) {
            strMask += (clearChar  &&  this.model[i].isGroup) ? this.model[i].innerMask.replace(/./ig, clearChar) : this.model[i].innerMask;
         }

         return strMask;
      },
      /**
       * Задать положение курсора
       * @param groupNum индекс группы относительно других групп и разделителей
       * @param position позиция в группе
       * @returns {boolean} true если курсор установлен
       */
      setCursor: function(groupNum, position) {
         var insertInfo,
            group;
         if ( !this.model  ||  this.model.length === 0) {
            throw new Error('setCursor. Не задана модель');
         }
         // Получаем текущую группу
         group = this.model[groupNum];
         // Если пытаемся установить курсор в конец группы то просто его устанавливаем.
         // Иначе вычисляем позицию курсора с учетом вставки символа
         if (group && group.isGroup && group.mask.length === position) {
            insertInfo = {
               groupNum: groupNum,
               position: position
            };
         } else {
            insertInfo = this._calcPosition(groupNum, position);
         }
         if (insertInfo) {
            this._options.cursorPosition.group = insertInfo.groupNum;
            this._options.cursorPosition.position = insertInfo.position;
         }
         return !!insertInfo;
      },
      /**
       * Проверяет подходит ли символ группе в заданной позиции
       * @param group
       * @param position
       * @param character символ, проверяемый на возможность вставки
       * @returns возвращает символ, с учетом корректировки регистра, если символ можно вставить, либо false если нельзя
       */
      charIsFitToGroup: function (group, position, character) {
         var maskChar,
            regExpChar;
         if ( !group  ||  position > group.mask.length  ||  character === '') {
            return false;
         }
         //маска для позиции
         maskChar = group.innerMask.charAt(position);
         if (group.isGroup) {
            //получить регулярное выражение для проверки

            regExpChar = new RegExp(_charToRegExp(maskChar, this._options.regExp));
            //соответствует ли символ регулярному выражению
            if (!regExpChar.test(character)) {
               return false;
            }
            character = (maskChar == 'L') ? character.toUpperCase() : character;
            character = (maskChar == 'l') ? character.toLowerCase() : character;
         } else {
            character = (character == maskChar) ? character : false;
         }

         return character;
      },
      /* вычисляет позицию для курсора, если курсор стоит в конце группы, пробует поставить курсор в следующуюу группу */
      _calcPosition: function(groupNum, position) {
         var group;
         group = this.model[groupNum];
         if ( !group  ||  !group.isGroup) {
            return false;
         }
         //вставка символа в конце группы
         if (group.mask.length <= position) {
            //ищем следующую группу
            groupNum += 2;
            group = this.model[groupNum];
            if (!group) {
               return false;
            }
            position = 0;
         }
         //вставка в предыдущую группу
         if (position == -1) {
            groupNum -= 2;
            group = this.model[groupNum];
            if (!group) {
               return false;
            }
            position = group.mask.length - 1;
         }
         return {
            group: group,
            groupNum: groupNum,
            position: position
         };
      },
      /**
       * Вставляет символ в заданную группу и позицию, если это возможно
       * @param groupNum индекс группы относительно других групп и разделителей
       * @param position позиция в группе
       * @param character вставляемый символ
       * @param isClear если true, то символ подставляется без учёта маски
       * @returns {object|boolean} если втавка прошла успешно, возвращает объект с информацией о вставке
       */
      insertCharacter: function(groupNum, position, character, isClear) {
         var group,
             insertInfo;

         if ( !this.model  ||  this.model.length === 0) {
            throw new Error('insertCharacter. Не задана модель');
         }
         insertInfo = this._calcPosition(groupNum, position);
         if (!insertInfo) {
            return false;
         }
         group = insertInfo.group;
         if (isClear) {
            group.value[insertInfo.position] = undefined;
         } else {
            character = this.charIsFitToGroup(group, insertInfo.position, character);
            if (character) {
               group.value[insertInfo.position] = character;
            } else {
               return false;
            }
         }

         insertInfo.character = character;
         //задать курсор
         this._options.cursorPosition.group = insertInfo.groupNum;
         this._options.cursorPosition.position = insertInfo.position + 1;

         return insertInfo;
      },

      /**
       * Заполнена ли модель полностью
       * @returns {boolean} true если все позиции заполнены, false в противном случае
       */
      isFilled: function() {
         var isFilled = true,
             group;
         for (var i = 0; i < this.model.length; i++) {
            group = this.model[i];
            if (group.isGroup) {
               for (var j = 0; j < group.mask.length; j++) {
                  if (typeof group.value[j] === 'undefined') {
                     isFilled = false;
                     break;
                  }
               }
               if ( ! isFilled) {
                  break;
               }
            }
         }
         return isFilled;
      },

      /**
       * Модель полностью не заполнена
       * @returns {boolean} true если ни одной позиции не заполнено, false в противном случае
       */
      isEmpty: function(maskReplacer) {
         return this.getStrMask(maskReplacer) === this.getText(maskReplacer);
      },
      /**
       * Проверяет подходит ли текст маске модели. Например, маске 'HH:MM' подходит текст '12:34'
       * @param text строка, например '23:37'. Можно использовать символ заполнитель, например '_3:37'
       * @param clearChar символ-заполнитель, например '_'.
       * @returns {Array|boolean} если текст проходит проверку, вернёт массив обработанных значений, если нет - false
       */
      textIsFitToModel: function(text, clearChar) {
         var
            i,
            item,
            groupValue,
            isEmpty = true,
            tempModelValues = [];

         for (i = 0; i < this.model.length; i++) {
            item = this.model[i];
            if (item.isGroup) {
               groupValue = this._getValueForGroup(text, item, clearChar);
               text = groupValue.text;
               tempModelValues[i] = groupValue.value;
               if (groupValue.value.length) {
                  isEmpty = false;
               }
            } else if (text.indexOf(item.mask) === 0) {
               //Удаляем разделители при разборе текста, так как они могут содержать символы подходящие по маске.
               //Например если маска имеет вид +7(ddd) и усановке текста +7(123) мы не должны считывать 7 при
               //поиске текста подходящего под ddd.
               text = text.substr(item.mask.length);
            }
         }

         return isEmpty ? false : tempModelValues;
      },

      //Метод по переданному тексту и маске, возвращает первое вхождение символов, уоторые подходят под маску
      _getValueForGroup: function(text, group, clearChar) {
         var
            character,
            value = [];
         text = text.split('');
         for (var i = 0; i < group.innerMask.length; i++) {
            while (text.length) {
               character = text.splice(0, 1)[0];
               //Для обратной совместимости проверяем на символ &ensp;
               character = (character === clearChar || character === ' ') ? undefined : this.charIsFitToGroup(group, i, character);
               if (character !== false) {
                  value.push(character);
                  break;
               }
            }
         }
         return {
            value: value,
            text: text.join('')
         };
      },
      /**
       * Записать текст в модель
       * @param text строка, например '23:37'. Можно использовать символ заполнитель, например '_3:37'
       * @param clearChar символ-заполнитель, например '_'
       * @returns {boolean} true - если строка установлена
       */
      setText: function(text, clearChar) {
         // TODO запоминаем что изначально пришло, чтобы можно было null обработать (из контекста), но при этом выводить незаполненное поле
         //      надо как-то иначе это обработать
         this._settedText = text;
         if (text === '' || text === null || typeof text === "undefined") {
            text = this.getStrMask(clearChar);
         }
         /*массив со значениями, нужен чтобы не записывать значения до полной проверки соответствия текста маске */
         var tempModelValues = this.textIsFitToModel(text, clearChar),
             group;
         if ( !tempModelValues)   {
            return false;
         }
         //записываем проверенные данные
         for (var i = 0; i < this.model.length; i++) {
            group = this.model[i];
            if (group.isGroup) {
               group.value = tempModelValues[i];
            }
         }

         return true;
      },

      /**
       * Получить полный текст, например '23:3_'
       * @param clearChar - символ заменяющий не заданные символы, например '_'
       * @returns {string} текст модели с введенными символами
       */
      getText: function(clearChar) {
         var text = '',
             group;
         for (var i = 0; i < this.model.length; i++) {
            group = this.model[i];
            if (group.isGroup) {
               for (var j = 0; j < group.mask.length; j++) {
                  text += (typeof group.value[j] === 'undefined') ? clearChar : group.value[j];
               }
            } else {
               text += group.innerMask;
            }
         }
         return text;
      },
      /**
       * Получить значение группы по маске
       * @param groupMask - маска группы, для которой необходимо получить значение
       * @param clearChar - символ заменяющий не заданные символы, например '_'
       * @returns {string} текст группы с введенными символами
       */
      getGroupValueByMask: function(groupMask, clearChar) {
         var
             group,
             value = '';
         for (var i = 0; i < this.model.length; i++) {
            group = this.model[i];
            if (group.mask === groupMask) {
               for (var j = 0; j < group.mask.length; j++) {
                  value += (typeof group.value[j] === 'undefined') ? clearChar : group.value[j];
               }
               return value;
            }
         }
      }
   });

   /**
    * Абстрактный класс для контролов, в которых необходим ввод особого формата (телефон, дата, время и дригие).
    * В конечный контрол передается маска с помощью опции mask - будет разрешён ввод данных в контрол строго по маске.
    * Условные обозначения основных управляющих символов:
    * <ol>
    *    <li>d - цифра.</li>
    *    <li>L - заглавная буква.</li>
    *    <li>l - строчная буква.</li>
    *    <li>x - буква или цифра.</li>
    *    <li>"/", "-", ":", " ", "." - разделители.</li>
    * </ol>
    * @class SBIS3.CONTROLS/FormattedTextBox/FormattedTextBoxBase
    * @extends SBIS3.CONTROLS/TextBox/TextBoxBase
    * @public
    * @author Крайнов Д.О.
    */

   var FormattedTextBoxBase = TextBoxBase.extend(/** @lends SBIS3.CONTROLS/FormattedTextBox/FormattedTextBoxBase.prototype */ {
       /**
        * @event onInputFinished По окончании ввода
        * @param {Core/EventObject} eventObject Дескриптор события.
        * @example
        * По завершению ввода добавим в конец маски группу из 3 цифр
        * <pre>
        *     formattedTextBox.setMask('dd(dd)');
        *     var maskReplacer = '_';
        *     var onInputFinishedFn = function() {
        *        var text = formattedTextBox.formatModel.getText(maskReplacer);
        *        if (text.length == 6) {
        *           formattedTextBox.setMask('dd(dd)ddd');
        *           //новый текст должен точно совпадать с маской, поэтому добавляем к нему символы маски
        *           formattedTextBox.setText(text+'___');
        *           formattedTextBox.setCursor(4,0);
        *        }
        *     }
        *     formattedTextBox.subscribe('onInputFinished', onInputFinishedFn);
        * </pre>
        * @see setMask
        * @see onInputFinished
        * @see setCursor
        * @see setText
        */
      $protected: {
         /**
          * Html-элемент, в который будет добавлена динамически создаваемая, в зависимости от маски, html-разметка
          */
         _inputField: null,
         /**
          * Допустимые при создании контролла маски.
          */
         _possibleMasks: null,
         /**
          * Опции создаваемого контролла
          */
         _options: {
            /**
             * Набор допустимых управляющих символов в маске. Задаются отдельно в каждом контроле в зависимости от контекста.
             * Пример:
             *       Для контролла DatePicker это: Y(год), M(месяц), D(день), H(час), I(минута), S(секунда), U(доля секунды).
             * Каждому допустимому символу ставится в соответствие основной управляющий символ, в зависимости от которого
             * определяется, какой тип символа может вводиться.
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
               'X': 'X',
               'x': 'x',
               'r': 'r'
            },

            /**
             * Символ-заполнитель, на который замещаются все управляющие символы в маске для последующего отображения на
             * странице. В маске изначально не должны присутствовать символы-заполнители. По умолчанию используется знак
             * нижнего подчёркивания.
             * !Важно: нельзя использовать знак вопроса.
             */
            _maskReplacerForTemplate: ' ',//Разделителем в вёрстке служит спецсимвол &ensp;
            _maskReplacer: ' ',//Пробел
            // ! в файле маски (FormattedTextBoxBase_mask.xhtml) не оставлять пробелы и переносы строк
            _maskTemplateFn: maskTemplateFn,
            //упрощенная модель для вставки в xhtml-шаблон
            _modelForMaskTpl: [],
            _createModel : createModel
         }
      },

      $constructor: function () {
         var self = this;
         this._publish('onInputFinished','onTextChange');
         // Проверяем, является ли маска, с которой создается контролл, допустимой
         this._checkPossibleMask();
         this._inputField = $('.js-controls-FormattedTextBox__field', this.getContainer().get(0));
         //Единственно верная подписка, которая гарантирует что фокус там где надо.
         //Не надо перевешивать подписку на _container иначе https://online.sbis.ru/opendoc.html?guid=9f0d7c3f-f44c-41d4-86bb-05d93e82dc22
         //Не надо переходить на плаформенный onFocusIn иначе https://online.sbis.ru/opendoc.html?guid=55c1221e-6896-489c-b4b5-ca9c5d1b649f
         this._inputField.bind('focus', function () {
            self._focusHandler();
         });
         this._inputField.keyup(function (event) {
            event.preventDefault();
         });
         this._inputField.bind('dragstart', function(e) {
            e.preventDefault();
         });
         this._inputField.bind('drop', function(e) {
            e.preventDefault();
         });
         //keypress учитывает расскладку, keydown - нет
         this._inputField.keypress(this._onKeyPress.bind(this));
         //keydown ловит управляющие символы, keypress - нет
         this._inputField.keydown(this._onKeyDown.bind(this));
         this._inputField.bind('paste', function(e) {
            var
                //Единственный способ понять, что мы пытаемся вставить это посмотреть в буфере.
                //Берём из буфера только текст, так-как возможно там присутствует и разметка, которая нас не интересует.
                pasteValue = e.originalEvent.clipboardData ? e.originalEvent.clipboardData.getData('text') : window.clipboardData.getData('text');
            self._onPasteValue(pasteValue);
            e.preventDefault();
         });
         //предотвращаем вырезание маски
         this._inputField.bind('cut', function(e) {
            e.preventDefault();
         });
         this._chromeCaretBugFix();
      },

      _onPasteValue: function(pasteValue) {
         var
            formatModel = this._getFormatModel(),
            maskReplacer = this._getMaskReplacer();

         if (this.isEnabled() && formatModel.setText(pasteValue, maskReplacer)) {
            this.setText(formatModel.getText(maskReplacer));
         }
      },

      _onKeyPress: ifEnabled(function (event) {
         if (!this._isFirefoxKeypressBug(event)) {
            this._keyPressBind(event);
         }
      }),
      _onKeyDown: ifEnabled(function (event) {
         var self = this;
         /*У некоторых android'ов спецефичная логика обработки клавишь:
          1) Не стреляет событие keypress
          2) Событие keydown стреляет послое вставки символа
          3) Из события не возможно понять какая клавиша была нажата, т.к. возвращается keyCode = 229 || 0
          Для таких андроидов обрабатываем ввод символа отдельно
          ВАЖНО: Прямой проверки на android нет, т.к. в хроме есть режим "Открыть полную версию", который в userAgent'e
          проставляет значение unix'a, а не андроида. Смотрим только на битый keyCode
          */
         if (event.keyCode === 229 || event.keyCode === 0 || !event.keyCode){
            if (!this._asyncAndroid) {
               this._asyncAndroid = true;
               setTimeout(function() {
                  forAliveOnly(self._keyDownBindAndroid.bind(self, event), self)();
                  self._asyncAndroid = false;
               }, 0);
            }
            else {
               //зажали кнопку удалить, наши обработчики не успевают отработать посимвольно
               //Считаем, что хотели стереть все содержимое
               this._setText(this._getClearText());
               _moveCursor(_getContainerByIndex.call(this, 0), 0);
            }
         }
         else{
            this._keyDownBind(event);
         }
      }),
      //FF зачем то кидает событие keypress для управляющих символов(charCode === 0), в отличии от всех остальных браузеров.
      //Просто проигнорируем это событие, т.к. управляющая клавиша уже обработана в keydown. Так же отдельно обработаем
      //ctrl, т.к. для всех комбинаций с ctrl keypress так же вызываться не должен.
      _isFirefoxKeypressBug: function(event) {
         return constants.browser.firefox && (event.charCode === 0 || event.ctrlKey);
      },

      //В Chrome при уходе фокуса из поля ввода, если фокус ушёл с помощью jQuery focus, то каретка остаётся в поле ввода,
      //при этом при вводе, события клавиатуры на поле ввода не генерируются, и символы вставляются несмотря на маску.
      //В таком случае сами уберём каретку из поля ввода.
      _chromeCaretBugFix: function() {
         if (constants.browser.chrome) {
            this._inputField.bind('blur', function () {
               window.getSelection().removeAllRanges();
            });
         }
      },

      _getFormatModel: function(options) {
         // _formatModel вроде не используется в шаблонах и может быть вынесена из опций
         options = options || this._options;
         return options._formatModel;
      },

      _getMaskReplacer: function(options) {
         options = options || this._options;
         return options._maskReplacer;
      },

      _getMaskReplacerForTemplate: function(options) {
         options = options || this._options;
         return options._maskReplacerForTemplate;
      },

      //Тут обрабатываются управляющие команды
      _keyDownBind: function(event) {
         var
             isCtrl = event.ctrlKey,
             isShift = event.shiftKey,
             key = event.which || event.keyCode;

         if (key == constants.key.home && !isShift) {
            _setHomePosition.call(this);
         } else if (key == constants.key.end && !isShift) {
            _setEndPosition.call(this);
         } else if (key == constants.key.left && !isShift) {
            _setPreviousPosition.call(this);
         } else if (key == constants.key.right && !isShift) {
            _setNextPosition.call(this);
         } else if (key == constants.key.del) {
            this._clearCommandHandler('delete');
         } else if (key == constants.key.backspace) {
            this._clearCommandHandler('backspace');
         } else if (key == constants.key.pageUp || key == constants.key.pageDown) {
            // предотвращаем проскроливание страницы по нажатию на pageUp и pageDown
         } else if (key == constants.key.enter && constants.browser.firefox) {
            //в firefox по нажатию на enter в вёрстку добавляется <br> и начинает ехать вёрстка
            event.preventDefault();
         } else {
            return;
         }
         event.preventDefault();
      },
       //Тут обрабатываются текстовые символы
      _keyPressBind: function(event) {
         var key = event.which || event.keyCode,
             character = String.fromCharCode(key),
             positionIndexes = this._getCursor(true),
             position = positionIndexes[1],
             groupNum = positionIndexes[0];

         this._keyPressBindHandler(event, character, position, groupNum);
      },

      _keyPressBindHandler: function(event, character, position, groupNum){
         var keyInsertInfo;

         //TODO сбрасываем, чтобы после setText(null) _updateText после ввода символов обновлял опцию text
         this._getFormatModel()._settedText = '';

         character = event.shiftKey ? character.toUpperCase() : character.toLowerCase();
         keyInsertInfo = this._getFormatModel().insertCharacter(groupNum, position, character);
         this._afterCharacterInsertHandler(keyInsertInfo);

         event.preventDefault();
      },

      _keyDownBindAndroid: function (event) {
         var textGroups = this._getTextGroupAndroid(),
            isRemove = this.getText().length > this._inputField.text().length || (!this.getText().length && this._getMask().length > this._inputField.text().length),
            nativeCursorPosition = this._getCursor(true),
            textDiff = this._getTextDiff(textGroups.oldText, textGroups.newText, textGroups.maskGroups, isRemove);

         this._setText(this._options.text);

         if (this._isChangeSeparatorLength(textGroups) || !textDiff) {
            //если oldText.length !== newText.length значит добавили/удалили сепаратор, который добавлять нельзя.
            //в этом случае просто восстанавливаем текст и курсор, который был до удаления
            _moveCursor(_getContainerByIndex.call(this, nativeCursorPosition[0]), nativeCursorPosition[1]);
         }
         else if (isRemove) {
            _moveCursor(_getContainerByIndex.call(this, nativeCursorPosition[0]), nativeCursorPosition[1] + 1);
            this._clearCommandHandler('backspace');
         }
         else {
            this._keyPressBindHandler(event, textDiff.character, textDiff.position, textDiff.groupNum);
         }
      },

      _isChangeSeparatorLength: function(textGroups) {
         return textGroups.oldText.length !== textGroups.newText.length;
      },

      _getTextDiff: function(oldText, newText, maskGroups, isRemove){
         if (this._isChangeSeparatorLength({oldText: oldText, newText: newText})) {
            return {};
         }
         for (var i = 0, l = newText.length; i < l; i++) {
            if (oldText[i].length !== newText[i].length){
               for (var j = 0; j < newText[i].length; j++){
                  if (oldText[i][j] !== newText[i][j]){
                     //Если рядом с введенным символом стоят такие же символы('111'), то стандартным перебором не поймем, в какую позицию был произведен ввод
                     //В этом случае берем нативную позицию курсора
                     if (newText[i][j] === newText[i][j-1] || newText[i][j] === newText[i][j+1]) {
                        return this._getDiffInfo(oldText, newText, maskGroups, isRemove, i, this._getCursor(true)[1] - 1);
                     }
                     return this._getDiffInfo(oldText, newText, maskGroups, isRemove, i, j);
                  }
               }
            }
         }

         if (isRemove) {
            //Удалили последний символ в группе
            return this._getDiffInfo(oldText, newText, maskGroups, isRemove, --i, j);
         }
         return false;
      },

      _getDiffInfo: function(oldText, newText, maskGroups, isRemove, i, j) {
         return {
            character: isRemove ? oldText[i][j] : newText[i][j],
            // проверка на возможность ввода символа в группу,
            // если в данную группу нельзя ввести символы, то вводим в первую позицию след разрешенной группы
            position: maskGroups[i].replace(/[l,L,d,D,h,H,i,I,s,S,x,X,m,M,y,Y,r]/g,'').length === maskGroups[i].length ? 0 : j,
            groupNum: this._getCursor(true)[0]
         }
      },

      _getTextGroupAndroid: function() {
         var
            text,
            splitRegExp = this._getSplitterRegExp(),
            formatModel = this._getFormatModel();

         if (this._options.text) {
            text = formatModel.getText(this._getMaskReplacerForTemplate());
         }

         return {
            oldText: text ? text.split(splitRegExp)  : this._getClearText().split(splitRegExp),
            newText: this._inputField.text().split(splitRegExp),
            maskGroups: this._getMask().split(splitRegExp)
         };
      },

      _getSplitterRegExp: function(){
         return /[.,\/\- :=()+]/;
      },

      _getClearText: function(){
         return this._getFormatModel().getStrMask(this._getMaskReplacerForTemplate());
      },

      _clearCommandHandler: function(type) {
         var
             positionIndexesBegin = this._getCursor(true),
             positionIndexesEnd = this._getCursor(false),
             position = positionIndexesBegin[1],
             groupNum = positionIndexesBegin[0],
             group = null,
             startGroupNum = null,
             endGroupNum = null,
             positionOffset = (type == 'backspace') ? -1 : 0,
             keyInsertInfo;

         //TODO сбрасываем, чтобы после setText(null) _updateText после ввода символов обновлял опцию text
         this._getFormatModel()._settedText = '';

         //Если в поле ввода выделен текст
         if (positionIndexesBegin[0] != positionIndexesEnd[0] || positionIndexesBegin[1] != positionIndexesEnd[1]) {
            // если текст выделен, то необходимо свдинуть позицию на 1 влево, т.к. в случае с delete возникает пустой отступ
            positionOffset = -1;
            //проходим группы с конца, чтобы закончить самым левым символом выделенного текста и использовать его данные в keyInsertInfo о позиции курсора
            startGroupNum = positionIndexesBegin[0];
            endGroupNum   = positionIndexesEnd[0];
            for (var i = endGroupNum; i >= startGroupNum; i--) {
               group = this._getFormatModel().model[i];
               //проходим только группы, т.к. разделители не интересуют
               if ( ! group.isGroup) {
                  continue;
               }
               /* средняя группа - значение по умолчанию.
                Средняя для выбора например мы выделили такой текст: 11)222-34 из текста 8 (111)222-34-56.
                Средняя здесь это не начальная и не конечная группа выделения, т.е. 222, 111 - начальная, а 34 - конечная
                */
               var startCharNum = 0,
                   endCharNum = group.mask.length - 1;
               //последняя группа выделенного текста
               if (i == endGroupNum) {
                  endCharNum = positionIndexesEnd[1] - 1;
               }
               //первая группа выделенного текста
               if (i == startGroupNum) {
                  startCharNum = positionIndexesBegin[1];
               }
               for (var j = endCharNum; j >= startCharNum; j--) {
                  keyInsertInfo = this._getFormatModel().insertCharacter(i, j, this._getMaskReplacerForTemplate(), true);
               }
            }
            //модель обновили - обновляем опцию text и html-отображение
            this._updateText();
            this._setHtml(this._getHtmlMask());
         } else {
            keyInsertInfo = this._getFormatModel().insertCharacter(groupNum, position + positionOffset, this._getMaskReplacerForTemplate(), true);
         }
         this._afterCharacterInsertHandler(keyInsertInfo, positionOffset);
      },

      _afterCharacterInsertHandler: function(keyInsertInfo, positionOffset) {
         var
             position,
             container,
             lastGroupNum,
             formatModel = this._getFormatModel();
         if (keyInsertInfo) {
            container = _getContainerByIndex.call(this, keyInsertInfo.groupNum);
            //записываем символ в html
            _replaceCharacter.call(this, container, keyInsertInfo.position, keyInsertInfo.character);
            position = formatModel._options.cursorPosition.position + (positionOffset || 0);
            //проверяем был ли введен последний символ в последней группе
            lastGroupNum = formatModel.model.length - 1;
            lastGroupNum = formatModel.model[lastGroupNum].isGroup ? lastGroupNum : lastGroupNum - 1;
            //Заново ищем контейнер группы, т.к. после замены символа, снаружи значение текста может быть изменено(например setText)
            //и html будет полность изменён, а в переменной container лежит элемент, которого в DOM уже нет, и курсор не сможет верно спозиционироваться
            _moveCursor(_getContainerByIndex.call(this, keyInsertInfo.groupNum), position);
            //Если positionOffset = -1, это значит был нажат backspace, и onInputFinished в таком случае стрелять не надо
            if (positionOffset !== -1 && keyInsertInfo.groupNum == lastGroupNum  &&  keyInsertInfo.position == formatModel.model[lastGroupNum].mask.length - 1) {
               this._notify('onInputFinished');
            }
         }
      },

      /* Переопределяем метод Lib/Mixins/CompoundActiveFixMixin чтобы при клике нормально фокус ставился
       */
      _getElementToFocus: function() {
         return this._inputField;
      },

      /**
       * Изменяем опции до отрисовки
       */
      _modifyOptions: function(options) {
         var formatModel = createModel(options._controlCharactersSet, options.mask, options.regExp);
         if (options.text) {
            options.text = options.text.replace(/ /g, options._maskReplacer);
            formatModel.setText(options.text, options._maskReplacer);
         }
         options._formatModel = formatModel;
         //записываем модель для шаблона
         options._modelForMaskTpl = this._getItemsForTemplate(formatModel, options._maskReplacerForTemplate);
         return options;
      },

      /**
       * Создает контекст который будет передан в шаблон при отрисовке контрола
       * @param formatModel
       * @param maskReplacer
       * @return {Array}
       * @private
       */
      _getItemsForTemplate: function(formatModel, maskReplacer) {
         var
             value,
             items = [],
             model = formatModel.model;

         for (var i = 0; i < model.length; i++) {
            value = '';
            for (var j = 0; j < model[i].mask.length; j++) {
               value += (typeof model[i].value[j] === 'undefined') ? maskReplacer : model[i].value[j];
            }
            items.push({isGroup: model[i].isGroup, text: value});
         }
         return items;
      },

      /**
       * Обновляяет значение this._options.text
       * @protected
       */
      _updateText:function() {
         //TODO неодинаковое поведение получается для разного text. Но нельзя this._options.text не обновлять, т.к. его getText() использует
         this._updateTextFromModel();
         this._notifyOnTextChange();
      },

      _updateTextFromModel: function() {
         var text = this._getTextFromModel();
         if (this._options.text !== text) {
            this._options.text = text;
            //снимаем выделение валидатора на время ввода
            this.clearMark();
         }
      },

      _getTextFromModel: function() {
         var formatModel = this._getFormatModel();
         //Если форматное поле не заполено, то в опцию text не нужно класть пустую маску.
         return (formatModel._settedText !== null && typeof formatModel._settedText !== "undefined" && !formatModel.isEmpty(this._getMaskReplacer())) ? formatModel.getText(this._getMaskReplacer()) : formatModel._settedText;
      },

      _notifyOnTextChange: function() {
         this._notify('onTextChange', this._options.text);
         this._notifyOnPropertyChanged('text');
      },

      /**
       * Получить текущую используемую маску.
       * @private
       */
      _getMask: function() {
         return this._options.mask;
      },

      /**
       * Проверить, является ли маска допустимой ( по массиву допустимых маск this._possibleMasks )
       * @private
       */
      _checkPossibleMask: function(){
         if (this._possibleMasks && this._options.mask && this._possibleMasks.indexOf(this._options.mask) == -1){
            throw new Error('_checkPossibleMask. Маска не удовлетворяет ни одной допустимой маске данного контролла');
         }
      },

      /**
       * Возвращает html-разметку для заданной маски
       * @returns {string} html-разметка
       * @private
       */
      _getHtmlMask: function() {
         //передать в шаблон
         return maskTemplateFn(this._getItemsForTemplate(this._getFormatModel(), this._getMaskReplacerForTemplate()));
      },

      /**
       * Обработка события фокусировки на элементе
       * @private
       */
      //TODO пока работает только в IE8+ и FireFox
      _focusHandler: function() {
         this._moveCursor();
      },

      _moveCursor: function(group, position) {
         var
            child = group || (this._getFormatModel().model[0].isGroup ? 0 : 1),
            startContainer = _getContainerByIndex.call(this, child),
            startPosition = position || 0;

         _moveCursor(startContainer, startPosition);
      },

      _setEnabled: function(enabled) {
         FormattedTextBoxBase.superclass._setEnabled.call(this, enabled);
         this._inputField.attr('contenteditable', !!enabled);
      },

      /**
       * Установка курсора в заданную позицию
       * @remark
       * Задание положения курсора может требоваться при динамической смене маски, например, по мере ввода значений.
       * В остальных случаях управлять положением курсора не требуется.
       * @param {Number} groupNum Номер контейнера.
       * @param {Number} position Позиция в контейнере.
       * @returns {Boolean} Положение курсора.
       * @example
       * По завершению ввода добавим в конец маски группу из 3 цифр
       * <pre>
       *     formattedTextBox.setMask('dd(dd)');
       *     var maskReplacer = '_';
       *     var onInputFinishedFn = function() {
       *        var text = formattedTextBox.formatModel.getText(maskReplacer);
       *        if (text.length == 6) {
       *           formattedTextBox.setMask('dd(dd)ddd');
       *           //новый текст должен точно совпадать с маской, поэтому добавляем к нему символы маски
       *           formattedTextBox.setText(text+'___');
       *           formattedTextBox.setCursor(4,0);
       *        }
       *     }
       *     formattedTextBox.subscribe('onInputFinished', onInputFinishedFn);
       * </pre>
       * @see setMask
       * @see onInputFinished
       */
      setCursor: function(groupNum, position) {
         var formatModel = this._getFormatModel(),
            currentGroup = formatModel._options.cursorPosition.group,
            currentPosition = formatModel._options.cursorPosition.position,
            newContainer;
         if (!formatModel.setCursor(groupNum, position)) {
            return false;
         }
         newContainer = _getContainerByIndex.call(this, formatModel._options.cursorPosition.group);
         formatModel._options.newContainer = newContainer;
         formatModel._options.newPosition = formatModel._options.cursorPosition.position;
         // Если курсор не совпадает с текущей позицией передвигаем каретку
         if (currentGroup !== groupNum || currentPosition !== position) {
            _moveCursor(newContainer, formatModel._options.cursorPosition.position);
         }
      },

      /**
       * Получить положение курсора
       * @param {Boolean} position Позиция: true — начала, false — конца
       * @returns {Array} Массив положений [номер контейнера, сдвиг]
       * @protected
       */
      _getCursor: function(position) {
         var
            formatModel = this._getFormatModel(),
            selection = constants.browser.isIE10 ? window.getSelectionForIE() : window.getSelection();
         if (selection.type !== 'None') {
            selection = selection.getRangeAt(0);
            this._lastSelection = selection;
         } else {
            selection = this._lastSelection || selection;
            if (selection  &&  formatModel._options.newContainer) {
               selection.setStart(formatModel._options.newContainer, 0);
               selection.setEnd(formatModel._options.newContainer, 0);
               formatModel._options.newContainer = undefined;
            }
         }

         return (position ?
               _getCursorContainerAndPosition.call(this, selection.startContainer, selection.startOffset) :
               _getCursorContainerAndPosition.call(this, selection.endContainer, selection.endOffset)
         );
      },

      /**
       * Установить значение в поле.
       * @remark
       * Значение вводится в точности с маской, включая разделяющие символы.
       * При передаче строки, не соответствующей маске, значение не проставится.
       * Например, при маске '+d (ddd) ddd - dd - dd' в передаваемом значении нужно не забыть проставить пробелы.
       * @param {String} text Строка нового значения.
       * @protected
       * @example
       * <pre>
       *     //если маска 'd(ddd)ddd-dd-dd', то следует задать значение вида
       *     this.setText('8(111)888-11-88');
       * </pre>
       * @see setMask
       * @see onInputFinished
       * @see setCursor
       */
      setText: function(text) {
         if (this._options.text !== text) {
            this._setText(text);
         }
      },
      _setText: function(text){
         var model = this._getFormatModel();
         model.setText(text, this._getMaskReplacer());
         this._updateText();
         this._textChanged = true;
         //снимаем выделение валидатора на время ввода
         this.clearMark();
         //обновить html
         this._setHtml(this._getHtmlMask());
         if (model.isFilled()) {
            this._notify('onInputFinished');
         }
      },
      /**
       * Задает маску в модель и обновляет html.
       * @param {String} mask Маска строкой, например 'dd:dd', 'HH:MM'
       * @example
       * Зададим маску для паспорта
       * <pre>
       *     formattedTextBox.setMask('dd dd dddddd');
       * </pre>
       * @see setText
       * @see setCursor
       */
      setMask: function(mask) {
         var self = this,
            formatModel = this._getFormatModel();
         this._options.mask = mask;
         formatModel.setMask(mask);
         this._setHtml(this._getHtmlMask());
         // Перемещаем курсор в модели в начало т.к каретка становится вначале поля ввода.
         formatModel.setCursor(0, 0);
         //TODO исправить выставление курсора
         setTimeout(forAliveOnly(function() {
            //Если контрол не сфокусирован, и мы вызываем нажатие alt, то
            //вывалится ошибка при вызове getSelection, ловим ее здесь.
            try {
               self._keyPressHandler(18);
            } catch(ex) {
               IoC.resolve('ILogger').log('FormattedTextBox', ex.message);
            }
         }, self), 0);
      },
      _setHtml: function(html) {
         //IE при смене html ставит курсор в конец блока (все остальные браузеры ставят в начало). https://jsfiddle.net/qkhunhhm/14/
         //Но если в IE перемещать курсор в начало, то произойдёт подскролл к элементу, чего быть не должно. https://jsfiddle.net/qkhunhhm/15/
         //Поэтому оставим поведение, с перемещением курсора в IE в конец.
         this._inputField.html(html);
      }

   });

   return FormattedTextBoxBase;
});