define('js!Controls/List/ListControl', [
   'Core/Control',
   'tmpl!Controls/List/ListControl',
   'js!Controls/List/ListControl/ListViewModel',
   'js!Controls/List/resources/utils/DataSourceUtil',
   'WS.Data/Type/descriptor',
   'WS.Data/Source/ISource',
   'Core/core-instance',
   'js!Controls/List/Controllers/PageNavigation',
   'js!Controls/List/Controllers/ScrollWatcher',
   'js!Controls/List/Controllers/VirtualScroll',
   'Core/helpers/functional-helpers',
   'css!Controls/List/ListControl'
], function (Control,
             ListControlTpl,
             ListViewModel,
             DataSourceUtil,
             Types,
             ISource,
             cInstance,
             PageNavigation,
             ScrollWatcher,
             VirtualScroll,
             fHelpers
   ) {
   'use strict';

   var _private = {
      createListModel: function(items, cfg) {
         return new ListViewModel ({
            items : items,
            idProperty: cfg.idProperty,
            displayProperty: cfg.displayProperty,
            selectedKey: cfg.selectedKey
         })
      },
      //проверка на то, нужно ли создавать новый инстанс рекордсета или же можно положить данные в старый
      isEqualRecordset: function(oldList, newList) {
         return oldList && cInstance.instanceOfModule(oldList, 'WS.Data/Collection/RecordSet')
         && (newList.getModel() === oldList.getModel())
         && (Object.getPrototypeOf(newList).constructor == Object.getPrototypeOf(newList).constructor)
         && (Object.getPrototypeOf(newList.getAdapter()).constructor == Object.getPrototypeOf(oldList.getAdapter()).constructor)
      },

      initNavigation: function(navOption, dataSource) {
         var navController;
         if (navOption && navOption.type == 'page') {
            navController = new PageNavigation(navOption.config);
            navController.prepareSource(dataSource);
         }
         return navController;
      },

      prepareQueryParams: function(direction) {
         var params = {};
         if (this._navigationController) {
            var addParams = this._navigationController.prepareQueryParams(this._display, direction);
            params.limit = addParams.limit;
            params.offset = addParams.offset;

         }
         return params;
      },

      paramsWithNavigation: function(params, navigCtrl, display, direction) {
         var navigParams = navigCtrl.prepareQueryParams(display, direction);
         params.limit = navigParams.limit;
         params.offset = navigParams.offset;
         //TODO фильтр и сортировка не забыть приделать
         return params;
      },

      paramsWithUserEvent: function(params, userParams) {
         params.filter = userParams['filter'] || queryParams.filter;
         params.sorting = userParams['sorting'] || queryParams.sorting;
         params.offset = userParams['offset'] || queryParams.offset;
         params.limit = userParams['limit'] || queryParams.limit;
         return params;
      },

      reload: function(newOptions) {
         if (this._dataSource) {
            var def, queryParams,
               self = this;

            queryParams = {
               filter: this._filter,
               sorting: this._sorting,
               limit: undefined,
               offset: undefined
            };
            //модифицируем параметры через навигацию
            if (this._navigationController) {
               queryParams = _private.paramsWithNavigation(queryParams, this._navigationController, this._display);
            }

            //позволяем модифицировать параметры юзеру
            var userParams = this._notify('onBeforeDataLoad', queryParams.filter, queryParams.sorting, queryParams.offset, queryParams.limit);
            if (userParams) {
               queryParams = _private.paramsWithNavigation(queryParams, this._navigationController, this._display);
            }

            def = DataSourceUtil.callQuery(this._dataSource, this._options.idProperty, queryParams.filter, queryParams.sorting, queryParams.offset, queryParams.limit)
               .addCallback(fHelpers.forAliveOnly(function (list) {
                  self._notify('onDataLoad', list);
                  if (_private.isEqualRecordset(self._items, list)) {
                     self._items.setMetaData(list.getMetaData());
                     self._items.assign(list);
                  } else {
                     self._items = list;
                     self._listModel = _private.createListModel(self._items, newOptions);
                  }
                  if (self._navigationController) {
                     self._navigationController.calculateState(list)
                  }
                  if (self._virtualScroll) {
                     self._virtualScroll.setDisplayCount(self._listModel._itemsModel._display.getCount());
                  }

                  //TODO !!!!!!!!!!!!!!!!!!!
                  self._bottomPlaceholderHeight = (self._listModel._itemsModel._display.getCount() - 50) * 25;

                  return list;
               }, self))
               .addErrback(fHelpers.forAliveOnly(this._loadErrorProcess, self));
            this._loader = def;
         }
         else {
            throw new Error('Option dataSource is undefined. Can\'t reload view');
         }
      },


      loadPage: function(direction) {
         var def, self = this;
         if (this._dataSource) {
            var queryParams = _private.prepareQueryParams.call(this, direction);
            def = DataSourceUtil.callQuery(this._dataSource, this._options.idProperty, queryParams.filter, queryParams.sorting, queryParams.offset, queryParams.limit)
               .addCallback(fHelpers.forAliveOnly(function (list) {
                  self._notify('onDataLoad', list, direction);

                  if (direction == 'down') {
                     self._items.append(list);
                  } else if (direction == 'up') {
                     self._items.prepend(list);
                  }
                  if (self._navigationController) {
                     self._navigationController.calculateState(list, direction);
                  }
                  if (self._virtualScroll) {
                     self._virtualScroll.updateListModel(direction);
                  }

                  return list;
               }, self))
               .addErrback(fHelpers.forAliveOnly(this._loadErrorProcess, self));
            this._loader = def;
         }
         else {
            throw new Error('Option dataSource is undefined. Can\'t load page');
         }
      },

      createScrollWatcher: function(scrollContainer) {
         var
            self = this,
            children = this._children,
            triggers = {
               topListTrigger: children.topListTrigger,
               bottomListTrigger: children.bottomListTrigger,
               topLoadTrigger: children.topLoadTrigger,
               bottomLoadTrigger: children.bottomLoadTrigger
            },
            eventHandlers = {
               onLoadTriggerTop: function() {
                  self._scrollLoadMore('up');
               },
               onLoadTriggerBottom: function() {
                  self._scrollLoadMore('down');
               },
               onListTop: function() {
               },
               onListBottom: function() {
               },
               onListScroll: _private.onListScroll.bind(self)
            };

         return new ScrollWatcher ({
            triggers : triggers,
            scrollContainer: scrollContainer,
            loadOffset: this._loadOffset,
            eventHandlers: eventHandlers
         });
      },

      onListScroll: function(scrollTop) {
         var virtualResult = this._virtualScroll.calcVirtualWindow(scrollTop, this._listModel);
         //Если нужно, обновляем индексы видимых записей и распорки
         if (virtualResult) {
            this._topPlaceholderHeight = virtualResult.topPlaceholderHeight;
            this._bottomPlaceholderHeight = virtualResult.bottomPlaceholderHeight;
            this._listModel.updateIndexes(virtualResult.indexStart, virtualResult.indexStop);
            this._forceUpdate();
         }
      }
   };


   /*
    Опции
    * dragEntity, dragEntityList, enabledMove, itemsDragNDrop - обсудить с Яриком, возможно будет достаточно события dragStart
    * resultsPosition, resultsText, resultsTpl - как настраивать
    *
    * Удалил:
    * colorField, colorMarkEnabled, highlightEnabled, highlightText, includedTemplates, validateIfDisabled, itemTpl
    * footerTpl, templateBinding, useSelectAll
    *
    * allowEmptyMultiSelection, allowEmptySelection - в интерфейс selectable
    * */


   /**
    * List Control
    * @class Controls/List/ListControl
    * @extends Core/Control
    * @mixes Controls/interface/IItems
    * @mixes Controls/interface/IDataSource
    * @mixes Controls/interface/ISingleSelectable
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IGroupedView
    * @control
    * @public
    * @category List
    */

   /**
    * @name Controls/List/ListControl#contextMenu
    * @cfg {Boolean} Показывать ли контекстное меню при клике на правую кнопку мыши
    */

   /**
    * @name Controls/List/ListControl#editingTemplate
    * @cfg {Function} Шаблон редактирования строки
    */

   /**
    * @name Controls/List/ListControl#emptyTemplate
    * @cfg {Function} Шаблон отображения пустого списка
    */


   /* по названиям вопрос sorting, filtering sort, filter ???? */

   /**
    * @name Controls/List/ListControl#filter
    * @cfg {Object} Настройки фильтра
    */

   /**
    * @name Controls/List/ListControl#sorting
    * @cfg {Object} Настройки сортировки
    */

   /**
    * @typedef {String} ListNavigationSource
    * @variant position Описание
    * @variant offset Описание
    * @variant page Описание
    */

   /**
    * @typedef {String} ListNavigationView
    * @variant infinity Описание
    * @variant pages Описание
    * @variant demand Описание
    */

   /**
    * @typedef {Object} ListNavigationPositionSourceConfig
    * @property {String} field Описание
    * @property {String} direction Описание
    */

   /**
    * @typedef {Object} ListNavigationOffsetSourceConfig
    * @property {Number} limit Описание
    */

   /**
    * @typedef {Object} ListNavigationInfinityViewConfig
    * @property {String} pagingMode Описание
    */

   /**
    * @typedef {Object} ListNavigationPagesViewConfig
    * @property {Boolean} pagesCountSelector Описание
    */

   /**
    * @typedef {Object} ListNavigation
    * @property {ListNavigationSource} source Описание
    * @property {ListNavigationView} view Описание
    * @property {ListNavigationPositionSourceConfig|ListNavigationOffsetSourceConfig} sourceConfig Описание
    * @property {ListNavigationInfinityViewConfig|ListNavigationPagesViewConfig} viewConfig Описание
    */

   /**
    * @name Controls/List/ListControl#navigation
    * @property {ListNavigation} Настройки навигации
    */

   /**
    * @name Controls/List/ListControl#multiselect
    * @cfg {Boolean} Разрешен ли множественный выбор.
    */

   /**
    * @name Controls/List/ListControl#itemsActions
    * @cfg {Array} Операции над записью
    */

   /**
    * @name Controls/List/ListControl#loadItemsStrategy
    * @cfg {String} Стратегия действий с подгружаемыми в список записями
    * @variant merge Мержить, при этом записи с одинаковыми id схлопнутся в одну
    * @variant append Добавлять, при этом записи с одинаковыми id будут выводиться в списке
    */

   /**
    * Запускает создание записи
    * @function Controls/interface/IPromisedSelectable#beginAdd
    */

   /**
    * Запускает редактирование по месту
    * @function Controls/interface/IPromisedSelectable#beginEdit
    */

   /**
    * Завершает редактирование по месту без сохранения изменений
    * @function Controls/interface/IPromisedSelectable#cancelEdit
    */

   /**
    * Завершает редактирование по месту с сохранением изменений
    * @function Controls/interface/IPromisedSelectable#commitEdit
    */


   /**
    * Подумать
    *
    * тут главный вопрос в диалоге редактирования. что мы должны позвать при диалоге редактирования?
    * или при операциях над записью. там есть и удаление и перемещение. с помощью диалога редактирования можно
    * позвать "создать", значит добавление можно делать не только через редактирование по месту.
    * по сути это синхронизация рекордсета, которым владеет список и источника можно делать вызов
    * отдельными методами - это это расскрывать детали реализации Санников предлагал делать метод sync,
    * чтобы был более четкий контракт с экшеном диалога редактирования. но не совсем понятно как работать с
    * синком из операций над записью.
    *
    * Удаляет записи из источника данных по переданным идентификаторам элементов коллекции. Шляпа какая-то.
    * @function -#deleteRecords
    */

   /**
    * Перемещает переданные записи. Подумать.
    * @function Controls/interface/IPromisedSelectable#move
    */

   /**
    * Перезагружает набор записей представления данных с последующим обновлением отображения
    * @function Controls/interface/IPromisedSelectable#reload
    */

   /**
    * @event Controls/List/ListControl#onAfterBeginEdit Происходит после начала редактирования
    */

   /**
    * @event Controls/List/ListControl#onAfterEndEdit Происходит после окончания редактирования по месту
    */

   /**
    * @event Controls/List/ListControl#onBeginAdd Происходит перед созданием в списке нового элемента коллекции
    */

   /**
    * @event Controls/List/ListControl#onBeginDelete Происходит перед удалением записей
    */

   /**
    * @event Controls/List/ListControl#onBeginEdit Происходит перед началом редактирования
    */

   /**
    * @event Controls/List/ListControl#onBeginMove Происходит перед началом перемещения записей
    */

   /**
    * @event Controls/List/ListControl#onDataMerge Происходит перед добавлением загруженных записей в основной dataSet
    */

   /**
    * @event Controls/List/ListControl#onEndDelete Происходит после удаления записей
    */

   /**
    * @event Controls/List/ListControl#onEndEdit Происходит перед окончанием редактирования или добавления по месту
    */

   /**
    * @event Controls/List/ListControl#onEndMove Происходит после перемещения записей
    */


   /**
    * Вроде есть смена выделеной записи, пока спилим
    * @event -#onItemActivate Происходит при смене записи (активации) под курсором мыши
    */

   /**
    * @event Controls/List/ListControl#onItemClick Происходит при любом клике по записи
    */

   /**
    * в чем разница между dataLoad и dataMerge?
    * @event Controls/List/ListControl#onDataLoad Происходит при загрузке данных
    */

   var ListView = Control.extend(
      {
         _controlName: 'Controls/List/ListControl',
         _template: ListControlTpl,
         iWantVDOM: true,
         _isActiveByClick: false,

         _items: null,

         _dataSource: null,
         _loader: null,

         //TODO пока спорные параметры
         _filter: undefined,
         _sorting: undefined,

         _itemTemplate: null,

         _loadOffset: 100,
         _topPlaceholderHeight: 0,
         _bottomPlaceholderHeight: 0,

         constructor: function (cfg) {
            ListView.superclass.constructor.apply(this, arguments);
            this._publish('onDataLoad');
         },

         /**
          * Load more data after reaching end or start of the list.
          *
          * @param direction 'up' | 'down'
          * @private
          */
         _scrollLoadMore: function(direction) {
            if (this._navigationController && this._navigationController.hasMoreData(direction)) {
               _private.loadPage.call(this, direction);
            }
         },

         _beforeMount: function(newOptions) {
            this._filter = newOptions.filter;
            if (newOptions.items) {
               this._items = newOptions.items;
               this._listModel = _private.createListModel(this._items, newOptions);
            }
            if (newOptions.dataSource) {
               this._dataSource = DataSourceUtil.prepareSource(newOptions.dataSource);
               this._navigationController = _private.initNavigation(newOptions.navigation, this._dataSource);
               if (!this._items) {
                  _private.reload.call(this, newOptions);
               }
            }

            this._virtualScroll = new VirtualScroll({
               maxRows: 75,
               listModel: this._listModel,
               displayCount: this._listModel._itemsModel._display.getCount()
            });
         },

         _afterMount: function() {
            ListView.superclass._afterMount.apply(this, arguments);

            var scrollContainer = this._container.closest('.ws-scrolling-content')[0];
            this._scrollWatcher = _private.createScrollWatcher.call(this, scrollContainer);
         },

         _beforeUpdate: function(newOptions) {
            if (newOptions.filter != this._options.filter) {
               this._filter = newOptions.filter;
            }

            if (newOptions.items && newOptions.items != this._options.items) {
               this._items = newOptions.items;
               this._listModel = _private.createListModel(this._items, newOptions);
            }

            if (newOptions.dataSource !== this._options.dataSource) {
               this._dataSource = DataSourceUtil.prepareSource(newOptions.dataSource);
               this._navigationController = _private.initNavigation(newOptions.navigation, this._dataSource);
               _private.reload.call(this, newOptions);
            }

            //TODO обработать смену фильтров и т.д. позвать релоад если надо
         },

         _beforeUnmount: function() {
            this._scrollWatcher.destroy();

            ListView.superclass._beforeUnmount.apply(this, arguments);
         },

         //<editor-fold desc='DataSourceMethods'>
         reload: function() {
            _private.reload.call(this, this._options);
         }
      });

   //TODO https://online.sbis.ru/opendoc.html?guid=17a240d1-b527-4bc1-b577-cf9edf3f6757
   /*ListView.getOptionTypes = function getOptionTypes(){
    return {
    dataSource: Types(ISource)
    }
    };*/

   return ListView;
});