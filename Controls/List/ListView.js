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
            
            //command to scroll layout
            self._notify('resize', [], {bubbling: true});
            self._notify('checkScroll', [], {bubbling: true});
         }
      }
   };

   var ListView = BaseControl.extend(
      {
         _listModel: null,
         _template: ListViewTpl,
         _groupTemplate: GroupTemplate,
         _defaultItemTemplate: defaultItemTemplate,
         _listChanged: false,

         constructor: function(cfg) {
            ListView.superclass.constructor.apply(this, arguments);
            var self = this;
            this._onListChangeFnc = function() {
               _private.onListChange(self);
            };
         },

         _beforeMount: function(newOptions) {
            if (newOptions.itemsGroup && newOptions.itemsGroup.template) {
               this._groupTemplate = newOptions.itemsGroup.template;
            }
            if (newOptions.listModel) {
               this._listModel = newOptions.listModel;
               this._listModel.subscribe('onListChange', this._onListChangeFnc);
            }
            this._itemTemplate = newOptions.itemTemplate || this._defaultItemTemplate;
         },

         _beforeUpdate: function(newOptions) {
            if (newOptions.listModel && (this._listModel != newOptions.listModel)) {
               this._listModel = newOptions.listModel;
               this._listModel.subscribe('onListChange', this._onListChangeFnc);
            }
            this._itemTemplate = newOptions.itemTemplate || this._defaultItemTemplate;
         },

         _afterMount: function() {
            _private.resizeNotifyOnListChanged(this);
         },

         _afterUpdate: function() {
            _private.resizeNotifyOnListChanged(this);
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
         }

      });

   ListView._private = _private;
   return ListView;
});
