/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 21.04.13
 * Time: 20:09
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.FieldNumeric', ['js!SBIS3.CORE.FieldString', 'html!SBIS3.CORE.FieldNumeric'], function( FieldString, dotTplFn ) {

   'use strict';

   /**
    * Поле ввода числовых значений
    *
    * @class $ws.proto.FieldNumeric
    * @extends $ws.proto.FieldString
    * @control
    * @initial
    * <component data-component='SBIS3.CORE.FieldNumeric' style='width: 100px'>
    * </component>
    * @category Fields
    * @designTime actions SBIS3.CORE.FieldString/design/design
    * @designTime plugin /design/DesignPlugin
    * @ignoreOptions trim password maxLength
    */
   $ws.proto.FieldNumeric = FieldString.extend(/** @lends $ws.proto.FieldNumeric.prototype */{
      $protected : {
         _emptyNegative : false,
         _options : {
            /**
             * @cfg {Number} Количество знаков после запятой
             * Отрицательное значение опции - количество знаков после запятой не ограничено
             * <wiTag group='Управление'>
             */
            decimals: 0,
            /**
             * @cfg {Number} Количество знаков до запятой
              Отрицательное значение опции - количество знаков до запятой не ограничено
             * <wiTag group='Управление'>
             */
            integers: 16,
            /**
             * @cfg {Boolean} Определяет пустое значение
             * true - null
             * false - 0
             */
            defaultValueIsNull: false,
            /**
             * @cfg {Boolean} Прятать пустые копейки
             * <wiTag group='Управление'>
             */
            hideEmptyDecimals: false,
            /**
             * @cfg {Boolean} Показывать пустые копейки при получении фокуса если включён параметр hideEmptyDecimals
             * <wiTag group='Управление'>
             */
            showEmptyDecimalsOnFocus: true,
            /**
             * @cfg {Boolean} Показывать или нет разделители триад
             * Т.е. 123 456 201
             * <wiTag group='Управление'>
             */
            delimiters: true,
            /**
             * @cfg {Boolean} Показывать только неотрицательное значения или произвольные
             * <wiTag group='Управление'>
             */
            notNegative : false,
            cssClassName: 'ws-field-numeric',
            cssClass: 'ws-field-numeric'
         }
      },
      _dotTplFn: dotTplFn,
      $constructor : function(){
         if (this._options.decimals > 0) {
            this._options.decimals = parseInt(this._options.decimals, 10);
         }
         if (this._options.integers > 0) {
            this._options.integers = parseInt(this._options.integers, 10);
         }
      },
      _initEvents: function() {
         var self = this;
         // в первую очередь нужно выполнить инициализоцию событий у родителя
         $ws.proto.FieldNumeric.superclass._initEvents.apply(this, arguments);
         this._inputControl
            .keypress(function(event){
               if (!self._isChangeable()) {
                  return false;
               }
               var
                  key = event.which || event.keyCode; // Firefox как нимимум хочет и то, и другое...
               if (key && !event.ctrlKey && (key > 40 || key == 39) ||
                  self._extractKey(event) == $ws._const.key.space ||
                  key <= 40 && event.shiftKey) {
                  if (/[0-9]/.test(String.fromCharCode(key))) {
                     self._typing(event);
                  }
                  if (/\.|,/.test(String.fromCharCode(key))) {
                     // Delete is not period FIX
                     // У точки и у delete 46й код
                     // Chromium & IE вообще не зайдут сюда по delete
                     // В Opera & FF при delete - event.which == 0
                     if (event.which) {
                        self._pointFunc();
                     }
                  }
                  if (event.which === 0 && event.keyCode == 45) { // insert case, not minus
                     return true;
                  }
                  if (/[\-]/.test(String.fromCharCode(key))){
                     self._negativeValue();
                  }
                  return ( !event.which && (
                     key == $ws._const.key.f5    || // F5, не отменяем действие по-умолчанию
                     key == $ws._const.key.f12   || // F12,не отменяем действие по-умолчанию
                     key == $ws._const.key.left  || // не отменяем arrow keys (влево, вправо)
                     key == $ws._const.key.right ||
                     key == $ws._const.key.end   || // не отменяем home, end
                     key == $ws._const.key.home
                     ));
               }
               return true;
            })
            .keydown(function(event) {
               if (!self.isEnabled()) {
                  return true;
               }
               if (
                  event.keyCode == $ws._const.key.backspace ||
                  event.keyCode == $ws._const.key.del && !(event.ctrlKey && event.shiftKey)
                  ) {
                  if (event.keyCode == $ws._const.key.del && event.ctrlKey) {
                     event.preventDefault();
                  }
                  self._typing(event);
                  return false;
               }
               return true;
            })
            .blur(function(){
               this.value = this.value.replace(/\.$/g, '');
               self._emptyNegative = false;
               self._isBluring = true;
               self._setValueInternal(self.getValue()); // При выходе убираем отображение «-0» => «0»
            });
         this.subscribe('onFocusIn', function(){
            if(self._options.hideEmptyDecimals && self.isEnabled()) {
               self._setValueInternal(self.getValue());
            }
         });
      },
      /**
       * Функция-обработчик события _onKeyUp. Переопределена, т.к. работа по нажатию на delete/backspace выполняется в событии onkeyDown
       * @param {object} event
       * @private
       */
      _onKeyUp: function(event) {
      },
      /**
       * Если значение пустое, то возвращает null или '0'(зависит от defaultValueIsNull). В противном случае возвращает исходное значение.
       * @param val исходное значение
       * @returns Преобразованное значение.
       * @protected
       */
      _selectNullValue: function(val) {
         return val === '' || val === null ? (this._options.defaultValueIsNull ? null : '0') : val;
      },
      /**
       * Возвращает дефолтное значение
       * @returns {*}
       * @private
       */
      _getDefaultValue: function() {
         return typeof(this._options.value) === 'function'
            ? this._selectNullValue(this._options.value())
            : this._selectNullValue(this._options.value);
      },
      /**
       * <wiTag group='Управление'>
       * @deprecated Будет удалён полностью в 3.7, используйте {@link setDecimals}
       * Метод изменения количества знаков после запятой
       * @param {Number} c количество знаков после запятой
       */
      decimalsCount : function(c) {
         this.setDecimals(c);
      },
      /**
       * <wiTag group='Управление'>
       * @deprecated Будет удалён полностью в 3.7, используйте {@link setDecimals}
       * Метод изменения количества знаков после запятой.
       * @param {Number} c Количество знаков после запятой. -1 — неограниченное количество.
       */
      setDecimalsCount: function(c) {
         this.setDecimals(c);
      },
      /**
       * <wiTag group='Управление'>
       * Метод изменения количества знаков после запятой.
       * @param {Number} c Количество знаков после запятой. -1 — неограниченное количество.
       */
      setDecimals: function(c) {
         this._options.decimals = c >= 0 ? c : -1;
         this.setValue(this.getValue(), undefined, true);
      },
      /**
       * <wiTag group='Управление'>
       * @deprecated Будет удалён полностью в 3.7, используйте {@link getDecimals}
       * Количество чиство цифр после запятой.
       * @returns {Number} -1 если неограничено или натуральное число — ограничение.
       */
      getDecimalsCount: function() {
         return this.getDecimals();
      },
      /**
       * <wiTag group='Управление'>
       * Количество чиство цифр после запятой.
       * @returns {Number} -1 если неограничено или натуральное число — ограничение.
       */
      getDecimals: function() {
         return this._options.decimals;
      },
      /**
       * <wiTag group='Управление'>
       * @deprecated Будет удалён полностью в 3.7, используйте {@link setIntegers}
       * Метод изменения количества знаков в целой части.
       * @param {Number} c Количество в целой части. -1 — неограниченное количество.
       */
      setIntegersCount: function(c) {
         this.setIntegers(c);
      },
      /**
       * <wiTag group='Управление'>
       * Метод изменения количества знаков в целой части.
       * @param {Number} integers Количество в целой части. -1 — неограниченное количество.
       */
      setIntegers: function(integers) {
         this._options.integers = integers >= 0 ? integers : -1;
         this.setValue(this.getValue());
      },
      /**
       * <wiTag group='Управление'>
       * @deprecated Будет удалён полностью в 3.7, используйте {@link getIntegers}
       * Количество чиство цифр после запятой.
       * @returns {Number} -1 если неограничено или натуральное число — ограничение.
       */
      getIntegersCount: function() {
         return this.getIntegers();
      },
      /**
       * <wiTag group='Управление'>
       * Количество чиство цифр после запятой.
       * @returns {Number} -1 если неограничено или натуральное число — ограничение.
       */
      getIntegers: function() {
         return this._options.integers;
      },
      _negativeValue : function(){
         if (!this._options.notNegative){
            var
               value = this.getValue(),
               valIsEmpty = !value,
               car = this._getCaret(),
               pos = value ? Math.max( car[0] + (value < 0 ? - 1 : + 1), 0) : car[0],
               pos2 = value ? car[1] + (value < 0 ? - 1 : + 1) : car[1];
            if(valIsEmpty) {
               this._emptyNegative = !this._emptyNegative;
               pos = this._emptyNegative;
               pos2 = pos + 1;
            }
            this.setValue(-value);
            if (valIsEmpty) {
               this._inputControl.val((this._emptyNegative ? '-' : '') + this._inputControl.val());
            }
            this._setCaret(pos,pos2);
         }
      },
      /**
       * Метод отвечающий за ввод символов с клавиатуры
       * @param event
       */
      _typing : function(event){
         var
            key = event.which,
            keyCode = event.keyCode,
            self = this,
            b = self._getCaret()[0],
            e = self._getCaret()[1],
            buf = [],
            buf2,
            val = self._inputControl.get(0).value,
            ch = String.fromCharCode(key),
            _selfCurVal = self._curValue(),
            l = _selfCurVal === '' || _selfCurVal === null ? (this._options.decimals > 0 ? this._options.decimals + 1 : 0) : (self._curval + '').length,
            dotPos = val.indexOf('.'),
            hasMinus = /\-/.test(val) ? 1 : 0,
            betweenFixed,
            spacesCount;

         if (dotPos == -1) {
            dotPos = val.length;
         }
         spacesCount = dotPos - val.substr(0,dotPos).replace(new RegExp(' ','g'),'').length;
         if (!this._options.readOnly && keyCode == $ws._const.key.backspace && b == e && b > 0) {
            --b;
            if (val.charAt(b)==' ') {
               --b;
               --e;
            }
         }
         if (!this._options.readOnly && keyCode == $ws._const.key.del && b == e && e < l) {
            ++e;
            if (val.charAt(b)==' ') {
               ++b;
               ++e;
            }
         }

         if (b!=e) {
            if (val.charAt(b)==' ') {
               b++;
            }
            if (b != e && val.charAt(e-1)==' ') {
               e--;
            }
         }

         if ( b == e && (
               this._options.decimals > 0 && l == e && l > this._options.decimals ||
               this._options.integers > 0 && this._options.integers + spacesCount + hasMinus <= dotPos && b <= dotPos // Не перезаписываем целые числа при достижении лимита
               )
         ){
            return;
         }

         buf.push(val.substring(0, b));
         if (/[0-9]/.test(ch)) {
            buf.push(ch);
         }

         betweenFixed = undefined;
         // Если точка внутри выделения ....
         if (b != e &&  l - b >= (this._options.decimals + 1) && l - e <= this._options.decimals && this._options.decimals > 0) {
            betweenFixed = true;  // ... и фиксированное количество знаков после точки
         } else if (dotPos != -1 && b <= dotPos && e > dotPos) {
            betweenFixed = false; // ... и количество знаков после точки произвольное
         }

         if (betweenFixed !== undefined){
            buf.push('.');
            var
               clearedDecimals = e - (betweenFixed ? l - this._options.decimals : dotPos + 1),
               newVal;
            buf2 = buf.slice();
            if (betweenFixed === true) {                               // Поддерживаем количество знаков после запятой
               buf.push('000000000000'.substr(0, clearedDecimals)); // Вместо удалённых после точки символов пишем нули
            }
            buf.push(val.substr(e));
            buf2.push(val.substr(e));
            if (buf2.join('') === '.') {
               newVal = '.';
            } else {
               newVal = buf.join('');
            }
            self._setValueInternal(newVal);
            dotPos = self._curval.indexOf('.');
            if (dotPos == -1) {
               dotPos = self._curval.length;
            }
            self._setCaret(dotPos);
            return;
         }

         // Если правили после точки при фиксированом количестве знаков там, то поддерживаем их количество
         if (l - e <= this._options.decimals && this._options.decimals > 0) {
            buf.push('000000000000'.substr( 0, e-b + (/[0-9]/.test(ch) ? -1 : 0) ));
         }

         buf.push(val.substring(l - e <= this._options.decimals && b == e ? e + 1 : e));
         val = buf.join('');
         self._setValueInternal(val);
         self._inputControl.change();
         if (self._emptyNegative && self.getValue() > 0) {
            self.setValue( -self.getValue() );
            self._emptyNegative = false;
         }
         if (event.keyCode != $ws._const.key.backspace) {
            if (l - e <= this._options.decimals && l > this._options.decimals) {
               b++;
               e++;
            }
         } else if (l - e == this._options.decimals - 1) {
            e--;
         }
         self._caretPos(l - b, l - e);
      },
      /**
       * Высчитывает позицию каретки и устанавливает каретку в новое положение
       * @param {Number} beginPosSelection позиция начала выделения
       * @param {Number} endPosSelection позиция конца выделения
       */
      _caretPos: function(beginPosSelection, endPosSelection){
         var
            curentValueLength = (this._curval + '').length,
            caretPos;
         if (beginPosSelection < 0) {
            beginPosSelection = 0;
         }
         if (endPosSelection < 0) {
            endPosSelection = 0;
         }
         caretPos = beginPosSelection !== endPosSelection && beginPosSelection < this.getDecimals() ? beginPosSelection : endPosSelection;
         this._setCaret(curentValueLength - caretPos);
      },
      _pointFunc: function(){
         var
            v = this._inputControl.val(),
            i = v.indexOf('.');
         if (this._options.decimals < 0 && i == -1) {
            var
               caret = this._getCaret(),
               b = caret[0],
               e = caret[1],
               res = [];

            res.push(v.substring(0,b));
            res.push(v.substr(e));
            this._inputControl.val(res.join('.'));
            this._setCaret(b + 1);
         } else if (this._options.decimals !== 0) {
            if (v === '') {
               this._inputControl.val('.');
               i = 1;
            }
            this._setCaret(i + 1);
         }
      },
      /**
       * привязка "внутренностей" контрола к верстке
       * @protected
       */
      _bindInternals : function(){
         this._inputControl = this._container.find('.input-text-field');
         this._createPlaceholder();
      },
      /**
       * Возвращает массив содержащий координаты выделения
       * @return {Array} массив содержащий координаты выделения
       */
      _getCaret : function(){
         var
            obj = this._inputControl.get(0),
            b,
            e,
            l;
         if (document.selection){                        //IE
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
      _setCaret: function(pos, pos2){
         pos2 = pos2 || pos;
         var obj = this._inputControl.get(0);
         if (document.selection){              // IE
            var r = obj.createTextRange();
            r.collapse(true);
            r.moveStart('character', pos);
            r.moveEnd('character', pos2-pos); // Оказывается moveEnd определяет сдвиг, а не позицию
            r.select();
         } else {
            obj.setSelectionRange(pos, pos2);
            obj.focus();
         }
      },
      _notFormatedVal : function(){
         var val = parseFloat((this._curval + '').replace(/ /g, ''));
         if (!isNaN(val)) {
            return val;
         }
         return null;
      },
      _clipEmptyDecimals: function(value){
         if(value === null){
            return value;
         }

         var
            res, idx, 
            dotPos = value.indexOf('.');
         if(dotPos !== -1) {
            res = /\.?0+$/.exec(value.substr(dotPos));
            idx = res ? res.index : -1; 
            if(idx !== -1) {
               value = value.substr(0,dotPos+idx);
            }
         }
         return value;
      },
      /**
       * Обработка числового значения
       * @param {String} value входное значение
       * @returns {String} value обработанное значение на выходе
       * @protected
       */
      _valueInternalProcessing: function(value) {
         var v = $ws.render.defaultColumn.numeric(
            value,
            this._options.integers,
            this._options.delimiters,
            this._options.decimals,
            this._options.notNegative,
            this._options.maxLength
         );
         if (this._emptyNegative && (parseInt(value,10)||v === null)) {
            this._emptyNegative = false;
         }
         // если поле не активно, то скрываем нули, если нужно и просили
         if (this._options.hideEmptyDecimals && (!this.isActive() || this._isBluring)) {
            this._isBluring = false;
            v = this._clipEmptyDecimals(v);
         }
         return $ws.proto.FieldNumeric.superclass._valueInternalProcessing.apply(this, [v]);
      }
   });

   return $ws.proto.FieldNumeric;

});
