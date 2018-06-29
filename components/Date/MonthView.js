/**
 * TODO Компонент пока тестировался только в Chrome
 */
define(
   'SBIS3.CONTROLS/Date/MonthView',
   [
      'Core/constants',
      'Core/detection',
      'Core/helpers/Object/isEmpty',
      'Lib/Control/CompoundControl/CompoundControl',
      'SBIS3.CONTROLS/Mixins/RangeMixin',
      'SBIS3.CONTROLS/Mixins/DateRangeMixin',
      'SBIS3.CONTROLS/Mixins/RangeSelectableViewMixin',
      'SBIS3.CONTROLS/Utils/DateUtil',
      'SBIS3.CONTROLS/Utils/IfEnabled',
      'tmpl!SBIS3.CONTROLS/Date/MonthView/MonthViewTableBody',
      'tmpl!SBIS3.CONTROLS/Date/MonthView/MonthView',
      'tmpl!SBIS3.CONTROLS/Date/MonthView/day',
      'Core/core-merge',
      'SBIS3.CONTROLS/Date/MonthPicker',
      'i18n!SBIS3.CONTROLS/Calendar',
      'css!SBIS3.CONTROLS/Date/MonthView/MonthView'
   ],
   function(constants, detection, isEmpty, CompoundControl, RangeMixin, DateRangeMixin, RangeSelectableViewMixin, DateUtil, ifEnabled, monthViewTableBodyTpl, dotTplFn, dayTmpl, merge) {

      'use strict';

      /**
       * Календарь отображающий 1 месяц.
       * Предназначен для задания даты или диапазона дат в рамках одного месяца путём выбора.
       * @class SBIS3.CONTROLS/Date/MonthView
       * @extends Lib/Control/CompoundControl/CompoundControl
       * @control
       * @public
       * @author Миронов А.Ю.
       * @demo Examples/MonthView/MyMonthView/MyMonthView
       *
       * @mixes SBIS3.CONTROLS/Mixins/RangeSelectableViewMixin
       * @mixes SBIS3.CONTROLS/Mixins/RangeMixin
       * @mixes SBIS3.CONTROLS/Mixins/DateRangeMixin
       *
       */
      // var selectionTypes = {WEEK: 'week', DAY: 'day'};

       var sortNumber = function(a, b) {
          return a - b;
      };

      // TODO: нужно ли наследование от FormWidgetMixin ??
      var MonthView = CompoundControl.extend([RangeSelectableViewMixin, RangeMixin, DateRangeMixin], /** @lends SBIS3.CONTROLS/Date/MonthView.prototype */{
         _dotTplFn: dotTplFn,
         $protected: {
            _monthViewTableBodyTpl: monthViewTableBodyTpl,
            _options: {
               /**
                * @cfg {Date|String} Месяц с которого откроется календарь
                * @remark
                * Строка должна быть формата ISO 8601.
                * Дата игнорируется.
                * @example
                * <pre class="brush:xml">
                *     <option name="month">2015-03-07T21:00:00.000Z</option>
                * </pre>
                */
               month: undefined,

               /**
                * @cfg {String} Тип заголовка "text"|null
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
               showWeekdays: true,

               /**
                * @cfg {Number} Минимальный период который можно выделить в днях
                */
               minPeriod: null,

               /**
                * @cfg {Object} Кванты. Если заданы кванты, то нельзя выделить вроизвольный период, можно только выделить заданные периоды.
                */
               quantum: {},
   
               /**
                * @cfg {Function} Возможность поменять конфигурацию для дня. В функцию приходит объект даты. Опция необходима для производственных каледнадрей.
                */
               dayFormatter: null,
               dayTmpl: dayTmpl
            },

            _viewValidateTimer: null,

            // _selectionType: null,

            _MONTH_VIEW_CSS_CLASSES: {
               CAPTION: 'controls-MonthView__caption',
               TABLE: 'controls-MonthView__dayTable',
               TABLE_ROW: 'controls-MonthView__tableRow',
               DAY: 'controls-MonthView__tableElement',
               WEEK_SELECTED: 'controls-MonthView__weekSelected',
               WEEK_HOVERED: 'controls-MonthView__weekHovered',
               WEEK_ROW: 'controls-MonthView__tableRow',
               TODAY: 'controls-MonthView__today'
            }
         },

         _displayedStartValue: null,
         _displayedEndValue: null,
         _displayedRangeSelectionEnd: null,

         _modifyOptions: function() {
            var opts = MonthView.superclass._modifyOptions.apply(this, arguments),
               days = constants.Date.days,
               quantaCount = 0;
            // локализация может поменяться в рантайме, берем актуальный перевод месяцев при каждой инициализации компонента
            // В массиве дни недели находятся в таком же порядке как возвращаемые значения метода Date.prototype.getDay()
            // Перемещаем воскресение из начала массива в конец
            opts._days = days.slice(1);
            opts._days.push(days[0]);

            opts.month = opts.month || new Date();
            opts.month = DateUtil.normalizeMonth(opts.month);

            if (!isEmpty(opts.quantum)) { //  && options.selectionType === RangeSelectableViewMixin.selectionTypes.single
               for (var property in opts.quantum) {
                  if (opts.quantum.hasOwnProperty(property)) {
                     quantaCount += opts.quantum[property].length;
                     opts.quantum[property].sort(sortNumber);
                  }
               }
               if (quantaCount === 1) {
                  opts.selectionType = RangeSelectableViewMixin.selectionTypes.single;
               } else if (quantaCount > 1) {
                  opts.selectionType = RangeSelectableViewMixin.selectionTypes.range;
               }
            }

            return opts;
         },

         $constructor: function() {
            this._publish('onSelectionChange');
         },

         init: function() {
            MonthView.superclass.init.call(this);

            if (!this._options.month) {
               throw new Error('MonthView. Неверный формат даты');
            }

            this._updateDisplayedValues();
            this._attachEvents();
         },

         _attachEvents: function() {
            var self = this,
               container = this.getContainer(),
               itemCssClass = ['.', this._SELECTABLE_RANGE_CSS_CLASSES.item].join('');

            container.on('click.monthView', itemCssClass, this._onDayMouseClick.bind(this));

            if (!detection.isMobileIOS) {
               container.on('mouseenter.monthView', itemCssClass, function() {
                  self._onDayMouseEnter($(this));
               });
               container.on('mouseleave.monthView', this._onRangeControlMouseLeave.bind(this));
            }
         },

         _detachEvents: function() {
            this.getContainer().off('.monthView');
         },

         _onDayMouseClick: ifEnabled(function(event) {
            var t = $(event.currentTarget),
               date = this._getItemDate(t),
               range = this.updateRange(date, date);

            this._onRangeItemElementClick(range[0], range[1]);
         }),

         updateRange: function(startDate, endDate) {
            if (isEmpty(this._options.quantum)) {
               return this._normalizeRange(startDate, endDate);
            }

            var quantum = this._options.quantum,
               lastQuantumLength, lastQuantumType,
               days, range, start, end, i, date;

            if ('days' in quantum) {
               lastQuantumType = 'days';
               for (i = 0; i < quantum.days.length; i++) {
                  lastQuantumLength = quantum.days[i];
                  days = DateUtil.getDaysByRange(startDate, endDate) + 1;
                  if (quantum.days[i] >= days) {
                     return this._getDayRange(startDate, endDate, lastQuantumLength);
                  }
               }
            }
            if ('weeks' in quantum) {
               lastQuantumType = 'weeks';
               for (i = 0; i < quantum.weeks.length; i++) {
                  lastQuantumLength = quantum.weeks[i];
                  if (startDate <= endDate) {
                     start = DateUtil.getStartOfWeek(startDate);
                     end = DateUtil.getEndOfWeek(startDate);
                     end.setDate(end.getDate() + (lastQuantumLength - 1) * 7);
                  } else {
                     start = DateUtil.getStartOfWeek(startDate);
                     start.setDate(start.getDate() - (lastQuantumLength - 1) * 7);
                     end = DateUtil.getEndOfWeek(startDate);
                  }
                  if (endDate >= start && endDate <= end) {
                     return [start, end];
                  }
               }
            }
            if ('months' in quantum) {
               lastQuantumType = 'months';
               for (i = 0; i < quantum.months.length; i++) {
                  lastQuantumLength = quantum.months[i];
                  if (startDate <= endDate) {
                     start = DateUtil.getStartOfMonth(startDate);
                     end = DateUtil.getEndOfMonth(startDate);
                     end.setMonth(end.getMonth() + (lastQuantumLength - 1));
                  } else {
                     start = DateUtil.getStartOfMonth(startDate);
                     start.setMonth(start.getMonth() - (lastQuantumLength - 1));
                     end = DateUtil.getEndOfMonth(startDate);
                  }
                  if (endDate >= start && endDate <= end) {
                     return [start, end];
                  }
               }
            }

            if (lastQuantumType === 'days') {
               return this._getDayRange(startDate, endDate, lastQuantumLength);
            } else if (lastQuantumType === 'weeks') {
               date = new Date(startDate);
               date.setDate(date.getDate() + (lastQuantumLength - 1) * 7);
               if (startDate <= endDate) {
                  return [DateUtil.getStartOfWeek(startDate), DateUtil.getEndOfWeek(date)];
               } else {
                  return [DateUtil.getStartOfWeek(date), DateUtil.getEndOfWeek(startDate)];
               }
            } else if (lastQuantumType === 'months') {
               date = new Date(startDate);
               date.setMonth(date.getMonth() + lastQuantumLength - 1);
               if (startDate <= endDate) {
                  return [DateUtil.getStartOfMonth(startDate), DateUtil.getEndOfMonth(date)];
               } else {
                  return [DateUtil.getStartOfMonth(date), DateUtil.getEndOfMonth(startDate)];
               }
            }
         },

         _getDayRange: function(startDate, endDate, quantum) {
            var date = new Date(startDate);
            if (startDate <= endDate) {
               date.setDate(date.getDate() + quantum - 1);
               return [startDate, date];
            } else {
               date.setDate(date.getDate() - quantum + 1);
               return [date, startDate];
            }
         },

         _getWeekRange: function(startDate, endDate, quantum) {
            var date = new Date(startDate);
            if (startDate <= endDate) {
               date.setDate(date.getDate() + quantum - 1);
               return [startDate, date];
            } else {
               date.setDate(date.getDate() - quantum + 1);
               return [date, startDate];
            }
         },

         _getUpdatedRange: function(start, end, newRangeStart, newRangeEnd) {
            var range;

            if (newRangeStart) {
               return this.updateRange(start, newRangeStart);
            } else {
               if (!start && end) {
                  start = -Infinity;
               } else if (!end && start) {
                  end = Infinity;
               }
               range = this._normalizeRange(start, end);
            }

            return range;
         },

         _onDayBorderMouseClick: function(element, event) {
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
               // this._setSelectionType(selectionTypes.WEEK);
               this._onRangeItemElementClick(startDate, endDate);
            } else {
               // this._setSelectionType(selectionTypes.DAY);
               this._onRangeItemElementClick(date);
            }
         },

         _onDayMouseEnter: ifEnabled(function(element) {
            var date = this._getItemDate(element);
            this._onRangeItemElementMouseEnter(date);
         }),

         _onMouseLeave: ifEnabled(function() {
            var hoveredCls = ['.', this._MONTH_VIEW_CSS_CLASSES.WEEK_HOVERED].join('');
            this.getContainer().find(hoveredCls).removeClass(this._MONTH_VIEW_CSS_CLASSES.WEEK_HOVERED);
         }),

         /**
          * Устанавливает начальную выбранную дату
          * @param date {Date} дата
          * @param silent
          */
         setStartValue: function(date, silent) {
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
         setEndValue: function(date, silent) {
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
         setMonth: function(month) {
            var oldMonth = this._options.month;
            month = DateUtil.normalizeMonth(month);
            if (month === oldMonth ||
               (month && oldMonth && month.getTime() === this._options.month.getTime())) {
               return false;
            }
            this._options.month = month;
            this._updateCaption();
            this._drawMonthTable();
            // Обнуляем кэш выделяемых элементов.
            // TODO: переделать https://online.sbis.ru/opendoc.html?guid=0ceb4c76-2d17-40c8-a1fb-93213be84738
            this._$items = null;
            this._drawCurrentRangeSelection();
         },
         /**
          * Возвращает отображаемый месяц
          * @returns {undefined|*|number|Date|null}
          */
         getMonth: function() {
            return this._options.month;
         },

         getCaptionType: function() {
            return this._options.captionType;
         },

         getCaptionFormat: function() {
            return this._options.captionFormat;
         },

         isShowWeekdays: function() {
            return this._options.showWeekdays;
         },

         _updateCaption: function() {
            if (!this._options.captionType) {
               return;
            }
            this.getContainer().find('.' + this._MONTH_VIEW_CSS_CLASSES.CAPTION).text(this._options.month.strftime(this.getCaptionFormat()));
         },

         _getDaysArray: function() {
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
            dayOfWeek = workingDate.getDay() ? workingDate.getDay() : 7;
            days = this._daysInMonth(new Date(workingDate.setMonth(workingDate.getMonth() - 1)));
            workingDate = new Date(workingDate.getFullYear(), workingDate.getMonth() + 1, 2 - dayOfWeek);
            while( dayOfWeek - 1 > 0 ){
               this._pushDayIntoArray(week, new Date(workingDate), days - dayOfWeek + 2, false, false, 'prevMonth', false, dayOfWeek === 2);
               dayOfWeek--;
               workingDate.setDate(workingDate.getDate() + 1);
            }
            workingDate = new Date(date);

            // Заполняем календарные дни
            days = this._daysInMonth(date);
            for ( var i = 1; i <= days; i++ ){
               this._pushDayIntoArray(week, new Date(workingDate), i, true, isCurrentMonth && today === i, '', i === 1, i === days);

               if ( week.length == 7 ) {
                  weeksArray.push(week);
                  week = [];
               }
               workingDate.setDate(workingDate.getDate() + 1);
            }
            dayOfWeek = workingDate.getDay();
            dayOfWeek = dayOfWeek ? dayOfWeek - 1 : 6;
            // Добиваем календарь пустыми ячейками, если нужно (то есть, если последний день был не воскресеньем)
            if(dayOfWeek){
               days = 0;
               while( dayOfWeek != 7 ){
                  this._pushDayIntoArray(week, new Date(workingDate), dayOfWeek - workingDate.getDay() + 1, false, false, 'nextMonth', false, days === 0);
                  dayOfWeek++;
                  days++;
               }
               weeksArray.push(week);
               workingDate.setDate(workingDate.getDate() + 1);
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
            table.append(this._monthViewTableBodyTpl({
               weeksArray: weeksArray,
               _prepareClass: this._prepareClass,
               dayTmpl: this._options.dayTmpl
            }));
         },

         _getItemDate: function(jqObj) {
            if (!jqObj.hasClass(this._SELECTABLE_RANGE_CSS_CLASSES.item)) {
               jqObj = jqObj.closest(['.', this._SELECTABLE_RANGE_CSS_CLASSES.item].join(''));
            }
            return new Date( this._options.month.getFullYear(), this._options.month.getMonth(), jqObj.attr(this._selectedRangeItemIdAtr), 0, 0, 0, 0 );
         },

         _setSelectionRangeEndItem: function(item) {
            if (item && this._selectingRangeEnd && item.getTime() === this._selectingRangeEnd.getTime()) {
               return false;
            }
            return MonthView.superclass._setSelectionRangeEndItem.call(this, item);
         },

         _getSelectedRangeItemsIds: function(start, end) {
            var items = [],
               monthStartDate = new Date(this.getMonth().getFullYear(), this.getMonth().getMonth(), 1),
               monthEndDate = new Date(this.getMonth().getFullYear(), this.getMonth().getMonth() + 1, 0),
               startItem = start, endItem = end,
               startId = start === -Infinity ? monthStartDate.getDate() : start.getDate(),
               endId = end === Infinity ? monthEndDate.getDate() : end.getDate();

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

         cancelSelection: function() {
            var canceled = MonthView.superclass.cancelSelection.call(this);
            // if (canceled) {
            //    this._selectionType = null;
            // }
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
         _pushDayIntoArray: function(array, date, day, isCalendar, today, month, firstDayOfMonth, lastDayOfMonth) {
            var obj = {},
               selectionRangeEndItem = this._getSelectionRangeEndItem(),
               range = this._getUpdatedRange(this.getStartValue(), this.getEndValue(), selectionRangeEndItem),
               isSelectionForvard = selectionRangeEndItem >= this.getStartValue(),
               startDate = range[0],
               endDate = range[1];

            obj.date = date;
            obj.day = day;
            obj.dayOfWeek = date.getDay() ? date.getDay() - 1 : 6;
            obj.isCalendar = isCalendar;
            obj.today = today;
            obj.month = month;
            obj.firstDayOfMonth = firstDayOfMonth;
            obj.lastDayOfMonth = lastDayOfMonth;

            obj.selectionEnabled = this.getSelectionType() === RangeSelectableViewMixin.selectionTypes.range ||
               this.getSelectionType() === RangeSelectableViewMixin.selectionTypes.single;

            obj.weekend = obj.dayOfWeek === 5 || obj.dayOfWeek === 6;
            obj.enabled = this.isEnabled();

            obj.selected = (startDate && endDate && date >= startDate && date <= endDate) ||
               (startDate && DateUtil.isDatesEqual(date, startDate) && !endDate) ||
               (!startDate && endDate && DateUtil.isDatesEqual(date, endDate));

            obj.selectedStart = DateUtil.isDatesEqual(date, startDate || endDate);
            obj.selectedEnd = DateUtil.isDatesEqual(date, endDate);
            obj.selectionProcessing = this.isSelectionProcessing();

            obj.selectedUnfinishedStart = this.isSelectionProcessing() && DateUtil.isDatesEqual(date, startDate) &&
               !isSelectionForvard && !DateUtil.isDatesEqual(startDate, endDate);

            obj.selectedUnfinishedEnd = this.isSelectionProcessing() && DateUtil.isDatesEqual(date, endDate) &&
               isSelectionForvard && !DateUtil.isDatesEqual(startDate, endDate);

            obj.selectedInner = (date && startDate && endDate && date > startDate && date < endDate);
            
            if (this._options.dayFormatter) {
               merge(obj, this._options.dayFormatter(date) || {});
            }
            
            array.push(obj);
         },

         _prepareClass: function(scope) {
            scope = scope.value;

            var textColorClass = 'controls-MonthView__textColor',
               backgroundColorClass = 'controls-MonthView__backgroundColor',
               css = [];

            if (scope.isCalendar) {
               textColorClass += '-currentMonthDay';
               backgroundColorClass += '-currentMonthDay';
            } else {
               textColorClass += '-otherMonthDay';
               backgroundColorClass += '-otherMonthDay';
            }

            if (scope.weekend) {
               textColorClass += '-weekend';
               backgroundColorClass += '-weekend';
            } else {
               textColorClass += '-workday';
               backgroundColorClass += '-workday';
            }

            if (scope.selected) {
               backgroundColorClass += '-selected';
               if (scope.selectedStart || scope.selectedEnd) {
                  if (scope.selectionProcessing) {
                     backgroundColorClass += '-startend';
                  }
               }
            } else {
               backgroundColorClass += '-unselected';
            }

            if (!scope.enabled) {
               textColorClass += '-disabled';
               backgroundColorClass += '-disabled';
            }

            css.push(textColorClass, backgroundColorClass);

            // Оставляем старые классы т.к. они используются в большом выборе периода до его редизайна
            if (scope.isCalendar) {
               // if (scope.selectionEnabled) {
                  if (scope.enabled) {
                     css.push('controls-MonthView__cursor-item');
                     if (!scope.selected) {
                        css.push('controls-MonthView__border-currentMonthDay-unselected');
                     }
                  }
                  css.push('controls-RangeSelectable__item', 'controls-MonthView__selectableItem');
                  if (scope.enabled && scope.selectionEnabled) {
                     css.push('controls-MonthView__hover-selectableItem');
                  }
                  if (scope.selected) {
                     css.push('controls-MonthView__item-selected');
                  }

                  if (scope.selectedUnfinishedStart) {
                     css.push('controls-MonthView__item-selectedStart');
                  }
                  if (scope.selectedUnfinishedEnd) {
                     css.push('controls-MonthView__item-selectedEnd');
                  }
                  if (scope.selected && scope.selectedStart && !scope.selectedUnfinishedStart) {
                     css.push('controls-MonthView__item-selectedStart');
                  }
                  if (scope.selected && scope.selectedEnd && (!scope.selectionProcessing || (scope.selectedEnd !== scope.selectedStart && !scope.selectedUnfinishedEnd))) {
                     css.push('controls-MonthView__item-selectedEnd');
                  }
                  if (scope.selectedInner) {
                     css.push('controls-MonthView__item-selectedInner');
                  }
               // }

               if (scope.today) {
                  css.push('controls-MonthView__today');
               }
               css.push('controls-MonthView__dayNumber' + scope.day);
            }

            css.push(scope.isCalendar ? 'controls-MonthView__currentMonthDay' : 'controls-MonthView__' + scope.month);

            if (scope.weekend) {
               css.push('controls-MonthView__weekend');
            } else {
               css.push('controls-MonthView__workday');
            }

            if (scope.firstDayOfMonth) {
               css.push('controls-MonthView__firstDayOfMonth');
            }

            if (scope.lastDayOfMonth) {
               css.push('controls-MonthView__lastDayOfMonth');
            }

            return css.join(' ');
         },

         validateRangeSelectionItemsView: function() {
            var currentMonthStart = DateUtil.getStartOfMonth(this.getMonth()),
               currentMontEnd = DateUtil.getEndOfMonth(this.getMonth()),
               range = this._getUpdatedRange(this._displayedStartValue, this._displayedEndValue, this._displayedRangeSelectionEnd),
               newRange = this._getUpdatedRange(this.getStartValue(), this.getEndValue(), this._getSelectionRangeEndItem());

            if ((DateUtil.isRangesOverlaps(currentMonthStart, currentMontEnd, range[0], range[1]) || // обновляем если старый выбранный или новый период пересекаются с отображаемым месяцем
                  DateUtil.isRangesOverlaps(currentMonthStart, currentMontEnd, newRange[0], newRange[1])) &&
                  // не обновляем если отображаемый месяц полностью входит в старый и новый периоды
                  !(range[0] < currentMonthStart && newRange[0] < currentMonthStart && range[1] > currentMontEnd && newRange[1] > currentMontEnd)
               ) {
               MonthView.superclass.validateRangeSelectionItemsView.apply(this, arguments);
            }
         },

         _validateRangeSelectionItemsView: function() {
            this._updateDisplayedValues();
            MonthView.superclass._validateRangeSelectionItemsView.apply(this, arguments);
         },

         _updateDisplayedValues: function() {
            var range,
               changed = (this._displayedStartValue !== this.getStartValue() ||
               this._displayedEndValue !== this.getEndValue()) ||
               this._displayedRangeSelectionEnd !== this._rangeSelectionEnd;
            this._displayedStartValue = this.getStartValue();
            this._displayedEndValue = this.getEndValue();
            this._displayedRangeSelectionEnd = this._rangeSelectionEnd;
            if (changed) {
               range = this._getUpdatedRange(this._displayedStartValue, this._displayedEndValue, this._displayedRangeSelectionEnd)
               this._notify('onDisplayedRangeChanged', range[0], range[1]);
            }
         },

         _drawCurrentRangeSelection: function() {
            var days = this._getDaysArray(),
               domDays = this.getContainer().find('tbody>tr'),
               week, domWeek;

            MonthView.superclass._drawCurrentRangeSelection.apply(this, arguments);

            for (var i = 0; i < days.length; i++) {
               week = days[i];
               domWeek = domDays.eq(i).find('td');
               for (var j = 0; j < week.length; j++) {
                  this._updateCssClasses(domWeek.eq(j), this._prepareClass({value: week[j]}));
               }
            }
         },
         _updateCssClasses: function($element, classes) {
            var keep = this._getItemKeepCssClasses(),
               keepClasses = [];
            for (var i = 0; i < keep.length; i++){
               if ($element.hasClass(keep[i])) {
                  keepClasses.push(keep[i]);
               }
            }
            keepClasses.push(classes);
            $element.removeClass().addClass(keepClasses.join(' '));
         },

         _getItemKeepCssClasses: function() {
            return [
                  this._MONTH_VIEW_CSS_CLASSES.DAY,
                  this._SELECTABLE_RANGE_CSS_CLASSES.item,
                  this._SELECTABLE_RANGE_CSS_CLASSES.selected,
                  this._SELECTABLE_RANGE_CSS_CLASSES.selectedStart,
                  this._SELECTABLE_RANGE_CSS_CLASSES.selectedEnd
               ];
         },

         /**
          * Возвращает дату в нормальном виде(с обнуленным временем)
          * @param date {Date}
          * @returns {Date}
          * @private
          */
         _normalizeDate: function(date) {
            date = DateUtil.valueToDate(date);
            if(!(date instanceof Date)) {
               return null;
            }
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
         },

         _setEnabled: function(enabled) {
            var oldEnabled = this._enabledApplied;
            MonthView.superclass._setEnabled.apply(this, arguments);
            if (oldEnabled !== enabled) {
               this._drawMonthTable();
            }
         },

         destroy: function() {
            this._detachEvents();
            MonthView.superclass.destroy.apply(this, arguments);
         }
      });

      return MonthView;
   });
