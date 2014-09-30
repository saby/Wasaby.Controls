define('js!SBIS3.CONTROLS._CollectionMixin', ['js!SBIS3.CONTROLS.Collection'], function(Collection) {

   /**
    * Миксин, задающий любому контролу поведение работы с набором однотипных элементов.
    * @mixin SBIS3.CONTROLS._CollectionMixin
    */

   var _CollectionMixin = /**@lends SBIS3.CONTROLS._CollectionMixin.prototype  */{
      $protected: {
         _items : null,
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
            items: undefined,
            /**
             * @cfg {} Шаблон отображения каждого элемента коллекции
             */
            itemTemplate: ''
         }
      },

      $constructor: function() {
         if (this._options.keyField) {
            this._keyField = this._options.keyField;
         }
         if (this._options.items) {
            this._initItems(this._options.items);
         }
         else {
            this._initItems([]);
         }
         if (!this._options.itemTemplate){
            this._dotItemTpl = doT.template('<div data-key="{{=it.key}}">{{=it.title}}</div>');
         } else {
            this._dotItemTpl = doT.template(this._options.itemTemplate);
         }
      },

      /**
       * Возвращает коллекцию
       */
      getItems : function() {
         return this._items;
      },

      _initItems : function(items) {
         if (!this._keyField) {
            //пробуем взять первое поле из коллекции
            var item = items[0];
            if (item && Object.prototype.toString.call(item) === '[object Object]') {
               this._keyField = Object.keys(item)[0];
            }
         }
         this._items = new Collection({
            items: items,
            keyField: this._keyField
         });
      },

      setItems : function(items) {
         this._initItems(items);
         this._drawItems();
      },

      _drawItems: function(){
         var self = this,
            container = this._getItemsContainer();
         container.empty();
         this._items.iterate(function (item) {
            container.append(self._buildMarkup(self._dotItemTpl, item));
         });
         this._loadChildControls();
      },

      _loadControls: function(pdResult){
         return pdResult.done([]);
      },

      _loadChildControls: function() {
         var def = new $ws.proto.Deferred();
         var self = this;
         self._loadControlsBySelector(new $ws.proto.ParallelDeferred(), undefined, '[data-component]')
            .getResult().addCallback(function () {
               def.callback();
            });
         return def;
      },

      _getItemsContainer: function(){
         return this._container;
      }
   };

   return _CollectionMixin;

});