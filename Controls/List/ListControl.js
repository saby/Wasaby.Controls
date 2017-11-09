define('js!Controls/List/ListControl', [
   'Core/Control',
   'tmpl!Controls/List/ListControl',
   'js!Controls/List/resources/utils/DataSourceUtil',
   'WS.Data/Type/descriptor',
   'WS.Data/Source/ISource',
   'Core/core-instance',
   'js!Controls/List/Controllers/PageNavigation',
   'Core/helpers/functional-helpers'
], function (Control,
             ListControlTpl,
             DataSourceUtil,
             Types,
             ISource,
             cInstance,
             PageNavigation,
             fHelpers
   ) {
   'use strict';

   var _private = {
      initNavigation: function(options, dataSource) {
         if (options.navigation && options.navigation.type == 'page') {
            this._navigationController = new PageNavigation(options.navigation.config);
            this._navigationController.prepareSource(dataSource);
         }
      },

      prepareQueryParams: function(direction) {
         var params = {
            filter: this._filter,
            sorting: this._sorting,
            limit: undefined,
            offset: undefined
         };

         if (this._navigationController) {
            var addParams = this._navigationController.prepareQueryParams(this._display, direction);
            params.limit = addParams.limit;
            params.offset = addParams.offset;
            //TODO фильтр и сортировка не забыть приделать
         }
         return params;
      },

      reload: function(options) {
         if (this._dataSource) {
            var
               def,
               self = this;

            var queryParams = _private.prepareQueryParams.call(this);

            var userParams = this._notify('onBeforeDataLoad', queryParams.filter, queryParams.sorting, queryParams.offset, queryParams.limit);
            if (userParams) {
               queryParams.filter = userParams['filter'] || queryParams.filter;
               queryParams.sorting = userParams['sorting'] || queryParams.sorting;
               queryParams.offset = userParams['offset'] || queryParams.offset;
               queryParams.limit = userParams['limit'] || queryParams.limit;
            }
            //TODO решить с параметрами
            def = DataSourceUtil.callQuery(this._dataSource, this._options.idProperty, queryParams.filter, queryParams.sorting, queryParams.offset, queryParams.limit)
               .addCallback(fHelpers.forAliveOnly(function (list) {
                  self._notify('onDataLoad', list);
                  _private.onDSReload.call(this, list, options);
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
                  _private.onLoadPage.call(this, list, direction);
                  return list;
               }, self))
               .addErrback(fHelpers.forAliveOnly(this._loadErrorProcess, self));
            this._loader = def;
         }
         else {
            throw new Error('Option dataSource is undefined. Can\'t load page');
         }
      },

      onLoadPage: function(list, direction) {
         if (direction == 'down') {
            this._items.append(list);
         } else if (direction == 'up') {
            this._items.prepend(list);
         }
         if (this._navigationController) {
            this._navigationController.calculateState(list, direction);
         }
      },

      onDSReload: function(list, options) {
         if (
            this._items && cInstance.instanceOfModule(this._items, 'WS.Data/Collection/RecordSet')
            && (list.getModel() === this._items.getModel())
            && (Object.getPrototypeOf(list).constructor == Object.getPrototypeOf(list).constructor)
            && (Object.getPrototypeOf(list.getAdapter()).constructor == Object.getPrototypeOf(this._items.getAdapter()).constructor)
            ) {
            this._items.setMetaData(list.getMetaData());
            this._items.assign(list);
         } else {
            this._items = list;
         }
         if (this._navigationController) {
            this._navigationController.calculateState(list)
         }

         return list;
      }
   };


   /*
   Опции
   * dragEntity, dragEntityList, enabledMove, itemsDragNDrop - обсудить с Яриком, возможно будет достаточно события dragStart
   * infiniteScroll, infiniteScrollContainer, infiniteScrollPreloadOffset, showPaging, partialPaging, pageSize - вынести в навигацию
   * resultsPosition, resultsText, resultsTpl - как настраивать
   *
   * Удалил:
   * allowEmptyMultiSelection, allowEmptySelection, colorField, colorMarkEnabled, highlightEnabled, highlightText, includedTemplates, validateIfDisabled, itemTpl
   * footerTpl, templateBinding, useSelectAll
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
    * @name Controls/List/ListControl#navigation
    * @cfg {Object} Настройки навигации
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

         constructor: function (cfg) {
            ListView.superclass.constructor.apply(this, arguments);
            this._items = cfg.items;
            this._publish('onDataLoad');
         },

         _beforeMount: function(newOptions) {
            this._filter = newOptions.filter;

            if (newOptions.dataSource) {
               this._dataSource = DataSourceUtil.prepareSource(newOptions.dataSource);
               _private.initNavigation.call(this, newOptions, this._dataSource);
               if (!this._items) {
                  _private.reload.call(this, newOptions);
               }
            }
         },

         _beforeUpdate: function(newOptions) {
            if (newOptions.filter != this._options.filter) {
               this._filter = newOptions.filter;
            }

            if (newOptions.dataSource !== this._options.dataSource) {
               this._dataSource = DataSourceUtil.prepareSource(newOptions.dataSource);
               _private.initNavigation.call(this, newOptions, this._dataSource);
               _private.reload.call(this, newOptions);
            }

            //TODO обработать смену фильтров и т.д. позвать релоад если надо
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