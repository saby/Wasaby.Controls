define('SBIS3.CONTROLS/ComboBox', [
   "Core/constants",
   "Core/Deferred",
   'Core/IoC',
   'Core/detection',
   'Lib/LayoutManager/LayoutManager',
   'SBIS3.CONTROLS/TextBox',
   'SBIS3.CONTROLS/TextBox/resources/TextBoxUtils',
   "tmpl!SBIS3.CONTROLS/ComboBox/resources/textFieldWrapper",
   "tmpl!SBIS3.CONTROLS/ComboBox/resources/ComboBoxPicker",
   "SBIS3.CONTROLS/Mixins/PickerMixin",
   "SBIS3.CONTROLS/Mixins/ItemsControlMixin",
   "WS.Data/Collection/RecordSet",
   "WS.Data/Display/Display",
   "SBIS3.CONTROLS/Mixins/Selectable",
   "SBIS3.CONTROLS/Mixins/DataBindMixin",
   "SBIS3.CONTROLS/Mixins/SearchMixin",
   'SBIS3.CONTROLS/Utils/TitleUtil',
   "tmpl!SBIS3.CONTROLS/ComboBox/resources/ComboBoxArrowDown",
   "tmpl!SBIS3.CONTROLS/ComboBox/resources/ItemTemplate",
   "tmpl!SBIS3.CONTROLS/ComboBox/resources/ItemContentTemplate",
   "Core/core-instance",
   "SBIS3.CONTROLS/ScrollContainer",
   "i18n!SBIS3.CONTROLS.СomboBox",
   'css!SBIS3.CONTROLS/ComboBox/ComboBox'
], function ( constants, Deferred, IoC, detection, LayoutManager, TextBox, TextBoxUtils, textFieldWrapper, dotTplFnPicker, PickerMixin, ItemsControlMixin, RecordSet, Projection, Selectable, DataBindMixin, SearchMixin, TitleUtil, arrowTpl, ItemTemplate, ItemContentTemplate, cInstance) {
   'use strict';
   /**
    * Класс контрола "Комбинированный выпадающий список" с возможностью ввода значения с клавиатуры.
    * <br/>
    * Особенности работы с контролом:
    * <ul>
    *    <li>Для работы контрола необходим источник данных, его можно задать либо в опции {@link items}, либо методом {@link setDataSource}.</li>
    *    <li>Среди полей источника данных необходимо указать какое является ключевым - {@link idProperty}, и из какого поля будем отображать данные в выпадающий блок - {@link displayProperty}.</li>
    *    <li>При отсутствии данных будет выведен текст опции {@link emptyHTML}.</li>
    *    <li>Контрол по умолчанию позволяет {@link editable вручную вводить значение}.</li>
    *    <li>По стандарту максимальная высота выпадающего списка 400px. В некоторых случаях может возникнуть необходимость её изменить.
    *        Для этого в опции {@link pickerClassName} нужно указать свой класс someClass и в css указать селектор .someClass.controls-ComboBox__picker .controls-ComboBox__scrollContainer, установив свойство max-height в нужное значение</li>
    * </ul>
    * <br/>
    * Вы можете связать опцию items с полем контекста, в котором хранятся данные с типом значения перечисляемое - {@link WS.Data/Type/Enum}. Если эти данные хранят состояние выбранного значения, то в контрол будет установлено выбранное значение.
    *
    * @class SBIS3.CONTROLS/ComboBox
    * @extends SBIS3.CONTROLS/TextBox
    *
    * @author Красильников А.С.
    *
    * @demo Examples/ComboBox/MyComboBox/MyComboBox Пример 1. Выпадающий список, для которого установлен набора данных в опции items.
    * @demo Examples/ComboBox/MyComboBoxDS/MyComboBoxDS Пример 2. Выпадающий список, для которого установлен источник данных в опции dataSource.
    *
    * @mixes SBIS3.CONTROLS/Mixins/PickerMixin
    * @mixes SBIS3.CONTROLS/Mixins/ItemsControlMixin
    * @mixes SBIS3.CONTROLS/Mixins/Selectable
    * @mixes SBIS3.CONTROLS/Mixins/DataBindMixin
    * @mixes SBIS3.CONTROLS/Mixins/SearchMixin
    * @mixes SBIS3.CONTROLS/ComboBoxDocs
    * @public
    * @control
    * @category Input
    * @initial
    * <component data-component='SBIS3.CONTROLS/ComboBox'>
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
    *      <option name="idProperty">key</option>
    * </component>
    */

   function getRecordsForRedrawCB(projection, cfg){
      var itemsProjection;

      itemsProjection = cfg._getRecordsForRedrawSt.apply(this, arguments);
      if (cfg.emptyValue){
         itemsProjection.unshift(cfg._emptyRecordProjection);
      }
      return itemsProjection;
   }

   function checkDisplayProperty(cfg) {
      if (!cfg.displayProperty && cfg._items && !cInstance.instanceOfModule(cfg._items, 'WS.Data/Type/Enum')) {
         IoC.resolve('ILogger').error('SBIS3.CONTROLS/ComboBox', 'Не задана опция displayProperty');
         cfg.displayProperty = 'title';
      }
   }

   function prepareItemClassesByConfig(item, className) {
      var oldClassName = item.className || item.get && item.get('className') || className || '';

      return ~oldClassName.indexOf('controls-ComboBox__multiline') ? 'controls-ComboBox__item_multiLine' : 'controls-ComboBox__item_singleLine';
   }

   var ComboBox = TextBox.extend([PickerMixin, ItemsControlMixin, Selectable, DataBindMixin, SearchMixin], /** @lends SBIS3.CONTROLS/ComboBox.prototype */{
      _dotTplFnPicker: dotTplFnPicker,
      /**
       * @typedef {Object} ItemsComboBox
       * @property {String} title Текст пункта меню.
       * @property {String} key Ключ пункта меню.
       * @translatable title
       */
      /**
       * @cfg {ItemsComboBox[]} Набор исходных данных, по которому строится отображение
       * @name SBIS3.CONTROLS/ComboBox#items
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
       *      <option name="idProperty">key</option>
       * </pre>
       * @see idProperty
       * @see displayProperty
       * @see setDataSource
       * @see getDataSet
       */

      $protected: {
         //Проблема уйдёт после решения задачи https://inside.tensor.ru/opendoc.html?guid=eae86be7-2eed-4ff7-bd43-feae7b4b5b35&des=
         _checkClickByTap: true,
         //если поменяли текст до того, как были установлены items. То мы не сможем проставить соответсвующий ключ из набора
         //это надо будет сделать после уставноки items, а этот флаг используем для понимания
         _delayedSettingTextByKey: false,
         //В зависимости от этого флага по разному будет работать отрисовка выделенного
         //если он true, то при условии ключа null текст будет оцищаться
         //нельзя всегда очищать текст, потому что при ручном вводе текста, даже при пустом ключе текст стирать не надо
         _isClearing: false,
         _options: {
            textFieldWrapper: textFieldWrapper,
            _emptyRecordProjection: undefined,
            _getRecordsForRedraw: getRecordsForRedrawCB,
            _defaultItemTemplate: ItemTemplate,
            _defaultItemContentTemplate: ItemContentTemplate,
            searchDelay: 0,
            startCharacter: 1,
            focusOnActivatedOnMobiles: false,
            /**
             * @cfg {String} Шаблон отображения каждого элемента коллекции
             * @example
             * <pre class="brush:xml">
             *     <option name="itemTemplate">
             *         <div data-key="{{=it.item.getId()}}" class="controls-ComboBox__item js-controls-ComboBox__item">
             *             <div class="genie-colorComboBox__itemTitle">
             *                 {{=it.displayProperty}}
             *             </div>
             *         </div>
             *     </option>
             * </pre>
             * @deprecated Используйте опцию {@link SBIS3.CONTROLS/Mixins/ItemsControlMixin#itemTpl}.
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
             * @cfg {Boolean} Добавляет в выпадающий список новый пункт "Не выбрано".
             * @remark
             * Благодаря данной опции контрол можно перевести в такой режим работы, при котором в выпадающем списке будет присутствовать пункт "Не выбрано".
             * ![](/empty-value-1.png)
             * При выборе этого пункта сбрасывается ранее установленное значение. Также говорят, что устанавливается пустое значение.
             * Опцию корректно использовать только с {@link allowEmptySelection} = "{{true}}".
             * Чтобы установить текст, отображаемый в поле ввода после выбора пустого значения, определите значение в опции {@link placeholder}.
             * @see allowEmptySelection
             */
            emptyValue: false,
            /**
             * @cfg {String} Форматирование значений в списке
             * @noShow
             */
            valueFormat: '',
            /**
             @cfg {Boolean} Автоматически фильтровать пункты выпадающего списка по введеной строке
             */
            autocomplete: false
         }
      },

      $constructor: function () {
         var self = this;

         //Дикий костыль в TextBoxBase: задан большой набор значений в _keysWeHandle, чтобы
         //нажатия по этим клавишам не долетали до ListView и его наследников, т.к. нажатие этих клавиш там обрабатывается.
         //Чтобы сохранить те клавиши, которые уже описаны в TextBoxBase и добавить свои в наследнике - приходится напрямую
         //записывать их в объект.
         this._keysWeHandle[constants.key.up] = 100;
         this._keysWeHandle[constants.key.down] = 101;
         this._keysWeHandle[constants.key.enter] = 102;
         this._keysWeHandle[constants.key.esc] = 103;


         if (this._options.autocomplete){
            this.subscribe('onSearch', this._onSearch);
            this.subscribe('onReset', this._onResetSearch);
         }

         this._container.click(function (e) {
            var target = $(e.target),
               isArrow = target.hasClass('js-controls-ComboBox__arrowDown');
            if (isArrow || ( target[0] === $('.controls-ComboBox__Arrow', self.getContainer())[0] ) || self.isEditable() === false) {
               if (self.isEnabled() && self._getItemsProjection()) {//открывать, если нет данных, нет смысла
                  self.togglePicker();
                  // Что бы не открывалась клавиатура на айпаде при клике на стрелку
                  if (isArrow || !self.isEditable()) {
                     e.preventDefault();
                  }
               }
            }
         });
      },

      _modifyOptions: function(){
         var cfg = ComboBox.superclass._modifyOptions.apply(this, arguments);

         checkDisplayProperty(cfg);

         if (cfg.emptyValue){
            var rawData = {},
               emptyItemProjection,
               rs;
            rawData[cfg.idProperty] = null;
            rawData[cfg.displayProperty] = rk('Не выбрано');
            rawData.isEmptyValue = true;

            rs = new RecordSet({
               rawData: [rawData],
               idProperty: cfg.idProperty
            });

            emptyItemProjection = Projection.getDefaultDisplay(rs).at(0);
            cfg._emptyRecordProjection = emptyItemProjection;
         }
         cfg.cssClassName += ' controls-ComboBox';
         if (!cfg.editable) {
            cfg.cssClassName += ' controls-ComboBox__editable-false';
         }
         if (!cfg.selectedKey) { //todo: ьожет это ндао в условие уровнем повыше
            cfg.cssClassName += ' controls-ComboBox__emptyValue';
         }

         if (cfg.selectedKey && cfg._items) {
            var selectedItem = cInstance.instanceOfModule(cfg._items, 'WS.Data/Type/Enum') ? cfg._items.get() : cfg._items.getRecordById(cfg.selectedKey);
            if (selectedItem) {
               cfg.text = cfg._propertyValueGetter(selectedItem, cfg.displayProperty) || '';
            }
         }
         return cfg;
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

         if (!this._options.editable) {
            this._destroyCompatPlaceholder();
         }
      },

      _searchFilter: function(text, model){
         //TODO: Обобщить поиск с автодополнением и строкой поиска
         //Сделать общую точку входа для поиска, для понимания где искать на источнике или на проекции
         var itemText = model.get(this._options.displayProperty).toLowerCase();
         return itemText.indexOf(text) > -1;
      },

      _onSearch: function(){
         this.setSelectedIndex(-1);
         this._getItemsProjection().setFilter(this._searchFilter.bind(this, this.getText().toLowerCase()));
         this.redraw();
         if (this._getItemsProjection().getCount()) {
            if (!this.getPicker().isVisible()) {
               this.showPicker();
            }
         }
         else {
            this.hidePicker();
         }
         this._setKeyByText();
      },

      _onResetSearch: function(){
         this.setSelectedIndex(-1);
         this._getItemsProjection().setFilter(null);
         this._setKeyByText();
         if (this._picker) {
            this._picker.recalcPosition(true, true);
            TextBoxUtils.setEqualPickerWidth(this._picker);
         }
      },

      _keyboardHover: function (e) {
         var
            selectedKey = this.getSelectedKey(),
            selectedItem, newSelectedItem, newSelectedItemHash;

         if (e.which !== constants.key.up && e.which !== constants.key.down && e.which !== constants.key.enter && e.which !== constants.key.esc) {
            return ComboBox.superclass._keyboardHover.apply(this, arguments);
         }

         // горячая комбинация клавиш
         if(e.ctrlKey && e.which === constants.key.enter) {
            return true;
         }

         if (this._picker) {
            if(!this._picker.isVisible() && e.which === constants.key.esc ){
               return true;
            }

            var
               items = $('.controls-ListView__item', this._picker.getContainer().get(0));

            selectedItem = $('.controls-ComboBox__item_selected', this._picker.getContainer());
            //навигация по стрелкам
            if (e.which === constants.key.up) {
               newSelectedItem = selectedItem.length ? selectedItem.prev('.controls-ListView__item') : items.eq(0);
            } else if (e.which === constants.key.down) {
               newSelectedItem = selectedItem.length ? selectedItem.next('.controls-ListView__item') : items.eq(0);
            }
            if (newSelectedItem && newSelectedItem.length) {
               //Устанавливаем новую запись. через проекцию, т.к. может быть enum
               newSelectedItemHash = newSelectedItem.data('hash');
               var projItem = this._getItemsProjection().getByHash(newSelectedItemHash);
               if (!projItem && this._options.emptyValue){
                  this._drawSelectedEmptyRecord();
               }
               else {
                  this.setSelectedIndex(this._getItemsProjection().getIndex(projItem));
               }
               this._scrollToItem(newSelectedItemHash);
               this.setActive(true); // После подскролливания возвращаем фокус в контейнер компонента
            }
         }
         else {
            if (this.getItems()) {
               var num = null, i = 0, nextRec, prevRec;
               if (this.getItems().getCount()) {
                  if (selectedKey) {
                     this.getItems().each(function (rec) {
                        if (rec.getId() == selectedKey) {
                           num = i;
                        }
                        i++;
                     });
                     if (num !== null) {
                        if (num == 0) {
                           nextRec = this.getItems().at(num + 1);
                           prevRec = this.getItems().at(0)
                        }
                        else if (num == this.getItems().getCount() - 1) {
                           nextRec = this.getItems().at(this.getItems().getCount() - 1);
                           prevRec = this.getItems().at(num - 1)
                        }
                        else {
                           nextRec = this.getItems().at(num + 1);
                           prevRec = this.getItems().at(num - 1)
                        }
                     }
                  }
                  else {
                     prevRec = this.getItems().at(0);
                     nextRec = this.getItems().at(0);
                  }
                  if (e.which === constants.key.up) {
                     this.setSelectedKey(prevRec.getId());
                  } else if (e.which === constants.key.down) {
                     this.setSelectedKey(nextRec.getId());
                  }
                  else if (e.which === constants.key.esc) {
                     return true;//Если пикера не было и нажали esc - combobox делать ничего не нужно, пробрасывает событие выше
                  }
               }
            }
         }

         if (e.which === constants.key.enter || e.which === constants.key.esc) {
            this.hidePicker()
         }

         return false;
      },

      _drawText: function(text) {
         ComboBox.superclass._drawText.apply(this, arguments);
         var fieldNotEditableContainer = $('.js-controls-ComboBox__fieldNotEditable', this._container.get(0));
         this._drawNotEditablePlaceholder(text);
         fieldNotEditableContainer.text(text || this._options.placeholder || '');
         if (this._options.editable) {
            this._setKeyByText();
         }
      },

      _drawNotEditablePlaceholder: function (text) {
         $('.js-controls-ComboBox__fieldNotEditable', this._container.get(0)).toggleClass('controls-ComboBox__fieldNotEditable__placeholder', !text);
      },

      _getFieldForTooltip: function () {
        if (this.isEditable()) {
           return ComboBox.superclass._getFieldForTooltip.apply(this, arguments);
        } else {
           return $('.js-controls-ComboBox__fieldNotEditable', this._container);
        }
      },

      _clearSelection: function(){
         ComboBox.superclass.setText.call(this, '');
         this._drawNotEditablePlaceholder('');
         $('.js-controls-ComboBox__fieldNotEditable', this._container.get(0)).text('');
         if (this._picker) {
            $('.controls-ComboBox__item_selected', this._picker.getContainer().get(0)).removeClass('controls-ComboBox__item_selected');
         }
         this._container.addClass('controls-ComboBox__emptyValue');
      },

      _drawSelectedItem: function (key, index) {
         var def, cKey = key;
         def = new Deferred();

         if (this._getItemsProjection()) {
            if (!this._isEmptyIndex(index)) {
               var projItem = this._getItemsProjection().at(index);
               def.callback(projItem.getContents());
            }
            else {
               if (this._dataSource) {
                  if ((cKey != undefined) && (cKey !== null)) {
                     this._dataSource.read(cKey).addCallback(function (item) {
                        def.callback(item);
                     });
                  }
               }
            }
            def.addCallback(this._drawSelectedItemText.bind(this, cKey, index));
         }
         if (this._isClearing) {
            this._clearSelection();
            this._isClearing = false;
         }
      },

      _drawSelectedItemText: function(key, index, item){
         if (item) {
            var newText = this._getPropertyValue(item, this._options.displayProperty);
            if (newText != this._options.text) {
               ComboBox.superclass.setText.call(this, newText);
               this._drawNotEditablePlaceholder(newText);
               $('.js-controls-ComboBox__fieldNotEditable', this._container.get(0)).text(newText);
            }
            this._toggleEmptyValue(key);
         }
         else {
            this._clearSelection();
         }
         if (this._picker) {
            $('.controls-ComboBox__item_selected', this._picker.getContainer().get(0)).removeClass('controls-ComboBox__item_selected');
            if (this._options.emptyValue && key === null) {
               $('.controls-ComboBox__item:first', this._picker.getContainer()).addClass('controls-ComboBox__item_selected');
            } else {
               var projItem = this._getItemsProjection().at(index);
               var hash = projItem && projItem.getHash();
               $('.controls-ComboBox__item[data-hash=\'' + hash + '\']', this._picker.getContainer()).addClass('controls-ComboBox__item_selected');
            }
         }
      },

      _toggleEmptyValue: function(key) {
         /*управлять этим классом надо только когда имеем дело с рекордами
          * потому что только в этом случае может прийти рекорд с пустым ключом null, в случае ENUM это не нужно
          * вообще этот участок кода нехороший, помечу его TODO
          * планирую избавиться от него по задаче https://inside.tensor.ru/opendoc.html?guid=fb9b0a49-6829-4f06-aa27-7d276a1c9e84&description*/
         if (!cInstance.instanceOfModule(this.getItems(), 'WS.Data/Type/Enum')) {
            this._container.toggleClass('controls-ComboBox__emptyValue', (key === null));
         }
         else {
            this._container.removeClass('controls-ComboBox__emptyValue');
         }
      },

      _drawSelectedEmptyRecord: function(){
         if (this.isEditable() || !!this._options.placeholder) {
            //Если есть placeholder или если выбрали emptyValue и включен ввод значения в инпут - выставляем пустой текст, чтобы было видно placeholder
            //Текст "не выбрано" в этом случае никому не нужен, он лишь мешает вводить значение.
            ComboBox.superclass.setText.call(this, '');
         }
         else {
            this._drawSelectedItemText(null, 0, this._options._emptyRecordProjection.getContents());
         }

         this._options.selectedKey = null;
         this.setSelectedIndex(-1);
      },

      _addItemAttributes : function(container, item) {
         ComboBox.superclass._addItemAttributes.call(this, container, item);
         container.addClass('controls-ComboBox__item').addClass('js-controls-ComboBox__item');
      },

      _setPickerContent: function () {
         var self = this;
         this._picker.getContainer().mousedown(function (e) {
            e.stopPropagation();
         });
         //TODO нужно ли здесь звать redraw? Сейчас без этого не работает.
         this.redraw();
         //Подписка на клик по элементу комбобокса
         //Подписываемся на onClick контрола, т.к. на мобильных платформах может не стрельнуть обработчик события mouseup/mousedown. Связано это с тем,
         //что кто-то может прервать событие touchstart, вследствие чего описанные события не стрельнут.
         //Подписка на платформенное событие более правильное решение, т.к. наше событие будет всегда.
         this._picker.subscribe('onClick', function (eventObject, e) {
            var row = $(e.target).closest('.js-controls-ComboBox__item');
            if (row.length) {

               var hash = $(row).attr('data-hash');
               var projItem, index;
               projItem = self._getItemsProjection().getByHash(hash);
               if (!projItem && self._options.emptyValue){
                  self._drawSelectedEmptyRecord();
                  self.hidePicker();
                  return;
               }
               index = self._getItemsProjection().getIndex(projItem);
               //Перевожу фокус на поле ввода до закрытия пикера
               //Иначе при закрытии фокус может улететь непонятно куда, что мешает редактированию по месту
               if (self._options.activableByClick) {
                  self.setActive(true);
               }
               self.hidePicker();
               self._onItemClickHandler(projItem.getContents());
               self.setSelectedIndex(index);
               if (self._options.autocomplete){
                  self._getItemsProjection().setFilter(null);
                  self.redraw();
               }

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
               side: 'top',
               offset: -1
            },
            horizontalAlign: {
               side: 'left'
            },
            closeByExternalClick: true,
            _canScroll: true,
            targetPart: true,
            activableByClick: false,
            closeOnTargetMove: true,
            handlers: {
               onShow: this._revertArrow.bind(this, true),
               onClose: this._revertArrow.bind(this, false)
            },
            template : this._dotTplFnPicker
         };
      },

      _getItemsContainer: function () {
         if (this._picker){
            return $('.controls-ComboBox__list', this._picker.getContainer()[0]);
         } else {
            return null;
         }
      },
      // переопределен в SbisComboBox
      _onItemClickHandler: function () {
      },

      setPlaceholder: function(placeholder) {
         ComboBox.superclass.setPlaceholder.apply(this, arguments);
         $('.controls-ComboBox__fieldNotEditable__placeholder', this._container.get(0)).text(placeholder);
         if (!this._options.editable) {
            this._destroyCompatPlaceholder();
         }
      },

      _getItemTemplate: function (projItem) {
         var
            item = projItem.getContents(),
            title = item.get(this._options.displayProperty);

         if (this._options.itemTemplate) {
            return doT.template(this._options.itemTemplate)({item : item, displayProperty : title, displayField: title})
         }
         else {
            return '<div>' + title + '</div>';
         }
      },

      _prepareItemData: function() {
         var args = ComboBox.superclass._prepareItemData.apply(this, arguments);
         args.prepareItemClassesByConfig = prepareItemClassesByConfig;
         return args;
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
          self.setSelectedKey(this._items.getId(newItem));
          }
          if (e.which == 13) {
          this.hidePicker();
          }
          */      },


      _keyUpBind: function (e) {
         var keys = constants.key;
         /*по изменению текста делаем то же что и в текстбоксе*/
         ComboBox.superclass._keyUpBind.apply(this, arguments);

         /*при нажатии enter или escape, событие должно всплывать. Возможно эти кнопки являются управляющими командами (например в редактировании по месту)*/
         if ((e.which != keys.enter) && (e.which != keys.esc)) {
            e.stopPropagation();
         }
      },

      _setKeyByText: function () {
         /*устанавливаем ключ, когда текст изменен извне*/
         var

            self = this,
            filterFieldObj = {};
         //сначала поищем по рекордсету
         if (this.getItems()) {
            this._findItemByKey(this.getItems());
            this._toggleEmptyValue(this.getSelectedKey());
         }
         else if (this._dataSource) {
            filterFieldObj[this._options.displayProperty] = self._options.text;

            self._callQuery(filterFieldObj).addCallback(function (DataSet) {
               self._findItemByKey(DataSet);
            });
         }
         else {
            this._delayedSettingTextByKey = true;
         }
      },

      _findItemByKey: function(items) {
         //Алгоритм ищет нужный рекорд по текстовому полю. Это нужно в случае, если в комбобокс
         //передают текст, и надо оперделить ключ записи
         var hasItems = false,
            hasFindedKey = false,
            selKey,
            oldKey = this._options.selectedKey,
            oldIndex = this._options.selectedIndex,
            oldText = this.getText(),
            self = this;
         items.each(function (item) {
            hasItems = true;
            if (self._getPropertyValue(item, self._options.displayProperty) == self._options.text) {
               hasFindedKey = true;
               //для рекордов и перечисляемого чуть разный механизм
               if (cInstance.instanceOfModule(item, 'WS.Data/Entity/Model')) {
                  selKey = item.getId();
                  self._options.selectedKey = (selKey !== null && selKey !== undefined && selKey == selKey) ? selKey : null;

                  //могут позвать setText, когда проекции еще не создали. Весь этот код уберется по задаче
                  //https://inside.tensor.ru/opendoc.html?guid=8dd659f0-a83e-4804-970f-2c0d482193c9&des=
                  if (self._getItemsProjection()) {
                     self._options.selectedIndex = self._getItemIndexByKey(self._options.selectedKey);
                  }
                  //TODO: переделать на setSelectedItem, чтобы была запись в контекст и валидация если надо. Учесть проблемы с первым выделением
                  if (oldKey !== self._options.selectedKey) { // при повторном индексе null не стреляет событием
                     self._notifySelectedItem(self._options.selectedKey, self._options.selectedIndex);
                     self._drawSelectedItem(self._options.selectedKey, self._options.selectedIndex);
                  }
               }
               else {
                  self._options.selectedIndex = self._getItemsProjection().getIndexBySourceItem(item);
                  if (oldIndex !== self._options.selectedKey) { // при повторном индексе null не стреляет событием
                     self._notifySelectedItem(null, self._options.selectedIndex);
                     self._drawSelectedItem(null, self._options.selectedIndex);
                  }
               }

            }
         });

         if ((!hasFindedKey || !hasItems) && oldKey !== null) {
            ComboBox.superclass.setSelectedKey.call(self, null);
            self._drawText(oldText);
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

      redraw: function () {
         checkDisplayProperty(this._options);
         if (this._picker) {
            ComboBox.superclass.redraw.call(this);
            // Сделано для того, что бы в при уменьшении колчества пунктов при поиске нормально усеньшались размеры пикера
            // В 3.7.3.200 сделано нормально на уровне попапа
            this._picker.getContainer().css('height', '');
            this._picker.recalcPosition(true, true);
            TextBoxUtils.setEqualPickerWidth(this._picker);
            this._onResizeHandler();
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
         if (editable) {
            this._createCompatiblePlaceholder();
         } else {
            this._destroyCompatPlaceholder();
         }
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

      _getElementToFocus: function() {
         return this.isEditable() ? ComboBox.superclass._getElementToFocus.apply(this, arguments) : this.getContainer();
      },

      _setEnabled: function (enabled) {
         TextBox.superclass._setEnabled.call(this, enabled);
         if (enabled === false) {
            this._inputField.attr('readonly', 'readonly');
         }
         else {
            this._inputField.attr('readonly', !this._options.editable);
         }
         $('.controls-ComboBox__Arrow', this.getContainer()).toggleClass('ws-invisible', !enabled); //TODO: удалять из DOM
      },

      showPicker: function() {
         var projection = this._getItemsProjection(),
            item = projection.at(this.getSelectedIndex()),
            hash = item && item.getHash();

         //При открытии пикера, если по текущему фильтру не нашли записей - покажем весь список
         if (!projection.getCount()) {
            projection.setFilter(this._searchFilter.bind(this, ''));
         }

         if (!this._picker || this._picker.isDestroyed()) {
            this._initializePicker();
         }
         ComboBox.superclass.showPicker.call(this);
         TextBoxUtils.setEqualPickerWidth(this._picker);
         if (!hash && projection.getCount() > 0) {
            if (this._options.emptyValue) {
               hash = this._options._emptyRecordProjection.getHash();
            }
            else {
               hash = projection.at(0).getHash();
            }
         }

         $('.controls-ComboBox__item', this._picker.getContainer()).bind('mouseenter', function itemMouseEnter(event) {
            //не устанавливаем title на мобильных устройствах:
            //во-первых не нужно, во-вторых на ios из-за установки аттрибута не работает клик
            if (!detection.isMobilePlatform) {
               var itemContainer = event.target.closest('.controls-ComboBox__item'),
                  textLineCount = itemContainer.innerText.split('\n').length; //Показываем подсказку, если внутри итема нет прикладной верстки. Узлы при получении innerText разделяются \n
               if (textLineCount === 1) {
                  TitleUtil.setTitle(itemContainer);
               }
            }
         });

         this._scrollToItem(hash);
      },

      _revertArrow: function(isPickerShow) {
         var arrow = $('.js-controls-ComboBox__arrowDown', this.getContainer());
         arrow.toggleClass('icon-ExpandLight', !isPickerShow).toggleClass('icon-CollapseLight', isPickerShow);
      },

      hidePicker: function() {
         if (this._picker) {
            $('.controls-ComboBox__item', this._picker.getContainer()).unbind();
         }
         ComboBox.superclass.hidePicker.apply(this, arguments);
      },

      _initializePicker: function(){
         var self = this;
         ComboBox.superclass._initializePicker.call(self);
         this._scrollContainer = this.getChildControlByName('ComboBoxScroll');
         // пробрасываем события пикера в метод комбобокса, т.к. если значение выбрано, то при открытии пикера фокус
         // перейдет на него и комбобокс перестанет реагировать на нажатие клавиш, потому что он наследуется от AreaAbstract
         // TODO чтобы избежать этого нужно переписать Combobox на ItemsControlMixin, тогда метод _scrollToItem не будет переводить фокус на пикер
         self._picker.subscribe('onKeyPressed', function (eventObject, event) {
            self._keyboardHover(event);
         });
         TextBoxUtils.setEqualPickerWidth(this._picker);
      },

      _onAlignmentChangeHandler: function(alignment){
         ComboBox.superclass._onAlignmentChangeHandler.apply(this, arguments);

         var list = $('.controls-ComboBox__list', this._picker.getContainer());

         list[0].className = list[0].className.replace(/(^|\s)controls-ComboBox__list_column(\S*)/gi, '');

         if (alignment.verticalAlign.side === 'bottom') {
            this._picker.getContainer().addClass('controls-ComboBox__picker_column_reverse');
            list.addClass('controls-ComboBox__list_column_reverse');
         } else {
            this._picker.getContainer().removeClass('controls-ComboBox__picker_column_reverse');
            list.addClass('controls-ComboBox__list_column');
         }
      },

      //TODO заглушка
      /**
       * @noShow
       * @returns {Deferred}
       */
      reviveComponents : function() {
         var def = new Deferred();
         def.callback();
         return def;
      },

      _getKeyByIndex: function(index){
         if (this._options.emptyValue && index === -1){
            return null;
         }
         return ComboBox.superclass._getKeyByIndex.apply(this, arguments);
      },

      setSelectedKey : function(key) {
         if (this._options.emptyValue && key === null){
            this._drawSelectedEmptyRecord();
         }
         else if (key == null && !(this.getItems() && this.getItems().getRecordById(key))) {
            this._isClearing = true;
         }
         else {
            this._isClearing = false;
         }
         ComboBox.superclass.setSelectedKey.apply(this, arguments);
      },

      setActive: function(active) {
         ComboBox.superclass.setActive.apply(this, arguments);
         $('.controls-ComboBox__Arrow', this.getContainer()).toggleClass('controls-ComboBox__Arrow_active', active);
      },

      _scrollToItem: function(itemHash) {
         var itemContainer  = $('.controls-ListView__item[data-hash="' + itemHash + '"]', this._getItemsContainer());
         if (itemContainer.length) {
            LayoutManager.scrollToElement(itemContainer, true);
            //Устанавливаю скроллбар в нужную позицию
            this._scrollContainer._initScrollbar();
         }
      }
   });

   return ComboBox;
});
