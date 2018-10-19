/// <amd-module name="Controls/Router/Link" />
import Control = require('Core/Control');
import template = require('wml!Controls/Router/Link');
import RouterHelper from 'Controls/Router/Helper';

class Link extends Control {
   clickHandler(e:object): void {
      e.preventDefault();
      e.stopPropagation();

      this._notify('routerUpdated', [this._href, this._prettyhref], { bubbling: true });
   }

   _beforeMount(cfg: object): void {
      this._href = RouterHelper.calculateHref(cfg.href, cfg);
      if (cfg.prettyUrl) {
         this._prettyhref = RouterHelper.calculateHref(cfg.prettyUrl, cfg);
      } else {
         this._prettyhref = undefined;
      }
   }

   _beforeUpdate(cfg: object): void {
      this._href = RouterHelper.calculateHref(cfg.href, cfg);
      if (cfg.prettyUrl) {
         this._prettyhref = RouterHelper.calculateHref(cfg.prettyUrl, cfg);
      } else {
         this._prettyhref = undefined;
      }
   }
}

Link.prototype._template = template;
export = Link;