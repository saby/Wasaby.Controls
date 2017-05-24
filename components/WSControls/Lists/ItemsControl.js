define('js!WSControls/Lists/ItemsControl', [
   'Core/core-extend',
   'Core/Abstract.compatible',
   'js!SBIS3.CORE.Control/Control.compatible',
   'js!SBIS3.CORE.AreaAbstract/AreaAbstract.compatible',
   'js!SBIS3.CORE.BaseCompatible',
   'js!WS.Data/Entity/InstantiableMixin',
   'tmpl!WSControls/Lists/ItemsControl',
   'tmpl!WSControls/Lists/one',
   'js!WS.Data/Collection/RecordSet',
   'js!SBIS3.CONTROLS.ListView/ListView.compatible',
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
             AbstractCompatible,
             ControlCompatible,
             AreaAbstractCompatible,
             BaseCompatible,
             InstantiableMixin,
             template,
             one,
             RecordSet,
             ListViewcompatible,
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

   var ItemsControl = extend.extend([AbstractCompatible, ControlCompatible, AreaAbstractCompatible, BaseCompatible, InstantiableMixin, ListViewcompatible],
      {
         _controlName: 'WSControls/Lists/ItemsControl',
         _template: template,
         iWantVDOM: true,
         _isActiveByClick: false,

         items: null,
         itemTemplate: null,
         _buildTplArgs: null,
         tplData: null,
         records: null,
         _createDefaultProjection : null,
         _defaultItemContentTemplate: ItemContentTemplate,
         _defaultItemTemplate: ItemTemplate,
         _itemsTemplate: ItemsTemplate,

         constructor: function (cfg) {

            this._options = {};

            this.items = cfg.items || [];
            this.itemTemplate = cfg.itemsTemplate;

            if (typeof this.itemTemplate !== "function" ) {
               if (cfg.itemContentTpl) {
                  this.itemTemplate = cfg.itemContentTpl;
               }
            }

            cfg._createDefaultProjection = cfg._createDefaultProjection || ListViewHelpers.createDefaultProjection;

            if (cfg.items) {
               var proj, items;
               if (cfg.items instanceof Array) {
                  if (!cfg.idProperty) {
                     var key = ListViewHelpers.findIdProperty(cfg.items);
                     cfg.idProperty = key;
                     cfg.idProperty = key;
                  }
                  items = ListViewHelpers.JSONToRecordset(cfg.items, cfg.idProperty);
                  cfg._items = items;
                  cfg._items = items;
               }
               else {
                  cfg._items = cfg.items;
                  cfg._items = cfg.items;
               }
               proj = cfg._createDefaultProjection(cfg._items, cfg);
               //proj = cfg._applyGroupingToProjection(proj, cfg);
               cfg._itemsProjection = proj;
               this._records = ListViewHelpers.getRecordsForRedraw(proj, cfg);
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


            this._buildTplArgs = ListViewHelpers.buildTplArgs;

            this.tplData = this._prepareItemData(cfg);

            this.deprecatedContr(cfg);
         },

         setItems: function(items){

            var cfg = {};
            cfg.items = items;
            cfg.idProperty = this._options.idProperty;

            if (cfg.items) {
               var proj, items;
               if (cfg.items instanceof Array) {
                  if (!cfg.idProperty) {
                     var key = ListViewHelpers.findIdProperty(cfg.items);
                     cfg.idProperty = key;
                     cfg.idProperty = key;
                  }
                  items = ListViewHelpers.JSONToRecordset(cfg.items, cfg.idProperty);
                  cfg._items = items;
                  cfg._items = items;
               }
               else {
                  cfg._items = cfg.items;
                  cfg._items = cfg.items;
               }
               proj = this._options._createDefaultProjection(cfg._items,  this._options);
               //proj = cfg._applyGroupingToProjection(proj, cfg);
               this._options._itemsProjection = proj;
               this._records = ListViewHelpers.getRecordsForRedraw(proj, this._options);
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


            this._buildTplArgs = ListViewHelpers.buildTplArgs;

            this.tplData = this._prepareItemData( this._options );

            this._setDirty();
         },



         getItems : function() {
            return this._options._items;
         },
         _getItemsProjection: function() {
            return this._options._itemsProjection;
         },
         setSelectedKey: function(){

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
         }

      });

   return ItemsControl;
});