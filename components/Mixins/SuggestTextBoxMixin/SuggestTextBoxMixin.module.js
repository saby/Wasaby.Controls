/**
 * Created by am.gerasimov on 08.06.2016.
 */
define('js!SBIS3.CONTROLS.SuggestTextBoxMixin', [
   "Core/constants",
   'js!SBIS3.CONTROLS.SearchController',
   'js!SBIS3.CONTROLS.HistoryList',
   'js!WS.Data/Collection/RecordSet',
   'js!WS.Data/Di',
   "Core/core-instance",
   "Core/CommandDispatcher",
   "Core/core-functions"
], function (
   constants,
   SearchController,
   HistoryList,
   RecordSet,
   Di,
   cInstance,
   CommandDispatcher,
   cFunctions ) {

   'use strict';

   function stopEvent(e) {
      e.stopPropagation();
      e.preventDefault();
   }

   /**
    * Миксин, задающий любому полю ввода работу с автодополненем.
    * @mixin SBIS3.CONTROLS.SuggestTextBoxMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   var SuggestTextBoxMixin = {
      $protected: {
         _changedByKeyboard: false,  /* {Boolean} Флаг, обозначающий, что изменения были вызваны действиями с клавиатуры */
         /* Т.к. при выборе из списка, фокус может находиться на нём, а не на поле ввода,
            то обрабатывать клавиатурные события надо на списке. Но надо учитывать,
            что список находится в body, а блокировать всплытие события надо на уровне поля ввода,
            поэтому запоминаем, что выбор был произвёден, когда фокус был на списке, чтобы потом заблокировать всплытие события. */
         _selectedFromList: false,
         _historyController: null,

         _options: {
            /**
             * @cfg {String} Имя параметра фильтрации для поиска
             */
            searchParam : ''
         }
      },
      $constructor: function () {
         var self = this;

         this._options.observableControls.unshift(this);

         this.once('onListReady', function(e, list) {
            self.subscribeTo(list, 'onKeyPressed', function (event, jqEvent) {
               if(jqEvent.which === constants.key.enter) {
                  self._selectedFromList = true;
               }
            });
         });

         /* Если передали параметр поиска, то поиск производим через ComponentBinder */
         if(this._options.searchParam) {
            CommandDispatcher.declareCommand(this, 'changeSearchParam', this.setSearchParamName);

            this.subscribe('onSearch', function(e, text, force) {
               if(!force) {
                  this._showLoadingIndicator();
               }
            });

            this.once('onSearch', function () {
               this._searchController = new SearchController({
                  view: this.getList(),
                  searchForm: this,
                  searchParamName: this._options.searchParam,
                  doNotRespondOnReset: true,
                  searchFormWithSuggest: true
               });
               this._searchController.bindSearch();
            });

            this.subscribe('onReset', this._resetSearch.bind(this));
         }
      },

      _showHistory: function () {
         if (this._historyController.getCount()) {
            this.getList().setItems(this._getHistoryRecordSet());
            this.showPicker();
         }
      },
      _getHistoryRecordSet: function(){
         var historyRecordSet = new RecordSet({
            adapter: this.getDataSource().getAdapter(),
            rawData: [],
            idProperty: this._list.getProperty('idProperty')
         });
         historyRecordSet.assign(this._prepareHistoryData());
         return historyRecordSet;
      },
      _prepareHistoryData: function(){
         var history = this._historyController,
            rawData = [];
         for (var i = 0, l = history.getCount(); i < l; i++){
            rawData.push(this._getHistoryRecord(history.at(i).get('data')));
         }
         return rawData;
      },
      _getHistoryRecord: function(item){
         var list = this.getList();
         return Di.resolve(list.getDataSource().getModel(), {
            adapter: list.getDataSource().getAdapter(),
            idProperty: list.getProperty('idProperty'),
            rawData: item.getRawData()
         });
      },
      _needShowHistory: function(){
         return this._historyController && !this.getText().length && this._options.startChar; //Если startChar = 0, историю показывать не нужно
      },

      /**
       * Изменяет параметр поиска
       * @param {String} paramName
       */
      setSearchParamName: function(paramName) {
         if(this._searchController) {
            this._searchController.setSearchParamName(paramName);
         }
         this._options.searchParam = paramName;
      },

      _getLoadingContainer : function() {
         return this.getContainer().find('.controls-TextBox__fieldWrapper');
      },

      before: {
         _setTextByKeyboard: function () {
            /* Этот флаг надо выставлять только когда текст изменён с клавиатуры,
               чтобы при изменнии текста из контекста не вызывался поиск в автодополнении */
            this._changedByKeyboard = true;
         },
         _observableControlFocusHandler: function(){
            if (this._needShowHistory()){
               this._showHistory();
            }
         },
         _onListItemSelectNotify: function(item){
            if (this._historyController) {
               this._historyController.prepend(item.getRawData());
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
         _inputFocusInHandler: function() {
            this._observableControlFocusHandler();
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
               var showPicker = function() {
                     if(self._checkPickerState(!self._options.showEmptyList)) {
                        self.showPicker();
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
                  showPicker();
               } else {
                  this.subscribeOnceTo(list, 'onDrawItems', showPicker);
               }
            }
         },
         _initList: function(){
            if (this._options.historyId){
               this._historyController = new HistoryList({
                  historyId: this._options.historyId
               });
            }
         },
         _resetSearch: function() {
            if (this._needShowHistory()){
               this._showHistory();
            }

            if(this._options.searchParam) {
               /* Т.к. при сбросе поиска в саггесте запрос отправлять не надо (саггест скрывается),
                то просто удалим параметр поиска из фильтра */
               var listFilter = cFunctions.clone(this.getList().getFilter()); /* Клонируем фильтр, т.к. он передаётся по ссылке */

               delete listFilter[this._options.searchParam];
               this.setListFilter(listFilter, true);
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

            /* Рекурсивный поиск списка, чтобы автодополнение не закрывалось,
               когда фокус уходит на компонент, который был открыт из автодополнения. */
            function isSuggestParent(target) {
               do {
                  target = target.getParent() || (target.getOpener instanceof Function ? target.getOpener() : null);
               }
               while (target && target !== list);

               return target === list;
            }

            /* focusedControl может не приходить при разрушении контрола */
            if(list && focusedControl) {
               isChildControl = isSuggestParent(focusedControl);

               if(!isChildControl) {
                  isChildControl = list.getChildControls(false, true, function(ctrl) {
                     return focusedControl === ctrl;
                  }).length;
               }
            }

            if(!isChildControl) {
               this.hidePicker();
               parentFunc.apply(this, arguments);
            }
         },

         _setPickerConfig: function(parentFunc){
            var parentConfig = parentFunc.apply(this, arguments);
            parentConfig.tabindex = 0;
            parentConfig.targetPart = true;
            return parentConfig;
         },

         setListFilter: function(parentFunc, filter, silent) {
            parentFunc.call(this, filter, silent || !this._changedByKeyboard);
         }
      }
   };

   return SuggestTextBoxMixin;
});
