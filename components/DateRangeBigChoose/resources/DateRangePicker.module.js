define('js!SBIS3.CONTROLS.DateRangeBigChoose.DateRangePicker', [
   'js!SBIS3.CONTROLS.ListView',
   'html!SBIS3.CONTROLS.DateRangeBigChoose/resources/DateRangePickerItem',
   'js!SBIS3.CONTROLS.RangeMixin',
   'js!WS.Data/Source/Base',
   'js!SBIS3.CONTROLS.Utils.DateUtil',
   'js!SBIS3.CONTROLS.DateRangeBigChoose.MonthView'
], function (ListView, ItemTmpl, RangeMixin, Base, DateUtil) {
   'use strict';

   var _startingOffset = 1000000;

   var MonthSource = Base.extend(/** @lends SBIS3.CONTROLS.DateRangeBig.DateRangePicker.MonthSource.prototype */{
      _moduleName: 'SBIS3.CONTROLS.DateRangeBigChoose.MonthSource',


      query: function (query) {
         // throw new Error('Method must be implemented');
         var adapter = this.getAdapter().forTable(),
            offset = query.getOffset(),
            limit = query.getLimit() || 1,
            now = new Date(),
            items = [];
         offset = offset - _startingOffset;

         for (var i = 0; i < limit; i++) {
            items.push({id: i, date: new Date(now.getFullYear(), offset + i, 1)});
         }

         this._each(
            items,
            function(item) {
               adapter.add(item);
            }
         );
         items = this._prepareQueryResult(
            {items: adapter.getData(), total: 1000000000000},
            'items', 'total'
         );
         return $ws.proto.Deferred.success(items);
      },
      //region Public methods
      //endregion Public methods

      //region Protected methods

      //endregion Protected methods
   });

   /**
    * SBIS3.CONTROLS.DateRangeBig.DateRangePicker
    * @class SBIS3.CONTROLS.DateRangeBig.DateRangePicker
    * @extends SBIS3.CONTROLS.CompoundControl
    * @author Миронов Александр Юрьевич
    * @control
    */

   var monthSource = new MonthSource();

   var Component = ListView.extend([RangeMixin], /** @lends SBIS3.CONTROLS.DateRangeBig.DateRangePicker.prototype */{
      $protected: {
         _options: {
            rangeselect: false,
            month: null,
            keyField: 'id',
            itemTpl: ItemTmpl,
            // itemTemplate: '<div>{{=it.item.get("date")}}</div>',
            // infiniteScroll: 'both',
            pageSize: 3,
            className: 'controls-DateRangeBigChoose-DateRangePicker'
         },
         _lastOverControl: null,
         _offset: MonthSource.defaultOffset,
         _innerComponentsValidateTimer: null,
         _selectionRangeEndItem: null,
         _selectionType: null
      },
      $constructor: function () {
         this._publish('onMonthActivated');
      },

      init: function () {
         var self = this,
            container = this.getContainer(),
            now = new Date();

         this._onMonthViewRageChanged = this._onMonthViewRageChanged.bind(this);
         // this._onMonthViewSelectionStarted = this._onMonthViewSelectionStarted.bind(this);
         this._onMonthViewSelectingRangeEndDateChange = this._onMonthViewSelectingRangeEndDateChange.bind(this);
         this._onMonthViewCaptionActivated = this._onMonthViewCaptionActivated.bind(this);

         if (this._options.month) {
            this._options.month = this._normalizeMonth(this._options.month);
         } else {
            this._options.month = (new Date(now.getFullYear(), now.getMonth(), 1));
         }

         Component.superclass.init.call(this);

         this.setDataSource(monthSource);
      },

      setMonth: function (month) {
         month = this._normalizeMonth(month);

         if (this._isDatesEqual(this._options.month, month)) {
            return;
         }
         this._options.month = month;
         // TODO: временный хак. Базовый класс не релоудит данные если не установлен showPaging
         this.setOffset(this._getOffsetByMonth(month));
         this.reload();
      },

      getMonth: function () {
         return this._options.month;
      },

      isSelectionProcessing: function () {
         return !!this._selectionRangeEndItem;
      },

      _getOffsetByMonth: function (month) {
         var now = new Date();
         return _startingOffset + (month.getFullYear() - now.getFullYear()) * 12 + month.getMonth() - 1;
      },

      _drawItemsCallback: function () {
         var self = this,
            // controls = this.getItemsInstances(),
            control;
         Component.superclass._drawItemsCallback.apply(this, arguments);
         this.forEachMonthView(function(control) {
            control.unsubscribe('onRangeChange', self._onMonthViewRageChanged);
            control.subscribe('onRangeChange', self._onMonthViewRageChanged);
            control.unsubscribe('onSelectingRangeEndDateChange', self._onMonthViewSelectingRangeEndDateChange);
            control.subscribe('onSelectingRangeEndDateChange', self._onMonthViewSelectingRangeEndDateChange);
            control.unsubscribe('onActivated', self._onMonthViewCaptionActivated);
            control.subscribe('onActivated', self._onMonthViewCaptionActivated);
         });
         this._updateSelectionInInnerComponents();
         this.getContainer().css('top', 40 - $(this._getItemsContainer().children().get(0)).height());
         $(this._getItemsContainer().children().get(0)).addClass('controls-DateRangeBigChoose__calendar-fogged');
         $(this._getItemsContainer().children().get(2)).addClass('controls-DateRangeBigChoose__calendar-fogged');
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

         if (this._options.rangeselect) {
            // oldStart = this.getStartValue();
            // oldEnd = this.getEndValue();
            changed = Component.superclass.setRange.apply(this, arguments);
            // start = this.getStartValue();
            // end = this.getEndValue();
            month = this.getMonth();
            // if (!this._isDatesEqual(start, oldStart) && !this._isDatesEqual(end, oldEnd)) {
            if (month && start && end && (start > new Date(month.getFullYear(), month.getMonth() + 1, 0) || end < month)) {
               this.setMonth(start);
            }
         } else {
            changed = Component.superclass.setRange.apply(this, arguments);
         }
         return changed;
      },

      _prepareItemData: function () {
         var args = Component.superclass._prepareItemData.apply(this, arguments);
         args.rangeselect = this._options.rangeselect;
         return args;
      },

      _onMonthViewCaptionActivated: function (e) {
         this._notify('onActivated', e.getTarget().getMonth());
      },

      _onMonthViewRageChanged: function (e, start, end) {
         this.setRange(start, end);
      },

      _onMonthViewSelectingRangeEndDateChange: function (e, date, _date, selectionType) {
         this._selectionType = selectionType;
         this._selectionRangeEndItem = date;
         this.forEachMonthView(function(control) {
            if (e.getTarget() !== control) {
               control._setSelectionType(selectionType);
               control._setSelectionRangeEndItem(date, true);
            }
         });
      },

      _updateInnerComponents: function (start, end) {
         this.forEachMonthView(function(control) {
            control.setRange(start, end, true);
         });
      },

      _updateSelectionInInnerComponents: function () {
         if (!this._innerComponentsValidateTimer) {
            this._innerComponentsValidateTimer = setTimeout(this._validateInnerComponents.bind(this), 0);
         }
      },

      _validateInnerComponents: function () {
         this._innerComponentsValidateTimer = null;
         this.forEachMonthView(function(control) {
            if (this._isMonthView(control)) {
               control._setSelectionType(this._selectionType);
               control._setSelectionRangeEndItem(this._selectionRangeEndItem, true);
               control.setRange(this.getStartValue(), this.getEndValue(), true);
            }
         }.bind(this));
      },

      _isMonthView: function (control) {
         return $ws.helpers.instanceOfModule(control, 'SBIS3.CONTROLS.DateRangeBigChoose.MonthView');
      },

      forEachMonthView: function (func) {
         var self = this;
         $ws.helpers.forEach(this.getChildControls(), function(control) {
            if (self._isMonthView(control)) {
               func(control);
            }
         });
      },

      cancelSelection: function () {
         this._selectionRangeEndItem = null;
         this._selectionType = null;
         this.forEachMonthView(function (control) {
            control.cancelSelection();
         });
      },

      /**
       * Возвращает месяц в нормальном виде(с датой 1 и обнуленным временем)
       * @param month {Date}
       * @returns {Date}
       * @private
       */
      _normalizeMonth: function (month) {
         // TODO: Вынести в утильные функции
         month = DateUtil.valueToDate(month);
         if(!(month instanceof Date)) {
            return null;
         }
         return new Date(month.getFullYear(), month.getMonth(), 1);
      },

      _isDatesEqual: function (date1, date2) {
         return date1 === date2 || (date1 && date2 && date1.getTime() === date2.getTime());
      }

   });
   return Component;
});
