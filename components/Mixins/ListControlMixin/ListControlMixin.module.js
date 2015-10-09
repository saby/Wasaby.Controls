/* global define, $ws */
define('js!SBIS3.CONTROLS.ListControlMixin', [
   'js!SBIS3.CONTROLS.ListControl.ListView',
   'js!SBIS3.CONTROLS.ListControl.ListPresenter',
   'js!SBIS3.CONTROLS.Data.Projection',
   'js!SBIS3.CONTROLS.Data.Collection.ObservableList',
   'js!SBIS3.CONTROLS.Data.Collection.LoadableList',
   'html!SBIS3.CONTROLS.ListControl.ListView'
], function (ListView, ListPresenter, Projection, ObservableList, LoadableList, ListViewTemplate) {
   'use strict';

   /**
    * Миксин, задающий любому контролу поведение работы с нетипизированным списком
    * *Это экспериментальный модуль, API будет меняться!*
    * @mixin SBIS3.CONTROLS.ListControlMixin
    * @public
    * @state mutable
    * @author Крайнов Дмитрий Олегович
    */

   var ListControlMixin = /**@lends SBIS3.CONTROLS.ListControlMixin.prototype  */{
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.ListControl.IListItems|Array} Список, отображаемый контролом
             */
            items: []
         },

         /**
          * @var {SBIS3.CONTROLS.Data.IEnumerable} Список, отображаемый контролом
          */
         _items: undefined,

         /**
          * @var {SBIS3.CONTROLS.Data.Projection.Collection} Проекция списка
          */
         _itemsProjection: undefined,

         _viewConstructor: ListView,

         /**
          * @var {SBIS3.CONTROLS.ListControl.ListView} Представление списка
          */
         _view: undefined,

         _presenterConstructor: ListPresenter,

         /**
          * @var {SBIS3.CONTROLS.CollectionControl.ListPresenter} Презентер списка
          */
         _presenter: undefined
      },

      //region Public methods

      //endregion Public methods

      //region Protected methods

      _convertDataSourceToItems: function (source) {
         return new LoadableList({
            source: source
         });
      },

      /**
       * @see SBIS3.CONTROLS.CollectionControlMixin#_convertItems
       * @private
       */
      _convertItems: function (items) {
         if (items instanceof Array) {
            items = new ObservableList({
               items: items
            });
         }

         if (!$ws.helpers.instanceOfMixin(items, 'SBIS3.CONTROLS.Data.Collection.IEnumerable')) {
            throw new Error('Items should be an instance of SBIS3.CONTROLS.Data.Collection.IEnumerable');
         }

         return items;
      },

      /**
       * @see SBIS3.CONTROLS.CollectionControlMixin#_getViewTemplate
       * @private
       */
      _getViewTemplate: function() {
         return ListViewTemplate;
      }

      //endregion Protected methods
   };

   return ListControlMixin;
});
