import Control = require('Core/Control');
import template = require('tmpl!Controls/_lookupPopup/Controller');
import Utils = require('Types/util');
import SelectorContext = require('Controls/_lookupPopup/__ControllerContext');
import collection = require('Types/collection');
import ParallelDeferred = require('Core/ParallelDeferred');
import chain = require('Types/chain');



      var _private = {
         prepareItems: function(items) {
            return items ? Utils.object.clone(items) : new collection.List();
         },

         addItemToSelected: function(item, selectedItems, keyProperty) {
            var index = selectedItems.getIndexByValue(keyProperty, item.get(keyProperty));

            if (index === -1) {
               selectedItems.add(item);
            } else {
               selectedItems.replace(item, index);
            }
         },

         removeFromSelected: function(itemId, selectedItems, keyProperty) {
            var index = selectedItems.getIndexByValue(keyProperty, itemId);

            if (index !== -1) {
               selectedItems.removeAt(index);
            }
         },

         processSelectionResult: function(result, selectedItems) {
            var i;
            var initialSelection;
            var resultSelection;
            var keyProperty;

            if (result) {
               for (i in result) {
                  if (result.hasOwnProperty(i)) {
                     initialSelection = result[i].initialSelection;
                     resultSelection = result[i].resultSelection;
                     keyProperty = result[i].keyProperty;

                     if (_private.isSelectionChanged(initialSelection, resultSelection, keyProperty)) {
                        chain.factory(initialSelection).each(function(itemId) {
                           _private.removeFromSelected(itemId, selectedItems, keyProperty);
                        });
                        chain.factory(resultSelection).each(function(item) {
                           _private.addItemToSelected(item, selectedItems, keyProperty);
                        });
                     }
                  }
               }
            }
         },

         isSelectionChanged: function(initialSelection, resultSelection, keyProperty) {
            var isChanged = false;

            if (initialSelection.length !== resultSelection.getCount()) {
               isChanged = true;
            }

            if (!isChanged) {
               resultSelection.each(function(item) {
                  if (!isChanged && initialSelection.indexOf(item.get(keyProperty)) === -1) {
                     isChanged = true;
                  }
               });
            }

            return isChanged;
         }
      };

      var Controller = Control.extend({

         _template: template,
         _selectedItems: null,
         _selectionLoadDef: null,

         _beforeMount: function(options) {
            this._selectedItems = _private.prepareItems(options.selectedItems);
         },

         _beforeUpdate: function(newOptions) {
            if (this._options.selectedItems !== newOptions.selectedItems) {
               this._selectedItems = _private.prepareItems(newOptions.selectedItems);
            }
         },

         _selectComplete: function() {
            var self = this;
            var selectCallback = function() {
               self._notify('sendResult', [self._selectedItems], {bubbling: true});
               self._notify('close', [], {bubbling: true});
            };

            this._children.selectComplete.start();

            if (this._selectionLoadDef) {
               this._selectionLoadDef.done().getResult().addCallback(function(result) {
                  _private.processSelectionResult(result, self._selectedItems);
                  selectCallback();
                  self._selectionLoadDef = null;
                  return result;
               });
            } else {
               selectCallback();
            }
         },

         _selectionLoad: function(event, deferred) {
            if (!this._selectionLoadDef) {
               this._selectionLoadDef = new ParallelDeferred();
            }
            this._selectionLoadDef.push(deferred);
         },

         _getChildContext: function() {
            return {
               selectorControllerContext: new SelectorContext(this._selectedItems)
            };
         }

      });

      Controller._private = _private;

      export = Controller;


