/**
 * Created by kraynovdo on 22.09.2017.
 */
define('Controls/List/ListView', [
   'Core/Control',
   'Core/helpers/Function/debounce',
   'wml!Controls/List/ListView/ListView',
   'wml!Controls/List/ItemTemplate',
   'wml!Controls/List/GroupTemplate',
   'wml!Controls/List/resources/ItemOutputWrapper',
   'wml!Controls/List/resources/ItemOutput',
   'css!theme?Controls/List/ListView/ListView'
], function(BaseControl,
   cDebounce,
   ListViewTpl,
   defaultItemTemplate,
   GroupTemplate,
   ItemOutputWrapper
) {
   'use strict';

   var
      DEBOUNCE_HOVERED_ITEM_CHANGED = 150;

   var _private = {
      onListChange: function(self) {
         self._listChanged = true;
         self._forceUpdate();
      },

      resizeNotifyOnListChanged: function(self) {
         if (self._listChanged) {
            self._listChanged = false;

            //command to scroll watcher
            self._notify('controlResize', [], {bubbling: true});
         }
      },

      setHoveredItem: cDebounce(function(self, item, nativeEvent) {
         if (item !== self._hoveredItem) {
            self._hoveredItem = item;
            var container = nativeEvent ? nativeEvent.target.closest('.controls-ListView__itemV') : null;
            self._notify('hoveredItemChanged', [item, container]);
         }
      }, DEBOUNCE_HOVERED_ITEM_CHANGED)
   };

   var ListView = BaseControl.extend(
      {
         _listModel: null,
         _lockForUpdate: false,
         _queue: null,
         _hoveredItem: null,
         _template: ListViewTpl,
         _groupTemplate: GroupTemplate,
         _defaultItemTemplate: defaultItemTemplate,
         _listChanged: false,
         _itemOutputWrapper: ItemOutputWrapper,

         constructor: function() {
            ListView.superclass.constructor.apply(this, arguments);
            var self = this;
            this._queue = [];
            this._onListChangeFnc = function() {
               if (self._lockForUpdate) {
                  self._queue.push(_private.onListChange.bind(null, self));
               } else {
                  _private.onListChange(self);
               }
            };
         },

         _beforeMount: function(newOptions) {
            if (newOptions.groupTemplate) {
               this._groupTemplate = newOptions.groupTemplate;
            }
            if (newOptions.listModel) {
               this._listModel = newOptions.listModel;
               this._listModel.subscribe('onListChange', this._onListChangeFnc);
               this._listModel.subscribe('onMarkedKeyChanged', this._onMarkedKeyChangedHandler.bind(this));
            }
            this._itemTemplate = newOptions.itemTemplate || this._defaultItemTemplate;
         },

         _beforeUpdate: function(newOptions) {
            if (newOptions.listModel && (this._listModel != newOptions.listModel)) {
               this._listModel = newOptions.listModel;
               this._listModel.subscribe('onListChange', this._onListChangeFnc);
            }
            this._itemTemplate = newOptions.itemTemplate || this._defaultItemTemplate;
            this._lockForUpdate = true;
         },

         _afterMount: function() {
            _private.resizeNotifyOnListChanged(this);
         },

         _afterUpdate: function() {
            this._lockForUpdate = false;
            _private.resizeNotifyOnListChanged(this);
            if (this._queue.length > 0) {
               for (var i = 0; i < this._queue.length; i++) {
                  this._queue[i]();
               }
               this._queue = [];
            }
         },

         getItemsContainer: function() {
            return this._children.itemsContainer;
         },

         _onItemClick: function(e, dispItem) {
            var item = dispItem.getContents();
            this._notify('itemClick', [item, e], {bubbling: true});
         },

         _onGroupClick: function(e, dispItem) {
            var
               item = dispItem.getContents();
            this._notify('groupClick', [item, e], {bubbling: true});
         },

         _onItemContextMenu: function(event, itemData) {
            if (this._options.contextMenuEnabled) {
               this._notify('itemContextMenu', [itemData, event, true]);
            }
         },

         _onItemSwipe: function(event, itemData) {
            if (event.nativeEvent.direction === 'left' || event.nativeEvent.direction === 'right') {
               event.currentTarget.focus();
            }
            this._notify('itemSwipe', [itemData, event]);
         },

         _onRowDeactivated: function(event, eventOptions) {
            this._notify('rowDeactivated', [eventOptions]);
         },

         _onItemMouseDown: function(event, itemData) {
            this._notify('itemMouseDown', [itemData, event]);
         },

         _onItemMouseEnter: function(event, itemData) {
            this._notify('itemMouseEnter', [itemData, event]);
            _private.setHoveredItem(this, itemData.item, event);
         },

         //TODO: из-за того что ItemOutput.wml один для всех таблиц, приходится подписываться в нем на события,
         //которые не нужны для ListView. Выписана задача https://online.sbis.ru/opendoc.html?guid=9fd4922f-eb37-46d5-8c39-dfe094605164
         _onItemMouseLeave: function() {
            _private.setHoveredItem(this, null);
         },

         _onItemMouseMove: function(event, itemData) {
            this._notify('itemMouseMove', [itemData, event]);
         },

         _onItemWheel: function() {},

         _onMarkedKeyChangedHandler: function(event, key) {
            this._notify('markedKeyChanged', [key]);
         }
      });

   ListView._private = _private;

   ListView.getDefaultOptions = function() {
      return {
         contextMenuEnabled: true
      };
   };

   return ListView;
});
