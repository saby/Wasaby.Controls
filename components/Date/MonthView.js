/**
 * TODO Компонент пока тестировался только в Chrome
 */
define(
   'SBIS3.CONTROLS/Date/MonthView',
   [
      'Core/constants',
      'Lib/Control/CompoundControl/CompoundControl',
      'SBIS3.CONTROLS/Mixins/RangeMixin',
      'SBIS3.CONTROLS/Mixins/DateRangeMixin',
      'SBIS3.CONTROLS/Mixins/RangeSelectableViewMixin',
      'SBIS3.CONTROLS/Utils/DateUtil',
      'tmpl!SBIS3.CONTROLS/Date/MonthView/MonthViewTableBody',
      'tmpl!SBIS3.CONTROLS/Date/MonthView/MonthView',
      'tmpl!SBIS3.CONTROLS/Date/MonthView/day',
      'SBIS3.CONTROLS/Date/MonthPicker',
      'i18n!SBIS3.CONTROLS/Calendar',
      'css!SBIS3.CONTROLS/Date/MonthView/MonthView'
   ],
   function (constants, CompoundControl, RangeMixin, DateRangeMixin, RangeSelectableViewMixin, DateUtil, monthViewTableBodyTpl, dotTplFn, dayTmpl) {

      'use strict';

      /**
       * Календарь отображающий 1 месяц.
       * Предназначен для задания даты или диапазона дат в рамках одного месяца путём выбора.
       * @class SBIS3.CONTROLS.MonthView
       * @extends SBIS3.CORE.CompoundControl
       * @control
       * @public
       * @author Миронов А.Ю.
       * @demo SBIS3.CONTROLS.Demo.MyMonthView
       *
       * @mixes SBIS3.CONTROLS.RangeSelectableViewMixin
       * @mixes SBIS3.CONTROLS.RangeMixin
       * @mixes SBIS3.CONTROLS.DateRangeMixin
       *
       */
      // var selectionTypes = {WEEK: 'week', DAY: 'day'};

      // TODO: нужно ли наследование от FormWidgetMixin ??
      var MonthView = CompoundControl.extend([RangeSelectableViewMixin, RangeMixin, DateRangeMixin], /** @lends SBIS3.CONTROLS.MonthView.prototype */{
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
                * @cfg {Array}
                */
               periodQuanta: null,

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

         _modifyOptions: function() {
            var opts = MonthView.superclass._modifyOptions.apply(this, arguments),
               days = constants.Date.days;
            // локализация может поменяться в рантайме, берем актуальный перевод месяцев при каждой инициализации компонента
            // В массиве дни недели находятся в таком же порядке как возвращаемые значения метода Date.prototype.getDay()
            // Перемещаем воскресение из начала массива в конец
            opts._days = days.slice(1);
            opts._days.push(days[0]);

            opts.month = opts.month || new Date();
            opts.month = DateUtil.normalizeMonth(opts.month);

            return opts;
         },

         $constructor: function () {
            this._publish('onSelectionChange');
         },

         init: function () {
            MonthView.superclass.init.call(this);

            var self = this;

            if (!this._options.month) {
               throw new Error('MonthView. Неверный формат даты');
            }

            this._drawMonthTable();
            this._drawCurrentRangeSelection();

            this.getContainer().mouseleave(this._onRangeControlMouseLeave.bind(this));

            // this._updateCaption();
            this._attachEvents();
         },

         _attachEvents: function () {
            var self = this,
               container = this.getContainer(),
               itemCssClass = ['.', this._SELECTABLE_RANGE_CSS_CLASSES.item].join('');

            if (this.isEnabled()) {
               container.on('click', itemCssClass, this._onDayMouseClick.bind(this));

               container.on('mouseenter', itemCssClass, function () {
                  self._onDayMouseEnter($(this));
               });
            }
         },

         // _setSelectionType: function (value) {
         //    this._options.selectionType = value;
         // },
         // _getSelectionType: function () {
         //    return this._options.selectionType;
         // },

         _onDayMouseClick: function (event) {
            var t = $(event.currentTarget),
               date;
            // Начинаем выделение по дням или по месяцам в зависимости от того на какую область дня нажал пользователь,
            // завершаем выделение независимо от того в какую область дня нажал пользователь.
            if (this.isSelectionProcessing()) {
               date = this._getItemDate(t);
               // if (this._getSelectionType() === selectionTypes.WEEK) {
               //    if (date < this.getStartValue()) {
               //       date = this._getStartOfWeek(date);
               //    } else if (date > this.getEndValue()) {
               //       date = this._getEndOfWeek(date);
               //    }
               // }
               this._onRangeItemElementClick(date);
               // this._setSelectionType(null);
            } else {
               this._onDayTitleMouseClick(t, event);
            }
         },

         _onDayTitleMouseClick: function (element, event) {
            var date;
            if (!this.isSelectionProcessing()) {
               // this._setSelectionType(selectionTypes.DAY);
               date = this._getItemDate(element);
               if (this.isRangeselect()) {
                  this._onRangeItemElementClick(date);
               } else {
                  this._onRangeItemElementClick(date, date);
               }
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
               // this._setSelectionType(selectionTypes.WEEK);
               this._onRangeItemElementClick(startDate, endDate);
            } else {
               // this._setSelectionType(selectionTypes.DAY);
               this._onRangeItemElementClick(date);
            }
         },

         _onDayMouseEnter: function (element) {
            var date = this._getItemDate(element);
            // if (this._getSelectionType() === selectionTypes.WEEK) {
            //    if (date < this.getStartValue()) {
            //       date = this._getStartOfWeek(date);
            //    } else if (date > this.getEndValue()) {
            //       date = this._getEndOfWeek(date);
            //    }
            // }
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
            this.getContainer().find('.' + this._MONTH_VIEW_CSS_CLASSES.CAPTION).text(this._options.month.strftime(this.getCaptionFormat()));
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
         _pushDayIntoArray: function (array, date, day, isCalendar, today, month, firstDayOfMonth, lastDayOfMonth) {
            var obj = {},
               selectionRangeEndItem = this._getSelectionRangeEndItem(),
               range = this._getUpdatedRange(this.getStartValue(), this.getEndValue(), selectionRangeEndItem),
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
            obj.selected = date >= startDate && date <= endDate;
            obj.selectedStart = DateUtil.isDatesEqual(date, startDate);
            obj.selectedEnd = DateUtil.isDatesEqual(date, endDate);

            obj.selectedUnfinishedStart = DateUtil.isDatesEqual(date, startDate) &&
               DateUtil.isDatesEqual(date, selectionRangeEndItem) && !DateUtil.isDatesEqual(startDate, endDate);

            obj.selectedUnfinishedEnd = DateUtil.isDatesEqual(date, endDate) &&
               DateUtil.isDatesEqual(date, selectionRangeEndItem) && !DateUtil.isDatesEqual(startDate, endDate);

            obj.selectedInner = (date && startDate && endDate && date.getTime() > startDate.getTime() && date.getTime() < endDate.getTime());

            array.push(obj);
         },

         _prepareClass: function (scope) {
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
            } else {
               backgroundColorClass += '-unselected';
            }

            if (scope.enabled) {
               textColorClass += '-enabled';
               backgroundColorClass += '-enabled';
            } else {
               textColorClass += '-disabled';
               backgroundColorClass += '-disabled';
            }

            css.push(textColorClass, backgroundColorClass);

            // Оставляем старые классы т.к. они используются в большом выборе периода до его редизайна
            if (scope.isCalendar) {
               if (scope.selectionEnabled) {
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
                     css.push('controls-MonthView__item-selectedStart-unfinished');
                  }
                  if (scope.selectedUnfinishedEnd) {
                     css.push('controls-MonthView__item-selectedEnd-unfinished');
                  }
                  if (scope.selected && scope.selectedStart && !scope.selectedUnfinishedStart) {
                     css.push('controls-MonthView__item-selectedStart');
                  }
                  if (scope.selected && scope.selectedEnd && !scope.selectedUnfinishedEnd) {
                     css.push('controls-MonthView__item-selectedEnd');
                  }
                  if (scope.selectedInner) {
                     css.push('controls-MonthView__item-selectedInner');
                  }
               }

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

            return css.join(' ')
         },

         _drawCurrentRangeSelection: function () {
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
         _updateCssClasses: function ($element, classes) {
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

         _getItemKeepCssClasses: function () {
            return [
                  this._MONTH_VIEW_CSS_CLASSES.DAY,
                  this._SELECTABLE_RANGE_CSS_CLASSES.item,
                  this._SELECTABLE_RANGE_CSS_CLASSES.selected,
                  this._SELECTABLE_RANGE_CSS_CLASSES.selectedStart,
                  this._SELECTABLE_RANGE_CSS_CLASSES.selectedEnd,
               ];
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

         destroy: function() {
            this.getContainer().find('.' + this._MONTH_VIEW_CSS_CLASSES.TABLE).off('click mouseenter mouseleave');
            MonthView.superclass.destroy.apply(this, arguments);
         }
      });

      return MonthView;
   });
