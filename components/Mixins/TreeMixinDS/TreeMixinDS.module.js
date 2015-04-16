define('js!SBIS3.CONTROLS.TreeMixinDS', [
   'js!SBIS3.CORE.MarkupTransformer'
], function (MarkupTransformer) {
   /**
    * Позволяет контролу отображать данные имеющие иерархическую структуру и работать с ними.
    * @mixin SBIS3.CONTROLS.TreeMixinDS
    */
   var TreeMixinDS = /** @lends SBIS3.CONTROLS.TreeMixinDS.prototype */{
      $protected: {
         _ulClass: 'controls-TreeView__list',
         _options: {
            /**
             * @cfg {Boolean} При открытия узла закрывать другие
             * @noShow
             */
            singleExpand: ''

         }
      },

      _redraw: function () {

         this._clearItems();
         var
            self = this,
            DataSet = this._dataSet;

         this.hierIterate(DataSet, function (record) {
            var
               targetContainer;

            var parentKey = self.getParentKey(DataSet, record);

            if ((targetContainer = self._getTargetContainer(record)) && (parentKey == self._options.root)) {
               self._drawItem(record, targetContainer);
            }
         });

         self.reviveComponents().addCallback(function () {
            self._notify('onDrawItems');
            self._drawItemsCallback();
         });

      },

      _appendItemTemplate: function (item, targetContainer, dotTemplate) {
         var self = this,
            key = item.getKey(),
            container = $(MarkupTransformer(doT.template(dotTemplate)(item))),
            itemWrapper = this._drawItemWrapper(item);
         this._addItemClasses(itemWrapper, key);

         // вставляем пользовательский шаблон в тривью  + добавляем кнопку развертки
         $('.js-controls-ListView__itemContent', itemWrapper).append(container).before('<div class="controls-TreeView__expand js-controls-TreeView__expand"></div>');

         targetContainer.append(itemWrapper);

         //TODO: перенести куда нить проверку является ли разделом
         if (item.get(this._options.hierField + '@')) {
            $('.controls-ListView__item[data-id="' + key + '"] .controls-TreeView__item', this.getContainer().get(0)).first().addClass('controls-TreeView__hasChild');
         }

         $('.js-controls-TreeView__expand', itemWrapper).click(function () {
            var id = $(this).closest('.controls-ListView__item').attr('data-id');
            self.toggleNode(id);
         });
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

      /**
       * Раскрыть определенный узел
       * @param {String} key Идентификатор раскрываемого узла
       */
      openNode: function (key) {
         var itemCont = $('.controls-ListView__item[data-id="' + key + '"]', this.getContainer().get(0));

         $('.js-controls-TreeView__expand', itemCont).first().addClass('controls-TreeView__expand__open');
         // $('.controls-TreeView__childContainer', itemCont).first().css('display', 'block');

         var self = this;

         var filter = this._filter || {};
         filter[self._options.hierField] = key;

         //TODO: проверка что уже загружали ветку и просто показать ее
         self._dataSource.query(filter).addCallback(function (dataSet) {
            self._dataSet.merge(dataSet);
            dataSet.each(function (record) {
               var targetContainer = self._getTargetContainer(record);
               if (targetContainer) {
                  self._drawItem(record, targetContainer);
               }
            });

            $('.controls-TreeView__childContainer', itemCont).first().css('display', 'block');

         });

      },

      /**
       * Закрыть определенный узел
       * @param {String} key Идентификатор раскрываемого узла
       */
      closeNode: function (key) {
         var itemCont = $('.controls-ListView__item[data-id="' + key + '"]', this.getContainer().get(0));
         $('.js-controls-TreeView__expand', itemCont).removeClass('controls-TreeView__expand__open');
         $('.controls-TreeView__childContainer', itemCont).css('display', 'none').empty();
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

   };

   return TreeMixinDS;

});