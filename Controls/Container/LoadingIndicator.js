define('Controls/Container/LoadingIndicator', [
   'Core/Control',
   'wml!Controls/Container/LoadingIndicator/LoadingIndicator',
   'Core/helpers/Number/randomId',
   'Types/collection',
   'Env/Env',
   'css!theme?Controls/Container/LoadingIndicator/LoadingIndicator'
], function(Control, tmpl, randomId, collection, Env) {
   'use strict';

   /**
    * Container for content that can show loading indicator.
    * It can be local using for covering it's own content or global using for covering whole page.
    * @remark
    * LoadingIndicator is waiting 2 events: showIndicator and hideIndicator.
    *
    * showIndicator is using for request of indicator showing. It may be some requests.
    * Requests compose stack where last handled request is using by LoadingIndicator for indicator showing.
    * Indicator becomes invisible when stack will be empty.
    * showIndicator has 2 arguments: [config, waitPromise].
    * config is object having properties:
    *    -  id (String) - defines the unique id of showing request (By default use autogenerated id),
    *    -  isGlobal (Boolean) - global or not (If not setted, by default use value of similar control option)
    *    -  message (String) - message of indicator (If not setted, by default use value of similar control option)
    *    -  scroll (String) - add gradient of indicator's background (If not setted, by default use value of similar control option)
    *    -  small (String) - size of indicator (If not setted, by default use value of similar control option)
    *    -  overlay (String) - setting of indicator's overlay (If not setted, by default use value of similar control option)
    *    -  mods (Array.<String>|String) - It can be using for custom tuning of indicator (If not setted, by default use value of similar control option)
    *    -  delay (Number) - timeout before indicator will be visible (If not setted, by default use value of similar control option)
    * waitPromise (Promise) - when this promise will be resolved, indicator hides (not necessary property)
    * showIndicator returns id value using as argument of hideIndicator.
    *
    * hideIndicator is using for remove request of indicator showing.
    * hideIndicator has 1 argument: [id].
    * id is Number type property. It needs for remove concrete request from stack of requests.
    *
    * @class Controls/Container/LoadingIndicator
    * @extends Core/Control
    * @control
    * @author Krasilnikov A.
    * @public
    * @category Container
    * @demo Controls-demo/Container/LoadingIndicator
    */

   /**
    * @name Controls/Container/LoadingIndicator#isGlobal
    * @cfg {Boolean} show indicator covering whole page (global) or covering just own content
    * @variant true It means position: fixed of indicator's container
    * @variant false It means position: absolute of indicator's container
    * @default true
    */
   /**
    * @name Controls/Container/LoadingIndicator#message
    * @cfg {String} message of indicator
    * @default '' (empty string)
    */
   /**
    * @name Controls/Container/LoadingIndicator#scroll
    * @cfg {String} add gradient of indicator's background
    * @variant '' (empty string) no gradient
    * @variant 'left' gradient from left to right (increase of fullness)
    * @variant 'right' gradient from right to left
    * @variant 'top' gradient from top to bottom
    * @variant 'bottom' gradient from bottom to top
    * @default '' (empty string)
    */
   /**
    * @name Controls/Container/LoadingIndicator#small
    * @cfg {String} size of some styles of indicator (tuning of margin, background, border, width, height styles)
    * @variant '' (empty string) standard size of indicator
    * @variant 'small' make indicator smaller
    * @default '' (empty string)
    */
   /**
    * @name Controls/Container/LoadingIndicator#overlay
    * @cfg {String} setting of indicator's overlay
    * @variant 'default' invisible background, indicator blocks clicks
    * @variant 'dark' dark background, indicator blocks clicks
    * @variant 'none' invisible background, indicator don't blocks clicks
    * @default 'default'
    */
   /**
    * @name Controls/Container/LoadingIndicator#mods
    * @cfg {Array.<String>|String} It can be using for custom tuning of indicator.
    * mods contains words what will be adding as "controls-loading-indicator_mod-[mod]" style in indicator's container
    * @variant [] no mods
    * @variant ['gray'] gray color of gradient. it's using with scroll property
    * @default []
    */
   /**
    * @name Controls/Container/LoadingIndicator#delay
    * @cfg {Number} timeout before indicator will be visible
    * @default 2000
    */
   /**
    * @css size_LoadingIndicator-l Size of Loading Indicator when option size is set to default.
    * @css size_LoadingIndicator-s Size of Loading Indicator when option size is set to small.
    *
    * @css @spacing_LoadingIndicator-between-content-border-l Spacing between content and border when option size is set to default.
    * @css @spacing_LoadingIndicator-between-content-border-s Spacing between content and border when option size is set to small.
    *
    * @css @border-radius_LoadingIndicator Border radius when option size is set to default.
    *
    * @css @font-size_LoadingIndicator Font-size of message.
    * @css @line-height_LoadingIndicator Line-height of message.
    * @css @color_LoadingIndicator-text Color of message.
    *
    *@css @color_LoadingIndicator-overlay-default Color of overlay when option overlay is set to default.
    *@css @color_LoadingIndicator-overlay-dark Color of overlay when option overlay is set to dark.
    *
    *@css @background-url_LoadingIndicator-l Background-url when option size is set to default.
    *@css @background-url_LoadingIndicator-s Background-url when options size is set to small.
    *@css @background-color_LoadingIndicator Background color of Loading Indicator.
    *
    */

   var module = Control.extend(/** @lends Controls/Container/LoadingIndicator.prototype */{
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
      mods: null,

      _beforeMount: function(cfg) {
         this.mods = [];
         this._stack = new collection.List();
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
            // todo сделать mods строкой всегда, или вообще удалить опцию
            if (Array.isArray(cfg.mods)) {
               this.mods = cfg.mods;
            } else if (typeof cfg.mods === 'string') {
               this.mods = [cfg.mods];
            }
         }
         this.delay = cfg.delay !== undefined ? cfg.delay : this._delay;
      },

      toggleIndicator: function(isLoading) {
         Env.IoC.resolve('ILogger').error('LoadingIndicator', 'Используйте события showIndicator/hideIndicator взамен toggleIndicator');
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
               var delay = typeof this.delay === 'number' ? this.delay : this._delay;
               this.delayTimeout = setTimeout(function() {
                  if (this._isPreloading) {
                     // goes to show loading state

                     // return spinner value
                     this.isLoading = this._isLoadingSaved;

                     // clear saved spinner state
                     this._isLoadingSaved = null;
                     this._forceUpdate();
                  }
               }.bind(this), delay);
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

      /**
       * show indicator (bypassing requests of indicator showing stack)
       */
      show: function(config, waitPromise) {
         if (!config) {
            return this._toggleIndicator(true, {});
         }
         this._show(config, waitPromise);
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

      /**
       * hide indicator (bypassing requests of indicator showing stack)
       */
      hide: function(id) {
         if (!id) {

            // Used public api. In this case, hide the indicator immediately.
            this._clearStack();
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

      _clearStack: function() {
         this._stack.clear();
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
         if (!config.hasOwnProperty('delay')) {
            config.delay = this.delay;
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

      _getDelay: function(config) {
         return typeof config.delay === 'number' ? config.delay : this.delay;
      },

      _toggleIndicator: function(visible, config, force) {
         clearTimeout(this.delayTimeout);
         if (visible) {
            if (force) {
               this.isLoading = true;
               this._updateProperties(config);
            } else {
               var delay = this._getDelay(config);
               this.delayTimeout = setTimeout(function() {
                  this.isLoading = true;
                  this._updateProperties(config);
                  this._forceUpdate();
               }.bind(this), delay);
            }
         } else {
            this.isLoading = false;
         }
         this._forceUpdate();
      }
   });

   return module;
});
