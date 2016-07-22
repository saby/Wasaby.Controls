define('js!SBIS3.CONTROLS.RangeSelectableViewMixin', [], function() {
   /**
    * Миксин, добавляющий поведение выделения интервала из нескольких фиксированных элементов
    * @mixin SBIS3.CONTROLS.RangeSelectableViewMixin
    * @public
    * @author Миронов Александр Юрьевич
    */

   var RangeSelectableViewMixin = /**@lends SBIS3.CONTROLS.RangeSelectableViewMixin.prototype  */{
      $protected: {
         _options: {
            /**
             * @cfg {Boolean} Если true, то включена возможность выделения диапазона,
             * иначе можно выделить только 1 элемент.
             */
            rangeselect: true
         },

         _SELECTABLE_RANGE_CSS_CLASSES: {
            item: 'controls-RangeSelectable__item',
            selected: 'controls-RangeSelectable__item-selected',
            selectedStart: 'controls-RangeSelectable__item-selectedStart',
            selectedEnd: 'controls-RangeSelectable__item-selectedEnd'
         },

         _selectedRangeItemIdAtr: 'data-selected-range-id',

         _$items: null,
         _rangeSelection: false,
         _rangeSelectionEnd: null,
         _rangeSelectionViewValidateTimer: null
      },

      $constructor: function() {
         if(!$ws.helpers.instanceOfMixin(this, 'SBIS3.CONTROLS.RangeSelectableViewMixin')) {
            throw new Error('RangeSelectableViewMixin mixin is required');
         }
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
            this._setSelectionRangeEndItem(item);
            this.validateRangeSelectionItemsView();
         }
      },

      /**
       * Эту функцию должен вызвать контрол, реализующий выделение диапазона,
       * когда пользователь кликает по одному из выделяемых элементов.
       * @param item {*} Объект соответствующий элементу.
       * @private
       */
      _onRangeItemElementClick: function (item) {
         if (this.isRangeselect()) {
            if (this.isSelectionProcessing()) {
               this._stopRangeSelection(item);
            } else {
               this._startRangeSelection(item);
            }
         } else {
            this.setRange(item, item);
            this.validateRangeSelectionItemsView();
         }
      },

      /**
       * Эту функцию должен вызвать контрол, реализующий выделение диапазона,
       * когда пользователь убирает мышку из области в которой нахдятся выделяемые элементы.
       * @private
       */
      _onRangeControlMouseLeave: function () {
         if (this.isSelectionProcessing()) {
            this._resetSelectionEndTmpItem();
         }
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
         this._rangeSelection = item ? true : false;
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

      /**
       * Начинает выделение диапазона
       * @param start первый элемент
       * @param end последний элемент
       * @param silent если true то не генерировать события
       * @private
       */
      _startRangeSelection: function (start, end, silent) {
         end = end || start;
         this.setRange(start, end, silent);
         this._setSelectionRangeEndItem(this.getEndValue(), silent);
      },
      /**
       * Завершает выделение диапазона
       * @param date
       * @private
       */
      _stopRangeSelection: function (date) {
         var range = this._normalizeRange(this.getStartValue(), date);
         this.setRange(range[0], range[1]);
         this._setSelectionRangeEndItem();
         this.validateRangeSelectionItemsView();
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
         var start = this.getStartValue(),
            end;

         // Если в данный момент пользователь выбирает дни, то в качестве конца интервала используем _rangeSelectionEnd
         end = this._getSelectionRangeEndItem() || this.getEndValue();
         this._drawRangeSelection(start, end);
      },

      /**
       * Обновляет представление в соответствии с переданным диапазоном
       * @param start {Number}
       * @param end {Number}
       * @private
       */
      _drawRangeSelection: function (start, end) {
         var range, items;

         end = end || start;
         range = this._normalizeRange(start, end);

         start = range[0];
         end = range[1];

         this._clearRangeSelection();

         items = this._getSelectedRangeItems(start, end);

         this._drawSelectedRangeItems(items, start, end);
      },

      /**
       * Возвращает элементы которые должны быть выделены.
       * @param start первый элемент
       * @param end последний элемент
       * @returns {Array} Массив элементов представления которых должны быть выделены.
       * @private
       */
      _getSelectedRangeItems: function (start, end) {
         var items = [];
         for(var i = start; i <= end; i++) {
            items.push(i);
         }
         return items;
      },

      _clearRangeSelection: function () {
         this._getSelectedRangeItemsContainers().removeClass([
            this._SELECTABLE_RANGE_CSS_CLASSES.selected,
            this._SELECTABLE_RANGE_CSS_CLASSES.selectedStart,
            this._SELECTABLE_RANGE_CSS_CLASSES.selectedEnd
         ].join(' '));
      },

      _drawSelectedRangeItems: function (idArray, start, end) {
         this._addSelectedRangeClassToItems(idArray, this._SELECTABLE_RANGE_CSS_CLASSES.selected);

         if (start) {
            this._addSelectedRangeClassToItems(start, this._SELECTABLE_RANGE_CSS_CLASSES.selectedStart);
         }
         if (end) {
            this._addSelectedRangeClassToItems(end, this._SELECTABLE_RANGE_CSS_CLASSES.selectedEnd);
         }
      },

      _addSelectedRangeClassToItems: function (ids, cls) {
         if (!(ids instanceof Array)) {
            ids = [ids];
         }

         ids = $ws.helpers.map(ids, function (item) {
            return [
               '.',
               this._SELECTABLE_RANGE_CSS_CLASSES.item,
               '[',
               this._selectedRangeItemIdAtr,
               '="',
               this._selectedRangeItemToString(item),
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

      _selectedRangeItemToString: function (item) {
         return item.toString();
      },

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
      }

   };

   return RangeSelectableViewMixin;

});
