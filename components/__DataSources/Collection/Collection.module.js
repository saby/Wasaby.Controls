define ('js!SBIS3.CONTROLS.Collection', [], function(){
   return $ws.proto.Abstract.extend({
      $protected : {
         _data : [],
         _index : {},
         _indexChild : {},
         _keyField : null,
         _hierField : null,
         _hierIterateFlags : {},
         _adapter : null,
         _options : {
            adapter : null,
            data : [],
            keyField : '',
            hierField : null
         }
      },
      $constructor : function() {
         if (this._options.data) {
            this._data = this._options.data;

         }
         if (this._options.keyField) {
            this._keyField = this._options.keyField;
         }
         if (this._options.hierField) {
            this._hierField = this._options.hierField;
         }
         if (this._options.adapter) {
            this._adapter = this._options.adapter;
         }
         this._reindex();
      },

      addItem : function(newItem) {
         this._adapter.addItem(this._data, newItem);
         this._reindex();

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
         var item = this.getItem(key);
         return this._adapter.getSibling(this._data, item, 'next');
      },

      /**
       * Получить предыдущий элемент коллекции по идентификатору
       * @param {String} key идентификатор
       */
      getPreviousItem: function(key){
         var item = this.getItem(key);
         return this._adapter.getSibling(this._data, item, 'prev');
      },

      getKey : function(item) {
         if (this._keyField) {
            return this._adapter.getValue(item, this._keyField)
         }
         else {
            return this._adapter._getIndexOf(item);
         }
      },

      /*TODO проброс метода в Adapter*/
      iterate : function(hdlFunction) {
         var self = this;
         this._adapter.iterate(this._data, function(item, i, parItem, lvl){
            var key;
            if (self._keyField) {
               key = self.getValue(item, self._keyField);
            }
            hdlFunction(item, key, i, parItem, lvl);
         }, self._keyField, self._hierField)
      },

      getValue : function(item, field) {
         return this._adapter.getValue(item, field);
      },



      _reindex : function() {
         this._index = {};
         var self = this;


         this.iterate(function(item, key, i, parItem, lvl){
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

      _getChildItems : function(parentId) {

      },

      clear : function() {
         this._data = [];
         this._index = {};
      },

      getItemsCount : function() {
         return this._adapter.getItemsCount(this._data);
      },

      setHierField : function(hierField) {
         this._hierField = hierField;
      }
   });
});