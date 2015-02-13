define('js!SBIS3.CONTROLS.ComboBoxDS', [
   'js!SBIS3.CONTROLS.TextBox',
   'html!SBIS3.CONTROLS.ComboBoxDS',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.DSMixin',
   'js!SBIS3.CONTROLS.Selectable',
   'js!SBIS3.CONTROLS.DataBindMixin',
   'js!SBIS3.CONTROLS.Algorithm',
   'html!SBIS3.CONTROLS.ComboBoxDS/resources/ComboBoxArrowDown',
   'html!SBIS3.CONTROLS.ComboBoxDS/resources/ComboBoxItemTpl',
   'css!SBIS3.CONTROLS.ComboBoxDS'

], function (TextBox, dotTplFn, PickerMixin, DSMixin, Selectable, DataBindMixin, _, arrowTpl, itemTpl) {
   'use strict';
   /**
    * Выпадающий список с выбором значений из набора. Есть настройка которая позволяет также  вручную вводить значения.
    * @class SBIS3.CONTROLS.ComboBoxDS
    * @extends SBIS3.CONTROLS.TextBox
    * @control
    * @public
    * @initial
    * <component data-component='SBIS3.CONTROLS.ComboBoxDS' style='width: 100px'>    *
    * </component>
    * @category Inputs
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.FormWidgetMixin
    * @mixes SBIS3.CONTROLS.DSMixin
    * @mixes SBIS3.CONTROLS.Selectable
    */

   var ComboBoxDS = TextBox.extend([PickerMixin, DSMixin, Selectable, DataBindMixin], /** @lends SBIS3.CONTROLS.ComboBoxDS.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {

         _itemTpl: itemTpl,
         _options: {

            afterFieldWrapper: arrowTpl,
            /**
             * @cfg {Boolean} Возможен ли ручной ввод текста
             */
            editable: true,
            /**
             * @cfg {Boolean} Присутствует пустое значение или нет
             * @noShow
             */
            emptyValue: false,
            /**
             * @cfg {String} Форматирование значений в списке
             * @noShow
             */
            valueFormat: '',
            /**
             * @cfg {String} название поля для отображения
             */
            displayField: ''
         }
      },

      $constructor: function () {
         var self = this;
         self.getContainer().addClass('controls-ComboBox');
         if (!this._options.displayField) {
            //TODO по умолчанию поле title???
            this._options.displayField = 'title';
         }
         if (this._options.itemTemplate) {
            this._itemTpl = this._options.itemTemplate;
         }

         /*устанавливаем первое значение TODO по идее переписан метод setSelectedItem для того чтобы не срабатывало событие при первой установке*/
         if (this._options.selectedItem) {
            // надо прочитать запись по ключу и поставить ее значение
            self._dataSource.read(this._options.selectedItem).addCallback(function (item) {
               ComboBoxDS.superclass.setText.call(self, item.get(self._options.displayField));
               $('.js-controls-ComboBox__fieldNotEditable', self._container.get(0)).text(item.get(self._options.displayField));
            });
         } else {
            if (this._options.text) {
               this._setKeyByText();
            }
         }

         /*обрабочики кликов TODO mouseup!!*/
         this._container.mouseup(function (e) {
            if ($(e.target).hasClass('js-controls-ComboBox__arrowDown')) {
               if (self.isEnabled()) {
                  $('.controls-ComboBox__itemRow__selected').removeClass('controls-ComboBox__itemRow__selected');
                  var key = self.getSelectedItem();
                  $('.controls-ComboBox__itemRow[data-key=\'' + key + '\']').addClass('controls-ComboBox__itemRow__selected');
                  self.togglePicker();
               }
            }
         });

      },

      setText: function (text) {
         ComboBoxDS.superclass.setText.call(this, text);
         $('.js-controls-ComboBox__fieldNotEditable', this._container.get(0)).text(text);
         this._setKeyByText();
         this.hidePicker();
      },

      _drawSelectedItem: function (key) {
         if (typeof(key) != 'undefined') {
            var item = this._dataSet.getRecord(key);
            if (item) {
               ComboBoxDS.superclass.setText.call(this, item.get(this._options.displayField));
               $('.js-controls-ComboBox__fieldNotEditable', this._container.get(0)).text(item.get(this._options.displayField));
            }
            else {
               ComboBoxDS.superclass.setText.call(this, '');
               $('.js-controls-ComboBox__fieldNotEditable', this._container.get(0)).text('');
            }
         }
         if (this._picker) {
            $('.controls-ComboBox__itemRow__selected', this._picker.getContainer().get(0)).removeClass('controls-ComboBox__itemRow__selected');
            $('.controls-ComboBox__itemRow[data-key=\'' + key + '\']', this._picker.getContainer().get(0)).addClass('controls-ComboBox__itemRow__selected');
         }
      },

      //TODO от этого надо избавиться. Пользуется Саня Кузьмин
      _notifySelectedItem: function (key) {
         var text = this.getText();
         this._notify('onSelectedItemChange', key, text);
      },

      _setPickerContent: function () {
         this._drawItems();
         var self = this;
         //TODO придумать что то нормальное и выпилить
         this._picker.getContainer().mousedown(function (e) {
            e.stopPropagation();
         });

         //Подписка на клик по элементу комбобокса
         //TODO mouseup из за того что контрол херит событие клик
         this._picker.getContainer().mouseup(function (e) {
            var row = $(e.target).closest('.js-controls-ComboBox__itemRow');
            if (row.length) {
               self.setSelectedItem($(row).attr('data-key'));
               self.hidePicker();
            }
         });
         //TODO: кажется неочевидное место, возможно как то автоматизировать
         this._picker.getContainer().addClass('controls-ComboBox__picker');
      },

      _setPickerConfig: function () {
         return {
            corner: 'bl',
            verticalAlign: {
               side: 'top'
            },
            horizontalAlign: {
               side: 'left'
            },
            closeByExternalClick: true,
            targetPart: true
         };
      },

      _getItemsContainer: function () {
         return this._picker.getContainer();
      },

      _getItemTemplate: function (item) {
         var
            key = this._dataSet.getKey(item),
            title = item.get(this._options.displayField),
            selected = (this._options.selectedItem == key);
         return this._itemTpl({key: key, title: title, selected: selected});
      },

      _keyDownBind: function (e) {
         //TODO: так как нет итератора заккоментим
         /*описываем здесь поведение стрелок вверх и вниз*/
         /*
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
         */
      },


      _keyUpBind: function (e) {
         /*по изменению текста делаем то же что и в текстбоксе*/
         ComboBoxDS.superclass._keyUpBind.call(this);
         /*не делаем смену значения при нажатии на стрелки вверх вниз. Иначе событие смены ключа срабатывает два раза*/
         if ((e.which != 40) && (e.which != 38)) {
            this._setKeyByText();
         }
      },

      _setKeyByText: function () {
         /*устанавливаем ключ, когда текст изменен извне*/
         var
            selKey,
            oldKey = this._options.selectedItem,
            self = this,
            filterFieldObj = {},
            filter = [];

         filterFieldObj[this._options.displayField] = self._options.text;
         filter.push(filterFieldObj);

         self._dataSource.query(filter).addCallback(function (DataSet) {
            _.each(DataSet, function (item) {
               selKey = DataSet.getKey(item);
            });
         });

         this._options.selectedItem = selKey || null;
         //TODO: переделать на setSelectedItem, чтобы была запись в контекст и валидация если надо. Учесть проблемы с первым выделением
         if (oldKey !== this._options.selectedItem) { // при повторном индексе null не стреляет событием
            this._notifySelectedItem(this._options.selectedItem);
         }
      },

      _drawItems: function () {
         if (this._picker) {
            ComboBoxDS.superclass._drawItems.call(this);
            this._picker.recalcPosition();
         }
      },

      setEditable: function (editable) {
         this._options.editable = editable;
         this._container.toggleClass('controls-ComboBox__editable-false', editable === false);
      },

      isEditable: function () {
         return this._options.editable;
      },

      setValue: function (key) {
         this.setSelectedItem(key);
      },

      getValue: function () {
         return this.getSelectedItem();
      },

      _setEnabled: function (enabled) {
         TextBox.superclass._setEnabled.call(this, enabled);
         if (enabled === false) {
            this._inputField.attr('readonly', 'readonly');
         }
         else {
            if (this._options.editable) {
               this._inputField.removeAttr('readonly');
            }
         }
      }
   });

   return ComboBoxDS;
});