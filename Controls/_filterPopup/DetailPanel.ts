import Control = require('Core/Control');
import chain = require('Types/chain');
import Utils = require('Types/util');
import Clone = require('Core/core-clone');
import _FilterPanelOptions = require('Controls/_filterPopup/Panel/Wrapper/_FilterPanelOptions');
import template = require('wml!Controls/_filterPopup/Panel/Panel');
import Env = require('Env/Env');
import {isEqual} from 'Types/object';
import {RecordSet, factory} from 'Types/collection';
import {HistoryUtils} from 'Controls/filter';
import {List} from 'Types/collection';
import 'css!theme?Controls/filterPopup';
import 'Controls/form';
/**
    * Контрол для отображения шаблона панели фильтров. Отображает каждый фильтр по заданным шаблонам.
    * Он состоит из трех блоков: Отбираются, Еще можно отобрать, Ранее отбирались.
    * <a href="/materials/demo-ws4-filter-button">Демо-пример</a>.
    *
    *
    * @class Controls/_filterPopup/DetailPanel
    * @extends Core/Control
    * @mixes Controls/interface/IFilterPanel
    * @demo Controls-demo/Filter/Button/panelOptions/panelPG
    * @control
    * @public
    * @author Золотова Э.Е.
    *
    * @cssModifier controls-FilterPanel__width-m Medium panel width.
    * @cssModifier controls-FilterPanel__width-l Large panel width.
    * @cssModifier controls-FilterPanel__width-xl Extra large panel width.
    */

   /*
    * Component for displaying a filter panel template. Displays each filters by specified templates.
    * It consists of three blocks: Selected, Also possible to select, Previously selected.
    * Here you can see <a href="/materials/demo-ws4-filter-button">demo-example</a>.
    *
    *
    * @class Controls/_filterPopup/DetailPanel
    * @extends Core/Control
    * @mixes Controls/interface/IFilterPanel
    * @demo Controls-demo/Filter/Button/panelOptions/panelPG
    * @control
    * @public
    * @author Золотова Э.Е.
    *
    * @cssModifier controls-FilterPanel__width-m Medium panel width.
    * @cssModifier controls-FilterPanel__width-l Large panel width.
    * @cssModifier controls-FilterPanel__width-xl Extra large panel width.
    */

   /**
    * @event Controls/_filterPopup/DetailPanel#sendResult Происходит при клике по кнопке "Отобрать".
    * @param {Object} filter Объект фильтра {'filter_id': 'filter_value'}.
    * @param {Object} items Набор элементов.
    */

   /*
    * @event Controls/_filterPopup/DetailPanel#sendResult Happens when clicking the button "Select".
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

      loadHistoryItems: function(self, historyId, isReportPanel) {
         if (historyId) {
            let config = {
               historyId: historyId,

                // the report filters panel uses favorite history, for it we don't request pinned items from the history service
                pinned: !isReportPanel,
               recent: isReportPanel ? 'MAX_HISTORY_REPORTS' : 'MAX_HISTORY'
            };
            return HistoryUtils.loadHistoryItems(config).addCallback(function(items) {
               self._historyItems = _private.filterHistoryItems(self, items);
               return self._historyItems;
            }).addErrback(function() {
               self._historyItems = new List({ items: [] });
            });
         }
      },

       filterHistoryItems: function(self,items) {
           return chain.factory(items).filter(function(item) {
               let history = JSON.parse(item.get('ObjectData')).items || JSON.parse(item.get('ObjectData'));
               let itemHasData = false;
               for (var i = 0, length = history.length; i < length; i++) {
                   var textValue = getPropValue(history[i], 'textValue');
                   if (textValue !== '' && textValue !== undefined) {
                       itemHasData = true;
                   }
               }
               return itemHasData;
           }).value(factory.recordSet,{adapter: items.getAdapter()});
       },

      reloadHistoryItems: function(self, historyId) {
         self._historyItems = HistoryUtils.getHistorySource({historyId: historyId}).getItems();
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
            if ((getPropValue(item, 'resetValue') !== undefined && !isEqual(getPropValue(item, 'value'), getPropValue(item, 'resetValue')) &&
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
         const isReportPanel = options.orientation === 'horizontal';
         return _private.loadHistoryItems(this, this._historyId, isReportPanel);
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
         this._notify('itemsChanged', [this._items]);
      },

      _applyHistoryFilter: function(event, history) {
         const items = history.items || history;
         this._applyFilter(event, items, history);
      },

      _applyFilter: function(event, items, history) {
         var self = this,
             curItems = items || this._items;

         let apply = () => {
            /*
               Due to the fact that a bar can be created as you like (the bar will be not in the root, but a bit deeper)
               and the popup captures the sendResult operation from the root node, bubbling must be set in true.
            */
            self._notify('sendResult', [{
               filter: _private.getFilter(curItems),
               items: _private.prepareItems(curItems),
               history
            }], {bubbling: true});
            self._notify('close', [], {bubbling: true});
         };

         if (history) {
            apply();
         } else {
            _private.validate(this).addCallback(function (result) {
               if (_private.isPassedValidation(result)) {
                  apply();
               }
            });
         }
      },

      _resetFilter: function(): void {
         this._items = _private.cloneItems(this._options.items || this._contextOptions.items);
         chain.factory(this._items).each((item) => {
            const resetValue = getPropValue(item, 'resetValue');
            const textValue = getPropValue(item, 'textValue');

            if (getPropValue(item, 'visibility') !== undefined) {
               setPropValue(item, 'visibility', false);
            }
            if (resetValue !== undefined) {
               setPropValue(item, 'value', resetValue);
            }
            if (textValue !== undefined) {
               setPropValue(item, 'textValue', textValue === null ? textValue : '');
            }
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

