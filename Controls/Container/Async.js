define('Controls/Container/Async',
   [
      'Core/Control',
      'Application/Env',
      'Env/Env',
      'Core/constants',
      'wml!Controls/Container/Async/Async',
      'Controls/Container/Async/ModuleLoader',
      'Core/library',
      'Types/entity'
   ],

   function(Base,
      AppEnv,
      Env,
      constants,
      template,
      ModuleLoader,
      library,
      entity) {
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
               if (self._isLoaded(options.templateName) || (!this._isCompat() && receivedState)) {
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
               this._updateOptionsForComponent(this.optionsForComponent.resolvedTemplate,
                  opts.templateOptions,
                  opts.templateName);
            } else if (this._isLoaded(opts.templateName)) {
               this._loadContentSync(opts.templateName, opts.templateOptions);
            }
         },

         _afterUpdate: function() {
            if (!this.canUpdate) {
               return;
            }
            if (this.currentTemplateName !== this._options.templateName) {
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
               self._updateOptionsForComponent(loaded, options, name);
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
                  self._updateOptionsForComponent(res, options, name);
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

         _getHeadData: function() {
            try {
               var headData = AppEnv.getStore('HeadData');
               return headData;
            } catch (e) {
               return null;
            }
         },

         _pushDepToHeadData: function(dep) {
            var headData = this._getHeadData();
            if (headData === null) {
               Env.IoC.resolve('ILogger').warn('HeadData store wasn\'t initialized. Link to ' + dep + ' won\'t be added to server-side generated markup.');
            } else {
               headData.pushDepComponent(dep, true);
            }
         },

         _updateOptionsForComponent: function(tpl, opts, templateName) {
            this.currentTemplateName = templateName;
            this.optionsForComponent = {};
            for (var key in opts) {
               if (opts.hasOwnProperty(key)) {
                  this.optionsForComponent[key] = opts[key];
               }
            }
            if (tpl &&  tpl.__esModule) {
               this.optionsForComponent.resolvedTemplate = tpl.default;   
            } else {
               this.optionsForComponent.resolvedTemplate = tpl;
            }
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
         },

         _isCompat: function() {
            return constants.compat;
         }
      });

      Async.getOptionTypes = function getOptionTypes() {
         return {
            templateName: entity.descriptor(String).required()
         };
      };

      return Async;
   });
