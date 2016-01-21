/**
 * Created by am.gerasimov on 07.12.2015.
 */
define('js!SBIS3.CONTROLS.FilterHistoryController',
    [
       'js!SBIS3.CONTROLS.HistoryController',
       'js!SBIS3.CONTROLS.Data.Collection.List'
    ],

    function(HistoryController, List) {

       'use strict';

       var MAX_FILTERS_AMOUNT = 10;
       var LAST_FILTER_NUMBER = 9;
       var HISTORY_CHANNEL = $ws.single.EventBus.channel('FilterHistoryChannel');

       var FilterHistoryController = HistoryController.extend({
          $protected: {
             _options: {
                /**
                 * Представление данных
                 */
                view: undefined,
                /**
                 * Кнопка фильтров
                 */
                filterButton: undefined,
                /**
                 * Быстрый фильтр
                 */
                fastDataFilter: undefined
             },

             _changeHistoryFnc: undefined,
             _applyHandlerDebounced: undefined,
             _listHistory: undefined
          },

          $constructor: function() {
             this._listHistory = new List({items: this.getHistory() || []});
             this._changeHistoryFnc = this._changeHistoryHandler.bind(this);
             this._applyHandlerDebounced = this._onApplyFilterHandler.debounce(0).bind(this);

             if(this._options.filterButton) {
                this._initFilterButton();
             }

             if(this._options.fastDataFilter) {
                this._initFastDataFilter();
             }

             /* Подпишемся на глобальный канал изменения истории,
                чтобы изменения сразу применялись ко всем реестрам, у которых один historyId */
             HISTORY_CHANNEL.subscribe('onChangeHistory', this._changeHistoryFnc);
          },

          _changeHistoryHandler: function(e, id, newHistory, activeFilter, saveDeferred) {
             /* Если изменения произошло в истории с другим ID или история не изменилась, то ничего делать не будем */
             if (this._options.historyId !== id ||
                 this._listHistory.equals(newHistory) ||
                 $ws.helpers.isEqualObject(this.getActiveFilter(), activeFilter))  {
                return;
             }

             /* Запишем новую историю */
             this._listHistory.fill($ws.core.clone(newHistory.toArray()));
             this._saveParamsDeferred = saveDeferred;
             this._options.filterButton[activeFilter ? 'setFilterStructure' : '_resetFilter'](activeFilter.filter);
             this._updateFilterButtonHistoryView();
          },

          _initFilterButton: function() {
             var fb = this._options.filterButton,
                 self = this;

             this.subscribeTo(fb, 'onResetFilter', function() {
                self.clearActiveFilter();
                if (!self.isNowSaving()) {
                   self.saveToUserParams();
                }
             });

             this.subscribeTo(fb, 'onApplyFilter', this._applyHandlerDebounced);

          },

          _initFastDataFilter: function() {
             this.subscribeTo(this._options.fastDataFilter, 'onApplyFilter', this._applyHandlerDebounced);
          },

          _onApplyFilterHandler: function() {
             var fb = this._options.filterButton,
                 structure = fb.getFilterStructure(),
                 self = this,
                 linkTextArr = [];

             /* Если это дефолтный фильтр, то сохранять в историю не надо */
             if(!fb.getLinkedContext().getValue('filterChanged')) {
                /* Если применили дефолтный фильтр, то надо сбросить текущий активный */
                self.clearActiveFilter();
                self.saveToUserParams();
                return;
             }

             /* Из структуры соберём строку */
             for(var i = 0, len = structure.length; i < len; i++) {
                if(structure[i].caption && !$ws.helpers.isEqualObject(structure[i].value, structure[i].resetValue)) {
                   linkTextArr.push(structure[i].caption);
                }
             }

             self.saveToHistory({
                linkText: linkTextArr.join(', '),
                filter: structure
             });

             self._updateFilterButtonHistoryView();
          },

          _updateFilterButtonHistoryView: function() {
             var fbPicker = this._options.filterButton._picker,
                 filterHistory;

             if(fbPicker) {
                filterHistory = fbPicker.getChildControlByName('filterHistory');
                filterHistory.updateHistoryViewItems();
                filterHistory.toggleHistoryBlock(true);
             }
          },

          activateFilterByKey: function(key) {
             var filter = this.findFilterByKey(key),
                 fb = this._options.filterButton;

             /* Применим фильтр из истории*/
             fb.setFilterStructure(filter.filter);
             fb.getChildControlByName('filterLine').getContext().setValue('linkText', filter.linkText);
             fb.hidePicker();

             /* Если этот фильтр не активный, сделаем его активным и сохраним */
             if(!filter.isActiveFilter) {
                this.clearActiveFilter();
                filter.isActiveFilter = true;
                filter.viewFilter = this._getViewFilter();
                this.saveToUserParams();
             }
          },

          /**
           * Сохраняет объект с фильтром в историю
           * @param filterObject
           */
          saveToHistory: function(filterObject) {
             var equalFilter = $ws.helpers.find(this.getHistoryArr(), function(item) { return $ws.helpers.isEqualObject(item.filter, filterObject.filter); }),
                 activeFilter = this.getActiveFilter();

             /* Если есть активный фильтр - сбросим его */
             if(activeFilter) {
                activeFilter.isActiveFilter = false;
             }

             /* Не сохраняем в историю, если:
                1) Ещё не сохранился предыдущий фильтр,
                2) Такой фильтр уже есть в истории */
             if(this.isNowSaving() || equalFilter) {
                /* Если такой фильтр есть в истории, то надо его сделать активным */
                if(equalFilter && !equalFilter.isActiveFilter) {
                   equalFilter.isActiveFilter = true;
                   equalFilter.viewFilter = this._getViewFilter();
	               this.saveToUserParams()
                }
                return;
             }

             /* Если фильтров больше 10 - удалим последний */
             if (this._listHistory.getCount() === MAX_FILTERS_AMOUNT) {
                this._listHistory.removeAt(LAST_FILTER_NUMBER);
             }


             /* Добавим новый фильтр в начало набора */
             this._listHistory.add({
                id: $ws.helpers.randomId(),
                linkText: filterObject.linkText,
	            viewFilter: this._getViewFilter(),
                filter: filterObject.filter,
                isActiveFilter: true,
                isMarked: false
             });

	          this.saveToUserParams();
          },

          _getViewFilter: function() {
             var view = this._options.view,
                 viewFilter = $ws.core.clone(view.getFilter());

             /* Не сохраняем раздел, т.к. одна и та же история может быть у нескольких представлений */
             if($ws.helpers.instanceOfMixin(view, 'SBIS3.CONTROLS.hierarchyMixin')) {
                delete viewFilter[view.getHierField()];
             }

             return viewFilter;
          },

	       /**
	        * Очищает текущий активный фильтр
	        */
          clearActiveFilter: function() {
             var activeFilter = this.getActiveFilter();

             if(activeFilter) {
                activeFilter.isActiveFilter = false;
             }
          },

          /**
           * Возвращает текущий активный фильтр
           * @private
           */
          getActiveFilter: function() {
             return $ws.helpers.find(this.getHistoryArr(), function(item) {
                return item.isActiveFilter;
             }, this, false);
          },

          /**
           * Ищет фильтр по ключу
           * @param {String} key
           * @private
           */
          findFilterByKey: function(key) {
             return $ws.helpers.find(this.getHistoryArr(), function(item) {
                return item.id == key;
             }, this, false);
          },

          /**
           * Сохраняет историю в пользовательские параметры
           * @private
           */
          saveToUserParams: function() {
             this._sortHistory();
             this.setHistory(this.getHistoryArr(), true);
             HISTORY_CHANNEL.notify('onChangeHistory',
                 this._options.historyId,
                 this._listHistory,
                 this.getActiveFilter(),
                 this.getSaveDeferred()
             );
          },

          /**
           * Изменяет состояние флага отмеченности фильтра на противоположное
           * @param {String} key
           */
          toggleMarkFilter: function(key) {
             var filter = this.findFilterByKey(key);

             if(filter) {
                filter.isMarked = !filter.isMarked;
                this.saveToUserParams();
             }
          },

          getHistoryArr: function() {
             return this._listHistory.toArray();
          },

          _sortHistory: function() {
             /* Сортирует историю по флагу отмеченности и активности.
                Приоритет: отмеченные > активный > обычные. */
             this.getHistoryArr().sort(function(a, b) {
                if(a.isMarked && b.isMarked) {
                   return 0;
                } else if(a.isMarked) {
                   return -1;
                } else if(b.isMarked) {
                   return 1;
                } else if(a.isActiveFilter && b.isActiveFilter) {
                   return 0;
                } else if(a.isActiveFilter) {
                   return -1;
                } else if(b.isActiveFilter) {
                   return 1;
                }
             });
          },

          destroy: function() {
             HISTORY_CHANNEL.unsubscribe('onChangeHistory', this._changeHistoryFnc);
             this._changeHistoryFnc = undefined;
             this._applyHandlerDebounced = undefined;
             FilterHistoryController.superclass.destroy.apply(this, arguments);
          }
       });

       return FilterHistoryController;

    });