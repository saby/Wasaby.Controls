/* global define, require */
define('js!WS.Data/Display/TreeChildren', [
   'js!WS.Data/Collection/List',
   'js!WS.Data/Di',
   'Core/core-instance'
], function (
   List,
   Di,
   CoreInstance
) {
   'use strict';

   /**
    * Список дочерних элементов узла дерева.
    * @class WS.Data/Display/TreeChildren
    * @extends WS.Data/Collection/List
    * @public
    * @author Мальцев Алексей
    */

   var TreeChildren = List.extend(/** @lends WS.Data/Display/TreeChildren.prototype */{
      _moduleName: 'WS.Data/Display/TreeChildren',

      /**
       * @cfg {WS.Data/Display/TreeItem} Узел-владелец
       * @name WS.Data/Display/TreeChildren#owner
       */
      _$owner: null,

      constructor: function $TreeChildren(options) {
         TreeChildren.superclass.constructor.call(this, options);

         if (!(this._$owner instanceof Object)) {
            throw new TypeError('Tree children owner should be an object');
         }
         if (!CoreInstance.instanceOfModule(this._$owner, 'WS.Data/Display/TreeItem')) {
            throw new TypeError('Tree children owner should be an instance of WS.Data/Display/TreeItem');
         }
      },

      //region WS.Data/Collection/IEnumerable

      //endregion WS.Data/Collection/IEnumerable

      //region WS.Data/Collection/IList

      //endregion WS.Data/Collection/IList

      //region Public methods

      /**
       * Возвращает узел-владелец
       * @return {WS.Data/Display/TreeItem}
       */
      getOwner: function () {
         return this._$owner;
      }

      //endregion Public methods

      //region Protected methods

      //endregion Protected methods

   });

   Di.register('display.tree-children', TreeChildren);

   return TreeChildren;
});
