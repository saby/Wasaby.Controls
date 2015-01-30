define('js!SBIS3.CONTROLS.CollectionMixin', ['js!SBIS3.CONTROLS.Collection', /*TODO для совместимости*/'js!SBIS3.CONTROLS.AdapterJSON'], function(Collection, AdapterJSON) {

   /**
    * Миксин, задающий любому контролу поведение работы с набором однотипных элементов.
    * @mixin SBIS3.CONTROLS.CollectionMixin
    */

   var CollectionMixin = /**@lends SBIS3.CONTROLS.CollectionMixin.prototype  */{
      $protected: {
         _items : null,
         _itemsInstances : {},
         _dotItemTpl: null,
         _keyField : '',
         _options: {
            /**
             * @cfg {String} Поле элемента коллекции, которое является ключом
             * */
            keyField : null,
            /**
             * @cfg {Array} Набор исходных данных по которому строится отображение
             */
            items: undefined
         }
      },

      $constructor: function() {
         this._publish('onDrawItems');
         this._initItems(this._options.items || []);
      },

      /**
       * Возвращает коллекцию
       */
      getItems : function() {
         return this._items;
      },

      _initItems : function(items) {
         /*TODO Костыли для совместимости*/
         if (items instanceof Collection) {
            this._items = items;
         }
         else {
            if (!this._options.keyField) {
               //пробуем взять первое поле из коллекции
               var item = items[0];
               if (item && Object.prototype.toString.call(item) === '[object Object]') {
                  this._options.keyField = Object.keys(item)[0];
               }
            }
            this._items = new Collection({
               data: items,
               keyField: this._options.keyField,
               hierField: this._options.hierField,
               adapter: new AdapterJSON()
            });
         }
      },

      setItems : function(items) {
         if (items instanceof Collection) {
            this._items = items;
         }
         else {
            /*TODO Костыли для совместимости
             * позволяет передать в опции коллекцию в неявном виде*/
            this._initItems(items);
         }
         this._drawItems();
      },

      addItem : function(item) {
         this._items.addItem(item);
         this._drawItems();
      },

      _drawItems: function(){
         if (!Object.isEmpty(this._itemsInstances)) {
            for (var i in this._itemsInstances) {
               if (this._itemsInstances.hasOwnProperty(i)) {
                  this._itemsInstances[i].destroy();
               }
            }
         }
         this._itemsInstances = {};
         var
            itemsReadyDef = new $ws.proto.ParallelDeferred(),
            self = this,
            drawStart = false;



         this._items.iterate(function (item, key, i, parItem, lvl) {

            var
               targetContainer = self._getTargetContainer(item, key, parItem, lvl);
            if (!drawStart) {
               targetContainer.empty();
               drawStart = true;
            }
            itemsReadyDef.push(self._drawItem(item, targetContainer, key, i, parItem, lvl));

         });
         itemsReadyDef.done().getResult().addCallback(function(){
            self._notify('onDrawItems');
            self._drawItemsCallback();
         });
      },
      _drawItemsCallback : function() {

      },
      //метод определяющий в какой контейнер разместить определенный элемент
      _getTargetContainer : function() {
         //по стандарту все строки рисуются в itemsContainer
         return this._getItemsContainer();
      },

      //метод отдающий контейнер в котором надо отрисовывать элементы
      _getItemsContainer: function(){
         return this._container;
      },

      _drawItem : function(item, targetContainer) {
         var
            key = this._items.getKey(item),
            self = this;
         return this._createItemInstance(item, targetContainer).addCallback(function(container){
            self._addItemClasses(container, key);
         });
      },

      _getItemTemplate : function() {
         throw new Error('Method _getItemTemplate() must be implemented')
      },

      _addItemClasses : function (container, key){
         container.attr('data-id', key).addClass('controls-ListView__item');
      },

      _createItemInstance : function(item, resContainer) {
         var
            itemTpl = this._getItemTemplate(item),
            def = new $ws.proto.Deferred();

         function drawItemFromTpl(tplConfig, resContainer) {
            var container = $(tplConfig);
            resContainer.append(container);
            def.callback(container);
         }

         if (typeof itemTpl == 'string') {
            drawItemFromTpl.call(this, doT.template(itemTpl)(item), resContainer);
         }
         else if (typeof itemTpl == 'function') {
            var self = this;
            var tplConfig = itemTpl.call(this, item);
            //Может быть DotTepmlate
            if (typeof tplConfig == 'string') {
               drawItemFromTpl.call(this, tplConfig, resContainer);
            }
            //иначе функция выбиратор
            else if (tplConfig.componentType && tplConfig.componentType.indexOf('js!') == 0) {
               //если передали имя класса то реквайрим его и создаем
               require([tplConfig.componentType], function (ctor) {
                  var
                     ctrlWrapper = $("<div></div>").appendTo(resContainer),
                     config = tplConfig.config;
                  config.element = ctrlWrapper;
                  config.parent = self;
                  var ctrl = new ctor(config);
                  self._itemsInstances[self._items.getKey(item)] = ctrl;
                  def.callback(ctrl.getContainer());
               })
            }
            else {
               //и также можно передать dot шаблон
               drawItemFromTpl.call(this, doT.template(tplConfig.componentType)(tplConfig.config), resContainer);
            }
         }
         return def;
      },

      getItemsInstances : function() {
         return this._itemsInstances;
      },
      getItemInstance : function(id) {
         return this._itemsInstances[id];
      }
   };

   return CollectionMixin;

});