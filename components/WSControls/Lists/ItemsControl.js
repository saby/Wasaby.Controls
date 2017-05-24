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
   "tmpl!SBIS3.CONTROLS.ItemsControlMixin/resources/ItemsTemplate",
   'tmpl!SBIS3.CONTROLS.ListView/resources/ItemTemplate',
   'tmpl!SBIS3.CONTROLS.ListView/resources/ItemContentTemplate',
   "js!WS.Data/Display/Display",
   'js!SBIS3.CONTROLS.ListView/ListViewHelpers'
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
             ListViewHelpers) {

   'use strict';

   var ItemsControl = extend.extend([AbstractCompatible, ControlCompatible, AreaAbstractCompatible, BaseCompatible, InstantiableMixin],
      {
         _controlName: 'WSControls/Lists/ItemsControl',
         _template: template,
         iWantVDOM: true,
         _isActiveByClick: false,

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
            this.items = cfg.items || [];
            this.idProperty = cfg.idProperty;
            this.displayProperty = cfg.displayProperty;

            this._onCollectionChange = onCollectionChange.bind(this);

            this._prepareData();



            this.deprecatedContr(cfg);
         },

         _prepareDataOnItemsChange: function() {
            this._records = ListViewHelpers.getRecordsForRedraw(this._itemsProjection, this._options);
            this.tplData = this._prepareItemData( this._options );
         },

         _prepareData: function() {
            if (this.items) {
               var calcItems = ListViewHelpers.calculateItems(this.items, this.idProperty);
               this._items = calcItems.items;
               this.idProperty = calcItems.idProperty;



               if (this._itemsProjection) {
                  this._unsetItemsEventHandlers();
                  this._itemsProjection.destroy();
               }
               this._itemsProjection = this._createDefaultProjection();
               this._setItemsEventHandlers();

               if (this._needSelector) {
                  this._selectorInstance = this._createDefaultSelector();
               }

               //proj = cfg._applyGroupingToProjection(proj, cfg);

               this._prepareDataOnItemsChange();

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

         _setItemsEventHandlers: function() {
            this._itemsProjection.subscribe('onCollectionChange', this._onCollectionChange);
         },

         _unsetItemsEventHandlers: function () {

         },

         _createDefaultSelector: function() {

         },

         setItems: function(items){

            this.items = items;
            this._prepareData();
            this._setDirty();
         },



         getItems : function() {
            return this._options._items;
         },
         _getItemsProjection: function() {
            return this._options._itemsProjection;
         },
         setSelectedKey: function(key){
            if (this._selector) {
               return this._selector.setSelectedKey(key)
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

         mouseEnter: function(ev){
            this.showToolbar = true;
         },

         mouseLeave: function(ev){
            this.showToolbar = false;
         },

         mouseMove: function(ev){
            this.toolbarTop = ev.nativeEvent.target.offsetTop;
            this.toolbarLeft = this._container[0].offsetWidth - 100;
         }
      });

   var onCollectionChange = function (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex, groupId) {
      this._prepareDataOnItemsChange();
      this._setDirty();
   };

   return ItemsControl;
});