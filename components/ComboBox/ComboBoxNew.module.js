define('js!SBIS3.CONTROLS.ComboBoxNew', [
   'js!SBIS3.CONTROLS.TextBox',
   'html!SBIS3.CONTROLS.ComboBox',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.CollectionControlMixin',
   'js!SBIS3.CONTROLS.ListControlMixin',
   'js!SBIS3.CONTROLS.SelectableNew',
   'js!SBIS3.CONTROLS.DataBindMixin',
   'js!SBIS3.CONTROLS.Data.Utils',
   'js!SBIS3.CONTROLS.ComboBoxView',
   'js!SBIS3.CONTROLS.Data.Projection.Collection',
   'html!SBIS3.CONTROLS.ComboBox/resources/ComboBoxArrowDown'
], function (TextBox, dotTplFn, PickerMixin, CollectionControlMixin, ListControlMixin, Selectable, DataBindMixin, Utils, ComboBoxView,CollectionProjection, arrowTpl) {
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
    * @mixes SBIS3.CONTROLS.CollectionControlMixin
    * @mixes SBIS3.CONTROLS.ListControlMixin
    * @mixes SBIS3.CONTROLS.SelectableNew
    */

   var ComboBox = TextBox.extend([PickerMixin, CollectionControlMixin, ListControlMixin, Selectable, DataBindMixin], /** @lends SBIS3.CONTROLS.ComboBox.prototype */{
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
         _viewConstructor:ComboBoxView
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
         if (typeof key == 'undefined' || key === null){
            /*TODO следующая строчка должна быть в Selector*/
            this._options.selectedKey = null;
            if (this._options.text) {
               this._setKeyByText();
            }
         }
         this.subscribe('onItemAction',function(e,item,index){
            this.hidePicker();
         });
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

      _keyboardHover: function (e) {
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

      setText: function(text) {
         ComboBox.superclass.setText.call(this, text);
         this._drawNotEditablePlaceholder(text);
         $('.js-controls-ComboBox__fieldNotEditable', this._container.get(0)).text(text || this._options.placeholder);
         this._setKeyByText();
      },

      _drawNotEditablePlaceholder: function (text) {
         $('.js-controls-ComboBox__fieldNotEditable', this._container.get(0)).toggleClass('controls-ComboBox__fieldNotEditable__placeholder', !text);
      },

      _getItemTemplate: function() {
         return (function(item) {
            var title= Utils.getItemPropertyValue(item,this._options.displayField);
            if(this._options.itemTemplate) {
               return doT.template(this._options.itemTemplate)({
                  item:item,
                  displayField:title
               })
            }
            else{
               return '<div>'+title+'</div>';
            }
         }).bind(this);
      },
      _drawSelectedItem: function() {
         var index = this._getItemIndexByKey(this._options.selectedKey),
            item =  this.getItems().at(index);
         if (item) {
            var newText = Utils.getItemPropertyValue(item, this._options.displayField);
            if (newText != this._options.text) {
               ComboBox.superclass.setText.call(this, newText);
               $('.js-controls-ComboBox__fieldNotEditable', this._container.get(0)).text(newText);
               this._drawNotEditablePlaceholder(newText);
            }
         } else  {
            ComboBox.superclass.setText.call(this,this._options.text);
            this._drawNotEditablePlaceholder(this._options.text);
            $('.js-controls-ComboBox__fieldNotEditable',this._container.get(0)).text(this._options.text);
         }
      },

      _drawItemsCallback: function() {
         this._drawSelectedItem();
      },

      _addItemAttributes: function(container, item) {
         ComboBox.superclass._addItemAttributes.call(this, container, item);
         container.addClass('controls-ComboBox__itemRow').addClass('');
      },

      //TODO от этого надо избавиться. Пользуется Саня Кузьмин
      _notifySelectedItem: function(key) {
         var text = this.getText();
         this._notify('onSelectedItemChange', key, text);
         this._notifyOnPropertyChanged('selectedItem');
      },
      _notifyOnPropertyChanged:function() {

      },
      _setPickerContent: function() {
         if (!this.view) {
            this._initView();
         }
         //TODO: кажется неочевидное место, возможно как то автоматизировать
         this._picker.getContainer().addClass('controls-ComboBox__picker');
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

      _getViewNode: function() {
         if(this._picker)
            return this._picker.getContainer();
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
         */
      },

      _keyUpBind: function (e) {
         /*по изменению текста делаем то же что и в текстбоксе*/
         /*не делаем смену значения при нажатии на стрелки вверх вниз. Иначе событие смены ключа срабатывает два раза*/
         if(this.isEditable()){
            var key=$ws._const.key;
            if(Array.indexOf([key.up,key.down,key.enter],e.which)=== -1){
               ComboBox.superclass._keyUpBind.call(this);
            }
         }
      },

      _setKeyByText: function() {
         /*устанавливаем ключ, когда текст изменен извне*/
         var
            selKey,
            displayField = this._options.displayField,
            keyField = this._options.keyField,
            oldKey = this._options.selectedKey,
            text = this._options.text;

         var collection = this.getItemsProjection().getCollection(),
            foundItem = null;
         collection.each(function(item,index) {
            var title = Utils.getItemPropertyValue(item,displayField) ;
            if(title == text){
               selKey = Utils.getItemPropertyValue(item,keyField);
               foundItem = item
            }
         });
         if(foundItem) {
            this.setSelectedKey(selKey);
         } else {
            this.setSelectedKey()
         }

      },

      _clearItems : function() {
         if (this._picker) {
            ComboBox.superclass._clearItems.call(this, this._picker.getContainer());
         }
      },

      _redraw: function() {
         if (this._picker) {
            ComboBox.superclass._redraw.call(this);
            this._picker.recalcPosition();
         }
         else {
            this._drawSelectedItem();
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
      setEditable: function(editable) {
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
      isEditable: function() {
         return this._options.editable;
      },

      _setEnabled: function(enabled) {
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

      showPicker: function() {
        ComboBox.superclass.showPicker.call(this);
        this._setWidth();
      },

      _initializePicker: function() {
        ComboBox.superclass._initializePicker.call(this);
        this._setWidth();
      },

      _setWidth: function(){
         var self = this;
         if (self._picker._options.target) {
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
      }
   });

   return ComboBox;
});