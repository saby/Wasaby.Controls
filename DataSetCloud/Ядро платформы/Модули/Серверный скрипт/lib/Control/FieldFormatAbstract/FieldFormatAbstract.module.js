/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 21.04.13
 * Time: 21:36
 * @file FieldFormatAbstract module
 * @responsible filippovsu <su.filippov@tensor.ru>
 */
define("js!SBIS3.CORE.FieldFormatAbstract", ["js!SBIS3.CORE.FieldString", "html!SBIS3.CORE.FieldFormatAbstract"], function( FieldString, dotTplFn ) {

   "use strict";

   /**
    * @class $ws.proto.FieldFormatAbstract
    * @extends $ws.proto.FieldString
    * @ignoreOptions password
    * @designTime actions SBIS3.CORE.FieldString/design/design
    * @designTime plugin SBIS3.CORE.FieldFormatAbstract/design/DesignPlugin
    */
   $ws.proto.FieldFormatAbstract = FieldString.extend(/** @lends $ws.proto.FieldFormatAbstract.prototype */{
      $protected : {
         _sepExp : '',
         _htmlMask : '',
         _clearMask : '',
         _notsepExp : '',
         _valuePure : '',
         _separatorFirst : false,
         _options : {
            /**
             * @cfg {String} Маска ввода
             * <wiTag group="Данные">
             * Маска вида: Lll{font-weight: bold;}:xdd{color: red;}, где
             * <ul>
             *    <li>L - заглавная буква (русский/английский алфавит),</li>
             *    <li>l - строчная буква,</li>
             *    <li>d - цифра,</li>
             *    <li>x - буква или цифра,</li>
             *    <li>в фигурные скобки заключены стили для блока,</li>
             *    <li>все остальные символы являются разделителями.</li>
             * </ul>
             * Стили должны располагаться в конце блока - либо перед разделителем, либо в конце маски через пробел от блока.
             * Регистр заглавной или строчной буквы при вводе берётся автоматически по маске.
             * @example
             * Маска задания ввода численного значения с двумя последними цифрами красного цвета: 11 222 3333/<span style="color:red">44</span>
             * <pre>
             *     mask: 'dd ddd dddd/dd {color: red;}'
             * </pre>
             */
            mask : ''
         },
         _keysWeHandle: [
            $ws._const.key.enter,
            $ws._const.key.backspace,
            $ws._const.key.space,
            $ws._const.key.del,
            $ws._const.key.left,
            $ws._const.key.right
         ]
      },
      $constructor : function(){
         this._publish('c','onChangePure', 'onInputEnd');

         this._prepareRegExp();
         this._initInputControl();

         var self = this;
         this._inputControl.unbind('keypress');
         this._inputControl.unbind('focus');

         this._bindTooltipHandlers();

         this._inputControl.focus(function(event){
            self._funcFocus(self._inputControl.get(0));
         })
            .keypress(function(event){
               var key = event.which;
               if (!event.ctrlKey && key !== $ws._const.key.tab && ((key && key != $ws._const.key.backspace && key > 40)
                  || (key && key < 41 && event.shiftKey))){
                  self._keyFunc(key, 'right');
                  return false;
               }
            })
            .bind('cut', function(){
               self._keyFunc(0, "delete");
            });
         this.subscribe("onChangePure", function() {
            self._changed = true;
         });
      },
      _onValueChangeHandler: function() {
         var
            notFormattedValuePure = this._notFormatedVal(true),
            comparisonResultPure = notFormattedValuePure && notFormattedValuePure.equals
               ? notFormattedValuePure.equals(this._valuePure)
               : notFormattedValuePure == this._valuePure;
         if (!comparisonResultPure){
            this._valuePure = notFormattedValuePure;
            this._notify('onChangePure', notFormattedValuePure);
            this.clearMark();
         }
         $ws.proto.FieldFormatAbstract.superclass._onValueChangeHandler.apply(this, arguments);
      },
      /**
       * Функция-обработчик события _onKeyUp. Переопределена, т.к. работа по нажатию на delete/backspace выполняется в событии onkeyDown
       * @param {object} event
       * @protected
       */
      _onKeyUp: function(event) {
      },
      /**
       * Обновить настоящее строковое значение
       * Обновляет приватное поле _valuePure, которое влияет на вызов события {@link onChangePure}.
       * @protected
       */
      _updatePureValue: function() {
         this._valuePure = this._inputControl.text();
      },

      _initInputControl: function() {
         this._options.mask = this._fixBrokenMask(this._options.mask);
         this._htmlMask = this._getMask(this._options.mask, 'html');
         this._clearMask = this.getMask();
         this._inputControl.empty('');
         this._inputControl.html(this._htmlMask);
         this._updatePureValue();
         this._defaultTxt = this._curValue();
         this._isGetFullText = true;

         this._notifyOnSizeChanged(true);

         if (this._options.readOnly) {
            this.setEnabled(false);
         }
      },
      /**
       * Чинит маску в соответствии с правилами ограничений символов
       * @param {String} mask Распознаваемая маска.
       * @returns {String} обновленная маска
       * @protected
       */
      _fixBrokenMask: function(mask) {
         // на данный момент метод используется в FieldDate
         // и, в связи с инициализацией инпута в данной абстракции, описан здесь.
         // однако в последствии можно описать некоторые общие правила
         return mask;
      },
      /**
       * Преподготовка необходимых RegExp'пов
       * @protected
       */
      _prepareRegExp : function(){
         this._sepExp = /[^dLlx]+/g;
         this._notsepExp = /[dLlx]+/g;
      },
      _isEmpty: function() {
         var
            regExp = /<[^<]+>/g,
            value = this._inputControl.html().replace(regExp, '');
         return (
               typeof(value) === 'undefined' ||
               value === '' ||
               value === this._getMask(this._options.mask, 'html').replace(regExp, ''));
      },

      _onSizeChangedBatch: function() {
         var
            fetchingCss = ["font-size", "font-style", "font-family", "font-weight"],
            temp,
            self = this;
         //creating a temporary container for calculating width
         $("body").append(temp = $("<div class='ws-formatfield-temp'></div>"));

         self._inputControl.children().each(function(){
            var
               elem = $(this),
               styles = {},
               clone = elem.clone();
            //fetching styles
            for (var i= 0, l = fetchingCss.length; i < l; i++){
               styles[fetchingCss[i]] = elem.css(fetchingCss[i]);
            }
            //appending to temporary container and applying styles
            temp.append(clone.css(styles));
         });

         self._inputControl.parent().css('min-width', temp.width() + 'px');

         //removing temp container
         temp.remove();

         return true;
      },
      _setEnabled : function(s){
         this._inputControl.attr('contenteditable', s ? 'true' : 'false');
         $ws.proto.FieldFormatAbstract.superclass._setEnabled.apply(this, arguments);
      },
      _dotTplFn: dotTplFn,
      _bindInternals : function(){
         this._inputControl = this._container.find(".input-field");
      },
      /**
       * возвращает текстовое значение.
       * @return {String} текущее текстовое значение
       * @protected
       */
      _getString : function(){
         var
            t = this._inputControl.get(0);
         return t.textContent || t.innerText;
      },
      /**
       * возвращает текущее текстовое значение или Значение пустого поля.
       * @param {Boolean} getFull
       * @return {String} текущее текстовое значение
       * @protected
       */
      _curValue : function(getFull){
         var
            str = this._getString();
         return getFull || str.length === this._clearMask.length && str.indexOf(this._placeHolder()) === -1
            ? str
            : this._resolveEmptyValue('');
      },
      /**
       * вставляет полученное текстовое значение, переданное значение соответствует маске
       * @param value
       */
      _setValueInternal : function(value){
         this._inputControl.html(this._htmlMask);
         if (value !== null){
            value = this._formatTest(value);
            var
               sepFirst = this._separatorFirst,
               val = [],
               clearMask = this._clearMask,
               i = 0;
            for(var j = 0, l = clearMask.length, sep = true, str = ''; j < l; ++j) {
               if('dlLx'.indexOf(clearMask.charAt(j)) == -1 ) {
                  if(!sep) {
                     sep = true;
                     val.push(str);
                     str = '';
                  }
               } else {
                  sep = false;
                  str += value.charAt(j);
               }
            }
            if(str) {
               val.push(str);
            }
            this._inputControl.children().each(function(){
               if (!( ($(this).index()+sepFirst) % 2)){
                  if ((typeof val[i] != 'undefined') && $(this).html().length == val[i].length){
                     $(this).html(val[i]);
                     i++;
                  } else {
                     throw new Error('not valid insert data');
                  }
               }
            });
            $ws.proto.FieldAbstract.prototype._setValueInternal.apply(this, arguments);
         }
         this._hideMask(this.isActive());
      },
      _formatTest : function(value){
         var
            i, j, l, len,
            self = this,
            mask = self._clearMask.match(this._notsepExp) || [],
            seps = self._clearMask.match(this._sepExp) || [],
            res = [],
            sepFirst = this._separatorFirst,
            str = [];
         for (i = 0, l = mask.length; i < l; i++){
            var s = mask[i].split('');
            for (j = 0, len = s.length; j < len; j++){
               var
                  keyExp = this._keyExp(i*2+sepFirst, j),
                  regExp = keyExp[0],
                  transform = keyExp[1];
               s[j] = this._placeHolder();
               for (var x = 0, ln = value.length; x < ln; x++){
                  var ch = value.charAt(x);
                  if (regExp.test(ch)){
                     if (transform) {
                        ch = ch[transform]();
                     }
                     s[j] = ch;
                     value = value.substr(x + 1);
                     break;
                  }
               }
            }
            str.push(s.join(''));
         }
         i = j = 0;
         if(sepFirst) {
            res.push(seps[0]);
            j++;
         }
         do {
            if(i < str.length) {
               res.push(str[i++]);
            }
            if(j < seps.length) {
               res.push(seps[j++]);
            }
         } while(i < str.length || j < seps.length);
         return res.join('');
      },
      /**
       * возвращает символ разделитель
       * @protected
       * @return {string} символ разделитель
       */
      _placeHolder : function(){
         return '_';
      },
      /**
       * возвращает обработанную маску
       * @param {string} mask
       * @param {string} type тип возвращаемой маски (html, clear, style, datepicker)
       * @return {String|Array} обработанная маска
       */
      _getMask : function(mask, type){
         var
            // вырезать из маски фигурные скобки, в которых указывается цвет отдельного блока
            clearMask = mask.replace(/{[^}]+}/g,''),
            mas,
            htmlMask = [],
            style = [],
            move = 0,
            razd;
         while (mask.indexOf('{') != -1){
            var
               styleB = mask.indexOf('{'),
               pos = mask.substr(0, styleB).split(/[-.:,)( ]/g).length - 1;
            style[pos] = (/{[^}]+}/).exec(mask).toString().replace(/[}{]/g,'');
            mask = mask.replace(/{[^}]+}/, '');
         }
         switch (type) {
            case 'html':
               mas = clearMask.match(this._notsepExp);
               razd = clearMask.match(this._sepExp);
               if (razd && razd[0] && clearMask.indexOf(razd[0]) === 0) {
                  move = 1;
                  htmlMask.push('<em>', razd[0], '</em>');
                  this._separatorFirst = true;
               }
               for (var i=0; i < mas.length; i++){
                  htmlMask.push('<em class="fmt-cont vis-hide" style="'+ style[i] +'">');
                  for (var j=0; j < mas[i].length; j++) {
                     htmlMask.push(this._placeHolder());
                  }
                  htmlMask.push('</em>');
                  if (razd && razd[i+move]) {
                     htmlMask.push('<em>', razd[i+move], '</em>');
                  }
               }
               return htmlMask.join('');
            case 'clear':
               return clearMask;
            case 'datepicker':
               var
                  dpMask = clearMask.toLowerCase(),
                  li = dpMask.lastIndexOf('y'),
                  indx = dpMask.indexOf('y'),
                  l = (li - indx + 1) / 2,
                  retval = dpMask.substring(0, indx) + dpMask.substr(li - l + 1);
               return retval.replace(/[hius]/g, '0');
            case 'style':
               return style;
            default:
               throw new Error('Unexpected type specified to _getMask: ' + type);
         }
      },
      /**
       * возвращает RegExp для сравнения с символом нажатой клавиши
       * @param {Number} con порядковый номер блока, в котором находится символ
       * @param {Number} pos порядковый номер символа в контейнере
       * @return {RegExp}
       */
      _keyExp : function(con, pos){
         if (this._separatorFirst) {
            con--;
         }
         con = con ? con / 2 : con;
         var
            rexp,
            mas = this._clearMask.match(this._notsepExp),
            c = mas[con].length === pos && mas[con + 1] !== undefined ? mas[con + 1].charAt(0) : mas[con].charAt(pos),
            transform = { 'L': 'toUpperCase', 'l': 'toLowerCase' };
         //Если символа с запрошенным индеком нет - пытаемся взять regExp из следующей маски
         if (c === '' && typeof mas[con + 1] === 'string' && mas[con + 1].length) {
            c = mas[con + 1].charAt(0);
         }
         rexp = this._charToRegExp(c);
         return [rexp, transform[c] || false];
      },
      /**
       * Конвертирует символ маски в regExp
       * @param {String} c символ маски
       * @return {RegExp}
       * @protected
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
       * Получить положение курсора
       * @param {Boolean} position Позиция. ture — начала, false — конца
       * @returns {Array} Массив положений [номер контейнера, сдвиг]
       * @protected
       */
      _getCursor: function(position) {
         try {
            var
               selection = window.getSelection().getRangeAt(0),
               node = selection.startContainer,
               contains = $ws.helpers.contains(this._container[0], node);

            if(!contains) {
               return [0,0];
            }
            return ( position ?
               this._cursorCorrect(selection.startContainer, selection.startOffset) :
               this._cursorCorrect(selection.endContainer, selection.endOffset)
               );
         } catch (e) {
            return [0,0];
         }
      },
      
      /**
       * отрабатывает нажатие клавиши
       * @param {Number} key код нажатой клавиши
       * @param {String} func функции для маппинга: delete, backspace, right, left
       * @param {Boolean} [ctrlKey=false] нажата ли клавиша ctrl
       */
      _keyFunc : function(key, func, ctrlKey){
         var
            // [Array] буфер нового массива подстроки в маске
            buffer,
            // [Array] массив положений курсора с начала
            masB,
            // [Array] массив положений курсора с конца
            masE,
            // [Number] сдвиг курсора относительно начала
            posB,
            // [Number] сдвиг курсора относительно конца
            posE,
            // [Object] контейнер в начале
            conB,
            // [Object] контейнер в конце
            conE,
            // [String] строка символа нажатой клавиши
            ch,
            tempCon,
            // [jQuery] объект строки ввода
            input,
            // RegExp для сравнения с символом нажатой клавиши (ch)
            reg,
            // [Object] следующий сестринский узел
            nextSibling;
         if (!this._isChangeable()) {
            return false;
         }
         if(ctrlKey) {
            input = this._inputControl.get(0);
            if(func == 'delete') {
               tempCon = input.childNodes[input.childNodes.length-1];
            }
         }
         masB = (ctrlKey && func == 'backspace') ? 
            this._cursorCorrect(input.childNodes[0], 0) :
            this._getCursor(true);
         masE = (ctrlKey && func == 'delete') ?
            this._cursorCorrect(tempCon, tempCon.childNodes[0].length) :
            this._getCursor(false);
         conB = this._cursorElement(masB[0]),
         posB = masB[1],
         conE = this._cursorElement(masE[0]),
         posE = masE[1],
         reg = this._keyExp($(conB.parentNode).index(), posB),
         ch = String.fromCharCode(key),
         nextSibling = conB.parentNode.nextSibling;
         this._clearSelect(conB, posB, conE, posE);
         if (func == 'right') {
            if (conB.nodeValue.length <= posB && nextSibling) {
               conB = nextSibling.nextSibling;
               if (!conB) {
                  return false;
               }
               conB = conB.firstChild;
               posB = 0;
            }
            else if (conB.nodeValue.length == posB && !nextSibling) {
               return false;
            }
            if (reg[0].test(ch)){
               buffer = conB.nodeValue.split('');
               buffer[posB] = reg[1] ? ch[reg[1]]() : ch;
               conB.nodeValue = buffer.join('');
               posB++;
               if (conB.nodeValue.length == posB && !nextSibling) {
                  this._notify('onInputEnd');
               }
            } else {
               if(/[-.:,)( ]/.test(ch)) {
                  this._moveCursor(conB, posB);
               } else {
                  return false;
               }
            }
         }
         if (func == 'backspace'){
            if (conB == conE && posB == posE){
               if (!posB && conB.parentNode.previousSibling){
                  conB = conB.parentNode.previousSibling.previousSibling;
                  if(!conB) {
                     return false;
                  }
                  conB = conB.firstChild;
                  posB = conB.nodeValue.length;
               }
               else
                  if (!posB && !conB.parentNode.previousSibling) {
                     return false;
                  }
               buffer = conB.nodeValue.split('');
               buffer[posB - 1] = this._placeHolder();
               conB.nodeValue = buffer.join('');
               posB--;
               if (!posB && conB.parentNode.previousSibling) {
                  conB = conB.parentNode.previousSibling.firstChild;
               }
            }
         }
         if (func == 'delete'){
            if (conB == conE && posB == posE){
               if (conB.nodeValue.length == posB && nextSibling) {
                  conB = nextSibling.nextSibling;
                  if(!conB) {
                     return false;
                  }
                  conB = conB.firstChild;
                  posB = 0;
               } else if (conB.nodeValue.length == posB && !nextSibling) {
                  return false;
               }
               buffer = conB.nodeValue.split('');
               buffer[posB] = this._placeHolder();
               conB.nodeValue = buffer.join('');
               posB++;
            }
         }
         this._moveCursor(conB, posB);
      },

      /**
       * Получить текущий порядковый элемент для установки курсора
       * @param {Number|*} cnt
       * @returns {*}
       * @protected
       */
      _cursorElement: function(cnt) {
         // если нам пришло не число, то вернём то, что нам дали (возможно это и был нужный элемент) 
         return !isNaN(parseInt(cnt, 10)) ? 
            this._inputControl.get(0).children[cnt].childNodes[0] : 
            cnt;
      },
      
      /**
       * возвращает уточненное положение каретки
       * @param cont
       * @param position
       * @return {Array} Массив [номер группы, номер символа]
       */
      _cursorCorrect : function(cont, position){
         var
            cnt,
            pos = position,
            buf,
            sepFirst = this._separatorFirst,
            input = this._inputControl.get(0);
         if (cont.parentNode.childNodes.length > 1){
            for (var i = 0; i < cont.parentNode.childNodes.length; i++){
               if (cont == cont.parentNode.childNodes[i]){
                  pos = (i + sepFirst) % 2 ? 0 : i ? cont.firstChild.length : position ? cont.firstChild.length : position;
                  cnt = (i + sepFirst) % 2 ? i + 1 : i;
                  buf = cont.parentNode.childNodes[cnt];
                  if (pos >= (buf.firstChild && buf.firstChild.length || 0)){
                     pos = buf.nextSibling ? 0 : pos;
                     cnt = buf.nextSibling ? cnt + 2 : cnt;
                  }
               }
            }
         }
         else
         {
            buf = $(cont.parentNode).index();
            cnt = (buf + sepFirst) % 2 ? buf + 1 : buf;
            pos = (buf + sepFirst) % 2 ? 0 : pos;
            if (cnt >= input.childNodes.length){ // Последний токен - разделитель
               cnt -= 2;
               pos = input.childNodes[cnt].childNodes[0].length;
            }
         }
         //"ctrl + a"
         if ($(cont).hasClass('input-field')){
            cnt = position ? position - 1 : 0;
            pos = position ? input.childNodes[cnt].childNodes[0].length : 0;
            return this._cursorCorrect(input.childNodes[cnt].childNodes[0], pos); // Вызывемся ещё раз с уточнёнными параметрами
         }
         return [cnt, pos];
      },
      /**
       * очищает выделение из полученных координат
       * @param contStart
       * @param startPos
       * @param contEnd
       * @param endPos
       */
      _clearSelect : function(contStart, startPos, contEnd, endPos){
         for (var i = $(contEnd).parent().index(); i >= $(contStart).parent().index(); i = i - 2){
            for (var j = (i == $(contEnd).parent().index() ? endPos : this._inputControl.get(0).childNodes[i].childNodes[0].nodeValue.toString().length); j > (i == $(contStart).parent().index() ? startPos : 0); j--){
               var b = this._inputControl.get(0).childNodes[i].childNodes[0].nodeValue.split('');
               b[j - 1] = this._placeHolder();
               this._inputControl.get(0).childNodes[i].childNodes[0].nodeValue = b.join('');
            }
         }
      },
      /**
       * перемещает каретку в полученные координаты
       * @param {Number|*}contNum
       * @param {Number} startPos
       */
      _moveCursor : function(contNum, startPos){
         var
            rng, sel,
            contNext = this._cursorElement(contNum);
         try {
            if ($ws._const.browser.isIE){
               rng = document.body.createTextRange();
               rng.moveToElementText(contNext.parentNode);
               rng.move('character', startPos);
               rng.select();
            }
            else {
                  sel = window.getSelection();
                  sel.collapse(contNext, startPos);
            }
         } catch(e) {
         }
      },
      /**
       * Изменить первоначальное выделение текста
       * Модифицирует выделение в зависимости от контрола.
       * Переопределено в FieldDate.
       * @param range
       * @protected
       */
      _modifyRange: function(range) {
      },
      /**
       * Насылаем выделение на всё поле
       * @param t элемент в котором надо выставить положение
       */
      _funcFocus: function(t){
         if ($(t).text() == $(this._htmlMask).text()){
            var
               contNext = t.childNodes[0].childNodes[0],
               startPos = 0;
            this._moveCursor(contNext, startPos);
         }
         else {
            var obj, rng, sel;
            obj = this._inputControl.get(0);

            try {
               if (document.body.createTextRange) { // msie
                  rng = document.body.createTextRange();
                  rng.moveToElementText(obj);
                  this._modifyRange(rng);
                  rng.select();
               }
               else { // other
                  rng = document.createRange();
                  rng.selectNodeContents(obj);
                  this._modifyRange(rng);
                  sel = window.getSelection();
                  sel.removeAllRanges();
                  sel.addRange( rng );
               }
            } catch(e) {
            }
         }
      },
      _notFormatedVal: function(getFull){
         return this._curValue(getFull);
      },
       /**
        * <wiTag group="Управление">
        * Убрать содержимое поля и отобразить пустую маску.
        * @example
        * Очистить поле (fieldDate) при клике на кнопку (btn).
        * <pre>
        *    btn.subscribe('onClick', function() {
        *       fieldDate.clear();
        *    });
        * </pre>
        */
      clear : function(){
         this._inputControl.html(this._htmlMask);
      },
      setActive : function(active){
         $ws.proto.FieldFormatAbstract.superclass.setActive.apply(this, arguments);
         this._hideMask(this.isActive());
      },
      _hideMask : function(s){
         if (s){
            this._inputControl.find('.fmt-cont').removeClass('vis-hide');
         }
         else{
            this._inputControl.find('.fmt-cont').each(function(){
               var
                  tpl = '_________________________________________________________________',
                  txt = this.textContent || this.innerText;
               if (txt == tpl.substr(0, this.childNodes[0].length))
                  $(this).addClass('vis-hide');
               else
                  $(this).removeClass('vis-hide');
            });
         }
      },
      /**
       * Обработка клавиш. В многострочном поле enter должен служить только одной причине
       * @param {Object} event Событие
       */
      _keyboardHover: function(event){
         var key = event.which;
         if (key == $ws._const.key.backspace){
            this._keyFunc(key, 'backspace', event.ctrlKey);
            return false;
         }
         else if (key == $ws._const.key.del || key == $ws._const.key.space){
            this._keyFunc(key, 'delete', event.ctrlKey && key == $ws._const.key.del);
            return false;
         }
         if(key === $ws._const.key.del || key === $ws._const.key.backspace || key === $ws._const.key.left ||
            key === $ws._const.key.right){
            event.stopImmediatePropagation();
         }
         if (key == $ws._const.key.enter)
            event.preventDefault(); // Иначе всё ломается
         return true;
      },
      getStringValue: function(){
         var value = this._curValue(true);
         return value.replace(/\.|[_\.]*$|^[_\.]*/g, '').replace(/_/g, ' ');
      },
      /**
       * <wiTag group="Управление">
       * Возвращает маску отображения данных
       * @returns {String}
       */
      getMask: function() {
         return this._getMask(this._options.mask, 'clear');
      }
   });

   return $ws.proto.FieldFormatAbstract;

});
