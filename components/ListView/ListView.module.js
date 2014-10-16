/**
 * Created by iv.cheremushkin on 14.08.2014.
 */

define('js!SBIS3.CONTROLS.ListView',
   ['js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS._CollectionMixin',
      'js!SBIS3.CONTROLS._MultiSelectorMixin',
      'html!SBIS3.CONTROLS.ListView'
   ],
   function (CompoundControl, CollectionMixin, MultiSelectorMixin, dotTplFn) {

      'use strict';

      /**
       * Контрол, отображающий внутри себя набор однотипных сущностей, умеет отображать данные списком по определенному шаблону, а так же фильтровать и сортировать
       * @class SBIS3.CONTROLS.ListView
       * @extends SBIS3.CORE.Control
       * @mixes SBIS3.CONTROLS._CollectionMixin
       * @mixes SBIS3.CONTROLS._MultiSelectorMixin
       * @control
       */

      var ListView = CompoundControl.extend([CollectionMixin, MultiSelectorMixin], /** @lends SBIS3.CONTROLS.ListView.prototype */ {
         $protected: {
            _dotTplFn: dotTplFn,
            _dotItemTpl: null,
            _itemsContainer: null,
            _options: {
               /**
                * @cfg {} Шаблон отображения каждого элемента коллекции
                */
               itemTemplate: '',
               /**
                * @cfg {Array} Набор действий, над элементами, отображающийся в виде иконок. Можно использовать для массовых операций.
                */
               itemsActions: null,
               /**
                * @cfg {Boolean} Разрешено или нет перемещение элементов Drag-and-Drop
                */
               itemsDragNDrop: false,
               /**
                * @cfg {String|jQuery|HTMLElement} Что отображается когда нет записей
                */
               emptyHTML: null
            }
         },

         $constructor: function () {
            this._items.setHierField(null);
         },

         init : function() {
            this._drawItems();
         },

         /**
          * Установить, что отображается когда нет записей
          * @param html содержимое блока
          */
         setEmptyHTML: function (html) {

         },

         _getItemTemplate : function() {
            return this._options.itemTemplate;
         }
      });

      return ListView;

   });