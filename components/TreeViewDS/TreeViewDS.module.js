define('js!SBIS3.CONTROLS.TreeViewDS', [
   'js!SBIS3.CONTROLS.ListView',
   'js!SBIS3.CONTROLS.hierarchyMixin',
   'js!SBIS3.CONTROLS.TreeMixinDS',
   'js!SBIS3.CORE.MarkupTransformer'
], function (ListView, hierarchyMixin, TreeMixinDS, MarkupTransformer) {
   'use strict';

   var ITEMS_TOOLBAR_HOVERED_ITEM_FIX_FIELDS = ['record', 'key'];

   /**
    * Контрол, отображающий данные имеющие иерархическую структуру. Позволяет отобразить данные в произвольном виде с возможностью открыть или закрыть отдельные узлы
    * @class SBIS3.CONTROLS.TreeViewDS
    * @control
    * @public
    * @extends SBIS3.CONTROLS.ListView
    * @mixes SBIS3.CONTROLS.hierarchyMixin
    * @mixes SBIS3.CONTROLS.TreeMixinDS
    * @demo SBIS3.CONTROLS.Demo.MyTreeView
    * @author Крайнов Дмитрий Олегович
    */

   var TreeViewDS = ListView.extend([hierarchyMixin, TreeMixinDS], /** @lends SBIS3.CONTROLS.TreeViewDS.prototype*/ {
      $protected: {
         _options: {
            //FixME: так как приходит набор от листвью. пока он не нужен
            itemsActions: [],
            //TODO: Копипаст из TreeDataGridView, временное решение т.к. в TreeMixinDS пока разместить нельзя по причине
             //отсутствия необходимости переносит элементы в менюшках
            /**
             * @cfg {String} Разрешено или нет перемещение элементов "Drag-and-Drop"
             * @variant "" Запрещено
             * @variant allow Разрешено
             * @variant onlyChangeOrder Разрешено только изменение порядка
             * @variant onlyChangeParent Разрешено только перемещение в папку
             * @example
             * <pre>
             *     <option name="itemsDragNDrop">onlyChangeParent</option>
             * </pre>
             */
            itemsDragNDrop: 'allow'
         }
      },

      init: function () {
         TreeViewDS.superclass.init.apply(this, arguments);
         this._container.addClass('controls-TreeView');
      },

      _getTargetContainer: function (record) {
         var
            parentKey = this._dataSet.getParentKey(record, this._options.hierField),
            curList;

         //TODO убрать, когда ключи будут 100% строками
         if (parentKey && ((parentKey + '') !== (this._curRoot + ''))) {
            var parentItem = $('.controls-ListView__item[data-id="' + parentKey + '"]', this.getContainer().get(0));
            curList = $('.controls-TreeView__childContainer', parentItem.get(0)).first();
            if (!curList.length) {
               curList = $('<div></div>').appendTo(parentItem).addClass('controls-TreeView__childContainer');
            }
            if (this._options.openedPath[parentKey]) {
               var tree = this._dataSet.getTreeIndex(this._options.hierField);
               if (tree[parentKey]) {
                  $('.js-controls-TreeView__expand', parentItem).first().addClass('controls-TreeView__expand__open');
                  curList.css('display', 'block');
               }
            }
            // !! для статичных данных тоже надо указыавть является ли запись разделом. нужно чтобы отрисовать корректно запись, которая является узлом
            if (record.get(this._options.hierField + '@')) {
               $('.controls-TreeView__item', parentItem).first().addClass('controls-TreeView__hasChild');
            }
         } else {
            curList = this._getItemsContainer();
         }

         return curList;
      },
      _showItemsToolbar: function(target) {
         var item = target.container.find('.js-controls-TreeView-itemContent'),
             newTargetData;

         /* Так как TreeViewDS имеет сложную вложенную структуру, то надо элемент
            и его кординаты скорректировать перед отображением тулбара */
         if(item.length) {
            newTargetData = this._getElementData(item);
            $ws.helpers.forEach(ITEMS_TOOLBAR_HOVERED_ITEM_FIX_FIELDS, function(key) {
               delete newTargetData[key];
            });
            $ws.core.merge(target, newTargetData);
         }
         TreeViewDS.superclass._showItemsToolbar.call(this, target);
      },

      _drawLoadedNode : function(key) {
         TreeViewDS.superclass._drawLoadedNode.apply(this, arguments);
         var itemCont = $('.controls-ListView__item[data-id="' + key + '"]', this.getContainer().get(0));
         $('.controls-TreeView__childContainer', itemCont).first().css('display', 'block');
      },

      _nodeClosed : function(key) {
         var itemCont = $('.controls-ListView__item[data-id="' + key + '"]', this.getContainer().get(0));
         $('.controls-TreeView__childContainer', itemCont).css('display', 'none').empty();
      },

      _drawSelectedItems : function(idArray) {
         $('.controls-ListView__itemCheckBox__multi', this._container).removeClass('controls-ListView__itemCheckBox__multi');
         for (var i = 0; i < idArray.length; i++) {
            $(".controls-ListView__item[data-id='" + idArray[i] + "']", this._container).find('.js-controls-ListView__itemCheckBox').first().addClass('controls-ListView__itemCheckBox__multi');
         }
      },

      _notifyOnDragMove: function(target, insertAfter) {
         //Если происходит изменение порядкового номера и оно разрешено или если происходит смена родителся и она разрешена, стрельнём событием
         if (typeof insertAfter === 'boolean' && this._options.itemsDragNDrop !== 'onlyChangeParent' || insertAfter === undefined && this._options.itemsDragNDrop !== 'onlyChangeOrder') {
            return this._notify('onDragMove', this.getCurrentElement().keys, target.data('id'), insertAfter) !== false;
         }
      }
   });

   return TreeViewDS;

});
