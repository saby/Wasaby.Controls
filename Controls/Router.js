define('Controls/Router', [
   'Core/Control',
   'wml!Controls/Router/Router',
   'Core/vdom/Synchronizer/resources/DOMEnvironment',
   'Controls/Router/RouterHelper'
], function(Control, tmpl, DOMEnvironment, RouterHelper) {
   'use strict';

   var module = Control.extend({
      _template: tmpl,
      _urlOptions: null,

      _applyNewUrl: function(mask, cfg) {
         this._urlOptions = RouterHelper.calculateUrlParams(mask);

         // todo тут прокидываются прилетевшие сверху опции, если это не mask content _logicParent
         for (var i in cfg) {
            if (cfg.hasOwnProperty(i) && i !== 'mask' &&
               i !== 'content' && i !== '_logicParent') {
               this._urlOptions[i] = cfg[i];
            }
         }
      },

      applyNewUrl: function() {
         this._applyNewUrl(this._options.mask, this._options);
         this._forceUpdate();
      },

      _beforeMount: function(cfg) {
         this._urlOptions = {};
         this._applyNewUrl(cfg.mask, cfg);
      },
      _afterMount: function() {
         this._notify('routerCreated', [this], { bubbling: true });
      },
      _beforeUpdate: function(cfg) {
         this._applyNewUrl(cfg.mask, cfg);
      },

      _beforeUnmount: function() {
         this._notify('routerDestroyed', [this], { bubbling: true });
      }
   });

   return module;
});
