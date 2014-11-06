/**
 * TODO Компонент пока тестировался только в Chrome
 */
define(
   'js!SBIS3.CONTROLS.Calendar',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.ControlHierarchyManager',
      'html!SBIS3.CONTROLS.Calendar/resources/CalendarTableBody',
      'html!SBIS3.CONTROLS.Calendar',
      'js!SBIS3.CONTROLS.MonthPicker'
   ],
   function (CompoundControl, ControlHierarchyManager, CalendarTableBodyTpl, dotTplFn) {

      'use strict';

      /**
       * Календарь
       * @class SBIS3.CONTROLS.Calendar
       * @extends SBIS3.CORE.CompoundControl
       */

      var Calendar = CompoundControl.extend( /** @lends SBIS3.CONTROLS.Calendar.prototype */{
         $protected: {
            _dotTplFn: dotTplFn,
            _CalendarTableBodyTpl: CalendarTableBodyTpl,
            /**
             * Контролл MonthPicker
             */
            monthControl: undefined,
            /**
             * Опции создаваемого контролла
             */
            _options: {
               /**
                * Значение даты в формате Date Object
                */
               date: undefined
            }
         },

         $constructor: function () {
            this._publish('onSelect');
         },

         init: function(){
            Calendar.superclass.init.call(this);

            var self = this;

            // Получаем контролл MonthPicker
            this.monthControl = this.getChildControlByName('MonthPicker');

            // Первоначальная установка даты
            if ( this._options.date && this._options.date instanceof Date ){
               this._setDate(this._options.date);
            }
            else {
               this._setDate(new Date());
            }

            // Изменение даты с помощью дочернего контролла MonthPicker
            this.monthControl.subscribe('onDateChange', function(eventObject, date){
               self._setDate(date);
            });

            ControlHierarchyManager.addNode(this);
         },

         /**
          * Обновить таблицу календарных дней в соответствии с текущим значением дочернего MonthPicker'a
          * @private
          */
         _refreshCalendarTable: function(){
            var
               date = this.monthControl.getDate(),
               table = $('.controls-Calendar__dayTable', this.getContainer().get(0)),
               tBody = $('.controls-Calendar__tableBody', this.getContainer().get(0)),
               dayOfWeek,
               days,
               workingDate = new Date(date),
               // Формируем массив объектов вида {(number)деньКалендаря, (bool)этоДеньЭтогоМесяца},
               // который в последствии передадим в шаблон для постройки тела календаря. Всегда кратен семи (все недели полные)
               daysInCalendar = [];

            // Удаляем устаревшую таблицу (при первом создании ничего не происходит, так как tbody просто еще не существует)
            tBody.remove();

            // Заполняем нулевые дни вначале таблицы
            dayOfWeek = date.getDay() != 0 ? date.getDay() : 7;
            days = this._daysInMonth(new Date(workingDate.setMonth(workingDate.getMonth() - 1)));
            while( dayOfWeek - 1 > 0 ){
               this._pushDayIntoArray(daysInCalendar, days - dayOfWeek + 2, false);

               dayOfWeek--
            }
            workingDate = new Date(date);

            // Заполняем календарные дни
            days = this._daysInMonth(date);
            for ( var i = 1; i <= days; i++ ){
               this._pushDayIntoArray(daysInCalendar, i, true);
            }
            workingDate.setDate(days);

            // Добиваем календарь пустыми ячейками, если нужно (то есть, если последний день был не воскресеньем)
            if( workingDate.getDay() != 0 ){
               dayOfWeek = workingDate.getDay();

               while( dayOfWeek != 7 ){
                  this._pushDayIntoArray(daysInCalendar, dayOfWeek - workingDate.getDay() + 1, false);

                  dayOfWeek++;
               }
            }

            // Вставляем тело таблицы в вёрстку
            table.append(this._CalendarTableBodyTpl({dayArray: daysInCalendar}));

            // Обработка клика по календарному дню
            var self = this;
            $('.controls-Calendar__tableBodyElement', this.getContainer().get(0)).click(function(){
               workingDate = new Date(new Date(date).setDate($(this).attr('data-day')));
               self._setDate(workingDate);
               self._notify('onSelect', workingDate);
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
          * Установить дату по переданному объекту Date. Публичный метод
          * TODO в будущем, возможно, будет отличатся тем, что будет генерировать событие
          */
         setDate: function(date){
            this._setDate(date);
         },

         /**
          * Установить дату по переданному объекту Date. Приватный метод
          * @param date
          * @private
          */
         _setDate: function(date){
            if( date instanceof Date ){
               // Обновляем значение даты
               this._options.date = date;
               // Устанавливаем дату в дочерний контролл MonthPicker
               this.monthControl._setDate(date);
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
         },

         /**
          * Вспомогательная фунция. Используется в _refreshCalendarTable при создании массива дней
          * @param array
          * @param day
          * @param isCalendar
          * @private
          */
         _pushDayIntoArray: function (array, day, isCalendar) {
            var obj = {};
            obj.day = day;
            obj.isCalendar = isCalendar;

            array.push(obj);
         }
      });

      return Calendar;
   });