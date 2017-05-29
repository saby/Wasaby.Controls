/* global define */
define('js!WS.Data/Display/LoadableTreeItem', [
   'js!WS.Data/Display/TreeItem',
   'js!WS.Data/Query/IQueryable',
   'js!WS.Data/Collection/ISourceLoadable',
   'js!WS.Data/Di',
   'js!WS.Data/Utils'
], function (
   TreeItem,
   IQueryable,
   ISourceLoadable,
   Di,
   Utils
) {
   'use strict';

   /**
    * Элемент дерева, который можно загружать через источник
    * @class WS.Data/Display/LoadableTreeItem
    * @extends WS.Data/Display/TreeItem
    * @implements WS.Data/Query/IQueryable
    * @implements WS.Data/Collection/ISourceLoadable
    * @author Мальцев Алексей
    */
   var LoadableTreeItem = TreeItem.extend([IQueryable, ISourceLoadable], /** @lends WS.Data/Display/LoadableTreeItem.prototype */{
      _moduleName: 'WS.Data/Display/LoadableTreeItem',

      /**
       * @member {Boolean} Содержимое узла было загружено через load()
       */
      _loaded: false,

      /**
       * @member {WS.Data/Query/Query} Сформированный запрос
       */
      _query: undefined,

      /**
       * @member {Boolean} Запрос был изменен с момента последнего load
       */
      _queryChanged: false,

      //region WS.Data/Query/IQueryable

      getQuery: function () {
         return this._query || (this._query = this._getSourceCollection().getQuery().clone());
      },

      setQuery: function (query) {
         this._query = query;
      },

      fetch: function () {
         return this._getSourceCollection().fetch();
      },

      //endregion WS.Data/Query/IQueryable

      //region WS.Data/Collection/ISourceLoadable

      getSource: function () {
         return this._getSourceCollection().getSource();
      },

      setSource: function () {
         throw new Error('Source is read only for display');
      },

      isLoaded: function () {
         if (this._loaded) {
            return true;
         }
         return this.getOwner().getChildren(this).getCount() > 0;
      },

      isQueryChanged: function () {
         return this._queryChanged;
      },

      getQueryTotal: function () {
         return this._getSourceCollection().getQueryTotal();
      },

      hasMore: function () {
         return this._getSourceCollection().hasMore();
      },

      load: function (mode) {
         this._queryChanged = false;
         this._loaded = true;

         var parentProperty = this.getOwner().getParentProperty(),
            idProperty = this.getOwner().getIdProperty();
         if (parentProperty) {
            var idValue = idProperty && Utils.getItemPropertyValue(this.getContents(), idProperty);
            if (idValue !== undefined) {
               var query =  this._getSourceCollection().getQuery(),
                  where = query.getWhere();
               where[parentProperty] = idValue;
               query.where(where);
               //FIXME: поддержать аргумент mode
               this._getSourceCollection().load(ISourceLoadable.MODE_APPEND);
            }
         }
      }

      //endregion WS.Data/Collection/ISourceLoadable

      //region Public methods

      //endregion Public methods

      //region Protected methods

      //endregion Protected methods

   });

   Di.register('display.loadable-tree-item', LoadableTreeItem);

   return LoadableTreeItem;
});
