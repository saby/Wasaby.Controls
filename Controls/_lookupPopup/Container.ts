import Control = require('Core/Control');
import template = require('wml!Controls/_lookupPopup/Container');
import ControllerContext = require('Controls/_lookupPopup/__ControllerContext');
import ContextOptions = require('Controls/Container/Data/ContextOptions');
import chain = require('Types/chain');
import Utils = require('Types/util');
import {Controller as SourceController} from 'Controls/source';
import selectionToRecord = require('Controls/Container/MultiSelector/selectionToRecord');
import Deferred = require('Core/Deferred');

/**
 * Container transfers selected items fromControls/lookupPopup:Controller to a specific list.
 * Loading data by selectedKeys on selection complete.
 * Must used inside Controls/lookupPopup:Controller.
 * In one Controls/lookupPopup:Controller can be used some Containers.
 *
 * More information you can read <a href='/doc/platform/developmentapl/interface-development/controls/layout-selector-stack/'>here</a>.
 *
 * <a href="/materials/demo/demo-ws4-engine-selector-browser">Here</a> you can see a demo.
 *
 * @class Controls/_lookupPopup/Container
 * @extends Core/Control
 * @control
 * @mixes Controls/interface/ISource
 * @public
 * @author Герасимов Александр Максимович
 */

/**
 * @name Controls/_lookupPopup/Container#selectionFilter
 * @cfg {Function} Function that filters selectedItems from Controls/lookupPopup:Controller for a specific list.
 * @remark By default selectionFilter option is setted as function that always returns true.
 * @example
 *
 * WML:
 * <pre>
 *    <Controls.lookupPopup:Container selectionFilter="{{_selectionFilter}}">
 *        ...
 *    </Controls.lookupPopup:Container>
 * </pre>
 *
 * JS:
 * <pre>
 *     _selectionFilter: function(item, index) {
 *        let filterResult = false;
 *
 *        if (item.get('Компания')) {
 *            filterResult = true;
 *        }
 *
 *        return filterResult;
 *     }
 * </pre>
 */

/**
 * @name Controls/_lookupPopup/Container#selectionType
 * @cfg {String} Type of records that can be selected.
 * @variant node only nodes are available for selection
 * @variant leaf only leafs are available for selection
 * @variant all all types of records are available for selection
 * @example
 * In this example only leafs are available for selection.
 * <pre>
 *    <Controls.lookupPopup:ListContainer selectionType="leaf">
 *        ...
 *    </Controls.lookupPopup:ListContainer>
 * </pre>
 */



      var SELECTION_TYPES = ['all', 'leaf', 'node'];

      var _private = {
         getFilteredItems: function(items, filterFunc) {
            return chain.factory(items).filter(filterFunc).value();
         },

         getKeysByItems: function(items, keyProperty) {
            return chain.factory(items).reduce(function(result, item) {
               result.push(item.get(keyProperty));
               return result;
            }, []);
         },

         getFilterFunction: function(func) {
            return func ? func : function() {
               return true;
            };
         },

         getSelectedKeys: function(options, context) {
            var items = _private.getFilteredItems(context.selectorControllerContext.selectedItems, _private.getFilterFunction(options.selectionFilter));
            return _private.getKeysByItems(items, context.dataOptions.keyProperty);
         },

         getSourceController: function(source, navigation) {
            return new SourceController({
               source: source,
               navigation: navigation
            });
         },

         getEmptyItems: function(currentItems) {
            /* make clone and clear to save items format */
            var emptyItems = currentItems.clone();
            emptyItems.clear();
            return emptyItems;
         },

         getValidSelectionType: function(selectionType) {
            let type;

            if (SELECTION_TYPES.indexOf(selectionType) !== -1) {
               type = selectionType;
            } else {
               type = 'all'
            }

            return type;
         },

         prepareFilter: function(filter:object, selection, searchParam:string|undefined):object {
            filter = Utils.object.clone(filter);

            //FIXME https://online.sbis.ru/opendoc.html?guid=e8bcc060-586f-4ca1-a1f9-1021749f99c2
            if (searchParam) {
               delete filter[searchParam];
            }
            filter.selection = selection;
            return filter;
         },

         prepareResult: function(result, selectedKeys, keyProperty) {
            return {
               resultSelection: result,
               initialSelection: selectedKeys,
               keyProperty: keyProperty
            };
         }

      };

      var Container = Control.extend({

         _template: template,
         _selectedKeys: null,
         _selection: null,
         _excludedKeys: null,

         _beforeMount: function(options, context) {
            this._selectedKeys = _private.getSelectedKeys(options, context);
            this._excludedKeys = [];
            this._items = context.dataOptions.items;

            this._initialSelectedKeys = this._selectedKeys.slice();
         },

         _beforeUpdate: function(newOptions, context) {
            var currentSelectedItems = this.context.get('selectorControllerContext').selectedItems;
            var newSelectedItems = context.selectorControllerContext.selectedItems;

            if (currentSelectedItems !== newSelectedItems) {
               this._selectedKeys = _private.getSelectedKeys(newOptions, context);
            }
         },

         _selectComplete: function():void {
            const self = this;
            const dataOptions = this.context.get('dataOptions');
            const keyProperty = dataOptions.keyProperty;

            let loadDef;

            function prepareResult(result) {
               return _private.prepareResult(result, self._initialSelectedKeys, keyProperty);
            }

            if (this._selectedKeys.length || this._excludedKeys.length) {
               const source = dataOptions.source;
               const adapter = source.getAdapter();
               const sourceController = _private.getSourceController(source, dataOptions.navigation);
               const selection = {
                  selected: this._selectedKeys,
                  excluded: this._excludedKeys
               };

               loadDef = sourceController.load(
                   _private.prepareFilter(
                       dataOptions.filter,
                       selectionToRecord(selection, adapter, _private.getValidSelectionType(this._options.selectionType)),
                       self._options.searchParam
                   )
               );

               loadDef.addCallback(function(result) {
                  return prepareResult(result);
               });
            } else {
               loadDef = Deferred.success(prepareResult(_private.getEmptyItems(self._items)));
            }

            this._notify('selectionLoad', [loadDef], {bubbling: true});
         },

         _selectedKeysChanged: function(event, selectedKeys, added, removed) {
            this._notify('selectedKeysChanged', [selectedKeys, added, removed], {bubbling: true});
         },

         _excludedKeysChanged: function(event, excludedKey, added, removed) {
            this._notify('excludedKeysChanged', [excludedKey, added, removed], {bubbling: true});
         }

      });

      Container.contextTypes = function() {
         return {
            selectorControllerContext: ControllerContext,
            dataOptions: ContextOptions
         };
      };

      Container._private = _private;

      export = Container;

