define('Controls/Container/Crud', [
   'Core/Control',
   'tmpl!Controls/Container/Crud/Crud',
   'Core/IoC'
], function(Control, tmpl, IoC) {
   'use strict';

   var module = Control.extend({
      _template: tmpl,
      showLoadingIndicator: false,

      _afterMount: function(cfg) {
         if (!cfg.dataSource) {
            IoC.resolve('ILogger').error('Crud', 'Необходимо задать опцию dataSource');
         } else {
            this._dataSource = cfg.dataSource;
         }
      },

      create: function(initValues) {
         var def = this._dataSource.create(initValues);

         this._notify('registerPending', [def, { showLoadingIndicator: this._options.showLoadingIndicator }], { bubbling: true });

         var self = this;
         def.addCallback(function(record) {
            self._notify('createSuccessed', [record], { bubbling: true });
            return record;
         });
         def.addErrback(function(e) {
            self._notify('createFailed', [e], { bubbling: true });
            return e;
         });

         return def;
      },
      read: function(key, readMetaData) {
         var def = this._dataSource.read(key, readMetaData);

         this._notify('toggleIndicator', [true], { bubbling: true });

         var self = this;
         def.addCallback(function(record) {
            self._notify('readSuccessed', [record], { bubbling: true });
            self._notify('toggleIndicator', [false], { bubbling: true });
            return record;
         });
         def.addErrback(function(e) {
            self._notify('readFailed', [e], { bubbling: true });
            self._notify('toggleIndicator', [false], { bubbling: true });
            return e;
         });

         return def;
      },

      update: function(record, isNewRecord) {
         var def;
         if (record.isChanged() || isNewRecord) {
            def = this._dataSource.update(record);

            this._notify('registerPending', [def, { showLoadingIndicator: this._options.showLoadingIndicator }], { bubbling: true });

            var self = this;
            def.addCallback(function(key) {
               self._notify('updateSuccessed', [record, key], { bubbling: true });
               return key;
            });
            def.addErrback(function(e) {
               self._notify('updateFailed', [e], { bubbling: true });
               return e;
            });
         } else {
            def = null;
         }
         return def;
      },

      delete: function(record, destroyMeta) {
         var def = this._dataSource.destroy(record.getId(), destroyMeta);

         this._notify('registerPending', [def, { showLoadingIndicator: this._options.showLoadingIndicator }], { bubbling: true });

         var self = this;
         def.addCallback(function() {
            self._notify('deleteSuccessed', [], { bubbling: true });
         });
         def.addErrback(function(e) {
            self._notify('deleteFailed', [e], { bubbling: true });
            return e;
         });

         return def;
      }
   });

   return module;
});
