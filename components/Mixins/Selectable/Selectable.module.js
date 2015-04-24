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
             *     <option name="selectedIndex">3</option>
             * </pre>
             * @see setSelectedIndex
             * @see getSelectedIndex
             * @see setSelectedItem
             * @see getSelectedItem
             */
            selectedIndex: null,
            /**
             * TODO Выбранный элемент
             */
            selectedItem : null
         }
      },

      $constructor: function() {
         this._publish('onSelectedItemChange');
         if (this._options.selectedItem) {
            console.log('c 3.7.3 свойство selectedItem перестанет работать. Используйте свойство selectedIndex');
            this._options.selectedIndex = this._options.selectedItem;
         }
      },

      /**
       * Метод-заглушка. Будет переделан на установку самого элемента, а не его id
       * @param id
       */
      setSelectedItem: function(id) {
         //TODO изменить логику на установку выбранного элемента
         console.log('c 3.7.3 метод setSelectedItem перестанет работать. Используйте метод setSelectedIndex');
         this.setSelectedIndex(id);
      },

      /**
       * Метод-заглушка. Будет переделан на возвращение самого элемента, а не его id
       */
      getSelectedItem : function() {
         //TODO изменить логику на возврат выбранного элемента
         console.log('c 3.7.3 метод getSelectedItem перестанет работать. Используйте метод getSelectedIndex');
         return this.getSelectedIndex();
      },
      /**
       * Установить выбранный элемент по индексу
       * @param {String} id Идентификатор элемента, который нужно установить в качестве выбранного.
       * @example
       * <pre>
       *     MyComboBox.setSelectedIndex('3');
       * </pre>
       * @see selectedItem
       * @see getSelectedIndex
       */
      setSelectedIndex : function(id) {
         this._options.selectedIndex = id;
         this.saveToContext('SelectedItem', id); //TODO: Перенести отсюда
         this._drawSelectedItem(id);
         this._notifySelectedItem(id);
      },

      /**
       * Получить индекс выбранного элемента
       * @example
       * <pre>
       *     MyComboBox.getSelectedIndex();
       * </pre>
       * @see selectedItem
       * @see setSelectedIndex
       */
      getSelectedIndex : function() {
         return this._options.selectedIndex;
      },

      _drawSelectedItem : function() {
         /*Method must be implemented*/
      },

      _notifySelectedItem : function(id) {
         //TODO: может тут указать, что метод надо переопредить чтобы текст передавать и пр.?
         this._notify('onSelectedItemChange', id);
      }
   };

   return Selectable;

});