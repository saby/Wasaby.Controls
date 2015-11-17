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
             * @cfg {String[]} Массив выбранных записей
             */
            selectedItems : undefined
         }
      },

      $constructor: function() {
         if(!$ws.helpers.instanceOfMixin(this, 'SBIS3.CONTROLS.MultiSelectable')) {
            throw new Error('MultiSelectable mixin is required');
         }

         this._options.selectedItems = this._options.selectedItems || new List({items: []});
      },
      /**
       * Устанавливает массив выбранных записей
       */
      setSelectedItems: propertyUpdateWrapper(function(list) {
         var self = this;

         if($ws.helpers.instanceOfModule(list, 'SBIS3.CONTROLS.Data.Collection.List')) {
            this._options.selectedItems = list;
            this._options.selectedKeys = [];

            list.each(function(rec) {
               self._options.selectedKeys.push(rec.getId());
            });

            if (this._checkEmptySelection()) {
               this._setFirstItemAsSelected();
            }

            this._notifySelectedItems(this._options.selectedKeys);
            this._drawSelectedItems(this._options.selectedKeys);
         }
      }),

      /**
       * Возвращает deferred, рузельтатом которого будет коллекция выделенных элементов
       */
      getSelectedItems: function() {
         var selKeys = this.getSelectedKeys(),
             selItems = this._getSelectedItems(),
             loadKeysArr = [],
             itemKeysArr = [],
             dResult = new $ws.proto.Deferred(),
             dMultiResult, item;

         this._syncSelectedItems();

         /* Сфоримруем из массива выбранных записей, массив ключей этих записей */
         selItems.each(function(rec){
            itemKeysArr.push(rec.getId());
         });

         /* Сфоримруем массив ключей записей, которые требуется вычитать с бл или взять из dataSet'a*/
         for(var i = 0, keys = selKeys.length; i < keys; i++) {
            if(Array.indexOf(itemKeysArr, selKeys[i]) === -1) {
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
               dResult.callback(selItems);
            });

         } else {
            dResult.callback(selItems);
         }
         return dResult;
      },

      _getSelectedItems: function() {
         return this._options.selectedItems;
      },

      /* Синхронизирует выбранные ключи и выбранные записи */
      _syncSelectedItems: function() {
         var self = this,
             selItems = this._getSelectedItems(),
             delItems = [],
             id;

         /* Выбранных ключей нет - очистим IList */
         if(!this.getSelectedKeys().length) {
            selItems.fill();
            return;
         }

         /* Соберём элементы для удаления, т.к. в методе each не отслеживаются изменения IList'а */
         selItems.each(function(rec) {
            id = rec.getId();
            if(Array.indexOf(self._options.selectedKeys, id) === -1) {
               delItems.push(rec);
            }
         });

         if(delItems.length) {
            for(var i = 0, len = delItems.length; i < len; i++) {
               selItems.remove(delItems[i]);
            }
         }
      }
   };

   return ActiveMultiSelectable;

});