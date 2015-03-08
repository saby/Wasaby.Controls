/**
 * Created by iv.cheremushkin on 14.08.2014.
 */

define('js!SBIS3.CONTROLS.Selectable', [], function() {

   /**
    * Миксин, добавляющий поведение хранения выбранного элемента. Всегда только одного
    * @mixin SBIS3.CONTROLS.Selectable
    */

   var Selectable = /**@lends SBIS3.CONTROLS.Selectable.prototype  */{
      $protected: {
         _options: {
            /**
             * @cfg {String} Идентификатор выбранного элемента
             */
            selectedItem : null
         }
      },

      $constructor: function() {
         this._publish('onSelectedItemChange');
      },

      /**
       * Установить выбранный элемент
       * @param id
       */
      setSelectedItem : function(id) {
         this._options.selectedItem = id;
         this.saveToContext('SelectedItem', id); //TODO: Перенести отсюда
         this._drawSelectedItem(id);
         this._notifySelectedItem(id);
      },

      /**
       * Получить выбранные элементы
       */
      getSelectedItem : function() {
         return this._options.selectedItem;
      },

      _drawSelectedItem : function() {
         /*Method must be implemented*/
      },

      _notifySelectedItem : function(id) {
         //TODO: может тут указать, что метод надо переопредить чтобы текст передавать и пр.?
         this._notify('onSelectedItemChange', id);
      }
   };

   return Selectable;

});