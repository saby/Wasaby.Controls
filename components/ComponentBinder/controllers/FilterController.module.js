/**
 * Created by am.gerasimov on 25.04.2017.
 */
define('js!SBIS3.CONTROLS.FilterController', [
   'Core/Abstract',
   'Core/core-merge',
   'Core/core-functions',
   'js!SBIS3.CONTROLS.FilterHistoryControllerUntil'
], function(cAbstract, cMerge, cFunctions, FilterHistoryControllerUntil) {
   
   return cAbstract.extend({
      /**
       * @cfg {SBIS3.CONTROLS.FilterButton} Кнопка фильтров
       */
      _$filterButton: null,
      /**
       * @cfg {SBIS3.CONTROLS.FastDataFilter} Быстрый фильтр
       */
      _$fastDataFilter: null,
      /**
       * @cfg {SBIS3.CONTROLS.ListView} Представление
       */
      _$view: null,
   
      /**
       * Связывает фильтры и представление данных
       * @param fButton Кнопка фильтров
       * @param fDataFilter Быстрый фильтр
       * @param viewInst Представление данных
       */
      bindFilters: function(fButton, fDataFilter, viewInst) {
         var filterButton = fButton || this._getOption('filterButton'),
             fastDataFilter = fDataFilter || this._getOption('fastDataFilter'),
             view = viewInst || this._getOption('view'),
             parentContext = view.getParent().getContext();
   
         if(filterButton || fastDataFilter) {
            /* Синхронизация кнопки фильтров и быстрого фильтра */
            var syncFilters = function(from, to) {
               if(from && to) {
                  to.setFilterStructure(FilterHistoryControllerUntil.prepareStructureToApply(cFunctions.clone(from.getFilterStructure()), to.getFilterStructure()));
               }
            };
      
            /* Обработчик на применение / сборс кнопки фильтров и быстрого фильтра */
            var filterChangeHandler = function() {
                  if(this === filterButton) {
                     view.setActive(true);
                     if(fastDataFilter) {
                        syncFilters(filterButton, fastDataFilter);
                     }
                  } else if(filterButton) {
                     syncFilters(fastDataFilter, filterButton);
                  }
         
                  /* Почему сделано через контекст:
                   1) Контекст даёт возможность удалять занчения по-умолчанию,
                   например, кнопка фильтров выдала фильтр:
                   поНдс  :  true
                   Ответственные  : []   -  это значение по-умолчанию, его можно не отправлять на бл, и можно удалить через nonexistent
                   Регламент  :  'Задача'
                   2) фильтр переиспользуются (например фильтры ЭДО) и могут быть ненужные для фильтрации элементы структуры,
                   через контекст можно четко указать, какие фильтр требуется для фильтрации.
                   */
                  parentContext.setValue('browser.filter', cMerge(
                     filterButton ? filterButton.getFilter() : {},
                     fastDataFilter ? fastDataFilter.getFilter() : {}
                  ));
               },
               subscribeFilter = function(filter) {
                  filter.subscribe('onApplyFilter', filterChangeHandler)
                        .subscribe('onResetFilter', filterChangeHandler);
               },
               unsubscribeFilter = function(filter) {
                  filter.unsubscribe('onApplyFilter', filterChangeHandler)
                        .unsubscribe('onResetFilter', filterChangeHandler);
               };
      
            if(filterButton) {
               filterChangeHandler.call(filterButton);
               subscribeFilter(filterButton);
            }
      
            if(fastDataFilter) {
               subscribeFilter(fastDataFilter);
            }
            
            this.once('onDestroy', function() {
               if(filterButton) {
                  unsubscribeFilter(filterButton);
               }
   
               if(fastDataFilter) {
                  unsubscribeFilter(fastDataFilter);
               }
            })
         }
      }
   });
});