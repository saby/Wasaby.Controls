define('SBIS3.CONTROLS/Date/RangeBigChoose/resources/DateRangePicker', [
   "Core/constants",
   "Core/Deferred",
   'Core/detection',
   'Core/helpers/Function/throttle',
   "SBIS3.CONTROLS/ListView",
   "tmpl!SBIS3.CONTROLS/Date/RangeBigChoose/resources/DateRangePickerItem",
   "SBIS3.CONTROLS/Mixins/RangeMixin",
   "WS.Data/Source/Base",
   "SBIS3.CONTROLS/Utils/DateUtil",
   "Core/core-instance",
   'SBIS3.CONTROLS/Date/RangeBigChoose/resources/CalendarSource',
   'Lib/LayoutManager/LayoutManager',
   'SBIS3.CONTROLS/Mixins/RangeSelectableViewMixin',
   "SBIS3.CONTROLS/Date/RangeBigChoose/resources/MonthView",
   'SBIS3.CONTROLS/ScrollContainer'
], function (constants, Deferred, detection, throttle, ListView, ItemTmpl, RangeMixin, Base, DateUtils, cInstance, CalendarSource, LayoutManager, RangeSelectableViewMixin) {
   'use strict';

   var monthSource = new CalendarSource(),
      buildTplArgsDRP = function(cfg) {
            var tplOptions = cfg._buildTplArgsLV.call(this, cfg);
            tplOptions.quantum = cfg.quantum;
            return tplOptions;
         };

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
            pageSize: 1,
            cssClassName: 'controls-DateRangeBigChoose-DateRangePicker',
            // infiniteScroll: 'down',
            infiniteScroll: 'both',
            infiniteScrollContainer: '.controls-DateRangeBigChoose__dates-dates-wrapper',
            virtualScrolling: true,

            // showPaging: false

            navigation: {
               type: 'cursor',
               config: {
                  field: 'id',
                  // position: 40,
                  direction: 'both'
              }
            },
            _buildTplArgs: buildTplArgsDRP
         },
         _lastOverControl: null,
         _innerComponentsValidateTimer: null,
         _selectionRangeEndItem: null,
         // _selectionType: null
      },
      $constructor: function () {
         this._publish('onMonthActivated');
      },

      init: function () {
         var self = this,
            container = this.getContainer();

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
         setTimeout(this._updateScrollPosition.bind(this), 0);
         container.on('click', '.controls-DateRangeBigChoose-DateRangePickerItem__monthsWithDates_item_title', this._onMonthTitleClick.bind(this));
         container.on('click', '.controls-DateRangeBigChoose-DateRangePickerItem__months-nextyear-btn', this._onNextYearClick.bind(this));
         container.on('click', '.controls-DateRangeBigChoose-DateRangePickerItem__months-btn', this._onMonthClick.bind(this));

         container.on('mouseenter', '.controls-DateRangeBigChoose-DateRangePickerItem__monthsWithDates_item_title', this._onMonthTitleMouseEnter.bind(this));
         container.on('mouseleave', '.controls-DateRangeBigChoose-DateRangePickerItem__monthsWithDates_item_title', this._onMonthTitleMouseLeave.bind(this));
         container.on('mouseenter', '.controls-MonthView__currentMonthDay', this._onDayMouseEnter.bind(this));

         this._scrollContainer = container.closest('.controls-ScrollContainer__content');
         this._scrollContainer.on('scroll', this._onScroll.bind(this));

         this._yearTitleContainer = container.find('.controls-DateRangeBigChoose__dates-header-year');
      },

      // _modifyOptions: function (options) {
      //    options = Component.superclass._modifyOptions.apply(this, arguments);
      //    options._monthsNames = constants.Date.longMonths;
      //    return options;
      // },

      _onScroll: throttle(function () {
         // TODO: переделать условие
         if (!this.getContainer().is(':visible')) {
            return;
         }

         var scrollContainerTop = this._scrollContainer.offset().top,
            first = false,
            date;
         date = this.getContainer().find('.controls-DateRangeBigChoose-DateRangePickerItem__monthsWithDates_item_wrapper').filter(function (index, element) {
            element = $(element);
            if (scrollContainerTop < (element.offset().top + element.height()) && !first) {
               first = true;
               return true;
            }
         }).data('date');
         date =  Date.fromSQL(date);
         this._setMonth(date);
         this._updateDisplayedYearCssClass();
      }, 300, true),

      _getItemHeight: function () {
         return this.getContainer().find('.controls-DateRangeBigChoose-DateRangePickerItem__monthsWithDates_item_wrapper').first().outerHeight();
      },

      _onMonthTitleClick: function (event) {
         var date = this._getDateByMonthTitleEvent(event);
         this.setRange(date, DateUtils.getEndOfMonth(date));
         this._notify('onSelectionEnded');
      },
      _onMonthTitleMouseEnter: function (event) {
         this._notify('onMonthTitleMouseEnter', this._getDateByMonthTitleEvent(event));
      },
      _onMonthTitleMouseLeave: function (event) {
         this._notify('onMonthTitleMouseLeave', this._getDateByMonthTitleEvent(event));
      },
      _getDateByMonthTitleEvent: function (event) {
         return Date.fromSQL($(event.currentTarget).data('date'));
      },

      _onDayMouseEnter: function (event) {
         this._notify('onDayMouseEnter', Date.fromSQL($(event.currentTarget).data('date')));
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
            changed = this._setMonth(month);

         if (changed) {
            if (!DateUtils.isYearsEqual(month, oldMonth)) {
               // TODO: временный хак. Базовый класс не релоудит данные если не установлен showPaging
               this.setOffset(this._getOffsetByMonth(month));
               this.reload().addCallback(function (list) {
                  this._updateScrollPosition();
                  return list;
               }.bind(this));
            } else {
               this._updateScrollPosition();
            }
         }
      },

      _setMonth: function (month) {
         month = DateUtils.normalizeMonth(month);

         if (DateUtils.isDatesEqual(month, this._options.month)) {
            return false;
         }
         this._options.month = month;
         this._notify('onMonthChanged');
         return true;
      },

      getMonth: function () {
         return this._options.month;
      },

      isSelectionProcessing: function () {
         return !!this._selectionRangeEndItem;
      },

      _getOffsetByMonth: function (month) {
         return month.getFullYear();
      },

      _onDateRangePickerDrawItems: function () {
         var self = this,
            container, monthContainer,
            scrollContainerOffset;

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
         this._updateDisplayedYearCssClass();
         // Хак для ie\edge. Выпилисть как перестанем поддерживать ie и edge которые не поддерживают position: sticky
         // Панели с месяцами фиксируем через position: fixed и top, а их видимостью управляем через стили.
         if (detection.isIE) {
            container = this.getContainer();
            scrollContainerOffset = container.closest('.controls-ScrollContainer__content').offset();
            monthContainer = container.find('.controls-DateRangeBigChoose-DateRangePickerItem__months');
            monthContainer.css({'top': scrollContainerOffset.top - parseInt(monthContainer.css('margin-top'), 10)});
         }
      },

      _onSelectionEnded: function () {
         this._notify('onSelectionEnded');
      },

      _updateScrollPosition: function () {
         if (!this._options.month) {
            return;
         }
         var container = this.getContainer(),
            displayedContainer = container.find('.controls-DateRangeBigChoose-DateRangePickerItem__monthsWithDates_item_wrapper[data-date="' + this._options.month.toSQL() + '"]');

         LayoutManager.scrollToElement(displayedContainer);
         this._updateDisplayedYearCssClass();
      },

      _updateDisplayedYearCssClass: function () {
         if (!this._options.month) {
            return;
         }
         var container = this.getContainer();

         container.find('.controls-DateRangeBigChoose-DateRangePickerItem__monthsWithDates_item-displayed')
            .removeClass('controls-DateRangeBigChoose-DateRangePickerItem__monthsWithDates_item-displayed');
         container.find('.controls-DateRangeBigChoose-DateRangePickerItem__monthsWithDates_item_wrapper[data-date="' + this._options.month.toSQL() + '"]')
            .addClass('controls-DateRangeBigChoose-DateRangePickerItem__monthsWithDates_item-displayed');

         container.find('.controls-DateRangeBigChoose-DateRangePickerItem__displayed')
            .removeClass('controls-DateRangeBigChoose-DateRangePickerItem__displayed');
         container.find('.controls-DateRangeBigChoose-DateRangePickerItem[data-date="' + DateUtils.getStartOfYear(this._options.month).toSQL() + '"]')
            .addClass('controls-DateRangeBigChoose-DateRangePickerItem__displayed');
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
         this._notify('onDayMouseEnter', start);
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
