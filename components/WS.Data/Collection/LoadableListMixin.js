/* global define */
define('js!WS.Data/Collection/LoadableListMixin', [
   'js!WS.Data/Collection/ISourceLoadable',
   'js!WS.Data/Query/Query',
   'js!WS.Data/Query/Join',
   'js!WS.Data/Query/Order'
], function (
   ISourceLoadable,
   Query,
   QueryJoin,
   QueryOrder
) {
   'use strict';

   /**
    * Миксин для реализации списка, загружаемого через источник данных
    * @mixin WS.Data/Collection/LoadableListMixin
    * @author Мальцев Алексей
    */

   var LoadableListMixin = /** @lends WS.Data/Collection/LoadableListMixin.prototype */{
      /**
       * @member {Core/Deferred} Текущий загрузчик
       */
      _loader: undefined,

      /**
       * @member {Boolean} Загрузка была произведена
       */
      _loaded: false,

      /**
       * @member {WS.Data/Query/Query} Сформированный запрос
       */
      _query: undefined,

      /**
       * @member {Boolean} С момента последнего вызова load() были внесены изменения в query
       */
      _queryChanged: false,

      /**
       * @member {Number|Boolean} Общее кол-во записей выборки
       */
      _queryTotal: true,

      constructor: function () {
         this._publish('onBeforeCollectionLoad', 'onAfterCollectionLoad', 'onBeforeLoadedApply', 'onAfterLoadedApply');
         this._query = new Query();
      },

      //region WS.Data/Collection/ISourceLoadable

      getSource: function () {
         return this._$source;
      },

      setSource: function (source) {
         this._$source = source;
      },

      isLoaded: function () {
         return this._loaded;
      },

      isQueryChanged: function () {
         return this._queryChanged;
      },

      getQueryTotal: function() {
         return this._queryTotal;
      },

      hasMore: function() {
         var hasMore = this._queryTotal;
         if (typeof hasMore !== 'boolean') {
            hasMore = hasMore > this.getQuery().getOffset() + this.getQuery().getLimit();
         }
         return hasMore;
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

            this._queryTotal = dataSet.getTotal();

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
                  this.append(list);
                  break;

               case ISourceLoadable.MODE_PREPEND:
                  this.prepend(list);
                  break;

               default:
                  this.assign(list);
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
               undefined,
               this
            );

            return err;
         }).bind(this));

         return this._loader;
      },

      //endregion WS.Data/Collection/ISourceLoadable

      //region WS.Data/Query/IQueryable

      getQuery: function () {
         return this._query;
      },

      setQuery: function (query) {
         this._query = query;
      },

      /**
       * Возвращает элементы выборки
       * @return {Core/Deferred} Асинхронный результат выполнения, первым аргументом придет WS.Data/Source/DataSet
       */
      fetch: function () {
         return this.getSource().query(this.getQuery());
      },

      //endregion WS.Data/Query/IQueryable

      //region Protected methods

      /**
       * Останавливает предыдущий загрузчик
       * @protected
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
