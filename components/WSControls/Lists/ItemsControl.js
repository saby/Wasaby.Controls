define('js!WSControls/Lists/ItemsControl', [
   'Core/core-extend',
   'Core/core-functions',
   'Core/Abstract.compatible',
   'js!SBIS3.CORE.Control/Control.compatible',
   'js!SBIS3.CORE.AreaAbstract/AreaAbstract.compatible',
   'js!SBIS3.CORE.BaseCompatible',
   'js!WS.Data/Entity/InstantiableMixin',
   'tmpl!WSControls/Lists/ItemsControl',
   'js!WS.Data/Collection/RecordSet',
   "Core/helpers/Object/isEmpty",
   'Core/helpers/string-helpers',
   "Core/Sanitize",
   "js!WS.Data/Utils",
   "js!SBIS3.CONTROLS.Utils.TemplateUtil",
   "tmpl!WSControls/Lists/resources/ItemsTemplate",
   "tmpl!WSControls/Lists/resources/ItemTemplate",
   'tmpl!SBIS3.CONTROLS.ListView/resources/ItemContentTemplate',
   "js!WS.Data/Display/Display",
   'js!SBIS3.CONTROLS.ListView/ListViewHelpers',
   'js!WSControls/Controllers/DataSourceController'
], function (extend,
             cFunctions,
             AbstractCompatible,
             ControlCompatible,
             AreaAbstractCompatible,
             BaseCompatible,
             InstantiableMixin,
             template,
             RecordSet,
             isEmpty,
             strHelpers,
             Sanitize,
             Utils,
             TemplateUtil,
             ItemsTemplate,
             ItemTemplate,
             ItemContentTemplate,
             Projection,
             ListViewHelpers,
             DataSourceController) {

   'use strict';

   var ItemsControl = extend.extend([AbstractCompatible, ControlCompatible, AreaAbstractCompatible, BaseCompatible, InstantiableMixin],
      {
         _controlName: 'WSControls/Lists/ItemsControl',
         _template: template,
         iWantVDOM: true,
         _isActiveByClick: false,
         _hoveredItem: null,

         items: null,
         itemTemplate: null,
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
            this.idProperty = cfg.idProperty;
            this.displayProperty = cfg.displayProperty;
            this.itemTpl = cfg.itemTpl || this._defaultItemTemplate;
            this.itemContentTpl = cfg.itemContentTpl || this._defaultItemContentTemplate;

            this._onCollectionChange = onCollectionChange.bind(this);
            this._onSelectorChange = onSelectorChange.bind(this);
            this._onDSBeforeReload = onDSBeforeReload.bind(this);
            this._onDSAfterReload = onDSAfterReload.bind(this);


            if (this._options.items) {
               this._prepareItems(this._options.items);
            }

            this._initControllers();

            this._itemsChangeCallback();

            if (this._options.dataSource && this._options.dataSource.firstLoad !== false) {
               this._dataSourceController.reload();
            }

            this.deprecatedContr(cfg);
         },

         _prepareItems : function(items) {
            var calcItems = ListViewHelpers.calculateItems(items, this.idProperty);
            this._items = calcItems.items;
            this.idProperty = calcItems.idProperty;
         },

         _initControllers: function() {
            if (this._dataSourceController) {
               this._dataSourceController.destroy();
            }
            if (this._options.dataSource) {
               this._dataSourceController = new DataSourceController({
                  dataSource : this._options.dataSource,
                  idProperty: this.idProperty
               });
               this._dataSourceController.subscribe('onBeforeReload', this._onDSBeforeReload);
               this._dataSourceController.subscribe('onAfterReload', this._onDSAfterReload);
            }
         },

         _initItemBasedControllers: function() {
            if (this._items) {
               if (this._itemsProjection) {
                  this._itemsProjection.destroy();
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
            return ListViewHelpers.buildTplArgs(this)
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
            return ListViewHelpers.createDefaultProjection(this._items, this._options);
         },


         _createDefaultSelector: function() {
            /*Must be implemented*/
         },

         setItems: function(items){
            this._prepareItems(items);

            this._itemsChangeCallback();
            this._setDirty();
         },



         getItems : function() {
            return this._items;
         },
         _getItemsProjection: function() {
            return this._itemsProjection;
         },
         setSelectedKey: function(key){
            if (this._selector) {
               this._selector.setSelectedKey(key)
            }

         },

         getSelectedKey: function() {
            if (this._selector) {
               return this._selector.getSelectedKey()
            }
         },
         /**
          * Метод получения проекции по ID итема
          */
         _getItemProjectionByItemId: function(id) {
            return this._getItemsProjection() ? this._getItemsProjection().getItemBySourceItem(this.getItems().getRecordById(id)) : null;
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
            alert("clicked " + this._hoveredItem + " on button " + number);
         },


         mouseMove: function(ev){
            var element = ev.nativeEvent.target;
            this._hoveredItem = this._getDataHashFromTarget(element);
            this.toolbarTop = ev.nativeEvent.target.offsetTop;
            this.toolbarLeft = this._container[0].offsetWidth - 100;
         },

         _getDataHashFromTarget: function (element) {
            while(element && typeof element.className === "string" && element.className.indexOf('controls-ListView__item') == -1) {
               element = element.parentNode;
            }
            if(element) {
               return element.attributes['data-hash'].value;
            } else {
               return null;
            }
         },


         //<editor-fold desc="DataSourceMethods">
         reload: function() {
            if (this._dataSourceController) {
               return this._dataSourceController.reload();
            }
            else {
               console.error('Option dataSource is undefined. Can\'t reload view');
            }
         },
         isLoading: function() {
            if (this._dataSourceController) {
               return this._dataSourceController.isLoading();
            }
         },
         getFilter: function() {
            if (this._dataSourceController) {
               this._dataSourceController.getFilter();
            }
         },
         setFilter: function(filter, noLoad) {
            if (this._dataSourceController) {
               this._dataSourceController.setFilter(filter, noLoad);
            }
         },
         setSorting: function (sorting, noLoad) {
            if (this._dataSourceController) {
               this._dataSourceController.setSorting(sorting, noLoad);
            }
         },
         getSorting: function() {
            if (this._dataSourceController) {
               this._dataSourceController.getSorting();
            }
         },
         _toggleIndicator: function () {
            /*Must be implemented*/
         },
         _getFilterForReload: function () {
            return this._dataSourceController.getFilter();
         },
         //</editor-fold>

         destroy: function() {
            ItemsControl.superclass.destroy.ally(this, arguments);
            if (this._itemsProjection) {
               this._itemsProjection.destroy();
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

   var onDSBeforeReload = function(e) {
      this._toggleIndicator(true);
      this._notify('onBeforeDataLoad', this._getFilterForReload.apply(this, arguments), this.getSorting(), this._offset, this._limit);
      e.setResult({
         filter : this._getFilterForReload()
      });
   };

   var onDSAfterReload = function() {
      debugger;
   };

   return ItemsControl;
});