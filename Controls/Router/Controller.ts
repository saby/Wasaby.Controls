/// <amd-module name="Controls/Router/Controller" />

import Control = require('Core/Control');
import template = require('wml!Controls/Router/Controller');
import registrar = require('Controls/Event/Registrar');
import UrlRewriter from 'Controls/Router/UrlRewriter'
import RouterHelper from 'Controls/Router/Helper';
import Router from 'Controls/Router';
import History from 'Controls/Router/History';
import Link = require("./Link");

class Controller extends Control {
   private _registrar: registrar = null;
   private _registrarLink: registrar = null;
   private _currentRoute;
   private _registrarUpdate: registrar = null;

   constructor(cfg: object) {
      super(cfg);
      this._currentRoute = 0;

      /*Controller doesn't work on server*/
      if (typeof window !== 'undefined') {
         this._registrar = new registrar();
         this._registrarUpdate = new registrar();
         this._registrarLink = new registrar();

         let skipped = false;
         window.onpopstate = (event: object) => {
            if (skipped) {
               skipped = false;
               return;
            }
            let currentState = History.getCurrentState();

            if (!event.state || event.state.id < currentState.id) {
               //back
               let prevState = History.getPrevState();
               this.navigate(event, prevState.url, prevState.prettyUrl,
                  () => {
                     History.back();
                  },
                  () => {
                     skipped = true;
                     history.forward();
                  });
            } else {
               //forward
               let nextState = History.getNextState();
               this.navigate(event, nextState.url, nextState.prettyUrl,
                  () => {
                     History.forward();
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
      this._registrarLink.startAsync();
   }

   startAsyncUpdate(newUrl: string, newPrettyUrl: string): Promise {
      let state = History.getCurrentState();
      return this._registrar.startAsync({url: newUrl, prettyUrl: newPrettyUrl},
         {url: state.url, prettyUrl: state.prettyUrl}).then((values) => (values.find((value) => {return value === false;}) !== false ));
   }

   beforeApplyUrl(newUrl: string, newPrettyUrl: string): void {
      let state = History.getCurrentState();
      let newApp = this.getAppFromUrl(newUrl);
      let currentApp = this.getAppFromUrl(state.url);

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
      const currentState = History.getCurrentState();

      if (currentState.url === newUrl || this._navigateProcessed){
         return;
      }
      this._navigateProcessed = true;
      this.beforeApplyUrl(newUrl, prettyUrl).then((accept:boolean)=>{
         if (accept) {
            if (callback) {
               callback();
            } else {
               History.push(newUrl, prettyUrl);
            }
            this.applyUrl();
         } else {
            errback();
         }
         this._navigateProcessed = false;
      });
   }

   routerCreated(event: Event, inst: Router): void {
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
   }

   linkCreated(event: Event, inst: Link): void {
      this._registrarLink.register(event, inst, () => {
         return inst.recalcHref();
      });
   }

   linkDestroyed(event: Event, inst: Link): void {
      this._registrarLink.unregister(event, inst);
   }
}

Controller.prototype._template = template;

export = Controller;