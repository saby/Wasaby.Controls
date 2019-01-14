define('Controls/Container/Async',
   [
      'Core/Control',
      'Core/Deferred',
      'View/Request',
      'wml!Controls/Container/Async/Async',
      'View/Executor/Utils',
      'Core/library',
      'Types/entity',
      'Core/IoC'
   ],

   function(Base,
      Deferred,
      Request,
      template,
      Utils,
      library,
      entity,
      IoC) {
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
         _beforeMount: function(options) {
            var self = this;
            if (typeof window !== 'undefined') {
               return self._loadContentAsync(options.templateName, options.templateOptions);
            }
            this._loadServerSide(options.templateName, options.templateOptions);
            return true;
         },

         _beforeUpdate: function(options) {
            this._loadContentAsync(options.templateName, options.templateOptions);
         },

         _setErrorState: function(errorState, message) {
            if(errorState) {
               this.error = 'Couldn\'t load module '
                  + this._options.templateName + ' '
                  + (message ? message : "");
            } else {
               this.error = null;
            }
         },

         _loadServerSide: function(name, options) {
            var tpl;
            try {
               tpl = this._loadFileSync(name);
               this._pushDepToHeadData(name);
               this._updateContent(tpl, options);
            } catch(e) {
               IoC.resolve("ILogger").error('Couldn\'t load ' + name, e);
               this._setErrorState(true, e);
            }
         },

         _loadContentAsync: function(name, options) {
            var self = this;
            var promise = this._loadFileAsync(name);
            promise.then(function(res) {
               self._setErrorState(false);
               self._updateContent(res, options);
            }, function(err) {
               self._setErrorState(true, err);
            });
            return promise;
         },

         _pushDepToHeadData: function(dep) {
            var request = Request.getCurrent();
            var headData = request && request.getStorage('HeadData');
            if(headData && headData.pushDepComponent) {
               headData.pushDepComponent(dep, true);
            }
         },

         _updateContent: function(tpl, opts) {
            this.optionsForComponent = opts || {};
            this.optionsForComponent.resolvedTemplate = tpl;
            this._forceUpdate();
         },

         _loadFileSync: function(name) {
            return Utils.RequireHelper.require(name);
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
