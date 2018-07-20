define('Controls/Container/Data',
   [
      'Core/Control',
      'tmpl!Controls/Container/Data/Data',
      'Controls/Container/Data/getPrefetchSource',
      'Controls/Container/Data/ContextOptions',
      'Core/core-clone'
   ],
   
   function(Control, template, getPrefetchSource, ContextOptions, clone) {
      
      'use strict';
      
      var CONTEXT_OPTIONS = ['filter', 'navigation', 'keyProperty', 'sorting', 'source', 'prefetchSource', 'items'];
      
      var _private = {
         createOptionsObject: function(self) {
            function reducer(result, optName) {
               result[optName] = self['_' + optName];
               return result;
            }
            
            return CONTEXT_OPTIONS.reduce(reducer, {});
         },
   
         createPrefetchSource: function(self, data) {
            return getPrefetchSource({
               source: self._source,
               navigation: self._navigation,
               sorting: self._sorting,
               filter: self._filter,
               keyProperty: self._keyProperty
            }, data);
         },
         
         resolveOptions: function(self, options) {
            self._filter = options.filter;
            self._navigation = options.navigation;
            self._source = options.source;
            self._sorting = options.sorting;
            self._keyProperty = options.keyProperty;
         },
         resolvePrefetchSourceResult: function(self, result) {
            self._items = result.data;
            self._prefetchSource = result.source;
         }
      };
      
      var Base =  Control.extend({
         
         _template: template,
         
         _beforeMount: function(options, context, receivedState) {
            var self = this;
            _private.resolveOptions(this, options);
            if (receivedState) {
               _private.resolvePrefetchSourceResult(this, receivedState);
            } else {
               return _private.createPrefetchSource(this).addCallback(function(result) {
                  _private.resolvePrefetchSourceResult(self, result);
                  return result;
               });
            }
         },
   
         _filterChanged: function(event, filter) {
            this._filter = clone(filter);
         },
         
         _itemsChanged: function(event, items) {
            _private.createPrefetchSource(this, items);
         },
         
         _getChildContext: function() {
            return {
               dataOptions: new ContextOptions(_private.createOptionsObject(this))
            };
         }
      });
      
      Base._private = _private;
      return Base;
   });
