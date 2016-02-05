/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.TreeEnumerator', [
   'js!SBIS3.CONTROLS.Data.Collection.IEnumerator',
   'js!SBIS3.CONTROLS.Data.Collection.IndexedEnumeratorMixin'
], function (IEnumerator, IndexedEnumeratorMixin) {
   'use strict';

   /**
    * Энумератор для проекции коллекции
    * @class SBIS3.CONTROLS.Data.Projection.TreeEnumerator
    * @mixes SBIS3.CONTROLS.Data.Collection.IEnumerator
    * @mixes SBIS3.CONTROLS.Data.Collection.IndexedEnumeratorMixin
    * @public
    * @author Мальцев Алексей
    */

   var TreeEnumerator = $ws.core.extend({}, [IEnumerator, IndexedEnumeratorMixin], /** @lends SBIS3.CONTROLS.Data.Projection.TreeEnumerator.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Projection.TreeEnumerator',
      $protected: {
         _options: {
            /**
             * @member {SBIS3.CONTROLS.Data.Projection.Tree>} Проекция дерева
             */
            tree: null
         },

         /**
          * @member {SBIS3.CONTROLS.Data.Projection.TreeItem} Текущий элемент
          */
         _сurrent: undefined,

         /**
          * @member {Number} Текущая позиция (в исходной коллекции)
          */
         _currentPosition: -1
      },

      $constructor: function () {
         this._tree = this._options.tree;
      },

      //region SBIS3.CONTROLS.Data.Collection.IEnumerator

      getNext: function () {
         var next = this._getNextAfter(this.getCurrent());

         if (next) {
            this._сurrent = next;
            this._currentPosition++;
            return this._сurrent;
         }
      },

      getCurrent: function () {
         return this._сurrent;
      },

      reset: function () {
         this._сurrent = undefined;
         this._currentPosition = -1;
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IEnumerator

      //region SBIS3.CONTROLS.Data.Projection.IEnumerator

      at: function (index) {
      },

      setCurrent: function(item) {
         this._сurrent = item;
         this._currentPosition = this._getPosition(item);
      },

      getPosition: function() {
         return this._currentPosition;
      },

      setPosition: function(internal) {
         this._currentPosition = internal;
         this._сurrent = this.at(internal);
      },

      getPrevious: function () {
         var prev = this._getPreviousBefore(this.getCurrent());

         if (prev) {
            this._сurrent = prev;
            this._currentPosition--;
            return this._сurrent;
         }
      },

      getInternalBySource: function (source) {
      },

      reIndex: function () {
         IndexedEnumeratorMixin.reIndex.call(this);
      },

      //endregion SBIS3.CONTROLS.Data.Projection.IEnumerator

      //region SBIS3.CONTROLS.Data.Collection.IndexedEnumeratorMixin

      _createIndex: function (property) {
         var savedItem = this._current,
            savedPosition = this._currentPosition,
            result = TreeEnumerator.superclass._createIndex.call(this, property);

         this._current = savedItem;
         this._currentPosition = savedPosition;

         return result;
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IndexedEnumeratorMixin

      //region Protected methods

      _getNextAfter: function (item) {
         var parent = item ? item.getParent() : this._tree.getRoot(),
            siblings = this._tree.getChildren(parent),
            index = item ? siblings.getIndex(item) : -1;
         if (index >= siblings.getCount() - 1) {
            return parent.isRoot() ? null : this._getNextAfter(parent);
         }

         return siblings.at(index + 1);
      },

      _getPreviousBefore: function(item) {
         if (!item) {
            return null;
         }
         var parent = item.getParent(),
            siblings = this._tree.getChildren(parent),
            index = item ? siblings.getIndex(item) : -1;
         if (index <= 0) {
            return parent.isRoot() ? null : this._getPreviousBefore(parent);
         }

         return siblings.at(index - 1);
      }

      //endregion Protected methods
   });

   return TreeEnumerator;
});
