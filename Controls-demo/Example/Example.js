define('Controls-demo/Example/Example',
   [
      'Core/Control',
      'WS.Data/Source/Memory',
      'tmpl!Controls-demo/Example/Example'
   ],
   function(Control, template, MemorySource) {

      'use strict';

      var source = new MemorySource({
         data: [
            {module: 'Input/Password'}
         ],
         idProperty: 'module'
      });

      var Example = Control.extend({
         _template: template,

         _currentModule: null,

         _source: null,

         _beforeMount: function() {
            this._source = source;
         },

         _clickHandler: function(event, module) {
            this._currentModule = require('Controls-demo/Example/' + module);
         },
         
         _dblClickHandler: function() {
            
         }
      });

      return Example;
   }
);
