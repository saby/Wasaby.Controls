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
      this._recalcHref(cfg);
   }

   _afterMount(): void {
      this._notify('linkCreated', [this], { bubbling: true });
   }

   _beforeUpdate(cfg: object): void {
      this._recalcHref(cfg);
   }

   _beforeUnmount() {
      this._notify('linkDestroyed', [this], { bubbling: true });
   }

   _recalcHref(cfg: object): void {
      this._href = RouterHelper.calculateHref(cfg.href, cfg);
      if (cfg.prettyUrl) {
         this._prettyhref = RouterHelper.calculateHref(cfg.prettyUrl, cfg);
      } else {
         this._prettyhref = undefined;
      }
   }

   recalcHref(): void {
      this._recalcHref(this._options);
      this._forceUpdate();
   }
}

Link.prototype._template = template;
export = Link;