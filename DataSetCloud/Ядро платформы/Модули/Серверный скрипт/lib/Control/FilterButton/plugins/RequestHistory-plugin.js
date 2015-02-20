/**
 * Created by aa.adilov on 08.04.14.
 */
define('js!SBIS3.CORE.RequestHistoryPlugin', [ 'js!SBIS3.CORE.FilterButton' ], function (FilterButton) {

   var MAX_HISTORY_REQUESTS = 10,
       MAX_MINIMIZE_HISTORY_REQUESTS = 3,
       MAX_HISTORY_BUTTON_TOOLTIP = 'Свернуть',
       MAX_HISTORY_BUTTON_ICON = 'icon-Curtail',
       MIN_HISTORY_BUTTON_TOOLTIP = 'Развернуть',
       MIN_HISTORY_BUTTON_ICON = 'icon-Expand';

   /**
    * @class   $ws.proto.FilterButton.RequestHistoryPlugin
    * @extends $ws.proto.FilterButton
    * @plugin
    */
   $ws.proto.FilterButton.RequestHistoryPlugin = FilterButton.extendPlugin(/** @lends $ws.proto.FilterButton.RequestHistoryPlugin.prototype */{
      /**
       * @event onCreateRequest Событие при добавлении запроса в историю
       * Если вернуть строку, то она будет представлена в истории вместо строки, сформированной по умолчанию
       * @param {Object} eventObject Объект события
       * @param {Object} filter Объект с фильтром
       * @param {Object} stringFilter Фильтр со строковыми значениями
       * @example
       * <pre>
       *    filterButton.subscribe('onCreateRequest', function(e, filter, stringFilter) {
       *       var request = '';
       *
       *       for (var i in stringFilter) {
       *          if (stringFilter.hasOwnProperty(i)) {
       *             if (request) {
       *                request += ', ';
       *             }
       *
       *             request += i + ': ' + stringFilter[i];
       *          }
       *       }
       *
       *       e.setResult(request);
       *    });
       * </pre>
       */
      /**
       * @event onBeforeAddHistoryRequest Событие перед добавлением запроса в историю
       * @param {Object} eventObject Объект события
       * @param {Object} filter Объект с фильтром
       * @param {Object} filters Объект с фильтрами, которые содержатся в текущей истории
       * @return {Object|Boolean|*} Если передать:
       * <ol>
       * <li>Object – станет новым фильтром,</li>
       * <li>false – запрос не добавится в историю,</li>
       * <li>любой иной тип данных – будет использован стандартный фильтр.</li>
       * </ol>
       * @example
       * <pre>
       *    filterButton.subscribe('onBeforeAddHistoryRequest', function(e, filter) {
       *       var newFilter = {};
       *       for (var i in filter) {
       *          if (filter.hasOwnProperty(i)) {
       *             if (filter[i] !== -1) {
       *                newFilter[i] = filter[i];
       *             }
       *          }
       *       }
       *
       *       e.setResult(newFilter);
       *    });
       * </pre>
       */
      $protected: {
         _options: {
           /**
            * @cfg {Boolean} Отображать ли историю выбора
            * <wiTag group="Отображение">
            * В истории отображаются ранее выбранные значения, по которым осуществлялась фильтрация.
            * При этом возможно отметить значения, нажав на иконку кнопки рядом. Значения с отметкой будут подняты в начало списка истории.
            * Возможные значения:
            * <ol>
            *    <li>true - показывать историю выбора. Отображение происходит во всплывающей панели, указанной в опции {@link $ws.proto.FilterButton#template template}.
            *    Панель при этом самостоятельно подстраивается по высоте в зависимости от количества записей в истории;</li>
            *    <li>false - не показывать историю.</li>
            * </ol>
            * @see setShowHistory
            * @see clearHistory
            */
            showHistory: false
         },
         _filterView: undefined,
         _filters: {},
         _history: {},
         _remember: [],
         _appliedRequest: undefined,
         _isRememberedFilter: false,
         _requestsView: undefined,
         _requestHistory: undefined,
         _minimizeIcon: undefined,
         _uniqueName: undefined,
         _userConfigParallelDeferred: undefined,
         _initWithBrowser: undefined
      },
      $condition: function() {
         return this._options.showHistory === true;
      },
      $constructor: function() {
         this._publish('onCreateRequest', 'onBeforeAddHistoryRequest');
         this._initWithBrowser = !!this._browser;
      },
      _createFloatArea: function() {
         var
            self = this;

         this._floatAreaDeferred.addCallback(function (floatArea) {
            self._requestsView = floatArea.getChildControlByName('requestsView');
            self._requestHistory = floatArea.getChildControlByName('requestHistory');
            self._minimizeIcon = floatArea.getChildControlByName('minimizeIcon');
            self._minimizeIcon.getContainer().parent().addClass('ws-FilterButton__minimizeContainer');
            self._minimizeIcon.subscribe('onActivated', function () {
               self._showMinimizeHistory();
            });

            self._initHistoryEvents();

            if (self._initWithBrowser) {
               self._readUserConfig(floatArea);
            }

            return floatArea;
         });
      },
      _readUserConfig: function(floatArea) {
         var
            self = this,
            children,
            browser = this.getBrowser(),
            name;
         this._uniqueName = this.getName();
         if ($ws.helpers.instanceOfModule(browser, 'SBIS3.CORE.DataViewAbstract') && (name = browser.getName())) {
            this._uniqueName += ('-' + name);
         }

         if ($ws._const.userConfigSupport) {
            self._userConfigParallelDeferred = new $ws.proto.ParallelDeferred();
            self._userConfigParallelDeferred.push(
               $ws.single.UserConfig.getParam(self._uniqueName + '-historyFilters').addCallback(function(result){
                  if (!self.isDestroyed() && typeof(result) == 'string') {
                     var history = $ws.helpers.deserializeURLData(result);
                     if (!Object.isEmpty(history)) {
                        self._history = history;
                     }
                  }
               })
            );
            self._userConfigParallelDeferred.push(
               $ws.single.UserConfig.getParam(self._uniqueName + '-historyData').addCallback(function(result){
                  if (!self.isDestroyed() && typeof(result) == 'string') {

                     var rs = self._createHistoryRecordSet($ws.helpers.deserializeURLData(result)),
                        recordsCount = rs.getRecordCount();

                     if (recordsCount > 0) {
                        self._requestsView.setData(rs);

                        if (recordsCount > MAX_MINIMIZE_HISTORY_REQUESTS) {
                           self._showMinimizeHistory();
                           self._minimizeIcon.show();
                        }

                        self._showHistoryTemplate();
                     }
                  }
               })
            );

            children = floatArea.getChildControls();

            for (var i = 0, l = children.length; i < l; i++) {
               if ($ws.helpers.instanceOfModule(children[i], 'SBIS3.CORE.FilterView')) {
                  self._filterView = children[i];
                  break;
               }
            }
            if (self._filterView) {
               self._userConfigParallelDeferred.push(
                  $ws.single.UserConfig.getParam(self._uniqueName + '-filterViewData').addCallback(function(result){
                     if (!self.isDestroyed() && typeof(result) === 'string') {
                        var filters = $ws.helpers.deserializeURLData(result);
                        if (!Object.isEmpty(filters)) {
                           self._filters = filters;
                        }
                     }
                  })
               );
            }
            self._userConfigParallelDeferred.push(
               $ws.single.UserConfig.getParam(self._uniqueName + '-rememberData').addCallback(function(result){
                  if (!self.isDestroyed() && typeof(result) == 'string') {
                     var remember = $ws.helpers.deserializeURLData(result);
                     if (Array.isArray(remember) && remember.length) {
                        self._remember = remember;
                     }
                  }
               })
            );
            self._userConfigParallelDeferred.done().getResult().addCallback($ws.helpers.forAliveOnly(function(){
               self._restructRemembers();
            }, self));
         }
         return floatArea;
      },
      _createHistoryRecordSet: function(data) {
         data = data || {
            s: this._requestsView.getRecordSet().getColumnsForSerialize(),
            d: []
         };
         var firstColumn = data.s[0];
         return new $ws.proto.RecordSet({
            readerType: 'ReaderSBIS',
            readerParams: {
               pkColumnName: firstColumn ? firstColumn.n : undefined,
               adapterType : 'TransportAdapterStatic',
               adapterParams: {
                  data : data
               }
            }
         });
      },
      _showHistoryTemplate: function() {
         this._manipulateHistoryTemplate(true);
      },
      _hideHistoryTemplate: function() {
         this._manipulateHistoryTemplate(false);
      },
      _manipulateHistoryTemplate: function(toShow){
         this._requestHistory.toggle(toShow);
      },
      _addHistoryRequest: function(request, filter, stringFilter) {
         var onCreateRequestResult,
             requestsContainer,
             currentRecordSet,
             recordCount,
             deleteRowKey,
             newKey,
             self;

         if (request) {
            requestsContainer = this._requestsView.getContainer();
            currentRecordSet = this._requestsView.getRecordSet();
            recordCount = currentRecordSet.getRecordCount();
            self = this;

            this._showHistoryTemplate();

            if (this._requestsView.isMinimized()) {
               this._requestsView.showSelection(false);
               currentRecordSet = this._requestsView.getRecordSet();
               recordCount = currentRecordSet.getRecordCount();
            }

            if (recordCount === MAX_HISTORY_REQUESTS) {
               if (requestsContainer.find('.ws-FilterButton__request-remembered').length === MAX_HISTORY_REQUESTS) {
                  this._showMinimizeHistory();

                  return;
               }

               deleteRowKey = requestsContainer.find('[rowkey]:last').attr('rowkey');
               delete this._history[deleteRowKey];
               delete this._filters[deleteRowKey];
               currentRecordSet.clearRecord(deleteRowKey);
               this._requestsView.refresh();
            }

            onCreateRequestResult = this._notify('onCreateRequest', $ws.core.clone(filter), stringFilter);

            if (typeof onCreateRequestResult === 'string') {
               request = onCreateRequestResult;
            }

            newKey = $ws.helpers.randomId();
            currentRecordSet.createRecord({
               key: newKey,
               request: request,
               isRemembered: false
            }).addCallback(function(record) {
               var tmpArr = [],
                   data = [],
                   badValues =  {
                      'parent': true,
                      'element': true,
                      'context': true,
                      'linkedContext': true
                   },
                   query,
                   cfg;
               currentRecordSet.insertAfter(self._getKeyToInsertAfter(record.getKey(), true), record);
               self._history[newKey] = $ws.core.clone(filter);

               if (self._filterView && !self._filterView.isDestroyed()) {
                  tmpArr = self._filterView.getFiltersData();
                  query = self._filterView.getQuery();
                  for (var i = 0, l = tmpArr.length; i < l; i++) {
                     if (tmpArr[i].hasOwnProperty('config')) {
                        //При сериализации получаем ошибку циклических зависимостей
                        //Куча кода, потому что мы не можем удалить из объекта с фильтрами ничего, так как
                        //они переданы по ссылке, а клонировать контекст мы не можем
                        cfg =  tmpArr[i].config[1];
                        data.push({
                           'title': tmpArr[i].title,
                           'config': []
                        });
                        data[i].config.push(tmpArr[i].config[0]);
                        data[i].config.push({});
                        for (var j in cfg) {
                           if (cfg.hasOwnProperty(j)) {
                              if (!badValues[j]) {
                                 data[i].config[1][j] = cfg[j];
                              }
                           }
                        }
                        data[i].value = query[data[i].title];
                     } else {
                        data.push(tmpArr[i]);
                     }
                  }

                  self._filters[newKey] = data;
               }
               self._saveHistory();
               self._showMinimizeHistory();
               if (recordCount === MAX_MINIMIZE_HISTORY_REQUESTS) {
                  self._minimizeIcon.show();
               }
            });
         }
      },
      _initHistoryEvents: function() {
         var self = this,
             floatAreaCont = this._floatArea.getContainer(),
             parentCont = floatAreaCont[0];

         floatAreaCont.find('.ws-FilterButton__historyGrid > div:last-child').bind({
            'click': function ( ) {
               if ($(this).hasClass('ws-FilterButton__minimizeContainer')) {
                  self._showMinimizeHistory();
               }
            },
            'mouseenter': function ( ) {
               $(this).addClass('action-hover');
            },
            'mouseleave': function ( ) {
               $(this).removeClass('action-hover');
            }
         });
         $('.ws-FilterButton__historyIcon', parentCont).live('mouseup', this._rememberRequest.bind(this));
         $('.ws-FilterButton__request', parentCont).live({
            'mouseenter': this._requestMouseEnter.bind(this),
            'mouseleave': this._requestMouseLeave.bind(this)
         });
         this._requestsView.subscribe('onRowClick', this._applyRequest.bind(this));
         this._floatArea.subscribe('onAfterClose', this._restructRemembers.bind(this));
      },
      _hoverRequest: function(isIn, requestCont) {
         if (!requestCont.hasClass('ws-FilterButton__request-remembered')) {
            requestCont.find('.ws-FilterButton__historyIcon').toggleClass('icon-Pin icon-disabled', isIn);
         }
      },
      _requestMouseEnter: function(event) {
         this._hoverRequest(true, $(event.currentTarget));
      },
      _requestMouseLeave: function(event) {
         this._hoverRequest(false, $(event.currentTarget));
      },
       /**
        * <wiTag group="Управление">
        * Очистить историю выбора.
        * @example
        * <pre>
        *     btn.subscribe('onActivated', function(){
        *        //Очистить историю запросов по клику на кнопку
        *        filterButton.clearHistory();
        *     });
        * </pre>
        * @see showHistory
        * @see setShowHistory
        */
      clearHistory: function() {
         if (this._options.showHistory) {
            if (this._requestsView.isMinimized()) {
               this._showMinimizeHistory();
               this._minimizeIcon.hide();
               this._minimizeIcon.setImage('sprite:icon-16 ' + MIN_HISTORY_BUTTON_ICON + ' icon-primary');
            }
            this._hideHistoryTemplate();
            this._history = {};
            this._filters = {};
            this._remember = [];
            this._clearHistory();
            this._requestsView.setData(this._createHistoryRecordSet());
         }
      },
      _clearHistory: function() {
         this._saveHistory(true);
      },
       /**
        * <wiTag group="Отображение">
        * Установить отображение истории выбора.
        * @example
        * <pre>
        *     switcher.subscribe('onChange', function(e, value){
        *        //Показать или скрыть историю запросов в зависимости от состояния переключателя
        *        filterButton.setShowHistory(value);
        *     });
        * </pre>
        * @param value
        * @see showHistory
        * @see clearHistory
        */
      setShowHistory: function(value) {
         var show = !!value;
         if (!show) {
            this.clearHistory();
         }
         this._options.showHistory = show;
      },
      _showMinimizeHistory: function() {
         var records = this._requestsView.getRecordSet().getRecords(),
               count = records.length,
               isMinimize = this._requestsView.isMinimized(),
               keys = [];
         if (isMinimize) {
            this._requestsView.showSelection(false);
            this._requestsView.removeSelection();
         } else if (count > MAX_MINIMIZE_HISTORY_REQUESTS) {
            for (var i = 0; i < MAX_MINIMIZE_HISTORY_REQUESTS; i++) {
               keys.push(records[i].getKey());
            }
            this._requestsView.removeSelection();
            this._requestsView.setSelection(keys);
            this._requestsView.showSelection(true);
         }
         this._minimizeIcon.setTooltip(isMinimize ? MAX_HISTORY_BUTTON_TOOLTIP : MIN_HISTORY_BUTTON_TOOLTIP);
         this._minimizeIcon.setImage('sprite:icon-16 ' + (isMinimize ? MAX_HISTORY_BUTTON_ICON : MIN_HISTORY_BUTTON_ICON) + ' icon-primary');
      },
      _getKeyToInsertAfter: function(rowKey, isRequestRemembered) {
         var requestsContainer = this._requestsView.getContainer(),
               rememberedRequests = requestsContainer.find('.ws-FilterButton__request-remembered'),
               insertAfterKey, lastRememberKey;
         if (isRequestRemembered && rememberedRequests.length > 0) {
            lastRememberKey = $(rememberedRequests[rememberedRequests.length - 1]).attr('rowkey');
            insertAfterKey = rowKey === lastRememberKey ? requestsContainer.find('[rowkey='+rowKey+']').prev().attr('rowkey') : lastRememberKey;
         }
         return insertAfterKey;
      },
      _restructRemembers: function() {
         if (this._options.showHistory && (this._remember && this._remember.length || this._appliedRequest)) {
            var record,
                pk,
                contains = {},
                rs = this._requestsView.getRecordSet();
            if (this._requestsView.isMinimized()) {
               this._requestsView.showSelection(false);
               rs = this._requestsView.getRecordSet();
            }
            if (this._remember && this._remember.length) {
               $ws.helpers.forEach(this._remember, function (pk) {
                  contains[pk] = !contains[pk];
               });
               while (pk = this._remember.shift()) {
                  if (contains[pk]) {
                     contains[pk] = false; //чтобы не повторять действия для Record'ов которые входят 3, 5, 7... раз
                     record = rs.getRecordByPrimaryKey(pk);
                     rs.clearRecord(record._pkValue);
                     rs.insertAfter(this._getKeyToInsertAfter(record._pkValue, !record.get('isRemembered')), record);
                  }
               }
            }
            if (this._appliedRequest instanceof $ws.proto.Record) {
               rs.clearRecord(this._appliedRequest._pkValue);
               rs.insertAfter(this._getKeyToInsertAfter(this._appliedRequest._pkValue, !this._appliedRequest.get('isRemembered')), this._appliedRequest);
               this._appliedRequest = undefined;
            }

            this._saveHistory();
         }
         if (this._options.showHistory && this._requestsView) {
            if (!this._requestsView.isMinimized()) {
               this._showMinimizeHistory();
            }
         }
      },
      _rememberRequest: function(event) {
         var wasMinimized = this._requestsView.isMinimized(),
             row = $(event.currentTarget).closest('.ws-FilterButton__request'),
             isRequestRemembered = row.hasClass('ws-FilterButton__request-remembered'),
             rowKey = row.attr('rowkey'),
             rs = this._requestsView.getRecordSet(),
             record = rs.getRecordByPrimaryKey(rowKey);

         this._remember.push(rowKey);
         if (wasMinimized) {
            this._requestsView.showSelection(false);
         }
         record.set('isRemembered', !isRequestRemembered);
         this._saveHistory();
         if (wasMinimized) {
            this._showMinimizeHistory();
         }
         this._requestsView.removeSelection();
         this._requestsView.refresh();
      },
      _applyRequest: function(event, row, record) {
         if (!this._filterSetted) {
            var key = record.getKey(),
                query = $ws.core.clone(this._history[key]);
            this._isRememberedFilter = true;
            if (this._filterView && !this._filterView.isDestroyed()) {
               var filter = this._filters[key],
                   filters = [];
               //Обновляем фильтры кнопки фильтров, ибо могут закрасться старые плохие значение, происходит зацикливание
               this._filter = $ws.core.merge(this._filter, this._history[key]);
               for (var i = 0, l = filter.length; i < l; i++) {
                  filters.push($ws.core.clone(filter[i]));
               }
               //Здесь все может сломаться, но фильтры и так заполнены, setValue только множит запросы
               //this._filterView.getLinkedContext().setValue(query);
               this._filterView.setFiltersData(filters);
            }
            this._setControlsValues(query);
            this.applyFilter();
            if (this._floatArea) {
               this._floatArea.hide();
            }
            this._appliedRequest = record;
            this._requestsView.removeSelection();
         }
      },
      _processData: function(data, filter, stringFilter) {
         var requestText,
            isNewRequest,
            newFilter;

         if ($ws._const.userConfigSupport && this._userConfigParallelDeferred && !this._userConfigParallelDeferred.getResult().isReady()) {
            return;
         }
         if (!this._isRememberedFilter) {
            newFilter = this._notify('onBeforeAddHistoryRequest', $ws.core.clone(filter),  $ws.core.clone(this._history));
            if (newFilter !== false) {
               if (!(newFilter instanceof Object)) {
                  newFilter = filter;
               }
               data = this._prepareData(this._getTextFromFilter(newFilter, stringFilter));

               if (data) {
                  isNewRequest = true;
                  requestText = this._getStringRequest(newFilter);

                  for (var i in this._history) {
                     if (this._history.hasOwnProperty(i) && requestText === this._getStringRequest(this._history[i])) {
                        isNewRequest = false;
                        break;
                     }
                  }

                  if (isNewRequest) {
                     this._addHistoryRequest(data, newFilter, stringFilter);
                  }
               }
            }
         } else {
            this._isRememberedFilter = false;
         }
      },
      _getStringRequest: function(filter) {
         var keys = Object.keys(filter).sort(),
             sortedFilter = {},
             key;

         for (var i = 0, l = keys.length; i < l; i++) {
            key = keys[i];
            if (filter[key] instanceof Array) {
               sortedFilter[key] = filter[key].sort();
            } else {
               sortedFilter[key] = filter[key];
            }
         }

         return JSON.stringify(sortedFilter);
      },
      _prepareData: function(data) {
         if (data instanceof $) {
            data = data.text();
         }

         return $ws.helpers.escapeTagsFromStr(data, []).trim();
      },
      _saveHistory: function(toClear) {
         var dResult,
             hasFilterView,
             historyFilters,
             filterViewData,
             historyData,
             rememberData,
             result;

         if ($ws._const.userConfigSupport) {
            dResult = new $ws.proto.ParallelDeferred();
            hasFilterView = this._filterView && !this._filterView.isDestroyed();
            historyFilters = $ws.helpers.serializeURLData(this._history);
            filterViewData = $ws.helpers.serializeURLData(this._filters);
            historyData = $ws.helpers.serializeURLData(this._requestsView.getRecordSet());
            rememberData = $ws.helpers.serializeURLData(this._remember);
            if (toClear) {
               historyFilters = null;
               historyData = null;
               filterViewData = null;
               rememberData = null;
            }
            dResult.push($ws.single.UserConfig.setParam(this._uniqueName + '-historyFilters', historyFilters));
            dResult.push($ws.single.UserConfig.setParam(this._uniqueName + '-historyData', historyData));
            dResult.push($ws.single.UserConfig.setParam(this._uniqueName + '-rememberData', rememberData));
            if (hasFilterView) {
               dResult.push($ws.single.UserConfig.setParam(this._uniqueName + '-filterViewData', filterViewData));
            }
            dResult.done();
            result = dResult.getResult();
         }
         return result;
      },
      _restructHistory: function() {
         var
            self = this;
         this._floatAreaReady.wait(new $ws.proto.Deferred().addCallback(function() {
            if (self._initWithBrowser === false || (self._initWithBrowser === undefined && !self._browser)) {
               self._readUserConfig(self._floatArea);
            }
         }));
      },
      destroy: function() {
         this._history = undefined;
         this._remember = undefined;
         this._filters = undefined;
         this._filterView = undefined;
         this._requestsView = undefined;
         this._requestHistory = undefined;
         this._minimizeIcon = undefined;
         this._userConfigParallelDeferred = undefined;
         this._initWithBrowser = undefined;
      }
   });
});