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
             * Хранит последний window.getSelection()
             */
            _lastSelection: null,
            /**
             * Общее кол-во минут
             */
            totalMinutes: null,
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

            this._options.text = this.formatModel.getStrMask(this._maskReplacer);

            // Первоначальная установка интервала, если передана опция
            if (this._options.interval ) {
               this._setInterval( this._options.interval );
            }

            this.subscribe("onFocusOut", function(){
               self._correctInterval();
            });

            this.subscribe('onInputFinished',self._correctInterval);
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
            this.setMask(mask);
            this._setText();
            this.setCursor(2,0);
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
          * Установить дни,часы или минуты
          * @param {String} pattern Значения D(дни), H(часы), I(минуты).
          * @param {String/Number} patternValue Значение, которое хотим установить
          */
         _setPattern: function(pattern, newPatternValue){
            var coefficient = { D : 24 * 60, H : 60, I: 1 },
                totalMinutes = this._getTotalMinutes(),
                patternValue = this._getPatterns(pattern);
            if (!this._hasMaskPattern(pattern)){
               return;
            }
            totalMinutes = totalMinutes - patternValue * coefficient[pattern] + (parseInt(newPatternValue) * coefficient[pattern]);
            this._setText(this._getTextByTotalMinutes(totalMinutes));
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
          * В добавление к проверкам и обновлению опции text, необходимо обновить поле interval
          * @param text
          * @param {Boolean} checkValues проверять ли введенное значение на корректность
          * @private
          */
         _setText: function(text, checkValues){
            if (!text){
               text = this._options.text;
            }
            this.setText(text);
            this._options.text = text;

            if (checkValues){
               this._correctInterval();
            }
            this._options.interval = this._getIntervalByTotalMinutes();
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
          * @param interval новое значение интервала
          * @param {Boolean} dontCheck true - не нормализуем, false-нормализуем
          */
         _setInterval: function (interval, dontCheck) {
            this._options.interval = interval;
            this.totalMinutes = this._getTotalMinutesByInterval(interval);
            this._options.text = this._getTextByTotalMinutes(this.totalMinutes);
            if (dontCheck !== true){
               this._correctInterval();
            }
            this._setText();
         },
         /**
          * Получить интервал
          */
         getInterval: function(){
            return this._options.interval;
         },

         _getIntervalByTotalMinutes: function(){
            var patternValues = this._getPatternValues(),
               availMaskArray = this._options.mask.split(":"),
               interval = '',
               prefix = { D : "P", H : "T", I : ""},
               manageChar,
               patternIndex;
            for(var i = 0; i < availMaskArray.length; i++){
               manageChar = availMaskArray[i][0];
               patternIndex = this._getIndexForPattern(manageChar);
               if (patternIndex < 0){
                  continue;
               }

               if (patternValues[i] > 0){
                  interval += prefix[manageChar] + patternValues[patternIndex] + manageChar;
               }
            }
            return interval.replace('I', 'M');
         },
         /**
          * Получить _options.text
          */
         _getTextByTotalMinutes: function (totalMinutes) {
            var patternValues = this._getPatternValues(totalMinutes),
               prefix = '___',
               availMaskArray = this._options.mask.split(":");

            //Увеличиваем маску, если нужно
            while (patternValues[0].toString().length > availMaskArray[0].length && availMaskArray[0].length < 4) {
               availMaskArray[0] += availMaskArray[0][0];
            }
            this._setMask(availMaskArray.join(':'));

            for (var i = 0; i < patternValues.length; i++) {
               if (i > 0) {
                  prefix += 0;
               }
               patternValues[i] = (prefix + patternValues[i]).slice(-availMaskArray[i].length);
            }
            return patternValues[0] + ":" + patternValues[1] + (patternValues.length > 2 ? ":" + patternValues[2] : "");
         },

         _getTotalMinutesByInterval: function(interval){
            var manageChar = '',
               val = '',
               totalMinutes = 0,
               coefficient = {M : 1, H : 60, D : 24*60};
            interval = interval.replace('P', '').replace('T', '');

            for (var i = interval.length - 1; i >= -1 ; i--){
               if (isFinite(interval[i])) {
                  val = interval[i] + val;
               } else {
                  if (val) {
                     totalMinutes += parseInt(val) * coefficient[manageChar];
                     val = '';
                  }
                  manageChar = interval[i];
               }
            }
            return totalMinutes;
         },
         /**
          * Проверяем, не превысили ли введенные значения свой максимум
          * @private
          */
         _checkBoundaryValues: function(){
            return this._getPatterns('I') < 60 && (this._hasMaskPattern('D') ? this._getPatterns('H') < 24 : true);
         },

         //Устанавливаем часы и минуты в их диапазоне
         _correctInterval: function(){
            if (!this._checkBoundaryValues()){
               this._setText(this._getTextByTotalMinutes(this._getTotalMinutes()));
            }
         },
         /**
          * Увеличиваем/уменьшаем интервал на заданное кол-во минут
          * @param incMinutes
          * @private
          */
         incValue: function(incMinutes){
            var totalMinutes = this._getTotalMinutes() + parseInt(incMinutes == "" ? 0 : incMinutes);
            this._setText(this._getTextByTotalMinutes(totalMinutes));
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

         /**
          * Получить общее кол-во минут
          * @param pattern D - дни, H - часы, I - минуты
          */
         _getTotalMinutes: function(){
            return (this._getPatterns('D') * 24 + this._getPatterns('H')) * 60 + this._getPatterns('I');
         },

         _getPatternValues: function(totalMinutes){
            var patternArray = [],
               minutes,
               hours,
               days;
            if (!totalMinutes){
               totalMinutes = this._getTotalMinutes();
            }
            if (totalMinutes < 0){
               days = hours = minutes = 0;
            }
            else{
               if (this._hasMaskPattern('D')){
                  days = totalMinutes / (24 * 60) | 0;
                  patternArray.push(days);
                  totalMinutes %= 24 * 60;
               }
               hours = totalMinutes / 60 | 0;
               patternArray.push(hours);
               minutes = totalMinutes % 60;
               if (this._hasMaskPattern('I')){
                  patternArray.push(minutes);
               }
            }
            return patternArray;
         },
         /**
          * Получить Дни, Часы, минуты
          * @param pattern D - дни, H - часы, I - минуты
          */
         _getPatterns: function(pattern){
            var patternIndex = this._getIndexForPattern(pattern);
            return patternIndex > -1 ? parseInt(this._options.text.split(':')[patternIndex].replace(new RegExp('_','g'), "0")) : 0;
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

            this._options.text = text;
            this._options.interval = this._getIntervalByTotalMinutes();

            if (this._options.mask.length < (minLengthMask + minutesLengthMask) && text.split(':')[0].indexOf('_') == -1) {
               this._options.text = '_' + text;
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