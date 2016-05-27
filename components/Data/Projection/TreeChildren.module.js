/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.TreeChildren', [
   'js!SBIS3.CONTROLS.Data.Collection.List',
   'js!SBIS3.CONTROLS.Data.Di'
], function (List, Di) {
   'use strict';

   /**
    * Список дочерних элементов узла дерева.
    * @class SBIS3.CONTROLS.Data.Projection.TreeChildren
    * @extends SBIS3.CONTROLS.Data.Collection.List
    * @public
    * @author Мальцев Алексей
    */

   var TreeChildren = List.extend(/** @lends SBIS3.CONTROLS.Data.Projection.TreeChildren.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Projection.TreeChildren',

      /**
       * @cfg {SBIS3.CONTROLS.Data.Projection.TreeItem} Узел-владелец
       * @name SBIS3.CONTROLS.Data.Projection.TreeChildren#owner
       */
      _$owner: null,

      constructor: function $TreeChildren(options) {
         TreeChildren.superclass.constructor.call(this, options);

         if (!(this._$owner instanceof Object)) {
            throw new TypeError('Tree children owner should be an object');
         }
         if (!$ws.helpers.instanceOfModule(this._$owner, 'SBIS3.CONTROLS.Data.Projection.TreeItem')) {
            throw new TypeError('Tree children owner should be an instance of SBIS3.CONTROLS.Data.Projection.TreeItem');
         }
      },

      //region SBIS3.CONTROLS.Data.Collection.IEnumerable

      //endregion SBIS3.CONTROLS.Data.Collection.IEnumerable

      //region SBIS3.CONTROLS.Data.Collection.IList

      //endregion SBIS3.CONTROLS.Data.Collection.IList

      //region Public methods

      /**
       * Возвращает узел-владелец
       * @returns {SBIS3.CONTROLS.Data.Projection.TreeItem}
       */
      getOwner: function () {
         return this._$owner;
      }

      //endregion Public methods

      //region Protected methods

      //endregion Protected methods

   });

   Di.register('projection.tree-children', TreeChildren);

   return TreeChildren;
});
