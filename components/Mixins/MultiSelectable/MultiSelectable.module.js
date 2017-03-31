define('js!SBIS3.CONTROLS.MultiSelectable', [
   "Core/ParallelDeferred",
   "Core/helpers/helpers",
   "Core/core-functions",
   "Core/Deferred",
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Collection/List",
   "js!SBIS3.CONTROLS.ArraySimpleValuesUtil",
   "Core/helpers/collection-helpers",
   "Core/core-instance",
   "Core/helpers/functional-helpers"
], function( ParallelDeferred, cHelpers, cFunctions, Deferred, IoC, ConsoleLogger,List, ArraySimpleValuesUtil, colHelpers, cInstance, fHelpers) {

   var EMPTY_SELECTION = [null],
       convertToKeys = function(list, keyField) {
          var keys = [],
             key;

          if (list) {
             list.each(function (rec) {
                key = rec.get(keyField || this._options.idProperty);

                if (key === undefined) {
                   throw new Error(this._moduleName + ': record key is undefined.')
                }

                keys.push(key);
             }.bind(this));
          }

          return keys;
       };
   /**
    * Миксин, добавляющий поведение хранения одного или нескольких выбранных элементов
    * @mixin SBIS3.CONTROLS.MultiSelectable
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var MultiSelectable = /**@lends SBIS3.CONTROLS.MultiSelectable.prototype  */{
       /**
        * @typedef {Object} ChangedKeys
        * @property {Array.<String>} added Ключи, которые были добавлены.
        * @property {Array.<String>} removed Ключи, которые были удалены.
        */
       /**
        * @event onSelectedItemsChange Происходит при смене выбранных элементов коллекции.
        * @remark
        * Событие происходит сразу после изменения списка выбранных коллекции элементов, когда хотя бы один элемент был добавлен либо удален из списка.
        * @param {$ws.proto.EventObject} Дескриптор события.
        * @param {Array.<String>} idArray Массив ключей выбранных элементов.
        * @param {ChangedKeys} changed Измененные ключи.
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
             * @remark
             * Устанавливает массив идентификаторов элементов коллекции, которые будут по умолчанию выбраны для контрола.
             * Опция актуальна только для контрола в режиме множественного выбора значений, который устанавливают с помощью опции {@link multiselect}.
             * Чтобы элементы коллекции были выбраны, для контрола дополнительно должны быть установлены {@link SBIS3.CONTROLS.DSMixin#idProperty поле первичного ключа} и {@link SBIS3.CONTROLS.DSMixin#dataSource источник данных}.
             * @example
             * В контрол, отображающий набор данных в виде таблицы {@link SBIS3.CONTROLS.DataGridView},  переданы три идентификатора элементов коллекции:
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
              * @cfg {Boolean} Устанавливает конфигурацию для режима множественного выбора, при которой разрешается/запрещается отсутствие выбранных элементов коллекции.
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
             * @cfg {WS.Data/Collection/List} Устанавливает набор элементов коллекции, которые будут по умолчанию выбраны для контрола в режиме множественного выбора значений {@link multiselect}.
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

      _projSelectedChange: function(projItem) {

      },

      after : {
         init: function () {
            this._drawSelectedItems(this._options.selectedKeys, {});
         },
         destroy: function() {
            if(this._loadItemsDeferred && !this._loadItemsDeferred.isReady()) {
               this._loadItemsDeferred.cancel();
            }
         }
      },

      before: {
         /* После изменения сорса или item'ов может измениться и формат данных,
            после этого нельзя выделенные элементы держать со старым форматом данных,
            иначе будут возникать конфликты форматов. Просто пересоздадим selectedItems */
         setDataSource: function () {
            this.once('onDataLoad', function(event, list) {
               this._checkNewItemsFormat(list);
            })
         },
         setItems: function() {
            this.once('onItemsReady', function() {
               this._checkNewItemsFormat(this.getItems());
            })
         },
         _modifyOptions: function(opts) {
            if (opts.selectedItems) {
               opts.selectedKeys = convertToKeys(opts.selectedItems, opts.idProperty);
            }
         }
      },
      /**
       * По массиву идентификаторов устанавливает массив выбранных элементов коллекции для контрола, который находится в режиме множественного выбора.
       * Идентификатором элемента коллекции служит значение его {@link SBIS3.CONTROLS.DSMixin#idProperty ключевого поля}.
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
         var wasEmpty = this._isEmptySelection(),
             difference;

         if (Array.isArray(idArray)) {
            difference = this._getArrayDifference(this._options.selectedKeys, idArray);
               /* Для правильной работы биндингов св-во должно присваиваться как есть,
                  чтобы метод get возвращал то, что передали в set +
                  при любой модификации св-ва, должно создаваться новое значание, чтобы порвалась ссылка на значение в контексте
                  и не было зацикливания. */
               if (this._options.multiselect || !idArray.length) {
                  this._options.selectedKeys = idArray;
               } else {
                  if (idArray.length === 1) {
                     this._options.selectedKeys = idArray;
                  } else {
                     this._options.selectedKeys = idArray.slice(0, 1);
                  }
               }

            /* Т.к. у нас пустой массив и массив с [null] являются пустыми зачениями,
               то надо проверить, реально ли что-то изменилось */
            if(wasEmpty && this._isEmptySelection()) {
               return;
            }
            this._afterSelectionHandler(difference.added, difference.removed, wasEmpty);
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
             };

         /* Найдём удаленные */
         result.removed = colHelpers.filter(arrayOne, function(item) {
            return !ArraySimpleValuesUtil.hasInArray(arrayTwo, item);
         });

         /* Найдём добавленные */
         result.added = colHelpers.filter(arrayTwo, function(item) {
            return !ArraySimpleValuesUtil.hasInArray(arrayOne, item);
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
         var items = this.getItems(),
             keys = [];

         if (items) {
            items.each(function(rec){
               keys.push(rec.getId())
            });
            this.setSelectedKeys(keys);
         }
      },

      /**
       * Получает массив индентификаторов выбранных элементов коллекции.
       * Метод актуален для контрола, который находится в режиме {@link SBIS3.CONTROLS.MultiSelectable#multiselect множественного выбора значений}.
       * Идентификатором элемента коллекции служит значение его {@link SBIS3.CONTROLS.DSMixin#idProperty ключевого поля}.
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
       * Идентификатором элемента коллекции служит значение его {@link SBIS3.CONTROLS.DSMixin#idProperty ключевого поля}.
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
       * Идентификатором элемента коллекции служит значение его {@link SBIS3.CONTROLS.DSMixin#idProperty ключевого поля}.
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
         var removedKeys = [],
             selectedKeys = Array.clone(this._options.selectedKeys);

         if (Array.isArray(idArray)) {
            for (var i = idArray.length - 1; i >= 0; i--) {
               if (this._isItemSelected(idArray[i])) {
                  Array.remove(selectedKeys, this._getSelectedIndex(idArray[i], selectedKeys));
                  removedKeys.push(idArray[i]);
               }
            }
            /* Копируем, чтобы порвать ссылку на значение в контексте */
            this._options.selectedKeys = selectedKeys;
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
       * Идентификатором элемента коллекции служит значение его {@link SBIS3.CONTROLS.DSMixin#idProperty ключевого поля}.
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
                  if(this._isEmptySelection()) {
                     this.setSelectedKeys(idArray);
                     return
                  }
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
                     removedKeysTotal = cFunctions.clone(this._options.selectedKeys);
                     this._options.selectedKeys = [];
                  }
                  else {
                     removedKeysTotal = cFunctions.clone(this._options.selectedKeys);
                     this._options.selectedKeys = idArray.slice(0, 1);
                     addedKeysTotal = cFunctions.clone(this._options.selectedKeys);
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
         var items = this.getItems(),
             keys = [];

         if (items) {
            items.each(function(rec){
               keys.push(rec.getId())
            });
            this.toggleItemsSelection(keys);
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
       * @returns {WS.Data/Collection/List|Deferred|null} Коллекция элементов с доступом по индексу.
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
             loadKeysArr = [],
             dMultiResult, item, loadKeysAmount, itemsKeysArr, dependDef;

         if(!loadItems) {
            return this._options.selectedItems;
         } else if (this._loadItemsDeferred && !this._loadItemsDeferred.isReady()) {
            return this._loadItemsDeferred;
         } else if(this._isEmptySelection()) {
            return new Deferred().callback(this._options.selectedItems);
         }

         this._loadItemsDeferred = new Deferred({cancelCallback: function() {
            if(dMultiResult) {
               dMultiResult.getResult().cancel();
               dependDef.cancel();
            }
         }});
         itemsKeysArr = this._convertToKeys(this._options.selectedItems);

         /* Сфоримруем массив ключей записей, которые требуется вычитать с бл или взять из dataSet'a*/
         for(var i = 0, keys = selKeys.length; i < keys; i++) {
            if(!ArraySimpleValuesUtil.hasInArray(itemsKeysArr, selKeys[i])) {
               loadKeysArr.push(selKeys[i]);
            }
         }

         loadKeysAmount = loadKeysArr.length;
         if(loadKeysAmount) {
            /* Если ограничили кол-во отдаваемых записей */
            loadKeysAmount = count < loadKeysAmount ? count : loadKeysAmount;
            dMultiResult = new ParallelDeferred({stopOnFirstError: false});

            /* В момент загрузки списка, выделенные ключи могут менять несколько раз
               (проблема в контексте, решается по ошибке:
               https://inside.tensor.ru/opendoc.html?guid=b27fc831-a31a-4810-9036-2f32d22de8d1&des=
               Ошибка в разработку 21.03.2017 Необходимо поправить обратную синхронизацию в контексте Метод setValue updateCo… )
               Надо от этого защититься, если загрузка записей была прервана, то нам не нужно дожидаться загрузки списка. */
            if(this.isLoading()) {
               dependDef = (new Deferred()).dependOn(this._loader);
            } else {
               dependDef = Deferred.success();
            }

            if(!this._options.selectedItems) {
               this.initializeSelectedItems();
            }

            /* Если сорс грузит данные, то дожидаемся его */
            cHelpers.callbackWrapper(dependDef, fHelpers.forAliveOnly(function(res) {
               for (var j = 0; loadKeysAmount > j; j++) {
                  item = self.getItems() && self.getItems().getRecordById(loadKeysArr[j]);

                  /* если запись есть в датасете, то ничего не будем вычитывать */
                  if (item) {
                     self._options.selectedItems.add(item);
                     continue;
                  }

                  if (!self._dataSource) {
                     IoC.resolve('ILogger').log('MultiSelectable', 'Потенциальная ошибка. У контрола ' + self.getName() + ' не задан dataSource для вычитки записей.');
                     continue;
                  }

                  if(loadKeysArr[j] !== null) {
                     dMultiResult.push(self._dataSource.read(loadKeysArr[j]).addCallbacks(
                         function (record) {
                            /* Проверка на случай отмены загрузки, т.к. parallelDeferred не отменяет зависимые дефереды */
                            if(!dMultiResult.getResult().isReady()) {
                               self._options.selectedItems.add(record);
                            }
                            return record;
                         },
                         function(err) {
                            IoC.resolve('ILogger').info('MultiSelectable', 'У контрола ' + self.getName() + ' не удалось вычитать запись по ключу ' + loadKeysArr[j]);
                         }
                     ));
                  }
               }

               dMultiResult.done().getResult().addCallback(function () {
                  self._onSelectedItemsChangeHandler();
                  self._loadItemsDeferred.callback(self._options.selectedItems);
               });

               return res;
            }, self));

         } else {
            self._loadItemsDeferred.callback(this._options.selectedItems);
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
               selItems.clear();
               this._onSelectedItemsChangeHandler();
            }
            return;
         }

         /* Соберём элементы для удаления, т.к. в методе each не отслеживаются изменения IList'а */
         selItems.each(function(rec) {
            if(!self._isItemSelected(rec.get(self._options.idProperty))) {
               delItems.push(rec);
            }
         });

         if(delItems.length) {
            for(var i = 0, len = delItems.length; i < len; i++) {
               selItems.remove(delItems[i]);
            }
            this._onSelectedItemsChangeHandler();
         }
      },

      /* Для правильной работы контекста надо рвать ссылку, на текущее св-во,
         чтобы не было равенства при сравнении и в контекст записалось новое значение */
      _onSelectedItemsChangeHandler: function() {
         this._cloneSelectedItems();
         this._notifyOnPropertyChanged('selectedItems');
      },

      _cloneSelectedItems: function() {
         this._options.selectedItems = this._options.selectedItems.clone(true);
      },

      _isItemSelected : function(item) {
         return this._getSelectedIndex(item) !== -1;
      },

      _getSelectedIndex: function(item, array) {
         var keys = array || this._options.selectedKeys,
             selectedItems = this._options.selectedItems,
             index = ArraySimpleValuesUtil.invertTypeIndexOf(keys, item);

         if(index === -1 && cInstance.instanceOfModule(item, 'WS.Data/Entity/Model')) {
            if(selectedItems) {
               index = selectedItems.getIndexByValue(item.getIdProperty(), item.get(this._options.idProperty));
            } else {
               index = -1;
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
         /* Если во время вычитки записей изменили ключи,
            загрузку надо отменять, иначе получим расхождение ключи <=> записи*/
         if(this._loadItemsDeferred && (addedKeys.length || removedKeys.length)) {
            this._loadItemsDeferred.cancel();
         }
         this._notifySelectedItems(this._options.selectedKeys, {
            added : addedKeys,
            removed : removedKeys
         });
         this._drawSelectedItems(this._options.selectedKeys, {
            added : addedKeys,
            removed : removedKeys
         });
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
         this._options.selectedItems =  new List({
            ownerShip: false
         });
      },

      _dataLoadedCallback : function(){
         if (this._checkEmptySelection()) {
            this._setFirstItemAsSelected();
         }
         this._setSelectedItems();
      },

      _setFirstItemAsSelected : function() {
         var items = this.getItems(),
             item = items && items.at(0);

         if (item) {
            this._options.selectedKeys = [item.getId()];
         }
      },

      _checkEmptySelection: function() {
         return this._isEmptySelection() && this._options.allowEmptyMultiSelection == false;
      },

      _setSelectedItems: function() {
         var record,
             isEmpty,
             index = -1,
             self = this,
             toAdd = [],
             dataSet = this.getItems();

         if (!self._options.selectedItems) {
            self.initializeSelectedItems();
         }

         if (dataSet && (!this._loadItemsDeferred || this._loadItemsDeferred.isReady())) {
            /* Запомним, если selectedItems пустой, то при добавлении в него записей, нам не нужно проверять,
               есть ли эти записи там уже, и можно из просто добавлять, не боясь что там будут 2 одинаковые записи */
            isEmpty = !this._options.selectedItems.getCount();
            colHelpers.forEach(this.getSelectedKeys(), function (key) {
               record = dataSet.getRecordById(key);
               if (record) {
                  if(isEmpty) {
                     toAdd.push(record);
                     return;
                  }

                  index = self._options.selectedItems.getIndexByValue(self._options.idProperty, record.getId());
                  /**
                   * Запись в датасете есть - заменим в наборе выбранных записей, т.к. она могла измениться.
                   * Если нету, то просто добавим.
                   */
                  if(index !== -1) {
                     self._options.selectedItems.replace(record, index);
                  } else {
                     toAdd.push(record);
                  }
               }
            });

            if(toAdd.length) {
               self._options.selectedItems.append(toAdd);
            }
         }
      },

      _checkNewItemsFormat: function(newItems) {
         var selectedItems = this._options.selectedItems;

         if(!selectedItems || !newItems || !cInstance.instanceOfMixin(selectedItems, 'WS.Data/Entity/FormattableMixin') || !cInstance.instanceOfMixin(newItems, 'WS.Data/Entity/FormattableMixin')) {
            return false;
         } else if(newItems.getAdapter()._moduleName !== selectedItems.getAdapter()._moduleName || !newItems.getFormat().isEqual(selectedItems.getFormat())) {
            this._options.selectedItems = null;
         }
      },

      _isEmptySelection: function() {
         var selectedKeys = this._options.selectedKeys,
             selectedItems = this._options.selectedItems,
             items = this.getItems(),
             isEmpty = true;

         if(selectedKeys.length) {
            /* Для правильной работы биндингов, предполагаем, что масив [null] тоже является пустым выделением */
            if(colHelpers.isEqualObject(selectedKeys, EMPTY_SELECTION)) {

               /* Пробуем найти в рекордсете запись с ключём null, если она есть - выделение не пустое. */
               if(items && items.getRecordById(EMPTY_SELECTION[0])) {
                  isEmpty = false;
               }

               /* Пробуем найти среди selectedItems запись с ключём null, если она есть - выделение не пустое. */
               if(isEmpty && selectedItems && selectedItems.getIndexByValue(this._options.idProperty, EMPTY_SELECTION[0]) !== -1) {
                  isEmpty = false;
               }
            } else if(isEmpty) {
               /* Если есть ключи и они не равны [null] - выделение не пустое. */
               isEmpty = false;
            }
         }

         return isEmpty;
      },

      /**
       * Ковертирует набор записей в массив из ключей
       * @param {WS.Data/Collection/List} list
       * @returns {Array}
       * @private
       */
      _convertToKeys: convertToKeys
   };

   return MultiSelectable;

});