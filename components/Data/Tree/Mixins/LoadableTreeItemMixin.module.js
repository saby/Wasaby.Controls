/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Tree.LoadableTreeItemMixin', [
   'js!SBIS3.CONTROLS.Data.Tree.LoadableTreeChildren'
], function () {
   'use strict';

   /**
    * Миксин, реализующий элемент дерева, в который можно загружать данные через источник
    * @mixin SBIS3.CONTROLS.Data.Tree.LoadableTreeItemMixin
    * @public
    * @author Мальцев Алексей
    */
   var LoadableTreeItemMixin = /** @lends SBIS3.CONTROLS.Data.Tree.LoadableTreeItemMixin.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Tree.LoadableTreeChildren|Array} Коллекция дочерних элементов
             * @name children
             */

            /**
             * @cfg {String} Название поля, содержащее идентификатор родительского узла
             */
            parentField: '',

            /**
             * @cfg {String} Название поля, содержащее признак узла
             */
            nodeField: ''
         },

         _childrenModule: 'SBIS3.CONTROLS.Data.Tree.LoadableTreeChildren',

         /**
          * @var {Function} Обрабатывает событие о начале загрузки узла
          */
         _onBeforeChildrenLoad: undefined,

         /**
          * @var {Function} Обрабатывает событие о начале загрузки узла
          */
         _onAfterChildrenLoad: undefined,

         /**
          * @var {Function} Обрабатывает событие о начале загрузки узла
          */
         _onBeforeChildrenLoadedApply: undefined,

         /**
          * @var {Function} Обрабатывает событие о начале загрузки узла
          */
         _onAfterChildrenLoadedApply: undefined
      },

      //region SBIS3.CONTROLS.Data.Tree.ITreeItem

      /**
       * Возвращает коллекцию потомков узла
       * @returns {SBIS3.CONTROLS.Data.Tree.LoadableTreeChildren}
       */
      getChildren: function () {
         return this._options.children || (this._options.children = $ws.single.ioc.resolve(this._childrenModule, {
            owner: this,
            source: this._options.source
         }));
      },

      //endregion SBIS3.CONTROLS.Data.Tree.ITreeItem

      //region SBIS3.CONTROLS.Data.Collection.ISourceLoadable

      getSource: function () {
         return this.getChildren().getSource();
      },

      setSource: function (source) {
         this.getChildren().setSource(source);
      },

      isLoaded: function () {
         return this.getChildren().isLoaded();
      },

      isQueryChanged: function () {
         return this.getChildren().isQueryChanged();
      },

      getQueryTotal: function () {
         return this.getChildren().getQueryTotal();
      },

      hasMore: function () {
         return this.getChildren().hasMore();
      },

      load: function (mode) {
         if (!this._onBeforeChildrenLoad) {
            this._onBeforeChildrenLoad = onBeforeChildrenLoad.bind(this);
            this._onAfterChildrenLoad = onAfterChildrenLoad.bind(this);
            this._onBeforeChildrenLoadedApply = onBeforeChildrenLoadedApply.bind(this);
            this._onAfterChildrenLoadedApply = onAfterChildrenLoadedApply.bind(this);
         }

         var children = this.getChildren();

         children.once('onBeforeCollectionLoad', this._onBeforeChildrenLoad);
         children.once('onAfterCollectionLoad', this._onAfterChildrenLoad);
         children.once('onBeforeLoadedApply', this._onBeforeChildrenLoadedApply);
         children.once('onAfterLoadedApply', this._onAfterChildrenLoadedApply);

         return children.load(mode);
      },

      //endregion SBIS3.CONTROLS.Data.Collection.ISourceLoadable

      //region SBIS3.CONTROLS.Data.Query.IQueryable

      getQuery: function () {
         return this.getChildren().getQuery();
      },

      setQuery: function (query) {
         this.getChildren().setQuery(query);
      },

      fetch: function () {
         return this.getChildren().fetch();
      },

      //endregion SBIS3.CONTROLS.Data.Query.IQueryable

      //region Public methods

      /**
       * Возвращает название поля, содержащее идентификатор родительского узла
       * @returns {String}
       */
      getParentField: function () {
         return this._options.parentField;
      },

      /**
       * Устанавливает название поля, содержащее идентификатор родительского узла
       * @param {String} name Название поля
       */
      setParentField: function (name) {
         this._options.parentField = name;
      },

      /**
       * Возвращает название поля, содержащее признак узла
       * @returns {String}
       */
      getNodeField: function () {
         return this._options.nodeField;
      },

      /**
       * Устанавливает название поля, содержащее признак узла
       * @param {String} name Название поля
       */
      setNodeField: function (name) {
         this._options.nodeField = name;
      }

      //endregion Public methods

      //region Protected methods

      //endregion Protected methods

   };

   /**
    * Обрабатывает событие об изменении текущего элемента дерева
    * @private
    */
   var onBeforeChildrenLoad = function(event, mode, target) {
      this._bubbleUp(function() {
         this._notify('onBeforeCollectionLoad', mode, target);
      });
   },
   /**
    * Обрабатывает событие об изменении текущего элемента дерева
    * @private
    */
   onAfterChildrenLoad = function (event, mode, dataSet, target) {
      this._bubbleUp(function () {
         this._notify('onAfterCollectionLoad', mode, dataSet, target);
      });
   },
   /**
    * Обрабатывает событие об изменении текущего элемента дерева
    * @private
    */
   onBeforeChildrenLoadedApply = function (event, mode, collection, target) {
      this._bubbleUp(function() {
         this._notify('onBeforeLoadedApply', mode, collection, target);
      });
   },
   /**
    * Обрабатывает событие об изменении текущего элемента дерева
    * @private
    */
   onAfterChildrenLoadedApply = function (event, mode, collection, target) {
      this._bubbleUp(function() {
         this._notify('onAfterLoadedApply', mode, collection, target);
      });
   };

   return LoadableTreeItemMixin;
});
