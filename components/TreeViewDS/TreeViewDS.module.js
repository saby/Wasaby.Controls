define('js!SBIS3.CONTROLS.TreeViewDS', [
   'js!SBIS3.CONTROLS.ListViewDS',
   'js!SBIS3.CONTROLS.hierarchyMixin',
   'js!SBIS3.CONTROLS.TreeMixinDS',
   'js!SBIS3.CORE.MarkupTransformer'
], function (ListViewDS, hierarchyMixin, TreeMixinDS, MarkupTransformer) {
   'use strict';
   /**
    * Контрол, отображающий данные имеющие иерархическую структуру. Позволяет отобразить данные в произвольном виде с возможностью открыть или закрыть отдельные узлы
    * @class SBIS3.CONTROLS.TreeViewDS
    * @extends SBIS3.CONTROLS.ListView
    * @mixes SBIS3.CONTROLS.TreeMixin
    */

   var TreeViewDS = ListViewDS.extend([hierarchyMixin, TreeMixinDS], /** @lends SBIS3.CONTROLS.TreeViewDS.prototype*/ {
      $protected: {
         _options: {
            //FixME: так как приходит набор от листвью. пока он не нужен
            itemsActions: []
         }
      },
      _appendItemTemplate: function (item, targetContainer, dotTemplate) {
         //TODO: поддержать at, или сделать с помощью него
         var self = this,
            key = item.getKey(),
            container = $(MarkupTransformer(doT.template(dotTemplate)(item))),
            itemWrapper = this._drawItemWrapper(item);
         this._addItemClasses(itemWrapper, key);

         // вставляем пользовательский шаблон в тривью  + добавляем кнопку развертки
         $('.js-controls-ListView__itemContent', itemWrapper).append(container).before('<div class="controls-TreeView__expand js-controls-TreeView__expand"></div>');

         targetContainer.append(itemWrapper);

         //TODO: перенести куда нить проверку является ли разделом
         //сейчас всегда отображает треугольник раскрытия, если явно не указано,
         //что не является разделом (false)
         if (item.get(this._options.hierField + '@') !== false) {
            $('.controls-ListView__item[data-id="' + key + '"] .controls-TreeView__item', this.getContainer().get(0)).first().addClass('controls-TreeView__hasChild');
         }
      },

      _getTargetContainer: function (record) {
         var parentKey = this.getParentKey(this._dataSet, record),
            curList;

         if (parentKey) {
            var parentItem = $('.controls-ListView__item[data-id="' + parentKey + '"]', this.getContainer().get(0));
            curList = $('.controls-TreeView__childContainer', parentItem.get(0)).first();
            if (!curList.length) {
               curList = $('<div></div>').appendTo(parentItem).addClass('controls-TreeView__childContainer');
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

      _drawItemWrapper: function (item) {
         return $('<div>\
            <div class="controls-TreeView__item">\
               <div class="controls-TreeView__itemContent js-controls-ListView__itemContent"></div>\
            </div>\
         </div>');
      },

      _nodeDataLoaded : function(key, ds) {
         TreeViewDS.superclass._nodeDataLoaded.apply(this, arguments);
         var itemCont = $('.controls-ListView__item[data-id="' + key + '"]', this.getContainer().get(0));
         $('.controls-TreeView__childContainer', itemCont).first().css('display', 'block');
      }
   });

   return TreeViewDS

});
