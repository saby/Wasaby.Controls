define('js!SBIS3.CONTROLS._CollectionMixin', ['js!SBIS3.CONTROLS.Collection'], function(Collection) {

   /**
    * Добавляет  любому контролу поведение работы с набором однотипных элементов
    * @mixin SBIS3.CONTROLS._CollectionMixin
    */

   var _CollectionMixin = /**@lends SBIS3.CONTROLS._CollectionMixin.prototype  */{
      $protected: {
         _items : null,
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

      _drawItems: function() {
         /*Method must be implemented*/
      }
   };

   return _CollectionMixin;

});