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
   'js!WSControls/Lists/resources/utils/DataSourceUtil',
   'js!WSControls/Lists/resources/utils/ItemsUtil',
   'Core/helpers/functional-helpers',
   'Core/Deferred',
   'Core/core-instance'
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
             DataSourceUtil,
             ItemsUtil,
             fHelpers,
             Deferred,
             cInstance
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
         _itemContentTpl: null,
         _defaultItemContentTemplate: ItemContentTemplate,
         _itemTpl: null,
         _defaultItemTemplate: ItemTemplate,
         _groupTemplate: null,
         _defaultGroupTemplate: null,

         _itemsTemplate: ItemsTemplate,


         _needSelector: false,
         _selector: null,

         constructor: function (cfg) {

            ItemsControl.superclass.constructor.apply(this, arguments);

            this._itemTpl = cfg.itemTpl || this._defaultItemTemplate;
            this._itemContentTpl = cfg.itemContentTpl || this._defaultItemContentTemplate;
            this._groupTemplate = cfg.groupTemplate || this._defaultGroupTemplate;

            this._onCollectionChange = onCollectionChange.bind(this);
            this._onSelectorChange = onSelectorChange.bind(this);

            if (this._options.items) {
               this._items = this._options.items;
               this._itemsChangeCallback();
            }

            if (this._options.dataSource) {
               this._dataSource = DataSourceUtil.prepareSource(this._options.dataSource);
            }

            this._publish('onItemsReady', 'onDataLoad');

            if (this._options.dataSource && this._options.dataSource.firstLoad !== false) {
               this.reload();
            }
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
            }
         },

         _itemsChangeCallback: function() {
            this._initItemBasedControllers();
            this._records = this._getRecordsForView();
            this._notify('onItemsReady');
            this.tplData = this._getItemData();
         },


         _getItemData: function () {
            var tplOptions = {},
               self = this,
               timers = {},
               logger;
            tplOptions.escapeHtml = strHelpers.escapeHtml;//todo ?
            tplOptions.Sanitize = Sanitize;//todo ?
            tplOptions.idProperty = this._options.idProperty;
            tplOptions.displayProperty = this._options.displayProperty;
            tplOptions.templateBinding = this._options.templateBinding;
            tplOptions.getPropertyValue = ItemsUtil.getPropertyValue;

            /* Для логирования */
            if (typeof window === 'undefined') {
               logger = IoC.resolve('ILogger');
               tplOptions.timeLogger = function timeLogger(tag, start) {
                  if (start) {
                     timers[tag] = new Date();
                  } else {
                     logger.log(self._moduleName || cfg.name, tag + ' ' + ((new Date()) - timers[tag]));
                     delete timers[tag];
                  }
               };
            }
            tplOptions.itemContent = TemplateUtil.prepareTemplate(this._itemContentTpl);
            tplOptions.itemTpl = TemplateUtil.prepareTemplate(this._itemTpl);
            tplOptions.defaultItemTpl = TemplateUtil.prepareTemplate(this._defaultItemTemplate);
            if (this._options.includedTemplates) {
               var tpls = this._options.includedTemplates;
               tplOptions.included = {};
               for (var j in tpls) {
                  if (tpls.hasOwnProperty(j)) {
                     tplOptions.included[j] = TemplateUtil.prepareTemplate(tpls[j]);
                  }
               }
            }
            return tplOptions;
         },


         _getGroupData: function() {
            var
               groupBy = this._options.groupBy,
               groupData;
            groupData = {
               multiselect : this._options.multiselect,
               groupContentTemplate: TemplateUtil.prepareTemplate(groupBy.contentTemplate || '', true)
            };
            return groupData;
         },

         _getGroupItem : function(groupId, item) {
            var groupData, groupTemplate;
            if (this._groupTemplate) {
               groupData = this._getGroupData();
               groupData.item = item;
               groupData.groupId = groupId;
               groupTemplate = TemplateUtil.prepareTemplate(this._groupTemplate, true)
            }
            return {
               data : groupData,
               tpl : groupTemplate
            }
         },

         _getRecordsForViewFlat: function() {
            var
               projection = this._getItemsProjection(),
               ctrl = this,
               records = [];
            if (projection) {     //У таблицы могут позвать перерисовку, когда данных еще нет
               var prevGroupId = undefined;
               projection.each(function (item, index, group) {
                  if (!isEmpty(ctrl._options.groupBy)) {
                     if (prevGroupId != group && group !== false) {
                        records.push(ctrl._getGroupItem(group, item));
                        prevGroupId = group;
                     }
                  }
                  records.push(item);
               });
            }
            return records;
         },



         _getRecordsForView: function(projection, cfg) {
            return this._getRecordsForViewFlat.apply(this, arguments)
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
               this._getItems() && cInstance.instanceOfModule(this._getItems(), 'WS.Data/Collection/RecordSet')
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
      this.tplData = this._getItemData();
      this._setDirty();
   };

   return ItemsControl;
});