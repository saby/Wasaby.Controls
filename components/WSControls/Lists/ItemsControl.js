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
            this._options = cfg || {};
            this.items = cfg.items || [];
            this.idProperty = cfg.idProperty;

            this._prepareData();

            this._buildTplArgs = ListViewHelpers.buildTplArgs;

            this.tplData = this._prepareItemData(cfg);

            this.deprecatedContr(cfg);
         },

         _prepareData: function() {
            if (this.items) {
               var calcItems = ListViewHelpers.calculateItems(this.items, this.idProperty);
               this._items = calcItems.items;
               this.idProperty = calcItems.idProperty;

               this._itemsProjection = ListViewHelpers.createDefaultProjection(this._items, this._options);

               //proj = cfg._applyGroupingToProjection(proj, cfg);

               this._records = ListViewHelpers.getRecordsForRedraw(this._itemsProjection, this._options);
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

         setItems: function(items){

            this.items = items;
            this._prepareData();
            this.tplData = this._prepareItemData( this._options );

            this._setDirty();
         }


      });

   return ItemsControl;
});