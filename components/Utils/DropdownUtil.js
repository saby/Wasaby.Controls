define('SBIS3.CONTROLS/Utils/DropdownUtil', [
   'Core/core-clone',
   'SBIS3.CONTROLS/Menu/SBISHistoryController',
   'SBIS3.CONTROLS/Utils/HistoryUtil',
   'WS.Data/Query/Query',
   'Core/core-merge'
], function(coreClone, HistoryController, historyUtil, Query, merge) {
   return {
      showPicker: function(self, prototype, event) {
         var myself = this;

         if (!self._historyDeferred || !historyUtil.isEqualHistory(self._options.historyId, this._getHistoryController(self).getHistoryDataSet())) {
            this._getHistoryController(self).initRecordSet();

            // нужна вычитка данных с БЛ по id позвать списочный метод с нужным фильтром
            self._historyDeferred = this._getHistoryController(self).getUnionIndexesList(self).addCallback(function(data) {
               if (self.getDataSource()) {
                  myself._loadItems(self, prototype, data, event);
               } else {
                  myself._getHistoryController(self).parseHistoryData(data);
                  myself.callShow(self, prototype, event);
                  historyUtil.setHistory(self._options.historyId, self._getHistoryController(self).getHistoryDataSet());
               }
            }).addErrback(function() {
               myself._getHistoryController(self).parseHistoryData();
               myself.callShow(self, prototype, event);
            });
         } else {
            if (self._historyDeferred.isReady()) {
               if (self._needToRedrawHistory) {
                  self.setItems(this._getHistoryController(self).prepareHistory());
                  self._needToRedrawHistory = false;
               }
               prototype.superclass.showPicker.call(self, event);
            }
         }
      },

      _loadItems: function(self, prototype, data, event) {
         var myself = this,
            query, indexesList;

         // если есть dataSource то вычитаем данные с сервера,
         // нужно построить список id который хотим получить на выходе рекорд по нему нужно построить записи
         indexesList = this._getIndexes(self, data);
         if (!!indexesList.length) {
            query = this._makeQueryFilterForHistory(self, indexesList);

            // подгрузят данные метод БЛ опции и в utils ещё необходимо проставить через item
            self.getDataSource().query(query).addCallback(function(result) {
               // заполняем по пунктам, учесть индексы из опций
               myself._getHistoryController(self).setHistoryDataFromRecord(result.getAll(), data);
               myself.callShow(self, prototype, event);
               historyUtil.setHistory(self._options.historyId, myself._getHistoryController(self).getHistoryDataSet());
            });
         } else {
            myself._getHistoryController(self).setHistoryDataFromRecord(self.getItems(), data);
            myself.callShow(self, prototype, event);
            historyUtil.setHistory(self._options.historyId, this._getHistoryController(self).getHistoryDataSet());
         }
      },

      _getIndexes: function(self, data) {
         var items = self.getItems();

         return Array.prototype.filter.call(this._getHistoryController(self).getIndexesList(self, data), function(id) {
            return !items.getRecordById(id);
         });
      },

      _getHistoryController: function(self) {
         if (!self._historyController) {
            self._historyController = new HistoryController({
               oldItems: coreClone(self.getItems()),
               historyId: self._options.historyId,
               pinned: self._options.pinned,
               frequent: self._options.frequent,
               displayProperty: self._options.displayProperty,
               additionalProperty: self._options.additionalProperty,
               subContainers: self._subContainers,
               parentProperty: self._options.parentProperty,
               maxCountRecent: 10,
               maxHistoryLength: 10
            });
         }
         return self._historyController;
      },

      _makeQueryFilterForHistory: function(self, recordsId) {
         var query = new Query(),
            filter = {};

         filter[this._getHistoryController(self).getOriginalIdProperty()] = recordsId;
         merge(filter, self._options.filter || {});
         query.where(filter).limit(12);
         return query;
      },

      callShow: function(self, prototype, event) {
         this._getHistoryController(self).prepareHistoryData(); // проставляет свойства в рекорд
         self.setItems(this._getHistoryController(self).prepareHistory()); // заполняем финальный рекорд со всеми записями
         prototype.superclass.showPicker.call(self, event);
      }
   };
});
