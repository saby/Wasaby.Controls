/**
 * Created by am.gerasimov on 04.04.2016.
 */

define('js!SBIS3.CONTROLS.ViewSourceMixin', [
   "Core/SessionStorage",
   "Core/core-merge",
   "Core/Deferred",
   "js!WS.Data/Query/Query",
   "Core/helpers/string-helpers",
   "js!SBIS3.CONTROLS.HistoryController"
], function( cSessionStorage, cMerge, Deferred,Query, strHelpers, HistoryController) {

   var ViewSourceMixin = /**@lends SBIS3.CONTROLS.ViewSourceMixin.prototype  */{

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
         var query = new Query(),
             historyFilter = {},
             resultDef = new Deferred(),
             applyFilterOnLoad = true,
             queryDef, history, serializedHistory, queryFilter;

         historyId = historyId || this._options.historyId;

         /* Если миксин подмешивается в браузер, то опция applyHistoryFilterOnLoad должна быть, проверим по ней, нужно ли применять историю,
            если флага нет, значит миксин подмешан не в браузер,
            и если применять историю не надо, то можно просто не передавать historyId */
         if( !historyId || this._options.applyHistoryFilterOnLoad === false ) {
            applyFilterOnLoad = false;
         }

         /* Если есть historyId и разрешёно применение из истории, то попытаемся достать фильтр из истории */
         if(applyFilterOnLoad) {
            history = (new HistoryController({historyId: historyId})).getHistory();

            if (history) {
               for(var i = 0, len = history.length; i < len; i++) {
                  if(history[i].isActiveFilter) {
                     historyFilter = history[i].viewFilter;
                     break;
                  }
               }
            }
         }

         /* Подготавливаем фильтр */
         queryFilter = cMerge(filter || {}, historyFilter);

         /* Подготавливаем query */
         query.where(queryFilter)
              .offset(offset !== undefined ? offset : 0)
              .limit(limit !== undefined ? limit : 25)
              .orderBy(sorting || {});

         queryDef = source.query(query);

         /* По готовности компонента установим данные */
         this.subscribe('onInit', function() {
            var browser = browserName ? this.getChildControlByName(browserName) : this,
                view = browser.getView();

            /* Т.к. запрос вызывается отдельно, то и индикатор надо показать самим,
               иногда БЛ может подтупливать и в этом случае может долго висеть пустой реестр, который вводит пользователя в заблуждение  */
            view._toggleIndicator(true);
            /* Фильтр устанавливаем пораньше, до ответа query, чтобы запустилась синхронизация,
             и фильтры проставились в кнопку фильтров */
            view.setFilter(queryFilter, true);

            queryDef.addCallback(function(dataSet) {
               var keyField = view.getProperty('keyField'),
                   recordSet;

               if (keyField && keyField !== dataSet.getIdProperty()) {
                  dataSet.setIdProperty(keyField);
               }

               recordSet = dataSet.getAll();

               if (!view.isDestroyed()) { //Пока выполнялся запрос - view уже мог успеть уничтожиться. В таком случае не трогаем view
                  view._toggleIndicator(false);
                  view.setDataSource(source, true);
                  //FIXME это временный придрод, уйдёт, как будет сделана отрисовка на сервере (3.7.3.200 - 3.7.4)
                  view._notify('onDataLoad', recordSet);
                  view.setItems(recordSet);
               }

               resultDef.callback(recordSet);

               return recordSet;
            });
         });
         return resultDef;
      }
   };

   return ViewSourceMixin;

});