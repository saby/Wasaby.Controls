
define(
   'js!SBIS3.CONTROLS.DatePicker',
   [
      'js!SBIS3.CONTROLS.FormattedTextBoxBase',
      'js!SBIS3.CONTROLS._PickerMixin',
      'html!SBIS3.CONTROLS.DatePicker',
      'js!SBIS3.CONTROLS.Calendar'
   ],
   function (FormattedTextBoxBase, _PickerMixin, dotTplFn) {

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

         // Клик по иконке календарика
         $('.js-controls-DatePicker__calendar', this.getContainer().get(0)).click(function(){
            self.togglePicker();

            if ( self._picker.isVisible() && self._date ){
               // Если пользователь ввел слишком большие данные ( напр., 45.23.7234 ), то значение возьмётся корректно,
               // ввиду особенностей работы setMonth(), setDate() и т.д., но нужно обновить поле
               self._drawDate();
               // Обновляем календарь в соответствии с хранимым значением даты
               $(self._picker.getContainer().get(0)).children().wsControl().setDate(self._date);
            }
         });

         // Если пользователь ввел слишком большие данные ( напр., 45.23.7234 ), то значение возьмётся корректно,
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
         this._picker.getContainer().empty();

         // Создаем пустой контейнер и добавляем его в пикер
         var element = $('<div></div>').attr('name', 'Calendar');
         this._picker.getContainer().append(element);

         // Преобразуем контейнер в контролл Calendar
         require(["js!SBIS3.CONTROLS.Calendar"], function (r) {
            new r({
               element : element
            })
         });

         var
            self = this,
            // Получаем контролл Calendar с помощью wsControl()
            calendarControl = element.wsControl();

         // Нажатие на календарный день в пикере устанавливает дату
         calendarControl.subscribe('onDatePick', function(eventObject, date){
            self.setDate(date);
            //self.hidePicker();
         });
      },

      /**
       * Получить маску. Переопределённый метод
       */
      _getMask: function () {
         return this._options.mask;
      },

      /**
       * Проверить, является ли маска допустимой ( по массиву допустимы маск this._possibleMasks )
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
       * @param text дата в формате SQL ( например, 01-01-2015 )
       */
      setText: function (text) {
         // fromSQL() разбирает дату формата SQL в объект Date
         this._date = Date.fromSQL(text);
         this._drawDate();
         FormattedTextBoxBase.superclass.setText.call(this, text);
      },

      /**
       * Установить дату
       * @param date новое значение даты, объект типа Date
       */
      setDate: function (date) {
         if ( date instanceof Date ) {
            this._date = date;
            this._options.text = date.toSQL();
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
         var self = this,
            newText = '';
         var
            regexp = new RegExp('[' + self._controlCharacters + ']+', 'g'),
            availCharsArray = self._primalMask.match(regexp);

         for ( var i = 0; i < availCharsArray.length; i++ ){
            switch ( availCharsArray[i] ){
               case 'YY'   : newText += ( ''+this._date.getFullYear() ).slice(-2);    break;
               case 'YYYY' : newText += this._date.getFullYear();                     break;
               case 'MM'   : newText += ( '0'+(this._date.getMonth()+1) ).slice(-2);  break;
               case 'DD'   : newText += ( '0'+this._date.getDate() ).slice(-2);       break;
            }
         }
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
                     date.setMonth(text.substr(0, 2)-1);
                     text = text.substr(2);
                     break;
                  case 'DD' :
                     date.setDate(text.substr(0, 2));
                     text = text.substr(2);
                     break;
               }
            }

            this._date = date;
            this._options.text = date.toSQL();
         }
      }
   });

   return DatePicker;
});