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
               interval: null,
               /**
                * Хранит последний window.getSelection()
                */
               lastSelection: null
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
            this._drawDate();
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
          * Содержит ли интервал дни
          * @private
          */
         _hasMaskDays: function(){
            return this._options.mask.indexOf('D') > -1;
         },
         /**
          * Содержит ли интервал минуты
          * @private
          */
         _hasMaskMinutes: function(){
            return this._options.mask.indexOf('I') > -1;
         },

         _addPlaceholder: function(element){
            if (element.indexOf(this._placeholder) > - 1 || element.length > 3){
               return element;
            }
            return this._placeholder + element;
         },

         /**
          * Устанавливаем кол-во дней
          * @param days
          */
         setDays: function ( days ) {
            var availMaskArray = this._options.mask.split(':'),
                availTextArray = this._options.text.split(':');
            days = days.toString().replace(/[^\d]/g, '');

            if (!this._hasMaskDays()){
               return;
            }

            if (days.length > 4){
               days = "9999";
            }

            //Если количество дней не соответствует маске, то меняем маску
            while (days.length > availMaskArray[0].length)
               availMaskArray[0] = "D" + availMaskArray[0];
            this._setMask(availMaskArray.join(':'));

            availTextArray[0] = this._addPlaceholder(days);
            this._options.text = availTextArray.join(':');
            this._options.interval = this._getIntervalByText(this._options.text);
            this.setInterval( this._options.interval, true );
         },

         /**
          * Устанавливаем кол-во часов
          * @param hours
          */
         setHours: function ( hours ) {
            this._setHours(hours);
            if (!this._checkBoundaryValues()){
               this._correctInterval();
            }
         },
         _setHours: function ( hours ) {
            var availMaskArray = this._options.mask.split(':'),
               availTextArray = this._options.text.split(':');
            hours = hours.toString().replace(/[^\d]/g, '');

            //Если количество часов не соответствует маске, то меняем маску
            if (!this._hasMaskDays()) {
               if (hours.length > 4){
                  hours = "9999";
               }
               while (hours.length > availMaskArray[0].length)
                  availMaskArray[0] = "H" + availMaskArray[0];
               this._setMask(availMaskArray.join(':'));
               availTextArray[0] = hours;
            }
            else{
               availTextArray[1] = hours;
            }

            this._options.text = availTextArray.join(':');
            this._options.interval = this._getIntervalByText(this._options.text);
            this.setInterval( this._options.interval,true );
         },

         /**
          * Устанавливаем кол-во минут
          * @param minutes
          */
         setMinutes: function ( minutes ) {
            this._setMinutes(minutes);
            if (!this._checkBoundaryValues()){
               this._correctInterval();
            }
         },
         _setMinutes: function ( minutes ) {
            var availTextArray = this._options.text.split(':'),
               minutesIndex = this._hasMaskDays() ? 2 : 1;
            minutes = minutes.toString().replace(/[^\d]/g, '');

            if (!this._hasMaskMinutes()){
               return;
            }
            availTextArray[minutesIndex] = minutes;
            this._options.text = availTextArray.join(':');
            this._options.interval = this._getIntervalByText(this._options.text);
            this.setInterval( this._options.interval, true );
         },

         /**
          * В добавление к проверкам и обновлению опции text, необходимо обновить поле _date
          * @param text
          * @private
          */
         setText: function ( text ) {
            text = text ? text: '';
            TimeInterval.superclass.setText.call( this, text );
            if (!this._checkBoundaryValues()){
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
               if (!this._checkBoundaryValues()){
                  this._correctInterval();
               }
            }
            this._drawDate();
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
               if (!availTextArray[i]){
                  continue;
               }

               if (availCharsArray[i].indexOf('D') > -1){
                  interval = "P" + availTextArray[i] + "D";
               }
               else if (availCharsArray[i].indexOf('H') > -1){
                  interval += "T" + availTextArray[i] + "H";
               }
               else if (availCharsArray[i].indexOf('I') > -1){
                  interval += availTextArray[i] + "M";
               }
            }
            return interval;
         },

         /**
          * Получить _options.text из интервала
          */
         _getTextByInterval: function(interval){
            var i = 0,
               textObj = {},
               text = this._options.mask,
               availCharsArray = this._options.mask.split(':'),
               manageChar,
               num;

            interval = interval.replace('P', '').replace('T', '');

            while(interval[i]){
               if (isFinite(interval[i])){
                  num = 0;
                  while (isFinite(interval[i])){
                     num = num * 10 + parseInt(interval[i++]);
                  }
               } else{
                  manageChar = interval[i++];
                  switch (manageChar){
                     case 'D':
                        if (availCharsArray.indexOf('DDDD') > -1)
                           textObj['DDDD'] =  ('___' + num).slice(-4);
                        else if (availCharsArray.indexOf('DDD') > -1)
                           textObj['DDD'] =  ('__' + num).slice(-3);
                        else if(availCharsArray.indexOf('DD') > -1)
                           textObj['DD'] =  ('0' + num).slice(-2);
                        break;
                     case 'H' :
                        if (availCharsArray.indexOf('HHHH') > -1)
                           textObj['HHHH'] =  ('___' + num).slice(-4);
                        else if (availCharsArray.indexOf('HHH') > -1)
                           textObj['HHH'] =  ('__' + num).slice(-3);
                        else if(availCharsArray.indexOf('HH') > -1)
                           textObj['HH'] =  ('0' + num).slice(-2);
                        break;
                     case 'M' :
                        if (availCharsArray.indexOf('II') > -1)
                           textObj['II'] =  ('0' + num).slice(-2);
                        break;
                  }
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

         /**
          * Обновить поле даты по текущему значению даты в this._options.interval
          * @private
          */
         _drawDate: function(){
            var newText = this._options.interval == null ? '' : this._getTextByInterval(this._options.interval);
            this._inputField.html( this._getHtmlMask(newText) );
         },

         /**
          * Проверяем, не превысили ли введенные значения свой максимум
          * @private
          */
         _checkBoundaryValues: function(text){
            return this._getHours() < 24 && this._getMinutes() < 60;
         },

         //Устанавливаем часы и минуты в их диапазоне
         _correctInterval: function(){
            this.incValue(0);
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
            allMinutes = (this._getDays() * 24 + this._getHours()) * 60 + this._getMinutes() + parseInt(incMinutes == "" ? 0 : incMinutes);
            if (allMinutes < 0){
               days = hours = minutes = 0;
            }
            else{
               if (this._hasMaskDays()){
                  days = allMinutes / (24 * 60) | 0;
                  allMinutes %= 24 * 60;
               }
               hours = allMinutes / 60 | 0;
               minutes = allMinutes % 60;
            }
            this.setDays(days);
            this._setMinutes(minutes);
            this._setHours(hours);
         },

         _getMinutes: function(){
            var minuteIndex;
            if (this._hasMaskMinutes()){
               minuteIndex = this._hasMaskDays() ? 2 : 1;
               return parseInt(this._options.text.split(':')[minuteIndex].replace(new RegExp(this._placeholder,'g'), "0"));
            }
            return 0;
         },

         _getHours: function(){
            var hourIndex = this._hasMaskDays() ? 1 : 0;
            return parseInt(this._options.text.split(':')[hourIndex].replace(new RegExp(this._placeholder,'g'), "0"));
         },

         _getDays: function(){
            if (this._hasMaskDays()){
               return parseInt(this._options.text.split(':')[0].replace(new RegExp(this._placeholder,'g'), "0"));
            }
            return 0;
         },

         //Переопределенный метод
         _getCursor: function(position){
            var selection;
            selection = window.getSelection();
            if (selection.type === "None"){
               selection = this._options.lastSelection;
            }
            else{
               selection = selection.getRangeAt(0);
               this._options.lastSelection = selection;
            }
            return ( position ?
               this._correctCursor(selection.startContainer, selection.startOffset) :
               this._correctCursor(selection.endContainer, selection.endOffset)
               );
         },

         /**
          * Обновляяет значения this._options.text и this._options.interval (вызывается в _replaceCharacter из FormattedTextBoxBase). Переопределённый метод.
          * Если есть хотя бы одно незаполненное место ( плэйсхолдер ), то text = '' (пустая строка) и _date = null
          * @private
          */
         _updateText: function(){
            var text = $(this._inputField.get(0)).text(),
                oldDate = this._options.interval,
                minLengthMask = 7,//Минимальная длина маски в символах
                minutesLengthMask = (this._hasMaskMinutes() && this._hasMaskDays()) ? 3 : 0;//Если маска имеет дни и минуты, то увеличиваем minLengthMask на 3

            this._options.interval = this._getIntervalByText(text);
            this._options.text = this._getTextByInterval(this._options.interval);

            if (this._options.mask.length < (minLengthMask + minutesLengthMask) && text.split(':')[0].indexOf('_') == -1) {
               this._options.text = this._placeholder + text;
               this._setMask(this._options.mask[0] + this._options.mask);
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