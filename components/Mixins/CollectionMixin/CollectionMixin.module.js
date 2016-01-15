define('js!SBIS3.CONTROLS.CollectionMixin', ['js!SBIS3.CONTROLS.Collection', /*TODO для совместимости*/'js!SBIS3.CONTROLS.AdapterJSON'], function(Collection, AdapterJSON) {

   /**
    * Миксин, задающий любому контролу поведение работы с набором однотипных элементов.
    * @mixin SBIS3.CONTROLS.CollectionMixin
    * @author Крайнов Дмитрий Олегович
    */

   var CollectionMixin = {
      /**
       * @event onDrawItems После отрисовки всех элементов
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *     Menu.subscribe('onDrawItems', function(){
       *        if (Menu.getItemsInstance(2).getCaption() == 'Входящие'){
       *           Menu.getItemsInstance(2).destroy();
       *        }
       *     });
       * </pre>
       */
      $protected: {
         _items : null,
         _itemsInstances : {},
         _dotItemTpl: null,
         _keyField : '',
         _options: {
            /**
             * @cfg {String} Поле элемента коллекции, которое является ключом
             * @example
             * <pre>
             *     <option name="keyField">Идентификатор</option>
             * </pre>
             * @see items
             * @see dispalyField
             */
            keyField : null,
            /**
             * @cfg {String} Название поля из набора, отображающее данные
             *  @example
             * <pre>
             *     <option name="displayField">Заголовок</option>
             * </pre>
             * @see keyField
             * @translatable
             */
            displayField: '',
             /**
              * @typedef {Object} Items
              * @property {String} id Идентификатор.
              * @property {String} title Текст пункта меню.
              * @property {String} icon Иконка пункта меню.
              * @property {String} parent Идентификатор родительского пункта меню. Опция задаётся для подменю.
              * @editor icon ImageEditor
              */
            /**
             * @cfg {Items[]} Набор исходных данных, по которому строится отображение
             * @example
             * <pre>
             *     <options name="items" type="array">
             *        <options>
             *            <option name="id">1</option>
             *            <option name="title">Пункт1</option>
             *         </options>
             *         <options>
             *            <option name="id">2</option>
             *            <option name="title">Пункт2</option>
             *         </options>
             *         <options>
             *            <option name="id">3</option>
             *            <option name="title">ПунктПодменю</option>
             *            <option name="parent">2</option>
             *            <option name="icon">sprite:icon-16 icon-Birthday icon-primary</option>
             *         </options>
             *      </options>
             * </pre>
             * @see keyField
             * @see displayField
             */
            items: undefined
         }
      },

      $constructor: function() {
         this._publish('onDrawItems');
         this._initItems(this._options.items || []);
      },

      /**
       * Возвращает коллекцию, заданную либо опций {@link items}, либо методом {@link setItems}.
       * @example
       * <pre>
       *     var
       *        items = this.getItems(),
       *        search = false;
       *     for (var i = 0; i < items.length; i++) {
       *        if (items.getValue(items[i], 'title') == 'Сотрудник') {
       *           search = true;
       *           break;
       *        }
       *     },
       *     if (!search) {
       *        console.log('Папка "Сотрудник" не найдена')
       *     }
       * </pre>
       * @see items
       * @see setItems
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
       /**
        * Метод установки либо замены коллекции элементов, заданной опцией {@link items}.
        * @param {Object} items Набор исходных данных, по которому строится отображение.
        * @example
        * <pre>
        *     setItems: [
        *        {
        *           id: 1,
        *           title: 'Сообщения'
        *        },{
        *           id: 2,
        *           title: 'Прочитанные',
        *           parent: 1
        *        },{
        *           id: 3,
        *           title: 'Непрочитанные',
        *           parent: 1
        *        }
        *     ]
        * </pre>
        * @see items
        * @see addItem
        * @see getItems
        */
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
     /**
      * Добавление одного элемента коллекции
      * @param {Array} item Элемент коллекции.
      * @example
      * <pre>
      *     addItem: {
      *        id: 1,
      *        title: 'Звонки',
      *        icon: 'sprite:icon-16 icon-Phone icon-primary'
      *     }
      * </pre>
      * @see items
      * @see setItems
      */
      addItem : function(item) {
         this._items.addItem(item);
         this._drawItems();
      },

      _drawItems: function(){
         this._clearItems();

         var
            itemsReadyDef = new $ws.proto.ParallelDeferred(),
            self = this,
            targetContainersList = [];



         this._items.iterate(function (item, key, i, parItem, lvl) {

            var
               targetContainer = self._getTargetContainer(item, key, parItem, lvl);

            if (targetContainer) {
               itemsReadyDef.push(self._drawItem(item, targetContainer, key, i, parItem, lvl));
            }

         });
         itemsReadyDef.done().getResult().addCallback(function(){
            self._notify('onDrawItems');
            self._drawItemsCallback();
         });
      },

      _clearItems : function(container) {
         container = container || this._container;
         /*Удаляем компоненты-инстансы элементов*/
         if (!Object.isEmpty(this._itemsInstances)) {
            for (var i in this._itemsInstances) {
               if (this._itemsInstances.hasOwnProperty(i)) {
                  this._itemsInstances[i].destroy();
               }
            }
         }
         this._itemsInstances = {};

         var itemsContainers = $(".controls-ListView__item", container.get(0));
         /*Удаляем вложенные компоненты*/
         $('[data-component]', itemsContainers).each(function(i, item) {
            var inst = $(item).wsControl();
            inst.destroy();
         });

         /*Удаляем сами items*/
         itemsContainers.remove();
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
     /**
      * Метод получения элементов коллекции.
      * @returns {*}
      * @example
      * <pre>
      *     var ItemsInstances = Menu.getItemsInstances();
      *     for (var i = 0; i < ItemsInstances.length; i++){
      *        ItemsInstances[i].setCaption('Это пункт меню №' + ItemsInstances[i].attr('data-id'));
      *     }
      * </pre>
      */
      getItemsInstances : function() {
         return this._itemsInstances;
      },
     /**
      * Метод получения элемента коллекции.
      * @param id Идентификатор элемента коллекции.
      * @returns {*} Возвращает элемент коллекции по указанному идентификатору.
      * @example
      * <pre>
      *     Menu.getItemsInstance(3).setCaption('SomeNewCaption');
      * </pre>
      * @see getItems
      * @see setItems
      * @see items
      * @see getItemInstances
      */
      getItemInstance : function(id) {
         return this._itemsInstances[id];
      }
   };

   return CollectionMixin;

});