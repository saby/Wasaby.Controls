/**
 * Created by am.gerasimov on 04.04.2016.
 */

define('js!SBIS3.CONTROLS.ViewSourceMixin', [
   'js!SBIS3.CONTROLS.Data.Query.Query'
], function(Query) {

   var ViewSourceMixin = /**@lends SBIS3.CONTROLS.ViewSourceMixin.prototype  */{

      /**
       * Устанавливает dataSource для представления данных.
       * Для этого делается запрос на БЛ, можно вызывать в конструкторе.
       *
       * @param {SBIS3.CONTROLS.Data.Source.SbisService} source Источник данных
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
             resultDef = new $ws.proto.Deferred(),
             queryDef, history, serializedHistory, queryFilter;

         historyId = historyId || this._options.historyId;

         /* Если есть historyId, то попытаемся достать фильтр из истории */
         if(historyId) {
            history = $ws.single.SessionStorage.get(historyId);

            if (history) {
               serializedHistory = $ws.helpers.deserializeURLData(history);
               if (serializedHistory) {
                  for(var i = 0, len = serializedHistory.length; i < len; i++) {
                     if(serializedHistory[i].isActiveFilter) {
                        historyFilter = serializedHistory[i].viewFilter;
                        break;
                     }
                  }
               }
            }
         }

         /* Подготавливаем фильтр */
         queryFilter = $ws.core.merge(
            filter || {},
            historyFilter,
            {preferSource: true}  /* Так как в метод отдают фильтр, который является основным, нельзя в нём перетирать значения фильтром из истории */
         );

         /* Подготавливаем query */
         query.where(queryFilter)
              .offset(offset || 0)
              .limit(limit || 25)
              .orderBy(sorting || {});

         queryDef = source.query(query);

         /* По готовности компонента установим данные */
         this.subscribe('onInit', function() {
            var browser = browserName ? this.getChildControlByName(browserName) : this,
                view = browser.getView();

            queryDef.addCallback(function(dataSet) {
               var keyField = view.getProperty('keyField'),
                   recordSet;

               if (keyField && keyField !== dataSet.getIdProperty()) {
                  dataSet.setIdProperty(keyField);
               }

               recordSet = dataSet.getAll();
               recordSet.setMetaData({
                  results: dataSet.getProperty('r'),
                  more: dataSet.getTotal(),
                  path: dataSet.getProperty('p')
               });

               view.setDataSource(source, true);
               view.setFilter(queryFilter, true);
               resultDef.callback(recordSet);
               view.setItems(recordSet);

               return recordSet;
            });
         });
         return resultDef;
      }
   };

   return ViewSourceMixin;

});