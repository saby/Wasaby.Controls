define('js!WSControls/Controllers/RecordsetListSelector', [
   'js!WSControls/Controllers/BaseListSelector'
], function(BaseListSelector) {
   var RecordsetListSelector = BaseListSelector.extend({
      constructor: function(cfg) {
         RecordsetListSelector.superclass.constructor.apply(this, arguments);
         /*Распихивание данных*/
         this._options['selectedKey'] = cfg.selectedKey || null;
         this.selectedKey = this._options.selectedKey;
      }
   });
   return RecordsetListSelector;
});