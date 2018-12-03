define('SBIS3.CONTROLS/Date/RangeBigChoose/resources/DateRangePicker', [
   "Core/constants",
   'Core/detection',
   'Core/helpers/Function/throttle',
   'Core/helpers/Object/isEmpty',
   "SBIS3.CONTROLS/ListView",
   "tmpl!SBIS3.CONTROLS/Date/RangeBigChoose/resources/DateRangePickerItem",
   "SBIS3.CONTROLS/Mixins/RangeMixin",
   "SBIS3.CONTROLS/Utils/DateUtil",
   "Core/core-instance",
   'SBIS3.CONTROLS/Date/RangeBigChoose/resources/CalendarSource',
   'Lib/LayoutManager/LayoutManager',
   'Controls/Calendar/Utils',
   "SBIS3.CONTROLS/Date/RangeBigChoose/resources/MonthView",
   'SBIS3.CONTROLS/ScrollContainer',
   'browser!SBIS3.CONTROLS/ListView/resources/SwipeHandlers'
], function(
   constants,
   detection,
   throttle,
   isEmpty,
   ListView,
   ItemTmpl,
   RangeMixin,
   DateUtils,
   cInstance,
   CalendarSource,
   LayoutManager,
   calendarUtils
) {
   'use strict';
   var cConst = constants; //константы нужны для работы дат, не уверен что можно отключать из зависимостей (стан ругается)

   var monthSource = new CalendarSource(),
      buildTplArgsDRP = function(cfg) {
            var tplOptions = cfg._buildTplArgsLV.call(this, cfg);
            tplOptions.quantum = cfg.quantum;
            tplOptions.monthSelectionEnabled = cfg.monthSelectionEnabled;
            tplOptions.serializationMode = cfg.serializationMode;
            tplOptions.dayFormatter = cfg.dayFormatter;
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

            infiniteScrollPreloadOffset: 3000,

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
         _selectionRangeEndItem: null
         // _selectionType: null
      },
      _isAnimationProcessing: false,
      _scrollToElement: null,
      _isDisplayedRangeChangedEventActive: true,

      $constructor: function() {
         this._publish('onMonthActivated');
      },

      init: function() {
         var self = this,
            container = this.getContainer();

         this._onMonthViewRageChanged = this._onMonthViewRageChanged.bind(this);
         this._onMonthViewDisplayedRangeChanged = this._onMonthViewDisplayedRangeChanged.bind(this);
         this._onMonthViewBeforeSelectionStarted = this._onMonthViewBeforeSelectionStarted.bind(this);
         this._onMonthViewSelectionStarted = this._onMonthViewSelectionStarted.bind(this);
         this._onMonthViewSelectingRangeEndDateChange = this._onMonthViewSelectingRangeEndDateChange.bind(this);
         this._onMonthViewCaptionActivated = this._onMonthViewCaptionActivated.bind(this);
         this._onSelectionEnded = this._onSelectionEnded.bind(this);
         this._scrollAnimationComplete = this._scrollAnimationComplete.bind(this);

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

         if (this._options.monthSelectionEnabled) {
            container.on('click', '.controls-DateRangeBigChoose-DateRangePickerItem__monthsWithDates_item_title', this._onMonthTitleClick.bind(this));
            if (!detection.isMobileIOS) {
               container.on('mouseenter.dateRangePicker', '.controls-DateRangeBigChoose-DateRangePickerItem__monthsWithDates_item_title', this._onMonthTitleMouseEnter.bind(this));
            }
         }

         container.on('click', '.controls-DateRangeBigChoose-DateRangePickerItem__months-nextyear-btn', this._onNextYearClick.bind(this));
         container.on('click', '.controls-DateRangeBigChoose-DateRangePickerItem__months-btn', this._onMonthClick.bind(this));

         if (!detection.isMobileIOS) {
            container.on('mouseleave.dateRangePicker', this._onRangeControlMouseLeave.bind(this));
         }

         this._getScrollContainer().on('scroll', this._onScroll.bind(this));

         container.on(constants.compatibility.wheel, '.controls-DateRangeBigChoose-DateRangePickerItem__months', this._onWheel.bind(this));
         if (detection.isMobileIOS) {
            container.on('touchmove', '.controls-DateRangeBigChoose-DateRangePickerItem__months', function(event){event.preventDefault()});
            container.on('swipeVertical', this._onSwipe.bind(this));
         }

         this._yearTitleContainer = container.find('.controls-DateRangeBigChoose__dates-header-year');
      },

      _modifyOptions: function(options) {
         options = Component.superclass._modifyOptions.apply(this, arguments);
         options.monthSelectionEnabled = isEmpty(options.quantum) || ('months' in options.quantum && options.quantum.months.indexOf(1) !== -1);
         return options;
      },

      _onRangeControlMouseLeave: function() {
         if (this.isSelectionProcessing()) {
            this.forEachMonthView(function(control) {
               control._onRangeControlMouseLeave(null, true);
            });
            this._notify('onPeriodMouseLeave');
         }
      },

      _onScroll: throttle(function() {
         // TODO: переделать условие
         if (!this.getContainer().is(':visible')) {
            return;
         }

         // Округляем т.к. в ie offset().top возвращает дробные значения. Причем эти значения у _scrollContainer
         // и у вложенного элемента, который проскролили в самый верх скролируемой области,
         // могут отличаться на тысячные доли..
         var scrollContainerTop = Math.floor(this._getScrollContainer().offset().top),
            first = false,
            date;
         date = this.getContainer().find('.controls-DateRangeBigChoose-DateRangePickerItem__monthsWithDates_item_wrapper').filter(function(index, element) {
            element = $(element);
            if (scrollContainerTop < Math.floor(element.offset().top + element.height()) && !first) {
               first = true;
               return true;
            }
         }).data('date');
         date =  Date.fromSQL(date);
         this._setMonth(date);
         this._updateDisplayedYearCssClass();
      }, 300, true),

      _getItemHeight: function() {
         return this.getContainer().find('.controls-DateRangeBigChoose-DateRangePickerItem__monthsWithDates_item_wrapper').first().outerHeight();
      },

      _onWheel: function(event) {
         var originalEvent = event.originalEvent,
            direction;

         if (originalEvent.wheelDelta !== undefined) {
            direction = originalEvent.wheelDelta > 0 ? -1 : 1;
         } else {
            direction = originalEvent.deltaY < 0 ? -1 : 1;
         }
         event.preventDefault();
         this._onScrollOverMonths(direction, $(event.target).closest('.controls-DateRangeBigChoose-DateRangePickerItem'))
      },

      _onSwipe: function(event) {
         if ($(event.target).closest('.controls-DateRangeBigChoose-DateRangePickerItem__months').length === 0) {
            return;
         }
         event.preventDefault();
         this._onScrollOverMonths(event.direction === 'bottom' ? -1 : 1, $(event.target).closest('.controls-DateRangeBigChoose-DateRangePickerItem'));
      },

      _onScrollOverMonths: function(direction, element) {
         var scrollContainer = this._getScrollContainer();

         element = direction > 0 ? element.next() : element.prev();

         // Следующий месяц мог еще не отрисоваться, в этом случае не обрабатываем скролирование
         if (element.length === 0) {
            return;
         }

         this._isAnimationProcessing = true;
         this._scrollToElement = element;

         scrollContainer.finish().animate({
            scrollTop: scrollContainer.scrollTop() + element.offset().top -  scrollContainer.offset().top
         }, {
            duration: 750,
            done: this._scrollAnimationComplete
         });
      },

      _getScrollTopByElement: function(element) {
         var scrollContainer = this._getScrollContainer();
         return scrollContainer.scrollTop() + element.offset().top -  scrollContainer.offset().top;
      },

      _scrollAnimationComplete: function(animation, jumpedToEnd) {
          if (!jumpedToEnd) {
             this._isAnimationProcessing = false;
             this._scrollToElement = null;
             this._onScroll();
          }
      },

      _moveTopScroll: function() {
         var scrollContainer = this._getScrollContainer();

         if (this._isAnimationProcessing) {
            // Если идет предыдущая анимация и догрузились данные, то переходим на середину предыдущего года
            // и продолжаем анимацию с этого положения.
            scrollContainer.stop(true);
            scrollContainer.scrollTop(this._getScrollTopByElement(this._scrollToElement.next()) - 1000);
            scrollContainer.animate({
               scrollTop: this._getScrollTopByElement(this._scrollToElement)
            }, {
               duration: 400,
               done: this._scrollAnimationComplete
            });
            return;
         }
         Component.superclass._moveTopScroll.apply(this, arguments);
      },

      _onMonthTitleClick: function(event) {
         var date = this._getDateByMonthTitleEvent(event),
            tmpStart = this.getStartValue(),
            range, start, end;
         if (this.isSelectionProcessing()) {
            if (tmpStart >= date) {
               range = calendarUtils.updateRangeByQuantum(tmpStart, date, this._options.quantum || {});
            } else {
               range = calendarUtils.updateRangeByQuantum(
                  tmpStart,
                  new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1),
                  this._options.quantum || {}
               );
            }
            start = range[0];
            end = range[1];
            this.cancelSelection();
         } else {
            start = date;
            end = DateUtils.getEndOfMonth(date);
         }
         this.setRange(start, end);
         this._notify('onSelectionEnded');
      },
      _onMonthTitleMouseEnter: function(event) {
         var date = this._getDateByMonthTitleEvent(event),
            startDate = this.getStartValue();
         if (this.isSelectionProcessing()) {
            if (date > startDate) {
               this._onMonthViewSelectingRangeEndDateChange(null, new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1));
            } else {
               this._onMonthViewSelectingRangeEndDateChange(null, date);
            }
         }
      },

      _getDateByMonthTitleEvent: function(event) {
         return Date.fromSQL($(event.currentTarget).data('date'));
      },

      _onNextYearClick: function(event) {
         var date;
         if (!this._isAnimationProcessing) {
            date = new Date.fromSQL($(event.target).data('date'));
            this.setMonth(new Date(date.getFullYear() + 1, 0));
         }
      },

      _onMonthClick: function(event) {
         var date = new Date.fromSQL($(event.target).data('date'));
         this.setMonth(date);
      },

      setMonth: function(month) {
         // Не генерируем событие onDayMouseEnter сразу же после после прокрутки. Это событие стреляет
         // по ховеру, а ховер срабатывает сразу после прорутки. Получается что если мы вводим
         // во второе поле воле воода дату и этот ввод приводит к прокручиванию списка месяцев,
         // срабатывает onDayMouseEnter и фокус переходит в первое поле.
         this._isDisplayedRangeChangedEventActive = false;
         setTimeout(function() {
            this._isDisplayedRangeChangedEventActive = true;
         }.bind(this), 200);

         var oldMonth = this._options.month,
            changed = this._setMonth(month);

         if (changed) {
            if (!DateUtils.isYearsEqual(month, oldMonth)) {
               // Если открывают декабрь, то сразу же после открытия надо отобразить первую неделю следующего года.
               // Для этого делаем размер страницы 2 айтема. Если открываем другие месяца, то используем pageSize 1.
               // Так работает быстрее.
               this.setPageSize(month && month.getMonth() === 11 ? 2 : 1, true);
               // TODO: временный хак. Базовый класс не релоудит данные если не установлен showPaging
               this.setOffset(this._getOffsetByMonth(month));
               this.reload().addCallback(function(list) {
                  this._updateScrollPosition();
                  return list;
               }.bind(this));
            } else {
               this._updateScrollPosition();
            }
         }
      },

      _setMonth: function(month) {
         month = DateUtils.normalizeMonth(month);

         if (DateUtils.isDatesEqual(month, this._options.month)) {
            return false;
         }
         this._options.month = month;
         this._notify('onMonthChanged');
         this._fixMonthsBar();
         return true;
      },

      getMonth: function() {
         return this._options.month;
      },

      isSelectionProcessing: function() {
         return !!this._selectionRangeEndItem;
      },

      _getOffsetByMonth: function(month) {
         return month.getFullYear();
      },

      _onDateRangePickerDrawItems: function() {
         var self = this;

         this.forEachMonthView(function(control) {
            control.unsubscribe('onSelectionEnded', self._onSelectionEnded);
            control.subscribe('onSelectionEnded', self._onSelectionEnded);
            control.unsubscribe('onRangeChange', self._onMonthViewRageChanged);
            control.subscribe('onRangeChange', self._onMonthViewRageChanged);
            control.unsubscribe('onBeforeSelectionStarted', self._onMonthViewBeforeSelectionStarted);
            control.subscribe('onBeforeSelectionStarted', self._onMonthViewBeforeSelectionStarted);
            control.unsubscribe('onSelectionStarted', self._onMonthViewSelectionStarted);
            control.subscribe('onSelectionStarted', self._onMonthViewSelectionStarted);
            control.unsubscribe('onSelectingRangeEndDateChange', self._onMonthViewSelectingRangeEndDateChange);
            control.subscribe('onSelectingRangeEndDateChange', self._onMonthViewSelectingRangeEndDateChange);
            control.unsubscribe('onDisplayedRangeChanged', self._onMonthViewDisplayedRangeChanged);
            control.subscribe('onDisplayedRangeChanged', self._onMonthViewDisplayedRangeChanged);
         });
         this._updateSelectionInInnerComponents();
         this._updateDisplayedYearCssClass();
         this._fixMonthsBar();
      },

      _fixMonthsBar: function() {
         var container,
            monthContainer,
            scrollContainerOffset;

         // Хак для ie\edge и chrome под winXP. Выпилить как перестанем поддерживать ie и edge меньше 16
         // которые не поддерживают position: sticky. Панели с месяцами фиксируем через position: fixed и top,
         // а их видимостью управляем через стили.
         if (detection.isIE || (detection.isWinXP && detection.chrome)) {
            container = this.getContainer();
            scrollContainerOffset = container.closest('.controls-ScrollContainer__content')[0].getBoundingClientRect().top;
            monthContainer = container.find('.controls-DateRangeBigChoose-DateRangePickerItem__months');
            monthContainer.css({'top': scrollContainerOffset - parseInt(monthContainer.css('margin-top'), 10)});
         }
      },

      _onSelectionEnded: function() {
         this._notify('onSelectionEnded');
      },

      _updateScrollPosition: function() {
         if (!this._options.month) {
            return;
         }
         var container = this.getContainer(),
            displayedContainer = container.find('.controls-DateRangeBigChoose-DateRangePickerItem__monthsWithDates_item_wrapper[data-date="' + this._options.month.toSQL() + '"]');
         // При изменеии размера контента если его высота равна 0(а это может быть даже если контент есть, а родитель
         // ScrollContainer скрыт) ScrollContainer навешивает overflow: hidden. Заза этого scrollToElement
         // не может найти контейнер в котором происходит скролирование. Сигнализируем скрол контейнеру что
         // надо пересчитать размеры перед scrollToElement.
         this.sendCommand('resizeYourself');
         this._fixMonthsBar();
         LayoutManager.scrollToElement(displayedContainer);
         this._updateDisplayedYearCssClass();
      },

      _updateDisplayedYearCssClass: function() {
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

      setStartValue: function(start, silent) {
         var changed = Component.superclass.setStartValue.apply(this, arguments);
         if (changed) {
            this._updateSelectionInInnerComponents();
         }
         return changed;
      },

      setEndValue: function(end, silent) {
         var changed = Component.superclass.setEndValue.apply(this, arguments);
         if (changed) {
            this._updateSelectionInInnerComponents();
         }
         return changed;
      },

      _prepareItemData: function() {
         var args = Component.superclass._prepareItemData.apply(this, arguments);
         args.selectionType = this._options.selectionType;
         return args;
      },

      _onMonthViewCaptionActivated: function(e) {
         this._notify('onActivated', e.getTarget().getMonth());
      },

      _onMonthViewRageChanged: function(e, start, end) {
         this.setRange(start, end);
      },

      _onMonthViewDisplayedRangeChanged: function(e, start, end) {
         if (this._isDisplayedRangeChangedEventActive && this.isSelectionProcessing()) {
            this._notify('onDisplayedRangeChanged', start, end);
         }
         this._isDisplayedRangeChangedEventActive = true;
      },

      _onMonthViewSelectingRangeEndDateChange: function(e, date, _date) {
         this._selectionRangeEndItem = date;
         this._updateSelectionInInnerComponents();
      },

      _onMonthViewBeforeSelectionStarted: function(e, start, end) {
         // Сохраняем состояние календаря, в котором начилось выделение, непосредственно перед началом выделения
         // потому что во время выделения, он может быть удален если инициируется смена месяца.
         // В этом случае обрабочик _onMonthViewSelectingRangeEndDateChange не будет выполнен.
         // this._selectionType = e.getTarget()._getSelectionType();
         this._selectionRangeEndItem = end;
         this._notify('onDayMouseEnter', start);
      },

      _onMonthViewSelectionStarted: function(event) {
         this._notify('onSelectionStarted');
      },

      // _updateInnerComponents: function(start, end) {
      //    this.forEachMonthView(function(control) {
      //       control.setRange(start, end, true);
      //    });
      // },

      _updateSelectionInInnerComponents: function() {
         if (!this._innerComponentsValidateTimer) {
            this._innerComponentsValidateTimer = setTimeout(this._validateInnerComponents.bind(this), 0);
         }
      },

      startSelection: function(start, end) {
         // this._selectionType = 'day';
         this._selectionRangeEndItem = end;
         this.setRange(start, start, true);
         this._updateSelectionInInnerComponents();
      },

      _validateInnerComponents: function() {
         this._innerComponentsValidateTimer = null;
         this.forEachMonthView(function(control) {
            if (this._isMonthView(control)) {
               control.setRange(this.getStartValue(), this.getEndValue(), true);
               control._setSelectionRangeEndItem(this._selectionRangeEndItem, true);
            }
         }.bind(this));
      },

      _isMonthView: function(control) {
         return cInstance.instanceOfModule(control, 'SBIS3.CONTROLS/Date/RangeBigChoose/resources/MonthView');
      },

      forEachMonthView: function(func) {
         var self = this;
         this.getChildControls().forEach(function(control) {
            if (self._isMonthView(control)) {
               func(control);
            }
         });
      },

      cancelSelection: function() {
         this._selectionRangeEndItem = null;
         this._isDisplayedRangeChangedEventActive = false;
         // this._selectionType = null;
         this.forEachMonthView(function(control) {
            control.cancelSelection();
         });
      },

      destroy: function() {
         this.getContainer().off('.dateRangePicker');
         Component.superclass.destroy.apply(this, arguments);
      }

   });
   return Component;
});
