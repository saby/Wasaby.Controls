/**
 * Created by iv.cheremushkin on 14.08.2014.
 */

define('js!SBIS3.CONTROLS.Selectable', [], function() {

   /**
    * Миксин, добавляющий поведение хранения выбранного элемента. Всегда только одного.
    * @mixin SBIS3.CONTROLS.Selectable
    * @author Крайнов Дмитрий Олегович
    * @public
    */

   var Selectable = /**@lends SBIS3.CONTROLS.Selectable.prototype  */{
       /**
        * @event onSelectedItemChange При смене выбранных элементов
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
        * @param {String} id Идентификатор выбранного пункта.
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
         _options: {
            /**
             * @cfg {String} Идентификатор выбранного элемента
             * @remark
             * Для задания выбранного элемента необходимо указать значение {@link SBIS3.CONTROLS.DSMixin#keyField ключевого поля} элемента коллекции.
             * @example
             * <pre>
             *     <option name="selectedKey">3</option>
             * </pre>
             * @see setSelectedKey
             * @see getSelectedKey
             * @see allowEmptySelection
             * @see SBIS3.CONTROLS.DSMixin#keyField
             * @see onSelectedItemChange
             */
            selectedKey: null,
            /**
             * @deprecated Будет удалено с 3.7.3. Используйте {@link selectedKey}.
             * @see selectedKey
             */
            selectedItem : null,
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
         if (this._options.selectedItem) {
            $ws.single.ioc.resolve('ILogger').log('selectedItem', 'c 3.7.3 свойство selectedItem перестанет работать. Используйте свойство selectedKey');
            this._options.selectedKey = this._options.selectedItem;
         }
         else {
            if (this._options.allowEmptySelection == false) {
               this._setFirstItemAsSelected();
            }
         }
      },

      after : {
         init : function() {
            this._drawSelectedItem(this._options.selectedKey);
         }
      },

      /**
       * Метод-заглушка. Будет переделан на установку самого элемента, а не его id
       * @param id
       * @deprecated Будет удалено с 3.7.3. Используйте {@link setSelectedKey}.
       */
      setSelectedItem: function(id) {
         //TODO изменить логику на установку выбранного элемента
         $ws.single.ioc.resolve('ILogger').log('setSelectedItem', 'c 3.7.3 метод setSelectedItem перестанет работать. Используйте метод setSelectedKey');
         this.setSelectedKey(id);
      },

      /**
       * Метод-заглушка. Будет переделан на возвращение самого элемента, а не его id
       * @deprecated Будет удалено с 3.7.3. Используйте {@link getSelectedKey}.
       */
      getSelectedItem : function() {
         //TODO изменить логику на возврат выбранного элемента
         $ws.single.ioc.resolve('ILogger').log('getSelectedItem', 'c 3.7.3 метод getSelectedItem перестанет работать. Используйте метод getSelectedKey');
         return this.getSelectedKey();
      },
      /**
       * Установить выбранный элемент по идентификатору
       * @remark
       * Для возвращения коллекции к состоянию без выбранного элемента нужно передать null.
       * @param {String} id Идентификатор элемента, который нужно установить в качестве выбранного.
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
         this._options.selectedKey = id;
         if (!this._options.selectedKey && this._options.allowEmptySelection == false) {
            this._setFirstItemAsSelected();
         }
         this._drawSelectedItem(this._options.selectedKey);
         this._notifySelectedItem(this._options.selectedKey);
      },
      /**
       * Получить идентификатор выбранного элемента.
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

      _drawSelectedItem : function() {
         /*Method must be implemented*/
      },

      _notifySelectedItem : function(id) {
         //TODO: может тут указать, что метод надо переопредить чтобы текст передавать и пр.?
         this._notify('onSelectedItemChange', id);
         this._notifyOnPropertyChanged('selectedKey');
      },

      _dataLoadedCallback : function(){
         if (!this._options.selectedKey && this._options.allowEmptySelection == false) {
            this._setFirstItemAsSelected();
         }
      },

      _setFirstItemAsSelected : function() {
         if (this._dataSet) {
            this._options.selectedKey = this._dataSet.at(0).getKey();
         }
      }
   };

   return Selectable;

});