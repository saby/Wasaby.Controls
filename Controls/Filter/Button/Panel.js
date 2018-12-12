define('Controls/Filter/Button/Panel', [
   'Core/Control',
   'WS.Data/Chain',
   'WS.Data/Utils',
   'Core/core-clone',
   'Core/helpers/Object/isEqual',
   'Controls/Filter/Button/History/resources/historyUtils',
   'Controls/Filter/Button/Panel/Wrapper/_FilterPanelOptions',
   'wml!Controls/Filter/Button/Panel/Panel',
   'Core/IoC',
   'css!theme?Controls/Filter/Button/Panel/Panel'

], function(Control, Chain, Utils, Clone, isEqual, historyUtils, _FilterPanelOptions, template, IoC) {
   /**
    * Component for displaying a filter panel template. Displays each filters by specified templates.
    * It consists of three blocks: Selected, Possible to selected, Previously selected.
    *
    * @class Controls/Filter/Button/Panel
    * @extends Core/Control
    * @mixes Controls/interface/IFilterPanel
    * @demo Controls-demo/Filter/Button/panelOptions/panelPG
    * @control
    * @public
    * @author Золотова Элина
    *
    * @cssModifier controls-FilterPanel__width-m Medium panel width.
    * @cssModifier controls-FilterPanel__width-l Large panel width.
    * @cssModifier controls-FilterPanel__width-xl Extra large panel width.
    */

   /**
    * @event Controls/Filter/Button/Panel#sendResult Happens when clicking the button "Select".
    * @param {Object} filter Filter object view {'filter_id': 'filter_value'}
    * @param {Object} items items
    */

   'use strict';

   var getPropValue = Utils.getItemPropertyValue.bind(Utils);
   var setPropValue = Utils.setItemPropertyValue.bind(Utils);

   var _private = {

      resolveItems: function(self, options, context) {
         if (options.items) {
            self._items = this.cloneItems(options.items);
         } else if (context && context.filterPanelOptionsField && context.filterPanelOptionsField.options) {
            self._items = this.cloneItems(context.filterPanelOptionsField.options.items);
            self._contextOptions = context.filterPanelOptionsField.options;
            IoC.resolve('ILogger').error('Controls/Filter/Button/Panel:', 'You must pass the items option for the panel.');
         } else {
            throw new Error('Controls/Filter/Button/Panel::items option is required');
         }
      },

      resolveHistoryId: function(self, options, context) {
         if (options.historyId) {
            self._historyId = options.historyId;
         } else if (context) {
            self._historyId = context.historyId;
            IoC.resolve('ILogger').error('Controls/Filter/Button/Panel:', 'You must pass the historyId option for the panel.');
         }
      },

      loadHistoryItems: function(self, historyId) {
         if (historyId) {
            return historyUtils.loadHistoryItems(historyId).addCallback(function(items) {
               self._historyItems = items;
               return items;
            });
         }
      },

      cloneItems: function(items) {
         if (items['[WS.Data/Entity/CloneableMixin]']) {
            return items.clone();
         }
         return Clone(items);
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
            if ((!isEqual(getPropValue(item, 'value'), getPropValue(item, 'resetValue')) &&
               getPropValue(item, 'visibility') === undefined) || getPropValue(item, 'visibility')) {
               isChanged = true;
            }
         });
         return isChanged;
      },

      hasAdditionalParams: function(items) {
         var hasAdditional = false;
         Chain(items).each(function(item) {
            if (getPropValue(item, 'visibility') === false) {
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
         _private.resolveHistoryId(this, options, this._contextOptions);
         this._hasAdditionalParams = (options.additionalTemplate || options.additionalTemplateProperty) && _private.hasAdditionalParams(this._items);
         this._isChanged = _private.isChangedValue(this._items);
         return _private.loadHistoryItems(this, this._historyId);
      },

      _beforeUpdate: function(newOptions, context) {
         this._isChanged = _private.isChangedValue(this._items);
         this._hasAdditionalParams = (newOptions.additionalTemplate || newOptions.additionalTemplateProperty) && _private.hasAdditionalParams(this._items);
         if (!isEqual(this._options.items, newOptions.items)) {
            _private.resolveItems(this, newOptions, context);
         }
         if (this._options.historyId !== newOptions.historyId) {
            _private.resolveHistoryId(this, newOptions, context);
            return _private.loadHistoryItems(this, this._historyId);
         }
      },

      _historyItemsChanged: function() {
         this._loadDeferred = _private.loadHistoryItems(this, this._historyId);
      },

      _valueChangedHandler: function() {
         this._items = _private.cloneItems(this._items);
      },

      _visibilityChangedHandler: function() {
         this._items = _private.cloneItems(this._items);
      },

      _applyHistoryFilter: function(event, items) {
         var filter = _private.getFilter(this, items);
         filter.$_history = true;
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
            if (getPropValue(item, 'visibility') === undefined) {
               setPropValue(item, 'value', getPropValue(item, 'resetValue'));
            }
            if (getPropValue(item, 'visibility') !== undefined) {
               setPropValue(item, 'visibility', false);
            }
         });
         this._isChanged = false;
      }
   });

   FilterPanel.getDefaultOptions = function getDefaultOptions() {
      return {
         headingCaption: rk('Отбираются'),
         headingStyle: 'secondary',
         orientation: 'vertical'
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
