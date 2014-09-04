define ('js!SBIS3.CONTROLS.Collection', [], function(){
   return $ws.proto.Abstract.extend({
      $protected : {
         _items : [],
         _index : {},
         _keyField : null,
         options : {
            items : [],
            keyField : ''
         }
      },
      $constructor : function() {
         if (this._options.items) {
            this._items = this._options.items;
            if (this._options.keyField) {
               this._keyField = this._options.keyField;
            }
         }
         this._reindex();
      },

      addItem : function(newItem) {
         this._items.push(newItem);
         this._reindex();

      },

      deleteItem : function() {

      },


      /**
       * Получить элемент коллекции по идентификатору
       * @param {String} key идентификатор
       */
      getItem : function(key) {
         return this._index[key];
      },

      /**
       * Получить следующий элемент коллекции по идентификатору
       * @param {String} key идентификатор
       */
      getNextItem: function(key){
         return this._getSibling(key, 'next');
      },

      /**
       * Получить предыдущий элемент коллекции по идентификатору
       * @param {String} key идентификатор
       */
      getPreviousItem: function(key){
         return this._getSibling(key, 'prev');
      },

      getKey : function(item) {
         if (this._keyField) {
            return item[this._keyField];
         }
         else {
            return this._getIndexOf(item);
         }
      },

      _getSibling : function(elKey, type) {
         var sibling = null;
         if (typeof elKey === 'undefined') {
            throw new Error ('key is undefined');
         }
         //Если ключ не задан, то возвращаем первый элемент
         if (elKey === null) {
            sibling = this._items[0] || null;
         }
         else {
            var
               direction = (type == 'next') ? 1 : -1,
               item = this.getItem(elKey);
            if (item) {
               var index = this._getIndexOf(item) + direction;
               if ((index >= 0) && (index <= this._items.length - 1)) {
                  sibling = this._items[index];
               }
            }
         }
         return sibling;
      },


      _getIndexOf: function(item){
         return this._items.indexOf(item);
      },

      iterate : function(hdlFunction) {
         for (var i = 0; i < this._items.length; i++) {
            var key = this._keyField ? this._items[i][this._keyField] : i;
            hdlFunction(this._items[i], key, i);
         }
      },

      _reindex : function() {
         this._index = {};
         var self = this;
         this.iterate(function(item, key, i){
            self._addToIndex(item, key, i);
         });
      },

      _addToIndex : function(item, key, number) {
         if (key === undefined) {
            if (number !== undefined) {
               key = number;
            }
            else {
               throw new Error('Number is undefined');
            }
         }
         this._index[key] = item;
      },

      clear : function() {
         this._items = [];
         this._index = {};
      }
   });
});