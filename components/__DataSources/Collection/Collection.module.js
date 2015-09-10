define ('js!SBIS3.CONTROLS.Collection', [], function(){
    /**
     * @class SBIS3.CONTROLS.Collection
     * @author Крайнов Дмитрий Олегович
     * @extends $ws.proto.Abstract
     */
   return $ws.proto.Abstract.extend(/** @lends SBIS3.CONTROLS.Collection.prototype */{
      $protected : {
         _data : [],
         _index : {},
         _options : {
            adapter : null,
            data : [],
            keyField : ''
         }
      },
      $constructor : function() {
         if (this._options.data) {
            this._data = this._options.data;

         }
         this._reindex();
      },

      addItem : function(newItem) {
         this._options.adapter.addItem(this._data, newItem);
         var key = this._options.adapter.getValue(newItem, this._options.keyField);
         this._addToIndex(newItem, key);
      },

      destroyItem : function(id) {
         this._options.adapter.destroyItem(this._data, id, this._options.keyField);
         this._removeFromIndex(id);
      },

      hasChild : function(id) {
         return this._options.adapter.hasChild(this._data, id, this._options.keyField, this._options.hierField);
      },

      getChildItems : function(id, rec) {
         return this._options.adapter.getChildItems(this._data, id, this._options.keyField, this._options.hierField, rec);
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
         return this._options.adapter.getSibling(this._data, item, 'next');
      },

      /**
       * Получить предыдущий элемент коллекции по идентификатору
       * @param {String} key идентификатор
       */
      getPreviousItem: function(key){
         var item = this.getItem(key);
         return this._options.adapter.getSibling(this._data, item, 'prev');
      },

      getKey : function(item) {
         if (this._options.keyField) {
            return this._options.adapter.getValue(item, this._options.keyField)
         }
         else {
            return this._options.adapter._getIndexOf(item);
         }
      },

      getParent : function(item) {
         return this._options.adapter.getParent(item, this._options.hierField);
      },

      /*TODO проброс метода в Adapter*/
      iterate : function(hdlFunction) {
         var self = this;
         this._options.adapter.iterate(this._data, function(item, i, parItem, lvl){
            var key;
            if (self._options.keyField) {
               key = self.getValue(item, self._options.keyField);
            }
            hdlFunction(item, key, i, parItem, lvl);
         }, self._options.keyField, self._options.hierField)
      },

      getValue : function(item, field) {
         return this._options.adapter.getValue(item, field);
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

      _removeFromIndex : function(key) {
         delete (this._index[key]);
      },

      _getChildItems : function(parentId) {

      },

      clear : function() {
         this._data = [];
         this._index = {};
      },
       /**
        * Возвращает количество элементов коллекции.
        * Сначала нужно получить саму коллекцию методом {@link getItems}.
        * Коллекция задаётся либо опций {@link items}, либо методом {@link setItems}.
        * @returns {Number} Количество элементов коллекции.
        * @example
        * <pre>
        *     var
        *        self = this,
        *        topPar = this.getTopParent(),
        *        fHideStraight = false;
        *     if (topPar.getChildControlByName('addDocument').getItems().getItemsCount()===1){
        *           fHideStraight = true;
        *     }
        * </pre>
        */
      getItemsCount : function() {
         return this._options.adapter.getItemsCount(this._data);
      },

      setHierField : function(hierField) {
         this._options.hierField = hierField;
      }
   });
});