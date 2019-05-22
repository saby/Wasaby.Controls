/**
 * Created by am.gerasimov on 21.02.2018.
 */
import Control = require('Core/Control');
import template = require('wml!Controls/_filter/Button/Button');
import chain = require('Types/chain');
import Utils = require('Types/util');
import Deferred = require('Core/Deferred');
import isEqual = require('Core/helpers/Object/isEqual');
import 'css!theme?Controls/filter';
/**
 * Control for data filtering. Consists of an icon-button and a string representation of the selected filter.
 * Clicking on a icon-button or a string opens the panel. {@link Controls/_filter/Button/Panel}
 * Supports the insertion of a custom template between the button and the filter string.
 * The detailed description and instructions on how to configure the control you can read <a href='/doc/platform/developmentapl/interface-development/controls/filterbutton-and-fastfilters/'>here</a>.
 * Here you can see <a href="/materials/demo-ws4-filter-button">demo-example</a>.
 *
 * Information on filtering settings in the list using the "Filter Button" control you can read <a href='/doc/platform/developmentapl/interface-development/controls/filter-search/'>here</a>.
 *
 * @class Controls/_filter/Button
 * @extends Core/Control
 * @mixes Controls/interface/IFilterButton
 * @demo Controls-demo/Filter/Button/ButtonPG
 * @control
 * @public
 * @author Герасимов А.М.
 *
 */



var _private = {
   getFilterButtonCompatible: function(self) {
      var result = new Deferred();
      requirejs(['Lib/Control/LayerCompatible/LayerCompatible'], (function(Layer) {
         Layer.load().addCallback(function(res) {
            requirejs(['Controls/filterCompatible'], function(filterCompatible) {
               if (!self._filterCompatible) {
                  self._filterCompatible = new filterCompatible._FilterCompatible({
                     filterButton: self,
                     filterButtonOptions: self._options,
                     tabindex: 0
                  });
               }
               result.callback(self._filterCompatible);
            });
            return res;
         });
      }));
      return result;
   },

   getText: function(items) {
      var textArr = [];

      chain.factory(items).each(function(item) {
         if (_private.isItemChanged(item) && (Utils.object.getPropertyValue(item, 'visibility') === undefined || Utils.object.getPropertyValue(item, 'visibility'))) {
            var textValue = Utils.object.getPropertyValue(item, 'textValue');

            if (textValue) {
               textArr.push(textValue);
            }
         }
      });

      return textArr.join(', ');
   },

   isItemsChanged: function(items) {
      var isChanged = false;

      chain.factory(items).each(function(item) {
         if (!isChanged) {
            isChanged = Utils.object.getPropertyValue(item, 'resetValue') !== undefined && _private.isItemChanged(item);
         }
      });

      return isChanged;
   },

   isItemChanged: function(item) {
      return !isEqual(Utils.object.getPropertyValue(item, 'value'), Utils.object.getPropertyValue(item, 'resetValue'));
   },

   resolveItems: function(self, items) {
      self._items = items;
      self._text = _private.getText(items);
      self._isItemsChanged = _private.isItemsChanged(items);
      if (self._options.filterTemplate && self._filterCompatible) {
         self._filterCompatible.updateFilterStructure(items);
      }
   },
   setPopupOptions: function(self, options) {
      self._popupOptions = {
         closeOnOutsideClick: true,
         eventHandlers: {
            onResult: self._onFilterChanged
         },
         className: 'controls-FilterButton-popup-orientation-' + (options.alignment === 'right' ? 'left' : 'right')
      };

      if (options.alignment === 'right') {
         self._popupOptions.corner = {
            vertical: 'top',
            horizontal: 'right'
         };
         self._popupOptions.horizontalAlign = {
            side: 'left'
         };
      }
   },

   requireDeps: function(self) {
      if (!self._depsDeferred) {
         self._depsDeferred = new Deferred();
         requirejs([self._options.templateName], function() {
            self._depsDeferred.callback();
         });
      }
      return self._depsDeferred;

   },

   resetItems: function(self, items) {
      chain.factory(items).each(function(item) {
         // Fast filters could not be reset from the filter button.
         if (!Utils.object.getPropertyValue(item, 'isFast')) {
            if (Utils.object.getPropertyValue(item, 'resetValue') !== undefined) {
               Utils.object.setPropertyValue(item, 'value', Utils.object.getPropertyValue(item, 'resetValue'));
            }
            if (Utils.object.getPropertyValue(item, 'visibility') !== undefined) {
               Utils.object.setPropertyValue(item, 'visibility', false);
            }
         }
      });
   },
   getPopupConfig: function(self) {
      return {
         templateOptions: {
            template: self._options.templateName,
            items: self._options.items,
            historyId: self._options.historyId
         },
         fittingMode: 'fixed',
         template: 'Controls/filterPopup:_FilterPanelWrapper',
         target: self._children.panelTarget
      };
   }
};

var FilterButton = Control.extend(/** @lends Controls/_filter/Button.prototype */{

   _template: template,
   _oldPanelOpener: null,
   _text: '',
   _isItemsChanged: false,
   _historyId: null,
   _popupOptions: null,
   _depsDeferred: null,

   _beforeMount: function(options) {
      if (options.items) {
         _private.resolveItems(this, options.items);
      }
      this._onFilterChanged = this._onFilterChanged.bind(this);
      _private.setPopupOptions(this, options);
   },

   _beforeUpdate: function(options) {
      if (!isEqual(this._options.items, options.items)) {
         _private.resolveItems(this, options.items);
      }
      if (this._options.alignment !== options.alignment) {
         _private.setPopupOptions(this, options);
      }
   },

   _getFilterState: function() {
      return this._options.readOnly ? 'disabled' : 'default';
   },

   _clearClick: function() {
      if (this._options.filterTemplate) {
         _private.getFilterButtonCompatible(this).addCallback(function(panelOpener) {
            panelOpener.clearFilter();
         });
      } else {
         _private.resetItems(this, this._items);
         this._notify('filterChanged', [{}]);
         this._notify('itemsChanged', [this._items]);
      }
      this._text = '';
   },

   _openFilterPanel: function() {
      var self = this;
      if (!this._options.readOnly) {
         /* if template - show old component */
         if (this._options.filterTemplate) {
            _private.getFilterButtonCompatible(this).addCallback(function(panelOpener) {
               panelOpener.showFilterPanel();
            });
         } else {
            _private.requireDeps(this).addCallback(function(res) {
               self._children.filterStickyOpener.open(_private.getPopupConfig(self));
               return res;
            });
         }
      }
   },

   _onFilterChanged: function(data) {
      this._notify('filterChanged', [data.filter]);
      this._notify('itemsChanged', [data.items]);
   }
});

FilterButton.getDefaultOptions = function() {
   return {
      alignment: 'right'
   };
};

FilterButton._private = _private;
export = FilterButton;

