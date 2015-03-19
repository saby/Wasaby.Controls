/**
 * TODO Компонент пока тестировался только в Chrome
 */
define(
   'js!SBIS3.CONTROLS.DateInterval',
   [
      'js!SBIS3.CONTROLS.FormattedTextBoxBase',
      'js!SBIS3.CONTROLS.PickerMixin',
      'js!SBIS3.CONTROLS.Calendar',
      'html!SBIS3.CONTROLS.DateInterval'
   ],
   function (FormattedTextBoxBase, PickerMixin, Calendar, dotTplFn) {

      'use strict';

      /**
       * Можно вводить только значения особого формата даты.
       * @class SBIS3.CONTROLS.DateInterval
       * @extends SBIS3.CONTROLS.FormattedTextBoxBase
       */

      var DateInterval = FormattedTextBoxBase.extend( [PickerMixin], /** @lends SBIS3.CONTROLS.DateInterval.prototype */{
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
               'DDD:HH:II',
               'DD:HH:II',
               "DDD:HH",
               "DD:HH",
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
            this._options.mask = mask;
            //TODO нужно доработать, не всегда правильно работает
            this._primalMask = mask;
            this._clearMask = this._getClearMask();
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
          * В добавление к проверкам и обновлению опции text, необходимо обновить поле _date
          * @param text
          * @private
          */
         setText: function ( text ) {
            text = text ? text: '';
            DateInterval.superclass.setText.call( this, text );
            this._options.interval = text == '' ? null : this._getIntervalByText( text );
            this._notify('onChangeInterval', this._options.interval);
         },

         /**
          * Установить дату. Публичный метод. Отличается от приватного метода тем, что генерирует событие.
          * @param interval
          */
         setInterval: function ( interval ) {
            this._setInterval( interval );
            this._notify('onChangeInterval', this._options.interval);
         },

         /**
          * Установить интервал. Приватный метод
          * @param interval новое значение интервала, объект типа Date
          */
         _setInterval: function (interval) {
            this._options.interval = interval;
            this._options.text = this._getTextByInterval(interval);
            this._drawDate();
         },
         /**
          * Получить дату
          * @returns {Date|*|SBIS3.CONTROLS.DateInterval._options.interval}
          */
         getInterval: function(){
            return this._options.interval;
         },

         _getIntervalByText: function(text){
            var regexp = new RegExp('[' + this._controlCharacters + ']+', 'g'),
               availCharsArray = this._options.mask.match(regexp),
               interval = '';

            for (var i = 0; i < availCharsArray.length; i++) {
               switch ( availCharsArray[i] ) {
                  case 'DDD' :
                     interval = "P" + text.substr(0, 3) + "D";
                     text = text.substr(4);  // отрезаем на один символ больше -- это разделяющий символ
                     break;
                  case 'DD' :
                     interval += "P" + text.substr(0, 2) + "D";
                     text = text.substr(3);  // отрезаем на один символ больше -- это разделяющий символ
                     break;
                  case 'HHH' :
                     interval += "T" + text.substr(0, 3) + "H";
                     text = text.substr(4);  // отрезаем на один символ больше -- это разделяющий символ
                     break;
                  case 'HH' :
                     interval += "T" + text.substr(0, 2) + "H";
                     text = text.substr(3);  // отрезаем на один символ больше -- это разделяющий символ
                     break;
                  case 'II' :
                     interval += text.substr(0, 2) + "M";
                     text = text.substr(3);  // отрезаем на один символ больше -- это разделяющий символ
                     break;
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
                        if (availCharsArray.indexOf('DDD') > -1)
                           textObj['DDD'] =  ('__' + num).slice(-3);
                        else if(availCharsArray.indexOf('DD') > -1)
                           textObj['DD'] =  ('0' + num).slice(-2);
                        break;
                     case 'H' :
                        if (availCharsArray.indexOf('HHH') > -1)
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
          * Обновляяет значения this._options.text и this._options.interval (вызывается в _replaceCharacter из FormattedTextBoxBase). Переопределённый метод.
          * Если есть хотя бы одно незаполненное место ( плэйсхолдер ), то text = '' (пустая строка) и _date = null
          * @private
          */
         _updateText: function(){
            var text = $(this._inputField.get(0)).text();
            // Запоминаем старую дату для последующего сравнения и генерации события
            var oldDate = this._options.interval;

            var expr = new RegExp('(' + this._placeholder + ')', 'ig');
            // если есть плейсхолдеры (т.е. незаполненные места), то значит опция text = null
            if ( expr.test(text) ) {
               this._options.text = '';
               this._options.interval = null;
            }
            else {
               this._options.interval = this._getIntervalByText(text);
               this._options.text = this._getTextByInterval(this._options.interval);
            }

            // Если дата изменилась -- генерировать событие.
            // Если использовать просто setInterval, то событие будет генерироваться даже если дата введена с клавиатуры не полностью, что неверно
            if ( oldDate !== this._options.interval ) {
               this._notify('onChangeInterval', this._options.interval);
            }
         }
      });

      return DateInterval;
   });