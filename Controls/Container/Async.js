define('Controls/Container/Async',
   [
      'UI/Base',
      'Application/Env',
      'Env/Env',
      'wml!Controls/Container/Async/Async',
      'Controls/Container/Async/ModuleLoader',
      'Core/library',
      'Types/entity'
   ],

   function(Base,
      AppEnv,
      Env,
      template,
      ModuleLoader,
      library,
      entity) {
      'use strict';


      /**
       * Контейнер для асинхронной загрузки контролов.
       * Подробное описание и примеры вы можете найти <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/pattern-and-practice/async-load/'>здесь</a>.
       *
       * @class Controls/Container/Async
       * @extends Core/Control
       * @control
       * @public
       * @author Белотелов Н.В.
       * @category Container
       */

      /*
       * Container for asynchronously loading components.
       * Подробное описание и примеры вы можете найти <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/pattern-and-practice/async-load/'>здесь</a>.
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
       * @cfg {Content} Содержимое контейнера.
       */

      /*
       * @name Controls/Container/Async#content
       * @cfg {Content} Container contents.
       */

      /**
       * @name Controls/Container/Async#templateName
       * @cfg {String} Имя асинхронно загружаемого контрола.
       */

      /*
       * @name Controls/Container/Async#templateName
       * @cfg {String} Name of asynchronously loading component
       */

      /**
       * @name Controls/Container/Async#templateOptions
       * @cfg {Object} Параметры содержимого контейнера Async.
       */

      /*
       * @name Controls/Container/Async#templateOptions
       * @cfg {Object} Options for content of Async
       */

      var moduleLoader = new ModuleLoader();

      var Async = Base.Control.extend({
         _template: template,
         optionsForComponent: {},
         canUpdate: true,
         _beforeMount: function(options, ctx, receivedState) {
            var result;
            var self = this;
            if (!self._isServer()) {
               if (moduleLoader.isLoaded(options.templateName) || (!this._isCompat() && receivedState)) {
                  self._loadContentSync(options.templateName, options.templateOptions, false);
               } else {
                  result = self._loadContentAsync(options.templateName, options.templateOptions, true);
               }
            } else {
               self._loadContentSync(options.templateName, options.templateOptions, true);
               result = new Promise(function(resolve, reject) {
                  if (self.error) {
                     reject(self.error);
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
            } else if (moduleLoader.isLoaded(opts.templateName)) {
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
            var loaded = moduleLoader.loadSync(name);
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
               return err;
            });
            return promise;
         },

         _getHeadData: function() {
            return AppEnv.getStore('HeadData');
         },

         _pushDepToHeadData: function(dep) {
            try {
               var headData = this._getHeadData();
               headData.pushDepComponent(dep, true);
            } catch (e) {
               Env.IoC.resolve('ILogger').warn('You\'re trying to use Async without Controls/Application. Link to ' +
                  dep +
                  ' won\'t be added to server-side generated markup. ' + e);
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
            if (tpl && tpl.__esModule) {
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

         _isServer: function() {
            return typeof window === 'undefined';
         },

         _isCompat: function() {
            return Env.constants.compat;
         }
      });

      Async.getOptionTypes = function getOptionTypes() {
         return {
            templateName: entity.descriptor(String).required()
         };
      };

      return Async;
   });
