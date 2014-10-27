/**
 * TODO Компонент пока тестировался только в Chrome
 */
define(
   'js!SBIS3.CONTROLS.Calendar',
   [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.CONTROLS.Calendar',
      'js!SBIS3.CONTROLS.MonthPicker'
   ],
   function (CompoundControl, dotTplFn) {

      'use strict';

      /**
       * Календарь
       * @class SBIS3.CONTROLS.Calendar
       * @extends SBIS3.CORE.CompoundControl
       */

      var Calendar = CompoundControl.extend( /** @lends SBIS3.CONTROLS.Calendar.prototype */{
         $protected: {
            _dotTplFn: dotTplFn,

            _options: {
               /**
                * Значение даты в формате Date Object
                */
               date: undefined
            }
         },

         $constructor: function () {
            this._publish('onDatePick');
         },

         init: function(){
            Calendar.superclass.init.call(this);

            var
               self = this,
               monthControl = this.getChildControlByName('MonthPicker');

            // Устанавливаем статическую ширину контролла MonthPicker
            monthControl.getContainer().addClass('controls-Calendar__monthPicker');

            // Первоначальная установка даты
            if ( this._options.date && this._options.date instanceof Date ){
               this.setDate(this._options.date);
            }
            else {
               this.setDate(new Date());
            }

            // Изменение даты с помощью дочернего контролла MonthPicker
            monthControl.subscribe('onDateChange', function(eventObject, date){
               self.setDate(date);
            });
         },

         /**
          * Обновить таблицу календарных дней в соответствии с текущим значением дочернего MonthPicker'a
          * @private
          */
         _refreshCalendarTable: function(){
            var
               date = this.getChildControlByName('MonthPicker').getDate(),
               table = $('.controls-Calendar__tableBody', this.getContainer().get(0)),
               dayOfWeek = date.getDay() != 0 ? date.getDay() : 7,
               days,
               row, element,
               workingDate = new Date(date);

            // Очищаем устаревшую таблицу
            table.empty();

            // Заполняем нулевые дни вначале таблицы
            row = $('<tr></tr>').addClass('controls-Calendar__tableBodyRow');
            days = this._daysInMonth(new Date(workingDate.setMonth(workingDate.getMonth() - 1)));
            while( dayOfWeek - 1 > 0 ){
               element = $('<td></td>').text(days - dayOfWeek + 2)
                  .addClass('controls-Calendar__tableElement')
                  .addClass('controls-Calendar__tableElementFog');
               row.append(element);
               dayOfWeek--
            }
            workingDate = new Date(date);

            // Заполняем календарные дни
            days = this._daysInMonth(date);
            for ( var i = 1; i <= days; i++ ){
               workingDate.setDate(i);
               element = $('<td></td>').attr('data-day', i).text(i)
                  .addClass('controls-Calendar__tableElement')
                  .addClass('controls-Calendar__tableBodyElement');
               row.append(element);

               if( workingDate.getDay() == 0 ){
                  table.append(row);
                  row = $('<tr></tr>').addClass('controls-Calendar__tableBodyRow');
               }
            }

            // Добиваем календарь пустыми ячейками, если нужно (то есть если последний день был не воскресеньем)
            if( workingDate.getDay() != 0 ){
               //var i = 1;
               dayOfWeek = workingDate.getDay();

               while( dayOfWeek != 7 ){
                  element = $('<td></td>').text( dayOfWeek - workingDate.getDay() + 1)
                     .addClass('controls-Calendar__tableElement')
                     .addClass('controls-Calendar__tableElementFog');
                  row.append(element);
                  dayOfWeek++;
               }
               table.append(row);
            }

            // Обработка клика по календарному дню
            var self = this;
            $('.controls-Calendar__tableBodyElement', this.getContainer().get(0)).click(function(){
               workingDate = new Date(new Date(date).setDate($(this).attr('data-day')));
               self.setDate(workingDate);
               self._notify('onDatePick', workingDate);
            });

            // Если контролл Calendar находится в пикере другого контролла, который в свою очередь
            // находится в пикере третьего контролла, то клик в пикере с Calendar'ём закроет внешний пикер.
            // Необходимо предотвратить данное поведение
            $('.controls-Calendar__tableBodyElement', this.getContainer().get(0)).mousedown(function(e){
               e.stopPropagation();
            });
         },

         /**
          * Обновить текущий активный день
          * @private
          */
         _refreshActiveDay: function(){
            $('.controls-Calendar__tableBodyElement__active', this.getContainer().get(0))
               .removeClass('controls-Calendar__tableBodyElement__active');
            $('.controls-Calendar__tableBodyElement[data-day=' + this._options.date.getDate() + ']', this.getContainer().get(0))
               .addClass('controls-Calendar__tableBodyElement__active');
         },

         /**
          * Установить дату по переданному объекту Date
          * @param date
          * @private
          */
         setDate: function(date){
            if( date instanceof Date ){
               // Обновляем значение даты
               this._options.date = date;
               // Устанавливаем дату в дочерний контролл MonthPicker
               this.getChildControlByName('MonthPicker')._setDate(date);
               // Обновляем таблицу календарных дней
               this._refreshCalendarTable();
               // Обновляем активный день
               this._refreshActiveDay();
            }
            else {
               throw new Error('Дата должна быть в формате Date()');
            }
         },

         /**
          * Получить текущее значение даты
          * @returns {date}
          */
         getDate: function(){
            return this._options.date;
         },

         /**
          * Посчитать количество дней в месяце.
          * @param date
          * @returns {number}
          * @private
          */
         _daysInMonth: function(date){
            var days = 32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate();
            // В високосном году декабрь считается некорректно, явно ставим 31
            days  = days != 1 ? days : 31;
            return days;
         }
      });

      return Calendar;
   });