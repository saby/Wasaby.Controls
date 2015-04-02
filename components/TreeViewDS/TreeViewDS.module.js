define('js!SBIS3.CONTROLS.TreeViewDS', [
   'js!SBIS3.CONTROLS.ListViewDS',
   'js!SBIS3.CONTROLS.TreeMixinDS',
   'js!SBIS3.CONTROLS.hierarchyMixin',
   'js!SBIS3.CORE.MarkupTransformer'
], function (ListViewDS, TreeMixinDS, hierarchyMixin, MarkupTransformer) {
   'use strict';
   /**
    * Контрол, отображающий данные имеющие иерархическую структуру. Позволяет отобразить данные в произвольном виде с возможностью открыть или закрыть отдельные узлы
    * @class SBIS3.CONTROLS.TreeViewDS
    * @extends SBIS3.CONTROLS.ListView
    * @mixes SBIS3.CONTROLS.TreeMixin
    */

   var TreeViewDS = ListViewDS.extend([TreeMixinDS, hierarchyMixin], /** @lends SBIS3.CONTROLS.TreeViewDS.prototype*/ {
      $protected: {},

      $constructor: function () {
      },

      _createItemInstance: function (item, targetContainer) {

         var self = this,
            key = item.getKey(),
            itemTpl = this._getItemTemplate(item),
            container, dotTemplate,
            itemWrapper = this._drawItemWrapper(item);

         if (typeof itemTpl == 'string') {
            dotTemplate = itemTpl;
         }
         else if (itemTpl instanceof Function) {
            dotTemplate = itemTpl(item);
         }

         if (typeof dotTemplate == 'string') {

            container = $(MarkupTransformer(doT.template(dotTemplate)(item)));

            // вставляем в шаблон тривью пользовательский + добавляем кнопку развертки
            $('.js-controls-ListView__itemContent', itemWrapper).append(container).before('<div class="controls-TreeView__expand js-controls-TreeView__expand"></div>');

            this._addItemClasses(itemWrapper, key);

            targetContainer.append(itemWrapper);

            $('.js-controls-TreeView__expand', itemWrapper).click(function () {
               var id = $(this).closest('.controls-ListView__item').attr('data-id');
               self.toggleNode(id);
            });

         }
         else {
            throw new Error('Шаблон должен быть строкой');
         }
      },

      _drawItemWrapper: function (item) {
         return $('<div>\
            <div class="controls-TreeView__item">\
               <div class="controls-TreeView__itemContent js-controls-ListView__itemContent"></div>\
            </div>\
         </div>');
      },

      _getTargetContainer: function (record) {
         var parentKey = this.getParentKey(this._dataSet, record),
            curList;
         if (parentKey) {
            var curItem = $('.controls-ListView__item[data-id="' + parentKey + '"]', this.getContainer().get(0));
            curList = $('.controls-TreeView__childContainer', curItem.get(0)).first();
            if (!curList.length) {
               curList = $('<div></div>').appendTo(curItem).addClass('controls-TreeView__childContainer');
            }
            $('.controls-TreeView__item', curItem).first().addClass('controls-TreeView__hasChild');
         } else {
            curList = this._getItemsContainer();
         }

         return curList;
      },

      /**
       * Раскрыть определенный узел
       * @param {String} key Идентификатор раскрываемого узла
       */
      openNode: function (key) {
         var itemCont = $('.controls-ListView__item[data-id="' + key + '"]', this.getContainer().get(0));
         $('.js-controls-TreeView__expand', itemCont).first().addClass('controls-TreeView__expand__open');
         $('.controls-TreeView__childContainer', itemCont).first().css('display', 'block');
      },
      /**
       * Закрыть определенный узел
       * @param {String} key Идентификатор раскрываемого узла
       */
      closeNode: function (key) {
         var itemCont = $('.controls-ListView__item[data-id="' + key + '"]', this.getContainer().get(0));
         $('.js-controls-TreeView__expand', itemCont).removeClass('controls-TreeView__expand__open');
         $('.controls-TreeView__childContainer', itemCont).css('display', 'none');
      },

      /**
       * Закрыть или открыть определенный узел
       * @param {String} key Идентификатор раскрываемого узла
       */

      toggleNode: function (key) {
         var itemCont = $('.controls-ListView__item[data-id="' + key + '"]', this.getContainer().get(0));
         if ($('.js-controls-TreeView__expand', itemCont).hasClass('controls-TreeView__expand__open')) {
            this.closeNode(key);
         }
         else {
            this.openNode(key);
         }
      }


   });

   return TreeViewDS;

});