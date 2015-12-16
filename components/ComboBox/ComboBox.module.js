/*global define, $, doT, $ws*/
define('js!SBIS3.CONTROLS.ComboBox', [
   'js!SBIS3.CONTROLS.TextBox',
   'html!SBIS3.CONTROLS.ComboBox',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.ListControlMixin',
   'js!SBIS3.CONTROLS.SelectableNew',
   'js!SBIS3.CONTROLS.DataBindMixin',
   'js!SBIS3.CONTROLS.Data.Utils',
   'js!SBIS3.CONTROLS.ComboBoxNewListView',
   'js!SBIS3.CONTROLS.Data.Projection.Collection',
   'html!SBIS3.CONTROLS.ComboBox/resources/ComboBoxArrowDown',
   'js!SBIS3.CONTROLS.DisplayFieldMixin'
], function (TextBox, dotTplFn, PickerMixin, ListControlMixin, Selectable, DataBindMixin, Utils, ComboBoxListView, CollectionProjection, arrowTpl, DisplayFieldMixin) {
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
    * @author Крайнов Дмитрий Олегович
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
    * @mixes SBIS3.CONTROLS.ListControlMixin
    * @mixes SBIS3.CONTROLS.SelectableNew
    */

   var ComboBox = TextBox.extend([PickerMixin, ListControlMixin, Selectable, DataBindMixin, DisplayFieldMixin ], /** @lends SBIS3.CONTROLS.ComboBoxNew.prototype */{
      _dotTplFn: dotTplFn,
      /**
       * @typedef {Object} ItemsComboBox
       * @property {String} title Текст пункта меню.
       * @property {String} key Ключ пункта меню.
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
         _keysWeHandle: [$ws._const.key.up, $ws._const.key.down, $ws._const.key.enter],
         _options: {
            /**
             * @cfg {String} Шаблон отображения каждого элемента коллекции
             * @example
             * <pre class="brush:xml">
             *     <option name="itemTemplate">
             *         <div data-key="{{=it.item.getKey()}}" class="controls-ComboBox__itemRow js-controls-ComboBox__itemRow">
             *             <div class="genie-colorComboBox__itemTitle">
             *                 {{=it.displayField}}
             *             </div>
             *         </div>
             *     </option>
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
            valueFormat: ''
         },
         _viewConstructor: ComboBoxListView,
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
         var key = this._options.selectedKey;
         if (typeof key === 'undefined' || key === null){
            /*TODO следующая строчка должна быть в Selector*/
            this._options.selectedKey = null;
            if (this._options.text) {
               this._setKeyByText();
            }
         }

         /*обрабочики кликов TODO mouseup!!*/
         this._container.mouseup(function (e) {
            if ($(e.target).hasClass('js-controls-ComboBox__arrowDown') ||
                  $(e.target).hasClass('controls-TextBox__afterFieldWrapper')) {
               if (self.isEnabled()) {
                  self.togglePicker();
               }
            }
         });
      },
      init: function() {
         this._drawSelectedItem();
         ComboBox.superclass.init.call(this);
      },

      _initView: function() {
         ComboBox.superclass._initView.call(this);
         this.subscribeTo(this._view, 'onItemClicked', this.hidePicker.bind(this));
      },

      _keyboardHover: function(e) {
         var
            projection = this.getItemsProjection();
         //навигация по стрелкам
         if (e.which === $ws._const.key.up) {
            projection.moveToPrevious();
         } else if (e.which === $ws._const.key.down) {
            projection.moveToNext();
         } else if (e.which === $ws._const.key.enter){
            this.hidePicker();
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

      _drawSelectedItem: function (key) {
         var item = this.getItemsProjection().getCurrent();
         if(item) {
            item = item.getContents();
            var newText = this._getItemValue(item, this._options.displayField);
            if(newText !== this._options.text) {
               this.setText(newText);
            }
         }
         else {
            this.setText(this._options.text);
         }

      },

      _drawItemsCallback : function() {
         this._drawSelectedItem(this._options.selectedKey);
      },

      _addItemAttributes: function(container, item) {
         ComboBox.superclass._addItemAttributes.call(this, container, item);
         container.addClass('controls-ComboBox__itemRow').addClass('js-controls-ComboBox__itemRow');
      },

      //TODO от этого надо избавиться. Пользуется Саня Кузьмин
      _notifySelectedItem: function () {
         var text = this.getText();
         this._notify('onSelectedItemChange', this._options.selectedKey, text);
         this._notifyOnPropertyChanged('selectedItem');
      },

      _setPickerContent: function() {
         this._getListView().addPickerClass();
      },

      _setPickerConfig: function() {
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

      _getItemTemplate: function() {
         return (function(item) {
            var title= this._getItemValue(item.item, this._options.displayField);
            if(this._options.itemTemplate) {
               return doT.template(this._options.itemTemplate)({
                  item:item,
                  displayField:title
               });
            }
            else {
               return title;
            }
         }).bind(this);
      },

      _keyDownBind: function(e) {
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
            displayField = this._options.displayField,
            keyField = this._options.keyField,
            text = this._options.text,
            collection = this.getItems(),
            foundItem = null,
            self = this;
         collection.each(function(item, index) {
            var title = self._getItemValue(item, displayField) ;
            if (title === text) {
               selKey = self._getItemValue(item, keyField);
               foundItem = item;
            }
         });
         if (foundItem) {
            this.setSelectedKey(selKey);
         }

      },

      _clearItems : function() {
         if (this._picker) {
            ComboBox.superclass._clearItems.call(this, this._picker.getContainer());
         }
      },

      _redraw: function () {
         if (this._picker) {
            ComboBox.superclass._redraw.call(this);
            this._picker.recalcPosition();
         }
         else {
            this._drawSelectedItem(this._options.selectedKey);
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
      reviveComponents: function() {
         var def = new $ws.proto.Deferred();
         def.callback();
         return def;
      },

      _getListView: function(){
         if (!this._view)
            this._initView();

         return this._getView();
      },
      _getViewNode: function() {
         /*устаналивает rootnode для listView*/
         return this._picker.getContainer();
      },

   });

   return ComboBox;
});