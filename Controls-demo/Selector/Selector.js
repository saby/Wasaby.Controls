define('Controls-demo/Selector/Selector',
   [
      'Core/Control',
      'tmpl!Controls-demo/Selector/Selector',
      'css!Controls-demo/Selector/Selector'
   ],
   
   function(Control, template) {
      
      'use strict';
      
      
      return Control.extend({
         
         _template: template,
         _flatListResult: null,
         _flatListMultiSelectResult: null,
         
         _beforeMount: function() {
            this._flatListCallback = this._flatListCallback.bind(this);
            this._flatListMultiSelectCallback = this._flatListMultiSelectCallback.bind(this);
            this._flatListMultiSelectTabsCallback = this._flatListMultiSelectTabsCallback.bind(this);
         },
         
         _flatListCallback: function(result) {
            this._flatListResult = result;
            this._forceUpdate();
         },
         
         _flatListMultiSelectCallback: function(result) {
            this._flatListMultiSelectResult = result;
            this._forceUpdate();
         },
   
         _flatListMultiSelectTabsCallback: function(result) {
            this._flatListMultiSelectTabResult = result;
            this._forceUpdate();
         },
         
         _openFlatListSelector: function(event, isMultiSelect, openerName) {
            this._children[openerName].open({templateOptions: {
               multiSelect: isMultiSelect,
               selectedItems: isMultiSelect ? this._flatListMultiSelectResult : this._flatListResult
            }});
         },
   
         _openFlatListSelectorWithTab: function() {
            this._children.flatListMultiSelectorTabOpener.open({templateOptions: {
               multiSelect: true,
               selectedItems: this._flatListMultiSelectTabResult
            }});
         }
         
      });
      
   });
