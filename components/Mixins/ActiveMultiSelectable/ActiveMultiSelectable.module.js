/**
 * Created by am.gerasimov on 26.10.2015.
 */
define('js!SBIS3.CONTROLS.ActiveMultiSelectable', ['js!SBIS3.CONTROLS.Data.Collection.List'], function(List) {

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
            /**
             * @cfg {String[]} Набор выбранных записей
             */
            selectedItems : undefined
         },
         _loadItemsDeferred: undefined
      },

      $constructor: function() {
         if(!$ws.helpers.instanceOfMixin(this, 'SBIS3.CONTROLS.MultiSelectable')) {
            throw new Error('MultiSelectable mixin is required');
         }

         this._options.selectedItems = $ws.helpers.instanceOfMixin(this, 'SBIS3.CONTROLS.Data.Collection.List') ?
             this._options.selectedItems :
             this._makeList([]);
      },
      /**
       * Устанавливает массив выбранных записей
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
         this.setSelectedItems(new List());
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
      }),

      _makeList: function(listItems) {
         return new List({items: listItems});
      },

      _getSelItemsClone: function() {
         /* надо обязательно делать клон массива, чтобы порвать ссылку и не портить при изменении значения в контексте */
         return this._makeList(this._options.selectedItems.toArray().slice());
      },
      /**
       * Возвращает набор выбранных элементов
       * @param loadItems загружать ли записи
       * @returns {SBIS3.CONTROLS.Data.Collection.List} Возвращает коллекцию элементов
       */
      getSelectedItems: function(loadItems) {
         var self = this,
             selKeys = this.getSelectedKeys(),
             selItems = this._options.selectedItems,
             loadKeysArr = [],
             itemKeysArr = [],
             dMultiResult, item;

         this._syncSelectedItems();

         if(!loadItems) {
            return this._getSelItemsClone();
         }

         if(this._loadItemsDeferred && !this._loadItemsDeferred.isReady()) {
            return this._loadItemsDeferred;
         }

         this._loadItemsDeferred = new $ws.proto.Deferred();
         /* Сфоримруем из массива выбранных записей, массив ключей этих записей */
         selItems.each(function(rec){
            itemKeysArr.push(rec.getId());
         });

         /* Сфоримруем массив ключей записей, которые требуется вычитать с бл или взять из dataSet'a*/
         for(var i = 0, keys = selKeys.length; i < keys; i++) {
            if(Array.indexOf(itemKeysArr, selKeys[i]) === -1 && Array.indexOf(itemKeysArr, parseInt(selKeys[i], 10)) === -1) {
               loadKeysArr.push(selKeys[i]);
            }
         }

         if(loadKeysArr.length) {
            dMultiResult = new $ws.proto.ParallelDeferred({stopOnFirstError: false});

            for (var j = 0; loadKeysArr.length > j; j++) {
               item = this._dataSet && this._dataSet.getRecordByKey(loadKeysArr[j]);

               /* если запись есть в датасете, то ничего не будем вычитывать */
               if(item) {
                  selItems.add(item);
                  continue;
               }

               dMultiResult.push(this._dataSource.read(loadKeysArr[j]).addCallback(function (record) {
                  selItems.add(record);
               }));
            }

            dMultiResult.done().getResult().addCallback(function() {
               self._loadItemsDeferred.callback(self._getSelItemsClone());
               self._notifyOnPropertyChanged('selectedItems');
            });

         } else {
            self._loadItemsDeferred.callback(self._getSelItemsClone());
         }
         return this._loadItemsDeferred;
      },
      /* Синхронизирует выбранные ключи и выбранные записи */
      _syncSelectedItems: function() {
         var self = this,
             selKeys = this.getSelectedKeys(),
             selItems = this._options.selectedItems,
             delItems = [],
             id;

         /* Выбранных ключей нет - очистим IList */
         if(!selKeys.length) {
            if(selItems.getCount()) {
               selItems.fill();
               this._notifyOnPropertyChanged('selectedItems');
            }
            return;
         }

         /* Соберём элементы для удаления, т.к. в методе each не отслеживаются изменения IList'а */
         selItems.each(function(rec) {
            /* ключи могут быть и строкой, поэтому надо проверить и на строку */
            if(self._isItemSelected(rec.getId()) === -1) {
               delItems.push(rec);
            }
         });

         if(delItems.length) {
            for(var i = 0, len = delItems.length; i < len; i++) {
               selItems.remove(delItems[i]);
            }
            this._notifyOnPropertyChanged('selectedItems');
         }
      },
      around: {
         _isItemSelected: function(parentFunc, item) {
            return parentFunc.call(this, item.getId ? item.getId() : item);
         }
      }
   };

   return ActiveMultiSelectable;

});