/// <amd-module name="Controls/Router/Link" />
import Control = require('Core/Control');
import template = require('wml!Controls/Router/Link');
import UrlRewriter from 'Controls/Router/UrlRewriter'
import RouterHelper from 'Controls/Router/Helper';

class Link extends Control {
   clickHandler(e:object): void {
      e.preventDefault();
      e.stopPropagation();

      this._notify('routerUpdated', [this._href], { bubbling: true });
   }

   _beforeMount(cfg: object): void {
      this._href = RouterHelper.calculateHref(cfg.href, cfg);
      if (cfg.prettyUrl) {
         this._prettyhref = RouterHelper.calculateHref(cfg.prettyUrl, cfg);
         UrlRewriter.push(this._href, this._prettyhref);
      }
   }

   _beforeUpdate(cfg: object): void {
      this._href = RouterHelper.calculateHref(cfg.href, cfg);
      if (cfg.prettyUrl) {
         this._prettyhref = RouterHelper.calculateHref(cfg.prettyUrl, cfg);
         UrlRewriter.push(this._href, this._prettyhref);
      }
   }
}

Link.prototype._template = template;
export = Link;