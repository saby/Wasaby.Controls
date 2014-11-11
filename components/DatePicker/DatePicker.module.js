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
          * I. Маски для отображения даты:
          *     1. DD.MM.YYYY
          *     2. DD.MM
          *     3. DD.MM.YY
          *     4. YY-MM-DD
          *     5. YYYY-MM-DD
          */
         _possibleMasks: [
            'DD.MM.YY',
            'DD.MM.YYYY',
            'DD.MM',
            'YY-MM-DD',
            'YYYY-MM-DD'
         ],
         /**
          * Дата
          */
         _date: undefined,
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
             * будет определён весь функционал
             * <wiTag group="Отображение" page=1>
             * @variant 'DD.MM.YY'
             * @variant 'DD.MM.YYYY'
             * @variant 'DD.MM'
             * @variant 'YY-MM-DD'
             * @variant 'YYYY-MM-DD'
             */
            mask: 'DD.MM.YY'
         }
      },

      $constructor: function () {
         var self = this;

         this._publish('onChange');

         // Проверяем, является ли маска, с которой создается контролл, допустимой
         this._checkPossibleMask();

         // Клик по иконке календарика
         $('.js-controls-DatePicker__calendarIcon', this.getContainer().get(0)).click(function(){
            self.togglePicker();

            // Если календарь открыт данным кликом - обновляем календарь в соответствии с хранимым значением даты
            if ( self._picker.isVisible() && self._date ){
               self._calendarControl.setDate(self._date);
            }
         });

         // Потеря фокуса. Работает так же при клике по иконке календарика.
         // Если пользователь ввел слишком большие данные ( напр., 45.23.7234 ), то значение установится корректно,
         // ввиду особенностей работы setMonth(), setDate() и т.д., но нужно обновить поле
         $('.controls-DatePicker__field', this.getContainer().get(0)).blur(function(){
            if ( self._date ){ self._drawDate(); }
         });
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
         this._calendarControl.subscribe('onSelect', function(eventObject, date){
            self.setDate(date);
            self._notify('onChange',date);
            self.hidePicker();
         });
      },

      /**
       * Проверить, является ли маска допустимой ( по массиву допустимых маск this._possibleMasks )
       * @private
       */
      _checkPossibleMask: function(){
         if ( this._possibleMasks.length !== 0 ){
            if ( Array.indexOf(this._possibleMasks, this._options.mask) == -1 ){
               throw new Error('Маска не удовлетворяет ни одной допустимой маске данного контролла');
            }
         }
      },

      /**
      * Переопределяем метод из TextBoxBase
      * @param text дата в формате строки, соотвествующая маске. Пример: если маска 'DD.MM.YYYY', то строка '25.10.2014'
      */
      setText: function ( text ) {
         //получаем текст без разделителей
         var formattedText = text.replace(/[^0-9]/g, '');
         this._date = this._getDateByText( formattedText );
         DatePicker.superclass.setText.call(this, this._getTextByDate(this._date));
      },

      /**
       * Установить дату
       * @param date новое значение даты, объект типа Date
       */
      setDate: function (date) {
         if ( date instanceof Date ) {
            this._date = date;
            this._options.text = this._getTextByDate(this._date);
            this._drawDate();
         }
      },

      /**
       * Получить дату
       * @returns {Date|*|SBIS3.CONTROLS.DatePicker._date}
       */
      getDate: function(){
        return this._date;
      },

      /**
      * Обновить поле даты по текущему значению даты в this._date
      * @private
      */
      _drawDate:function(){
         var newText = this._getTextByDate( this._date );
         this._inputField.html( this._getHtmlMask(newText) );
      },

      /**
       * Обновляяет значения this._options.text и this._date (вызывается в _replaceCharacter из FormattedTextBoxBase). Переопределённый метод.
       * Если есть хотя бы одно незаполненное место ( плэйсхолдер ), то text = null и _date остается той же
       * @private
       */
      _updateText:function(){
         var text = '';
         $('.controls-FormattedTextBox__field-placeholder', this.getContainer()).each(function () {
            text += $(this).text();
         });

         var expr = new RegExp('(' + this._placeholder + ')', 'ig');
         // если есть плейсхолдеры (т.е. незаполненные места), то значит опция text = null
         if ( expr.test(text) ) {
            this._options.text = null;
         }
         else {
            this._date = this._getDateByText(text);
            this._options.text = this._getTextByDate(this._date);
         }
      },

      /**
       * Получить дату в формате Date по строке
       * @param text - дата без разделителей
       * @returns {Date} Дата в формата Date
       * @private
       */
      _getDateByText : function(text) {
         var date = new Date();
         var
            regexp = new RegExp('[' + this._controlCharacters + ']+', 'g'),
            availCharsArray = this._primalMask.match(regexp);

         for (var i = 0; i < availCharsArray.length; i++) {
            switch (availCharsArray[i]) {
               case 'YY' :
                  date.setYear('20' + text.substr(0, 2));
                  text = text.substr(2);
                  break;
               case 'YYYY' :
                  date.setYear(text.substr(0, 4));
                  text = text.substr(4);
                  break;
               case 'MM' :
                  date.setMonth(text.substr(0, 2) - 1);
                  text = text.substr(2);
                  break;
               case 'DD' :
                  date.setDate(text.substr(0, 2));
                  text = text.substr(2);
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
      _getTextByDate : function(date) {
         var
            textObj = {},
            regexp = new RegExp('[' + this._controlCharacters + ']+', 'g'),
            availCharsArray = this._primalMask.match(regexp);

         for ( var i = 0; i < availCharsArray.length; i++ ){
            switch ( availCharsArray[i] ){
               case 'YY'   : textObj.YY = ( ''+date.getFullYear() ).slice(-2);    break;
               case 'YYYY' : textObj.YYYY = date.getFullYear();                     break;
               case 'MM'   : textObj.MM = ( '0'+(date.getMonth()+1)).slice(-2);  break;
               case 'DD'   : textObj.DD = ( '0'+date.getDate()).slice(-2);       break;
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