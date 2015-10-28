/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Tree.LoadableTreeItem', [
   'js!SBIS3.CONTROLS.Data.Tree.TreeItem',
   'js!SBIS3.CONTROLS.Data.Query.IQueryable',
   'js!SBIS3.CONTROLS.Data.Collection.ISourceLoadable',
   'js!SBIS3.CONTROLS.Data.Utils'
], function (TreeItem, IQueryable, ISourceLoadable, Utils) {
   'use strict';

   /**
    * Элемент дерева, который можно загружать через источник
    * @class SBIS3.CONTROLS.Data.Tree.LoadableTreeItem
    * @extends SBIS3.CONTROLS.Data.Tree.TreeItem
    * @mixes SBIS3.CONTROLS.Data.Query.IQueryable
    * @mixes SBIS3.CONTROLS.Data.Collection.ISourceLoadable
    * @public
    * @author Мальцев Алексей
    */
   var LoadableTreeItem = TreeItem.extend([IQueryable, ISourceLoadable], /** @lends SBIS3.CONTROLS.Data.Tree.LoadableTreeItem.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Tree.LoadableTreeItem',
      $protected: {

         /**
          * @var {Boolean} Содержимое узла было загружено через load()
          */
         _loaded: false,

         /**
          * @var {SBIS3.CONTROLS.Data.Query.Query} Сформированный запрос
          */
         _query: undefined,

         /**
          * @var {Boolean} Запрос был изменен с момента последнего load
          */
         _queryChanged: false
      },

      //region SBIS3.CONTROLS.Data.Query.IQueryable

      getQuery: function () {
         return this._query || (this._query = this._getSourceCollection().getQuery().clone());
      },

      setQuery: function (query) {
         this._query = query;
      },

      fetch: function () {
         return this._getSourceCollection().fetch();
      },

      //endregion SBIS3.CONTROLS.Data.Query.IQueryable

      //region SBIS3.CONTROLS.Data.Collection.ISourceLoadable

      getSource: function () {
         return this._getSourceCollection().getSource();
      },

      setSource: function () {
         throw new Error('Source is read only for projection');
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

      //endregion SBIS3.CONTROLS.Data.Collection.ISourceLoadable

      //region Public methods

      //endregion Public methods

      //region Protected methods

      //endregion Protected methods

   });

   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Tree.LoadableTreeItem', function(config) {
      return new LoadableTreeItem(config);
   });

   return LoadableTreeItem;
});
