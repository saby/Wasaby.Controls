/**
 * Created by kraynovdo on 22.09.2017.
 */
define('Controls/List/ListView', [
   'Core/Control',
   'tmpl!Controls/List/ListView/ListView',
   'tmpl!Controls/List/ItemTemplate',
   'tmpl!Controls/List/GroupTemplate',
   'css!Controls/List/ListView/ListView'
], function(BaseControl,
   ListViewTpl,
   defaultItemTemplate,
   GroupTemplate
) {
   'use strict';

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

            //не использовать удалить по задаче https://online.sbis.ru/opendoc.html?guid=f968dcef-6d9f-431c-9653-5aea20aeaff2
            self._notify('checkScroll', [], {bubbling: true});
         }
      }
   };

   var ListView = BaseControl.extend(
      {
         _listModel: null,
         _lockForUpdate: false,
         _queue: null,
         _template: ListViewTpl,
         _groupTemplate: GroupTemplate,
         _defaultItemTemplate: defaultItemTemplate,
         _listChanged: false,

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
            if (newOptions.itemsGroup && newOptions.itemsGroup.template) {
               this._groupTemplate = newOptions.itemsGroup.template;
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
            this._notify('itemContextMenu', [itemData, event, true]);
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
         },

         _onMarkedKeyChangedHandler: function(event, key) {
            this._notify('markedKeyChanged', [key]);
         }
      });

   ListView._private = _private;
   return ListView;
});
