/**
 * Created by am.gerasimov on 26.10.2015.
 */
define('js!SBIS3.CONTROLS.ActiveMultiSelectable', ['js!SBIS3.CONTROLS.Data.Source.DataSet', 'js!SBIS3.CONTROLS.SbisJSONStrategy'], function(DataSet, SbisJSONStrategy) {

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
            selectedItems : []
         }
      },

      $constructor: function() {
         if(!$ws.helpers.instanceOfMixin(this, 'SBIS3.CONTROLS.MultiSelectable')) {
            throw new Error('MultiSelectable mixin is required');
         }
      },
      /**
       * Устанавливает массив выбранных записей, по переданному датасету
       */
      setSelectedItems: propertyUpdateWrapper(function(dataSet) {
         var self = this,
             isDataSet = $ws.helpers.instanceOfModule(dataSet, 'SBIS3.CONTROLS.DataSet') || $ws.helpers.instanceOfModule(dataSet, 'SBIS3.CONTROLS.Data.Source.DataSet'),
             iterator = isDataSet ? dataSet.each : $ws.helpers.forEach;

         function iteratorCallback(rec) {
            self._options.selectedItems.push(rec);
            self._options.selectedKeys.push(rec.getKey());
         }

         this._options.selectedKeys = [];
         this._options.selectedItems = [];

         iterator.apply(dataSet, (isDataSet ? [iteratorCallback] : [dataSet, iteratorCallback]));

         if (this._checkEmptySelection()) {
            this._setFirstItemAsSelected();
         }

         this._notifySelectedItems(this._options.selectedKeys);
         this._drawSelectedItems(this._options.selectedKeys);
      }),

      /**
       * Возвращает deferred, рузельтатом которого будет DataSet выделенных элементов
       */
      getSelectedItems: function() {
         var self = this,
            selKeys = this._options.selectedKeys,
            loadKeysArr = [],
            itemKeysArr = [],
            dResult = new $ws.proto.Deferred(),
            newDsOptions = {
               keyField: self._options.keyField,
               strategy: new SbisJSONStrategy()
            },
            dMultiResult, item, dataSetItems;

         this._syncSelectedItems();

         /* Сфоримруем из массива выбранных записей, массив ключей этих записей */
         for(var i = 0, items = this._options.selectedItems.length; i < items; i++) {
            itemKeysArr.push(this._options.selectedItems[i].getKey());
         }

         /* Сфоримруем массив ключей записей, которые требуется вычитать с бл или взять из dataSet'a*/
         for(var j = 0, keys = selKeys.length; j < keys; j++) {
            if(Array.indexOf(itemKeysArr, selKeys[j]) === -1) {
               loadKeysArr.push(selKeys[j]);
            }
         }

         if(loadKeysArr.length) {
            dMultiResult = new $ws.proto.ParallelDeferred({stopOnFirstError: false});
            dataSetItems = [];

            for (var g = 0; loadKeysArr.length > g; g++) {
               item = this._dataSet && this._dataSet.getRecordByKey(loadKeysArr[g]);

               /* если запись есть в датасете, то ничего не будем вычитывать */
               if(item) {
                  dataSetItems.push(item);
                  continue;
               }

               dMultiResult.push(this._dataSource.read(loadKeysArr[g]).addCallback(function (record) {
                  self._options.selectedItems.push(record);
               }));
            }

            dMultiResult.done().getResult().addCallback(function() {
               var dataSet = new DataSet(newDsOptions);
               self._options.selectedItems = self._options.selectedItems.concat(dataSetItems);
               dataSet.insert(self._options.selectedItems);
               dResult.callback(dataSet);
            });

         } else {
            var dataSet = new DataSet(newDsOptions);
            dataSet.insert(self._options.selectedItems);
            dResult.callback(dataSet);
         }
         return dResult;
      },

      /* Синхронизирует выбранные ключи и выбранные записи */
      _syncSelectedItems: function() {
         var count = 0,
            selItems = this._options.selectedItems,
            index;

         if(!this.getSelectedKeys().length) {
           //FIXME Это сделано специально для демки, по делу если нет выбранных ключей, то и выбранных элементов быть не должно, обязательно это вернуть
           // this._options.selectedItems = [];
            return;
         }

         for(var i = 0, len = selItems.length; i < len; i ++) {
            index = i - count;
            if(selItems[index] && Array.indexOf(this._options.selectedKeys, selItems[index].getKey()) === -1) {
               selItems.splice(index, 1);
               count++;
            }
         }
      }
   };

   return ActiveMultiSelectable;

});