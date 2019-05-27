define('Controls/Popup/Compatible/CompoundAreaForNewTpl/ComponentWrapper', [
   'Core/Control',
   'wml!Controls/Popup/Compatible/CompoundAreaForNewTpl/ComponentWrapper/ComponentWrapper',
   'css!Controls/Popup/Compatible/CompoundAreaForNewTpl/ComponentWrapper/ComponentWrapper'
], function(Control, template) {
   return Control.extend({
      _template: template,
      _fillCallbacks: function(cfg) {
         this._onCloseHandler = cfg.templateOptions._onCloseHandler;
         this._onResizeHandler = cfg.templateOptions._onResizeHandler;
         this._onResultHandler = cfg.templateOptions._onResultHandler;
         this._onRegisterHandler = cfg.templateOptions._onRegisterHandler;
         this._onMaximizedHandler = cfg.templateOptions._onMaximizedHandler;
      },
      finishPendingOperations: function() {
         return this._children.PendingRegistrator.finishPendingOperations();
      },
      _beforeMount: function(cfg) {
         this._fillCallbacks(cfg);
         this.setTemplateOptions(cfg.templateOptions);
      },
      _beforeUpdate: function(cfg) {
         this._fillCallbacks(cfg);
      },
      setTemplateOptions: function(templateOptions) {
         this._templateOptions = templateOptions;
      }
   });
});
