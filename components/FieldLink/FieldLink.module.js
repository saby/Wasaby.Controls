define('js!SBIS3.CONTROLS.FieldLink',
    [
       "Core/CommandDispatcher",
       "Core/constants",
       "Core/IoC",
       "Core/core-instance",
       "Core/helpers/functional-helpers",
       "Core/helpers/string-helpers",
       "Core/helpers/collection-helpers",
       "js!SBIS3.CONTROLS.SuggestTextBox",
       "js!SBIS3.CONTROLS.ItemsControlMixin",
       "js!SBIS3.CONTROLS.MultiSelectable",
       "js!SBIS3.CONTROLS.ActiveMultiSelectable",
       "js!SBIS3.CONTROLS.Selectable",
       "js!SBIS3.CONTROLS.ActiveSelectable",
       "js!SBIS3.CONTROLS.SyncSelectionMixin",
       "js!SBIS3.CONTROLS.FieldLinkItemsCollection",
       "html!SBIS3.CONTROLS.FieldLink/afterFieldWrapper",
       "html!SBIS3.CONTROLS.FieldLink/beforeFieldWrapper",
       "js!SBIS3.CONTROLS.Utils.DialogOpener",
       "js!SBIS3.CONTROLS.ITextValue",
       "js!SBIS3.CONTROLS.Utils.TemplateUtil",
       "js!SBIS3.CONTROLS.ToSourceModel",
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
        fHelpers,
        strHelpers,
        colHelpers,
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
        /********************************************/
        DialogOpener,
        ITextValue,
        TemplateUtil,
        ToSourceModel
    ) {

       'use strict';

       var INPUT_WRAPPER_PADDING = 8;
       var INPUT_MIN_WIDTH = 100;
       var SHOW_ALL_LINK_WIDTH = 22;

       var classes = {
          MULTISELECT: 'controls-FieldLink__multiselect',
          SELECTED: 'controls-FieldLink__selected',
          SELECTED_SINGLE: 'controls-FieldLink__selected-single',
          INVISIBLE: 'ws-invisible',
          HIDDEN: 'ws-hidden'
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
        *       Подробнее о правилах создания компонента для справочника поля связи вы можете прочитать в разделе <a href="http://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/textbox/field-link/dictionary/">Поле связи</a>.
        *       Набор справочников устанавливают с помощью опции {@link dictionaries}, а режим отображения открытого справочника - с помощью опции {@link chooserMode}.
        *    </li>
        *    <li>
        *       <b>Через автодополнение.</b>
        *       Автодополнение - это функционал отображения возможных результатов поиска по введенным символам. По умолчанию для поля связи автодополнение отключено.
        *       Чтобы при печати в поле ввода отображались релевантные для выбора значения, нужно для поля связи установить конфигурацию автодополнения в опциях {@link list}, {@link listFilter} и {@link text}.
        *       Чтобы установить временную задержку перед началом поиска релевантного значения, используют опцию {@link delay}.
        *       Чтобы отображать полный список значений автодополнения при переходе фокуса на контрол, используют опцию {@link autoShow}.
        *       Демонстрацию работы автодополнения с полем связи вы можете найти в блоке интерактивных примеров в описании к классу.
        *    </li>
        *    <li>
        *       <b>Через контекст контрола.</b>
        *       Этот способ основан работе с <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/core/context/">контекстом</a> контрола. Пример № 3 из описания класса поля связи демонстрирует возможности установки значения через контекст.
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
        * @mixes SBIS3.CONTROLS.Selectable
        * @mixes SBIS3.CONTROLS.MultiSelectable
        * @mixes SBIS3.CONTROLS.ActiveSelectable
        * @mixes SBIS3.CONTROLS.ActiveMultiSelectable
        * @mixes SBIS3.CONTROLS.SyncSelectionMixin
        * @mixes SBIS3.CONTROLS.ItemsControlMixin
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
        * @cssModifier controls-FieldLink__itemsEdited В поле связи при наведении курсора на выбранные значения применяется подчеркивание текста.
        * @cssModifier controls-FieldLink__itemsBold В поле связи для текста выбранных значений применяется полужирное начертание.
        * @cssModifier controls-FieldLink__hideSelector Скрывает кнопку открытия диалога/панели выбора
        * @cssModifier controls-FieldLink__hiddenIfEmpty Скрывает поле связи, если выполнены два условия: поле связи задизейблено (enabled: false), в поле связи нет выбранных значений.
        * @cssModifier controls-FieldLink__dynamicInputWidth Устанавливает динамическу ширину инпута. ВНИМАНИЕ! Ломает базовую линию.
        *
        * @ignoreOptions tooltip alwaysShowExtendedTooltip loadingContainer observableControls pageSize usePicker filter saveFocusOnSelect
        * @ignoreOptions allowEmptySelection allowEmptyMultiSelection templateBinding includedTemplates resultBindings footerTpl emptyHTML groupBy
        * @ignoreMethods getTooltip setTooltip getExtendedTooltip setExtendedTooltip setEmptyHTML setGroupBy itemTpl
        * @ignoreEvents onListItemSelect
        *
        * ignoreEvents onDataLoad onDataLoadError onBeforeDataLoad onDrawItems
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
           * Значения в строке перечислены через запятую. Отображаемые значения в строке определяются с помощью опции {@link displayProperty} или {@link itemTemplate}.
           * Опция доступна только на чтение. Запрещена двусторонняя привязка к полю контекста.
           * @see getTexValue
           * @see displayProperty
           * @see itemTemplate
           */
          /**
           * @event onItemActivate Происходит при клике по выбранному элементу коллекции.
           * @param {$ws.proto.EventObject} eventObject Дескриптор события.
           * @param {Object} meta Объект, описывающий метаданные события. В его свойствах передаются идентификатор и экземпляр выбранного значения.
           * @param {String} meta.id Идентификатор выбранного значения.
           * @param {SBIS3.CONTROLS.Record} meta.item Экземпляр класса выбранного значения.
           */
          $protected: {
             _linkCollection: null,   /* Контрол отображающий выбранные элементы */
             _selectorAction: null,   /* Action выбора */
             _isDynamicInputWidth: false,
             _lastFieldLinkWidth: null,
             _options: {
                /* Служебные шаблоны поля связи (иконка открытия справочника, контейнер для выбранных записей */
                afterFieldWrapper: afterFieldWrapper,
                beforeFieldWrapper: beforeFieldWrapper,
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
                 *
                 * @typedef {Object} Dictionaries
                 * @property {String} name Имя (Идентификатор справочника).
                 * @property {selectionTypeDef} selectionType
                 * @property {String} caption Текст в меню выбора справочников. Опция актуальна, когда для поля связи установлено несколько справочников.
                 * Открыть справочник можно через меню выбора справочников или с помощью метода {@link showSelector}.
                 * Меню выбора справочников - это кнопка, которая расположена внутри поля связи с правого края:
                 * ![](/FieldLink03.png)
                 * Изменять положение этой кнопки нельзя. Когда для поля связи установлен только один справочник, клик по кнопке меню производит его открытие.
                 * Когда для поля связи установлено несколько справочников, клик по меню открывает подменю для выбора нужного справочника.
                 * Опция caption определяет название справочника в этом подменю:
                 * ![](/FieldLink02.png)
                 * @property {String} template Компонент, на основе которого организован справочник.
                 * Список значений справочника строится на основе любого компонента, который можно использовать для {@link https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/ отображения данных в списках}:
                 * - использование компонента {@link SBIS3.CONTROLS.DataGridView}:
                 * ![](/FieldLink00.png)
                 * - использование компонента {@link SBIS3.CONTROLS.TreeDataGridView}:
                 * ![](/FieldLink01.png)
                 * Подробнее о правилах создания компонента для справочника поля связи вы можете прочитать в разделе <a href="http://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/textbox/field-link/">Поле связи</a>.
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
                 * @cfg {String} Устанавливает шаблон, по которому будет построено отображение каждого выбранного значения в поле связи.
                 * @remark
                 * Шаблон - это вёрстка, по которой будет построено отображение каждого выбранного значения в поле связи.
                 * Внутри шаблона допускается использование {@link https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/core/component/xhtml/template конструкций шаблонизатора}.
                 * Шаблон может быть реализован отдельным XHTML-файлом.
                 * В этом случае чтобы передать его содержимое в опцию, он должен быть подключен в массив зависимостей компонента (см. примеры).
                 * @example
                 * Пример. Шаблон создан в отдельном XHTML-файле. Сначала его нужно подключить в массив зависимостей компонента, затем в опции указать путь до шаблона.
                 * <pre class="brush: xml">
                 *     <option name="itemTemplate" type="string">html!SBIS3.MyArea.MyComponent/resources/myTemplate</option>
                 * </pre>
                 */
                itemTemplate: null,
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
             /* Флаг, как с css модификатор удалится в 3.7.5, т.к. сделаем ширину везде динамической,
                а базовую линию меток будем выставлять через line-height */
             this._isDynamicInputWidth = this.getContainer().hasClass('controls-FieldLink__dynamicInputWidth');

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
                    self.setActive(true);
                 });

             if(this._options.useSelectorAction) {
                this.subscribeTo(this._getSelectorAction(), 'onExecuted', function(event, result) {
                   /* После выбора из панели выбора, надо фокус возвращать в поле связи:
                      после закрытия панели фокус будет проставляться на компонент, который был активным до этого (механизм WindowManager),
                      последним активным компонентом была кнопка открытия справочника/ссылка открывающая справочник,
                      но по стандарту курсор должен проставиться в поле ввода поля связи после выбора из панели,
                      поэтому руками устанавливаем фокус в поле связи  */
                   self.setActive(true);
                   if(result) {
                      self.setSelectedItems(result);
                   }
                });
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
                this.getChildControlByName('fieldLinkMenu').setItems(this._options.dictionaries);
             }
          },

          _getSelectorAction: function() {
             if(!this._selectorAction) {
                this._selectorAction = this.getChildControlByName('FieldLinkSelectorAction')
             }
             return this._selectorAction;
          },

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
             return (text || this.getProperty('placeholder')).indexOf('SBIS3.CONTROLS.FieldLink.Link') === -1;
          },

          _setPlaceholder: function() {
             FieldLink.superclass._setPlaceholder.apply(this, arguments);
             this.reviveComponents();
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
           * @param {String} template Компонент, который будет использован для построения справочника.
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
             this.hidePicker();
             this._getLinkCollection().hidePicker();

             if(this._options.useSelectorAction) {
                var selectedItems = this.getSelectedItems();
                this._getSelectorAction().execute({
                   template: template,
                   componentOptions: componentOptions,
                   multiselect: this.getMultiselect(),
                   selectionType: selectionType,
                   selectedItems: selectedItems ? selectedItems.clone() : selectedItems
                });
             } else {
                this._showChooser(template, componentOptions);
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
                config = colHelpers.find(this._options.dictionaries, function (elem) {
                   return elem.name === key;
                });
             } else {
                config = this._options.dictionaries[0];
             }

             if(config) {
                this.showSelector(config.template, config.componentOptions, config.selectionType);
                /* Чтобы остановить всплытие комманды */
                return true;
             }
          },

          setActive: function(active) {
             var wasActive = this.isActive();

             /* Хак, который чинит баг firefox с невидимым курсором в input'e.
              Это довольно старая и распростронённая проблема в firefox'e,
              повторяется с разными сценариями и с разными способомами почи)нки.
              В нашем случае, если фокус в input'e, то перед повторной установкой фокуса надо сделать blur (увести фокус из input'a).
              Чтобы это не вызывало перепрыгов фокуса, делаем это по минимальному таймауту. Выглядит плохо, но другого решения для FF найти не удлось.*/
             if(constants.browser.firefox && active && !this.getText() && this._isEmptySelection()) {
                var elemToFocus = this._getElementToFocus();

                setTimeout(fHelpers.forAliveOnly(function () {
                   if(elemToFocus[0] === document.activeElement){
                      var suggestShowed = this.isPickerVisible();
                      elemToFocus.blur().focus();

                      if(!suggestShowed) {
                         this.hidePicker();
                      }
                   }
                }, this), 30);
             }

             FieldLink.superclass.setActive.apply(this, arguments);

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
             this.getContainer().toggleClass(classes.MULTISELECT, !!multiselect)
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
             var oldRecArray = [],
                selectedKeys = this._isEmptySelection() ? [] : this.getSelectedKeys(),
                selectedItems, oldRec;

             if(this._options.oldViews) {
                selectedItems = this.getSelectedItems();

                if(selectedItems) {
                   selectedItems.each(function(rec) {
                      oldRec = DialogOpener.convertRecord(rec);
                      if(oldRec) {
                         oldRecArray.push(oldRec);
                      }
                   });
                }
             }

             return {
                currentValue: selectedKeys,
                currentSelectedKeys: selectedKeys,
                selectorFieldLink: true,
                multiSelect: this._options.multiselect,
                selectedRecords: oldRecArray
             };
          },

          _modifyOptions: function() {
             var cfg = FieldLink.superclass._modifyOptions.apply(this, arguments),
                 classesToAdd = ['controls-FieldLink'],
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

             /* className вешаем через modifyOptions,
                так меньше работы с DOM'ом */
             cfg.className += ' ' + classesToAdd.join(' ');
             cfg.itemTemplate = TemplateUtil.prepareTemplate(cfg.itemTemplate);
             return cfg;
          },

          _getLinkCollection: function() {
             if(!this._linkCollection) {
                return (this._linkCollection = this.getChildControlByName('FieldLinkItemsCollection'));
             }
             return this._linkCollection;
          },

          /** Обработчики событий контрола отрисовки элементов **/
          _onDrawItemsCollection: function() {
             var linkCollection = this._getLinkCollection(),
                 itemsWidth = 0,
                 toAdd = [],
                 isEnabled = this.isEnabled(),
                 needResizeInput = this._isInputVisible() || this._options.alwaysShowTextBox,
                 availableWidth, items, additionalWidth, itemWidth, itemsCount, $item;

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
                      additionalWidth = isEnabled ? this._getAfterFieldWrapper().outerWidth() : 0;

                      /* Для multiselect'a и включённой опции alwaysShowTextBox
                       добавляем минимальную ширину поля ввода (т.к. оно не скрывается при выборе */
                      if (this._options.multiselect || this._options.alwaysShowTextBox) {
                         /* Если поле звязи задизейблено, то учитываем ширину кнопки отображения всех запией */
                         additionalWidth += (this.isEnabled() ? INPUT_MIN_WIDTH : SHOW_ALL_LINK_WIDTH);
                      }

                      /* Высчитываем ширину, доступную для элементов */
                      availableWidth = this._container[0].clientWidth - additionalWidth;

                      /* Считаем, сколько элементов может отобразиться */
                      for (var i = itemsCount - 1; i >= 0; i--) {
                         $item = items.eq(i);
                         itemWidth = $item.outerWidth();

                         if ((itemsWidth + itemWidth) > availableWidth) {
                            this._toggleShowAll(itemsCount > 1);
                            /* Если ни один элемент не влезает, то устанавливаем первому доступную ширину */
                            if (!itemsWidth) {
                               $item.outerWidth(availableWidth);
                               toAdd.push($item[0]);
                            }
                            break;
                         }
                         toAdd.unshift($item[0]);
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

             if(!this._isDynamicInputWidth) {
                if(needResizeInput) {
                   this._inputField[0].style.width = 0;
                   this._updateInputWidth();
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
             this.getSelectedItems(false).each(function(item) {
                if(item.get(this._options.idProperty) == key) {
                   this._notify('onItemActivate', {item: item, id: key});
                }
             }, this)
          },
          /**************************************************************/

          _observableControlFocusHandler: function() {
             /* Не надо обрабатывать приход фокуса:
                1) если у нас есть выбрынные элементы при единичном выборе, в противном случае, автодополнение будет посылать лишний запрос,
                   хотя ему отображаться не надо.
                2) Нативный фокус на кнопке открытия справочника (значит кликнули по кнопке, и сейчас откроется справочник)   */
             if(!this._isInputVisible() || this.getChildControlByName('fieldLinkMenu').getContainer()[0] === document.activeElement) {
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
             return this._isInputVisible() ? FieldLink.superclass._getElementToFocus.apply(this, arguments) : this._container;
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
           * Возвращает выбранные элементы в виде текста.
           * @deprecated Метод getCaption устарел, используйте getTextValue
           * @returns {string}
           */
          getCaption: function() {
             IoC.resolve('ILogger').error('FieldLink::getCaption', 'Метод getCaption устарел, используйте getTextValue');
             return this.getTextValue();
          },

           /**
            * Возвращает строку, сформированную из текстовых значений полей выбранных элементов коллекции.
            * @remark
            * Метод формирует строку из значений полей выбранных элементов коллекции. Значения в строке будут перечислены через запятую.
            * Отображаемые значения определяются с помощью опции {@link displayProperty} или {@link itemTemplate}.
            * @returns {string} Строка, сформированная из отображаемых значений в поле связи.
            * @see texValue
            * @see displayProperty
            * @see itemTemplate
            */
          getTextValue: function() {
              var displayFields = [],
                  selectedItems = this.getSelectedItems(),
                  self = this;

              if(selectedItems) {
                 selectedItems.each(function(rec) {
                    displayFields.push(strHelpers.htmlToText(rec.get(self._options.displayProperty) || ''));
                 });
              }

              return displayFields.join(', ');
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
             this.once('onListReady', function(event, list) {
                if(!list.getDataSource()) {
                   list.setDataSource(ds, noLoad);
                }
             });
             FieldLink.superclass.setDataSource.apply(this, arguments);

             /* Если в поле связи есть выбранные ключи, то после установки сорса надо
                загрузить записи и отрисовать их */
             if(!this._isEmptySelection()) {
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
                linkCollectionContainer.removeClass(classes.HIDDEN);
                linkCollection.setItems(list);
                return list;
             });
          },

          _drawSelectedItems: function(keysArr) {
             var keysArrLen = this._isEmptySelection() ? 0 : keysArr.length,
                 hasSelectedKeys = keysArrLen > 0;

             /* Если удалили в пикере все записи, и он был открыт, то скроем его */
             if (!hasSelectedKeys) {
                this._toggleShowAll(false);
             }

             this._toggleDropAll(keysArrLen > 1);
             this.getContainer().toggleClass(classes.SELECTED, hasSelectedKeys);
             this.getContainer().toggleClass(classes.SELECTED_SINGLE, keysArrLen === 1);

             if(!this._options.alwaysShowTextBox) {

                if(!this.getMultiselect()) {
                   this._toggleInput(keysArrLen === 0);
                }
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

             // TODO: временный фикс для https://inside.tensor.ru/opendoc.html?guid=116810c1-efac-4acd-8ced-ff42f84a624f&des=
             // при открытии автодополнения, выключаем всем скролл контейнерам -webkit-overflow-scrolling touch
             if (constants.browser.isMobilePlatform) {
                $('.controls-ScrollContainer').addClass('controls-ScrollContainer-overflow-scrolling-auto');
             }

             FieldLink.superclass.showPicker.apply(this, arguments);
             /* После отображения автодополнение поля связи может быть перевёрнуто (не влезло на экран вниз),
                при этом необходимо, чтобы самый нижний элемент в автодополнении был виден, а он может находить за скролом,
                поэтому при перевороте проскролим вниз автодополнение */
             this._processSuggestPicker();
          },
          
          // TODO: временный фикс для https://inside.tensor.ru/opendoc.html?guid=116810c1-efac-4acd-8ced-ff42f84a624f&des=
          // при открытии автодополнения, выключаем всем скролл контейнерам -webkit-overflow-scrolling touch
          hidePicker: function(){
             FieldLink.superclass.hidePicker.apply(this, arguments);
             if (constants.browser.isMobilePlatform) {
                $('.controls-ScrollContainer').removeClass('controls-ScrollContainer-overflow-scrolling-auto');
             }
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
                target: this._container,
                opener: this,
                parent: this,
                closeByExternalClick: true,
                targetPart: true,
                className: 'controls-FieldLink__picker',
                verticalAlign: {
                   side: 'top'
                },
                horizontalAlign: {
                   side: 'left'
                },
                handlers: {
                   onShow: function() {
                      if (this._isSuggestPickerRevertedVertical()) {
                         if (!this._listReversed) {
                            this._reverseList();
                         }
                      } else {
                         if (this._listReversed) {
                            this._reverseList();
                         }
                      }
                   }.bind(this)
                }
             };
          },

          _isSuggestPickerRevertedVertical: function() {
             return this._picker.getContainer().hasClass('controls-popup-revert-vertical');
          },

          /* После отображения автодополнение поля связи может быть перевёрнуто (не влезло на экран вниз),
             при этом необходимо, чтобы самый нижний элемент в автодополнении был виден, а он может находить за скролом,
             поэтому при перевороте проскролим вниз автодополнение */
          _processSuggestPicker: function() {
             if(this._picker && this._isSuggestPickerRevertedVertical()) {
                var pickerContainer = this._picker.getContainer();
                pickerContainer[0].scrollTop = pickerContainer[0].scrollHeight;
             }
          },
          /* После перерисовки списка автодополнения, пикер может менять своё положение,
             а перерисовка может вызываться не только платформенным кодом, но и прикладным, поэтому
             после перерисовки надо вызвать метод, обрабатывающий положение автодополнение */
          _onListDrawItems: function() {
             FieldLink.superclass._onListDrawItems.apply(this, arguments);
             this._processSuggestPicker();
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
                this.getContainer().find('.controls-FieldLink__showAllLinks').toggleClass(classes.HIDDEN, !show);
             }
          },

          /**
           * Скрывает/показывает кнопку удаления всех записей
           */
          _toggleDropAll: function(show) {
             this.getContainer().find('.controls-FieldLink__dropAllLinks').toggleClass(classes.HIDDEN, !show);
          },

          _toggleInput: function(show) {
             /* Поле ввода нельзя вырывать из потока (display: none),
              иначе ломается базовая линия, поэтому скрываем его через visibility: hidden */
             this.getContainer().find('.controls-TextBox__fieldWrapper').toggleClass(classes.INVISIBLE, !show);

             /* Записи в поле связи могут проставлять програмно,
                поэтому это надо отслеживать и скрыть автодополнение, если скрывается input */
             if(this.isPickerVisible() && !show) {
                this.hidePicker();
             }
          },

          /**
           * Рассчитывает ширину поля ввода, учитывая всевозможные wrapper'ы и отступы
           * @returns {number}
           * @private
           */
          _getInputWidth: function() {
             var width = this._container[0].clientWidth -
                 ( this._getAfterFieldWrapper().outerWidth() +
                   this._getBeforeFieldWrapper().outerWidth() +
                   INPUT_WRAPPER_PADDING );

             /* Когда поле связи скрыто, могут происходить неправильные расчёты, самый дешёвый способ этого избежать,
                просто считать что ширина  - 0 */
             return (width >= 0) ? width : 0;
          },
          /**
           * Обновляет ширину поля ввода
           */
          _updateInputWidth: function() {
             var isEmptySelection = this._isEmptySelection(),
                 inputWidth;

             /* Для поля связи в задизейбленом состоянии считаем (если есть выбранные элементы (по стандарту) ),
                ширина инпута - 0, т.к. он визуально не отображается */
             if(this.isEnabled() || isEmptySelection) {
                inputWidth = this._getInputWidth();

                /* По неустановленным причинам, после обновления хрома, он для некоторых элементов начинает возвращать нулевую ширину,
                   после чистки кэша или перезагрузки браузера проблема исчезает, но надо от этого защититься (повторялось только в хроме) */
                if(!inputWidth && isEmptySelection) {
                   inputWidth = 'auto';
                }
             } else  {
                inputWidth = 0;
             }
             this._inputField[0].style.width = (inputWidth === 'auto' ? inputWidth : inputWidth + 'px');
          },

          /* Заглушка, само поле связи не занимается отрисовкой */
          redraw: fHelpers.nop,
          /* Заглушка, само поле связи не занимается загрузкой списка */
          reload: fHelpers.nop,


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