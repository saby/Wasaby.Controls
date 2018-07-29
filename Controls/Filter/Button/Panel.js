define('Controls/Filter/Button/Panel', [
   'Core/Control',
   'WS.Data/Chain',
   'WS.Data/Utils',
   'Core/helpers/Object/isEqual',
   'Core/core-clone',
   'Controls/Filter/Button/Panel/Wrapper/_FilterPanelOptions',
   'tmpl!Controls/Filter/Button/Panel/Panel',
   'css!Controls/Filter/Button/Panel/Panel'

], function(Control, Chain, Utils, isEqual, Clone, _FilterPanelOptions, template) {

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

      resolveItems: function(self, options, context) {
         if (context && context.filterPanelOptionsField && context.filterPanelOptionsField.options) {
            self._contextOptions = context.filterPanelOptionsField.options;
            self._items = this.cloneItems(context.filterPanelOptionsField.options.items);
         } else {
            self._items = this.cloneItems(options.items);
         }
      },

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
            if (!isEqual(getPropValue(item, 'value'), getPropValue(item, 'resetValue')) &&
               (getPropValue(item, 'visibility') === undefined || getPropValue(item, 'visibility'))) {
               filter[item.id] = getPropValue(item, 'value');
            }
         });
         return filter;
      },

      isChangedValue: function(items) {
         var isChanged = false;
         Chain(items).each(function(item) {
            if (!isEqual(getPropValue(item, 'value'), getPropValue(item, 'resetValue')) &&
               (getPropValue(item, 'visibility') === undefined || getPropValue(item, 'visibility'))) {
               isChanged = true;
            }
         });
         return isChanged;
      },

      hasAdditionalParams: function(items) {
         var hasAdditional = false;
         Chain(items).each(function(item) {
            if (getPropValue(item, 'visibility') !== undefined && !getPropValue(item, 'visibility')) {
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

      _beforeMount: function(options, context) {
         _private.resolveItems(this, options, context);
         this._historyId = options.historyId || (this._contextOptions && this._contextOptions.historyId);
         this._hasAdditionalParams = _private.hasAdditionalParams(this._items);
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
         this._items = _private.cloneItems(this._options.items || this._contextOptions.items);
         Chain(this._items).each(function(item) {
            setPropValue(item, 'value', getPropValue(item, 'resetValue'));
            if (getPropValue(item, 'visibility') !== undefined) {
               setPropValue(item, 'visibility', false);
            }
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

   FilterPanel.contextTypes = function() {
      return {
         filterPanelOptionsField: _FilterPanelOptions
      };
   };

   FilterPanel._private = _private;
   return FilterPanel;

});
