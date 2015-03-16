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
               'DD:HH:II',
               "DD:HH",
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
               mask: '',
               /**
                * Дата
                */
               interval: null
            }
         },

         $constructor: function () {
            var self = this;

            this._publish('onChange');

            // Проверяем, является ли маска, с которой создается контролл, допустимой
            this._checkPossibleMask();

            // Первоначальная установка интервала, если передана опция
            if (this._options.interval ) {
               this._setInterval( this._options.interval );
            }

         },
         _setEnabled : function(enabled) {
            DateInterval.superclass._setEnabled.call(this, enabled);
         },

         /**
          * Получить маску. Переопределённый метод
          */
         _getMask: function () {
            return this._options.mask;
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
            this._options.interval = text == '' ? null : this._getDateByText( text );
            this._notify('onChange', this._options.interval);
         },

         /**
          * Установить дату. Публичный метод. Отличается от приватного метода тем, что генерирует событие.
          * @param date
          */
         setInterval: function ( date ) {
            this._setInterval( date );
            this._notify('onChange', this._options.interval);
         },

         /**
          * Установить дату. Приватный метод
          * @param interval новое значение интервала, объект типа Date
          */
         _setInterval: function ( interval ) {
            if ( true ) {
               this._options.interval = interval;
               this._options.text = this._getTextByDate( interval );
            }
            else {
               this._options.interval = null;
               this._options.text = '';
            }

            this._drawDate();
         },

         /**
          * Переопределенный метод из TextBoxBase
          * @param value
          */
         setValue: function ( value ) {
            value = value ? value : '';

            if ( value instanceof Date ) {
               this.setInterval(value);
            }
            else if ( typeof value == 'string' ) {
               this.setText(value);
            }
            else {
               throw new Error('Аргументом должна являться строка или дата');
            }
         },

         /**
          * Получить дату
          * @returns {Date|*|SBIS3.CONTROLS.DateInterval._options.interval}
          */
         getInterval: function(){
            return this._options.interval;
         },

         /**
          * Обновить поле даты по текущему значению даты в this._options.interval
          * @private
          */
         _drawDate: function(){
            var newText = this._options.interval == null ? '' : this._getTextByDate( this._options.interval );
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
               this._options.interval = this._getDateByText(text);
               this._options.text = this._getTextByDate(this._options.interval);
            }

            // Если дата изменилась -- генерировать событие.
            // Если использовать просто setInterval, то событие будет генерироваться даже если дата введена с клавиатуры не полностью, что неверно
            if ( oldDate !== this._options.interval ) {
               this._notify('onChange', this._options.interval);
            }
         },

         /**
          * Получить дату в формате Date по строке
          * @param text - дата в соответствии с маской
          * @returns {Date} Дата в формата Date
          * @private
          */
         _getDateByText: function(text) {
            var date = new Date();
            var
               regexp = new RegExp('[' + this._controlCharacters + ']+', 'g'),
               availCharsArray = this._primalMask.match(regexp);

            for (var i = 0; i < availCharsArray.length; i++) {
               switch ( availCharsArray[i] ) {
                  case 'DD' :
                     text = text.substr(3);  // отрезаем на один символ больше -- это разделяющий символ
                     break;
                  case 'HH' :
                     text = text.substr(3);  // отрезаем на один символ больше -- это разделяющий символ
                     break;
                  case 'II' :
                     text = text.substr(3);  // отрезаем на один символ больше -- это разделяющий символ
                     break;
               }
            }
            return date;
         },

         /**
          * Получить дату в формате строки по объекту Date. Строка соответсвует изначальной маске.
          * Пример: если дата Wed Oct 25 2102 00:00:00 GMT+0400 и изначальная маска DD.MM.YYYY, то строка будет 25.10.2102
          * @param date Дата
          * @returns {string} Строка
          * @private
          */
         _getTextByDate: function( date ) {
            var
               textObj = {},
               regexp = new RegExp('[' + this._controlCharacters + ']+', 'g'),
               availCharsArray = this._primalMask.match(regexp);

            for ( var i = 0; i < availCharsArray.length; i++ ){
               switch ( availCharsArray[i] ){
                  case 'DD'   : textObj.DD   = ( '0' + date.getDate()).slice(-2);            break;
                  case 'HH'   : textObj.HH   = ( '0' + date.getHours()).slice(-2);           break;
                  case 'II'   : textObj.II   = ( '0' + date.getMinutes()).slice(-2);         break;
               }
            }
            var text = this._primalMask;

            for (var i in textObj) {
               if (textObj.hasOwnProperty(i)) {
                  text = text.replace(i, textObj[i])
               }
            }

            return text;
         }
      });

      return DateInterval;
   });