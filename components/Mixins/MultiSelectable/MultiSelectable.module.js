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
        * @event onSelectedItemsChange Происходит при смене выбранных элементов коллекции.
        * @remark
        * Событие происходит сразу после изменения списка выбранных коллекции элементов, когда хотя бы один элемент был
        * добавлен либо удален из списка.
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
             * * true Режим множественного выбора элементов коллекции установлен.
             * * false Режим множественного выбора элементов коллекции отменен.
             * @remark file MultiSelectable-multiselect.md
             * @example
             * <pre>
             *    <option name="multiselect">false</option>
             *    <option name="multiselect" type="boolean" value="false"></option>
             * </pre>
             * @see selectedKeys
             */
            multiselect : true,
            /**
             * @cfg {String[]} Устанавливает массив идентификаторов, по которым будет установлен набор выбранных элементов коллекции.
             * @remark file MultiSelectable-selectedKeys.md
             * @example
             * В контрол, отображающий набор данных в виде таблицы {@link SBIS3.CONTROLS.DataGridView},
             * переданы три идентификатора элементов коллекции:
             * ![](/MultiSelectable03.png)
             * фрагмент верстки:
             * <pre class="brush: xml">
             *     <options name="selectedKeys" type="array">
             *        <option>2</option>
             *        <option>3</option>
             *        <option>6</option>
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
              * @cfg {Boolean} Устанавливает конфигурацию для режима множественного выбора, при которой
              * разрешается/запрещается отсутствие выбранных элементов коллекции.
              * * true Отсутствие выбранных элементов коллекции разрешено.
              * * false Отсутствие выбранных элементов коллекции запрещено.
              * @remark
              * Настройка режима множественного выбора, при которой запрещено отсутствие выбранных элементов коллекции
              * гарантирует, что среди элементов коллекции всегда остаётся хотя бы один выбранный элемент.
              * Также пользователь не сможет сбросить последнее выбранное значение через пользовательский интерфейс приложения.
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
             * @cfg {SBIS3.CONTROLS.Data.Collection.List} Устанавливает набор элементов коллекции, которые будут по умолчанию выбраны для контрола в режиме множественного выбора значений {@link multiselect}.
             * @remark file MultiSelectable-selectedItems.md
             * @see multiselect
             * @see getSelectedItems
             * @see setSelectedItemsAll
             * @see addItemsSelection
             * @see removeItemsSelection
             * @see removeItemsSelectionAll
             * @see toggleItemsSelection
             * @see toggleItemsSelectionAll
             */
            selectedItems : null
         },
         _loadItemsDeferred: undefined
      },

      $constructor: function() {
         this._publish('onSelectedItemsChange');

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
       * По массиву идентификаторов устанавливает массив выбранных элементов коллекции для контрола, который находится в режиме множественного выбора.
       * Идентификатором элемента коллекции служит значение его {@link SBIS3.CONTROLS.DSMixin#keyField ключевого поля}.
       * @param {Array} idArray Массив идентификаторов выбранных элементов коллекции.
       * @example
       * <pre>
       *    if (!checkBoxGroup.getSelectedKeys().length) {
       *       checkBoxGroup.setSelectedKeys([1,3]);
       *    }
       * </pre>
       * @see multiselect
       * @see selectedKeys
       * @see getSelectedKeys
       */
      setSelectedKeys : function(idArray) {
         var difference;

         if (Array.isArray(idArray)) {
            difference = this._getArrayDifference(this._options.selectedKeys, idArray);

               if (this._options.multiselect || !idArray.length) {
                  this._options.selectedKeys = idArray;
               } else {
                  if (idArray.length === 1) {
                     this._options.selectedKeys = idArray;
                  } else {
                     this._options.selectedKeys = idArray.slice(0, 1);
                  }
               }
            this._afterSelectionHandler(difference.added, difference.removed);
         } else {
            throw new Error('Argument must be instance of Array');
         }
      },
      /**
       * Сравнивает два массива, возвращает разницу между ними
       * @param arrayOne
       * @param arrayTwo
       * @returns {{added: Array, removed: Array}}
       * @private
       */
      _getArrayDifference : function(arrayOne, arrayTwo) {
         var result = {
                added: [],
                removed: []
             },
             index, currElem;

         function hasInArray(array, elem) {
            index = Array.indexOf(array, elem);

            if(index < 0) {
               elem = (typeof elem === 'string') ? Number(elem) : String(elem);

               index = Array.indexOf(array, elem);

               if(index < 0) {
                  return false;
               }
            }

            return true;
         }

         /* Найдём удаленные */
         result.removed = $ws.helpers.filter(arrayOne, function(item) {
            currElem = item;
            return !hasInArray(arrayTwo, currElem);
         });

         /* Найдём добавленные */
         result.added = $ws.helpers.filter(arrayTwo, function(item) {
            currElem = item;
            return !hasInArray(arrayOne, currElem);
         });

         return result;
      },

      /**
       * Устанавливает все элементы коллекции выбранными.
       * Метод актуален для контрола, который находится в режиме {@link SBIS3.CONTROLS.MultiSelectable#multiselect множественного выбора значений}.
       * @example
       * <pre>
       *     if (checkBox.isChecked()) {
       *        checkBoxGroup.setSelectedItemsAll();
       *     }
       * </pre>
       * @see multiselect
       * @see selectedItems
       * @see getSelectedItems
       * @see selectedKeys
       * @see setSelectedKeys
       * @see getSelectedKeys
       * @see removeItemsSelection
       * @see removeItemsSelectionAll
       * @see addItemsSelection
       * @see toggleItemsSelection
       * @see toggleItemsSelectionAll
       */
      setSelectedItemsAll : function() {
         if (this._dataSet) {
            var items = [];
            this._dataSet.each(function(rec){
               items.push(rec.getId())
            });
            this.setSelectedKeys(items);
         }

      },

      /**
       * Получает массив индентификаторов выбранных элементов коллекции.
       * Метод актуален для контрола, который находится в режиме {@link SBIS3.CONTROLS.MultiSelectable#multiselect множественного выбора значений}.
       * Идентификатором элемента коллекции служит значение его {@link SBIS3.CONTROLS.DSMixin#keyField ключевого поля}.
       * @example
       * <pre>
       *    if (!checkBoxGroup.getSelectedKeys().length) {
       *       checkBoxGroup.setSelectedKeys([1,3]);
       *    }
       * </pre>
       * @see multiselect
       * @see selectedKeys
       * @see setSelectedKeys
       */
      getSelectedKeys : function() {
         return this._options.selectedKeys;
      },

      /**
       * Добавляет указанные элементы коллекции в набор уже выбранных элементов.
       * Метод актуален для контрола, который находится в режиме {@link SBIS3.CONTROLS.MultiSelectable#multiselect множественного выбора значений}.
       * @param {Array} idArray Массив идентификаторов элементов, добавляемых к выбранным.
       * Идентификатором элемента коллекции служит значение его {@link SBIS3.CONTROLS.DSMixin#keyField ключевого поля}.
       * @example
       * <pre>
       *    var keys = checkBoxGroup.getSelectedKeys();
       *    if (keys.indexOf(1)) {
       *       checkBoxGroup.addItemsSelection([2]);
       *    }
       * </pre>
       * @see multiselect
       * @see selectedItems
       * @see selectedKeys
       * @see setSelectedKeys
       * @see getSelectedKeys
       * @see getSelectedItems
       * @see setSelectedItemsAll
       * @see removeItemsSelection
       * @see removeItemsSelectionAll
       * @see toggleItemsSelection
       * @see toggleItemsSelectionAll
       */
      addItemsSelection : function(idArray) {
         var addedKeys = this._addItemsSelection(idArray);
         this._afterSelectionHandler(addedKeys, []);
      },
      _addItemsSelection : function(idArray) {
         var resultArray = [],
             addedKeys = [];

         if (Array.isArray(idArray)) {
            if (idArray.length) {
               if (this._options.multiselect) {
                  resultArray = Array.clone(this._options.selectedKeys);
                  for (var i = 0; i < idArray.length; i++) {
                     if (!this._isItemSelected(idArray[i])) {
                        resultArray.push(idArray[i]);
                     }
                  }
               } else {
                  resultArray = idArray.slice(0, 1);
               }
            }
            addedKeys = this._getArrayDifference(this._options.selectedKeys, resultArray).added;
            this._options.selectedKeys = resultArray;
            return addedKeys;
         }
         else {
            throw new Error('Argument must be instance of Array');
         }
      },

      /**
       * Удаляет указанные элементы коллекции из набора выбранных элементов.
       * Метод актуален для контрола, который находится в режиме {@link SBIS3.CONTROLS.MultiSelectable#multiselect множественного выбора значений}.
       * @param {Array} idArray Массив идентификаторов элементов к удалению из выбранных.
       * Идентификатором элемента коллекции служит значение его {@link SBIS3.CONTROLS.DSMixin#keyField ключевого поля}.
       * @example
       * <pre>
       *     if (checkBox.isChecked()) {
       *        checkBoxGroup.removeItemsSelection([2]);
       *     }
       * </pre>
       * @see multiselect
       * @see selectedItems
       * @see selectedKeys
       * @see getSelectedItems
       * @see getSelectedKeys
       * @see setSelectedKeys
       * @see setSelectedItemsAll
       * @see removeItemsSelectionAll
       * @see addItemsSelection
       * @see toggleItemsSelection
       * @see toggleItemsSelectionAll
       * @see allowEmptyMultiSelection
       */
      removeItemsSelection : function(idArray) {
         var removedKeys = this._removeItemsSelection(idArray);
         this._afterSelectionHandler([], removedKeys);
      },

      _removeItemsSelection : function(idArray) {
         var resultArray = [],
             removedKeys = [];

         if (Array.isArray(idArray)) {
            resultArray = Array.clone(this._options.selectedKeys);
            for (var i = idArray.length - 1; i >= 0; i--) {
               if (this._isItemSelected(idArray[i])) {
                  Array.remove(resultArray, this._getSelectedIndex(idArray[i]));
               }
            }
            removedKeys = this._getArrayDifference(this._options.selectedKeys, resultArray).removed;
            this._options.selectedKeys = resultArray;
            return removedKeys;
         }
         else {
            throw new Error('Argument must be instance of Array');
         }
      },

      /**
       * Убирает все элементы коллекции из набора выбранных.
       * Метод актуален для контрола, который находится в режиме {@link SBIS3.CONTROLS.MultiSelectable#multiselect множественного выбора значений}.
       * @example
       * <pre>
       *     if (checkBoxGroup.getSelectedKeys().indexOf(3))  {
       *        checkBoxGroup.removeItemsSelectionAll();
       *        checkBoxGroup.setSelectedKeys([3]);
       *     }
       * </pre>
       * @see multiselect
       * @see selectedItems
       * @see selectedKeys
       * @see getSelectedKeys
       * @see getSelectedItems
       * @see removeItemsSelection
       * @see setSelectedItemsAll
       * @see setSelectedKeys
       * @see addItemsSelection
       * @see toggleItemsSelection
       * @see toggleItemsSelectionAll
       * @see allowEmptyMultiSelection
       */
      removeItemsSelectionAll : function() {
         this.setSelectedKeys([]);
      },

      /**
       * Метод инвертирует набор выбранных элементов по указанным элементам коллекции.
       * @remark
       * Для всех элементов коллекции, идентификаторы которых будут переданы в массиве idArray,
       * в зависимости от того, были они выбраны или нет, метод произведет противоположное действие:
       * уберет элементы коллекции из набора выбранных или добавит элементы в набор.
       * Метод актуален для контрола, который находится в режиме {@link SBIS3.CONTROLS.MultiSelectable#multiselect множественного выбора значений}.
       * @param {Array} idArray Массив идентификаторов элементов для инвертирования.
       * Идентификатором элемента коллекции служит значение его {@link SBIS3.CONTROLS.DSMixin#keyField ключевого поля}.
       * @example
       * <pre>
       *     if (needToggle) {
       *        checkBoxGroup.toggleItemsSelection([2,3]);
       *     }
       * </pre>
       * @see multiselect
       * @see selectedItems
       * @see selectedKeys
       * @see addItemsSelection
       * @see getSelectedItems
       * @see getSelectedKeys
       * @see setSelectedKeys
       * @see setSelectedItemsAll
       * @see removeItemsSelection
       * @see removeItemsSelectionAll
       * @see toggleItemsSelectionAll
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
       * Метод инвертирует набор выбранных элементов коллекции.
       * @remark
       * В зависимости от состояния элементов коллекции (были они выбраны, или нет) метод произведет над ними противоположное
       * действие: уберет все элементы коллекции из набора выбранных элементов или добавит все элементы в набор.
       * Метод актуален для контрола, который находится в режиме {@link SBIS3.CONTROLS.MultiSelectable#multiselect множественного выбора значений}.
       * @example
       * <pre>
       *     if (checkBoxGroup.getSelectedKeys().count == 0) {
       *        checkBoxGroup.toggleItemsSelectionAll();
       *     }
       * </pre>
       * @see multiselect
       * @see selectedItems
       * @see selectedKeys
       * @see addItemsSelection
       * @see setSelectedKeys
       * @see setSelectedItemsAll
       * @see getSelectedKeys
       * @see getSelectedItems
       * @see removeItemsSelection
       * @see removeItemsSelectionAll
       * @see toggleItemsSelection
       * @see allowEmptyMultiSelection
       */
      toggleItemsSelectionAll : function() {
         if (this._dataSet) {
            var items = [];
            this._dataSet.each(function(rec){
               items.push(rec.getId())
            });
            this.toggleItemsSelection(items);
         }
      },

      /**
       * @param {Boolean} multiselect Устанавливает режим множественного выбора элементов коллекции.
       * true Режим множественного выбора элементов коллекции установлен.
       * false Режим множественного выбора элементов коллекции отменен.
       * @see selectedKeys
       * @see multiselect
       */
      setMultiselect: function(multiselect) {
         /* Из контекста может прийти null или undefined */
         var newMultiselect = Boolean(multiselect),
             selectedKeys;

         if(this._options.multiselect !== newMultiselect) {
            this._options.multiselect = newMultiselect;

            selectedKeys = this.getSelectedKeys();

            /* Если multiselect выключили, а ключей у нас больше чем > 1, надо их отфильтровать */
            if(newMultiselect === false && selectedKeys.length > 1) {
               this.setSelectedKeys(selectedKeys);
            }
         }
      },

      /**
       * @returns {Boolean} multiselect Возвращает режим множественного выбора элементов коллекции.
       * @see selectedKeys
       * @see multiselect
       */
      getMultiselect: function() {
         return this._options.multiselect;
      },

      /**
       * Возвращает набор выбранных элементов коллекции контрола в режиме множественного выбора.
       * @param {Boolean} loadItems Необходимость загрузки элементов коллекции, если их нет в текущем наборе выбранных элементов
       * и они отсутствуют в наборе данных, полученных из источника.
       * @param {Number} count Ограничение количества отдаваемых элементов коллекции.
       * @returns {SBIS3.CONTROLS.Data.Collection.List|$ws.proto.Deferred|null} Коллекция элементов с доступом по индексу.
       * @example
       * <pre>
       *    if (!checkBoxGroup.getSelectedItems().at(0).get('Текст') === 'Не выбрано') {
       *       myControl.setEnabled(false);
       *    }
       * </pre>
       * @see multiselect
       * @see selectedItems
       * @see selectedKeys
       * @see addItemsSelection
       * @see getSelectedKeys
       * @see setSelectedKeys
       * @see setSelectedItemsAll
       * @see removeItemsSelection
       * @see removeItemsSelectionAll
       * @see toggleItemsSelection
       * @see toggleItemsSelectionAll
       */
      getSelectedItems: function(loadItems, count) {
         /* Сначала запускаем синхронизацию, чтобы работать уже с поправленными переменными */
         this._syncSelectedItems();

         var self = this,
             selKeys = this._options.selectedKeys,
             selItems = this._options.selectedItems,
             loadKeysArr = [],
             dMultiResult, item, loadKeysAmount, itemsKeysArr;

         if(!loadItems) {
            return selItems;
         } else if (this._loadItemsDeferred && !this._loadItemsDeferred.isReady()) {
            return this._loadItemsDeferred;
         } else if(this._isEmptySelection()) {
            return new $ws.proto.Deferred().callback(selItems);
         }

         this._loadItemsDeferred = new $ws.proto.Deferred();
         itemsKeysArr = this._convertToKeys(selItems);

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

            if(!selItems) {
               this.initializeSelectedItems();
               selItems = this._options.selectedItems;
            }

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
               self._loadItemsDeferred.callback(selItems);
               self._notifyOnPropertyChanged('selectedItems');
            });

         } else {
            self._loadItemsDeferred.callback(selItems);
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

         /* Из контекста может прийти null или undefined */
         if(!selItems) return;

         /* Выбранных ключей нет - очистим IList */
         if(this._isEmptySelection()) {
            if(selItems.getCount()) {
               /* Чтобы порвать ссылку на контекст делаем клон,
                  т.к. при любом изменении св-ва надо порвать ссылку на контекст */
               this._options.selectedItems = selItems.clone();
               this._options.selectedItems.clear();
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
            this._options.selectedItems = selItems.clone();
            for(var i = 0, len = delItems.length; i < len; i++) {
               this._options.selectedItems.remove(delItems[i]);
            }
            this._notifyOnPropertyChanged('selectedItems');
         }
      },

      _isItemSelected : function(item) {
         return this._getSelectedIndex(item) !== -1;
      },

      _getSelectedIndex: function(item) {
         var keys = this._options.selectedKeys,
             selectedItems = this._options.selectedItems,
             index;

         if($ws.helpers.instanceOfModule(item, 'SBIS3.CONTROLS.Data.Model')) {
            if(selectedItems) {
               index = selectedItems.getIndexByValue(item.getIdProperty(), item.getId());
            } else {
               index = -1;
            }
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

      /**
       * Инициализирует опцию selectedItems
       * @noShow
       */
      initializeSelectedItems: function() {
         this._options.selectedItems =  new List();
      },

      _dataLoadedCallback : function(){
         if (this._checkEmptySelection()) {
            this._setFirstItemAsSelected();
         }
         this._setSelectedItems();
      },

      _setFirstItemAsSelected : function() {
         var item = this._dataSet && this._dataSet.at(0);
         if (item) {
            this._options.selectedKeys = [item.getId()];
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
             record, index;

         if (dataSet) {
            this._syncSelectedItems();
            $ws.helpers.forEach(this.getSelectedKeys(), function (key) {
               record = dataSet.getRecordById(key);
               if (record) {
                  if(!self._options.selectedItems) {
                     self.initializeSelectedItems();
                  }

                  index = self._options.selectedItems.getIndexByValue(self._options.keyField, record.getId());

                  /**
                   * Запись в датасете есть - заменим в наборе выбранных записей, т.к. она могла измениться.
                   * Если нету, то просто добавим.
                   */
                  if(index !== -1) {
                     self._options.selectedItems.replace(record, index);
                  } else {
                     self._options.selectedItems.add(record);
                  }
               }
            });
         }
      },

      /* Для правильной работы биндингов, предполагаем, что масив [null] тоже является пустым выделением */
      _isEmptySelection: function() {
         var selectedKeys = this._options.selectedKeys;
         return !selectedKeys.length || $ws.helpers.isEqualObject(selectedKeys, EMPTY_SELECTION);
      },

      /**
       * Ковертирует набор записей в массив из ключей
       * @param {SBIS3.CONTROLS.Data.Collection.List} list
       * @returns {Array}
       * @private
       */
      _convertToKeys: function(list) {
         var keys = [];

         if(list) {
            list.each(function (rec) {
               keys.push(rec.getId());
            });
         }

         return keys;
      }
   };

   var EMPTY_SELECTION = [null];

   return MultiSelectable;

});