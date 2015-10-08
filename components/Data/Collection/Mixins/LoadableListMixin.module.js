/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.LoadableListMixin', [
   'js!SBIS3.CONTROLS.Data.Collection.ISourceLoadable',
   'js!SBIS3.CONTROLS.Data.Query.Query',
   'js!SBIS3.CONTROLS.Data.Query.Join',
   'js!SBIS3.CONTROLS.Data.Query.Order'
], function (ISourceLoadable, Query, QueryJoin, QueryOrder) {
   'use strict';

   /**
    * Миксин для реализации списка, загружаемого через источник данных
    * @mixin SBIS3.CONTROLS.Data.Collection.LoadableListMixin
    * @public
    * @author Мальцев Алексей
    */

   var LoadableListMixin = /** @lends SBIS3.CONTROLS.Data.Collection.LoadableListMixin.prototype */{
      $protected: {
         /**
          * @var {$ws.proto.Deferred} Текущий загрузчик
          */
         _loader: undefined
      },

      $constructor: function () {
         this._publish('onBeforeCollectionLoad', 'onAfterCollectionLoad', 'onBeforeLoadedApply', 'onAfterLoadedApply');
         this._query = new Query();
      },

      //region SBIS3.CONTROLS.Data.Collection.ISourceLoadable

      getSource: function () {
         return this._options.source;
      },

      setSource: function (source) {
         this._options.source = source;
      },

      isLoaded: function () {
         return this._loaded;
      },

      isQueryChanged: function () {
         return this._queryChanged;
      },

      load: function (mode) {
         mode = mode || ISourceLoadable.MODE_REPLACE;
         this._queryChanged = false;

         this._notify(
            'onBeforeCollectionLoad',
            mode,
            this
         );

         this._cancelLoading();

         this._loader = this.fetch().addCallbacks((function(dataSet) {
            this._notify(
               'onAfterCollectionLoad',
               mode,
               dataSet,
               this
            );

            var list = dataSet.getAll();
            this._notify(
               'onBeforeLoadedApply',
               mode,
               list,
               this
            );
            this._loader = undefined;
            this._loaded = true;

            switch (mode) {
               case ISourceLoadable.MODE_APPEND:
                  this.concat(list);
                  break;

               case ISourceLoadable.MODE_PREPEND:
                  this.concat(list, true);
                  break;

               default:
                  this.fill(list);
            }

            this._notify(
               'onAfterLoadedApply',
               mode,
               list,
               this
            );

            return list;
         }).bind(this), (function(err) {
            this._loader = undefined;

            this._notify(
               'onAfterCollectionLoad',
               mode,
               this
            );

            return err;
         }).bind(this));

         return this._loader;
      },

      //endregion SBIS3.CONTROLS.Data.Collection.ISourceLoadable

      //region SBIS3.CONTROLS.Data.Query.IQueryable

      getQuery: function () {
         return this._query;
      },

      setQuery: function (query) {
         this._query = query;
      },

      /**
       * Возвращает элементы выборки
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения, первым аргументом придет SBIS3.CONTROLS.Data.Source.DataSet
       */
      fetch: function () {
         return this.getSource().query(this._query);
      },

      //endregion SBIS3.CONTROLS.Data.Query.IQueryable

      //region Protected methods

      /**
       * Останавливает предыдущий загрузчик
       * @private
       */
      _cancelLoading: function () {
         if (this._loader) {
            this._loader.cancel();
         }
         this._loader = undefined;
      }

      //endregion Protected methods

   };

   return LoadableListMixin;
});
