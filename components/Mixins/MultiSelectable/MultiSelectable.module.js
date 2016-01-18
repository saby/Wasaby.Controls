define('js!SBIS3.CONTROLS.MultiSelectable', ['js!SBIS3.CONTROLS.Data.Collection.List'], function(List) {

   /**
    * Миксин, добавляющий поведение хранения одного или нескольких выбранных элементов
    * @mixin SBIS3.CONTROLS.MultiSelectable
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var MultiSelectable = /**@lends SBIS3.CONTROLS.MultiSelectable.prototype  */{
       /**
        * @typedef {Object} ChangedKeys
        * @property {Array.<String>} added ключи, которые добавились
        * @property {Array.<String>} removed ключи, которые удалились
        *
        * @event onSelectedItemsChange При смене выбранных элементов коллекции
        * @param {$ws.proto.EventObject} Дескриптор события.
        * @param {Array.<String>} idArray Массив ключей выбранных элементов.
        * @param {ChangedKeys} changedKeys Измененные ключи
        * @example
        * <pre>
        *     var itemsChanged = function() {
        *        var count = this.getSelectedKeys().length;
        *        if (count < 1) {
        *           info.setText('Выберите хотя бы 1 вариант');
        *        } else {
        *           info.setText('');
        *        }
        *     }
        *     checkBoxGroup.subscribe('onSelectedItemsChange', itemsChanged);
        * </pre>
        * @see selectedKeys
        * @see setSelectedKeys
        * @see setSelectedItemsAll
        * @see addItemsSelection
        * @see removeItemsSelection
        * @see removeItemsSelectionAll
        * @see toggleItemsSelection
        * @see toggleItemsSelectionAll
        */
      $protected: {
         _options: {
            /**
             * @cfg {Boolean} Разрешить множественный выбор
             * @example
             * <pre>
             *     <option name="multiselect">false</option>
             * </pre>
             * @see selectedKeys
             */
            multiselect : true,
            /**
             * @cfg {String[]} Массив идентификаторов выбранных элементов
             * @example
             * <pre>
             *     <options name="selectedKeys" type="array">
             *        <option type="string">1</option>
             *        <option type="string">2</option>
             *     </options>
             * </pre>
             * @see multiselect
             * @see allowEmptySelection
             * @see setSelectedKeys
             * @see getSelectedKeys
             * @see addItemsSelection
             * @see removeItemsSelection
             * @see removeItemsSelectionAll
             * @see toggleItemsSelection
             * @see toggleItemsSelectionAll
             */
            selectedKeys : [],
             /**
              * @cfg {Boolean} Разрешить отсутствие выбранного элемента в группе
              * @example
              * <pre>
              *     <option name="allowEmptySelection">false</option>
              * </pre>
              * @see selectedKeys
              * @see removeItemsSelectionAll
              * @see removeItemsSelection
              * @see toggleItemsSelection
              * @see toggleItemsSelectionAll
              */
            allowEmptySelection : true,
            /**
             * @cfg {SBIS3.CONTROLS.Data.Collection.List} Набор выбранных записей
             * @see getSelectedItems
             */
            selectedItems : undefined
         },
         _loadItemsDeferred: undefined
      },

      $constructor: function() {
         this._publish('onSelectedItemsChange');

         this._options.selectedItems = $ws.helpers.instanceOfModule(this._options.selectedItems, 'SBIS3.CONTROLS.Data.Collection.List') ?
             this._options.selectedItems :
             this._makeList(this._options.selectedItems);

         if (this._options.selectedKeys && this._options.selectedKeys.length) {
            if (Array.isArray(this._options.selectedKeys)) {
               if (!this._options.multiselect) {
                  this._options.selectedKeys = this._options.selectedKeys.slice(0, 1);
               }
            }
            else {
               throw new Error('Argument must be instance of Array');
            }
         }
         else {
            if (this._options.allowEmptySelection == false) {
               this._setFirstItemAsSelected();
            }
         }
      },

      after : {
         init: function () {
            this._drawSelectedItems(this._options.selectedKeys);
         }
      },
      /**
       * Устанавливает выбранные элементы по id.
       * @param {Array} idArray Массив идентификаторов выбранных элементов.
       * @example
       * <pre>
       *    if (!checkBoxGroup.getSelectedKeys().length) {
       *       checkBoxGroup.setSelectedKeys([1,3]);
       *    }
       * </pre>
       * @see getSelectedKeys
       * @see removeItemsSelection
       * @see addItemsSelection
       */
      setSelectedKeys : function(idArray) {

         function ArrayDifference(arr1,arr2){
            var idx = 0, arr3 = [];
            for (var i = 0; i < arr1.length; i++){
               var
                  findElem = arr1[i],
                  result = true;
               idx = arr2.indexOf(arr1[i]);
               if (idx < 0) {
                  findElem = (typeof findElem === 'string') ? findElem - 0 : findElem + '';
                  idx = arr2.indexOf(findElem);
                  if (idx >= 0) {
                     result = false;
                  }
               }
               else {
                  result = false;
               }
               if (result) {
                  arr3.push(arr1[i]);
               }
            }
            return arr3;
         }


         var addedKeys = [], removedKeys = [];
         if (Array.isArray(idArray)) {
            if (idArray.length) {
               if (this._options.multiselect) {
                  removedKeys = ArrayDifference(this._options.selectedKeys, idArray);
                  addedKeys = this._addItemsSelection(idArray);
               }
               else {
                  removedKeys = $ws.core.clone(this._options.selectedKeys);
                  this._options.selectedKeys = idArray.slice(0, 1);
               }
            }
            else {
               removedKeys = $ws.core.clone(this._options.selectedKeys);
               this._options.selectedKeys = [];
            }
	         this._afterSelectionHandler(addedKeys, removedKeys);
         }
         else {
            throw new Error('Argument must be instance of Array');
         }
      },

      /**
       * Устанавливает все элементы выбранными.
       * @example
       * <pre>
       *     if (checkBox.isChecked()) {
       *        checkBoxGroup.setSelectedItemsAll();
       *     }
       * </pre>
       * @see selectedKeys
       * @see removeItemsSelection
       * @see removeItemsSelectionAll
       * @see getSelectedKeys
       * @see addItemsSelection
       * @see multiselect
       */
      setSelectedItemsAll : function() {
         if (this._dataSet) {
            var items = [];
            this._dataSet.each(function(rec){
               items.push(rec.getKey())
            });
            this.setSelectedKeys(items);
         }

      },

      /**
       * Получает индентификаторы выбранных элементов.
       * @example
       * <pre>
       *    if (!checkBoxGroup.getSelectedKeys().length) {
       *       checkBoxGroup.setSelectedKeys([1,3]);
       *    }
       * </pre>
       * @see selectedKeys
       * @see setSelectedKeys
       * @see addItemsSelection
       * @see multiselect
       */
      getSelectedKeys : function() {
         return this._options.selectedKeys;
      },

      /**
       * Добавить указанные элементы в набор выбранных.
       * @param {Array} idArray Массив идентификаторов добавляемых к выбранным элементов.
       * @example
       * <pre>
       *    var keys = checkBoxGroup.getSelectedKeys();
       *    if (keys.indexOf(1)) {
       *       checkBoxGroup.addItemsSelection([2]);
       *    }
       * </pre>
       * @see setSelectedKeys
       * @see getSelectedKeys
       * @see setSelectedItemsAll
       * @see removeItemsSelection
       * @see removeItemsSelectionAll
       * @see multiselect
       */
      addItemsSelection : function(idArray) {
         var addedKeys = this._addItemsSelection(idArray);
         this._afterSelectionHandler(addedKeys, []);
      },
      _addItemsSelection : function(idArray) {
         var addedKeys = [];
         if (Array.isArray(idArray)) {
            if (idArray.length) {
               if (this._options.multiselect) {
                  for (var i = 0; i < idArray.length; i++) {
                     if (!this._isItemSelected(idArray[i])) {
                        this._options.selectedKeys.push(idArray[i]);
                        addedKeys.push(idArray[i])
                     }
                  }
               }
               else {
                  this._options.selectedKeys = idArray.slice(0, 1);
               }
            }
            return addedKeys;
         }
         else {
            throw new Error('Argument must be instance of Array');
         }
      },

      /**
       * Удаляет указанные элементы из набора выбранных.
       * @param {Array} idArray Массив идентификаторов элементов к удалению из выбранных.
       * @example
       * <pre>
       *     if (checkBox.isChecked()) {
       *        checkBoxGroup.removeItemsSelection([2]);
       *     }
       * </pre>
       * @see removeItemsSelectionAll
       * @see getSelectedKeys
       * @see allowEmptySelection
       */
      removeItemsSelection : function(idArray) {
         var removedKeys = this._removeItemsSelection(idArray);
         this._afterSelectionHandler([], removedKeys);
      },

      _removeItemsSelection : function(idArray) {
         var removedKeys = [],
             keys = this.getSelectedKeys();

         if (Array.isArray(idArray)) {
            for (var i = idArray.length - 1; i >= 0; i--) {
               if (this._isItemSelected(idArray[i])) {
                  Array.remove(keys, this._getSelectedIndex(idArray[i]));
                  removedKeys.push(idArray[i]);
               }
            }
            return removedKeys;
         }
         else {
            throw new Error('Argument must be instance of Array');
         }
      },

      /**
       * Убрать все элементы из набора выбранных.
       * @example
       * <pre>
       *     if (checkBoxGroup.getSelectedKeys().indexOf(3))  {
       *        checkBoxGroup.removeItemsSelectionAll();
       *        checkBoxGroup.setSelectedKeys([3]);
       *     }
       * </pre>
       * @see removeItemsSelection
       * @see getSelectedKeys
       * @see toggleItemsSelectionAll
       * @see allowEmptySelection
       */
      removeItemsSelectionAll : function() {
         this.setSelectedKeys([]);
      },

      /**
       * Меняет состояние выбранности указанных элементов на противоположное.
       * @param {Array} idArray Массив идентификаторов элементов для инвертирования отметки.
       * @example
       * <pre>
       *     if (needToggle) {
       *        checkBoxGroup.toggleItemsSelection([2,3]);
       *     }
       * </pre>
       * @see getSelectedKeys
       * @see setSelectedKeys
       * @see toggleItemsSelectionAll
       * @see multiselect
       */
      toggleItemsSelection : function(idArray) {
         if (Array.isArray(idArray)) {
            if (idArray.length) {
               var
                  addedKeysTotal = [],
                  removedKeysTotal = [],
                  addedKeys,
                  removedKeys;
               if (this._options.multiselect) {
                  for (var i = 0; i < idArray.length; i++) {
                     if (!this._isItemSelected(idArray[i])) {
                        addedKeys = this._addItemsSelection([idArray[i]]);
                        addedKeysTotal = addedKeysTotal.concat(addedKeys);
                     }
                     else {
                        removedKeys = this._removeItemsSelection([idArray[i]]);
                        removedKeysTotal = removedKeysTotal.concat(removedKeys);
                     }
                  }
               }
               else {
                  if (this._isItemSelected(idArray[0])) {
                     removedKeysTotal = $ws.core.clone(this._options.selectedKeys);
                     this._options.selectedKeys = [];
                  }
                  else {
                     removedKeysTotal = $ws.core.clone(this._options.selectedKeys);
                     this._options.selectedKeys = idArray.slice(0, 1);
                     addedKeysTotal = $ws.core.clone(this._options.selectedKeys);
                  }
               }
               this._afterSelectionHandler(addedKeysTotal, removedKeysTotal);
            }
         }
         else {
            throw new Error('Argument must be instance of Array');
         }
      },

      /**
       * Меняет состояние выбранности всех элементов на противоположное.
       * @example
       * <pre>
       *     if (checkBoxGroup.getSelectedKeys().count == 0) {
       *        checkBoxGroup.toggleItemsSelectionAll();
       *     }
       * </pre>
       * @see removeItemsSelectionAll
       * @see toggleItemsSelection
       * @see multiselect
       * @see allowEmptySelection
       */
      toggleItemsSelectionAll : function() {
         if (this._dataSet) {
            var items = [];
            this._dataSet.each(function(rec){
               items.push(rec.getKey())
            });
            this.toggleItemsSelection(items);
         }
      },
      /**
       * Возвращает набор выбранных элементов
       * @param loadItems загружать ли записи, если их нет в текущем наборе выбранных и они отсутствуют в dataSet'e
       * @returns {SBIS3.CONTROLS.Data.Collection.List} Возвращает коллекцию элементов
       * @example
       * <pre>
       *    if (!checkBoxGroup.getSelectedItems().at(0).get('Текст') === 'Не выбрано') {
       *       myControl.setEnabled(false);
       *    }
       * </pre>
       * @see multiselect
       */
      getSelectedItems: function(loadItems) {
         var self = this,
             selKeys = this._options.selectedKeys,
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
            itemKeysArr.push(rec.getKey());
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
               item = this._dataSet && this._dataSet.getRecordById(loadKeysArr[j]);

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

      /**
       * Синхронизирует выбранные ключи и выбранные записи
       * @private
       */
      _syncSelectedItems: function() {
         var self = this,
             selItems = this._options.selectedItems,
             delItems = [];

         /* Выбранных ключей нет - очистим IList */
         if(!this.getSelectedKeys().length) {
            if(selItems.getCount()) {
               selItems.clear();
               this._notifyOnPropertyChanged('selectedItems');
            }
            return;
         }

         /* Соберём элементы для удаления, т.к. в методе each не отслеживаются изменения IList'а */
         selItems.each(function(rec) {
            if(!self._isItemSelected(rec.getKey())) {
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

      _isItemSelected : function(item) {
         return this._getSelectedIndex(item) !== -1;
      },

      _getSelectedIndex: function(item) {
         var keys = this._options.selectedKeys,
             index;

         if($ws.helpers.instanceOfModule(item, 'SBIS3.CONTROLS.Data.Model')) {
            index = this._options.selectedItems.getIndexByValue(item.getKeyField(), item.getKey());
         } else {
            index = Array.indexOf(keys, item);
            if (index < 0) {
               index = Array.indexOf(keys, parseInt(item, 10));
            }
            if (index < 0) {
               index = Array.indexOf(keys, String(item));
            }
         }
         return index;
      },

      _drawSelectedItems : function() {
         /*Method must be implemented*/
      },

      _makeList: function(listItems) {
         return new List({items: listItems ? listItems : []});
      },

	   _afterSelectionHandler: function(addedKeys, removedKeys) {
		   if (this._checkEmptySelection()) {
			   this._setFirstItemAsSelected();
		   }
		   this._notifySelectedItems(this._options.selectedKeys, {
            added : addedKeys,
            removed : removedKeys
         });
		   this._drawSelectedItems(this._options.selectedKeys);
	   },

      _notifySelectedItems : function(idArray, changed) {
         this._setSelectedItems();
         this._notifyOnPropertyChanged('selectedKeys');
         this._notify('onSelectedItemsChange', idArray, changed);
      },

      _dataLoadedCallback : function(){
         if (this._checkEmptySelection()) {
            this._setFirstItemAsSelected();
         }
      },

      _setFirstItemAsSelected : function() {
         if (this._dataSet) {
            this._options.selectedKeys = [this._dataSet.at(0).getKey()];
         }
      },

      _checkEmptySelection: function() {
         return !this._options.selectedKeys.length && this._options.allowEmptySelection == false;
      },

      _getSelItemsClone: function() {
         /* надо обязательно делать клон массива, чтобы порвать ссылку и не портить при изменении значения в контексте */
         return this._makeList(this._options.selectedItems.toArray().slice());
      },

      _setSelectedItems: function() {
         var dataSet = this.getDataSet(),
             self = this,
             record;

         if (dataSet) {
            this._syncSelectedItems();
            $ws.helpers.forEach(this.getSelectedKeys(), function (key) {
               record = dataSet.getRecordById(key);
               if (record && !self._isItemSelected(record)) {
                  self._options.selectedItems.add(record);
               }
            });
         }
      }
   };

   return MultiSelectable;

});