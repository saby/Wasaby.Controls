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

         _tplData: null,
         _records: null,

         _itemData: null,
         _itemContentTpl: null,
         _defaultItemContentTemplate: ItemContentTemplate,
         _itemTpl: null,
         _defaultItemTemplate: ItemTemplate,
         _groupTemplate: null,
         _defaultGroupTemplate: null,

         _itemsTemplate: ItemsTemplate,

         _selector: null,

         constructor: function (cfg) {

            ItemsControl.superclass.constructor.apply(this, arguments);

            this._itemTpl = this._options.itemTpl || this._defaultItemTemplate;
            this._itemContentTpl = this._options.itemContentTpl || this._defaultItemContentTemplate;
            this._groupTemplate = this._options.groupTemplate || this._defaultGroupTemplate;

            this._onCollectionChange = onCollectionChange.bind(this);

            if (this._options.items) {
               this._items = this._options.items;
               this._itemsChangeCallback(true);
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
            if (this._items) {
               //TODO убрать дестрой, проверить утечки памяти
               if (this._itemsProjection) {
                  this._itemsProjection.destroy();
               }
               this._itemsProjection = this._createDefaultProjection();
               this._itemsProjection.subscribe('onCollectionChange', this._onCollectionChange);

               if (this._multiSelector) {
                  this._multiSelector.destroy();
               }

               if(this._needMultiSelector) {
                  this._multiSelector = this._createDefaultMultiSelector();
               }
            }
         },

         _itemsChangeCallback: function(initBaseControllers) {
            this._initItemBasedControllers();
            this._displayChangeCallback();
            this._notify('onItemsReady');
         },

         //при изменениях в проекции
         _displayChangeCallback: function() {
            this._records = this._getRecordsForView();
            this._updateTplData();
         },


         _getItemData: function () {
            var tplOptions = {},
               self = this,
               timers = {},
               logger;
            tplOptions.idProperty = this._options.idProperty;
            tplOptions.displayProperty = this._options.displayProperty;
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
            return tplOptions;
         },
         
         _updateTplData: function() {
            //TODO Возможно вычисление можно сделать прямо в шаблоне
            this._tplData = this._getItemData();
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
               projection = this._itemsProjection,
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
            return ItemsUtil.getDefaultDisplayFlat(this._items, this._options)
         },
   
         _createDefaultMultiSelector: function() {
            /*Must be implemented*/
         },

         /**
          * Метод получения проекции по ID итема
          */
         _getItemProjectionByItemId: function(id) {
            return this._itemsProjection ? this._itemsProjection.getItemBySourceItem(this._items.getRecordById(id)) : null;
         },

         /**
          * Метод получения проекции по hash итема
          */
         _getItemProjectionByHash: function(hash) {
            return this._itemsProjection.getByHash(hash);
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
               return this._getItemProjectionByHash(hash) ? hash : this._getDataHashFromTarget(itemContainer.parentElement);
            } else {
               return null;
            }
         },
   
         //<editor-fold desc='EventHandlers'>

         _onClick: function (evt) {
            var hash = this._getDataHashFromTarget(evt.nativeEvent.target);

            this._onClickInner(evt, hash);

            //FIXME Временно, надо будет делать только при клике на чекбокс
            if (this._multiSelector) {
               this._multiSelector.toggleSelectedKeys([ItemsUtil.getPropertyValue(this._getItemProjectionByHash(hash).getContents(), this._getOption('idProperty'))]);
            }
            
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
                  if (this._itemsProjection) {
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
               this._itemsChangeCallback(true);
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
            if (this._itemsProjection) {
               this._itemsProjection.destroy();
            }
            if (this._selector) {
               this._selector.destroy();
            }
            if (this._multiSelector) {
               this._multiSelector.destroy();
            }
            if (this._dataSourceController) {
               this._dataSourceController.destroy();
            }
         }
      });

   var onCollectionChange = function (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex, groupId) {
      this._displayChangeCallback();
      this._setDirty();
   };

   return ItemsControl;
});