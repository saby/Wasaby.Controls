/**
 * Created by am.gerasimov on 10.04.2015.
 */
define('js!SBIS3.CONTROLS.DropdownList',
   [
   "Core/constants",
   "Core/Deferred",
   "Core/EventBus",
   "Core/IoC",
   "Core/core-merge",
   "Core/ConsoleLogger",
   "js!SBIS3.CORE.CompoundControl",
   "js!SBIS3.CONTROLS.PickerMixin",
   "js!SBIS3.CONTROLS.ItemsControlMixin",
   "js!SBIS3.CONTROLS.Utils.RecordSetUtil",
   "js!SBIS3.CONTROLS.MultiSelectable",
   "js!SBIS3.CONTROLS.DataBindMixin",
   "js!SBIS3.CONTROLS.DropdownListMixin",
   "js!SBIS3.CONTROLS.FormWidgetMixin",
   "js!SBIS3.CONTROLS.Button",
   "js!SBIS3.CONTROLS.IconButton",
   "js!SBIS3.CONTROLS.Link",
   "js!SBIS3.CONTROLS.Utils.TemplateUtil",
   "js!WS.Data/Collection/RecordSet",
   "js!WS.Data/Display/Display",
   "js!WS.Data/Collection/List",
   "js!SBIS3.CONTROLS.ScrollContainer",
   "html!SBIS3.CONTROLS.DropdownList",
   "html!SBIS3.CONTROLS.DropdownList/DropdownListHead",
   "html!SBIS3.CONTROLS.DropdownList/DropdownListPickerHead",
   "html!SBIS3.CONTROLS.DropdownList/DropdownListItem",
   "html!SBIS3.CONTROLS.DropdownList/DropdownListItemContent",
   "html!SBIS3.CONTROLS.DropdownList/DropdownListPicker",
   "Core/core-instance",
   "i18n!SBIS3.CONTROLS.DropdownList",
   'css!SBIS3.CONTROLS.DropdownList'
],

   function (constants, Deferred, EventBus, IoC, cMerge, ConsoleLogger, Control, PickerMixin, ItemsControlMixin, RecordSetUtil, MultiSelectable, DataBindMixin, DropdownListMixin, FormWidgetMixin, Button, IconButton, Link, TemplateUtil, RecordSet, Projection, List, ScrollContainer, dotTplFn, dotTplFnHead, dotTplFnPickerHead, dotTplFnForItem, ItemContentTemplate, dotTplFnPicker, cInstance) {

      'use strict';
      /**
       * Класс контрола "Выпадающий список".
       * <br/>
       * Особенности работы с контролом:
       * <ul>
       *    <li>Для работы контрола необходим источник данных, его можно задать либо в опции {@link items}, либо методом {@link setDataSource}.</li>
       *    <li>Среди полей источника данных необходимо указать какое является ключевым - {@link idProperty}, и из какого поля будем отображать данные в выпадающий блок - {@link displayProperty}.</li>
       * </ul>
       * <br/>
       * Вы можете связать опцию items с полем контекста, в котором хранятся данные с типом значения перечисляемое - {@link WS.Data/Types/Enum}. Если эти данные хранят состояние выбранного значения, то в контрол будет установлено выбранное значение.
       * <pre>
       *    <component data-component="SBIS3.CONTROLS.DropdownList">
       *       <options name="items" type="array" bind="record/MyEnumField"></options>
       *       <option name="idProperty">@Идентификатор</option>
       *       <option name="displayProperty">Описание</option>
       *    </component>
       * </pre>
       *
       * @class SBIS3.CONTROLS.DropdownList
       * @extends SBIS3.CORE.CompoundControl
       *
       * @author Красильников Андрей Сергеевич
       *
       * @mixes SBIS3.CONTROLS.ItemsControlMixin
       * @mixes SBIS3.CONTROLS.MultiSelectable
       * @mixes SBIS3.CONTROLS.DropdownListMixin
       * @mixes SBIS3.CONTROLS.PickerMixin
       * @mixes SBIS3.CONTROLS.DataBindMixin
       *
       * @demo SBIS3.CONTROLS.Demo.MyDropdownList <b>Пример 1.</b> Простой пример работы контрола
       * @demo SBIS3.CONTROLS.Demo.MyDropdownListFilter <b>Пример 2.</b> Выпадающий список с фильтрацией.
       *
       * @ignoreOptions emptyHTML
       * @ignoreMethods setEmptyHTML
       *
       * @cssModifier controls-DropdownList__withoutCross Скрывает крестик справа от выбранного значения.
       *
       * @control
       * @public
       * @category Inputs
       */

      function getRecordsForRedrawDDL(projection, cfg){
         var itemsProjection;

         itemsProjection = cfg._getRecordsForRedrawSt.apply(this, arguments);
         if (cfg.emptyValue){
            itemsProjection.unshift(getEmptyProjection(cfg));
         }
         return itemsProjection;
      }

      function getEmptyProjection(cfg) {
         var rawData = {},
             emptyItemProjection,
             rs;
         rawData[cfg.idProperty] = null;
         rawData[cfg.displayProperty] = 'Не выбрано';
         rawData.isEmptyValue = true;

         rs = new RecordSet({
            rawData: [rawData],
            idProperty: cfg.idProperty
         });

         emptyItemProjection = Projection.getDefaultDisplay(rs);
         return emptyItemProjection.at(0);
      }

      function getSelectedItems(items, keys, idProperty) {
         //Подготавливаем данные для построения на шаблоне
         var list;
         if (items && keys && keys.length > 0){
            list = new List({
               ownerShip: false
            });
            items.each(function (record, index) {
               var id = record.get(idProperty);
               for (var i = 0, l = keys.length; i < l; i++) {
                  //Сравниваем с приведением типов, т.к. ключи могут отличаться по типу (0 !== '0')
                  //Зачем такое поведение поддерживалось изначально не знаю. Подобные проверки есть и в других методах (к примеру setSelectedKeys)
                  if (keys[i] == id) {
                     list.add(record);
                     return;
                  }
               }
            });
         }
         return list;
      }

      var DropdownList = Control.extend([PickerMixin, ItemsControlMixin, MultiSelectable, DataBindMixin, DropdownListMixin, FormWidgetMixin], /** @lends SBIS3.CONTROLS.DropdownList.prototype */{
         _dotTplFn: dotTplFn,
         /**
          * @event onClickMore Происходит при клике на кнопку "Ещё", которая отображается в выпадающем списке.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          */
         $protected: {
            _options: {
               _getRecordsForRedraw: getRecordsForRedrawDDL,
               _defaultItemContentTemplate: ItemContentTemplate,
               _defaultItemTemplate: dotTplFnForItem,
               /**
                * @cfg {String} Устанавливает шаблон отображения шапки.
                * @remark
                * Шаблон может быть создан с использованием <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/core/component/xhtml/logicless-template/">logicless-шаблонизатора</a> и <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/core/component/xhtml/template/">doT.js-шаблонизатора</a>.
                * Шаблон создают в компоненте в подпапке resources.
                * Порядок работы с шаблоном:
                * <ol>
                *    <li>Подключить шаблон в массив зависимостей компонента.</li>
                *    <li>Импортировать его в отдельную переменную.</li>
                *    <li>В сецкии $protected в подсекции _options создать опцию, значением которой передать шаблон (переменная из предыдущего шага).</li>
                *    <li>В вёрстке компонента в значение опции headTemplate передать значение опции с помощью инструкций шаблонизатора.
                *    </li>
                * </ol>
                * @example
                * Подключение, импорт в переменную и передача шаблона в переменную:
                * <pre>
                * define('js!SBIS3.MyArea.MyComponent',
                *    [ ... , 'html!SBIS3.MyArea.MyComponent/resources/myHeadTpl' ],
                *    function(..., myHeadTpl){
                *       ...
                *       $protected: {
                *          _options: {
                *             myHeadTemplate: myHeadTpl
                *          }
                *       }
                *       ...
                * });
                * </pre>
                * Передача шаблона в опцию компонента:
                * <pre>
                *    <option name="headTemplate" type="ref">{{@it.myHeadTemplate}}</option>
                * </pre>
                * Шаблон, который используется по умолчанию:
                * <pre>
                *    <div class="controls-DropdownList__beforeCaptionWrapper">
                *       <i class="controls-DropdownList__arrowIcon icon-16 icon-size icon-DayForward icon-primary action-hover"></i>
                *    </div>
                *    <div class="controls-DropdownList__textWrapper">
                *       <span class="controls-DropdownList__text">{{=it.text}}</span>
                *    </div>
                *    <div class="controls-DropdownList__afterCaptionWrapper">
                *       <i class="controls-DropdownList__crossIcon icon-16 icon-size icon-Close icon-disabled action-hover"></i>
                *    </div>
                * </pre>
                * @editor ExternalComponentChooser
                * @see headPickerTemplate
                * @see itemTpl
                */
               headTemplate: dotTplFnHead,
               /**
                * @cfg {String} Устанавливает шаблон отображения шапки внутри выпадающего списка.
                * @example
                * Подключение, импорт в переменную и передача шаблона в переменную:
                * <pre>
                * define('js!SBIS3.MyArea.MyComponent',
                *    [ ... , 'html!SBIS3.MyArea.MyComponent/resources/myHeadPickerTpl' ],
                *    function(..., myHeadPickerTpl){
                *       ...
                *       $protected: {
                *          _options: {
                *             myHeadPickerTemplate: myHeadPickerTpl
                *          }
                *       }
                *       ...
                * });
                * </pre>
                * Передача шаблона в опцию компонента:
                * <pre>
                *    <option name="headPickerTemplate" type="ref">{{@it.myHeadPickerTemplate}}</option>
                * </pre>
                * Шаблон, который используется по умолчанию:
                * <pre>
                *    <div class="controls-DropdownList__pickerHead">
                *       <span class="controls-DropdownList__pickerHead-text">{{=(it.title || it.text)}}</span>
                *    </div>
                * </pre>
                * @see headTemplate
                * @see itemTpl
                */
               headPickerTemplate: dotTplFnPickerHead,
               /**
                * @cfg {String} Устанавливает шаблон отображения элемента коллекции выпадающего списка.
                * @remark
                * Шаблон может быть создан с использованием <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/core/component/xhtml/logicless-template/">logicless-шаблонизатора</a> и <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/core/component/xhtml/template/">doT.js-шаблонизатора</a>.
                * Шаблон создают в компоненте в подпапке resources.
                * @example
                * Чтобы можно было использовать шаблон в компоненте и передать в опцию itemTpl, нужно выполнить следующее:
                * <ol>
                *    <li>Подключить шаблон в массив зависимостей компонента.</li>
                *    <li>Импортировать его в отдельную переменную.</li>
                *    <li>В сецкии $protected в подсекции _options создать опцию, значением которой передать шаблон (переменная из предыдущего шага).</li>
                *    <li>В вёрстке компонента в значение опции itemTpl передать значение опции с помощью инструкций шаблонизатора.</li>
                * </ol>
                * @example
                * Подключение, импорт в переменную и передача шаблона в переменную:
                * <pre>
                * define('js!SBIS3.MyArea.MyComponent',
                *    [ ..., 'html!SBIS3.MyArea.MyComponent/resources/myItemTpl' ],
                *    function(..., myItemTpl){
                *       ...
                *       $protected: {
                *          _options: {
                *             newItemTpl: myItemTpl // Создаём новую опцию компонента, в которую передаём шаблон элемента коллекции
                *          }
                *       }
                *    ...
                * });
                * </pre>
                * Передача шаблона в опцию компонента:
                * <pre>
                *     <option name="itemTpl" type="ref">{{@it.newItemTpl}}</option>
                * </pre>
                * Шаблон, который используется по умолчанию:
                * <pre>
                *    <div class="controls-DropdownList__item{{?it.className}} {{=it.className}}{{?}}{{?it.multiselect}} controls-DropdownList__multiselect{{?}}{{?it.item.get && it.item.get('isEmptyValue')}} controls-DropdownList__defaultItem{{?}}{{?it.item.get && it.item.get(it.hierField)}} controls-DropdownList__child{{?}}{{?((it.item.getId && it.item.getId()) === it.defaultId)}} controls-ListView__defaultItem{{?}}" data-hash="{{=it.projItem.getHash()}}" data-id="{{?it.item.getId}}{{=it.item.getId()}}{{?}}">
                *        {{?it.multiselect}}
                *        <div class="controls-DropdownList__itemCheckBox js-controls-DropdownList__itemCheckBox"></div>
                *        {{?}}
                *        <div class="controls-DropdownList__itemTextWrapper controls-DropdownList__itemTextWrapper-height">
                *            <div class="controls-DropdownList__item-text" title="{{=it.getPropertyValue(it.item, it.displayProperty)}}">{{=it.getPropertyValue(it.item, it.displayProperty)}}</div>
                *            <div class="controls-DropdownList__item-text-shadow"></div>
                *        </div>
                *    </div>
                * </pre>
                * @editor ExternalComponentChooser
                * @see headTemplate
                * @see headPickerTemplate
                */
               itemTpl: dotTplFnForItem,
               /**
                * @cfg {String} Устанавливает текст в заголовке.
                * @translatable
                */
               text : '',
               /**
                * @cfg {String} Устанавливает текст, отображаемый в шапке выпадающего списка используемый (см. {@link headPickerTemplate}).
                * @remark
                * Опция актуальная, если {@link type} = 'titleHeader'.
                */
               title: '',
               /**
                * @cfg {String} Устанавливает режим отображения выпадающего списка.
                * @variant simple В выпадающем списке отображаются только элементы коллекции.
                * @variant duplicateHeader В выпадающем списке выбранное значение дублируется в шапке.
                * @variant titleHeader В шапке отображается текст, установленный в опции {@link title}.
                */
               type: 'simple',
               /**
                * @cfg {String} Устанавливает поле иерархии.
                * @remark
                * По значениям поля иерархии иерархические отношения между элементами коллекции выпадающего списка.
                */
               parentProperty: null,
               allowEmptyMultiSelection: false,
               /**
                * @cfg {Boolean} Добавить пустое значение в выпадающий список с текстом "Не выбрано"
                * @remark
                * Пустое значение имеет ключ null
                */
               emptyValue: null
            },
            _pickerListContainer: null,
            _pickerHeadContainer: null,
            _pickerFooterContainer: null,
            _pickerBodyContainer: null,
            _resetButton: null,
            _pickerResetButton: null,
            _defaultId: null,
            _buttonChoose : null,
            _buttonHasMore: null,
            _currentSelection: {},
            _emptyText: 'Не выбрано',
            _hideAllowed : true,
            _changedSelectedKeys: [] //Массив ключей, которые были выбраны, но еще не сохранены в выпадающем списке
         },
         $constructor: function() {
            this._publish('onClickMore');
            this._container.bind(this._isHoverMode() ? 'mouseenter' : 'mouseup', this.showPicker.bind(this));
            if (!this._picker) {
               if (this._container.hasClass('controls-DropdownList__withoutCross')){
                  this._options.pickerClassName += ' controls-DropdownList__withoutCross';
               }
               this._initializePicker();
            }
         },
         init: function(){
            DropdownList.superclass.init.apply(this, arguments);
         },
         _modifyOptions: function() {
            var cfg = DropdownList.superclass._modifyOptions.apply(this, arguments);
            if (cfg.hierField) {
               IoC.resolve('ILogger').log('DropDownList', 'Опция hierField является устаревшей, используйте parentProperty');
               cfg.parentProperty = cfg.hierField;
            }
            cfg.pickerClassName += ' controls-DropdownList__picker';
            cfg.headTemplate = TemplateUtil.prepareTemplate(cfg.headTemplate);
            if (!cfg.selectedItems) {
               cfg.selectedItems = getSelectedItems(cfg._items, cfg.selectedKeys, cfg.idProperty);
            }
            return cfg;
         },

         _setPickerContent : function () {
            var pickerContainer = this._getPickerContainer(),
                header = pickerContainer.find('.controls-DropdownList__header'),
                cssModificators = ['controls-DropdownList__withoutArrow',
                                   'controls-DropdownList__withoutCross',
                                   'controls-DropdownList__linkStyle'];
            //Заполняем опцию className навешенными css-модификаторами
            for (var i = 0, l = cssModificators.length; i < l; i++){
               if (this.getContainer().hasClass(cssModificators[i]) && this._options.className.indexOf(cssModificators[i]) < 0){
                  this._options.className += ' ' + cssModificators[i];
               }
            }
            // Собираем header через шаблон, чтобы не тащить стили прикладников
            header.append(dotTplFn(this._options));
            this._setVariables();
            this._bindItemSelect();

            if(!this._isHoverMode()) {
               this._pickerHeadContainer.click(this.hidePicker.bind(this));
            }
         },
         _buildTplArgs: function(item) {
            var defaultArgs = DropdownList.superclass._buildTplArgs.apply(this, arguments);
            return cMerge(defaultArgs, {
               item: item,
               defaultId: this._defaultId,
               hierField: this._options.parentProperty,
               parentProperty: this._options.parentProperty,
               multiselect: this._options.multiselect
            });
         },

         _removeOldKeys: function(){
            var keys = this.getSelectedKeys(),
                items = this.getItems();
            if (!this._isEnumTypeData()) {
               for (var i = 0, l = keys.length; i < l; i++) {
                  if (!items.getRecordById(keys[i])) {
                     keys.splice(i, 1);
                  }
               }
               if (!keys.length){
                  this._setFirstItemAsSelected();
               }
            }
         },

         _onReviveItems: function(){
            //После установки новых данных, некоторых выбранных ключей может не быть в наборе. Оставим только те, которые есть
            //emptyValue в наборе нет, но если selectedKeys[0] === null, то его в этом случае удалять не нужно
            if (!this._options.emptyValue || this.getSelectedKeys()[0] !== null){
               this._removeOldKeys();
            }
            DropdownList.superclass._onReviveItems.apply(this, arguments);
         },

         setSelectedKeys: function(idArray){
            if (this._options.emptyValue && idArray[0] == this._defaultId){
               this._setSelectedEmptyRecord();
               return;
            }
            //Если у нас есть выбранные элементы, нцжно убрать DefaultId из набора
            //Т.к. ключи могут отличаться по типу (0 !== '0'), то придется перебирать массив самостоятельно.
            if (idArray.length > 1) {
               for (var i = 0; i < idArray.length; i++) {
                  if (idArray[i] == this._defaultId){
                     idArray.splice(i, 1);
                     break;
                  }
               }
            }
            if (this._isEnumTypeData()) {
               this.getItems().set(idArray[0]);
            }
            DropdownList.superclass.setSelectedKeys.call(this, idArray);
            this._updateCurrentSelection();
         },
         _setSelectedEmptyRecord: function(){
            var oldKeys = this.getSelectedKeys();
            this._options.selectedItems && this._options.selectedItems.clear();
            this._options.selectedKeys = [null];
            this._drawSelectedValue(null, [this._emptyText]);
            this._notifySelectedItems(this._options.selectedKeys,{
               added : [null],
               removed : oldKeys
            });
         },
         _updateCurrentSelection: function(){
            var keys;
            this._currentSelection = {};
            keys = this.getSelectedKeys();
            for (var i = 0, len = keys.length; i < len; i++ ) {
               this._currentSelection[keys[i]] = true;
            }
         },
         _initializePicker: function() {
            DropdownList.superclass._initializePicker.apply(this, arguments);
            // Предотвращаем всплытие focus и mousedown с контейнера меню, т.к. это приводит к потере фокуса
            this._picker.getContainer().on('mousedown focus', this._blockFocusEvents);
         },
         _blockFocusEvents: function(event) {
            var eventsChannel = EventBus.channel('WindowChangeChannel');
            event.preventDefault();
            event.stopPropagation();
            // Если случился mousedown то нужно нотифицировать о клике, перебив дефолтное событие перехода фокуса.
            // Это нужно для корректного закрытия PopupMixin. Подумать как избавится от размазывания логики закрытия
            // PopupMixin по нескольким компонентам.
            // Эта логика дублируется в SBIS3.CONTROLS.RichEditorToolbarBase.
            if(event.type === 'mousedown') {
               eventsChannel.notify('onDocumentClick', event);
            }
         },
         _getCurrentSelection: function(){
            var keys = [];
            for (var i in this._currentSelection) {
               if (this._currentSelection.hasOwnProperty(i) && this._currentSelection[i]) {
                  //Если ключи были number, они станут здесь строкой
                  keys.push(i);
               }
            }
            return keys;
         },
         //Проверка на нестрогое равенство массивов
         //TODO это дублЬ! нужно вынести в хелпер!!!
         _isSimilarArrays : function(arr1, arr2){
            if (arr1.length === arr2.length) {
               for (var i = 0; i < arr1.length; i ++) {
                  if (arr1[i] != arr2[i]) {
                     return false;
                  }
               }
               return true;
            }
            return false;
         },
         _clickItemHandler : function (e) {
            var  self = this,
                 row = $(e.target).closest('.' + self._getItemClass()),
                 itemId = this._getIdByRow(row),
                 selectedKeys = this.getSelectedKeys(),
                 isCheckBoxClick = !!$(e.target).closest('.js-controls-DropdownList__itemCheckBox').length,
                 selected;
            if (row.length && (e.button === (constants.browser.isIE8 ? 1 : 0))) {

               //Если множественный выбор, то после клика скрыть менюшку можно только по кнопке отобрать
               this._hideAllowed = !this._options.multiselect;
               if (this._options.multiselect && !$(e.target).closest('.controls-ListView__defaultItem').length &&
                  (selectedKeys.length > 1 || selectedKeys[0] != this._defaultId) || isCheckBoxClick){
                  var changedSelectionIndex = Array.indexOf(this._changedSelectedKeys, itemId);
                  if (changedSelectionIndex < 0){
                     this._changedSelectedKeys.push(itemId);
                  }
                  else{
                     this._changedSelectedKeys.splice(changedSelectionIndex, 1);
                  }
                  this._buttonChoose.getContainer().removeClass('ws-hidden');
                  selected =  !row.hasClass('controls-DropdownList__item__selected');
                  row.toggleClass('controls-DropdownList__item__selected', selected);
                  this._currentSelection[itemId] = selected;
               } else {
                  self.setSelectedKeys([itemId]);
                  self.hidePicker();
               }
            }
         },

         _getIdByRow: function(row){
            var itemProjection;
            if (!row.length || !row.data('hash')) {
               return undefined;
            }
            if (this._isEnumTypeData()) {
               return this._getItemsProjection().getIndexByHash(row.data('hash'));
            }
            itemProjection = this._getItemsProjection().getByHash(row.data('hash'));
            //Если запись в проекции не найдена - значит выбрали пустую запись(добавляется опцией emptyValue), у которой ключ null
            return itemProjection ? itemProjection.getContents().getId() : null;
         },

         _dblClickItemHandler : function(e){
            e.stopImmediatePropagation();
            var  row = $(e.target).closest('.' + this._getItemClass());
            if (row.length && (e.button === (constants.browser.isIE8 ? 1 : 0))) {
               if (this._options.multiselect) {
                  this._hideAllowed = true;
                  this.setSelectedKeys([this._getIdByRow(row)]);
                  this.hidePicker();
               }
            }

         },
         showPicker: function(ev) {
            if (this.isEnabled()) {
               //Если мы не в режиме хоевера, то клик по крестику нужно пропустить до его обработчика
               if (!this._isHoverMode() && $(ev.target).hasClass('controls-DropdownList__crossIcon')) {
                  return true;
               }
               var items = this._getPickerContainer().find('.controls-DropdownList__item');
               this._updateCurrentSelection();
               this._hideAllowed = true;
               this._changedSelectedKeys = [];
               //Восстановим выделение по элементам
               for (var i = 0 ; i < items.length; i++) {
                  $(items[i]).toggleClass('controls-DropdownList__item__selected', !!this._currentSelection[this._getIdByRow($(items[i]))]);
               }
               this._calcPickerSize();
               DropdownList.superclass.showPicker.apply(this, arguments);

               if (this._buttonChoose) {
                  this._buttonChoose.getContainer().addClass('ws-hidden');
               }
            }
         },
         _isHoverMode: function(){
            return this._options.type === 'fastDataFilter';
         },
         _calcPickerSize: function(){
            var pickerBodyWidth,
               pickerHeaderWidth,
               containerWidth,
               needResizeHead,
               minResizeWidth = 400; //Минимальная ширина, с которой начнется ресайз шапки.

            //Сбрасываем значения, выставленные при предыдущем вызове метода _calcPickerSize
            this._pickerBodyContainer.css('max-width', '');
            this._pickerHeadContainer.css('width', '');
            this._togglePickerVisibility(true);

            pickerBodyWidth = this._pickerBodyContainer[0].clientWidth;
            pickerHeaderWidth = this._pickerHeadContainer[0].clientWidth;
            containerWidth = this.getContainer()[0].clientWidth;
            needResizeHead = pickerHeaderWidth > minResizeWidth && pickerHeaderWidth > containerWidth;

            //Ширина шапки не больше, чем ширина контейнера
            if (needResizeHead){
               this._pickerHeadContainer.width(containerWidth);
               //изменилась ширина контейрена, нужно взять актуальную
               pickerBodyWidth = this._pickerBodyContainer[0].clientWidth;
               pickerHeaderWidth = containerWidth;
            }

            //Контейнер с итемами ресайзится в 2-х случаях
            //1: Ширина шапки < 400px, ширина контейнера с итемами > 400px => ширина контейнера = 400px, ограничение прописано в less
            //2: Ширина шапки > 400px => ширина контейнера с итемами = ширине шапки
            if (pickerHeaderWidth > pickerBodyWidth){
               this._pickerBodyContainer.css('max-width', pickerHeaderWidth);
               pickerBodyWidth = pickerHeaderWidth; //изменилась ширина контейрена, нужно взять актуальную
            }
            this._getPickerContainer().toggleClass('controls-DropdownList__type-fastDataFilter-shadow', needResizeHead);
            this._getPickerContainer().toggleClass('controls-DropdownList__equalsWidth', pickerBodyWidth === pickerHeaderWidth);

            this._togglePickerVisibility(false);
         },
         _togglePickerVisibility: function(toggle){
            //Расчет ширины пикера должен производиться до показа контейнера, иначе пикер сам установит ширину, исходя из текущей верстки, и наш ресайз приведет к неправильому позиционированию
            //Ставим пикеру visibility: hidden, чтобы перед показом контейнера иметь доступ к его размерам для ресайза.
            var pickerContainer = this._picker.getContainer();
            pickerContainer.toggleClass('ws-invisible', toggle);
            pickerContainer.toggleClass('ws-hidden', !toggle);
         },
         hide: function(){
            if (this._hideAllowed) {
               DropdownList.superclass.hide.apply(this, arguments);
            }
         },
         _getItemClass: function(){
            return 'controls-DropdownList__item';
         },
         _getPickerContainer: function() {
            if (!this._picker) {
               this._initializePicker();
            }
            return this._picker.getContainer();
         },
         _drawItemsCallback: function() {
            if (this._isEmptyValueSelected()) {
               if (this.getSelectedKeys()[0] !== null) {
                  this._options.selectedKeys = [null];
               }
               this._drawSelectedValue(null, [this._emptyText]);
            }
            else{
               this._drawSelectedItems(this._options.selectedKeys); //Надо вызвать просто для того, чтобы отрисовалось выбранное значение/значения
            }
            this._setSelectedItems(); //Обновим selectedItems, если пришел другой набор данных
            this._needToRedraw = true;

         },
         _isEmptyValueSelected: function(){
            return this._options.emptyValue && this.getSelectedKeys()[0] == null;
         },
         _dataLoadedCallback: function() {
            DropdownList.superclass._dataLoadedCallback.apply(this, arguments);
            if (this._isEnumTypeData()){
               if (this._options.multiselect){
                  throw new Error('DropdownList: Для типа данных Enum выпадающий список должен работать в режиме одиночного выбора')
               }
               return;
            }
            var item = this.getItems().at(0);
            if (item) {
               if (!this._options.emptyValue){
                  this._defaultId = item.getId();
                  this._getHtmlItemByItem(item).addClass('controls-ListView__defaultItem');
               }
            }
         },
         _setSelectedItems: function(){
            //Перебиваю метод из multeselectable mixin'a. см. коммент у метода _isEnumTypeData
            if (!this._isEnumTypeData()) {
              DropdownList.superclass._setSelectedItems.apply(this, arguments);
           }
         },

         _isEnumTypeData: function(){
            //TODO избавиться от этого по задаче https://inside.tensor.ru/opendoc.html?guid=711857a8-d8f0-4b34-aa31-e2f1a0d4b07b&des=
            //Сейчас multiselectable не умеет работать с enum => приходится поддерживать эту логику на уровне выпадающего списка.
            return cInstance.instanceOfModule(this.getItems(), 'WS.Data/Types/Enum');
         },
         _setFirstItemAsSelected : function() {
            //Перебиваю метод из multeselectable mixin'a. см. коммент у метода _isEnumTypeData
            var items = this.getItems(),
                id;

            if (this._isEnumTypeData()){
               id = 0; //Берем первую запись из enum, она под индексом 0
            }
            else if (this._options.emptyValue){ //Записи "Не выбрано" нет в наборе данных
               id = null;
            }
            else{
               id = items && items.at(0) && items.at(0).getId();
            }

            if (id !== undefined) {
               this._options.selectedKeys.push(id);
            }
         },
         _setHasMoreButtonVisibility: function(){
            if (this.getItems()) {
               var needShowHasMoreButton = this.getItems().getMetaData && this._hasNextPage(this.getItems().getMetaData().more, 0);
               if (!this._options.multiselect){
                  this._buttonHasMore.getContainer().closest('.controls-DropdownList__buttonsBlock').toggleClass('ws-hidden', !needShowHasMoreButton);
               }
               else{
                  this._buttonHasMore[needShowHasMoreButton ? 'show' : 'hide']();
               }
            }
         },
         _getHtmlItemByItem: function (item) {
            return $('.controls-DropdownList__item[data-id="' + item.getId() + '"]', this._getPickerContainer());
         },
         _setVariables: function() {
            var pickerContainer = this._getPickerContainer(),
               self = this;

            this._selectedItemContainer = this._container.find('.controls-DropdownList__selectedItem');
            this._setHeadVariables();

            this._pickerListContainer = pickerContainer.find('.controls-DropdownList__list');
            this._pickerBodyContainer = pickerContainer.find('.controls-DropdownList__body');
            this._pickerHeadContainer = pickerContainer.find('.controls-DropdownList__header');
            this._pickerFooterContainer = pickerContainer.find('.controls-DropdownList__footer');
            this._buttonHasMore = this._picker.getChildControlByName('DropdownList_buttonHasMore');
            this._buttonHasMore.subscribe('onActivated', function(){
               self._notify('onClickMore');
               self.hidePicker();
            });
            if (this._options.multiselect) {
               this._buttonChoose = this._picker.getChildControlByName('DropdownList_buttonChoose');
               this._buttonChoose.subscribe('onActivated', function(){
                  var currSelection = self._getCurrentSelection();
                  self._hideAllowed = true;
                  if (!self._isSimilarArrays(self.getSelectedKeys(), currSelection)) {
                     self.setSelectedKeys(currSelection);
                  }
                  self.hidePicker();
               });
            }
         },
         _setHeadVariables: function(){
            if (this._resetButton){
               this._resetButton.unbind('click');
               this._pickerResetButton.unbind('click');
            }
            this._resetButton = $('.controls-DropdownList__crossIcon', this.getContainer());
            this._resetButton.bind('click', this._resetButtonClickHandler.bind(this));
            this._pickerResetButton = $('.controls-DropdownList__crossIcon', this._getPickerContainer());
            this._pickerResetButton.bind('click', this._resetButtonClickHandler.bind(this));
         },
         _resetButtonClickHandler: function(){
            this.removeItemsSelectionAll();
            this.hidePicker();
         },
         removeItemsSelectionAll: function(){
            //в multiselectableMixin при вызове removeItemsSelectionAll выбранной становится первая запись
            //для DDL эта логика не подходит, по кнопке "Еще" могут выбрать запись, которой на текущий момент нет в наборе данных, и вставить ее на первое место в рекордсете
            //При нажатии на крест, нам нужно выбрать дефолтный id, который был, а не новую запись, которая встала на первое место
            //выписал задачу, чтобы обобщить эту логику https://inside.tensor.ru/opendoc.html?guid=bf8da125-b41a-47d9-aa1a-2f2ba2f309f4&des=
            if (this._defaultId !== undefined){
               this.setSelectedKeys([this._defaultId]);
            }
            else{
               DropdownList.superclass.removeItemsSelectionAll.apply(this, arguments);
            }
         },
         _addItemAttributes: function (container, item) {
            /*implemented from DSMixin*/
            var addClass = 'controls-DropdownList__item';
            DropdownList.superclass._addItemAttributes.apply(this, arguments);
            if (item.getContents().getId() == this.getDefaultId()) {
               container.addClass('controls-ListView__defaultItem');
            }

            if (this._options.multiselect) {
               addClass += ' controls-DropdownList__multiselect';
            }
            container.addClass(addClass);
         },

         _drawSelectedItems : function(id) {
            var textValues = [],
                len = id.length,
                self = this,
                item, def;
            if (this._isEnumTypeData()){
               this._drawSelectedValue(this.getItems().get(), [this.getItems().getAsValue()]);
            }
            else if(len) {
               def = new Deferred();

               if(!this._picker) {
                  this._initializePicker();
               }

               this.getSelectedItems(true).addCallback(function(list) {
                  if(list) {
                     list.each(function (rec) {
                        var parentId = rec.get(self._options.parentProperty),
                            parentRecord,
                            text;
                        if (parentId !== undefined){
                           parentRecord = self.getItems().getRecordById(parentId);
                           text = RecordSetUtil.getRecordsValue([parentRecord, rec], self._options.displayProperty).join(' ');
                        }
                        else{
                           text = rec.get(self._options.displayProperty);
                        }
                        textValues.push(text);
                     });
                  }

                  if(!textValues.length && self._checkEmptySelection()) {
                     item = self.getItems() && self.getItems().at(0);
                     if(item) {
                        textValues.push(item.get(self._options.displayProperty));
                     }
                  }

                  def.callback(textValues);
                  return list;
               });

               def.addCallback(this._drawSelectedValue.bind(this, id[0]));
            }
         },

         _drawSelectedValue: function(id, textValue){
            var isDefaultIdSelected = id == this._defaultId,
                pickerContainer = this._getPickerContainer();
            if (!this._options.multiselect) {
               pickerContainer.find('.controls-DropdownList__item__selected').removeClass('controls-DropdownList__item__selected');
               pickerContainer.find('[data-id="' + id + '"]').addClass('controls-DropdownList__item__selected');
            }
            this._setText(this._prepareText(textValue));
            this._redrawHead(isDefaultIdSelected);
            this._setHasMoreButtonVisibility();
            this._resizeFastDataFilter();
         },

         _prepareText: function(textValue){
            if (textValue.length > 1){
               return textValue[0] + ' и еще ' + (textValue.length - 1);
            }
            return textValue.join('');
         },
         _resizeFastDataFilter: function(){
            var parent = this.getParent();
            this._notifyOnSizeChanged();
            if (cInstance.instanceOfModule(parent, 'SBIS3.CONTROLS.FastDataFilter')){
               parent._recalcDropdownWidth();
            }
         },
         _redrawHead: function(isDefaultIdSelected){
            var pickerHeadContainer = $('.controls-DropdownList__selectedItem', this._getPickerContainer()),
                headTpl = TemplateUtil.prepareTemplate(this._options.headTemplate.call(this, this._options))();
            if (this._options.type !== 'fastDataFilter'){
               var pickerHeadTpl = $(TemplateUtil.prepareTemplate(this._options.headPickerTemplate.call(this, this._options))());
               pickerHeadTpl.click(function(e){
                  e.stopImmediatePropagation();
               });
               pickerHeadContainer.html(pickerHeadTpl);
            }
            else{
               pickerHeadContainer.html(headTpl);
            }
            this._selectedItemContainer.html(headTpl);
            this.getContainer().toggleClass('controls-DropdownList__hideCross', isDefaultIdSelected);
            this._getPickerContainer().toggleClass('controls-DropdownList__hideCross', isDefaultIdSelected);
            if (this._options.emptyValue){
               this.getContainer().toggleClass('controls-DropdownList__defaultItem', isDefaultIdSelected);
            }
            this._setHeadVariables();
         },
         /**
          * Получить ключ элемента для выбора "по умолчанию"
          * @returns {*|String|Number}
          */
         getDefaultId: function() {
            return this._defaultId;
         },
         /**
          * Установить текст в заголовок
          * @param text
          */
         setText: function(text) {
            IoC.resolve('ILogger').error('SBIS3.CONTROLS.DropdownList', 'Метод setText в скором времени будет удален. Значения должны отрисовываться на наборе данных');
            this._setText(text);
         },
         _setText: function(text){
            if(typeof text === 'string') {
               this._options.text = text;
               this._notifyOnPropertyChanged('text');
            }
         },
         /**
          * Получить значение переменной text
          * @returns {String}
          */
         getText: function() {
            return this._options.text;
         },
         _getItemsContainer : function () {
            return this._pickerListContainer;
         },
         _setPickerConfig: function () {
            var pickerClassName,
               offset = {
                   top: -10,
                   left: -10
                };
            if (this._options.type == 'duplicateHeader'){
               pickerClassName = 'controls-dropdownlist__showHead controls-DropdownList__type-duplicateHeader';
            }
            else if (this._options.type == 'titleHeader'){
               offset.top = -6;
               pickerClassName = 'controls-dropdownlist__showHead controls-DropdownList__type-title';
            }
            else if (this._options.type == 'fastDataFilter'){
               offset.top = -2;
               offset.left = -2;
               pickerClassName = 'controls-DropdownList__type-fastDataFilter controls-DropdownList__hideSelectedInList';
               this.getContainer().addClass('controls-DropdownList__type-fastDataFilter');
            }
            return {
               corner: 'tl',
               verticalAlign: {
                  side: 'top',
                  offset: offset.top
               },
               horizontalAlign: {
                  side: 'left',
                  offset: offset.left
               },
               className: pickerClassName,
               closeByExternalOver: false,
               closeByExternalClick : true,
               activableByClick: false,
               targetPart: true,
               template : dotTplFnPicker({
                  'multiselect' : this._options.multiselect,
                  'footerTpl' : this._options.footerTpl
               })
            };
         },
         //Переопределяю, чтобы элементы чистились в пикере
         _clearItems : function() {
            if (this._picker) {
               DropdownList.superclass._clearItems.call(this, this._pickerListContainer);
            }
         },
         destroy : function(){
            if (this._buttonChoose) {
               this._buttonChoose.destroy();
            }
            if (this._buttonHasMore) {
               this._buttonHasMore.destroy();
            }
            DropdownList.superclass.destroy.apply(this, arguments);
         }
      });

      return DropdownList;
   });
