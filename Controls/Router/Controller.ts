/**
 * Created by dv.zuev on 12.09.2018.
 */
import Control = require('Core/Control');
import template = require('wml!Controls/Router/Controller');
import registrar = require('Controls/Event/Registrar');
import RouterHelper = require('Controls/Router/RouterHelper');

class Controller extends Control {
   private _history: null;
   private _registrar: null;
   private _rootRouters: null;

   constructor(cfg: object) {
      super(cfg);
      this._rootRouters = [];
      /*Controller doesn't work on server*/
      if (typeof window !== 'undefined') {
         this._history = [];
         this._registrar = new registrar();

         window.onpopstate = (event: object) => {
            this.applyNewUrl(RouterHelper.getRelativeUrl());
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

   getRootApp(): any {
      let rootNodes = document.getElementsByTagName('html')[0].controlNodes;
      let last = rootNodes.find((element) => { if (element.control._moduleName === 'Controls/Application/Core'){
         return element;
      }});
      return last.control;
   }

   applyNewUrl(newUrl: string): void {

      let newApp = this.getAppFromUrl(newUrl);
      let rootApp = this.getRootApp();
      /*rewrite важнее, поэтому сначала сравним не поменялось ли приложение*/

      /*TODO:: закрыть панель если открыта панель*/
      let lastRoot = this._rootRouters[this._rootRouters.length - 1];

      require([newApp], () => {
         const changed = this._notify('changeApplication', [newApp], {bubbling: true});
         if (!changed) {
            this._registrar.start(RouterHelper.getRelativeUrl());
         }
      });
   }
   //co.navigate({}, '(.*)asda=:cmp([^&]*)(&)?(.*)?', {cmp:'asdasdasd123'})
   //co.navigate({}, '(.*)/edo/:idDoc([^/?]*)(.*)?', {idDoc:'8985'})
   //co.navigate({}, '/app/:razd/:idDoc([^/?]*)(.*)?', {razd: 'sda', idDoc:'12315'})

   navigate(event: object, newUrl: string): void {
      history.pushState({}, newUrl, newUrl);
      this.applyNewUrl(newUrl);
   }

   routerCreated(event: object, inst: object): void {
      if (inst._options.mask[0] === '/') {

         /*TODO:: вот здесь нужно понять что открылась панель*/
         this._rootRouters.push(inst);
      } else {
         this._registrar.register(event, inst, (newUrl) => {
            inst.applyNewUrl(newUrl);
         });
      }
   }

   routerDestroyed(event: object, inst: object): void {
      this._registrar.unregister(event, inst);

   }
}

Controller.prototype._template = template;

export = Controller;