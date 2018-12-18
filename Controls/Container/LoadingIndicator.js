define('Controls/Container/LoadingIndicator', [
   'Core/Control',
   'wml!Controls/Container/LoadingIndicator/LoadingIndicator',
   'Core/helpers/Number/randomId',
   'WS.Data/Collection/List',
   'Core/IoC',
   'css!theme?Controls/Container/LoadingIndicator/LoadingIndicator'
], function(Control, tmpl, randomId, List, IoC) {
   'use strict';

   var module = Control.extend({
      _template: tmpl,
      isLoading: false,
      _isPreloading: false,
      _prevLoading: null,
      _stack: null,
      _isLoadingSaved: null,
      _delay: 2000,

      isGlobal: true,
      message: '',
      scroll: '',
      small: '',
      overlay: 'default',
      mods: '',

      _beforeMount: function(cfg) {
         this._stack = new List();
         this._updateProperties(cfg);
      },
      _afterMount: function(cfg) {
         var self = this;
         if (cfg.mainIndicator) {
            requirejs(['Controls/Popup/Manager/ManagerController'], function(ManagerController) {
               ManagerController.setIndicator(self);
            });
         }
      },
      _beforeUpdate: function(cfg) {
         this._updateProperties(cfg);
      },
      _updateProperties: function(cfg) {
         if (cfg.isGlobal !== undefined) {
            this.isGlobal = cfg.isGlobal;
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

         if (cfg.delay !== undefined) {
            this.delay = cfg.delay;
         }
      },

      toggleIndicator: function(isLoading) {
         IoC.resolve('ILogger').error('LoadingIndicator', 'Используйте события showIndicator/hideIndicator взамен toggleIndicator');
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
               }.bind(this), this.delay || this._delay);
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
         this.toggleIndicator(isLoading, true);
         e.stopPropagation();
      },

      _showHandler: function(event, config, waitPromise) {
         event.stopPropagation();
         return this._show(config, waitPromise);
      },

      _hideHandler: function(event, id) {
         event.stopPropagation();
         return this._hide(id);
      },

      show: function(config, waitPromise) {
         if (!config) {
            return this._toggleIndicator(true, {});
         } else {
            this._show(config, waitPromise);
         }
      },

      _show: function(config, waitPromise) {
         var isUpdate = false;
         if (this._isOpened(config)) {
            isUpdate = true;
            this._removeItem(config.id);
         }
         config = this._prepareConfig(config, waitPromise);
         this._stack.add(config);
         this._toggleIndicator(true, config, isUpdate);

         return config.id;
      },

      hide: function(id) {
         if (!id) {
            this._toggleIndicator(false, {});
         } else {
            this._hide(id);
         }
      },

      _hide: function(id) {
         this._removeItem(id);
         if (this._stack.getCount()) {
            this._toggleIndicator(true, this._stack.at(this._stack.getCount() - 1), true);
         } else {
            this._toggleIndicator(false);
         }
      },

      _isOpened: function(config) {
         // config is not required parameter. If config object is empty we should always create new Indicator due to absence of ID field in config
         if (!config) {
            return false;
         }
         var index = this._getItemIndex(config.id);
         if (index < 0) {
            delete config.id;
         }
         return !!config.id;
      },

      _waitPromiseHandler: function(config) {
         if (this._isOpened(config)) {
            this._hide(config.id);
         }
      },

      _prepareConfig: function(config, waitPromise) {
         if (typeof config !== 'object') {
            config = {
               message: config
            };
         }
         if (!config.hasOwnProperty('overlay')) {
            config.overlay = 'default';
         }
         if (!config.hasOwnProperty('id')) {
            config.id = randomId();
         }

         if (!config.waitPromise && waitPromise) {
            config.waitPromise = waitPromise;
            config.waitPromise.then(this._waitPromiseHandler.bind(this, config));
         }
         return config;
      },

      _removeItem: function(id) {
         var index = this._getItemIndex(id);
         if (index > -1) {
            this._stack.removeAt(index);
         }
      },

      _getItemIndex: function(id) {
         return this._stack.getIndexByValue('id', id);
      },

      _toggleIndicator: function(visible, config, force) {
         clearTimeout(this.delayTimeout);
         if (visible) {
            if (force) {
               this.isLoading = true;
               this._updateProperties(config);
            } else {
               this.delayTimeout = setTimeout(function() {
                  this.isLoading = true;
                  this._updateProperties(config);
                  this._forceUpdate();
               }.bind(this), config.delay || this._delay);
            }
         } else {
            this.isLoading = false;
         }
         this._forceUpdate();
      }
   });

   return module;
});
