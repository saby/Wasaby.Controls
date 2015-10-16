/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Tree.Tree', [
   'js!SBIS3.CONTROLS.Data.Tree.TreeItem',
   'js!SBIS3.CONTROLS.Data.Bind.ICollection'
], function (TreeItem, IBindCollection) {
   'use strict';

   /**
    * Дерево.
    * @class SBIS3.CONTROLS.Data.Tree.Tree
    * @extends SBIS3.CONTROLS.Data.Tree.TreeItem
    * @mixes SBIS3.CONTROLS.Data.Bind.ICollection
    * @public
    * @author Мальцев Алексей
    */

   return TreeItem.extend([IBindCollection], /** @lends SBIS3.CONTROLS.Data.Tree.Tree.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Tree.Tree',

      $protected: {
         /**
          * @var {$ws.proto.Abstract} Объект, реализующий интерфейс событий
          */
         _proxy: undefined
      },


      $constructor: function (cfg) {
         cfg = cfg || {};

         this._options.owner = cfg.owner = undefined;
         this._options.node = cfg.node = true;

         if ('parent' in cfg && cfg.parent) {
            throw new Error('Tree can\'t have a parent');
         }

         this._proxy = new $ws.proto.Abstract({
         });
      },

      //endregion $ws.proto.Abstract

      destroy: function () {
         this._proxy.destroy();
         this._proxy = undefined;
      },

      isDestroyed: function () {
         return this._proxy.isDestroyed.apply(this._proxy, arguments);
      },

      init: function () {
         return this._proxy.init.apply(this._proxy, arguments);
      },

      describe: function () {
         return 'SBIS3.CONTROLS.Data.Tree.Tree';
      },

      subscribeTo: function () {
         return this._proxy.subscribeTo.apply(this._proxy, arguments);
      },

      subscribeOnceTo: function () {
         return this._proxy.subscribeOnceTo.apply(this._proxy, arguments);
      },

      unsubscribeFrom: function () {
         return this._proxy.unsubscribeFrom.apply(this._proxy, arguments);
      },

      once: function () {
         return this._proxy.once.apply(this._proxy, arguments);
      },

      subscribe: function () {
         this._proxy.subscribe.apply(this._proxy, arguments);
         return this;
      },

      unsubscribe: function () {
         this._proxy.unsubscribe.apply(this._proxy, arguments);
         return this;
      },

      unbind: function () {
         this._proxy.unbind.apply(this._proxy, arguments);
         return this;
      },

      getEvents: function () {
         return this._proxy.getEvents.apply(this._proxy, arguments);
      },

      hasEvent: function () {
         return this._proxy.hasEvent.apply(this._proxy, arguments);
      },

      hasEventHandlers: function () {
         return this._proxy.hasEventHandlers.apply(this._proxy, arguments);
      },

      getEventHandlers: function () {
         return this._proxy.getEventHandlers.apply(this._proxy, arguments);
      },

      _notify: function () {
         return this._proxy._notify.apply(this._proxy, arguments);
      },

      //endregion $ws.proto.Abstract

      //region SBIS3.CONTROLS.Data.Collection.ICollectionItem

      setOwner: function () {
         throw new Error('Tree root can\'t have an owner');
      },

      //endregion SBIS3.CONTROLS.Data.Collection.ICollectionItem

      //region SBIS3.CONTROLS.Data.Tree.ITreeItem

      setParent: function () {
         throw new Error('Tree root can\'t have a parent');
      },

      isRoot: function () {
         return true;
      },

      //endregion SBIS3.CONTROLS.Data.Tree.ITreeItem

      //region Public methods

      notifyItemChange: function (item, index, property) {
         this._notify(
            'onCollectionItemChange',
            item,
            index,
            property
         );
      }

      //endregion Public methods
   });
});
