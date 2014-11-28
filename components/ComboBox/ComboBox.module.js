define('js!SBIS3.CONTROLS.ComboBox', [
   'js!SBIS3.CONTROLS.TextBox',
   'js!SBIS3.CONTROLS._PickerMixin',
   'js!SBIS3.CONTROLS._CollectionMixin',
   'js!SBIS3.CONTROLS._SelectorMixin',
   'js!SBIS3.CONTROLS._DataBindMixin',
   'html!SBIS3.CONTROLS.ComboBox/resources/ComboBoxArrowDown',
   'html!SBIS3.CONTROLS.ComboBox/resources/ComboBoxItemTpl'
], function(TextBox, _PickerMixin, _CollectionMixin, _SelectorMixin, _DataBindMixin, arrowTpl, itemTpl) {
   'use strict';
   /**
    * Выпадающий список с выбором значений из набора. Есть настройка которая позволяет также  вручную вводить значения.
    * @class SBIS3.CONTROLS.ComboBox
    * @extends SBIS3.CONTROLS.TextBox
    * @control
    * @public
    * @category Inputs
    * @mixes SBIS3.CONTROLS._PickerMixin
    * @mixes SBIS3.CONTROLS._FormWidgetMixin
    * @mixes SBIS3.CONTROLS._CollectionMixin
    * @mixes SBIS3.CONTROLS._SelectorMixin
    */

   var ComboBox = TextBox.extend([_PickerMixin, _CollectionMixin, _SelectorMixin, _DataBindMixin], /** @lends SBIS3.CONTROLS.ComboBox.prototype */{
      $protected: {
         _itemTpl : itemTpl,
         _options: {
            afterFieldWrapper: arrowTpl,
            /**
             * @cfg {Boolean} Возможен ли ручной ввод текста
             */
            isEditable: true,
            /**
             * @cfg {Boolean} Присутствует пустое значение или нет
             */
            emptyValue: false,
            /**
             * @cfg {String} Форматирование значений в списке
             */
            valueFormat: '',
            /**
             * @cfg {String} название поля для отображения
             */
            displayField: ''
         }
      },

      $constructor: function() {
         var self = this;
         self.getContainer().addClass('controls-ComboBox');
         if (!this._options.displayField) {
            //TODO по умолчанию поле title???
            this._options.displayField = 'title';
         }
         if (this._options.itemTemplate) {
            this._itemTpl = this._options.itemTemplate;
         }

         //TODO: в идеале надо сделать, чтобы атрибут проставлялся в шаблоне, и не плодить его на все контролы-наследники TextBox'а, плюс очень похоже на enabled
         // запрещен ручной ввод значений
         if(!this._options.isEditable){
            self.getContainer().addClass('controls-ComboBox__isEditable-false').find('.js-controls-TextBox__field').attr('readonly', 'readonly').addClass('js-controls-ComboBox__arrowDown');
         }

         if (this._items.getItemsCount()) {
            /*устанавливаем первое значение TODO по идее переписан метод setSelectedItem для того чтобы не срабатывало событие при первой установке*/
            var item;
            if (!this._options.selectedItem) {
               item = this._items.getNextItem();
               this._options.selectedItem = this._items.getKey(item);
            }
            else {
               item = this._items.getItem(this._options.selectedItem);
            }
            ComboBox.superclass.setText.call(this, item[this._options.displayField]);
         }

         /*обрабочики кликов*/
         $('.js-controls-ComboBox__arrowDown', this._container.get(0)).click(function () {
            if (self.isEnabled()) {
               $('.controls-ComboBox__itemRow__selected').removeClass('controls-ComboBox__itemRow__selected');
               var key = self.getSelectedItem();
               $('.controls-ComboBox__itemRow[data-key=\'' + key + '\']').addClass('controls-ComboBox__itemRow__selected');
               self.togglePicker();
            }
         });

      },

      setText : function(text) {
         ComboBox.superclass.setText.call(this, text);
         this._setKeyByText();
         this.hidePicker();
      },

      _drawSelectedItem : function(key) {
         if (typeof(key) != 'undefined') {
            var item = this._items.getItem(key);
            ComboBox.superclass.setText.call(this, item[this._options.displayField]);
         }
         if (this._picker) {
            $('.controls-ComboBox__itemRow__selected', this._picker.getContainer().get(0)).removeClass('controls-ComboBox__itemRow__selected');
            $('.controls-ComboBox__itemRow[data-key=\'' + key + '\']', this._picker.getContainer().get(0)).addClass('controls-ComboBox__itemRow__selected');
         }
      },

      //TODO от этого надо избавиться. Пользуется Саня Кузьмин
      _notifySelectedItem : function(key) {
         var text = this.getText();
         this._notify('onSelectedItemChange', key, text);
      },

      _setPickerContent: function () {
         this._drawItems();
         var self = this;
         //TODO придумать что то нормальное и выпилить
         this._picker.getContainer().mousedown(function(e){
            e.stopPropagation();
         });

         //Подписка на клик по элементу комбобокса
         //TODO mouseup из за того что контрол херит событие клик
         this._picker.getContainer().mouseup(function(e){
            var row = $(e.target).closest('.js-controls-ComboBox__itemRow');
            if (row.length) {
               self.setSelectedItem($(row).attr('data-key'));
               self.hidePicker();
            }
         });
         //TODO: кажется неочевидное место, возможно как то автоматизировать
         this._picker.getContainer().addClass('controls-ComboBox__picker');
      },


      _getItemsContainer : function() {
         return this._picker.getContainer();
      },

      _getItemTemplate : function(item) {
         var
            key = this._items.getKey(item),
            title = this._items.getValue(item, this._options.displayField),
            selected = (this._options.selectedItem == key);
         return this._itemTpl({key: key, title: title, selected: selected});
      },

      _keyDownBind : function(e){
         /*описываем здесь поведение стрелок вверх и вниз*/
         var self = this,
         current = self.getSelectedItem();
			if (e.which == 40 || e.which == 38) {
            e.preventDefault();
         }
         var newItem;
         if (e.which == 40) {
            newItem = self.getItems().getNextItem(current);
         }
         if (e.which == 38) {
            newItem = self.getItems().getPreviousItem(current);
         }
         if (newItem) {
            self.setSelectedItem(this._items.getKey(newItem));
         }
         if (e.which == 13) {
            this.hidePicker();
         }
      },


      _keyUpBind: function(e) {
         /*по изменению текста делаем то же что и в текстбоксе*/
         ComboBox.superclass._keyUpBind.call(this);
         /*не делаем смену значения при нажатии на стрелки вверх вниз. Иначе событие смены ключа срабатывает два раза*/
         if ((e.which != 40) && (e.which != 38)) {
            this._setKeyByText();
         }
      },

      _setKeyByText : function() {
         /*устанавливаем ключ, когда текст изменен извне*/
         var
            selKey,
            oldKey = this._options.selectedItem,
            self = this,
            text = this._options.text;
         this._items.iterate(function(item, key){
            if (item[self._options.displayField] == text) {
               selKey = key;
            }
         });
         this._options.selectedItem = selKey || null;
         //TODO: переделать на setSelectedItem, чтобы была запись в контекст и валидация если надо. Учесть проблемы с первым выделением
         if (oldKey !== this._options.selectedItem) { // при повторном индексе null не стреляет событием
            this._notifySelectedItem(this._options.selectedItem);
         }
      },

      _drawItems: function(){
         if (this._picker) {
            ComboBox.superclass._drawItems.call(this);
            this._picker.recalcPosition();
         }
      },

      setValue: function(key){
         this.setSelectedItem(key);
      },

      getValue: function() {
         return this.getSelectedItem();
      },

      _loadChildControls : function() {
         /*TODO временная заглушка, пока есть различия между Control и CompoundControl*/
      },

      _setEnabled : function(enabled) {
         TextBox.superclass._setEnabled.call(this, enabled);
         if (enabled === false) {
            this._inputField.attr('readonly', 'readonly');
         }
         else {
            if (this._options.isEditable) {
               this._inputField.removeAttr('readonly');
            }
         }
      }
   });

   return ComboBox;
});