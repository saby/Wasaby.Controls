define('SBIS3.CONTROLS/Utils/DropdownUtil', [
    'Core/core-clone',
    'SBIS3.CONTROLS/Menu/SBISHistoryController',
    'WS.Data/Query/Query',
    'WS.Data/Collection/RecordSet'
], function (coreClone, HistoryController, Query) {
    return {
        showPicker: function(self, prototype){
            var myself = this;

            if (!self._historyDeferred) {
                this._getHistoryController(self).initRecordSet();
                // нужна вычитка данных с БЛ по id позвать списочный метод с нужным фильтром
                self._historyDeferred = this._getHistoryController(self).getUnionIndexesList(self).addCallback(function (data) {
                    if(self.getDataSource()){
                        myself._loadItems(self, prototype, data);
                    }else {
                        myself._getHistoryController(self).parseHistoryData(data);
                        myself.callShow(self, prototype);
                    }
                    self._historyDeferred = null;
                }).addErrback(function () {
                    myself._getHistoryController(self).parseHistoryData();
                    myself.callShow(self, prototype);
                });
            } else {
                if (self._historyDeferred.isReady()) {
                    if(self._needToRedrawHistory){
                        self.setItems(this._getHistoryController(self).prepareHistory());
                        self._needToRedrawHistory = self;
                    }
                    prototype.superclass.showPicker.apply(self, arguments);
                }
            }
        },

        _loadItems: function(self, prototype, data) {
            var myself = this,
                query;

            // если есть dataSource то вычитаем данные с сервера,
            // нужно построить список id который хотим получить на выходе рекорд по нему нужно построить записи
            query = this._makeQueryFilterForHistory(self, this._getHistoryController(self).getIndexesList(data));
            // подгрузят данные метод БЛ опции и в utils ещё необходимо проставить через item
            self.getDataSource().query(query).addCallback(function(result){
                // заполняем по пунктам, учесть индексы из опций
                myself._getHistoryController(self).setHistoryDataFromRecord(result.getAll(), data);
                myself.callShow(self, prototype);
            });
        },

        _getHistoryController: function (self) {
          if(!self._historyController){
              self._historyController = new HistoryController({
                  oldItems: coreClone(self.getItems()),
                  historyId: self._options.historyId,
                  pinned: self._options.pinned,
                  frequent: self._options.frequent,
                  displayProperty: self._options.displayProperty,
                  additionalProperty: self._options.additionalProperty,
                  subContainers: self._subContainers,
                  parentProperty: self._options.parentProperty,
                  maxCountRecent: 10
              });
          }
          return self._historyController;
        },

        _makeQueryFilterForHistory: function(self, recordsId) {
            var query = new Query(),
                filter = {};

            filter[this._getHistoryController(self).getOriginalIdProperty()] = recordsId;
            query.where(filter).limit(12);
            return query;
        },

        callShow: function(self, prototype) {
            this._getHistoryController(self).prepareHistoryData(); // проставляет свойства в рекорд
            self.setItems(this._getHistoryController(self).prepareHistory()); // заполняем финальный рекорд со всеми записями
            prototype.superclass.showPicker.apply(self, arguments);
        }
    };
});