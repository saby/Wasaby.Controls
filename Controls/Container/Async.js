define('Controls/Container/Async',
   [
      'Core/Control',
      'Core/Deferred',
      'View/Request',
      'wml!Controls/Container/Async/Async',
      'View/Executor/Utils',
      'Core/library',
      'Types/entity',
      'Env/Env'
   ],

   function(Base,
      Deferred,
      Request,
      template,
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

      var Async = Base.extend({
         _template: template,
         optionsForComponent: {},
         canUpdate: true,
         _beforeMount: function(options) {
            var promiseResult;
            if (typeof window !== 'undefined') {
               promiseResult = this._loadContentAsync(options.templateName, options.templateOptions, true);
            } else {
               promiseResult = this._loadServerSide(options.templateName, options.templateOptions);

               // We don't need to return resolved template on server
               // We just need to wait till it loaded
               promiseResult = promiseResult.then(function() {
                  return null;
               });
            }
            return promiseResult;
         },

         _beforeUpdate: function(options) {
            if (!this.canUpdate) {
               return;
            }
            if (options.templateName !== this._options.templateName) {
               this._loadContentAsync(options.templateName, options.templateOptions);
            } else if (options.templateOptions !== this._options.templateOptions) {
               this._updateOptionsForComponent(this.optionsForComponent.resolvedTemplate, options.templateOptions);
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

         _loadServerSide: function(name, options) {
            var self = this;
            var promise = this._loadFileAsync(name);
            promise.then(function(res) {
               self._setErrorState(false);
               self._updateOptionsForComponent(res, options);
               self._pushDepToHeadData(library.parse(name).name);
            }, function(err) {
               Env.IoC.resolve('ILogger').error('Couldn\'t load ' + name, err);
               self._setErrorState(true, err);
            });
            return promise;
         },

         _loadContentAsync: function(name, options, noUpdate) {
            var self = this;
            var promise = this._loadFileAsync(name);

            // Need this flag to prevent setting new options for content
            // that wasn't loaded yet
            self.canUpdate = false;
            promise.then(function(res) {
               self.canUpdate = true;
               self._setErrorState(false);
               self._updateOptionsForComponent(res, options);
               if (!noUpdate) {
                  self._forceUpdate();
               }
            }, function(err) {
               self.canUpdate = true;
               self._setErrorState(true, err);
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

         _loadFileAsync: function(name) {
            return library.load(name);
         }
      });

      Async.getOptionTypes = function getOptionTypes() {
         return {
            templateName: entity.descriptor(String).required()
         };
      };

      return Async;
   });
