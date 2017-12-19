/* global define */
define('/Display/Search', [
   'WS.Data/Display/Tree',
   '/Display/ItemsStrategy/Search',
   'WS.Data/Di'
], function (
   Tree,
   SearchStrategy,
   Di
) {
   'use strict';

   /**
    * Проекция для режима поиска. Объединяет развернутые узлы в один элемент с "хлебной крошкой" внутри.
    * @class /Display/Search
    * @extends WS.Data/Display/Tree
    * @public
    * @author Мальцев Алексей
    */

   var Search = Tree.extend(/** @lends /Display/Search.prototype */{
      _moduleName: '/Display/Search',

      constructor: function Search(options) {
         Search.superclass.constructor.call(this, options);
      },

      //region Protected methods

      _wrapItemsStrategy: function() {
         Search.superclass._wrapItemsStrategy.call(this);

         if (this._itemsStrategy && !(this._itemsStrategy instanceof SearchStrategy)) {
            this._itemsStrategy = new SearchStrategy(this._itemsStrategy);
         }
      }

      //endregion Protected methods

   });

   Di.register('display.search', Search);

   return Search;
});
