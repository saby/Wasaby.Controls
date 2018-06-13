/**
 * Created by am.gerasimov on 08.06.2016.
 */
define('SBIS3.CONTROLS/Mixins/SuggestTextBoxMixin', [
   "Core/constants",
   'SBIS3.CONTROLS/ComponentBinder/SearchController',
   'SBIS3.CONTROLS/History/HistoryList',
   'SBIS3.CONTROLS/ControlHierarchyManager',
   'WS.Data/Collection/RecordSet',
   'WS.Data/Di',
   "WS.Data/Query/Query",
   'Core/core-merge',
   "Core/ParallelDeferred",
   'Core/Deferred',
   "Core/core-instance",
   "Core/core-clone",
   "Core/IoC",
   "Core/helpers/Function/once",
   "Core/detection",
   "Core/CommandDispatcher",
   'SBIS3.CONTROLS/Menu/SBISHistoryController'
], function (
   constants,
   SearchController,
   HistoryList,
   ControlHierarchyManager,
   RecordSet,
   Di,
   Query,
   cMerge,
   ParallelDeferred,
   Deferred,
   cInstance,
   coreClone,
   IoC,
   once,
   detection,
   CommandDispatcher,
   SBISHistoryController) {

   'use strict';

   var HISTORY_LENGTH = 12;
   
   function stopEvent(e) {
      e.stopPropagation();
      e.preventDefault();
   }

    /**
     * Миксин, задающий любому полю ввода работу с автодополнением.
     * @mixin SBIS3.CONTROLS/Mixins/SuggestTextBoxMixin
     * @public
     * @author Герасимов А.М.
     */
   var SuggestTextBoxMixin = /**@lends SBIS3.CONTROLS/Mixins/SuggestTextBoxMixin.prototype  */{
      /**
       * @event onBeforeLoadHistory Происходит перед вызовом списочного метода для получения истории.
       * @remark
       * В некоторых случаях есть необходимость дополнить выводимую историю своими записями.
       * Для этого из события нужно вернуть deferred, который в callback вернет RecordSet с записями, которые требуется добавить к истории
       * <pre>
       * SuggestTextBox.subscribe('onBeforeLoadHistory', function(eventObject, idArray) {
       *    if (idArray.length < 12) {
       *       var myQuery = self.getMyQuery().limit(12 - idArray.length),
       *           queryDeferred = self.getMyDataSource().query(myQuery);
       *       eventObject.setResult(queryDeferred);
       *    }
       * });
       * </pre>
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {Array} idArray Массив идентификаторов записей, которые будут получены списочным методом.
       */
      $protected: {
         _changedByKeyboard: false,  /* {Boolean} Флаг, обозначающий, что изменения были вызваны действиями с клавиатуры */
         /* Т.к. при выборе из списка, фокус может находиться на нём, а не на поле ввода,
            то обрабатывать клавиатурные события надо на списке. Но надо учитывать,
            что список находится в body, а блокировать всплытие события надо на уровне поля ввода,
            поэтому запоминаем, что выбор был произвёден, когда фокус был на списке, чтобы потом заблокировать всплытие события. */
         _selectedFromList: false,
         _historyController: null,
         _inputHistoryController: null,
         _inputHistoryDeferred: null,
         _historyDeferred: undefined, //Защита от множественных запросов
         _options: {
             /**
              * @cfg {String} Поисковый параметр, передаваемый в аргумент "Фильтр" при вызове <a href="/doc/platform/developmentapl/service-development/service-contract/objects/blmethods/bllist/">списочного метода</a> БЛ.
              * @remark
              * Ознакомьтесь с описанием к {@link SBIS3.CONTROLS/Mixins/SearchMixin миксину}, чтобы понять алгоритм вызова списочного метода и обработки поискового параметра.
              */
            searchParam : '',
            /**
             * @cfg {Boolean} Использовать механизм смены неверной раскладки
             */
            keyboardLayoutRevert: true,
            /**
             * @cfg {Boolean} Использовать механизм смены неверной раскладки по новому стандарту
             */

            keyboardLayoutRevertNew: true,
            /**
             * cfq{String} Индентификатор, по которому в базе хранятся ранее выбранные записи в поле связи
             * @remark
             * В базе хранится массив идентификаторов. Записи по этому массиву мы получаем через списочный метод, куда одним из полей фильтра отправляем этот массив, в качестве поля используем idProperty, установленный для источника.
             */
            historyId: null,
            /**
             * @cfg {Boolean} Использовать сервис истории ввода
             */
            useInputHistoryService: false,
            /**
             * @cfg {Boolean} Хранить данные истории в пользовательских параметрах
             * @deprecated
             */
            useUserConfigHistory: true,
            // TODO разобраться с множественным вызовом на фокус и клик _observableControlFocusHandler https://online.sbis.ru/opendoc.html?guid=19af9bf9-0d16-4f63-8aa8-6d0ef7ff0799
            task1174306848: false
         }
      },
      $constructor: function () {
         var self = this;
         this._publish('onBeforeLoadHistory');
         this._options.observableControls.unshift(this);
         CommandDispatcher.declareCommand(this, 'changeSearchParam', function(searchParam) {
            if (self._list) {
               var filter = self._list.getFilter();
               
               if (filter[self._options.searchParam] && self._options.searchParam !== searchParam) {
                  filter[searchParam] = filter[self._options.searchParam];
                  delete filter[self._options.searchParam];
                  self._list.setFilter(filter, true);
               }
            }
            self.setSearchParamName(searchParam);
            
            if (self._needShowHistory()) {
               self._showHistory();
            } else if (self.isPickerVisible()) {
               self.getPicker().recalcPosition(true, true)
            }
            self._updateList();
         });
         
         /* Инициализация searchController'a происходит лениво,
            только при начале поиска (по событию onSearch). Поэтому, чтобы не было множественных подписок
            на onSearch (и лишних созданий контроллера), метод инициализации позволяем вызывать только один раз. */
         this._initializeSearchController = once.call(this._initializeSearchController);

         this.once('onListReady', function(e, list) {
            self.subscribeTo(list, 'onKeyPressed', function (event, jqEvent) {
               if(jqEvent.which === constants.key.enter) {
                  self._selectedFromList = true;
               }
            });
         });

         /* Если передали параметр поиска, то поиск производим через ComponentBinder */
         if(this._options.searchParam) {
            this._initializeSearchController();
         }
      },

      _showHistory: function () {
         //Если запрос уже идет, то не нужно делать повторный.
         //Сейчас метод показа истории может вызываться несколько раз из-за проблем с фокусами.
         //Проблема плавающая, поэтому постави доп защиту здесь от множественного вызова БЛ
         if (this._historyDeferred || this._inputHistoryDeferred) {
            return;
         }
         this._getHistoryRecordSet().addCallback(function (rs) {
            /* По окончанию запроса поле связи могут скрыть, причём не само поле связи, а его родителя.
               Проверим, что оно показано */
            if (rs.getCount() && this.isVisibleWithParents()) {
               this.getList().setItems(rs);
               this.showPicker();
            }
         }.bind(this)).addErrback(function (err) {
            //Если запрос был прерван нами, то ничего не делаем
            if (!err.canceled && err.message !== "Cancel") { //Из parallelDeferred возвращается ошибка с текстом "Cancel" при превранном запросе
               //В рамках совместимости оставляю старое поведение
               if (!err.processed) {
                  IoC.resolve('ILogger').log(this._moduleName, 'Списочный метод не смог вычитать записи по массиву идентификаторов');
               }
            }
         }.bind(this));
      },
      _getHistoryRecordSet: function () {
         var queryDef = this._getQueryForHistory(),
             self = this;

         return queryDef.addCallback(function(query){
            return self._makeHistoryQuery(query);
         });
      },

      _makeHistoryQuery: function(query) {
          var listSource = this.getList().getDataSource(),
              queryFilter = query.getWhere()[this._getListIdProperty()],
              pd = new ParallelDeferred(),
              self = this,
              beforeLoadHistoryResult,
              historyRS;

         beforeLoadHistoryResult = this._notify('onBeforeLoadHistory', queryFilter);

         /* Необходимо сделать запрос, аже если истории для выбора нет, т.к. на бл могут дополнять выборку */
          // вычитка с БЛ
          this._historyDeferred = this.getList().getDataSource().query(query);
          pd.push(this._historyDeferred);

          if (cInstance.instanceOfModule(beforeLoadHistoryResult, 'Core/Deferred')) {
              pd.push(beforeLoadHistoryResult);
          }

          return pd.done().getResult().addCallback(function (result) {
              historyRS = new RecordSet({
                  adapter: listSource.getAdapter(),
                  rawData: result[0] ? result[0].getRawData() : [],
                  idProperty: self.getList().getProperty('idProperty'),
                  model: listSource.getModel()
              });
              if (result[1]) {
                  historyRS.append(result[1].getAll());
              }
              return historyRS;
          }).addBoth(function(result) {
              self._historyDeferred = null;
              self._inputHistoryDeferred = null;
              return result;
          });
      },

      _getQueryForHistory: function() {
         var self = this,
             recordsId = [],
             recent;

         if(this._options.useInputHistoryService){
             this._inputHistoryController = new SBISHistoryController({
                 historyId: this._options.historyId,
                 maxCountRecent: 12
             });
             this._inputHistoryDeferred = this._inputHistoryController.getUnionIndexesList(this).addCallback(function(data) {
                  recent = data && data.getRow().get('recent');
                  if(recent) {
                      recent.forEach(function (id) {
                          recordsId.push(id);
                      });
                  }
                  return self._makeQueryFilterForHistory(recordsId);
             });
         }else {
             this._inputHistoryDeferred = new Deferred();
             this._inputHistoryDeferred.addCallback(function(data) {
                return self._makeQueryFilterForHistory(data);
             });
             this._historyController.getHistory(true).addCallback(function(history) {
                for (var i = 0, l = self._historyController.getCount(); i < l; i++) {
                   recordsId.push(self._getHistoryRecordId(self._historyController.at(i).get('data')));
                }
                self._inputHistoryDeferred.callback(recordsId);
                return history;
             });
         }
         return this._inputHistoryDeferred;
      },

      _makeQueryFilterForHistory: function(recordsId) {
          var query = new Query(),
              filter = {};

          filter[this._getListIdProperty()] = recordsId;
          filter = cMerge(filter, this.getList().getFilter() || {}); //Отдаем в запрос на историю фильтр с листа

          if (this._options.searchParam) {
              delete filter[this._options.searchParam];
          }
          query.where(filter).limit(12);
          return query;
      },

      _getHistoryRecord: function(item){
         var list = this.getList();
         return Di.resolve(list.getDataSource().getModel(), {
            adapter: list.getDataSource().getAdapter(),
            idProperty: list.getProperty('idProperty'),
            rawData: item.getRawData()
         });
      },
      _getHistoryRecordId: function(record) {
         return this._getHistoryRecord(record).get(this._getListIdProperty());
      },
      _getListIdProperty: function() {
         return this.getList().getDataSource().getIdProperty() || this.getList().getProperty('idProperty');
      },
      _needShowHistory: function(){
         var listItems = this._getListItems();
         return this._historyController && !this.getText() && this._options.startChar && //Если startChar = 0, историю показывать не нужно
               (!listItems || !listItems.getCount() || !this.isPickerVisible()); // Показываем историю, если записей нет или пикер скрыт
      },

      /**
       * Изменяет параметр поиска
       * @param {String} paramName
       */
      setSearchParamName: function(paramName) {
         this._options.searchParam = paramName;
         if(this._searchController) {
            this._searchController.setSearchParamName(paramName);
         } else {
            this._initializeSearchController();
         }
      },

      _initializeSearchController: function() {
         this.subscribe('onSearch', function(e, text, force) {
            var listFilter = coreClone(this.getList().getFilter()); /* Клонируем фильтр, т.к. он передаётся по ссылке */
            listFilter[this._options.searchParam] = text;
            this.setListFilter(listFilter, true);
            if(!force) {
               this._showLoadingIndicator();
            }
         });

         /* Когда включена опция autoShow, то SearchController необходимо
            инициализировать при получении фокуса полем ввода,
            т.к. автодопонение появляется уже при получении фокуса. */
         this.once(this._getOption('autoShow') ? 'onFocusIn' : 'onSearch', function () {
            this._searchController = new SearchController({
               view: this.getList(),
               searchForm: this,
               keyboardLayoutRevert: this._options.keyboardLayoutRevert,
               searchParamName: this._options.searchParam,
               doNotRespondOnReset: true,
               searchFormWithSuggest: true,
               keyboardLayoutRevertNew: this._options.keyboardLayoutRevertNew
            });
            this._searchController.bindSearch();
         });

         this.subscribe('onReset', this._resetSearch.bind(this));
      },

      _getLoadingContainer : function() {
         return this.getContainer().find('.controls-SuggestTextBox__afterFieldWrapper');
      },

      before: {
         hidePicker: function() {
            if (this._historyDeferred){
               this._historyDeferred.cancel();
            }
         },
         _setTextByKeyboard: function () {
            /* Этот флаг надо выставлять только когда текст изменён с клавиатуры,
               чтобы при изменнии текста из контекста не вызывался поиск в автодополнении */
            this._changedByKeyboard = true;
         },
         
         _getHistoryController: function() {
            if (!this._historyController){
               this._historyController = new HistoryList({
                  historyId: this._options.historyId,
                  maxLength: HISTORY_LENGTH
               });
            }
            return this._historyController;
         },
         _observableControlFocusHandler: function(){
            if (this._options.historyId) {
               /* Проинициализируем контроллер истории, если есть historyId */
               this._getHistoryController();
            }
            if (this._needShowHistory()){
               //historyId и autoShow взаимоисключающий функционал. В 150 просто отключаю, в 17.10 вывожу ошибку
               //Если есть история, то не показываю случайную выборку
               this._options.autoShow = false;
               this._showHistory();
            }
         },
         _onListItemSelectNotify: function(item){
            this._addItemToHistory(item);
         },

         _addItemToHistory: function(item) {
            if (!this._options.useInputHistoryService) {
                if (this._options.historyId) {
                   var historyController = this._getHistoryController();
                    //Определяем наличие записи в истории по ключу: стандартная логика контроллера не подходит,
                    //т.к. проверка наличия добавляемой записи в истории производится по полному сравнению всех полей записи.
                    //В записи поля могут задаваться динамически, либо просто измениться, к примеру значение полей может быть привязано к текущему времени
                    //Это приводит к тому, что historyController не найдет текущую запись в истории и добавит ее заново. Получится дублирование записей в истории
                    var items = this.getList().getItems(),
                        idProp = items ? items.getIdProperty() : this.getList().getProperty('idProperty'),
                        itemId = item.get(idProp),
                        index = -1;
   
                   historyController.each(function (model, i) {
                        var historyModelObject = model.get('data').getRawData();
                        var historyModelId;
                        //Проблема в адаптерах historyRecordSet и сохраняемой записи, они могут быть разными
                        //в таком случае, когда дергается var dataRecord = model.get('data'), то dataRecord приводится к типу Record (по формату), но
                        //свойства модели не инициализируются, соответственно dataRecord.get('anyField') не вернет ничего.
                        //Пока не доработали механизм истории на запоминание только id, приходится искать добавляемую запись в рекордсете истории вручную по сырым данным.
                        if (historyModelObject.d instanceof Array && historyModelObject.s instanceof Array) {
                            var fieldIndex = -1;
                            for (var j = 0; j < historyModelObject.s.length; j++) {
                                if (historyModelObject.s[j].n === idProp) {
                                    fieldIndex = j;
                                    break;
                                }
                            }
                            if (fieldIndex > -1) {
                                historyModelId = historyModelObject.d[fieldIndex];
                            }
                        }
                        else {
                            historyModelId = historyModelObject[idProp];
                        }
                        if (itemId === historyModelId) {
                            index = i;
                        }
                    });
                    if (index !== -1) {
                       historyController.removeAt(index);
                    }
                   historyController.prepend(item.getRawData());
                }
            } else {
               if (this._inputHistoryController) {
                  this._inputHistoryController.addToHistory(item.getId());
               }
            }
         }
      },


      after: {
         _keyDownBind: function(e) {
            /* Запрещаем всплытие enter и esc по событию keyDown,
               т.к. Area тоже его слушает и закрывает floatArea */
            if((e.which === constants.key.enter || e.which === constants.key.esc) && this.isPickerVisible()) {
               stopEvent(e);
            }
         },

         // FIXME костыль до перехода на пикера по фокусную систему
         _inputFocusInHandler: function(event) {
            !this._options.task1174306848 && this._observableControlFocusHandler(event);
         },
         
         _inputClickHandler: function(e) {
            /* По стандарту клик по полю с автодополнением или получение фокуса при включённом автопоказе (опция autoShow),
               должен вызывать отображение автодополнения. Т.к. если в поле ввода уже стоит фокус, то клик не вызывает никаких
               связанных с фокусом событий, поэтому при клике по полю ввода надо тоже показать автодополнение. */
            if(this.isActive() && !this._options.task1174306848) {
               this._observableControlFocusHandler(e);
            }
         },
         /**
          * Блочим события поднятия служебных клавиш,
          * нужно в основном при использовании в редактировании по месту
          * @param e
          * @private
          */
         _keyUpBind: function(e) {
            var isPickerVisible = this.isPickerVisible();

            switch (e.which) {
               /* Чтобы нормально работала навигация стрелками и не случалось ничего лишнего,
                то запретим всплытие события */
               case constants.key.down:
               case constants.key.up:
               case constants.key.enter:
                  if(isPickerVisible || this._selectedFromList) {
                     stopEvent(e);
                  }

                  this._selectedFromList = false;

                  if(isPickerVisible) {
                     var list = this.getList();
                     list._keyboardHover(e);
                  }
                  break;
               case constants.key.esc:
                  if(isPickerVisible) {
                     this.hidePicker();
                     stopEvent(e);
                  }
                  break;
            }
            this._changedByKeyboard = false;
         },

         _onListDataLoad: function(e, dataSet) {
            var self = this;

            if(this._options.searchParam) {
               var togglePicker = function() {
                     if(self._checkPickerState(!self._options.showEmptyList)) {
                        if(!self.getList().isLoading()) {
                           self.showPicker();
                        }
                     } else {
                        self.hidePicker();
                     }
                  },
                  list = this.getList(),
                  listItems = list.getItems();

               /* В событии onDataLoad момент нельзя показывать пикер т.к. :
                1) Могут возникнуть проблемы, когда после отрисовки пикер меняет своё положение.
                2) Данных в рекордсете ещё нет.
                3) В onDataLoad приклданые программисты могу менять загруженный рекордсет.
                Поэтому в этом событии просто одинарно подпишемся на событие отрисовки данных и покажем автодополнение (если требуется). */
               if( (dataSet && !dataSet.getCount()) && (listItems && !listItems.getCount()) ) {
                  /* Если был пустой список и после загрузки пустой, то события onDrawItems не стрельнёт,
                   т.к. ничего не рисовалось */
                  togglePicker();
               } else {
                  this.subscribeOnceTo(list, 'onDrawItems', togglePicker);
               }
            }
         },
         _resetSearch: function() {
            if (this._needShowHistory() && !this.getSelectedKeys().length){
               this._showHistory();
            }

            if(this._options.searchParam) {
               /* Т.к. при сбросе поиска в саггесте запрос отправлять не надо (саггест скрывается),
                то просто удалим параметр поиска из фильтра */
               var listFilter = coreClone(this.getList().getFilter()); /* Клонируем фильтр, т.к. он передаётся по ссылке */

               delete listFilter[this._options.searchParam];
               this.setListFilter(listFilter, true);
            }
         },
         destroy: function() {
            if (this._historyController) {
               this._historyController.destroy();
               this._historyController = null;
            }
         }
      },
      around: {
         /* Метод для проверки, куда ушёл фокус, т.к. попап до сих пор
          отслеживает клики, и, если фокус ушёл например по tab, то саггест не закроется +
          надо, чтобы правильно запускалась валидация */
         // FIXME костыль до перехода на пикера по фокусную систему
         _focusOutHandler: function(parentFunc, event, isDestroyed, focusedControl) {
            var isChildControl = false,
                list = this._list;

            /* focusedControl может не приходить при разрушении контрола */
            if(list && focusedControl) {
               isChildControl = ControlHierarchyManager.checkInclusion(list, focusedControl.getContainer());

               if(!isChildControl) {
                  isChildControl = list.getChildControls(false, true, function(ctrl) {
                     return focusedControl === ctrl;
                  }).length;
               }
            }

            if(!isChildControl) {
               this.hidePicker();
               parentFunc.call(this, event, isDestroyed, focusedControl);
            }
         },

         _setPickerConfig: function(parentFunc){
            var parentConfig = parentFunc.apply(this, arguments);
            parentConfig.tabindex = 0;
            parentConfig.targetPart = true;
            /* Т.к. на мобильных устройствах при установке фокуса в поле ввода может проиходить скролл ( и чаще всего происходит ),
               нельзя скрывать автодополнение при скроле. */
            parentConfig.closeOnTargetMove = !detection.isMobilePlatform;
            return parentConfig;
         },

         setListFilter: function(parentFunc, filter, silent) {
            parentFunc.call(this, filter, silent || !this._changedByKeyboard);
         }
      }
   };

   return SuggestTextBoxMixin;
});
