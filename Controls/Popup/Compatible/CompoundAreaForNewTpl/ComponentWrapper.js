define('Controls/Popup/Compatible/CompoundAreaForNewTpl/ComponentWrapper', [
   'Core/Control',
   'wml!Controls/Popup/Compatible/CompoundAreaForNewTpl/ComponentWrapper/ComponentWrapper'
], function(Control, template) {

   return Control.extend({
      _template: template,
      _fillCallbacks: function(cfg) {
         this._onCloseHandler = cfg._onCloseHandler;
         this._onResizeHandler = cfg._onResizeHandler;
         this._onResultHandler = cfg._onResultHandler;
         this._onRegisterHandler = cfg._onRegisterHandler;
      },
      _beforeMount: function (cfg) {
         this._fillCallbacks(cfg);
      },
      _beforeUpdate: function (cfg) {
         this._fillCallbacks(cfg);
      }
   });
});
