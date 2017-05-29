define('js!WSControls/Controllers/DataSourceController', [
   'Core/Abstract',
   'js!SBIS3.CONTROLS.Utils.SourceUtil'
], function(Abstract, SourceUtil) {
   var BaseListSelector = Abstract.extend({
      _useNativeAsMain: true,
      constructor: function(cfg) {

         /*Распихивание данных*/
         this._options = {
            dataSource : cfg.dataSource ? cfg.dataSource : null,
            items : cfg.items ? cfg.items : null
         };
         this.dataSource = SourceUtil.prepareSource(this._options.dataSource);
         this.items = this._options.items;
      },

      reload: function() {

      },

      setItems: function(items) {
         this.items = items;
      }
   });
   return BaseListSelector;
});