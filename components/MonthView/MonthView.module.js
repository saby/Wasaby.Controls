/**
 * TODO Компонент пока тестировался только в Chrome
 */
define(
   'js!SBIS3.CONTROLS.MonthView',
   [
      'Core/constants',
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.ControlHierarchyManager',
      'js!SBIS3.CONTROLS.RangeMixin',
      'js!SBIS3.CONTROLS.RangeSelectableViewMixin',
      'js!SBIS3.CONTROLS.Utils.DateUtil',
      'html!SBIS3.CONTROLS.MonthView/resources/MonthViewTableBody',
      'html!SBIS3.CONTROLS.MonthView',
      'js!SBIS3.CONTROLS.MonthPicker',
      'i18n!SBIS3.CONTROLS.Calendar',
      'css!SBIS3.CONTROLS.MonthView'
   ],
   function (constants, CompoundControl, ControlHierarchyManager, RangeMixin, RangeSelectableViewMixin, DateUtil, MonthViewTableBodyTpl, dotTplFn) {

      'use strict';

      /**
       * Календарь отображающий 1 месяц.
       * Предназначен для задания даты или диапазона дат в рамках одного месяца путём выбора.
       * @class SBIS3.CONTROLS.MonthView
       * @extends $ws.proto.CompoundControl
       * @control
       * @public
       * @author Миронов Александр Юрьевич
       * @demo SBIS3.CONTROLS.Demo.MyMonthView
       *
       */
      var selectionTypes = {WEEK: 'week', DAY: 'day'};

      // TODO: нужно ли наследование от FormWidgetMixin ??
      var MonthView = CompoundControl.extend([RangeSelectableViewMixin, RangeMixin], /** @lends SBIS3.CONTROLS.MonthView.prototype */{
         _dotTplFn: dotTplFn,
         $protected: {
            _monthViewTableBodyTpl: MonthViewTableBodyTpl,
            _options: {
               /**
                * @cfg {Date|String} Месяц с которого откроется календарь
                * @remark
                * Строка должна быть формата ISO 8601.
                * Дата игнорируется.
                * @example
                * <pre class="brush:xml">
                *     <option name="date">2015-03-07T21:00:00.000Z</option>
                * </pre>
                */
               month: undefined,

               /**
                * @cfg {String} Тип заголовка "text"|"picker"|null
                */
               captionType: undefined,
               /**
                * @cfg {String} Формат заголовка
                * @remark
                * Строка должна быть в формате поддерживаемым Date.strftime.
                */
               captionFormat: '%B, %Y',

               /**
                *  @cfg {Boolean} Если true, то дни недели отображаются
                */
               showWeekdays: true
            },

            _viewValidateTimer: null,

            _selectionType: null,

            _MONTH_VIEW_CSS_CLASSES: {
               CAPTION_TEXT: 'controls-MonthView__caption-text',
               CAPTION: 'controls-MonthView__caption',
               TABLE: 'controls-MonthView__dayTable',
               TABLE_ROW: 'controls-MonthView__tableRow',
               DAY: 'controls-MonthView__tableElement',
               DAY_TITLE: 'controls-MonthView__dayTitle',
               DAY_BORDER: 'controls-MonthView__dayBorder',
               WEEK_SELECTED: 'controls-MonthView__weekSelected',
               WEEK_HOVERED: 'controls-MonthView__weekHovered',
               WEEK_ROW: 'controls-MonthView__tableRow',
               TODAY: 'controls-MonthView__today'
            }
         },

         $constructor: function () {
            this._publish('onSelectionChange');
            
         },

         init: function () {
            MonthView.superclass.init.call(this);

            var self = this;

            // Первоначальная установка даты
            this._options.month = this._options.month || new Date();
            this._options.month = this._normalizeMonth(this._options.month);
            if (!this._options.month) {
               throw new Error('MonthView. Неверный формат даты');
            }

            this._drawMonthTable();
            this._drawCurrentRangeSelection();

            this.getContainer().mouseleave(this._onRangeControlMouseLeave.bind(this));

            this._updateCaption();
            this._attachEvents();

            //??? это было в js!SBIS3.CONTROLS.Calendar . Нужно ли оно тут?
            // ControlHierarchyManager.addNode(this, this.getParent());
         },

         _attachEvents: function () {
            var self = this,
               itemsContainerCssClass = ['.', this._MONTH_VIEW_CSS_CLASSES.TABLE].join(''),
               itemsContainers = this.getContainer().find(itemsContainerCssClass),
               itemCssClass = ['.', this._SELECTABLE_RANGE_CSS_CLASSES.item].join('');

            if (this.isEnabled()) {
               itemsContainers.click(
                  'click', this._onDayMouseClick.bind(this)
               );

               itemsContainers.on('mouseenter', itemCssClass, function () {
                  self._onDayMouseEnter($(this));
               });
               //TODO:продумать как правильно выбирать неделю на Ipad
               if (!constants.browser.isMobileIOS) {
                  itemsContainers.on('mouseenter', ['.', this._MONTH_VIEW_CSS_CLASSES.DAY_BORDER].join(''), function (e) {
                     self._onDayBorderMouseEnter($(this), self._getItemDate($(this)));
                  }).on('mouseleave', ['.', this._MONTH_VIEW_CSS_CLASSES.DAY_BORDER].join(''), function (e) {
                     self._onDayBorderMouseLeave($(this), self._getItemDate($(this)), e);
                  }).on('mouseleave', self._onMouseLeave.bind(this));
               }
            }
         },

         _setSelectionType: function (value) {
            this._options.selectionType = value;
         },
         _getSelectionType: function () {
            return this._options.selectionType;
         },

         _onDayMouseClick: function (event) {
            var t = $(event.target),
               date;
            // Начинаем выделение по дням или по месяцам в зависимости от того на какую область дня нажал пользователь,
            // завершаем выделение независимо от того в какую область дня нажал пользователь.
            if (this.isSelectionProcessing()) {
               date = this._getItemDate(t);
               if (this._getSelectionType() === selectionTypes.WEEK) {
                  if (date < this.getStartValue()) {
                     date = this._getStartOfWeek(date);
                  } else if (date > this.getEndValue()) {
                     date = this._getEndOfWeek(date);
                  }
               }
               this._onRangeItemElementClick(date);
               this._setSelectionType(null);
            } else {
               if (t.hasClass(this._MONTH_VIEW_CSS_CLASSES.DAY_TITLE)) {
                  this._onDayTitleMouseClick(t, event);
               } else if (this._MONTH_VIEW_CSS_CLASSES.DAY_BORDER) {
                  this._onDayBorderMouseClick(t, event);
               }
            }
         },

         _onDayTitleMouseClick: function (element, event) {
            if (!this.isSelectionProcessing()) {
               this._setSelectionType(selectionTypes.DAY);
               this._onRangeItemElementClick(this._getItemDate(element));
            }
         },

         _onDayBorderMouseClick: function (element, event) {
            var date, startDate, endDate;
            // Если пользователь уже иницировал выделение, то клики обрабатываем в обработчике клика по ячеке(_onDayMouseClick)
            if (this.isSelectionProcessing()) {
               return;
            }
            date = this._getItemDate(element);
            //TODO:продумать как правильно выбирать неделю на Ipad
            if (!constants.browser.isMobileIOS) {
               startDate = this._getStartOfWeek(date);
               endDate = this._getEndOfWeek(date);
               this._setSelectionType(selectionTypes.WEEK);
               this._onRangeItemElementClick(startDate, endDate);
            } else {
               this._setSelectionType(selectionTypes.DAY);
               this._onRangeItemElementClick(date);
            }
         },

         _onDayMouseEnter: function (element) {
            var date = this._getItemDate(element);
            if (this._getSelectionType() === selectionTypes.WEEK) {
               if (date < this.getStartValue()) {
                  date = this._getStartOfWeek(date);
               } else if (date > this.getEndValue()) {
                  date = this._getEndOfWeek(date);
               }
            }
            this._onRangeItemElementMouseEnter(date);
         },

         _getStartOfWeek: function (date) {
            date = new Date(date);
            var day = date.getDay(),
               diff = date.getDate() - day + (day === 0 ? -6:1);
            return new Date(date.setDate(diff));
         },

         _getEndOfWeek: function (date) {
            date = new Date(date);
            var day = date.getDay(),
               diff = date.getDate() - day + (day === 0 ? 0:7);
            return new Date(date.setDate(diff));
         },

         _onDayBorderMouseEnter: function (element, item) {
            var rowCls;
            if (!this.isSelectionProcessing()) {
               rowCls = ['.', this._MONTH_VIEW_CSS_CLASSES.WEEK_ROW].join('');
               this.getContainer().find(rowCls).removeClass(this._MONTH_VIEW_CSS_CLASSES.WEEK_HOVERED);
               element.closest(rowCls).addClass(this._MONTH_VIEW_CSS_CLASSES.WEEK_HOVERED);
            }
         },

         _onDayBorderMouseLeave: function (element, item, event) {
            if (!$(event.toElement).hasClass(this._MONTH_VIEW_CSS_CLASSES.DAY)) {
               element.closest(['.', this._MONTH_VIEW_CSS_CLASSES.WEEK_ROW].join('')).removeClass(this._MONTH_VIEW_CSS_CLASSES.WEEK_HOVERED);
            }
         },

         _onMouseLeave: function () {
            var hoveredCls = ['.', this._MONTH_VIEW_CSS_CLASSES.WEEK_HOVERED].join('');
            this.getContainer().find(hoveredCls).removeClass(this._MONTH_VIEW_CSS_CLASSES.WEEK_HOVERED);
         },

         /**
          * Устанавливает начальную выбранную дату
          * @param date {Date} дата
          * @param silent
          */
         setStartValue: function (date, silent) {
            var changed = false;
            date = this._normalizeDate(date);

            changed = MonthView.superclass.setStartValue.call(this, date, silent);
            if (changed) {
               this.validateRangeSelectionItemsView();
            }
            return changed;
         },

         /**
          * Устанавливает конечную выбранную дату
          * @param date {Date} дата
          * @param silent
          */
         setEndValue: function (date, silent) {
            var changed = false;
            date = this._normalizeDate(date);

            changed = MonthView.superclass.setEndValue.call(this, date, silent);
            if (changed) {
               this.validateRangeSelectionItemsView();
            }
            return changed;
         },

         /**
          * Устанавливает отбражаемый месяц
          * @param month
          * @returns {boolean}
          */
         setMonth: function (month) {
            var oldMonth = this._options.month;
            month = this._normalizeMonth(month);
            if (month === oldMonth ||
               (month && oldMonth && month.getTime() === this._options.month.getTime())) {
               return false;
            }
            this._options.month = month;
            this._drawMonthTable();
            this._drawCurrentRangeSelection();
         },
         /**
          * Возвращает отображаемый месяц
          * @returns {undefined|*|number|Date|null}
          */
         getMonth: function () {
            return this._options.month;
         },

         getCaptionType: function () {
            return this._options.captionType;
         },

         getCaptionFormat: function () {
            return this._options.captionFormat;
         },

         isShowWeekdays: function () {
            return this._options.showWeekdays;
         },

         _updateCaption: function () {
            if (!this._options.captionType) {
               return;
            }
            this.getContainer().find('.' + this._MONTH_VIEW_CSS_CLASSES.CAPTION_TEXT).text(this._options.month.strftime(this.getCaptionFormat()));
         },

         _getDaysArray: function () {
            var
               date = this._options.month,
               today = new Date(),
               isCurrentMonth = today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth(),
               workingDate = new Date(date),
               // Формируем массив массивов, где каждый внутренний массив представляет собой неделю (ровно семь объектов), в котором
               // каждый день представляет собой объект { (number)деньКалендаря, (bool)этоДеньЭтогоМесяца }.
               // Данный массив недель в последствии передадим в шаблон для постройки тела календаря.
               weeksArray = [],
               week = [],
               dayOfWeek,
               days;

            today = today.getDate();

            // Заполняем нулевые дни вначале таблицы
            workingDate.setDate(1);
            dayOfWeek = workingDate.getDay() != 0 ? workingDate.getDay() : 7;
            days = this._daysInMonth(new Date(workingDate.setMonth(workingDate.getMonth() - 1)));
            while( dayOfWeek - 1 > 0 ){
               this._pushDayIntoArray(week, days - dayOfWeek + 2, false, false, 'prevMonth', false, dayOfWeek === 2);
               dayOfWeek--
            }
            workingDate = new Date(date);

            // Заполняем календарные дни
            days = this._daysInMonth(date);
            for ( var i = 1; i <= days; i++ ){
               this._pushDayIntoArray(week, i, true, isCurrentMonth && today === i, 'currentMonth', i === 1, i === days);

               if ( week.length == 7 ) {
                  weeksArray.push(week);
                  week = [];
               }

            }
            workingDate.setDate(days);

            // Добиваем календарь пустыми ячейками, если нужно (то есть, если последний день был не воскресеньем)
            if( workingDate.getDay() != 0 ){
               dayOfWeek = workingDate.getDay();
               days = 0;

               while( dayOfWeek != 7 ){
                  this._pushDayIntoArray(week, dayOfWeek - workingDate.getDay() + 1, false, false, 'nextMonth', false, days === 0);
                  dayOfWeek++;
                  days++;
               }
               weeksArray.push(week);
            }
            return weeksArray;
         },

         /**
          * Обновить таблицу календарных дней в соответствии с текущим значением даты
          * @private
          */
         _drawMonthTable: function(){
            var
               self = this,
               table = $('.controls-MonthView__dayTable', this.getContainer()),
               tBody = $('.controls-MonthView__tableBody', this.getContainer()),
               // Формируем массив массивов, где каждый внутренний массив представляет собой неделю (ровно семь объектов), в котором
               // каждый день представляет собой объект { (number)деньКалендаря, (bool)этоДеньЭтогоМесяца }.
               // Данный массив недель в последствии передадим в шаблон для постройки тела календаря.
               weeksArray = this._getDaysArray(),
               workingDate;

            // Удаляем устаревшую таблицу (при первом создании ничего не происходит, так как tbody просто еще не существует)
            tBody.remove();

            // Вставляем тело таблицы в вёрстку;
            table.append(this._monthViewTableBodyTpl({weeksArray: weeksArray}));
         },

         _getItemDate: function (jqObj) {
            if (!jqObj.hasClass(this._SELECTABLE_RANGE_CSS_CLASSES.item)) {
               jqObj = jqObj.closest(['.', this._SELECTABLE_RANGE_CSS_CLASSES.item].join(''));
            }
            return new Date( this._options.month.getFullYear(), this._options.month.getMonth(), jqObj.attr(this._selectedRangeItemIdAtr), 0, 0, 0, 0 );
         },

         _setSelectionRangeEndItem: function (item) {
            if (item && this._selectingRangeEnd && item.getTime() === this._selectingRangeEnd.getTime()) {
               return false;
            }
            return MonthView.superclass._setSelectionRangeEndItem.call(this, item);
         },

         _getSelectedRangeItemsIds: function (start, end) {
            var items = [],
               monthStartDate = new Date(this.getMonth().getFullYear(), this.getMonth().getMonth(), 1),
               monthEndDate = new Date(this.getMonth().getFullYear(), this.getMonth().getMonth() + 1, 0),
               startItem = start, endItem = end,
               startId = start.getDate(), endId = end.getDate();

            if (start > monthEndDate || end < monthStartDate) {
               return {items: items, start: null, end: null};
            }
            if (startItem < monthStartDate) {
               startItem = monthStartDate;
               startId = null;
            }
            if (endItem > monthEndDate) {
               endItem = monthEndDate;
               endId = null;
            }

            endItem = endItem.getDate();
            for(var i = startItem.getDate(); i <= endItem; i++) {
               items.push(i);
            }
            return {items: items, start: startId, end: endId};
         },

         cancelSelection: function () {
            var canceled = MonthView.superclass.cancelSelection.call(this);
            if (canceled) {
               this._selectionType = null;
            }
            return canceled;
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
          * Вспомогательная фунция. Используется в _drawMonthTable при создании массива дней
          * @param array
          * @param day
          * @param isCalendar
          * @param today
          * @private
          */
         _pushDayIntoArray: function (array, day, isCalendar, today, month, firstDayOfMonth, lastDayOfMonth) {
            var obj = {};
            obj.day = day;
            obj.isCalendar = isCalendar;
            obj.today = today;
            obj.month = month;
            obj.firstDayOfMonth = firstDayOfMonth;
            obj.lastDayOfMonth = lastDayOfMonth;
            obj.rangeselect = this.isRangeselect();

            array.push(obj);
         },

         /**
          * Возвращает дату в нормальном виде(с обнуленным временем)
          * @param date {Date}
          * @returns {Date}
          * @private
          */
         _normalizeDate: function (date) {
            date = DateUtil.valueToDate(date);
            if(!(date instanceof Date)) {
               return null;
            }
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
         },

         /**
          * Возвращает месяц в нормальном виде(с датой 1 и обнуленным временем)
          * @param month {Date}
          * @returns {Date}
          * @private
          */
         _normalizeMonth: function (month) {
            month = DateUtil.valueToDate(month);
            if(!(month instanceof Date)) {
               return null;
            }
            return new Date(month.getFullYear(), month.getMonth(), 1);
         }
      });

      return MonthView;
   });
