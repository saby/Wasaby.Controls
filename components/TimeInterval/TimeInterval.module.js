/**
 * TODO Компонент пока тестировался только в Chrome
 */
define(
   'js!SBIS3.CONTROLS.TimeInterval',
   [
      'js!SBIS3.CONTROLS.FormattedTextBoxBase',
      'js!SBIS3.CONTROLS.PickerMixin',
      'js!SBIS3.CONTROLS.Calendar',
      'html!SBIS3.CONTROLS.TimeInterval'
   ],
   function (FormattedTextBoxBase, PickerMixin, Calendar, dotTplFn) {

      'use strict';

      /**
       * Можно вводить только значения особого формата даты.
       * @class SBIS3.CONTROLS.TimeInterval
       * @extends SBIS3.CONTROLS.FormattedTextBoxBase
       */

      var TimeInterval = FormattedTextBoxBase.extend( [PickerMixin], /** @lends SBIS3.CONTROLS.TimeInterval.prototype */{
         $protected: {
            _dotTplFn: dotTplFn,
            /**
             * Допустимые управляющие символы в маске.
             * Условные обозначения:
             *     1. D(day) -  Календарный день
             *     2. H(hour) - Час
             *     3. I - Минута
             */
            _controlCharactersSet: {
               'D' : 'd',
               'H' : 'd',
               'I' : 'd'
            },
            /**
             * Допустимые при создании контролла маски.
             */
            _possibleMasks: [
               // I. Маски для отображения даты:
               'DDDD:HH:II',
               'DDD:HH:II',
               'DD:HH:II',
               "DDDD:HH",
               "DDD:HH",
               "DD:HH",
               "HHHH:II",
               "HHH:II",
               "HH:II"
            ],
            _isFinishedPrint: false, //Завершили ли ввод интервала (смотрит на последний символ)
            /**
             * Хранит последний window.getSelection()
             */
            _lastSelection: null,
            /**
             * Опции создаваемого контролла
             */
            _options: {
               /**
                * @cfg {String} Формат отображения даты, на базе которой будет создана html-разметка и в соответствии с которой
                * будет определён весь функционал. Должна представлять собой одну из масок в массиве допустимых маск.
                * <wiTag group="Отображение" page=1>
                * @variant 'DD:HH:II',
                * @variant 'DD:HH',
                * @variant 'HH:II',
                */
               mask: 'DD:HH',
               /**
                * Интервал
                */
               interval: null
            }
         },

         $constructor: function () {
            var self = this;

            this._publish('onChangeInterval');

            // Проверяем, является ли маска, с которой создается контролл, допустимой
            this._checkPossibleMask();

            // Первоначальная установка интервала, если передана опция
            if (this._options.interval ) {
               this._setInterval( this._options.interval );
            } else{
               this._options.text = this._clearMask;
            }

            this.subscribe("onFocusOut", function(){
               self._correctInterval();
            });

         },
         /**
          * Получить маску. Переопределённый метод
          */
         _getMask: function () {
            return this._options.mask;
         },
         /**
          * Установить маску.
          */
         _setMask: function (mask) {
            this._options.mask = this._primalMask = mask;
            this._clearMask = this._getClearMask();
            this._maskRegExp = this._getRegExpByMask(this._primalMask);
            this._drawInterval();
         },
         /**
          * Проверить, является ли маска допустимой ( по массиву допустимых маск this._possibleMasks )
          * @private
          */
         _checkPossibleMask: function(){
            if (this._options.mask && Array.indexOf(this._possibleMasks, this._options.mask) == -1){
               throw new Error('Маска не удовлетворяет ни одной допустимой маске данного контролла');
            }
         },
         /**
          * Содержит ли интервал дни\минуты
          * @param pattern (Значения D - дни, I - минуты)
          * @private
          */
         _hasMaskPattern: function(pattern){
            return this._options.mask.indexOf(pattern) > -1;
         },

         _addPlaceholder: function(element){
            if (element.indexOf(this._placeholder) > - 1 || element.length > 3){
               return element;
            }
            return this._placeholder + element;
         },

         /**
          * Установить дни,часы или минуты
          * @param {String} pattern Значения D(дни), H(часы), I(минуты).
          * @param {String/Number} patternValue Значение, которое хотим установить
          */
         _setPattern: function(pattern, patternValue){
            var availMaskArray = this._options.mask.split(':'),
               availTextArray = this._options.text.split(':'),
               patternIndex = this._getIndexForPattern(pattern);

            if (!this._hasMaskPattern(pattern)){
               return;
            }

            patternValue = patternValue.toString().replace(/[^\d]/g, '');
            if (!(pattern == 'H' && this._hasMaskPattern('D') || pattern == 'I')) {
               if (patternValue.length > 4) {
                  patternValue = "9999";
               }
               while (patternValue.length > availMaskArray[0].length)
                  availMaskArray[0] = pattern + availMaskArray[0];
               this._setMask(availMaskArray.join(':'));
            }
            availTextArray[patternIndex] = this._addPlaceholder(patternValue);
            this._options.text = availTextArray.join(':');
            this.setInterval( this._getIntervalByText(this._options.text), true );
         },

         /**
          * Устанавливаем кол-во дней
          * @param days
          */
         setDays: function ( days ) {
            this._setPattern('D', days);
         },

         /**
          * Устанавливаем кол-во часов
          * @param hours
          */
         setHours: function ( hours ) {
            this._setPattern('H', hours);
            this._correctInterval();
         },

         /**
          * Устанавливаем кол-во минут
          * @param minutes
          */
         setMinutes: function ( minutes ) {
            this._setPattern('I', minutes);
            this._correctInterval();
         },
         /**
          * В добавление к проверкам и обновлению опции text, необходимо обновить поле _date
          * @param text
          * @private
          */
         setText: function ( text ) {
            text = text || '';
            if (typeof text != 'string' || !this._checkTextByMask(text)) {
               return;
            }
            this._setText(text, checkValues);

         },

         /**
          * В добавление к проверкам и обновлению опции text, необходимо обновить поле _date
          * @param text
          * checkValues = проверять ли введенное значение на корректность
          * @private
          */
         _setText: function(text, checkValues){
            var availTextArray = text.split(":"),
               dataContainers = this.getContainer().find('em');
            for (var i = 0; i < (this._hasMaskPattern('D') + this._hasMaskPattern('I') + 1);i++){
               $(dataContainers[i * 2]).text(availTextArray[i]);
            }
            if (checkValues){
               this._correctInterval();
            }
            this._options.interval = text == '' ? null : this._getIntervalByText( text );
            this._notify('onChangeInterval', this._options.interval);
         },

         /**
          * Установить дату. Публичный метод. Отличается от приватного метода тем, что генерирует событие.
          * @param interval
          */
         setInterval: function ( interval, dontCheck ) {
            this._setInterval( interval, dontCheck );
            this._notify('onChangeInterval', this._options.interval);
         },

         /**
          * Установить интервал. Приватный метод
          * @param interval новое значение интервала, объект типа Date
          */
         _setInterval: function (interval, dontCheck) {
            this._options.interval = interval;
            this._options.text = this._getTextByInterval(interval);
            if (dontCheck !== true){
               this._correctInterval();
            }
            this._drawInterval();
         },
         /**
          * Получить дату
          * @returns {Date|*|SBIS3.CONTROLS.TimeInterval._options.interval}
          */
         getInterval: function(){
            return this._options.interval;
         },

         _getIntervalByText: function(text){
            var regexp = new RegExp('[' + this._controlCharacters + ']+', 'g'),
               availCharsArray = this._options.mask.match(regexp),
               availTextArray,
               interval = '';

            text = text.replace(new RegExp(this._placeholder,'g'), "");
            availTextArray = text.split(':');

            for (var i = 0; i < availCharsArray.length; i++) {
               interval += this._getPartIntervalByPattern(availCharsArray[i], availTextArray[i]);
            }
            return interval;
         },

         _getPartIntervalByPattern: function(availChars, availText){
            var pattern = availChars[0],
               controlChar = '';
            if (availChars.indexOf(pattern) == -1 || !availText){
               return '';
            }
            switch (pattern){
               case 'D':
                  controlChar = 'P';
                  break;
               case 'H':
                  controlChar = 'T';
                  break;
               case 'I':
                  pattern = 'M';
                  break;
            }
            return controlChar + availText + pattern;
         },

         /**
          * Получить _options.text из интервала
          */
         _getTextByInterval: function(interval){
            var i = 0,
               textObj = {},
               text = this._options.mask,
               availCharsArray = this._options.mask.split(':'),
               valueByManageChar,
               num;

            interval = interval.replace('P', '').replace('T', '');

            while(interval[i]){
               if (isFinite(interval[i])){
                  num = 0;
                  while (isFinite(interval[i])){
                     num = num * 10 + parseInt(interval[i++]);
                  }
               } else{
                  valueByManageChar = this._getPartTextByPattern(availCharsArray, interval[i++], num);
                  textObj[valueByManageChar[0]] = valueByManageChar[1];
               }
            }

            for (i in textObj) {
               if (textObj.hasOwnProperty(i)) {
                  text = text.replace(i, textObj[i])
               }
            }
            text = text.replace(/[DHI]/g, "_");
            return text;
         },

         _getPartTextByPattern: function(availCharsArray, manageChar, num){
            var searchPattern,
               prefix = '___',
               needZeroInPrefix = !(manageChar == 'D' || (manageChar == 'H' && !this._hasMaskPattern('D')));
            if (needZeroInPrefix)
               prefix += 0;
            searchPattern = manageChar = manageChar.replace('M','I');
            for(var j = 3; j > 0; j--){
               for(var i = 0; i < j; i++){
                  searchPattern += manageChar;
               }
               if (availCharsArray.indexOf(searchPattern) > -1)
                  return [searchPattern, (prefix + num).slice(-searchPattern.length)];
               searchPattern = manageChar;
            }
         },
         /**
          * Обновить поле даты по текущему значению даты в this._options.interval
          * @private
          */
         _drawInterval: function(){
            var newText = this._options.interval == null ? '' : this._getTextByInterval(this._options.interval);
            this._setText(newText);
         },

         /**
          * Проверяем, не превысили ли введенные значения свой максимум
          * @private
          */
         _checkBoundaryValues: function(){
            return this._getPatterns('H') < 24 && this._getPatterns('I') < 60;
         },

         //Устанавливаем часы и минуты в их диапазоне
         _correctInterval: function(){
            if (!this._checkBoundaryValues()){
               this.incValue(0);
            }
         },
         /**
          * Увеличиваем/уменьшаем интервал на заданное кол-во минут
          * @param incMinutes
          * @private
          */
         incValue: function(incMinutes){
            var allMinutes,
               minutes,
               hours,
               days;
            allMinutes = (this._getPatterns('D') * 24 + this._getPatterns('H')) * 60 + this._getPatterns('I') + parseInt(incMinutes == "" ? 0 : incMinutes);
            if (allMinutes < 0){
               days = hours = minutes = 0;
            }
            else{
               if (this._hasMaskPattern('D')){
                  days = allMinutes / (24 * 60) | 0;
                  allMinutes %= 24 * 60;
               }
               hours = allMinutes / 60 | 0;
               minutes = allMinutes % 60;
            }
            this._setPattern('D', days);
            this._setPattern('I', minutes);
            this._setPattern('H', hours);
         },

         _getIndexForPattern: function(pattern){
            if (!this._hasMaskPattern(pattern)){
               return -1;
            }
            switch (pattern){
               case 'D':
                  return 0;
                  break;
               case 'H':
                  return this._hasMaskPattern('D') ? 1 : 0;
                  break;
               case 'I':
                  return this._hasMaskPattern('D') ? 2 : 1;
                  break;
            }
         },
         _getPatterns: function(pattern){
            var patternIndex = this._getIndexForPattern(pattern);
            return patternIndex > -1 ? parseInt(this._options.text.split(':')[patternIndex].replace(new RegExp(this._placeholder,'g'), "0")) : 0;
         },
         //Переопределенный метод
         _getCursor: function(position){
            var selection = this._getSelection(),
               cursorPositionEnd = this._correctCursor(selection.endContainer, selection.endOffset);

            //Проверяем, не ввели ли мы сейчас последний символ
            //Получаем массив позиции курсора.
            //Нулевой индекс - позиция блоков (дни, часы или минуты)
            //Первый индекс - позиция курсора внутри данного блока
            if (cursorPositionEnd[0] >= (1 + this._hasMaskPattern('D') + this._hasMaskPattern('I')) && cursorPositionEnd[1]){
               this._isFinishedPrint = true;
            }

            return ( position ?
               this._correctCursor(selection.startContainer, selection.startOffset) :  cursorPositionEnd);
         },

         _getSelection: function(){
            var selection = window.getSelection();
            if (selection.type === "None"){
               selection = this._lastSelection;
               delete selection.startOffset;
               selection.startOffset = 2;
            }
            else{
               selection = selection.getRangeAt(0);
               this._lastSelection = selection;
            }

            return selection;
         },
         /**
          * Обновляяет значения this._options.text и this._options.interval (вызывается в _replaceCharacter из FormattedTextBoxBase). Переопределённый метод.
          * @private
          */
         _updateText: function(){
            var text = $(this._inputField.get(0)).text(),
                oldDate = this._options.interval,
                minLengthMask = 7,//Минимальная длина маски в символах
                minutesLengthMask = (this._hasMaskPattern('I') && this._hasMaskPattern('D')) ? 3 : 0;//Если маска имеет дни и минуты, то увеличиваем minLengthMask на 3

            this._options.interval = this._getIntervalByText(text);
            this._options.text = this._getTextByInterval(this._options.interval);

            if (this._options.mask.length < (minLengthMask + minutesLengthMask) && text.split(':')[0].indexOf('_') == -1) {
               this._options.text = this._placeholder + text;
               this._setMask(this._options.mask[0] + this._options.mask);
            }
            if (this._isFinishedPrint){
               this._correctInterval();
               this._isFinishedPrint = false;
            }

            // Если дата изменилась -- генерировать событие.
            // Если использовать просто setInterval, то событие будет генерироваться даже если дата введена с клавиатуры не полностью, что неверно
            if ( oldDate !== this._options.interval ) {
               this._notify('onChangeInterval', this._options.interval);
            }
         }
      });

      return TimeInterval;
   });