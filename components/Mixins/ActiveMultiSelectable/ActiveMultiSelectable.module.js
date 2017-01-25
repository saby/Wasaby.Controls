/**
 * Created by am.gerasimov on 26.10.2015.
 */
define('js!SBIS3.CONTROLS.ActiveMultiSelectable', ['js!WS.Data/Entity/Model', 'Core/core-instance'], function(Model, cInstance) {

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
         if(!cInstance.instanceOfMixin(this, 'SBIS3.CONTROLS.MultiSelectable')) {
            throw new Error('MultiSelectable mixin is required');
         }
      },

      /**
       * Устанавливает набор выбранных элементов коллекции.
       * Опция актуальна, когда контрол находится в режиме {@link SBIS3.CONTROLS.MultiSelectable#multiselect множественного выбора значений}.
       * @param {Array|WS.Data/Collection/List} list Выбранные элементы коллекции.
       * @example
       * <pre>
       *    var selectedItems = myGrid.getSelectedItems();
       *
       *    if(selectedItems.getCount()) {
       *       myFieldLink.setSelectedItems(selectedItems)
       *    }
       * </pre>
       * @see SBIS3.CONTROLS.MultiSelectable#selectedItems
       * @see SBIS3.CONTROLS.MultiSelectable#selectedKeys
       * @see clearSelectedItems
       * @see addSelectedItems
       */
      setSelectedItems: function(list) {
         var newList;

         if(list) {
            list = this._prepareItems(list);

            if (list.getCount() && !this._options.multiselect) {
               newList = this._makeList([list.at(0)]);
            } else {
               newList = list;
            }
         } else {
            newList = null;
         }

         this._options.selectedItems = newList;
         this._onChangeSelectedItems();
      },

      /**
       * Очищает набор выбранных элементов коллекции.
       * Опция актуальна, когда контрол находится в режиме {@link SBIS3.CONTROLS.MultiSelectable#multiselect множественного выбора значений}.
       * @see SBIS3.CONTROLS.MultiSelectable#multiselect
       * @see SBIS3.CONTROLS.MultiSelectable#selectedItems
       * @see SBIS3.CONTROLS.MultiSelectable#selectedKeys
       * @see setSelectedItems
       * @see addSelectedItems
       * @example
       * <pre>
       *    var selectedItems = myGrid.getSelectedItems();
       *
       *    if(selectedItems.getCount()) {
       *       myGrid.clearSelectedItems();
       *    }
       * </pre>
       */
      clearSelectedItems: function() {
         this.setSelectedItems([]);
      },


      _prepareItems: function(items) {
         var preparedItems, selectedItems;

         if(items instanceof Array) {
            selectedItems = this.getSelectedItems();

            if(cInstance.instanceOfModule(selectedItems, 'WS.Data/Collection/RecordSet')) {
               preparedItems = this._makeList(this._convertRecordsFormat(items, selectedItems));
            } else {
               preparedItems = this._makeList(items);
            }
         } else if (items === null) {
            preparedItems = this._makeList();
         } else if(!cInstance.instanceOfModule(items, 'WS.Data/Collection/List')) {
            throw new Error('ActiveMultiSelectable::setSelectedItems called with invalid argument');
         } else {
            preparedItems = items;
         }

         return preparedItems;
      },

      //TODO Лёхе Мальцеву выписана задача, чтобы он реализовал это на уровне данных, этого здесь быть не должно
      /**
       * Из переданных записей создаёт новые по формату переданного рекордсета
       */
      _convertRecordsFormat: function(items, recordSet) {
         var newRecords = [];

         for(var i = 0, len = items.length; i < len; i++) {
            newRecords.push(this._createModelByRecordSetFormat(items[i], recordSet));
         }

         return newRecords;
      },

      /**
       * Создаёт модель по формату рекордсета
       * Заполняет данными по переданной модели
       * Если формат совпадает, то вернёт исходную модель
       */
      _createModelByRecordSetFormat: function(model, recordset) {
         var format = recordset.getFormat(),
             createdModel;

         if(format.isEqual(model.getFormat())) {
            return model;
         }

         /* Создаём модель с форматом рекордсета */
         createdModel = new Model({
            adapter: recordset.getAdapter(),
            format: recordset.getFormat()
         });

         /* Заполняем данными */
         format.each(function(item) {
            var field = item.getName(),
                value = model.get(field);

            if(value) {
               createdModel.set(field, value);
            }
         });

         if(this._options.idProperty) {
            createdModel.set(recordset.getIdProperty(), model.get(this._options.idProperty));
         }
         return createdModel
      },

      /**
       * Добавляет новые элементы коллекции к набору выбранных.
       * Опция актуальна, когда контрол находится в режиме {@link SBIS3.CONTROLS.MultiSelectable#multiselect множественного выбора значений}.
       * @param {Array | WS.Data/Collection/List} items Массив элементов, которые нужно добавить в набор.
       * @see SBIS3.CONTROLS.MultiSelectable#multiselect
       * @see selectedItems
       * @see selectedKeys
       * @see setSelectedItems
       * @see clearSelectedItems
       * @example
       * <pre>
       *    var selectedItems = myGrid.getSelectedItems();
       *
       *    if(selectedItems.getCount()) {
       *       myFieldLink.addSelectedItems(selectedItems);
       *    }
       * </pre>
       */
      addSelectedItems: function(items) {
         var self = this,
             newItems = [];

         items = this._prepareItems(items);

         if(!items.getCount()) {
            return;
         }

         if(this._options.multiselect) {
            items.each(function(rec) {
               if(!self._isItemSelected(rec)) {
                  newItems.push(rec);
               }
            });
         } else if(!self._isItemSelected(items.at(0))) {
            newItems.push(items.at(0));
         }

         if(newItems.length) {
            /* Т.к. в момент добавления могут загружатся записи, то текущий набор получаем через
               асинхронный getSelectedItems, который либо сразу вернёт набор, либо когда загрузятся все записи */
            this.getSelectedItems(true).addCallback(function (selectedItems) {
               if(selectedItems) {
                  if(!self._options.multiselect) {
                     selectedItems.clear();
                  }
                  selectedItems.append(newItems);
               } else {
                  self._options.selectedItems = self._makeList(newItems);
               }
               /* Необходимо клонировать опцию selectedItems при изменении, чтобы контекст понял,
                  что опцию изменили, в противном случае при сравнении oldValue === newValue,
                  мы получим true, т.к. опция хранится по ссылке */
               self._cloneSelectedItems();
               self._onChangeSelectedItems();
               return selectedItems;
            });
         }
      },

      _onChangeSelectedItems: function() {
         var keys = this._convertToKeys(this._options.selectedItems),
             oldKeys = this._options.selectedKeys;

         /* Хак, чтобы починить проблемы с синхроницизронием контекста */
         this._options.selectedKeys = keys;
         this._notifyOnPropertyChanged('selectedItems');
         this._options.selectedKeys = oldKeys;
         this.setSelectedKeys(keys);
      }
   };

   return ActiveMultiSelectable;

});