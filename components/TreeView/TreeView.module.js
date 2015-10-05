define('js!SBIS3.CONTROLS.TreeView', ['js!SBIS3.CONTROLS.ListViewOld', 'js!SBIS3.CONTROLS.TreeMixin'], function(ListView, TreeMixin) {
   'use strict';
   /**
    * Контрол, отображающий данные имеющие иерархическую структуру.
    * Позволяет отобразить данные в произвольном виде с возможностью открыть или закрыть отдельные узлы.
    * @class SBIS3.CONTROLS.TreeView
    * @extends SBIS3.CONTROLS.ListViewOld
    * @mixes SBIS3.CONTROLS.TreeMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    * @control
    *
    */

   var TreeView = ListView.extend([TreeMixin], /** @lends SBIS3.CONTROLS.TreeView.prototype*/ {
      $protected: {
      },

      $constructor: function() {
      },

      _drawItem : function(item, targetContainer) {
         var
            self = this,
            resContainer,
            itemWrapper = this._drawItemWrapper(item).appendTo(targetContainer);

         this._addItemClasses(itemWrapper, this._items.getKey(item));

         resContainer = itemWrapper.hasClass('js-controls-ListView__itemContent') ? itemWrapper : $('.js-controls-ListView__itemContent', itemWrapper);

         return this._createItemInstance(item, resContainer).addCallback(function(container){
            if (!($('.js-controls-TreeView__expand', resContainer).length)) {
               resContainer.before('<div class="controls-TreeView__expand js-controls-TreeView__expand"></div>');
            }

            $(".js-controls-TreeView__expand", itemWrapper).click(function(){
               var id = $(this).closest('.controls-ListView__item').attr('data-id');
               self.toggleNode(id)
            });
         });

      },
      _drawItemWrapper : function(item) {
         return $('<div>\
            <div class="controls-TreeView__item">\
               <div class="controls-TreeView__itemContent js-controls-ListView__itemContent"></div>\
            </div>\
         </div>');
      },

      _getTargetContainer : function(item, key, parItem, lvl) {
         if (parItem) {
            var
               curList,
               parKey = this._items.getKey(parItem),
               curItem =  $(".controls-ListView__item[data-id='"+parKey+"']", this.getContainer().get(0));
            curList = $(".controls-TreeView__childContainer", curItem.get(0)).first();
            if (!curList.length) {
               curList = $("<div></div>").appendTo(curItem).addClass('controls-TreeView__childContainer');
            }
            $('.controls-TreeView__item', curItem).first().addClass('controls-TreeView__hasChild');
         }
         else {
            curList = this._getItemsContainer();
         }
         return curList;
      },

      /**
       * Раскрыть определенный узел
       * @param {String} key Идентификатор раскрываемого узла
       */
      openNode: function(key) {
         var itemCont = $(".controls-ListView__item[data-id='"+key+"']", this.getContainer().get(0));
         $(".js-controls-TreeView__expand", itemCont).first().addClass('controls-TreeView__expand__open');
         $(".controls-TreeView__childContainer", itemCont).first().css('display', 'block');
      },
      /**
       * Закрыть определенный узел
       * @param {String} key Идентификатор раскрываемого узла
       */
      closeNode: function(key) {
         var itemCont = $(".controls-ListView__item[data-id='"+key+"']", this.getContainer().get(0));
         $(".js-controls-TreeView__expand", itemCont).removeClass('controls-TreeView__expand__open');
         $(".controls-TreeView__childContainer", itemCont).css('display', 'none');
      },

      /**
       * Закрыть или открыть определенный узел
       * @param {String} key Идентификатор раскрываемого узла
       */
      toggleNode: function(key) {
         var itemCont = $(".controls-ListView__item[data-id='"+key+"']", this.getContainer().get(0));
         if ($(".js-controls-TreeView__expand", itemCont).hasClass('controls-TreeView__expand__open')) {
            this.closeNode(key);
         }
         else {
            this.openNode(key);
         }
      }
   });

   return TreeView;

});