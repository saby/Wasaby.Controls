define('js!SBIS3.CONTROLS._TreeMixin', [], function() {
   /**
    * Позволяет контролу отображать данные имеющие иерархическую структуру и работать с ними.
    * @mixin SBIS3.CONTROLS._TreeMixin
    */
   var _TreeMixin = /** @lends SBIS3.CONTROLS._TreeMixin.prototype */{
      $protected: {
         _openedPath : [],
         _ulClass : 'controls-TreeView__list',
         _options: {
            /**
             * @cfg {Boolean} Отображать сначала узлы, потом листья
             */
            folderSort: false,
            /**
             * @cfg {String} Идентификатор узла, относительно которого надо отображать данные
             */
            root: '',
            /**
             * @cfg {Boolean} При открытия узла закрывать другие
             */
            singleExpand: '',
            /**
             * @cfg {String[]} Набор идентификаторов, обозначающих какую ветку надо развернуть при инициализации
             */
            openedPath: '',
            /**
             * @cfg {String} Поле иерархии
             */
            hierField : null
         }
      },
      $constructor : function() {
         this._items.setHierField(this._options.hierField);
         if (this._options.openedPath) {
            this._openedPath = this._options.openedPath;
         }
      },
      /**
       * Установить корень выборки
       * @param {String} root Идентификатор корня
       */
      setRoot: function(root) {

      },
      /**
       * Открыть определенный путь
       * @param {String[]} path набор идентификаторов
       */
      setOpenedPath: function(path) {

      },
      /**
       * Раскрыть определенный узел
       * @param {String} key Идентификатор раскрываемого узла
       */
      openNode: function(key) {
         var itemCont = $(".controls-ListView__item[data-id='"+key+"']", this.getContainer().get(0));
         $(".js-controls-TreeView__expand", itemCont).first().addClass('controls-TreeView__expand__open');
         $(".controls-TreeView__childContainer", itemCont).first().show();
      },
      /**
       * Закрыть определенный узел
       * @param {String} key Идентификатор раскрываемого узла
       */
      closeNode: function(key) {
         var itemCont = $(".controls-ListView__item[data-id='"+key+"']", this.getContainer().get(0));
         $(".js-controls-TreeView__expand", itemCont).removeClass('controls-TreeView__expand__open');
         $(".controls-TreeView__childContainer", itemCont).hide();
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
      },

      _getOneItemContainer : function(item, key) {
         var oneItemContainer = $('<div>\
            <div class="controls-TreeView__expand js-controls-TreeView__expand"></div>\
            <div class="controls-TreeView__itemContent js-controls-ListView__itemContent"></div>\
         </div>');

         var self = this;
         $(".controls-TreeView__expand", oneItemContainer).click(function(){
            var id = $(this).closest('.controls-ListView__item').attr('data-id');
            self.toggleNode(id)
         });

         return oneItemContainer;
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
            curItem.addClass('controls-TreeView__hasChild');
         }
         else {
            curList = this._getItemsContainer();
         }
         return curList;
      },

      _drawOpenedPath : function() {
         for (var i = 0; i < this._openedPath.length; i++) {
            this.openNode(this._openedPath[i]);
         }
      }
   };

   return _TreeMixin;

});