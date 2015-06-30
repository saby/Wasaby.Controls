/**
 * TODO Компонент пока тестировался только в Chrome
 */
define(
   'js!SBIS3.CONTROLS.Calendar',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.ControlHierarchyManager',
      'js!SBIS3.CONTROLS.Utils.DateUtil',
      'html!SBIS3.CONTROLS.Calendar/resources/CalendarTableBody',
      'html!SBIS3.CONTROLS.Calendar',
      'js!SBIS3.CONTROLS.MonthPicker'
   ],
   function (CompoundControl, ControlHierarchyManager, DateUtil, CalendarTableBodyTpl, dotTplFn) {

      'use strict';

      /**
       * Календарь
       * @class SBIS3.CONTROLS.Calendar
       * @extends SBIS3.CORE.CompoundControl
       * @control
       * @public
       * @demo SBIS3.CONTROLS.Demo.MyCalendar
       * @ignoreOptions independentContext contextRestriction isContainerInsideParent owner stateKey subcontrol
       * @ignoreOptions element linkedContext handlers parent autoHeight autoWidth horizontalAlignment verticalAlignment
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
                * @cfg {Date} Значение даты в формате Date Object
                */
               date: undefined
            }
         },

         $constructor: function () {
            this._publish('onDateChange');
            this._container.removeClass('ws-area');
         },

         init: function(){
            Calendar.superclass.init.call(this);

            var self = this;

            // Получаем контролл MonthPicker
            this.monthControl = this.getChildControlByName('MonthPicker');

            // Первоначальная установка даты
            if (this._options.date) {
               this._setDate(this._options.date);
            } else {
               this._setDate(new Date());
            }

            // Изменение даты с помощью дочернего контролла MonthPicker
            this.monthControl.subscribe('onDateChange', function(eventObject, date){
               self._setDate(date);
            });

            ControlHierarchyManager.addNode(this, this.getParent());
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
               // Формируем массив массивов, где каждый внутренний массив представляет собой неделю (ровно семь объектов), в котором
               // каждый день представляет собой объект { (number)деньКалендаря, (bool)этоДеньЭтогоМесяца }.
               // Данный массив недель в последствии передадим в шаблон для постройки тела календаря.
               weeksArray = [],
               week = [];

            // Удаляем устаревшую таблицу (при первом создании ничего не происходит, так как tbody просто еще не существует)
            tBody.remove();

            // Заполняем нулевые дни вначале таблицы
            dayOfWeek = date.getDay() != 0 ? date.getDay() : 7;
            days = this._daysInMonth(new Date(workingDate.setMonth(workingDate.getMonth() - 1)));
            while( dayOfWeek - 1 > 0 ){
               this._pushDayIntoArray(week, days - dayOfWeek + 2, false);

               dayOfWeek--
            }
            workingDate = new Date(date);

            // Заполняем календарные дни
            days = this._daysInMonth(date);
            for ( var i = 1; i <= days; i++ ){
               this._pushDayIntoArray(week, i, true);

               if ( week.length == 7 ) {
                  weeksArray.push(week);
                  week = [];
               }

            }
            workingDate.setDate(days);

            // Добиваем календарь пустыми ячейками, если нужно (то есть, если последний день был не воскресеньем)
            if( workingDate.getDay() != 0 ){
               dayOfWeek = workingDate.getDay();

               while( dayOfWeek != 7 ){
                  this._pushDayIntoArray(week, dayOfWeek - workingDate.getDay() + 1, false);

                  dayOfWeek++;
               }

               weeksArray.push(week);
            }

            // Вставляем тело таблицы в вёрстку;
            table.append(this._CalendarTableBodyTpl({weeksArray: weeksArray}));

            // Обработка клика по календарному дню
            var self = this;
            $('.controls-Calendar__tableBodyElement', this.getContainer().get(0)).click(function(){
               workingDate = new Date( date.getFullYear(), date.getMonth(), $(this).attr('data-day'), 0, 0, 0, 0 );
               self.setDate(workingDate);
            });
         },

         /**
          * Обновить текущий активный день
          * @private
          */
         _refreshActiveDay: function(){
            $('.controls-Calendar__tableBodyElement__active', this.getContainer().get(0))
               .removeClass('controls-Calendar__tableBodyElement__active');
            // ВАЖНО: в вёрстке только дни текущего месяца имеют свойство data-day, поэтому на дни до/после месяца
            // добавлять данное свойство нельзя, иначе активный элемент установится некорректно в некоторых случаях!
            $('.controls-Calendar__tableBodyElement[data-day=' + this._options.date.getDate() + ']', this.getContainer().get(0))
               .addClass('controls-Calendar__tableBodyElement__active');
         },

         /**
          * Установить дату по переданному объекту Date. Публичный метод.
          * Отличается от приватного метода тем, что генерирует событие.
          */
         setDate: function(date){
            date = date ? date : new Date();
            this._setDate(date);
            this._notify('onDateChange', date);
         },

         /**
          * Установить дату
          * @param {Date|string} дата
          * @private
          */
         _setDate: function(date){
            var isCorrect = false;
            if (date instanceof Date) {
               this._options.date = date;
               isCorrect = true;
            } else if (typeof date == 'string') {
               //convert ISO-date to Date
               this._options.date = DateUtil.dateFromIsoString(date);
               if (DateUtil.isValidDate(this._options.date)) {
                  isCorrect = true;
               }
            }
            if ( ! isCorrect) {
               this._options.date = null;
               throw new Error('Calendar. Неверный формат даты');
            }
            // Зануляем время
            this._options.date.setHours(0, 0, 0, 0);
            // Устанавливаем дату в дочерний контролл MonthPicker
            this.monthControl._setDate(this._options.date);
            // Обновляем таблицу календарных дней
            this._refreshCalendarTable();
            // Обновляем активный день
            this._refreshActiveDay();
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