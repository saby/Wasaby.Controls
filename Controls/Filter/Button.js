/**
 * Created by am.gerasimov on 21.02.2018.
 */
define('Controls/Filter/Button',
   [
      'Core/Control',
      'tmpl!Controls/Filter/Button/Button',
      'WS.Data/Chain',
      'WS.Data/Utils',
      'Core/Deferred',
      'Core/helpers/Object/isEqual',
      'css!Controls/Filter/Button/Button'
   ],

   function(Control, template, Chain, Utils, Deferred, isEqual) {

      /**
       * Component for data filtering.
       * Uses property grid for editing filter fields.
       * @class Controls/Filter/Button
       * @extends Core/Control
       * @mixes Controls/interface/IFilterButton
       * @control
       * @public
       * @author Герасимов Александр
       * @demo Controls-demo/FilterButton/FilterButton
       */

      /**
       * @css @height_FilterButton Height of button.
       * @css @color_FilterButton-icon Color of button icon.
       * @css @color_FilterButton-icon_hover Color of button icon when hovering.
       * @css @color_FilterButton-icon_disabled Color icon unavailable button.
       * @css @spacing_FilterButton-between-icon-text Spacing between the filter icon and the filter string.
       * @css @color_FilterButton-text Color of filter string.
       * @css @color_FilterButton-text_hover Color of filter string when hovering.
       * @css @color_FilterButton-text_disabled Color of filter string of unavailable button.
       * @css @font-size_FilterButton-text The font size of the filter string.
       * @css @color_FilterButton-arrow Color of icon 'arrow'.
       * @css @color_FilterButton-arrow_disabled Color of icon 'arrow' of unavailable button.
       * @css @color_FilterButton-clear Color of icon 'cross'.
       * @css @font-size_FilterButton-icon Size of filter button icon.
       * @css @font-family_FilterButton-icon Font family of filter button icon.
       * @css @icon-size_FilterButton-text-icon Size of icon icon 'arrow' and icon 'cross'.
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
            })
            );
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
                  } else {
                     textArr.push(Utils.getItemPropertyValue(item, 'value'));
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

         resetItems: function(self, items) {
            Chain(items).each(function(item) {
               Utils.setItemPropertyValue(item, 'value', Utils.getItemPropertyValue(item, 'resetValue'));
               if (Utils.getItemPropertyValue(item, 'visibility') !== undefined) {
                  Utils.setItemPropertyValue(item, 'visibility', false);
               }
            });
         }
      };

      var FilterButton = Control.extend({

         _template: template,
         _oldPanelOpener: null,
         _text: '',
         _historyId: null,

         _beforeMount: function(options) {
            if (options.items) {
               _private.resolveItems(this, options.items);
            }
            this._onFilterChanged = this._onFilterChanged.bind(this);
         },

         _beforeUpdate: function(options) {
            if (!isEqual(this._options.items, options.items)) {
               _private.resolveItems(this, options.items);
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
            if (!this._options.readOnly) {
               /* if template - show old component */
               if (this._options.filterTemplate) {
                  _private.getFilterButtonCompatible(this).addCallback(function(panelOpener) {
                     panelOpener.showFilterPanel();
                  });
               } else {
                  this._children.filterStickyOpener.open({
                     templateOptions: {
                        template: this._options.templateName,
                        items: this._options.items,
                        historyId: this._options.historyId
                     },
                     template: 'Controls/Filter/Button/Panel/Wrapper/_FilterPanelWrapper',
                     target: this._children.panelTarget
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
            filterAlign: 'right'
         };
      };

      return FilterButton;
   });
