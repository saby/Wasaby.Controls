define('Controls/Filter/Button/Panel', [
   'Core/Control',
   'WS.Data/Chain',
   'WS.Data/Utils',
   'Core/core-clone',
   'tmpl!Controls/Filter/Button/Panel/Panel',
   'css!Controls/Filter/Button/Panel/Panel'

], function(Control, Chain, Utils, Clone, template) {

   /**
    * Control "Filter panel"
    * @class Controls/Filter/Button/Panel
    * @extends Core/Control
    * @mixes Controls/Filter/Button/interface/IFilterPanel
    * @control
    * @public
    */

   /**
    * @event Controls/Filter/Button/Panel#filterChanged Happens when clicking on the button "Select"
    */


   'use strict';

   var getPropValue = Utils.getItemPropertyValue.bind(Utils);
   var setPropValue = Utils.setItemPropertyValue.bind(Utils);

   var _private = {

      cloneItems: function(items) {
         if (items['[WS.Data/Entity/CloneableMixin]']) {
            return items.clone();
         } else {
            return Clone(items);
         }
      },

      getFilter: function(self, items) {
         var filter = {};
         Chain(items || self._items).each(function(item) {
            if (getPropValue(item, 'value') !== getPropValue(item, 'resetValue') && getPropValue(item, 'visibility')) {
               filter[item.id] = getPropValue(item, 'value');
            }
         });
         return filter;
      },

      isChangedValue: function(items) {
         var isChanged = false;
         Chain(items).each(function(item) {
            if (getPropValue(item, 'value') !== getPropValue(item, 'resetValue') && getPropValue(item, 'visibility')) {
               isChanged = true;
            }
         });
         return isChanged;
      },

      hasAdditionalParams: function(items) {
         var hasAdditional = false;
         Chain(items).each(function(item) {
            if (!getPropValue(item, 'visibility')) {
               hasAdditional = true;
            }
         });
         return hasAdditional;
      }
   };

   var FilterPanel = Control.extend({
      _template: template,
      _isChanged: false,
      _hasAdditionalParams: false,

      _beforeMount: function(options) {
         this._items = _private.cloneItems(options.items);
         this._hasAdditionalParams = _private.hasAdditionalParams(options.items);
         this._isChanged = _private.isChangedValue(this._items);
      },

      _beforeUpdate: function() {
         this._isChanged = _private.isChangedValue(this._items);
         this._hasAdditionalParams = _private.hasAdditionalParams(this._items);
      },

      _valueChangedHandler: function() {
         this._items = _private.cloneItems(this._items);
      },

      _visibilityChangedHandler: function() {
         this._items = _private.cloneItems(this._items);
      },

      _applyHistoryFilter: function(event, items) {
         var filter = _private.getFilter(this, items);
         filter['$_history' ] = true;
         this._applyFilter(event, items);
      },

      _applyFilter: function(event, items) {
         this._notify('sendResult', [{
            filter: _private.getFilter(this),
            items: items || this._items
         }]);
         this._notify('close');
      },

      _resetFilter: function() {
         var self = this;
         this._items = _private.cloneItems(this._items);
         Chain(this._items).each(function(item, index) {
            setPropValue(item, 'value', getPropValue(item, 'resetValue'));
            setPropValue(item, 'visibility', getPropValue(self._options.items[index], 'visibility'));
         });
         this._isChanged = false;
      }
   });

   FilterPanel.getDefaultOptions = function getDefaultOptions() {
      return {
         title: rk('Отбираются'),
         styleHeader: 'primary',
         size: 'default'
      };
   };

   FilterPanel._private = _private;
   return FilterPanel;

});
