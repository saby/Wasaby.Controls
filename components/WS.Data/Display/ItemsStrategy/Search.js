/* global define */
define('/Display/ItemsStrategy/Search', [
   'WS.Data/Entity/Abstract',
   '/Display/Breadcrumbs'
], function (
   Abstract,
   Breadcrumbs
) {
   'use strict';

   /**
    * Стратегия-декоратор для объединения развернутых узлов в "хлебную крошку"
    * @class /Display/ItemsStrategy/Search
    * @extends WS.Data/Entity/Abstract
    * @author Мальцев Алексей
    */

   var Search = Abstract.extend(/** @lends /Display/ItemsStrategy/Search.prototype */{
      _moduleName: '/Display/ItemsStrategy/Search',

      /**
       * @member {WS.Data/Display/ItemsStrategy/Abstract} Декорирумая стратегия
       */
      _source: null,

      get source() {
         return this._source;
      },

      /**
       * Конструктор
       * @param {WS.Data/Display/ItemsStrategy/Abstract} source Декорирумая стратегия
       */
      constructor: function Search(source) {
         this._source = source;
      },

      //region WS.Data/Display/ItemsStrategy/Abstract

      getOptions: function () {
         return this._source.getOptions();
      },

      at: function (index) {
         return this._source.at(index);
      },

      getCount: function() {
         return this._source.getCount();
      },

      getItems: function () {
         return this._source.getItems();
      },

      getItemIndex: function (index) {
         return this._source.getItemIndex(index);
      },

      getCollectionIndex: function (index) {
         return this._source.getCollectionIndex(index);
      },

      splice: function (start, deleteCount, added) {
         return this._source.splice(start, deleteCount, added);
      },

      reset: function () {
         return this._source.reset();
      },

      addSorters: function (sorters) {
         this._source.addSorters(sorters);

         sorters.push({
            name: 'tree',
            enabled: true,
            method: Search.sortItems,
            options: this._options
         });
      },

      convertToItem: function (source, options) {
         return this._source.convertToItem(source, options);
      },

      getItemModule: function() {
         return this._source.getItemModule();
      }

      //endregion WS.Data/Display/ItemsStrategy/Abstract
   });

   /**
    * Создает индекс сортировки, объединяющий хлебные крошки в один элемент
    * @param {Array.<WS.Data/Display/CollectionItem>} items Элементы проекции.
    * @param {Array.<Number>} current Текущий индекс сортировки
    * @return {Array.<Number>}
    * @static
    */
   Search.sortItems = function (items, current) {
      var item,
         itemIsNode,
         next,
         nextIsNode,
         breadcrumbs,
         isLastBreadcrumb,
         result = current.filter(function(position, index) {
            item = items[index];
            next = items[index + 1];
            itemIsNode = item && item.isNode ? item.isNode() : false;
            nextIsNode = next && next.isNode ? next.isNode() : false;
            isLastBreadcrumb = true;
            if (itemIsNode) {
               breadcrumbs = breadcrumbs || new Breadcrumbs();
               var contents = item.getContents();
               breadcrumbs.push(contents instanceof Breadcrumbs ? contents.last : contents);
               if (nextIsNode) {
                  isLastBreadcrumb = item.getLevel() >= next.getLevel();
               }
            }

            if (isLastBreadcrumb && breadcrumbs) {
               breadcrumbs.finalize();
               item.setContents(breadcrumbs);
               breadcrumbs = undefined;
            }

            return isLastBreadcrumb;
         });

      return result;
   };

   return Search;
});
