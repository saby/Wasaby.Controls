define('Controls/Container/LoadingIndicator', [
   'Core/Control',
   'tmpl!Controls/Container/LoadingIndicator/LoadingIndicator',
   'css!Controls/Container/LoadingIndicator/LoadingIndicator'
], function(Control, tmpl) {
   'use strict';

   var DEFAULT_DELAY = 2000;

   var module = Control.extend({
      _template: tmpl,
      isLoading: false,

      isGlobal: true,
      useSpinner: true,
      message: '',
      scroll: '',
      small: '',
      overlay: 'default',
      mods: '',

      _beforeMount: function(cfg) {
         this._updateProperties(cfg);
      },
      _beforeUpdate: function(cfg) {
         this._updateProperties(cfg);
         if (this.isLoading !== this._prevLoading && this.isLoading) {
            var self = this;
            var useSpinner = self.useSpinner;
            self.useSpinner = false;
            setTimeout(function() {
               if (self.isLoading) {
                  self.useSpinner = useSpinner;
                  self._forceUpdate();
               }
            }, DEFAULT_DELAY);
         }
         this._prevLoading = this.isLoading;
      },
      _updateProperties: function(cfg) {
         if (cfg.isGlobal !== undefined) {
            this.isGlobal = cfg.isGlobal;
         }
         if (cfg.useSpinner !== undefined) {
            this.useSpinner = cfg.useSpinner;
         }
         if (cfg.message !== undefined) {
            this.message = cfg.message;
         }
         if (cfg.scroll !== undefined) {
            this.scroll = cfg.scroll;
         }
         if (cfg.small !== undefined) {
            this.small = cfg.small;
         }
         if (cfg.overlay !== undefined) {
            this.overlay = cfg.overlay;
         }
         if (cfg.mods !== undefined) {
            this.mods = cfg.mods;
         }
      },

      toggleIndicator: function(isLoading) {
         this._prevLoading = this.isLoading;
         this.isLoading = isLoading;
         this._forceUpdate();
      },
      _toggleIndicatorHandler: function(e, isLoading) {
         this.toggleIndicator(isLoading);
         e.stopPropagation();
      }
   });

   return module;
});
