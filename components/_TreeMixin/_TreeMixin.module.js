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
         var itemCont = $("li[data-id='"+key+"']", this.getContainer().get(0));
         $(".js-controls-TreeView__expand", itemCont).first().addClass('controls-TreeView__expand__open');
         $(".controls-TreeView__list", itemCont).first().show();
      },
      /**
       * Закрыть определенный узел
       * @param {String} key Идентификатор раскрываемого узла
       */
      closeNode: function(key) {
         var itemCont = $("li[data-id='"+key+"']", this.getContainer().get(0));
         $(".js-controls-TreeView__expand", itemCont).removeClass('controls-TreeView__expand__open');
         $(".controls-TreeView__list", itemCont).hide();
      },

      /**
       * Закрыть или открыть определенный узел
       * @param {String} key Идентификатор раскрываемого узла
       */
      toggleNode: function(key) {
         var itemCont = $("li[data-id='"+key+"']", this.getContainer().get(0));
         if ($(".js-controls-TreeView__expand", itemCont).hasClass('controls-TreeView__expand__open')) {
            this.closeNode(key);
         }
         else {
            this.openNode(key);
         }
      },


      _drawItems: function() {
         var self = this,
            container = this._getItemsContainer();
         container.empty();

         this._items.iterate(function (item, key, i, parItem, lvl) {
            var itemDiv = $("<div data-id='"+ key +"'></div>").addClass('Controls-ListView__item');

            if (parItem) {
               var
                  curList,
                  parKey = self._items.getKey(parItem),
                  curItem =  $(".Controls-ListView__item[data-id='"+parKey+"']", self.getContainer().get(0));
               curList = $(".controls-TreeView__childContainer", curItem.get(0)).first();
               if (!curList.length) {
                  curList = $("<div></div>").appendTo(curItem).addClass('controls-TreeView__childContainer');
               }
               curItem.addClass('controls-TreeView__hasChild');
            }
            else {
               curList = container;
            }

            self._drawItem(itemDiv, item);
            itemDiv.appendTo(curList);

         });
         this._loadChildControls();
         this._drawOpenedPath();
      },

      _drawItem : function(itemContainer, item) {
         var
            self = this,
            def = new $ws.proto.Deferred(),
            itemTpl = this._options.itemTemplate;
         if (typeof itemTpl == 'string') {
            this._drawTpl(itemContainer, item)
         }
         else if (typeof itemTpl == 'function') {
            var tplConfig = itemTpl.call(this, item);
            var helpCntr = $('<div></div>').appendTo(itemContainer);
            require([tplConfig.componentType], function(ctor){
               var config = tplConfig.config;
               config.element = helpCntr;
               new ctor(config)
            })
         }
         var expand = $('<div></div>').addClass('controls-TreeView__expand').addClass('js-controls-TreeView__expand').prependTo(itemContainer);
         expand.click(function(){
            var id = $(this).closest('.controls-TreeView__item').attr('data-id');
            self.toggleNode(id)
         });
         return def;
      },

      _drawOpenedPath : function() {
         for (var i = 0; i < this._openedPath.length; i++) {
            this.openNode(this._openedPath[i]);
         }
      }
   };

   return _TreeMixin;

});