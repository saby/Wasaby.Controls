define('js!WSControls/Lists/ItemsControl', [
   'Core/core-extend',
   'js!WSControls/Control/Base',
   'Core/helpers/Object/isEmpty',
   'Core/Sanitize',
   'js!SBIS3.CONTROLS.Utils.TemplateUtil',
   'tmpl!WSControls/Lists/resources/ItemsTemplate',
   'tmpl!WSControls/Lists/resources/ItemTemplate',
   'tmpl!WSControls/Lists/resources/ItemContentTemplate',
   'js!WSControls/Lists/resources/utils/DataSourceUtil',
   'js!WSControls/Lists/resources/utils/ItemsUtil',
   'Core/helpers/functional-helpers',
   'Core/Deferred',
   'Core/core-instance',
   'js!WSControls/DOMHelpers/DOMHelpers'
], function (extend,
             BaseControl,
             isEmpty,
             Sanitize,
             TemplateUtil,
             ItemsTemplate,
             ItemTemplate,
             ItemContentTemplate,
             DataSourceUtil,
             ItemsUtil,
             fHelpers,
             Deferred,
             cInstance,
             DOMHelpers
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

         _records: null,

         _itemData: null,
         _defaultItemContentTemplate: ItemContentTemplate,
         _defaultItemTemplate: ItemTemplate,
         _groupTemplate: null,
         _defaultGroupTemplate: null,

         _itemsTemplate: ItemsTemplate,

         _selector: null,

         constructor: function (cfg) {
            ItemsControl.superclass.constructor.apply(this, arguments);
            this._onCollectionChangeFnc = this._onCollectionChange.bind(this);
            this._prepareMountingData(cfg);
            this._publish('onItemsReady', 'onDataLoad');
         },

         _prepareMountingData: function(newOptions) {
            //this._itemContentTpl = cfg.itemContentTpl || this._defaultItemContentTemplate;
            this._groupTemplate = newOptions.groupTemplate || this._defaultGroupTemplate;

            if (newOptions.items && (this._items != newOptions.items)) {
               this._items = newOptions.items;
               this._itemsChangeCallback(this._items, newOptions);
            }

            if (newOptions.dataSource) {
               this._dataSource = DataSourceUtil.prepareSource(newOptions.dataSource);
            }
         },

         _beforeMount: function(newOptions) {
            if (this._dataSource && cfg.dataSource.firstLoad !== false) {
               this.reload();
            }
         },

         _beforeUpdate: function(newOptions) {
            this._prepareMountingData(newOptions);
            //TODO обработать смену фильтров и т.д. позвать релоад если надо
         },

         _initItemBasedControllers: function(items, cfg) {
            if (this._items) {
               //TODO убрать дестрой, проверить утечки памяти
               if (this._display) {
                  this._display.destroy();
               }
               this._display = this._createDefaultDisplay(items, cfg);
               this._display.subscribe('onCollectionChange', this._onCollectionChangeFnc);

               if (this._multiSelector) {
                  this._multiSelector.destroy();
               }

               if(this._needMultiSelector) {
                  this._multiSelector = this._createDefaultMultiSelector();
               }
            }
         },

         _onCollectionChange: function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex, groupId) {
            this._displayChangeCallback();
            this._setDirty();
         },

         _itemsChangeCallback: function(items, cfg) {
            this._initItemBasedControllers(items, cfg);
            this._displayChangeCallback(this._display, cfg);
            this._notify('onItemsReady');
         },

         //при изменениях в проекции
         _displayChangeCallback: function(display, cfg) {
            this._records = this._getRecordsForView(display, cfg);
         },

         _getItemTpl: function() {
            return TemplateUtil.prepareTemplate(this._options.itemTpl || this._defaultItemTemplate, true);
         },

         _getItemContentTpl: function() {
            return TemplateUtil.prepareTemplate(this._options.itemContentTpl || this._defaultItemContentTemplate, true);
         },

         _getPropertyValue: function(itemContents, field) {
            return ItemsUtil.getPropertyValue(itemContents, field);
         },

         _getItemData: function(projItem, index) {
            return {};
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

         _getRecordsForViewFlat: function(display, cfg) {
            var
               ctrl = this,
               records = [];
            if (display) {     //У таблицы могут позвать перерисовку, когда данных еще нет
               var prevGroupId = undefined;
               display.each(function (item, index, group) {
                  if (!isEmpty(cfg.groupBy)) {
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



         _getRecordsForView: function(display, cfg) {
            return this._getRecordsForViewFlat.apply(this, arguments)
         },

         _createDefaultDisplay: function(items, cfg) {
            return ItemsUtil.getDefaultDisplayFlat(items, cfg)
         },
   
         _createDefaultMultiSelector: function() {
            /*Must be implemented*/
         },


         /**
          * Метод получения проекции по hash итема
          */
         _getDisplayItemByHash: function(hash) {
            return this._display.getByHash(hash);
         },
   
         /**
          * Метод получение hash итема по DOM элементу
          * @param element
          * @returns {*}
          * @private
          */
         _getDataHashFromTarget: function (element) {
            var itemContainer = DOMHelpers.closest(element, '.controls-ListView__item', this._container[0]),
                hash;
            
            /* У item'a могут быть вложенные ItemsControl'ы, учитываем это */
            if(itemContainer) {
               hash = itemContainer.getAttribute('data-hash');
               return this._getDisplayItemByHash(hash) ? hash : this._getDataHashFromTarget(itemContainer.parentElement);
            } else {
               return null;
            }
         },
   
         //<editor-fold desc='EventHandlers'>

         _onItemClick: function (evt) {
            //Method must be implemented
         },

         itemActionActivated: function(number, evt) {
            alert('clicked ' + this._hoveredItem + ' on button ' + number);
         },
         
   
         //</editor-fold>

         _prepareQueryFilter: function() {
            return this._filter;
         },

         //<editor-fold desc='DataSourceMethods'>
         reload: function() {
            if (this._dataSource) {
               var
                  def,
                  self = this;

               this._cancelLoading();

               var queryFilter = this._prepareQueryFilter();
               if (this._dataSource) {
                  var result = this._notify('onBeforeDataLoad', queryFilter, this._sorting, this._offset, this._limit);
                  if (result) {
                     this._filter = result['filter'] || this._filter;
                     this._sorting = result['sorting'] || this._sorting;
                     this._offset = result['offset'] || this._offset;
                     this._limit = result['limit'] || this._limit;
                  }
                  //TODO решить с параметрами
                  def = DataSourceUtil.callQuery(this._dataSource, this._options.idProperty, this._prepareQueryFilter(), this._sorting, this._offset, this._limit)
                     .addCallback(fHelpers.forAliveOnly(function (list) {
                        self._notify('onDataLoad', list);
                        this._onDSReload(list);
                        return list;
                     }, self))
                     .addErrback(fHelpers.forAliveOnly(this._loadErrorProcess, self));
                  this._loader = def;
               } else {
                  if (this._display) {
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
         _onDSReload: function(list) {
            this._itemData = null;
            if (
               this._items && cInstance.instanceOfModule(this._items, 'WS.Data/Collection/RecordSet')
               && (list.getModel() === this._items.getModel())
               && (Object.getPrototypeOf(list).constructor == Object.getPrototypeOf(list).constructor)
               && (Object.getPrototypeOf(list.getAdapter()).constructor == Object.getPrototypeOf(this._items.getAdapter()).constructor)
               ) {
               this._items.setMetaData(list.getMetaData());
               this._items.assign(list);
               //this._drawItemsCallbackDebounce();
            } else {
               this._items = list;
               this._itemsChangeCallback(this._items, this._options);
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
            ItemsControl.superclass.destroy.apply(this, arguments);
            if (this._display) {
               this._display.destroy();
            }
            if (this._multiSelector) {
               this._multiSelector.destroy();
            }
         }
      });
   return ItemsControl;
});