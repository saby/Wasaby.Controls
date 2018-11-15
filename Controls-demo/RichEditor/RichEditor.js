define('Controls-demo/RichEditor/RichEditor', [
   'Core/Control',
   'wml!Controls-demo/RichEditor/RichEditor'
], function(Control, template) {
   var RichEditorDemo = Control.extend({
      _template: template,
      _readOnly: false,

      _beforeMount: function() {
         this.json = [['p']];
         this.jsonStringify = JSON.stringify(this.json);
      },

      valueChangedHandler: function(e, json) {
         this.json = json;
         this.jsonStringify = JSON.stringify(json);
      },

      _clickHandler: function() {
         this._readOnly = !this._readOnly;
      }
   });

   return RichEditorDemo;
});
