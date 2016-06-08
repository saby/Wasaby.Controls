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
         queryFilter = $ws.core.merge(filter || {}, historyFilter);

         /* Подготавливаем query */
         query.where(queryFilter)
              .offset(offset || 0)
              .limit(limit || 25)
              .orderBy(sorting || {});

         queryDef = source.query(query);

         /* По готовности компонента установим данные */
         this.subscribe('onInit', function() {
            var browser = browserName ? this.getChildControlByName(browserName) : this,
                view = browser.getView(),
                filterButton = browser._getFilterButton();

            /* Т.к. запрос вызывается отдельно, то и индикатор надо показать самим,
               иногда БЛ может подтупливать и в этом случае может долго висеть пустой реестр, который вводит пользователя в заблуждение  */
            view._toggleIndicator(true);

            /* Т.к. запрос вызывается отдельно и пока он выполняется можно делать разные действия, то надо выключить кнопку фильтров на время выполнения запроса,
               иначе, в неё можно нажать и будет рассинхрон данных и фильтрации */
            if(filterButton) {
               filterButton.setEnabled(false);
            }

            queryDef.addCallback(function(dataSet) {
               var keyField = view.getProperty('keyField'),
                   recordSet;

               view._toggleIndicator(false);

               if(filterButton) {
                  filterButton.setEnabled(true);
               }

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
               //FIXME это временный придрод, уйдёт, как будет сделана отрисовка на сервере (3.7.3.200 - 3.7.4)
               view._notify('onDataLoad', recordSet);
               view.setItems(recordSet);

               return recordSet;
            });
         });
         return resultDef;
      }
   };

   return ViewSourceMixin;

});