/**
 * Created by iv.cheremushkin on 14.08.2014.
 */

define('js!SBIS3.CONTROLS.ListView',
   [
   "Core/core-functions",
   "Core/CommandDispatcher",
   "Core/constants",
   "Core/Deferred",
   "js!SBIS3.CORE.CompoundControl",
   "js!SBIS3.CORE.CompoundActiveFixMixin",
   "js!SBIS3.CONTROLS.ItemsControlMixin",
   "js!SBIS3.CONTROLS.MultiSelectable",
   "js!WS.Data/Query/Query",
   "js!WS.Data/Entity/Record",
   "js!SBIS3.CONTROLS.Selectable",
   "js!SBIS3.CONTROLS.DataBindMixin",
   "js!SBIS3.CONTROLS.DecorableMixin",
   "js!SBIS3.CONTROLS.DragNDropMixinNew",
   "js!SBIS3.CONTROLS.FormWidgetMixin",
   "js!SBIS3.CORE.BreakClickBySelectMixin",
   "js!SBIS3.CONTROLS.ItemsToolbar",
   "js!SBIS3.CORE.MarkupTransformer",
   "tmpl!SBIS3.CONTROLS.ListView",
   "js!SBIS3.CONTROLS.Utils.TemplateUtil",
   "js!SBIS3.CONTROLS.CommonHandlers",
   "js!SBIS3.CONTROLS.Pager",
   "js!SBIS3.CONTROLS.EditInPlaceHoverController",
   "js!SBIS3.CONTROLS.EditInPlaceClickController",
   "js!SBIS3.CONTROLS.ImitateEvents",
   "js!SBIS3.CONTROLS.Link",
   "js!SBIS3.CONTROLS.ScrollWatcher",
   "js!WS.Data/Collection/IBind",
   "js!WS.Data/Collection/List",
   "html!SBIS3.CONTROLS.ListView/resources/ListViewGroupBy",
   "html!SBIS3.CONTROLS.ListView/resources/emptyData",
   "tmpl!SBIS3.CONTROLS.ListView/resources/ItemTemplate",
   "tmpl!SBIS3.CONTROLS.ListView/resources/ItemContentTemplate",
   "tmpl!SBIS3.CONTROLS.ListView/resources/GroupTemplate",
   "browser!js!SBIS3.CONTROLS.Utils.InformationPopupManager",
   "js!SBIS3.CONTROLS.Paging",
   "js!SBIS3.CONTROLS.ComponentBinder",
   "js!WS.Data/Di",
   "js!SBIS3.CONTROLS.ArraySimpleValuesUtil",
   "Core/helpers/fast-control-helpers",
   "Core/helpers/collection-helpers",
   "Core/core-instance",
   "Core/helpers/functional-helpers",
   "Core/helpers/dom&controls-helpers",
   "browser!js!SBIS3.CONTROLS.ListView/resources/SwipeHandlers",
   "js!SBIS3.CONTROLS.DragEntity.Row",
   "js!WS.Data/Collection/RecordSet",
   "i18n!SBIS3.CONTROLS.ListView",
   "js!SBIS3.CONTROLS.DragEntity.List",
   "js!WS.Data/MoveStrategy/Base",
   "js!SBIS3.CONTROLS.ListView.Mover"
],
   function ( cFunctions, CommandDispatcher, constants, Deferred,CompoundControl, CompoundActiveFixMixin, ItemsControlMixin, MultiSelectable, Query, Record,
             Selectable, DataBindMixin, DecorableMixin, DragNDropMixin, FormWidgetMixin, BreakClickBySelectMixin, ItemsToolbar, MarkupTransformer, dotTplFn,
             TemplateUtil, CommonHandlers, Pager, EditInPlaceHoverController, EditInPlaceClickController, ImitateEvents,
             Link, ScrollWatcher, IBindCollection, List, groupByTpl, emptyDataTpl, ItemTemplate, ItemContentTemplate, GroupTemplate, InformationPopupManager,
             Paging, ComponentBinder, Di, ArraySimpleValuesUtil, fcHelpers, colHelpers, cInstance, fHelpers, dcHelpers) {

     'use strict';

      var
         buildTplArgsLV = function(cfg) {
            var tplOptions = cfg._buildTplArgsSt.call(this, cfg);
            tplOptions.multiselect = cfg.multiselect;
            tplOptions.decorators = cfg._decorators;
            tplOptions.colorField = cfg.colorField;
            tplOptions.selectedKey = cfg.selectedKey;

            return tplOptions;
         },
         getRecordsForRedrawLV = function (projection, cfg){
            var records = cfg._getRecordsForRedrawSt.apply(this, arguments);
            return records;
         };
      var
         START_NEXT_LOAD_OFFSET = 800,
         DRAG_META_INSERT = {
            on: 'on',
            after: 'after',
            before: 'before'
         };

      var INDICATOR_DELAY = 750;

      /**
       * Контрол, отображающий набор однотипных сущностей. Позволяет отображать данные списком по определенному шаблону, а так же фильтровать и сортировать.
       * Подробнее о настройке контрола и его окружения вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/">Настройка списков</a>.
       *
       * @class SBIS3.CONTROLS.ListView
       * @extends $ws.proto.CompoundControl
       * @author Крайнов Дмитрий Олегович
       *
       * @mixes SBIS3.CORE.CompoundActiveFixMixin
       * @mixes SBIS3.CONTROLS.DecorableMixin
       * @mixes SBIS3.CONTROLS.ItemsControlMixin
       * @mixes SBIS3.CONTROLS.FormWidgetMixin
       * @mixes SBIS3.CONTROLS.MultiSelectable
       * @mixes SBIS3.CONTROLS.Selectable
       * @mixes SBIS3.CONTROLS.DataBindMixin
       * @mixes SBIS3.CONTROLS.DragNDropMixinNew
       * @mixes SBIS3.CONTROLS.CommonHandlers
       *
       * @cssModifier controls-ListView__orangeMarker Устанавливает отображение маркера активной строки у элементов списка. Модификатор актуален только для класса SBIS3.CONTROLS.ListView.
       * @cssModifier controls-ListView__showCheckBoxes Устанавливает постоянное отображение чекбоксов для записей списка. Модификатор применяется для режима множественного выбора записей (см. {@link multiselect}).
       * @cssModifier controls-ListView__hideCheckBoxes Скрывает отображение чекбоксов для записей списка, для которого установлен режим множественного выбора записей (см. {@link multiselect}).
       * @cssModifier controls-ListView__bottomStyle Изменяет положение "быстрых операций над записью", при котором они будут отображение в специальном блоке под записью. Подробнее о таких операциях вы можете прочитать в <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/items-action/fast/index/">этом разделе</a>.
       * @cssModifier controls-ListView__pagerNoSizePicker Скрывает отображение выпадающего списка, в котором производят выбор размера страницы для режима постраничной навигации (см. {@link showPaging}).
       * @cssModifier controls-ListView__pagerNoAmount Скрывает отображение количества записей на странице для режима постраничной навигации (см. {@link showPaging}).
       * @cssModifier controls-ListView__pagerHideEndButton Скрывает отображение кнопки "Перейти к последней странице". Используется для режима постраничной навигации (см. {@link showPaging}).
       *
       * @css controls-DragNDropMixin__notDraggable За помеченные данным селектором элементы Drag&Drop производиться не будет.
       *
       * @ignoreEvents onAfterLoad onChange onStateChange
       * @ignoreEvents onDragStop onDragIn onDragOut onDragStart
       *
       * @control
       * @public
       * @category Lists
       */

      /*TODO CommonHandlers тут в наследовании не нужны*/
      var ListView = CompoundControl.extend([CompoundActiveFixMixin, DecorableMixin, ItemsControlMixin, FormWidgetMixin, MultiSelectable, Selectable, DataBindMixin, DragNDropMixin, CommonHandlers], /** @lends SBIS3.CONTROLS.ListView.prototype */ {
         _dotTplFn: dotTplFn,
         /**
          * @event onChangeHoveredItem Происходит при переводе курсора мыши на другой элемент коллекции списка.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} hoveredItem Объект, свойства которого описывают данные элемента коллекции списка, на который навели курсор мыши.
          * @param {WS.Data/Entity/Model} record Элемент коллекции, на который перевели курсор.
          * @param {Number|String} hoveredItem.key Первичный ключ элемента.
          * @param {jQuery|false} hoveredItem.container Контейнер визуального отображения элемента (DOM-элемент).
          * @param {Object} hoveredItem.position Объект, свойства которого описывают координаты контейнера визуального отображения элемента.
          * @param {Number} hoveredItem.position.top Отступ от верхней границы контейнера визуального отображения элемента до верхней границы контейнера визуального отображения списка. Значение в px. При расчете учитывается текущий скролл в списке.
          * @param {Number} hoveredItem.position.left Отступ от левой границы контейнера визуального отображения элемента до левой границы контейнера визуального отображения списка. Значение в px.
          * @param {Object} hoveredItem.size Объект, свойства которого описывают высоту и ширину контейнера визуального отображения элемента.
          * @param {Number} hoveredItem.size.height Высота контейнера визуального отображения элемента. Значение в px.
          * @param {Number} hoveredItem.size.width Ширина контейнера визуального отображения элемента. Значение в px.
          * @example
          * При наведении курсора мыши на запись справа от неё отображаются операции (см. <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/items-action/fast/">Быстрый доступ к операциям по наведению курсора</a>).
          * Ниже приведён код, с помощью которого можно изменять отображение набора операций для записей списка.
          * <pre>
          *    dataGrid.subscribe('onChangeHoveredItem', function(eventObject, hoveredItem) {
          *       var actions = DataGridView.getItemsActions(),
          *           instances = actions.getItemsInstances();
          *       for (var i in instances) {
          *          if (instances.hasOwnProperty(i)) {
          *             //Будем скрывать кнопку удаления для всех строк
          *             instances[i][i === 'delete' ? 'show' : 'hide']();
          *          }
          *       }
          *    });
          * </pre>
          * Подобная задача часто сводится к отображению различных операций для узлов, скрытых узлов и листьев для иерархических списков.
          * Пример конфигурации списка для решения подобной задачи вы можете найти в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/items-action/fast/mode/">здесь</a>.
          * @see itemsActions
          * @see setItemsActions
          * @see getItemsActions
          */
          /**
           * @event onItemClick Происходит при любом клике по записи.
           * @remark
           * При работе с иерархическими списками при клике по папке (узлу) по умолчанию происходит проваливание в узел или его развертывание.
           * Чтобы отменить поведение, установленное по умолчанию, в обработчике события установите результат false.
           * <pre>
           *    myListView.subscribe('onItemClick', function(eventObject) {
           *        eventObject.setResult(false);
           *        ... // пользовательская логика клика по записи.
           *    });
           * </pre>
           * @param {$ws.proto.EventObject} eventObject Дескриптор события.
           * @param {String} id Первичный ключ записи.
           * @param {WS.Data/Entity/Model} data Экземпляр класса записи, по которой произвели клик.
           * @param {jQuery} target DOM-элемент, на который кликнули.
           */
          /**
          * @event onItemActivate Происходит при смене записи (активации) под курсором мыши (например, клик с целью редактирования или выбора).
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} meta Объект
          * @param {String} meta.id Первичный ключ записи.
          * @param {WS.Data/Entity/Model} meta.item Экземпляр класса записи.
          */
         /**
          * @event onDataMerge Происходит перед добавлением загруженных записей в основной dataSet.
          * @remark
          * Событие срабатывает при подгрузке по скроллу, при подгрузке в ветку дерева.
          * Т.е. при любой вспомогательной загрузке данных.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} dataSet - dataSet с загруженными данными
          * @example
          * <pre>
          *     DataGridView.subscribe('onDataMerge', function(event, dataSet) {
          *        //Если в загруженном датасете есть данные, отрисуем их количество
          *        var count = dataSet.getCount();
          *        if (count){
          *           self.drawItemsCounter(count);
          *        }
          *     });
          * </pre>
          */
         /**
          * @event onItemValueChanged Происходит при смене значения в одном из полей редактирования по месту и потере фокуса этим полем.
          * @deprecated Будет удалено в 3.7.3.100. Временное решение
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Array} difference Массив измененных полей.
          * @param {WS.Data/Entity/Model} model Модель с измененными данными.
          */
         /**
          * @typedef {String} BeginEditResult
          * @variant Cancel Отменить завершение редактирования.
          * @variant PendingAll В результате редактирования ожидается вся запись, как есть (с текущим набором полей).
          * @variant PendingModifiedOnly В результате редактирования ожидаются только измененные поля. Это поведение используется по умолчанию.
          */
         /**
          * @event onBeginEdit Происходит перед началом редактирования.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {WS.Data/Entity/Model} model Редактируемая запись.
          * @param {Boolean} isAdd Флаг, означающий что событию предшествовал запуск добавления по месту.
          * @returns {BeginEditResult|Deferred} Deferred - используется для асинхронной подготовки редактируемой записи. Из Deferred необходимо обязательно возвращать запись, открываемую на редактирование.
          */
         /**
          * @event onBeginAdd Происходит перед началом добавления записи по месту.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @returns {Object|WS.Data/Entity/Model} Инициализирующе данные для создаваемой записи.
          */
         /**
          * @event onAfterBeginEdit Происходит после начала редактирования.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {WS.Data/Entity/Model} model Редактируемая запись.
          */
         /**
          * @event onEndEdit Происходит перед окончанием редактирования (и перед валидацией области редактирования).
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {WS.Data/Entity/Model} model Редактируемая запись.
          * @param {Boolean} withSaving Признак, по которому определяют тип завершения редактирования.
          * <ul>
          *    <li>true - редактирование завершается сохранением изменений;</li>
          *    <li>false - отмена сохранения изменений путём нажатия клавиши Esc или переводом фокуса на другой контрол.</li>
          * </ul>
          * @returns {EndEditResult} Когда из обработчика события возвращается константа, список которых приведён выше, происходит соответствующее действие.
          * Когда возвращается любое другое значение, оно будет проигнорировано, и произойдёт сохранение изменений редактирования/добавления по месту.
          */
         /**
          * @event onAfterEndEdit Происходит после окончания редактирования по месту.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {WS.Data/Entity/Model} model Отредактированная запись.
          * @param {jQuery} target DOM-элемент, отображающий запись.
          * @param {Boolean} withSaving Признак, по которому определяют тип завершения редактирования.
          * <ul>
          *    <li>true - редактирование завершается сохранением изменений;</li>
          *    <li>false - была нажата клавиша Esc или перевели фокуса на другой контрол, чтобы отменить сохранение изменений.</li>
          * </ul>
          */
         /**
          * @event onPrepareFilterOnMove Происходит при определении фильтра, с которым будет показан диалог перемещения.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Array} records Список перемещаемых записей.
          * @returns {Object} filter Фильтр, который будет помещён в диалог перемещения.
          */
         /**
          * @event onEndDelete Происходит после удаления записей.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Array.<String>|Array.<Number>} idArray Массив ключей удаляемых записей.
          * @param {*} result Результат удаления.
          */
         /**
          * @event onBeginDelete Происходит перед удалением записей.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Array.<String>|Array.<Number>} idArray Массив ключей удаляемых записей.
          * @returns {*|Boolean|Deferred} result Если result=false, то отменяется логика удаления записи, установленная по умолчанию.
          */
         /**
          * @typedef {String} MovePosition
          * @variant on Вставить перемещаемые элементы внутрь текущей записи.
          * @variant after Вставить перемещаемые элементы после текущей записи.
          * @variant before Вставить перемещаемые элементы перед текущей записью.
          */
         /**
          * @typedef {Object} DragEntityOptions
          * @property {SBIS3.CONTROLS.Control} owner Контрол, которому принадлежит запись.
          * @property {jQuery} domElement DOM-элемент, отображающий запись.
          * @property {WS.Data/Entity/Model} model Модель, соответствующая записи.
          * @property {MovePosition|undefined} position Позиция элемента после перемещения (определяется только у целевого элемента - того, который находится под курсором мыши).
          */
          /**
          * @typedef {Object} DragEntityListOptions
          * @property {Array} items Массив перемещаемых элементов {@link SBIS3.CONTROLS.DragEntity.Row}.
          */
         /**
          * @typedef {String} EndEditResult
          * @variant Cancel Отменить завершение редактирования/добавления.
          * @variant Save Завершить редактирование/добавление с сохранением изменений логике, которая установленной по умолчанию.
          * @variant NotSave Завершить редактирование/добавление без сохранения изменений. Использование данной константы в режиме добавления по месту приводит к автоудалению созданной записи.
          * @variant CustomLogic Завершить редактирование/добавление с сохранением изменений по пользовательской логике. Используется, например, при добавлении по месту, когда разработчику необходимо самостоятельно обработать добавляемую запись.
          */
         $protected: {
            _floatCheckBox: null,
            _dotItemTpl: null,
            _itemsContainer: null,
            _actsContainer: null,
            _onMetaDataResultsChange: null,
            _allowInfiniteScroll: true,
            _hoveredItem: {
               target: null,
               container: null,
               key: null,
               position: null,
               size: null
            },
            _loadingIndicator: undefined,
            _editInPlace: null,
            _pageChangeDeferred : undefined,
            _pager : undefined,
            _pagerContainer: undefined,
            _previousGroupBy : undefined,
            _checkClickByTap: true,
            _keysWeHandle: [
               constants.key.up,
               constants.key.down,
               constants.key.space,
               constants.key.enter,
               constants.key.right,
               constants.key.left,
               constants.key.m,
               constants.key.o,
               constants.key.del
            ],
            _itemsToolbar: null,
            _notEndEditClassName: 'controls-ListView__onFocusNotEndEdit',
            _addResultsMethod: undefined,
            _containerScrollHeight: undefined,
            // указывает на необходимость компенсации скрола при подгрузке данных вверх
            // необходим, так как компенсацию можно произвести только после отрисовки - в drawItemsCallback
            // безусловно это делать нельзя, так как drawItemsCallback срабатывает и при перерисовке одной записи
            _needScrollCompensation : null,
            // Состояние подгрузки по скроллу
            // mode: null - выключена; up - грузим предыдущую страницу; down - грузим следующую страницу
            // reverse: false - верхняя страница вставляется вверх, нижняя вниз; true - нижняя страница вставляется вверх;
            _infiniteScrollState: {
               mode: null,
               reverse: false
            },
            _scrollOffset: {
               top: null,
               bottom: null
            },
            _setScrollPagerPositionThrottled: null,
            _options: {
               _canServerRender: true,
               _buildTplArgs: buildTplArgsLV,
               _getRecordsForRedraw: getRecordsForRedrawLV,
               _buildTplArgsLV: buildTplArgsLV,
               _defaultItemTemplate: ItemTemplate,
               _defaultItemContentTemplate: ItemContentTemplate,
               _groupTemplate: GroupTemplate,
               /**
                * @faq Почему нет чекбоксов в режиме множественного выбора значений (активация режима производится опцией {@link SBIS3.CONTROLS.ListView#multiselect multiselect})?
                * Для отрисовки чекбоксов необходимо в шаблоне отображения элемента коллекции обозначить их место.
                * Это делают с помощью CSS-классов "controls-ListView__itemCheckBox js-controls-ListView__itemCheckBox".
                * В следующем примере место отображения чекбоксом обозначено тегом span:
                * <pre>
                *     <div class="listViewItem" style="height: 30px;">
                *        <span class="controls-ListView__itemCheckBox js-controls-ListView__itemCheckBox"></span>
                *        {{=it.item.get("title")}}
                *     </div>
                * </pre>
                * @bind SBIS3.CONTROLS.ListView#itemTemplate
                * @bind SBIS3.CONTROLS.ListView#multiselect
                */
               /**
                * @cfg {String} Устанавливает шаблон отображения каждого элемента коллекции.
                * @remark
                * @deprecated
                * Шаблон - это пользовательская вёрстка элемента коллекции.
                * Для доступа к полям элемента коллекции в шаблоне подразумевается использование конструкций шаблонизатора.
                * Подробнее о шаблонизаторе вы можете прочитать в разделе {@link https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/core/component/xhtml/template/ Шаблонизация вёрстки компонента}.
                * <br/>
                * Шаблон может быть создан в отдельном XHTML-файле, когда вёрстка большая или требуется использовать его в разных компонентах.
                * Шаблон создают в директории компонента в подпапке resources согласно правилам, описанным в разделе {@link https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/core/component/file-structure/ Файловая структура компонента}.
                * <br/>
                * Чтобы такой шаблон можно было использовать, нужно:
                * 1. Подключить шаблон в массив зависимостей компонента и импортировать его в переменную:
                *       <pre>
                *          define('js!SBIS3.MyArea.MyComponent',
                *             [
                *                ...
                *                'html!SBIS3.MyArea.MyComponent/resources/item_template'
                *             ],
                *             function(..., myItemTpl) {
                *             ...
                *          });
                *       </pre>
                * 2. Установить шаблон с помощью метода {@link setItemTemplate}:
                *       <pre>
                *          view = this.getChildControlByName('view');
                *          view.setItemTemplate(myItemTpl);
                *       </pre>
                * Пример содержимого шаблона элемента коллекции вы можете найти в разделе "Примеры".
                *
                * Когда установлен пользовательский шаблон отображения элемента коллекции, то в иерархическом представлении данных иконки для раскрытия содержимого папки будут скрыты.
                * Также будет отсутствовать отступ дочерних элементов относительно раскрытой папки, это отображение нужно реализовать в шаблоне самостоятельно.
                * @example
                * Далее приведён шаблон, который отображает значение поля title:
                * <pre>
                *     <div class="listViewItem" style="height: 30px;">
                *        {{=it.item.get("title")}}
                *     </div>
                * </pre>
                * @editor CloudFileChooser
                * @editorConfig extFilter xhtml
                * @see multiselect
                * @see setItemTemplate
                */
               itemTemplate: '',
               /**
                * @typedef {String} toolbarViewModeVariant
                * @variant icon Будет отображаться как иконка(требуется обязательно указать опцию icon у операции).
                * @variant caption Будет отображаться как ссылка(требуется обязательно указать опцию caption у операции).
                *
                * @typedef {Array} ItemsActions
                * @property {String} name Уникальное имя кнопки. Обязательная для конфигурации подопция. Её значение, в том числе, может быть использовано в пользовательских обработчиках для отображения или скрытия набора операций.
                * @property {String} icon Иконка на кнопке. Необязательная подопция. В качестве значения в опцию передаётся строка, описывающая класс иконки.
                * Набор классов и список иконок, разрешённых для использования, можно найти <a href="https://wi.sbis.ru/docs/3-8-0/icons/">здесь</a>.
                * <ul>
                *    <li>Если кнопка отображается не в выпадающем меню (см. подопцию isMainAction) и установлена подопция icon, то использование подопции caption необязательно.</li>
                *    <li>Если кнопка отображается в выпадающем меню (см. подопцию isMainAction), то производят конфигурацию подопций icon и caption.</li>
                * </ul>
                * @property {toolbarViewModeVariant} toolbarViewMode Вид отображения операции в тулбаре.
                * @property {String} caption Подпись на кнопке.
                * <ul>
                *    <li>Если кнопка отображается не в выпадающем меню (см. подопцию isMainAction) и установлена подопция icon, то использование подопции caption необязательно.</li>
                *    <li>Если кнопка отображается в выпадающем меню (см. подопцию isMainAction), то производят конфигурацию подопций icon и caption.</li>
                * </ul>
                * @property {String} tooltip Текст всплывающей подсказки.
                * @property {Boolean} isMainAction Признак, по которому устанавливается отображение кнопки в тулбаре.
                * @property {Function} onActivated Функция, которая будет выполнена при клике по кнопке. Внутри функции указатель this возвращает экземпляр класса представления данных. Аргументы функции:
                * <ul>
                *    <li>contaner - контейнер визуального отображения записи.</li>
                *    <li>id - идентификатор записи.</li>
                *    <li>item - запись (экземпляр класса {@link WS.Data/Entity/Model}).</li>
                * </ul>
                * @property {Boolean} allowChangeEnable Признак отображения действий, которые доступны при наведении курсора на запись, в зависимости от режима взаимодействия со списком (см. {@link $ws.proto.Control#enabled}).
                * <ul>
                *     <li>true. Когда для списка установлено <i>enabled=false</i>, действия отображаться не будут.</li>
                *     <li>false. Действия доступны всегда.</li>
                * </ul>
                * @editor icon ImageEditor
                * @translatable caption tooltip
                */
               /**
                * @cfg {ItemsActions[]} Набор действий над элементами, отображающийся в виде иконок при наведении курсора мыши на запись.
                * @remark
                * Если для контрола установлено значение false в опции {@link $ws.proto.Control#enabled}, то операции не будут отображаться при наведении курсора мыши.
                * Однако с помощью подопции allowChangeEnable можно изменить это поведение.
                * Подробнее о настройке таких действий вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/items-action/fast/">Быстрый доступ к операциям по наведению курсора</a>.
                * @example
                * <b>Пример 1.</b> Конфигурация операций через вёрстку компонента.
                * <pre>
                *     <options name="itemsActions" type="array">
                *        <options>
                *           <option name="name">btn1</option>
                *           <option name="icon">sprite:icon-16 icon-Delete icon-primary</option>
                *           <option name="isMainAction">false</option>
                *           <option name="tooltip">Удалить</option>
                *           <option name="onActivated" type="function">js!SBIS3.CONTROLS.Demo.MyListView:prototype.myOnActivatedHandler</option>
                *        </options>
                *        <options>
                *            <option name="name">btn2</option>
                *            <option name="icon">sprite:icon-16 icon-Trade icon-primary</option>
                *            <option name="tooltip">Изменить</option>
                *            <option name="isMainAction">true</option>
                *            <option name="onActivated" type="function">js!SBIS3.CONTROLS.Demo.MyListView:prototype.myOnActivatedHandler</option>
                *         </options>
                *     </options>
                * </pre>
                * <b>Пример 2.</b> Конфигурация операций через JS-код компонента.
                * <pre>
                *     DataGridView.setItemsActions([{
                *        name: 'delete',
                *        icon: 'sprite:icon-16 icon-Erase icon-error',
                *        caption: 'Удалить',
                *        isMainAction: true,
                *        onActivated: function(item) {
                *           this.deleteRecords(item.data('id'));
                *        }
                *     }, {
                *        name: 'addRecord',
                *        icon: 'sprite:icon-16 icon-Add icon-error',
                *        caption: 'Добавить',
                *        isMainAction: true,
                *        onActivated: function(item) {
                *           this.showRecordDialog();
                *        }
                *     }]
                * <pre>
                * @see setItemsActions
                */
               itemsActions: [{
                  name: 'delete',
                  icon: 'sprite:icon-16 icon-Erase icon-error',
                  tooltip: rk('Удалить'),
                  caption: rk('Удалить'),
                  isMainAction: true,
                  onActivated: function (item) {
                     this.deleteRecords(item.data('id'));
                  }
               },{
                  name: 'move',
                  icon: 'sprite:icon-16 icon-Move icon-primary',
                  tooltip: rk('Перенести'),
                  caption: rk('Перенести'),
                  isMainAction: false,
                  onActivated: function (item) {
                     this.moveRecordsWithDialog([item.data('id')]);
                  }
               }],
               /**
                * @cfg {String|Boolean} Устанавливает возможность перемещения элементов с помощью курсора мыши.
                * @variant "" Запрещено перемещение.
                * @variant false Запрещено перемещение.
                * @variant allow Разрешено перемещение.
                * @variant true Разрешено перемещение.
                * @example
                * Подробнее о способах передачи значения в опцию вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/core/component/xhtml/">Вёрстка компонента</a>.
                * <b>Пример 1.</b> Ограничим возможность перемещения записей с помощью курсора мыши.
                * <pre>
                *     <option name="itemsDragNDrop" value=""></option>      <!-- Передаём пустую строку в атрибуте value. Иным способом пустая строка не распознаётся -->
                *     <option name="itemsDragNDrop" value="false"></option> <!-- Первый способ передачи false -->
                *     <option name="itemsDragNDrop">false</option>          <!-- Второй способ передачи false -->
                * </pre>
                * <b>Пример 2.</b> Разрешим перемещение записей с помощью курсора мыши.
                * <pre>
                *     <option name="itemsDragNDrop" type="string" value="allow"></option> <!-- Первый способ передачи allow -->
                *     <option name="itemsDragNDrop" type="string">allow</option>          <!-- Второй способ передачи allow -->
                *     <option name="itemsDragNDrop" value="true"></option> <!-- Первый способ передачи true -->
                *     <option name="itemsDragNDrop">true</option>          <!-- Второй способ передачи true -->
                * </pre>
                */
               itemsDragNDrop: 'allow',
               /**
                * @cfg {Function} Устанавливает функцию, которая будет выполнена при клике на строку.
                * @remark
                * Аргументы функции:
                * <ol>
                *    <li>id - идентификатор элемента коллекции - строки, по которой был произведён клик.</li>
                *    <li>item - элемент коллекции, по строке отображения которого был произведён клик; экземпляр класса {@link WS.Data/Entity/Record} с данными выбранной записи.</li>
                *    <li>target - контейнер визуального отображения (DOM-элемент) строки, по которой был произведён клик.</li>
                * </ol>
                * Установить или заменить функцию - обработчик клика на строку можно с помощью метода {@link setElemClickHandler}
                * @example
                * <pre class="brush: xml">
                *     <option name="elemClickHandler" type="function">js!SBIS3.Contacts.LatestThemes:prototype.elemClickHandler</option>
                * </pre>
                * @see setElemClickHandler
                */
               elemClickHandler: null,
               /**
                * @cfg {Boolean} Устанавливает режим множественного выбора элементов коллекции.
                * * true Режим множественного выбора элементов коллекции установлен.
                * * false Режим множественного выбора элементов коллекции отменен.
                */
               multiselect: false,
               /**
                * @cfg {String|null} Устанавливает режим подгрузки данных по скроллу.
                * @remark
                * По умолчанию, подгрузка осуществляется "вниз". Мы поскроллили и записи подгрузились вниз.
                * Но можно настроить скролл так, что записи будут загружаться по скроллу к верхней границе контейнера.
                * Важно. Запросы к БЛ все так же будут уходить с увеличением номера страницы. V
                * Может использоваться для загрузки истории сообщений, например.
                * @variant down Подгружать данные при достижении дна контейнера (подгрузка "вниз").
                * @variant up Подгружать данные при достижении верха контейнера (подгрузка "вверх").
                * @variant demand Подгружать данные при нажатии на кнопку "Еще...".
                * @variant null Не загружать данные по скроллу.
                *
                * @example
                * <pre>
                *    <option name="infiniteScroll">down</option>
                * </pre>
                * @see isInfiniteScroll
                * @see setInfiniteScroll
                */
               infiniteScroll: null,
               /**
                * @cfg {jQuery | String} Контейнер в котором будет скролл, если представление данных ограничено по высоте.
                * Можно передать Jquery-селектор, но поиск будет произведен от контейнера вверх.
                * @see isInfiniteScroll
                * @see setInfiniteScroll
                */
               infiniteScrollContainer: undefined,
               /**
                * @cfg {Boolean} Устанавливает режим постраничной навигации.
                * @remark
                * Постраничная навигация списка может быть двух типов:
                * <ol>
                *    <li>Полная. Пользователь видит номера первых страниц, затем многоточие и номер последней страницы.</li>
                *    <li>Частичная. Пользователь видит только номера текущей страницы, следующей и предыдущей. Общее количество страниц неизвестно.</li>
                * </ol>
                * Чтобы установить тип постраничной навигации, используйте опцию {@link partialPaging}.
                * <br/>
                * Тип постраничной навигации устанавливается по параметру "n" (см. <a href='https://wi.sbis.ru/doc/platform/developmentapl/cooperationservice/json-rpc/#recordset-json-rpc-3'>RecordSet - выборка данных в JSON-RPC для СБиС 3</a>), который возвращается в ответе на запрос к источнику данных (см. {@link dataSource}).
                * Параметр по умолчанию поддерживается <a href='https://wi.sbis.ru/doc/platform/developmentapl/workdata/logicworkapl/objects/blmethods/bllist/declr/'>декларативным методом бизнес-логики</a>, его значение будет установлено в соответствии со значением опции <i>partialPaging</i>.
                * Когда вы применяете другой тип списочного метода, опция <i>partialPaging</i> игнорируется, а значение параметра "n" должно быть установлено внутри метода: true - тип частичной постраничной навигации.
                * <br/>
                * Для контролов {@link SBIS3.CONTROLS.CompositeView} и {@link SBIS3.CONTROLS.TreeCompositeView} режим постраничной навигации имеет свои особенности работы:
                * <ol>
                *    <li>В режимах отображения "Список" и "Таблица" (см. {@link SBIS3.CONTROLS.CompositeViewMixin#viewMode viewMode}) постраничная навигация не работает, даже если опция <i>showPaging=true</i>. В этих режимах отображения автоматически устанавливается режим бесконечной подгрузки по скроллу - {@link infiniteScroll}.</li>
                *    <li>В режиме отображения "Плитка" постраничная навигация будет работать корректно.</li>
                * </ol>
                * @example
                * <pre>
                *     <option name="showPaging">true</option>
                * </pre>
                * @see setPage
                * @see getPage
                * @see infiniteScroll
                * @see partialPaging
                * @see SBIS3.CONTROLS.DSMixin#pageSize
                * @see SBIS3.CONTROLS.CompositeViewMixin#viewMode
                * @see SBIS3.CONTROLS.TreeCompositeView
                * @see SBIS3.CONTROLS.CompositeView
                */
               showPaging: false,
               /**
                * @cfg {String} Устанавливает режим редактирования по месту.
                * @remark
                * Варианты значений:
                * <ul>
                *    <li>"" (пустая строка) - редактирование по месту отключено;</li>
                *    <li>click - режим редактирования по клику на запись;</li>
                *    <li>hover - режим редактирования по наведению курсора на запись;</li>
                *    <li>autoadd - режим автоматического добавления новых элементов коллекции; этот режим позволяет при завершении редактирования последнего элемента автоматически создавать новый.</li>
                *    <li>toolbar - отображение панели инструментов при входе в режим редактирования записи.</li>
                *    <li>single - режим редактирования единичной записи. После завершения редактирования текущей записи не происходит автоматического перехода к редактированию следующей записи.</li>
                * </ul>
                * Режимы редактирования можно группировать и получать совмещенное поведение.
                * Например, задать редактирование по клику и отобразить панель инструментов при входе в режим редактирования записи можно такой конфигурацией:
                * <pre>
                *    <option name="editMode">click|toolbar</option>
                * </pre>
                * Подробное описание каждого режима редактирования и их демонстрационные примеры вы можете найти в разделе документации {@link https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/edit-in-place/ Редактирование по месту}.
                * @example
                * Установлен режим редактирования по клику на элемент коллекции.
                * <pre>
                *     <option name="editMode">click</option>
                * </pre>
                * @see getEditMode
                * @see setEditMode
                * @see editingTemplate
                */
               editMode: '',
               /**
                * @cfg {Content} Устанавливает шаблон строки редактирования по месту.
                * @remark
                * Шаблон строки редактирования по месту используется для удобного представления редактируемой записи.
                * Такой шаблон отрисовывается поверх редактируемой строки с прозрачным фоном.
                * Это поведение считается нормальным в целях решения прикладных задач.
                * Чтобы отображать только шаблон строки без прозрачного фона, нужно установить для него свойство background-color.
                * Данная опция обладает большим приоритетом, чем установленный в колонках редактор (см. {@link SBIS3.CONTROLS.DataGridView#columns}).
                * Данная опция может быть переопределена с помощью метода (@see setEditingTemplate).
                * Переопределить опцию можно в любой момент до показа редакторов на строке, например: (@see onBeginEdit) или (@see onItemClick).
                * @example
                * Пример шаблона вы можете найти в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/edit-in-place/template/">Шаблон строки редактирования по месту</a>.
                * @see editMode
                * @see setEditingTemplate
                * @see getEditingTemplate
                */
               editingTemplate: undefined,
               /**
                * @cfg {String} Устанавливает позицию отображения строки итогов.
                * @variant none Строка итогов не будет отображаться.
                * @variant top Строка итогов будет расположена вверху.
                * @variant bottom Строка итогов будет расположена внизу.
                * @remark
                * Отображение строки итогов конфигурируется тремя опциями: resultsPosition, {@link resultsText} и {@link resultsTpl}.
                * Данная опция определяет расположение строки итогов, а также предоставляет возможность отображения строки в случае отсутствия записей.
                * С подробным описанием можно ознакомиться в статье {@link https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/list-visual-display/results/ Строка итогов}.
                * @example
                * <pre class="brush: xml">
                *     <option name="resultsPosition">bottom</option> <!-- Строка итогов будет отображена под всеми элементами коллекции -->
                * </pre>
                * @see resultsText
                * @see resultsTpl
                */
               resultsPosition: 'none',
               /**
                * @cfg {String} Устанавливает заголовок строки итогов.
                * @remark
                * Отображение строки итогов конфигурируется тремя опциями: resultsText, {@link resultsPosition} и {@link resultsTpl}.
                * В данную опцию передается заголовок строки итогов.
                * С подробным описанием можно ознакомиться в статье {@link https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/list-visual-display/results/ Строка итогов}.
                * @example
                * <pre class="brush: xml">
                *    <option name="resultsText">Перечислено за квартал: </option>
                * </pre>
                * @see resultsPosition
                * @see resultsTpl
                */
               resultsText : rk('Итого'),
               /**
                * @cfg {String} Устанавливает шаблон отображения строки итогов.
                * @remark
                * Отображение строки итогов конфигурируется тремя опциями: resultsTpl, {@link resultsPosition} и {@link resultsText}.
                * В данную опцию передается имя шаблона, в котором описана конфигурация строки итогов.
                * Чтобы шаблон можно было передать в опцию компонента, его нужно предварительно подключить в массив зависимостей.
                * Опция позволяет пользователю выводить в строку требуемые данные и задать для нее определенное стилевое оформление.
                * Подсчет каких-либо итоговых сумм в строке не предусмотрен. Все итоги рассчитываются на стороне источника данных.
                * С подробным описанием можно ознакомиться в статье {@link https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/list-visual-display/results/ Строка итогов}.
                * @example
                * 1. Подключаем шаблон в массив зависимостей:
                * <pre>
                *     define('js!SBIS3.Demo.nDataGridView',
                *        [
                *           ...,
                *           'html!SBIS3.Demo.nDataGridView/resources/resultTemplate'
                *        ],
                *        ...
                *     );
                * </pre>
                * 2. Передаем шаблон в опцию:
                * <pre class="brush: xml">
                *     <option name="resultsTpl" value="html!SBIS3.Demo.nDataGridView/resources/resultTemplate"></option>
                * </pre>
                * @editor CloudFileChooser
                * @editorConfig extFilter xhtml
                * @see resultsPosition
                * @see resultsText
                */
               resultsTpl: undefined,
               /**
                * @cfg {Boolean} Устанавливает тип постраничной навигации.
                * @remark
                * Постраничная навигация списка может быть двух типов:
                * <ol>
                *    <li>Полная. Пользователь видит номера первых страниц, затем многоточие и номер последней страницы.</li>
                *    <li>Частичная. Пользователь видит только номера текущей страницы, следующей и предыдущей. Общее количество страниц неизвестно.</li>
                * </ol>
                * @see showPaging
                */
               partialPaging: true,
               scrollPaging: true, //Paging для скролла. TODO: объеденить с обычным пэйджингом в 200
               /**
                * @cfg {String|Function(DragEntityOptions):SBIS3.CONTROLS.DragEntity.Entity} Конструктор перемещаемой сущности, должен вернуть элемент наследник класса {@link SBIS3.CONTROLS.DragEntity.Row}
                * @see DragEntityOptions
                * @see SBIS3.CONTROLS.DragEntity.Row
                */
               dragEntity: 'dragentity.row',
               /**
                * @cfg {String|Function(DragEntityOptions):SBIS3.CONTROLS.DragEntity.Entity} Конструктор перемещаемой сущности, должен вернуть элемент наследник класса {@link SBIS3.CONTROLS.DragEntity.Row}
                * @see DragEntityListOptions
                * @see SBIS3.CONTROLS.DragEntity.List
                */
               dragEntityList: 'dragentity.list',
               /**
                * @cfg {WS.Data/MoveStrategy/IMoveStrategy) Стратегия перемещения. Класс, который реализует перемещение записей. Подробнее тут {@link WS.Data/MoveStrategy/Base}.
                * @see {@link WS.Data/MoveStrategy/Base}
                * @see {@link WS.Data/MoveStrategy/IMoveStrategy}
                */
               moveStrategy: 'movestrategy.base'
            },
            _scrollWatcher : undefined,
            _lastDeleteActionState: undefined, //Используется для хранения состояния операции над записями "Delete" - при редактировании по месту мы её скрываем, а затем - восстанавливаем состояние
            _componentBinder: null,
            _touchSupport: false,
            _editByTouch: false,
            _dragInitHandler: undefined, //метод который инициализирует dragNdrop
            _inScrollContainerControl: false
         },

         $constructor: function () {
            var dispatcher = CommandDispatcher;

            this._publish('onChangeHoveredItem', 'onItemClick', 'onItemActivate', 'onDataMerge', 'onItemValueChanged', 'onBeginEdit', 'onAfterBeginEdit', 'onEndEdit', 'onBeginAdd', 'onAfterEndEdit', 'onPrepareFilterOnMove', 'onPageChange', 'onBeginDelete', 'onEndDelete');
            this._setScrollPagerPositionThrottled = this._setScrollPagerPosition.throttle(100, true).bind(this);
            this._bindEventHandlers(this._container);

            this.initEditInPlace();
            this.setItemsDragNDrop(this._options.itemsDragNDrop);
            dispatcher.declareCommand(this, 'activateItem', this._activateItem);
            dispatcher.declareCommand(this, 'beginAdd', this._beginAdd);
            dispatcher.declareCommand(this, 'beginEdit', this._beginEdit);
            dispatcher.declareCommand(this, 'cancelEdit', this._cancelEdit);
            dispatcher.declareCommand(this, 'commitEdit', this._commitEdit);
         },

         init: function () {
            if (typeof this._options.pageSize === 'string') {
               this._options.pageSize = this._options.pageSize * 1;
            }
            if (this._isSlowDrawing(this._options.easyGroup)) {
               this.setGroupBy(this._options.groupBy, false);
            }
            this._prepareInfiniteScroll();
            ListView.superclass.init.call(this);
            this._initLoadMoreButton();
         },

         _bindEventHandlers: function(container) {
            container.on('swipe tap mousemove mouseleave touchend taphold touchstart', this._eventProxyHandler.bind(this));
         },

         _modifyOptions : function(opts){
            var lvOpts = ListView.superclass._modifyOptions.apply(this, arguments);
            //Если нам задали бесконечный скролл в виде Bool, то если true, то 'down' иначе null
            if (lvOpts.hasOwnProperty('infiniteScroll')){
               lvOpts.infiniteScroll = typeof lvOpts.infiniteScroll === 'boolean' ?
                  (lvOpts.infiniteScroll ? 'down' : null) :
                  lvOpts.infiniteScroll;
            }
            if (lvOpts.hasOwnProperty('itemsDragNDrop')) {
               if (typeof lvOpts.itemsDragNDrop === 'boolean') {
                  lvOpts.itemsDragNDrop = lvOpts.itemsDragNDrop ? 'allow' : '';
               }
            }
            return lvOpts;
         },

         _getElementToFocus: function() {
            return $('.controls-ListView__fakeFocusElement', this._container).first();
         },

         _setTouchSupport: function(support) {
            var currentTouch = this._touchSupport;
            this._touchSupport = Boolean(support);

            var container = this.getContainer(),
                toggleClass = container.toggleClass.bind(container, 'controls-ListView__touchMode', this._touchSupport);

            if(this._itemsToolbar) {
               /* При таче, можно поменять вид операций,
                  т.к. это не будет вызывать никаких визуальных дефектов,
                  а просто покажет операции в тач моде */
               if(
                   (!this._itemsToolbar.isVisible() || this._touchSupport) &&
                   this._itemsToolbar.getProperty('touchMode') !== this._touchSupport &&
                   /* Когда тулбар зафиксирован, не меняем вид операций */
                   !this._itemsToolbar.isToolbarLocking()
               ) {
                  toggleClass();
                  this._itemsToolbar.setTouchMode(this._touchSupport);
               }
            } else if(currentTouch !== this._touchSupport) {
               toggleClass();
            }
         },

         _eventProxyHandler: function(e) {
            var originalEvent = e.originalEvent,
                mobFix = 'controls-ListView__mobileSelected-fix';
            /* Надо проверять mousemove на срабатывание на touch устройствах,
               т.к. оно стреляет после тапа. После тапа событие mousemove имеет нулевой сдвиг, поэтому обрабатываем его как touch событие
                + добавляю проверку, что до этого мы были в touch режиме,
               это надо например для тестов, в которых эмулирется событие mousemove так же без сдвига, как и на touch устройствах. */
            this._setTouchSupport(Array.indexOf(['swipe', 'tap', 'touchend', 'taphold'], e.type) !== -1 || (e.type === 'mousemove' && !originalEvent.movementX && !originalEvent.movementY && constants.compatibility.touch && (originalEvent.touches || constants.browser.isMobilePlatform)));

            switch (e.type) {
               case 'mousemove':
                  this._mouseMoveHandler(e);
                  break;
               case 'touchstart':
                  this._touchstartHandler(e);
                  break;
               case 'swipe':
                  this._swipeHandler(e);
                  break;
               case 'tap':
                  this._tapHandler(e);
                  break;
               case 'mouseleave':
                  this._mouseLeaveHandler(e);
                  break;
               case 'touchend':
                   /* Ipad пакетирует измененния, и не применяет их к дому, пока не закончит работу синхронный код.
                      Для того, чтобы сэмулировать мновенную обработку клика, надо сделать изменения в DOM'e
                      раньше события click. Поэтому на touchEnd (срабатывает раньше клика) вешаем специальный класс,
                      который показывает по :hover оранжевый маркер и по событию tap его снимаем. */
                  this._container.addClass(mobFix);
                  break;
               case 'taphold':
                  this._container.removeClass(mobFix);
                  break;

            }
         },

         _createScrollPager: function(){
            var scrollContainer = this._scrollWatcher.getScrollContainer();
            this._scrollWatcher.subscribe('onScroll', this._onScrollHandler.bind(this));
            this._scrollPager = new Paging({
               element: $('> .controls-ListView__scrollPager', this._container),
               visible: false,
               showPages: false,
               idProperty: 'id',
               parent: this
            });
            // TODO: То, что ListView знает о компонентах в которые он может быть вставленн и то, что он переносит свои
            // контенеры в контенеры родительских компонентов является хаком. Подумать как изменить архитектуру
            // работы с пэйджером что бы избавится от этого.
            if (this._inScrollContainerControl) {
              $('> .controls-ListView__scrollPager', this._container).appendTo(scrollContainer.parent());
            } else if (constants.browser.isMobilePlatform) {
               // скролл может быть у window, но нельзя делать appendTo(window)
               scrollContainer = scrollContainer[0] == window ? $('body') : scrollContainer;
               $('> .controls-ListView__scrollPager', this._container).appendTo(scrollContainer);
            }
            this._setScrollPagerPosition();
            this._scrollBinder = new ComponentBinder({
               view: this,
               paging: this._scrollPager
            });
            this._scrollBinder.bindScrollPaging();
            dcHelpers.trackElement(this.getContainer(), true).subscribe('onVisible', this._onVisibleChange.bind(this));

            if (!this._inScrollContainerControl) {
               // Отлавливаем изменение масштаба
               // Когда страница увеличена на мобильных платформах или если на десктопе установить ширину браузера меньше 1024рх,
               // то горизонтальный скрол(и иногда вертикальный) происходит внутри window.
               $(window).on('resize scroll', this._setScrollPagerPositionThrottled);
            }
         },

         _onVisibleChange: function(event, visible){
            if (this._scrollPager) {
               this._scrollPager.setVisible(visible);
            }
         },

         _onScrollHandler: function(event, scrollTop){
            var scrollPage = this._scrollBinder._getScrollPage(scrollTop),
                itemActions = this.getItemsActions();

            if(itemActions && itemActions.isItemActionsMenuVisible()){
               itemActions.hide();
            }
            this._notify('onScrollPageChange', scrollPage);
         },
         _setScrollPagerPosition: function(){
            var right;
            // Если таблица находится в SBIS3.CONTROLS.ScrollContainer, то пейджер находится в его скролируемом
            // контенере и спозиционирован абсолютно и пересчет позиции не требуется.
            if (!this._inScrollContainerControl) {
               // На ios на маленьком зуме все нормально. На большом - элементы немного смещаются,
               // и смещение зависит от положения скрола и от зума. Это не ошибка расчета, а баг(фича?) ipad.
               // Смещены элементы со стилем right: 0 и bottom: 0. На небольшом зуме этого смещения нет.
               right = window.innerWidth - this.getContainer().get(0).getBoundingClientRect().right;
               this._scrollPager.getContainer().css('right', right);
            }
         },
         _keyboardHover: function (e) {
            var
               selectedKeys,
               selectedKey = this.getSelectedKey(),
               newSelectedKey,
               newSelectedItem;
            switch (e.which) {
               case constants.key.up:
                  newSelectedItem = this._getPrevItemByDOM(selectedKey);
                  break;
               case constants.key.down:
                  newSelectedItem = this._getNextItemByDOM(selectedKey);
                  break;
               case constants.key.enter:
                  if(selectedKey !== undefined && selectedKey !== null) {
                     var selectedItem = $('[data-id="' + selectedKey + '"]', this._getItemsContainer());
                     this._elemClickHandler(selectedKey, this.getItems().getRecordById(selectedKey), selectedItem, e);
                  }
                  break;
               case constants.key.space:
                  newSelectedItem = this._getNextItemByDOM(selectedKey);
                  if (!this._container.hasClass('controls-ListView__hideCheckBoxes')) {
                     this.toggleItemsSelection([selectedKey]);
                  }
                  break;
               case constants.key.o:
                  if (e.ctrlKey && e.altKey && e.shiftKey) {
                     this.sendCommand('mergeItems', this.getSelectedKeys());
                  }
                  break;
               case constants.key.del:
                   selectedKeys = this._options.multiselect ? this.getSelectedKeys() : [];
                   if (selectedKeys.length === 0 && selectedKey) {
                      selectedKeys = [selectedKey];
                   }
                   if (selectedKeys.length && this._allowDelete()) {
                      this.deleteRecords(selectedKeys);
                   }
                  break;
            }
            if (newSelectedItem && newSelectedItem.length) {
               newSelectedKey = newSelectedItem.data('id');
               this.setSelectedKey(newSelectedKey);
               this._scrollToItem(newSelectedKey);
            }
            return false;
         },
         //TODO: Придрот для .150, чтобы хоткей del отрабатывал только если есть соответствующая операция над записью.
         _allowDelete: function() {
            var
                delInstance,
                itemActions = this.getItemsActions();

            if (itemActions) {
               delInstance = itemActions.getItemInstance('delete');
            }
            return this.isEnabled() && !!delInstance && delInstance.isVisible();
         },
         /**
          * Возвращает следующий элемент
          * @param id
          * @returns {jQuery}
          */
         getNextItemById: function (id) {
            var projection = this._getItemsProjection();
            return this._getHtmlItemByProjectionItem(
                projection.getNext(
                    projection.getItemBySourceItem(
                     this.getItems().getRecordById(id)
                  )
               )
            );
         },
         /**
          * Возвращает предыдущий элемент
          * @param id
          * @returns {jQuery}
          */
         getPrevItemById: function (id) {
            var projection = this._getItemsProjection();
            return this._getHtmlItemByProjectionItem(
                projection.getPrevious(
                    projection.getItemBySourceItem(
                     this.getItems().getRecordById(id)
                  )
               )
            );
         },

         _getNextItemByDOM: function(id) {
            return this._getHtmlItemByDOM(id, true);
         },

         _getPrevItemByDOM: function(id) {
            return this._getHtmlItemByDOM(id, false);
         },

         _getHtmlItemByProjectionItem: function (item) {
            if (item) {
               return $('.js-controls-ListView__item[data-id="' + item.getContents().getId() + '"]', this._getItemsContainer());
            }
            return undefined;
         },
         /**
          *
          * @param id - идентификатор элемента
          * @param isNext - если true вернет следующий элемент, false - предыдущий, undefined - текущий
          * @returns {jQuery}
          * @private
          */
         // TODO Подумать, как решить данную проблему. Не надёжно хранить информацию в доме
         // Поиск следующего или предыдущего элемента коллекции с учётом вложенных контролов
         _getHtmlItemByDOM: function (id, isNext) {
            var items = $('.js-controls-ListView__item', this._getItemsContainer()).not('.ws-hidden'),
               selectedItem = $('[data-id="' + id + '"]', this._getItemsContainer()),
               index = items.index(selectedItem),
               siblingItem;
            if (isNext) {
               if (index + 1 < items.length) {
                  siblingItem = items.eq(index + 1);
               }
            }
            else if (isNext === false) {
               if (index > 0) {
                  siblingItem = items.eq(index - 1);
               }
            } else {
               siblingItem = items.eq(index);
            }
            if (siblingItem)
               return this.getItems().getRecordById(siblingItem.data('id')) ? siblingItem : this._getHtmlItemByDOM(siblingItem.data('id'), isNext);
            else
               return undefined;
         },
         _isViewElement: function (elem) {
            return  dcHelpers.contains(this._getItemsContainer()[0], elem[0]);
         },
         _onClickHandler: function(e) {
            ListView.superclass._onClickHandler.apply(this, arguments);
            var $target = $(e.target),
                target = this._findItemByElement($target),
                model;

            if (target.length && this._isViewElement(target)) {
               model = this._getItemsProjection().getByHash(target.data('hash')).getContents();
               this._elemClickHandler(model.getId(), model, e.target, e);
            }
            if (this._options.multiselect && $target.length && $target.hasClass('controls-DataGridView__th__checkBox')){
               $target.hasClass('controls-DataGridView__th__checkBox__checked') ? this.setSelectedKeys([]) :this.setSelectedItemsAll();
               $target.toggleClass('controls-DataGridView__th__checkBox__checked');
            }
            if (!Object.isEmpty(this._options.groupBy) && this._options.groupBy.clickHandler instanceof Function) {
               var closestGroup = $target.closest('.controls-GroupBy', this._getItemsContainer());
               if (closestGroup.length) {
                  this._options.groupBy.clickHandler.call(this, $target);
               }
            }
            if (!Object.isEmpty(this._options.groupBy) && this._options.easyGroup && $(e.target).hasClass('controls-GroupBy__separatorCollapse')) {
               var idGroup = $(e.target).closest('.controls-GroupBy').data('group');
               this.toggleGroup(idGroup);
            }
         },

         _touchstartHandler: function() {
            if (this._isHoverEditMode()) {
               this._editByTouch = true;
            }
         },
         /**
          * Обрабатывает перемещения мышки на элемент представления
          * @param e
          * @private
          */
         _mouseMoveHandler: function (e) {
            var $target = $(e.target),
                target;

            target = this._findItemByElement($target);

            if (target.length) {
               /* Проверяем, чем был вызвано событие, мышью или движением пальца,
                  чтобы в зависимости от этого понимать, надо ли показывать операции */
               if(!this._touchSupport) {
                  this._changeHoveredItem(target);
               }
            } else if (!this._isHoverControl($target)) {
               this._mouseLeaveHandler();
            }
         },

         _getScrollContainer: function() {
            var scrollWatcher = this._scrollWatcher,
                scrollContainer;

            function findScrollContainer(node) {
               if (node === null) {
                  return null;
               }

               if (node.scrollHeight > node.clientHeight) {
                  return node;
               } else {
                  findScrollContainer(node.parentNode);
               }
            }

            if(scrollWatcher) {
               scrollContainer = scrollWatcher.getScrollContainer();
            } else {
               /* т.к. скролл может находиться у произвольного контейнера, то попытаемся его найти */
               scrollContainer = $(findScrollContainer(this._container[0]));

               /* если всё же не удалось найти, то просто будем считать body */
               if(!scrollContainer.length) {
                  scrollContainer = constants.$body;
               }
            }

            return $(scrollContainer);
         },
         /**
          * Метод, меняющий текущий выделеный по ховеру элемент
          * @param {jQuery} target Новый выделеный по ховеру элемент
          * когда ключ элемента не поменялся, но сам он изменился (перерисовался)
          * @private
          */
         _changeHoveredItem: function(target) {
            var targetKey = target[0].getAttribute('data-id');

            if (targetKey !== undefined && (this._hoveredItem.key !== targetKey)) {
               this._updateHoveredItem(target);
            }
         },

         _updateHoveredItem: function(target) {
            this._hasHoveredItem() && this.getHoveredItem().container.removeClass('controls-ListView__hoveredItem');
            target.addClass('controls-ListView__hoveredItem');
            this._hoveredItem = this._getElementData(target);
            this._notifyOnChangeHoveredItem();
         },

         _getDomElementByItem : function(item) {
            //FIXME т.к. строка редактирования по местру спозиционирована абсолютно, то надо искать оригинальную строку
            return this._getItemsContainer().find('.js-controls-ListView__item[data-hash="' + item.getHash() + '"]:not(.controls-editInPlace)')
         },

         _getElementData: function(target) {
            if (target.length){
               var cont = this._container[0],
                   containerCords = cont.getBoundingClientRect(),
                   targetKey = target[0].getAttribute('data-id'),
                   item = this.getItems() ? this.getItems().getRecordById(targetKey) : undefined,
                   correctTarget = target.hasClass('controls-editInPlace') ? this._getDomElementByItem(this._options._itemsProjection.getItemBySourceItem(item)) : target,
                   targetCords = correctTarget[0].getBoundingClientRect();

               return {
                  key: targetKey,
                  record: item,
                  container: correctTarget,
                  position: {
                     /* При расчётах координат по вертикали учитываем прокрутку */
                     top: targetCords.top - containerCords.top + cont.scrollTop,
                     left: targetCords.left - containerCords.left
                  },
                  size: {
                     height: correctTarget[0].offsetHeight,
                     width: correctTarget[0].offsetWidth
                  }
               }
            }
         },

         _notifyOnChangeHoveredItem: function() {
            /* Надо делать клон и отдавать наружу только клон объекта, иначе,
               если его кто-то испортит, испортится он у всех, в том числе и у нас */
            var hoveredItemClone = cFunctions.clone(this._hoveredItem);
            this._notify('onChangeHoveredItem', hoveredItemClone);
            this._onChangeHoveredItem(hoveredItemClone);
         },

         /**
          * Проверяет, относится ли переданный элемент,
          * к контролам которые отображаются по ховеру.
          * @param {jQuery} $target
          * @returns {boolean}
          * @private
          */
         _isHoverControl: function ($target) {
            var itemsToolbarContainer = this._itemsToolbar && this._itemsToolbar.getContainer();
            return itemsToolbarContainer && (itemsToolbarContainer[0] === $target[0] || $.contains(itemsToolbarContainer[0], $target[0]));
         },
         /**
          * Обрабатывает уведение мышки с элемента представления
          * @private
          */
         _mouseLeaveHandler: function () {
            var hoveredItem = this.getHoveredItem(),
                emptyHoveredItem;

            if (hoveredItem.container === null) {
               return;
            }

            emptyHoveredItem = this._clearHoveredItem();
            this._notify('onChangeHoveredItem', emptyHoveredItem);
            this._onChangeHoveredItem(emptyHoveredItem);
         },
         /**
          * Обработчик на смену выделенного элемента представления
          * @private
          */
         _onChangeHoveredItem: function (target) {
            var itemsActions;

            if (this._isSupportedItemsToolbar()) {
               if (target.container){
                  if (!this._touchSupport) {
                     this._showItemsToolbar(target);
                  }
                  // setItemsActions стреляет событием onChangeHoveredItem, чтобы прикладники могли скрыть/показать нужные опции для строки
                  // поэтому после события нужно обновить видимость элементов
                  itemsActions = this.getItemsActions();
                  if(itemsActions) {
                     if (itemsActions.isVisible()) {
                        itemsActions.applyItemActions();
                     }
                  }
               } else {
                  this._hideItemsToolbar();
               }
            }
         },

         /**
          * Установить что отображается при отсутствии записей.
          * @param html Содержимое блока.
          * @example
          * <pre>
          *     DataGridView.setEmptyHTML('Нет записей');
          * </pre>
          * @see emptyHTML
          */
         setEmptyHTML: function (html) {
            ListView.superclass.setEmptyHTML.apply(this, arguments);
            this._getEmptyDataContainer().empty().html(html);
            this._toggleEmptyData(this._getItemsProjection() && !this._getItemsProjection().getCount());
         },

         _getEmptyDataContainer: function() {
            return $('> .controls-ListView__EmptyData', this._container.get(0));
         },

         setMultiselect: function(flag) {
            ListView.superclass.setMultiselect.apply(this, arguments);
            this.getContainer().toggleClass('controls-ListView__multiselect', flag)
                               .toggleClass('controls-ListView__multiselect__off', !flag);
         },

         /**
          * Устанавливает шаблон отображения элемента коллекции.
          * @param {String|Function} tpl Шаблон отображения каждого элемента коллекции.
          * Подробнее о подключении в компонент шаблона вы можете прочитать в опции {@link itemTemplate}.
          * @example
          * <pre>
          *     DataGridView.setItemTemplate(myItemTpl);
          * </pre>
          * @see itemTemplate
          */
         setItemTemplate: function(tpl) {
            this._options.itemTemplate = tpl;
         },

         _getItemsContainer: function () {
            return $('.controls-ListView__itemsContainer', this._container.get(0)).first();
         },
         _getItemContainer: function(parent, item) {
            return parent.find('>[data-id="' + item.getId() + '"]:not(".controls-editInPlace")');
         },
         _addItemAttributes: function(container) {
            container.addClass('js-controls-ListView__item');
            ListView.superclass._addItemAttributes.apply(this, arguments);
         },

         /* +++++++++++++++++++++++++++ */

         _elemClickHandler: function (id, data, target, e) {
            var $target = $(target),
                self = this,
                elClickHandler = this._options.elemClickHandler,
                needSelect = true,
                afterHandleClickResult = fHelpers.forAliveOnly(function(result) {
                   if (result !== false) {
                      if(needSelect) {
                         self.setSelectedKey(id);
                      }
                      self._elemClickHandlerInternal(data, id, target, e);
                      elClickHandler && elClickHandler.call(self, id, data, target, e);
                   }
                }, this),
                onItemClickResult;

            if (this._options.multiselect) {
               if ($target.hasClass('js-controls-ListView__itemCheckBox')) {
                  if(this._isItemSelected(id)) {
                     needSelect = false;
                  }
                  this._onCheckBoxClick($target);
               }
               else {
                  onItemClickResult = this._notifyOnItemClick(id, data, target, e);
               }
            }
            else {
               onItemClickResult = this._notifyOnItemClick(id, data, target, e);
            }
            if (onItemClickResult instanceof Deferred) {
               onItemClickResult.addCallback(function (result) {
                  afterHandleClickResult(result);
                  return result;
               });
            } else {
               afterHandleClickResult(onItemClickResult);
            }
         },
         _notifyOnItemClick: function(id, data, target, e) {
            return this._notify('onItemClick', id, data, target, e);
         },
         _onCheckBoxClick: function(target) {
            this.toggleItemsSelection([target.closest('.controls-ListView__item').attr('data-id')]);
         },

         _elemClickHandlerInternal: function (data, id, target, e) {
            /* Клик по чекбоксу не должен вызывать активацию элемента */
            if(!$(target).hasClass('js-controls-ListView__itemCheckBox')) {
               this._activateItem(id);
            }
         },
         //TODO: Временное решение для выделения "всех" (на самом деле первой тысячи) записей
         setSelectedAll: function() {
            var selectedItems = this.getSelectedItems();
            if (this.isInfiniteScroll() && this.getItems().getCount() < 1000){
               this._loadFullData.apply(this, arguments)
                  .addCallback(function(dataSet) {
                     //Ввостановим значение _limit, т.к. после вызова reload _limit стал равен 1000,
                     //и следующие страницы будут грузиться тоже по 1000 записей
                     this._limit = this._options.pageSize;
                     //Очистим selectedItems чтобы при заполнении новыми элементами, не делать проверку на наличие элементов в коллекции
                     if (selectedItems && selectedItems.getCount()) {
                        selectedItems.clear();
                     }
                      this.setSelectedItemsAll.call(this);
                     if (dataSet.getCount() == 1000 && dataSet.getMetaData().more){
                        var message = 'Отмечено 1000 записей, максимально допустимое количество, обрабатываемое системой СБИС.';

                        var windowOptions = (constants.defaultOptions || {})['SBIS3.CORE.Window'] || {};
                        //TODO В 3.7.4.200 popupMixin не поддерживает анимацию, соответсвенно и информационные окна, сделанные на его основе
                        //TODO По этой причине проверяем, если включена настройка 'анимированные окна', то покажем старое окно.
                        //TODO В 3.7.4.220 планируется поддержать анимацию -> выпилить этот костыль!
                        if(windowOptions.animatedWindows){
                           fcHelpers.message(message);
                        }
                        else {
                           InformationPopupManager.showMessageDialog({
                              status: 'default',
                              message: message,
                              parent: this
                           });
                        }
                     }
                  }.bind(this));
            } else {
               this.setSelectedItemsAll.call(this);
            }
         },

         _loadFullData: function() {
            return this.reload(this.getFilter(), this.getSorting(), 0, 1000);
         },

         _drawSelectedItems: function (idArray, changes) {
            function findElements(ids, itemsContainer) {
               var elements = $([]), elem;
               for (i = 0; i < ids.length; i++) {
                  //сначала ищем непосредственно в контейнере, чтоб не найти вложенные списки
                  elem = itemsContainer.children('.controls-ListView__item[data-id="' + ids[i] + '"]');
                  if (elem.length) {
                     elements.push(elem.get(0));
                  }
                  else {
                     //если не нашли, то ищем глубже. Это может потребоваться например для пликти, где элементы лежат в нескольких контейнерах
                     elem = itemsContainer.find('.controls-ListView__item[data-id="' + ids[i] + '"]');
                     if (elem.length) {
                        elements.push(elem.get(0));
                     }
                  }
               }
               return elements;
            }

            var i, itemsContainer = this._getItemsContainer();
            //Если точно знаем что изменилось, можем оптимизировать отрисовку
            if (changes && !Object.isEmpty(changes)) {
               var rmKeyItems, addKeyItems;
               addKeyItems = findElements(changes.added, itemsContainer);
               rmKeyItems = findElements(changes.removed, itemsContainer);
               addKeyItems.addClass('controls-ListView__item__multiSelected');
               rmKeyItems.removeClass('controls-ListView__item__multiSelected');
            }
            else {
               /* Запоминаем элементы, чтобы не делать лишний раз выборку по DOM'у,
                это дорого */
               var domItems = itemsContainer.find('.controls-ListView__item');

               /* Удаляем выделение */
               /*TODO возможно удаление не нужно, и вообще состоние записи должно рисоваться исходя из модели
               будет решено по задаче https://inside.tensor.ru/opendoc.html?guid=fb9b0a49-6829-4f06-aa27-7d276a1c9e84
               */
               domItems.filter('.controls-ListView__item__multiSelected').removeClass('controls-ListView__item__multiSelected');
               /* Проставляем выделенные ключи */
               for (i = 0; i < domItems.length; i++) {
                  if (ArraySimpleValuesUtil.hasInArray(idArray, domItems[i].getAttribute('data-id'))) {
                     domItems.eq(i).addClass('controls-ListView__item__multiSelected');
                  }
               }
            }
         },

         /*TODO третий аргумент - временное решение, пока выделенность не будет идти через состояние
         * делаем его, чтоб не после каждого чмха перерисовывать выделение
         * */
         _drawSelectedItem: function (id, index, lightVer) {
            //рисуем от ключа
            if (lightVer !== true) {
               $(".controls-ListView__item", this._getItemsContainer()).removeClass('controls-ListView__item__selected');
               if (this._getItemsProjection()) {
                  var projItem = this._getItemsProjection().at(index);
                  if (projItem) {
                     var hash = projItem.getHash();
                     $('.controls-ListView__item[data-hash="' + hash + '"]', this._container).addClass('controls-ListView__item__selected');
                  }

               }

            }
         },
         /**
          * Перезагружает набор записей представления данных с последующим обновлением отображения.
          * @remark
          * Производится запрос на выборку записей из источника данных по установленным параметрам:
          * <ol>
          *    <li>Параметры фильтрации, которые устанавливают с помощью опции {@link SBIS3.CONTROLS.ItemsControlMixin#filter}.</li>
          *    <li>Параметры сортировки, которые устанавливают с помощью опции {@link SBIS3.CONTROLS.ItemsControlMixin#sorting}.</li>
          *    <li>Порядковый номер записи в источнике, с которого будет производиться отбор записей для выборки. Устанавливают с помощью метода {@link SBIS3.CONTROLS.ItemsControlMixin#setOffset}.</li>
          *    <li>Масимальное число записей, которые будут присутствовать в выборке. Устанавливают с помощью метода {@link SBIS3.CONTROLS.ItemsControlMixin#pageSize}.</li>
          * </ol>
          * Вызов метода инициирует событие {@link SBIS3.CONTROLS.ItemsControlMixin#onBeforeDataLoad}. В случае успешной перезагрузки набора записей происходит событие {@link SBIS3.CONTROLS.ItemsControlMixin#onDataLoad}, а в случае ошибки - {@link SBIS3.CONTROLS.ItemsControlMixin#onDataLoadError}.
          * Если источник данных не установлен, производит перерисовку установленного набора данных.
          * @return {Deferred}
          * @example
          * <pre>
          *    btn.subscribe('onActivated', function() {
          *       DataGridViewBL.reload();
          *    });
          * </pre>
          */
         reload: function () {
            this._reloadInfiniteScrollParams();
            this._previousGroupBy = undefined;
            // При перезагрузке нужно также почистить hoveredItem, иначе следующее отображение тулбара будет для элемента, которого уже нет (ведь именно из-за этого ниже скрывается тулбар).
            this._hoveredItem = {};
            this._unlockItemsToolbar();
            this._hideItemsToolbar();
            this._observeResultsRecord(false);
            return ListView.superclass.reload.apply(this, arguments);
         },
         /**
          * Метод установки/замены обработчика клика по строке.
          * @param method Имя новой функции обработчика клика по строке.
          * @example
          * <pre>
          *     var myElemClickHandler = function(id, data, target){
           *        console.log(id, data, target)
           *     }
          *     DataGridView.setElemClickHandler(myElemClickHandler);
          * </pre>
          * @see elemClickHandler
          */
         setElemClickHandler: function (method) {
            this._options.elemClickHandler = method;
         },
         redrawItem: function(item) {
            ListView.superclass.redrawItem.apply(this, arguments);
            //TODO: Временное решение для .100.  В .30 состояния выбранности элемента должны добавляться в шаблоне.
            this._drawSelectedItems(this.getSelectedKeys());
            this._drawSelectedItem(this.getSelectedKey(), this.getSelectedIndex());
         },
         /**
          * Проверить наличие скрола, и догрузить еще данные если его нет
          * @return {[type]} [description]
          */
         scrollLoadMore: function(){
            if (this._options.infiniteScroll && this._scrollWatcher && !this._scrollWatcher.hasScroll()) {
               this._scrollLoadNextPage();
            }
         },
         //********************************//
         //   БЛОК РЕДАКТИРОВАНИЯ ПО МЕСТУ //
         //*******************************//
         toggleCheckboxes: function(toggle) {
            this._container.toggleClass('controls-ListView__hideCheckBoxes', !toggle);
            this._notifyOnSizeChanged(true);
         },
         _isHoverEditMode: function() {
            return this._options.editMode.indexOf('hover') !== -1;
         },
         _isClickEditMode: function() {
            return this._options.editMode.indexOf('click') !== -1;
         },
         initEditInPlace: function() {
            this._notifyOnItemClick = this.beforeNotifyOnItemClick();
            if (this._isHoverEditMode()) {
               this._toggleEipHoveredHandlers(true);
            } else if (this._isClickEditMode()) {
               this._toggleEipClickHandlers(true);
            }
         },

         _toggleEipHoveredHandlers: function(toggle) {
            var methodName = toggle ? 'subscribe' : 'unsubscribe';
            this[methodName]('onChangeHoveredItem', this._onChangeHoveredItemHandler);
            if (constants.compatibility.touch) {
               this[methodName]('onItemClick', this._startEditOnItemClick);
            }
         },

         _toggleEipClickHandlers: function(toggle) {
            this[toggle ? 'subscribe' : 'unsubscribe']('onItemClick', this._startEditOnItemClick);
         },

         _itemsReadyCallback: function() {
            ListView.superclass._itemsReadyCallback.apply(this, arguments);
            if (this._hasEditInPlace()) {
               this._getEditInPlace().setItems(this.getItems());
               this._getEditInPlace().setItemsProjection(this._getItemsProjection());
            }
         },
         beforeNotifyOnItemClick: function() {
            var handler = this._notifyOnItemClick;
            return function() {
               var args = arguments;
               if (this._hasEditInPlace()) {
                  return this._getEditInPlace().endEdit(true).addCallback(function() {
                     return handler.apply(this, args)
                  }.bind(this));
               } else {
                  return handler.apply(this, args)
               }
            }
         },
         /**
          * Устанавливает режим редактирования по месту.
          * @param {String} editMode Режим редактирования по месту. Подробнее о возможных значениях вы можете прочитать в описании к опции {@link editMode}.
          * @see editMode
          * @see getEditMode
          */
         setEditMode: function(editMode) {
            if (editMode ==='' || editMode !== this._options.editMode) {
               if (this._isHoverEditMode()) {
                  this._toggleEipHoveredHandlers(false);
               } else if (this._isClickEditMode()) {
                  this._toggleEipClickHandlers(false);
               }
               this._destroyEditInPlace();
               this._options.editMode = editMode;
               if (this._isHoverEditMode()) {
                  this._toggleEipHoveredHandlers(true);
               } else if (this._isClickEditMode()) {
                  this._toggleEipClickHandlers(true);
               }
            }
         },
         /**
          * Возвращает признак, по которому можно определить установленный режим редактирования по месту.
          * @returns {String} Режим редактирования по месту. Подробнее о возможных значениях вы можете прочитать в описании к опции {@link editMode}.
          * @see editMode
          * @see setEditMode
          */
         getEditMode: function() {
            return this._options.editMode;
         },
         /**
          * Устанавливает шаблон строки редактирования по месту.
          * @param {String} template Шаблон редактирования по месту. Подробнее вы можете прочитать в описании к опции {@link editingTemplate}.
          * @see editingTemplate
          * @see getEditingTemplate
          */
         setEditingTemplate: function(template) {
            this._options.editingTemplate = template;
            if (this._hasEditInPlace()) {
               this._getEditInPlace().setEditingTemplate(template);
            }
         },

         /**
          * Возвращает шаблон редактирования по месту.
          * @returns {String} Шаблон редактирования по месту. Подробнее вы можете прочитать в описании к опции {@link editingTemplate}.
          * @see editingTemplate
          * @see setEditingTemplate
          */
         getEditingTemplate: function() {
            return this._options.editingTemplate;
         },

         showEip: function(model, options, withoutActivateFirstControl) {
            return this._canShowEip() ? this._getEditInPlace().showEip(model, options, withoutActivateFirstControl) : Deferred.fail();
         },

         _canShowEip: function() {
            // Отображаем редактирование только если enabled
            return this.isEnabled();
         },

         _setEnabled : function(enabled) {
            ListView.superclass._setEnabled.call(this, enabled);
            //разрушать редактирование нужно как при enabled = false так и при enabled = true. У нас предусмотрено
            //редактирование задизабленного браузера, и настройки редакторов для задизабленного режима, может отличаться
            //от раздизабленного.
            this._destroyEditInPlace();
         },

         _startEditOnItemClick: function(event, id, model, originalEvent) {
            var
               result = this.showEip(model, { isEdit: true }, false);
            if (originalEvent.type === 'click') {
               result.addCallback(function(res) {
                  ImitateEvents.imitateFocus(originalEvent.clientX, originalEvent.clientY);
                  return res;
               });
            }
            event.setResult(result);
         },

         _onChangeHoveredItemHandler: function(event, hoveredItem) {
            var target = hoveredItem.container;

            //Если к компьютеру подключен touch телевизор, то при клике на телевизоре по строке, нам нужно сразу запустить
            //редактирование этой строки, не выполнив до этого показ строки по ховеру. Переменная _editByTouch выставляется
            //в true когда произошло событие touchstart, которое может произойти только при нажатие на touch устройстве.
            //И в случае touch мы не будем показывать строку, и в полседствии обрабочик клика по строке, запустит редактирование.
            if (this._editByTouch) {
               this._editByTouch = false;
               return;
            }

            if (target && !(target.hasClass('controls-editInPlace') || target.hasClass('controls-editInPlace__editing'))) {
               this.showEip(this.getItems().getRecordById(hoveredItem.key), { isEdit: false });
               // todo Удалить при отказе от режима "hover" у редактирования по месту [Image_2016-06-23_17-54-50_0108] https://inside.tensor.ru/opendoc.html?guid=5bcdb10f-9d69-49a0-9807-75925b726072&description=
            } else if (this._hasEditInPlace()) {
               this._getEditInPlace().hide();
            }
         },

         redraw: function () {
            /*TODO Косяк с миксинами - не вызывается before из decorableMixin временное решение*/
            if (this._options._decorators) {
               this._options._decorators.update(this);
            }
            //TODO: При перерисовке разрушаем редактор, иначе ItemsControlMixin задестроит все контролы внутри,
            //но не проставит все необходимые состояния. В .200 начнём пересоздавать редакторы для каждого редактирования
            //и данный код не понадобится.
            if (this._hasEditInPlace()) {
               this._getEditInPlace().endEdit(); // Перед дестроем нужно обязательно завершить редактирование и отпустить все деферреды.
               this._getEditInPlace()._destroyEip();
            }
            this._redrawResults();
            ListView.superclass.redraw.apply(this, arguments);
         },

         /**
          * @private
          */
         _getEditInPlace: function() {
            if (!this._hasEditInPlace()) {
               this._createEditInPlace();
            }
            return this._editInPlace;
         },

         _hasEditInPlace: function() {
            return !!this._editInPlace;
         },

         _createEditInPlace: function() {
            var
               controller = this._isHoverEditMode() ? EditInPlaceHoverController : EditInPlaceClickController;
            this._editInPlace = new controller(this._getEditInPlaceConfig());
            this._getItemsContainer().on('mousedown', '.js-controls-ListView__item', this._editInPlaceMouseDownHandler);
         },

         _editInPlaceMouseDownHandler: function(event) {
            // При редактировании по месту нужно делать preventDefault на mousedown, в таком случае фокусы отработают в нужном порядке.
            // Нативно событийный порядок следующий: mousedown, focus, mouseup, click.
            // Нам необходимо чтобы mousedown не приводил к focus, иначе ломается поведенчиская логика и при клике на другую запись
            // редактирование по месту закрывается из-за потери фокуса, а не из-за клика.
            // Из-за этого возникает следующая ошибка: mousedown был над одним элементом, а по потере фокуса этот элемент сместился и
            // mousedown уже случился для другого элемента. В итоге click не случается и редактирование другой записи вообще не запускается.
            // todo: можно будет выпилить, когда редактирование по месту будет частью разметки табличных представлений
            event.preventDefault();
         },

         //TODO: Сейчас ListView не является родителем редактирования по месту, и при попытке отвалидировать
         //ListView, валидация редактирования не вызывается. Сейчас есть сценарий, когда редактирование
         //располагается на карточке, и при попытке провалидировать карточку перед сохранением, результат
         //будет true, но редактирование может быть невалидно.
         validate: function() {
            var editingIsValid = !this.isEdit() || this._getEditInPlace().isValidChanges();
            return ListView.superclass.validate.apply(this, arguments) && editingIsValid;
         },

         _destroyEditInPlace: function() {
            if (this._hasEditInPlace()) {
               this._getItemsContainer().off('mousedown', '.js-controls-ListView__item', this._editInPlaceMouseDownHandler);
               this._editInPlace.destroy();
               this._editInPlace = null;
            }
         },
         _getEditInPlaceConfig: function() {
            var
               config = {
                  items: this.getItems(),
                  ignoreFirstColumn: this._options.multiselect,
                  dataSource: this._dataSource,
                  itemsProjection: this._getItemsProjection(),
                  notEndEditClassName: this._notEndEditClassName,
                  editingTemplate: this._options.editingTemplate,
                  itemsContainer: this._getItemsContainer(),
                  element: $('<div>'),
                  opener: this,
                  endEditByFocusOut: this._options.editMode.indexOf('toolbar') === -1,
                  modeAutoAdd: this._options.editMode.indexOf('autoadd') !== -1,
                  modeSingleEdit: this._options.editMode.indexOf('single') !== -1,
                  handlers: {
                     onItemValueChanged: function(event, difference, model) {
                        event.setResult(this._notify('onItemValueChanged', difference, model));
                     }.bind(this),
                     onBeginEdit: function(event, model) {
                        event.setResult(this._notify('onBeginEdit', model));
                     }.bind(this),
                     onAfterBeginEdit: function(event, model) {
                        this._showToolbar(model);
                        this.setSelectedKey(model.getId());
                        if (model.getState() === Record.RecordState.DETACHED) {
                           $(".controls-ListView__item", this._getItemsContainer()).removeClass('controls-ListView__item__selected');
                           $('.controls-ListView__item[data-id="' + model.getId() + '"]', this._container).addClass('controls-ListView__item__selected');
                        }
                        else {
                           this.setSelectedKey(model.getId());
                        }
                        this.scrollToItem(model);
                        event.setResult(this._notify('onAfterBeginEdit', model));
                        this._toggleEmptyData(false);
                     }.bind(this),
                     onChangeHeight: function(event, model) {
                        if (this._options.editMode.indexOf('toolbar') !== -1 && this._getItemsToolbar().isToolbarLocking()) {
                           this._showItemsToolbar(this._getElementData(this._getElementByModel(model)));
                        }
                        this._notifyOnSizeChanged(true);
                     }.bind(this),
                     onBeginAdd: function(event, options) {
                        event.setResult(this._notify('onBeginAdd', options));
                     }.bind(this),
                     onEndEdit: function(event, model, withSaving) {
                        event.setResult(this._notify('onEndEdit', model, withSaving));
                     }.bind(this),
                     onAfterEndEdit: function(event, model, target, withSaving) {
                        this.setSelectedKey(model.getId());
                        event.setResult(this._notify('onAfterEndEdit', model, target, withSaving));
                        this._toggleEmptyData(!this.getItems().getCount());
                        this._hideToolbar();
                     }.bind(this),
                     onDestroy: function() {
                        //При разрушении редактирования скрывает toolbar. Иначе это ни кто не сделает. А разрушение могло
                        //произойти например из-за setEnabled(false) у ListView
                        this._hideToolbar();
                        this._toggleEmptyData(!this.getItems().getCount());
                        this._notifyOnSizeChanged(true);
                     }.bind(this)
                  }
               };
            return config;
         },
         _showToolbar: function(model) {
            var itemsInstances, itemsToolbar, editedItem;
            if (this._options.editMode.indexOf('toolbar') !== -1) {
               itemsToolbar = this._getItemsToolbar();

               itemsToolbar.unlockToolbar();
               /* Меняем выделенный элемент на редактируемую/добавляемую запись */
               this._changeHoveredItem(this._getElementByModel(model));
               //Отображаем кнопки редактирования
               itemsToolbar.showEditActions();
               if (!this.getItems().getRecordById(model.getId())) {
                  if (this.getItemsActions()) {
                     itemsInstances = this.getItemsActions().getItemsInstances();
                     if (itemsInstances['delete']) {
                        this._lastDeleteActionState = itemsInstances['delete'].isVisible();
                        itemsInstances['delete'].hide();
                     }
                  }
               }
               // подменяю рекод выделенного элемента на рекорд редактируемого
               // т.к. тулбар в режиме редактикрования по месту должен работать с измененной запись
               editedItem = cFunctions.clone(this.getHoveredItem());
               editedItem.record = model;

               //Отображаем itemsToolbar для редактируемого элемента и фиксируем его
               this._showItemsToolbar(editedItem);
               itemsToolbar.lockToolbar();
            } else {
               this._updateItemsToolbar();
            }
         },
         _hideToolbar: function() {
            if (this._options.editMode.indexOf('toolbar') !== -1) {
               //Скрываем кнопки редактирования
               this._getItemsToolbar().unlockToolbar();
               this._getItemsToolbar().hideEditActions();
               if (this._lastDeleteActionState !== undefined) {
                  this.getItemsActions().getItemsInstances()['delete'].toggle(this._lastDeleteActionState);
                  this._lastDeleteActionState = undefined;
               }
               // Если после редактирования более hoveredItem остался - то нотифицируем об его изменении, в остальных случаях просто скрываем тулбар
               if (this.getHoveredItem().container && !this._touchSupport) {
                  this._notifyOnChangeHoveredItem();
               } else {
                  this._hideItemsToolbar();
               }
            } else {
               this._updateItemsToolbar();
            }
         },

         _getElementByModel: function(item) {
            var id = item.getId();
            // Даже не думать удалять ":not(...)". Это связано с тем, что при редактировании по месту может возникнуть задача перерисовать строку
            // DataGridView. В виду одинакового атрибута "data-id", это единственный способ отличить строку DataGridView от строки EditInPlace.
            return this._getItemsContainer().find('.js-controls-ListView__item[data-id="' + (id === undefined ? '' : id) + '"]:not(".controls-editInPlace")');
         },
         /**
          * Возвращает признак, по которому можно установить: активно или нет редактирование по месту в данный момент.
          * @returns {Boolean} Значение true нужно интерпретировать как "Редактирование по месту активно".
          */
         isEdit: function() {
            return this._hasEditInPlace() && this._getEditInPlace().isEdit();
         },

         _getEditingRecord: function() {
            return this.isEdit() ? this._getEditInPlace()._getEditingRecord() : undefined;
         },

         //********************************//
         //   БЛОК ОПЕРАЦИЙ НАД ЗАПИСЬЮ    //
         //*******************************//
         _isSupportedItemsToolbar: function() {
            return this._options.itemsActions.length || this._options.editMode.indexOf('toolbar') !== -1;
         },

         _updateItemsToolbar: function() {
            var hoveredItem = this.getHoveredItem();

            if(hoveredItem.container && this._isSupportedItemsToolbar()) {
               this._showItemsToolbar(hoveredItem);
            }
         },

         _swipeHandler: function(e){
            var target = this._findItemByElement($(e.target));

            if(!target.length) {
               return;
            }

            if (e.direction == 'left') {
               this._changeHoveredItem(target);
               this._onLeftSwipeHandler();
            } else {
               this._onRightSwipeHandler();
               if(this._hasHoveredItem()) {
                  this._clearHoveredItem();
                  this._notifyOnChangeHoveredItem();
               }
            }
            e.stopPropagation();
         },

         _onLeftSwipeHandler: function() {
            if (this._isSupportedItemsToolbar()) {
               if (this._hasHoveredItem()) {
                  this._showItemsToolbar(this._hoveredItem);
                  this.setSelectedKey(this._hoveredItem.key);
               } else {
                  this._hideItemsToolbar();
               }
            }
         },

         /**
          * Возвращает, есть ли сейчас выделенный элемент в представлении
          * @returns {boolean}
          * @private
          */
         _hasHoveredItem: function () {
            return !!this._hoveredItem.container;
         },

         _onRightSwipeHandler: function() {
            if (this._isSupportedItemsToolbar()) {
               this._hideItemsToolbar(true);
            }
         },

         _tapHandler: function(e){
            var target = this._findItemByElement($(e.target));

            if(target.length) {
               this.setSelectedKey(target.data('id'));
            }
         },

         _findItemByElement: function(target){
            if(!target.length) {
               return [];
            }

            var elem = target.closest('.js-controls-ListView__item', this._getItemsContainer()),
                domElem = elem[0],
                dataId, dataHash;

            if(domElem) {
               dataId = domElem.getAttribute('data-id');
               dataHash = domElem.getAttribute('data-hash');
            } else {
               return elem;
            }

            if(this._getItemsProjection() && this._getItemProjectionByItemId(dataId) && this._getItemProjectionByHash(dataHash)) {
               return elem;
            } else {
               return this._findItemByElement(elem.parent());
            }
         },
         /**
          * Показывает оперцаии над записью для элемента
          * @private
          */
         _showItemsToolbar: function(target) {
            var
                toolbar = this._getItemsToolbar(),
                editingRecord = this._getEditingRecord();
            toolbar.show(target, this._touchSupport);
            //При показе тулбара, возможно он будет показан у редактируемой строки.
            //Цвет редактируемой строки отличается от цвета строки по ховеру.
            //В таком случае переключим классы тулбара в режим редактирования.
            if (this._options.editMode.indexOf('toolbar') === -1) {
               toolbar._toggleEditClass(!!editingRecord && editingRecord.getId() == target.key);
            }
         },

         _unlockItemsToolbar: function() {
            if (this._itemsToolbar) {
               this._itemsToolbar.unlockToolbar();
            }
         },
         _hideItemsToolbar: function (animate) {
            if (this._itemsToolbar) {
               this._itemsToolbar.hide(animate);
            }
         },
         _getItemsToolbar: function() {
            var self = this;

            if (!this._itemsToolbar) {
               this._setTouchSupport(this._touchSupport);
               this._itemsToolbar = new ItemsToolbar({
                  element: this.getContainer().find('> .controls-ListView__ItemsToolbar-container'),
                  parent: this,
                  visible: false,
                  touchMode: this._touchSupport,
                  className: this._notEndEditClassName,
                  itemsActions: cFunctions.clone(this._options.itemsActions),
                  showEditActions: this._options.editMode.indexOf('toolbar') !== -1,
                  handlers: {
                     onShowItemActionsMenu: function() {
                        var hoveredKey = self.getHoveredItem().key;

                        /* По стандарту, при открытии меню операций над записью,
                           строка у которой находятся оперции должна стать активной */
                        if(hoveredKey) {
                           self.setSelectedKey(hoveredKey);
                        }
                     },
                     onItemActionActivated: function(e, key) {
                        self.setSelectedKey(key);
                        if(self._touchSupport) {
                           self._clearHoveredItem();
                        }
                     }

                  }
               });
               //Когда массив action's пустой getItemsAction вернет null
               var actions = this._itemsToolbar.getItemsActions();
               if (actions) {
                  actions.subscribe('onHideMenu', function () {
                     self.setActive(true);
                  });
               }
            }
            return this._itemsToolbar;
         },
         /**
          * Возвращает массив, описывающий установленный набор операций над записью, доступных по наведению курсора.
          * @returns {ItemsActions[]}
          * @example
          * <pre>
          *     DataGridView.subscribe('onChangeHoveredItem', function(hoveredItem) {
          *        var actions = DataGridView.getItemsActions(),
          *        instances = actions.getItemsInstances();
          *
          *        for (var i in instances) {
          *           if (instances.hasOwnProperty(i)) {
          *              //Будем скрывать кнопку удаления для всех строк
          *              instances[i][i === 'delete' ? 'show' : 'hide']();
          *           }
          *        }
          *     });
          * </pre>
          * @see itemsActions
          * @see setItemsActions
          */
         getItemsActions: function () {
            return this._getItemsToolbar().getItemsActions();
         },
         /**
          * Устанавливает набор операций над записью, доступных по наведению курсора.
          * @param {ItemsActions[]} itemsActions
          * @example
          * <pre>
          *     DataGridView.setItemsActions([{
          *        name: 'delete',
          *        icon: 'sprite:icon-16 icon-Erase icon-error',
          *        caption: 'Удалить',
          *        isMainAction: true,
          *        onActivated: function(item) {
          *           this.deleteRecords(item.data('id'));
          *        }
          *     },
          *     {
          *        name: 'addRecord',
          *        icon: 'sprite:icon-16 icon-Add icon-error',
          *        caption: 'Добавить',
          *        isMainAction: true,
          *        onActivated: function(item) {
          *           this.showRecordDialog();
          *        }
          *     }]
          * <pre>
          * @see itemsActions
          * @see getItemsActions
          * @see getHoveredItem
          */
         setItemsActions: function (itemsActions) {
            this._options.itemsActions = itemsActions;
            if(this._itemsToolbar) {
               this._itemsToolbar.setItemsActions(cFunctions.clone(this._options.itemsActions));
               if (this.getHoveredItem().container) {
                  this._notifyOnChangeHoveredItem()
               }
            }
            this._notifyOnPropertyChanged('itemsActions');
         },
         /**
          * todo Проверка на "searchParamName" - костыль. Убрать, когда будет адекватная перерисовка записей (до 150 версии, апрель 2016)
          * @returns {boolean}
          * @private
          */
         _isSearchMode: function() {
            return this._options.hierarchyViewMode;
         },


         //**********************************//
         //КОНЕЦ БЛОКА ОПЕРАЦИЙ НАД ЗАПИСЬЮ //
         //*********************************//
         _drawItemsCallback: function () {
            var hoveredItem,
                hoveredItemContainer,
                hash,
                projItem,
                containsHoveredItem;

            ListView.superclass._drawItemsCallback.apply(this, arguments);

            /* Проверяем, нужно ли ещё подгружать данные в асинхронном _drawItemsCallback'e,
               чтобы минимизировать обращения к DOM'у
               т.к. синхронный может стрелять много раз. */
            if (this.isInfiniteScroll()) {
               this._preScrollLoading();
            }

            this._drawSelectedItems(this._options.selectedKeys, {});

            hoveredItem = this.getHoveredItem();
            hoveredItemContainer = hoveredItem.container;

             /* Если после перерисовки выделенный элемент удалился из DOM дерава,
               то событие mouseLeave не сработает, поэтому вызовем руками метод,
               если же он остался, то обновим положение кнопки опций*/
            if(hoveredItemContainer){
               // FIXME УДАЛИТЬ, вызывается, чтобы проходили тесты, просто создаёт индекс по хэшу в енумераторе
               this._getItemsProjection().getByHash(null);
               containsHoveredItem = dcHelpers.contains(this._getItemsContainer()[0], hoveredItemContainer[0]);

               if(!containsHoveredItem && hoveredItemContainer) {
                  /*TODO сейчас зачем то в ховеред итем хранится ссылка на DOM элемент
                   * но этот элемент может теряться в ходе перерисовок. Выписана задача по которой мы будем
                   * хранить только идентификатор и данный код станет не нужен*/
                  hash = hoveredItemContainer.attr('data-hash');
                  projItem = this._getItemsProjection().getByHash(hash);
                  /* Если в проекции нет элемента и этого элемента нет в DOM'e,
                     но на него осталась jQuery ссылка, то надо её затереть */
                  if (projItem) {
                     hoveredItemContainer = this._getDomElementByItem(projItem);
                  } else {
                     hoveredItemContainer = null;
                  }
               }

               if(!containsHoveredItem) {
                  if(!hoveredItemContainer) {
                     this._mouseLeaveHandler();
                  } else {
                     this._updateHoveredItem(hoveredItemContainer);
                  }
               } else {
                  /* Даже если контейнер выбранной записи не изменился,
                     надо обновить выделнный элемент, т.к. могло измениться его положение */
                  this._updateHoveredItem(hoveredItemContainer);
               }
            }

            //FixMe: Из за этого при каждой подгрузке по скроллу пэйджинг пересчитывается полностью
            if (this._scrollBinder){
               this._scrollBinder._updateScrollPages(true);
            } else if (this._options.infiniteScroll == 'down' && this._options.scrollPaging){
               this._createScrollPager();
            }
            this._notifyOnSizeChanged(true);
         },
         _drawItemsCallbackSync: function() {
            ListView.superclass._drawItemsCallbackSync.call(this);
            /* Подскролл после подгрузки вверх надо производить после отрисовки синхронно,
               иначе скролл будет дёргаться */
            if (this.isInfiniteScroll()) {
               if (this._needScrollCompensation) {
                  this._moveTopScroll();
               }
            }
         },
         // TODO: скроллим вниз при первой загрузке, если пользователь никуда не скролил
         _onResizeHandler: function(){
            var self = this;
            if (this.getItems()){
               //Мог поменяться размер окна или смениться ориентация на планшете - тогда могут влезть еще записи, надо попробовать догрузить
               if (this._scrollWatcher && !this._scrollWatcher.hasScroll()){
                  this._scrollLoadNextPage();
               }
               if (this._scrollPager){
                  //TODO: Это возможно очень долго, надо как то убрать. Нужно для случев, когда ListView создается скрытым, а потом показывается
                  this._scrollBinder && this._scrollBinder._updateScrollPages();
                  this._setScrollPagerPositionThrottled();
               }
            }
         },
         _removeItems: function(items, groupId){
            this._checkDeletedItems(items);
            ListView.superclass._removeItems.call(this, items, groupId);
            if (this._getSourceNavigationType() == 'Offset'){
               this._scrollOffset.bottom -= this._getAdditionalOffset(items);
            }
            if (this.isInfiniteScroll()) {
               this._preScrollLoading();
            }
         },
         
         _addItems: function(newItems, newItemsIndex, groupId){
            ListView.superclass._addItems.apply(this, arguments);
            if (this._getSourceNavigationType() == 'Offset'){
               this._scrollOffset.bottom += this._getAdditionalOffset(newItems);
            }
         },

         // Получить количество записей которые нужно вычесть/прибавить к _offset при удалении/добавлении элементов
         // необходимо для навигации по Offset'ам - переопределяется в TreeMixin для учета записей только в корне 
         _getAdditionalOffset: function(items){
            return items.length;
         },

         _cancelLoading: function(){
            ListView.superclass._cancelLoading.apply(this, arguments);
            if (this.isInfiniteScroll()){
               this._hideLoadingIndicator();
            }
         },

          /*
           * При удалении записи с открытым меню операций, операции над записью необходимо скрывать
           * т.к. запись удалена и над ней нельзя проводить действия
           */
         _checkDeletedItems: function (items) {
            var self = this,
                itemsActions, target, targetHash;

            if(self._itemsToolbar && self._itemsToolbar.isToolbarLocking()){
               itemsActions = self.getItemsActions();
               if(itemsActions) {
                  target = self.getItemsActions().getTarget();
                  targetHash = target.container.data('hash');
                  colHelpers.forEach(items, function (item) {
                     if (item.getHash() == targetHash) {
                        self._itemsToolbar.unlockToolbar();
                        self._itemsToolbar.hide();
                     }
                  });
               }
            }
         },

         //-----------------------------------infiniteScroll------------------------
         /**
          * Используется ли подгрузка по скроллу.
          * @returns {Boolean} Возможные значения:
          * <ol>
          *    <li>true - используется подгрузка по скроллу;</li>
          *    <li>false - не используется.</li>
          * </ol>
          * @example
          * Переключим режим управления скроллом:
          * <pre>
          *     listView.setInfiniteScroll(!listView.isInfiniteScroll());
          * </pre>
          * @see infiniteScroll
          * @see setInfiniteScroll
          */

         _prepareInfiniteScroll: function(){
            var topParent = this.getTopParent(),
                self = this;

            if (this.isInfiniteScroll()) {
               this._createLoadingIndicator();
               this._createScrollWatcher();

               if (this._options.infiniteScroll == 'demand'){
                  this._setInfiniteScrollState('down');
                  return;
               }
               // Пока по умолчанию считаем что везде подгрузка вниз, и если указана 'up' - значит она просто перевернута
               this._setInfiniteScrollState('down', this._options.infiniteScroll == 'up');
               /**TODO Это специфическое решение из-за того, что нам нужно догружать данные пока не появится скролл
                * Если мы находися на панельке, то пока она скрыта все данные уже могут загрузиться, но новая пачка не загрузится
                * потому что контейнер невидимый*/
               if (cInstance.instanceOfModule(topParent, 'SBIS3.CORE.FloatArea')){
                  var afterFloatAreaShow = function(){
                     if (self.getItems()) {
                        if (self._options.infiniteScroll == 'up'){
                           self._moveTopScroll();
                        }
                        self._preScrollLoading();
                     }
                     topParent.unsubscribe('onAfterShow', afterFloatAreaShow);
                  };
                  //Делаем через subscribeTo, а не once, что бы нормально отписываться при destroy FloatArea
                  this.subscribeTo(topParent, 'onAfterShow', afterFloatAreaShow);
               }
               this._scrollWatcher.subscribe('onTotalScroll', this._onTotalScrollHandler.bind(this));
            }
         },

         _setInfiniteScrollState: function(mode, reverse){
            if (mode) {
               this._infiniteScrollState.mode = mode;
            }
            if (reverse){
               this._infiniteScrollState.reverse = reverse;
            }
         },

         /**
          * Если скролл находится в самом верху и добавляются записи вверх - скролл не останнется на месте,
          * а будет все так же вверху. Поэтому после отрисовки записей вверх, подвинем скролл на прежнее место -
          * конец предпоследней страницы
          * @private
          */
         _moveTopScroll: function() {
            var scrollAmount = this._scrollWatcher.getScrollHeight() - this._containerScrollHeight;
            //Если запускаем 1ый раз, то нужно поскроллить в самый низ (ведь там "начало" данных), в остальных догрузках скроллим вниз на
            //разницы величины скролла (т.е. на сколько добавилось высоты, на столько и опустили). Получается плавно
            if (scrollAmount) {
               this._scrollWatcher.scrollTo(scrollAmount);
            }
         },

         _createScrollWatcher: function(){
            var scrollWatcherConfig = {
               totalScrollOffset: START_NEXT_LOAD_OFFSET,
               opener: this,
               element: this.getContainer().closest(this._options.infiniteScrollContainer),
               initOnBottom: this._options.infiniteScroll == 'up'
            };
            this._scrollWatcher = new ScrollWatcher(scrollWatcherConfig);
            this._inScrollContainerControl = this._scrollWatcher.getScrollContainer().hasClass('controls-ScrollContainer__content')
         },

         _onTotalScrollHandler: function(event, type){
            var mode = this._infiniteScrollState.mode,
               scrollOnEdge =  (mode === 'up' && type === 'top') ||   // скролл вверх и доскролили до верхнего края
                               (mode === 'down' && type === 'bottom' && !this._infiniteScrollState.reverse) || // скролл вниз и доскролили до нижнего края
                               (mode === 'down' && type === 'top' && this._infiniteScrollState.reverse) || // скролл верх с запросом данных вниз и доскролили верхнего края
                               (this._options.infiniteScroll === 'both');
            if (scrollOnEdge && this.getItems()) {
               // Досткролили вверх, но на самом деле подгружаем данные как обычно, а рисуем вверх
               if (type == 'top' && this._infiniteScrollState.reverse) {
                  this._setInfiniteScrollState('down');
               } else {
                  this._setInfiniteScrollState(type == 'top' ? 'up' : 'down');
               }
               this._scrollLoadNextPage();
            }
         },

         /**
          * Функция догрузки данных пока не появится скролл
          * @private
          */
         _preScrollLoading: function(){
            var scrollDown = this._infiniteScrollState.mode == 'down' && !this._infiniteScrollState.reverse;
            // Если  скролл вверху (при загрузке вверх) или скролл внизу (при загрузке вниз) или скролла вообще нет - нужно догрузить данные
            // //при подгрузке в обе стороны изначально может быть mode == 'down', но загрузить нужно вверх - так как скролл вверху
            if ((scrollDown && this.isScrollOnBottom()) || !this._scrollWatcher.hasScroll()) {
               this._scrollLoadNextPage();
            } else {
               if (this._options.infiniteScroll == 'both' && this.isScrollOnTop()){
                  this._setInfiniteScrollState('up');
                  this._scrollLoadNextPage();
               }

            }
         },

         isInfiniteScroll: function () {
            var scrollLoad = this._options.infiniteScroll !== null;
            return this._allowInfiniteScroll && scrollLoad;
         },

         _reloadInfiniteScrollParams : function(){
            this._containerScrollHeight = 0;
            this._needScrollCompensation = this._options.infiniteScroll == 'up';
            if (this.isInfiniteScroll()) {
               this._scrollOffset.top = this._offset;
               this._scrollOffset.bottom = this._offset;
            }
         },

         /**
          * Подгрузить еще данные
          * направление задается через _setInfiniteScrollState
          */
         _scrollLoadNextPage: function () {
            var loadAllowed  = this.isInfiniteScroll() && this._options.infiniteScroll !== 'demand',
               more = this.getItems().getMetaData().more,
               isContainerVisible = dcHelpers.isElementVisible(this.getContainer()),
               // отступ с учетом высоты loading-indicator
               hasScroll = this._scrollWatcher.hasScroll(this._loadingIndicator.height()),
               hasNextPage = this._hasNextPage(more, this._scrollOffset.bottom);

            //Если подгружаем элементы до появления скролла показываем loading-indicator рядом со списком, а не поверх него
            this._container.toggleClass('controls-ListView__outside-scroll-loader', !hasScroll);

            //Если в догруженных данных в датасете пришел n = false, то больше не грузим.
            if (loadAllowed && isContainerVisible && hasNextPage && !this.isLoading()) {
               this._loadNextPage();
            }
         },

         _hasNextPage: function(more, offset) {
            if (this._infiniteScrollState.mode == 'up'){
               return this._scrollOffset.top > 0;
            } else {
               // Если загружена последняя страница, то вниз грузить больше не нужно
               // при этом смотреть на .getMetaData().more - бесполезно, так как при загруке страниц вверх more == true
               return !this._lastPageLoaded && ListView.superclass._hasNextPage.call(this, more, offset);
            }
         },

         _loadNextPage: function() {
            var offset = this._getNextOffset();
            this._showLoadingIndicator();
            this._toggleEmptyData(false);
            //показываем индикатор вверху, если подгрузка вверх или вниз но перевернутая
            this._loadingIndicator.toggleClass('controls-ListView-scrollIndicator__up', 
               this._infiniteScrollState.mode == 'up' || (this._infiniteScrollState.mode == 'down' && this._infiniteScrollState.reverse == true));
            this._notify('onBeforeDataLoad', this.getFilter(), this.getSorting(), offset, this._limit);
            this._loader = this._callQuery(this.getFilter(), this.getSorting(), offset, this._limit).addCallback(fHelpers.forAliveOnly(function (dataSet) {
               //ВНИМАНИЕ! Здесь стрелять onDataLoad нельзя! Либо нужно определить событие, которое будет
               //стрелять только в reload, ибо между полной перезагрузкой и догрузкой данных есть разница!
               this._loader = null;
               //нам до отрисовки для пейджинга уже нужно знать, остались еще записи или нет
               var hasNextPage = this._hasNextPage(dataSet.getMetaData().more, this._scrollOffset.bottom);

               this._updateScrolOffset();
               //Нужно прокинуть наружу, иначе непонятно когда перестать подгружать
               this.getItems().setMetaData(dataSet.getMetaData());
               this._hideLoadingIndicator();
               if (!hasNextPage) {
                  this._toggleEmptyData(!this.getItems().getCount());
               }
               this._notify('onDataMerge', dataSet);
               //Если данные пришли, нарисуем
               if (dataSet.getCount()) {
                  //TODO: вскрылась проблема  проекциями, когда нужно рисовать какие-то определенные элементы и записи
                  //Возвращаем самостоятельную отрисовку данных, пришедших в загрузке по скроллу
                  if (this._isSlowDrawing(this._options.easyGroup)) {
                     this._needToRedraw = false;
                  }
                  this._drawPage(dataSet);
                  //И выключаем после отрисовки
                  if (this._isSlowDrawing(this._options.easyGroup)) {
                     this._needToRedraw = true;
                  }
               } else {
                  // Если пришла пустая страница, но есть еще данные - догрузим их
                  if (hasNextPage){
                     this._scrollLoadNextPage();
                  }
               }
            }, this)).addErrback(function (error) {
               this._hideLoadingIndicator();
               //Здесь при .cancel приходит ошибка вида DeferredCanceledError
               return error;
               }.bind(this));
         },

         _getNextOffset: function(){
            if (this._infiniteScrollState.mode == 'down' || this._infiniteScrollState.mode == 'demand'){
               return this._scrollOffset.bottom + this._limit;
            } else {
               return this._scrollOffset.top - this._limit;
            }
         },

         _drawPage: function(dataSet){
            var at = null;
            //добавляем данные в начало или в конец в зависимости от того мы скроллим вверх или вниз
            if (this._infiniteScrollState.mode === 'up' || (this._infiniteScrollState.mode == 'down' && this._infiniteScrollState.reverse)) {
               this._needScrollCompensation = true;
               this._containerScrollHeight = this._scrollWatcher.getScrollHeight() - this._scrollWatcher.getScrollContainer().scrollTop();
               at = {at: 0};
            }
            //Achtung! Добавляем именно dataSet, чтобы не проверялся формат каждой записи - это экономит кучу времени
            if (this._infiniteScrollState.mode == 'down') {
               this.getItems().append(dataSet);
            } else {
               this.getItems().prepend(dataSet);
            }

            if (this._isSlowDrawing(this._options.easyGroup)) {
               this._drawItems(dataSet.toArray(), at);
            }
            
            this._needScrollCompensation = false;
            //TODO Пытались оставить для совместимости со старыми данными, но вызывает onCollectionItemChange!!!
            this._dataLoadedCallback();
            this._toggleEmptyData();
         },

         _updateScrolOffset: function(){
            if (this._infiniteScrollState.mode === 'down' || this._infiniteScrollState.mode == 'demand') {
               if (this._getSourceNavigationType() != 'Offset') {
                  this._scrollOffset.bottom += this._limit;
               }
            } else {
               if (this._scrollOffset.top >= this._limit){
                  this._scrollOffset.top -= this._limit;
               } else {
                  this._scrollOffset.top = 0;
               }
            }
         },

         _setLoadMoreCaption: function(dataSet){
            var more = dataSet.getMetaData().more,
               caption, allCount;
            // Если число и больше pageSize то "Еще pageSize"
            if (typeof more === 'number') {
               allCount = more;
               $('.controls-ListView__counterValue', this._container.get(0)).text(allCount);
               $('.controls-ListView__counter', this._container.get(0)).removeClass('ws-hidden');

               var ost = more - (this._scrollOffset.bottom + this._options.pageSize);
               if (ost <= 0) {
                  this._loadMoreButton.setVisible(false);
                  return;
               }
               caption = ost < this._options.pageSize ? ost : this._options.pageSize;
            } else {
               $('.controls-ListView__counter', this._container.get(0)).addClass('ws-hidden');
               if (more === false) {
                  this._loadMoreButton.setVisible(false);
                  return;
               } else {
                  caption = this._options.pageSize;
               }
            }

            this._loadMoreButton.setCaption('Еще ' + caption);
            this._loadMoreButton.setVisible(true);
         },

         _onLoadMoreButtonActivated: function(event){
            this._loadNextPage('down');
         },

         /**
          * Скролит табличное представление к указанному элементу
          * @param item Элемент, к которому осуществляется скролл
          */
         scrollToItem: function(item){
            if (item.getId && item.getId instanceof Function){
               this._scrollToItem(item.getId());
            }
         },

         /**
          * Возвращает scrollWatcher, при необходимости создаёт его
          * @returns {*|SBIS3.CONTROLS.ListView.$protected._scrollWatcher|ScrollWatcher|SBIS3.CONTROLS.ListView._scrollWatcher}
          * @private
          */
         _getScrollWatcher: function() {
            if (!this._scrollWatcher) {
               this._createScrollWatcher();
            }
            return this._scrollWatcher;
         },

         /**
          * Переопределённый метод itemsControlMixin'a
          * Необходим, т.к. itemsControlMixin не знает, что может быть кастомный скролл
          * @param target
          * @private
          */
         _scrollTo: function(target) {
            if(this.isInfiniteScroll()) {
               this._getScrollWatcher().scrollToElement(target);
            } else {
               ListView.superclass._scrollTo.apply(this, arguments);
            }
         },

         /**
          * Проверяет, нахдится ли скролл внизу
          * @param noOffset
          * @returns {*|*|boolean|Boolean}
          */
         isScrollOnBottom: function(noOffset){
            return this._getScrollWatcher().isScrollOnBottom(noOffset);
         },

         /**
          * Проверяет, нахдится ли скролл вверху
          * @returns {*|*|boolean|Boolean}
          */
         isScrollOnTop: function(){
            return this._getScrollWatcher().isScrollOnTop();
         },

         _showLoadingIndicator: function () {
            if (!this._loadingIndicator) {
               this._createLoadingIndicator();
            }
            this._loadingIndicator.removeClass('ws-hidden');
         },
         /**
          * Удаляет индикатор загрузки
          * @private
          */
         _hideLoadingIndicator: function () {
            if (this._loadingIndicator && !this._loader) {
               this._loadingIndicator.addClass('ws-hidden');
            }
         },
         _createLoadingIndicator : function () {
            this._loadingIndicator = this._container.find('.controls-ListView-scrollIndicator');
            // При подгрузке вверх индикатор должен быть над списком
            if (this._options.infiniteScroll == 'up'){
               this._loadingIndicator.prependTo(this._container);
            }
         },
         /**
          * Метод изменения возможности подгрузки по скроллу.
          * @remark
          * Метод изменяет значение, заданное в опции {@link infiniteScroll}.
          * @param {Boolean} allow Разрешить (true) или запретить (false) подгрузку по скроллу.
          * @param {Boolean} [noLoad] Сразу ли загружать (true - не загружать сразу).
          * @example
          * Переключим режим управления скроллом:
          * <pre>
          *     listView.setInfiniteScroll(!listView.isInfiniteScroll())
          * </pre>
          * @see infiniteScroll
          * @see isInfiniteScroll
          */
         setInfiniteScroll: function (type, noLoad) {
            if (typeof type === 'boolean'){
               this._allowInfiniteScroll = type;
            } else {
               if (type) {
                  this._options.infiniteScroll = type;
                  this._allowInfiniteScroll = true;
               }
            }
            if (type && !noLoad) {
               this._scrollLoadNextPage();
               return;
            }
            //НА саом деле если во время infiniteScroll произошла ошибка загрузки, я о ней не смогу узнать, но при выключении нужно убрать индикатор
            if (!type && this._loadingIndicator && this._loadingIndicator.is(':visible')){
               this._cancelLoading();
            }
            //Убираем текст Еще 10, если включили бесконечную подгрузку
            this.getContainer().find('.controls-TreePager-container').toggleClass('ws-hidden', !!type);
            this._hideLoadingIndicator();
         },
         /**
          * Геттер для получения текущего выделенного элемента
          * @returns {{key: null | number, container: (null | jQuery)}}
          * @example
          * <pre>
          *     editButton.bind('click', functions: (e) {
          *        var hoveredItem = this.getHoveredItem();
          *        if(hoveredItem.container) {
          *           myBigToolTip.showAt(hoveredItem.position);
          *        }
          *     })
          * </pre>
          * @see itemsActions
          * @see getItemsActions
          */
         getHoveredItem: function () {
            return this._hoveredItem;
         },

         /**
          * Устанавливает текущий выделенный элемент
          * @param {Object} hoveredItem
          * @private
          */
         _setHoveredItem: function(hoveredItem) {
            hoveredItem.container && hoveredItem.container.addClass('controls-ListView__hoveredItem');
            this._hoveredItem = hoveredItem;
         },

         /**
          * Очищает текущий выделенный элемент
          * @private
          */
         _clearHoveredItem: function() {
            var hoveredItem = this.getHoveredItem(),
                emptyObject = {};

            hoveredItem.container && hoveredItem.container.removeClass('controls-ListView__hoveredItem');
            for(var key in hoveredItem) {
               if(hoveredItem.hasOwnProperty(key)) {
                  emptyObject[key] = null;
               }
            }
            return (this._hoveredItem = emptyObject);

         },

         _dataLoadedCallback: function () {
            if (this._options.showPaging) {
               this._processPaging();
               this._updateOffset();
            }
            if (this.isInfiniteScroll()) {
               //Если нет следующей страницы - скроем индикатор загрузки
               if (!this._hasNextPage(this.getItems().getMetaData().more, this._scrollOffset.bottom)) {
                  this._hideLoadingIndicator();
               }
               if (this._options.infiniteScroll == 'demand'){
                  this._setLoadMoreCaption(this.getItems());
               }
            }
            this._onMetaDataResultsChange = this._redrawResults.bind(this);
            this._observeResultsRecord(true);
            ListView.superclass._dataLoadedCallback.apply(this, arguments);
            this._needScrollCompensation = false;
         },
         _toggleIndicator: function(show){
            var self = this,
                container = this.getContainer(),
                ajaxLoader = container.find('.controls-AjaxLoader').eq(0),
                indicator, centerCord, scrollContainer;


            this._showedLoading = show;
            if (show) {
               setTimeout(function(){
                  if (!self.isDestroyed() && self._showedLoading) {
                     scrollContainer = self._getScrollContainer()[0];
                     indicator = ajaxLoader.find('.controls-AjaxLoader__outer');
                     if(indicator.length && scrollContainer && scrollContainer.offsetHeight && container[0].scrollHeight > scrollContainer.offsetHeight) {
                        /* Ищем кординату, которая находится по середине отображаемой области грида */
                        centerCord =
                           (Math.max(scrollContainer.getBoundingClientRect().bottom, 0) - Math.max(container[0].getBoundingClientRect().top, 0))/2;
                        /* Располагаем индикатор, учитывая прокрутку */
                        indicator[0].style.top = centerCord + scrollContainer.scrollTop + 'px';
                     } else {
                        /* Если скрола нет, то сбросим кординату, чтобы индикатор сам расположился по середине */
                        indicator[0].style.top = '';
                     }
                     ajaxLoader.removeClass('ws-hidden');
                  }
               }, INDICATOR_DELAY);
            }
            else {
               ajaxLoader.addClass('ws-hidden');
            }
         },
         _toggleEmptyData: function(show) {
            show = show && this._options.emptyHTML;
            this._getEmptyDataContainer().toggleClass('ws-hidden', !show);
            if(this._pagerContainer) {
               this._pagerContainer.toggleClass('ws-hidden', show);
            }
         },
         //------------------------Paging---------------------
         _processPaging: function() {
            this._processPagingStandart();
         },
         _processPagingStandart: function () {
            if (!this._pager) {
               var more = this.getItems().getMetaData().more,
                  hasNextPage = this._hasNextPage(more),
                  pagingOptions = {
                     recordsPerPage: this._options.pageSize || more,
                     currentPage: 1,
                     recordsCount: more,
                     pagesLeftRight: 1,
                     onlyLeftSide: typeof more === 'boolean', // (this._options.display.usePaging === 'parts')
                     rightArrow: hasNextPage
                  },
                  pagerContainer = this.getContainer().find('.controls-Pager-container').append('<div/>'),
                  self = this;

               this._pager = new Pager({
                  pageSize: this._options.pageSize,
                  opener: this,
                  element: pagerContainer.find('div'),
                  allowChangeEnable: false, //Запрещаем менять состояние, т.к. он нужен активный всегда
                  pagingOptions: pagingOptions,
                  handlers: {
                     'onPageChange': function (event, pageNum, deferred) {
                        var more = self.getItems().getMetaData().more,
                            hasNextPage = self._hasNextPage(more, self._scrollOffset.bottom),
                            maxPage = self._pager.getPaging()._maxPage;
                        //Старый Paging при включенной частичной навигации по нажатию кнопки "Перейти к последней странице" возвращает pageNum = 0 (у него индексы страниц начинаются с 1)
                        //В новом Pager'e индексация страниц начинается с 0 и такое поведение здесь не подходит
                        //Так же в режиме частичной навигации нет возможности высчитать номер последней страницы, поэтому
                        //при переходе к последней странице делаем так, чтобы мы переключились на последнюю доступную страницу.
                        if (pageNum == 0 && self._pager._options.pagingOptions.onlyLeftSide){
                           pageNum = hasNextPage ? (maxPage + 1) : maxPage;
                        }

                        self._setPageSave(pageNum);
                        self.setPage(pageNum - 1);
                        self._pageChangeDeferred = deferred;
                     }
                  }
               });
               self._pagerContainer = self.getContainer().find('.controls-Pager-container');
            }
            this._updatePaging();
         },
         _getQueryForCall: function(filter, sorting, offset, limit){
            var query = new Query();
            query.where(filter)
               .offset(offset)
               .limit(limit)
               .orderBy(sorting)
               .meta({ hasMore: this._options.partialPaging});
            return query;
         },
         /**
          * Метод обработки интеграции с пейджингом
          */
         _updatePaging: function () {
            var more = this.getItems().getMetaData().more,
               nextPage = this._hasNextPage(more, this._scrollOffset.bottom),
               numSelected = 0;
            if (this._pager) {
               //TODO Сейчас берется не всегда актуальный pageNum, бывают случаи, что значение(при переключении по стрелкам)
               //равно значению до переключения страницы. пофиксить чтобы всегда было 1 поведение
               var pageNum = this._pager.getPaging().getPage();
               if (this._pageChangeDeferred) { // только когда меняли страницу
                  this._pageChangeDeferred.callback([this.getPage() + 1, nextPage, nextPage]);//смотреть в DataSet мб ?
                  this._pageChangeDeferred = undefined;
               }
               //Если на странице больше нет записей - то устанавливаем предыдущую (если это возможно)
               if (this.getItems().getCount() === 0 && pageNum > 1) {
                  this._pager.getPaging().setPage(1); //чтобы не перезагружать поставим 1ую. было : pageNum - 1
               }
               this._pager.getPaging().update(this.getPage(this.isInfiniteScroll() ? this._scrollOffset.bottom : this._offset) + 1, more, nextPage);
               this._pager.getContainer().toggleClass('ws-hidden', !this.getItems().getCount());
               if (this._options.multiselect) {
                  numSelected = this.getSelectedKeys().length;
               }
               this._pager.updateAmount(this.getItems().getCount(), nextPage, numSelected);
            }
         },
         /**
          * Установить страницу по её номеру.
          * @remark
          * Метод установки номера страницы, с которой нужно открыть представление данных.
          * Работает при использовании постраничной навигации.
          * @param pageNumber Номер страницы.
          * @example
          * <pre>
          *    if(DataGridView.getPage() > 0)
          *       DataGridView.setPage(0);
          * </pre>
          * @see getPage
          */
         setPage: function (pageNumber, noLoad) {
            pageNumber = parseInt(pageNumber, 10);
            var offset = this._offset;
            if(pageNumber == -1){
               this._setLastPage(noLoad);
            } else {
               if (this.isInfiniteScroll() && this._isPageLoaded(pageNumber)){
                  if (this._getItemsProjection() && this._getItemsProjection().getCount()){
                     var itemIndex = pageNumber * this._options.pageSize - this._scrollOffset.top,
                        itemId = this._getItemsProjection().getItemBySourceIndex(itemIndex).getContents().getId(),
                        item = this.getItems().getRecordById(itemId);
                     if (item) {
                        this.scrollToItem(item);
                     }
                  }
               } else {
                  this._offset = this._options.pageSize * pageNumber;
                  this._scrollOffset.top = this._offset;
                  this._scrollOffset.bottom = this._offset;
                  if (!noLoad && this._offset !== offset) {
                     /* При смене страницы (не через подгрузку по скролу),
                        надо сбросить выделенную запись, иначе на следующей странице неправильно выделится запись */
                     this.setSelectedIndex(-1);
                     this.reload();
                  }
               }
               this._lastPageLoaded = false;
            }
            this._notify('onPageChange', pageNumber);
         },

         _setLastPage: function(noLoad){
            var more = this.getItems() ? this.getItems().getMetaData().more : false,
               pageNumber;
            this._setInfiniteScrollState('up');

            var onLastPageSet = function(items){
               more = items.getMetaData().more;
               if (typeof more == 'number'){
                  pageNumber = Math.floor(more / this._options.pageSize);
                  this._scrollOffset.bottom = more;
                  // TODO: зачем это?
                  this.getFilter()['СлужебныйКоличествоЗаписей'] = items.getCount();
                  this._scrollOffset.top = more - items.getCount();
                  this.setPage(pageNumber, true);
                  this._scrollWatcher.scrollTo('bottom');
               }
               this._lastPageLoaded = true;
            }.bind(this);
            if (noLoad){
               this._offset = -1;
               this.once('onDataLoad', function(event, items){
                  onLastPageSet(items);
               });
            } else {
               this.reload(undefined, undefined, -1).addCallback(onLastPageSet);
            }
         },

         _isPageLoaded: function(pageNumber) {
            var offset = pageNumber * this._options.pageSize;
            return (offset <= this._scrollOffset.bottom && offset >= this._scrollOffset.top);
         },

         /**
          * Получить номер текущей страницы.
          * @remark
          * Метод получения номера текущей страницы представления данных.
          * Работает при использовании постраничной навигации.
          * @example
          * <pre>
          *    if(DataGridView.getPage() > 0)
          *       DataGridView.setPage(0);
          * </pre>
          * @see setPage
          * @param {Number} [offset] - если передать, то номер страницы рассчитается от него
          */
         getPage: function (offset) {
            if (this.getItems()) {
               var offset = offset || this._offset,
                  more = this.getItems().getMetaData().more;
               //Если offset отрицательный, значит запросили последнюю страницу.
               return Math.ceil((offset < 0 ? more + offset : offset) / this._options.pageSize);
            }
         },
         _updateOffset: function () {
            var more = this.getItems().getMetaData().more;
            if (this.getPage() === -1) {
               this._offset = more - this._options.pageSize;
            }
         },
         //------------------------GroupBy---------------------
         _getGroupTpl: function () {
            return this._options.groupBy.template || groupByTpl;
         },
         _groupByDefaultRender: function (item, container) {
            return container;
         },
         setDataSource: function () {
            if (this._pager) {
               this._pager.destroy();
               this._pager = undefined;
               this._pagerContainer = undefined;
            }
            this._destroyEditInPlace();
            ListView.superclass.setDataSource.apply(this, arguments);
         },
         /**
          * Выбирает элемент коллекции по переданному идентификатору.
          * @remark
          * На выбранный элемент устанавливается маркер (оранжевая вертикальная черта) и изменяется фон.
          * При выполнении команды происходит события {@link onItemActivate} и {@link onSelectedItemChange}.
          * @param {Number} id Идентификатор элемента коллекции, который нужно выбрать.
          * @example
          * <pre>
          *    myListView.sendCommand('activateItem', myId);
          * </pre>
          * @private
          * @command activateItem
          * @see sendCommand
          * @see beginAdd
          * @see cancelEdit
          * @see commitEdit
          */
         _activateItem : function(id) {
            var item = this.getItems().getRecordById(id);
            this._notify('onItemActivate', {id: id, item: item});
         },
         /**
          * @typedef {Object} BeginEditOptions
          * @property {String} [parentId] Идентификатор узла иерархического списка, в котором будет происходить добавление.
          * @property {String} [addPosition = bottom] Расположение строки с добавлением по месту.
          * Опция может принимать значение 'top' или 'bottom'.
          * @property {WS.Data/Entity/Model|Object} [preparedModel] Модель элемента коллекции, значения полей которой будут использованы при создании нового элемента.
          * В упрощенном варианте можно передать объект, свойствами которого будут поля создаваемого элемента коллекции. Например, установим создание нового элемента с предопределенным значением поля 'Наименование':
          * <pre>
          * {
          *    'Наименование': 'Компания "Тензор"'
          * }
          * </pre>
          */
         /**
          * Добавляет новый элемента коллекции.
          * @remark
          * Команда применяется для создания нового элемента коллекции без использования диалога редактирования.
          * Схожим функционалом обладает автоматическое добавление по месту представлений данных (см. опцию {@link editMode}).
          * <br/>
          * Полный пример использования команды для создания новых элементов коллекции в иерархическом списке вы можете найти {@link http://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/edit-in-place/users/add-in-place-hierarchy/ здесь}.
          * <br/>
          * Команда поддерживает инициацию добавления по месту для заранее подготовленной записи (см. примеры).
          * @param {BeginEditOptions} [options] Параметры вызова команды.
          * @param {Boolean} [withoutActivateEditor] Запуск редактирования осуществляется без активации самого редактора
          * @example
          * <u>Пример 1.</u> Частный случай вызова команды для создания нового узла иерархии внутри другого узла:
          * <pre>
          * this.sendCommand('beginAdd', {parentId: 'parentBranchId'});
          * </pre>
          * <u>Пример 2.</u> Добавления по месту для заранее подготовленной записи. Таким образом добавление по месту запускается синхронно и без единого запроса к бизнес-логике.
          * <i>Вариант 1.</i>
          * <pre>
          * ListView.getDataSource().create().addCallback(function(preparedModel){...};
          * </pre>
          * <i>Вариант 2.</i>
          * <pre>
          * ListView.beginAdd({ preparedModel: preparedModel });
          * </pre>
          * @returns {*|Deferred} В случае ошибки, вернёт Deferred с текстом ошибки.
          * @private
          * @command beginAdd
          * @see sendCommand
          * @see activateItem
          * @see beginEdit
          * @see cancelEdit
          * @see commitEdit
          */
         _beginAdd: function(options, withoutActivateEditor) {
            if (!options) {
               options = {};
            }
            options.target = this._getItemProjectionByItemId(options.parentId);
            return this.showEip(null, options, withoutActivateEditor);
         },
         /**
          * Запускает редактирование по месту.
          * @remark
          * Используется для активации редактирования по месту без клика пользователя по элементу коллекции.
          * При выполнении команды происходят события {@link onBeginEdit} и {@link onAfterBeginEdit}.
          * @param {WS.Data/Entity/Model} record Элемент коллекции, для которого требуется активировать редактирование по месту.
          * @param {Boolean} [withoutActivateEditor] Запуск редактирования осуществляется без активации самого редактора
          * @example
          * <pre>
          *    myListView.sendCommand('beginEdit', record);
          * </pre>
          * @private
          * @command beginEdit
          * @see sendCommand
          * @see cancelEdit
          * @see commitEdit
          * @see beginAdd
          * @see activateItem
          */
         _beginEdit: function(record, withoutActivateEditor) {
            return this.showEip(record, { isEdit: true }, withoutActivateEditor);
         },
         /**
          * Завершает редактирование по месту без сохранения изменений.
          * @remark
          * При выполнении команды происходят события {@link onEndEdit} и {@link onAfterEndEdit}.
          * @example
          * <pre>
          *    myListView.sendCommand('cancelEdit');
          * </pre>
          * @private
          * @command cancelEdit
          * @see sendCommand
          * @see beginEdit
          * @see commitEdit
          * @see beginAdd
          * @see activateItem
          */
         _cancelEdit: function() {
            return this._getEditInPlace().endEdit();
         },
         /**
          * Завершает редактирование по месту с сохранением изменений.
          * @remark
          * При выполнении команды происходят события {@link onEndEdit} и {@link onAfterEndEdit}.
          * @example
          * <pre>
          *    myListView.sendCommand('commitEdit');
          * </pre>
          * @private
          * @command commitEdit
          * @see sendCommand
          * @see beginEdit
          * @see cancelEdit
          * @see beginAdd
          * @see activateItem
          */
         _commitEdit: function() {
            return this._getEditInPlace().endEdit(true);
         },
         destroy: function () {
            this._destroyEditInPlace();
            if (this._scrollWatcher) {
               if (this._options.scrollPaging){
                  this._scrollWatcher.unsubscribe('onScroll', this._onScrollHandler);
               }
               this._scrollWatcher.unsubscribe('onTotalScroll', this._onTotalScrollHandler);
               this._scrollWatcher.destroy();
               this._scrollWatcher = undefined;
            }
            if (this._pager) {
               this._pager.destroy();
               this._pager = undefined;
               this._pagerContainer = undefined;
            }
            if (this._scrollBinder){
               this._scrollBinder.destroy();
               this._scrollBinder = null;
            }
            if (this._scrollPager){
               if (!this._inScrollContainerControl) {
                  $(window).off('resize scroll', this._setScrollPagerPositionThrottled);
               }
               dcHelpers.trackElement(this.getContainer(), false).unsubscribe('onVisible', this._onVisibleChange);
               this._scrollPager.destroy();
            }
            ListView.superclass.destroy.call(this);
         },
         /**
          * двигает элемент
          * Метод будет удален после того как перерисовка научится сохранять раскрытые узлы в дереве
          * @param {String} item  - идентифкатор первого элемента
          * @param {String} anchor - идентифкатор второго элемента
          * @param {Boolean} before - если true то вставит перед anchor иначе после него
          * @private
          */
         _moveItemTo: function(item, anchor, before){
            //TODO метод сделан специально для перемещения элементов, этот костыль надо удалить и переписать через _redraw
            var itemsContainer = this._getItemsContainer(),
               itemContainer = itemsContainer.find('tr[data-id="'+item+'"]'),
               anchor = itemsContainer.find('tr[data-id="'+anchor+'"]'),
               rows;

            if(before){
               rows = [anchor.prev(), itemContainer, anchor, itemContainer.next()];
               itemContainer.insertBefore(anchor);
            } else {
               rows = [itemContainer.prev(), anchor, itemContainer, anchor.next()];
               itemContainer.insertAfter(anchor);
            }
         },
         /*DRAG_AND_DROP START*/
         /**
          * Установить возможность перемещения элементов с помощью DragNDrop.
          * @param allowDragNDrop возможность перемещения элементов.
          * @see itemsDragNDrop
          * @see getItemsDragNDrop
          */
         setItemsDragNDrop: function(allowDragNDrop) {
            this._options.itemsDragNDrop = allowDragNDrop;
            this._getItemsContainer()[allowDragNDrop ? 'on' : 'off']('mousedown', '.js-controls-ListView__item',  this._getDragInitHandler());
         },

         /**
          * возвращает метод который инициализирует dragndrop
          * @returns {function}
          * @private
          */
         _getDragInitHandler: function(){
            return this._dragInitHandler ? this._dragInitHandler : this._dragInitHandler  = (function(e){
               if (this._canDragStart(e)) {
                  this._initDrag.call(this, e);
                  //TODO: Сейчас появилась проблема, что если к компьютеру подключен touch-телевизор он не вызывает
                  //preventDefault и при таскании элементов мышкой происходит выделение текста.
                  //Раньше тут была проверка !constants.compatibility.touch и preventDefault не вызывался для touch устройств
                  //данная проверка была добавлена, потому что когда в строке были отрендерены кнопки, при нажатии на них
                  //и выполнении preventDefault впоследствии не вызывался click. Написал демку https://jsfiddle.net/9uwphct4/
                  //с воспроизведением сценария, на iPad и Android click отрабатывает. Возможно причина была ещё в какой-то
                  //ошибке. При возникновении ошибок на мобильных устройствах нужно будет добавить проверку !constants.browser.isMobilePlatform.
                  e.preventDefault();
               }
            }).bind(this)
         },
         /**
          * Получить текущую конфигурацию перемещения элементов с помощью DragNDrop.
          * @see itemsDragNDrop
          * @see setItemsDragNDrop
          */
         getItemsDragNDrop: function() {
            return this._options.itemsDragNDrop;
         },
         _findDragDropContainer: function() {
            return this._getItemsContainer();
         },
         _getDragItems: function(dragItem, selectedItems) {
            if (selectedItems) {
               var array = [];
               if (selectedItems.getIndex(dragItem) < 0) {
                  array.push(dragItem);
               }
               selectedItems.each(function(item) {
                  array.push(item);
               });
               return array;
            }
            return [dragItem];
         },
         _canDragStart: function(e) {
            //TODO: При попытке выделить текст в поле ввода, вместо выделения начинается перемещения элемента.
            //Как временное решение добавлена проверка на SBIS3.CONTROLS.TextBoxBase.
            //Необходимо разобраться можно ли на уровне TextBoxBase или Control для события mousedown
            //сделать stopPropagation, тогда от данной проверки можно будет избавиться.
            return this._options.enabled && !cInstance.instanceOfModule($(e.target).wsControl(), 'SBIS3.CONTROLS.TextBoxBase');
         },
         _beginDragHandler: function(dragObject, e) {
            var
                target;
            target = this._findItemByElement(dragObject.getTargetsDomElemet());
            //TODO: данный метод выполняется по селектору '.js-controls-ListView__item', но не всегда если запись есть в вёрстке
            //она есть в _items(например при добавлении или фейковый корень). Метод _findItemByElement в данном случае вернёт
            //пустой массив. В .150 править этот метод опасно, потому что он много где используется. В .200 переписать метод
            //_findItemByElement, без завязки на _items.
            if (target.length) {
               if (target.hasClass('controls-DragNDropMixin__notDraggable')) {
                  return false;
               }
               var  selectedItems = this.getSelectedItems(),
                  targetsItem = this._getItemProjectionByHash(target.data('hash')).getContents(),
                  items = this._getDragItems(targetsItem, selectedItems),
                  source = [];
               colHelpers.forEach(items, function (item) {
                  var projItem = this._getItemsProjection().getItemBySourceItem(item);
                  source.push(this._makeDragEntity({
                     owner: this,
                     model: item,
                     domElement: this._getHtmlItemByProjectionItem(projItem)
                  }));
               }.bind(this));

               dragObject.setSource(
                  this._makeDragEntityList({
                     items: source
                  })
               );
               this._hideItemsToolbar();
               return true;
            }
            return false;
         },

         _onDragHandler: function(dragObject, e) {
            this._clearDragHighlight(dragObject);
            if (this._canDragMove(dragObject)) {
               var
                  target = dragObject.getTarget(),
                  targetsModel = target.getModel(),
                  source = dragObject.getSource(),
                  sourceModels = [];
               if (targetsModel) {
                  source.each(function (item) {
                     sourceModels.push(item.getModel());
                  });
                  if (dragObject.getOwner() !== this || sourceModels.indexOf(targetsModel) < 0) {
                     this._drawDragHighlight(target);
                  }
               }
            }
         },

         _canDragMove: function(dragObject) {
            var source = dragObject.getSource();
            return dragObject.getTarget() &&
               source &&
               source.getCount() > 0 &&
               dragObject.getTargetsControl() === this &&
               cInstance.instanceOfModule(source.at(0), 'SBIS3.CONTROLS.DragEntity.Row');
         },

         _getDragTarget: function(dragObject) {
            var target = this._findItemByElement(dragObject.getTargetsDomElemet()),
               item;

            if (target.length > 0) {
               item = this._getItemsProjection().getByHash(target.data('hash'));
            }

            return item ? item.getContents() : undefined;
         },

         _updateDragTarget: function(dragObject, e) {
            var model = this._getDragTarget(dragObject),
               target;
            if (model) {
               var domElement = this._findItemByElement($(dragObject.getTargetsDomElemet())),
                  position = this._getDirectionOrderChange(e, domElement) || DRAG_META_INSERT.on;
               if (position !== DRAG_META_INSERT.on && dragObject.getOwner() === this) {
                  var neighborItem = this[position === DRAG_META_INSERT.after ? 'getNextItemById' : 'getPrevItemById'](model.getId()),
                     sourceIds = [];
                  dragObject.getSource().each(function (item) {
                     sourceIds.push(item.getModel().getId());
                  });
                  if (neighborItem && sourceIds.indexOf(neighborItem.data('id')) > -1) {
                     position = DRAG_META_INSERT.on;
                  }
               }
               target = this._makeDragEntity({
                  owner: this,
                  domElement: domElement,
                  model: model,
                  position: position
               });
            }
            dragObject.setTarget(target);
         },

         _clearDragHighlight: function(dragObject) {
            this.getContainer()
               .find('.controls-DragNDrop__insertBefore, .controls-DragNDrop__insertAfter')
               .removeClass('controls-DragNDrop__insertBefore controls-DragNDrop__insertAfter');
         },
         _drawDragHighlight: function(target) {
            var domelement = target.getDomElement();
            domelement.toggleClass('controls-DragNDrop__insertAfter', target.getPosition() === DRAG_META_INSERT.after);
            domelement.toggleClass('controls-DragNDrop__insertBefore', target.getPosition() === DRAG_META_INSERT.before);
         },
         _getDirectionOrderChange: function(e, target) {
            return this._getOrderPosition(e.pageY - (target.offset() ? target.offset().top : 0), target.height());
         },
         _getOrderPosition: function(offset, metric) {
            return offset < 10 ? DRAG_META_INSERT.before : offset > metric - 10 ? DRAG_META_INSERT.after : DRAG_META_INSERT.on;
         },

         _createAvatar: function(dragObject) {
            var count = dragObject.getSource().getCount();
            return $('<div class="controls-DragNDrop__draggedItem"><span class="controls-DragNDrop__draggedCount">' + count + '</span></div>');
         },

         _endDragHandler: function(dragObject, droppable, e) {
            if (droppable) {
               var
                  target = dragObject.getTarget(),
                  models = [],
                  dropBySelf = false,
                  source = dragObject.getSource();

               if (target && source) {
                  var  targetsModel = target.getModel();
                  source.each(function(item) {
                     var model = item.getModel();
                     models.push(model);
                     if (targetsModel == model) {
                        dropBySelf = true;
                     }
                  });
                  if (dropBySelf) {//TODO придрот для того, чтобы если перетащить элемент сам на себя не отработал его обработчик клика
                     var clickHandler = this._elemClickHandler;
                     this._elemClickHandler = function () {
                        this._elemClickHandler = clickHandler;
                     };
                  }
                  if (dragObject.getOwner() === this) {
                     var position = target.getPosition();
                     this._getMover().move(models, target.getModel(), position);
                  } else {
                     var currentDataSource = this.getDataSource(),
                        dragOwner = dragObject.getOwner(),
                        ownersDataSource = dragOwner.getDataSource(),
                        useDefaultMove = false;
                     if (currentDataSource && dragOwner &&
                        currentDataSource.getEndpoint().contract == ownersDataSource.getEndpoint().contract
                     ) { //включаем перенос по умолчанию только если  контракты у источников данных равны
                        useDefaultMove = true;
                     }
                     this._getMover().moveFromOutside(dragObject.getSource(), dragObject.getTarget(), dragOwner.getItems(), useDefaultMove);
                  }
               }
            }

            this._clearDragHighlight(dragObject);
            this._updateItemsToolbar();
         },
         /*DRAG_AND_DROP END*/
         //region moveMethods
         /**
          * Перемещает записи через диалог. По умолчанию берет все выделенные записи.
          * @param {Array} idArray Массив перемещаемых записей
          * @deprecated Используйте SBIS3.CONTROLS.Action.List.InteractiveMove.
          */
         moveRecordsWithDialog: function(idArray) {
            require(['js!SBIS3.CONTROLS.Action.List.InteractiveMove','js!WS.Data/Utils'], function(InteractiveMove, Utils) {
               Utils.logger.stack(this._moduleName + 'Method "moveRecordsWithDialog" is deprecated and will be removed in 3.7.5. Use "SBIS3.CONTROLS.Action.List.InteractiveMove"', 1);
               var
                  action = new InteractiveMove({
                     linkedObject: this,
                     parentProperty: this._options.parentProperty,
                     nodeProperty: this._options.nodeProperty,
                     moveStrategy: this.getMoveStrategy()
                  }),
                  items = this.getItems(),
                  movedItems;
               if (idArray) {
                  movedItems = [];
                  colHelpers.forEach(idArray, function (item, i) {
                     if (!cInstance.instanceOfModule(item, 'WS.Data/Entity/Record')) {
                        movedItems.push(items.getRecordById(item));
                     } else {
                        movedItems.push(item);
                     }
                  }, this);
               }
               var  filter = this._notify('onPrepareFilterOnMove', {});
               action.execute({
                  movedItems: movedItems,
                  componentOptions: {
                     filter: filter
                  }
               });
            }.bind(this));
         },

         /**
          * Перемещает выделенные записи.
          * @deprecated используйте метод move
          * @param {WS.Data/Entity/Model|String} target  К какой записи переместить выделенные. Модель либо ее идентификатор.
          */
         selectedMoveTo: function(target) {
            var selectedItems = this.getSelectedItems(false);
            if (cInstance.instanceOfMixin(selectedItems, 'WS.Data/Collection/IList')){
               selectedItems = selectedItems.toArray();
            }

            this._getMover().move(selectedItems, target).addCallback(function(res){
               if (res !== false) {
                  this.removeItemsSelectionAll();
               }
            }.bind(this));
         },
         /**
          * Переместить на одну запись ввниз.
          * @param {WS.Data/Entity/Record} record Запись которую надо переместить
          */
         moveRecordDown: function(record) {
            this._getMover().moveRecordDown(arguments[2]||record);//поддерживаем старую сигнатуру
         },
         /**
          * Переместить на одну запись вверх.
          * @param {WS.Data/Entity/Record} record Запись которую надо переместить
          */
         moveRecordUp: function(record) {
            this._getMover().moveRecordUp(arguments[2]||record);
         },
         /**
          * Возвращает стратегию перемещения
          * @see WS.Data/MoveStrategy/IMoveStrategy
          * @returns {WS.Data/MoveStrategy/IMoveStrategy}
          */
         getMoveStrategy: function() {
            return this._moveStrategy || (this._moveStrategy = this._makeMoveStrategy());
         },
         /**
          * Создает стратегию перемещения в зависимости от источника данных
          * @returns {WS.Data/MoveStrategy/IMoveStrategy}
          * @private
          */
         _makeMoveStrategy: function () {
            return Di.resolve(this._options.moveStrategy, {
               dataSource: this.getDataSource(),
               hierField: this._options.parentProperty,
               parentProperty: this._options.parentProperty,
               nodeProperty: this._options.nodeProperty,
               listView: this
            });
         },
         /**
          * Устанавливает стратегию перемещения
          * @see WS.Data/MoveStrategy/IMoveStrategy
          * @param {WS.Data/MoveStrategy/IMoveStrategy} strategy - стратегия перемещения
          */
         setMoveStrategy: function (moveStrategy) {
            if(!cInstance.instanceOfMixin(moveStrategy,'WS.Data/MoveStrategy/IMoveStrategy')){
               throw new Error('The strategy must implemented interfaces the WS.Data/MoveStrategy/IMoveStrategy.')
            }
            this._moveStrategy = moveStrategy;
         },

         /**
          * Возвращает перемещатор
          * @private
          */
         _getMover: function() {
            return this._mover || (this._mover = Di.resolve('listview.mover', {
               moveStrategy: this.getMoveStrategy(),
               items: this.getItems(),
               projection: this._getItemsProjection(),
               parentProperty: this._options.parentProperty,
               nodeProperty: this._options.nodeProperty
            }));
         },
         /**
          * Перемещает переданные записи
          * @param {Array} movedItems  Массив перемещаемых записей.
          * @param {WS.Data/Entity/Model} target Запись к которой надо преместить..
          * @param {MovePosition} position Как перемещать записи
          * @return {Core/Deferred}
          * @example
          * <pre>
          *    new ListView({
          *       itemsActions: {
      	 *	         name: 'moveSelected'
      	 *	         tooltip: 'Переместить выделленые записи внутрь папки'
      	 *	         onActivated: function(tr, id, record) {
      	 *             this.move(this.getSelectedItems().toArray(), record, 'on')
      	 *	         }
      	 *	      }
          *    })
          * </pre>
          */
         move: function(movedItems, target, position) {
            return this._getMover().move(movedItems, target, position);
         },
         //endregion moveMethods
         /**
          * Устанавливает позицию строки итогов.
          * @param {String} position Позиция.
          * <ul>
          *    <li>none - строка итогов не будет отображаться;</li>
          *    <li>top - строка итогов будет расположена вверху;</li>
          *    <li>bottom - строка итогов будет расположена внизу.</li>
          * </ul>
          * @remark
          * После установки требуется произвести перерисовку связанного списка.
          * @example
          * <pre>
          *     DataGridView.setResultsPosition('none');
          *     DataGridView.reload();
          * </pre>
          * @see resultsPosition
          */
         setResultsPosition: function(position){
           this._options.resultsPosition = position;
         },

         _observeResultsRecord: function(needObserve){
            var methodName = needObserve ? 'subscribeTo' : 'unsubscribeFrom',
                resultsRecord = this.getItems() && this.getItems().getMetaData().results;
            if (resultsRecord){
               this[methodName](resultsRecord, 'onPropertyChange', this._onMetaDataResultsChange);
            }
         },

         _redrawResults: function(){
            var resultsRow = $('.controls-ListView__results', this.getContainer()),
                insertMethod = this._options.resultsPosition == 'top' ? 'before' : 'after',
                resultsRecord = this.getItems() && this.getItems().getMetaData().results,
                markup;
            if (resultsRow.length){
               this._destroyControls(resultsRow);
               resultsRow.remove();
            }
            if (resultsRecord && this._options.resultsTpl && this._options.resultsPosition !== 'none'){
               markup = MarkupTransformer(TemplateUtil.prepareTemplate(this._options.resultsTpl)({item: resultsRecord, multiselect: this._options.multiselect}));
               this._getItemsContainer()[insertMethod](markup);
            }

         },
         /**
          * //todo коcтыль нужно разобраться почему долго работает
          * Инициализирует опцию selectedItems
          * @noShow
          */
         initializeSelectedItems: function() {
            var items = this.getItems();

            if (cInstance.instanceOfModule(items, 'js!WS.Data/Collection/RecordSet')) {
               this._options.selectedItems = Di.resolve('collection.recordset', {
                  ownerShip: false,
                  adapter: items.getAdapter(),
                  idProperty: items.getIdProperty(),
                  model: items.getModel()
               });
            } else {
               ListView.superclass.initializeSelectedItems.call(this);
            }
         },
         /**
          * Удаляет записи из источника данных по переданным идентификаторам элементов коллекции.
          * @remark
          * При использовании метода для в классе {@link SBIS3.CONTROLS.TreeCompositeView} или его наследниках, есть особенность перезагрузки данных.
          * Для режима отображения "Таблица" (table), который устанавливают с помощью опции {@link SBIS3.CONTROLS.CompositeViewMixin#viewMode}, производится частичная перезагрузка данных в узлах иерархии.
          * Это означает, что данные списка будут обновлены быстрее: запрос на обновление будет произведён только для тех узлов, элементы которого удаляются методом.
          * Для списков любых других классов будет произведена полная перезагрузка списка записей, например как при методе {@link SBIS3.CONTROLS.ListView#reload}.
          * @param {Array|Number|String} idArray Массив с идентификаторами элементов коллекции.
          * Если нужно удалить одну запись, то в параметр передаётся простое значение - идентификатор элемента.
          * @param {String} [message] Текст, который будет использован в диалоговом окне перед началом удаления записей из источника.
          * Если параметр не передан, то для удаления нескольких записей будет использован текст "Удалить записи?", а для удаления одной записи - "Удалить текущую запись?".
          * @returns {Deferred} Возвращает объект deferred. На результат работы метода можно подписаться для решения прикладных задача.
          */
         deleteRecords: function(idArray, message) {
            var
                self = this,
                beginDeleteResult;
            //Клонируем массив, т.к. он может являться ссылкой на selectedKeys, а после удаления мы сами вызываем removeItemsSelection.
            //В таком случае и наш idArray изменится по ссылке, и в событие onEndDelete уйдут некорректные данные
            idArray = Array.isArray(idArray) ? cFunctions.clone(idArray) : [idArray];
            message = message || (idArray.length !== 1 ? rk("Удалить записи?", "ОперацииНадЗаписями") : rk("Удалить текущую запись?", "ОперацииНадЗаписями"));
            return fcHelpers.question(message).addCallback(function(res) {
               if (res) {
                  beginDeleteResult = self._notify('onBeginDelete', idArray);
                  if (beginDeleteResult instanceof Deferred) {
                     beginDeleteResult.addCallback(function(result) {
                        self._deleteRecords(idArray, result);
                     }).addErrback(function (result) {
                        fcHelpers.alert(result);
                     });
                  } else {
                     self._deleteRecords(idArray, beginDeleteResult);
                  }
               }
            });
         },

         _deleteRecords: function(idArray, beginDeleteResult) {
            var self = this;
            if (beginDeleteResult !== false) {
               this._toggleIndicator(true);
               return this._deleteRecordsFromData(idArray).addCallback(function () {
                  //Если записи удалялись из DataSource, то перезагрузим реест, если из items, то реестр уже в актальном состоянии
                  if (self.getDataSource()) {
                     return self._reloadViewAfterDelete(idArray).addCallback(function() {
                        self._syncSelectedKeys();
                     });
                  } else {
                     self._syncSelectedKeys();
                  }
               }).addErrback(function (result) {
                  fcHelpers.alert(result)
               }).addBoth(function (result) {
                  self._toggleIndicator(false);
                  self._notify('onEndDelete', idArray, result);
               });
            }
         },

         _deleteRecordsFromData: function(idArray) {
            var
                items = this.getItems(),
                source = this.getDataSource();
            if (source) {
               return source.destroy(idArray);
            } else {
               items.setEventRaising(false, true);
               for (var i = 0; i < idArray.length; i++) {
                  items.remove(items.getRecordById(idArray[i]));
               }
               items.setEventRaising(true, true);
               return Deferred.success(true);
            }
         },

         _reloadViewAfterDelete: function() {
            return this.reload();
         },

         _syncSelectedKeys: function() {
            var
                self = this,
                keysForRemove = [];
            colHelpers.forEach(this.getSelectedKeys(), function(key) {
               if (!self._getItemProjectionByItemId(key)) {
                  keysForRemove.push(key);
               }
            });
            self.removeItemsSelection(keysForRemove);
         },

         _initLoadMoreButton: function() {
            if (this._options.infiniteScroll == 'demand'){
               this._loadMoreButton = this.getChildControlByName('loadMoreButton');
               if (this.getItems()){
                  this._setLoadMoreCaption(this.getItems());
               }
               this.subscribeTo(this._loadMoreButton, 'onActivated', this._onLoadMoreButtonActivated.bind(this));
            }
         },

         getTextValue: function() {
            var
                selectedItem,
                textValues = [];
            if (this._options.multiselect) {
               this.getSelectedItems().each(function(item) {
                  textValues.push(item.get(this._options.displayProperty));
               }, this);
            } else {
               selectedItem = this.getItems().getRecordById(this.getSelectedKey());
               if (selectedItem) {
                  textValues.push(selectedItem.get(this._options.displayProperty));
               }
            }
            return textValues.join(', ');
         }
      });

      return ListView.mixin([BreakClickBySelectMixin]);
   });
