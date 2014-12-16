/**
 * Created by iv.cheremushkin on 14.08.2014.
 */

define('js!SBIS3.CONTROLS.ListViewDS',
   ['js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS._DSMixin',
      'js!SBIS3.CONTROLS._MultiSelectorMixin',
      'html!SBIS3.CONTROLS.ListViewDS'
   ],
   function (CompoundControl, DSMixin, MultiSelectorMixin, dotTplFn) {

      'use strict';

      /**
       * Контрол, отображающий внутри себя набор однотипных сущностей, умеет отображать данные списком по определенному шаблону, а так же фильтровать и сортировать
       * @class SBIS3.CONTROLS.ListViewDS
       * @extends $ws.proto.Control
       * @mixes SBIS3.CONTROLS._DSMixin
       * @mixes SBIS3.CONTROLS._MultiSelectorMixin
       * @control
       */

      var ListViewDS = CompoundControl.extend([DSMixin, MultiSelectorMixin], /** @lends SBIS3.CONTROLS.ListViewDS.prototype */ {
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

      return ListViewDS;

   });