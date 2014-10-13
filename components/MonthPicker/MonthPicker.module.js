/**
 * @author io.frolenko
 * Created on 03.10.2014.
 */

define(
   'js!SBIS3.CONTROLS.MonthPicker',
   [
      'js!SBIS3.CORE.Control',
      'js!SBIS3.CONTROLS._PickerMixin',
      'html!SBIS3.CONTROLS.MonthPicker/resources/MonthPickerDropdownMonth',
      'html!SBIS3.CONTROLS.MonthPicker/resources/MonthPickerDropdownYear',
      'html!SBIS3.CONTROLS.MonthPicker'
   ],
   function(Control, _PickerMixin, DropdownMonthTpl, DropdownYearTpl, dotTplFn){

   'use strict';

   /**
    * Контрол выбор месяца и года, или только года, с выпадающей вниз панелью.
    * Не наследуется от поля ввода, потому что там в принципе не требуется текстовый ввод
    * @class SBIS3.CONTROLS.MonthPicker
    * @extends SBIS3.CORE.Control
    * @mixes SBIS3.CONTROLS._PickerMixin
    */

   var MonthPicker = Control.Control.extend( [_PickerMixin], /** @lends SBIS3.CONTROLS.MonthPicker.prototype */{
      _dotTplFn: dotTplFn,
      _dropdownMonthTpl: DropdownMonthTpl,
      _dropdownYearTpl: DropdownYearTpl,

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
             * @cfg {String|Date} Значение для установки по умолчанию
             * <wiTag group="Данные">
             * Можно задать:
             * <ol>
             *    <li>строку формата "ГГГГ, ММ, ДД", т.е. значения отделяются запятой, строго в таком порядке и только
             * полный год в 4 цифры;</li>
             *    <li>значение типа Date.</li>
             * </ol>
             * В зависимости от режима работы, установленного во {@link viewType}, возьмутся месяц и год, либо только год.
             */
            defaultValue: '',
            /**
             * @cfg {String} формат визуального отображения месяца
             */
            monthFormat: ''
         },

         /**
          * Текущее значение даты в поле
          */
         _currentValue: undefined,

         /**
          * Массив месяцев
          */
         _months: [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
         ],

         _KEYS: {
            ARROW_LEFT: 37,
            ARROW_UP: 38,
            ARROW_RIGHT: 39,
            ARROW_DOWN: 40
         }
      },

      $constructor: function() {
         var self = this;

         this.setMode(this._options.mode);

         $('.js-controls-MonthPicker__arrow-right', this.getContainer().get(0)).click(function(){
            self.setNext();
         });
         $('.js-controls-MonthPicker__arrow-left', this.getContainer().get(0)).click(function(){
            self.setPrev();
         });
         $('.js-controls-MonthPicker__field', this.getContainer().get(0)).click(function(){
            self._refreshDropdown();
            self.togglePicker();
         });
         $(this.getContainer().get(0)).keydown(function(event){
            if( event.which == self._KEYS.ARROW_RIGHT ){ self.setNext(); }
            else if( event.which == self._KEYS.ARROW_LEFT ){ self.setPrev(); }
         });
      },

      /**
       * Установить режим ввода (Месяц/Месяц и Год)
       * @param {String} mode
       */
      setMode: function(mode) {
         var self = this;

         this._picker.getContainer().empty();

         if( mode == 'month' ){
            $('.js-controls-MonthPicker__field-box', this.getContainer().get(0))
               .removeClass('controls-MonthPicker__field-box-year')
               .addClass('controls-MonthPicker__field-box-month');

            this._picker.getContainer().append(self._dropdownMonthTpl);

            var titleContainer = $('.js-controls-MonthPicker__dropdown-title', this._picker.getContainer());

            $('.js-controls-MonthPicker__dropdown-arrow-left', this._picker.getContainer()).click(function(){
               titleContainer.text(parseInt(titleContainer.text(), 10) - 1);
            });
            $('.js-controls-MonthPicker__dropdown-arrow-right', this._picker.getContainer()).click(function(){
               titleContainer.text(parseInt(titleContainer.text(), 10) + 1);
            });

            this._picker.getContainer().keydown(function(event){
               if( event.which == self._KEYS.ARROW_RIGHT ){ titleContainer.text(parseInt(titleContainer.text(), 10) + 1); }
               else if( event.which == self._KEYS.ARROW_LEFT ){ titleContainer.text(parseInt(titleContainer.text(), 10) - 1); }
            });

            $('.js-controls-MonthPicker__dropdown-element', this._picker.getContainer()).click(function(){
               self._setDate(new Date(parseInt(titleContainer.text(), 10), $(this).attr('data-key'), 15));
               self.hidePicker();
               self.getContainer().focus();
            });
         }
         else if( mode == 'year' ){
            $('.js-controls-MonthPicker__field-box', this.getContainer().get(0))
               .removeClass('controls-MonthPicker__field-box-month')
               .addClass('controls-MonthPicker__field-box-year');

            this._picker.getContainer().append(self._dropdownYearTpl);

            $('.js-controls-MonthPicker__dropdown-element', this._picker.getContainer()).click(function(){
               self._setDate(new Date(parseInt($(this).text(), 10), 0, 15));
               self.hidePicker();
               self.getContainer().focus();
            });
         }

         this._setDefaultValue();
      },

      /**
       * Установить текущий месяц/год
       */
      setToday: function() {
         this._setDate(new Date());
      },

      /**
       * Установить дату по полученному объекту Date()
       * @param date Дата, по которой устанавливается новое значение
       * @private
       */
      _setDate: function(date){
         var
            month = parseInt(date.getMonth(), 10),
            year = parseInt(date.getFullYear(), 10);
         // Явно устанавливаем день примерно в середине месяца(главное, не первый, по умолчанию считается единицей) т.к. в некоторых
         // случаях при нулевом дне нам отдается предыдущий месяц, например, при new Date(2020, 0, 1), то есть если мы хотим
         // задать 2020 год 1 января, нам вернёт как ни странно Tue Dec 31 2019 23:00:00 GMT+0300 (RTZ 2 (зима))
         this._currentValue = new Date(year, month, 15);
         var fieldContainer = $('.js-controls-MonthPicker__field', this.getContainer().get(0));
         if( this._options.mode == 'month' ){ fieldContainer.text(this._months[month] + ', ' + year); }
         else if( this._options.mode == 'year' ){ fieldContainer.text(year); }
      },

      /**
       * Установить следующий месяц/год
       */
      setNext: function() {
         var
            currentDate = this._currentValue || new Date(),
            newDate;

         if ( this._options.mode == 'month' ){ newDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1)); }
         else if ( this._options.mode == 'year' ){ newDate = new Date(currentDate.setYear(currentDate.getFullYear() + 1)); }

         this._setDate(newDate);
         this.hidePicker();
      },
      /**
       * Установить предыдущий месяц/год
       */
      setPrev: function() {
         var
            currentDate = this._currentValue || new Date(),
            newDate;

         if ( this._options.mode == 'month' ){ newDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1)); }
         else if ( this._options.mode == 'year' ){ newDate = new Date(currentDate.setYear(currentDate.getFullYear() - 1)); }

         this._setDate(newDate);
         this.hidePicker();
      },

      /**
       * Обновить выпадающий список в соответствии с типом mode
       * @private
       */
      _refreshDropdown: function(){
         var
            self = this,
            temporary;
         if( self._options.mode == 'month' ) {
            $('.js-controls-MonthPicker__dropdown-title', this._picker.getContainer().get(0)).text(this._currentValue.getFullYear());
            $('.js-controls-MonthPicker__dropdown-element', this._picker.getContainer().get(0)).each(function () {
               $(this).removeClass('controls-MonthPicker__dropdown-element-active');
               if ( $(this).attr('data-key') == self._currentValue.getMonth() ){
                  $(this).addClass('controls-MonthPicker__dropdown-element-active');
               }
            });
         }
         else if( self._options.mode == 'year' ) {
            $('.js-controls-MonthPicker__dropdown-element', this._picker.getContainer().get(0)).each(function () {
               $(this).removeClass('controls-MonthPicker__dropdown-element-active');
               temporary = parseInt(self._currentValue.getFullYear(), 10) + $(this).index() - 3;
               $(this).text(temporary);
               if ( temporary == parseInt(self._currentValue.getFullYear(), 10) ){
                  $(this).addClass('controls-MonthPicker__dropdown-element-active');
               }
            });
         }
      },

      /**
       * Установить начальное значение. Если передано опцией, то проверить, удовлетворяет ли, затем установить,
       * иначе установить текущую дату
       * @private
       */
      _setDefaultValue: function(){
         if( this._options.defaultValue ){
            var value = this._options.defaultValue;

            if( value instanceof Date ){ this._setDate(value); }
            else if( typeof value == 'string' ){
               if ( this._checkDefaultValue(value) ){
                  if ( this._options.mode == 'month' ){
                     this._setDate(new Date(parseInt(value.slice(3), 10), parseInt(value.slice(0, 2), 10), 15));
                  }
                  else if ( this._options.mode == 'year' ){
                     this._setDate(new Date(parseInt(value, 10), 0, 15));
                  }
               }
               else { this.setToday(); }
            }
         }
         else {
            this.setToday();
         }
      },

      /**
       * Проверить, удовлетворяет ли значение по умолчанию значению типа DD.YYYY в случае mode: 'month'
       * или же YYYY в случае mode: 'year'
       * @param value
       * @returns {boolean}
       * @private
       */
      _checkDefaultValue: function(value){
         if ( this._options.mode == 'month' ){
            return value.length == 7 && /[\d]{2}\.[\d]{4}/.test(value);
         }
         else if ( this._options.mode == 'year' ){
            return value.length == 4 && /[\d]{4}/.test(value);
         }
      }
   });

   return MonthPicker;
});