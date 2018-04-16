define('Controls/Filter/Panel', [
   'Core/Control',
   'WS.Data/Chain',
   'WS.Data/Utils',
   'Core/helpers/Object/isEqual',
   'Core/core-clone',
   'tmpl!Controls/Filter/Panel/Panel',
   'css!Controls/Filter/Panel/Panel'

], function(Control, Chain, Utils, isEqual, clone, template) {

   /**
    * Control "Filter panel"
    * @class Controls/Filter/Panel
    * @extends Controls/Control
    * @control
    * @public
    */

   /**
    * @event Controls/Filter/Panel#filterChanged Happens when clicking on the button "Select"
    */

   /**
    * @name Controls/Filter/Panel#styleHeader
    * @cfg {String} Color of title in header
    * @variant default Blue color
    * @variant custom Orange color
    */

   /**
    * @name Controls/Filter/Panel#viewMode
    * @cfg {String} Sets the display of the filter button
    * @variant oneColumn The panel is built in one column
    * @variant twoColumn The panel is built in two columns
    */
   
   /**
    * @name Controls/Filter/Panel#title
    * @cfg {String} Caption
    */

   'use strict';

   var getPropValue = Utils.getItemPropertyValue.bind(Utils);
   var setPropValue = Utils.setItemPropertyValue.bind(Utils);

   var _private = {
      getFilter: function(self) {
         var filter = {};
         Chain(self._items).each(function(item) {
            if (getPropValue(item, 'value') !== getPropValue(item, 'resetValue')) {
               filter[item.id] = getPropValue(item, 'value');
            }
         });
         return filter;
      },

      isChangedValue: function(items) {
         for (var i in items) {
            if (getPropValue(items[i], 'value') !== getPropValue(items[i], 'resetValue')) {
               return true;
            }
         }
         return false;
      }
   };

   var FilterPanel = Control.extend({
      _template: template,
      _isChanged: false,

      _beforeMount: function(options) {
         this._items = clone(options.items);
         this._isChanged = _private.isChangedValue(this._items);
      },

      _beforeUpdate: function() {
         this._isChanged = _private.isChangedValue(this._items);
      },

      _applyFilter: function() {
         this._notify('filterChanged', [_private.getFilter(this)]);
         this._notify('close');
      },

      _resetFilter: function() {
         Chain(this._items).each(function(item) {
            setPropValue(item, 'value', item.resetValue);
         });
         this._isChanged = false;
      },

      _close: function() {
         this._notify('close');
      }
   });

   FilterPanel.getDefaultOptions = function getDefaultOptions() {
      return {
         title: rk('Отбираются'),
         styleHeader: 'default',
         viewMode: 'oneColumn'
      };
   };

   FilterPanel._private = _private;
   return FilterPanel;

});
