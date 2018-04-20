define('Controls/Filter/Button/Panel', [
   'Core/Control',
   'WS.Data/Chain',
   'WS.Data/Utils',
   'Core/core-clone',
   'tmpl!Controls/Filter/Button/Panel/Panel',
   'css!Controls/Filter/Button/Panel/Panel'

], function(Control, Chain, Utils, clone, template) {

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
    * @variant primary Blue color
    * @variant default Orange color
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

      _valueChangedHandler: function() {
         this._items = clone(this._items);
      },

      _applyFilter: function() {
         this._notify('filterChanged', [_private.getFilter(this)]);
         this._notify('close');
      },

      _resetFilter: function() {
         this._items = clone(this._items);
         Chain(this._items).each(function(item) {
            setPropValue(item, 'value', getPropValue(item, 'resetValue'));

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
         styleHeader: 'primary'
      };
   };

   FilterPanel._private = _private;
   return FilterPanel;

});
