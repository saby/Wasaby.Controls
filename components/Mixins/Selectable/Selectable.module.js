/**
 * Created by iv.cheremushkin on 14.08.2014.
 */

define('js!SBIS3.CONTROLS.Selectable', [], function() {

   /**
    * Миксин, добавляющий поведение хранения выбранного элемента. Всегда только одного.
    * @mixin SBIS3.CONTROLS.Selectable
    * @public
    */

   var Selectable = /**@lends SBIS3.CONTROLS.Selectable.prototype  */{
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
             * @see setSelectedItem
             * @see getSelectedItem
             */
            selectedKey: null,
            /**
             * TODO Выбранный элемент
             */
            selectedItem : null,
            allowEmptySelection : true
         }
      },

      $constructor: function() {
         this._publish('onSelectedItemChange');
         if (this._options.selectedItem) {
            console.log('c 3.7.3 свойство selectedItem перестанет работать. Используйте свойство selectedKey');
            this._options.selectedKey = this._options.selectedItem;
         }
         else {
            if (this._options.allowEmptySelection == false) {
               this._setFirstItemAsSelected();
            }
         }
         this._drawSelectedItem();
      },

      /**
       * Метод-заглушка. Будет переделан на установку самого элемента, а не его id
       * @param id
       */
      setSelectedItem: function(id) {
         //TODO изменить логику на установку выбранного элемента
         console.log('c 3.7.3 метод setSelectedItem перестанет работать. Используйте метод setSelectedKey');
         this.setSelectedKey(id);
      },

      /**
       * Метод-заглушка. Будет переделан на возвращение самого элемента, а не его id
       */
      getSelectedItem : function() {
         //TODO изменить логику на возврат выбранного элемента
         console.log('c 3.7.3 метод getSelectedItem перестанет работать. Используйте метод getSelectedKey');
         return this.getSelectedKey();
      },
      /**
       * Установить выбранный элемент по индексу
       * @param {String} id Идентификатор элемента, который нужно установить в качестве выбранного.
       * @example
       * <pre>
       *     MyComboBox.setSelectedKey('3');
       * </pre>
       * @see selectedItem
       * @see getSelectedKey
       */
      setSelectedKey : function(id) {
         this._options.selectedKey = id;
         if (!this._options.selectedKey && this._options.allowEmptySelection == false) {
            this._setFirstItemAsSelected();
         }
         this.saveToContext('SelectedItem', this._options.selectedKey); //TODO: Перенести отсюда
         this._drawSelectedItem(this._options.selectedKey);
         this._notifySelectedItem(this._options.selectedKey);
      },

      /**
       * Получить индекс выбранного элемента
       * @example
       * <pre>
       *     MyComboBox.getSelectedKey();
       * </pre>
       * @see selectedItem
       * @see setSelectedKey
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