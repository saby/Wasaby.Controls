/**
 * Created by iv.cheremushkin on 14.08.2014.
 */

define('js!SBIS3.CONTROLS.Selectable', ['js!SBIS3.CONTROLS.Data.Utils', 'js!SBIS3.CONTROLS.Data.Bind.ICollection'], function(Utils, IBindCollection) {

   /**
    * Миксин, добавляющий поведение хранения выбранного элемента. Всегда только одного.
    * @mixin SBIS3.CONTROLS.Selectable
    * @author Крайнов Дмитрий Олегович
    * @public
    */

   var Selectable = /**@lends SBIS3.CONTROLS.Selectable.prototype  */{
       /**
        * @event onSelectedItemChange Происходит при смене выбранного элемента коллекции.
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
        * @param {String} id Идентификатор выбранного элемента коллекции.
        * @example
        * <pre>
        *     RadioButtonGroup.subscribe('onSelectedItemChange', function(event, id){
        *        TextBox.setText('Selected item id: ', id);
        *     })
        * </pre>
        * @see selectedKey
        * @see setSelectedKey
        * @see getSelectedKey
        * @see SBIS3.CONTROLS.DSMixin#keyField
        */
      $protected: {
         _selectMode: 'index',
          _options: {
             /**
              * @cfg {String} Определяет элемент коллекции по переданному индексу (порядковому номеру).
              * @remark
              * Любой элемент коллекции можно выбрать либо по его идентификатору {@link SBIS3.CONTROLS.DSMixin#keyField},
              * либо его по индексу (порядковому номеру) в коллекции.
              * Для определения выбранного элемента необходимо указать его порядковый номер в коллекции.
              * @example
              * <pre>
              *     <option name="selectedIndex">1</option>
              * </pre>
              * @see setSelectedIndex
              * @see getSelectedIndex
              * @see onSelectedItemChange
              */
             selectedIndex: null,
             /**
              * @cfg {String} Определяет элемент коллекции по переданному идентификатору.
              * @remark
              * Используется для построения контрола с определенным элементом коллекции.
              * Для задания выбранного элемента необходимо указать значение
              * {@link SBIS3.CONTROLS.DSMixin#keyField ключевого поля} элемента коллекции.
              * Установить новый идентификатор элемента коллекции можно с помощью метода {@link setSelectedKey},
              * получить идентификатор элемента коллекции можно с помощью метода {@link getSelectedKey}.
              * @example
              * <pre>
              *     <option name="selectedKey">3</option>
              * </pre>
              * @see setSelectedKey
              * @see getSelectedKey
              * @see onSelectedItemChange
              */
             selectedKey: null,
             /**
              * @cfg {Boolean} Разрешить отсутствие выбранного элемента в группе
              * @example
              * <pre>
              *     <option name="allowEmptySelection">false</option>
              * </pre>
              * @remark
              * Опция нужна, например, для создания пустой группы радиокнопок - без выбранного элемента.
              * При этом после задания значения вернуть коллекцию к состоянию без выбранного элемента можно только
              * методом {@link setSelectedKey}.
              * @see selectedKey
              * @see setSelectedKey
              * @see getSelectedKey
              * @see SBIS3.CONTROLS.DSMixin#keyField
              */
            allowEmptySelection : true
         }
      },

      $constructor: function() {
         this._publish('onSelectedItemChange');
      },


      _prepareSelectedConfig: function(index, key) {




         // FIXME key !== null && index === -1 - проверка для выпуска 3.7.3.100
         // иначе, если сначала установить ключ, а потом сорс не будет отрисовываться выбранный эелемент
         if ((typeof index == 'undefined') || (index === null) || (key !== null && index === -1)) {
            if (typeof key != 'undefined') {
               this._selectMode = 'key';
               this._options.selectedIndex = this._getItemIndexByKey(key);
            }
            else {
               this._options.selectedIndex = undefined;
            }
         }
         else {
            this._selectMode = 'index';
            if (this._itemsProjection.getCount()) {
               this._options.selectedIndex = index;
            }
            else {
               this._options.selectedIndex = undefined;
            }
         }
         if (!this._options.allowEmptySelection && this._isEmptyIndex()) {
            if (this._itemsProjection.getCount()) {
               this._selectMode = 'index';
               this._options.selectedIndex = 0;
               this._setKeyByIndex();
            }
         }
      },

      before : {
         setDataSource: function() {
            this._options.selectedIndex = -1;
         },
         setItems: function() {
            this._options.selectedIndex = -1;
         },
         destroy: function () {
            this._resetUtilityEnumerator();
         }
      },

      after : {
         _setItemsEventHandlers : function() {
            if (!this._onProjectionCurrentChange) {
               this._onProjectionCurrentChange = onProjectionCurrentChange.bind(this);
            }
            this.subscribeTo(this._itemsProjection, 'onCurrentChange', this._onProjectionCurrentChange);

            if (!this._onProjectionChange) {
               this._onProjectionChange = onCollectionChange.bind(this);
            }
            this.subscribeTo(this._itemsProjection, 'onCollectionChange', this._onProjectionChange);
         },
         _drawItemsCallback: function() {
            this._drawSelectedItem(this._options.selectedKey, this._options.selectedIndex);
         },
         _unsetItemsEventHandlers : function() {
            if (this._utilityEnumerator) {
               this._utilityEnumerator.unsetObservableCollection(
                  this._itemsProjection
               );
            }
            this._utilityEnumerator = undefined;
            if (this._itemsProjection && this._onProjectionCurrentChange) {
               this.unsubscribeFrom(this._itemsProjection, 'onCurrentChange', this._onProjectionCurrentChange);
            }
            if (this._itemsProjection && this._onProjectionChange) {
               this.unsubscribeFrom(this._itemsProjection, 'onCollectionChange', this._onProjectionChange);
            }
         },
         _itemsReadyCallback: function() {
            this._prepareSelectedConfig(this._options.selectedIndex, this._options.selectedKey);
            this._selectInProjection();
         }
      },

      _getUtilityEnumerator: function() {
         if (!this._utilityEnumerator) {
            this._utilityEnumerator = this._itemsProjection.getEnumerator();
            this._utilityEnumerator.setObservableCollection(this._itemsProjection);
         }
         return this._utilityEnumerator;
      },

      _resetUtilityEnumerator: function(){
         if (this._utilityEnumerator) {
            this._utilityEnumerator.unsetObservableCollection(
               this._itemsProjection
            );
         }
         this._utilityEnumerator = undefined;
      },

      //TODO переписать метод
      _setSelectedIndex: function(index, id) {
         this._drawSelectedItem(id, index);
         this._notifySelectedItem(id, index)
      },
      /**
       * Устанавливает выбранным элемент коллекции по переданному идентификатору.
       * @remark
       * Для возвращения коллекции к состоянию без выбранного элемента нужно передать null.
       * @param {String} id Идентификатор элемента, который нужно установить в качестве выбранного.
       * Идентификатором элемента коллекции служит значение его {@link SBIS3.CONTROLS.DSMixin#keyField ключевого поля}.
       * @example
       * <pre>
       *     var newKey = (someValue > 0) ? 'positive' : 'negative';
       *     myComboBox.setSelectedKey(newKey);
       * </pre>
       * @see selectedKey
       * @see getSelectedKey
       * @see SBIS3.CONTROLS.DSMixin#keyField
       * @see onSelectedItemChange
       */
      setSelectedKey : function(id) {
         if(this._options.selectedKey === id) {
            return;
         }

         this._options.selectedKey = id;
         if (this._itemsProjection) {
            this._prepareSelectedConfig(undefined, id);
            this._selectInProjection();
         } else {
            this._setSelectedIndex(null, id);
         }
      },

      /**
       * Устанавливает выбранным элемент коллекции по переданному индексу (порядковому номеру).
       * @param index Индекс выбранного элемента коллекции.
       * @example
       * <pre>
       *    this._getControlOrdersList().setSelectedIndex(0);
       * </pre>
       * @see selectedIndex
       * @see getSelectedIndex
       */
      setSelectedIndex: function(index) {
         if (this._itemsProjection) {
            this._prepareSelectedConfig(index);
            this._itemsProjection.setCurrentPosition(index);
         }
      },
      /**
       * Возвращает идентификатор выбранного элемента коллекции.
       * Идентификатором элемента коллекции служит значение его {@link SBIS3.CONTROLS.DSMixin#keyField ключевого поля}.
       * @example
       * <pre>
       *     var key = myComboBox.getSelectedKey();
       *     if (key !== 'old') {
       *        myComboBox.setSelectedKey('newKey');
       *     }
       * </pre>
       * @see selectedKey
       * @see setSelectedKey
       * @see onSelectedItemChange
       * @see SBIS3.CONTROLS.DSMixin#keyField
       */
      getSelectedKey : function() {
         return this._options.selectedKey;
      },

      /**
       * Возвращает индекс (порядковый номер) выбранного элемента коллекции.
       * @example
       * <pre>
       *    index = list.getSelectedIndex();
       *    if (index > -1 && index < items.getCount()) {
       *       return items.at(index);
       *    }
       * </pre>
       * @see selectedIndex
       * @see setselectedIndex
       * @see onSelectedItemChange
       */
      getSelectedIndex : function() {
         return this._options.selectedIndex;
      },

      _drawSelectedItem : function() {
         /*Method must be implemented*/
      },

      _getItemValue: function(value, keyField) {
         if(value && typeof value === 'object') {
            return Utils.getItemPropertyValue(value, keyField );
         }
         return value;
      },

      _getItemIndexByKey: function(id) {
         if(this._options.keyField) {
            return this._getUtilityEnumerator().getIndexByValue(
               this._options.keyField,
               id
            );
         } else {
            var index;
            this._itemsProjection.each(function(value, i){
               if(value.getContents() === id){
                  index = i;
               }
            });
            return index;
         }
      },

      _notifySelectedItem : function(id, index) {
         this._notifyOnPropertyChanged('selectedKey');
         this._notifyOnPropertyChanged('selectedIndex');
         this._notify('onSelectedItemChange', id, index);
      },

      _setKeyByIndex: function() {
         if(this._hasItemByIndex()) {
            var item = this._itemsProjection.at(this._options.selectedIndex);
            this._options.selectedKey = item.getContents().getKey();
         }
      },

      _hasItemByIndex: function() {
         return (typeof this._options.selectedIndex != 'undefined') && (this._options.selectedIndex !== null) && (typeof this._itemsProjection.at(this._options.selectedIndex) != 'undefined');
      },

      _isEmptyIndex: function() {
         return this._options.selectedIndex === null || typeof this._options.selectedIndex == 'undefined' || this._options.selectedIndex == -1;
      },

      _selectInProjection: function (){
         if (this._hasItemByIndex()) {
            this._itemsProjection.setCurrentPosition(this._options.selectedIndex);
         } else {
            this._itemsProjection.setCurrentPosition(-1);
         }
      }
   };

   var onCollectionChange = function (event, action) {
      switch (action) {
         case IBindCollection.ACTION_ADD:
         case IBindCollection.ACTION_REMOVE:
         case IBindCollection.ACTION_MOVE:
         case IBindCollection.ACTION_REPLACE:
         case IBindCollection.ACTION_RESET:
            this._resetUtilityEnumerator();

            var indexByKey = this._getItemIndexByKey(this._options.selectedKey),
                itemsProjection = this._itemsProjection,
                count;

            if (indexByKey >= 0) {
               this._options.selectedIndex = indexByKey;
            } else {
               count = itemsProjection.getCount();
               if (count > 0) {
                  if(!this._isEmptyIndex()) {
                     if (this._options.selectedIndex > this._itemsProjection.getCount() - 1) {
                        this._options.selectedIndex = (count > 0) ? 0 : -1;
                     }
                     this._setKeyByIndex();
                  } else if(!this._options.allowEmptySelection) {
                     this._options.selectedIndex = 0;
                     this._setKeyByIndex();
                  }
               } else {
                  this._options.selectedIndex = -1;
                  this._options.selectedKey = null;
               }
            }
            if (action !== IBindCollection.ACTION_REPLACE){
               this._setSelectedIndex(this._options.selectedIndex, this._options.selectedKey);
            }
      }
   };

   var onProjectionCurrentChange = function (event, newCurrent, oldCurrent, newPosition) {
      this._setSelectedIndex(
         newPosition,
         this._getItemValue(newCurrent ? newCurrent.getContents() : null, this._options.keyField)
      );
   };

   return Selectable;

});