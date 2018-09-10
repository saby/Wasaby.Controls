/**
 * Created by am.gerasimov on 10.04.2015.
 */
define('SBIS3.CONTROLS/DropdownList',
   [
   "Core/EventBus",
   "Core/IoC",
   "Core/constants",
   "Core/core-merge",
   "Core/core-instance",
   "Core/helpers/String/format",
   'Core/helpers/Function/shallowClone',
   'Core/helpers/Object/isEqual',
   "Lib/Control/CompoundControl/CompoundControl",
   'Controls/Utils/ArraySimpleValuesUtil',
   "SBIS3.CONTROLS/Mixins/PickerMixin",
   "SBIS3.CONTROLS/Mixins/ItemsControlMixin",
   "SBIS3.CONTROLS/Utils/RecordSetUtil",
   "SBIS3.CONTROLS/Mixins/MultiSelectable",
   "SBIS3.CONTROLS/Mixins/DataBindMixin",
   "SBIS3.CONTROLS/Mixins/DropdownListMixin",
   "SBIS3.CONTROLS/Mixins/FormWidgetMixin",
   "SBIS3.CONTROLS/Utils/TemplateUtil",
   "WS.Data/Collection/RecordSet",
   "WS.Data/Display/Display",
   "WS.Data/Collection/List",
   "tmpl!SBIS3.CONTROLS/DropdownList/DropdownList",
   "tmpl!SBIS3.CONTROLS/DropdownList/DropdownListHead",
   "tmpl!SBIS3.CONTROLS/DropdownList/DropdownListPickerHead",
   "tmpl!SBIS3.CONTROLS/DropdownList/DropdownListItem",
   "tmpl!SBIS3.CONTROLS/DropdownList/DropdownListItemContent",
   "tmpl!SBIS3.CONTROLS/DropdownList/DropdownListPicker",
   "i18n!SBIS3.CONTROLS/DropdownList",
   'css!SBIS3.CONTROLS/DropdownList/DropdownList'
],

   function (EventBus, IoC, constants, cMerge, cInstance, format, shallowClone, isEqual, Control, ArraySimpleValuesUtil, PickerMixin, ItemsControlMixin, RecordSetUtil, MultiSelectable, DataBindMixin, DropdownListMixin, FormWidgetMixin, TemplateUtil, RecordSet, Projection, List, dotTplFn, dotTplFnHead, dotTplFnPickerHead, dotTplFnForItem, ItemContentTemplate, dotTplFnPicker) {

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
       * Вы можете связать опцию items с полем контекста, в котором хранятся данные с типом значения перечисляемое - {@link WS.Data/Type/Enum}. Если эти данные хранят состояние выбранного значения, то в контрол будет установлено выбранное значение.
       * <pre>
       *    <SBIS3.CONTROLS.DropdownList
       *       idProperty="key"
       *       displayProperty="title"
       *       multiselect="{{false}}">
       *       <ws:selectedKeys>
       *          <ws:Array>
       *             <ws:String>{{ 'type' | mutable }}</ws:String>
       *          </ws:Array>
       *       </ws:selectedKeys>
       *       <ws:items>
       *          <ws:Array>
       *             <ws:Object key="{{ 0 }}" title="{[ Все типы ]}" />
       *             <ws:Object key="{{ 1 }}" title="{[ Обсуждения ]}" />
       *             <ws:Object key="{{ 2 }}" title="{[ Новости ]}" />
       *          </ws:Array>
       *       </ws:items>
       *    </SBIS3.CONTROLS.DropdownList>
       * </pre>
       *
       * @class SBIS3.CONTROLS/DropdownList
       * @extends Lib/Control/CompoundControl/CompoundControl
       *
       * @author Красильников А.С.
       *
       * @mixes SBIS3.CONTROLS/Mixins/ItemsControlMixin
       * @mixes SBIS3.CONTROLS/Mixins/MultiSelectable
       * @mixes SBIS3.CONTROLS/Mixins/DropdownListMixin
       * @mixes SBIS3.CONTROLS/Mixins/PickerMixin
       * @mixes SBIS3.CONTROLS/Mixins/DataBindMixin
       * @mixes SBIS3.CONTROLS/Mixins/FormWidgetMixin
       *
       * @demo Examples/DropdownList/MyDropdownList/MyDropdownList Пример работы контрола
       *
       * @ignoreOptions emptyHTML
       * @ignoreMethods setEmptyHTML
       * @ignoreEvents onDragIn onDragStart onDragStop onDragMove onDragOut onClick
       *
       * @cssModifier controls-DropdownList__withoutCross Скрывает крестик справа от выбранного значения.
       *
       * @control
       * @public
       * @category Input
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
         rawData[cfg.displayProperty] = getEmptyText(cfg);
         rawData.isEmptyValue = true;

         rs = new RecordSet({
            rawData: [rawData],
            idProperty: cfg.idProperty
         });

         emptyItemProjection = Projection.getDefaultDisplay(rs);
         return emptyItemProjection.at(0);
      }

      function getEmptyText(cfg) {
         if (typeof cfg.emptyValue === 'boolean') {
            return rk('Не выбрано');
         }
         return cfg.emptyValue;
      }

      function prepareSelectedItems(cfg) {
         //Подготавливаем данные для построения на шаблоне
         var items = cfg._items,
             keys = cfg.selectedKeys,
             list,
             textArray = [];
         if (cfg.emptyValue && keys && keys[0] === null) {
            cfg.text = getEmptyText(cfg);
            cfg.className += ' controls-DropdownList__defaultItem';
         } else if (items && keys && keys.length > 0) {
            list = new List();
            if (items.at(0) && items.at(0).get(cfg.idProperty) === keys[0]) {
               //Если выбрано дефолтное значение - скрываем крест
               cfg.className += ' controls-DropdownList__hideCross';
            }
            items.each(function (record, index) {
               var id = record.get(cfg.idProperty);
               for (var i = 0, l = keys.length; i < l; i++) {
                  //Сравниваем с приведением типов, т.к. ключи могут отличаться по типу (0 !== '0')
                  //Зачем такое поведение поддерживалось изначально не знаю. Подобные проверки есть и в других методах (к примеру setSelectedKeys)
                  if (keys[i] == id) {
                     list.add(record);
                     textArray.push(record.get(cfg.displayProperty));
                     return;
                  }
               }
            });
            cfg.text = prepareText(textArray);
            cfg.selectedItems = list;
         }
      }

      function prepareText(textValue) {
         if (textValue.length > 1) {
            return textValue[0] + ' ' + format({count: textValue.length - 1}, rk('и еще $count$s$'));
         }
         return textValue.join('');
      }

      function prepareHeadTemplateIcon(config) {
         if (!config.multiselect && config.selectedItems && config.selectedItems.at(0)) {
            config._selectedItemIcon = config.selectedItems.at(0).get('icon');
         }
      }

      var DropdownList = Control.extend([PickerMixin, ItemsControlMixin, MultiSelectable, DataBindMixin, DropdownListMixin, FormWidgetMixin], /** @lends SBIS3.CONTROLS/DropdownList.prototype */{
         _dotTplFn: dotTplFn,
         _checkBoxSelectionStarted: false,
         /**
          * @event onClickMore Происходит при клике на кнопку "Ещё", которая отображается в выпадающем списке.
          * @param {Core/EventObject} eventObject Дескриптор события.
          */
         $protected: {
            _options: {
               _getRecordsForRedraw: getRecordsForRedrawDDL,
               _defaultItemContentTemplate: ItemContentTemplate,
               _defaultItemTemplate: dotTplFnForItem,
               /**
                * @name SBIS3.CONTROLS/DropdownList#allowEmptyMultiSelection
                * @cfg {Boolean} Устанавливает конфигурацию для режима множественного выбора, при которой разрешается/запрещается отсутствие выбранных элементов коллекции.
                * * true Отсутствие выбранных элементов коллекции разрешено.
                * * false Отсутствие выбранных элементов коллекции запрещено.
                * @remark
                * Настройка режима множественного выбора, при которой запрещено отсутствие выбранных элементов коллекции
                * гарантирует, что среди элементов коллекции всегда остаётся хотя бы один выбранный элемент.
                * Также пользователь не сможет сбросить последнее выбранное значение через пользовательский интерфейс приложения.
                * @default false
                */
               /**
                * @cfg {String} Устанавливает шаблон отображения шапки.
                * @remark
                * Шаблон может быть создан с использованием <a href="/doc/platform/developmentapl/interface-development/component-infrastructure/logicless-template/">logicless-шаблонизатора</a> и doT.js-шаблонизатора.<br/>
                * Шаблон создают в компоненте в подпапке <b>resources</b>.<br/>
                * Порядок работы с шаблоном:
                * <ol>
                *    <li>Подключить шаблон в массив зависимостей компонента.</li>
                *    <li>Импортировать его в отдельную переменную.</li>
                *    <li>В секции $protected в подсекции _options создать опцию, значением которой передать шаблон (переменная из предыдущего шага).</li>
                *    <li>В разметке компонента в значение опции headTemplate передать значение опции с помощью инструкций шаблонизатора.</li>
                * </ol>
                * В шаблон запрещено внедрять компоненты или базовые платформенные контролы. Шаблон формируют на основе <b>базового шаблона</b>:
                * <pre>
                * <div class="controls-DropdownList__beforeCaptionWrapper" if="{{!!text}}">
                *     <i class="controls-DropdownList__arrowIcon icon-16 icon-size icon-DayForward action-hover"></i>
                * </div>
                * <div class="controls-DropdownList__textWrapper">
                *     <span class="controls-DropdownList__text"><span if="{{_selectedItemIcon}}" class="{{_selectedItemIcon}} controls-DropdownList__icon"></span> <span class="controls-DropdownList__value">{{text}}</span></span>
                * </div>
                * <div class="controls-DropdownList__afterCaptionWrapper" if="{{!!text}}">
                *     <i class="controls-DropdownList__crossIcon icon-16 icon-size icon-Close icon-disabled action-hover"></i>
                * </div>
                * </pre>
                * @example
                * В примере показано использование шаблонизатора doT.js.
                * Подключение, импорт в переменную и передача шаблона в переменную:
                * <pre>
                * define('Examples/MyArea/MyComponent',
                *    [ ... , 'tmpl!Examples/MyArea/MyComponent/resources/myHeadTpl' ],
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
                *    headTemplate="{{@it.myHeadTemplate}}"
                * </pre>
                * Шаблон, который используется по умолчанию:
                * <pre>
                *    <div class="controls-DropdownList__beforeCaptionWrapper">
                *       <i class="controls-DropdownList__arrowIcon icon-16 icon-size icon-DayForward action-hover"></i>
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
                * define('SBIS3/MyArea/MyComponent',
                *    [ ... , 'html!SBIS3/MyArea/MyComponent/resources/myHeadPickerTpl' ],
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
                *    headPickerTemplate="{{myHeadPickerTemplate}}"
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
                * Шаблон может быть создан с использованием <a href="/doc/platform/developmentapl/interface-development/component-infrastructure/logicless-template/">logicless-шаблонизатора</a> и doT.js-шаблонизатора.
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
                * define('Examples/MyArea/MyComponent',
                *    [ ..., 'tmpl!Examples/MyArea/MyComponent/resources/myItemTpl' ],
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
                *    itemTpl="{{ newItemTpl }}"
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
                * @cfg {Boolean|String} Добавить пустое значение в выпадающий список
                * @variant true Добавляется пустое значение с текстом "Не выбрано"
                * @variant {String} Добавляется пустое значение с текстом {String}
                * @remark
                * Пустое значение имеет ключ null
                */
               emptyValue: false,
               emulateClickByTap: true
            },
            _pickerListContainer: null,
            _pickerCloseContainer: null,
            _pickerHeadContainer: null,
            _pickerFooterContainer: null,
            _pickerBodyContainer: null,
            _resetButton: null,
            _pickerResetButton: null,
            _checkClickByTap: true,
            _buttonChoose : null,
            _buttonHasMore: null,
            _currentSelection: []
         },
         $constructor: function() {
            this._publish('onClickMore');
            this._keysWeHandle[constants.key.esc] = 100;
            var self = this;
            if (this._isHoverMode()) {
               this._container.bind('mouseenter', self.showPicker.bind(self)); //по mouseenter остался только langSelector
            }
            if (this._container.hasClass('controls-DropdownList__withoutCross')){
               this._options.pickerClassName += ' controls-DropdownList__withoutCross';
            }
            if (this._container.hasClass('controls-DropdownList__withoutArrow')){
               this._options.pickerClassName += ' controls-DropdownList__withoutArrow';
            }
            this._setHeadVariables();
            this._container.bind('mouseenter' , this._showInfobox.bind(this));
         },
         _onClickHandler: function(event) { //Использую механизм checkClickByTap
            if (this._getItemsProjection()) {
               this.showPicker(event);
            }
         },
         _modifyOptions: function() {
            var cfg = DropdownList.superclass._modifyOptions.apply(this, arguments);
            if (cfg.hierField) {
               IoC.resolve('ILogger').log('DropDownList', 'Опция hierField является устаревшей, используйте parentProperty');
               cfg.parentProperty = cfg.hierField;
            }
            cfg.pickerClassName += ' controls-DropdownList__picker';
            if (cfg.multiselect) {
               cfg.pickerClassName += ' controls-DropdownList__picker-multiselect';
            }
            cfg.headTemplate = TemplateUtil.prepareTemplate(cfg.headTemplate);

            if (!cfg.selectedItems) {
               prepareSelectedItems(cfg);
            }

            prepareHeadTemplateIcon(cfg);

            if (cfg.type == 'duplicateHeader'){
               cfg.pickerClassName += ' controls-DropdownList__type-duplicateHeader';
            }
            else if (cfg.type == 'titleHeader'){
               cfg.pickerClassName += ' controls-DropdownList__type-title';
            }
            else if (cfg.type == 'customHeader'){
               cfg.pickerClassName += ' controls-DropdownList__type-customHeader';
            }
            else if (cfg.type == 'fastDataFilter'){
               cfg.pickerClassName += ' controls-DropdownList__type-fastDataFilter';
               cfg.cssClassName += ' controls-DropdownList__type-fastDataFilter';
            }
            return cfg;
         },

         _setPickerContent : function () {
            var header = $('.controls-DropdownList__header', this._getPickerContainer());
            // Собираем header через шаблон, чтобы не тащить стили прикладников
            /* Надо делать клон, иначе в ие при определнии scope для шаблона затирается parent
               https://online.sbis.ru/opendoc.html?guid=e5604962-8cea-4d32-88e8-1ead295e0adf&des=
               Задача в разработку 15.05.2017 Не пробрасывать scope в ИЕ utils.js:: createSavingPrototype: function mergeSavingPrototype(scope… */
            header.append(dotTplFn(shallowClone(this._options)));
            this._setPickerVariables();
            this._bindItemSelect();

            if(!this._isHoverMode()) {
               this._pickerHeadContainer.click(this.hidePicker.bind(this));
            }
            else {
               this._getPickerContainer().bind('mouseleave', this.hidePicker.bind(this));
            }
         },
         _buildTplArgs: function(item) {
            var defaultArgs = DropdownList.superclass._buildTplArgs.apply(this, arguments);
            return cMerge(defaultArgs, {
               item: item,
               defaultId: this.getDefaultId(),
               hierField: this._options.parentProperty,
               parentProperty: this._options.parentProperty,
               multiselect: this._options.multiselect
            });
         },

         _removeOldKeys: function(){
            if (this._loadItemsDeferred && !this._loadItemsDeferred.isReady()) {
               this._loadItemsDeferred.addCallback(function(list) {
                  var item = this._options.selectedItems.at(0);
                  var textValues = [];
                  var self = this;
                  if (!item) {
                     this._setFirstItemAsSelected();
                     //Скрываю крестик сброса
                     this._getPickerContainer().toggleClass('controls-DropdownList__hideCross', true);
                     this.getContainer().toggleClass('controls-DropdownList__hideCross', true);
                  } else {
                     this._removeOldKeysCallback();
                     list.each(function(rec) {
                        textValues.push(rec.get(self._options.displayProperty));
                     });
                     this._drawSelectedValue(this._options.selectedKeys[0], textValues);
                  }
                  return list;
               }.bind(this));
            } else {
               this._removeOldKeysCallback();
            }
         },

         _removeOldKeysCallback: function() {
            var keys = this.getSelectedKeys(),
                items = this.getItems(),
                i = 0;
            //После установки новых данных, некоторых выбранных ключей может не быть в наборе. Оставим только те, которые есть
            //emptyValue в наборе нет, но если selectedKeys[0] === null, то его в этом случае удалять не нужно
            if (!this._options.emptyValue || keys[0] !== null){
               if (!this._isEnumTypeData()) {
                  while (i < keys.length) {
                     if (!items.getRecordById(keys[i])) {
                        keys.splice(i, 1);
                     }
                     else {
                        i++;
                     }
                  }
                  if (!keys.length){
                     this._setFirstItemAsSelected();
                  }
               }
            }
         },

         setSelectedKeys: function(idArray){
            //Если выбрана запись "Не выбрано", то отрисуем ее вручную, т.к. эта запись отсуствует в рекордсете и не может быть обработана по стандартной логике
            if (this._options.emptyValue && idArray.length === 1 && idArray[0] == this.getDefaultId()){
               var oldKeys = this.getSelectedKeys();
               this._options.selectedItems && this._options.selectedItems.clear();
               this._options.selectedKeys = idArray;
               if (this._isEnumTypeData()) {
                  this.getItems().set(idArray[0]);
               }
               this._drawSelectedValue(null, [getEmptyText(this._options)]);
               this._notifySelectedItems(this._options.selectedKeys,{
                  added : idArray,
                  removed : oldKeys
               });
            }
            else {
               //Если у нас есть выбранные элементы, нцжно убрать DefaultId из набора
               //Т.к. ключи могут отличаться по типу (0 !== '0'), то придется перебирать массив самостоятельно.
               if (idArray.length > 1) {
                  for (var i = 0; i < idArray.length; i++) {
                     if (idArray[i] == this.getDefaultId()){
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
               this.validate();
            }
         },
         _updateCurrentSelection: function(){
            this._currentSelection = this.getSelectedKeys().slice(0);
         },
         _initializePicker: function() {
            DropdownList.superclass._initializePicker.apply(this, arguments);
            this.redraw();// Отрисовываем записи в пикере
            this._setHasMoreButtonVisibility();
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
            var  row = $(e.target).closest('.' + this._getItemClass()),
                 itemId = this._getIdByRow(row),
                 isCheckBoxClick = !!$(e.target).closest('.js-controls-DropdownList__itemCheckBox').length,
                 curSelectionLength = this._currentSelection.length,
                 selectedItemIndex,
                 selected;
            if (row.length) {
               if (this._options.multiselect && itemId != this.getDefaultId() && curSelectionLength !== 0 &&
                  (this._checkBoxSelectionStarted) || isCheckBoxClick) {
                  this._checkBoxSelectionStarted = true;
                  selected =  !row.hasClass('controls-DropdownList__item__selected');
                  row.toggleClass('controls-DropdownList__item__selected', selected);

                  //Делаем проверку вхождения в выбранные ключи,
                  //Т.к. ключи могут различаться по типу (0 !== '0')
                  selectedItemIndex = this._currentSelection.indexOf(itemId) === -1 ? this._currentSelection.indexOf(itemId + '') : this._currentSelection.indexOf(itemId);

                  //Добавляем/Удаляем id из набора выбранных ключей
                  if (selected && selectedItemIndex === -1) {
                     this._currentSelection.push(itemId);
                  }
                  else if (!selected && selectedItemIndex > -1) {
                     this._currentSelection.splice(selectedItemIndex, 1);
                  }
                  this._buttonChoose.getContainer().toggleClass('ws-hidden', isEqual(this.getSelectedKeys(), this._currentSelection));
               } else {
                  this.setSelectedKeys([itemId]);
                  this.hidePicker();
               }
            }
         },

         _getIdByRow: function(row){
            if (!row.length || !row.data('hash')) {
               return undefined;
            }
            var projItem = this._getItemsProjection().getByHash(row.data('hash'));

            if (!projItem) { // Если записи в данных не нашлось, значит выбрали emptyValue
               return null;
            }
            if (this._isEnumTypeData()) {
               return this._getItemsProjection().getSourceIndexByItem(projItem);
            }
            return projItem.getContents().getId();
         },

         _dblClickItemHandler : function(e){
            e.stopImmediatePropagation();
            var  row = $(e.target).closest('.' + this._getItemClass());
            if (row.length && (e.button === 0)) {
               if (this._options.multiselect) {
                  this.setSelectedKeys([this._getIdByRow(row)]);
                  this.hidePicker();
               }
            }

         },
         showPicker: function(ev) {
            if (this.isEnabled()) {
               //Если мы не в режиме хоевера, то клик по крестику нужно пропустить до его обработчика
               if (!this._isHoverMode() && ev && $(ev.target).hasClass('controls-DropdownList__crossIcon')) {
                  return true;
               }
               if (!this._picker) {
                  //Если на showPicker пикер еще не инициализирован - инициализируем его и отрисуем записи внутри
                  this._initializePicker();
               }
               var items = this._getPickerContainer().find('.controls-DropdownList__item');
               this._updateCurrentSelection();
               //Восстановим выделение по элементам
               for (var i = 0 ; i < items.length; i++) {
                  $(items[i]).toggleClass('controls-DropdownList__item__selected', ArraySimpleValuesUtil.hasInArray(this._currentSelection, this._getIdByRow($(items[i]))));
               }
               //Если выбрали дефолтную запись - скрываем крестик сброса
               //Нужно перед показом пикера, чтобы перед позиционированием контейнер имел правильные размеры, т.к.
               //Наличие крестика влияет на отступы у записей согласно стандарту.
               var isDefaultIdSelected = this._isDefaultIdSelected();
               this._getPickerContainer().toggleClass('controls-DropdownList__hideCross', isDefaultIdSelected);
               this.getContainer().toggleClass('controls-DropdownList__hideCross', isDefaultIdSelected);

               this._checkBoxSelectionStarted = false;
               DropdownList.superclass.showPicker.apply(this, arguments);

               if (this._buttonChoose) {
                  this._buttonChoose.getContainer().addClass('ws-hidden');
               }
            }
         },
         _createPicker: function() {
            var popup = DropdownList.superclass._createPicker.apply(this, arguments);
            // В оффлайн клиенте престо не проходят клики с первого раза по списку
            // Включаю волшебную опцию Ярика, которая решает подобные проблемы
            popup._checkClickByTap = true;
            return popup;
         },
         redraw: function() {
            //Если нет пикера - не отрисовываем записи, просто обновим текст в основном контейнере
            if (!this._picker) {
               this._redrawSelectedItems();
            }
            else {
               DropdownList.superclass.redraw.apply(this, arguments);
            }
         },
         _redrawSelectedItems: function() {
            this._removeOldKeys();
            if (this._isEnumTypeData()) {
               this._setFirstItemAsSelected();
            }
            if (this._isEmptyValueSelected()) {
               if (this.getSelectedKeys()[0] !== null) {
                  this._options.selectedKeys = [null];
               }
               this._drawSelectedValue(null, [getEmptyText(this._options)]);
            }
            else{
               if (!this.getSelectedKeys().length && this._getItemsProjection().getCount()) {
                  var firstItem = this._getItemsProjection().at(0).getContents();
                  if (cInstance.instanceOfModule(firstItem, 'WS.Data/Entity/Record')) {
                     this._options.selectedKeys = [firstItem.get(this._options.idProperty)];
                  }
               }
               this._drawSelectedItems(this._options.selectedKeys); //Надо вызвать просто для того, чтобы отрисовалось выбранное значение
            }
         },
         _isHoverMode: function(){
            //Пока окончательно не избавились от открытия ddl по ховеру
            return this._options.type === 'customHeader';
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
         //drawItemsCallback обернут в debounce и выполнится позже, чем пикер спозиционируется
         _drawItemsCallbackSync: function() {
            this._redrawSelectedItems();
            this._setSelectedItems(); //Обновим selectedItems, если пришел другой набор данных
            this._needToRedraw = true;
         },
         _selectedItemLoadCallback: function (item) {
            if (!this._isEnumTypeData()) {
               this.getItems().add(item);
            }
         },
         _isEmptyValueSelected: function(){
            return this._options.emptyValue && this.getSelectedKeys()[0] == null;
         },
         _dataLoadedCallback: function() {
            var item;
            
            /* Зачем тут такая проверка:
               _dataLoadedCallback при первой загрузке вызывается после события onItemsReady, в этом событии
               могут что-то поменять в контексте (особенно актуально для быстрого фильтра), и это может вызвать перестроение
               выпадающего списка. */
            if (this.isDestroyed()) {
               return;
            }
            this._setHeadVariables();
            if (this._isEnumTypeData()){
               if (this._options.multiselect){
                  throw new Error('DropdownList: Для типа данных Enum выпадающий список должен работать в режиме одиночного выбора')
               }
            }
            else {
               item = this.getItems().at(0);
               if (item && !this._options.emptyValue) {
                  if (this._picker) {
                     this._getHtmlItemByItem(item).addClass('controls-ListView__defaultItem');
                  }
               }
            }
            DropdownList.superclass._dataLoadedCallback.apply(this, arguments);
         },
         _checkEmptySelection: function() {
            //Запись "не выбрано" отсутствует в рекордсете, поэтому стандартный метод не поможет
            if (this._isEmptyValueSelected()){
               return false;
            }
            return DropdownList.superclass._checkEmptySelection.apply(this, arguments);
         },
         _isEmptySelection: function() {
           if (this._isEnumTypeData()) { //В enum нет пустой выборки
              return false;
           }
           return DropdownList.superclass._isEmptySelection.apply(this, arguments);
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
            return cInstance.instanceOfModule(this.getItems(), 'WS.Data/Type/Enum');
         },
         _setFirstItemAsSelected : function() {
            //Перебиваю метод из multeselectable mixin'a. см. коммент у метода _isEnumTypeData
            var items = this.getItems(),
                keys = this._options.selectedKeys,
                id;

            if (this._isEnumTypeData()){
               id = items.get(); //Выбранный ключ для enum'a берем с самого enum'a, тем самым синхронизируемся с опцией selectedKeys
            }
            else if (this._options.emptyValue){ //Записи "Не выбрано" нет в наборе данных
               id = null;
            }
            else{
               id = items && items.at(0) && items.at(0).getId();
            }

            if (id !== undefined) {
               //Попадаем сюда, когда в selectedKeys установлены ключи, которых нет в наборе данных
               //В этом случае выбираем первый элемент как выбранный.
               //Нельзя присваивать новый массив с 1 элементом, т.к. собьется ссылка на массив и контексты будут воспринимать значение как новое => использую splice
               keys.splice(0, keys.length, id);
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
         _setPickerVariables: function() {
            var pickerContainer,
                self = this;
            if (this._picker) {
               pickerContainer = this._getPickerContainer();
               this._pickerListContainer = $('.controls-DropdownList__list', pickerContainer);
               this._pickerCloseContainer = $('.controls-DropdownList__close-picker', pickerContainer);
               this._pickerCloseContainer.on('click tap', this.hidePicker.bind(this)); //ipad лагает и не ловит click
               this._pickerBodyContainer = $('.controls-DropdownList__body', pickerContainer);
               this._pickerHeadContainer = $('.controls-DropdownList__header', pickerContainer);
               this._pickerFooterContainer = $('.controls-DropdownList__footer', pickerContainer);
               this._buttonHasMore = this._picker.getChildControlByName('DropdownList_buttonHasMore');
               this._buttonHasMore.subscribe('onActivated', function(){
                  self._notify('onClickMore');
                  self.hidePicker();
               });

               if (this._options.multiselect) {
                  this._buttonChoose = this._picker.getChildControlByName('DropdownList_buttonChoose');
                  this._buttonChoose.subscribe('onActivated', function(){
                     if (!self._isSimilarArrays(self.getSelectedKeys(), self._currentSelection)) {
                        var keys = self._currentSelection.length ? self._currentSelection : [self.getDefaultId()];
                        self.setSelectedKeys(keys);
                     }
                     self.hidePicker();
                  });
               }
            }
         },
         _setHeadVariables: function(){
            if (this._resetButton){
               this._resetButton.unbind('click');
            }
            this._resetButton = $('.controls-DropdownList__crossIcon', this.getContainer());
            this._resetButton.bind('click', this._resetButtonClickHandler.bind(this));
            this._selectedItemContainer = this._container.find('.controls-DropdownList__selectedItem');

            if (this._picker) {
               if (this._pickerResetButton) {
                  this._pickerResetButton.unbind('click');
               }
               this._pickerResetButton = $('.controls-DropdownList__crossIcon', this._getPickerContainer());
               this._pickerResetButton.bind('click', this._resetButtonClickHandler.bind(this));
            }
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
            if (this.getDefaultId() !== undefined){
               this.setSelectedKeys([this.getDefaultId()]);
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
                item;
            if (!this._getItemsCount()) {
               //Если нет данных - не нужно запускать перерисовку. в этом случае обнулится опция text, которая может использоваться как значение по умолчанию (пока не установят данные)
               //_drawSelectedItems запускается после init'a, в поле связи могут задать selectedItems, не задавая items, поэтому проблему в mixin'e решать нельзя
               //DropdownList в свою очередь без items работать не может в принципе, чтобы не было скачущей верстки, пока данные не долетели и компонент пуст - поддерживаю возможность
               //задать значение по умолчанию
               return;
            }
            if (this._isEnumTypeData()){
               var value = this.getItems().getAsValue(true);
               value = value === null ? getEmptyText(this._options) : value;
               this._drawSelectedValue(this.getItems().get(), [value]);
            }
            else if(len) {
               this.getSelectedItems(true).addCallback(function(list) {
                  if(list) {
                     list.each(function (rec) {
                        var parentId = rec.get(self._options.parentProperty),
                            parentRecord,
                            text;
                        if (parentId !== undefined && parentId !== null){ //null - рутовый узел
                           parentRecord = self.getItems().getRecordById(parentId);
                           text = RecordSetUtil.getRecordsValue([parentRecord, rec], self._options.displayProperty).join(' ');
                        }
                        else{
                           text = rec.get(self._options.displayProperty);
                        }
                        textValues.push(text);
                     });
                  }

                  if(!textValues.length) {
                     if (self._checkEmptySelection()) {
                        item = self.getItems() && self.getItems().at(0);
                        if(item) {
                           textValues.push(item.get(self._options.displayProperty));
                        }
                     }
                     else if (self._options.emptyValue) {
                        textValues.push(getEmptyText(self._options));
                     }
                  }

                  self._drawSelectedValue(id[0], textValues);
                  return list;
               });
            }
         },

         _callQuery: function() {
            //Перед новым запросом данных, если у нас уже есть незавершеный запрос на получение selectedItems - прервываем его, т.к. его данные уже не актуальны, фильтр мог поменяться
            if(this._loadItemsDeferred && !this._loadItemsDeferred.isReady()) {
               this._loadItemsDeferred.cancel();
            }
            return DropdownList.superclass._callQuery.apply(this, arguments);
         },

         _getItemsCount: function() {
            var items = this.getItems();
            if (items){
               if (this._isEnumTypeData()) {
                  var count = 0;
                  items.each(function () {
                     count++;
                  });
                  return count;
               }
               return items.getCount();
            }
            return 0;
         },

         _drawSelectedValue: function(id, textValue){
            var isDefaultIdSelected = id == this.getDefaultId(),
                text = prepareText(textValue),
                hash = this._getItemHash(id),
                pickerContainer;
            if (this._picker) {
               if (!this._options.multiselect) {
                  pickerContainer = this._getPickerContainer();
                  pickerContainer.find('.controls-DropdownList__item__selected').removeClass('controls-DropdownList__item__selected');
                  pickerContainer.find('[data-hash="' + hash + '"]').addClass('controls-DropdownList__item__selected');
               }
               this._setHasMoreButtonVisibility();
            }
            this._setText(text);
            this._redrawHead(isDefaultIdSelected);
            this._resizeFastDataFilter();
         },
         _getItemHash: function (id) {
            var selectedRecord;
            
            if (!this.getItems()) {
               return;
            }
            
            if (this._isEnumTypeData()) {
               selectedRecord = this._getItemsProjection().getCurrent();
            }
            else {
               selectedRecord = this._getItemProjectionByItemId(id);
            }
            return selectedRecord && selectedRecord.getHash();
         },
         _resizeFastDataFilter: function(){
            var parent = this.getParent();
            if (cInstance.instanceOfModule(parent, 'SBIS3.CONTROLS/Filter/FastData')) {
               this._notifyOnSizeChanged();
               parent._recalcDropdownWidth();
            }
         },
         _redrawHead: function(isDefaultIdSelected){
            prepareHeadTemplateIcon(this._options);
            var pickerHeadContainer,
                headTpl = TemplateUtil.prepareTemplate(this._options.headTemplate.call(this, this._options))();
            if (this._picker) {
               pickerHeadContainer = $('.controls-DropdownList__selectedItem', this._getPickerContainer());
               if (pickerHeadContainer.length){
                  var pickerHeadTpl = $(TemplateUtil.prepareTemplate(this._options.headPickerTemplate)(this._options));
                  pickerHeadContainer.html(pickerHeadTpl);
                  this._getPickerContainer().toggleClass('controls-DropdownList__hideCross', isDefaultIdSelected);
               }
            }
            this._selectedItemContainer.html(headTpl);
            this.getContainer().toggleClass('controls-DropdownList__hideCross', isDefaultIdSelected);
            if (this._options.emptyValue){
               this.getContainer().toggleClass('controls-DropdownList__defaultItem', isDefaultIdSelected);
            }
            this._setHeadVariables();
         },
         _showInfobox: function() {
            var self = this,
               textValues = [];
            if (!this.isEnabled() && (this.getSelectedKeys().length > 1 || this.getTooltip())) {
               requirejs(['Lib/Control/Infobox/Infobox'], function(Infobox) {
                  textValues = [];
                  if (self.getSelectedKeys().length > 1) {
                     self.getSelectedItems().each(function(item) {
                        textValues.push(item.get(self._options.displayProperty));
                     });
                  }
                  else {
                     textValues = [self.getTooltip()];
                  }

                  Infobox.show({
                     control: self.getContainer(),
                     message: textValues.join(', '),
                     autoHide: true
                  })
               });
            }
         },
         /**
          * Получить ключ элемента для выбора "по умолчанию"
          * @returns {*|String|Number}
          */
         getDefaultId: function(rawItems) {
            var items = rawItems || this.getItems();
            if (this._options.emptyValue || !items) {
               return null;
            }
            return this._isEnumTypeData() ? items.get() : (items.at(0) && items.at(0).getId());
         },
         _isDefaultIdSelected: function() {
           return this.getSelectedKeys()[0] == this.getDefaultId();
         },
         /**
          * Установить текст в заголовок
          * @param text
          */
         setText: function(text) {
            this._setText(text);
         },
         _setText: function(text){
            if(typeof text === 'string' && this._options.text !== text) {
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
            var type = this._options.type,
                isFastDataFilterType = type == 'fastDataFilter';
            return {
               corner: 'tl',
               verticalAlign: {
                  side: 'top'
               },
               _canScroll: true,
               horizontalAlign: {
                  side: 'left'
               },
               closeByExternalOver: false,
               closeByExternalClick : true,
               closeOnTargetMove: true,
               locationStrategy: isFastDataFilterType ? 'bodyBounds' : 'base',
               targetPart: true,
               template : dotTplFnPicker({
                  'multiselect' : this._options.multiselect,
                  'footerTpl' : this._options.footerTpl,
                  'hasHead': type == 'duplicateHeader' || type == 'titleHeader' || type == 'customHeader',
                  'hasCloseButton': isFastDataFilterType
               })
            };
         },
         //Переопределяю, чтобы элементы чистились в пикере
         _clearItems : function() {
            if (this._picker) {
               DropdownList.superclass._clearItems.call(this, this._pickerListContainer);
            }
         },
         _keyboardHover: function(event) {
            if (event.which === constants.key.esc && this.isPickerVisible()) {
               this.hidePicker();
               return false;
            }
            return true;
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
