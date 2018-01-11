define('SBIS3.CONTROLS/Date/RangeBigChoose/resources/DateRangePicker', [
   "Core/constants",
   "Core/Deferred",
   "SBIS3.CONTROLS/ListView",
   "tmpl!SBIS3.CONTROLS/Date/RangeBigChoose/resources/DateRangePickerItem",
   "SBIS3.CONTROLS/Mixins/RangeMixin",
   "WS.Data/Source/Base",
   "SBIS3.CONTROLS/Utils/DateUtil",
   "Core/core-instance",
   'SBIS3.CONTROLS/Date/RangeBigChoose/resources/CalendarSource',
   'Lib/LayoutManager/LayoutManager',
   'SBIS3.CONTROLS/Mixins/RangeSelectableViewMixin',
   "SBIS3.CONTROLS/Date/RangeBigChoose/resources/MonthView"
], function (constants, Deferred, ListView, ItemTmpl, RangeMixin, Base, DateUtils, cInstance, CalendarSource, LayoutManager, RangeSelectableViewMixin) {
   'use strict';

   var monthSource = new CalendarSource();

   /**
     * SBIS3.CONTROLS.DateRangeBig.DateRangePicker
     * @class SBIS3.CONTROLS.DateRangeBig.DateRangePicker
     * @extends SBIS3.CONTROLS/ListView
     * @author Миронов А.Ю.
     * @control
     * @mixes SBIS3.CONTROLS/Mixins/RangeMixin
     */
   var Component = ListView.extend([RangeMixin], /** @lends SBIS3.CONTROLS.DateRangeBig.DateRangePicker.prototype */{
      $protected: {
         _options: {
            selectionType: 'single',
            month: null,
            idProperty: 'id',
            itemTpl: ItemTmpl,
            // infiniteScroll: 'both',
            pageSize: 1,
            cssClassName: 'controls-DateRangeBigChoose-DateRangePicker'
         },
         _lastOverControl: null,
         _offset: CalendarSource.defaultOffset,
         _innerComponentsValidateTimer: null,
         _selectionRangeEndItem: null,
         // _selectionType: null
      },
      $constructor: function () {
         this._publish('onMonthActivated');
      },

      init: function () {
         var self = this,
            container = this.getContainer(),
            now = new Date();

         this._onMonthViewRageChanged = this._onMonthViewRageChanged.bind(this);
         this._onMonthViewBeforeSelectionStarted = this._onMonthViewBeforeSelectionStarted.bind(this);
         this._onMonthViewSelectingRangeEndDateChange = this._onMonthViewSelectingRangeEndDateChange.bind(this);
         this._onMonthViewCaptionActivated = this._onMonthViewCaptionActivated.bind(this);
         this._onSelectionEnded = this._onSelectionEnded.bind(this);

         // Представление обновляется только в setMonth и в любом случае будет использоваться месяц установленный в  setMonth
         // TODO: Сделать, что бы компонент рендерился при построении если чузер открыт в режиме месяца. Тоже самое для режима года и для MonthPicker
         // if (this._options.month) {
         //    this._options.month = DateUtils.normalizeMonth(this._options.month);
         // } else {
         //    this._options.month = (new Date(now.getFullYear(), now.getMonth(), 1));
         // }

         Component.superclass.init.call(this);

         this.subscribe('onDrawItems', this._onDateRangePickerDrawItems.bind(this));

         this.setDataSource(monthSource, true);
         setTimeout(this._updateMonthsPosition.bind(this), 0);
         container.on('click', '.controls-DateRangeBigChoose-DateRangePickerItem__monthsWithDates_item_title', this._onMonthTitleClick.bind(this));
         container.on('click', '.controls-DateRangeBigChoose-DateRangePickerItem__months-nextyear-btn', this._onNextYearClick.bind(this));
         container.on('click', '.controls-DateRangeBigChoose-DateRangePickerItem__months-btn', this._onMonthClick.bind(this));
      },

      // _modifyOptions: function (options) {
      //    options = Component.superclass._modifyOptions.apply(this, arguments);
      //    options._monthsNames = constants.Date.longMonths;
      //    return options;
      // },

      _onMonthTitleClick: function (event) {
         var date = new Date.fromSQL($(event.target).data('date'));
         this.setRange(date, DateUtils.getEndOfMonth(date));
         this._notify('onSelectionEnded');
      },

      _onNextYearClick: function (event) {
         var date = new Date.fromSQL($(event.target).data('date'));
         this.setMonth(new Date(date.getFullYear() + 1, 0));
      },

      _onMonthClick: function (event) {
         var date = new Date.fromSQL($(event.target).data('date'));
         this.setMonth(date);
      },

      setMonth: function (month) {
         var oldMonth = this._options.month,
            displayedMonth;
         month = DateUtils.normalizeMonth(month);

         if (DateUtils.isDatesEqual(month, oldMonth)) {
            return;
         }
         this._options.month = month;
         if (!DateUtils.isYearsEqual(month, oldMonth)) {
            // TODO: временный хак. Базовый класс не релоудит данные если не установлен showPaging
            this.setOffset(this._getOffsetByMonth(month));
            this.reload();
         }

         this._updateMonthsPosition();
         this._notify('onYearChanged');
      },

      getMonth: function () {
         return this._options.month;
      },

      isSelectionProcessing: function () {
         return !!this._selectionRangeEndItem;
      },

      _getOffsetByMonth: function (month) {
         var now = new Date();
         return CalendarSource.defaultOffset + (month.getFullYear() - now.getFullYear()) * this.getPageSize();
      },

      _onDateRangePickerDrawItems: function () {
         var self = this,
            // controls = this.getItemsInstances(),
            control;
         Component.superclass._drawItemsCallback.apply(this, arguments);
         this.forEachMonthView(function(control) {
            control.unsubscribe('onSelectionEnded', self._onSelectionEnded);
            control.subscribe('onSelectionEnded', self._onSelectionEnded);
            control.unsubscribe('onRangeChange', self._onMonthViewRageChanged);
            control.subscribe('onRangeChange', self._onMonthViewRageChanged);
            control.unsubscribe('onBeforeSelectionStarted', self._onMonthViewBeforeSelectionStarted);
            control.subscribe('onBeforeSelectionStarted', self._onMonthViewBeforeSelectionStarted);
            control.unsubscribe('onSelectingRangeEndDateChange', self._onMonthViewSelectingRangeEndDateChange);
            control.subscribe('onSelectingRangeEndDateChange', self._onMonthViewSelectingRangeEndDateChange);
         });
         this._updateSelectionInInnerComponents();
         this._updateMonthsPosition();
      },

      _onSelectionEnded: function () {
         this._notify('onSelectionEnded');
      },

      _updateMonthsPosition: function () {
         if (!this._options.month) {
            return;
         }
         var displayedMonth = this.getContainer().find('.controls-DateRangeBigChoose-DateRangePickerItem__monthsWithDates_item_wrapper[data-date="' + this._options.month.toSQL() + '"]');
         LayoutManager.scrollToElement(displayedMonth);

         this.getContainer().find('.controls-DateRangeBigChoose-DateRangePickerItem__monthsWithDates_item-displayed')
            .removeClass('controls-DateRangeBigChoose-DateRangePickerItem__monthsWithDates_item-displayed');
         displayedMonth.addClass('controls-DateRangeBigChoose-DateRangePickerItem__monthsWithDates_item-displayed');
      },

      setStartValue: function (start, silent) {
         var changed = Component.superclass.setStartValue.apply(this, arguments);
         if (changed) {
            this._updateSelectionInInnerComponents();
         }
         return changed;
      },

      setEndValue: function (end, silent) {
         var changed = Component.superclass.setEndValue.apply(this, arguments);
         if (changed) {
            this._updateSelectionInInnerComponents();
         }
         return changed;
      },

      setRange: function (start, end, silent) {
         var oldStart, oldEnd, month, changed;

         if (this._options.selectionType === RangeSelectableViewMixin.selectionTypes.range) {
            // oldStart = this.getStartValue();
            // oldEnd = this.getEndValue();
            changed = Component.superclass.setRange.apply(this, arguments);
            // start = this.getStartValue();
            // end = this.getEndValue();
            if (changed) {
               month = this.getMonth();
               // if (!DateUtils.isDatesEqual(start, oldStart) && !DateUtils.isDatesEqual(end, oldEnd)) {
               if (month && start && end && (start > new Date(month.getFullYear(), month.getMonth() + 1, 0) || end < month)) {
                  this.setMonth(start);
               }
            }
         } else {
            changed = Component.superclass.setRange.apply(this, arguments);
         }
         return changed;
      },

      _prepareItemData: function () {
         var args = Component.superclass._prepareItemData.apply(this, arguments);
         args.selectionType = this._options.selectionType;
         return args;
      },

      _onMonthViewCaptionActivated: function (e) {
         this._notify('onActivated', e.getTarget().getMonth());
      },

      _onMonthViewRageChanged: function (e, start, end) {
         this.setRange(start, end);
      },

      _onMonthViewSelectingRangeEndDateChange: function (e, date, _date) {
         // this._selectionType = selectionType;
         this._selectionRangeEndItem = date;
         this.forEachMonthView(function(control) {
            if (e.getTarget() !== control) {
               control._setSelectionRangeEndItem(date, true);
            }
         });
      },

      _onMonthViewBeforeSelectionStarted: function (e, start, end) {
         // Сохраняем состояние календаря, в котором начилось выделение, непосредственно перед началом выделения
         // потому что во время выделения, он может быть удален если инициируется смена месяца.
         // В этом случае обрабочик _onMonthViewSelectingRangeEndDateChange не будет выполнен.
         // this._selectionType = e.getTarget()._getSelectionType();
         this._selectionRangeEndItem = end;
      },

      // _updateInnerComponents: function (start, end) {
      //    this.forEachMonthView(function(control) {
      //       control.setRange(start, end, true);
      //    });
      // },

      _updateSelectionInInnerComponents: function () {
         if (!this._innerComponentsValidateTimer) {
            this._innerComponentsValidateTimer = setTimeout(this._validateInnerComponents.bind(this), 0);
         }
      },

      startSelection: function (start, end) {
         // this._selectionType = 'day';
         this._selectionRangeEndItem = end;
         this.setRange(start, start, true);
         this._updateSelectionInInnerComponents();
      },

      _validateInnerComponents: function () {
         this._innerComponentsValidateTimer = null;
         this.forEachMonthView(function(control) {
            if (this._isMonthView(control)) {
               // control._setSelectionType(this._selectionType);
               control._setSelectionRangeEndItem(this._selectionRangeEndItem, true);
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
            if (self._isMonthView(control)) {
               func(control);
            }
         });
      },

      cancelSelection: function () {
         this._selectionRangeEndItem = null;
         // this._selectionType = null;
         this.forEachMonthView(function (control) {
            control.cancelSelection();
         });
      }

   });
   return Component;
});
