define('Controls/Container/SourceBase',
   [
      'Core/Control',
      'tmpl!Controls/Container/SourceBase/SourceBase',
      'Controls/Source/CachedUtil',
      'Controls/Container/SourceBase/ContextContainerOptions'
   ],
   
   function(Control, template, cachedUtil, ContextContainerOptions) {
      
      'use strict';
      
      var CONTEXT_OPTIONS = ['filter', 'navigation', 'keyProperty', 'source'];
      
      var _private = {
         getStateFieldByOptName: function(optName) {
            return '_' + optName;
         },
         createOptionsObject: function(self) {
            function reducer(result, optName) {
               result[optName] = self[_private.getStateFieldByOptName(optName)];
               return result;
            }
            
            return CONTEXT_OPTIONS.reduce(reducer, {});
         }
      };
      
      var Base =  Control.extend({
         
         _template: template,
         
         _beforeMount: function(options) {
            var self = this;
            CONTEXT_OPTIONS.forEach(function(optName) {
               self[_private.getStateFieldByOptName(optName)] = options[optName];
            });
            return cachedUtil(this, options);
         },
         
         _getChildContext: function() {
            return {
               containerOptions: new ContextContainerOptions(_private.createOptionsObject(this))
            };
         }
      });
      
      Base._private = _private;
      return Base;
   });
