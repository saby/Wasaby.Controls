define(
   'js!SBIS3.CONTROLS.FormattedTextBoxBase',
   [
      'js!SBIS3.CONTROLS.TextBoxBase',
      'is!msIe?js!SBIS3.CONTROLS.FormattedTextBoxBase/resources/ext/ierange-m2-min'
   ],
   function ( TextBoxBase ) {

   'use strict';

   /**
    * Абстрактный класс для контроллов, в которых необходим ввод особого формата (телефон, дата, время, etc).
    * В конечный контролл передается маска с помощью опции mask. Управляющие символы в маске, определяющие,
    * какие символы могут вводиться, определяются предназначением контролла.
    * @class SBIS3.CONTROLS.FormattedTextBoxBase
    * @extends $ws.proto.Control
    * @control
    */

   var FormattedTextBoxBase = TextBoxBase.extend( /** @lends SBIS3.CONTROLS.FormattedTextBoxBase.prototype */ {
      $protected: {
         /**
          * Изначальная маска (либо задается в опциях при создании, либо берется по умолчанию)
          */
         _primalMask: '',
         /**
          * Изначально отображаемый текст в созданном контролле, то есть, по сути, маска, где каждый
          * управляющий символ заменён на символ-заполнитель
          * Пример: если маска контролла DatePicker имеет вид 'DD:MM:YYYY', то чистая маска будет иметь вид '__:__:____',
          * если символом-заполнителем является знак нижней черты.
          */
         _clearMask: '',
         /**
          * Регулярное выражение, соответствующее изначальной маске.
          * Сначала допустимым управляющим символам ставятся в соотвествие основные управляющие символы,
          * затем на основании основных управляющих символов строится само регулярное выражение.
          * Пример:
          *       Для контролла DatePicker
          *          Если маска 'DD:MM:YY', то регулярное выражение: /[0-9][0-9]:[0-9][0-9]:[0-9][0-9]/
          *          т.к. допустимым управляющим символам 'D', 'M', 'Y' соответствует основной управляющий символ 'd',
          *          который представляет собой целое число ( т.е. для которого регулярное выражение /[0-9]/ ).
          */
         _maskRegExp: undefined,
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
         _placeholder: '_',
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
         _controlCharactersSet: {},
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
         }
      },

      $constructor: function () {
         this._initializeComponents();
      },

      /**
       * Обновить хранимое значение в поле this._options.text (т.к. мы наследуем от TextBoxBase) в соотвествии с введённым значением
       * @private
       */
      _updateText:function(){
         /*Method must be implemented*/
      },

      /**
       * Получить текущую используемую маску
       * @private
       */
      _getMask:function(){
         /*Method must be implemented*/
      },

      _initializeComponents: function(){
         var self = this;

         this._inputField = $('.js-controls-FormattedTextBox__field', this.getContainer().get(0));

         this._primalMask = this._getMask();
         this._controlCharacters = this._getControlCharactersSet();
         this._clearMask = this._getClearMask();
         this._maskRegExp = this._getRegExpByMask(this._primalMask);
         this._isSeparatorContainerFirst = this._getTypeOfFirstContainer();
         this._inputField.html( this._getHtmlMask() );

         if(this._options.text){
            this.setText(this._options.text);
         }

         this._inputField.focus(function () {
            self._focusHandler();
         });
         this._inputField.keypress(function (event) {
            event.preventDefault();
         });
         this._inputField.keyup(function (event) {
            event.preventDefault();
         });

         this._inputField.keydown(function (event) {
            var
               key = event.which || event.keyCode;

            if (key == self._KEYS.HOME && !event.shiftKey) {
               event.preventDefault();
               self._keyPressHandler(key, 'home');
            }
            else if (key == self._KEYS.END && !event.shiftKey) {
               event.preventDefault();
               self._keyPressHandler(key, 'end');
            }
            else if (key == self._KEYS.DELETE) {
               event.preventDefault();
               self._keyPressHandler(key, 'delete');
            }
            else if (key == self._KEYS.BACKSPACE) {
               event.preventDefault();
               self._keyPressHandler(key, 'backspace');
            }
            else if (key == self._KEYS.ARROW_LEFT && !event.shiftKey) {
               event.preventDefault();
               self._keyPressHandler(key, 'arrow_left');
            }
            else if (key == self._KEYS.ARROW_RIGHT && !event.shiftKey) {
               event.preventDefault();
               self._keyPressHandler(key, 'arrow_right');
            }
            else if (!event.ctrlKey
            && key != self._KEYS.END && key != self._KEYS.HOME
            && key != self._KEYS.ARROW_LEFT && key != self._KEYS.ARROW_RIGHT) {
               event.preventDefault();
               self._keyPressHandler(key, 'character', event.shift);
            }
         });
      },

      /**
       * Обработка события фокусировки на элементе
       * TODO пока работает только в IE8+ и FireFox
       * @protected
       */
      _focusHandler: function(){
         // Если в поле еще не введено ни единого символа -- установить курсор в начало поля
         if ( $(this._inputField.get(0)).text() == this._clearMask ){
            var
               child = this._isSeparatorContainerFirst ? 1 : 0,
               startContainer = this._inputField.get(0).childNodes[child].childNodes[0],
               startPosition = 0;

            this._moveCursor(startContainer, startPosition);
         }
      },

      /**
       * Обработка события нажатия клавиши
       * @param key
       * @param type
       * @param isShiftPressed
       * @private
       */
      _keyPressHandler: function(key, type, isShiftPressed){
         var
            positionIndexesBegin = this._getCursor(true),
            positionIndexesEnd = this._getCursor(false),
            positionObject = {
               container: this._getContainerByIndex(positionIndexesBegin[0]),
               position: positionIndexesBegin[1]
            },
            positionObjEnd = {
               container: this._getContainerByIndex(positionIndexesEnd[0]),
               position: positionIndexesEnd[1]
            },
            regexp = this._keyExp(positionIndexesBegin[0], positionIndexesBegin[1]),
            character = String.fromCharCode(key),
            nextSibling = positionObject.container.parentNode.nextSibling;

         this._clearSelect(positionObject, positionObjEnd);

         if ( type == 'character' ) {
            // Обработка зажатой кнопки shift ( -> в букву верхнего регистра)
            character = isShiftPressed ? character.toUpperCase() : character.toLowerCase();
            // Проверка по действительной маске
            character = regexp[1] ? ( regexp[1] == 'toUpperCase' ? character.toUpperCase() : character.toLowerCase() ) : character;

            if ( regexp[0].test(character) ) {
               if ( positionObject.position == positionObject.container.nodeValue.length ){
                  if ( nextSibling && nextSibling.nextSibling ){
                     positionObject.container = nextSibling.nextSibling.childNodes[0];
                     positionObject.position = 0;

                     // Перешли в новое место -- нужно обновить проверку и посмотреть снова
                     regexp = this._keyExp($(positionObject.container.parentNode).index(), positionObject.position);
                     if ( regexp[0].test(character) ) {
                        // Проверка по действительной маске
                        character = regexp[1] ? ( regexp[1] == 'toUpperCase' ? character.toUpperCase() : character.toLowerCase() ) : character;
                        this._replaceCharacter(positionObject.container, positionObject.position, character);
                        positionObject.position++;
                     }
                  }
               }
               else {
                  this._replaceCharacter(positionObject.container, positionObject.position, character);
                  positionObject.position++;
               }
            }
         }
         else if ( type == 'delete' ){
            if ( positionObject.position == positionObject.container.nodeValue.length ){
               if ( nextSibling && nextSibling.nextSibling ){
                  positionObject.container = nextSibling.nextSibling.childNodes[0];
                  positionObject.position = 0;

                  this._replaceCharacter(positionObject.container, positionObject.position, this._placeholder);
                  positionObject.position++;
               }
            }
            else {
               this._replaceCharacter(positionObject.container, positionObject.position, this._placeholder);
               positionObject.position++;
            }
            positionObject = positionObjEnd;
         }
         else if ( type == 'backspace' ){
            this._getPreviousPosition(positionObject);
            this._replaceCharacter(positionObject.container, positionObject.position, this._placeholder);
         }
         else if ( type == 'arrow_left' ){
            this._getPreviousPosition(positionObject);
         }
         else if ( type == 'arrow_right' ){
            this._getNextPosition(positionObject);
         }
         else if ( type == 'home' ){
            positionObject.container = this._getContainerByIndex(0);
            if ( !$(positionObject.container.parentNode).hasClass('controls-FormattedTextBox__field-placeholder') ) {
               positionObject.container = nextSibling.childNodes[0];
            }
            positionObject.position = 0;
         }
         else if ( type == 'end' ){
            positionObject.container = this._getContainerByIndex(this._inputField.get(0).childNodes.length - 1);
            if ( !$(positionObject.container.parentNode).hasClass('controls-FormattedTextBox__field-placeholder') ) {
               positionObject.container = positionObject.container.parentNode.previousSibling.childNodes[0];
            }
            positionObject.position = positionObject.container.nodeValue.length;
         }
         this._moveCursor(positionObject.container, positionObject.position);
      },

      /**
       * очищает выделение из полученных координат,
       * заменяя спектр выделения символом-заполнителем (placeholder)
       * @param positionObjStart
       * @param positionObjEnd
       */
      _clearSelect : function(positionObjStart, positionObjEnd){
         for (var i = $(positionObjEnd.container).parent().index(); i >= $(positionObjStart.container).parent().index(); i = i - 2){
            for (var j = (i == $(positionObjEnd.container).parent().index() ? positionObjEnd.position : this._inputField.get(0).childNodes[i].childNodes[0].nodeValue.toString().length); j > (i == $(positionObjStart.container).parent().index() ? positionObjStart.position : 0); j--){
               var b = this._inputField.get(0).childNodes[i].childNodes[0].nodeValue.split('');
               b[j - 1] = this._placeholder;
               this._inputField.get(0).childNodes[i].childNodes[0].nodeValue = b.join('');
            }
         }
      },

      _getPreviousPosition: function (positionObject) {
         var prevSibling = positionObject.container.parentNode.previousSibling;

         if ( positionObject.position === 0 ){
            if ( prevSibling && prevSibling.previousSibling ){
               positionObject.container = prevSibling.previousSibling.childNodes[0];
               positionObject.position = positionObject.container.nodeValue.length - 1;
            }
         }
         else {
            positionObject.position--;
         }
      },

      _getNextPosition: function (positionObject) {
         var nextSibling = positionObject.container.parentNode.nextSibling;

         if ( positionObject.position == positionObject.container.nodeValue.length ){
            if ( nextSibling && nextSibling.nextSibling ){
               positionObject.container = nextSibling.nextSibling.childNodes[0];
               positionObject.position = 0;
            }
         }
         else {
            positionObject.position++;
         }
      },

      /**
       * возвращает RegExp для сравнения с символом нажатой клавиши
       * @param {Number} container порядковый номер блока, в котором находится символ
       * @param {Number} position порядковый номер символа в контейнере
       * @return
       */
      _keyExp : function(container, position){
         if (this._isSeparatorContainerFirst) {
            container--;
         }
         container = container ? container / 2 : container;

         var
            regexp = new RegExp('['+this._controlCharacters+']+', 'g'),
            array = this._primalMask.match(regexp),
            primalCharacter = array[container].charAt(position),
            controlCharacter = this._controlCharactersSet[primalCharacter],
            transform = { 'L': 'toUpperCase', 'l': 'toLowerCase' };

         return [ this._charToRegExp(controlCharacter, true), transform[controlCharacter] || false ];
      },

      /**
       * Конвертирует символ маски в регулярное выражение для данного символа
       * @param {String} c символ маски
       * @param {Boolean} isRegExp преобразовать ли сразу в регулярное выражение, или отдать строкой
       * @return {RegExp}
       * @private
       */
      _charToRegExp : function(c, isRegExp){
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
            default :
               regexp = '[А-ЯA-Zа-яa-z0-9ёЁ]';
               break;
         }
         return isRegExp ? new RegExp(regexp) : regexp;
      },

      /**
       * Замещает символ в определенном контейнере в определённой позиции
       * @param container контейнер
       * @param position позиция замещаемого символа
       * @param character новый символ
       * @private
       */
      _replaceCharacter: function(container, position, character){
         var buffer = container.nodeValue.split('');
         buffer[position] = character;
         container.nodeValue = buffer.join('');
         this._updateText();
      },

      /**
       * Получить контейнер по порядковому номеру
       * @param idx
       * @returns {*}
       * @private
       */
      _getContainerByIndex: function(idx) {
         return this._inputField.get(0).childNodes[parseInt(idx, 10)].childNodes[0];
      },

      /**
       * Передвинуть курсор к заданной позиции
       * @param container блок
       * @param position позиция в блоке
       * @private
       */
      _moveCursor : function(container, position){
         if ($ws._const.browser.isIE){
            var rng = document.body.createTextRange();
            rng.moveToElementText(container.parentNode);
            rng.move('character', position);
            rng.select();
         }
         else {
            var selection = window.getSelection();
            selection.collapse(container, position);
         }
      },

      _setEnabled : function(enabled) {
         FormattedTextBoxBase.superclass._setEnabled.call(this, enabled);
         this._inputField.attr('contenteditable', !!enabled)
      },

      /**
       * Получить положение курсора
       * @param {Boolean} position Позиция: true — начала, false — конца
       * @returns {Array} Массив положений [номер контейнера, сдвиг]
       * @protected
       */
      _getCursor: function(position) {
         var
            selection = window.getSelection().getRangeAt(0);

         return ( position ?
            this._correctCursor(selection.startContainer, selection.startOffset) :
            this._correctCursor(selection.endContainer, selection.endOffset)
         );
      },

      /**
       * Возвращает массив индексов положения курсора
       * @param container
       * @param position
       * @return {Array} Массив [номер группы, номер символа]
       */
      _correctCursor : function(container, position){
         var
            cnt,
            pos = position,
            buf,
            sepFirst = this._isSeparatorContainerFirst,
            input = this._inputField.get(0);

         if (container.parentNode.childNodes.length > 1){
            for (var i = 0; i < container.parentNode.childNodes.length; i++){
               if (container == container.parentNode.childNodes[i]){
                  pos = (i + sepFirst) % 2 ? 0 : i ? container.firstChild.length : position ? container.firstChild.length : position;
                  cnt = (i + sepFirst) % 2 ? i + 1 : i;
                  buf = container.parentNode.childNodes[cnt];
                  if (pos >= (buf.firstChild && buf.firstChild.length || 0)){
                     pos = buf.nextSibling ? 0 : pos;
                     cnt = buf.nextSibling ? cnt + 2 : cnt;
                  }
               }
            }
         }
         else
         {
            buf = $(container.parentNode).index();
            cnt = (buf + sepFirst) % 2 ? buf + 1 : buf;
            pos = (buf + sepFirst) % 2 ? 0 : pos;
            if (cnt >= input.childNodes.length){ // Последний токен - разделитель
               cnt -= 2;
               pos = input.childNodes[cnt].childNodes[0].length;
            }
         }

         return [cnt, pos];
      },

      /**
       * Получить логическое, определяющее, является ли первый контейнер разделителем или вводимым блоком
       * @returns {boolean} true: первый контейнер - разделитель, false: вводимый блок
       * @private
       */
      _getTypeOfFirstContainer: function() {
         return this._clearMask[0] != this._placeholder;
      },

      /**
       * Возвращает html-разметку для заданной маски
       * @param {string} text необязательный параметр, текст для установки (должен удовлетворять маске "символ в символ")
       * @returns {string} html-разметка
       * @private
       */
      _getHtmlMask: function( text ){
         var
            htmlMask = '',
            placeholder = this._placeholder,
            placeholderContainers = this._clearMask.match(new RegExp('('+placeholder+'+)', 'g')) || [],
            separatorContainers = this._clearMask.match(new RegExp('([^'+placeholder+']+)', 'g')) || [];

         var
            textExist = false,
            placeholderContainersValues = [];

         if ( text ) {
            textExist = true;
            if ( this._isSeparatorContainerFirst ) {
               text = text.substr(separatorContainers[0].length);
            }
            for ( var j = 0; j < placeholderContainers.length; j++ ) {
               placeholderContainersValues[j] = text.substr(0, placeholderContainers[j].length);
               text = placeholderContainers[j] ? text.substr(placeholderContainers[j].length) : text;
               text = separatorContainers[j] ? text.substr(separatorContainers[j].length) : text;
            }
         }

         var
            isPlaceholdersGreaterThanSeparators = placeholderContainers.length > separatorContainers.length,
            minLength = isPlaceholdersGreaterThanSeparators ? separatorContainers.length : placeholderContainers.length;

         for ( var j = 0; j < minLength; j++ ) {
            if (this._isSeparatorContainerFirst) {
               htmlMask += this._getHtmlContainer(separatorContainers[j], 'separator');
               htmlMask += this._getHtmlContainer((textExist)?placeholderContainersValues[j]:placeholderContainers[j], 'placeholder');
            }
            else {
               htmlMask += this._getHtmlContainer((textExist)?placeholderContainersValues[j]:placeholderContainers[j], 'placeholder');
               htmlMask += this._getHtmlContainer(separatorContainers[j], 'separator');
            }
         }

         if (placeholderContainers.length != separatorContainers.length){
            if (placeholderContainers.length > separatorContainers.length){
               htmlMask += this._getHtmlContainer((textExist)?placeholderContainersValues[minLength]:placeholderContainers[minLength], 'placeholder');
            }
            else {
               htmlMask += this._getHtmlContainer(separatorContainers[minLength], 'separator');
            }
         }

         return htmlMask;
      },

      /**
       * Установить значение в поле. Значение вводится в точности с маской, включая разделяющие символы
       * Пример. Если маска 'd(ddd)ddd-dd-dd', то setText('8(111)888-11-88')
       * @param text Строка нового значения
       */
      setText: function( text ){
         text = text ? text: '';

         if ( typeof text == 'string' ) {
            if ( text == '' || this._checkTextByMask( text ) ) {
               text = text == '' ? '' : this._correctRegister( text );
               this._inputField.html( this._getHtmlMask(text) );
               FormattedTextBoxBase.superclass.setText.call( this, text );
            }
            else {
               throw new Error('Устанавливаемое значение не удовлетворяет маске данного контролла');
            }
         }
         else {
            throw new Error('Аргументом должна являться строка');
         }
      },

      /**
       * Проверить значение на соответствие данной маске
       * @private
       */
      _checkTextByMask: function ( text ) {
         return new RegExp( this._maskRegExp ).test( text );
      },

      /**
       * Получить регулярное выражение, соответсвующие маске. В основном, используется this._primalMask, но можно
       * использовать для формирования регулярного выражения любой маски, записанной допустимыми управляющими символами
       * @param mask
       * @returns {RegExp}
       * @private
       */
      _getRegExpByMask: function ( mask ) {
         var
            controlCharactersRegExp = new RegExp('['+this._controlCharacters+']'),
            specialCharactersRegExp = /^[\\\/\[\])(}{}+?*^|.$]$/;

         mask = mask.split('');

         for ( var c in mask ) {
            if ( controlCharactersRegExp.test( mask[c] ) ) {
               mask[c] = this._charToRegExp( this._controlCharactersSet[mask[c]], false );
            }
            else if ( specialCharactersRegExp.test( mask[c] ) ) {
               mask[c] = '\\' + mask[c];
            }
         }

         return new RegExp('^' + mask.join('') + '$');
      },

      /**
       * Скорректировать регистр строки в соответствии с маской. Строка должна точно соответствовать маске по длине
       * и местоположению разделяющих и управляющих символов (поэтому данный метод используется только после проверки
       * на соответствие строки маске)
       * @param text
       * @returns {string}
       * @private
       */
      _correctRegister: function ( text ) {
         text = text.split('');

         var ctrlChar;

         for ( var c in text ) {
            ctrlChar = this._controlCharactersSet[this._primalMask[c]];

            if ( ctrlChar == 'l' || ctrlChar == 'L' ) {
               text[c] = ctrlChar == 'L' ? text[c].toUpperCase() : text[c].toLowerCase();
            }
         }

         return text.join('');
      },

      /**
       * Возвращает html-разметку для разделяющего или вводимого контейнера
       * @param {string} container контейнер
       * @param {string} type тип контейнера
       * @returns {string} html-разметка контейнера
       * @private
       */
      _getHtmlContainer: function(container, type){
         if (type == 'placeholder'){
            return '<em class="controls-FormattedTextBox__field-placeholder controls-FormattedTextBox__field-symbol">' + container + '</em>';
         }
         else if (type == 'separator') {
            return '<em class="controls-FormattedTextBox__field-symbol">' + container + '</em>'
         }
      },
      
      /**
       * Возвращает чистую строку по маске
       * @returns {string}
       * @private
       */
      _getClearMask: function(){
         return this._primalMask.replace(new RegExp('['+this._controlCharacters+']', 'g'), this._placeholder);
      },

      /**
       * Возвращает строку всех допустимых управляющих символов. Если набор допустимых символов не задан, то задается
       * набор основных управляющих символов (используется в _charToRegExp), а так же возвращается строка из них
       * @returns {string} Строку всех допустимых управляющих символов (без пробелов)
       * @private
       */
      _getControlCharactersSet: function() {
         if (Object.isEmpty(this._controlCharactersSet)) {
            this._controlCharactersSet = {
               'd': 'd',
               'L': 'L',
               'l': 'l',
               'x': 'x'
            }
         }
         return Object.keys(this._controlCharactersSet).join('');
      }
});

   return FormattedTextBoxBase;
});