define('js!SBIS3.CONTROLS.FieldFormatBase', ['js!SBIS3.CORE.Control'], function (Control) {

   'use strict';

   /**
    * Можно вводить только значения особого формата (например телефон).
    * В поле ввода уже заранее будут введены символы из формата (например скобки и тире для телефона) и останется ввести только недостающие символы
    * @class SBIS3.CONTROLS.FieldFormatBase
    * @extends SBIS3.CORE.Control
    * @control
    */

   var FieldFormatBase = Control.Control.extend(/** @lends SBIS3.CONTROLS.FieldFormatBase.prototype */{
      $protected: {
         /**
          * Изначальная маска (либо задается в опциях при создании, либо берется по умолчанию)
          */
         _primalMask: '',
         /**
          * Изначально отображаемый текст в созданном контролле, то есть, по сути, маска, где каждый
          * управляющий символ заменён на символ-заполнитель
          * Пример: если маска даты имеет вид 'DD:MM:YYYY', то чистая маска будет иметь вид '__:__:____',
          * если символом-заполнителем является знак нижней черты.
          */
         _clearMask: '',
         /**
          * Html-разметка, соответствующая изначальной маске
          */
         _htmlMask: '',
         /**
          * Логическое, определяющее, является ли первый контейнер контейнером-разделителем
          */
         _isSeparatorContainerFirst: false,
         /**
          * Html-элемент, в который будет добавлена динамически создаваемая, в зависимости от маски, html-разметка
          */
         _inputField: null,
         /**
          * Символ-заполнитель, на который замещаются все управляющие символы в маске для последующего отображения на странице
          */
         _placeholder: '',
         /**
          * Допустимые управляющие символы в маске. Задаются отдельно в каждом контролле в зависимости от контекста.
          * Пример: для контролла FieldFormatDate это: Y(год), M(месяц), D(день), H(час), I(минута), S(секунда), U(доля секунды).
          *
          * Используются при создании контролла в опции mask
          */
         _controlCharacters: '',
         /**
          * Основные управляющие символы в маске. Каждому допустимому символу ставится в соответствие основной
          * управляющий символ, в зависимости от которого определяется, какой тип символа может вводиться
          * Условные обозначения:
          *     1. d - Цифра
          *     2. L - Заглавная буква
          *     3. l - Строчная буква
          *     4. x - Буква или цифра
          */
         _generalControlCharacters: 'dLlx',
         /**
          * Опции создаваемого контролла
          */
         _options: {
            /**
             * @cfg {RegExp} Маска, на базе которой будет создана html-разметка и в соответствии с которой
             * будет определён весь функционал
             */
            mask: ''
         },

         _KEYS: {
            DELETE: 46,
            TAB: 9,
            BACKSPACE: 8
         }
      },

      $constructor: function () {

      },

      /**
       * Получить блок по порядковому номеру
       * @param idx
       * @returns {*}
       * @private
       */
      _getContainerByIndex: function(idx) {
         return this._inputField.get(0).childNodes[parseInt(idx, 10)].childNodes[0];
      },

      /**
       * Обработка события нажатия клавиши
       * @param key
       * @param type
       * @private
       */
      _keyPressHandler: function(key, type){
         var
            inputField = this._inputField.get(0),
            array = this._getCursor(true),
            containerIndex = array[0],
            position = array[1],
            container = this._getContainerByIndex(containerIndex),
            regexp = this._keyExp(containerIndex, position),
            character = String.fromCharCode(key),
            nextSibling = container.parentNode.nextSibling,
            nChild;

         character = type == 'shift_character' ? character.toUpperCase() : character.toLowerCase();

         if (type == 'character' || type == 'shift_character') {
            //character = regexp[1] && regexp[1] == 'toUpperCase' ? character.toUpperCase() : character.toLowerCase();
            character = regexp[1] ? ( regexp[1] == 'toUpperCase' ? character.toUpperCase() : character.toLowerCase() ) : character;


            if ( regexp[0].test(character) ) {
               if ( position == container.nodeValue.length ){
                  if (nextSibling && nextSibling.nextSibling){
                     container = nextSibling.nextSibling.childNodes[0];
                     position = 0;

                     this._moveCursor(container, position);
                     this._keyPressHandler(character, 'character');
                     //regexp = this._keyExp($(container.parentNode).index(), position);
                     //character = regexp[1] == 'toUpperCase' ? character.toUpperCase() : character.toLowerCase();
                     //
                     //if ( regexp[0].test(character) ) {
                     //   this._replaceCharacter(container, position, character);
                     //   position++;
                     //}
                  }
                  else {
                     nChild = this._isSeparatorContainerFirst ? 1 : 0;
                     container = this._getContainerByIndex(nChild);
                     position = 0;
                  }
               }
               else {
                  this._replaceCharacter(container, position, character);
                  position++;
               }
            }
         }
         else if (type == 'delete'){
            if ( position == container.nodeValue.length ){
               if (nextSibling && nextSibling.nextSibling){
                  container = nextSibling.nextSibling.childNodes[0];
                  position = 0;

                  this._replaceCharacter(container, position, this._getPlaceholder());
                  position++;
                  //this._moveCursor(container, position);
                  //this._keyPressHandler(character, 'delete');
               }
               else {
                  nChild = this._isSeparatorContainerFirst ? 1 : 0;
                  container = this._getContainerByIndex(nChild);
                  position = 0;
               }
            }
            else {
               this._replaceCharacter(container, position, this._getPlaceholder());
               position++;
            }
         }
         else if (type == 'backspace'){
            if ( position === 0 ){
               var prevSibling = container.parentNode.previousSibling;

               if (prevSibling && prevSibling.previousSibling){
                  container = prevSibling.previousSibling.childNodes[0];
                  position = container.nodeValue.length - 1;

                  this._replaceCharacter(container, position, this._getPlaceholder());
               }
            }
            else {
               position--;
               this._replaceCharacter(container, position, this._getPlaceholder());
            }
         }

         this._moveCursor(container, position);
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
            character = array[container].charAt(position),
            transform = { 'L': 'toUpperCase', 'l': 'toLowerCase' };

         return [ this._charToRegExp(character), transform[character] || false ];
      },

      /**
       * Конвертирует символ маски в regExp
       * @param {String} c символ маски
       * @return {RegExp}
       * @private
       */
      _charToRegExp : function(c){
         var regexp;
         switch(c) {
            case 'd':
               regexp = /\d/; // RegExp /\d/ is equal to /[0-9]/
               break;
            case 'L':
            case 'l':
               regexp = /[А-ЯA-Zа-яa-zёЁ]/;
               break;
            case 'x':
            default :
               regexp = /[А-ЯA-Zа-яa-z0-9ёЁ]/;
               break;
         }
         return regexp;
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
      },

      /**
       * Обработка события фокусировки на элементе
       * @param elem
       * @private
       */
      _focusHandler: function(elem){
         if ($(elem).text() == $(this._htmlMask).text()){
            var
               child = this._isSeparatorContainerFirst ? 1 : 0,
               contNext = elem.childNodes[child].childNodes[0],
               startPos = 0;
            this._moveCursor(contNext, startPos);
         }
      },

      /**
       * Передвинуть курсор к заданной позиции
       * @param container блок
       * @param position позиция в блоке
       * @private
       */
      _moveCursor : function(container, position){
         var selection = window.getSelection();
         selection.collapse(container, position);
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
       * Возвращает html-разметку для заданной маски
       * @returns {string} html-разметка
       * @private
       */
      _getHtmlMask: function(){
         var
            htmlMask = '',
            placeholder = this._getPlaceholder(),
            placeholderContainers = this._clearMask.match(new RegExp('('+placeholder+'+)', 'g')),
            separatorContainers = this._clearMask.match(new RegExp('([^'+placeholder+']+)', 'g'));

         var
            isPlaceholdersGreaterThanSeparators = placeholderContainers.length > separatorContainers.length,
            minLength = isPlaceholdersGreaterThanSeparators ? separatorContainers.length : placeholderContainers.length;

         for ( var j = 0; j < minLength; j++ ) {
            if (this._isSeparatorContainerFirst) {
               htmlMask += this._getHtmlContainer(separatorContainers[j], 'separator');
               htmlMask += this._getHtmlContainer(placeholderContainers[j], 'placeholder');
            }
            else {
               htmlMask += this._getHtmlContainer(placeholderContainers[j], 'placeholder');
               htmlMask += this._getHtmlContainer(separatorContainers[j], 'separator');
            }
         }

         if (placeholderContainers.length != separatorContainers.length){
            if (placeholderContainers.length > separatorContainers.length){
               htmlMask += this._getHtmlContainer(placeholderContainers[minLength], 'placeholder');
            }
            else {
               htmlMask += this._getHtmlContainer(separatorContainers[minLength], 'separator');
            }
         }

         // DEBUGGING
         console.log(placeholderContainers);
         console.log(separatorContainers);
         console.log(htmlMask);

         return htmlMask;
      },

      /**
       * Возвращает html-разметку для разделяющего или вводимого контейнера
       * @param {string} container контейнер
       * @param {string} type тип контейнера
       * @returns {string} html-разметка контейнера
       * @private
       */
      _getHtmlContainer: function(container, type){
         if (type == 'placeholder'){return '<em class="controls-FieldFormatBase__field-placeholder">' + container + '</em>';}
         else if (type == 'separator') {return '<em>' + container + '</em>'}
      },
      
      /**
       * Возвращает чистую строку по маске
       * @returns {string}
       * @private
       */
      _getClearMask: function(){
         return this._primalMask.replace(new RegExp('['+this._controlCharacters+']', 'g'), this._getPlaceholder());
      },

      /**
       * Возвращает символ-разделитель
       * @returns {string} Символ-разделитель
       * @private
       */
      _getPlaceholder: function(){
         return this._placeholder;
      },

      /**
       * Получить логическое, определяющее, является ли первый контейнер разделителем или вводимым блоком
       * @returns {boolean} true: первый контейнер - разделитель, false: вводимый блок
       * @private
       */
      _getTypeOfFirstContainer: function() {
         return this._clearMask[0] != this._getPlaceholder();
      }
});

   return FieldFormatBase;
});