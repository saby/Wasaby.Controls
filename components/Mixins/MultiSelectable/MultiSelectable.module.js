define('js!SBIS3.CONTROLS.MultiSelectable', ['js!SBIS3.CONTROLS.Data.Collection.List'], function(List) {

   /**
    * Миксин, добавляющий поведение хранения одного или нескольких выбранных элементов
    * @mixin SBIS3.CONTROLS.MultiSelectable
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var MultiSelectable = /**@lends SBIS3.CONTROLS.MultiSelectable.prototype  */{
       /**
        * @event onSelectedItemsChange При смене выбранных элементов коллекции
        * @param {$ws.proto.EventObject} Дескриптор события.
        * @param {Array.<String>} idArray Массив ключей выбранных элементов.
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
         if (Array.isArray(idArray)) {
            if (idArray.length) {
               if (this._options.multiselect) {
                  this._options.selectedKeys = idArray;
               }
               else {
                  this._options.selectedKeys = idArray.slice(0, 1);
               }
            }
            else {
               this._options.selectedKeys = [];
            }
	         this._afterSelectionHandler();
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
         if (Array.isArray(idArray)) {
            if (idArray.length) {
               if (this._options.multiselect) {
                  for (var i = 0; i < idArray.length; i++) {
                     if (this._isItemSelected(idArray[i]) < 0) {
                        this._options.selectedKeys.push(idArray[i]);
                     }
                  }
               }
               else {
                  this._options.selectedKeys = idArray.slice(0, 1);
               }
            }
	         this._afterSelectionHandler();
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
         if (Array.isArray(idArray)) {
            for (var i = idArray.length - 1; i >= 0; i--) {
               var index = this._isItemSelected(idArray[i]);
               if (index >= 0) {
                  Array.remove(this._options.selectedKeys, index);
               }
            }
	         this._afterSelectionHandler();
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
               if (this._options.multiselect) {
                  for (var i = 0; i < idArray.length; i++) {
                     if (this._isItemSelected(idArray[i]) < 0) {
                        this.addItemsSelection([idArray[i]]);
                     }
                     else {
                        this.removeItemsSelection([idArray[i]]);
                     }
                  }
               }
               else {
                  if (this._isItemSelected(idArray[0]) > 0) {
                     this._options.selectedKeys = [];
                  }
                  else {
                     this._options.selectedKeys = idArray.slice(0, 1);
                  }
	               this._afterSelectionHandler();
               }
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
               selItems.fill();
               this._notifyOnPropertyChanged('selectedItems');
            }
            return;
         }

         /* Соберём элементы для удаления, т.к. в методе each не отслеживаются изменения IList'а */
         selItems.each(function(rec) {
            /* ключи могут быть и строкой, поэтому надо проверить и на строку */
            if(self._isItemSelected(rec.getKey()) === -1) {
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

      _isItemSelected : function(id) {
         //TODO пока нет определенности ключ - строка или число - надо избавиться
         var index = this._options.selectedKeys.indexOf(id);
         if (index < 0) {
            index = this._options.selectedKeys.indexOf(id + '')
         }
         return index;
      },

      _drawSelectedItems : function() {
         /*Method must be implemented*/
      },

      _makeList: function(listItems) {
         return new List({items: listItems ? listItems : []});
      },

	   _afterSelectionHandler: function() {
		   if (this._checkEmptySelection()) {
			   this._setFirstItemAsSelected();
		   }
		   this._notifySelectedItems(this._options.selectedKeys);
		   this._drawSelectedItems(this._options.selectedKeys);
	   },

      _notifySelectedItems : function(idArray) {
         this._setSelectedItems();
	     this._notifyOnPropertyChanged('selectedKeys');
         this._notify('onSelectedItemsChange', idArray);
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
         if (this._dataSet) {
            var self = this,
                selItems = self._options.selectedItems,
                record;

            this._syncSelectedItems();
            $ws.helpers.forEach(this.getSelectedKeys(), function (key) {
               record = self._dataSet.getRecordByKey(key);
               if (record && selItems.getIndex(record) === -1) {
                  selItems.add(record);
               }
            });
         }
      }
   };

   return MultiSelectable;

});