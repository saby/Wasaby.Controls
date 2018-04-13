define('Controls/Filter/Panel', [
   'Core/Control',
   'WS.Data/Chain',
   'WS.Data/Utils',
   'Core/helpers/Object/isEqual',
   'Core/helpers/Array/clone',
   'tmpl!Controls/Filter/Panel/Panel',
   'css!Controls/Filter/Panel/Panel'

], function(Control, Chain, Utils, isEqual, clone, template) {

   'use strict';


   var FilterPanel = Control.extend({
      _template: template,
      _isEnabled: true,

      _beforeMount: function(options) {
         this._items = clone(options.items);
      },

      //?
      _beforeUpdate: function() {
         if (isEqual(this._items, this._options.items)) {
            this._isEnabled = true;
         }
      },

      applyFilter: function() {
         this._notify('filterChanged', [this.getFilter()]);
         this._notify('close', [], {bubbling: true});
      },

      getFilter: function() {
         var filter = {};
         Chain(this._items).each(function(item) {
            filter[item.id] = item.value;
         });
         return filter;
      },

      resetFilter: function() {
         Chain(this._items).each(function(item) {
            item.value = item.resetValue;
         });
         this._isEnabled = false;
         this._children.PropertyGrid._forceUpdate();
      },

      _close: function() {
         this.resetFilter();
         this._notify('close', [], {bubbling: true});
      }
   });

   FilterPanel.getDefaultOptions = function getDefaultOptions() {
      return {
         title: rk('Отбираются'),
         styleHeader: 'default',
         viewMode: 'oneColumn'
      };
   };

   return FilterPanel;

});
