/* global define, $ws */
define('js!SBIS3.CONTROLS.HierarchyControlMixin', [
   'js!SBIS3.CONTROLS.HierarchyControl.HierarchyView',
   'js!SBIS3.CONTROLS.HierarchyControl.HierarchyPresenter',
   'js!SBIS3.CONTROLS.Data.Collection.ObservableTree',
   'js!SBIS3.CONTROLS.Data.Collection.LoadableTree'
], function (HierarchyView, HierarchyPresenter, ObservableTree, LoadableTree) {
   'use strict';

   /**
    * Миксин, задающий любому контролу поведение работы с иерархией
    * @mixin SBIS3.CONTROLS.HierarchyControlMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var HierarchyControlMixin = /**@lends SBIS3.CONTROLS.HierarchyControlMixin.prototype  */{
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.HierarchyControl.IHierarchyItems|Array} Узел дерева, отображаемый контролом
             */
            items: [],

            /**
             * @cfg {String} Название поля, содержащее идентификатор родительского узла. Используется только в случае, если указан {@link dataSource}.
             * @remark Нужно только для того, чтобы передать в конструктор {@link SBIS3.CONTROLS.Data.Collection.LoadableTree}
             *
             */
            parentField: '',

            /**
             * @cfg {String} Название свойства, содержащее признак узла. Используется только в случае, если указан {@link dataSource}.
             * @remark Нужно только для того, чтобы передать в конструктор {@link SBIS3.CONTROLS.Data.Collection.LoadableTree}
             */
            nodeField: '',

            /**
             * @cfg {String} Название поля, содержащее дочерние элементы узла. Используется только в случае, если {@link items} является массивом, для поиска в каждом элементе-узле дочерних элементов.
             * @remark Нужно только для того, чтобы передать в конструктор {@link SBIS3.CONTROLS.Data.Collection.ObservableTree}
             *
             */
            childrenField: '',

            /**
             * @cfg {String} Какие типы узлов выводим 'all'|'folders'|'records'. По умолчанию 'all'
             * @noShow
             */
            displayType: 'all'
         },

         /**
          * @var {SBIS3.CONTROLS.Collection.ITreeItem} Узел дерева, отображаемый контролом
          */
         _items: undefined,

         /**
          * @var {SBIS3.CONTROLS.Data.Projection.Tree} Проекция дерева
          */
         _itemsProjection: undefined,

         _viewConstructor: HierarchyView,

         /**
          * @var {SBIS3.CONTROLS.HierarchyControl.HierarchyView} Представление иерархии
          */
         _view: undefined,

         _presenterConstructor: HierarchyPresenter,

         /**
          * @var {SBIS3.CONTROLS.HierarchyControl.HierarchyPresenter} Иерархический презентер
          */
         _presenter: undefined
      },

      //region Public methods

      //endregion Public methods

      //region Protected methods

      _convertDataSourceToItems: function (source) {
         return new LoadableTree({
            source: source,
            childrenField: this._options.childrenField,
            parentField: this._options.parentField,
            nodeField: this._options.nodeField
         });
      },

      /**
       * @see SBIS3.CONTROLS.CollectionControlMixin#_convertItems
       * @private
       */
      _convertItems: function (items) {
         if (items instanceof Array) {
            items = new ObservableTree({
               children: items,
               childrenField: this._options.childrenField,
               parentField: this._options.parentField,
               nodeField: this._options.nodeField
            });
         }

         if (!$ws.helpers.instanceOfMixin(items, 'SBIS3.CONTROLS.Data.Collection.ITreeItem')) {
            throw new Error('Items should be an instance of SBIS3.CONTROLS.Data.Collection.ITreeItem');
         }

         return items;
      }

      //endregion Protected methods
   };

   return HierarchyControlMixin;
});
