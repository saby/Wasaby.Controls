define('js!Controls/List/ListControl', [
   'Core/Control',
   'tmpl!Controls/List/ListControl',
   'js!Controls/List/resources/utils/DataSourceUtil',
   'WS.Data/Type/descriptor',
   'WS.Data/Source/ISource',
   'js!Controls/List/Controllers/PageNavigation',
   'Core/helpers/functional-helpers',
   'require'
], function (Control,
             ListControlTpl,
             DataSourceUtil,
             Types,
             ISource,
             PageNavigation,
             fHelpers,
             require
   ) {
   'use strict';

   var _private = {
      initNavigation: function(navOption, dataSource) {
         var navController;
         if (navOption && navOption.source == 'page') {
            navController = new PageNavigation(navOption.sourceConfig);
            navController.prepareSource(dataSource);
         }
         return navController;
      },

      prepareQueryParams: function(direction) {

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

      reload: function() {
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

                  //TODO обсудить. Стремная проверка на то - это первое создание списка или последующие перезагрузки.
                  //если это первое создание, то можно просто засунуть в _items и тогда они прокинутся во view
                  //если второе, то надо отдать items прямо в контрол
                  if (self._children._ListView) {
                     self._children._ListView.setItems(list);
                  }
                  else {
                     self._items = list;
                  }


                  if (self._navigationController) {
                     self._navigationController.calculateState(list);
                  }
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

                  return list;
               }, self))
               .addErrback(fHelpers.forAliveOnly(this._loadErrorProcess, self));
            this._loader = def;
         }
         else {
            throw new Error('Option dataSource is undefined. Can\'t load page');
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
         _itemsChanged: true,

         _dataSource: null,
         _loader: null,

         //TODO пока спорные параметры
         _filter: undefined,
         _sorting: undefined,

         _itemTemplate: null,

         constructor: function (cfg) {
            ListView.superclass.constructor.apply(this, arguments);
            this._items = cfg.items;
            this._publish('onDataLoad');
         },

         _beforeMount: function(newOptions) {

            //TODO могут задать items как рекордсет, надо сразу обработать тогда навигацию и пэйджинг

            this._filter = newOptions.filter;

            if (newOptions.dataSource) {
               this._dataSource = DataSourceUtil.prepareSource(newOptions.dataSource);
               this._navigationController = _private.initNavigation(newOptions.navigation, this._dataSource);
               if (!this._items) {
                  _private.reload.call(this, newOptions);
               }
            }
         },

         _beforeUpdate: function(newOptions) {

            //TODO могут задать items как рекордсет, надо сразу обработать тогда навигацию и пэйджинг

            if (newOptions.filter != this._options.filter) {
               this._filter = newOptions.filter;
            }

            if (newOptions.dataSource !== this._options.dataSource) {
               this._dataSource = DataSourceUtil.prepareSource(newOptions.dataSource);
               this._navigationController = _private.initNavigation(newOptions.navigation, this._dataSource);
               _private.reload.call(this, newOptions);
            }
            //TODO обработать смену фильтров и т.д. позвать релоад если надо
         },

         _afterMount: function() {
            debugger;
            if (this._options.navigation && this._options.navigation.view == 'infinity') {
               //TODO кривое обращение к DOM
               var scrollContainer = this._container.closest('.ws-scrolling-content');
               if (this._options.navigation.viewConfig && this._options.navigation.viewConfig.pagingMode) {
                  var self = this;
                  this._viewHeight = this._children._ListView._container.get(0).scrollHeight;
                  require(['js!Controls/List/Controllers/ScrollPaging'], function (ScrollPagingController) {
                     self._scrollPagingCtr = new ScrollPagingController({
                        scrollContainer: scrollContainer,
                        viewHeight: self._viewHeight
                     })
                  });
               }
            }




         },

         _afterUpdate: function() {

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