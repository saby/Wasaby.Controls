/**
 * Created by am.gerasimov on 07.12.2015.
 */
define('js!SBIS3.CONTROLS.FilterHistoryController',
    [
       'js!SBIS3.CONTROLS.HistoryController',
       'js!SBIS3.CONTROLS.Data.Collection.List',
       'js!SBIS3.CONTROLS.FilterButton.FilterToStringUtil'
    ],

    function(HistoryController, List, FilterToStringUtil) {

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
             var isHistoryEqual = $ws.helpers.isEqualObject(this._listHistory.toArray(), newHistory.toArray()),
                 fb = this._options.filterButton,
                 currentActiveFilter = this.getActiveFilter();

             /* Если изменения произошло в истории с другим ID или история не изменилась,
                то надо дополнительно проверить фильтр, возможно он был выставлен из контекста,
                иначе ничего делать не будем */
             if (this._options.historyId !== id || isHistoryEqual || (currentActiveFilter && activeFilter && $ws.helpers.isEqualObject(currentActiveFilter, activeFilter))) {

                /* Для случая, когда фильтр был синхронизирован из внешнего контекста (т.е. его в истории нет),
                   при сбросе фильтра, мы должны синхронизировать и другие фильтры, которые подписаны на канал изменения с одинаковым id,
                   т.е. вызвать у них сброс фильтра */
                if(!isHistoryEqual && activeFilter === false && currentActiveFilter === false) {
                   fb.sendCommand('reset-filter');
                }

                return;
             }

             /* Запишем новую историю */
             /* Надо обязательно клонировать историю, чтобы по ссылке не передавались изменения */
             this._listHistory.assign($ws.core.clone(newHistory.toArray()));
             this._saveParamsDeferred = saveDeferred;

             if(activeFilter) {
                fb.setFilterStructure(activeFilter.filter);
             } else {
                fb.sendCommand('reset-filter');
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

          _prepareStructureElemToSave: function(structure) {
             /* Все правки надо делать с копией, чтобы не портить оригинальную структуру */
             var structureCopy = $ws.core.clone(structure);

             $ws.helpers.forEach(structureCopy, function(elem) {
                /* Хак для испрвления даты, при записи на бл история приводится к строке через метод JSON.stringify,
                  а метод stringify сериализует дату, учитывая сдвиг (GMT/UTC)
                  и в итоге мы можем получить не ту дату */
                if(elem.value) {
                   if(elem.value instanceof Date) {
                      elem.value = elem.value.toSQL();
                   }
                }
                /* Надо удалить из истории шаблоны, т.к. история сохраняется строкой */
                if(elem.itemTemplate) {
                   delete elem.itemTemplate;
                }

                if(elem.historyItemTemplate) {
                   delete elem.historyItemTemplate;
                }
             });

             return structureCopy;
          },

          _prepareStructureElemForApply: function(structure) {
             /* Чтобы не портить текущую историю, сделаем копию (иначе не применится фильтр) */
             var currentStructureCopy = $ws.core.clone(this._options.filterButton.getFilterStructure());

             /* Алгоритм следующий:
                  1) Пробегаемся по структуре (она первична, в ней можно менять только фильтры, саму струкруту менять нельзя!!) и ищем
                     элементы в структуре из истории с таким же internalValueField
                  2) Если нашли, то смержим эти элементы
                  3) Если не нашли, и есть значение в value, то сбросим этот фильтр */
             $ws.helpers.forEach(currentStructureCopy, function(elem) {
                var elemFromHistory = $ws.helpers.find(structure, function(structureElem) {
                   return elem.internalValueField === structureElem.internalValueField;
                }, false);

                if(elemFromHistory) {
                   /* Меняем только value и caption, т.к. нам нужны только значения для фильтрации из историии,
                      остальные значения структуры нам не интересны + их могут менять, и портить их неправильно тем, что пришло из истории неправильно */
                   if(elemFromHistory.value !== undefined) {
                      elem.value = elemFromHistory.value;
                   }
                   if(elemFromHistory.caption !== undefined) {
                      elem.caption = elemFromHistory.caption;
                   }
                } else if(elem.value && elem.resetValue && !$ws.helpers.isEqualObject(elem.value, elem.resetValue)) {
                   elem.value = elem.resetValue;
                }
             });
             return currentStructureCopy;
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
                filter: this._prepareStructureElemToSave(structure)
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
             fb.setFilterStructure(this._prepareStructureElemForApply(filter.filter));
             fb.getChildControlByName('filterLine').getContext().setValue('linkText', filter.linkText);
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
             var equalFilter = $ws.helpers.find(this.getHistoryArr(), function(item) {
                    return $ws.helpers.isEqualObject(item.filter, filterObject.filter) || item.linkText === filterObject.linkText;
                 }),
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
                id: $ws.helpers.randomId(),
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
                 viewFilter = $ws.core.clone(filter || view.getFilter());

             $ws.helpers.forEach(this._options.noSaveFilters, function(filter) {
                if(viewFilter[filter]) {
                   delete viewFilter[filter];
                }
             });

             /* Т.к. в реестре задач (возможно где-то ещё)
                в поле фильтра с типом "Дата" ожидают строку даты со сдвигом(чтобы её обработать),
                а не стандартный ISO формат, то использую наш специальный метод для приведения даты в строку */
             $ws.helpers.forEach(viewFilter, function(val, key, obj) {
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