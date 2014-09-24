define('js!SBIS3.CONTROLS.FormattedTextBox', ['js!SBIS3.CORE.Control', '!html!SBIS3.CONTROLS.FormattedTextBox', 'css!SBIS3.CONTROLS.FormattedTextBox'], function (Control, dotTplFn) {

   'use strict';

   /**
    * Можно вводить только значения особого формата (например телефон).
    * В поле ввода уже заранее будут введены символы из формата (например скобки и тире для телефона) и останется ввести только недостающие символы
    * @class SBIS3.CONTROLS.FormattedTextBox
    * @extends SBIS3.CORE.Control
    * @control
    */

   var FormattedTextBox = Control.Control.extend(/** @lends SBIS3.CONTROLS.FormattedTextBox.prototype */{
      $protected: {
         _dotTplFn: dotTplFn,
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
          * Допустимые управляющие символы в маске
          */
         _controlCharacters: 'dLlx',
         /**
          * Символ, на который замещаются все управляющие символы в маске для последующего отображения на странице
          */
         _placeholder: '_',
         /**
          * Опции создаваемого контролла
          */
         _options: {
            /**
             * @cfg {RegExp} Маска, на базе которой будет создана html-разметка и в соответствии с которой
             * будет определён весь функционал
             */
            mask: 'd(ddd)ddd-dd-dd'
         },

         _KEYS: {
            DELETE: 46,
            TAB: 9,
            BACKSPACE: 8
         }
      },

      $constructor: function () {
         var self = this;

         this._primalMask = this._options.mask;
         this._clearMask = this._getClearMask();
         this._isSeparatorContainerFirst = this._getTypeOfFirstContainer();
         this._htmlMask = this._getHtmlMask();

         this._inputField = $('.controls-FormattedTextBox__field', this.getContainer().get(0));
         this._inputField.html(this._htmlMask);

         //var rng = document.createRange();
         //rng.selectNode(document.getElementsByClassName('controls-FormattedTextBox__field')[0]);

         //console.log('typeof window.getSelection().focusNode -> ', window.getSelection().focusNode );

         //this._inputField.unbind('keypress');
         //this._inputField.unbind('focus');

         this._inputField.focus(function(){
            self._focusHandler(self._inputField.get(0));
         });
         //this._inputField.keypress(function(event){
         //   event.preventDefault();
         //   var key = event.which;
         //   self._keyPressHandler(key, 'character');
         //});
         this._inputField.keypress(function(event){ event.preventDefault();});
         this._inputField.keyup(function(event){ event.preventDefault();});

         this._inputField.keydown(function(event){
            event.preventDefault();
            var
               key = event.which,
               type = '';

            if (!event.ctrlKey && key != self._KEYS.DELETE && key != self._KEYS.BACKSPACE){
               type = event.shiftKey ? 'shift_character' : 'character';
               self._keyPressHandler(key, type);
            }
            else if (key == self._KEYS.DELETE) {
               self._keyPressHandler(key, 'delete');
            }
            else if (key == self._KEYS.BACKSPACE){
               self._keyPressHandler(key, 'backspace');
            }

            //switch (key){
            //   case self._KEYS.DELETE:
            //      self._keyPressHandler(key, 'delete');
            //      break;
            //   case self._KEYS.BACKSPACE:
            //      self._keyPressHandler(key, 'backspace');
            //      break;
            //   default:
            //      type = event.shiftKey ? 'UpperCaseCharacter' : 'character';
            //      if ( key > 41 && event.shiftKey ) { alert(event.shiftKey);}
            //      self._keyPressHandler(key, type);
            //}
         });

         // DEBUGGING
         this._inputField.mouseup(function(){
            console.log(self._getCursor(true));
         });

         // DEBUGGING
         //this._getHtmlMask2();
         //var firstNeeded = this._isSeparatorContainerFirst ? 1 : 0;
         //this._moveCursor(this._getContainerByIndex(firstNeeded), 0);

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
            array = this._primalMask.match(/[dLlx]+/g),
            character = array[container].charAt(position),
            transform = { 'L': 'toUpperCase', 'l': 'toLowerCase' };

         //return this._charToRegExp(character);
         return [ this._charToRegExp(character), transform[character] || false ];
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
       * Конвертирует символ маски в regExp
       * @param {String} c символ маски
       * @return {RegExp}
       * @private
       */
      _charToRegExp : function(c){
         var regexp;
         switch(c) {
            case 'd':
               regexp = /\d/;
               break;
            case 'L':
            case 'l':
               regexp = /[А-ЯA-Zа-яa-zёЁ]/;
               break;
            case 'x':
            default:
               regexp = /[А-ЯA-Zа-яa-z0-9ёЁ]/;
               break;
         }
         return regexp;
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
         if (type == 'placeholder'){return '<em class="controls-FormattedTextBox__field-placeholder">' + container + '</em>';}
         else if (type == 'separator') {return '<em>' + container + '</em>'}
      },
      
      /**
       * Возвращает чистую строку по маске
       * @returns {string}
       * @private
       */
      _getClearMask: function(){
         //return this._primalMask.replace(/[dLlx]/g,this._getPlaceholder());
         return this._primalMask.replace(new RegExp('['+this._controlCharacters+']', 'g'),this._getPlaceholder());
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

   return FormattedTextBox;
});