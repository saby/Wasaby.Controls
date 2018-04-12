define('Controls/Filter/Panel', [
   'Core/Control',
   'WS.Data/Chain',
   'WS.Data/Utils',
   'Core/helpers/Array/clone',
   'tmpl!Controls/Filter/Panel/Panel',
   'css!Controls/Popup/DialogTemplate',
   'css!Controls/Filter/Panel/Panel'

], function(Control, Chain, Utils, clone, template) {

   'use strict';


   var FilterPanel = Control.extend({
      _template: template,

      _beforeMount: function(options) {
         this._items = clone(options.items);
      },

      applyFilter: function() {
         this._notify('filterChanged', [this.getFilter()]);
         return this._items;
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
         this._children.PropertyGrid._forceUpdate();
      },

      close: function() {
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
