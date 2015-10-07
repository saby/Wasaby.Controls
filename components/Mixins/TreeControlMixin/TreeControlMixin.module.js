/* global define, $ws */
define('js!SBIS3.CONTROLS.TreeControlMixin', [
   'js!SBIS3.CONTROLS.TreeControl.TreeView',
   'js!SBIS3.CONTROLS.TreeControl.TreePresenter',
   'html!SBIS3.CONTROLS.TreeControl.TreeView'
], function (TreeView, TreePresenter, TreeViewTemplate) {
   'use strict';

   /**
    * Миксин, задающий любому контролу поведение работы с деревом
    * @mixin SBIS3.CONTROLS.TreeControlMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var TreeControlMixin = /**@lends SBIS3.CONTROLS.TreeControlMixin.prototype  */{
      $protected: {
         _options: {
            /**
             * @cfg {Boolean}
             * Разрешить проваливаться в папки
             * Если выключено, то папки можно открывать только в виде дерева, проваливаться в них нельзя
             */
            allowEnterToFolder: true,

            /**
             * @cfg {Boolean} Режим разворота
             * @noShow
             */
            expand: false,

            /**
             * @cfg {Object} Открытые по умолчанию узлы
             * @noShow
             */
            openedPath: {}
         },

         _viewConstructor: TreeView,

         /**
          * @var {SBIS3.CONTROLS.TreeControl.TreeView} Представление дерева
          */
         _view: undefined,

         _presenterConstructor: TreePresenter,

         /**
          * @var {SBIS3.CONTROLS.TreeControl.TreePresenter} Презентер для дерева
          */
         _presenter: undefined
      },

      after: {
         /**
          * @see SBIS3.CONTROLS.CollectionControlMixin#_initPresenter
          * @private
          */
         _initPresenter: function () {
            var presenter = this._getPresenter();
            presenter.setChangeRootOnClick(this._options.allowEnterToFolder);
         }
      },

      /**
       * @see SBIS3.CONTROLS.CollectionControlMixin#_getViewTemplate
       * @private
       */
      _getViewTemplate: function() {
         return TreeViewTemplate;
      }
   };

   return TreeControlMixin;
});
