/*global $ws, define*/
define('js!SBIS3.CONTROLS.MultiSelectableNew', [
   'js!SBIS3.CONTROLS.Data.Utils'
], function(Utils) {

   /**
    * Миксин, добавляющий поведение хранения одного или нескольких выбранных элементов
    * @mixin SBIS3.CONTROLS.MultiSelectableNew
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var MultiSelectableNew = /**@lends SBIS3.CONTROLS.MultiSelectableNew.prototype  */{
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
             * TODO Выбранные элементы
             * @deprecated Будет удалено с 3.7.3. Используйте {@link selectedKeys}.
             */
            selectedItems : [],
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
            allowEmptySelection : true
         },
         _selectedRecords: []
      },

      $constructor: function() {
         this._publish('onSelectedItemsChange');
         if (this._options.selectedItems && this._options.selectedItems.length) {
            $ws.single.ioc.resolve('ILogger').log('selectedItems', 'c 3.7.3 метод selectedItems перестанет работать. Используйте метод selectedKeys');
            this._options.selectedKeys = this._options.selectedItems;
         }
         if (this._options.selectedKeys) {
            if (Object.prototype.toString.call(this._options.selectedKeys) == '[object Array]' ) {
               if (!this._options.multiselect) {
                  this._options.selectedKeys = this._options.selectedKeys.slice(0, 1);
               }
               this._setSelectedRecords();
            }
            else {
               throw new Error('Argument must be instance of Array');
            }
         }
         else {
            if (this._options.allowEmptySelection == false) {
               this._setFirstItemAsSelected();
               this._setSelectedRecords();
            }
         }
      },
      after: {
         init: function () {
            if (this._options.selectedKey) {
               this.setSelectedKeys(this._options.selectedKey);
            }
            this._drawSelectedItems();
         },
         _initView: function() {
            if (this._options.selectedKeys) {
               this._drawSelectedItems(this._options.selectedKeys);
            }
         }
      },
      /**
       * Метод-заглушка. Будет переделан на установку самих элементов, а не их id
       * @deprecated Будет удалено с 3.7.3. Используйте {@link setSelectedKeys}.
       */
      setSelectedItems: function(idArray) {
         //TODO изменить логику на установку выбранных элементов
         $ws.single.ioc.resolve('ILogger').log('setSelectedItems', 'c 3.7.3 метод setSelectedItems перестанет работать. Используйте метод setSelectedKeys');
         this.setSelectedKeys(idArray);
      },

      /**
       * Метод-заглушка. Будет переделан на получение самих элементов, а не их id
       * @deprecated Будет удалено с 3.7.3. Используйте {@link getSelectedKeys}.
       */
      getSelectedItems: function() {
         //TODO изменить логику на получение выбранных элементов
         $ws.single.ioc.resolve('ILogger').log('getSelectedItems', 'c 3.7.3 метод getSelectedItems перестанет работать. Используйте метод setSelectedKeys');
         return this.getSelectedKeys();
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
         if (Object.prototype.toString.call(idArray) == '[object Array]' ) {
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
            if (!this._options.selectedKeys.length && this._options.allowEmptySelection == false) {
               this._setFirstItemAsSelected();
            }
            this._drawSelectedItems(this._options.selectedKeys);
            this._notifySelectedItems(this._options.selectedKeys);
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
         var items = this._getAllKeyItems();
         this.setSelectedKeys(items);
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
         if (Object.prototype.toString.call(idArray) == '[object Array]' ) {
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
            if (!this._options.selectedKeys.length && this._options.allowEmptySelection == false) {
               this._setFirstItemAsSelected();
            }
            this._drawSelectedItems(this._options.selectedKeys);
            this._notifySelectedItems(this._options.selectedKeys);
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
         if (Object.prototype.toString.call(idArray) == '[object Array]' ) {
            for (var i = idArray.length - 1; i >= 0; i--) {
               var index = this._isItemSelected(idArray[i]);
               if (index >= 0) {
                  Array.remove(this._options.selectedKeys, index);
               }
            }
            if (!this._options.selectedKeys.length && this._options.allowEmptySelection == false) {
               this._setFirstItemAsSelected();
            }
            this._drawSelectedItems(this._options.selectedKeys);
            this._notifySelectedItems(this._options.selectedKeys);
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
         if (Object.prototype.toString.call(idArray) == '[object Array]' ) {
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
                  if (!this._options.selectedKeys.length && this._options.allowEmptySelection == false) {
                     this._setFirstItemAsSelected();
                  }
                  this._drawSelectedItems(this._options.selectedKeys);
                  this._notifySelectedItems(this._options.selectedKeys);
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
         var items = this._getAllKeyItems();
         this.toggleItemsSelection(items);
      },

      _isItemSelected : function(id) {
         //TODO пока нет определенности ключ - строка или число - надо избавиться
         var index = this._options.selectedKeys.indexOf(id);
         if (index < 0) {
            index = this._options.selectedKeys.indexOf(id + '')
         }
         return index;
      },
      /**
       * вовращает масив ключей всех элементов
       * @private
       * @returns {Array}
       */
      _getAllKeyItems:function(){
         var items = this.getItems(),
            keyField = this._options.keyField,
            keys = [];
         items.each(function(item){
            keys.push(Utils.getItemPropertyValue(item,keyField))
         });
         return keys;
      },
      _drawSelectedItems : function() {
         /*Method must be implemented*/
      },

      _notifySelectedItems : function(idArray) {
         this._setSelectedRecords();
         this._notify('onSelectedItemsChange', idArray);
      },

      _dataLoadedCallback : function(){
         if (!this._options.selectedKeys.length && this._options.allowEmptySelection == false) {
            this._setFirstItemAsSelected();
         }
      },

      _setFirstItemAsSelected : function() {
         var items = this.getItems();
         if (items) {
            var firstItem = items.at(0);
            this._options.selectedKeys = Utils.getItemPropertyValue(firstItem,this._options.keyField);
         }
      },

      _setSelectedRecords: function() {
         var self = this;
         this._selectedRecords = [];
         var items = this.getItems();
         if (items && this._options.selectedKeys) {
            items.each(function(item) {
               var key = Utils.getItemPropertyValue(item,self._options.keyField);
               if(Array.indexOf(self._options.selectedKeys,key) !== -1) {
                  self._selectedRecords.push(item);
               }
            });
         }
      }
   };

   return MultiSelectableNew;

});