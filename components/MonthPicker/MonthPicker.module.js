/**
 * @author io.frolenko
 * Created on 03.10.2014.
 * TODO этот компонент пока что тестировался только в Chrome
 */

define(
   'js!SBIS3.CONTROLS.MonthPicker',
   [
      'js!SBIS3.CORE.Control',
      'js!SBIS3.CONTROLS._PickerMixin',
      'html!SBIS3.CONTROLS.MonthPicker/resources/MonthPickerDropdown',
      'html!SBIS3.CONTROLS.MonthPicker'
   ],
   function(Control, _PickerMixin, DropdownTpl, dotTplFn){

   'use strict';

   /**
    * Контрол выбор месяца и года, или только года, с выпадающей вниз панелью.
    * Не наследуется от поля ввода, потому что там в принципе не требуется текстовый ввод
    * @class SBIS3.CONTROLS.MonthPicker
    * @extends $ws.proto.Control
    * @mixes SBIS3.CONTROLS._PickerMixin
    */

   var MonthPicker = Control.Control.extend( [_PickerMixin], /** @lends SBIS3.CONTROLS.MonthPicker.prototype */{
      _dropdownTpl: DropdownTpl,
      _dotTplFn: dotTplFn,

      $protected: {
         _options: {
            /**
             * @typedef {Object} ModeEnum
             * @variant month только месяц
             * @variant year месяц и год
             */
            /**
             * @cfg {ModeEnum} ввод только месяца или месяца и года (month/year)
             */
            mode: 'month',
            /**
             * @cfg {String|Date} Значение для установки по умолчанию (в последствии в нем хранится текущее значение)
             * Строка должна быть формата [MM.]YYYY (месяц -- одна или две цифры, год -- от 1-ой до 4-х цифр)
             * В зависимости от режима работы, установленного в mode, возьмутся месяц и год, либо только год.
             */
            date: '',
            /**
             * @cfg {String} формат визуального отображения месяца
             * TODO на данный момент нигде не используется
             */
            monthFormat: ''
         },
         /**
          * Массив месяцев
          */
         _months: [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
         ],
         /**
          * Управляющие клавиши
          */
         _KEYS: {
            ARROW_LEFT: 37,
            ARROW_RIGHT: 39
         },
         /**
          * Количество годов для выбора в выпадающем списке
          */
         _YEAR_COUNT: 7
      },

      $constructor: function() {
         var
            self = this;

         if ( this._options.date ) {
            this.setDate(this._options.date);
         }
         else {
            this.setToday();
         }

         // Клик по стрелочкам
         $('.js-controls-MonthPicker__arrowRight', this.getContainer().get(0)).click(function(){
            self.setNext();
         });
         $('.js-controls-MonthPicker__arrowLeft', this.getContainer().get(0)).click(function(){
            self.setPrev();
         });

         // Клик по полю с датой
         $('.js-controls-MonthPicker__field', this.getContainer().get(0)).click(function(){
            self.togglePicker();
            self._setText();
            // обновляем выпадающий блок только если пикер данным кликом открыт
            if ( self._picker && self._picker.isVisible() ){ self._drawElements(); }
         });

         // Обработка нажатий клавиш
         $(this.getContainer().get(0)).keydown(function(event){
            if( event.which == self._KEYS.ARROW_RIGHT ){ self.setNext(); }
            else if( event.which == self._KEYS.ARROW_LEFT ){ self.setPrev(); }
         });


      },

      _initializePicker: function(){
         MonthPicker.superclass._initializePicker.call(this);

         var self = this;

         this._picker.subscribe('onClose', function(){
            // Если просто вызвать метод _setText(), то изменение текста не произойдет, так как пикер на момент выстреливания
            // события еще открыт. Нам же нужно, чтобы пикер был закрыт для корректной устнавки текста -- устанавливаем задержу
            setTimeout(function(){
               self._setText();
            }, 0);
         });
      },

      _setPickerContent: function() {
         var
            self = this,
            elements = this._options.mode == 'month' ? this._months : new Array(this._YEAR_COUNT);

         this._picker.getContainer().empty();
         this._picker.getContainer().append(this._dropdownTpl({mode: this._options.mode, elements: elements}));

         $('.js-controls-MonthPicker__dropdownElement', this._picker.getContainer()).click(function(){
            self.hidePicker();

            if( self._options.mode == 'month' ){
               self._setDate(new Date(self._options.date.getFullYear(), $(this).attr('data-key'), 1, 20, 0, 0));
            }
            else if( self._options.mode == 'year' ){
               self._setDate(new Date($(this).attr('data-key'), 0, 1, 20, 0, 0));
            }
         });
      },

      /**
       * Установить режим ввода (месяц / месяц,год)
       * @param {String} mode
       */
      setMode: function(mode){
         if( mode == 'year' || mode == 'month' ){
            this._options.mode = mode;
            if ( this._picker ) {
               this._setPickerContent();

               if ( this._picker.isVisible() ){
                  this.hidePicker();
               }
            }
            if ( this._options.date ) {
               this.setDate(this._options.date);
            }
            else {
               this.setToday();
            }
         }
      },

      /**
       * Установить текущий месяц/год
       */
      setToday: function() {
         this._setDate(new Date());
      },

      /**
       * Установить дату по полученному значению. Публичный метод. Может принимает либо строку
       * формата 'число.число' или 'число', либо объект типа Date
       * @param value Строка или дата
       */
      setDate: function(value) {
         if( value instanceof Date ){ this._setDate(value); }
         else if( typeof value == 'string' ){
            var checkResult = /^(?:(\d{1,2})\.)?(\d{1,4})$/.exec(value);

            if ( checkResult ){
               this._setDate(new Date(parseInt(checkResult[2], 10), parseInt(checkResult[1], 10) || 0, 1, 20, 0, 0));
            }
            else {
               throw new Error('Неверный формат даты');
            }
         }
      },

      /**
       * Установить следующий месяц/год
       */
      setNext: function() {
         this._changeDate(1);
      },

      /**
       * Установить предыдущий месяц/год
       */
      setPrev: function() {
         this._changeDate(-1);
      },

      /**
       * Изменить дату на value единиц (единица = месяц в режиме месяца и = год в режиме года)
       * @param value
       * @private
       */
      _changeDate: function(value){
         var
            currentDate = this._options.date || new Date(),
            newDate;

         if ( this._options.mode == 'month' ){
            // Если пикер открыт, тогда в режиме месяца в текстовом поле отображается год, т.е. нужно менять год
            if (this._picker && this._picker.isVisible()){ newDate = new Date(currentDate.setYear(currentDate.getFullYear() + value)); }
            else { newDate = new Date(currentDate.setMonth(currentDate.getMonth() + value)); }
         }
         else if ( this._options.mode == 'year' ){ newDate = new Date(currentDate.setYear(currentDate.getFullYear() + value)); }

         this._setDate(newDate);
      },

      /**
       * Возвращает текущее значение даты.
       * В случае года, возвращает дату 1-ого дня 1-ого месяца данного года.
       * В случае месяца и года, возвращает дату 1-ого дня данного месяца данного года
       * @returns {Date|*} Текущая дата
       */
      getDate: function(){
         return this._options.date;
      },

      /**
       * Взовращает дату в виде строки формата 'YYYY-MM-DD'
       * @returns {string}
       */
      getTextDate: function(){
         return this._options.date.toSQL();
      },

      /**
       * Возвращает интервал даты (массив из двух дат), где, в случае 'месац, год':
       * начало интервала - первый день данного месяца данного года, конец - последний день данного месяца данного года
       * а в случае режима 'год':
       * начало интервала - первый день данного года, конец - последний день данного года
       * @returns {*[]}
       */
      getInterval: function(){
         var
            startInterval = this._options.date,
            endInterval;
         if ( this._options.mode == 'month' ){
            endInterval = new Date(startInterval.getFullYear(), startInterval.getMonth() + 1, 0, 20, 0, 0);
         }
         else if ( this._options.mode == 'year' ){
            endInterval = new Date(startInterval.getFullYear(), 11, 31, 20, 0, 0);
         }

         return [startInterval, endInterval];
      },

      /**
       * Установить дату по объекту типа Date. Приватный метод, работает только с типом Date
       * @param date Дата, по которой устанавливается новое значение
       * @private
       */
      _setDate: function(date){
         var
            month = ( this._options.mode == 'month' ) ? date.getMonth() : 0,
            year = date.getFullYear();
         // Явно устанавливаем ненулевое время, т.к. в некоторых случаях при значениях по умолчанию
         // нам отдается предыдущий месяц, например, при new Date(2020, 0, 1), то есть если мы хотим
         // задать 2020 год 1 января, нам вернётся, как ни странно, Tue Dec 31 2019 23:00:00 GMT+0300 (RTZ 2 (зима))
         this._options.date = new Date(year, month, 1, 20, 0, 0);

         this._setText();
      },

      /**
       * Установить значение в поле в соответствии с текущим значением даты
       * @private
       */
      _setText: function(){
         var
            date = this._options.date,
            fieldContainer = $('.js-controls-MonthPicker__field', this.getContainer().get(0));

         if( this._options.mode == 'month' ){
            // Если пикер открыт, то в режиме месяца показан только год
            if (this._picker && this._picker.isVisible()){ fieldContainer.text(date.getFullYear()); }
            else { fieldContainer.text(this._months[date.getMonth()] + ', ' + date.getFullYear()); }
         }
         else if( this._options.mode == 'year' ){ fieldContainer.text(date.getFullYear()); }
      },

      /**
       * Обновить выпадающий список в соответствии с типом mode, а так же обновить активный элемент
       * @private
       */
      _drawElements: function(){
         var
            self = this,
            temporary,
            quantity;

         // обновляем года и атрибуты data-key в режиме года
         if( self._options.mode == 'year' ) {
            quantity = ($('.js-controls-MonthPicker__dropdownElement', self._picker.getContainer().get(0)).length / 2 | 0);
            $('.js-controls-MonthPicker__dropdownElement', this._picker.getContainer().get(0)).each(function () {
               temporary = self._options.date.getFullYear() + $(this).index() - quantity;
               $(this).text(temporary);
               $(this).attr('data-key', temporary);
            });
         }

         // Обновляем активный месяц/год
         $('.js-controls-MonthPicker__dropdownElement', this._picker.getContainer().get(0))
            .removeClass('controls-MonthPicker__dropdownElementActive');
         temporary = self._options.mode == 'month' ? temporary = self._options.date.getMonth() : temporary = self._options.date.getFullYear();
         $('.js-controls-MonthPicker__dropdownElement[data-key=' + temporary + ']', this._picker.getContainer().get(0))
            .addClass('controls-MonthPicker__dropdownElementActive');
      }
   });

   return MonthPicker;
});