/**
 * Created by am.gerasimov on 07.12.2015.
 */
define('js!SBIS3.CONTROLS.FilterHistoryController',
    [
   "Core/core-functions",
   "Core/EventBus",
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!SBIS3.CONTROLS.HistoryController",
   "js!WS.Data/Collection/List",
   "js!SBIS3.CONTROLS.FilterButton.FilterToStringUtil",
   "js!SBIS3.CONTROLS.FilterHistoryControllerUntil",
   "Core/helpers/collection-helpers",
   "Core/helpers/generate-helpers"
],

    function( cFunctions, EventBus, IoC, ConsoleLogger,HistoryController, List, FilterToStringUtil, FilterHistoryControllerUntil, colHelpers, genHelpers) {

       'use strict';

       var MAX_FILTERS_AMOUNT = 10;
       var LAST_FILTER_NUMBER = 9;
       var HISTORY_CHANNEL = EventBus.channel('FilterHistoryChannel');

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
                fastDataFilter: undefined,
                /**
                 * Параметры фильтрации, которые не надо сохранять в историю
                 */
                noSaveFilters: []
             },

             _changeHistoryFnc: undefined,
             _applyHandlerDebounced: undefined,
             _listHistory: undefined
          },

          $constructor: function() {
             this._listHistory = new List({items: this.getHistory() || []});
             this._prepareListHistory();
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
             /* При изменении истории с другим id - ничего не делаем */
             if(this._options.historyId !== id) {
                return;
             }

             var isHistoryEqual = colHelpers.isEqualObject(this._listHistory.toArray(), newHistory.toArray()),
                 filterButton = this._options.filterButton,
                 currentActiveFilter = this.getActiveFilter();

             /* Если при изменении активные фильтры или вся история одинаковы,
                то не надо запускать механизм синхронизации истории */
             if (isHistoryEqual || (currentActiveFilter && activeFilter && colHelpers.isEqualObject(currentActiveFilter, activeFilter))) {
                /* Для случая, когда фильтр был синхронизирован из внешнего контекста (т.е. его в истории нет),
                   при сбросе фильтра, мы должны синхронизировать и другие фильтры, которые подписаны на канал изменения с одинаковым id,
                   т.е. вызвать у них сброс фильтра */
                if(!isHistoryEqual && activeFilter === false && currentActiveFilter === false) {
                   filterButton.sendCommand('reset-filter');
                }

                return;
             }

             /* Запишем новую историю */
             /* Надо обязательно клонировать историю, чтобы по ссылке не передавались изменения */
             this._listHistory.assign(cFunctions.clone(newHistory.toArray()));
             this._saveParamsDeferred = saveDeferred;

             if(activeFilter) {
                filterButton.setFilterStructure(FilterHistoryControllerUntil.prepareStructureToApply(activeFilter.filter, filterButton.getFilterStructure()));
             } else {
                filterButton.sendCommand('reset-filter');
             }

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

          /* Структура может меняться динамически,
             этот метод сверяем стуктуру из истории и текущую стуркуру фильтров,
             и, если надо, правит структуру из истории */
          _prepareListHistory: function() {
             var toDelete = [],
                 currentStructure = this._options.filterButton.getFilterStructure(),
                 self = this;

             this._listHistory.each(function(historyElem) {
                FilterHistoryControllerUntil.prepareNewStructure(currentStructure, historyElem.filter);
                var linkText = FilterToStringUtil.string(historyElem.filter, 'historyItemTemplate');

                if(linkText) {
                   if(historyElem.linkText !== linkText) {
                      historyElem.linkText = linkText;
                   }
                } else {
                   toDelete.push(historyElem);
                }
             });

             if(toDelete.length) {
                colHelpers.forEach(toDelete, function(elem) {
                   self._listHistory.remove(elem);
                });
             }
          },

          _onApplyFilterHandler: function() {
             var fb = this._options.filterButton,
                 structure = fb.getFilterStructure(),
                 self = this;

             /* Если это дефолтный фильтр, то сохранять в историю не надо */
             if(!fb.getLinkedContext().getValue('filterChanged')) {
                /* Если применили дефолтный фильтр, то надо сбросить текущий активный */
                self.clearActiveFilter();
                self.saveToUserParams();
                return;
             }

             self.saveToHistory({
                linkText: FilterToStringUtil.string(structure, 'historyItemTemplate'),
                filter: FilterHistoryControllerUntil.prepareStructureToSave(structure)
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
             fb._setFilterStructure(FilterHistoryControllerUntil.prepareStructureToApply(filter.filter, fb.getFilterStructure()));
             fb.getContext().setValue('linkText', filter.linkText);
             fb.hidePicker();

             /* Если этот фильтр не активный, сделаем его активным и сохраним */
             if(!filter.isActiveFilter) {
                this.clearActiveFilter();
                filter.isActiveFilter = true;
                filter.viewFilter = this.prepareViewFilter();
                this.saveToUserParams();
             }
          },

          /**
           * Сохраняет объект с фильтром в историю
           * @param filterObject
           */
          saveToHistory: function(filterObject) {
             var equalFilter = colHelpers.find(this.getHistoryArr(), function(item) {
                    return colHelpers.isEqualObject(item.filter, filterObject.filter) || item.linkText === filterObject.linkText;
                 }),
                 activeFilter = this.getActiveFilter();

             /* Если есть активный фильтр - сбросим его */
             if(activeFilter) {
                activeFilter.isActiveFilter = false;
             }

             /* Не сохраняем в историю, если:
                1) Ещё не сохранился предыдущий фильтр,
                2) Такой фильтр уже есть в истории
                3) Нет текстового представления фильтра (такое может быть, если какой-то параметр в историю не хотят сохранять,
                   но фильтровать по нему можно или этот фильтр выставлен "по-умолчанию" ) */
             if(this.isNowSaving() || equalFilter || !filterObject.linkText) {
                /* Если такой фильтр есть в истории, то надо его сделать активным */
                if(equalFilter && !equalFilter.isActiveFilter) {
                   equalFilter.isActiveFilter = true;
                   equalFilter.viewFilter = this.prepareViewFilter();
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
                id: genHelpers.randomId(),
                linkText: filterObject.linkText,
	            viewFilter: this.prepareViewFilter(),
                filter: filterObject.filter,
                isActiveFilter: true,
                isMarked: false
             });

	          this.saveToUserParams();
          },

          prepareViewFilter: function(filter) {
             var view = this._options.view,
                /* View может не быть, если кнопку фильтров используют отдельно (например в торгах,
                   там по кнопке фильтров фильтруется набор из несколькх view */
                 viewFilter = cFunctions.clone(filter || (view ? view.getFilter() : {}));

             colHelpers.forEach(this._options.noSaveFilters, function(filter) {
                if(viewFilter[filter]) {
                   delete viewFilter[filter];
                }
             });

             /* Т.к. в реестре задач (возможно где-то ещё)
                в поле фильтра с типом "Дата" ожидают строку даты со сдвигом(чтобы её обработать),
                а не стандартный ISO формат, то использую наш специальный метод для приведения даты в строку */
             colHelpers.forEach(viewFilter, function(val, key, obj) {
                if(val instanceof Date) {
                   obj[key] = val.toSQL(true);
                }
             });

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
             return colHelpers.find(this.getHistoryArr(), function(item) {
                return item.isActiveFilter;
             }, this, false);
          },

          /**
           * Ищет фильтр по ключу
           * @param {String} key
           * @private
           */
          findFilterByKey: function(key) {
             return colHelpers.find(this.getHistoryArr(), function(item) {
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

          getFilterButton: function() {
             return this._options.filterButton;
          },

          _sortHistory: function() {
             /* Сортирует историю по флагу отмеченности и активности.
              Приоритет: отмеченные > активный > обычные. */
             this._listHistory.assign(this.getHistoryArr().sort(function(a, b) {
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
                return 0;
             })
             )
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