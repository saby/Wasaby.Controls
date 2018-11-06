/**
 * Created by am.gerasimov on 21.02.2018.
 */
define('Controls/Filter/Button',
   [
      'Core/Control',
      'wml!Controls/Filter/Button/Button',
      'WS.Data/Chain',
      'WS.Data/Utils',
      'Core/Deferred',
      'Core/helpers/Object/isEqual',
      'css!theme?Controls/Filter/Button/Button'
   ],

   function(Control, template, Chain, Utils, Deferred, isEqual) {
      /**
       * Control for data filtering. Consists of an icon-button and a string representation of the selected filter.
       * Clicking on a icon-button or a string opens the panel. {@link Controls/Filter/Button/Panel}
       * Supports the insertion of a custom template between the button and the filter string.
       * The detailed description and instructions on how to configure the control you can read <a href='/doc/platform/developmentapl/interface-development/wasaby/components/filterbutton-and-fastfilters/'>here</a>.
       * Here you can see <a href="/materials/demo-ws4-filter-button">demo-example</a>.
       *
       * Information on filtering settings in the list using the "Filter Button" control you can read <a href='/doc/platform/developmentapl/interface-development/ws4/components/filter-search/'>here</a>.
       *
       * @class Controls/Filter/Button
       * @extends Core/Control
       * @mixes Controls/interface/IFilterButton
       * @demo Controls-demo/Filter/Button/ButtonPG
       * @control
       * @public
       * @author Герасимов А.М.
       *
       * @css @height_FilterButton Button height.
       * @css @color_FilterButton-icon Button icon color.
       * @css @color_FilterButton-icon_hover Button icon color in hovered state.
       * @css @color_FilterButton-icon_disabled Button icon color in disabled state.
       * @css @spacing_FilterButton-between-icon-text Spacing between the button icon and the filter string.
       * @css @spacing_FilterButton-between-spaceTemplate-text Spacing between the line space template and the filter string.
       * @css @color_FilterButton-text Filter string color.
       * @css @color_FilterButton-text_hover Filter string color in hovered state.
       * @css @color_FilterButton-text_disabled Filter string color in disabled state.
       * @css @font-size_FilterButton-text The filter string font size.
       * @css @color_FilterButton-arrow Icon 'arrow' color.
       * @css @color_FilterButton-arrow_disabled Icon 'arrow' color in disabled state.
       * @css @color_FilterButton-clear Icon 'cross' color.
       * @css @font-size_FilterButton-icon Filter button icon size.
       * @css @font-family_FilterButton-icon Filter button icon font family.
       * @css @icon-size_FilterButton-text-icon Icon 'arrow' and icon 'cross' size.
       */

      'use strict';

      var _private = {
         getFilterButtonCompatible: function(self) {
            var result = new Deferred();
            requirejs(['Controls/Popup/Compatible/Layer'], (function(Layer) {
               Layer.load().addCallback(function(res) {
                  requirejs(['Controls/Filter/Button/_FilterCompatible'], function(_FilterCompatible) {
                     if (!self._filterCompatible) {
                        self._filterCompatible = new _FilterCompatible({
                           filterButton: self,
                           filterButtonOptions: self._options
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

            Chain(items).each(function(item) {
               if (!isEqual(Utils.getItemPropertyValue(item, 'value'), Utils.getItemPropertyValue(item, 'resetValue')) &&
                  (Utils.getItemPropertyValue(item, 'visibility') === undefined || Utils.getItemPropertyValue(item, 'visibility'))
               ) {
                  var textValue = Utils.getItemPropertyValue(item, 'textValue');

                  if (textValue) {
                     textArr.push(textValue);
                  }
               }
            });

            return textArr.join(', ');
         },

         resolveItems: function(self, items) {
            self._items = items;
            self._text = _private.getText(items);
            if (self._options.filterTemplate && self._filterCompatible) {
               self._filterCompatible.updateFilterStructure(items);
            }
         },
         setPopupOptions: function(self, options) {
            self._popupOptions = {
               closeByExternalClick: true,
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
            Chain(items).each(function(item) {
               Utils.setItemPropertyValue(item, 'value', Utils.getItemPropertyValue(item, 'resetValue'));
               if (Utils.getItemPropertyValue(item, 'visibility') !== undefined) {
                  Utils.setItemPropertyValue(item, 'visibility', false);
               }
            });
         }
      };

      var FilterButton = Control.extend(/** @lends Controls/Filter/Button.prototype */{

         _template: template,
         _oldPanelOpener: null,
         _text: '',
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
                     self._children.filterStickyOpener.open({
                        templateOptions: {
                           template: self._options.templateName,
                           items: self._options.items,
                           historyId: self._options.historyId
                        },
                        template: 'Controls/Filter/Button/Panel/Wrapper/_FilterPanelWrapper',
                        target: self._children.panelTarget
                     });
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
      return FilterButton;
   });
