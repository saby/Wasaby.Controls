define('js!SBIS3.CONTROLS.DateRangeBigChoose.MonthRangePicker', [
   "Core/constants",
   "Core/Deferred",
   "js!SBIS3.CONTROLS.ListView",
   "html!SBIS3.CONTROLS.DateRangeBigChoose/resources/MonthRangePickerItem",
   "js!SBIS3.CONTROLS.RangeMixin",
   "js!SBIS3.CONTROLS.RangeSelectableViewMixin",
   "js!WS.Data/Source/Base",
   "js!WS.Data/Source/DataSet",
   "Core/helpers/collection-helpers",
   "Core/core-instance",
   "js!SBIS3.CONTROLS.Utils.DateUtil",
   "js!SBIS3.CONTROLS.DateRangeBigChoose.MonthView"
], function ( constants, Deferred, ListView, ItemTmpl, RangeMixin, RangeSelectableViewMixin, Base, DataSet, colHelpers, cInstance, dateUtils) {
   'use strict';

   var _startingOffset = 1000000;

   /**
    * @class SBIS3.CONTROLS.DateRangeBigChoose.MonthRangePicker.YearSource
    * @extends WS.Data/Source/Base
    * @author Миронов Александр Юрьевич
    */
   var YearSource = Base.extend(/** @lends SBIS3.CONTROLS.DateRangeBigChoose.MonthRangePicker.YearSource.prototype */{
      _moduleName: 'SBIS3.CONTROLS.DateRangeBigChoose.YearSource',
      $protected: {
         _dataSetItemsProperty: 'items',
         _dataSetTotalProperty: 'total'
      },

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
            {items: adapter.getData(), total: 1000000000000}
         );
         return Deferred.success(items);
      }
      //region Public methods
      //endregion Public methods

      //region Protected methods

      //endregion Protected methods
   });

   /**
    * SBIS3.CONTROLS.DateRangeBigChoose.MonthRangePicker
    * @class SBIS3.CONTROLS.DateRangeBigChoose.MonthRangePicker
    * @extends SBIS3.CONTROLS.ListView
    * @author Миронов Александр Юрьевич
    * @control
    * @mixes SBIS3.CONTROLS.RangeSelectableViewMixin
    * @mixes SBIS3.CONTROLS.RangeMixin
    */

   var yearSource = new YearSource();

   var MonthRangePicker = ListView.extend([RangeSelectableViewMixin, RangeMixin], /** @lends SBIS3.CONTROLS.DateRangeBigChoose.MonthRangePicker.prototype */{
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
            pageSize: 12,

            // scrollWatcher: ScrollWatcher,
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
         // Представление обновляется только в setYear и в любом случае будет использоваться год установленный в setYear
         // TODO: Сделать, что бы компонент рендерился при построении если чузер открыт в режиме года.
         // if (!this._options.year) {
         //    this._options.year = (new Date()).getFullYear();
         // }

         MonthRangePicker.superclass.init.call(this);

         this.setDataSource(yearSource, true);
         // this._scrollWatcher.subscribe('onScroll', this._onScroll.bind(this));

         this._onMonthActivated = this._onMonthActivated.bind(this);
         this._onActivated = this._onActivated.bind(this);
         // this._onItemEnter = this._onItemEnter.bind(this);

         container.on('mouseenter', '.controls-MonthView__caption', this._onItemCaptionMouseEnter.bind(this));
         container.on('mouseleave', '.controls-MonthView__caption', this._onItemCaptionMouseLeave.bind(this));
         container.on('mouseleave', this._onRangeControlMouseLeave.bind(this));
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
            target = $target.closest('.controls-RangeSelectable__item', this._getItemsContainer());
         // Если двинули мышкой во время прокрутки списка, то это событие могло выстрелить до того как
         // у элементов были установлены нужные атрибуты и классы. Перевызваем такие события чуть позже.
         if (!target.length) {
            // Если контрол был перерисован, то надо прервать обработку события.
            if (!$target.closest('.controls-DateRangeBigChoose-MonthRangePicker', this._getItemsContainer()).length) {
               return;
            }
            setTimeout(this._onItemCaptionMouseEnter.bind(this, e), 10);
            return;
         }
         if (!constants.browser.isMobileIOS) {
            target.addClass(this._css_classes.hovered);
         }
         this._onRangeItemElementMouseEnter(dateUtils.getEndOfMonth(Date.fromSQL(target.attr(this._selectedRangeItemIdAtr))));
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
            this._$items = this.getContainer().find(['.controls-ListView__itemsContainer>.', this._SELECTABLE_RANGE_CSS_CLASSES.item].join(''));
         }
         return this._$items;
      },

      _onActivated: function (e) {
         var month = e.getTarget().getMonth();
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
         return cInstance.instanceOfModule(control, 'SBIS3.CONTROLS.DateRangeBigChoose.MonthView');
      },

      forEachMonthView: function (func) {
         var self = this;
         colHelpers.forEach(this.getChildControls(), function(control) {
            // Почему то в control иногда попадают левые контролы
            if (self._isMonthView(control)) {
               func(control);
            }
         });
      }

   });
   return MonthRangePicker;
});
