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

         /* надо обязательно делать клон массива, чтобы порвать ссылку и не портить значения в контексте */
         this._options.selectedItems = this._makeList((this._options.multiselect ? list.toArray() : list.getCount() > 1 ? [list.at(0)] : list.toArray()).slice());
         this.setSelectedKeys(this._convertToKeys(this._options.selectedItems));
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
             newItems = items instanceof Array ? this._makeList(items) : items,
             selItems = this._options.selectedItems,
             itemsToAdd = [];

         /* Функция проверяет запись на выбранность, если не выбрана, то добавляет в массив для добавления */
         function checkAndPushItem(rec) {
            if(!self._isItemSelected(rec)) {
               itemsToAdd.push(rec);
            }
         }

         /* Если добавляемых элементов нет, то ничего не делаем */
         if(!newItems.getCount()) return;

         /* Если включён множественный выбор, то добавим все, иначе добавим первый */
         this._options.multiselect ?
             newItems.each(checkAndPushItem) :
             checkAndPushItem(newItems.at(0));

         if(itemsToAdd.length) {
            selItems.concat(itemsToAdd);
            this.setSelectedKeys(this._convertToKeys(selItems));
            this._notifyOnPropertyChanged('selectedItems');
         }
      }),

      _convertToKeys: function(list) {
         var keys = [];

         list.each(function(rec) {
            keys.push(rec.getId());
         });

         return keys;

      }
   };

   return ActiveMultiSelectable;

});