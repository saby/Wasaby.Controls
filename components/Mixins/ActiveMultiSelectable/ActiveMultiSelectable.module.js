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
             selItems = this._options.selectedItems;

         /* Если добавляемых элементов нет, то ничего не делаем */
         /* TODO в 3.7.3.100 добавить проверку, надо ли вообще что-то добавлять, возможно уже что все переданные записи есть
            Задача в разработку от 09.02.2016 №1172587090
            Добавить проверку в ActiveMultiSelectable на добавляемость элементов, чтобы уменьшить возможно ко...
            https://inside.tensor.ru/opendoc.html?guid=f206f51b-f653-4337-acdb-7472ccee8a9c */
         if(!newItems.getCount()) return;

         if(this._options.multiselect) {
            newItems.each(function(rec) {
               if(self._isItemSelected(rec.getId()) === -1) {
                  selItems.add(rec);
               }
            });
         } else {
            selItems[selItems.getCount() ? 'replace' : 'add'](newItems.at(0), 0);
         }

         this.setSelectedKeys(this._convertToKeys(selItems));
         this._notifyOnPropertyChanged('selectedItems');
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