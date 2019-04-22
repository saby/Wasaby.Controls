import Control = require('Core/Control');
import chain = require('Types/chain');
import Utils = require('Types/util');
import Clone = require('Core/core-clone');
import isEqual = require('Core/helpers/Object/isEqual');
import historyUtils = require('Controls/_filterPopup/History/resources/historyUtils');
import _FilterPanelOptions = require('Controls/_filterPopup/Panel/Wrapper/_FilterPanelOptions');
import template = require('wml!Controls/_filterPopup/Panel/Panel');
import Env = require('Env/Env');
import 'css!theme?Controls/_filterPopup/Panel/Panel';
import 'Controls/Controllers/PrimaryAction';
   /**
    * Component for displaying a filter panel template. Displays each filters by specified templates.
    * It consists of three blocks: Selected, Possible to selected, Previously selected.
    *
    * @class Controls/_filterPopup/Panel
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
    * @event Controls/_filterPopup/Panel#sendResult Happens when clicking the button "Select".
    * @param {Object} filter Filter object view {'filter_id': 'filter_value'}
    * @param {Object} items items
    */



   var getPropValue = Utils.object.getPropertyValue.bind(Utils);
   var setPropValue = Utils.object.setPropertyValue.bind(Utils);

   var _private = {

      resolveItems: function(self, options, context) {
         self._contextOptions = context && context.filterPanelOptionsField && context.filterPanelOptionsField.options;
         if (options.items) {
            self._items = this.cloneItems(options.items);
         } else if (self._contextOptions) {
            self._items = this.cloneItems(context.filterPanelOptionsField.options.items);
            Env.IoC.resolve('ILogger').error('Controls/filterPopup:Panel:', 'You must pass the items option for the panel.');
         } else {
            throw new Error('Controls/filterPopup:Panel::items option is required');
         }
      },

      resolveHistoryId: function(self, options, context) {
         if (options.historyId) {
            self._historyId = options.historyId;
         } else if (context && context.historyId) {
            self._historyId = context.historyId;
            Env.IoC.resolve('ILogger').error('Controls/filterPopup:Panel:', 'You must pass the historyId option for the panel.');
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

      reloadHistoryItems: function(self, historyId) {
         self._historyItems = historyUtils.getHistorySource(historyId).getItems();
      },

      cloneItems: function(items) {
         if (items['[Types/_entity/CloneableMixin]']) {
            return items.clone();
         }
         return Clone(items);
      },

      getFilter: function(items) {
         var filter = {};
         chain.factory(items).each(function(item) {
            if (!isEqual(getPropValue(item, 'value'), getPropValue(item, 'resetValue')) &&
               (getPropValue(item, 'visibility') === undefined || getPropValue(item, 'visibility'))) {
               filter[item.id] = getPropValue(item, 'value');
            }
         });
         return filter;
      },

      isChangedValue: function(items) {
         var isChanged = false;
         chain.factory(items).each(function(item) {
            if ((!isEqual(getPropValue(item, 'value'), getPropValue(item, 'resetValue')) &&
               getPropValue(item, 'visibility') === undefined) || getPropValue(item, 'visibility')) {
               isChanged = true;
            }
         });
         return isChanged;
      },

      hasResetValue: function(items) {
         var hasReset = false;
         chain.factory(items).each(function(item) {
            if (hasReset) {
               return;
            }
            hasReset = getPropValue(item, 'resetValue') !== undefined;
         });
         return hasReset;
      },

      validate: function(self) {
         return self._children.formController.submit();
      },

      isPassedValidation: function(result) {
         var isPassedValidation = true;
         chain.factory(result).each(function(value) {
            if (value) {
               isPassedValidation = false;
            }
         });
         return isPassedValidation;
      },

      hasAdditionalParams: function(items) {
         var hasAdditional = false;
         chain.factory(items).each(function(item) {
            if (getPropValue(item, 'visibility') === false) {
               hasAdditional = true;
            }
         });
         return hasAdditional;
      },

      prepareItems: function(items) {
         chain.factory(items).each(function(item) {
            if (getPropValue(item, 'visibility') === true && isEqual(getPropValue(item, 'value'), getPropValue(item, 'resetValue'))) {
               setPropValue(item, 'visibility', false);
            }
         });
         return items;
      }
   };

   var FilterPanel = Control.extend({
      _template: template,
      _isChanged: false,
      _hasResetValue: false,
      _hasAdditionalParams: false,

      _beforeMount: function(options, context) {
         _private.resolveItems(this, options, context);
         _private.resolveHistoryId(this, options, this._contextOptions);
         this._hasAdditionalParams = (options.additionalTemplate || options.additionalTemplateProperty) && _private.hasAdditionalParams(this._items);
         this._isChanged = _private.isChangedValue(this._items);
         this._hasResetValue = _private.hasResetValue(this._items);
         return _private.loadHistoryItems(this, this._historyId);
      },

      _beforeUpdate: function(newOptions, context) {
         this._isChanged = _private.isChangedValue(this._items);
         this._hasAdditionalParams = (newOptions.additionalTemplate || newOptions.additionalTemplateProperty) && _private.hasAdditionalParams(this._items);
         this._hasResetValue = _private.hasResetValue(this._items);
         if (!isEqual(this._options.items, newOptions.items)) {
            _private.resolveItems(this, newOptions, context);
         }
         if (this._options.historyId !== newOptions.historyId) {
            _private.resolveHistoryId(this, newOptions, context);
            return _private.loadHistoryItems(this, this._historyId);
         }
      },

      _historyItemsChanged: function() {
         _private.reloadHistoryItems(this, this._historyId);
      },

      _itemsChangedHandler: function(event, items) {
         this._items = _private.cloneItems(items);
      },

      _applyHistoryFilter: function(event, items) {
         var filter = _private.getFilter(items);
         filter.$_history = true;
         this._applyFilter(event, items);
      },

      _applyFilter: function(event, items) {
         var self = this,
            curItems = items || this._items;
         _private.validate(this).addCallback(function(result) {
            if (_private.isPassedValidation(result)) {

               /*
               Due to the fact that a bar can be created as you like (the bar will be not in the root, but a bit deeper)
               and the popup captures the sendResult operation from the root node, bubbling must be set in true.
               */
               self._notify('sendResult', [{
                  filter: _private.getFilter(curItems),
                  items: _private.prepareItems(curItems)
               }], {bubbling: true});
               self._notify('close', [], {bubbling: true});
            }
         });
      },

      _resetFilter: function() {
         this._items = _private.cloneItems(this._options.items || this._contextOptions.items);
         chain.factory(this._items).each(function(item) {
            if (getPropValue(item, 'visibility') !== undefined) {
               setPropValue(item, 'visibility', false);
            }
            setPropValue(item, 'value', getPropValue(item, 'resetValue'));
         });
         this._isChanged = false;
      }
   });

   FilterPanel.getDefaultOptions = function getDefaultOptions() {
      return {
         headingCaption: rk('Отбираются'),
         headingStyle: 'secondary',
         orientation: 'vertical',
         applyButtonCaption: rk('Отобрать')
      };
   };

   FilterPanel.contextTypes = function() {
      return {
         filterPanelOptionsField: _FilterPanelOptions
      };
   };

   FilterPanel._private = _private;
   export = FilterPanel;

