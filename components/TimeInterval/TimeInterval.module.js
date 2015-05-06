/**
 * TODO Компонент пока тестировался только в Chrome
 */
define(
   'js!SBIS3.CONTROLS.TimeInterval',
   [
      'js!SBIS3.CONTROLS.FormattedTextBoxBase',
      'js!SBIS3.CONTROLS.PickerMixin',
      'html!SBIS3.CONTROLS.TimeInterval'
   ],
   function (FormattedTextBoxBase, PickerMixin, dotTplFn) {

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
            _sections: {
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

            this._options.text = this.formatModel.getStrMask(this._maskReplacer);
            this.timeInterval = new $ws.proto.TimeInterval;
            if (this._options.interval){
               this.setInterval(this._options.interval);
            }

            this.subscribe('onFocusOut', self._updateTextByTimeInterval);
            this.subscribe('onInputFinished',self._updateTextByTimeInterval);
         },
         /**
          * Устанавливаем кол-во дней
          * @param days
          */
         setDays: function (days) {
            this._setSection(days, "days");
         },
         /**
          * Устанавливаем кол-во часов
          * @param hours
          */
         setHours: function (hours) {
            this._setSection(hours, "hours");
         },
         /**
          * Устанавливаем кол-во минут
          * @param minutes
          */
         setMinutes: function (minutes) {
            this._setSection(minutes, "minutes");
         },

         /**
          * Увеличить маску.
          * @param value Значение
          * @param section Что обновляем ( дни, часы, минуты)
          * @private
          */
         _setSection: function(value, section){
            var values = this.timeInterval.getValueAsObject();
            values[section] = value;
            this.timeInterval.set(values);
            this._updateTextByTimeInterval();
         },

         /**
          * Установить интервал.
          * @param interval
          */
         setInterval: function ( interval ) {
            this.timeInterval.set(interval);
            this._updateTextByTimeInterval();
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
          * @param length на сколько символов увеличить маску
          * @private
          */
         _incMask: function (length) {
            this._options.mask = this._options.mask.substr(0, length) + this._options.mask;
            TimeInterval.superclass.setMask.apply(this, [this._options.mask]);
            this.setText();
            this.setCursor(this.formatModel._options.cursorPosition.group, this.formatModel._options.cursorPosition.position + 1);
         },
         /**
          * Содержит ли интервал дни\минуты
          * @param section (Значения D - дни, I - минуты)
          * @private
          */
         _hasMaskSection: function(section){
            return this._options.mask.indexOf(section) > -1;
         },
         /**
          * Устанавливаем текст и обновляем интервал
          * @param text
          */
         setText: function(text){
            if (!text){
               text = this._options.text;
            }
            TimeInterval.superclass.setText.apply(this, [text]);
            this._updateIntervalByText(text);
            this._options.text = this._getTextByTimeInterval();
            this._notify('onChangeInterval', this._options.interval);
         },
         /**
          * Получить текст по текущему значению timeInterval.
          * @private
          */
         _getTextByTimeInterval: function () {
            var valuesArray = this._getSectionValues(),
               value = valuesArray.join(':');

            while (value.length <= this._options.mask.length && valuesArray[0].toString().length < 4 && (value[0] != this._maskReplacer && value[0] != "0")){
               value = this._maskReplacer + value;
            }

            if (value.length > this._options.mask.length){
               this._options.text = value;
               this._incMask(value.length - this._options.mask.length);
            }

            return value;
         },

         /**
          * Получить массив текущих значений
          * @private
          */
         _getSectionValues: function () {
            var intervalValues = this.timeInterval.getValueAsObject(),
               sectionArray = [];

            if (this._hasMaskSection(this._sections.days)) {
               sectionArray.push(intervalValues.days);
               sectionArray.push(intervalValues.hours);
            }
            else{
               sectionArray.push(this.timeInterval.getTotalHours());
            }
            if (this._hasMaskSection(this._sections.minutes)) {
               sectionArray.push(intervalValues.minutes);
            }

            $.each(sectionArray, function(i, value){
               if (value < 10){
                  sectionArray[i] = "0" + value;
               }
            });
            return sectionArray;
         },
         /**
          * Обновить значение timeInterval по модели.
          * @private
          */
         _updateIntervalByText: function(){
            var sectionArray = [];

            if (!this._hasMaskSection(this._sections.days)){
               sectionArray.push(0);
            }
            for (var i = 0; i < this.formatModel.model.length; i += 2){
               sectionArray.push(this.formatModel.model[i].value.join(''));
            }

            this.timeInterval.set(sectionArray);
         },
         /**
          * Обновить текст по текущему значению timeInterval.
          * @private
          */
         _updateTextByTimeInterval: function(){
            this.setText(this._getTextByTimeInterval());
         },
         /**
          * Обновляяет значения this._options.text и interval (вызывается в _replaceCharacter из FormattedTextBoxBase). Переопределённый метод.
          * @private
          */
         _updateText: function(){
            var text = $(this._inputField.get(0)).text(),
                oldDate = this.timeInterval.getValue();

            this._updateIntervalByText(text);

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