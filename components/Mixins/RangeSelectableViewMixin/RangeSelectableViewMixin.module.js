define('js!SBIS3.CONTROLS.RangeSelectableViewMixin', ['Core/core-instance', 'Core/helpers/collection-helpers'], function(cInstance, colHelpers) {
   /**
    * Миксин, добавляющий поведение выделения интервала из нескольких фиксированных элементов
    * @mixin SBIS3.CONTROLS.RangeSelectableViewMixin
    * @public
    * @author Миронов Александр Юрьевич
    */

   var RangeSelectableViewMixin = /**@lends SBIS3.CONTROLS.RangeSelectableViewMixin.prototype  */{
      $protected: {
         _options: {
            // TODO: переименовать в selectionMode {'range', 'single'}. см SBIS3.CONTROLS.DateRangeBigChoosePickerMixin.
            // Возможно стоит сделать синонимы для констатнт {'range'->'date', 'single'->'period'} для контролов работы с датами
            /**
             * Режим выбора диапазона
             * @cfg {Boolean} Если true, то включена возможность выделения диапазона,
             * иначе можно выделить только 1 элемент.
             */
            rangeselect: true,

            /**
             * @cfg {Boolean} Если true, то диапазон обновляется по мере выделения, если false, то он обновляется после
             * окончания выбора.
             * @default false
             */
            liveSelection: false
         },

         _SELECTABLE_RANGE_CSS_CLASSES: {
            // rangeselect: 'controls-RangeSelectable__rangeselect',
            item: 'controls-RangeSelectable__item',
            selected: 'controls-RangeSelectable__item-selected',
            selectedStart: 'controls-RangeSelectable__item-selectedStart',
            selectedEnd: 'controls-RangeSelectable__item-selectedEnd',
            selecting: 'controls-RangeSelectable__selecting'
         },

         _selectedRangeItemIdAtr: 'data-selected-range-id',

         _$items: null,
         _rangeSelection: false,
         _rangeSelectionEnd: null,
         _rangeSelectionViewValidateTimer: null
      },

      $constructor: function() {
         if(!cInstance.instanceOfMixin(this, 'SBIS3.CONTROLS.RangeSelectableViewMixin')) {
            throw new Error('RangeSelectableViewMixin mixin is required');
         }
         this._publish('onBeforeSelectionStarted', 'onSelectionStarted', 'onBeforeSelectionEnded', 'onSelectionEnded');
      },

      /**
       * Возвращает состояние режима выделения.
       * @returns {boolean} True если пользователь кликнул по первому элементу(начал выделение),
       * но еще не выбрал последний.
       */
      isSelectionProcessing: function () {
         return this._rangeSelection;
      },

      /**
       * Если true, то включен режим выделения диапазона, иначе можно выделить только 1 элемент.
       * @returns {boolean}
       */
      isRangeselect: function () {
         return this._options.rangeselect;
      },

      /**
       * Эту функцию должен вызывать контрол, реализующий выделение диапазона,
       * когда пользователь наводит мышкой на один из выделяемых элементов.
       * Если пользователь начал выделение, то на все элементы от первого до текущего
       * накидывается css класс показывающий, что эти элемены выделены.
       * @param item {*} Объект соответствующий элементу.
       * @private
       */
      _onRangeItemElementMouseEnter: function (item) {
         if (this.isSelectionProcessing()) {
            if (this._options.liveSelection) {
               this.setEndValue(item);
            }
            this._setSelectionRangeEndItem(item);
            this.validateRangeSelectionItemsView();
         }
      },

      /**
       * Эту функцию должен вызвать контрол, реализующий выделение диапазона,
       * когда пользователь кликает по одному из выделяемых элементов.
       * @param item {*} Объект соответствующий элементу.
       * @param endItem {*} Объект соответствующий последнему выделенному элементу. Если он задан,
       * то сразу же выделяется несколько первых элементов
       * @private
       */
      _onRangeItemElementClick: function (item, endItem) {
         if (this.isRangeselect()) {
            if (this.isSelectionProcessing()) {
               this._stopRangeSelection(item, endItem);
            } else {
               this._startRangeSelection(item, endItem);
            }
         } else {
            this.setRange(item, endItem);
            this.validateRangeSelectionItemsView();
         }
      },

      /**
       * Эту функцию должен вызвать контрол, реализующий выделение диапазона,
       * когда пользователь убирает мышку из области в которой находятся выделяемые элементы.
       * @private
       */
      _onRangeControlMouseLeave: function () {
         if (this.isSelectionProcessing()) {
            if (this._options.liveSelection) {
               this.setEndValue(this._getEndValueOnMouseLeave());
            }
            this._resetSelectionEndTmpItem();
         }
      },
      _getEndValueOnMouseLeave: function () {
         this.getStartValue();
      },
      /**
       * Устанавливает последний элемет над которым была мышка
       * @param item {*}
       * @returns {boolean}
       * @private
       */
      _setSelectionRangeEndItem: function (item) {
         if (item === this._rangeSelectionEnd) {
            return false;
         }
         this._rangeSelectionEnd = item;
         this._rangeSelection = !!item;
         this._updateContainerSelectionClass();
         this.validateRangeSelectionItemsView();
         return true;
      },
      /**
       * Возвращает последний элемент над которым была мышка
       * @returns {*}
       * @private
       */
      _getSelectionRangeEndItem: function () {
         return this._rangeSelectionEnd;
      },

      _updateContainerSelectionClass: function () {
         if (this._rangeSelection) {
            this.getContainer().addClass(this._SELECTABLE_RANGE_CSS_CLASSES.selecting);
         } else {
            this.getContainer().removeClass(this._SELECTABLE_RANGE_CSS_CLASSES.selecting);
         }
      },

      /**
       * Начинает выделение диапазона
       * @param start первый элемент
       * @param end последний элемент
       * @param silent если true то не генерировать события
       * @private
       */
      _startRangeSelection: function (start, end, silent) {
         var range;
         if (end) {
            range = this._normalizeRange(start, end);
            start = range[0];
            end = range[1];
         } else {
            end = start;
         }
         this._notify('onBeforeSelectionStarted', start, end);
         this._rangeSelection = true;
         this.setRange(start, end, silent);
         this._setSelectionRangeEndItem(this.getEndValue(), silent);
         this._updateContainerSelectionClass();
         this._notify('onSelectionStarted');
      },
      /**
       * Завершает выделение диапазона
       * @param date
       * @param endDate
       * @private
       */
      _stopRangeSelection: function (date, endDate) {
         var range = this._getUpdatedRange(this.getStartValue(), this.getEndValue(), date, endDate);
         this._notify('onBeforeSelectionEnded', range[0], range[1]);
         this.setRange(range[0], range[1]);
         this._setSelectionRangeEndItem();
         this.validateRangeSelectionItemsView();
         this._updateContainerSelectionClass();
         this._notify('onSelectionEnded');
      },
      /**
       * Приводит диапазон к нормальному состоянию. Начальное значение меньше конечного.
       * @param start
       * @param end
       * @returns {*[]}
       * @private
       */
      _normalizeRange: function (start, end) {
         if (start > end) {
            return [end, start]
         } else {
            return [start, end]
         }
      },

      /**
       * Объединяет 2 диапазона
       * @param start начало первого диапазона
       * @param end конец первого диапазона
       * @param newRangeStart начало второго диапазона
       * @param newRangeEnd конец второго диапазона
       * @returns {*[]}
       * @private
       */
      _getUpdatedRange: function (start, end, newRangeStart, newRangeEnd) {
         var dates = [start, end, newRangeStart, newRangeEnd],
            filteredDates = [];
         for (var i = 0; i < dates.length; i++) {
            if (dates[i]) {
               filteredDates.push(dates[i]);
            }
         }
         start =new Date(Math.min.apply(null, filteredDates));
         end = new Date(Math.max.apply(null, filteredDates));
         return [start, end]
      },

      _resetSelectionEndTmpItem: function () {
         if (this.isSelectionProcessing()) {
            this._rangeSelectionEnd = null;
            this._drawCurrentRangeSelection();
         }
      },

      /**
       * Обновить представление в соответствии с текущим состояние контрола
       * @private
       */
      _drawCurrentRangeSelection: function() {
         // Если в данный момент контрол находится в состоянии выделения,
         // то в качестве начала или конца интервала используем _rangeSelectionEnd
         var range = this._getUpdatedRange(this.getStartValue(), this.getEndValue(), this._getSelectionRangeEndItem());

         this._drawRangeSelection(range[0], range[1]);
      },

      /**
       * Обновляет представление в соответствии с переданным диапазоном
       * @param start {Number}
       * @param end {Number}
       * @private
       */
      _drawRangeSelection: function (start, end) {
         var range, items;

         this._clearRangeSelection();

         if (start == null) {
            return;
         }

         end = end || start;
         range = this._normalizeRange(start, end);

         start = range[0];
         end = range[1];

         range = this._getSelectedRangeItemsIds(start, end);

         if (range && range.items.length) {
            this._drawSelectedRangeItems(range.items, range.start, range.end);
         }
      },

      /**
       * Возвращает идентификаторы элементов которые должны быть выделены.
       * @param start первый элемент
       * @param end последний элемент
       * @returns {Object} Объект содержащий поля items - массив идентификаторов элементов представления которых должны быть выделены,
       * start - идентификатор элемента который должен быть подсвечен как первый, end - идентификатор последнего элемента
       * @private
       */
      _getSelectedRangeItemsIds: function (start, end) {
         var items = [];
         for(var i = start; i <= end; i++) {
            items.push(i);
         }
         return {
            items: items,
            start: start,
            end: end
         };
      },

      _clearRangeSelection: function () {
         this._getSelectedRangeItemsContainers().removeClass([
            this._SELECTABLE_RANGE_CSS_CLASSES.selected,
            this._SELECTABLE_RANGE_CSS_CLASSES.selectedStart,
            this._SELECTABLE_RANGE_CSS_CLASSES.selectedEnd
         ].join(' '));
      },

      /**
       * Применяет классы выделения к dom элементам с идентификаторами idArray, startId, endId
       * @param idArray идентификаторы выделенных элементов
       * @param startId идентифкатор dom элемента соответсвующий первому элементу
       * @param endId идентифиактор dom элемента соответствующий последнему элементу
       * @private
       */
      _drawSelectedRangeItems: function (idArray, startId, endId) {
         this._addSelectedRangeClassToItems(idArray, this._SELECTABLE_RANGE_CSS_CLASSES.selected);

         if (startId) {
            this._addSelectedRangeClassToItems(startId, this._SELECTABLE_RANGE_CSS_CLASSES.selectedStart);
         }
         if (endId) {
            this._addSelectedRangeClassToItems(endId, this._SELECTABLE_RANGE_CSS_CLASSES.selectedEnd);
         }
      },

      _addSelectedRangeClassToItems: function (ids, cls) {
         if (!(ids instanceof Array)) {
            ids = [ids];
         }

         ids = colHelpers.map(ids, function (itemId) {
            return [
               '.',
               this._SELECTABLE_RANGE_CSS_CLASSES.item,
               '[',
               this._selectedRangeItemIdAtr,
               '="',
               itemId,
               '"]'
            ].join('');
         }.bind(this));

         this._getSelectedRangeItemsContainers().filter(ids.join(',')).addClass(cls);
      },

      _getSelectedRangeItemsContainers: function () {
         if (!this._$items) {
            this._$items = this.getContainer().find(['.', this._SELECTABLE_RANGE_CSS_CLASSES.item].join(''));
         }
         return this._$items;
      },

      // _selectedRangeItemToString: function (item) {
      //    return item.toString();
      // },

      /**
       * Помечает контрол, что его представление не соотвтетсвует модели. После того как текущий код отработает,
       * и управление будет отдано браузеру, будет вызвана функция _validateRangeSelectionItemsView которая должна обновить представление.
       */
      validateRangeSelectionItemsView: function () {
         var self = this;
         if (!this._rangeSelectionViewValidateTimer) {
            this._rangeSelectionViewValidateTimer = setTimeout(this._validateRangeSelectionItemsView.bind(this), 0);
         }
      },

      /**
       * Вызывается из validateRangeSelectionItemsView и перерисовывает представление
       * @private
       */
      _validateRangeSelectionItemsView: function () {
         this._rangeSelectionViewValidateTimer = null;
         this._drawCurrentRangeSelection();
      },

      /**
       * Отменяет начатый пользователем процесс выделения.
       */
      cancelSelection: function () {
         if (this.isSelectionProcessing()) {
            this._rangeSelection = false;
            this._rangeSelectionEnd = null;
            this.validateRangeSelectionItemsView();
            return true;
         }
         return false;
      }

   };

   return RangeSelectableViewMixin;

});
