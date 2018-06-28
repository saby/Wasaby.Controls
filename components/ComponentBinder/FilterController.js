/**
 * Created by am.gerasimov on 25.04.2017.
 */
define('SBIS3.CONTROLS/ComponentBinder/FilterController', [
   'Core/Abstract',
   'Core/core-merge',
   'Core/core-clone',
   'SBIS3.CONTROLS/Filter/HistoryController/FilterHistoryControllerUntil',
   'Core/helpers/Object/isEqual'
], function(cAbstract, cMerge, coreClone, FilterHistoryControllerUntil, isEqual) {
   
   var BROWSER_FILTER_FIELD = 'browser.filter';
   
   return cAbstract.extend({
      /**
       * @cfg {SBIS3.CONTROLS/Filter/Button} Кнопка фильтров
       */
      _$filterButton: null,
      /**
       * @cfg {SBIS3.CONTROLS/Filter/FastData} Быстрый фильтр
       */
      _$fastDataFilter: null,
      /**
       * @cfg {SBIS3.CONTROLS/ListView} Представление
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
             parentContext = view.getParent().getContext(),
            /* Т.к. отслеживается изменени опции filterStructure в фильтрах,
               то нам необходимо блокировать повторную синхронизацию опции,
               чтобы не было зацикливания, иначе при синхронизации опять сработает подписка на изменение опции тд.. */
             blockSync;
   
         if(filterButton || fastDataFilter) {
            /* Синхронизация кнопки фильтров и быстрого фильтра */
            var syncFilters = function(from, to) {
               if(from && to && !blockSync) {
                  blockSync = true;
                  //Не нужно сбрасывать value в resetValue, если элемента стукруры из from нет в эл.структуры из to
                  to.setFilterStructure(FilterHistoryControllerUntil.prepareStructureToApply(coreClone(from.getFilterStructure()), to.getFilterStructure(), true));
                  blockSync = false;
               }
            };
      
            /* Обработчик на применение / сборс кнопки фильтров и быстрого фильтра */
            var filterChangeHandler = function(event, internal) {
                  if(internal) {
                     return;
                  }
               
                  if (this === filterButton && fastDataFilter) {
                     syncFilters(filterButton, fastDataFilter);
                  } else if (filterButton) {
                     syncFilters(fastDataFilter, filterButton);
                  }
      
                  /* После фильтрации сбросим страницу,
                     т.к. иначе offset будет неверный после фильтрации */
                  view.setPage(0, true);
      
                  var resultFilter = cMerge(
                     filterButton ? filterButton.getFilter() : {},
                     fastDataFilter ? fastDataFilter.getFilter() : {}
                  );
         
                  /* Почему сделано через контекст:
                   1) Контекст даёт возможность удалять занчения по-умолчанию,
                   например, кнопка фильтров выдала фильтр:
                   поНдс  :  true
                   Ответственные  : []   -  это значение по-умолчанию, его можно не отправлять на бл, и можно удалить через nonexistent
                   Регламент  :  'Задача'
                   2) фильтр переиспользуются (например фильтры ЭДО) и могут быть ненужные для фильтрации элементы структуры,
                   через контекст можно четко указать, какие фильтр требуется для фильтрации.
                   */
                  if(parentContext.getValue(BROWSER_FILTER_FIELD)) {
                     /* Необходимо подмерживать фильтр, иначе,
                        если на это поле забиндена вьюха могут пропадать служебные фильтры,
                        такие как: иерархия, поиск и тд */
                     //FIXME При рекурсивном мерже некорректно мержатся массивы в полях объекта, при мерже {arr: [123]} <-- {arr: []} получаем {arr: [123]} вместо {arr: []}
                     resultFilter = cMerge(coreClone(parentContext.getValue(BROWSER_FILTER_FIELD)), resultFilter, {rec: false});
                  }
                  if (!isEqual(resultFilter, parentContext.getValue(BROWSER_FILTER_FIELD))) {
                     parentContext.setValue(BROWSER_FILTER_FIELD, resultFilter);
                  }
               },
               structureChanged = function(event, prop) {
                  if (prop === 'filterStructure' && !blockSync) {
                     filterChangeHandler.call(this);
                  }
               },
               subscribeFilter = function(filter) {
                  filter.subscribe('onPropertyChanged', structureChanged);
               },
               unsubscribeFilter = function(filter) {
                  filter.unsubscribe('onPropertyChanged', structureChanged);
               };

            if (filterButton && fastDataFilter) {
               syncFilters(filterButton, fastDataFilter);
            }
      
            if(filterButton) {
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