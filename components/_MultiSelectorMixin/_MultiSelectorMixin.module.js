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
            multiselect : true
         }
      },

      $constructor: function() {

      },

      /**
       * Установить выбранные элементы
       * @param idArray
       */
      setSelectedItems : function(idArray) {

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

      },

      /**
       * Удалить элементы из набора выбранных
       * @param idArray
       */
      removeItemsSelection : function(idArray) {

      }
   };

   return _MultiSelectorMixin;

});