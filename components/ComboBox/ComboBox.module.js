define('js!SBIS3.CONTROLS.ComboBox', [
   'js!SBIS3.CONTROLS.TextBox',
   'html!SBIS3.CONTROLS.ComboBox',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.DSMixin',
   'js!SBIS3.CONTROLS.Selectable',
   'js!SBIS3.CONTROLS.DataBindMixin',
   'js!SBIS3.CONTROLS.SearchMixin',
   'html!SBIS3.CONTROLS.ComboBox/resources/ComboBoxArrowDown'
], function (TextBox, dotTplFn, PickerMixin, DSMixin, Selectable, DataBindMixin, SearchMixin, arrowTpl) {
   'use strict';
   /**
    * Выпадающий список с выбором значений из набора.
    * Для работы контрола необходим источник данных, его можно задать либо в опции {@link items}, либо методом {@link setDataSource}.
    * Среди полей источника данных необходимо указать какое является ключевым - {@link keyField}, и из какого поля будем
    * отображать данные в выпадающий блок - {@link displayField}.
    * При отсутствии данных на бизнес-логике будет выведен текст опции {@link emptyHTML}.
    * Контрол по умолчанию позволяет {@link editable вручную вводить значение}.
    * @class SBIS3.CONTROLS.ComboBox
    * @extends SBIS3.CONTROLS.TextBox
    * @control
    * @author Крайнов Дмитрий Олегович
    * @public
    * @control
    * @initial
    * <component data-component='SBIS3.CONTROLS.ComboBox'>
    *     <options name="items" type="array">
    *        <options>
    *            <option name="key">1</option>
    *            <option name="title">Пункт1</option>
    *         </options>
    *         <options>
    *            <option name="key">2</option>
    *            <option name="title">Пункт2</option>
    *         </options>
    *      </options>
    *      <option name="keyField">key</option>
    * </component>
    * @category Inputs
    * @demo SBIS3.CONTROLS.Demo.MyComboBox
    * @demo SBIS3.CONTROLS.Demo.MyComboBoxDS Выпадающий список с dataSource
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.FormWidgetMixin
    * @mixes SBIS3.CONTROLS.DSMixin
    * @mixes SBIS3.CONTROLS.Selectable
    */

   var ComboBox = TextBox.extend([PickerMixin, DSMixin, Selectable, DataBindMixin, SearchMixin], /** @lends SBIS3.CONTROLS.ComboBox.prototype */{
      _dotTplFn: dotTplFn,
      /**
       * @typedef {Object} ItemsComboBox
       * @property {String} title Текст пункта меню.
       * @property {String} key Ключ пункта меню.
       * @translatable title
       */
      /**
       * @cfg {ItemsComboBox[]} Набор исходных данных, по которому строится отображение
       * @name SBIS3.CONTROLS.ComboBox#items
       * @remark
       * !Важно: данные для выпадающего списка можно задать либо в этой опции,
       * либо через источник данных методом {@link setDataSource}.
       * @example
       * <pre class="brush:xml">
       *     <options name="items" type="array">
       *        <options>
       *            <option name="key">1</option>
       *            <option name="title">Пункт1</option>
       *         </options>
       *         <options>
       *            <option name="key">2</option>
       *            <option name="title">Пункт2</option>
       *         </options>
       *      </options>
       *      <!--необходимо указать какое из наших полей является ключевым-->
       *      <option name="keyField">key</option>
       * </pre>
       * @see keyField
       * @see displayField
       * @see setDataSource
       * @see getDataSet
       */

      $protected: {
         //если поменяли текст до того, как были установлены items. То мы не сможем проставить соответсвующий ключ из набора
         //это надо будет сделать после уставноки items, а этот флаг используем для понимания
         _delayedSettingTextByKey: false,
         _keysWeHandle: [$ws._const.key.up, $ws._const.key.down, $ws._const.key.enter],
         _options: {
            searchDelay: 0,
            startCharacter: 1,
            focusOnActivatedOnMobiles: false,
            /**
             * @cfg {String} Шаблон отображения каждого элемента коллекции
             * Шаблон отображения элемента коллекции - это отдельный XHTML-файл.
             * Чтобы его можно было использовать, шаблон подключают в массив зависимостей компонента.
             * Внутри шаблона доступ к полям каждого элемента коллекции можно получить через инструкции шаблонизатора типа {{=it.item.get('ИмяПоля')}}.
             * @example
             * Для отрисовки каждого элемента коллекции используется шаблон:
             * <pre class="brush:html">
             *     <div class="myarea-MyComponent__itemTemplate">
             *       {{=it.item.get('НазваниеДокумента')}}
             *    </div>
             * </pre>
             * Шаблон подключен в массив зависимостей компонента:
             * <pre class="brush: js">
             *    define('js!SBIS3.MyArea.MyComponent',
             *       [
             *          'js!SBIS3.CORE.CompoundControl',
             *          'html!SBIS3.MyArea.MyComponent',
             *          ...
             *          'html!SBIS3.MyArea.MyComponent/itemTemplate'  // подключаем шаблон в массив зависимостей компонента
             *       ],
             *       ...
             *    });
             * </pre>
             * Шаблон указан для опции itemTemplate:
             * <pre class="brush:html">
             *    <component data-component="SBIS3.CONTROLS.ComboBox" name="ComboBox 1" class="control-MyComboBoxDS__position">
             *       ...
             *       <option name="itemTemplate">html!SBIS3.MyArea.MyComponent/itemTemplate</option>
             *    </component>
             * </pre>
             */
            itemTemplate: '',
            afterFieldWrapper: arrowTpl,
            /**
             * @cfg {Boolean} Возможность ручного ввода текста
             * @remark
             * При включённой опции в случае отсутствия среди пунктов выпадающего списка нужного контрол позволяет
             * задать своё значение вводом с клавиатуры.
             * @example
             * <pre class="brush:xml">
             *     <option name="editable">false</option>
             * </pre>
             * @see items
             * @see isEditable
             * @see setEditable
             * @see textTransform
             * @see inputRegExp
             * @see maxLength
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
            /*
               @cfg {Boolean} Автоматически фильтровать пункты выпадающего списка по введеной строке 
            */
            autocomplete: true
         }
      },

      $constructor: function () {
         var self = this;
         self.getContainer().addClass('controls-ComboBox');
         if (!this._options.displayField) {
            //TODO по умолчанию поле title???
            this._options.displayField = 'title';
         }

         this._container.keyup(function(e) {
            e.stopPropagation();
            return false;
         });

         if (this._options.autocomplete){
            this.subscribe('onSearch', this._onSearch);
            this.subscribe('onReset', this._onResetSearch);
         }

         /*обрабочики кликов TODO mouseup!!*/
         this._container.click(function (e) {
            if ($(e.target).hasClass('js-controls-ComboBox__arrowDown') ||
               $(e.target).hasClass('controls-TextBox__afterFieldWrapper') ||
               self.isEditable() === false) {
               if (self.isEnabled()) {
                  self.togglePicker();
               }
            }
         });
         this.reload();
      },

      init : function() {
         ComboBox.superclass.init.apply(this, arguments);
         if (this._options.selectedIndex !== undefined && this._options.selectedIndex !== null) {
            //this._drawSelectedItem(this._options.selectedKey, this._options.selectedIndex);
         } else {
            if (this._options.text) {
               this._setKeyByText();
            }
         }
      },

      _searchFilter: function(model){
         if (model.get(this._options.displayField).match(this.getText())){
            return true;
         }
         return false;
      },

      _onSearch: function(){
         this.setSelectedIndex(-1);
         this._itemsProjection.setFilter(this._searchFilter.bind(this));
         this.redraw();
         this.showPicker();
      },

      _onResetSearch: function(){
         this.setSelectedIndex(-1);
         this._itemsProjection.setFilter(null);
         this.redraw();
      },

      _keyboardHover: function (e) {
         var
            selectedKey = this.getSelectedKey(),
            selectedItem, newSelectedItem, newSelectedItemId;
         if (this._picker) {
            var
               items = $('.controls-ListView__item', this._picker.getContainer().get(0));

            selectedItem = $('.controls-ComboBox__itemRow__selected', this._picker.getContainer());
            //навигация по стрелкам
            if (e.which === $ws._const.key.up) {
               newSelectedItem = selectedKey ? selectedItem.prev('.controls-ListView__item') : items.eq(0);
            } else if (e.which === $ws._const.key.down) {
               newSelectedItem = selectedKey ? selectedItem.next('.controls-ListView__item') : items.eq(0);
            }
            if (newSelectedItem && newSelectedItem.length) {
               newSelectedItemId = newSelectedItem.data('id');
               this.setSelectedKey(newSelectedItemId);
               this._scrollToItem(newSelectedItemId);
               this.setActive(true); // После подскролливания возвращаем фокус в контейнер компонента
            }
         }
         else {
            if (this._dataSet) {
               var num = null, i = 0, nextRec, prevRec;
               if (this._dataSet.getCount()) {
                  if (selectedKey) {
                     this._dataSet.each(function (rec) {
                        if (rec.getKey() == selectedKey) {
                           num = i;
                        }
                        i++;
                     });
                     if (num !== null) {
                        if (num == 0) {
                           nextRec = this._dataSet.at(num + 1);
                           prevRec = this._dataSet.at(0)
                        }
                        else if (num == this._dataSet.getCount() - 1) {
                           nextRec = this._dataSet.at(this._dataSet.getCount() - 1);
                           prevRec = this._dataSet.at(num - 1)
                        }
                        else {
                           nextRec = this._dataSet.at(num + 1);
                           prevRec = this._dataSet.at(num - 1)
                        }
                     }
                  }
                  else {
                     prevRec = this._dataSet.at(0);
                     nextRec = this._dataSet.at(0);
                  }
                  if (e.which === $ws._const.key.up) {
                     this.setSelectedKey(prevRec.getKey());
                  } else if (e.which === $ws._const.key.down) {
                     this.setSelectedKey(nextRec.getKey());
                  }
               }
            }
         }


         if (e.which === $ws._const.key.enter) {
            this.hidePicker()
         }


         return false;
      },

      setText: function (text) {
         ComboBox.superclass.setText.call(this, text);
         this._drawNotEditablePlaceholder(text);
         $('.js-controls-ComboBox__fieldNotEditable', this._container.get(0)).text(text || this._options.placeholder);
         this._setKeyByText();
      },

      _drawNotEditablePlaceholder: function (text) {
         $('.js-controls-ComboBox__fieldNotEditable', this._container.get(0)).toggleClass('controls-ComboBox__fieldNotEditable__placeholder', !text);
      },

      _drawSelectedItem: function (key, index) {

         var item, def;
         def = new $ws.proto.Deferred();
         if (this._dataSet) {
            if ((index !== null) && (typeof index != 'undefined') && (index != '-1')) {
               item = this._itemsProjection.at(index).getContents();
               def.callback(item);
            }
         }
         else {
            if (this._dataSource) {
               if ((key != undefined) && (key !== null)) {
                  this._dataSource.read(key).addCallback(function (item) {
                     def.callback(item);
                  });
               }
            }
         }
         if (this._picker) {
            $('.controls-ComboBox__itemRow__selected', this._picker.getContainer().get(0)).removeClass('controls-ComboBox__itemRow__selected');
         }
         var self = this;
         def.addCallback(function (item) {
            if (item) {
               var newText = item.get(self._options.displayField);
               if (newText != self._options.text) {
                  ComboBox.superclass.setText.call(self, newText);
                  self._drawNotEditablePlaceholder(newText);
                  $('.js-controls-ComboBox__fieldNotEditable', self._container.get(0)).text(newText);
               }
            }
            else {
               ComboBox.superclass.setText.call(self, '');
               self._drawNotEditablePlaceholder('');
               $('.js-controls-ComboBox__fieldNotEditable', self._container.get(0)).text('');
            }
            if (self._picker) {
               $('.controls-ComboBox__itemRow__selected', self._picker.getContainer().get(0)).removeClass('controls-ComboBox__itemRow__selected');
               $('.controls-ComboBox__itemRow[data-id=\'' + key + '\']', self._picker.getContainer().get(0)).addClass('controls-ComboBox__itemRow__selected');
            }
         });




      },

      _addItemAttributes : function(container, item) {
         ComboBox.superclass._addItemAttributes.call(this, container, item);
         container.addClass('controls-ComboBox__itemRow').addClass('js-controls-ComboBox__itemRow');
      },

      _setPickerContent: function () {
         var self = this;
         this._picker.getContainer().mousedown(function (e) {
            e.stopPropagation();
         });
         //TODO нужно ли здесь звать redraw? Сейчас без этого не работает.
         this.redraw();
         //Подписка на клик по элементу комбобокса
         //TODO mouseup из за того что контрол херит событие клик
         this._picker.getContainer().mouseup(function (e) {
            var row = $(e.target).closest('.js-controls-ComboBox__itemRow');
            if (row.length) {
               var strKey = $(row).attr('data-id');
               if (strKey == 'null') {
                  strKey = null;
               }
               if (this._options.autocomplete){
                  self._itemsProjection.setFilter(null);
                  self.redraw();
               }
               self.setSelectedKey(strKey);
               self.hidePicker();
            }
            e.stopPropagation();
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
         if (this._picker){
         	return this._picker.getContainer();
         } else {
         	return null;
         }
      },

      _getItemTemplate: function (item) {
         var title = item.get(this._options.displayField);
         if (this._options.itemTemplate) {
            return doT.template(this._options.itemTemplate)({item : item, displayField : title})
         }
         else {
            return '<div>' + title + '</div>';
         }
      },

      _keyDownBind: function (e) {
         //TODO: так как нет итератора заккоментим
         /*описываем здесь поведение стрелок вверх и вниз*/
         /*
          var self = this,
          current = self.getSelectedKey();
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
          self.setSelectedKey(this._items.getKey(newItem));
          }
          if (e.which == 13) {
          this.hidePicker();
          }
          */      },


      _keyUpBind: function (e) {
         /*по изменению текста делаем то же что и в текстбоксе*/
         ComboBox.superclass._keyUpBind.apply(this, arguments);
         /*не делаем смену значения при нажатии на стрелки вверх вниз. Иначе событие смены ключа срабатывает два раза*/
         if ((e.which != 40) && (e.which != 38)) {
            this._setKeyByText();
         }
      },

      _setKeyByText: function () {
         /*устанавливаем ключ, когда текст изменен извне*/
         var
            selKey,
            oldKey = this._options.selectedKey,
            self = this,
            filterFieldObj = {};

         if (this._dataSource) {
            filterFieldObj[this._options.displayField] = self._options.text;

            self._callQuery(filterFieldObj).addCallback(function (DataSet) {
               var noItems = true;
               DataSet.each(function (item) {
                  noItems = false;
                  selKey = item.getKey();
                  self._options.selectedKey = (selKey !== null && selKey !== undefined && selKey == selKey) ? selKey : null;
                  //TODO: переделать на setSelectedItem, чтобы была запись в контекст и валидация если надо. Учесть проблемы с первым выделением
                  if (oldKey !== self._options.selectedKey) { // при повторном индексе null не стреляет событием
                     self._notifySelectedItem(self._options.selectedKey);
                     self._drawSelectedItem(self._options.selectedKey);
                  }
               });

               if (noItems) {
                  self._options.selectedKey = null;
                  if (oldKey !== self._options.selectedKey) {
                     self._notifySelectedItem(null);
                     self._drawSelectedItem(null);
                  }
               }
            });
         }
         else {
            this._delayedSettingTextByKey = true;
         }
      },

      _dataLoadedCallback: function() {
         if (this._delayedSettingTextByKey) {
            this._setKeyByText();
         }
      },

      _clearItems : function(container) {
         if (this._picker) {
            ComboBox.superclass._clearItems.call(this, container);
         }
      },

      _redraw: function () {
         if (this._picker) {
            ComboBox.superclass._redraw.call(this);
            this._picker.recalcPosition();
         }
         else {
            this._drawSelectedItem(this._options.selectedKey, this._options.selectedIndex);
         }
      },
      /**
       * Метод установки/изменения возможности ручного ввода.
       * @remark
       * Возможные значения:
       * <ul>
       *    <li>true - в случае отсутствия среди имеющихся пунктов нужного можнно ввести значение с клавиатуры;</li>
       *    <li>false - значение можно задать только выбором из списка существующих.</li>
       * </ul>
       * @param {Boolean} editable Возможность ручного ввода.
       * @example
       * <pre>
       *     myComboBox.setEditable(false);
       * </pre>
       * @see isEditable
       * @see editable
       */
      setEditable: function (editable) {
         this._options.editable = editable;
         this._container.toggleClass('controls-ComboBox__editable-false', editable === false);
      },
      /**
       * Признак возможности ручного ввода.
       * @remark
       * Возможные значения:
       * <ul>
       *    <li>true - в случае отсутствия среди имеющихся пунктов нужного можнно ввести значение с клавиатуры;</li>
       *    <li>false - значение можно задать только выбором из списка существующих.</li>
       * </ul>
       * @returns {Boolean} Возможен ли ручной ввод.
       * @example
       * <pre>
       *     myComboBox.isEditable();
       * </pre>
       * @see editable
       * @see setEditable
       */
      isEditable: function () {
         return this._options.editable;
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

      showPicker: function(){
         ComboBox.superclass.showPicker.call(this);
         this._setWidth();
         //После отображения пикера подскроливаем до выбранного элемента
         this._scrollToItem(this.getSelectedKey());
      },

      _initializePicker: function(){
         ComboBox.superclass._initializePicker.call(this);
         this._setWidth();
      },

      _setWidth: function(){
         var self = this;
         if (self._picker._options.target){
            this._picker.getContainer().css({
               'min-width': self._picker._options.target.outerWidth() - this._border/*ширина бордеров*/
            });
         }
      },

      //TODO заглушка
      /**
       * @noShow
       * @returns {$ws.proto.Deferred}
       */
      reviveComponents : function() {
         var def = new $ws.proto.Deferred();
         def.callback();
         return def;
      }
   });

   return ComboBox;
});
