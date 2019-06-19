import Control = require('Core/Control');
import template = require('wml!Controls/_compatiblePopup/CompoundAreaForNewTpl/ComponentWrapper/ComponentWrapper');
import 'css!theme?Controls/compatiblePopup';

interface ITemplateOptions {
   _onCloseHandler: Function;
   _onResizeHandler: Function;
   _onResultHandler: Function;
   _onRegisterHandler: Function;
   _onMaximizedHandler: Function;
}

interface IComponentWrapperOptions {
   templateOptions: ITemplateOptions;
}

const ComponentWrapper = Control.extend({
   _template: template,
   _fillCallbacks(cfg: IComponentWrapperOptions): void {
      this._onCloseHandler = cfg.templateOptions._onCloseHandler;
      this._onResizeHandler = cfg.templateOptions._onResizeHandler;
      this._onResultHandler = cfg.templateOptions._onResultHandler;
      this._onRegisterHandler = cfg.templateOptions._onRegisterHandler;
      this._onMaximizedHandler = cfg.templateOptions._onMaximizedHandler;
   },
   finishPendingOperations(): Promise<null> {
      return this._children.PendingRegistrator.finishPendingOperations();
   },
   hasRegisteredPendings(): boolean {
      return this._children.PendingRegistrator._hasRegisteredPendings();
   },
   _beforeMount(cfg: IComponentWrapperOptions): void {
      this._fillCallbacks(cfg);
      this.setTemplateOptions(cfg.templateOptions);
   },
   _beforeUpdate(cfg: IComponentWrapperOptions): void {
      this._fillCallbacks(cfg);
   },
   setTemplateOptions(templateOptions: ITemplateOptions): void {
      this._templateOptions = templateOptions;
   }
});

export default ComponentWrapper;
