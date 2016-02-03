define('js!SBIS3.CONTROLS.Browser', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Browser',
   'js!SBIS3.CONTROLS.ComponentBinder',
   'js!SBIS3.CONTROLS.FilterHistoryController',
   'html!SBIS3.CONTROLS.Browser/resources/contentTpl'
], function(CompoundControl, dotTplFn, ComponentBinder, HistoryController, contentTpl){
   'use strict';

   /**
    * Базовый класс для реестра
    *
    * @class SBIS3.CONTROLS.Browser
    * @extends $ws.proto.CompoundControl
    * @control
    * @public
    * @demo SBIS3.CONTROLS.Demo.MyBrowser
    */

   var
      checkViewType = function(view) {
         if (view && $ws.helpers.instanceOfModule(view, 'SBIS3.CONTROLS.ListView')) {
            return $ws.helpers.instanceOfMixin(view, 'SBIS3.CONTROLS.TreeMixinDS');
         }
         else {
            throw new Error('Browser: Can\'t define linkedView');
         }
      };

   var Browser = CompoundControl.extend( /** @lends SBIS3.CONTROLS.Browser.prototype */{
      /**
       * @event onEdit при редактировании/создании записи
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} id Ид редактируемой записи. Для добавления будет null
       * @param {SBIS3.CONTROLS.Record} item Редактируемая запись
       * @example
       */
      _dotTplFn : dotTplFn,
      $protected: {
         _view: null,
         _backButton: null,
         _breadCrumbs: null,
         _searchForm: null,
         _operationsPanel: null,
         _filterButton: null,
         _fastDataFilter: null,

         _hierMode : false,
         _componentBinder : null,
         _options: {
            /**
             * @cfg {Content} Содержимое реестра
             */
            content: '',
            /**
             * @cfg {String} Имя параметр фильтрации для поиска
             */
            searchParam : 'СтрокаПоиска',
            /**
             * @cfg {String|Object} Шаблон для хлебных крошек в режиме поиска
             */
            searchCrumbsTpl: undefined,
            /**
             * @cfg {String} Id для работы с историей фильтров
             */
            historyId : '',
            contentTpl : contentTpl
         }
      },

      $constructor: function () {

      },

      init: function() {
         var self = this;
         Browser.superclass.init.apply(this, arguments);

         this._view = this._getView();
         this._view.subscribe('onItemActivate', function(e, itemMeta) {
            self._notifyOnEditByActivate(itemMeta);
         });


         this._hierMode = checkViewType(this._view);


         if (this._hierMode) {
            this._backButton = this._getBackButton();
            this._breadCrumbs = this._getBreadCrumbs();
               if (this._backButton && this._breadCrumbs) {
                  this._componentBinder = new ComponentBinder({
                     backButton : this._backButton,
                     breadCrumbs : this._breadCrumbs,
                     view: this._view
                  });
                  this._componentBinder.bindBreadCrumbs();
               }
               else {
                  this._componentBinder = new ComponentBinder({
                     view: this._view
                  });
               }
         }
         else {
            this._componentBinder = new ComponentBinder({
               view: this._view
            });
         }

         this._searchForm = this._getSearchForm();
         if (this._searchForm) {
            this._componentBinder.bindSearchGrid(this._options.searchParam, this._options.searchCrumbsTpl, this._searchForm);
         }


         this._operationsPanel = this._getOperationsPanel();
         if (this._operationsPanel) {
            this._componentBinder.bindOperationPanel(true, this._operationsPanel);
         }

         this._filterButton = this._getFilterButton();
         this._fastDataFilter = this._getFastDataFilter();
         if (this._filterButton) {
            if(this._options.historyId) {
               this._componentBinder.bindFilterHistory(
                   this._filterButton,
                   this._fastDataFilter,
                   this._options.historyId,
                   HistoryController,
                   this);
            } else {
               this._notifyOnFiltersReady();
            }
         } else {
            this._notifyOnFiltersReady();
         }
      },

      addItem: function(metaData) {
         //При создании записи в простом случае просто зовем onEdit с пустыми параметрами
         this._notify('onEdit', {id: null, item: null});
      },

      getView: function() {
         return this._view;
      },

      _notifyOnFiltersReady: function() {
         this._fastDataFilter && this._fastDataFilter.getContainer().removeClass('ws-hidden');
         this._notify('onFiltersReady');
      },

      _getLinkedControl: function(name) {
         var ctrl = null;
         if (this.hasChildControlByName(name)) {
            ctrl = this.getChildControlByName(name);
         }
         return ctrl;
      },

      _getView: function() {
         return this._getLinkedControl('browserView');
      },
      _getFilterButton: function() {
         return this._getLinkedControl('browserFilterButton');
      },
      _getSearchForm: function() {
         return this._getLinkedControl('browserSearch');
      },
      _getBackButton: function() {
         return this._getLinkedControl('browserBackButton');
      },
      _getBreadCrumbs: function() {
         return this._getLinkedControl('browserBreadCrumbs');
      },
      _getOperationsPanel: function() {
         return this._getLinkedControl('browserOperationsPanel');
      },
      _getFastDataFilter: function() {
         return this._getLinkedControl('browserFastDataFilter');
      },

      _notifyOnEditByActivate: function(itemMeta) {
         this._notify('onEdit', itemMeta)
      }

   });

   return Browser;
});