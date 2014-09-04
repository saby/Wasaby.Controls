/**
 * Created by iv.cheremushkin on 14.08.2014.
 */

define('js!SBIS3.CONTROLS._SelectorMixin', [], function() {

   /**
    * Добавляет любому контролу поведение хранения выбранных элементов
    * @mixin SBIS3.CONTROLS._SelectorMixin
    */

   var _SelectorMixin = /**@lends SBIS3.CONTROLS._SelectorMixin.prototype  */{
      $protected: {
         _selectedItem : null,
         _options: {

         }
      },

      $constructor: function() {

      },

      /**
       * Установить выбранный элемент
       * @param id
       */
      setSelectedItem : function(id) {
         this._selectedItem = id;
         this._drawSelectedItem(id);
      },

      /**
       * Получить выбранные элементы
       */
      getSelectedItem : function() {
         return this._selectedItem;
      },

      _drawSelectedItem : function() {
         /*Method must be implemented*/
      }
   };

   return _SelectorMixin;

});