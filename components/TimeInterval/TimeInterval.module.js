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
             * объект $ws.proto.TimeInterval
             */
            timeInterval: null,
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
               interval: undefined
            }
         },

         $constructor: function () {
            var self = this;
            this._publish('onChangeInterval');
            this._checkPossibleMask();

            this._options.text = this.formatModel.getStrMask(this._maskReplacer);
            this.timeInterval = new $ws.proto.TimeInterval;
            if (this._options.interval){
               this.timeInterval.set(this._options.interval);
               this._setTextByTotalMinutes();
            }

            this.subscribe('onFocusOut', self._setTextByTotalMinutes);
            this.subscribe('onInputFinished',self._setTextByTotalMinutes);
         },
         /**
          * Устанавливаем кол-во дней
          * @param days
          */
         setDays: function (days) {
            this._setPattern(days, "D");
         },
         /**
          * Устанавливаем кол-во часов
          * @param hours
          */
         setHours: function (hours) {
            this._setPattern(hours, "H");
         },
         /**
          * Устанавливаем кол-во минут
          * @param minutes
          */
         setMinutes: function (minutes) {
            this._setPattern(minutes, "I");
         },

         _setPattern: function(value, pattern){
            var patternIndex = this._getIndexForPattern(pattern),
               values = [this.timeInterval.getDays(), this.timeInterval.getHours(), this.timeInterval.getMinutes()];
            values[patternIndex] = value;
            this.timeInterval.set(values);
            this._setText(this._getTextByTotalMinutes(this.timeInterval.getTotalMinutes()));
         },

         /**
          * Установить дату. Публичный метод. Отличается от приватного метода тем, что генерирует событие.
          * @param interval
          */
         setInterval: function ( interval ) {
            this._setInterval( interval);
            this._notify('onChangeInterval', this.timeInterval.getValue());
         },
         /**
          * Установить интервал. Приватный метод
          * @param interval новое значение интервала
          */
         _setInterval: function (interval) {
            this.timeInterval.set(interval);
            this._options.text = this._getTextByTotalMinutes(this.timeInterval.getTotalMinutes());
            this._setText();
         },
         /**
          * Получить интервал
          */
         getInterval: function(){
            return this.timeInterval.getValue();
         },
         /**
          * Установить маску.
          */
         _setMask: function (mask) {
            this.setMask(mask);
            this._setText();
            this.setCursor(this.formatModel._options.cursorPosition.group,this.formatModel._options.cursorPosition.position + 1);
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
         /**
          * В добавление к проверкам и обновлению опции text, необходимо обновить поле interval
          * @param text
          * @private
          */
         _setText: function(text){
            if (!text){
               text = this._options.text;
            }
            TimeInterval.superclass.setText.apply(this,arguments);
            this._getIntervalByText(text);
            this._options.text = this._getTextByTotalMinutes(this.timeInterval.getTotalMinutes());
            this._notify('onChangeInterval', this._options.interval);
         },

         _getIntervalByText: function(text){
            var days = 0,
               hours = 0,
               minutes = 0,
               availTextArray = text.replace(new RegExp(this._maskReplacer,'g'), "").split(':');

            if (this._hasMaskPattern('D')){
               days = parseInt(availTextArray[0]);
            }
            hours = parseInt(availTextArray[this._getIndexForPattern('H')]);
            if (this._hasMaskPattern('I')){
               minutes = parseInt(availTextArray[this._getIndexForPattern('I')]);
            }
            this.timeInterval.set("P" + days + "DT" + hours + "H" + minutes + "M");
         },
         /**
          * Получить _options.text
          */
         _getTextByTotalMinutes: function (totalMinutes) {
            var patternValues = this._getPatternValues(totalMinutes),
               prefix = '___',
               availMaskArray = this._options.mask.split(":"),
               needSetMask = false;

            //Увеличиваем маску, если нужно
            while (patternValues[0].toString().length > availMaskArray[0].length && availMaskArray[0].length < 4) {
               availMaskArray[0] += availMaskArray[0][0];
               needSetMask = true;
            }
            if (needSetMask){
               this._setMask(availMaskArray.join(':'));
            }

            for (var i = 0; i < patternValues.length; i++) {
               if (i > 0) {
                  prefix += 0;
               }
               patternValues[i] = (prefix + patternValues[i]).slice(-availMaskArray[i].length);
            }
            return patternValues[0] + ":" + patternValues[1] + (patternValues.length > 2 ? ":" + patternValues[2] : "");
         },
         /**
          * Получить индекс паттерна в маске
          */
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

         _getPatternValues: function () {
            var patternArray = [],
               minutes = this.timeInterval.getMinutes(),
               hours = this.timeInterval.getHours(),
               days = this.timeInterval.getDays();

            if (this._hasMaskPattern('D')) {
               patternArray.push(days);
               patternArray.push(hours);
            }
            else{
               patternArray.push(this.timeInterval.getTotalHours());
            }
            if (this._hasMaskPattern('I')) {
               patternArray.push(minutes);
            }
            return patternArray;
         },
         _setTextByTotalMinutes: function(){
            this._setText(this._getTextByTotalMinutes(this.timeInterval.getTotalMinutes()));
         },
         /**
          * Обновляяет значения this._options.text и this._options.interval (вызывается в _replaceCharacter из FormattedTextBoxBase). Переопределённый метод.
          * @private
          */
         _updateText: function(){
            var text = $(this._inputField.get(0)).text(),
                oldDate = this.timeInterval.getValue(),
                minLengthMask = 7,//Минимальная длина маски в символах
                minutesLengthMask = (this._hasMaskPattern('I') && this._hasMaskPattern('D')) ? 3 : 0;//Если маска имеет дни и минуты, то увеличиваем minLengthMask на 3

            this._getIntervalByText(text);
            this._options.text = this._getTextByTotalMinutes(this.timeInterval.getTotalMinutes());

            if (this._options.mask.length < (minLengthMask + minutesLengthMask) && text.split(':')[0].indexOf(this._maskReplacer) == -1) {
               this._options.text = this._maskReplacer + this._options.text;
               this._setMask(this._options.mask[0] + this._options.mask);
            }

            // Если дата изменилась -- генерировать событие.
            // Если использовать просто setInterval, то событие будет генерироваться даже если дата введена с клавиатуры не полностью, что неверно
            if ( oldDate !== this.timeInterval.getValue()) {
               this._notify('onChangeInterval', this.timeInterval.getValue());
            }
         }
      });
      return TimeInterval;
   });