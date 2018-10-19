/// <amd-module name="Controls/Router" />
import Control = require('Core/Control');
import template = require('wml!Controls/Router/Router');
import RouterHelper from 'Controls/Router/Helper';

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

   _applyNewUrl(mask: string, cfg: object): void {
      this._urlOptions = RouterHelper.calculateUrlParams(mask);
      this.pathUrlOptionsFromCfg(cfg);
   }

   beforeApplyUrl(newLoc: object, oldLoc: object): Promise {
      this._urlOptions = RouterHelper.calculateUrlParams(this._options.mask, newLoc.url);
      let notUndefVal = false;
      for(let i in this._urlOptions) {
         if (this._urlOptions.hasOwnProperty(i)){
            if (this._urlOptions[i] !== undefined) {
               notUndefVal = true;
               break;
            }
         }
      }
      if (notUndefVal) {
         this.pathUrlOptionsFromCfg(this._options);
         return this._notify('succesUrl', [newLoc, oldLoc]);
      }
      this.pathUrlOptionsFromCfg(this._options);
      return this._notify('errorUrl', [newLoc, oldLoc]);
   }

   afterUpForNotify(): Promise {
      this._urlOptions = RouterHelper.calculateUrlParams(this._options.mask, RouterHelper.getRelativeUrl());
      let notUndefVal = false;
      for(let i in this._urlOptions) {
         if (this._urlOptions.hasOwnProperty(i)){
            if (this._urlOptions[i] !== undefined) {
               notUndefVal = true;
               break;
            }
         }
      }
      if (notUndefVal) {
         this.pathUrlOptionsFromCfg(this._options);
         return this._notify('succesUrl',
            [{url:RouterHelper.getRelativeUrl(), prettyUrl:RouterHelper.getRelativeUrl()},
               {url:RouterHelper.getRelativeUrl(), prettyUrl:RouterHelper.getRelativeUrl()}]);
      }
      this.pathUrlOptionsFromCfg(this._options);
      return this._notify('errorUrl', [{url:RouterHelper.getRelativeUrl(), prettyUrl:RouterHelper.getRelativeUrl()},
         {url:RouterHelper.getRelativeUrl(), prettyUrl:RouterHelper.getRelativeUrl()}]);
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