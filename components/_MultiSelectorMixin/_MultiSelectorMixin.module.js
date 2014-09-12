define('js!SBIS3.CONTROLS._MultiSelectorMixin', [], function() {

   /**
    * Миксин, добавляющий поведение хранения одного или нескольких выбранных элементов
    * @mixin SBIS3.CONTROLS._MultiSelectorMixin
    */

   var _MultiSelectorMixin = /**@lends SBIS3.CONTROLS._MultiSelectorMixin.prototype  */{
      $protected: {
         _selectedItems : [],
         _options: {
            /**
             * @cfg {Boolean} Разрешить множественный выбор
             */
            multiselect : true,
            /**
             * @cfg {String[]} Массив идентификаторов выбранных элементов
             */
            selectedItems : []
         }
      },

      $constructor: function() {
         this._publish('onChangeSelectedItems');
         if (this._options.selectedItems) {
            if (Object.prototype.toString.call(this._options.selectedItems) == "[object Array]" ) {
               if (this._options.multiselect) {
                  this._selectedItems = this._options.selectedItems;
               }
               else {
                  this._selectedItems = this._options.selectedItems.slice(0, 1);
               }
            }
            else {
               throw new Error('Argument must be instacnce of Array');
            }
         }
      },

      /**
       * Установить выбранные элементы
       * @param idArray
       */
      setSelectedItems : function(idArray) {
         if (Object.prototype.toString.call(idArray) == "[object Array]" ) {
            if (idArray.length) {
               if (this._options.multiselect) {
                  this._selectedItems = idArray
               }
               else {
                  this._selectedItems = idArray.slice(0, 1);
               }
            }
            else {
               this._selectedItems = [];
            }
            this._drawSelectedItems(this._selectedItems);
            this._notifySelectedItem(this._selectedItems);
         }
         else {
            throw new Error('Argument must be instacnce of Array');
         }
      },

      /**
       * Получить выбранные элементы
       */
      getSelectedItems : function() {
         return this._selectedItems;
      },

      /**
       * Добавить элементы в набор выбранных
       * @param idArray
       */
      addItemsSelection : function(idArray) {
         if (Object.prototype.toString.call(idArray) == "[object Array]" ) {
            if (idArray.length) {
               if (this._options.multiselect) {
                  for (var i = 0; i < idArray.length; i++) {
                     if (this._selectedItems.indexOf(idArray[i]) < 0) {
                        this._selectedItems.push(idArray[i]);
                     }
                  }
               }
               else {
                  this._selectedItems = idArray.slice(0, 1);
               }
            }
            this._drawSelectedItems(this._selectedItems);
            this._notifySelectedItem(this._selectedItems);
         }
         else {
            throw new Error('Argument must be instacnce of Array');
         }

      },

      /**
       * Удалить элементы из набора выбранных
       * @param idArray
       */
      removeItemsSelection : function(idArray) {
         if (Object.prototype.toString.call(idArray) == "[object Array]" ) {
            for (var i = 0; i < idArray.length; i++) {
               var index = this._selectedItems.indexOf(idArray[i]);
               if (index >= 0) {
                  Array.remove(this._selectedItems, index);
               }
            }
            this._drawSelectedItems(this._selectedItems);
            this._notifySelectedItem(this._selectedItems);
         }
         else {
            throw new Error('Argument must be instacnce of Array');
         }
      },

      /**
       * Поменять состояние элементов на противоположное
       * @param idArray
       */
      toggleItemsSelection : function(idArray) {
         if (Object.prototype.toString.call(idArray) == "[object Array]" ) {
            if (idArray.length) {
               if (this._options.multiselect) {
                  for (var i = 0; i < idArray.length; i++) {
                     if (this._selectedItems.indexOf(idArray[i]) < 0) {
                        this.addItemsSelection([idArray[i]])
                     }
                     else {
                        this.removeItemsSelection([idArray[i]])
                     }
                  }
               }
               else {
                  if (this._selectedItems.indexOf(idArray[0]) >= 0) {
                     this._selectedItems = [];
                  }
                  else {
                     this._selectedItems = idArray.slice(0, 1);
                  }
               }
            }
            this._drawSelectedItems(this._selectedItems);
            this._notifySelectedItem(this._selectedItems);
         }
         else {
            throw new Error('Argument must be instacnce of Array');
         }
      },

      _drawSelectedItems : function() {
         /*Method must be implemented*/
      },

      _notifySelectedItem : function(idArray) {
         this._notify('onChangeSelectedItems', idArray);
      }
   };

   return _MultiSelectorMixin;

});