define('SBIS3.CONTROLS/FieldLink',
    [
       'SBIS3.CONTROLS/Utils/ConfigByClasses',
       "Core/CommandDispatcher",
       "Core/constants",
       "Core/IoC",
       'Core/EventBus',
       "Core/core-instance",
       'Core/helpers/Function/memoize',
       'SBIS3.CONTROLS/Utils/Contains',
       "Core/helpers/String/escapeTagsFromStr",
       'SBIS3.CONTROLS/ControlHierarchyManager',
       "SBIS3.CONTROLS/Suggest/SuggestTextBox",
       "SBIS3.CONTROLS/Mixins/ItemsControlMixin",
       "SBIS3.CONTROLS/Mixins/MultiSelectable",
       "SBIS3.CONTROLS/Mixins/ActiveMultiSelectable",
       "SBIS3.CONTROLS/Mixins/Selectable",
       "SBIS3.CONTROLS/Mixins/ActiveSelectable",
       "SBIS3.CONTROLS/Mixins/SyncSelectionMixin",
       "tmpl!SBIS3.CONTROLS/FieldLink/FieldLink",
       "tmpl!SBIS3.CONTROLS/FieldLink/afterFieldWrapper",
       "tmpl!SBIS3.CONTROLS/FieldLink/beforeFieldWrapper",
       "tmpl!SBIS3.CONTROLS/FieldLink/textFieldWrapper",
       "tmpl!SBIS3.CONTROLS/FieldLink/resources/showSelectorButton",
       "SBIS3.CONTROLS/Mixins/ITextValue",
       "SBIS3.CONTROLS/Utils/ToSourceModel",
       "WS.Data/Collection/List",
       "SBIS3.CONTROLS/Utils/ItemsSelectionUtil",
       "Core/helpers/Object/find",
       "SBIS3.CONTROLS/Action/SelectorAction",
       "Core/core-merge",
       "SBIS3.CONTROLS/FieldLink/resources/ItemsCollection",
       "SBIS3.CONTROLS/Utils/TemplateUtil",
       "SBIS3.CONTROLS/Button/IconButton",
       'SBIS3.CONTROLS/FieldLink/Link',
       "SBIS3.CONTROLS/Menu/MenuIcon",
       "i18n!SBIS3.CONTROLS/FieldLink",
       'css!SBIS3.CONTROLS/FieldLink/FieldLink',
       'css!SBIS3.CONTROLS/Suggest/Suggest'

    ],
    function (
        ConfigByClasses,
        CommandDispatcher,
        constants,
        IoC,
        EventBus,
        cInstance,
        memoize,
        contains,
        escapeTagsFromStr,
        ControlHierarchyManager,
        SuggestTextBox,
        ItemsControlMixin,

        /* Интерфейс для работы с набором выбранных записей */
        MultiSelectable,
        ActiveMultiSelectable,
        /****************************************************/

        /* Интерфейс для работы с выбранной записью */
        Selectable,
        ActiveSelectable,
        /********************************************/

        SyncSelectionMixin,

        /* Служебные шаблоны поля связи */
        dotTplFn,
        afterFieldWrapper,
        beforeFieldWrapper,
        textFieldWrapper,
        showSelectorButton,
        /********************************************/
        ITextValue,
        ToSourceModel,
        List,
        ItemsSelectionUtil,
        objectFind,
        SelectorAction,
        wsCoreMerge
    ) {

       'use strict';

       function _addOptionsFromClass(opts, attrToMerge) {
          var
             classes = (attrToMerge && attrToMerge.class) || (opts.element && opts.element.className) || opts.className || '',
             params = [
                { class: 'controls-FieldLink__itemsEdited', optionName: 'underlinedItems', value: true, defaultValue: false },
                { class: 'controls-FieldLink__itemsBold', optionName: 'boldItems', value: true, defaultValue: false },
                { class: 'controls-FieldLink__big-fontSize', optionName: 'bigItems', value: true, defaultValue: false },
                { class: 'controls-FieldLink__hideSelector', optionName: 'showSelector', value: false, defaultValue: true },
                { class: 'controls-FieldLink__hiddenIfEmpty', optionName: 'hideIfEmpty', value: true, defaultValue: false }
             ];
          ConfigByClasses(opts, params, classes);
       }

       function _addOptionsByState(cfg) {
          var
             selectedKeysLength = cfg.selectedKeys.length;
          cfg._selectedMultipleItems = _private.selectedMultipleItems(cfg);
          cfg._hideTextBoxField = !cfg.multiselect && selectedKeysLength > 0 && !cfg.alwaysShowTextBox;
       }

       var classes = {
          MULTISELECT: 'controls-FieldLink__multiselect',
          SELECTED: 'controls-FieldLink__selected',
          SELECTED_SINGLE: 'controls-FieldLink__selected-single',
          INVISIBLE: 'ws-invisible'
       };

       var _private = {
          keysFix: function(keys) {
             if(keys !== undefined && !Array.isArray(keys)) {
                keys = [keys];
             }
             return keys;
          },
          selectedMultipleItems: function(cfg) {
             return cfg.multiselect && cfg.selectedKeys.length > 1;
          },
          itemSelectHandler: function(self) {
             if(self.getText() && !self._options.alwaysShowTextBox) {
                /* Т.к. текст сбрасывается програмно, а searchMixin реагирует лишь на ввод текста с клавиатуры,
                 то надо позвать метод searchMixin'a, который сбросит текст и поднимет событие */
                self.resetSearch();
             }
          }
       };

       /**
        * Класс контрола "Поле связи".
        * <a href="http://axure.tensor.ru/standarts/v7/%D0%BF%D0%BE%D0%BB%D0%B5_%D1%81%D0%B2%D1%8F%D0%B7%D0%B8__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_03_.html">Спецификация</a>.
        * <a href="/doc/platform/developmentapl/interface-development/components/textbox/field-link/index/">Документация</a>.
        *
        * @class SBIS3.CONTROLS/FieldLink
        * @extends SBIS3.CONTROLS/Suggest/SuggestTextBox
        *
        * @author Герасимов А.М.
        *
        * @mixes SBIS3.CONTROLS/Mixins/MultiSelectable
        * @mixes SBIS3.CONTROLS/Mixins/ActiveMultiSelectable
        * @mixes SBIS3.CONTROLS/Mixins/Selectable
        * @mixes SBIS3.CONTROLS/Mixins/ActiveSelectable
        * @mixes SBIS3.CONTROLS/Mixins/SyncSelectionMixin
        * @mixes SBIS3.CONTROLS/Mixins/ItemsControlMixin
        * @mixes SBIS3.CONTROLS/Mixins/ITextValue
        * @mixes SBIS3.CONTROLS/FieldLinkDocs
        *
        * @cssModifier controls-FieldLink__hiddenIfEmpty Скрывает отображение (устанавливает CSS-свойство "display:none") контрола "Поле связи", если выполнены два условия: опция {@link enabled}=false и отсутствуют выбранные записи.
        *
        * @ignoreOptions tooltip alwaysShowExtendedTooltip loadingContainer observableControls pageSize usePicker filter saveFocusOnSelect selectedIndex
        * @ignoreOptions allowEmptySelection allowEmptyMultiSelection templateBinding includedTemplates resultBindings footerTpl emptyHTML groupBy
        * @ignoreMethods getTooltip setTooltip getExtendedTooltip setExtendedTooltip setEmptyHTML setGroupBy itemTpl
        * @ignoreEvents onListItemSelect onDataLoad onDataLoadError onBeforeDataLoad onDrawItems onFilterBuild onItemsReady
        *
        * @control
        * @public
        * @category Input
        */

       var FieldLink = SuggestTextBox.extend([MultiSelectable, ActiveMultiSelectable, Selectable, ActiveSelectable, SyncSelectionMixin, ItemsControlMixin, ITextValue],/** @lends SBIS3.CONTROLS/FieldLink.prototype */{
          /**
           * @name SBIS3.CONTROLS/FieldLink#textValue
           * @cfg {String} Хранит строку, сформированную из значений поля отображения выбранных элементов коллекции.
           * @remark
           * Значения в строке перечислены через запятую. Отображаемые значения в строке определяются с помощью опции {@link displayProperty} или {@link itemContentTpl}.
           * Опция доступна только на чтение. Запрещена двусторонняя привязка к полю контекста.
           * @see getTexValue
           * @see displayProperty
           * @see itemContentTpl
           */
          /**
           * @event onItemActivate Происходит при клике по выбранному элементу коллекции.
           * @param {Core/EventObject} eventObject Дескриптор события.
           * @param {Object} meta Объект, описывающий метаданные события. В его свойствах передаются идентификатор и экземпляр выбранного значения.
           * @param {String} meta.id Идентификатор выбранного значения.
           * @param {SBIS3.CONTROLS.Record} meta.item Экземпляр класса выбранного значения.
           */
          _dotTplFn: dotTplFn,
          $protected: {
             _lastFieldLinkWidth: null,
             _showAllButton: null,
             _options: {
                _paddingClass: ' controls-Text-InputRender_paddingLeft',
                /* Служебные шаблоны поля связи (иконка открытия справочника, контейнер для выбранных записей */
                afterFieldWrapper: afterFieldWrapper,
                beforeFieldWrapper: beforeFieldWrapper,
                textFieldWrapper: textFieldWrapper,
                showSelectorButton: showSelectorButton,
                /**********************************************************************************************/
                 list: {
                   component: 'SBIS3.CONTROLS/DataGridView',
                   options: {
                      showHead: false,
                      columns: []
                   }
                },
                /**
                 * @typedef {String} selectionTypeDef Режим выбора.
                 * @variant node выбираются только узлы
                 * @variant leaf выбираются только листья
                 * @variant all выбираются все записи
                 */
                /** @typedef {Object} Dictionaries
                 * @property {String} name Имя (Идентификатор справочника).
                 * @property {selectionTypeDef} selectionType
                 * @property {Object} dialogOptions Опции для диалога.
                 * Передаются при включенной опции <a href="/docs/js/SBIS3/CONTROLS/SelectorButton/options/useSelectorAction/">useSelectorAction</a>.
                 * <pre class="brush: xml">
                 *     <option name="template">Examples/MyArea/MyDatGridView</option>
                 *     <options name="dialogOptions">
                 *        <option name="minWidth">500px</option>
                 *     </options>
                 * </pre>
                 * или
                 * <pre class="brush: xml">
                 *     <ws:Object template="Examples/MyArea/MyDatGridView">
                 *        <ws:dialogOptions minWidth = "500px" />
                 *     </ws:Object>
                 * </pre>
                 * @property {String} caption Текст в меню выбора справочников. Опция актуальна, когда для поля связи установлено несколько справочников.
                 * Открыть справочник можно через меню выбора справочников или с помощью метода {@link showSelector}.
                 * Меню выбора справочников - это кнопка, которая расположена внутри поля связи с правого края:
                 * ![](/FieldLink03.png)
                 * Изменять положение этой кнопки нельзя. Когда для поля связи установлен только один справочник, клик по кнопке меню производит его открытие.
                 * Когда для поля связи установлено несколько справочников, клик по меню открывает подменю для выбора нужного справочника.
                 * Опция caption определяет название справочника в этом подменю:
                 * ![](/FieldLink02.png)
                 * @property {String} template Компонент, на основе которого организован справочник.
                 * Список значений справочника строится на основе любого компонента, который можно использовать для {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/list/ отображения данных в списках}:
                 * <ul>
                 *    <li>использование компонента {@link SBIS3.CONTROLS/DataGridView}: ![](/FieldLink00.png) </li>
                 *    <li>использование компонента {@link SBIS3.CONTROLS/Tree/DataGridView}: ![](/FieldLink01.png) </li>
                 * </ul>
                 * Подробнее о правилах создания компонента для справочника поля связи вы можете прочитать в разделе <a href="/doc/platform/developmentapl/interface-development/components/textbox/field-link/">Поле связи</a>.
                 * @property {Object} componentOptions
                 * Группа опций, которые передаются в секцию _options компонента из опции template. На его основе строится справочник.
                 * Значения переданных опций можно использовать в дочерних компонентах справочника через инструкции шаблонизатора.
                 * Например, передаём опции для построения справочника:
                 * <pre class="brush: xml">
                 *     <option name="template">Examples/MyArea/MyDatGridView</option>
                 *     <options name="componentOptions">
                 *        <option name="myShowHeadConfig" type="boolean">true</option>
                 *        <option name="myPageSizeConfig" type="number">5</option>
                 *     </options>
                 * </pre>
                 * При построении справочника на основе компонента SBIS3.MyArea.MyComponent значения опций myShowHeadConfig и myPageSizeConfig будут переданы в его секцию _options.
                 * Они переопределят уже установленные значения опций, если такие есть.
                 * Чтобы использовать значений опций в дочерних контролах компонента SBIS3.MyArea.MyDatGridView, нужно использовать инструкции шаблонизатора в вёрстке компонента:
                 * <pre class="brush: xml">
                 *     <component data-component="SBIS3.CONTROLS/Tree/CompositeView" name="browserView">
                 *        <option name="showHead">{{=it.myShowHeadConfig}}</option>
                 *        <option name="pageSize">{{=it.myPageSizeConfig}}</option>
                 *         . . .
                 *     </component>
                 * </pre>
                 * @translatable caption
                 */
                /**
                 * @cfg {Array.<Dictionaries>} Устанавливает справочники для поля связи.
                 * @remark file FieldLink-dictionaries.md
                 * @example
                 * Настройка двух справочников для выбора в поле связи:
                 * ![](/FieldLink02.png)
                 * Фрагмент верстки:
                 * <pre class="brush: xml">
                 *     <options name="dictionaries" type="array">
                 *        <options>
                 *           <option name="caption">Сотрудники</option>
                 *           <option name="template">Examples/MyArea/DictEmployees</option>
                 *        </options>
                 *        <options>
                 *           <option name="caption">Партнеры</option>
                 *           <option name="template">Examples/MyArea/DictPartners</option>
                 *        </options>
                 *     </options>
                 * </pre>
                 * @see setDictionaries
                 * @see chooserMode
                 */
                dictionaries: [],
                /**
                 * @cfg {Boolean} Устанавливает режим добавления комментариев в поле связи.
                 * * true Разрешается ввод комментариев в поле связи.
                 * * false Запрещается ввод комментариев в поле связи.
                 * @remark
                 * Опция позволяет установить режим работы поля связи, в котором после выбора значения допускается добавление комментариев внутри поля ввода.
                 * Добавление комментариев поддерживается только, когда поле связи установлено в режим единичного выбора значений.
                 * Режим единичного или множественого выбора значений в поле связи устанавливается опцией {@link multiselect}.
                 * До момента ввода комментария справа от выбранного значения в поле связи будет отображаться текст, настраиваемый в опции {@link placeholder}.
                 * @example
                 * Пример настройки режима добавления комментария в поле связи:
                 * фрагмент верстки:
                 * <pre class="brush: xml">
                 *     <option name="alwaysShowTextBox">true</option>
                 * </pre>
                 * иллюстрация работы:
                 * ![](/FieldLink04.png)
                 * @deprecated
                 */
                alwaysShowTextBox: false,
                /**
                 * @cfg {Boolean} Устанавливает для текста выбранных значений форматирование: полужирное начертание.
                 */
                boldItems: false,
                /**
                 * @cfg {Boolean} Устанавливает для текста выбранных значений форматирование: полужирное начертание и размер шрифта 15px.
                 */
                bigItems: false,
                /**
                 * @cfg {Boolean} Устанавливает для текста выбранных значений форматирование: при наведении курсора применяется подчеркивание текста.
                 */
                underlinedItems: false,
                /**
                 * @cfg {Boolean} Устанавливает отображение кнопки, с помощью которой производится открытие справочников.
                 */
                showSelector: true,
                /**
                 * @cfg {Boolean} Использовать для выбора {@link SBIS3.CONTROLS/Action/SelectorAction}
                 */
                useSelectorAction: false,
                /**
                 * @cfg {String} Устанавливает режим открытия компонента выбора.
                 * @variant dialog Открытие производится в новом диалоговом окне.
                 * @variant floatArea Открытие производится на всплывающей панели.
                 */
                selectMode: 'floatArea',
                /**
                 * @cfg {Boolean} Скрывает отображение (устанавливает CSS-свойство "display:none") контрола "Поле связи", если выполнены два условия: опция {@link enabled}=false и отсутствуют выбранные записи.
                 */
                hideIfEmpty: false,
                /**
                 * @noshow
                 * @depreacted
                 */
                saveParentRecordChanges: false,
                /* FIXME до перехода на переворот на проекции
                 https://inside.tensor.ru/opendoc.html?guid=7ec62a96-9fdc-4295-b6f0-8afda6de5190&des=
                 Задача в разработку 05.09.2016 R! В 3.7.4.200 Мальцев сделал более правильный и универсальный способ переворота на проекции. Нужно …
                 */
                reverseItemsOnListRevert: true,
                /**
                 * @noshow
                 * @depreacted
                 */
                menuSelector: false
             }
          },

          $constructor: function() {
             var commandDispatcher = CommandDispatcher,
                 self = this;

             this._publish('onItemActivate');

             commandDispatcher.declareCommand(this, 'clearAllItems', this._dropAllItems);
             commandDispatcher.declareCommand(this, 'showAllItems', this._showAllItems);
             commandDispatcher.declareCommand(this, 'showSelector', this._showSelector);

             this.subscribe('onListItemSelect', function (event, item) {
                /* Чтобы не было лишнего запроса на БЛ, добавим рекорд в набор выбранных */
                /* Требуется делать клон т.к. :
                   запись передаётся по ссылке и любые действия с ней будут отображаться и в списке.
                   Особенно актуально это когда зибниден selectedItem в добавлении по месту. */
                this.addSelectedItems([item.clone()]);
                _private.itemSelectHandler(this);
                this.setText('');
             });

            /* При изменении выбранных элементов в поле связи - сотрём текст.
               Достаточно отслеживать изменение массива ключей,
               т.к. это событие гарантирует изменение выбранных элементов
               Это всё актуально для поля связи без включенной опции alwaysShowTextBox,
               если она включена, то логика стирания текста обрабатывается по-другому. */
            this.subscribe('onSelectedItemsChange', function(event, result, changed) {
               _private.itemSelectHandler(self);

               /* При добавлении элементов надо запустить валидацию,
                  если же элементы были удалены,
                  то валидация будет запущена либо эрией, либо по уходу фокуса из поля связи (По стандарту). */
               if(changed.added.length && !self._isEmptySelection()) {
                  /* После добавления записи в поле связи с единичным выбором скрывается поле ввода(input), и если до
                     этого компонент был активен, то нативный браузерный фокус с поля ввода (input), улетит на body. После этого
                     становится невозможно обрабатывать клавиатурные события, поэтому вернём фокус обратно на компонент. */
                  if(this.isActive() && !this._isInputVisible()) {
                     this._getElementToFocus().focus();
                  }
                  /* Надо дожидаться загрузки выбранных записей,
                     т.к. часто валидируют именно по ним,
                     или же по значениям в контексте */
                  self.getSelectedItems(true).addCallback(function(list) {
                     self.validate();
                     return list;
                  });
               }
            });

            if(this._options.oldViews) {
               IoC.resolve('ILogger').log('FieldLink', 'В 3.8.0 будет удалена опция oldViews, а так же поддержка старых представлений данных на диалогах выбора.');
            }
          },

          _updateTextBoxVisibility: function() {
             var
                drawHiddenTextBoxField = !this.getMultiselect() && this.getSelectedKeys().length > 0 && !this._options.alwaysShowTextBox;
             $('.controls-InputRender__fieldWrapper', this.getContainer()).toggleClass('ws-invisible', drawHiddenTextBoxField);
          },

          init: function() {
             FieldLink.superclass.init.apply(this, arguments);

             if(this._options.useSelectorAction) {
                ItemsSelectionUtil.initSelectorAction(this._getSelectorAction(), this);
             }

             this.getContainer().on('mousedown', this._onMouseDownHandler.bind(this));

             if(this._options.menuSelector) {
                var flMenu = this.getChildControlByName('fieldLinkMenu');
                flMenu.setItems(this._options.dictionaries);
                this.subscribeTo(flMenu, 'onMenuItemActivate', this._menuItemActivatedHandler);
             }

             this.subscribeTo(this, 'onAfterVisibilityChange', function(event, visibility) {
                if (visibility) {
                   this._onResizeHandler();
                }
             });
             // Из-за того что resizeHandler не всегда зовется - искуственно вызываем его по init.
             if (!this._isEmptySelection() && (this.getMultiselect() || this.getProperty('alwaysShowTextBox'))) {
                this._onResizeHandler();
             }
          },

          _initLinkCollectionEvents: function() {
             var self = this;

             /* По стандарту, если открыта выпадашка всех записей, то по уход фокуса/вводу текста она должна скрываться. */
             this.subscribe('onTextChange', this._linkCollection.hidePicker.bind(this._linkCollection));

             this.subscribeTo(this._linkCollection, 'onDrawItems', this._onDrawItemsCollection.bind(this))
                .subscribeTo(this._linkCollection, 'onCrossClick', this._onCrossClickItemsCollection.bind(this))
                .subscribeTo(this._linkCollection, 'onItemActivate', this._onItemActivateItemsCollection.bind(this))
                .subscribeTo(this._linkCollection, 'onClosePicker', this._onItemActivateItemsCollection.bind(this))
                .subscribeTo(this._linkCollection, 'onShowPicker', this._onItemActivateItemsCollection.bind(this))
                .subscribeTo(this._linkCollection, 'onFocusIn', function() {
                   // Из за того, что фокус устанавливается программно, нужно выставить флаг fromTouch -
                   // так как нажатие произошло на поле связи, но не на поле ввода, но фокус остался в поле ввода
                   if (constants.browser.isMobilePlatform && self._isInputVisible()) {
                      self._fromTouch = true;
                   }
                   self.setActive(true);
                });
          },

          _onMouseDownHandler: function(event) {
             var
                $target = $(event.target);
             if (this._options.multiselect && $target.hasClass('controls-FieldLink__showAllLinks')) {
                /* Открывать выпадашку со всеми выбранными записями надо по событию mousedown, т.к. это единственное событие
                 которое стреляет раньше фокуса. В противном случае автодополнение будет мограть, если включена опиция autoShow,
                 потому что оно показывается по фокусу. */
                this._showAllItems();
                /* При клике на кнопку переводим нативный фокус обратно в поле ввода */
                this._getElementToFocus().focus();
                event.preventDefault();
             }
          },

          _onClickHandler: function(event) {
             var
                $target;
             FieldLink.superclass._onClickHandler.apply(this, arguments);
             if (event.originalEvent.detail <= 1 || constants.browser.isIE) {
                $target = $(event.target);
                if ($target.hasClass('controls-FieldLink__showSelector-button')) {
                   this.sendCommand('showSelector');
                   return;
                }
                if ($target.hasClass('controls-FieldLink__dropAllLinks')) {
                   this.sendCommand('clearAllItems');

                }
             }
          },
   
          _getSelectorAction: memoize(function() {
             return new SelectorAction({
                mode: this._getOption('selectMode'),
                visible: false,
                tabindex: -1,
                parent: this
             });
          }, '_getSelectorAction'),

           _getShowAllConfig: function(){
               /* Если не передали конфигурацию диалога всех записей для автодополнения,
                то по-умолчанию возьмём конфигурацию первого словаря */
               if(Object.isEmpty(this._options.showAllConfig)) {
                   return this._options.dictionaries[0];
               }
               return this._options.showAllConfig;
           },
          
          _notify: function(eventName) {
             /* Чтобы не запускался поиск в автодополнении, когда есть выбранная запись и включен комментарий */
             if(eventName === 'onSearch' && this._options.alwaysShowTextBox && !this._isEmptySelection()) {
                return false;
             }
             return ItemsSelectionUtil.delayedNotify(
                FieldLink.superclass._notify,
                arguments,
                this);
          },

          /**
           * Обработчик нажатия на меню(элементы меню), открывает диалог выбора с соответствующим шаблоном
           * @private
           */
          _menuItemActivatedHandler: function(e, item) {
             var rec = this.getItems().getRecordById(item);
             this.getParent().showSelector(rec.get('template'), rec.get('componentOptions'), rec.get('selectionType'));
          },

          /**
           * Устанавливает набор справочников для поля связи. Подробнее о справочниках вы можете прочитать в описании к опции {@link dictionaries}.
           * @param {Array.<Dictionaries>} dictionaries Конфигурация справочников поля связи.
           * @example
           * Установим для поля связи два справочника:
           * <pre>
           *     myFieldLink.setDictionaries(
           *        [
           *           {
           *              caption: 'Сотрудники',
           *              template: 'Examples/MyArea/DictEmployees' // Компонент, на основе которого будет построен справочник поля связи
           *              componentOptions: {
           *                 myShowHeadConfig: true,
           *                 myPageSizeConfig: 5
           *              }
           *           },
           *           {
           *              caption: 'Сотрудники',
           *              template: 'Examples/MyArea/DictEmployees' // Компонент, на основе которого будет построен справочник поля связи
           *           }
           *        ]
           *     );
           * </pre>
           * @see dictionaries
           */
          setDictionaries: function(dictionaries) {
             this._options.dictionaries = dictionaries;
             if(this._options.menuSelector) {
                this.getChildControlByName('fieldLinkMenu').setItems(dictionaries);
             }
             this._notifyOnPropertyChanged('dictionaries');
          },


          /**
           * Для поля связи требуется своя реализация метода setSelectedKey, т.к.
           * Selectable расчитывает на наличие проекции и items, которых в поле связи нет.
           * + полю связи не требуется единичная отрисовка item'a, т.к. при синхронизации selectedKey и selectedKeys,
           * всегда будет вызываться метод drawSelectedItems
           * @param key
           */
          setSelectedKey: function(key) {
             this._options.selectedKey = key;
             this._notifySelectedItem(this._options.selectedKey);
          },

          /**
           * Открывает справочник для поля связи.
           * @remark
           * Метод  используется для открытия справочника из JS-кода компонента.
           * Подробно о настройке и работе со справочниками можно прочесть в описании к опции {@link dictionaries}.
           * @example
           * @param {String|Object.<String, *>} template Компонент или конфигурация (объект) компонета, который будет использован для построения справочника.
           * @param {Object} componentOptions Опции, которые будут использованы в компоненте при построении справочника.
           * Подробное описание можно прочесть {@link SBIS3.CONTROLS/FieldLink/Dictionaries.typedef здесь}.
           * @example
           * <pre>
           *     this.showSelector(
           *        'Examples/MyArea/MyDictionary',
           *        {
           *           title: 'Сотрудники предприятия'
           *        }
           *     );
           * </pre>
           * @see dictionaries
           * @see setDictionaries
           */
          showSelector: function(template, componentOptions, selectionType) {
             var actionCfg = {
                   selectionType: selectionType,
                   selectedItems: this.getSelectedItems(),
                   multiselect: this.getMultiselect(),
                   opener: this
                },
                cfg;

             if(typeof template !== 'object') {
                cfg = {
                   template: template,
                   componentOptions: componentOptions
                };
             } else {
                cfg = template;
             }

             this.hidePicker();
             this._linkCollection && this._linkCollection.hidePicker();
             
             /* При открытии диалога выбора необходимо очистить список в автодополнении,
                т.к. на диалоге выбора могут производить изменения / удаление записей */
             if(this._list && this._list.getItems() && this._getOption('autoShow')) {
                this._list.getItems().clear();
             }

             if(this._options.useSelectorAction) {
                this._getSelectorAction().execute(wsCoreMerge(actionCfg, cfg));
             } else {
                this._showChooser(cfg.template, cfg.componentOptions, cfg.dialogOptions, cfg);
             }
          },

          _showChooser: function() {
             if(this._options.useSelectorAction) {
                this.showSelector.apply(this, arguments);
             } else {
                FieldLink.superclass._showChooser.apply(this, arguments);
             }
          },

          _showSelector: function(key) {
             var config;

             if(key) {
                config = objectFind(this._options.dictionaries, function (elem) {
                   return elem.name === key;
                });
             } else {
                config = this._options.dictionaries[0];
             }

             if(config) {
                this.showSelector(config);
                /* Чтобы остановить всплытие комманды */
                return true;
             }
          },

          setActive: function(active, shiftKey, noFocus, focusedControl) {
             var wasActive = this.isActive();

             FieldLink.superclass.setActive.call(this, active, shiftKey, noFocus, focusedControl);

             /* Для Ipad'a надо при setActive устанавливать фокус в поле ввода,
                иначе не покажется клавиатура, т.к. установка фокуса в setAcitve работает асинхронно,
                а ipad воспринимает установку фокуса только в потоке кода, который работает после браузерных событий.
                + добавляю проверку, что компоент был до этого неактивен (такая проверка есть и в контроловском setActive),
                в противном случае будут лишние установки фокуса в поле ввода, из-за чего будет мограть саггест на Ipad'e */
             if (active && !wasActive && this._needFocusOnActivated() && this.isEnabled() && constants.browser.isMobilePlatform) {
                this._getElementToFocus().focus();
                EventBus.globalChannel().notify('MobileInputFocus');
             } else {
                EventBus.globalChannel().notify('MobileInputFocusOut');
             }
          },

          setMultiselect: function(multiselect) {
             FieldLink.superclass.setMultiselect.apply(this, arguments);
             this.getContainer().toggleClass(classes.MULTISELECT, Boolean(multiselect));
             this._updateTextBoxVisibility();
          },

          // FIXME костыль, выписана задача:
          // https://inside.tensor.ru/opendoc.html?guid=90fbc224-849e-485d-b843-2a0bb47871e7&des=
          // Задача в разработку 15.03.2017 Подумать, как жить в условиях что типы полей фильтра могут меняться, а в историю может сохраниться п…
          setSelectedKeys: function(keys) {
             keys = _private.keysFix(keys);
             FieldLink.superclass.setSelectedKeys.call(this, keys);
          },

          /** Эти сеттеры нужны, потому что опцию надо пробросить в дочерний компонент, рисующий записи **/

          /**
           * {String} Устанавливает поле элемента коллекции, которое является идентификатором записи
           * @deprecated Используйте {@link setIdProperty}.
           */
          setKeyField: function(keyField) {
             IoC.resolve('ILogger').log('FieldLink', 'Метод setKeyField устарел, используйте setIdProperty');
             this.setIdProperty(keyField);
          },

          /**
           * {String} Устанавливает поле элемента коллекции, которое является идентификатором записи
           * @example
           * <pre class="brush:xml">
           *     <option name="idProperty">Идентификатор</option>
           * </pre>
           * @see items
           * @see displayProperty
           * @see setDataSource
           * @param {String} idProperty
           */
          setIdProperty: function(idProperty) {
             FieldLink.superclass.setIdProperty.call(this, idProperty);
             this._linkCollection && this._linkCollection.setIdProperty(idProperty);
          },

          /**
           * {String} Устанавливает поле элемента коллекции, из которого отображать данные
           * @deprecated Используйте {@link setDisplayProperty}.
           */
          setDisplayField: function(displayProperty) {
             IoC.resolve('ILogger').log('FieldLink', 'Метод setDisplayField устарел, используйте setDisplayProperty');
             this.setDisplayProperty(displayProperty);
          },

          /**
           * {String} Устанавливает поле элемента коллекции, из которого отображать данные
           * @example
           * <pre class="brush:xml">
           *     <option name="displayProperty">Название</option>
           * </pre>
           * @remark
           * Данные задаются либо в опции {@link items}, либо методом {@link setDataSource}.
           * Источник данных может состоять из множества полей. В данной опции необходимо указать имя поля, данные
           * которого нужно отобразить.
           * @see idProperty
           * @see items
           * @see setDataSource
           * @param {String} displayProperty
           */
          setDisplayProperty: function(displayProperty) {
             FieldLink.superclass.setDisplayProperty.call(this, displayProperty);
             this._linkCollection && this._linkCollection.setProperty('displayProperty', displayProperty);
          },

          setItemTpl: function(itemTpl) {
             FieldLink.superclass.setItemTpl.call(this, itemTpl);
             if (!this._isEmptySelection() && !this._linkCollection) {
                this._createLinkCollection();
             }
             if (this._linkCollection) {
                this._linkCollection.setItemTpl(itemTpl);
                this._linkCollection.redraw();
             }
          },

          setItemContentTpl: function(itemTpl) {
             FieldLink.superclass.setItemContentTpl.call(this, itemTpl);
             if (this._linkCollection) {
                this._linkCollection.setItemContentTpl(itemTpl);
                this._linkCollection.redraw();
             }
          },

          /**********************************************************************************************/

          _getAdditionalChooserConfig: function () {
             var selectedKeys = this._isEmptySelection() ? [] : this.getSelectedKeys();

             return {
                currentValue: selectedKeys,
                selectorFieldLink: true,
                multiSelect: this._options.multiselect,
                selectedRecords: []
             };
          },

          _modifyOptions: function(baseCfg, parsedOptions, attrToMerge) {
             baseCfg.selectedKeys = _private.keysFix(baseCfg.selectedKeys);

             var cfg = FieldLink.superclass._modifyOptions.apply(this, arguments),
                 classesToAdd = ['controls-FieldLink'],
                 selectedKeysLength,
                 items;

             selectedKeysLength = cfg.selectedKeys.length;

             if(cfg.multiselect) {
                classesToAdd.push(classes.MULTISELECT);
             }

             if(selectedKeysLength || cfg.selectedKey !== null) {
                classesToAdd.push(classes.SELECTED);

                if(selectedKeysLength === 1 || !selectedKeysLength) {
                   classesToAdd.push(classes.SELECTED_SINGLE);
                }
             }

             if(cfg.selectedItem && cInstance.instanceOfModule(cfg.selectedItem, 'WS.Data/Entity/Model')) {
                items = new List({items: [cfg.selectedItem]});
             } else if (cfg.selectedItems) {
                items = cfg.selectedItems;
             }

             if(items) {
                cfg.preRenderItems = items;
             }

             /* className вешаем через modifyOptions,
                так меньше работы с DOM'ом */
             _addOptionsFromClass(cfg, attrToMerge);
             _addOptionsByState(cfg);

             if (cfg.hideIfEmpty && !cfg.enabled && !cfg._isEmptySelection(cfg)) {
                classesToAdd.push('ws-hidden');
             }

             cfg.cssClassName += ' ' + classesToAdd.join(' ');
             return cfg;
          },

          _toggleShowAllButtonState: function(enabled) {
             this._showAllButton
                .toggleClass('controls-FieldLink__showAllLinks-disabled', !enabled)
                .toggleClass('controls-FieldLink__showAllLinks-enabled', enabled);
          },

          _getInputMinWidth: function() {
             var fieldWrapper = this.getContainer().find('.controls-TextBox__wrapper'),
                 afterFieldWrapper = this._getAfterFieldWrapper();

             /* По стандарту минимальная ширина поля ввода - 33%, но не более 100 */
              var minWidthFieldWrapper = (fieldWrapper[0].offsetWidth - afterFieldWrapper[0].offsetWidth)/100*33;
              return (minWidthFieldWrapper < 100) ? minWidthFieldWrapper : 100;
          },

          /** Обработчики событий контрола отрисовки элементов **/
          _onDrawItemsCollection: function() {
             var itemsWidth = 0,
                 toAdd = [],
                 isEnabled = this.isEnabled(),
                 isInputVisible = this._isInputVisible() || this._options.alwaysShowTextBox,
                 availableWidth, items, additionalWidth, itemWidth, itemsCount, item, showAllLinkWidth, needResize;

             if(this._linkCollection && !this._linkCollection.isPickerVisible()) {
                if (!this._isEmptySelection()) {
                   items = this._linkCollection.getContainer().find('.controls-FieldLink__item');
                   itemsCount = items.length;
                   needResize = isInputVisible || (this.getMultiselect() && !this.isEnabled() && itemsCount > 1);

                   /* Не надо вызывать пересчёт элементов в случаях:
                      1) Единичный выбор - расчёт ширины сделан на css
                      2) Множественный выбор в задизейбленом состоянии с одним элементом,
                         если элемент 1 - то он должен полностью влезать в поле связи, сделано на css. */
                   if (needResize) {
                      additionalWidth = (isEnabled ? this._getAfterFieldWrapper().outerWidth() : 0) + parseInt(this._container.css('border-left-width'))*2;

                      /* Для multiselect'a и включённой опции alwaysShowTextBox
                       добавляем минимальную ширину поля ввода (т.к. оно не скрывается при выборе */
                      if (this._options.multiselect || this._options.alwaysShowTextBox) {
                         /* Необходмо показать кнопку заранее для правильных замеров. */
                         this._toggleShowAllButton(true);
                         //FireFox почему то иногда неверно считает ширину кнопки '...', выписана задача
                         showAllLinkWidth = this._showAllButton ? this._showAllButton.outerWidth() + (constants.browser.firefox ? 2 : 0) : 0;
                         /* Если поле звязи задизейблено, то учитываем ширину кнопки отображения всех запией */
                         additionalWidth += parseInt(this.isEnabled() ?
                                  this._getInputMinWidth() + (itemsCount > 1 ? showAllLinkWidth : 0) :
                                  showAllLinkWidth);
                      }

                      /* Высчитываем ширину, доступную для элементов */
                      availableWidth = this._container[0].getBoundingClientRect().width - additionalWidth;

                      /* Считаем, сколько элементов может отобразиться */
                      for (var i = itemsCount - 1; i >= 0; i--) {
                         item = items[i];
                         itemWidth = Math.ceil(item.getBoundingClientRect().width);

                         if ((itemsWidth + itemWidth) > availableWidth) {
                            this._toggleShowAllButton(itemsCount > 1);
                            /* Если ни один элемент не влезает, то устанавливаем первому доступную ширину */
                            if (!itemsWidth) {
                               $(item).outerWidth(availableWidth);
                               toAdd.push(item);
                            }
                            break;
                         }
                         toAdd.unshift(item);
                         itemsWidth += itemWidth;
                      }

                      if (toAdd.length < itemsCount) {
                         /* В задизейбленом состоянии не надо перерисовывать,
                            надо только показать кнопку */
                         if(this.isEnabled()) {
                            this._linkCollection._getItemsContainer().html(toAdd);
                         }
                         this._toggleShowAllButton(true);
                      } else {
                         this._toggleShowAllButton(false);
                      }
                   }
                }
             }
          },
          _onCrossClickItemsCollection: function(event, key) {
             this.removeItemsSelection([key]);
             if(!this._options.multiselect && this._options.alwaysShowTextBox) {
                this.setText('');
             }

             if(this.isActive()) {
                this._getElementToFocus().focus();
             }
          },
          _onItemActivateItemsCollection: function(event, key) {
             ItemsSelectionUtil.onItemClickNotify.call(this, key);
          },
          /**************************************************************/

          _getShowSelectorContainer: function() {
             return this._container.find('.controls-FieldLink__showSelector')[0];
          },

          _observableControlFocusHandler: function(event) {
             /* Не надо обрабатывать приход фокуса:
                1) если у нас есть выбрынные элементы при единичном выборе, в противном случае, автодополнение будет посылать лишний запрос,
                   хотя ему отображаться не надо.
                2) Нативный фокус на кнопке открытия справочника (значит кликнули по кнопке, и сейчас откроется справочник)
                3) Фокус пришел из автодополнения
             */
             if(!this._isInputVisible() || this._getShowSelectorContainer() === document.activeElement ||
                (event && event.relatedTarget && ControlHierarchyManager.checkInclusion(this, event.relatedTarget) && !contains(this.getContainer(), event.relatedTarget))) {
                return false;
             }
             FieldLink.superclass._observableControlFocusHandler.apply(this, arguments);
          },

          _isInputVisible: function() {
             return !(!this._isEmptySelection() && !this._options.multiselect) && this.isEnabled();
          },

          _getElementToFocus: function() {
             /* Поле ввода в поле связи может быть скрыто (при выборе записи с режимом единичного выбор),
                поэтому нельзя отдавать поле ввода в качестве элемента для фокуса, т.к. браузер не может проставить
                фокус на скрытый элемент, и он улетит на body. Но оставить фокус на компоненте необходимо для обработки событий,
                для этого переводим фокус на контейнер поля связи */
             return this._isInputVisible() || this._options.alwaysShowTextBox ? FieldLink.superclass._getElementToFocus.apply(this, arguments) : this._container;
          },

          /**
           * Обрабатывает результат выбора из справочника
           * @param {Array} result
           * @private
           */
          _chooseCallback: function(result) {
             if(result && result.length) {
                var isModel = cInstance.instanceOfModule(result[0], 'WS.Data/Entity/Model');
                this.setText('');
                
                if(isModel) {
                   this.addSelectedItems(result);
                } else {
                   this.addItemsSelection(result);
                }
             }
          },

           /**
            * Возвращает строку, сформированную из текстовых значений полей выбранных элементов коллекции.
            * @remark
            * Метод формирует строку из значений полей выбранных элементов коллекции. Значения в строке будут перечислены через запятую.
            * Отображаемые значения определяются с помощью опции {@link displayProperty} или {@link itemContentTpl}.
            * @returns {string} Строка, сформированная из отображаемых значений в поле связи.
            * @see texValue
            * @see displayProperty
            * @see itemContentTpl
            */
          getTextValue: function() {
              var displayFields = [],
                  selectedItems = this.getSelectedItems(),
                  self = this;

              if(selectedItems) {
                 selectedItems.each(function(rec) {
                    displayFields.push(rec.get(self._options.displayProperty) || '');
                 });
              }

              return escapeTagsFromStr(displayFields.join(', ').replace(/<br>/g, '\n'), '\\w+');
          },

          _onResizeHandler: function() {
             FieldLink.superclass._onResizeHandler.apply(this, arguments);

             if(this._linkCollection && !this._linkCollection.isPickerVisible() && this._needRedrawOnResize()) {
                /* Почему надо звать redraw: поле связи может быть скрыто, когда в него проставили выбранные записи,
                   и просто пересчётом input'a тут не обойтись. Выполняться должно быстро, т.к. перерисовывается обычно всего 2-3 записи */
                this._linkCollection.redraw();
             }
          },

          _needRedrawOnResize: function () {
             var width = this._container[0].offsetWidth;

             /* В целях оптимизации запоминаем ширину, чтобы перерисовка вызывалась только если изменилась ширина поля связи */
             if(this._lastFieldLinkWidth !== width) {
                this._lastFieldLinkWidth = width;
                return true;
             }
             return false;
          },

          /**
           * Показывает все элементы поля связи в выпадающем списке
           * @private
           */
          _showAllItems: function() {
             if(this.isPickerVisible()) {
                this.hidePicker();
             }
             this._linkCollection && this._linkCollection.togglePicker();
          },

          /**
           * Удаляет все элементы поля связи,
           * ставит курсор в поле ввода
           * @private
           */
          _dropAllItems: function() {
             this.removeItemsSelectionAll();
             //в результате removeItemsSelectionAll стрелется событие и реакцием на него может быть уничтожение компонента
             //например в FilterPanel так происходит. Надо проверить что компонент еще жив
             if (!this.isDestroyed()) {
                this._inputField.focus();
                this._observableControlFocusHandler();
             }
          },

          setDataSource: function(ds, noLoad) {
             var source = this.getDataSource();

             this.once('onListReady', function(event, list) {
                if(!list.getDataSource()) {
                   list.setDataSource(ds, noLoad);
                }
             });
             FieldLink.superclass.setDataSource.apply(this, arguments);

             /* Если в поле связи есть выбранные ключи, то после установки сорса надо
                загрузить записи и отрисовать их.
                Если source был, то не будем вызывать лишнюю перерисовку. */
             if(!this._isEmptySelection() && !source) {
                this._loadAndDrawItems();
             }
          },

          _loadAndDrawItems: function(amount) {
             var linkCollectionContainer = this._linkCollection.getContainer();

             /* Нужно скрыть контрол отображающий элементы, перед загрузкой, потому что часто бл может отвечать >500мс и
              отображаемое значение в поле связи долго не меняется, особенно заметно в редактировании по месту. */
             linkCollectionContainer.addClass(classes.INVISIBLE);
             this.getSelectedItems(true, amount).addCallback(function(list){
                /* Если поле связи отрисовывается скрытым, необходимо сбросить запомненную ширину,
                   чтобы при отображении пересчитались размеры. */
                if(!this.isVisibleWithParents()) {
                   this._lastFieldLinkWidth = null;
                }
                linkCollectionContainer.removeClass(classes.INVISIBLE);
                this._linkCollection.setItems(list);
                return list;
             }.bind(this));
          },

          _drawSelectedItems: function(keysArr) {
             var keysArrLen = this._isEmptySelection() ? 0 : keysArr.length,
                 hasSelectedKeys = keysArrLen > 0;

             if (!this._options.multiselect && keysArrLen) {
                this._destroyCompatPlaceholder();
             } else if (!this._compatPlaceholder && this.isEnabled()) {
                this._createCompatiblePlaceholder();
             }

             /* Если удалили в пикере все записи, и он был открыт, то скроем его */
             if (!hasSelectedKeys) {
                this._toggleShowAllButton(false);
             }
             this._updateMultipleButtonsState();

             if (this._options.hideIfEmpty) {
                if (this._isEmptySelection() && !this.isEnabled()) {
                   this.getContainer().addClass('ws-hidden');
                } else {
                   this.getContainer().removeClass('ws-hidden');
                }
             }

             this.getContainer().toggleClass(classes.SELECTED, hasSelectedKeys)
                                .toggleClass(classes.SELECTED_SINGLE, keysArrLen === 1);

             if(!this._options.alwaysShowTextBox && !this.getMultiselect() && hasSelectedKeys) {
                $('.controls-InputRender__fieldWrapper', this.getContainer()).addClass('ws-invisible');
                this.hidePicker();
             } else {
                $('.controls-InputRender__fieldWrapper', this.getContainer()).removeClass('ws-invisible');
             }

             if (keysArrLen) {
                if (!this._linkCollection) {
                   this._createLinkCollection();
                }
                this._loadAndDrawItems(keysArrLen, this._options.pageSize);
             } else {
                if (this._linkCollection) {
                   this._destroyLinkCollection();
                }
             }
          },

          _prepareItems: function() {
             return ToSourceModel(
                FieldLink.superclass._prepareItems.apply(this, arguments),
                this.getProperty('dataSource'),
                this.getProperty('idProperty'),
                this.getProperty('saveParentRecordChanges')
             );
          },

          setListFilter: function(listFilter) {
             /* Если единичный выбор в поле связи, но textBox всё равно показывается(включена опция), запрещаем работу suggest'a */
             if(!this._isInputVisible() && this._options.alwaysShowTextBox) {
                FieldLink.superclass.setListFilter.call(this, listFilter, true);
             }
             FieldLink.superclass.setListFilter.apply(this, arguments);
          },

          showPicker: function() {
             /* Не показываем автодополнение если:
                1) Если открыт пикер, который показывает все выбранные записи
                2) Input скрыт */
             if(this._linkCollection && this._linkCollection.isPickerVisible() || !this._isInputVisible()) {
                return;
             }
             FieldLink.superclass.showPicker.apply(this, arguments);
             /* После отображения автодополнение поля связи может быть перевёрнуто (не влезло на экран вниз),
                при этом необходимо, чтобы самый нижний элемент в автодополнении был виден, а он может находить за скролом,
                поэтому при перевороте проскролим вниз автодополнение */
             this._scrollListToBottom();
          },

          /**
           * Метод для управления видимостью кнопки открытия справочника.
           * @param show {Boolean} - true - показать иконку, false - скрыть
           */
          toggleShowSelectorButton: function(show) {
             show ? this._createShowSelectorButton() : this._destroyShowSelectorButton();
          },

          _setEnabled: function() {
             this._lastFieldLinkWidth = null;
             if (this._showAllButton) {
                this._toggleShowAllButtonState(this.isEnabled());
             }
             this._getAfterFieldWrapper().toggleClass('ws-hidden', !this.isEnabled());
             this._container.find('.controls-FieldLink__beforeFieldWrapper')
                .toggleClass('controls-FieldLink__beforeFieldWrapper-enabled', this.isEnabled())
                .toggleClass('controls-FieldLink__beforeFieldWrapper-disabled', !this.isEnabled());
             if (this._options.hideIfEmpty) {
                if (this._isEmptySelection() && !this.isEnabled()) {
                   this.getContainer().addClass('ws-hidden');
                } else {
                   this.getContainer().removeClass('ws-hidden');
                }
             }
             FieldLink.superclass._setEnabled.apply(this, arguments);
          },

          _setVisibility: function() {
             this._lastFieldLinkWidth = null;
             FieldLink.superclass._setVisibility.apply(this, arguments);
          },

          /**
           * Конфигурация пикера
           */
          _setPickerConfig: function () {
             return {
                corner: 'bl',
                closeOnTargetMove: !constants.browser.isMobilePlatform,
                closeByExternalClick: true,
                targetPart: true,
                _canScroll: true,
                verticalAlign: {
                   side: 'top'
                },
                horizontalAlign: {
                   side: 'left'
                },
                handlers: {
                   onShow: this._checkListItemRevert.bind(this)
                }
             };
          },
   
          _getLoadingContainer: function() {
             return this.getContainer().find('.controls-FieldLink__fieldWrapper');
          },
   
          _showLoadingIndicator: function() {
             FieldLink.superclass._showLoadingIndicator.call(this);
             this._loadingIndicator.addClass('controls-FieldLink__indicator-position').removeClass('controls-Suggest__loadingIndicator-position');
          },

          _checkListItemRevert: function(){
             if(!this._options.reverseItemsOnListRevert) {
                return;
             }
             this._reverseList(this._isSuggestPickerRevertedVertical());
          },

          _isSuggestPickerRevertedVertical: function() {
             return this._picker.getContainer().hasClass('controls-popup-revert-vertical');
          },

          /* После отображения автодополнение поля связи может быть перевёрнуто (не влезло на экран вниз),
             при этом необходимо, чтобы самый нижний элемент в автодополнении был виден, а он может находить за скролом,
             поэтому при перевороте проскролим вниз автодополнение */
          _scrollListToBottom: function() {
             if(this._picker && this._isSuggestPickerRevertedVertical() && !cInstance.instanceOfMixin(this.getList(), 'SBIS3.CONTROLS/Mixins/TreeMixin')) {
                var pickerContainer = this._picker.getContainer(),
                    list = this.getList(),
                    newIndex;
                
                if (cInstance.instanceOfMixin(list, 'SBIS3.CONTROLS/Interfaces/IItemsControl')) {
                   list.getActiveView()._getScrollWatcher().scrollTo('bottom');
                } else {
                   pickerContainer[0].scrollTop = pickerContainer[0].scrollHeight;
                }
                
                /* При подскроле вниз всегда устанавливаем маркер на последнюю запись */
                if(cInstance.instanceOfMixin(list, 'SBIS3.CONTROLS/Mixins/Selectable')) {
                   newIndex = list.getItems().getCount() - 1;
                   
                   if(newIndex !== list.getSelectedIndex()) {
                      list.setSelectedIndex(newIndex);
                   }
                }
             }
          },
          /* После перерисовки списка автодополнения, пикер может менять своё положение,
             а перерисовка может вызываться не только платформенным кодом, но и прикладным, поэтому
             после перерисовки надо вызвать метод, обрабатывающий положение автодополнение */
          _onListDrawItems: function() {
             FieldLink.superclass._onListDrawItems.apply(this, arguments);
             this._checkListItemRevert();
             this._scrollListToBottom();
          },
          /**
           * Обрабатывает нажатие клавиш, специфичных для поля связи
           */
          _keyUpBind: function(e) {
             FieldLink.superclass._keyUpBind.apply(this, arguments);
             switch (e.which) {
                /* ESC закрывает все пикеры у поля связи(если они открыты) */
                case constants.key.esc:
                   if(this.isPickerVisible() || (this._linkCollection && this._linkCollection.isPickerVisible())) {
                      this.hidePicker();
                      this._linkCollection.hidePicker();
                      e.stopPropagation();
                   }
                   break;
             }
          },

          _keyDownBind: function(e) {
             FieldLink.superclass._keyDownBind.apply(this, arguments);
             if(this.isEnabled()) {
                switch (e.which) {
                   case constants.key.del:
                      if (!this.getText()) {
                         this.removeItemsSelectionAll();
                      }
                      break;
                   /* Нажатие на backspace должно удалять последние значение, если нет набранного текста */
                   case constants.key.backspace:
                      if (!this.getText() && !this._isEmptySelection()) {
                         var selectedKeys = this.getSelectedKeys();
                         this.removeItemsSelection([selectedKeys[selectedKeys.length - 1]]);
                      }
                      break;
                   case constants.key.tab:
                      this._linkCollection && this._linkCollection.hidePicker();
                }
             }
          },
          _createShowSelectorButton: function() {
             if (!$('.controls-FieldLink__showSelector', this.getContainer()).length) {
                $('.controls-FieldLink__afterFieldWrapper', this.getContainer()).append($(showSelectorButton(this._options)));
             }
          },
          _destroyShowSelectorButton: function() {
             if ($('.controls-FieldLink__showSelector', this.getContainer()).length) {
                $('.controls-FieldLink__showSelector', this.getContainer()).remove();
             }
          },
          _prepareShowAllButton: function() {
             if (!this._showAllButton) {
                this._showAllButton = $('<div class="controls-FieldLink__showAllLinks">&#133;</div>');
                this._container.find('.controls-FieldLink__beforeFieldWrapper')
                   .prepend(this._showAllButton);
             }
             this._toggleShowAllButtonState(this.isEnabled());
          },
          _prepareDropAllButton: function() {
             if (!this._dropAllButton) {
                this._dropAllButton = this._container.find('.controls-FieldLink__dropAllLinks');
                if (!this._dropAllButton.length) {
                   this._dropAllButton = $('<div class="controls-FieldLink__dropAllLinks controls-FieldLink__button icon-size icon-CloseNew" title="Очистить все"></div>');
                   this._container.find('.controls-FieldLink__afterFieldWrapper')
                      .prepend(this._dropAllButton);
                }
             }
          },
          _destroyShowAllButton: function() {
             if (this._showAllButton) {
                this._showAllButton.remove();
                this._showAllButton = null;
             }
          },
          _destroyDropAllButton: function() {
             if (this._dropAllButton) {
                this._dropAllButton.remove();
                this._dropAllButton = null;
             }
          },
          _updateMultipleButtonsState: function() {
             if (_private.selectedMultipleItems(this._options)) {
                this._prepareDropAllButton();
             } else {
                this._destroyDropAllButton();
             }
          },
          _toggleShowAllButton: function(show) {
             if (show) {
                this._prepareShowAllButton();
             } else {
                this._destroyShowAllButton();
             }
          },
          /* Заглушка, само поле связи не занимается отрисовкой */
          redraw: function () {

          },
          /* Заглушка, само поле связи не занимается загрузкой списка */
          reload: function () {

          },

          _getAfterFieldWrapper: function() {
             if(!this._afterFieldWrapper) {
                this._afterFieldWrapper = this.getContainer().find('.controls-FieldLink__afterFieldWrapper');
             }
             return this._afterFieldWrapper;
          },

          _createLinkCollection: function() {
             if (!$('.controls-FieldLink__beforeFieldWrapper', this.getContainer()).length) {
                $('.controls-TextBox__fieldWrapper', this.getContainer()).before(beforeFieldWrapper(this._options));
                this.reviveComponents();
                this._linkCollection = this.getChildControlByName('FieldLinkItemsCollection');
                this._initLinkCollectionEvents();
             } else {
                this._linkCollection = this.getChildControlByName('FieldLinkItemsCollection');
                this._initLinkCollectionEvents();
             }
          },

          _destroyLinkCollection: function() {
             this._linkCollection.destroy();
             this._linkCollection = undefined;
             $('.controls-FieldLink__beforeFieldWrapper', this.getContainer()).remove();
          },

          destroy: function() {
             if(this._linkCollection) {
                this._destroyLinkCollection();
             }

             this.getContainer().off('mousedown');

             FieldLink.superclass.destroy.apply(this, arguments);
          }
       });

       return FieldLink;

    });
