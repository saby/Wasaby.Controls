/**
 * TODO Компонент пока тестировался только в Chrome
 */
define(
   'js!SBIS3.CONTROLS.DatePicker',
   [
      'js!SBIS3.CONTROLS.FormattedTextBoxBase',
      'js!SBIS3.CONTROLS.PickerMixin',
      'js!SBIS3.CONTROLS.Utils.DateUtil',
      'js!SBIS3.CONTROLS.Calendar',
      'html!SBIS3.CONTROLS.DatePicker'
   ],
   function (FormattedTextBoxBase, PickerMixin, DateUtil, Calendar, dotTplFn) {

   'use strict';

   /**
    * Поле ввода даты/времени.
    * Данный контрол предназначен для осуществления ввода информации о дате и времени.
    * В зависимости от {@link mask маски} возвожен ввод:
    * <ol>
    *    <li>только даты,</li>
    *    <li>только времени,</li>
    *    <li>даты и времени.</li>
    * </ol>
    * Осуществить ввод информации можно как с клавиатуры, так и выбором на календаре, который открывается кликом по соответствующей иконке.
    * Можно вводить только значения особого формата даты.
    * @class SBIS3.CONTROLS.DatePicker
    * @extends SBIS3.CONTROLS.FormattedTextBoxBase
    * @control
    * @author Крайнов Дмитрий Олегович
    * @public
    * @demo SBIS3.CONTROLS.Demo.MyDatePicker
    */

   var DatePicker = FormattedTextBoxBase.extend([PickerMixin], /** @lends SBIS3.CONTROLS.DatePicker.prototype */{
       /**
        * @event onDateChange
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
        * @example
        * <pre>
        *    var dateChangeFn = function(event) {
        *       if (this.getDate().getTime() < minDate.getTime()) {
        *          buttonSend.setEnabled(false);
        *          title.setText('Указана прошедшая дата: проверьте нет ли ошибки');
        *       }
        *    };
        *    datePicker.subscribe('onDateChange', dateChangeFn);
        * </pre>
        */
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
             * @cfg {String} Формат отображения данных
             * @remark
             * На базе формата, заданного в этой опции, будет создана html-разметка, в соответствии с которой
             * определяется весь функционал.
             * Необходимо выбрать одну из масок в массиве допустимых значений.
             * Допустимые символы в маске:
             * <ol>
             *    <li>D(day) - календарный день.</li>
             *    <li>M(month) - месяц.</li>
             *    <li>Y(year) - год.</li>
             *    <li>H(hour) - час.</li>
             *    <li>I - минута</li>
             *    <li>S(second) - секунда.</li>
             *    <li>U - доля секунды.</li>
             *    <li>".", "-", ":", "/" - разделители.</li>
             * </ol>
             * @example
             * <pre>
             *     <option name="mask">HH:II:SS.UUU</option>
             * </pre>
             * @variant 'DD.MM.YYYY'
             * @variant 'DD.MM.YY'
             * @variant 'DD.MM'
             * @variant 'YYYY-MM-DD'
             * @variant 'YY-MM-DD'
             * @variant 'HH:II:SS.UUU'
             * @variant 'HH:II:SS'
             * @variant 'HH:II'
             * @variant 'DD.MM.YYYY HH:II:SS.UUU'
             * @variant 'DD.MM.YYYY HH:II:SS'
             * @variant 'DD.MM.YYYY HH:II'
             * @variant 'DD.MM.YY HH:II:SS.UUU'
             * @variant 'DD.MM.YY HH:II:SS'
             * @variant 'DD.MM.YY HH:II'
             * @variant 'DD.MM HH:II:SS.UUU'
             * @variant 'DD.MM HH:II:SS'
             * @variant 'DD.MM HH:II'
             * @variant 'YYYY-MM-DD HH:II:SS.UUU'
             * @variant 'YYYY-MM-DD HH:II:SS'
             * @variant 'YYYY-MM-DD HH:II'
             * @variant 'YY-MM-DD HH:II:SS.UUU'
             * @variant 'YY-MM-DD HH:II:SS'
             * @variant 'YY-MM-DD HH:II'
             * @variant 'YYYY'
             * @variant 'MM/YYYY'
             * @see date
             * @see isCalendarIconShow
             */
            mask: 'DD.MM.YY',
            /**
             * @cfg {Date|String} Начальное значение даты, с которой откроется контрол.
             * @remark
             * Строка должна быть формата ISO 8601.
             * @example
             * <pre>
             *     <option name="date">2015-03-07T21:00:00.000Z</option>
             * </pre>
             * @see isCalendarIconShow
             * @see onDateChange
             * @see setDate
             * @see getDate
             */
            date: null,
            /**
             * @cfg {Boolean} Показана ли иконка календарика.
             * @remark
             * Если {@link mask маска} представляет собой только время, то автоматически иконка календарика прячется, т.е. значение
             * опции самостоятельно сменится на false.
             * @example
             * <pre>
             *     <option name="isCalendarIconShown">false</option>
             * </pre>
             * @see date
             * @see mask
             * @see setDate
             */
            isCalendarIconShown: true
         }
      },

      $constructor: function () {
         this._publish('onDateChange');

         // Проверить тип маски -- дата, время или и дата, и время. В случае времени -- сделать isCalendarIconShown = false
         this._checkTypeOfMask(this._options);

         // Первоначальная установка даты, если передана опция
         if ( this._options.date ) {
            this._setDate( this._options.date );
         }

         if (this._options.text  &&  !this._options.date) {
            this.setText(this._options.text);
         }

         this._calendarInit();

      },


      _modifyOptions : function(options) {
         this._checkTypeOfMask(options);
         return DatePicker.superclass._modifyOptions.apply(this, arguments);
      },
      /**
       * Инициализация календарика
       */
      _calendarInit: function() {
         var self = this;
         this._calendarIcon = $('.js-controls-DatePicker__calendarIcon', this.getContainer().get(0));
         if (self._options.isCalendarIconShown) {
            // Клик по иконке календарика
            this._calendarIcon.click(function() {
               if (self.isEnabled()) {
                  self.togglePicker();

                  // Если календарь открыт данным кликом - обновляем календарь в соответствии с хранимым значением даты
                  if (self._picker.isVisible() && self._options.date){
                     self._calendarControl._setDate(self._options.date);
                  }
               }
            });
         } else {
            this._calendarIcon.parent().addClass('ws-hidden');
         }

         // Потеря фокуса. Работает так же при клике по иконке календарика.
         // Если пользователь ввел слишком большие данные ( напр., 45.23.7234 ), то значение установится корректно,
         // ввиду особенностей работы setMonth(), setDate() и т.д., но нужно обновить поле
         $('.js-controls-FormattedTextBox__field', this.getContainer().get(0)).blur(function(){
            if (self._options.date) {
               self._drawDate();
            }
         });
      },

      _setEnabled : function(enabled) {
         DatePicker.superclass._setEnabled.call(this, enabled);
         if (this._options.isCalendarIconShown) {
            this._calendarIcon.toggleClass('calendar-disabled', !enabled);
         }
         if (this._picker && this._picker.isVisible()){
            this.hidePicker();
         }
      },

      /**
       * Определение контента пикера. Переопределённый метод
       * @private
       */
      _setPickerContent: function() {
         var self = this,
            // Создаем пустой контейнер
            element = $('<div name= "Calendar" class="controls-DatePicker__calendar"></div>');

         this._picker.getContainer().empty();
         // Преобразуем контейнер в контролл Calendar и запоминаем
         self._calendarControl = new Calendar({
            parent: self._picker,
            element: element
         });

         // Добавляем в пикер
         this._picker.getContainer().append(element);

         // Нажатие на календарный день в пикере устанавливает дату
         this._calendarControl.subscribe('onDateChange', function(eventObject, date) {
            self.setDate(date);
            self.hidePicker();
         });
      },

      /**
       * Проверить тип даты. Скрыть иконку календаря, если
       *    1. Отсутствуют день, месяц и год (т.е. присутствует только время)
       *    2. Присутствует день и месяц, но отсутствует год
       * @private
       */
      _checkTypeOfMask: function (options) {
         if ( !/[DMY]/.test(options.mask) || ( /[DMY]/.test(options.mask) && !/Y/.test(options.mask) ) ||
            ( /[DMY]/.test(options.mask) && !/D/.test(options.mask) ) ){
            options.isCalendarIconShown = false;
         }
      },

     /**
      * В добавление к проверкам и обновлению опции text, необходимо обновить поле _date
      * @param text
      * @private
      */
      setText: function (text) {
         DatePicker.superclass.setText.call(this, text);
         this._options.date = text == '' ? null : this._getDateByText(text);
         this._notify('onDateChange', this._options.date);
      },

      /**
       * Метод установки/замены даты.
       * @param {Date} date Новая дата.
       * @example
       * <pre>
       *    //Зададим март 2016
       *    var startDate = new Date(2016,02);
       *    datePicker.setDate(startDate);
       * </pre>
       * @see date
       * @see getDate
       * @see onDateChange
       * @see mask
       */
      setDate: function (date) {
         this._setDate(date);
         this._notify('onDateChange', this._options.date);
      },

      /**
       * Установить дату. Приватный метод
       * @param date новое значение даты, объект типа Date
       */
      _setDate: function (date) {
         var isCorrect = false;
         if (date instanceof Date) {
            this._options.date = date;
            this._options.text = this._getTextByDate(date);
            isCorrect = true;
         } else if (typeof date == 'string') {
            //convert ISO-date to Date
            this._options.date = DateUtil.dateFromIsoString(date);
            if (DateUtil.isValidDate(this._options.date)) {
               this._options.text = this._getTextByDate( this._options.date );
               isCorrect = true;
            }
         }
         if ( ! isCorrect) {
            this._options.date = null;
            this._options.text = '';
            throw new Error('DatePicker. Неверный формат даты');
         }

         this._drawDate();
      },

      setValue: function (value) {
         $ws.single.ioc.resolve('ILogger').log('DatePicker', 'метод "setValue" устарел. Используйте "setDate" или "setText".');
      },

      /**
       * Метод получения текущего значения даты.
       * @returns {Date|String} Начальное значение даты, с которой откроется контрол.
       * @example
       * <pre>
       *     var date = datePicker.getDate();
       *     textBox.setText(date);
       * </pre>
       * @see date
       * @see setDate
       * @see onDateChange
       */
      getDate: function() {
        return this._options.date;
      },

      /**
       * Получить маску. Переопределённый метод
       */
      _getMask: function () {
         return this._options.mask;
      },

      /**
      * Обновить поле даты по текущему значению даты в this._options.date
      * @private
      */
      _drawDate: function(){
         var newText = this._options.date == null ? '' : this._getTextByDate( this._options.date );
         //записываем текст в модель
         this.formatModel.setText(newText);
         this._inputField.html( this._getHtmlMask() );
      },

      /**
       * Обновляяет значения this._options.text и this._options.date (вызывается в _replaceCharacter из FormattedTextBoxBase). Переопределённый метод.
       * Если есть хотя бы одно незаполненное место ( плэйсхолдер ), то text = '' (пустая строка) и _date = null
       * @private
       */
      _updateText: function() {
         var text = $(this._inputField.get(0)).text();

         // Запоминаем старую дату для последующего сравнения и генерации события
         var oldDate = this._options.date;

         var expr = new RegExp('(' + this._maskReplacer + ')', 'ig');
         // если есть плейсхолдеры (т.е. незаполненные места), то значит опция text = null
         if (expr.test(text)) {
            this._options.text = '';
            this._options.date = null;
         }
         else {
            this._options.date = this._getDateByText(text);
            this._options.text = this._getTextByDate(this._options.date);
         }

         // Если дата изменилась -- генерировать событие.
         // Если использовать просто setDate, то событие будет генерироваться даже если дата введена с клавиатуры не полностью, что неверно
         if (oldDate !== this._options.date) {
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
         var
            date = new Date(),
            item,
            value;
         for (var i = 0; i < this.formatModel.model.length; i++) {
            item = this.formatModel.model[i];
            if ( !item.isGroup) {
               continue;
            }
            value = '';
            for (var j = 0; j < item.mask.length; j++) {
               value += (typeof item.value[j] === "undefined") ? this._maskReplacer : item.value[j];
            }
            switch (item.mask) {
               case 'YY' :
                  date.setYear('20' + value);
                  break;
               case 'YYYY' :
                  date.setYear(value);
                  break;
               case 'MM' :
                  date.setMonth(value - 1);
                  break;
               case 'DD' :
                  date.setDate(value);
                  break;
               case 'HH' :
                  date.setHours(value);
                  break;
               case 'II' :
                  date.setMinutes(value);
                  break;
               case 'SS' :
                  date.setSeconds(value);
                  break;
               case 'UUU' :
                  date.setMilliseconds(value);
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
            text = '',
            item;

         for (var i = 0; i < this.formatModel.model.length; i++) {
            item = this.formatModel.model[i];
            if (item.isGroup) {
               switch ( item.mask ){
                  case 'YY'   : text += ( '000' + date.getFullYear() ).slice(-2);     break;
                  case 'YYYY' : text += ( '000' + date.getFullYear() ).slice(-4);     break;
                  case 'MM'   : text += ( '0'   + (date.getMonth() + 1) ).slice(-2);  break;
                  case 'DD'   : text += ( '0'   + date.getDate()).slice(-2);          break;
                  case 'HH'   : text += ( '0'   + date.getHours()).slice(-2);         break;
                  case 'II'   : text += ( '0'   + date.getMinutes()).slice(-2);       break;
                  case 'SS'   : text += ( '0'   + date.getSeconds()).slice(-2);       break;
                  case 'UUU'  : text += ( '00'  + date.getMilliseconds()).slice(-3);  break;
               }
            } else {
               text += item.innerMask;
            }
         }

         return text;
      }
   });

   return DatePicker;
});