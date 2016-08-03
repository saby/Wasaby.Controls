define('js!SBIS3.CONTROLS.DateRangeBigChoose.MonthRangePicker', [
   'js!SBIS3.CONTROLS.ListView',
   'js!SBIS3.CONTROLS.RangeMixin',
   'js!SBIS3.CONTROLS.RangeSelectableViewMixin',
   'js!WS.Data/Source/Base',
   'js!SBIS3.CONTROLS.DateRangeBigChoose.ScrollWatcher',
   'js!SBIS3.CONTROLS.DateRangeBigChoose.MonthView'
], function (ListView, RangeMixin, RangeSelectableViewMixin, Base, ScrollWatcher) {
   'use strict';

   var _startingOffset = 1000000;

   var YearSource = Base.extend(/** @lends SBIS3.CONTROLS.DateRangeBig.DateRangePicker.MonthsStartCurrentYearSource.prototype */{
      _moduleName: 'SBIS3.CONTROLS.DateRangeBigChoose.YearSource',

      query: function (query) {
         var adapter = this.getAdapter().forTable(),
            offset = query.getOffset(),
            limit = query.getLimit() || 1,
            now = new Date(),
            items = [];

         offset = offset - _startingOffset;

         for (var i = 0; i < limit; i++) {
            items.push({id: i, month: new Date(now.getFullYear(), offset + i, 1)})
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
      }
      //region Public methods
      //endregion Public methods

      //region Protected methods

      //endregion Protected methods
   });

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
            /**
             * @cfg {Number} отображаемый год
             */
            year: null,
            itemTemplate: '<component data-component="SBIS3.CONTROLS.DateRangeBigChoose.MonthView">' +
                              '<option name="showWeekdays" type="boolean">false</option>' +
                              '<option name="captionType">text</option>' +
                              '<option name="captionFormat">%B</option>' +
                              '<option name="month">{{=it.item.get("month").toSQL()}}</option>' +
                              '<option name="enabled" type="boolean">false</option>' +
                           '</component>',
            // infiniteScroll: 'both',
            // infiniteScrollContainer: '.controls-DateRangeBigChoose__months-month',
            pageSize: 12,

            scrollWatcher: ScrollWatcher,
            className: 'controls-DateRangeBigChoose-MonthRangePicker'
         },
         _lastOverControl: null,
         _offset: YearSource.defaultOffset,

         _css_classes: {
            hovered: 'controls-DateRangeBigChoose-MonthRangePicker__hovered'
         },

         _innerComponentsValidateTimer: null
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

         this.setDataSource(yearSource, true);
         // this._scrollWatcher.subscribe('onScroll', this._onScroll.bind(this));

         this._onMonthActivated = this._onMonthActivated.bind(this);
         this._onActivated = this._onActivated.bind(this);
         // this._onItemEnter = this._onItemEnter.bind(this);

         container.on('mouseenter', '.controls-MonthView__caption', this._onItemCaptionMouseEnter.bind(this));
         container.on('mouseleave', '.controls-MonthView__caption', this._onItemCaptionMouseLeave.bind(this));
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
         // var delta = year - this._options.year,
         //    i;
         // if (!delta) {
         //    return;
         // }
         // for (i = 0; i < Math.abs(delta); i++) {
         //    if (delta > 0) {
         //       this.showNextYear();
         //    } else {
         //       this.showPrevYear();
         //    }
         // }
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
         // Выделение происходит месяцами а интерфейс должен возвращать выделение днями,
         // поэтому всегда устанавливаем конец периода на последний день месяца
         if (end) {
            end = new Date(end.getFullYear(), end.getMonth() + 1, 0);
         }
         changed = MonthRangePicker.superclass.setEndValue.call(this, end, silent);
         if (!this.isSelectionProcessing()) {
            this._updateSelectionInInnerComponents();
         }
         return changed;
      },

      setStartValue: function (end, silent) {
         var changed = MonthRangePicker.superclass.setStartValue.apply(this, arguments);
         if (changed) {
            this._updateSelectionInInnerComponents()
         }
         return changed;
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
         var self = this,
             container;
         MonthRangePicker.superclass._drawItemsCallback.apply(this, arguments);
         this._$items = null;
         $ws.helpers.forEach(this.getItemsInstances(), function(control) {
            // Почему то в control иногда попадают левые контролы
            if (!self._isMonthView(control)) {
               return;
            }
            container = control.getContainer();
            container.addClass(self._SELECTABLE_RANGE_CSS_CLASSES.item);
            container.attr(self._selectedRangeItemIdAtr, self._selectedRangeItemToString(control.getMonth()));
            // container.off("mouseenter", self._onItemEnter);
            // container.mouseenter(self._onItemEnter);
            control.unsubscribe('onMonthActivated', self._onMonthActivated);
            control.subscribe('onMonthActivated', self._onMonthActivated);
            control.unsubscribe('onActivated', self._onActivated);
            control.subscribe('onActivated', self._onActivated);
         });
         if (!this.isSelectionProcessing()) {
            this._updateSelectionInInnerComponents();
         }
      },

      _onItemCaptionMouseEnter: function (e) {
         var $target = $(e.target),
            target = this._findItemByElement($target);

         target.addClass(this._css_classes.hovered);
         this._onRangeItemElementMouseEnter(Date.fromSQL(target.attr(this._selectedRangeItemIdAtr)));
      },

      _onItemCaptionMouseLeave: function (e) {
         var $target = $(e.target),
            target;

         target = this._findItemByElement($target);
         target.removeClass(this._css_classes.hovered);
      },

      _onMonthActivated: function (e) {
         this._notify('onMonthActivated', e.getTarget().getMonth());
      },

      _selectedRangeItemToString: function (date) {
         return date.toSQL();
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
            this._$items = this.getContainer().find(['.controls-ListView__itemsContainer>.', this._SELECTABLE_RANGE_CSS_CLASSES.item].join(''));
         }
         return this._$items;
      },

      _onActivated: function (e) {
         this._onRangeItemElementClick(e.getTarget().getMonth());
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
         $ws.helpers.forEach(this.getItemsInstances(), function(control) {
            if (this._isMonthView(control)) {
               control.setRange(this.getStartValue(), this.getEndValue(), true);
            }
         }.bind(this));
      },

      _isMonthView: function (control) {
         return $ws.helpers.instanceOfModule(control, 'SBIS3.CONTROLS.DateRangeBigChoose.MonthView');
      }

   });
   return MonthRangePicker;
});
