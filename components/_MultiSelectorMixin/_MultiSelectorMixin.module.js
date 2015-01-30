define('js!SBIS3.CONTROLS._MultiSelectorMixin', [], function() {

   /**
    * Миксин, добавляющий поведение хранения одного или нескольких выбранных элементов
    * @mixin SBIS3.CONTROLS._MultiSelectorMixin
    */

   var _MultiSelectorMixin = /**@lends SBIS3.CONTROLS._MultiSelectorMixin.prototype  */{
      $protected: {
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
         this._publish('onSelectedItemsChange');
         if (this._options.selectedItems) {
            if (Object.prototype.toString.call(this._options.selectedItems) == '[object Array]' ) {
               if (!this._options.multiselect) {
                  this._options.selectedItems = this._options.selectedItems.slice(0, 1);
               }
            }
            else {
               throw new Error('Argument must be instance of Array');
            }
         }
      },

      /**
       * Установить выбранные элементы
       * @param idArray
       */
      setSelectedItems : function(idArray) {
         if (Object.prototype.toString.call(idArray) == '[object Array]' ) {
            if (idArray.length) {
               if (this._options.multiselect) {
                  this._options.selectedItems = idArray;
               }
               else {
                  this._options.selectedItems = idArray.slice(0, 1);
               }
            }
            else {
               this._options.selectedItems = [];
            }
            this._drawSelectedItems(this._options.selectedItems);
            this._notifySelectedItem(this._options.selectedItems);
         }
         else {
            throw new Error('Argument must be instance of Array');
         }
      },

      /**
       * Получить выбранные элементы
       */
      getSelectedItems : function() {
         return this._options.selectedItems;
      },

      /**
       * Добавить элементы в набор выбранных
       * @param idArray
       */
      addItemsSelection : function(idArray) {
         if (Object.prototype.toString.call(idArray) == '[object Array]' ) {
            if (idArray.length) {
               if (this._options.multiselect) {
                  for (var i = 0; i < idArray.length; i++) {
                     if (this._options.selectedItems.indexOf(idArray[i]) < 0) {
                        this._options.selectedItems.push(idArray[i]);
                     }
                  }
               }
               else {
                  this._options.selectedItems = idArray.slice(0, 1);
               }
            }
            this._drawSelectedItems(this._options.selectedItems);
            this._notifySelectedItem(this._options.selectedItems);
         }
         else {
            throw new Error('Argument must be instance of Array');
         }

      },

      /**
       * Удалить элементы из набора выбранных
       * @param idArray
       */
      removeItemsSelection : function(idArray) {
         if (Object.prototype.toString.call(idArray) == '[object Array]' ) {
            for (var i = 0; i < idArray.length; i++) {
               var index = this._options.selectedItems.indexOf(idArray[i]);
               if (index >= 0) {
                  Array.remove(this._options.selectedItems, index);
               }
            }
            this._drawSelectedItems(this._options.selectedItems);
            this._notifySelectedItem(this._options.selectedItems);
         }
         else {
            throw new Error('Argument must be instance of Array');
         }
      },

      /**
       * Поменять состояние элементов на противоположное
       * @param idArray
       */
      toggleItemsSelection : function(idArray) {
         if (Object.prototype.toString.call(idArray) == '[object Array]' ) {
            if (idArray.length) {
               if (this._options.multiselect) {
                  for (var i = 0; i < idArray.length; i++) {
                     if (this._options.selectedItems.indexOf(idArray[i]) < 0) {
                        this.addItemsSelection([idArray[i]]);
                     }
                     else {
                        this.removeItemsSelection([idArray[i]]);
                     }
                  }
               }
               else {
                  if (this._options.selectedItems.indexOf(idArray[0]) >= 0) {
                     this._options.selectedItems = [];
                  }
                  else {
                     this._options.selectedItems = idArray.slice(0, 1);
                  }
               }
            }
            this._drawSelectedItems(this._options.selectedItems);
            this._notifySelectedItem(this._options.selectedItems);
         }
         else {
            throw new Error('Argument must be instance of Array');
         }
      },

      _drawSelectedItems : function() {
         /*Method must be implemented*/
      },

      _notifySelectedItem : function(idArray) {
         this._notify('onSelectedItemsChange', idArray);
      }
   };

   return _MultiSelectorMixin;

});