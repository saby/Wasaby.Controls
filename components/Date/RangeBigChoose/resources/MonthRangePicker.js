define('SBIS3.CONTROLS/Date/RangeBigChoose/resources/MonthRangePicker', [
   "Core/constants",
   "Core/Deferred",
   "SBIS3.CONTROLS/ListView",
   "SBIS3.CONTROLS/Date/RangeBigChoose/resources/CalendarSource",
   "tmpl!SBIS3.CONTROLS/Date/RangeBigChoose/resources/MonthRangePickerItem",
   "SBIS3.CONTROLS/Mixins/RangeMixin",
   "SBIS3.CONTROLS/Mixins/RangeSelectableViewMixin",
   "WS.Data/Source/Base",
   "Core/core-instance",
   "SBIS3.CONTROLS/Utils/DateUtil",
   "SBIS3.CONTROLS/Date/RangeBigChoose/resources/MonthView"
], function ( constants, Deferred, ListView, CalendarSource, ItemTmpl, RangeMixin, RangeSelectableViewMixin, Base, cInstance, dateUtils) {
   'use strict';

   var _startingOffset = 1000000;

   var yearSource = new CalendarSource();

   /**
    * SBIS3.CONTROLS/Date/RangeBigChoose/resources/MonthRangePicker
    * @class SBIS3.CONTROLS/Date/RangeBigChoose/resources/MonthRangePicker
    * @extends SBIS3.CONTROLS/ListView
    * @author Миронов А.Ю.
    * @control
    * @mixes SBIS3.CONTROLS/Mixins/RangeSelectableViewMixin
    * @mixes SBIS3.CONTROLS/Mixins/RangeMixin
    */
   var MonthRangePicker = ListView.extend([RangeSelectableViewMixin, RangeMixin], /** @lends SBIS3.CONTROLS/Date/RangeBigChoose/resources/MonthRangePicker.prototype */{
      $protected: {
         _options: {
            liveSelection: true,

            // x: monthSource,
            // dataSource: monthSource,
            idProperty: 'id',
            /**
             * @cfg {Number} отображаемый год
             */
            year: null,
            itemTpl: ItemTmpl,
            // infiniteScroll: 'both',
            // infiniteScrollContainer: '.controls-DateRangeBigChoose__months-month',
            pageSize: 1,

            // scrollWatcher: ScrollWatcher,
            cssClassName: 'controls-DateRangeBigChoose-MonthRangePicker'
         },
         _lastOverControl: null,
         _offset: CalendarSource.defaultOffset,

         _css_classes: {
            hovered: 'controls-DateRangeBigChoose-MonthRangePicker__hovered'
         },

         _innerComponentsValidateTimer: null,

         _SELECTABLE_RANGE_CSS_CLASSES: {
            // rangeselect: 'controls-RangeSelectable__rangeselect',
            item: 'controls-DateRangeBigChoose-MonthRangePickerItem__item',
            selected: 'controls-DateRangeBigChoose-MonthRangePickerItem__item-selected',
            selectedStart: 'controls-DateRangeBigChoose-MonthRangePickerItem__item-selectedStart',
            selectedEnd: 'controls-DateRangeBigChoose-MonthRangePickerItem__item-selectedEnd',
            selecting: 'controls-RangeSelectable__selecting'
         },
      },
      
      $constructor: function () {
         this._publish('onMonthActivated');
      },

      init: function () {
         var self = this,
            container = this.getContainer(),
            year;
         // Представление обновляется только в setYear и в любом случае будет использоваться год установленный в setYear
         // TODO: Сделать, что бы компонент рендерился при построении если чузер открыт в режиме года.
         // if (!this._options.year) {
         //    this._options.year = (new Date()).getFullYear();
         // }

         MonthRangePicker.superclass.init.call(this);

         this.setDataSource(yearSource, true);
         // this._scrollWatcher.subscribe('onScroll', this._onScroll.bind(this));

         this._onMonthActivated = this._onMonthActivated.bind(this);
         this._onMonthCaptionClick = this._onMonthCaptionClick.bind(this);
         // this._onItemEnter = this._onItemEnter.bind(this);

         container.on('click', '.controls-DateRangeBigChoose-MonthRangePickerItem__month_title',
            this._onMonthCaptionClick.bind(this));
         container.on('mouseenter', '.controls-DateRangeBigChoose-MonthRangePickerItem__month_title',
            this._onItemCaptionMouseEnter.bind(this));
         container.on('mouseleave', '.controls-DateRangeBigChoose-MonthRangePickerItem__month_title',
            this._onItemCaptionMouseLeave.bind(this));
         container.on('mouseleave', this._onRangeControlMouseLeave.bind(this));

         container.on('click', '.controls-DateRangeBigChoose-MonthRangePickerItem__halfyear-quarter-button',
            this._onHalfyearQuarterClick.bind(this));

         container.on('mouseenter', '.controls-DateRangeBigChoose-MonthRangePickerItem__halfyear-quarter-button',
            this._onHalfyearQuarterMouseEnter.bind(this));
         container.on('mouseleave', '.controls-DateRangeBigChoose-MonthRangePickerItem__halfyear-quarter-button',
            this._onHalfyearQuarterMouseLeave.bind(this));
      },

      _onHalfyearQuarterClick: function (event) {
         var element = $(event.target),
            year = Date.fromSQL(element.closest('.controls-DateRangeBigChoose-MonthRangePickerItem').data('date')),
            rangeId = element.data('id');
         if (element.hasClass('controls-DateRangeBigChoose-MonthRangePickerItem__quartersPanel-button')) {
            this.setRange(new Date(year.getFullYear(), rangeId*3), new Date(year.getFullYear(), 3 + rangeId*3, 0));
         } else {
            this.setRange(new Date(year.getFullYear(), rangeId*6), new Date(year.getFullYear(), 6 + rangeId*6, 0));
         }
         this._notify('onSelectionEnded');
      },
      _onHalfyearQuarterMouseEnter: function (event) {
         var element = $(event.target),
            item = element.closest('.controls-DateRangeBigChoose-MonthRangePickerItem'),
            periodId = element.data('id'),
            selectedClass;
         if (element.hasClass('controls-DateRangeBigChoose-MonthRangePickerItem__quartersPanel-button')) {
            selectedClass = '.controls-DateRangeBigChoose-MonthRangePickerItem__quarter';
         } else {
            selectedClass = '.controls-DateRangeBigChoose-MonthRangePickerItem__halfYear';
         }
         item.find(selectedClass + '[data-id="' + periodId + '"]')
            .addClass('controls-DateRangeBigChoose-MonthRangePickerItem__period-selected');
      },
      _onHalfyearQuarterMouseLeave: function (event) {
         var element = $(event.target),
            item = element.closest('.controls-DateRangeBigChoose-MonthRangePickerItem'),
            periodId = element.data('id'),
            selectedClass;
         if (element.hasClass('controls-DateRangeBigChoose-MonthRangePickerItem__quartersPanel-button')) {
            selectedClass = '.controls-DateRangeBigChoose-MonthRangePickerItem__quarter';
         } else {
            selectedClass = '.controls-DateRangeBigChoose-MonthRangePickerItem__halfYear';
         }
         item.find(selectedClass + '[data-id="' + periodId + '"]')
            .removeClass('controls-DateRangeBigChoose-MonthRangePickerItem__period-selected');
      },

      _onScroll: function(event, type) {
         if (type === 'top') {
            this._options.year -= 1;
         } else {
            this._options.year += 1;
         }
         this._notify('yearChanged', this._options.year);
      },

      setYear: function (year) {
         if (this._options.year === year) {
            return;
         }
         this._options.year = year;
         // TODO: временный хак. Базовый класс не релоудит данные если не установлен showPaging
         this.setOffset(this._getOffsetByYear(year));
         // this.setPage(pageNumber);
         this.reload();
      },

      getYear: function () {
         return this._options.year;
      },

      showNextYear: function () {
         this.setPage(this.getPage() + 1);
      },

      showPrevYear: function () {
         this.setPage(this.getPage() - 1);
      },

      _getOffsetByYear: function (year) {
         return _startingOffset + (year - (new Date()).getFullYear()) * this.getPageSize();
      },

      setEndValue: function (end, silent) {
         var changed;
         changed = MonthRangePicker.superclass.setEndValue.call(this, end, silent);
         if (changed) {
            this._updateSelectionInInnerComponents();
         }
         return changed;
      },

      setStartValue: function (start, silent) {
         var changed = MonthRangePicker.superclass.setStartValue.apply(this, arguments);
         if (changed) {
            this._updateSelectionInInnerComponents()
         }
         return changed;
      },

      _drawItemsCallback: function () {
         var self = this,
             container;
         MonthRangePicker.superclass._drawItemsCallback.apply(this, arguments);
         this._$items = null;
         this.forEachMonthView(function(control) {
            container = control.getContainer();
            container.attr(self._selectedRangeItemIdAtr, self._selectedRangeItemToString(control.getMonth()));
            // container.off("mouseenter", self._onItemEnter);
            // container.mouseenter(self._onItemEnter);
            control.unsubscribe('onMonthActivated', self._onMonthActivated);
            control.subscribe('onMonthActivated', self._onMonthActivated);
         });
         if (!this.isSelectionProcessing()) {
            this._updateSelectionInInnerComponents();
         }
      },

      _onItemCaptionMouseEnter: function (e) {
         var $target = $(e.target);
         this._onRangeItemElementMouseEnter(dateUtils.getEndOfMonth(Date.fromSQL($target.data('date'))));
      },

      _onItemCaptionMouseLeave: function (e) {
         var $target = $(e.target),
            target;

         target = $target.closest('.controls-RangeSelectable__item', this._getItemsContainer());
         target.removeClass(this._css_classes.hovered);
      },

      _getEndValueOnMouseLeave: function () {
         return dateUtils.getEndOfMonth(this.getStartValue());
      },

      _onMonthActivated: function (e) {
         this._notify('onMonthActivated', e.getTarget().getMonth());
      },

      _selectedRangeItemToString: function (date) {
         return dateUtils.getStartOfMonth(date).toSQL();
      },

      _getSelectedRangeItemsIds: function (start, end) {
         var items = [],
            _start = start;
         // Если контрол находится не в режиме выделения, то выделенные элементы не рисуем.
         if (!this.isSelectionProcessing()) {
            return {items: [], start: null, end: null};
         }
         while (_start <= end) {
            items.push(this._selectedRangeItemToString(_start));
            _start = new Date(_start.getFullYear(), _start.getMonth() + 1, 1);
         }
         return {
            items: items,
            start: this._selectedRangeItemToString(start),
            end: this._selectedRangeItemToString(end)
         };
      },

      _getSelectedRangeItemsContainers: function () {
         if (!this._$items) {
            this._$items = this.getContainer().find(['.', this._SELECTABLE_RANGE_CSS_CLASSES.item].join(''));
         }
         return this._$items;
      },

      _onMonthCaptionClick: function (e) {
         var month = Date.fromSQL($(e.target).data('date'));
         this._onRangeItemElementClick(month, new Date(month.getFullYear(), month.getMonth() + 1, 0));
         if (!this.isSelectionProcessing()) {
            this._updateSelectionInInnerComponents();
         }
      },

      // _onItemEnter: function (e) {
      //    this._onRangeItemElementMouseEnter(Date.fromSQL($(e.currentTarget).attr(this._selectedRangeItemIdAtr)));
      // },


      _updateSelectionInInnerComponents: function () {
         if (!this._innerComponentsValidateTimer) {
            this._innerComponentsValidateTimer = setTimeout(this._validateInnerComponents.bind(this), 0);
         }
      },

      _validateInnerComponents: function () {
         this._innerComponentsValidateTimer = null;
         this.forEachMonthView(function(control) {
            if (this._isMonthView(control)) {
               control.setRange(this.getStartValue(), this.getEndValue(), true);
            }
         }.bind(this));
      },

      _isMonthView: function (control) {
         return cInstance.instanceOfModule(control, 'SBIS3.CONTROLS/Date/RangeBigChoose/resources/MonthView');
      },

      forEachMonthView: function (func) {
         var self = this;
         this.getChildControls().forEach(function(control) {
            // Почему то в control иногда попадают левые контролы
            if (self._isMonthView(control)) {
               func(control);
            }
         });
      },

      _prepareRangeCssClasses: function (date) {
         var textColorClass = prefix,
            css = [];

         if (scope.year.selected) {
            css.push('controls-RangeSelectable__item-selected');
            css.push(prefix + '-selected');
         }
         if (scope.year.selectedUnfinishedStart || scope.year.selectedUnfinishedEnd) {
            css.push(prefix + '-selectedUnfinishedEdge');
         }
         if (scope.year.selectedInner) {
            css.push(prefix + '-selectedInner');
         }

         if (scope.year.selectedStart && !(scope.year.selectedUnfinishedStart || scope.year.selectedUnfinishedEnd)) {
            css.push('controls-RangeSelectable__item-selectedStart');
            css.push(prefix + '-selectedStart');
         }
         if (scope.year.selectedEnd && !(scope.year.selectedUnfinishedStart || scope.year.selectedUnfinishedEnd)) {
            css.push('controls-RangeSelectable__item-selectedEnd');
            css.push(prefix + '-selectedEnd');
         }
         if (scope.year.selectedUnfinishedstart) {
            css.push(prefix + '-selectedUnfinishedStart');
         }
         if (scope.year.selectedUnfinishedEnd) {
            css.push(prefix + '-selectedUnfinishedEnd');
         }

         if (scope.year.displayed) {
            textColorClass += '-displayed'
         } else if (scope.year.current) {
            textColorClass += '-current'
         }

         css.push(textColorClass);
         return css.join(' ');
      },

      _drawCurrentRangeSelection: function () {
         var domDays = this.getContainer().find('.controls-DateRangeBigChoose-MonthRangePickerItem__month-wrapper'),
            week, domWeek;

         MonthRangePicker.superclass._drawCurrentRangeSelection.apply(this, arguments);


         // for (var i = 0; i < days.length; i++) {
         //    week = days[i];
         //    domWeek = domDays.eq(i).find('td');
         //    for (var j = 0; j < week.length; j++) {
         //       this._updateCssClasses(domWeek.eq(j), this._prepareClass({value: week[j]}));
         //    }
         // }
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
               this._SELECTABLE_RANGE_CSS_CLASSES.item,
               this._SELECTABLE_RANGE_CSS_CLASSES.selected,
               this._SELECTABLE_RANGE_CSS_CLASSES.selectedStart,
               this._SELECTABLE_RANGE_CSS_CLASSES.selectedEnd,
            ];
      }

   });
   return MonthRangePicker;
});
