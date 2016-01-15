/**
 * Created by am.gerasimov on 26.10.2015.
 */
define('js!SBIS3.CONTROLS.ActiveMultiSelectable', [], function() {

   function propertyUpdateWrapper(func) {
      return function() {
         return this.runInPropertiesUpdate(func, arguments);
      };
   }

   /**
    * Миксин, добавляющий поведение хранения одного или нескольких выбранных элементов
    * @mixin SBIS3.CONTROLS.ActiveMultiSelectable
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var ActiveMultiSelectable = /**@lends SBIS3.CONTROLS.ActiveMultiSelectable.prototype  */{
      $protected: {
         _options: {

         }
      },

      $constructor: function() {
         if(!$ws.helpers.instanceOfMixin(this, 'SBIS3.CONTROLS.MultiSelectable')) {
            throw new Error('MultiSelectable mixin is required');
         }
      },
      /**
       * Устанавливает массив выбранных записей
       * @param {Array|SBIS3.CONTROLS.Data.Collection.List} list Выбранные элементы.
       */
      setSelectedItems: propertyUpdateWrapper(function(list) {
         if(list instanceof Array) {
            list = this._makeList(list);
         }

         if(!$ws.helpers.instanceOfModule(list, 'SBIS3.CONTROLS.Data.Collection.List')) {
            throw new Error('setSelectedItems called with invalid argument');
         }

         var selKeys = [];

         /* надо обязательно делать клон массива, чтобы порвать ссылку и не портить значения в контексте */
         this._options.selectedItems = this._makeList((this._options.multiselect ? list.toArray() : list.getCount() > 1 ? [list.at(0)] : list.toArray()).slice());
         this._options.selectedItems.each(function(rec) {
            selKeys.push(rec.getId());
         });
         this.setSelectedKeys(selKeys);
         this._notifyOnPropertyChanged('selectedItems');
      }),

      /**
       * Очищает набор выбранных элементов
       */
      clearSelectedItems: function() {
         this.setSelectedItems([]);
      },


      /**
       * Добавляет переданные элементы к набору выбранных
       * @param {Array | SBIS3.CONTROLS.Data.Collection.List} items
       */
      addSelectedItems: propertyUpdateWrapper(function(items) {
         var self = this,
             selKeys = [],
             newItems = items instanceof Array ? this._makeList(items) : items,
             selItems = this._options.selectedItems;

         /* Не добавляем уже выбранные элементы */
         newItems.each(function(rec) {
            if(self._isItemSelected(rec) !== -1) {
               newItems.remove(rec)
            }
         });
         selItems.concat(newItems);
         selItems.each(function(rec) {
            selKeys.push(rec.getId());
         });
         this.setSelectedKeys(selKeys);
         this._notifyOnPropertyChanged('selectedItems');
      })
   };

   return ActiveMultiSelectable;

});