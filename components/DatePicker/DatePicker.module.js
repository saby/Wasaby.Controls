/**
 * TODO Компонент пока тестировался только в Chrome
 */
define(
   'js!SBIS3.CONTROLS.DatePicker',
   [
      'js!SBIS3.CONTROLS.FormattedTextBoxBase',
      'js!SBIS3.CONTROLS._PickerMixin',
      'js!SBIS3.CONTROLS.Calendar',
      'html!SBIS3.CONTROLS.DatePicker'
   ],
   function (FormattedTextBoxBase, _PickerMixin, Calendar, dotTplFn) {

   'use strict';

   /**
    * Можно вводить только значения особого формата даты.
    * @class SBIS3.CONTROLS.DatePicker
    * @extends SBIS3.CONTROLS.FormattedTextBoxBase
    */

   var DatePicker = FormattedTextBoxBase.extend( [_PickerMixin], /** @lends SBIS3.CONTROLS.DatePicker.prototype */{
      $protected: {
         _dotTplFn: dotTplFn,
         /**
          * Допустимые управляющие символы в маске.
          * Условные обозначения:
          *     1. D(day) -  Календарный день
          *     2. M(month) - Месяц
          *     3. Y(year) - Год
          *     4. H(hour) - Час
          *     5. I - Минута
          *     6. S(second) - Секунда
          *     7. U - Доля секунды
          */
         _controlCharactersSet: {
            'D' : 'd',
            'M' : 'd',
            'Y' : 'd',
            'H' : 'd',
            'I' : 'd',
            'S' : 'd',
            'U' : 'd'
         },
         /**
          * Допустимые при создании контролла маски.
          */
         _possibleMasks: [
            // I. Маски для отображения даты:
            'DD.MM.YYYY',
            'DD.MM.YY',
            'DD.MM',
            'YYYY-MM-DD',
            'YY-MM-DD',
            // II. Маски для отображения времени:
            'HH:II:SS.UUU',
            'HH:II:SS',
            'HH:II',
            // III. Маски для комбинированного отображения даты и времени:
            'DD.MM.YYYY HH:II:SS.UUU',
            'DD.MM.YYYY HH:II:SS',
            'DD.MM.YYYY HH:II',
            'DD.MM.YY HH:II:SS.UUU',
            'DD.MM.YY HH:II:SS',
            'DD.MM.YY HH:II',
            'DD.MM HH:II:SS.UUU',
            'DD.MM HH:II:SS',
            'DD.MM HH:II',
            'YYYY-MM-DD HH:II:SS.UUU',
            'YYYY-MM-DD HH:II:SS',
            'YYYY-MM-DD HH:II',
            'YY-MM-DD HH:II:SS.UUU',
            'YY-MM-DD HH:II:SS',
            'YY-MM-DD HH:II',
            // IV. Маски для месяца и года:
            'YYYY',
            'MM/YYYY'
         ],
         /**
          * Контролл Calendar в пикере
          */
         _calendarControl: undefined,
         /**
          * Опции создаваемого контролла
          */
         _options: {
            /**
             * @cfg {String} Формат отображения даты, на базе которой будет создана html-разметка и в соответствии с которой
             * будет определён весь функционал. Должна представлять собой одну из масок в массиве допустимых маск.
             * <wiTag group="Отображение" page=1>
             * @variant 'DD.MM.YYYY',
             * @variant 'DD.MM.YY',
             * @variant 'DD.MM',
             * @variant 'YYYY-MM-DD',
             * @variant 'YY-MM-DD',
             * @variant 'HH:II:SS.UUU',
             * @variant 'HH:II:SS',
             * @variant 'HH:II',
             * @variant 'DD.MM.YYYY HH:II:SS.UUU',
             * @variant 'DD.MM.YYYY HH:II:SS',
             * @variant 'DD.MM.YYYY HH:II',
             * @variant 'DD.MM.YY HH:II:SS.UUU',
             * @variant 'DD.MM.YY HH:II:SS',
             * @variant 'DD.MM.YY HH:II',
             * @variant 'DD.MM HH:II:SS.UUU',
             * @variant 'DD.MM HH:II:SS',
             * @variant 'DD.MM HH:II',
             * @variant 'YYYY-MM-DD HH:II:SS.UUU',
             * @variant 'YYYY-MM-DD HH:II:SS',
             * @variant 'YYYY-MM-DD HH:II',
             * @variant 'YY-MM-DD HH:II:SS.UUU',
             * @variant 'YY-MM-DD HH:II:SS',
             * @variant 'YY-MM-DD HH:II',
             * @variant 'YYYY',
             * @variant 'MM/YYYY'
             */
            mask: 'DD.MM.YY',
            /**
             * Дата
             */
            date: null,
            /**
             * Показана ли иконка календарика. По умолчанию -- true. Если маска представляет собой только время,
             * то автоматически (точнее в методе _checkTypeOfMask ) становится false.
             */
            isCalendarIconShown: true
         }
      },

      $constructor: function () {
         var self = this;

         this._publish('onDateChange');

         // Проверяем, является ли маска, с которой создается контролл, допустимой
         this._checkPossibleMask();
         // Проверить тип маски -- дата, время или и дата, и время. В случае времени -- сделать isCalendarIconShown = false
         this._checkTypeOfMask();

         // Первоначальная установка даты, если передана опция
         if ( this._options.date ) {
            this._setDate( this._options.date );
         }

         if ( self._options.isCalendarIconShown ) {
            // Клик по иконке календарика
            $('.js-controls-DatePicker__calendarIcon', this.getContainer().get(0)).click(function(){
               self.togglePicker();

               // Если календарь открыт данным кликом - обновляем календарь в соответствии с хранимым значением даты
               if ( self._picker.isVisible() && self._options.date ){
                  self._calendarControl._setDate(self._options.date);
               }
            });
         }
         else {
            $('.js-controls-DatePicker__calendarIcon', this.getContainer().get(0)).parent().addClass('ws-hidden');
         }

         // Потеря фокуса. Работает так же при клике по иконке календарика.
         // Если пользователь ввел слишком большие данные ( напр., 45.23.7234 ), то значение установится корректно,
         // ввиду особенностей работы setMonth(), setDate() и т.д., но нужно обновить поле
         $('.js-controls-FormattedTextBox__field', this.getContainer().get(0)).blur(function(){
            if ( self._options.date ){ self._drawDate(); }
         });
      },

      /**
       * Получить маску. Переопределённый метод
       */
      _getMask: function () {
         return this._options.mask;
      },

      /**
       * Определение контента пикера. Переопределённый метод
       * @private
       */
      _setPickerContent: function() {
         var self = this;

         this._picker.getContainer().empty();
         // Создаем пустой контейнер
         var element = $('<div name= "Calendar" class="controls-DatePicker__calendar"></div>');
         // Преобразуем контейнер в контролл Calendar и запоминаем
         self._calendarControl = new Calendar({
            parent: self._picker,
            element : element
         });

         // Добавляем в пикер
         this._picker.getContainer().append(element);

         // Нажатие на календарный день в пикере устанавливает дату
         this._calendarControl.subscribe('onDateChange', function(eventObject, date){
            self.setDate(date);
            self.hidePicker();
         });
      },

      /**
       * Проверить, является ли маска допустимой ( по массиву допустимых маск this._possibleMasks )
       * @private
       */
      _checkPossibleMask: function(){
         if ( Array.indexOf(this._possibleMasks, this._options.mask) == -1 ){
            throw new Error('Маска не удовлетворяет ни одной допустимой маске данного контролла');
         }
      },

      /**
       * Проверить тип даты. Скрыть иконку календаря, если
       *    1. Отсутствуют день, месяц и год (т.е. присутствует только время)
       *    2. Присутствует день и месяц, но отсутствует год
       * @private
       */
      _checkTypeOfMask: function () {
         if ( !/[DMY]/.test(this._options.mask) || ( /[DMY]/.test(this._options.mask) && !/Y/.test(this._options.mask) )
               || ( /[DMY]/.test(this._options.mask) && !/D/.test(this._options.mask) ) ){
            this._options.isCalendarIconShown = false;
         }
      },

      /**
      * В добавление к проверкам и обновлению опции text, необходимо обновить поле _date
      * @param text
      * @private
      */
      setText: function ( text ) {
         text = text ? text: '';
         DatePicker.superclass.setText.call( this, text );
         this._options.date = text == '' ? null : this._getDateByText( text );
         this._notify('onDateChange', this._options.date);
      },

      /**
       * Установить дату. Публичный метод. Отличается от приватного метода тем, что генерирует событие.
       * @param date
       */
      setDate: function ( date ) {
         this._setDate( date );
         this._notify('onDateChange', this._options.date);
      },

      /**
       * Установить дату. Приватный метод
       * @param date новое значение даты, объект типа Date
       */
      _setDate: function ( date ) {
         if ( date instanceof Date ) {
            this._options.date = date;
            this._options.text = this._getTextByDate( date );
         }
         else {
            this._options.date = null;
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
            this.setDate(value);
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
       * @returns {Date|*|SBIS3.CONTROLS.DatePicker._options.date}
       */
      getDate: function(){
        return this._options.date;
      },

      /**
      * Обновить поле даты по текущему значению даты в this._options.date
      * @private
      */
      _drawDate: function(){
         var newText = this._options.date == null ? '' : this._getTextByDate( this._options.date );
         this._inputField.html( this._getHtmlMask(newText) );
      },

      /**
       * Обновляяет значения this._options.text и this._options.date (вызывается в _replaceCharacter из FormattedTextBoxBase). Переопределённый метод.
       * Если есть хотя бы одно незаполненное место ( плэйсхолдер ), то text = '' (пустая строка) и _date = null
       * @private
       */
      _updateText: function(){
         var text = $(this._inputField.get(0)).text();

         // Запоминаем старую дату для последующего сравнения и генерации события
         var oldDate = this._options.date;

         var expr = new RegExp('(' + this._placeholder + ')', 'ig');
         // если есть плейсхолдеры (т.е. незаполненные места), то значит опция text = null
         if ( expr.test(text) ) {
            this._options.text = '';
            this._options.date = null;
         }
         else {
            this._options.date = this._getDateByText(text);
            this._options.text = this._getTextByDate(this._options.date);
         }

         // Если дата изменилась -- генерировать событие.
         // Если использовать просто setDate, то событие будет генерироваться даже если дата введена с клавиатуры не полностью, что неверно
         if ( oldDate !== this._options.date ) {
            this._notify('onDateChange', this._options.date);
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
               case 'YY' :
                  date.setYear('20' + text.substr(0, 2));
                  text = text.substr(3);  // отрезаем на один символ больше -- это разделяющий символ
                  break;
               case 'YYYY' :
                  date.setYear(text.substr(0, 4));
                  text = text.substr(5);  // отрезаем на один символ больше -- это разделяющий символ
                  break;
               case 'MM' :
                  date.setMonth(text.substr(0, 2) - 1);
                  text = text.substr(3);  // отрезаем на один символ больше -- это разделяющий символ
                  break;
               case 'DD' :
                  date.setDate(text.substr(0, 2));
                  text = text.substr(3);  // отрезаем на один символ больше -- это разделяющий символ
                  break;
               case 'HH' :
                  date.setHours(text.substr(0, 2));
                  text = text.substr(3);  // отрезаем на один символ больше -- это разделяющий символ
                  break;
               case 'II' :
                  date.setMinutes(text.substr(0, 2));
                  text = text.substr(3);  // отрезаем на один символ больше -- это разделяющий символ
                  break;
               case 'SS' :
                  date.setSeconds(text.substr(0, 2));
                  text = text.substr(3);  // отрезаем на один символ больше -- это разделяющий символ
                  break;
               case 'UUU' :
                  date.setMilliseconds(text.substr(0, 3));
                  text = text.substr(4);  // отрезаем на один символ больше -- это разделяющий символ
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
               case 'YY'   : textObj.YY   = ( '000' + date.getFullYear() ).slice(-2);     break;
               case 'YYYY' : textObj.YYYY = ( '000' + date.getFullYear() ).slice(-4);     break;
               case 'MM'   : textObj.MM   = ( '0' + (date.getMonth() + 1) ).slice(-2);    break;
               case 'DD'   : textObj.DD   = ( '0' + date.getDate()).slice(-2);            break;
               case 'HH'   : textObj.HH   = ( '0' + date.getHours()).slice(-2);           break;
               case 'II'   : textObj.II   = ( '0' + date.getMinutes()).slice(-2);         break;
               case 'SS'   : textObj.SS   = ( '0' + date.getSeconds()).slice(-2);         break;
               case 'UUU'  : textObj.UUU  = ( '00' + date.getMilliseconds()).slice(-3);   break;
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

   return DatePicker;
});