define('Controls/Container/Async',
   [
      'Core/Control',
      'Core/Deferred',
      'View/Request',
      'wml!Controls/Container/Async/Async',
      'Controls/Container/Async/ModuleLoader',
      'View/Executor/Utils',
      'Core/library',
      'Types/entity',
      'Env/Env'
   ],

   function(Base,
      Deferred,
      Request,
      template,
      ModuleLoader,
      Utils,
      library,
      entity,
      Env) {
      'use strict';


      /**
       * Container for asynchronously loading components.
       *
       * @class Controls/Container/Async
       * @extends Core/Control
       * @control
       * @public
       * @author Белотелов Н.В.
       * @category Container
       */

      /**
       * @name Controls/Container/Async#content
       * @cfg {Content} Container contents.
       */

      /**
       * @name Controls/Container/Async#templateName
       * @cfg {String} Name of asynchronously loading component
       */

      /**
       * @name Controls/Container/Async#templateOptions
       * @cfg {Object} Options for content of Async
       */

      var moduleLoader = new ModuleLoader();

      var Async = Base.extend({
         _template: template,
         optionsForComponent: {},
         canUpdate: true,
         _beforeMount: function(options, ctx, receivedState) {
            var result;
            var self = this;
            if (!self._isServer()) {
               if (receivedState || self._isLoaded(options.templateName)) {
                  self._loadContentSync(options.templateName, options.templateOptions, false);
               } else {
                  result = self._loadContentAsync(options.templateName, options.templateOptions, true);
               }
            } else {
               self._loadContentSync(options.templateName, options.templateOptions, true);
               result = new Promise(function(resolve, reject) {
                  if (self.error) {
                     reject();
                  } else {
                     resolve(true);
                  }
               });
            }
            return result;
         },

         _beforeUpdate: function(opts) {
            if (!this.canUpdate) {
               return;
            }
            if (opts.templateName === this._options.templateName) {
               this._updateOptionsForComponent(this.optionsForComponent.resolvedTemplate, opts.templateOptions);
            } else if (this._isLoaded(opts.templateName)) {
               this._loadContentSync(opts.templateName, opts.templateOptions);
            }
         },

         _afterUpdate: function(oldOptions) {
            if (!this.canUpdate) {
               return;
            }
            if (oldOptions.templateName !== this._options.templateName) {
               this._loadContentAsync(this._options.templateName, this._options.templateOptions);
            }
         },

         _setErrorState: function(errorState, message) {
            if (errorState) {
               this.error = 'Couldn\'t load module ' +
                  this._options.templateName + ' ' +
                  (message || '');
            } else {
               this.error = null;
            }
         },

         _loadContentSync: function(name, options, serverSide) {
            var self = this;
            var loaded = this._loadFileSync(name);
            if (!this._checkLoadedError(loaded)) {
               self._updateOptionsForComponent(loaded, options);
               if (serverSide) {
                  self._pushDepToHeadData(library.parse(name).name);
               }
               return loaded;
            }
            return null;
         },

         _loadContentAsync: function(name, options, noUpdate) {
            var self = this;
            var promise = this._loadFileAsync(name);

            // Need this flag to prevent setting new options for content
            // that wasn't loaded yet
            self.canUpdate = false;
            promise = promise.then(function(res) {
               self.canUpdate = true;
               if (!self._checkLoadedError(res)) {
                  self._updateOptionsForComponent(res, options);
                  if (!noUpdate) {
                     self._forceUpdate();
                  }
               }
               return true;
            }, function(err) {
               self.canUpdate = true;
               self._setErrorState(true, err);
               return false;
            });
            return promise;
         },

         _pushDepToHeadData: function(dep) {
            var request = Request.getCurrent();
            var headData = request && request.getStorage('HeadData');
            if (headData && headData.pushDepComponent) {
               headData.pushDepComponent(dep, true);
            }
         },

         _updateOptionsForComponent: function(tpl, opts) {
            this.optionsForComponent = opts || {};
            this.optionsForComponent.resolvedTemplate = tpl;
         },

         _checkLoadedError: function(loaded) {
            var result;
            if (loaded === null) {
               this._setErrorState(true);
               result = true;
            } else {
               this._setErrorState(false);
               result = false;
            }
            return result;
         },

         _loadFileAsync: function(name) {
            return moduleLoader.loadAsync(name);
         },

         _loadFileSync: function(name) {
            return moduleLoader.loadSync(name);
         },

         _isLoaded: function(name) {
            return moduleLoader.isLoaded(name);
         },

         _isServer: function() {
            return typeof window === 'undefined';
         }
      });

      Async.getOptionTypes = function getOptionTypes() {
         return {
            templateName: entity.descriptor(String).required()
         };
      };

      return Async;
   });
