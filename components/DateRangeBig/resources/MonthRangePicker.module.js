define('js!SBIS3.CONTROLS.DateRangeBig.MonthRangePicker', [
   'js!SBIS3.CONTROLS.ListView',
   'js!SBIS3.CONTROLS.RangeMixin',
   'js!SBIS3.CONTROLS.RangeSelectableViewMixin',
   'js!SBIS3.CONTROLS.DateRangeBig.MonthRangePicker.YearSource',
   'js!SBIS3.CONTROLS.DateRangeBig.ScrollWatcher',
   'js!SBIS3.CONTROLS.DateRangeBig.MonthView'
], function (ListView, RangeMixin, RangeSelectableViewMixin, YearSource, ScrollWatcher) {
   'use strict';
   /**
    * SBIS3.CONTROLS.DateRangeBig.MonthRangePicker
    * @class SBIS3.CONTROLS.DateRangeBig.MonthRangePicker
    * @extends SBIS3.CONTROLS.CompoundControl
    * @author Миронов Александр Юрьевич
    * @control
    */

   var yearSource = new YearSource();

   var MonthRangePicker = ListView.extend([RangeSelectableViewMixin, RangeMixin], /** @lends SBIS3.CONTROLS.DateRangeBig.MonthRangePicker.prototype */{
      $protected: {
         _options: {
            // x: monthSource,
            // dataSource: monthSource,
            keyField: 'id',
            // itemTemplate: '<table class="controls-MonthView__dayTable">' +
            //                   '<tbody class="controls-MonthView__tableBody">' +
            //                      // '{{~[0, 1, 2, 4] :quarterCaption:quarterIndex}}' +
            //                      '{{~[0] :quarterCaption:quarterIndex}}' +
            //                      '<tr class="controls-MonthView__tableBodyRow">' +
            //                         // '{{~[0, 1, 2] :value:index}}' +
            //                         '{{~[0] :value:index}}' +
            //                         '<td>' +
            //                            '<component data-component="SBIS3.CONTROLS.DateRangeBig.MonthView" name="MonthView{{=quarterIndex*3 + index}}" data-item="{{=quarterIndex*3 + index}}" class="controls-DateRangeBigChoose-MonthView">' +
            //                               '<option name="showWeekdays" type="boolean">false</option>' +
            //                               '<option name="captionType">text</option>' +
            //                               '<option name="captionFormat">%B</option>' +
            //                               '<option name="month">{{=it.item.get("year")}}-{{=quarterIndex*3 + index + 1}}-01</option>' +
            //                               '<option name="enabled" type="boolean">false</option>' +
            //                            '</component>' +
            //                         '</td>' +
            //                         '{{~}}' +
            //                      '</tr>' +
            //                      '{{~}}' +
            //                   '</tbody>'+
            //                '</table>',
            /**
             * @cfg {Number} отображаемый год
             */
            year: null,
            itemTemplate: '<component data-component="SBIS3.CONTROLS.DateRangeBig.MonthView" name="MonthView-{{=it.item.get(\'month\').toISOString()}}" class="controls-DateRangeBigChoose-MonthView">' +
                              '<option name="showWeekdays" type="boolean">false</option>' +
                              '<option name="captionType">text</option>' +
                              '<option name="captionFormat">%Y %B</option>' +
                              '<option name="month">{{=it.item.get("month").toISOString()}}</option>' +
                              '<option name="enabled" type="boolean">false</option>' +
                           '</component>',
            // itemTemplate: '<div>{{=it.item.get("date")}}</div>',
            // infiniteScroll: 'both',
            // infiniteScrollContainer: '.controls-DateRangeBigChoose__months-month',
            pageSize: 12,

            scrollWatcher: ScrollWatcher
         },
         _lastOverControl: null,
         _offset: YearSource.defaultOffset
      },
      
      $constructor: function () {
         this._publish('onMonthActivated');
      },

      init: function () {
         var self = this,
            container = this.getContainer(),
            year;

         if (!this._options.year) {
            this._options.year = (new Date()).getFullYear();
         }

         MonthRangePicker.superclass.init.call(this);

         this.setDataSource(yearSource);
         this.subscribe('onRangeChange', this._onRangeChanged.bind(this));
         // this._scrollWatcher.subscribe('onScroll', this._onScroll.bind(this));
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
         var delta = year - this._options.year,
            i;
         if (!delta) {
            return;
         }
         for (i = 0; i < Math.abs(delta); i++) {
            if (delta > 0) {
               this.showNextYear();
            } else {
               this.showPrevYear();
            }
         }
         // // TODO: временный хак. Базовый класс не релоудит данные если не установлен showPaging
         // this.setOffset(this._getOffsetByYear(year));
         // // this.setPage(pageNumber);
         // this.reload();
      },

      showNextYear: function () {
         this.setPage(this.getPage() + 1);
      },

      showPrevYear: function () {
         this.setPage(this.getPage() - 1);
      },

      getYear: function () {
         return this._options.year;
      },

      _getOffsetByYear: function (year) {
         return 1000000 + (year - (new Date()).getFullYear()) * this.getPageSize();
      },

      setEndValue: function (end, silent) {
         // Выделение происходит месяцами а интерфейс должен возвращать выделение днями,
         // поэтому всегда устанавливаем конец периода на последний день месяца
         end = new Date(end.getFullYear(), end.getMonth() + 1, 0);
         return MonthRangePicker.superclass.setEndValue.call(this, end, silent);
      },

      // _getItemTemplate : function(item) {
      //    // var caption = item.get(this._options.displayField);
      //    return '<component data-component="SBIS3.CONTROLS.MonthView" class="controls-DateRangeBigChoose__dates-dates">' +
      //       '<option name="showWeekdays" type="boolean">false</option>' +
      //       '<option name="captionType">text</option>' +
      //       '<option name="captionFormat">%B</option>' +
      //    '</component>';
      // }

      _drawItemsCallback: function () {
         var self = this;
         MonthRangePicker.superclass._drawItemsCallback.apply(this, arguments);
         // this.forEachMonthView(function(control) {
         $ws.helpers.forEach(this.getItemsInstances(), function(control) {
            control.getContainer().addClass(self._SELECTABLE_RANGE_CSS_CLASSES.item);
            control.subscribe('onMonthActivated', self._onMonthActivated.bind(self));
            control.subscribe('onActivated', self._onActivated.bind(self));
            // control.subscribe('onRangeChange', self._onMonthViewRageChanged.bind(self));
            // control.subscribe('onSelectionStarted', self._onMonthViewSelectionStarted.bind(self));
            // control.subscribe('onSelectingRangeEndDateChange', self._onMonthViewSelectingRangeEndDateChange.bind(self));
         });
      },

      _onMonthActivated: function (e) {
         this._notify('onMonthActivated', e.getTarget().getMonth());
      },

      _selectedRangeItemToString: function (date) {
         return date.toSQL();
      },

      _getSelectedRangeItems: function (start, end) {
         var items = [];
         while (start <= end) {
            items.push(start);
            start = new Date(start.getFullYear(), start.getMonth() + 1, 1);
         }
         return items;
      },

      _onActivated: function (e) {
         this._onRangeItemElementClick(e.getTarget().getMonth());
      },

      _onRangeChanged: function (e, start, end) {
         this.forEachMonthView(function(control) {
            control.setRange(start, end, true);
         });
      },

      _isMonthView: function (control) {
         return $ws.helpers.instanceOfModule(control, 'SBIS3.CONTROLS.MonthView');
      },

      forEachMonthView: function (func) {
         $ws.helpers.forEach(this.getChildControls(false, false, this._isMonthView), function(control) {
               func(control);
         });
      }

   });
   return MonthRangePicker;
});
