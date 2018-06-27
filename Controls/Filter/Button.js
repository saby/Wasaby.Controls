/**
 * Created by am.gerasimov on 21.02.2018.
 */
define('Controls/Filter/Button',
   [
      'Core/Control',
      'tmpl!Controls/Filter/Button/Button',
      'WS.Data/Chain',
      'WS.Data/Utils',
      'WS.Data/Type/descriptor',
      'Core/Deferred',
      'Core/helpers/Object/isEqual',
      'css!Controls/Filter/Button/Button'
   ],

   function(Control, template, Chain, Utils, types, Deferred, isEqual) {

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
               if (Utils.getItemPropertyValue(item, 'value') !== Utils.getItemPropertyValue(item, 'resetValue')) {
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
         }
      };

      var FilterButton = Control.extend({

         _template: template,
         _oldPanelOpener: null,
         _text: '',
         _historyId: null,

         constructor: function() {
            FilterButton.superclass.constructor.apply(this, arguments);
            this._onFilterChanged = this._onFilterChanged.bind(this);
         },

         _beforeUpdate: function(options) {
            if (!isEqual(this._options.items, options.items)) {
               _private.resolveItems(this, options.items);
            }
         },

         _beforeMount: function(options) {
            if (options.items) {
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
                        template: this._options.template,
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

      FilterButton.getOptionsTypes = function() {
         return {
            itemTemplate: types(Object),
            itemTemplateProperty: types(String),
            additionalTemplate: types(Object),
            additionalTemplateProperty: types(String)
         };
      };

      return FilterButton;
   });
