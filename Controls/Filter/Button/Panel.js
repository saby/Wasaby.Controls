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
    * @class Controls/Filter/Button/Panel
    * @extends Controls/Control
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
      getFilter: function(self) {
         var filter = {};
         Chain(self._items).each(function(item) {
            if (getPropValue(item, 'value') !== getPropValue(item, 'resetValue') && getPropValue(item, 'visibility')) {
               filter[item.id] = getPropValue(item, 'value');
            }
         });
         return filter;
      },

      isChangedValue: function(items) {
         for (var i in items) {
            if (getPropValue(items[i], 'value') !== getPropValue(items[i], 'resetValue') && getPropValue(items[i], 'visibility')) {
               return true;
            }
         }
         return false;
      },

      hasAdditionalParams: function(items) {
         for (var i in items) {
            if (!getPropValue(items[i], 'visibility')) {
               return true;
            }
         }
         return false;
      }
   };

   var FilterPanel = Control.extend({
      _template: template,
      _isChanged: false,
      _hasAdditionalParams: false,

      constructor: function(options) {
         FilterPanel.superclass.constructor.apply(this, arguments);
         this._options = options;
      },

      _beforeMount: function(options) {
         this._items = clone(options.items);
         this._hasAdditionalParams = _private.hasAdditionalParams(options.items);
         this._isChanged = _private.isChangedValue(this._items);
      },

      _beforeUpdate: function() {
         this._isChanged = _private.isChangedValue(this._items);
         this._hasAdditionalParams = _private.hasAdditionalParams(this._items);
      },

      _valueChangedHandler: function() {
         this._items = clone(this._items);
      },

      _applyFilter: function() {
         this._notify('sendResult', [_private.getFilter(this)]);
         this._notify('close');
      },

      _resetFilter: function() {
         var self = this;
         this._items = clone(this._items);
         Chain(this._items).each(function(item, index) {
            setPropValue(item, 'value', getPropValue(item, 'resetValue'));
            setPropValue(item, 'visibility', getPropValue(self._options.items[index], 'visibility'));
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
         styleHeader: 'primary',
         size: 'default'
      };
   };

   FilterPanel._private = _private;
   return FilterPanel;

});
