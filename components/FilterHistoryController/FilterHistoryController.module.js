/**
 * Created by am.gerasimov on 07.12.2015.
 */
define('js!SBIS3.CONTROLS.FilterHistoryController',
    [
       'js!SBIS3.CONTROLS.HistoryController',
       'js!SBIS3.CONTROLS.Data.Collection.List',
       'js!SBIS3.CONTROLS.Utils.TemplateUtil'
    ],

    function(HistoryController, List, TemplateUtil) {

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
             this._listHistory.fill(newHistory.toArray());
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
                 structure = $ws.core.clone(fb.getFilterStructure()),
                 self = this,
                 linkText, template, templateRes;

             /* Если это дефолтный фильтр, то сохранять в историю не надо */
             if(!fb.getLinkedContext().getValue('filterChanged')) {
                /* Если применили дефолтный фильтр, то надо сбросить текущий активный */
                self.clearActiveFilter();
                self.saveToUserParams();
                return;
             }

             linkText = $ws.helpers.reduce(structure, function(res, elem) {
                template = TemplateUtil.prepareTemplate(elem.historyItemTemplate);

                if(template) {
                   templateRes = template(elem);
                   if(templateRes) {
                      res.push(template(elem));
                   }
                   return res;
                } else if(template === null) {
                   return res;
                }

                if (elem.caption && !$ws.helpers.isEqualObject(elem.value, elem.resetValue)) {
                   res.push(elem.caption);
                }
                return res;
             }, []).join(', ');

             /* Надо удалить из истории шаблоны, т.к. история сохраняется строкой */
             $ws.helpers.forEach(structure, function(elem) {
                if(elem.itemTemplate) {
                   delete elem.itemTemplate;
                }
                if(elem.historyItemTemplate) {
                   delete elem.historyItemTemplate;
                }
             });

             self.saveToHistory({
                linkText: linkText,
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

             /* В фильтр, который был сохранён в историю надо смержить шаблоны из структуры */
             function mergeTemplates(to, from) {
                if(to.length === from.length) {
                   for(var i = 0; i < to.length; i++) {
                      if(from[i].itemTemplate && to[i]) {
                         to[i].itemTemplate = from[i].itemTemplate;
                      }
                      if(from[i].historyItemTemplate && to[i]) {
                         to[i].historyItemTemplate = from[i].historyItemTemplate
                      }
                   }
                }
                return to;
             }

             /* Применим фильтр из истории*/
             fb.setFilterStructure(mergeTemplates($ws.core.clone(filter.filter), fb.getFilterStructure()));
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
             }));
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