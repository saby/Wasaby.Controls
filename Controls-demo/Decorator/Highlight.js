define('Controls-demo/Decorator/Highlight',
   [
      'Core/Control',
      'json!Controls-demo/Decorator/Highlight/Highlight',
      'tmpl!Controls-demo/PropertyGrid/DemoPG'
   ],

   function(Control, config, template) {
      'use strict';

      var _private = {
         CONTENT: 'Controls/decorator:Highlight'
      };

      var Highlight = Control.extend({
         _template: template,

         _metaData: null,

         _dataObject: null,

         _componentOptions: null,

         _content: _private.CONTENT,

         _beforeMount: function() {
            this._dataObject = {
               searchMode: {
                  emptyText: 'none',
                  placeholder: 'select',
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 0
               }
            };
            this._componentOptions = {
               highlight: 'hello',
               text: 'Hello world!!!',
               searchMode: 'substring',
               class: 'controls-Highlight_highlight'
            };
            this._metaData = config[_private.CONTENT].properties['ws-config'].options;
         }
      });

      return Highlight;
   });
