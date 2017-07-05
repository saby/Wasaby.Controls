define('js!WSControls/Lists/ItemsControl', [
   'Core/core-extend',
   'Core/core-functions',
   'js!WSControls/Control/Base',
   'js!WS.Data/Collection/RecordSet',
   'Core/helpers/Object/isEmpty',
   'Core/helpers/string-helpers',
   'Core/Sanitize',
   'js!WS.Data/Utils',
   'js!SBIS3.CONTROLS.Utils.TemplateUtil',
   'tmpl!WSControls/Lists/resources/ItemsTemplate',
   'tmpl!WSControls/Lists/resources/ItemTemplate',
   'tmpl!SBIS3.CONTROLS.ListView/resources/ItemContentTemplate',
   'js!SBIS3.CONTROLS.ListView/ListViewHelpers',
   'js!WSControls/Lists/resources/utils/DataSourceUtil',
   'js!WSControls/Lists/resources/utils/ItemsUtil',
   'Core/helpers/functional-helpers',
   'Core/Deferred'
], function (extend,
             cFunctions,
             BaseControl,
             RecordSet,
             isEmpty,
             strHelpers,
             Sanitize,
             Utils,
             TemplateUtil,
             ItemsTemplate,
             ItemTemplate,
             ItemContentTemplate,
             ListViewHelpers,
             DataSourceUtil,
             ItemsUtil,
             fHelpers,
             Deferred
   ) {

   'use strict';


   var ItemsControl = BaseControl.extend(
      {
         _controlName: 'WSControls/Lists/ItemsControl',
         iWantVDOM: true,
         _isActiveByClick: false,
         _hoveredItem: null,

         _items: null,

         _dataSource: null,
         _loader: null,

         //TODO пока спорные параметры
         _filter: undefined,
         _sorting: undefined,
         _limit: undefined,
         _offset: undefined,

         tplData: null,
         records: null,

         _itemData: null,
         _defaultItemContentTemplate: ItemContentTemplate,
         _defaultItemTemplate: ItemTemplate,
         _itemsTemplate: ItemsTemplate,
         _needSelector: false,
         _selector: null,

         constructor: function (cfg) {
            this._options = cfg || {};
            this._options.itemTpl = cfg.itemTpl || this._defaultItemTemplate;
            this._options.itemContentTpl = cfg.itemContentTpl || this._defaultItemContentTemplate;

            this._onCollectionChange = onCollectionChange.bind(this);
            this._onSelectorChange = onSelectorChange.bind(this);

            if (this._options.items) {
               this._items = this._options.items;
               this._itemsChangeCallback();
            }

            if (this._options.dataSource) {
               this._dataSource = DataSourceUtil.prepareSource(this._options.dataSource);
            }

            if (this._options.dataSource && this._options.dataSource.firstLoad !== false) {
               this.reload();
            }

            ItemsControl.superclass.constructor.apply(this, arguments);
         },

         _initItemBasedControllers: function() {
            if (this._getItems()) {
               if (this._getItemsProjection()) {
                  this._getItemsProjection().destroy();
               }
               this._itemsProjection = this._createDefaultProjection();
               this._itemsProjection.subscribe('onCollectionChange', this._onCollectionChange);

               if (this._selector) {
                  this._selector.destroy();
               }
               if (this._needSelector) {
                  this._selector = this._createDefaultSelector();
                  this._selector.subscribe('onSelectedItemChange', this._onSelectorChange)
               }


               //proj = cfg._applyGroupingToProjection(proj, cfg);

               /*if (cfg._canServerRender && cfg._canServerRenderOther(cfg)) {
                if (isEmpty(cfg.groupBy) || (cfg.easyGroup)) {
                newCfg._serverRender = true;
                newCfg._records = cfg._getRecordsForRedraw(cfg._itemsProjection, cfg);
                if (cfg._items && cInstance.instanceOfModule(cfg._items, 'WS.Data/Collection/RecordSet')) {
                newCfg._resultsRecord = cfg._items.getMetaData().results;
                }
                newCfg._itemData = cfg._buildTplArgs(cfg);
                }
                }*/
            }
         },

         _itemsChangeCallback: function() {
            this._initItemBasedControllers();
            this._records = ListViewHelpers.getRecordsForRedraw(this._itemsProjection, this._options);
            this.tplData = this._prepareItemData( this._options );
         },

         _prepareItemDataInner: function() {
            return ListViewHelpers.buildTplArgs(this._options)
         },

         _prepareItemData: function() {
            var tplArgs = {};
            if (!this._itemData) {
               tplArgs = this._prepareItemDataInner();
               this._itemData = cFunctions.clone(tplArgs);
            }
            return this._itemData;
         },

         _createDefaultProjection: function() {
            return ItemsUtil.getDefaultDisplayFlat(this._getItems(), this._options)
         },

         _createDefaultSelector: function() {
            /*Must be implemented*/
         },

         _getItems: function() {
            return this._items;
         },

         _getItemsProjection: function() {
            return this._itemsProjection;
         },

         /**
          * Метод получения проекции по ID итема
          */
         _getItemProjectionByItemId: function(id) {
            return this._getItemsProjection() ? this._getItemsProjection().getItemBySourceItem(this._getItems().getRecordById(id)) : null;
         },

         /**
          * Метод получения проекции по hash итема
          */
         _getItemProjectionByHash: function(hash) {
            return this._getItemsProjection().getByHash(hash);
         },

         eventsHandlers: function(event){
            this._eventProxyHandler(event.nativeEvent);
         },

         onClick: function (evt) {
            if (this._selector) {
               return this._selector.setSelectedByHash(this._getDataHashFromTarget(evt.nativeEvent.target));
            }
         },

         mouseEnter: function(ev){
            this.showToolbar = true;
         },

         mouseLeave: function(ev){
            var self = this;
            this.showToolbar = false;
            setTimeout(function() {
               if(!self.showToolbar) {
                  self._hoveredItem = null;
                  self._setDirty();
               }
            }, 0);

         },

         itemActionActivated: function(number, evt) {
            alert('clicked ' + this._hoveredItem + ' on button ' + number);
         },


         mouseMove: function(ev){
            var element = ev.nativeEvent.target;
            this._hoveredItem = this._getDataHashFromTarget(element);
            this.toolbarTop = ev.nativeEvent.target.offsetTop;
            this.toolbarLeft = this._container[0].offsetWidth - 100;
         },

         _getDataHashFromTarget: function (element) {
            while(element && typeof element.className === 'string' && element.className.indexOf('controls-ListView__item') == -1) {
               element = element.parentNode;
            }
            if(element) {
               return element.attributes['data-hash'].value;
            } else {
               return null;
            }
         },


         //<editor-fold desc='DataSourceMethods'>
         reload: function() {
            if (this._dataSource) {
               var
                  def,
                  self = this;

               this._cancelLoading();

               var filterForReload = this._getFilterForReload();
               if (this._dataSource) {
                  var result = this._notify('onBeforeDataLoad', filterForReload, this._sorting, this._offset, this._limit);
                  if (result) {
                     this._filter = result['filter'] || this._filter;
                     this._sorting = result['sorting'] || this._sorting;
                     this._offset = result['offset'] || this._offset;
                     this._limit = result['limit'] || this._limit;
                  }
                  //TODO решить с параметрами
                  def = DataSourceUtil.callQuery(this._dataSource, this._options.idProperty, this._filter, this._sorting, this._offset, this._limit)
                     .addCallback(fHelpers.forAliveOnly(function (list) {
                        self._notify('onDataLoad', list);
                        this._onDSReload(list);
                        return list;
                     }, self))
                     .addErrback(fHelpers.forAliveOnly(this._loadErrorProcess, self));
                  this._loader = def;
               } else {
                  if (this._options._itemsProjection) {
                     this._redraw();
                  }
                  def = new Deferred();
                  def.callback();
               }
            }
            else {
               console.error('Option dataSource is undefined. Can\'t reload view');
            }
         },

         _isLoading: function(){
            return this._loader && !this._loader.isReady();
         },

         _cancelLoading: function () {
            if (this._isLoading()) {
               this._loader.cancel();
            }
            this._loader = null;
         },

         _toggleIndicator: function () {
            /*Must be implemented*/
         },
         _getFilterForReload: function () {
            return this._filter;
         },
         _onDSReload: function(list) {
            this._itemData = null;
            if (
               this._getItems()
               && (list.getModel() === this._getItems().getModel())
               && (Object.getPrototypeOf(list).constructor == Object.getPrototypeOf(list).constructor)
               && (Object.getPrototypeOf(list.getAdapter()).constructor == Object.getPrototypeOf(this._getItems().getAdapter()).constructor)
               ) {
               this._getItems().setMetaData(list.getMetaData());
               this._getItems().assign(list);
               //this._drawItemsCallbackDebounce();
            } else {
               this._items = list;
               this._itemsChangeCallback();
               this._setDirty();
            }
            this._toggleIndicator(false);
            //self._checkIdProperty();

            //this._dataLoadedCallback();
            //self._notify('onBeforeRedraw');
            return list;
         },
         //</editor-fold>

         destroy: function() {
            ItemsControl.superclass.destroy.ally(this, arguments);
            if (this._getItemsProjection()) {
               this._getItemsProjection().destroy();
            }
            if (this._selector) {
               this._selector.destroy();
            }
            if (this._dataSourceController) {
               this._dataSourceController.destroy();
            }
         }
      });

   var onCollectionChange = function (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex, groupId) {
      this._itemsChangeCallback();
      this._setDirty();
   };

   var onSelectorChange = function() {
      this._itemData = null;
      this.tplData = this._prepareItemData();
      this._setDirty();
   };

   return ItemsControl;
});