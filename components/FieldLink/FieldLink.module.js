define('js!SBIS3.CONTROLS.FieldLink',
    [
       "Core/CommandDispatcher",
       "Core/constants",
       "Core/IoC",
       "Core/core-instance",
       'Core/helpers/Function/forAliveOnly',
       'Core/helpers/Function/memoize',
       'js!SBIS3.CONTROLS.Utils.Contains',
       "Core/helpers/string-helpers",
       'Core/markup/ParserUtilities',
       'js!SBIS3.CONTROLS.ControlHierarchyManager',
       "js!SBIS3.CONTROLS.SuggestTextBox",
       "js!SBIS3.CONTROLS.ItemsControlMixin",
       "js!SBIS3.CONTROLS.MultiSelectable",
       "js!SBIS3.CONTROLS.ActiveMultiSelectable",
       "js!SBIS3.CONTROLS.Selectable",
       "js!SBIS3.CONTROLS.ActiveSelectable",
       "js!SBIS3.CONTROLS.SyncSelectionMixin",
       "js!SBIS3.CONTROLS.FieldLinkItemsCollection",
       "tmpl!SBIS3.CONTROLS.FieldLink/afterFieldWrapper",
       "tmpl!SBIS3.CONTROLS.FieldLink/beforeFieldWrapper",
       "tmpl!SBIS3.CONTROLS.FieldLink/textFieldWrapper",
       "js!SBIS3.CONTROLS.ITextValue",
       "js!SBIS3.CONTROLS.Utils.TemplateUtil",
       "js!SBIS3.CONTROLS.ToSourceModel",
       "js!WS.Data/Collection/List",
       "js!SBIS3.CONTROLS.Utils.ItemsSelection",
       "Core/helpers/Object/find",
       "js!SBIS3.CONTROLS.IconButton",
       "js!SBIS3.CONTROLS.Action.SelectorAction",
       'js!SBIS3.CONTROLS.FieldLink.Link',
       "js!SBIS3.CONTROLS.MenuIcon",
       "i18n!SBIS3.CONTROLS.FieldLink",
       'css!SBIS3.CONTROLS.FieldLink',
       'css!SBIS3.CONTROLS.Suggest'

    ],
    function (
        CommandDispatcher,
        constants,
        IoC,
        cInstance,
        forAliveOnly,
        memoize,
        contains,
        strHelpers,
        ParserUtilities,
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
        FieldLinkItemsCollection,

        /* Служебные шаблоны поля связи */
        afterFieldWrapper,
        beforeFieldWrapper,
        textFieldWrapper,
        /********************************************/
        ITextValue,
        TemplateUtil,
        ToSourceModel,
        List,
        ItemsSelectionUtil,
        objectFind
    ) {

       'use strict';

       var classes = {
          MULTISELECT: 'controls-FieldLink__multiselect',
          SELECTED: 'controls-FieldLink__selected',
          SELECTED_SINGLE: 'controls-FieldLink__selected-single',
          INPUT_MIN_WIDTH: 'controls-FieldLink__inputMinWidth',
          HIDDEN: 'ws-hidden'
       };

       var _private = {
          keysFix: function(keys) {
             if(keys !== undefined && !Array.isArray(keys)) {
                keys = [keys];
             }
             return keys;
          },
          
          isSimplePlaceholder: function(placeholder) {
             /**
              * Сюда может прилететь rkString
              * пока что это единственный способ ее идентифицировать
              */
             if (placeholder && placeholder.saveProtoM) {
                placeholder = '' + placeholder;
             }
             return typeof placeholder === 'string' && placeholder.indexOf('SBIS3.CONTROLS.FieldLink.Link') === -1;
          }
       };

       /**
        * Поле связи - это базовый контрол веб-фреймворка WS, который предназначен для выбора нескольких значений.
        * Контрол состоит из поля ввода и кнопки-меню для выбора справочника. Допускается конфигурация контрола, при которой будет использована только кнопка-меню.
        * Интерактивные демонстрационные примеры типовых конфигураций поля связи смотрите в описании к классу.
        * <br/>
        * Выбор значения для поля связи можно производить следующими способами:
        * <ol>
        *    <li>
        *       <b>Через справочник.</b>
        *       Справочник - это диалог выбора значений. Диалог строится на основе пользовательского компонента.
        *       Подробнее о правилах создания компонента для справочника поля связи вы можете прочитать в разделе <a href="http://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/textbox/field-link/dictionary/">Поле связи</a>.
        *       Набор справочников устанавливают с помощью опции {@link dictionaries}, а режим отображения открытого справочника - с помощью опции {@link chooserMode}.
        *    </li>
        *    <li>
        *       <b>Через автодополнение.</b>
        *       Автодополнение - это функционал отображения возможных результатов поиска по введенным символам. По умолчанию для поля связи автодополнение отключено.
        *       Чтобы при печати в поле ввода отображались релевантные для выбора значения, нужно для поля связи установить конфигурацию автодополнения в опциях {@link list}, {@link listFilter} и {@link text}.
        *       Чтобы отображать полный список значений автодополнения при переходе фокуса на контрол, используют опцию {@link autoShow}.
        *       Демонстрацию работы автодополнения с полем связи вы можете найти в блоке интерактивных примеров в описании к классу.
        *    </li>
        *    <li>
        *       <b>Через контекст контрола.</b>
        *       Этот способ основан работе с <a href="https://wi.sbis.ru/doc/platform/developmentapl/interface-development/core/context/">контекстом</a> контрола. Пример № 3 из описания класса поля связи демонстрирует возможности установки значения через контекст.
        *    </li>
        * </ol>
        * <br/>
        * Возможность выбора одного или нескольких значений устанавливается опцией {@link multiselect}. В режиме единичного выбора значений с помощью опции {@link alwaysShowTextBox} можно разрешить установку комментариев в поле ввода после того, как для поля связи выбрано значение.
        * <br/>
        * Чтобы добавить внутрь поля ввода подсказку, используйте опцию {@link placeholder}.
        * В {@link placeholder} можно класть html вёрстку и компоненты. {@link SBIS3.CONTROLS.FieldLink.Link} используется в качестве ссылки отрывающей справочник.
        * <br/>
        * Для корректного отображения поля связи рекомендуется установить компоненту фиксированную или минимальную ширину с помощью CSS-свойства width.
        *
        * @class SBIS3.CONTROLS.FieldLink
        * @extends SBIS3.CONTROLS.SuggestTextBox
        *
        * @author Герасимов Александр Максимович
        *
        * @mixes SBIS3.CONTROLS.MultiSelectable
        * @mixes SBIS3.CONTROLS.ActiveMultiSelectable
        * @mixes SBIS3.CONTROLS.Selectable
        * @mixes SBIS3.CONTROLS.ActiveSelectable
        * @mixes SBIS3.CONTROLS.SyncSelectionMixin
        * @mixes SBIS3.CONTROLS.ItemsControlMixin
        * @mixes SBIS3.CONTROLS.ITextValue
        *
        * @demo SBIS3.CONTROLS.Demo.FieldLinkDemo Пример 1. Поле связи в режиме множественного выбора значений. Выбор можно производить как через справочник, так и через автодополнение.
        * @demo SBIS3.CONTROLS.Demo.FieldLinkSingleSelect Пример 2. Поле связи в режиме единичного выбора значений. Выбор можно производить как через справочник, так и через автодополнение.
        * @demo SBIS3.CONTROLS.Demo.FieldLinkSingleSelectContext Пример 3. Поле связи в режиме единичного выбора значения. В этом примере выбор можно производить тремя способами: через справочник, через автодополнение и через два поля ввода.
        * Поля ввода привязаны к поля контекста, по которым устанавливается ключ и отображаемый текст выбранного значения поля связи. Для наглядности, вы можете изменить поле "Название" и "Ключ", чтобы увидеть результат.
        * @demo SBIS3.DOCS.SelectorButtonLink Пример 4. Поле связи в виде иконки, поле ввода отсутствует. Вызов справочника производится кликом по кнопке с иконкой. Все выбранные значения будут отображаться справа от кнопки.
        * В режиме множественного выбора сброс выбранных значений производится массово кликом по серому крестику.
        * @demo SBIS3.DOCS.SelectorButtonSingle Пример 5. Поле связи в виде кнопки-ссылки, поле ввода отсутствует. Вызов справочника производится кликом по ссылке. Все выбранные значения будут отображаться в качестве текста кнопки.
        * В режиме множественного выбора удаление выбранных значений производится массово кликом по серому крестику. Для корректного отображения кнопки-ссылки используется CSS-модификатор "controls-SelectorButton__asLink".
        *
        * @cssModifier controls-FieldLink__itemsEdited Устанавливает для текста выбранных значений форматирование: при наведении курсора применяется подчеркивание текста.
        * @cssModifier controls-FieldLink__itemsBold Устанавливает для текста выбранных значений форматирование: полужирное начертание.
        * @cssModifier controls-FieldLink__big-fontSize Устанавливает для текста выбранных значений форматирование: полужирное начертание и размер шрифта 15px.
        * @cssModifier controls-FieldLink__hideSelector Скрывает отображение (устанавливает CSS-свойство "display:none") кнопки, с помощью которой производят открытие справочников.
        * @cssModifier controls-FieldLink__hiddenIfEmpty Скрывает отображение (устанавливает CSS-свойство "display:none") контрола "Поле связи", если выполнены два условия: опция {@link enabled}=false и отсутствуют выбранные записи.
        *
        * @ignoreOptions tooltip alwaysShowExtendedTooltip loadingContainer observableControls pageSize usePicker filter saveFocusOnSelect selectedIndex
        * @ignoreOptions allowEmptySelection allowEmptyMultiSelection templateBinding includedTemplates resultBindings footerTpl emptyHTML groupBy
        * @ignoreMethods getTooltip setTooltip getExtendedTooltip setExtendedTooltip setEmptyHTML setGroupBy itemTpl
        * @ignoreEvents onListItemSelect onDataLoad onDataLoadError onBeforeDataLoad onDrawItems onFilterBuild onItemsReady
        *
        * @control
        * @public
        * @category Inputs
        */

       var FieldLink = SuggestTextBox.extend([MultiSelectable, ActiveMultiSelectable, Selectable, ActiveSelectable, SyncSelectionMixin, ItemsControlMixin, ITextValue],/** @lends SBIS3.CONTROLS.FieldLink.prototype */{
          /**
           * @name SBIS3.CONTROLS.FieldLink#textValue
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
          $protected: {
             _lastFieldLinkWidth: null,
             _options: {
                /* Служебные шаблоны поля связи (иконка открытия справочника, контейнер для выбранных записей */
                afterFieldWrapper: afterFieldWrapper,
                beforeFieldWrapper: beforeFieldWrapper,
                textFieldWrapper: textFieldWrapper,
                /**********************************************************************************************/
                 list: {
                   component: 'js!SBIS3.CONTROLS.DataGridView',
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
                 *    <li>использование компонента {@link SBIS3.CONTROLS.DataGridView}: ![](/FieldLink00.png) </li>
                 *    <li>использование компонента {@link SBIS3.CONTROLS.TreeDataGridView}: ![](/FieldLink01.png) </li>
                 * </ul>
                 * Подробнее о правилах создания компонента для справочника поля связи вы можете прочитать в разделе <a href="http://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/textbox/field-link/">Поле связи</a>.
                 * @property {Object} componentOptions
                 * Группа опций, которые передаются в секцию _options компонента из опции template. На его основе строится справочник.
                 * Значения переданных опций можно использовать в дочерних компонентах справочника через инструкции шаблонизатора.
                 * Например, передаём опции для построения справочника:
                 * <pre class="brush: xml">
                 *     <option name="template">js!SBIS3.MyArea.MyDatGridView</option>
                 *     <options name="componentOptions">
                 *        <option name="myShowHeadConfig" type="boolean">true</option>
                 *        <option name="myPageSizeConfig" type="number">5</option>
                 *     </options>
                 * </pre>
                 * При построении справочника на основе компонента SBIS3.MyArea.MyComponent значения опций myShowHeadConfig и myPageSizeConfig будут переданы в его секцию _options.
                 * Они переопределят уже установленные значения опций, если такие есть.
                 * Чтобы использовать значений опций в дочерних контролах компонента SBIS3.MyArea.MyDatGridView, нужно использовать инструкции шаблонизатора в вёрстке компонента:
                 * <pre class="brush: xml">
                 *     <component data-component="SBIS3.CONTROLS.TreeCompositeView" name="browserView">
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
                 *           <option name="template">js!SBIS3.MyArea.DictEmployees</option>
                 *        </options>
                 *        <options>
                 *           <option name="caption">Партнеры</option>
                 *           <option name="template">js!SBIS3.MyArea.DictPartners</option>
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
                 * @cfg {Boolean} Использовать для выбора {@link SBIS3.CONTROLS.Action.SelectorAction}
                 */
                useSelectorAction: false,
                /**
                 * @cfg {String} Устанавливает режим открытия компонента выбора.
                 * @variant dialog Открытие производится в новом диалоговом окне.
                 * @variant floatArea Открытие производится на всплывающей панели.
                 */
                selectMode: 'floatArea',
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
                this.setText('');
             });

            /* При изменении выбранных элементов в поле связи - сотрём текст.
               Достаточно отслеживать изменение массива ключей,
               т.к. это событие гарантирует изменение выбранных элементов
               Это всё актуально для поля связи без включенной опции alwaysShowTextBox,
               если она включена, то логика стирания текста обрабатывается по-другому. */
            this.subscribe('onSelectedItemsChange', function(event, result, changed) {
               if(self.getText() && !self._options.alwaysShowTextBox) {
                  /* Т.к. текст сбрасывается програмно, а searchMixin реагирует лишь на ввод текста с клавиатуры,
                   то надо позвать метод searchMixin'a, который сбросит текст и поднимет событие */
                  self.resetSearch();
               }

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
                     return list
                  })
               }
            });

            if(this._options.oldViews) {
               IoC.resolve('ILogger').log('FieldLink', 'В 3.8.0 будет удалена опция oldViews, а так же поддержка старых представлений данных на диалогах выбора.');
            }
          },

          init: function() {
             FieldLink.superclass.init.apply(this, arguments);

             var self = this,
                 linkCollection = this._getLinkCollection();

             /* По стандарту, если открыта выпадашка всех записей, то по уход фокуса/вводу текста она должна скрываться. */
             this.subscribe('onTextChange', linkCollection.hidePicker.bind(linkCollection));

             this.subscribeTo(linkCollection, 'onDrawItems', this._onDrawItemsCollection.bind(this))
                 .subscribeTo(linkCollection, 'onCrossClick', this._onCrossClickItemsCollection.bind(this))
                 .subscribeTo(linkCollection, 'onItemActivate', this._onItemActivateItemsCollection.bind(this))
                 .subscribeTo(linkCollection, 'onClosePicker', this._onItemActivateItemsCollection.bind(this))
                 .subscribeTo(linkCollection, 'onShowPicker', this._onItemActivateItemsCollection.bind(this))
                 .subscribeTo(linkCollection, 'onFocusIn', function() {
                     // Из за того, что фокус устанавливается программно, нужно выставить флаг fromTouch - 
                     // так как нажатие произошло на поле связи, но не на поле ввода, но фокус остался в поле ввода
                     if (constants.browser.isMobilePlatform && self._isInputVisible()) {
                        self._fromTouch = true;
                     }
                     self.setActive(true);
                 });

             if(this._options.useSelectorAction) {
                ItemsSelectionUtil.initSelectorAction(this._getSelectorAction(), this);
             }

             if(this._options.multiselect) {
                var showAllButton = this.getChildControlByName('showAllButton');
                /* Открывать выпадашку со всеми выбранными записями надо по событию mousedown, т.к. это единственное событие
                   которое стреляет раньше фокуса. В противном случае автодополнение будет мограть, если включена опиция autoShow,
                   потому что оно показывается по фокусу. */
                showAllButton.getContainer().on('mousedown', function () {
                   self._showAllItems();
                });

                /* При клике на кнопку переводим нативный фокус обратно в поле ввода */
                this.subscribeTo(showAllButton, 'onActivated', function() {
                   self._getElementToFocus().focus();
                });
             }

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
          },

          _getSelectorAction: memoize(function() {
             return this.getChildControlByName('FieldLinkSelectorAction');
          }, '_getSelectorAction'),

           _getShowAllConfig: function(){
               /* Если не передали конфигурацию диалога всех записей для автодополнения,
                то по-умолчанию возьмём конфигурацию первого словаря */
               if(Object.isEmpty(this._options.showAllConfig)) {
                   return this._options.dictionaries[0];
               }
               return this._options.showAllConfig;
           },

          _useNativePlaceHolder: function(text) {
             /* Если в placeholder положили компонент-ссылку, открывающую справочник,
                то будем использовать не нативный placeholder */
             return _private.isSimplePlaceholder(text || this.getProperty('placeholder'));
          },

          _setPlaceholder: function() {
             FieldLink.superclass._setPlaceholder.apply(this, arguments);
             this.reviveComponents();
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
           *              template: 'js!SBIS3.MyArea.DictEmployees' // Компонент, на основе которого будет построен справочник поля связи
           *              componentOptions: {
           *                 myShowHeadConfig: true,
           *                 myPageSizeConfig: 5
           *              }
           *           },
           *           {
           *              caption: 'Сотрудники',
           *              template: 'js!SBIS3.MyArea.DictEmployees' // Компонент, на основе которого будет построен справочник поля связи
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
           * Подробное описание можно прочесть {@link SBIS3.CONTROLS.FieldLink/dictionaries.typedef здесь}.
           * @example
           * <pre>
           *     this.showSelector(
           *        'js!SBIS3.MyArea.MyDictionary',
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
             this._getLinkCollection().hidePicker();
             
             /* При открытии диалога выбора необходимо очистить список в автодополнении,
                т.к. на диалоге выбора могут производить изменения / удаление записей */
             if(this._list && this._list.getItems() && this._getOption('autoShow')) {
                this._list.getItems().clear();
             }

             if(this._options.useSelectorAction) {
                this._getSelectorAction().execute(wsCoreMerge(actionCfg, cfg));
             } else {
                this._showChooser(cfg.template, cfg.componentOptions);
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
             
             /* КОСТЫЛЬ ДЛЯ 3.7.5.50
                https://inside.tensor.ru/opendoc.html?guid=6be48dda-796d-4de7-a377-7e66c67b4f8a&des=
                Задача в разработку 07.04.2017 В контроле надо поправить метод setActive Он в случае, если контрол активен всё равно выполняет для …  */
             noFocus = this._options.task_1173772355 ? this._isControlActive : noFocus;

             /* Хак, который чинит баг firefox с невидимым курсором в input'e.
              Это довольно старая и распростронённая проблема в firefox'e (а теперь еще и в хроме),
              повторяется с разными сценариями и с разными способомами почи)нки.
              В нашем случае, если фокус в input'e, то перед повторной установкой фокуса надо сделать blur (увести фокус из input'a).
              Чтобы это не вызывало перепрыгов фокуса, делаем это по минимальному таймауту. Выглядит плохо, но другого решения для FF найти не удлось.*/
             if(active && !this.getText() && this._isEmptySelection()) {
                var elemToFocus = this._getElementToFocus();

                setTimeout(forAliveOnly(function () {
                   if(elemToFocus[0] === document.activeElement && this._isEmptySelection()){
                      var suggestShowed = this.isPickerVisible();
                      elemToFocus.blur().focus();

                      //https://online.sbis.ru/opendoc.html?guid=19af9bf9-0d16-4f63-8aa8-6d0ef7ff0799
                      if (!suggestShowed && this.isPickerVisible() && !this._options.task1174306848) {
                         this.hidePicker();
                      }
                   }
                }, this), 30);
             }

             FieldLink.superclass.setActive.call(this, active, shiftKey, noFocus, focusedControl);

             /* Для Ipad'a надо при setActive устанавливать фокус в поле ввода,
                иначе не покажется клавиатура, т.к. установка фокуса в setAcitve работает асинхронно,
                а ipad воспринимает установку фокуса только в потоке кода, который работает после браузерных событий.
                + добавляю проверку, что компоент был до этого неактивен (такая проверка есть и в контроловском setActive),
                в противном случае будут лишние установки фокуса в поле ввода, из-за чего будет мограть саггест на Ipad'e */
             if (active && !wasActive && this._needFocusOnActivated() && this.isEnabled() && constants.browser.isMobilePlatform) {
                this._getElementToFocus().focus();
             }
          },

          setMultiselect: function(multiselect) {
             FieldLink.superclass.setMultiselect.apply(this, arguments);
             this.getContainer()
                .toggleClass(classes.MULTISELECT, Boolean(multiselect))
                .toggleClass(classes.INPUT_MIN_WIDTH, Boolean(multiselect || this._options.alwaysShowTextBox));
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
           * @deprecated
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
             this._getLinkCollection().setIdProperty(idProperty);
          },

          /**
           * {String} Устанавливает поле элемента коллекции, из которого отображать данные
           * @deprecated
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
             this._getLinkCollection().setProperty('displayProperty', displayProperty);
          },

          setItemTpl: function(itemTpl) {
             FieldLink.superclass.setItemTpl.call(this, itemTpl);
             this._getLinkCollection().setItemTpl(itemTpl);
          },

          setItemContentTpl: function(itemTpl) {
             FieldLink.superclass.setItemContentTpl.call(this, itemTpl);
             this._getLinkCollection().setItemContentTpl(itemTpl);
          },

          /**********************************************************************************************/

          _getAdditionalChooserConfig: function () {
             var selectedKeys = this._isEmptySelection() ? [] : this.getSelectedKeys();

             return {
                currentValue: selectedKeys,
                currentSelectedKeys: selectedKeys,
                selectorFieldLink: true,
                multiSelect: this._options.multiselect,
                selectedRecords: []
             };
          },

          _modifyOptions: function() {
             var cfg = FieldLink.superclass._modifyOptions.apply(this, arguments),
                 classesToAdd = ['controls-FieldLink'],
                 selectedKeysLength, items;

             cfg.selectedKeys = _private.keysFix(cfg.selectedKeys);
             selectedKeysLength = cfg.selectedKeys.length;

             if(cfg.multiselect) {
                classesToAdd.push(classes.MULTISELECT);
             }
             
             if(cfg.multiselect || cfg.alwaysShowTextBox) {
                classesToAdd.push(classes.INPUT_MIN_WIDTH);
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

             /* Чтобы вёрстка сразу строилась с корректным placeholder'ом, в случае, если там лежит ссылка */
             cfg._useNativePlaceholder = _private.isSimplePlaceholder(cfg.placeholder);
             
             /* className вешаем через modifyOptions,
                так меньше работы с DOM'ом */
             cfg.cssClassName += ' ' + classesToAdd.join(' ');
             return cfg;
          },
   
          _getLinkCollection: memoize(function() {
             return this.getChildControlByName('FieldLinkItemsCollection');
          }, '_getLinkCollection'),
          
          _getInputMinWidth: memoize(function() {
             var fieldWrapper = this.getContainer().find('.controls-FieldLink__fieldWrapper');
             return parseInt(window.getComputedStyle(fieldWrapper[0]).getPropertyValue('--min-width') || fieldWrapper.css('min-width'));
          }, '_getInputMinWidth'),

          /** Обработчики событий контрола отрисовки элементов **/
          _onDrawItemsCollection: function() {
             var linkCollection = this._getLinkCollection(),
                 itemsWidth = 0,
                 toAdd = [],
                 isEnabled = this.isEnabled(),
                 needResizeInput = this._isInputVisible() || this._options.alwaysShowTextBox,
                 availableWidth, items, additionalWidth, itemWidth, itemsCount, item, showAllLinkWidth;

             if(!linkCollection.isPickerVisible()) {
                if (!this._isEmptySelection()) {
                   items = linkCollection.getContainer().find('.controls-FieldLink__item');
                   itemsCount = items.length;

                   /* Не надо вызывать пересчёт элементов в случаях:
                      1) Единичный выбор - расчёт ширины сделан на css
                      2) Множественный выбор в задизейбленом состоянии с количеством элементов > 1,
                         сделано затемнение на css, если элемент 1 - то он должен полностью влезать в поле связи,
                         поэтому считать надо. */
                   if (needResizeInput) {
                      additionalWidth = (isEnabled ? this._getAfterFieldWrapper().outerWidth() : 0) + parseInt(this._container.css('border-left-width'))*2;

                      /* Для multiselect'a и включённой опции alwaysShowTextBox
                       добавляем минимальную ширину поля ввода (т.к. оно не скрывается при выборе */
                      if (this._options.multiselect || this._options.alwaysShowTextBox) {
                         /* Необходмо показать кнопку заранее для правильных замеров. */
                         this._toggleShowAll(true);
                         //FireFox почему то иногда неверно считает ширину кнопки '...', выписана задача
                         showAllLinkWidth = this._getShowAllButton().outerWidth() + (constants.browser.firefox ? 2 : 0);
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
                            this._toggleShowAll(itemsCount > 1);
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
                         linkCollection._getItemsContainer().html(toAdd);
                         this._toggleShowAll(true);
                      } else {
                         this._toggleShowAll(false);
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

          _observableControlFocusHandler: function(event) {
             /* Не надо обрабатывать приход фокуса:
                1) если у нас есть выбрынные элементы при единичном выборе, в противном случае, автодополнение будет посылать лишний запрос,
                   хотя ему отображаться не надо.
                2) Нативный фокус на кнопке открытия справочника (значит кликнули по кнопке, и сейчас откроется справочник)
                3) Фокус пришел из автодополнения
             */
             if(!this._isInputVisible() || this.getChildControlByName('fieldLinkMenu').getContainer()[0] === document.activeElement ||
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
             var isModel;

             /* После выбора из панели, возвращаем фокус в поле связи */
             this.setActive(true);
             if(result && result.length) {
                isModel = cInstance.instanceOfModule(result[0], 'WS.Data/Entity/Model');
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

              return strHelpers.htmlToText(displayFields.join(', '));
          },

          _onResizeHandler: function() {
             var linkCollection = this._getLinkCollection();

             FieldLink.superclass._onResizeHandler.apply(this, arguments);

             if(!linkCollection.isPickerVisible() && this._needRedrawOnResize()) {
                /* Почему надо звать redraw: поле связи может быть скрыто, когда в него проставили выбранные записи,
                   и просто пересчётом input'a тут не обойтись. Выполняться должно быстро, т.к. перерисовывается обычно всего 2-3 записи */
                linkCollection.redraw();
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
             this._getLinkCollection().togglePicker();
          },

          /**
           * Удаляет все элементы поля связи,
           * ставит курсор в поле ввода
           * @private
           */
          _dropAllItems: function() {
             this.removeItemsSelectionAll();
             this._inputField.focus();
             this._observableControlFocusHandler();
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
             var linkCollection = this._getLinkCollection(),
                 linkCollectionContainer = linkCollection.getContainer();

             /* Нужно скрыть контрол отображающий элементы, перед загрузкой, потому что часто бл может отвечать >500мс и
              отображаемое значение в поле связи долго не меняется, особенно заметно в редактировании по месту. */
             linkCollectionContainer.addClass(classes.HIDDEN);
             this.getSelectedItems(true, amount).addCallback(function(list){
                /* Если поле связи отрисовывается скрытым, необходимо сбросить запомненную ширину,
                   чтобы при отображении пересчитались размеры. */
                if(!this.isVisibleWithParents()) {
                   this._lastFieldLinkWidth = null;
                }
                linkCollectionContainer.removeClass(classes.HIDDEN);
                linkCollection.setItems(list);
                return list;
             }.bind(this));
          },

          _drawSelectedItems: function(keysArr) {
             var keysArrLen = this._isEmptySelection() ? 0 : keysArr.length,
                 hasSelectedKeys = keysArrLen > 0;

             /* Если удалили в пикере все записи, и он был открыт, то скроем его */
             if (!hasSelectedKeys) {
                this._toggleShowAll(false);
             }

             this.getContainer().toggleClass(classes.SELECTED, hasSelectedKeys)
                                .toggleClass(classes.SELECTED_SINGLE, keysArrLen === 1);

             if(!this._options.alwaysShowTextBox && !this.getMultiselect() && hasSelectedKeys) {
                this.hidePicker();
             }

             this._loadAndDrawItems(keysArrLen, this._options.pageSize);
          },

          _prepareItems: function() {
             return ToSourceModel(
                FieldLink.superclass._prepareItems.apply(this, arguments),
                this.getProperty('dataSource'),
                this.getProperty('idProperty'),
                this.getProperty('saveParentRecordChanges')
             );
          },

          setListFilter: function() {
             /* Если единичный выбор в поле связи, но textBox всё равно показывается(включена опция), запрещаем работу suggest'a */
             if(!this._isInputVisible() && this._options.alwaysShowTextBox) {
                return;
             }
             FieldLink.superclass.setListFilter.apply(this, arguments);
          },

          showPicker: function() {
             /* Не показываем автодополнение если:
                1) Если открыт пикер, который показывает все выбранные записи
                2) Input скрыт */
             if(this._getLinkCollection().isPickerVisible() || !this._isInputVisible()) {
                return;
             }
             FieldLink.superclass.showPicker.apply(this, arguments);
             /* После отображения автодополнение поля связи может быть перевёрнуто (не влезло на экран вниз),
                при этом необходимо, чтобы самый нижний элемент в автодополнении был виден, а он может находить за скролом,
                поэтому при перевороте проскролим вниз автодополнение */
             this._scrollListToBottom();
          },

          _setEnabled: function() {
             this._lastFieldLinkWidth = null;
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
             if(this._picker && this._isSuggestPickerRevertedVertical()) {
                var pickerContainer = this._picker.getContainer(),
                    list = this.getList(),
                    newIndex;
                
                pickerContainer[0].scrollTop = pickerContainer[0].scrollHeight;
                
                /* При подскроле вниз всегда устанавливаем маркер на последнюю запись */
                if(cInstance.instanceOfMixin(list, 'SBIS3.CONTROLS.Selectable')) {
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
                   var linkCollection =  this._getLinkCollection();

                   if(this.isPickerVisible() || linkCollection.isPickerVisible()) {
                      this.hidePicker();
                      linkCollection.hidePicker();
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
                      this._getLinkCollection().hidePicker();
                }
             }
          },

          /**
           * Скрывает/показывает кнопку показа всех записей
           */
          _toggleShowAll: function(show) {
             if(this._options.multiselect) {
                this._getShowAllButton().toggleClass(classes.HIDDEN, !show); //todo
             }
          },
          
          _getShowAllButton: memoize(function () {
             return this.getContainer().find('.controls-FieldLink__showAllLinks');
          }, '_showAllButton'),

          /* Заглушка, само поле связи не занимается отрисовкой */
          redraw: function () {

          },
          /* Заглушка, само поле связи не занимается загрузкой списка */
          reload: function () {

          },

          destroy: function() {
             if(this._linkCollection) {
                this._linkCollection.destroy();
                this._linkCollection = undefined;
             }

             FieldLink.superclass.destroy.apply(this, arguments);
          }
       });

       return FieldLink;

    });