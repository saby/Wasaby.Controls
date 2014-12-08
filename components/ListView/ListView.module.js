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
       * @extends $ws.proto.Control
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
               emptyHTML: null,
               /**
                * @cfg {Function} Обработчик клика на элемент
                */
               elemClickHander : null
            }
         },

         $constructor: function () {
            this._items.setHierField(null);
            var self = this;
            this._container.mouseup(function(e){
               if (e.which == 1) {
                  var targ = $(e.target).hasClass('controls-ListView__item') ? e.target : $(e.target).closest('.controls-ListView__item');
                  if (targ.length) {
                     var id = targ.attr('data-id');
                     self._elemClickHandler(id, self._items.getItem(id));
                  }
               }
            });

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
         },

         _elemClickHandler : function(id, data) {
            if (this._options.elemClickHander) {
               this._options.elemClickHander(id, data);
            }
         }
      });

      return ListView;

   });