define('Controls/Container/LoadingIndicator', [
   'Core/Control',
   'wml!Controls/Container/LoadingIndicator/LoadingIndicator',
   'css!Controls/Container/LoadingIndicator/LoadingIndicator'
], function(Control, tmpl) {
   'use strict';

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

      _useSpinnerSaved: null,

      _beforeMount: function(cfg) {
         this._updateProperties(cfg);
      },
      _beforeUpdate: function(cfg) {
         this._updateProperties(cfg);
         var isLoadingStateChanged = this.isLoading !== this._prevLoading;

         if (this.isLoading) {
            if (isLoadingStateChanged) {
               // goes to hidden loading state
               this._useSpinnerSaved = this.useSpinner;
            }

            // if its hidden loading state now, we don't show spinner
            if (this._useSpinnerSaved !== null) {
               this.useSpinner = false;
            }

            if (isLoadingStateChanged) {
               clearTimeout(this.delayTimeout);
               this.delayTimeout = setTimeout(function() {
                  if (this.isLoading) {
                     // goes to show loading state

                     // return spinner value
                     this.useSpinner = this._useSpinnerSaved;
                     // clear saved spinner state
                     this._useSpinnerSaved = null;
                     this._forceUpdate();
                  }
               }.bind(this), cfg.delay);
            }
         } else {
            // goes to idle state
            clearTimeout(this.delayTimeout);
            this._useSpinnerSaved = null;
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

   module.getDefaultOptions = function() {
      return {
         delay: 2000
      };
   };

   return module;
});
