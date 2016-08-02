define('js!SBIS3.CONTROLS.DateRangeBigChoose.DateRangePicker', [
   'js!SBIS3.CONTROLS.ListView',
   'js!SBIS3.CONTROLS.RangeMixin',
   'js!WS.Data/Source/Base',
   'js!SBIS3.CONTROLS.DateRangeBigChoose.MonthView'
], function (ListView, RangeMixin, Base) {
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
            itemTemplate: '<component data-component="SBIS3.CONTROLS.DateRangeBigChoose.MonthView">' +
                  '<option name="showWeekdays" type="boolean">false</option>' +
                  '<option name="captionType">text</option>' +
                  '<option name="captionFormat">%B</option>' +
                  '<option name="month">{{=it.item.get("date").toSQL()}}</option>' +
                  '<option name="rangeselect" type="boolean">{{=it.rangeselect}}</option>' +
               '</component>',
            // itemTemplate: '<div>{{=it.item.get("date")}}</div>',
            // infiniteScroll: 'both',
            pageSize: 3,
            className: 'controls-DateRangeBigChoose-DateRangePicker'
         },
         _lastOverControl: null,
         _offset: MonthSource.defaultOffset
      },
      $constructor: function () {
         this._publish('onActivated', 'onMonthActivated');
      },

      init: function () {
         var self = this,
            container = this.getContainer(),
            now = new Date();

         this._onMonthViewRageChanged = this._onMonthViewRageChanged.bind(this);
         // this._onMonthViewSelectionStarted = this._onMonthViewSelectionStarted.bind(this);
         this._onMonthViewSelectingRangeEndDateChange = this._onMonthViewSelectingRangeEndDateChange.bind(this);

         if (!this._options.month) {
            this._options.month = (new Date(now.getFullYear(), now.getMonth(), 1));
         }

         Component.superclass.init.call(this);

         this.setDataSource(monthSource);
         this.subscribe('onRangeChange', this._onRangeChanged.bind(this));
      },

      // _getItemTemplate : function(item) {
      //    // var caption = item.get(this._options.displayField);
      //    return '<component data-component="SBIS3.CONTROLS.DateRangeBig.MonthView">' +
      //             '<option name="showWeekdays" type="boolean">false</option>' +
      //             '<option name="captionType">text</option>' +
      //             '<option name="captionFormat">%B</option>' +
      //             // '<option name="month">{{=it.item.get("date").getFullYear()}}:{{=it.item.get("date").getMonth()}}:01</option>' +
      //             // FIXME: в ie8 нет метода toISOString
      //             '<option name="month">{{=it.item.get("date").toISOString()}}</option>' +
      //          '</component>';
      // },

      setMonth: function (month) {
         if (this._options.month === month ||
            (this._options.month && month && this._options.month.getTime() === month.getTime())) {
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
         });
         this._updateSelectionInInnerComponents();
         this.getContainer().css('top', 40 - $(this._getItemsContainer().children().get(0)).height());
         $(this._getItemsContainer().children().get(0)).addClass('controls-DateRangeBigChoose__calendar-fogged');
         $(this._getItemsContainer().children().get(2)).addClass('controls-DateRangeBigChoose__calendar-fogged');
      },

      _prepareItemData: function () {
         var args = Component.superclass._prepareItemData.apply(this, arguments);
         args.rangeselect = this._options.rangeselect;
         return args;
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

      _onRangeChanged: function (e, start, end) {
         this.forEachMonthView(function(control) {
            if (e.getTarget() !== control) {
               control.setRange(start, end, true);
            }
         });
      },

      _updateSelectionInInnerComponents: function () {
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
         $ws.helpers.forEach(this.getItemsInstances(), function(control) {
            // Почему то в control иногда попадают левые контролы
            if (self._isMonthView(control)) {
               func(control);
            }
         });
      }

   });
   return Component;
});
