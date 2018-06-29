/* global define */
define('Controls/Source/Cached',
   [
      'WS.Data/Source/Memory',
      'Core/core-extend',
      'Core/Deferred',
      'WS.Data/Source/ISource',
      'WS.Data/Entity/VersionableMixin',
      'WS.Data/Source/DataSet'
   ],
   function(Memory, extend, Deferred, ISource) {
      
      'use strict';
      
      var CachedSource = extend([ISource], {
         
         /* Fast instanceOfModule */
         '[WS.Data/Source/ISource]': true,
         '[Controls/Container/Source/Cached]': true,
         
         _data: null,
         _firstQuery: true,
         
         constructor: function(cfg) {
            this._source = cfg.source;
            this._data = cfg.data;
            this._firstQuery = !!cfg.data;
         },
         
         //region WS.Data/Source/ISource
         
         getEndpoint: function() {
            return this._source.getEndpoint();
         },
         
         getBinding: function() {
            return this._source.getBinding();
         },
         
         setBinding: function(binding) {
            this._source.setBinding(binding);
         },
         
         getAdapter: function() {
            return this._source.getAdapter();
         },
         
         getModel: function() {
            return this._source.getModel();
         },
         
         setModel: function(model) {
            this._source.setModel(model);
         },
         
         getListModule: function() {
            return this._source.getListModule();
         },
         
         setListModule: function(listModule) {
            this._source.setListModule(listModule);
         },
         
         getIdProperty: function() {
            return this._source.getIdProperty();
         },
         
         setIdProperty: function(name) {
            this._source.setIdProperty(name);
         },
         
         getOrderProperty: function() {
            return this._source.getOrderProperty();
         },
         
         setOrderProperty: function(name) {
            this._source.setOrderProperty(name);
         },
         
         getOptions: function() {
            return this._source.getOptions();
         },
         
         setOptions: function(options) {
            this._source.setOptions(options);
         },
         
         create: function(meta) {
            return this._source.update(meta);
         },
         
         update: function(data, meta) {
            return this._source.update(data, meta);
         },
         
         destroy: function(keys, meta) {
            return this._source.destroy(keys, meta);
         },
         
         merge: function(from, to) {
            return this._source.merge(from, to);
         },
         
         copy: function(key, meta) {
            return this._source.copy(key, meta);
         },
         
         read: function(key, meta) {
            var indexInCachedData = this._data && this._data.getIndexByValue(this._source.getIdProperty(), key),
               readDeferred;
            
            if (indexInCachedData !== -1) {
               readDeferred = Deferred.success(this._data.at(indexInCachedData));
            } else {
               readDeferred = this._source.read(key, meta);
            }
            
            return readDeferred;
         },
         
         query: function(query) {
            var queryDef;
            
            if (this._data && this._firstQuery) {
               queryDef = Deferred.success(this._data);
            } else {
               queryDef = this._source.query(query);
            }
            this._firstQuery = false;
            return queryDef;
         },
         
         call: function(command, data) {
            return this._source.call(command, data);
         },
         
         move: function(items, target, meta) {
            return this._source.move(items, target, meta);
         },
         
         //endregion WS.Data/Source/ISource
         
         getCachedData: function() {
            return this._data;
         }
      });
      return CachedSource;
   });
