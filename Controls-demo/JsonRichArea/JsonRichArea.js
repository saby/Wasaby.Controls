define('Controls-demo/JsonRichArea/JsonRichArea', [
   'Core/Control',
   'wml!Controls-demo/JsonRichArea/JsonRichArea'
], function(Control, template) {
   'use strict';

   return Control.extend({
      _template: template,
      json: null,
      jsonStringify: undefined,

      _beforeMount: function() {
         this.json = [['p']];
         this.jsonStringify = JSON.stringify(this.json);
      },

      changeJson: function(e, json) {
         this.json = json;
         this.jsonStringify = JSON.stringify(json);
      }
   }
   );
});
