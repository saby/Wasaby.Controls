import Control = require('Core/Control');
import template = require('wml!Controls/_compatiblePopup/CompoundAreaForNewTpl/ComponentWrapper/ComponentWrapper');
import 'css!theme?Controls/compatiblePopup';

const ComponentWrapper = Control.extend({
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

export default ComponentWrapper;
