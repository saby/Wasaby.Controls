/// <amd-module name="Controls/Router" />
import Control = require('Core/Control');
import template = require('wml!Controls/Router/Router');
import RouterHelper from 'Controls/Router/Helper';
import History from 'Controls/Router/History';

class Router extends Control {
   private _urlOptions = null;

   pathUrlOptionsFromCfg(cfg:object): void {
      for (let i in cfg) {
         if (cfg.hasOwnProperty(i) && i !== 'mask' &&
            i !== 'content' && i !== '_logicParent') {
            this._urlOptions[i] = cfg[i];
         }
      }
   }

   /**
    * return flag = resolved params from URL
    */
   _wasResolvedParam(): boolean {
      let notUndefVal = false;
      for(let i in this._urlOptions) {
         if (this._urlOptions.hasOwnProperty(i)){
            if (this._urlOptions[i] !== undefined) {
               notUndefVal = true;
               break;
            }
         }
      }
      return notUndefVal;
   }


   _applyNewUrl(mask: string, cfg: object): boolean {
      this._urlOptions = RouterHelper.calculateUrlParams(mask);
      let notUndefVal = this._wasResolvedParam();
      this.pathUrlOptionsFromCfg(cfg);
      return notUndefVal;
   }

   beforeApplyUrl(newLoc: object, oldLoc: object): Promise {
      this._urlOptions = RouterHelper.calculateUrlParams(this._options.mask, newLoc.url);
      if (this._wasResolvedParam()) {
         this.pathUrlOptionsFromCfg(this._options);
         return this._notify('succesUrl', [newLoc, oldLoc]);
      }
      this.pathUrlOptionsFromCfg(this._options);
      return this._notify('errorUrl', [newLoc, oldLoc]);
   }

   afterUpForNotify(): Promise {
      this._urlOptions = RouterHelper.calculateUrlParams(this._options.mask, RouterHelper.getRelativeUrl());
      let notUndefVal = this._wasResolvedParam();
      this.pathUrlOptionsFromCfg(this._options);

      const currentState = History.getCurrentState();
      const prevState = History.getPrevState();
      if (notUndefVal) {
         return this._notify('succesUrl', [currentState, prevState]);
      }
      return this._notify('errorUrl', [currentState, prevState]);
   }

   applyNewUrl(): void {
      this._forceUpdate();
   }

   _beforeMount(cfg: object): void {
      this._urlOptions = {};
      this._applyNewUrl(cfg.mask, cfg);
   }

   _afterMount(): void {
      this._notify('routerCreated', [this], { bubbling: true });
      this.afterUpForNotify();
   }

   _beforeUpdate(cfg: object) {
      this._applyNewUrl(cfg.mask, cfg);
   }

   _beforeUnmount() {
      this._notify('routerDestroyed', [this], { bubbling: true });
   }
}

Router.prototype._template = template;
export = Router;