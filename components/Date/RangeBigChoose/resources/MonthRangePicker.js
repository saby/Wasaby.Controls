define('SBIS3.CONTROLS/Date/RangeBigChoose/resources/MonthRangePicker', [
   "Core/constants",
   'Core/detection',
   'Core/helpers/Function/runDelayed',
   'Core/helpers/Function/throttle',
   'Core/helpers/Object/isEmpty',
   'Lib/LayoutManager/LayoutManager',
   "SBIS3.CONTROLS/ListView",
   "SBIS3.CONTROLS/Date/RangeBigChoose/resources/CalendarSource",
   "tmpl!SBIS3.CONTROLS/Date/RangeBigChoose/resources/MonthRangePickerItem",
   "SBIS3.CONTROLS/Mixins/RangeMixin",
   "SBIS3.CONTROLS/Mixins/RangeSelectableViewMixin",
   "Core/core-instance",
   "SBIS3.CONTROLS/Utils/DateUtil",
   "SBIS3.CONTROLS/Date/RangeBigChoose/resources/MonthView"
], function( constants, detection, runDelayed, throttle, isEmpty, LayoutManager, ListView, CalendarSource, ItemTmpl, RangeMixin, RangeSelectableViewMixin, cInstance, dateUtils) {
   'use strict';

   var cConst = constants, //константы нужны для работы дат, не уверен что можно отключать из зависимостей (стан ругается)
      isOldIE = detection.isIE && detection.IEVersion < 11;

   var yearSource = new CalendarSource(),
      buildTplArgsMRP = function(cfg) {
            var tplOptions = cfg._buildTplArgsLV.call(this, cfg);
            tplOptions.monthsSelectionEnabled = cfg.monthsSelectionEnabled;
            tplOptions.quarterSelectionEnabled = cfg.quarterSelectionEnabled;
            tplOptions.halfyearSelectionEnabled = cfg.halfyearSelectionEnabled;
            tplOptions.yearSelectionEnabled = cfg.yearSelectionEnabled;
            tplOptions.startValue = cfg.startValue;
            tplOptions.endValue = cfg.endValue;
            tplOptions.serializationMode = cfg.serializationMode;
            tplOptions.dayFormatter = cfg.dayFormatter;
            tplOptions.monthClickable = cfg.monthClickable;
            return tplOptions;
         };

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
            quantum: {},
            monthClickable: true,

            liveSelection: false,

            // x: monthSource,
            // dataSource: monthSource,
            idProperty: 'id',
            /**
             * @cfg {Number} отображаемый год
             */
            year: null,

            itemTpl: ItemTmpl,
            pageSize: 2,

            infiniteScroll: 'both',
            infiniteScrollContainer: '.controls-DateRangeBigChoose__months-month',
            // virtualScrolling: true,

            navigation: {
               type: 'cursor',
               config: {
                  field: 'id',
                  // position: 40,
                  direction: 'both'
              }
            },

            // scrollWatcher: ScrollWatcher,
            cssClassName: 'controls-DateRangeBigChoose-MonthRangePicker',

            _isSelectionEnabled: false,
            _buildTplArgs: buildTplArgsMRP
         },
         _lastOverControl: null,

         _css_classes: {
            hovered: 'controls-DateRangeBigChoose-MonthRangePicker__hovered'
         },

         _innerComponentsValidateTimer: null,

         _SELECTABLE_RANGE_CSS_CLASSES: {
            // rangeselect: 'controls-RangeSelectable__rangeselect',
            item: 'controls-DateRangeBigChoose-MonthRangePickerItem__item',
            selected: 'controls-RangeSelectable__item-selected',
            selectedStart: 'controls-RangeSelectable__item-selectedStart',
            selectedEnd: 'controls-RangeSelectable__item-selectedEnd',
            selecting: 'controls-RangeSelectable__selecting'
         }
      },
      _scrollContainer: null,
      _drawMonthSelection: false,

      _modifyOptions: function(options) {
         options = MonthRangePicker.superclass._modifyOptions.apply(this, arguments);
         options.monthsSelectionEnabled = true;
         options.quarterSelectionEnabled = true;
         options.halfyearSelectionEnabled = true;
         options.yearSelectionEnabled = true;
         if (!isEmpty(options.quantum)) {
            options.monthsSelectionEnabled = 'months' in options.quantum;
            options.quarterSelectionEnabled = 'quarters' in options.quantum;
            options.halfyearSelectionEnabled = 'halfyears' in options.quantum;
            options.yearSelectionEnabled = 'years' in options.quantum;
         }
         return options;
      },
      
      $constructor: function() {
         this._publish('onMonthActivated');
      },

      init: function() {
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
         this._onMonthClick = this._onMonthClick.bind(this);
         // this._onItemEnter = this._onItemEnter.bind(this);

         container.on('click', '.controls-DateRangeBigChoose-MonthRangePickerItem__item',
            this._onMonthClick.bind(this));

         if (this._options.monthsSelectionEnabled) {
            if (!detection.isMobileIOS) {
               container.on('mouseenter.monthRangePicker', '.controls-DateRangeBigChoose-MonthRangePickerItem__item, .controls-DateRangeBigChoose-MonthRangePickerItem__month_title',
               this._onItemMouseEnter.bind(this));
               container.on('mouseleave.monthRangePicker', '.controls-DateRangeBigChoose-MonthRangePickerItem__item, .controls-DateRangeBigChoose-MonthRangePickerItem__month_title',
                  this.onItemMouseLeave.bind(this));
               container.on('mouseleave.monthRangePicker', this._onRangeControlMouseLeave.bind(this));
            }
         }

         if (this._options.quarterSelectionEnabled || this._options.halfyearSelectionEnabled) {
            container.on('click.monthRangePicker', '.controls-DateRangeBigChoose-MonthRangePickerItem__halfyear-quarter-button',
               this._onHalfyearQuarterClick.bind(this));

            container.on(detection.isMobileIOS ? 'touchstart.monthRangePicker' : 'mouseenter.monthRangePicker', '.controls-DateRangeBigChoose-MonthRangePickerItem__halfyear-quarter-button',
               this._onHalfyearQuarterMouseEnter.bind(this));
            container.on(detection.isMobileIOS ? 'touchend.monthRangePicker' : 'mouseleave.monthRangePicker', '.controls-DateRangeBigChoose-MonthRangePickerItem__halfyear-quarter-button',
               this._onHalfyearQuarterMouseLeave.bind(this));
         }

         // TODO: сделать что бы компонет наследовался от compoundControl и содержал внутри ScrollContainer,
         // ScrollContainer должен поддерживать событие скрола
         this._scrollContainer = container.closest('.controls-ScrollContainer__content');
         this._scrollContainer.on('scroll', this._onScroll.bind(this));
      },

      _startRangeSelection: function() {
         MonthRangePicker.superclass._startRangeSelection.apply(this, arguments);
         if (this._options.monthClickable) {
            this.getContainer().find('.controls-DateRangeBigChoose-MonthRangePickerItem__month').removeClass('controls-DateRangeBigChoose-MonthRangePickerItem__month_clickable');
         }
      },
      _stopRangeSelection: function() {
         MonthRangePicker.superclass._stopRangeSelection.apply(this, arguments);
         if (this._options.monthClickable) {
            this.getContainer().find('.controls-DateRangeBigChoose-MonthRangePickerItem__month').addClass('controls-DateRangeBigChoose-MonthRangePickerItem__month_clickable');
         }
      },

      _onScroll: throttle(function() {
         // TODO: переделать условие
         if (!this.getContainer().is(':visible')) {
            return;
         }
         var scrollTop = this._scrollContainer.scrollTop(),
            firstYear = this.getContainer().find('.controls-DateRangeBigChoose-MonthRangePickerItem').first().data('date'),
            year = Math.floor(Date.fromSQL(firstYear).getFullYear() + (scrollTop/this._getItemHeight()));
         if (year !== this._options.year) {
            this._options.year = year;
            this._updateDisplayedYearCssClass();
            this._notify('onYearChanged', year);
         }
      }, 300, true),

      _getItemHeight: function() {
         return this.getContainer().find('.controls-DateRangeBigChoose-MonthRangePickerItem ').first().outerHeight();
      },

      _onHalfyearQuarterClick: function(event) {
         var element = $(event.target),
            year = Date.fromSQL(element.closest('.controls-DateRangeBigChoose-MonthRangePickerItem').data('date')),
            rangeId = element.data('id');
         this._drawMonthSelection = true;
         if (element.hasClass('controls-DateRangeBigChoose-MonthRangePickerItem__quartersPanel-button')) {
            this.setRange(new Date(year.getFullYear(), rangeId*3), new Date(year.getFullYear(), 3 + rangeId*3, 0));
         } else {
            this.setRange(new Date(year.getFullYear(), rangeId*6), new Date(year.getFullYear(), 6 + rangeId*6, 0));
         }
         this._drawCurrentRangeSelection();
         this._notify('onSelectionEnded');
      },
      _onHalfyearQuarterMouseEnter: function(event) {
         var element = $(event.target),
            item = element.closest('.controls-DateRangeBigChoose-MonthRangePickerItem'),
            date = Date.fromSQL(item.data('date')),
            periodId = element.data('id'),
            selectedClass, addClass, buttonAddClass;
         if (element.hasClass('controls-DateRangeBigChoose-MonthRangePickerItem__quartersPanel-button')) {
            selectedClass = '.controls-DateRangeBigChoose-MonthRangePickerItem__quarter';
            addClass = 'controls-DateRangeBigChoose-MonthRangePickerItem__quarter-hovered';
            if (isOldIE) {
               buttonAddClass = 'controls-DateRangeBigChoose-MonthRangePickerItem__quarter-button-hovered';
            } else {
               addClass += ' controls-DateRangeBigChoose-MonthRangePickerItem__quarter-button-hovered';
            }
         } else {
            selectedClass = '.controls-DateRangeBigChoose-MonthRangePickerItem__halfYear';
            addClass = 'controls-DateRangeBigChoose-MonthRangePickerItem__halfYear-hovered';
            if (isOldIE) {
               buttonAddClass = 'controls-DateRangeBigChoose-MonthRangePickerItem__halfYear-button-hovered';
            } else {
               addClass += ' controls-DateRangeBigChoose-MonthRangePickerItem__halfYear-button-hovered';
            }
         }
         item = item.find(selectedClass + '[data-id="' + periodId + '"]');
         item.addClass(addClass);
         if (isOldIE) {
            item.children('.controls-DateRangeBigChoose-MonthRangePickerItem__halfyear-quarter-button')
               .addClass(buttonAddClass);
         }
         this._notify('onPeriodMouseEnter', date);
      },
      _onHalfyearQuarterMouseLeave: function(event) {
         var element = $(event.target),
            item = element.closest('.controls-DateRangeBigChoose-MonthRangePickerItem'),
            periodId = element.data('id'),
            selectedClass;
         this._drawMonthSelection = true;
         if (element.hasClass('controls-DateRangeBigChoose-MonthRangePickerItem__quartersPanel-button')) {
            selectedClass = '.controls-DateRangeBigChoose-MonthRangePickerItem__quarter';
         } else {
            selectedClass = '.controls-DateRangeBigChoose-MonthRangePickerItem__halfYear';
         }
         item = item.find(selectedClass + '[data-id="' + periodId + '"]');
         item.removeClass([
            'controls-DateRangeBigChoose-MonthRangePickerItem__halfYear-hovered',
            'controls-DateRangeBigChoose-MonthRangePickerItem__quarter-hovered',
            'controls-DateRangeBigChoose-MonthRangePickerItem__quarter-button-hovered',
            'controls-DateRangeBigChoose-MonthRangePickerItem__halfYear-button-hovered'
         ].join(' '));
         if (isOldIE) {
            item.children('.controls-DateRangeBigChoose-MonthRangePickerItem__halfyear-quarter-button')
               .removeClass('controls-DateRangeBigChoose-MonthRangePickerItem__quarter-button-hovered controls-DateRangeBigChoose-MonthRangePickerItem__halfYear-button-hovered');
         }
         this._notify('onPeriodMouseLeave');
      },

      _onRangeControlMouseLeave: function() {
         this._notify('onPeriodMouseLeave');
         return MonthRangePicker.superclass._onRangeControlMouseLeave.apply(this, arguments);
      },

      setYear: function(year) {
         var oldYear = this._options.year;
         if (oldYear === year) {
            return;
         }
         this._options.year = year;
         // this.setPage(pageNumber);
         if (year === oldYear + 1 || year === oldYear - 1) {
            this._updateScrollPosition();
         } else {
            // Почему то у следующей и предыдущей страниц устанавливается неправильный офсет
            this.setOffset(this._getOffsetByYear(year));
            this.reload(undefined, undefined, this._getOffsetByYear(year)).addCallback(function(list) {
               this._updateScrollPosition();
               return list;
            }.bind(this));
         }

         this._notify('onYearChanged', year);
      },

      _isSelectionEnabled: function() {
         return this.options._isSelectionEnabled;
      },

      _updateScrollPosition: function() {
         if (!this._options.year) {
            return;
         }
         this._updateDisplayedYearCssClass();

         var displayedYear = this.getContainer().find('.controls-DateRangeBigChoose-MonthRangePickerItem[data-date="' + (new Date(this._options.year, 0)).toSQL() + '"]');

         // При изменеии размера контента если его высота равна 0(а это может быть даже если контент есть, а родитель
         // ScrollContainer скрыт) ScrollContainer навешивает overflow: hidden. Заза этого scrollToElement
         // не может найти контейнер в котором происходит скролирование. Сигнализируем скрол контейнеру что
         // надо пересчитать размеры перед scrollToElement.
         this.sendCommand('resizeYourself');
         LayoutManager.scrollToElement(displayedYear.find('.controls-DateRangeBigChoose-MonthRangePickerItem__body'));
      },

      _updateDisplayedYearCssClass: function() {
         if (!this._options.year) {
            return;
         }
         var container = this.getContainer(),
            displayedYear = container.find('.controls-DateRangeBigChoose-MonthRangePickerItem[data-date="' + (new Date(this._options.year, 0)).toSQL() + '"]');

         container.find('.controls-DateRangeBigChoose-MonthRangePickerItem__item-displayed')
            .removeClass('controls-DateRangeBigChoose-MonthRangePickerItem__item-displayed');
         displayedYear.addClass('controls-DateRangeBigChoose-MonthRangePickerItem__item-displayed');
      },

      getYear: function() {
         return this._options.year;
      },

      // showNextYear: function() {
      //    this.setPage(this.getPage() + 1);
      // },
      //
      // showPrevYear: function() {
      //    this.setPage(this.getPage() - 1);
      // },

      _getOffsetByYear: function(year) {
         return year;
      },

      setEndValue: function(end, silent) {
         var changed;
         changed = MonthRangePicker.superclass.setEndValue.call(this, end, silent);
         if (changed) {
            this._updateSelectionInInnerComponents();
         }
         return changed;
      },

      setStartValue: function(start, silent) {
         var changed = MonthRangePicker.superclass.setStartValue.apply(this, arguments);
         if (changed) {
            this._updateSelectionInInnerComponents()
         }
         return changed;
      },

      _drawItemsCallbackSync: function() {
         var self = this,
             container;
         MonthRangePicker.superclass._drawItemsCallbackSync.apply(this, arguments);
         this._$items = null;
         this.forEachMonthView(function(control) {
            container = control.getContainer();
            container.attr(self._selectedRangeItemIdAtr, self._selectedRangeItemToString(control.getMonth()));
         });
         if (!this.isSelectionProcessing()) {
            this._updateSelectionInInnerComponents();
         }
      },

      _onItemMouseEnter: function(e) {
         var $target = $(e.currentTarget),
            month = Date.fromSQL($target.attr(this._selectedRangeItemIdAtr));

         if (!this.isSelectionProcessing() && (!this._options.monthClickable || $target.hasClass('controls-DateRangeBigChoose-MonthRangePickerItem__month_title'))) {
            $target = $(e.currentTarget).closest('.' + this._SELECTABLE_RANGE_CSS_CLASSES.item);
            $target.addClass(this._css_classes.hovered);
            this._notify('onPeriodMouseEnter', month);
         } else if (this.isSelectionProcessing()) {
            this._notify('onPeriodMouseEnter', month);
         }
         this._onRangeItemElementMouseEnter(dateUtils.getEndOfMonth(month));
      },

      onItemMouseLeave: function(e) {
         var $target = $(e.currentTarget),
            target;
         target = $target.closest('.' + this._SELECTABLE_RANGE_CSS_CLASSES.item);
         if (this._options.monthClickable || $target.hasClass('controls-DateRangeBigChoose-MonthRangePickerItem__item')) {
            target.removeClass(this._css_classes.hovered);
         }

         if (!this.isSelectionProcessing()) {
            this._notify('onPeriodMouseLeave');
         }
      },

      _getEndValueOnMouseLeave: function() {
         return dateUtils.getEndOfMonth(this.getStartValue());
      },

      _onMonthActivated: function(e) {
         this._notify('onMonthActivated', e.getTarget().getMonth());
      },

      _selectedRangeItemToString: function(date) {
         return dateUtils.getStartOfMonth(date).toSQL();
      },

      _getSelectedRangeItemsIds: function(start, end) {
         var items = [],
            _start = start;
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

      _getSelectedRangeItemsContainers: function() {
         if (!this._$items) {
            this._$items = this.getContainer().find(['.', this._SELECTABLE_RANGE_CSS_CLASSES.item].join(''));
         }
         return this._$items;
      },

      _onMonthClick: function(e) {
         var month, range;
         this._drawMonthSelection = true;
         if (this.isSelectionProcessing()) {
            month = Date.fromSQL($(e.currentTarget).attr(this._selectedRangeItemIdAtr));
            range = this._updateRange(month, month);
            this._onRangeItemElementClick(range[0], new Date(range[1].getFullYear(), range[1].getMonth() + 1, 0));
            this._updateSelectionInInnerComponents();
         } else {
            if (($(e.target).hasClass('controls-DateRangeBigChoose-MonthRangePickerItem__month_title') || !this._options.monthClickable) && this._options.monthsSelectionEnabled) {
               this._updateSelectionInInnerComponents();
               month = Date.fromSQL($(e.currentTarget).attr(this._selectedRangeItemIdAtr));
               range = this._updateRange(month, month);
               if (this._options.quantum && 'months' in this._options.quantum && this._options.quantum.months.length === 1) {
                  this.setRange(range[0], new Date(range[1].getFullYear(), range[1].getMonth() + 1, 0));
                  this.validateRangeSelectionItemsView();
                  this._notify('onSelectionEnded');
               } else {
                  this._onRangeItemElementClick(range[0], new Date(range[1].getFullYear(), range[1].getMonth() + 1, 0));
               }
            } else {
               if (!this._options.monthsSelectionEnabled && $(e.target).hasClass('controls-DateRangeBigChoose-MonthRangePickerItem__month_title')) {
                  return;
               }
               month = Date.fromSQL($(e.currentTarget).attr(this._selectedRangeItemIdAtr));
               if (this._options.monthClickable) {
                  this._notify('onMonthActivated', month);
               }
            }
            this._updateSelectionInInnerComponents();
         }
      },

      _updateRange: function(startDate, endDate) {
         if (isEmpty(this._options.quantum)) {
            return this._normalizeRange(startDate, endDate);
         }

         var quantum = this._options.quantum,
            lastQuantumLength, lastQuantumType,
            months, range, start, end, i, date;

         if ('months' in quantum) {
            for (i = 0; i < quantum.months.length; i++) {
               lastQuantumLength = quantum.months[i];
               months = endDate.getMonth() - startDate.getMonth() + 1;
               if (lastQuantumLength >= months) {
                  return this._getMonthRange(startDate, endDate, lastQuantumLength);
               }
            }
         }

         return this._getMonthRange(startDate, endDate, lastQuantumLength);
      },

      _getMonthRange: function(startDate, endDate, quantum) {
         var date = new Date(startDate);
         if (startDate <= endDate) {
            date.setMonth(date.getMonth() + quantum - 1);
            return [endDate, date]
         } else {
            date.setMonth(date.getMonth() - quantum + 1);
            return [date, endDate]
         }
      },

      // _onItemEnter: function(e) {
      //    this._onRangeItemElementMouseEnter(Date.fromSQL($(e.currentTarget).attr(this._selectedRangeItemIdAtr)));
      // },


      _updateSelectionInInnerComponents: function(forced) {
         if (!this._innerComponentsValidateTimer && (forced || !this.isSelectionProcessing())) {
            this._innerComponentsValidateTimer = true;
            runDelayed(this._validateInnerComponents.bind(this));
         }
      },

      _validateInnerComponents: function() {
         this._innerComponentsValidateTimer = false;
         this.forEachMonthView(function(control) {
            if (this._isMonthView(control)) {
               control.setRange(this.getStartValue(), this.getEndValue(), true);
            }
         }.bind(this));
      },

      _isMonthView: function(control) {
         return cInstance.instanceOfModule(control, 'SBIS3.CONTROLS/Date/RangeBigChoose/resources/MonthView');
      },

      forEachMonthView: function(func) {
         var self = this;
         this.getChildControls().forEach(function(control) {
            // Почему то в control иногда попадают левые контролы
            if (self._isMonthView(control)) {
               func(control);
            }
         });
      },

      _getMonthsRangeItem: function(date, withoutSelection) {
         var item = {},
            selectionRangeEndItem = dateUtils.normalizeMonth(this._getSelectionRangeEndItem()),
            range = this._getUpdatedRange(this.getStartValue(), this.getEndValue(), selectionRangeEndItem),
            startDate = range[0],
            endDate = dateUtils.normalizeMonth(range[1]);

         item.month = date;

         item.selectionEnabled = this.getSelectionType() === RangeSelectableViewMixin.selectionTypes.range ||
            this.getSelectionType() === RangeSelectableViewMixin.selectionTypes.single;

         item.enabled = this.isEnabled();

         if (!withoutSelection && this._drawMonthSelection) {
            item.selectionProcessing = this._rangeSelection;
            item.selected = date >= startDate && date <= endDate;
            item.selectedStart = dateUtils.isDatesEqual(date, startDate);
            item.selectedEnd = dateUtils.isDatesEqual(date, endDate);

            item.selectedUnfinishedStart = dateUtils.isDatesEqual(date, startDate) &&
               dateUtils.isDatesEqual(date, selectionRangeEndItem) && !dateUtils.isDatesEqual(startDate, endDate);

            item.selectedUnfinishedEnd = dateUtils.isDatesEqual(date, endDate) &&
               dateUtils.isDatesEqual(date, selectionRangeEndItem) && !dateUtils.isDatesEqual(startDate, endDate);

            item.selectedInner = (date && startDate && endDate && date.getTime() > startDate.getTime() && date.getTime() < endDate.getTime());
         }

         return item;
      },

      _prepareRangeCssClasses: function(scope) {
         var prefix = 'controls-DateRangeBigChoose-MonthRangePickerItem__item',
            backgroundColorClass = 'controls-DateRangeBigChoose-MonthRangePickerItem__backgroundColor-item',
            css = [];

         if (scope.item.selected) {
            backgroundColorClass += '-selected';
            if (scope.item.selectedStart || scope.item.selectedEnd) {
               if (scope.item.selectionProcessing) {
                  backgroundColorClass += '-startend-unfinished';
               }
            }
         } else {
            backgroundColorClass += '-unselected';
         }

         if (scope.item.selected) {
            css.push('controls-RangeSelectable__item-selected');
            css.push(prefix + '-selected');
         }
         if (scope.item.selectedUnfinishedStart || scope.item.selectedUnfinishedEnd) {
            css.push(prefix + '-selectedUnfinishedEdge');
         }
         if (scope.item.selectedInner) {
            css.push(prefix + '-selectedInner');
         }

         if (scope.item.selectedStart && !scope.item.selectedUnfinishedStart) {
            css.push('controls-RangeSelectable__item-selectedStart');
            css.push(prefix + '-selectedStart');
         }
         if (scope.item.selectedEnd && (!scope.item.selectionProcessing ||
               (scope.item.selectedEnd !== scope.item.selectedStart  && !scope.item.selectedUnfinishedEnd))) {
            css.push('controls-RangeSelectable__item-selectedEnd');
            css.push(prefix + '-selectedEnd');
         }
         if (scope.item.selectedUnfinishedstart) {
            css.push(prefix + '-selectedUnfinishedStart');
         }
         if (scope.item.selectedUnfinishedEnd) {
            css.push(prefix + '-selectedUnfinishedEnd');
         }
         css.push(backgroundColorClass);
         return css.join(' ');
      },

      _drawCurrentRangeSelection: function(withoutSelection) {
         var domMonths = this.getContainer().find('.controls-DateRangeBigChoose-MonthRangePickerItem__month-wrapper'),
            week, domWeek;

         MonthRangePicker.superclass._drawCurrentRangeSelection.apply(this, arguments);

         domMonths.each(function(index, element) {
            var $element = $(element),
               month = Date.fromSQL($element.attr(this._selectedRangeItemIdAtr)),
               item = this._getMonthsRangeItem(month, withoutSelection);
            if (withoutSelection) {
               $element.removeClass([
                  this._SELECTABLE_RANGE_CSS_CLASSES.selected,
                  this._SELECTABLE_RANGE_CSS_CLASSES.selectedStart,
                  this._SELECTABLE_RANGE_CSS_CLASSES.selectedEnd].join(' '));
            }
            this._updateCssClasses($element, this._prepareRangeCssClasses({item: item}));
         }.bind(this));
      },
      _updateCssClasses: function($element, classes) {
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

      _getItemKeepCssClasses: function() {
         return [
            'controls-DateRangeBigChoose-MonthRangePickerItem__item',
            'controls-DateRangeBigChoose-MonthRangePicker__hovered',
            'controls-DateRangeBigChoose-MonthRangePickerItem__month-wrapper',
            this._SELECTABLE_RANGE_CSS_CLASSES.item,
            this._SELECTABLE_RANGE_CSS_CLASSES.selected,
            this._SELECTABLE_RANGE_CSS_CLASSES.selectedStart,
            this._SELECTABLE_RANGE_CSS_CLASSES.selectedEnd
         ];
      },

      _clearMonthSelection: function() {
         this._drawMonthSelection = false;
         this._drawCurrentRangeSelection(true);
      },

      destroy: function() {
         this.getContainer().off('.monthRangePicker');
         MonthRangePicker.superclass.destroy.apply(this, arguments);
      }

   });
   return MonthRangePicker;
});
