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
             * @cfg {Boolean} Устанавливает режим множественного выбора элементов коллекции.
             * @variant true Режим множественного выбора элементов коллекции установлен.
             * @variant false Режим множественного выбора элементов коллекции отменен.
             * @remark
             * Режим множественного выбора - это режим работы контрола, который позволяет выбрать несколько значений
             * из элементов коллекции.
             * Установленный режим множественного выбора для поля связи означает, что очередной выбранный элемент коллекции
             * будет добавляться к предыдущему выбранному элементу, а не заменять его.
             * Режим множественного выбора работает независимо от единичного;
             * режим единичного выбора добавляется миксином {@link SBIS3.CONTROLS.Selectable}.
             *
             * Отображение множественного выбора будет различаться в зависимости от контрола,
             * в котором может быть использован данный режим:
             * - в табличном представлении это будет некоторое количество записей таблицы, выделенных флагами:
             * ![](/MultiSelectable01.png)
             * - для поля связи это будет строка, содержащая текстовые значения полей выбранных записей, соединенных запятой:
             * ![](/MultiSelectable02.png)
             * Множественный выбор записей в {@link SBIS3.CONTROLS.FieldLink поле связи} позволяет связать с текущим диалогом
             * определенное количество записей.
             * @example
             * <pre>
             *    <option name="multiselect">false</option>
             *    <option name="multiselect" type="boolean" value="false"></option>
             * </pre>
             * @see selectedKeys
             */
            multiselect : true,
            /**
             * @cfg {String[]} Определяет массив идентификаторов выбранных элементов.
             * @remark
             * Используется для построения контрола с определенным массивом элементов коллекции.
             * Для задания выбранных элементов необходимо указать значения
             * {@link SBIS3.CONTROLS.DSMixin#keyField ключевого поля} элементов коллекции.
             * Работает в режиме множественного выбора {@link multiselect}.
             * Использование методов для работы с элементами коллекции в режиме множественного выбора позволяет:
             * <ul>
             *     <li>{@link setSelectedKeys} - установить новый массив идентификаторов;</li>
             *     <li>{@link getSelectedKeys} - получить массив идентификаторов выбранных элементов;</li>
             *     <li>{@link setSelectedItemsAll} - установить выбранными все элементы;</li>
             *     <li>{@link addItemsSelection} - добавить указанные элементы в набор выбранных;</li>
             *     <li>{@link removeItemsSelection} - удалить указанные элементы из набора выбранных;</li>
             *     <li>{@link removeItemsSelectionAll} - удалить все выбранные элементы;</li>
             *     <li>{@link toggleItemsSelection} - поменять состояние выбранности указанных элементов на противоположное;</li>
             *     <li>{@link toggleItemsSelectionAll} - поменять состояние выбранности всех элементов на противоположное;</li>
             *     <li>{@link getSelectedItems} - получить набор выбранных элементов.</li>
             * </ul>
             * @example
             * <pre class="brush: xml">
             *     <options name="selectedKeys" type="array">
             *         <option>5</option>
             *         <option>8</option>
             *         <option>12</option>
             *     </options>
             * </pre>
             * @see multiselect
             * @see setSelectedKeys
             * @see getSelectedKeys
             * @see getSelectedItems
             * @see setSelectedItemsAll
             * @see addItemsSelection
             * @see removeItemsSelection
             * @see removeItemsSelectionAll
             * @see toggleItemsSelection
             * @see toggleItemsSelectionAll
             */
            selectedKeys : [],
             /**
              * @cfg {Boolean} Разрешает отсутствие выбранных элементов в группе.
              * @example
              * <pre class="brush: xml">
              *     <option name="allowEmptyMultiSelection">false</option>
              * </pre>
              * @see multiselect
              * @see selectedKeys
              * @see removeItemsSelectionAll
              * @see removeItemsSelection
              * @see toggleItemsSelection
              * @see toggleItemsSelectionAll
              */
            allowEmptyMultiSelection : true,
            /**
             * @cfg {SBIS3.CONTROLS.Data.Collection.List} Определяет набор выбранных записей с доступом по индексу.
             * @remark
             * Определяет экземпляр класса {@link SBIS3.CONTROLS.Data.Collection.List} с данными выбранных записей.
             * Работает в режиме множественного выбора {@link multiselect}.
             * Использование методов для работы с элементами коллекции в режиме множественного выбора позволяет:
             * <ul>
             *     <li>{@link getSelectedItems} - получить набор выбранных элементов.</li>
             *     <li>{@link setSelectedItemsAll} - установить выбранными все элементы;</li>
             *     <li>{@link addItemsSelection} - добавить указанные элементы в набор выбранных;</li>
             *     <li>{@link removeItemsSelection} - удалить указанные элементы из набора выбранных;</li>
             *     <li>{@link removeItemsSelectionAll} - удалить все выбранные элементы;</li>
             *     <li>{@link toggleItemsSelection} - поменять состояние выбранности указанных элементов на противоположное;</li>
             *     <li>{@link toggleItemsSelectionAll} - поменять состояние выбранности всех элементов на противоположное;</li>
             * </ul>
             * @example
             * <pre>
             *     var selItems = this._options.selectedItems; // передаем выбранные элементы selItems
             *     var CountMyData = MyView.getSelectedItems().getCount(); // определить количество выбранных элементов
             * </pre>
             * @see multiselect
             * @see getSelectedItems
             * @see setSelectedItemsAll
             * @see addItemsSelection
             * @see removeItemsSelection
             * @see removeItemsSelectionAll
             * @see toggleItemsSelection
             * @see toggleItemsSelectionAll
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
            if (this._options.allowEmptyMultiSelection == false) {
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
       * Устанавливает массив идентификаторов выбранных элементов.
       * @param {Array} idArray Массив идентификаторов выбранных элементов.
       * @example
       * <pre>
       *    if (!checkBoxGroup.getSelectedKeys().length) {
       *       checkBoxGroup.setSelectedKeys([1,3]);
       *    }
       * </pre>
       * @see multiselect
       * @see selectedKeys
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
                  this._removeItemsSelection(removedKeys);
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
       * @see multiselect
       * @see getSelectedItems
       * @see selectedKeys
       * @see removeItemsSelection
       * @see removeItemsSelectionAll
       * @see getSelectedKeys
       * @see addItemsSelection
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
       * Получает массив индентификаторов выбранных элементов.
       * @example
       * <pre>
       *    if (!checkBoxGroup.getSelectedKeys().length) {
       *       checkBoxGroup.setSelectedKeys([1,3]);
       *    }
       * </pre>
       * @see multiselect
       * @see selectedKeys
       * @see setSelectedKeys
       * @see addItemsSelection
       */
      getSelectedKeys : function() {
         return this._options.selectedKeys;
      },

      /**
       * Добавляет указанные элементы в набор выбранных.
       * @param {Array} idArray Массив идентификаторов элементов, добавляемых к выбранным.
       * @example
       * <pre>
       *    var keys = checkBoxGroup.getSelectedKeys();
       *    if (keys.indexOf(1)) {
       *       checkBoxGroup.addItemsSelection([2]);
       *    }
       * </pre>
       * @see setSelectedKeys
       * @see getSelectedKeys
       * @see getSelectedItems
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
                  this._options.selectedKeys = Array.clone(this._options.selectedKeys);
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
       * @see multiselect
       * @see setSelectedItemsAll
       * @see removeItemsSelectionAll
       * @see getSelectedKeys
       * @see getSelectedItems
       * @see addItemsSelection
       * @see allowEmptyMultiSelection
       */
      removeItemsSelection : function(idArray) {
         var removedKeys = this._removeItemsSelection(idArray);
         this._afterSelectionHandler([], removedKeys);
      },

      _removeItemsSelection : function(idArray) {
         var removedKeys = [];

         if (Array.isArray(idArray)) {
            this._options.selectedKeys = Array.clone(this._options.selectedKeys);
            for (var i = idArray.length - 1; i >= 0; i--) {
               if (this._isItemSelected(idArray[i])) {
                  Array.remove(this._options.selectedKeys, this._getSelectedIndex(idArray[i]));
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
       * Убирает все элементы из набора выбранных.
       * @example
       * <pre>
       *     if (checkBoxGroup.getSelectedKeys().indexOf(3))  {
       *        checkBoxGroup.removeItemsSelectionAll();
       *        checkBoxGroup.setSelectedKeys([3]);
       *     }
       * </pre>
       * @see multiselect
       * @see removeItemsSelection
       * @see getSelectedKeys
       * @see getSelectedItems
       * @see setSelectedItemsAll
       * @see addItemsSelection
       * @see toggleItemsSelectionAll
       * @see allowEmptyMultiSelection
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
       * @see getSelectedItems
       * @see setSelectedItemsAll
       * @see addItemsSelection
       * @see removeItemsSelection
       * @see removeItemsSelectionAll
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
       * @see toggleItemsSelection
       * @see multiselect
       * @see getSelectedItems
       * @see setSelectedItemsAll
       * @see addItemsSelection
       * @see removeItemsSelection
       * @see removeItemsSelectionAll
       * @see allowEmptyMultiSelection
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
       * @param {Boolean} loadItems загружать ли записи, если их нет в текущем наборе выбранных и они отсутствуют в dataSet'e
       * @param {Number} count Ограничение количества отдаваемых записей
       * @returns {SBIS3.CONTROLS.Data.Collection.List} Возвращает коллекцию элементов
       * @example
       * <pre>
       *    if (!checkBoxGroup.getSelectedItems().at(0).get('Текст') === 'Не выбрано') {
       *       myControl.setEnabled(false);
       *    }
       * </pre>
       * @see multiselect
       * @see setSelectedItemsAll
       * @see addItemsSelection
       * @see removeItemsSelection
       * @see removeItemsSelectionAll
       * @see toggleItemsSelection
       * @see toggleItemsSelectionAll
       */
      getSelectedItems: function(loadItems, count) {
         var self = this,
             selKeys = this._options.selectedKeys,
             selItems = this._options.selectedItems,
             loadKeysArr = [],
             itemsKeysArr = this._convertToKeys(selItems),
             dMultiResult, item, loadKeysAmount;

         this._syncSelectedItems();

         if(!loadItems) {
            return this._getSelItemsClone();
         }

         if(this._loadItemsDeferred && !this._loadItemsDeferred.isReady()) {
            return this._loadItemsDeferred;
         }

         this._loadItemsDeferred = new $ws.proto.Deferred();

         /* Сфоримруем массив ключей записей, которые требуется вычитать с бл или взять из dataSet'a*/
         for(var i = 0, keys = selKeys.length; i < keys; i++) {
            if(Array.indexOf(itemsKeysArr, selKeys[i]) === -1 && Array.indexOf(itemsKeysArr, parseInt(selKeys[i], 10)) === -1) {
               loadKeysArr.push(selKeys[i]);
            }
         }

         loadKeysAmount = loadKeysArr.length;
         if(loadKeysAmount) {
            /* Если ограничили кол-во отдаваемых записей */
            loadKeysAmount = count < loadKeysAmount ? count : loadKeysAmount;
            dMultiResult = new $ws.proto.ParallelDeferred({stopOnFirstError: false});

            for (var j = 0; loadKeysAmount > j; j++) {
               item = this.getItems() && this.getItems().getRecordById(loadKeysArr[j]);

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
            if(!self._isItemSelected(rec.getId())) {
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
            index = this._options.selectedItems.getIndexByValue(item.getIdProperty(), item.getId());
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
         return !this._options.selectedKeys.length && this._options.allowEmptyMultiSelection == false;
      },

      _getSelItemsClone: function() {
         /* надо обязательно делать клон массива, чтобы порвать ссылку и не портить при изменении значения в контексте */
         return this._makeList(this._options.selectedItems.toArray().slice());
      },

      _setSelectedItems: function() {
         var dataSet = this.getItems(),
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
      },

      /**
       * Ковертирует набор записей в массив из ключей
       * @param {SBIS3.CONTROLS.Data.Collection.List} list
       * @returns {Array}
       * @private
       */
      _convertToKeys: function(list) {
         var keys = [];

         list.each(function(rec) {
            keys.push(rec.getId());
         });

         return keys;
      }
   };

   return MultiSelectable;

});