/* global define, $ws */

define('js!SBIS3.CONTROLS.SelectableNew', [
   'js!SBIS3.CONTROLS.Data.Utils'
], function (Utils) {
   'use strict';

   /**
    * Миксин, добавляющий поведение хранения выбранного элемента. Всегда только одного.
    * *Это экспериментальный модуль, API будет меняться!*
    * @mixin SBIS3.CONTROLS.SelectableNew
    * @state mutable
    * @author Крайнов Дмитрий Олегович
    */

   var SelectableNew = /**@lends SBIS3.CONTROLS.SelectableNew.prototype  */{
      /**
       * @event onSelectedItemChange При смене выбранных элементов
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} id Идентификатор выбранного пункта.
       * @example
       * <pre>
       *    radioButtonGroup.subscribe('onSelectedItemChange', function (event, id) {
       *       textBox.setText('Selected item id: ', id);
       *    });
       * </pre>
       * @see selectedKey
       */
      $protected: {
         _options: {
            /**
             * @cfg {String} Идентификатор выбранного элемента
             * @example
             * <pre>
             *     <option name="selectedKey">3</option>
             * </pre>
             * @see setSelectedKey
             * @see getSelectedKey
             */
            selectedKey: null,

            /**
             * @cfg {Boolean} Разрешить отсутствие выбранного элемента в группе
             * @example
             * <pre>
             *     <option name="allowEmptySelection">false</option>
             * </pre>
             */
            allowEmptySelection: true
         },

         /**
          * @var {SBIS3.CONTROLS.Data.Projection.CollectionEnumerator} Служебный энумератор
          */
         _utilityEnumerator: undefined
      },

      $constructor: function () {
         this._publish('onSelectedItemChange');
         if (this._options.selectedKey) {
            var index = this._getItemIndexByKey(this._options.selectedKey);
            if (index >=0)
               this._itemsProjection.setCurrentPosition(index, true);
         }
      },

      before: {
         destroy: function () {
            if (this._utilityEnumerator) {
               this._utilityEnumerator.unsetObservableCollection(
                  this._itemsProjection
               );
            }
         }
      },

      after: {
         init: function(){
            var projection = this.getItemsProjection(),
               self = this;

            this.subscribeTo(projection, 'onCurrentChange', (function(event, newCurrent, oldCurrent, newPosition) {
               this._setSelectedIndex(
                  newPosition,
                  self._getItemValue(newCurrent ? newCurrent.getContents() : null, this._options.keyField )
               );
            }).bind(this));
         },

         _initView: function() {
            var projection = this.getItemsProjection(),
               selected = projection.getCurrentPosition();
            if(selected >= 0) {
               this._setSelectedIndex(
                  selected,
                  this._getItemValue(projection.at(selected), this._options.keyField)
               );
            } else if (this._options.selectedKey) {
               this.setSelectedKey(this._options.selectedKey);
            }
            if (this._isItemMustSelected()) {
               this._setFirstItemAsSelected();
            }
         }
      },

      /**
       * Установить выбранный элемент по идентификатору
       * @param {String} id Идентификатор элемента, который нужно установить в качестве выбранного.
       * @returns {Number} Позиция элемента или -1, если такого нет
       * @example
       * <pre>
       *     var newKey = (someValue > 0) ? 'positive' : 'negative';
       *     myComboBox.setSelectedKey(newKey);
       * </pre>
       * @see selectedItem
       * @see getSelectedKey
       */
      setSelectedKey: function(id) {
         var index;
         if(id === null){
            this._setSelectedIndex(null, null);
         } else {
            index = this._getItemIndexByKey(id);
            if(index !== -1 && typeof index !== 'undefined') {
               this._setSelectedIndex(
                  index,
                  id
               );
            } else {
               $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Selectable::setSelectedKey()', "Selected key doesn't found.");
            }
         }
         return index;
      },

      _setSelectedIndex: function(index, id) {
         if(id !==  this._options.selectedKey) {
            this._options.selectedKey = index === -1?null:id;
            if(this._view) {
               this._itemsProjection.setCurrentPosition(index);
            }
            //this.saveToContext('SelectedItem', this._options.selectedKey); //TODO: Перенести отсюда
            this._drawSelectedItem();
            this._notifySelectedItem();
         }
      },

      /**
       * Получить индекс выбранного элемента
       * @example
       * <pre>
       *     var key = myComboBox.getPrevItemIndex();
       *     if (key !== 'old') {
       *        myComboBox.setSelectedKey(key);
       *     }
       * </pre>
       * @see selectedItem
       * @see setSelectedKey
       */
      getSelectedKey: function() {
         return this._options.selectedKey;
      },

      /**
       * Метод получения идентификатора следующего элемента.
       * @param key Идентификатор элемента
       * @returns {*|String} Идентификатор следующего элемента.
       * @example
       * <pre>
       *     var key = myComboBox.getNextItemKey();
       *     myComboBox.setSelectedKey(key);
       * </pre>
       * @see  getPreviousItemKey
       */
      getNextItemKey: function(key) {
         var enumerator = this._itemsProjection.getEnumerator();
         enumerator.setPosition(this._itemsProjection.getCurrentPosition());
         if (enumerator.getNext()) {
            return this._getItemValue(enumerator.getCurrent(), this._options.keyField);
         } else {
            return null;
         }
      },

      /**
       * Метод получения идентификатора предыдущего элемента
       * @param key Идентификатор элемента
       * @returns {*|String} Идентификатор предыдущего элемента.
       * @example
       * <pre>
       *     var key = myComboBox.getPreviousItemKey();
       *     if (key !== 'old') {
        *        myComboBox.setSelectedKey(key);
        *     }
       * </pre>
       * @see getNextItemKey
       */
      getPreviousItemKey: function(key) {
         var enumerator = this._itemsProjection.getEnumerator();
         enumerator.setPosition(this._itemsProjection.getCurrentPosition());
         if (enumerator.getPrevious()) {
            return this._getItemValue(enumerator.getCurrent(), this._options.keyField);
         } else {
            return null;
         }
      },

      _getItemIndexByKey: function(id) {
         if(this._options.keyField) {
            return this._getUtilityEnumerator().getItemIndexByPropertyValue(
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

      _getUtilityEnumerator: function() {
         if (!this._utilityEnumerator) {
            this._utilityEnumerator = this._itemsProjection.getEnumerator();
            this._utilityEnumerator.setObservableCollection(this._itemsProjection);
         }
         return this._utilityEnumerator;
      },

      _drawSelectedItem: function() {
         /*Method must be implemented*/
      },

      _notifySelectedItem: function() {
         //TODO: может тут указать, что метод надо переопредить чтобы текст передавать и пр.?
         this._notify('onSelectedItemChange', this._options.selectedKey);
      },

      _dataLoadedCallback: function() {
         if (this._isItemMustSelected()) {
            this._setFirstItemAsSelected();
         }
      },

      _isItemMustSelected: function() {
         return !this._options.selectedKey && !this._options.allowEmptySelection;
      },

      _setFirstItemAsSelected: function() {
         try {
            this._itemsProjection.moveToFirst();
         } catch (e) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Selectable::_setFirstItemAsSelected()', e);
         }
      },
      _getItemValue: function(value, keyField) {
         if(value && typeof value === 'object') {
            return Utils.getItemPropertyValue(value, keyField );
         }
         return value;
      }
   };

   return SelectableNew;

});