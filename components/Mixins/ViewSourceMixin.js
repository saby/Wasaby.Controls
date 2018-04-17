/**
 * Created by am.gerasimov on 04.04.2016.
 */

define('SBIS3.CONTROLS/Mixins/ViewSourceMixin', [
   "Core/core-merge",
   "Core/Deferred",
   "SBIS3.CONTROLS/Utils/QueryUtil",
   "SBIS3.CONTROLS/History/HistoryController"
], function( cMerge, Deferred,Query, HistoryController) {
    /**
     *
     * @mixin SBIS3.CONTROLS/Mixins/ViewSourceMixin
     * @author Крайнов Д.О.
     * @public
     */
    
   var _private = {
      getHistoryFilter: function(self, id, needLoad) {
         var historyDef = new Deferred();
         var filter;
         
         if (needLoad) {
            var historyController = new HistoryController({historyId: id});
            historyController.getHistory(true).addCallback(function(history){
               if (history) {
                  for(var i = 0, len = history.length; i < len; i++) {
                     if(history[i].isActiveFilter) {
                        filter = history[i].viewFilter;
                        /* Фильтр перед сохранением в историю специально обрабатывается, и оттуда удаляются ключи, которые лежат в опции
                         ignoreFiltersList. Но опцию ignoreFiltersList могут менять динамически, поэтому перед запросом надо
                         удалить ключи из фильтра, которые указаны в ignoreFiltersList. */
                        if(self._options.ignoreFiltersList && self._options.ignoreFiltersList.length) {
                           self._options.ignoreFiltersList.forEach(function(key) {
                              if(filter.hasOwnProperty(key)) {
                                 delete filter[key];
                              }
                           });
                        }
                        break;
                     }
                  }
               }
               historyDef.callback(filter || {});
            });
   
            self.once('onDestroy', function() {
               historyController.destroy();
            });
         } else {
            historyDef.callback({});
         }
         
         
         return historyDef;
      }
   };
   var ViewSourceMixin = /**@lends SBIS3.CONTROLS/Mixins/ViewSourceMixin.prototype  */{

      /**
       * Устанавливает dataSource для представления данных.
       * Для этого делается запрос на БЛ, можно вызывать в конструкторе.
       *
       * @param {WS.Data/Source/SbisService} source Источник данных
       * @param {String} browserName Имя браузера. Если миксин подмешан в браузер, можно не передавать.
       * @param {Object} filter Параметры фильтрации
       * @param {String|Number} offset Элемент, с которого перезагружать данные.
       * @param {String|Number} limit Ограничение количества перезагружаемых элементов.
       * @param {Object} sorting Параметры сортировки.
       * @param {String} historyId Уникальный id по которому хранится история фильтров, необязательный параметр.
       */
      setViewDataSource: function(source, browserName, filter, offset, limit, sorting, historyId) {
         var self = this,
             applyFilterOnLoad = true,
             queryDef, historyDef, queryFilter;

         historyId = historyId || this._options.historyId;

         /* Если миксин подмешивается в браузер, то опция applyHistoryFilterOnLoad должна быть, проверим по ней, нужно ли применять историю,
            если флага нет, значит миксин подмешан не в браузер,
            и если применять историю не надо, то можно просто не передавать historyId */
         if( !historyId || this._options.applyHistoryFilterOnLoad === false ) {
            applyFilterOnLoad = false;
         }

         /* Если есть historyId и разрешёно применение из истории, то попытаемся достать фильтр из истории */
         historyDef = _private.getHistoryFilter(this, historyId, applyFilterOnLoad);
   
         historyDef.addCallback(function(historyFilter) {
            /* Подготавливаем фильтр */
            queryFilter = cMerge(filter || {}, historyFilter);
   
            queryDef = Query(source, [
               queryFilter,
               sorting,
               offset !== undefined ? offset : 0,
               limit !== undefined ? limit : 25
            ]).addErrback(function(e) {
               return e;
            });
   
            self.once('onDestroy', function() {
               if (!queryDef.isReady()) {
                  queryDef.cancel();
               }
            });
            
            return queryFilter;
         });
   
         var resultDef = new Deferred();

         /* По готовности компонента установим данные */
         this.once('onInit', function() {
            var browser = browserName ? this.getChildControlByName(browserName) : this,
                view = browser.getView();

            /* Т.к. запрос вызывается отдельно, то и индикатор надо показать самим,
               иногда БЛ может подтупливать и в этом случае может долго висеть пустой реестр, который вводит пользователя в заблуждение  */
            view._toggleIndicator(true);
            /* Фильтр устанавливаем пораньше, до ответа query, чтобы запустилась синхронизация,
             и фильтры проставились в кнопку фильтров */
            historyDef.addCallback(function(filter) {
               view.setFilter(queryFilter, true);
               /* Источник устанавливаем сразу : во время выполнения запроса, могут менять фильтр.
                Фильтр может меняться как пользователем, так и прикладным программистом */
               view.setDataSource(source, true);
               queryDef
                  .addErrback(function(error) {
                     return view._loadErrorProcess(error);
                  })
                  .addCallback(function(dataSet) {
                     var idProperty = view.getProperty('idProperty'),
                        recordSet;
         
                     if (idProperty && idProperty !== dataSet.getIdProperty()) {
                        dataSet.setIdProperty(idProperty);
                     }
         
                     recordSet = dataSet.getAll();
         
                     /* Пока выполнялся запрос - view уже мог успеть уничтожиться или могли загружаться новые данные.
                      В таком случае не трогаем view. */
                     if (!view.isDestroyed() && !view.isLoading() && !view.getItems()) { /* Не устанавливаем данные, если они загружаются или уже есть */
                        view._toggleIndicator(false);
                        //FIXME это временный придрод, уйдёт, как будет сделана отрисовка на сервере (3.7.3.200 - 3.7.4)
                        view._notify('onDataLoad', recordSet);
                        view.setItems(recordSet);
                     }
         
                     resultDef.callback(recordSet);
         
                     return recordSet;
                  });
               return filter;
            });
         });
         return resultDef;
      }
   };

   return ViewSourceMixin;

});