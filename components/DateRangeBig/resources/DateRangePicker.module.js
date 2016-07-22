define('js!SBIS3.CONTROLS.DateRangeBig.DateRangePicker', [
   'js!SBIS3.CONTROLS.ListView',
   'js!SBIS3.CONTROLS.RangeMixin',
   'js!SBIS3.CONTROLS.DateRangeBig.DateRangePicker.MonthSource',
   'js!SBIS3.CONTROLS.DateRangeBig.MonthView'
], function (ListView, RangeMixin, MonthSource) {
   'use strict';
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
            // x: monthSource,
            // dataSource: monthSource,
            month: null,
            keyField: 'id',
            itemTemplate: '<component data-component="SBIS3.CONTROLS.DateRangeBig.MonthView">' +
                  '<option name="showWeekdays" type="boolean">false</option>' +
                  '<option name="captionType">text</option>' +
                  '<option name="captionFormat">%B</option>' +
                  // '<option name="month">{{=it.item.get("date").getFullYear()}}:{{=it.item.get("date").getMonth()}}:01</option>' +
                  // FIXME: в ie8 нет метода toISOString
                  '<option name="month">{{=it.item.get("date").toISOString()}}</option>' +
               '</component>',
            // itemTemplate: '<div>{{=it.item.get("date")}}</div>',
            // infiniteScroll: 'both',
            pageSize: 3
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
         this._onMonthViewSelectionStarted = this._onMonthViewSelectionStarted.bind(this);
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
      //    return '<component data-component="SBIS3.CONTROLS.MonthView" class="controls-DateRangeBigChoose__dates-dates">' +
      //       '<option name="showWeekdays" type="boolean">false</option>' +
      //       '<option name="captionType">text</option>' +
      //       '<option name="captionFormat">%B</option>' +
      //    '</component>';
      // }

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
         return MonthSource.defaultOffset + (month.getFullYear() - now.getFullYear()) * 12 + month.getMonth();
      },

      _drawItemsCallback: function () {
         var self = this,
            // controls = this.getItemsInstances(),
            control;
         Component.superclass._drawItemsCallback.apply(this, arguments);
         this.forEachMonthView(function(control) {
            control.unsubscribe('onRangeChange', self._onMonthViewRageChanged);
            control.subscribe('onRangeChange', self._onMonthViewRageChanged);
            control.unsubscribe('onSelectionStarted', self._onMonthViewSelectionStarted);
            control.subscribe('onSelectionStarted', self._onMonthViewSelectionStarted);
            control.unsubscribe('onSelectingRangeEndDateChange', self._onMonthViewSelectingRangeEndDateChange);
            control.subscribe('onSelectingRangeEndDateChange', self._onMonthViewSelectingRangeEndDateChange);
         });
         // this.forEachMonthView(function(control) {
         //    control.subscribe('onRangeChange', self._onMonthViewRageChanged.bind(self));
         //    control.subscribe('onSelectionStarted', self._onMonthViewSelectionStarted.bind(self));
         //    control.subscribe('onSelectingRangeEndDateChange', self._onMonthViewSelectingRangeEndDateChange.bind(self));
         // });
         this._updateSelectionInInnerComponents();
      },

      _onMonthViewRageChanged: function (e, start, end) {
         this.setRange(start, end);
      },

      _onMonthViewSelectionStarted: function (e, start, end) {
         this.forEachMonthView(function(control) {
            control.startSelection(start, end, true);
         });
      },

      _onMonthViewSelectingRangeEndDateChange: function (e, date) {
         this.forEachMonthView(function(control) {
            control._setSelectionRangeEndItem(date, true);
         });
      },

      _onRangeChanged: function (e, start, end) {
         this.forEachMonthView(function(control) {
            control.setRange(start, end, true);
         });
      },

      _onMonthViewMouseenter: function (control) {
         if (this._lastOverControl && this._lastOverControl.isSelectionProcessing()) {
            if (this._lastOverControl.getMonth().getTime() > control.getMonth().getTime()) {
               control._startRangeSelection(this._lastOverControl.getStartValue(), this._lastOverControl._selectingRangeEndDate);
            }
         }
         this._lastOverControl = control;
      },

      _updateSelectionInInnerComponents: function () {
         this.forEachMonthView(function(control) {
            if (this._isMonthView(control)) {
               control.setRange(this.getStartValue(), this.getEndValue(), true);
            }
         }.bind(this));
      },

      _isMonthView: function (control) {
         return $ws.helpers.instanceOfModule(control, 'SBIS3.CONTROLS.DateRangeBig.MonthView');
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