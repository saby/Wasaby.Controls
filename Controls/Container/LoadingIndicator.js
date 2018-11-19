define('Controls/Container/LoadingIndicator', [
   'Core/Control',
   'wml!Controls/Container/LoadingIndicator/LoadingIndicator',
   'css!theme?Controls/Container/LoadingIndicator/LoadingIndicator'
], function(Control, tmpl) {
   'use strict';

   var module = Control.extend({
      _template: tmpl,
      isLoading: false,
      _isPreloading: false,
      _prevLoading: null,

      isGlobal: true,
      useSpinner: true,
      message: '',
      scroll: '',
      small: '',
      overlay: 'default',
      mods: '',

      _isLoadingSaved: null,

      _beforeMount: function(cfg) {
         this._updateProperties(cfg);
      },
      _beforeUpdate: function(cfg) {
         this._updateProperties(cfg);
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
         this._isPreloading = isLoading;

         var isLoadingStateChanged = this._isPreloading !== this._prevLoading;

         if (this._isPreloading) {
            if (isLoadingStateChanged) {
               // goes to hidden loading state
               this._isLoadingSaved = this._isPreloading;
            }

            // if its hidden loading state now, we don't show spinner
            if (this._isLoadingSaved !== null) {
               this.isLoading = false;
            }

            if (isLoadingStateChanged) {
               clearTimeout(this.delayTimeout);
               this.delayTimeout = setTimeout(function() {
                  if (this._isPreloading) {
                     // goes to show loading state

                     // return spinner value
                     this.isLoading = this._isLoadingSaved;

                     // clear saved spinner state
                     this._isLoadingSaved = null;
                     this._forceUpdate();
                  }
               }.bind(this), this._options.delay);
            }
         } else {
            // goes to idle state
            clearTimeout(this.delayTimeout);
            this._isLoadingSaved = null;
            this.isLoading = this._isPreloading;
            this._forceUpdate();
         }
         this._prevLoading = this._isPreloading;
      },
      _toggleIndicatorHandler: function(e, isLoading) {
         this.toggleIndicator(isLoading);
         e.stopPropagation();
      }
   });

   module.getDefaultOptions = function() {
      return {
         delay: 2000
      };
   };

   return module;
});
