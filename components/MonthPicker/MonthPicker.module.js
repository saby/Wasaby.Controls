/**
 * @author io.frolenko
 * Created on 03.10.2014.
 */
define(
   'js!SBIS3.CONTROLS.MonthPicker',
   [
      'js!SBIS3.CORE.Control',
      'js!SBIS3.CONTROLS._PickerMixin',
      'html!SBIS3.CONTROLS.MonthPicker'
   ],
   function(Control, _PickerMixin, dotTplFn){

   'use strict';

   /**
    * Контрол выбор месяца и года с выпадающей вниз панелью.
    * Не наследуется от поля ввода, потому что там в принципе не требуется текстовый ввод
    * @class SBIS3.CONTROLS.MonthPicker
    * @extends SBIS3.CORE.Control
    * @mixes SBIS3.CONTROLS._PickerMixin
    */

   var MonthPicker = Control.Control.extend( [_PickerMixin], /** @lends SBIS3.CONTROLS.MonthPicker.prototype */{
      $protected: {
         _dotTplFn: dotTplFn,

         _options: {

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

         this._createDropdown();

         this._setToday();

         $(this._container.get(0)).find('.controls-MonthPicker__arrow-right').click(function(){
            self._changeDate('nextMonth');
         });
         $(this._container.get(0)).find('.controls-MonthPicker__arrow-left').click(function(){
            self._changeDate('previousMonth');
         });
         $(this._container.get(0)).find('.controls-MonthPicker__field').click(function(){
            self._refreshDropdownYear();
            self.togglePicker();
         });
         $(this._container.get(0)).keydown(function(event){
            if(event.which == self._KEYS.ARROW_RIGHT){ self._changeDate('nextMonth'); }
            else if(event.which == self._KEYS.ARROW_LEFT){ self._changeDate('previousMonth'); }
            else if(event.which == self._KEYS.ARROW_UP){ self._changeDate('nextYear'); }
            else if(event.which == self._KEYS.ARROW_DOWN){ self._changeDate('previousYear'); }
         });
      },

      _createDropdown: function(){
         var self = this;

         this._picker._container.empty();

         // Оболочка всего, что у нас есть
         var dropdownWrapper = $('<div></div>').addClass('controls-MonthPicker__dropdown-wrapper');

         /* Заполняем шапку выпадающего контейнера */
         var
            titleBlock = $('<div></div>').addClass('controls-MonthPicker__dropdown-titleBlock'),
            title = $('<div></div>').addClass('controls-MonthPicker__dropdown-title'),
            arrowLeft = $('<div></div>').addClass('controls-MonthPicker__arrow').addClass('controls-MonthPicker__dropdown-arrow-left'),
            arrowRight = $('<div></div>').addClass('controls-MonthPicker__arrow').addClass('controls-MonthPicker__dropdown-arrow-right');
         arrowLeft.click(function(){
            title.text(parseInt(title.text(), 10) - 1);
         });
         arrowRight.click(function(){
            title.text(parseInt(title.text(), 10) + 1);
         });
         titleBlock.append(arrowLeft).append(title).append(arrowRight);

         /* Заполняем список месяцев */
         var
            items = $('<div></div>').addClass('controls-MonthPicker__dropdown-items'),
            element;
         for (var itm in this._months){
            element = $('<div></div>').addClass('controls-MonthPicker__dropdown-element').text(this._months[itm]);
            items.append(element);
         }
         items.children().click(function(){
            for ( var idx in self._months ){
               if( self._months[idx] == $(this).text() ){
                  self._setDate(new Date(parseInt(title.text(), 10), idx, 15));
                  self.hidePicker();
               }
            }
         });

         this._picker._container.keydown(function(event){
            if(event.which == self._KEYS.ARROW_RIGHT){ title.text(parseInt(title.text(), 10) + 1); }
            else if(event.which == self._KEYS.ARROW_LEFT){ title.text(parseInt(title.text(), 10) - 1); }
         });

         dropdownWrapper.append(titleBlock).append(items);
         this._picker._container.append(dropdownWrapper);
      },

      _refreshDropdownYear: function(){
         $(this._picker._container).find('.controls-MonthPicker__dropdown-title').text(this._currentValue.getFullYear());
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
         $(this._container.get(0)).find('.controls-MonthPicker__field').text(this._months[month] + ', ' + year);
      },

      /**
       * Установить текущий месяц/год
       */
      _setToday: function() {
         this._setDate(new Date());
      },

      /**
       * Изменить дату в поле в соответствии с видом изменения
       * @param {String} type Тип изменения. Варианты: следующий год/месяц, предыдущий год/месяц
       * @private
       */
      _changeDate: function(type){
         var
            currentDate = this._currentValue || new Date(),
            newDate;

         if      ( type == 'nextMonth' )     { newDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1)); }
         else if ( type == 'previousMonth' ) { newDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1)); }
         else if ( type == 'nextYear' )      { newDate = new Date(currentDate.setYear(currentDate.getFullYear() + 1)); }
         else if ( type == 'previousYear' )  { newDate = new Date(currentDate.setYear(currentDate.getFullYear() - 1)); }

         this._setDate(newDate);
         this.hidePicker();
      }
   });

   return MonthPicker;
});