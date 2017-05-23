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
   "js!WS.Data/Display/Display"
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
             Projection) {

   'use strict';

   var createDefaultProjection = function(items, cfg) {
         var proj, projCfg = {};
         projCfg.idProperty = cfg.idProperty || ((cfg.dataSource && typeof cfg.dataSource.getIdProperty === 'function') ? cfg.dataSource.getIdProperty() : '');
         if (cfg.itemsSortMethod) {
            projCfg.sort = cfg.itemsSortMethod;
         }
         if (cfg.itemsFilterMethod) {
            projCfg.filter = cfg.itemsFilterMethod;
         }
         if (cfg.loadItemsStrategy == 'merge') {
            projCfg.unique = true;
         }
         proj = Projection.getDefaultDisplay(items, projCfg);
         return proj;
      },

      findIdProperty  = function(json){
         var itemFirst = json[0];
         if (itemFirst) {
            return Object.keys(json[0])[0];
         }
      },
      getRecordsForRedraw = function(projection, cfg) {
         var
            records = [];
         if (projection) {     //У таблицы могут позвать перерисовку, когда данных еще нет
            var prevGroupId = undefined;
            projection.each(function (item, index, group) {
               if (!isEmpty(cfg.groupBy) && cfg.easyGroup) {
                  if (prevGroupId != group) {
                     cfg._groupItemProcessing(group, records, item,  cfg);
                     prevGroupId = group;
                  }
               }
               records.push(item);
            });
         }
         return records;
      },
      getPropertyValue = function(itemContents, field) {
         if (typeof itemContents == 'string') {
            return itemContents;
         }
         else {
            return Utils.getItemPropertyValue(itemContents, field);
         }
      },
      buildTplArgs = function(cfg) {
         var tplOptions = {}, itemTpl, itemContentTpl;

         tplOptions.escapeHtml = strHelpers.escapeHtml;
         tplOptions.Sanitize = Sanitize;
         tplOptions.idProperty = cfg.idProperty;
         tplOptions.displayField = cfg.displayProperty;
         tplOptions.displayProperty = cfg.displayProperty;
         tplOptions.templateBinding = cfg.templateBinding;
         tplOptions.getPropertyValue = getPropertyValue;

         if (cfg.itemContentTpl) {
            itemContentTpl = cfg.itemContentTpl;
         }
         else {
            itemContentTpl = this._defaultItemContentTemplate;
         }
         tplOptions.itemContent = TemplateUtil.prepareTemplate(itemContentTpl);
         if (cfg.itemTpl) {
            itemTpl = cfg.itemTpl;
         }
         else {
            itemTpl = this._defaultItemTemplate;
         }
         tplOptions.itemTpl = TemplateUtil.prepareTemplate(itemTpl);
         tplOptions.defaultItemTpl = TemplateUtil.prepareTemplate(cfg._defaultItemTemplate);

         if (cfg.includedTemplates) {
            var tpls = cfg.includedTemplates;
            tplOptions.included = {};
            for (var j in tpls) {
               if (tpls.hasOwnProperty(j)) {
                  tplOptions.included[j] = TemplateUtil.prepareTemplate(tpls[j]);
               }
            }
         }
         return tplOptions;
      },
      JSONToRecordset  = function(json, idProperty) {
         return new RecordSet({
            rawData : json,
            idProperty : idProperty
         })
      };

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

            cfg._createDefaultProjection = cfg._createDefaultProjection || createDefaultProjection;

            if (cfg.items) {
               var proj, items;
               if (cfg.items instanceof Array) {
                  if (!cfg.idProperty) {
                     var key = findIdProperty(cfg.items);
                     cfg.idProperty = key;
                     cfg.idProperty = key;
                  }
                  items = JSONToRecordset(cfg.items, cfg.idProperty);
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
               this._records = getRecordsForRedraw(proj, cfg);
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


            this._buildTplArgs = buildTplArgs;

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
                     var key = findIdProperty(cfg.items);
                     cfg.idProperty = key;
                     cfg.idProperty = key;
                  }
                  items = JSONToRecordset(cfg.items, cfg.idProperty);
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
               this._records = getRecordsForRedraw(proj, this._options);
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


            this._buildTplArgs = buildTplArgs;

            this.tplData = this._prepareItemData( this._options );

            this._setDirty();
         }


      });

   return ItemsControl;
});