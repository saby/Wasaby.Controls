/// <amd-module name="Controls/Router/Controller" />

import Control = require('Core/Control');
import template = require('wml!Controls/Router/Controller');
import registrar = require('Controls/Event/Registrar');
import UrlRewriter from 'Controls/Router/UrlRewriter'
import RouterHelper from 'Controls/Router/Helper';
import Router from 'Controls/Router';

class Controller extends Control {
   private _history: null;
   private _registrar: null;
   private _rootRouters: null;
   private _currentRoute;
   private _registrarUpdate;

   constructor(cfg: object) {
      super(cfg);
      this._rootRouters = [];
      this._currentRoute = 0;

      /*Controller doesn't work on server*/
      if (typeof window !== 'undefined') {

         this._history = [];
         this._registrar = new registrar();
         this._registrarUpdate = new registrar();
         let state = {id: 0, url: RouterHelper.getRelativeUrl(), prettyUrl: RouterHelper.getRelativeUrl()};
         this._history.push(state);

         let skipped = false;
         window.onpopstate = (event: object) => {
            if (skipped) {
               skipped = false;
               return;
            }


            if (!event.state || event.state.id < this._currentRoute) {
               //back
               this.navigate(event, this._history[this._currentRoute - 1].url,
                  this._history[this._currentRoute - 1].prettyUrl, () => {
                     this._currentRoute--;
                     RouterHelper.setRelativeUrl(this._history[this._currentRoute].url);
                  },
                  () => {
                     skipped = true;
                     history.forward();
                  });
            } else {
               //forward
               this.navigate(event, this._history[this._currentRoute+1].url,
                  this._history[this._currentRoute + 1].prettyUrl, () => {
                     this._currentRoute++;
                     RouterHelper.setRelativeUrl(this._history[this._currentRoute].url);
                  },
                  () => {
                     skipped = true;
                     history.back();
                  });
            }

         };
      }
   }

   getAppFromUrl(newUrl: string): string {
      /*TODO:: сюда добавить резолвинг урлов по таблице*/
      if (newUrl.indexOf('Controls-demo/demo.html') > -1) {
         return 'Controls-demo/Demo/Page';
      } else {
         return newUrl.split('/')[1]+'/Index';
      }
   }

   applyUrl(): void {
      this._registrarUpdate.startAsync();
   }

   startAsyncUpdate(newUrl: string, newPrettyUrl: string): Promise {
      return this._registrar.startAsync({url: newUrl, prettyUrl: newPrettyUrl},
         {url: this._history[this._currentRoute].url, prettyUrl: this._history[this._currentRoute].prettyUrl}).then((values) => (values.find((value) => {return value === false;}) !== false ));
   }

   beforeApplyUrl(newUrl: string, newPrettyUrl: string): void {

      let newApp = this.getAppFromUrl(newUrl);
      let currentApp = this.getAppFromUrl(this._history[this._currentRoute].url);

      let lastRoot = this._rootRouters[this._rootRouters.length - 1];

      return this.startAsyncUpdate(newUrl, newPrettyUrl).then((result) => {
         if (newApp === currentApp) {
            return result;
         } else {
            return new Promise((resolve) => {
               require([newApp], () => {

                  const changed = this._notify('changeApplication', [newApp], {bubbling: true});
                  if (!changed) {
                     this.startAsyncUpdate(newUrl, newPrettyUrl).then((ret) => {
                        resolve(ret);
                     });
                  }
                  resolve(true);
               });
            });
         }
      });
   }
   //co.navigate({}, '(.*)asda=:cmp([^&]*)(&)?(.*)?', {cmp:'asdasdasd123'})
   //co.navigate({}, '(.*)/edo/:idDoc([^/?]*)(.*)?', {idDoc:'8985'})
   //co.navigate({}, '/app/:razd/:idDoc([^/?]*)(.*)?', {razd: 'sda', idDoc:'12315'})

   navigate(event: object, newUrl:string, newPrettyUrl:string, callback: any, errback: any): void {

      const prettyUrl = newPrettyUrl || UrlRewriter.getPrettyUrl(newUrl);
      const currentState = this._history[this._currentRoute];

      if (currentState.url === newUrl || this._navigateProcessed){
         return;
      }
      this._navigateProcessed = true;
      this.beforeApplyUrl(newUrl, prettyUrl).then((accept:boolean)=>{
         if (accept) {
            if (callback) {
               callback();
            } else {
               this._currentRoute++;
               this._history.splice(this._currentRoute);

               let state = {
                  id: this._currentRoute,
                  url: newUrl,
                  prettyUrl: prettyUrl
               };
               RouterHelper.setRelativeUrl(newUrl);
               history.pushState(state, prettyUrl, prettyUrl);
               this._history.push(state);
            }
            this.applyUrl();
         } else {
            errback();
         }
         this._navigateProcessed = false;
      });
   }

   routerCreated(event: Event, inst: Router): void {
      if (inst._options.mask[0] === '/') {
         this._rootRouters.push(inst);
      }

      this._registrar.register(event, inst, (newUrl, oldUrl) => {
         return inst.beforeApplyUrl(newUrl, oldUrl);
      });

      this._registrarUpdate.register(event, inst, (newUrl, oldUrl) => {
         return inst.applyNewUrl(newUrl, oldUrl);
      });
   }

   routerDestroyed(event: Event, inst: Router, mask: string): void {
      this._registrar.unregister(event, inst);
      this._registrarUpdate.unregister(event, inst);

      if (inst._options.mask[0] === '/') {
         if (false){//tODO:: какое-то усовие, что !inst._closeByMe && resolveMask(this._history[this._currentRoute].url, mask)) {
            //TODO:: только делать pushState
            this._currentRoute--;
            history.back();
         }
         this._rootRouters.splice(-1);
      }

   }
}

Controller.prototype._template = template;

export = Controller;