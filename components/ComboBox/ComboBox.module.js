define('js!SBIS3.CONTROLS.ComboBox', [
   'js!SBIS3.CONTROLS.TextBox',
   'html!SBIS3.CONTROLS.ComboBox',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.DSMixin',
   'js!SBIS3.CONTROLS.Selectable',
   'js!SBIS3.CONTROLS.DataBindMixin',
   'html!SBIS3.CONTROLS.ComboBox/resources/ComboBoxArrowDown'
], function (TextBox, dotTplFn, PickerMixin, DSMixin, Selectable, DataBindMixin, arrowTpl) {
   'use strict';
   /**
    * Выпадающий список с выбором значений из набора. Есть настройка которая позволяет также  вручную вводить значения.
    * @class SBIS3.CONTROLS.ComboBox
    * @extends SBIS3.CONTROLS.TextBox
    * @control
    * @public
    * @initial
    * <component data-component='SBIS3.CONTROLS.ComboBox' style='width: 100px'>    *
    * </component>
    * @category Inputs
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.FormWidgetMixin
    * @mixes SBIS3.CONTROLS.DSMixin
    * @mixes SBIS3.CONTROLS.Selectable
    */

   var ComboBox = TextBox.extend([PickerMixin, DSMixin, Selectable, DataBindMixin], /** @lends SBIS3.CONTROLS.ComboBox.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            /**
             * @cfg {} Шаблон отображения каждого элемента коллекции
             */
            itemTemplate: '',
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

         if (this._options.selectedItem) {
            this._drawSelectedItem(this._options.selectedItem);
         } else {
            if (this._options.text) {
               this._setKeyByText();
            }
         }

         /*обрабочики кликов TODO mouseup!!*/
         this._container.mouseup(function (e) {
            if ($(e.target).hasClass('js-controls-ComboBox__arrowDown')) {
               if (self.isEnabled()) {
                  self.togglePicker();
               }
            }
         }).mousedown(function(e){
            e.stopPropagation();
         })

      },

      setText: function (text) {
         ComboBox.superclass.setText.call(this, text);
         $('.js-controls-ComboBox__fieldNotEditable', this._container.get(0)).text(text);
         this._setKeyByText();
      },

      _drawSelectedItem: function (key) {
         if (typeof(key) != 'undefined' && key != null) {
            var item, def;
            def = new $ws.proto.Deferred();
            if (this._dataSet) {
               item = this._dataSet.getRecordByKey(key);
               def.callback(item);
            }
            else {
               this._dataSource.read(key).addCallback(function(item){
                  def.callback(item);
               });
            }
            var self = this;
            def.addCallback(function(item){
               var newText = item.get(self._options.displayField);
               if (item && (newText != self._options.text)) {
                  ComboBox.superclass.setText.call(self, newText);
                  $('.js-controls-ComboBox__fieldNotEditable', self._container.get(0)).text(newText);
               }
               else {
                  ComboBox.superclass.setText.call(self, '');
                  $('.js-controls-ComboBox__fieldNotEditable', self._container.get(0)).text('');
               }
               if (self._picker) {
                  $('.controls-ComboBox__itemRow__selected', self._picker.getContainer().get(0)).removeClass('controls-ComboBox__itemRow__selected');
                  $('.controls-ComboBox__itemRow[data-id=\'' + key + '\']', self._picker.getContainer().get(0)).addClass('controls-ComboBox__itemRow__selected');
               }
            });

         }

      },

      _drawItemsCallback : function() {
         this._drawSelectedItem(this._options.selectedItem);
      },

      _addItemClasses : function(container, key) {
         ComboBox.superclass._addItemClasses.call(this, container, key);
         container.addClass('controls-ComboBox__itemRow').addClass('js-controls-ComboBox__itemRow');
      },

      //TODO от этого надо избавиться. Пользуется Саня Кузьмин
      _notifySelectedItem: function (key) {
         var text = this.getText();
         this._notify('onSelectedItemChange', key, text);
      },

      _setPickerContent: function () {
         var self = this;
         this.reload();
         //TODO придумать что то нормальное и выпилить
         this._picker.getContainer().mousedown(function (e) {
            e.stopPropagation();
         });

         //Подписка на клик по элементу комбобокса
         //TODO mouseup из за того что контрол херит событие клик
         this._picker.getContainer().mouseup(function (e) {
            var row = $(e.target).closest('.js-controls-ComboBox__itemRow');
            if (row.length) {
               self.setSelectedItem($(row).attr('data-id'));
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
         var title = item.get(this._options.displayField);
         if (this._options.itemTemplate) {
            return doT.template(this._options.itemTemplate)({item : item, displayField : title})
         }
         else {
            return '<div class="controls-ComboBox__itemRow js-controls-ComboBox__itemRow">' + title + '</div>';
         }
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
         ComboBox.superclass._keyUpBind.call(this);
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
            filterFieldObj = {};

         filterFieldObj[this._options.displayField] = self._options.text;

         self._dataSource.query(filterFieldObj).addCallback(function (DataSet) {
            var noItems = true;
            DataSet.each(function (item) {
               noItems = false;
               selKey = item.getKey();
               self._options.selectedItem = selKey || null;
               //TODO: переделать на setSelectedItem, чтобы была запись в контекст и валидация если надо. Учесть проблемы с первым выделением
               if (oldKey !== self._options.selectedItem) { // при повторном индексе null не стреляет событием
                  self._notifySelectedItem(self._options.selectedItem);
                  self._drawSelectedItem(self._options.selectedItem);
               }
            });

            if (noItems) {
               self._options.selectedItem = null;
               self._notifySelectedItem(null);
               self._drawSelectedItem(null);
            }

         });


      },

      _clearItems : function() {
         if (this._picker) {
            ComboBox.superclass._clearItems.call(this, this._picker.getContainer());
         }
      },

      _drawItems: function () {
         if (this._picker) {
            ComboBox.superclass._drawItems.call(this);
            this._picker.recalcPosition();
         }
         else {
            this._drawSelectedItem(this._options.selectedItem);
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
      },

      //TODO заглушка
      reviveComponents : function() {
         var def = new $ws.proto.Deferred();
         def.callback();
         return def;
      }
   });

   return ComboBox;
});