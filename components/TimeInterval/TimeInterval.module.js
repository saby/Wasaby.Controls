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
            _patterns: {
               'days' : 'D',
               'hours' : "H",
               'minutes' : "I"
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
               this.setInterval(this._options.interval);
            }

            this.subscribe('onFocusOut', self._setTextByTimeInterval);
            this.subscribe('onInputFinished',self._setTextByTimeInterval);
         },
         /**
          * Устанавливаем кол-во дней
          * @param days
          */
         setDays: function (days) {
            this._setPattern(days, "days");
         },
         /**
          * Устанавливаем кол-во часов
          * @param hours
          */
         setHours: function (hours) {
            this._setPattern(hours, "hours");
         },
         /**
          * Устанавливаем кол-во минут
          * @param minutes
          */
         setMinutes: function (minutes) {
            this._setPattern(minutes, "minutes");
         },

         _setPattern: function(value, pattern){
            var values = this.timeInterval.getValueAsObject();
            values[pattern] = value;
            this.timeInterval.set(values);
            this._setTextByTimeInterval();
         },

         /**
          * Установить дату. Публичный метод. Отличается от приватного метода тем, что генерирует событие.
          * @param interval
          */
         setInterval: function ( interval ) {
            this.timeInterval.set(interval);
            this._setTextByTimeInterval();
            this._notify('onChangeInterval', this.timeInterval.getValue());
         },
         /**
          * Получить интервал
          */
         getInterval: function(){
            return this.timeInterval.getValue();
         },
         /**
          * Увеличить маску.
          * @param length на сколько увеличить маску
          */
         _incMask: function (length) {
            this._options.mask = this._options.mask.substr(0, length) + this._options.mask;
            TimeInterval.superclass.setMask.apply(this, [this._options.mask]);
            this.setText();
            this.setCursor(this.formatModel._options.cursorPosition.group,this.formatModel._options.cursorPosition.position + 1);
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
         setText: function(text){
            if (!text){
               text = this._options.text;
            }
            TimeInterval.superclass.setText.apply(this, [text]);
            this._getIntervalByText(text);
            this._options.text = this._getTextByTimeInterval();
            this._notify('onChangeInterval', this._options.interval);
         },

         _getIntervalByText: function(text){
            var days = 0,
               hours = 0,
               minutes = 0,
               availTextArray = text.replace(new RegExp(this._maskReplacer,'g'), "").split(':');

            if (this._hasMaskPattern(this._patterns.days) && availTextArray[0]){
               days = parseInt(availTextArray[0]);
            }
            if (availTextArray[this._getIndexForPattern('H')]){
               hours = parseInt(availTextArray[this._getIndexForPattern('H')]);
            }
            if (this._hasMaskPattern(this._patterns.minutes) && availTextArray[this._getIndexForPattern('I')]){
               minutes = parseInt(availTextArray[this._getIndexForPattern('I')]);
            }
            this.timeInterval.set([days, hours, minutes]);
         },
         /**
          * Получить _options.text
          */
         _getTextByTimeInterval: function () {
            var value = this._getPatternValues().join(':');

            while (value.length <= this._options.mask.length && this.formatModel.model[0].mask.length < 4 && (value[0] != this._maskReplacer && value[0] != "0")){
               value = this._maskReplacer + value;
            }

            if (value.length > this._options.mask.length){
               this._options.text = value;
               this._incMask(value.length - this._options.mask.length);
            }

            return value;
         },
         /**
          * Получить индекс паттерна в маске
          */
         _getIndexForPattern: function(pattern){
            if (!this._hasMaskPattern(pattern)){
               return -1;
            }
            switch (pattern){
               case this._patterns.days:
                  return 0;
                  break;
               case this._patterns.hours:
                  return this._hasMaskPattern(this._patterns.days) ? 1 : 0;
                  break;
               case this._patterns.minutes:
                  return this._hasMaskPattern(this._patterns.days) ? 2 : 1;
                  break;
            }
         },

         _getPatternValues: function () {
            var intervalValues = this.timeInterval.getValueAsObject(),
               patternArray = [];

            if (this._hasMaskPattern(this._patterns.days)) {
               patternArray.push(intervalValues.days);
               patternArray.push(intervalValues.hours);
            }
            else{
               patternArray.push(this.timeInterval.getTotalHours());
            }
            if (this._hasMaskPattern(this._patterns.minutes)) {
               patternArray.push(intervalValues.minutes);
            }

            $.each(patternArray, function(i, value){
               if (value < 10){
                  patternArray[i] = "0" + value;
               }
            });
            return patternArray;
         },
         _setTextByTimeInterval: function(){
            this.setText(this._getTextByTimeInterval());
         },
         /**
          * Обновляяет значения this._options.text и interval (вызывается в _replaceCharacter из FormattedTextBoxBase). Переопределённый метод.
          * @private
          */
         _updateText: function(){
            var text = $(this._inputField.get(0)).text(),
                oldDate = this.timeInterval.getValue();

            this._getIntervalByText(text);

            if ((text.split(':')[0].length == this.formatModel.model[0].mask.length) && text.split(':')[0].indexOf(this._maskReplacer) == -1 && this.formatModel.model[0].mask.length < 4) {
               this._options.text = this._maskReplacer + text;
               this._incMask(1);
            }

            // Если дата изменилась -- генерировать событие.
            if ( oldDate !== this.timeInterval.getValue()) {
               this._notify('onChangeInterval', this.timeInterval.getValue());
            }
         }
      });
      return TimeInterval;
   });