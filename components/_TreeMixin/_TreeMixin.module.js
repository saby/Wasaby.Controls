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
            hierField : null,
            openType : 'nothing'
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

      after : {
         _drawItems : function() {
            this._drawOpenedPath();
         }
      },

      around : {
         _drawItem : function(parentFnc, itemContainer, item) {
            var self = this;
            parentFnc.call(this, itemContainer, item);
            var resContainer = itemContainer.hasClass('js-controls-ListView__itemContent') ? itemContainer : $('.js-controls-ListView__itemContent', itemContainer);

            if (!($('.js-controls-TreeView__expand', resContainer).length)) {
               resContainer.before('<div class="controls-TreeView__expand js-controls-TreeView__expand"></div>');
            }

            $(".js-controls-TreeView__expand", itemContainer).click(function(){
               var id = $(this).closest('.controls-ListView__item').attr('data-id');
               self.toggleNode(id)
            });

         }
      },

      _getOneItemContainer : function(item, key) {
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

      _drawOpenedPath : function() {
         var self = this;
         if (this._options.openType == 'all') {
            this._items.iterate(function(item, key){
               self.openNode(key);
            });
         }
         else {
            for (var i = 0; i < this._openedPath.length; i++) {
               this.openNode(this._openedPath[i]);
            }
         }
      }
   };

   return _TreeMixin;

});