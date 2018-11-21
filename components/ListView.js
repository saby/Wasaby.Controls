/**
 * Created by iv.cheremushkin on 14.08.2014.
 */

define('SBIS3.CONTROLS/ListView',
   [
      'SBIS3.CONTROLS/Utils/ConfigByClasses',
      'Core/core-merge',
      'Core/core-clone',
      'Core/helpers/Function/shallowClone',
      'Core/CommandDispatcher',
      'Core/constants',
      'Core/Deferred',
      'Core/IoC',
      'Core/helpers/String/format',
      'Lib/Control/CompoundControl/CompoundControl',
      'View/Runner/requireHelper',
      'Lib/StickyHeader/StickyHeaderManager/StickyHeaderManager',
      'SBIS3.CONTROLS/Mixins/ItemsControlMixin',
      'SBIS3.CONTROLS/Mixins/MultiSelectable',
      'WS.Data/Query/Query',
      'WS.Data/Entity/Record',
      'SBIS3.CONTROLS/Mixins/Selectable',
      'SBIS3.CONTROLS/Mixins/DataBindMixin',
      'SBIS3.CONTROLS/Mixins/DecorableMixin',
      'SBIS3.CONTROLS/Mixins/DragNDropMixin',
      'SBIS3.CONTROLS/Mixins/FormWidgetMixin',
      'Lib/Mixins/BreakClickBySelectMixin',
      'SBIS3.CONTROLS/ListView/resources/ItemsToolbar/ItemsToolbar',
      'tmpl!SBIS3.CONTROLS/ListView/ListView',
      'SBIS3.CONTROLS/Utils/TemplateUtil',
      'SBIS3.CONTROLS/ListView/resources/CommonHandlers',
      'SBIS3.CONTROLS/Utils/ImitateEvents',
      'Lib/LayoutManager/LayoutManager',
      'Core/helpers/Hcontrol/configStorage',
      'SBIS3.CONTROLS/Utils/ScrollWatcher',
      'WS.Data/Collection/IBind',
      'tmpl!SBIS3.CONTROLS/ListView/resources/ListViewGroupBy',
      'tmpl!SBIS3.CONTROLS/ListView/resources/ItemTemplate',
      'tmpl!SBIS3.CONTROLS/ListView/resources/ItemContentTemplate',
      'tmpl!SBIS3.CONTROLS/ListView/resources/GroupTemplate',
      'SBIS3.CONTROLS/Paging',
      'SBIS3.CONTROLS/ComponentBinder',
      'WS.Data/Di',
      'Controls/Utils/ArraySimpleValuesUtil',
      'Core/core-instance',
      'Core/LocalStorageNative',
      'Core/helpers/Function/forAliveDeferred',
      'Core/helpers/Function/memoize',
      'Core/helpers/Hcontrol/isElementVisible',
      'SBIS3.CONTROLS/Utils/Contains',
      'SBIS3.CONTROLS/Controllers/CursorListNavigation',
      'WS.Data/Source/SbisService',
      'Core/detection',
      'SBIS3.CONTROLS/ListView/resources/Mover',
      'Core/helpers/Function/throttle',
      'Core/helpers/Object/isEmpty',
      'Core/Sanitize',
      'Core/WindowManager',
      'SBIS3.CONTROLS/ListView/resources/VirtualScrollController',
      'SBIS3.CONTROLS/ListView/resources/DragMove/DragMove',
      'Core/helpers/Function/once',
      'SBIS3.CONTROLS/Link',
      'browser!SBIS3.CONTROLS/ListView/resources/SwipeHandlers',
      'i18n!SBIS3.CONTROLS/ListView',
      'WS.Data/MoveStrategy/Base',
      'css!SBIS3.CONTROLS/ListView/ListView',
      'css!SBIS3.CONTROLS/ListView/resources/ItemActionsGroup/ItemActionsGroup'
   ],
   function(ConfigByClasses, cMerge, shallowClone, coreClone, CommandDispatcher, constants, Deferred, IoC, format, CompoundControl, requireHelper, StickyHeaderManager, ItemsControlMixin, MultiSelectable, Query, Record,
      Selectable, DataBindMixin, DecorableMixin, DragNDropMixin, FormWidgetMixin, BreakClickBySelectMixin, ItemsToolbar, dotTplFn,
      TemplateUtil, CommonHandlers, ImitateEvents, LayoutManager, configStorage,
      ScrollWatcher, IBindCollection, groupByTpl, ItemTemplate, ItemContentTemplate, GroupTemplate,
      Paging, ComponentBinder, Di, ArraySimpleValuesUtil, cInstance, LocalStorageNative, forAliveOnly, memoize, isElementVisible, contains, CursorNavigation, SbisService, cDetection, Mover, throttle, isEmpty, Sanitize, WindowManager, VirtualScrollController, DragMove, once) {
      'use strict';

      var
         buildTplArgsLV = function(cfg) {
            var tplOptions = cfg._buildTplArgsSt.call(this, cfg);
            tplOptions.multiselect = cfg.multiselect;
            tplOptions.decorators = cfg._decorators;
            tplOptions.highlightText = cfg.highlightText;
            tplOptions.colorField = cfg.colorField;
            tplOptions.selectedKey = cfg.selectedKey;
            tplOptions.selectedKeys = cfg.selectedKeys;
            tplOptions.showSelectedMarker = cfg.showSelectedMarker;
            tplOptions.itemsHover = cfg.itemsHover;
            tplOptions.alwaysShowCheckboxes = cfg.alwaysShowCheckboxes;

            return tplOptions;
         },
         getRecordsForRedrawLV = function (projection, cfg){
            var records = cfg._getRecordsForRedrawSt.apply(this, arguments);
            return records;
         };
      var
         NOT_EDITABLE_SELECTOR = '.js-controls-ListView__notEditable';

      var INDICATOR_DELAY = 750;

      /**
       * Контрол, отображающий набор однотипных сущностей. Позволяет отображать данные списком по определенному шаблону, а так же фильтровать и сортировать.
       * Подробнее о настройке контрола и его окружения вы можете прочитать в разделе <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/">Настройка списков</a>.
       *
       * @class SBIS3.CONTROLS/ListView
       * @extends Lib/Control/CompoundControl/CompoundControl
       * @author Герасимов А.М.
       *
       * @mixes SBIS3.CONTROLS/Mixins/DecorableMixin
       * @mixes SBIS3.CONTROLS/Mixins/ItemsControlMixin
       * @mixes SBIS3.CONTROLS/Mixins/FormWidgetMixin
       * @mixes SBIS3.CONTROLS/Mixins/MultiSelectable
       * @mixes SBIS3.CONTROLS/Mixins/Selectable
       * @mixes SBIS3.CONTROLS/Mixins/DataBindMixin
       * @mixes SBIS3.CONTROLS/Mixins/DragNDropMixin
       * @mixes SBIS3.CONTROLS/ListView/resources/CommonHandlers
       *
       * @cssModifier controls-ListView__withoutMarker Скрывает отображение маркера активной строки. Подробнее о маркере вы можете прочитать в <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/list-visual-display/marker/">этом разделе</a>.
       * @cssModifier controls-ListView__orangeMarker Устанавливает отображение маркера активной строки у элементов списка. Модификатор актуален только для класса SBIS3.CONTROLS.ListView.
       * @cssModifier controls-ListView__showCheckBoxes Устанавливает постоянное отображение чекбоксов для записей списка. Модификатор применяется для режима множественного выбора записей (см. {@link multiselect}).
       * @cssModifier controls-ListView__hideCheckBoxes Скрывает отображение чекбоксов для записей списка, для которого установлен режим множественного выбора записей (см. {@link multiselect}).
       * @cssModifier controls-ListView__bottomStyle Изменяет положение "быстрых операций над записью", при котором они будут отображение в специальном блоке под записью. Подробнее о таких операциях вы можете прочитать в <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/records-editing/items-action/fast/index/">этом разделе</a>.
       * @cssModifier controls-ListView__pagerNoSizePicker Скрывает отображение выпадающего списка, в котором производят выбор размера страницы для режима постраничной навигации (см. {@link showPaging}).
       * @cssModifier controls-ListView__pagerNoAmount Скрывает отображение количества записей на странице для режима постраничной навигации (см. {@link showPaging}).
       * @cssModifier controls-ListView__pagerHideEndButton Скрывает отображение кнопки "Перейти к последней странице". Используется для режима постраничной навигации (см. {@link showPaging}).
       *
       * @css controls-DragNDropMixin__notDraggable За помеченные данным селектором элементы Drag&Drop производиться не будет.
       * @css js-controls-ListView__notEditable Клик по элементу с данным классом не будет приводить к запуску редактирования по месту.
       * @css controls-ListView__disableHover Скрывает выделение по ховеру.
       *
       *
       * @ignoreOptions _handlers activableByClick alwaysShowExtendedTooltip buildMarkupWithContext className ignoreTabCycles linkedContext modal
       *
       * @ignoreMethods addPendingOperation applyEmptyState applyState getAlignment getAllPendingInfo getClassName getMinHeight getMinSize getMinWidth getResizer getStateKey
       * @ignoreMethods getToolBarCount getEventBusOf getNamedGroup getNearestChildControlByName getOwnerId initializeProperty isAllReady increaseToolBarCount isPage
       * @ignoreMethods makeOwnerName onBringToFront onDropDownList setActivationIndex setSize setItemTemplate setOwner setStateKey waitAllPendingOperations
       *
       * @ignoreEvents onStateChanged onTooltipContentRequest onAfterLoad onChange onStateChange onDragStop onDragIn onDragOut onDragStart
       *
       * @control
       * @public
       * @category Lists
       *
       *
       */

      var BeginDeleteResult = { // Возможные результаты события "onBeginDelete"
         CANCEL: 'Cancel', // Отменить удаление записей
         WITHOUT_RELOAD: 'WithoutReload' //Удалить записи без перезагрузки реестра
      };

      /*TODO CommonHandlers тут в наследовании не нужны*/
      var ListView = CompoundControl.extend([DecorableMixin, ItemsControlMixin, FormWidgetMixin, MultiSelectable, Selectable, DataBindMixin, DragNDropMixin, CommonHandlers], /** @lends SBIS3.CONTROLS/ListView.prototype */ {
         _dotTplFn: dotTplFn,
         /**
          * @event onChangeHoveredItem Происходит при переводе курсора мыши на другой элемент коллекции списка.
          * @param {Core/EventObject} eventObject Дескриптор события.
          * @param {Object} hoveredItem Объект, свойства которого описывают данные элемента коллекции списка, на который навели курсор мыши.
          * @param {Number|String} hoveredItem.key Первичный ключ элемента.
          * @param {jQuery|false} hoveredItem.container Контейнер визуального отображения элемента (DOM-элемент).
          * @param {Object} hoveredItem.position Объект, свойства которого описывают координаты container.
          * @param {Number} hoveredItem.position.top Отступ от верхней границы container до верхней границы контейнера визуального отображения списка. Значение в px. При расчете учитывается текущий скролл в списке.
          * @param {Number} hoveredItem.position.left Отступ от левой границы container до левой границы контейнера визуального отображения списка. Значение в px.
          * @param {Object} hoveredItem.size Объект, свойства которого описывают высоту и ширину container.
          * @param {Number} hoveredItem.size.height Высота container в px.
          * @param {Number} hoveredItem.size.width Ширина container в px.
          * @example
          * При наведении курсора мыши на запись справа от неё отображаются операции (см. <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/records-editing/items-action/fast/">Быстрый доступ к операциям по наведению курсора</a>).
          * Ниже приведён код, с помощью которого можно изменять отображение набора операций для записей списка.
          * <pre>
          *    dataGrid.subscribe('onChangeHoveredItem', function(eventObject, hoveredItem) {
          *       var actions = DataGridView.getItemsActions();
          *       actions.ready().addCallback(function() {
          *          var instances = actions.getItemsInstances();
          *          for (var i in instances) {
          *             if (instances.hasOwnProperty(i)) {
          *                // Будем скрывать кнопку удаления для всех строк
          *                instances[i][i === 'delete' ? 'show' : 'hide']();
          *             }
          *          }
          *       });
          *    });
          * </pre>
          * Подобная задача часто сводится к отображению различных операций для узлов, скрытых узлов и листьев для иерархических списков.
          * Пример конфигурации списка для решения подобной задачи вы можете найти в разделе <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/records-editing/items-action/fast/mode/">здесь</a>.
          * @see itemsActions
          * @see setItemsActions
          * @see getItemsActions
          */
          /**
           * @event onItemClick Происходит при любом клике по записи.
           * @remark
           * При работе с иерархическими списками при клике по папке (узлу) по умолчанию происходит проваливание в узел или его развертывание.
           * Чтобы отменить такое поведение, в обработчике события установите результат false.
           * <pre>
           *    myListView.subscribe('onItemClick', function(eventObject) {
           *        eventObject.setResult(false);
           *        ... // пользовательская логика клика по записи.
           *    });
           * </pre>
           * @param {Core/EventObject} eventObject Дескриптор события.
           * @param {String} id Первичный ключ записи.
           * @param {WS.Data/Entity/Model} data Экземпляр класса записи.
           * @param {Object} target DOM-элемент, на который кликнули. Например, это может быть DOM-элемент ячейки (&lt;td class="controls-DataGridView__td"&gt;...&lt;/td&gt;) или её содержимого (&lt;div class="controls-DataGridView__columnValue"&gt;...&lt;/div&gt;).
           * @param {Object} e Объект события.
           * @param {Object} clickedCell Объект с расширенной информацией о ячейке, по которой произвели клик.
           * @param {jQuery} clickedCell.cellContainer DOM-элемент ячейки.
           * @param {Number} clickedCell.cellIndex Индекс колонки, в которой находится ячейка.
           */
          /**
          * @event onItemActivate Происходит при смене записи (активации) под курсором мыши (например, клик с целью редактирования или выбора).
          * @param {Core/EventObject} eventObject Дескриптор события.
          * @param {Object} meta Объект
          * @param {String} meta.id Первичный ключ записи.
          * @param {WS.Data/Entity/Model} meta.item Экземпляр класса записи.
          */
         /**
          * @event onDataMerge Происходит перед добавлением загруженных записей в основной dataSet.
          * @remark
          * Событие срабатывает при подгрузке по скроллу, при подгрузке в ветку дерева.
          * Т.е. при любой вспомогательной загрузке данных.
          * @param {Core/EventObject} eventObject Дескриптор события.
          * @param {Object} RecordSet - {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/working-with-data/icollection/#wsdatacollectionrecordset RecordSet} с загруженными данными
          * @example
          * <pre>
          *     DataGridView.subscribe('onDataMerge', function(event, recordSet) {
          *        // Если в загруженном рекордсете есть данные, отрисуем их количество
          *        var count = recordSet.getCount();
          *        if (count){
          *           self.drawItemsCounter(count);
          *        }
          *     });
          * </pre>
          */
         /**
          * @event onItemValueChanged Происходит при смене значения в одном из полей редактирования по месту и потере фокуса этим полем.
          * @deprecated
          * @param {Core/EventObject} eventObject Дескриптор события.
          * @param {Array} difference Массив измененных полей.
          * @param {WS.Data/Entity/Model} model Модель с измененными данными.
          */
         /**
          * @typedef {String} BeginEditResult
          * @variant Cancel Отменить завершение редактирования. Чтобы отменить запуск редактирования, нужно вернуть константу BeginEditResult.CANCEL из модуля {@link https://wi.sbis.ru/docs/js/SBIS3/CONTROLS/ListView/resources/EditInPlaceBaseController/EditInPlaceBaseController/ EditInPlaceBaseController}.
          * @variant PendingAll В результате редактирования ожидается вся запись, как есть (с текущим набором полей).
          * @variant PendingModifiedOnly В результате редактирования ожидаются только измененные поля. Это поведение используется по умолчанию.
          */
         /**
          * @event onBeginEdit Происходит перед началом редактирования.
          * @param {Core/EventObject} eventObject Дескриптор события.
          * @param {WS.Data/Entity/Model} model Редактируемая запись.
          * @param {Boolean} isAdd Флаг, означающий что событию предшествовал запуск добавления по месту.
          * @returns {BeginEditResult|Deferred} Deferred - используется для асинхронной подготовки редактируемой записи. Из Deferred необходимо обязательно возвращать запись, открываемую на редактирование.
          */
         /**
          * @event onBeginAdd Происходит перед созданием в списке нового элемента коллекции.
          * @remark
          * Событие происходит при вызове команды {@link beginAdd} и при <a href='/doc/platform/developmentapl/interface-development/components/list/list-settings/records-editing/edit-in-place/add-in-place/'>добавлении по месту</a> из пользовательского интерфейса.
          * В обработчике события можно установить инициализирующие значения полей для создаваемого элемента коллекции.
          * @param {Core/EventObject} eventObject Дескриптор события.
          * @returns {Object|Deferred} Object - опции создания записи. Deferred - используется для самостоятельной подготовки добавляемой записи. Из Deferred необходимо обязательно возвращать запись, открываемую на добавление.
          * @example
          * В качестве результата события передают Object или экземпляр класса {@link WS.Data/Entity/Model}.
          * <pre>
          *    myView.subscribe('onBeginAdd', function(eventObject) {
          *
          *       // инициализирующее значение для поля "Новинка"
          *       eventObject.setResult({ 'Новинка': true });
          *    });
          * </pre>
          * @see beginAdd
          */
         /**
          * @event onAfterBeginEdit Происходит после начала редактирования.
          * @param {Core/EventObject} eventObject Дескриптор события.
          * @param {WS.Data/Entity/Model} model Редактируемая запись.
          */
         /**
          * @event onEndEdit Происходит перед окончанием редактирования или добавления по месту.
          * @remark
          * После события onEndEdit выполняется валидация значений для всех дочерних контролов, используемых в режиме редактирования или добавления по месту.
          * Для валидации вызываются функции-валидаторы, которые устанавливает прикладной разработчик на каждый из контролов.
          * В случае когда валидация не пройдена, контрол подсвечивается, а завершение редактирования или добавления по месту не происходит.
          * Валидация контролов не происходит, когда из обработчика события возвращаются результаты "CANCEL" или "NotSave".
          * @param {Core/EventObject} eventObject Дескриптор события.
          * @param {WS.Data/Entity/Model} model Редактируемая запись.
          * @param {Boolean} withSaving Признак, соответствующий типу завершения редактирования:
          * <ul>
          *    <li>true - редактирование завершается сохранением изменений;</li>
          *    <li>false - сохранение изменений отменено; была нажата клавиша Esc или переведён фокус на другой контрол.</li>
          * </ul>
          * @returns {EndEditResult} Выше приведён список констант, которые можно возвращать из обработчка события для выполнения соответствующего действия.
          * Если возвращается любое другое значение, не соответствующее константе, оно будет проигнорировано, в результате происходит сохранение изменений редактирования/добавления по месту.
          */
         /**
          * @event onAfterEndEdit Происходит после окончания редактирования по месту.
          * @param {Core/EventObject} eventObject Дескриптор события.
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
          * @param {Core/EventObject} eventObject Дескриптор события.
          * @param {Array} records Список перемещаемых записей.
          * @returns {Object} filter Фильтр, который будет помещён в диалог перемещения.
          */
         /**
          * @event onEndDelete Происходит после удаления записей.
          * @param {Core/EventObject} eventObject Дескриптор события.
          * @param {Array.<String>|Array.<Number>} idArray Массив ключей удаляемых записей.
          * @param {*} result Результат удаления.
          */
         /**
          * @event onBeginDelete Происходит перед удалением записей.
          * @param {Core/EventObject} eventObject Дескриптор события.
          * @param {Array.<String>|Array.<Number>} idArray Массив ключей удаляемых записей.
          * @returns {*|Boolean|Deferred} result Если result=false, то отменяется логика удаления записи, установленная по умолчанию.
          */
         /**
          * @typedef {String} MovePosition
          * @variant after Вставить перемещаемые элементы после текущей записи.
          * @variant before Вставить перемещаемые элементы перед текущей записью.
          * @variant on Перемещение по иерархии, изменить родителя у перемещаемых элементов без изменения порядково номера.
          */
         /**
          * @typedef {Object} DragEntityOptions
          * @property {SBIS3.CONTROLS/Control} owner Контрол, которому принадлежит запись.
          * @property {jQuery} domElement DOM-элемент, отображающий запись.
          * @property {WS.Data/Entity/Model} model Модель, соответствующая записи.
          * @property {MovePosition|undefined} position Позиция элемента после перемещения (определяется только у целевого элемента - того, который находится под курсором мыши).
          */
          /**
          * @typedef {Object} DragEntityListOptions
          * @property {Array} items Массив перемещаемых элементов {@link SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Row}.
          */
         /**
          * @typedef {String} EndEditResult
          * @variant Cancel Отменить завершение редактирования/добавления.
          * @variant Save Завершить редактирование/добавление с сохранением изменений согласно логике, которая установлена по умолчанию.
          * @variant NotSave Завершить редактирование/добавление без сохранения изменений. <b>Внимание:</b> использование данной константы в режиме добавления по месту приводит к автоудалению созданной записи.
          * @variant CustomLogic Завершить редактирование/добавление с сохранением изменений согласно логике, которая определена прикладным разработчиком. Используется, например, при добавлении по месту, когда разработчику необходимо самостоятельно обработать добавляемую запись.
          */
         /**
          * @typedef {String} BeginMoveResult
          * @variant MoveInItems Переместить записи в списке без вызова метода перемещения на источнике данных.
          * @variant Custom Завершить перемещение не делая ни чего. В этом случае предполагается что вся логика перемещения будет реализована самостоятельно.
          */
         /**
          * @event onBeginMove Происходит перед началом перемещения записей
          * @param {Core/EventObject} eventObject Дескриптор события.
          * @param {Array} moveItems Массив перемещаемых записей.
          * @param {WS.Data/Entity/Model} target Запись относительно которой происходит перемещение.
          * @param {MovePosition} position Как перемещать записи.
          * @remark Событие не работает если используются стратегии перемещения
          * @returns {BeginMoveResult} Когда из обработчика события возвращается константа или деферед, возвращающий константу, список которых приведён выше, происходит соответствующее действие.
          * Когда возвращается любое другое значение, оно будет проигнорировано, и произойдёт перемещение записей.
          */
         /**
          * @event onEndMove Происходит после перемещения записей.
          * @param {Core/EventObject} eventObject Дескриптор события.
          * @param {undefined|Object|Error} result Результат вызова метода перемещения на источнике данных.
          * @param {Array} moveItems Массив перемещаемых записей.
          * @param {WS.Data/Entity/Model} target Запись относительно которой происходит перемещение.
          * @param {MovePosition} position Как перемещать записи.
          * @remark Событие не работает если используются стратегии перемещения
          * @example
          * Показать ошибку перемещения
          * <pre>
          * view.subscribe('onEndMove', function(e, result) {
          *    if (result instanceof Error) {
          *       result.processed = true;//Надо поставить флаг что ошибка обработана;
          *       require(['SBIS3.CONTROLS/Utils/InformationPopupManager'], function(InformationPopupManager) {
          *          InformationPopupManager.showMessageDialog(
          *             {
          *                message: result.message,
          *                status: 'error'
          *             }
          *          );
          *       })
          *    }
          * })
          * </pre>
          */
         $protected: {
            _has_task1173941879Fix: true,
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
            _createEditInPlaceDeferred: null,
            _pageChangeDeferred : undefined,
            _scrollPager: null,
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
               constants.key.del,
               constants.key.pageUp,
               constants.key.pageDown
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
            /* Флаг, обозначающий, нужно ли нам показывать индикатор загрузки сверху при подгрузке списка вверх,
               его не надо показывать, когда реестр загружен и сверху подгружаются записи, тогда они просто добавятся сверху,
               а индикатор лишь будет вызывать моргание. */
            _scrollUpIndicator: false,
            _virtualScrollShouldReset: false,
            _virtualScrollResetStickyHead: false,
            _setScrollPagerPositionThrottled: null,
            _updateScrollIndicatorTopThrottled: null,
            _onKeyUpEnterThrottled: null,
            _removedItemsCount: false,
            _loadQueue: {},
            _loadId: 0,
            _options: {
                itemsHover: true,
                alwaysShowCheckboxes: false,
               _canServerRender: true,
               _buildTplArgs: buildTplArgsLV,
               _getRecordsForRedraw: getRecordsForRedrawLV,
               _buildTplArgsLV: buildTplArgsLV,
               _defaultItemTemplate: ItemTemplate,
               _defaultItemContentTemplate: ItemContentTemplate,
               _groupTemplate: GroupTemplate,
               //TODO Костыль. Чтоб в шаблоне позвать Sanitize с компонентами приходится прокидывать в виде функции свой sanitize
               _sanitize: function(value) {
                  return typeof value === 'string' ?
                     Sanitize(value, {validNodes: {component: true}, validAttributes : {config : true} }) :
                     value;
               },
               /**
                * @faq Почему нет чекбоксов в режиме множественного выбора значений (активация режима производится опцией {@link SBIS3.CONTROLS/ListView#multiselect multiselect})?
                * Для отрисовки чекбоксов необходимо в шаблоне отображения элемента коллекции обозначить их место.
                * Это делают с помощью CSS-классов "controls-ListView__itemCheckBox js-controls-ListView__itemCheckBox".
                * В следующем примере место отображения чекбоксом обозначено тегом span:
                * <pre>
                * <pre>
                *     <div class="listViewItem" style="height: 30px;">
                *        <span class="controls-ListView__itemCheckBox js-controls-ListView__itemCheckBox"></span>
                *        {{=it.item.get("title")}}
                *     </div>
                * </pre>
                * @bind SBIS3.CONTROLS/ListView#itemTemplate
                * @bind SBIS3.CONTROLS/ListView#multiselect
                */
               /**
                * @cfg {String} Устанавливает шаблон отображения каждого элемента коллекции.
                * @deprecated Используйте {@link SBIS3.CONTROLS/Mixins/ItemsControlMixin#itemTpl}.
                * @remark
                * Шаблон - это пользовательская вёрстка элемента коллекции.
                * Для доступа к полям элемента коллекции в шаблоне подразумевается использование конструкций шаблонизатора.
                * <br/>
                * Шаблон может быть создан в отдельном XHTML-файле, когда вёрстка большая или требуется использовать его в разных компонентах.
                * Шаблон создают в директории компонента в подпапке resources согласно правилам, описанным в разделе {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/core/component/file-structure/ Файловая структура компонента}.
                * <br/>
                * Чтобы такой шаблон можно было использовать, нужно:
                * 1. Подключить шаблон в массив зависимостей компонента и импортировать его в переменную:
                *       <pre>
                *          define('Examples/MyArea/MyComponent',
                *             [
                *                ...
                *                'tmpl!Examples/MyArea/MyComponent/resources/item_template'
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
                * @typedef {Array} ItemsActions
                * @property {String} name Уникальное имя кнопки.
                * По имени можно получить экземпляр класса кнопки, что в прикладных задачах может быть использовано, например, для изменения видимости кнопки при выполнении условия.
                *
                * @property {String} [icon] Иконка на кнопке. Список иконок можно найти в <a href="/docs/js/icons/">этом разделе</a>.
                *
                * @property {String} [toolbarViewMode] Внешний вид кнопки. Допустимые значения:
                * <ul>
                *   <li><b>icon</b> - будет отображаться только иконка. Для отображения кнопки установите иконку в опции icon. В этом случае кнопка строится на основе класса контрола {@link SBIS3.CONTROLS/Button/IconButton}.</li>
                *   <li><b>caption</b> - будет отображаться как текст. Для отображения кнопки установите текст в опции caption. В этом случае кнопка строится на основе класса контрола {@link SBIS3.CONTROLS/Link}</li>
                *   <li><b>true</b> - будет отображаться как иконка + текст. Для отображения кнопки одновременно задайте опции icon и caption. 
                * </ul>
                *
                * @property {String} [caption] Подпись на кнопке.
                *
                * @property {String} [tooltip] Текст всплывающей подсказки.
                *
                * @property {Boolean} [isMainAction] С помощью данного признака устанавливает, что кнопка отображается либо на тулбаре, либо в выпадающем списке.
                * Тулбар появляется при наведении курсора мыши на запись вместе со всеми кнопками, для которых isMainAction=true.
                * Также на тулбаре расположена кнопка для открытия выпадающегно списка, в котором расположены кнопки isMainAction=false.
                *
                * @property {Function} [onActivated] Функция, которая будет выполнена при клике по кнопке.
                * Внутри функции указатель this возвращает экземпляр класса списка.
                * Аргументы функции:
                * <ul>
                *    <li>contaner {jQuery} - контейнер визуального отображения записи, для которой отображена кнопка.</li>
                *    <li>id {String|Number} - идентификатор записи.</li>
                *    <li>item {WS.Data/Entity/Model} - экземпляр класса записи.</li>
                * </ul>
                *
                * @property {Boolean} [allowChangeEnable] Признак, при котором отображение кнопки зависит от значения опции {@link Lib/Control/Control#enabled}.
                *
                * <ul>
                *     <li>true. Кнопка не отображается, когда для списка опция {@link Lib/Control/Control#enabled} установлена в значение false.</li>
                *     <li>false. Кнопка отображается всегда.</li>
                * </ul>
                *
                * @property {String} [cssClass] Класс, добавляемый на кнопку.
                *
                * @editor icon ImageEditor
                * @translatable caption tooltip
                */
               /**
                * @cfg {ItemsActions[]} Кнопки, отображаемые при наведении курсора мыши на запись.
                * @remark
                * Создаются на основе контролов {@link SBIS3.CONTROLS/Button/IconButton} и {@link SBIS3.CONTROLS/Link}.
                * Если опция {@link Lib/Control/Control#enabled enabled} контрола установлена в false, то действия, доступные при наведении курсора мыши на запись, отображаться не будут. Однако с помощью опции {@link Lib/Control/Control#allowChangeEnable allowChangeEnable} можно изменить это поведение.
                * ![](/allowChangeEnable.png)
                * Подробнее о настройке таких действий вы можете прочитать в разделе <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/records-editing/items-action/fast/">Быстрый доступ к операциям по наведению курсора</a>.
                *
                * @example
                * <b>Пример 1.</b> Конфигурация операций через вёрстку компонента.
                * <pre>
                *     <ws:itemsActions>
                *        <ws:Array>
                *           <ws:Object name="btn1" caption="Удалить" tooltip="Удалить" icon="sprite:icon-16 icon-Delete icon-primary" isMainAction="{{false}}">
                *              <ws:onActivated>
                *                 <ws:Function>Examples/MyArea/MyComponent:prototype.myOnActivatedHandler</ws:Function>
                *              </ws:onActivated>
                *           </ws:Object>
                *           <ws:Object name="btn2" caption="Изменить" tooltip="Изменить" icon="sprite:icon-16 icon-Trade icon-primary" isMainAction="{{true}}">
                *              <ws:onActivated>
                *                 <ws:Function>Examples/MyArea/MyComponent:prototype.myOnActivatedHandler</ws:Function>
                *              </ws:onActivated>
                *           </ws:Object>
                *         </ws:Array>
                *     </ws:itemsActions>>
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
                * </pre>
                * <b>Пример 3.</b> Установка обработчика удаления записи
                * <pre>
                * <div>
                *    <WS3Browser.Browser name="goodsBrowser">
                *        <ws:content type="string">
                *            <SBIS3.CONTROLS.DataGridView>
                *                // ...
                *                <ws:itemsActions>
                *                    <ws:Array>
                *                        <ws:Object name="delete" caption="Удалить" tooltip="Удалить" icon="sprite:icon-16 icon-Erase icon-error" isMainAction="true" onActivated="{{ deleteRecord }}"></ws:Object>
                *                    </ws:Array>
                *                </ws:itemsActions>
                *            </SBIS3.CONTROLS.DataGridView>
                *        </ws:content>
                *    </WS3Browser.Browser>
                * </div>
                * </pre>
                *
                * Создаём секцию $protected перед функцией init. Определяем в ней переменную "deleteRecord", с заданным значением по умолчанию:
                * <pre>
                * $protected: {
                *    _options: {
                *       deleteRecord: null
                *    }
                * }
                *</pre>
                *
                * Добавляем на одном уровне с функцией init новую функцию deleteRecord:
                * <pre>
                * init: function() {
                *    ...
                * },
                * _deleteRecord: function($tr, id) {
                *    // Вызываем метод списка - удаление записей по переданным идентификаторам
                *    this.deleteRecords(id);
                * }
                * </pre>
                *
                * После функции init добавляем секцию "_modifyOptions", в которой в переменную "deleteRecord" передаётся значение функции. Это необходимо для установки обработчика удаления записи списка через шаблонизатор.
                * <pre>
                * // Модификация опций компонента, нужна для передачи обработчиков
                * _modifyOptions: function() {
                *    var options = moduleClass.superclass._modifyOptions.apply(this, arguments);
                *    Serializer.setToJsonForFunction(this._deleteRecord, 'SBIS3/Site/MainTable', 'prototype._deleteRecord');
                *    options.deleteRecord = this._deleteRecord;
                *    return options;
                * }
                * </pre>
                *
                * @see setItemsActions
                * @see getItemsActions
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
               }],
               /**
                * @cfg {String|Boolean} Перемещение элементов с помощью курсора мыши.
                * Подробнее в статье {@link /doc/platform/developmentapl/interface-development/components/list/list-settings/records-editing/items-action/dragndrop/ Перемещение записей в списках}.
                * @variant "" Запрещено.
                * @variant false Запрещено.
                * @variant allow Разрешено.
                * @variant true Разрешено.
                * @remark Подробнее о способах передачи значения в опцию вы можете прочитать в разделе <a href="/doc/platform/developmentapl/interface-development/core/component/xhtml/">Вёрстка компонента</a>.
                * Для того чтобы добавить возможность перемещать элементы в списке, используйте опцию {@link /docs/js/SBIS3/CONTROLS/ListView/options/enabledMove/ enabledMove}.
                */
               itemsDragNDrop: 'allow',
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
                * По умолчанию подгрузка осуществляется "вниз". Мы поскроллили и записи подгрузились вниз.
                * Но можно настроить скролл так, что записи будут загружаться по скроллу к верхней границе контейнера.
                * Важно! Запросы к БЛ все так же будут уходить с увеличением номера страницы.
                * Может использоваться для загрузки истории сообщений, например.
                * Подробное описание можно посмотреть в документах по настройке <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/navigations/infinite-scroll/">скроллинга</a> и <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/navigations/cursor/">курсора</a>.
                * @variant down Подгружать данные при достижении нижней границы контейнера (подгрузка "вниз").
                * @variant up Подгружать данные при достижении верхней границы контейнера (подгрузка "вверх").
                * @variant both Подгружать данные в обе стороны ("вверх" и "вниз").
                * @variant demand Подгружать данные при нажатии на кнопку "Еще...".
                * Если метод возвращает n:true/false, то кнопка будет рисовать просто "Еще...".
                * Если метод возвращает n: число записей - будет выводить число (например, "Еще 30").
                * @variant null Не загружать данные по скроллу.
                *
                * @example
                * <pre>
                *    infiniteScroll="down"
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
                * @cfg {jQuery | String} Отступ в пикселях до нижней/верхней границы контейнера, при достижении которого, начинается загрузка следующей страницы
                */
               infiniteScrollPreloadOffset: 400,
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
                * Тип постраничной навигации устанавливается по параметру "n" (см. <a href='/doc/platform/developmentapl/cooperationservice/json-rpc/#recordset-json-rpc-3'>RecordSet - выборка данных в JSON-RPC для СБиС 3</a>), который возвращается в ответе на запрос к источнику данных (см. {@link dataSource}).
                * Параметр по умолчанию поддерживается <a href='/doc/platform/developmentapl/workdata/logicworkapl/objects/blmethods/bllist/declr/'>декларативным методом бизнес-логики</a>, его значение будет установлено в соответствии со значением опции <i>partialPaging</i>.
                * Когда вы применяете другой тип списочного метода, опция <i>partialPaging</i> игнорируется, а значение параметра "n" должно быть установлено внутри метода: true - тип частичной постраничной навигации.
                * <br/>
                * Для контролов {@link SBIS3.CONTROLS/CompositeView} и {@link SBIS3.CONTROLS/Tree/CompositeView} режим постраничной навигации имеет свои особенности работы:
                * <ol>
                *    <li>В режимах отображения "Список" и "Таблица" (см. {@link SBIS3.CONTROLS/Mixins/CompositeViewMixin#viewMode viewMode}) постраничная навигация не работает, даже если опция <i>showPaging=true</i>. В этих режимах отображения автоматически устанавливается режим бесконечной подгрузки по скроллу - {@link infiniteScroll}.</li>
                *    <li>В режиме отображения "Плитка" постраничная навигация будет работать корректно.</li>
                * </ol>
                * @example
                * <pre>
                *     showPaging="{{true}}"
                * </pre>
                * @see setPage
                * @see getPage
                * @see infiniteScroll
                * @see partialPaging
                * @see SBIS3.CONTROLS/Mixins/DSMixin#pageSize
                * @see SBIS3.CONTROLS/Mixins/CompositeViewMixin#viewMode
                * @see SBIS3.CONTROLS/Tree/CompositeView
                * @see SBIS3.CONTROLS/CompositeView
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
                *    editMode="click|toolbar"
                * </pre>
                * Подробное описание каждого режима редактирования и их демонстрационные примеры вы можете найти в разделе документации {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/list/list-settings/records-editing/edit-in-place/ Редактирование по месту}.
                * @example
                * Установлен режим редактирования по клику на элемент коллекции.
                * <pre>
                *    editMode="click"
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
                * Данная опция обладает большим приоритетом, чем установленный в колонках редактор (см. {@link SBIS3.CONTROLS/DataGridView#columns}).
                * Данная опция может быть переопределена с помощью метода (см. {@link setEditingTemplatesetEditingTemplate}).
                * Переопределить опцию можно в любой момент до показа редакторов на строке, например {@link SBIS3.CONTROLS/DataGridView#onBeginEdit} или {@link SBIS3.CONTROLS/DataGridView#onItemClick}.
                * @example
                * Пример шаблона вы можете найти в разделе <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/records-editing/edit-in-place/#_4">Шаблон строки редактирования по месту</a>.
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
                * С подробным описанием можно ознакомиться в статье {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/list/list-settings/list-visual-display/results/ Строка итогов}.
                * @example
                * <pre class="brush: xml">
                *     resultsPosition="bottom" <!-- Строка итогов будет отображена под всеми элементами коллекции -->
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
                * С подробным описанием можно ознакомиться в статье {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/list/list-settings/list-visual-display/results/ Строка итогов}.
                * @example
                * <pre class="brush: xml">
                *    resultsText="Перечислено за квартал: "
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
                * С подробным описанием можно ознакомиться в статье {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/list/list-settings/list-visual-display/results/ Строка итогов}.
                * @example
                * 1. Подключаем шаблон в массив зависимостей:
                * <pre>
                *     define('Examples/MyArea/nDataGridView',
                *        [
                *           ...,
                *           'tmpl!Examples/MyArea/nDataGridView/resources/resultTemplate'
                *        ],
                *        ...
                *     );
                * </pre>
                * 2. Передаем шаблон в опцию:
                * <pre class="brush: xml">
                *     resultsTpl="tmpl!SBIS3.Demo.nDataGridView/resources/resultTemplate"
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
               /**
                * @typedef {Object} CursorNavigParams
                * @property {String|Array} [field] Поле/набор полей выборки, по которому строится индекс для курсора.
                * @property {String|Array} [position] Исходная позиция/набор позиций - значений полей в индексе для записи, на которой находится курсор по умолчанию
                * @property {String} [direction] Направление просмотра индекса по умолчанию (при первом запросе):
                     - before - вверх
                     - after - вниз
                     - both - в обе стороны от записи с navigation.config.position

                */
               /**
                * @typedef {Object} ListViewNavigation
                * @property {String} [type] Тип навигации. Например 'cursor'
                * @property {CursorNavigParams} [config] Конфиг для контроллера навигации
                */
               /**
                * @cfg {ListViewNavigation} Устанавливает конфиг для контроллера навигации ListView
                * Опция применяется для настройки {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/list/list-settings/navigations/cursor/ навигации по курсору}.
                * @example
                * Пример:
                *
                * <pre>
                * // Импортируем компонент прямо в исходном коде.
                * require(['SBIS3.CONTROLS/ListView'], function(List) {
                *
                *    // Инициализируем компонент, передаём конфигурацию.
                *    var list = new List({
                *
                *       // Настройка навигации по списку.
                *       navigation: {
                *
                *          // Тип навигации - "курсор".
                *          type: 'cursor',
                *
                *          // Конфигурация для типа навигации.
                *          config: {
                *
                *             // В таблице БД индекс создан по полю 'timestamp'.
                *             field: 'timestamp',
                *
                *             // Курсор устанавливается на записи со значением timestamp=40.
                *             position: 40,
                *
                *             // Направление выборки - вверх.
                *             direction: 'before'
                *          }
                *       }
                *    });
                * });
                * </pre>
                */
               navigation: null,
               /**
                * @cfg {Boolean} Устанавливает видимость кнопок управления скроллом
                * @remark
                * используется только вместе с включенным бесконечным скроллом
                * @see infiniteScroll
                * @see showPaging
                */
               scrollPaging: true, //Paging для скролла. TODO: объеденить с обычным пэйджингом в 200
               /**
                * @cfg {String|Function(DragEntityOptions):SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Entity} Конструктор перемещаемой сущности, должен вернуть элемент наследник класса {@link SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Row}
                * @see DragEntityOptions
                * @see SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Row
                */
               dragEntity: 'dragentity.row',
               /**
                * @cfg {String|Function(DragEntityOptions):SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Entity} Конструктор перемещаемой сущности, должен вернуть элемент наследник класса {@link SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Row}
                * @see DragEntityListOptions
                * @see SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/List
                */
               dragEntityList: 'dragentity.list',
               /**
                * @cfg {WS.Data/MoveStrategy/IMoveStrategy} Стратегия перемещения. Класс, который реализует перемещение записей. Подробнее тут {@link WS.Data/MoveStrategy/Base}.
                * @deprecated Для внедрения собственной логики используйте события {@link onBeginMove} или {@link onEndMove}.
                */
               moveStrategy: null,
               /**
                * @cfg {Boolean} Устанавливает возможность показа контекстного меню при нажатии правой кнопки мыши.
                * @remark
                * Варианты значений:
                * <ul>
                *    <li> false - показ меню отключен;</li>
                *    <li> true - контекстное меню отображается.</li>
                * </ul>
                * по умолчанию опция включена
                */
               contextMenu: true,
               /**
                * @cfg {Boolean} Разрешает перемещать элементы в списке.
                * @remark Перемещением с помощью курсора управляет опция {@link /docs/js/SBIS3/CONTROLS/Mixins/TreeViewMixin/options/itemsDragNDrop/ itemsDragNDrop}.
                * Описание всех возможных типов перемещений описано в {@link http://axure.tensor.ru/standarts/v7/%D0%BF%D0%B5%D1%80%D0%B5%D0%BC%D0%B5%D1%89%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B7%D0%B0%D0%BF%D0%B8%D1%81%D0%B5%D0%B9__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_1_.html стандарте разработки}.
                */
               enabledMove: true,
               /**
                * @cfg {Boolean} Использовать оптимизированный вариант позиционирования операций над записью.
                * @remark Внимание! Использовать с осторожностью, операции позиционируются внутри элемента,
                * на который была наведена мышь, стили элемента могут влиять на стили операций.
                */
               itemsActionsInItemContainer: false,
               virtualScrolling: false,
               //это использется для отображения аватарки драгндропа, она должна быть жекорированной ссылкой
               //временное решение пока не будет выпонена задача https://online.sbis.ru/debug/opendoc.html?guid=32162686-eee0-4206-873a-39bc7b4ca7d7&des=
               linkTemplateConfig: null,
               //включает плейсхолдер при перемещении записи мышкой, в 100 он работает только с плоскими списками,
               //опция будет удалена при реализации перемещения по новому стандарту
               useDragPlaceHolder: false,
               scrollIndicatorStyle: 'default',
               //TODO коммент ниже
               task1173941879: false
            },
            _scrollWatcher : undefined,
            _lastDeleteActionState: undefined, //Используется для хранения состояния операции над записями "Delete" - при редактировании по месту мы её скрываем, а затем - восстанавливаем состояние
            _componentBinder: null,
            _touchSupport: false,
            _editByTouch: false,
            _dragInitHandler: undefined, //метод который инициализирует dragNdrop
            _inScrollContainerControl: false,
            _allowMouseMoveEvent: true,
            _loadingIndicatorTimer: undefined, // Таймаут отображения крутилки в индикаторе загрузки
            _horisontalDragNDrop: false
         },

         $constructor: function () {
            var dispatcher = CommandDispatcher;

            this._publish('onChangeHoveredItem', 'onItemClick', 'onItemActivate', 'onDataMerge', 'onItemValueChanged', 'onBeginEdit', 'onAfterBeginEdit', 'onEndEdit', 'onBeginAdd', 'onAfterEndEdit', 'onPrepareFilterOnMove', 'onPageChange', 'onBeginDelete', 'onEndDelete', 'onBeginMove', 'onEndMove');
            this._setScrollPagerPositionThrottled = throttle.call(this._setScrollPagerPosition, 100, true).bind(this);
            this._updateScrollIndicatorTopThrottled = throttle.call(this._updateScrollIndicatorTop, 100, true).bind(this);
            this._onKeyUpEnterThrottled = throttle.call(this._onKeyUpEnter, 100, true).bind(this);
            this._eventProxyHdl = this._eventProxyHandler.bind(this);
            this._onScrollHandler = this._onScrollHandler.bind(this);
            /* Инициализацию бесконечного скрола производим один раз */
            this._prepareInfiniteScroll = once(this._prepareInfiniteScrollFn);
            
            this._toggleEventHandlers(this._container, true);

            this.initEditInPlace();
            this._setItemsDragNDrop(this._options.itemsDragNDrop);
            dispatcher.declareCommand(this, 'activateItem', this._activateItem);
            dispatcher.declareCommand(this, 'beginAdd', this.beginAdd);
            dispatcher.declareCommand(this, 'beginEdit', this.beginEdit);
            dispatcher.declareCommand(this, 'cancelEdit', this.cancelEdit);
            dispatcher.declareCommand(this, 'commitEdit', this.commitEdit);
            //После правок Шипина с оптимизацией пересчета перестал кидаться notiFyOnSizeChanged вместо него кидается эта команда
            //
            dispatcher.declareCommand(this, 'resizeYourself', this._onResizeHandlerInner);

            if (this._isCursorNavigation()) {
               this._listNavigation = new CursorNavigation(this._options.navigation);
            }
         },

         _updateItemData: function(itemData) {
            itemData.selectedKey = this.getSelectedKey();
            itemData.selectedKeys = this.getSelectedKeys();
         },

         getListNavigation: function() {
            return this._listNavigation;
         },

         init: function () {
            // На клиенте для мобильных устройств загружаем контроллеры редактирования сразу, т.к. для правильного функционирования системы фокусов, необходима синхронная логика
            if (cDetection.isMobilePlatform && window) {
               requirejs(['SBIS3.CONTROLS/ListView/resources/EditInPlaceHoverController/EditInPlaceHoverController', 'SBIS3.CONTROLS/ListView/resources/EditInPlaceClickController/EditInPlaceClickController']);
            }
            if (typeof this._options.pageSize === 'string') {
               this._options.pageSize = this._options.pageSize * 1;
            }
            if (this._isSlowDrawing(this._options.easyGroup)) {
               this.setGroupBy(this._options.groupBy, false);
            }
            if (this._options.scrollPaging) {
               this._pagingZIndex = WindowManager.acquireZIndex();
               WindowManager.setVisible(this._pagingZIndex);
            }
            if (this._options.virtualScrolling || this._options.scrollPaging || this.isInfiniteScroll()) {
               this._getScrollWatcher().subscribe('onScroll', this._onScrollHandler);
            }
            if(this.isInfiniteScroll()) {
               this._prepareInfiniteScroll();
            }
            if (this.getItems() && this._isCursorNavigation()) {
               this._listNavigation.analyzeResponseParams(this.getItems());
            }
            ListView.superclass.init.call(this);
            this._initLoadMoreButton();
         },

         setItems: function(items) {
            //Когда используется навигация по курсорам, надо иницировать контроллер навигации данными переданного рекордсета, чтобы следующий запрос за даныыми отправился с правильными параметрами
            if (items && this._isCursorNavigation() && this._listNavigation) {
               this._listNavigation.analyzeResponseParams(items);
            }
            this._observeResultsRecord(false);
            ListView.superclass.setItems.apply(this, arguments);
         },


         _initVirtualScrolling: function(){
            this._virtualScrollController = new VirtualScrollController({
               view: this,
               projection: this._getItemsProjection(),
               viewport: this._getScrollWatcher().getScrollContainer(),
               viewContainer: this.getContainer(),
               itemsContainer: this._getItemsContainer()
            });

            this._topWrapper = $('.controls-ListView__virtualScrollTop', this.getContainer());
            this._bottomWrapper = $('.controls-ListView__virtualScrollBottom', this.getContainer());

            this.subscribeTo(this._virtualScrollController, 'onWindowChange', this._onVirtualScrollWindowChange.bind(this));
         },

         _onVirtualScrollWindowChange: function(event, config) {
            var itemsToAdd = [],
               itemsToRemove = [],
               addPosition = config.addPosition,
               prevDomNode,
               item;
            for (var i = config.add[0]; i <= config.add[1]; i++) {
               item = this._getItemsProjection().at(i);
               if (item) {
                  itemsToAdd.push(item);
               }
            }
            for (var i = config.remove[0]; i <= config.remove[1]; i++) {
               item = this._getItemsProjection().at(i);
               if (item) {
                  itemsToRemove.push(item);
               }
            }

            // Если есть добавление по месту в начале списка, то надо добавлять записи после него,
            // а не самом начале контейнера
            var editingTr = this._isAddAtTop();
            if (editingTr && addPosition === 0) {
               addPosition += 1;
               prevDomNode = editingTr;
            }
            this._addItems(itemsToAdd, addPosition, prevDomNode);

            // Оживляем компоненты после отрисовки виртуальным скролом
            if (this._revivePackageParams.revive !== false) {
               this._reviveItems(this._revivePackageParams.light, true);
            }
            this._revivePackageParams.processed = true;

            if(this._options.itemsActionsInItemContainer && itemsToRemove.length && this._itemsToolbar && this._itemsToolbar.isVisible()){
               this._itemsToolbar.hide();
            }
            this._removeItemsLight(itemsToRemove);

            //После добавления элоементов с помощью виртуального скролла, необходимо добавить на них выделение,
            //если они до этого были выделены.
            this._drawSelectedItems(this._options.selectedKeys, {});

            this._topWrapper.get(0).style.height = config.topWrapperHeight + 'px';
            this._bottomWrapper.get(0).style.height = config.bottomWrapperHeight + 'px';
            if (this._virtualScrollResetStickyHead) {
               this._notifyOnSizeChanged();
               this._virtualScrollResetStickyHead = false;
            }
         },

         _toggleEventHandlers: function(container, bind) {
            container[bind ? 'on' : 'off']('swipe tap mousemove mouseleave touchend taphold touchstart contextmenu mousedown mouseup', this._eventProxyHdl);
         },

         _addOptionsFromClass: function(opts, attrToMerge) {
            var
               classes = (attrToMerge && attrToMerge.class) || (opts.element && opts.element.className) || opts.className || '',
               params = [
                  { class: 'controls-small-ListView', optionName: 'isSmall', value: true, defaultValue: false },
                  { class: 'controls-ListView__disableHover', optionName: 'itemsHover', value: false, defaultValue: true },
                  { class: 'controls-ListView__pagerNoSizePicker', optionName: 'noSizePicker', value: true, defaultValue: false },
                  { class: 'controls-ListView__pagerNoAmount', optionName: 'noPagerAmount', value: true, defaultValue: false },
                  { class: 'controls-ListView__pagerHideEndButton', optionName: 'hideEndButton', value: true, defaultValue: false },
                  { class: 'controls-ListView__orangeMarker', optionName: 'showSelectedMarker', value: true, defaultValue: false },
                  { class: 'controls-ListView__outside-scroll-loader', optionName: 'outsideScroll', value: true, defaultValue: false },
                  { class: 'controls-ListView__showCheckboxes', optionName: 'showCheckboxes', value: true, defaultValue: false },
                  { class: 'controls-ListView__hideCheckboxes', optionName: 'hideCheckboxes', value: true, defaultValue: false}
               ];
            ConfigByClasses(opts, params, classes);
},

         _prepareClassesByConfig: function(cfg) {
            if (cfg.multiselect !== false) {
               cfg.preparedClasses = ' controls-ListView__multiselect';
            } else {
               cfg.preparedClasses = ' controls-ListView__multiselect__off';
            }
            if (cfg._serverRender) {
               cfg.preparedClasses = ' controls-ListView__dataLoaded';
            } else {
               cfg.preparedClasses = ' controls-ListView__dataNotLoaded';
            }
         },

         _modifyOptions : function(opts, parsedOptions, attrToMerge){
            var lvOpts = ListView.superclass._modifyOptions.apply(this, arguments);
            this._addOptionsFromClass(lvOpts, attrToMerge);
            this._prepareClassesByConfig(lvOpts);
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
            if(lvOpts.selectedKey && lvOpts._itemData) {
               lvOpts._itemData.selectedKey = lvOpts.selectedKey;
            }
            // в IE размещать "операции над записью" внутри строки нельзя
            // т.к. в IE td не растягивается на высоту строки
            // поэтому когда первый столбец получается многострочным, то последний занимает изначальную ширину
            // и визуально получается, что тулбар прибит к верху и смещен
            lvOpts.itemsActionsInItemContainer = !cDetection.isIE ? lvOpts.itemsActionsInItemContainer : false;
            return lvOpts;
         },

         _getElementToFocus: function() {
            return $('.controls-ListView__fakeFocusElement', this._container).first();
         },

         /* Переопределяю метод из Control.compatible.js
            _isAcceptKeyEvents: function(){
               return this.isEnabled();
            }
            необходимо чтобы работала обработка нажатия клавиш даже в задизейбленом состоянии. */
         _isAcceptKeyEvents: function() {
            return true;
         },

         _setTouchSupport: function(support) {
            var currentTouch = this._touchSupport;
            this._touchSupport = Boolean(support);

            if(this._itemsToolbar) {
               this._setTouchMode(this._touchSupport);
            } else if(currentTouch !== this._touchSupport) {
                this._toggleTouchClass();
            }
         },

         _setTouchMode: function(touchSupport){
            /* При таче, можно поменять вид операций,
             т.к. это не будет вызывать никаких визуальных дефектов,
             а просто покажет операции в тач моде */
             if( this._itemsToolbar.getProperty('touchMode') !== touchSupport &&
                 /* Когда тулбар зафиксирован, не меняем вид операций */
                 !this._itemsToolbar.isToolbarLocking()
             ) {
                 this._toggleTouchClass(touchSupport);
                 this._itemsToolbar.setTouchMode(touchSupport);
             }
         },

         _toggleTouchClass: function(touchSupport) {
            var container = this.getContainer();
            container.toggleClass('controls-ListView__touchMode', touchSupport);
         },

         _eventProxyHandler: function(e) {
            var self = this,
                originalEvent = e.originalEvent,
                mobFix = 'controls-ListView__mobileSelected-fix',
                isTouchEvent = originalEvent ? ((!originalEvent.movementX && !originalEvent.movementY && constants.compatibility.touch && (originalEvent.touches || constants.browser.isMobilePlatform)) || (originalEvent.sourceCapabilities && originalEvent.sourceCapabilities.firesTouchEvents)) : true;


            switch (e.type) {
               case 'mousemove':
                  self._allowMouseMoveEvent && !isTouchEvent && this._mouseMoveHandler(e);
                  break;
               case 'touchstart':
                  this._touchstartHandler(e);
                  // На windows 10 планшетах между touch-событиями прилетают события мыши
                  // поэтому на секунду игнорируем mouseMove событие т.к. произошло касание и мыши быть не может
                  if(self._allowMouseMoveEvent && !constants.browser.isMobileIOS) {
                     self._allowMouseMoveEvent = false;
                     setTimeout(function () {
                        self._allowMouseMoveEvent = true;
                     }, 1000);
                  }
                  break;
               case 'swipe':
                  this._swipeHandler(e);
                  break;
               case 'tap':
                  this._tapHandler(e);
                  break;
               case 'mouseleave':
                  if (!isTouchEvent) {
                     this._mouseLeaveHandler(e);
                  }
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
               case 'contextmenu':
                  this._contextMenuHandler(e);
                  /* Выставляем этот флаг, чтобы не было имитации клика (см. метод _onActionHandler в Control.module.js).
                     Сейчас проблема в том, что при клике двумя пальцами на touch устройствах событие contextmenu срабатывает,
                     а click нет, поэтому в методе _onActionHandler происходит имитация клика, которая при срабатывании события contextmenu не нужна. */
                  this._clickState.detected = true;
                  break;
               case 'mousedown':
                  this._mouseDownHandler(e);
                  break;
               case 'mouseup':
                  this._mouseUpHandler(e);
                  break;
            }
         },

         _createScrollPager: function(){
            var scrollContainer = this._scrollWatcher.getScrollContainer(),
               scrollPagerContainer = $('> .controls-ListView__scrollPager', this._container);
            this._scrollPager = new Paging({
               noSizePicker: this._options.noSizePicker,
               noPagerAmount: this._options.noPagerAmount,
               element: scrollPagerContainer,
               visible: false,
               showPages: false,
               idProperty: 'id',
               mode: (this._options.navigation && this._options.navigation.lastPage) ? 'full' : 'part',
               parent: this,
               tabindex: 0 // чтобы не принимал фокус по табу
            });
            // TODO: То, что ListView знает о компонентах в которые он может быть вставленн и то, что он переносит свои
            // контенеры в контенеры родительских компонентов является хаком. Подумать как изменить архитектуру
            // работы с пэйджером что бы избавится от этого.
            if (this._inScrollContainerControl) {
              scrollPagerContainer.appendTo(scrollContainer.parent());
            } else {
               scrollPagerContainer.addClass('controls-ListView__scrollPager_fixed');
               if (constants.browser.isMobilePlatform) {
                    // скролл может быть у window, но нельзя делать appendTo(window)
                    // На скролируемых областях на мобильных платормах висит transform: translate3d(0,0,0);.
                    // Он создает новую систему координат внутри себя. position: fixed начинает работать относительно
                    // этого контенера а не относительно вьюпорта. По этому выносим пэйджер за пределы скролируемой области.
                    scrollContainer = (scrollContainer[0] == window || scrollContainer.is('body')) ? $('body') : scrollContainer.parent();

                    scrollPagerContainer.appendTo(scrollContainer);
                }
            }
            this._setScrollPagerPosition();
            this.subscribeTo(this, 'onAfterVisibilityChange', this._onVisibleChange);
            this._scrollBinder = new ComponentBinder({
               view: this,
               pagingZIndex: this._pagingZIndex
            });
            // Создаем пейджинг скрытым если включено сохранение позиции при reload, но сам пейджинг выключен
            // Так как для сохранения страницы все равно нужекн расчет страниц скролла
            var hiddenPager = !this._options.scrollPaging && this._options.saveReloadPosition;
            this._scrollBinder.bindScrollPaging(this._scrollPager, hiddenPager);

            if (!this._inScrollContainerControl) {
               // Отлавливаем изменение масштаба
               // Когда страница увеличена на мобильных платформах или если на десктопе установить ширину браузера меньше 1024рх,
               // то горизонтальный скрол(и иногда вертикальный) происходит внутри window.
               $(window).on('resize scroll', this._setScrollPagerPositionThrottled);
            }

            this._scrollBinder._updateScrollPages(!this._options.virtualScrolling || this._resetPaging);
         },

         _onVisibleChange: function(event, visible){
            if (this._scrollPager) {
               // покажем если ListView показалось, вместе с родителями, и есть страницы и скроем если скрылось
               this._scrollPager.setVisible(this.isVisibleWithParents() && visible && this._scrollPager.getPagesCount() > 1);
            }
            if (this._scrollBinder) {
               this._scrollBinder.freezePaging(!visible);
            }
         },

         _onScrollHandler: function(event, scrollTop){
            var itemActions = this.getItemsActions();
            if (this.isVisible() && itemActions && itemActions.isItemActionsMenuVisible()){
               itemActions.hide();
            }
            if (this._virtualScrollController) {
               var scrollbarDragging = false;
               try {
                  scrollbarDragging = this._getScrollWatcher().getScrollContainerControl().isScrollbarDragging();
               } catch(e) {}

              this._virtualScrollController._scrollHandler(event, scrollTop, scrollbarDragging);
            }
            this._scrollUpIndicator = true;
         },
         _setScrollPagerPosition: function(){
            var right;
            // Если таблица находится в SBIS3.CONTROLS/ScrollContainer, то пейджер находится в его скролируемом
            // контенере и спозиционирован абсолютно и пересчет позиции не требуется.
            if (!this._inScrollContainerControl) {
               // На ios на маленьком зуме все нормально. На большом - элементы немного смещаются,
               // и смещение зависит от положения скрола и от зума. Это не ошибка расчета, а баг(фича?) ipad.
               // Смещены элементы со стилем right: 0 и bottom: 0. На небольшом зуме этого смещения нет.
               right = window.innerWidth - this.getContainer().get(0).getBoundingClientRect().right;
               this._scrollPager.getContainer().css('right', right);
            }
         },
         _onKeyUpEnter: function(e) {
            var
               selectedKey = this.getSelectedKey();
            if (selectedKey !== undefined && selectedKey !== null) {
               var selectedItem = $("[data-id='" + selectedKey + "']", this._getItemsContainer());
               this._elemClickHandler(selectedKey, this.getItems().getRecordById(selectedKey), selectedItem.get(0), e);
            }
         },
         _keyboardHover: function(e) {
            var
               selectedKeys,
               selectedKey = this.getSelectedKey(),
               scrollPager = this._scrollPager,
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
                  this._onKeyUpEnterThrottled(e);
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
               case constants.key.pageUp:
                  if (scrollPager) {
                     scrollPager._goToPrev();
                  }
                  break;
               case constants.key.pageDown:
                  if (scrollPager && scrollPager.getPagesCount() > scrollPager.getSelectedKey()) {
                     scrollPager._goToNext();
                  }
                  break;

            }
            if (newSelectedItem && newSelectedItem.length) {
               newSelectedKey = newSelectedItem.data('id');
               this.setSelectedKey(newSelectedKey);
               this._scrollToItem(newSelectedKey, e.which === constants.key.down);
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
            //Не нужно проверять на видимость операции удаления, т.к. выделена одна запись, а курсор может находиться над другой.
            //И при наведении на другую запись, прикладники могут скрыть операцию удаления, и тогда hotkey не отработает.
            return this.isEnabled() && !!delInstance;
         },
         /**
          * Возвращает следующий элемент
          * @param id - ключ записи
          * @returns {jQuery}
          */
         getNextItemById: function (id) {
            return this._getSiblingItemById(id, 'getNext');
         },
         /**
          * Возвращает предыдущий элемент
          * @param id
          * @returns {jQuery}
          */
         getPrevItemById: function (id) {
            return this._getSiblingItemById(id, 'getPrevious');
         },

         _getSiblingItemById: function(id, method) {
            var projection = this._getItemsProjection();
            var projItem = projection[method](
               projection.getItemBySourceItem(
                  this.getItems().getRecordById(id)
               )
            );
            if (projItem) {
               return this._getDomElementByItem(projItem);
            }
         },

         _getNextItemByDOM: function(id) {
            return this._getHtmlItemByDOM(id, true);
         },

         _getPrevItemByDOM: function(id) {
            return this._getHtmlItemByDOM(id, false);
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
            var items = this._getChildrenDOMItems(),
               recordItems = this.getItems(),
               recordIndex = recordItems.getIndexByValue(recordItems.getIdProperty(), id),
               itemsProjection = this._getItemsProjection(),
               index,
               isRootId = function(id) {
                  //корень может отображаться даже если его нет в рекордсете
                  return (itemsProjection.getRoot &&
                     itemsProjection.getRoot() &&
                     itemsProjection.getRoot().getContents() &&
                     itemsProjection.getRoot().getContents().get &&
                     itemsProjection.getRoot().getContents().get(recordItems.getIdProperty()) == id);
               },
               siblingItem;
            if (!!itemsProjection.getCount()) {
               index = recordIndex !== -1 ? items.index(this._getDomElementByItem(itemsProjection.getItemBySourceIndex(recordIndex))) : -1;
            }
            if (index === -1 && typeof id !== 'undefined' && isRootId(id)) {
               index = 0;
            }
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

            if (siblingItem && siblingItem.data('id') !== id) {
               return this.getItems().getRecordById(siblingItem.data('id')) || isRootId(siblingItem.data('id')) ? siblingItem : this._getHtmlItemByDOM(siblingItem.data('id'), isNext);
            }
         },

         _getChildrenDOMItems: function() {
            return this._getItemsContainer().children('.js-controls-ListView__item').not('.ws-hidden, .controls-editInPlace');
         },

         _isViewElement: function (elem) {
            return  contains(this._getItemsContainer()[0], elem[0]);
         },
         _onClickHandler: function(e) {
            ListView.superclass._onClickHandler.apply(this, arguments);
            var $target = $(e.target),
                target = this._findItemByElement($target),
                model, $group;

            if (target.length) {
               model = this._getItemsProjection().getByHash(target.data('hash')).getContents();
               this._elemClickHandler(model.getId(), model, e.target, e);
            }
            if (this._options.multiselect && $target.length && $target.hasClass('controls-DataGridView__th__checkBox')){
               $target.hasClass('controls-DataGridView__th__checkBox__checked') ? this.setSelectedKeys([]) :this.setSelectedItemsAll();
               $target.toggleClass('controls-DataGridView__th__checkBox__checked');
            }
            if (this._options.groupBy && !isEmpty(this._options.groupBy) && this._options.groupBy.clickHandler instanceof Function) {
               var closestGroup = $target.closest('.controls-GroupBy', this._getItemsContainer());
               if (closestGroup.length) {
                  this._options.groupBy.clickHandler.call(this, $target);
               }
            }
            if (!isEmpty(this._options.groupBy) && this._options.easyGroup && $(e.target).hasClass('controls-GroupBy__separatorCollapse')) {
               var idGroup = $(e.target).closest('.controls-GroupBy').attr('data-group');
               // Если не найдены дочерние элементы для группы с string-идентификатором - используем числовой groupId
               // https://online.sbis.ru/opendoc.html?guid=9fbc33ab-11bf-4192-a57e-b9b75770d2b2
               if (this._options._itemsProjection.getGroupItems(idGroup).length === 0) {
                  idGroup = parseFloat(idGroup, 2);
               }
               this.toggleGroup(idGroup);
               if ($target.closest('.controls-ListView').parent().hasClass('ws-sticky-header__header-container')) {
                  $group = this._getItemsContainer().find('.controls-GroupBy[data-group="' + idGroup + '"]');
                  if (this._isGroupCollapsed(idGroup)) {
                     this._getScrollWatcher().scrollToElement($group);
                  } else {
                     this._getScrollWatcher().scrollToElement($group.next());
                  }
               }
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
            if(this._hasHoveredItem()) {
               var oldHoveredItem = this.getHoveredItem().container;
               oldHoveredItem.removeClass('controls-ListView__hoveredItem');
            }
            if(this._options.itemsHover && !target.hasClass('controls-EditAtPlace')) {
               target.addClass('controls-ListView__hoveredItem');
            }

            this._hoveredItem = this._getElementData(target);
            this._notifyOnChangeHoveredItem();
         },

         _updateHoveredItemAfterRedraw: function() {
            var hoveredItem = this.getHoveredItem(),
                hoveredItemContainer = hoveredItem.container,
                itemsProjection = this._getItemsProjection(),
                containsHoveredItem, hash, projItem;

            /* !Производить обновление операций надо синхронно, иначе они будут моргать. */

            /* Если после перерисовки выделенный элемент удалился из DOM дерава,
             то событие mouseLeave не сработает, поэтому вызовем руками метод,
             если же он остался, то обновим положение кнопки опций. */
            if(hoveredItemContainer){
               containsHoveredItem = contains(this._getItemsContainer()[0], hoveredItemContainer[0]);

               if(!containsHoveredItem && hoveredItemContainer) {
                  /*TODO сейчас зачем то в ховеред итем хранится ссылка на DOM элемент
                   * но этот элемент может теряться в ходе перерисовок. Выписана задача по которой мы будем
                   * хранить только идентификатор и данный код станет не нужен*/
                  hash = hoveredItemContainer.attr('data-hash');
                  if(itemsProjection) {
                     projItem = itemsProjection.getByHash(hash);
                  }
                  /* Если в проекции нет элемента и этого элемента нет в DOM'e,
                   но на него осталась jQuery ссылка, то надо её затереть */
                  if (projItem) {
                     hoveredItemContainer = this._getDomElementByItem(projItem);
                  } else {
                     hoveredItemContainer = null;
                  }
               }

               if(!containsHoveredItem) {
                  if(!hoveredItemContainer || !hoveredItemContainer.length) {
                     this._mouseLeaveHandler();
                  } else {
                     this._updateHoveredItem(hoveredItemContainer);
                  }
               } else {
                  /* Даже если контейнер выбранной записи не изменился,
                   надо обновить выделнный элемент, т.к. могло измениться его положение */
                  this._updateHoveredItem(hoveredItemContainer);
               }
            }else {
               if(this._itemsToolbar && this._itemsToolbar.isVisible()){
                  this._itemsToolbar.hide();
               }
            }
         },

         _getRecordElemByItem : function(item) {
            //FIXME т.к. строка редактирования по местру спозиционирована абсолютно, то надо искать оригинальную строку
            return this._getItemsContainer().find('.js-controls-ListView__item[data-hash="' + item.getHash() + '"]:not(.controls-editInPlace)')
         },

         _getElementData: function(target) {
            if (target.length){
               var cont = this._container[0],
                  targetKey = target[0].getAttribute('data-id'),
                  targetHash = target[0].getAttribute('data-hash'),item = this.getItems() ? this.getItems().getRecordById(targetKey) : undefined,
                  projItem = this._options._itemsProjection ? this._options._itemsProjection.getItemBySourceItem(item) : null,
                  correctTarget = target.hasClass('controls-editInPlace') && projItem ? this._getDomElementByItem(projItem) : target;

               //В некоторых версиях 11 IE не успевает рассчитаться ширина узла, вследствие чего correctTarget.offsetWidth == 0
               //Это вызывает неправильное позиционирование тулбара
               if (cDetection.isIE) {
                  correctTarget.width();
               }

               return {
                  key: targetKey,
                  record: item,
                  container: correctTarget,
                  get position() {
                     // если контейнера нет в DOM'e, то getBoundingClientRect в IE вызовет ошибку
                     var fakeTarget = {
                           top: 0,
                           left: 0
                        },
                        containerCords =  cont.getBoundingClientRect(),
                        targetCords = cDetection.isIE10 && !correctTarget.width() ? fakeTarget: correctTarget[0].getBoundingClientRect();
                  return {
                        /* При расчётах координат по вертикали учитываем прокрутку
                         * округлять нельзя т.к. в IE координаты дробные и из-за этого происходит смещение "операций над записью"
                         */
                         top: targetCords.top - containerCords.top + cont.scrollTop,
                         left: targetCords.left - containerCords.left
                     };
                  },
                  set position(value) {
                  },
                  get size() {
                     var targetSizes = correctTarget[0].getBoundingClientRect();

                     return {
                         height: targetSizes.height,
                         width: targetSizes.width
                     };
                  },
                  set size(value) {
                  }
               };
            }
         },

         _notifyOnChangeHoveredItem: function() {
            this._notify('onChangeHoveredItem', this._hoveredItem);
            this._onChangeHoveredItem(this._hoveredItem);
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

            if (hoveredItem && hoveredItem.container === null) {
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
                      if(this._itemsToolbar && this._itemsToolbar.getTouchMode()) {
                          // ситуация, когда при смене выделенного элемента тулбар находится в тач режиме может возникнуть на планшетах и устройствах с zinFrame
                          // необходимо выставить высотку тулбара, т.к. высота строки может измениться
                          this._itemsToolbar.setHeightInTouchMode();
                      }
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

         _contextMenuHandler: function(event){
            var itemsActions = this.getItemsActions(),
                align = {
                   verticalAlign: {
                      side: 'top',
                      offset: event.pageY
                   },
                   horizontalAlign: {
                      side: 'left',
                      offset: event.pageX
                   }
                };

            if(this._needShowContextMenu(event)) {
               if (!this._checkItemAction()) {
                     event.preventDefault();
                     itemsActions.showItemActionsMenu(align);
               } else {
                  IoC.resolve('ILogger').info('ItemActionsGroup:', "Опция caption не задана у одного из элементов, для отображения контекстного меню укажите опцию");
               }
               (this._hoveredItem && this._hoveredItem.container) && event.stopPropagation();
            }
         },

         _needShowContextMenu: function (event) {
            var itemsActions = this.getItemsActions();

            return this._options.contextMenu
                && itemsActions
                && itemsActions.hasVisibleActions()
                && this._needProcessMouseEvent(event)
                && this._hoveredItem
                && this._hoveredItem.container
                && !this._hoveredItem.container.hasClass('controls-editInPlace__editing')
                && LocalStorageNative.getItem('controls-ListView-contextMenu') !== 'false'
                // при клике по ссылке необходимо показывать стандартное меню,
                // т.к. иначе ломаем привычное для пользователя поведение
                && event.target.nodeName.toLowerCase() !== 'a'
                && event.target.className.indexOf('LinkDecorator__image') === -1
         },

         /*
          * Метод проверяющий элементы операции над записью на не указанную опцию caption
          */
         _checkItemAction: function() {
            var itemsActions = this.getItemsActions(),
                result = false;

            itemsActions.getItems().each(function(item){
               if(!item.get('caption')){
                  result = true;
               }
            });

            return result;
         },

         _mouseDownHandler: function(event){
           if(this._itemsToolbar && event.button === 2){
              var itemsActions = this.getItemsActions();
              if(itemsActions && itemsActions.isItemActionsMenuVisible()) {
                 // необходимо скрывать операции над записью при клике правой кнопкой мыши, т.к. иначе операции мигают
                 this._itemsToolbar.getContainer().addClass('controls-ItemsToolbar__hidden');
              }
           }
         },

         _mouseUpHandler: function(event){
            if(this._itemsToolbar && event.button === 2){
               this._itemsToolbar.getContainer().removeClass('controls-ItemsToolbar__hidden');
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
            this._getEmptyDataContainer().empty().html(Sanitize(html, {validNodes: {component: true}, validAttributes : {config: true} }));
            //когда меняют emptyHTML надо оживить компоненты, но не надо потом вызывать всякие события drawItems и прочие методы, отдаем второй арумент silent
            this._reviveItems(false, true);
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
                afterHandleClickResult = forAliveOnly(function(result) {
                   if (result !== false) {
                      if(needSelect) {
                         //todo https://online.sbis.ru/opendoc.html?guid=0d1c1530-502c-4828-8c42-aeb330c014ab&des=
                         if (this._options.loadItemsStrategy == 'append') {
                            var tr = this._findItemByElement($(target));
                            if (tr.length) {
                               var hash = tr.attr('data-hash');
                               var index = this._getItemsProjection().getIndex(this._getItemsProjection().getByHash(hash));
                               self.setSelectedIndex(index);
                            }
                         }
                         else {
                            if(self._touchSupport && this.getHoveredItem().key !== id) {
                               /* Клик по записи отличной от текущей засвайпленой
                                  на touch устройствах должен скрывать ховер и операции. */
                               self._mouseLeaveHandler();
                            }
                            self.setSelectedKey(id);
                         }
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
            this.toggleItemsSelection([this._getItemsProjection().getByHash(target.closest('.controls-ListView__item').attr('data-hash')).getContents().getId()]);
         },

         _elemClickHandlerInternal: function (data, id, target, e) {
            /* Клик по чекбоксу не должен вызывать активацию элемента */
            if(!$(target).hasClass('js-controls-ListView__itemCheckBox')) {
               this._activateItem(id);
            }
         },
         //TODO: Временное решение для выделения "всех" (на самом деле первой тысячи) записей
         setSelectedAll: function() {
            var MAX_SELECTED = 1000;
            var
               result,
               self = this,
               selectedItems = this.getSelectedItems();
            if (this.isInfiniteScroll() && this.getItems().getCount() < MAX_SELECTED && this.getItems().getMetaData().more){
               result = this._loadFullData.apply(this, arguments)
                  .addCallback(function(dataSet) {
                     //Ввостановим значение _limit, т.к. после вызова reload _limit стал равен MAX_SELECTED,
                     //и следующие страницы будут грузиться тоже по MAX_SELECTED записей
                     this._limit = this._options.pageSize;
                     this._scrollOffset.bottom = MAX_SELECTED - this._limit;
                     //Очистим selectedItems чтобы при заполнении новыми элементами, не делать проверку на наличие элементов в коллекции
                     if (selectedItems && selectedItems.getCount()) {
                        selectedItems.clear();
                     }
                      this.setSelectedItemsAll.call(this);
                     if (dataSet.getCount() == MAX_SELECTED && dataSet.getMetaData().more){
                        require(['SBIS3.CONTROLS/Utils/InformationPopupManager'], function(InformationPopupManager) {
                           InformationPopupManager.showMessageDialog({
                              status: 'default',
                              opener: self,
                              message: rk('Отмечено 1000 записей, максимально допустимое количество, обрабатываемое системой СБИС.')
                           });
                        });
                     }
                  }.bind(this));
            } else {
               this.setSelectedItemsAll.call(this);
               result = Deferred.success();
            }
            return result;
         },

         _loadFullData: function() {
            return this.reload(this.getFilter(), this.getSorting(), 0, 1000);
         },

         _drawSelectedItems: function (idArray, changes) {
            function findElements(ids, itemsContainer, cfg) {
               var elements = $([]), elem;
               for (i = 0; i < ids.length; i++) {
                  //сначала ищем непосредственно в контейнере, чтоб не найти вложенные списки
                  //TODO переделать при отказе от data-id
                  if ((ids[i] + '').indexOf('\'') < 0) {
                     elem = itemsContainer.children(".controls-ListView__item[data-id='" + ids[i] + "']");
                  }
                  else {
                     elem = itemsContainer.children('.controls-ListView__item[data-id="' + ids[i] + '"]');
                  }
                  if (elem.length) {
                     //todo https://online.sbis.ru/opendoc.html?guid=0d1c1530-502c-4828-8c42-aeb330c014ab&des=
                     if (cfg.loadItemsStrategy == 'append') {
                        elem.each(function(i, item){
                           elements.push(item);
                        })
                     }
                     else {
                        elements.push(elem.get(0));
                     }
                  }
                  else {
                     //если не нашли, то ищем глубже. Это может потребоваться например для пликти, где элементы лежат в нескольких контейнерах
                     //TODO переделать при отказе от data-id
                     if ((ids[i] + '').indexOf('\'') < 0) {
                        elem = itemsContainer.find(".controls-ListView__item[data-id='" + ids[i] + "']");
                     }
                     else {
                        elem = itemsContainer.find('.controls-ListView__item[data-id="' + ids[i] + '"]');
                     }
                     if (elem.length) {
                        elements.push(elem.get(0));
                     }
                  }
               }
               return elements;
            }

            var i, itemsContainer = this._getItemsContainer();
            //Если точно знаем что изменилось, можем оптимизировать отрисовку
            if (changes && !isEmpty(changes)) {
               var rmKeyItems, addKeyItems;
               addKeyItems = findElements(changes.added, itemsContainer, this._options);
               rmKeyItems = findElements(changes.removed, itemsContainer, this._options);
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
               $(".controls-ListView__item", this._getItemsContainer())
                  .removeClass('controls-ListView__item__selected')
                  .removeClass('controls-ListView__item__selected__withMarker');
               //В случае добавления по месту, добавляемой записи в проекции нет, поэтому будем искать её в вёрстке прямо по id
               if (this._isAdd() && index === -1) {
                  this._addSelectedClasses(undefined, id);
               } else if (this._getItemsProjection()) {
                  var projItem = this._getItemsProjection().at(index);
                  if (projItem) {
                     this._addSelectedClasses(projItem.getHash());
                  }
               }
            }
         },

         _addSelectedClasses: function(hash, id) {
            var curSelected;
            if (hash) {
               curSelected = $('.controls-ListView__item[data-hash="' + hash + '"]', this._container);
            } else {
               curSelected = $('.controls-ListView__item[data-id="' +  (id === undefined ? '' : id) + '"]', this._container);
            }
            curSelected.addClass('controls-ListView__item__selected');
            if (this._options.showSelectedMarker) {
               curSelected.addClass('controls-ListView__item__selected__withMarker');
            }
         },
          
         /**
          * Перезагружает набор записей представления данных с последующим обновлением отображения.
          * @remark
          * Производится запрос на выборку записей из источника данных по установленным параметрам:
          * <ol>
          *    <li>Параметры фильтрации, которые устанавливают с помощью опции {@link SBIS3.CONTROLS/Mixins/ItemsControlMixin#filter}.</li>
          *    <li>Параметры сортировки, которые устанавливают с помощью опции {@link SBIS3.CONTROLS/Mixins/ItemsControlMixin#sorting}.</li>
          *    <li>Порядковый номер записи в источнике, с которого будет производиться отбор записей для выборки. Устанавливают с помощью метода {@link SBIS3.CONTROLS/Mixins/ItemsControlMixin#setOffset}.</li>
          *    <li>Масимальное число записей, которые будут присутствовать в выборке. Устанавливают с помощью метода {@link SBIS3.CONTROLS/Mixins/ItemsControlMixin#pageSize}.</li>
          * </ol>
          * Вызов метода инициирует событие {@link SBIS3.CONTROLS/Mixins/ItemsControlMixin#onBeforeDataLoad}. В случае успешной перезагрузки набора записей происходит событие {@link SBIS3.CONTROLS/Mixins/ItemsControlMixin#onDataLoad}, а в случае ошибки - {@link SBIS3.CONTROLS/Mixins/ItemsControlMixin#onDataLoadError}.
          * Если источник данных не установлен, производит перерисовку установленного набора данных.
          * @return {Deferred}
          * @example
          * <pre>
          *    btn.subscribe('onActivated', function() {
          *       DataGridViewBL.reload();
          *    });
          * </pre>
          */
         reload: function (filter, sorting, offset, limit, deepReload, resetPosition) {
            // todo Если возникнет желание поддержать опциюsaveReloadPositionв плоском списке, то делать это здесь
            
            if (offset === 0) {
               this._lastPageLoaded = false;
               this._scrollOffset.top = offset;
               this._scrollOffset.bottom = offset;

               if (this._options.infiniteScroll === 'down') {
                   this._setInfiniteScrollState('down');
               }
            }
            // Reset virtual scrolling if it's enabled
            if (this._options.virtualScrolling && this._virtualScrollController) {
               this._virtualScrollController.disableScrollHandler(true);
               this.scrollToFirstPage();
               // Will reset pages after redrawing items
               this._resetPaging = true;
            }

            // Убираем распорки даже когда опция вирт скроллинга отключена
            // При начале поиска мы отключаем вирт скролл, но при этом распорки все равно надо убрать
            if (this._topWrapper && this._bottomWrapper) {
               this._topWrapper.height(0);
               this._bottomWrapper.height(0);
            }

            this._reloadInfiniteScrollParams(offset);
            this._previousGroupBy = undefined;
            this._scrollUpIndicator = false;
            // При перезагрузке нужно также почистить hoveredItem, иначе следующее отображение тулбара будет для элемента, которого уже нет (ведь именно из-за этого ниже скрывается тулбар).
            this._clearHoveredItem();
            this._unlockItemsToolbar();
            this._hideItemsToolbar();
            this._destroyEditInPlace();
            this._observeResultsRecord(false);
            return ListView.superclass.reload.apply(this, arguments);
         },
         /**
          * Необходимо для того, что бы перезагружать список в той же позиции до которой доскролили
          * @return {Number} оффсет, который будет отправлен в запросе для reload
          */
         _getReloadOffset: function(){
            return this._limit * this._getCurrentPage();
         },
         /**
          * Возвращает страницу навигации, до которой досткролили
          */
         _getCurrentPage: function() {
            var page = 0;
            if (this._scrollBinder) {
               var scrollPage, pagesCount, average, commonItemsCount, firstPageElemIndex;
               scrollPage = this._scrollBinder._getScrollPage();
               pagesCount = this._scrollPager.getPagesCount() || 1;//paging мог ещё не отобразиться и pagesCount будет null
               commonItemsCount = this._getItemsProjection() ? this._getItemsProjection().getCount() : 0;
               average = commonItemsCount / pagesCount;
               firstPageElemIndex = (scrollPage - 1) * average;

               page = scrollPage ? Math.ceil(firstPageElemIndex / this._limit) : 0;
            }
            // прибавим к полученой странице количество еще не загруженных страниц
            return page + Math.floor((this._scrollOffset.top) / this._limit);
         },
         setElemClickHandler: function (method) {
            this._options.elemClickHandler = method;
         },
         redrawItem: function(item) {
            ListView.superclass.redrawItem.apply(this, arguments);
            //TODO: Временное решение для .100.  В .30 состояния выбранности элемента должны добавляться в шаблоне.
            this._drawSelectedItems(this.getSelectedKeys());
            this._drawSelectedItem(this.getSelectedKey(), this.getSelectedIndex());
            this._updateHoveredItemAfterRedraw();
         },
         _redrawItems: function(){
            ListView.superclass._redrawItems.apply(this, arguments);
            // После полной перерисовки нужно заново инициализировать вирутальный скролинг
            if (this._options.virtualScrolling && this._virtualScrollController) {
               this.scrollToFirstPage();
               this._virtualScrollController.updateProjection(this._getItemsProjection());
               this._virtualScrollController.reset();
            }
         },
         /**
          * Проверить наличие скрола, и догрузить еще данные если его нет
          * @return {[type]} [description]
          */
         scrollLoadMore: function(){
            if (this._options.infiniteScroll && this._scrollWatcher && !this._scrollWatcher.hasScroll()) {
               this._scrollLoadNextPage(this._options.infiniteScroll);
            }
         },
         //********************************//
         //   БЛОК РЕДАКТИРОВАНИЯ ПО МЕСТУ //
         //*******************************//
         toggleCheckboxes: function(toggle) {
            // Лучшего решения сейчас нет. Редактирование по месту позиционируется абсолютно и размеры свои менять не может.
            // При переключении видимости чекбоксов у таблицы меняются размеры и блок с редактированием позиционируется неправильно.
            this.cancelEdit();
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

         setActive: function() {
            var
               params = arguments;
            if (this.isEdit()) {
               this._getEditInPlace().addCallback(function(editInPlace) {
                  editInPlace.setActive.apply(editInPlace, params);
               });
            } else {
               ListView.superclass.setActive.apply(this, params);
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
               this._getEditInPlace().addCallback(function(editInPlace) {
                  editInPlace.setItems(this.getItems());
                  editInPlace.setItemsProjection(this._getItemsProjection());
               }.bind(this));
            }
            if (this._hasDragMove()) {
               this._getDragMove().setItemsProjection(this._getItemsProjection());
            }
            if (this._hasMover()) {
               this._getMover().setItems(this.getItems());
               this._getMover().setItemsProjection(this._getItemsProjection());
            }

         },
         beforeNotifyOnItemClick: function() {
            var handler = this._notifyOnItemClick;
            return function() {
               var
                  args = arguments,
                  self = this,
                  result = new Deferred();
               // https://inside.tensor.ru/opendoc.html?guid=b5d015f2-4724-4784-aee2-8be010625b41&des=
               // Согласно текущей реализации deferred'ов, подобный код кидает исключение:
               // var a = new Deferred(), b = new Deferred();
               // a.addCallback(function(){ return b });
               // a.callback();
               // b.addCallback(function(){});
               if (this._hasEditInPlace()) {
                  this._getEditInPlace().addCallback(function(editInPlace) {
                     editInPlace.commitEdit().addCallback(function() {
                        var
                           handlerRes = handler.apply(self, args);
                        if (handlerRes instanceof Deferred) {
                           handlerRes.addCallback(function(res) {
                              result.callback(res);
                           });
                        } else {
                           result.callback(handlerRes);
                        }
                     });
                  });
                  return result;
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
               this._destroyEditInPlaceController();
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
               this._getEditInPlace().addCallback(function(editInPlace) {
                  editInPlace.setEditingTemplate(template);
               });
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
            return this._canShowEip() ? this._getEditInPlace().addCallback(function(editInPlace) {
               return editInPlace.showEip(model, options, withoutActivateFirstControl);
            }) : Deferred.fail();
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
            this._destroyEditInPlaceController();
         },

         _canStartEditOnItemClick: function(target) {
            return !$(target).closest(NOT_EDITABLE_SELECTOR).length;
         },

         _startEditOnItemClick: function(event, id, model, target, originalEvent) {
            var
               result;
            if (this._canStartEditOnItemClick(target)) {
               result = this.showEip(model, { isEdit: true }, false);
               if (originalEvent.type === 'click') {
                  result.addCallback(function(res) {
                     // С IOS 11 версии перестал работать подскролл к нужному месту. Отключаем наш код, который при клике
                     // проваливается в редактор по месту, иначе вызывается неправильно работающий scrollIntoView и всё
                     // ломает: https://online.sbis.ru/opendoc.html?guid=742195a5-c89c-4af8-8121-cdeefa26959e
                     if (!constants.browser.isMobileIOS || cDetection.IOSVersion < 11) {
                        ImitateEvents.imitateFocus(originalEvent.clientX, originalEvent.clientY);
                     }
                     return res;
                  });
               }
               event.setResult(result);
            }
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
               this._getEditInPlace().addCallback(function(editInPlace) {
                  editInPlace.hide()
               });
            }
         },

         redraw: function () {
            /*TODO Косяк с миксинами - не вызывается before из decorableMixin временное решение*/
            if (this._options._decorators) {
               this._options._decorators.update(this);
            }
            // скрываем тулбар на время перерисовки т.к. если изменится количество элементов -> изменится размер таблицы,
            // то операции повиснут в воздухе до проверки в drawItemsCallback
            // синхронно пересчитывать позицию тулбара нельзя т.к это существенно увеличит время отрисовки
            this._hideItemsToolbar();
            //TODO: При перерисовке разрушаем редактор, иначе ItemsControlMixin задестроит все контролы внутри,
            //но не проставит все необходимые состояния. В .200 начнём пересоздавать редакторы для каждого редактирования
            //и данный код не понадобится.
            this._destroyEditInPlace();
            this._headIsChanged = true;
            this._redrawResults();
            if (this._scrollBinder) {
               this._scrollBinder.moreThanTwo(false);
            }
            ListView.superclass.redraw.apply(this, arguments);
         },

         _getEditInPlace: function() {
            if (this._hasEditInPlace()) {
               var
                  d = new Deferred();
               d.callback(this._editInPlace);
               return d;
            }
            return this._createEditInPlace();
         },

         _hasEditInPlace: function() {
            return !!this._editInPlace;
         },

         _createEditInPlace: function() {
            var
               self = this,
               result = new Deferred(),
               controller,
               moduleName = this._isHoverEditMode() ? 'SBIS3.CONTROLS/ListView/resources/EditInPlaceHoverController/EditInPlaceHoverController' : 'SBIS3.CONTROLS/ListView/resources/EditInPlaceClickController/EditInPlaceClickController';

            // Если процесс создания EIP запущен - то просто возвращаем результат деферреда создания
            if (this._createEditInPlaceDeferred) {
               this._createEditInPlaceDeferred.addCallback(function(editInPlace) {
                  result.callback(editInPlace);
                  return editInPlace;
               });
               return result;
            }

            // Если модуль редактирования по месту уже загружен - то просто создаем его экземпляр
            if (requireHelper.defined(moduleName)) {
               controller = requirejs(moduleName);
               result.callback(this._editInPlace = new controller(self._getEditInPlaceConfig()));
               return result;
            }

            // Если мы попали сюда, значит редактирование по месту ещё не создается, да и модуль ещё не загружен. Это нам и предстоит сделать.
            this._createEditInPlaceDeferred = new Deferred();
            requirejs([moduleName], function (controller) {
               self._createEditInPlaceDeferred.callback(self._editInPlace = new controller(self._getEditInPlaceConfig()));
               self._createEditInPlaceDeferred = undefined;
            });
            this._createEditInPlaceDeferred.addCallback(function(editInPlace) {
               result.callback(editInPlace);
               return editInPlace;
            });
            return result;
         },

         _toggleGroup: function(groupId, flag) {
            var
               self = this;
            // Завершаем редактирование по месту, если оно запущено в сворачиваемой группе
            // (https://online.sbis.ru/opendoc.html?guid=2e6d8922-a53d-45a9-bbfc-81c4f8b71f57)
            if (this.isEdit() && flag) { // Вот это поворот. flag === true, когда группа сворачивается.
               this._getEditInPlace().addCallback(function(editInPlace) {
                  var
                     editingRecord = editInPlace.getEditingRecord();
                  // Через проекцию группу элемента не выяснить, т.к. редактируемая запись может отсутствовать и в проекции и в рекордсете
                  if (self._options._prepareGroupId(editingRecord, self._options._getGroupId(editingRecord, self._options), self._options) === groupId) {
                     self.cancelEdit();
                  }
               });
            }
            ListView.superclass._toggleGroup.apply(this, arguments);
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
            //снимаем выделение с текста иначе не будут работать клики а выделение не будет сниматься по клику из за preventDefault
            var selection = window.getSelection();
            if (selection.removeAllRanges) {
               selection.removeAllRanges();
            } else if (selection.empty) {
               selection.empty();
            }
         },

         //TODO: Сейчас ListView не является родителем редактирования по месту, и при попытке отвалидировать
         //ListView, валидация редактирования не вызывается. Сейчас есть сценарий, когда редактирование
         //располагается на карточке, и при попытке провалидировать карточку перед сохранением, результат
         //будет true, но редактирование может быть невалидно.
         //Для того, чтобы валидация для неизменной записи запускалась, необходимо использовать режим PendingAll.
          validate: function() {
            var
               editingIsValid = true;
            if (this.isEdit()) {
               this._getEditInPlace().addCallback(function(editInPlace) {
                  editingIsValid = editInPlace.isValidChanges();
               });
            }
            return ListView.superclass.validate.apply(this, arguments) && editingIsValid;
         },

         _destroyEditInPlaceController: function() {
            if (this._hasEditInPlace()) {
               this._editInPlace.destroy();
               this._editInPlace = null;
            }
         },

         _destroyEditInPlace: function() {
            if (this._hasEditInPlace()) {
               this._getEditInPlace().addCallback(function(editInPlace) {  // Перед дестроем нужно обязательно завершить редактирование и отпустить все деферреды.
                  editInPlace.cancelEdit();
                  editInPlace._destroyEip();
               });
            }
         },

         _isModeAutoAdd: function() {
            return this._options.editMode.indexOf('autoadd') !== -1;
         },

         _onAfterBeginEdit: function(event, model) {
            var
               itemsToolbarContainer = this._itemsToolbar && this._itemsToolbar.getContainer();

            if(this._itemsToolbar) {
               this._setTouchMode(false);
            }
            /*Скрывать emptyData нужно перед показом тулбара, иначе тулбар спозиционируется с учётом emptyData,
             * а после удаления emptyData, тулбар визуально подскочит вверх*/
            this._toggleEmptyData(false);
            this._showToolbar(model);
            this.setSelectedKey(model.getId());
            if (model.getState() === Record.RecordState.DETACHED) {
               this._drawSelectedItem(model.getId(), -1);
            }
            // Могут быть операции над записью с тулбаром под записью. В таком случае на ListView вешается класс с padding-bottom.
            // Этот отступ при скроле тоже должен учитываться.
            // Поэтому вначале подскролливаем к тулбару и затем скролим к элементу.
            // Такой порядок выбран исходя из того, что запись имеет бо́льший приоритет при отображении, чем тулбар
            // https://online.sbis.ru/opendoc.html?guid=0e0b1cad-2d09-45f8-b705-b1756b52ad99
            if (this._options.editMode.indexOf('toolbar')!== -1 && itemsToolbarContainer && this._isBottomStyleToolbar()) {
               LayoutManager.scrollToElement(itemsToolbarContainer, true);
            }
            this.scrollToItem(model);
            event.setResult(this._notify('onAfterBeginEdit', model));
            this._getItemsContainer().on('mousedown', '.js-controls-ListView__item', this._editInPlaceMouseDownHandler);
         },

         _onAfterEndEdit: function(event, model, target, withSaving) {
            this.setSelectedKey(model.getId());
            event.setResult(this._notify('onAfterEndEdit', model, target, withSaving));
            this._toggleEmptyData(!this.getItems() || !this.getItems().getCount());
            this._hideToolbar();
            this._getItemsContainer().off('mousedown', '.js-controls-ListView__item', this._editInPlaceMouseDownHandler);
         },

         _getEditInPlaceConfig: function() {
            /**
             * Объект _savedConfigs содержит конфигурации компонентов, которые описаны
             * внутри контентной опции с type='string'
             * Раскладываем их обратно в configStorage перед созданием
             * редактирования по месту
             */
            if (this._savedConfigs) {
               for (var i=0;i<this._savedConfigs.length;i++){
                  var conf = this._savedConfigsMaps[i],
                     temp = this._savedConfigs[i][conf],
                     obj = {};
                  if (!temp._thisIsInstance) {
                     obj[conf] = shallowClone(temp);
                     configStorage.merge(obj);
                  }
               }
            }
            var
               config = {
                  items: this.getItems(),
                  idProperty: this._options.idProperty,
                  ignoreFirstColumn: this._options.multiselect,
                  dataSource: this._dataSource,
                  itemsProjection: this._getItemsProjection(),
                  notEndEditClassName: this._notEndEditClassName,
                  editingTemplate: this._options.editingTemplate,
                  itemsContainer: this._getItemsContainer(),
                  element: $('<div>'),
                  opener: this,
                  endEditByFocusOut: this._options.editMode.indexOf('toolbar') === -1,
                  modeAutoAdd: this._isModeAutoAdd(),
                  modeSingleEdit: this._options.editMode.indexOf('single') !== -1,
                  handlers: {
                     onItemValueChanged: function(event, difference, model) {
                        event.setResult(this._notify('onItemValueChanged', difference, model));
                     }.bind(this),
                     onBeginEdit: function(event, model) {
                        event.setResult(this._notify('onBeginEdit', model));
                     }.bind(this),
                     onAfterBeginEdit: this._onAfterBeginEdit.bind(this),
                     onHeightChange: function(event, model) {
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
                     onAfterEndEdit: this._onAfterEndEdit.bind(this),
                     // В момент сохранения записи блокируем весь ListView чтобы побороть закликивание
                     onBeginSave: function() {
                        this._toggleIndicator(true);
                     }.bind(this),
                     // Использую именно beginSave и endSave, т.к. afterEndEdit в случае ошибки при сохранении не будет стрелять, а onEndSave стреляет всегда
                     onEndSave: function() {
                        this._toggleIndicator(false);
                     }.bind(this),
                     onDestroy: function() {
                        //При разрушении редактирования скрывает toolbar. Иначе это ни кто не сделает. А разрушение могло
                        //произойти например из-за setEnabled(false) у ListView
                        this._hideToolbar();
                        this._toggleEmptyData(!this.getItems() || !this.getItems().getCount());
                        this._notifyOnSizeChanged(true);
                     }.bind(this)
                  }
               };
            return config;
         },

         _redrawItemInner: function(item) {
            var
               toolbar = this._getItemsToolbar(),
               toolbarTarget = toolbar.getCurrentTarget(),
               targetElement = this._getDomElementByItem(item);

            if (toolbarTarget && targetElement && toolbarTarget.container.get(0) === targetElement.get(0)) {
               // Нужно всегда при перерисовке записи разблокировать тулбар, иначе будет зависший канал от trackElement
               // https://online.sbis.ru/opendoc.html?guid=62f91f28-78ab-4022-9727-7b951536f771
               if (toolbar.isToolbarLocking()) {
                  toolbar.unlockToolbar();
               }
               toolbar.hide();
            }
            var redrawResult = ListView.superclass._redrawItemInner.apply(this, arguments);

            //Если перерисовалась запись, которая является текущим контейнером для тулбара,
            //то перезаписшем в тулбар, новую ссылку на дом элемент, для того, чтобы тулбар смог
            //правильно спозионироваться.
            if (toolbarTarget && targetElement && toolbarTarget.container.get(0) === targetElement.get(0)) {
               toolbarTarget.container = this._getDomElementByItem(item);
               toolbar.setCurrentTarget(toolbarTarget);
               // https://online.sbis.ru/opendoc.html?guid=8fc10a14-b254-453d-a2e9-bb514bc3a524
               if (this._options.editMode.indexOf('toolbar') !== -1 && this.isEdit()) { // https://online.sbis.ru/opendoc.html?guid=62f91f28-78ab-4022-9727-7b951536f771
                  toolbar.show(toolbarTarget);
                  toolbar.lockToolbar();
               }
            }
            return redrawResult;
         },

         _showToolbar: function(model) {
            var itemsInstances, itemsToolbar, editedItem, editedContainer;
            if (this._options.editMode.indexOf('toolbar') !== -1) {
               itemsToolbar = this._getItemsToolbar();

               itemsToolbar.unlockToolbar();
               /* Меняем выделенный элемент на редактируемую/добавляемую запись */
               editedContainer = this._getElementByModel(model);
               this._changeHoveredItem(editedContainer);
               //Отображаем кнопки редактирования
               itemsToolbar.showEditActions();
               if (!this.getItems() || !this.getItems().getRecordById(model.getId())) {
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
               editedItem = coreClone(this.getHoveredItem());
               editedItem.record = model;
               // на событие onBeginEdit могут поменять модель, запись перерисуется и контейнер на который ссылается тулбар затрется
               if(!contains(this.getContainer(), editedItem.container)){
                   editedItem.container = editedContainer;
               }

               //Отображаем itemsToolbar для редактируемого элемента и фиксируем его
               this._showItemsToolbar(editedItem);
               itemsToolbar.lockToolbar();
            } else {
               if(this._touchSupport) {
                  /* По стандарту перевод редактирования(без связных операций) на ipad'e
                     должен скрывать операции и убирать ховер */
                  this._mouseLeaveHandler();
               } else {
                  this._updateItemsToolbar();
               }
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
               if (!this._touchSupport) {
                  this._updateHoveredItemAfterRedraw();
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
            return this._getItemsContainer().find('>.js-controls-ListView__item[data-id="' + (id === undefined ? '' : id) + '"]:not(".controls-editInPlace")');
         },
         /**
          * Возвращает признак, по которому можно установить: активно или нет редактирование по месту в данный момент.
          * @returns {Boolean} Значение true нужно интерпретировать как "Редактирование по месту активно".
          */
         isEdit: function() {
            var
               result = false;
            if (this._hasEditInPlace()) {
               this._getEditInPlace().addCallback(function(editInPlace) {
                  result = editInPlace.isEdit();
               });
            }
            return result;
         },

         /**
          * Возвращает признак, по которому можно установить: активно или нет добавление по месту в данный момент.
          * @returns {Boolean} Значение true нужно интерпретировать как "Добавление по месту активно".
          * @private
          */
         _isAdd: function() {
            var result = false;
            if (this._hasEditInPlace()) {
               this._getEditInPlace().addCallback(function(editInPlace) {
                  result = editInPlace.isAdd();
               });
            }
            return result;
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
            var target = this._findItemByElement($(e.target)),
                switchedToTouch = this._options.itemsActionsInItemContainer && this._itemsToolbar && this._itemsToolbar.isVisible() && !this._itemsToolbar.getTouchMode();

            if(!target.length) {
               return;
            }
            // zinFrame. Операции над записью отрисовываются внутри <TR>
            // Припереходе в тач режим необходимо вынести операции из строки и положить в table
            if(switchedToTouch) {
                this._moveToolbarToTable();
            }
            this._setTouchSupport(true);
            // После переключения в тач режим пересчитываем координаты тулбара,
             // т.к. до этого они лежали в строке и позиция не была рассчитана
            if(switchedToTouch) {
                this._itemsToolbar.recalculatePosition();
            }
            if (e.direction == 'left') {
               this._changeHoveredItem(target);
               this._onLeftSwipeHandler();
            } else {
               this._onRightSwipeHandler(target);
               if(this._hasHoveredItem()) {
                  this._clearHoveredItem();
                  this._notifyOnChangeHoveredItem();
               }
            }
            e.stopPropagation();
         },

         _onLeftSwipeHandler: function() {
            var itemsActions, target;

            if (this._isSupportedItemsToolbar()) {
               itemsActions = this.getItemsActions();
               target = itemsActions.getTarget();

               if (this._hasHoveredItem()) {
                  if(!this._itemsToolbar.isVisible() || target.key !== this._hoveredItem.key) {
                     this._showItemsToolbar(this._hoveredItem);
                     this.setSelectedKey(this._hoveredItem.key);
                  }
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

         _onRightSwipeHandler: function(target) {
            var self= this,
                hoveredItem = this.getHoveredItem(),
                key = target[0].getAttribute('data-id'),
                columns = target.find('.controls-DataGridView__td').not('.controls-DataGridView__td__checkBox'),
                animation;
            if(hoveredItem && hoveredItem.key !== key && self.getMultiselect()){
                columns.addClass('rightSwipeAnimation');
                setTimeout(function(){
                    columns.toggleClass('rightSwipeAnimation', false);
                    self.setSelectedKey(key);
                    self.toggleItemsSelection([key]);
                }, 300);
            }
            if (this._isSupportedItemsToolbar()) {
               animation = !this._isBottomStyleToolbar();
               this._hideItemsToolbar(animation);
            }
         },

         _isBottomStyleToolbar: function (){
            return this.getContainer().hasClass('controls-ListView__bottomStyle');
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

            // _getItemProjectionByItemId полностью убрать слишком страшно, не будем проверять её только при loadItemsStrategy === 'append'
            // https://online.sbis.ru/opendoc.html?guid=4b3c5ebf-f623-4d2e-9d96-8db8ee32d666
            if(this._getItemsProjection() && (this._options.loadItemsStrategy === 'append' || this._getItemProjectionByItemId(dataId)) &&
               this._getItemProjectionByHash(dataHash)) {
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
                toolbar = this._getItemsToolbar();
            toolbar.show(target, this._touchSupport && !this._isBottomStyleToolbar());
            //При показе тулбара, возможно он будет показан у редактируемой строки.
            //Цвет редактируемой строки отличается от цвета строки по ховеру.
            //В таком случае переключим классы тулбара в режим редактирования.
            if (this._options.editMode.indexOf('toolbar') === -1) {
               if (this.isEdit()) {
                  this._getEditInPlace().addCallback(function(editInPlace) {
                     toolbar._toggleEditClass(editInPlace.getEditingRecord().getId() == target.key);
                  });
               } else {
                  toolbar._toggleEditClass(false);
               }
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
         /**
          * Обрабатывает клик по операции на строке
          * @param key
          * @private
          */
         _itemActionActivated: function(key) {
            this.setSelectedKey(key);
            if(this._touchSupport) {
               this._clearHoveredItem();
               this._onChangeHoveredItem(this.getHoveredItem());
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
                  itemsActionsInItemContainer: this._options.itemsActionsInItemContainer,
                  touchMode: this._touchSupport,
                  className: this._notEndEditClassName,
                  itemsActions: coreClone(this._options.itemsActions),
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
                        self._itemActionActivated(key);
                     },
                     onItemsToolbarHide: function() {
                        if(self._touchSupport) {
                           self._setTouchSupport(false);
                           self._clearHoveredItem();
                        }
                        if (self._options.itemsActionsInItemContainer) {
                           self._moveToolbarToTable();
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

         _moveToolbarToTable: function() {
             this._itemsToolbar.getContainer().appendTo(this._container);
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
               this._itemsToolbar.setItemsActions(coreClone(this._options.itemsActions));
               if (this.getHoveredItem().container) {
                  this._notifyOnChangeHoveredItem()
               }
            }
            this._notifyOnPropertyChanged('itemsActions');
         },
         /**
          * @returns {boolean}
          * @private
          */
         // todo Проверка на "searchParamName" - костыль. Убрать, когда будет адекватная перерисовка записей (до 150 версии, апрель 2016)
         _isSearchMode: function() {
            return this._options.hierarchyViewMode;
         },


         //**********************************//
         //КОНЕЦ БЛОКА ОПЕРАЦИЙ НАД ЗАПИСЬЮ //
         //*********************************//
         _drawItemsCallback: function () {
            ListView.superclass._drawItemsCallback.apply(this, arguments);

            /* Проверяем, нужно ли ещё подгружать данные в асинхронном _drawItemsCallback'e,
               чтобы минимизировать обращения к DOM'у
               т.к. синхронный может стрелять много раз. */
            if (this.isInfiniteScroll()) {
               this._preScrollLoading();
            }

            this._drawSelectedItems(this._options.selectedKeys, {});

            //FixMe: Из за этого при каждой подгрузке по скроллу пэйджинг пересчитывается полностью
            if (this._scrollBinder) {
               // Resets paging if called after reload()
               this._scrollBinder._updateScrollPages(!this._options.virtualScrolling || this._resetPaging);
            } else if (this._options.infiniteScroll == 'down' && this._options.scrollPaging){
               this._createScrollPager();
            }
            this._resetPaging = false;

            // отправляем команду о перерисовке парентов, и только их. Предполагается, что изменение items
            // у ListView может повлиять только на некоторых парентов
            this.sendCommand('resizeYourself');
            this._onResizeHandler();
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
            if (this._virtualScrollController){
               if (this._resetPaging) {
                  this.scrollToFirstPage();
                  this._virtualScrollController.disableScrollHandler(false);
               }
               if (this._virtualScrollShouldReset) {
                  this._virtualScrollController.reset();
                  this._virtualScrollShouldReset = false;
               }
            }
            this._updateHoveredItemAfterRedraw();
         },
         // TODO: скроллим вниз при первой загрузке, если пользователь никуда не скролил
         _onResizeHandler: function(){
            ListView.superclass._onResizeHandler.call(this);
            this._onResizeHandlerInner();
         },

         _onResizeHandlerInner: function(){
            //this._getItemsContainer().children().length - нужна такая проверка, т.к. onResizeHandler может быть вызван до отрисовки записей
            //в этом случае догружать записи пока рано.
            if (this.getItems() && this._getChildrenDOMItems().length){
               //Мог поменяться размер окна или смениться ориентация на планшете - тогда могут влезть еще записи, надо попробовать догрузить
               if (this.isInfiniteScroll() && this._scrollWatcher && !this._scrollWatcher.hasScroll()){
                  this._scrollLoadNextPage();
               }
               if (this._scrollPager){
                  //TODO: Это возможно очень долго, надо как то убрать. Нужно для случев, когда ListView создается скрытым, а потом показывается
                  this._scrollBinder && this._scrollBinder._updateScrollPages();
                  this._setScrollPagerPositionThrottled();
               }
            }
            /* при изменении размера таблицы необходимо вызвать перерасчет позиции тулбара
             позиция тулбара может сбиться например при появление пэйджинга */
            if(this._itemsToolbar && this._itemsToolbar.isVisible()){
               if(this._touchSupport && (!this._editInPlace || !this._editInPlace.isVisible())) {
                  this._itemsToolbar.setHeightInTouchMode();
               }
               this._itemsToolbar.recalculatePosition();
            }
            /* Т.к. для редактирования нет parent'a, надо ресайц звать руками */
            if(this.isEdit()) {
               this._getEditInPlace().addCallback(function(editInPlace) {
                  editInPlace._onResizeHandler();
               });
            }
         },

         _removeItems: function(items) {
            this._checkDeletedItems(items);
            ListView.superclass._removeItems.call(this, items);
            if (this.isInfiniteScroll()) {
               this._preScrollLoading();
            }
            if (this._scrollBinder) {
               this._scrollBinder.moreThanTwo(false);
            }
         },

         _onCollectionAddMoveRemove: function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex){
            if (this._getSourceNavigationType() == 'Offset'){
               if (action == IBindCollection.ACTION_ADD) {
                  this._scrollOffset.bottom += this._getAdditionalOffset(newItems);
               } else if (action == IBindCollection.ACTION_REMOVE) {
                  this._scrollOffset.bottom -= this._getAdditionalOffset(oldItems);
               }
            }

            if (cDetection.firefox || cDetection.isMobileSafari) {
               this._beforeFixScrollTop(action, newItems, newItemsIndex, oldItems, oldItemsIndex);
            }

            ListView.superclass._onCollectionAddMoveRemove.apply(this, arguments);

            if (this._virtualScrollController) {
               this._virtualScrollController.addItems(newItems, newItemsIndex);
               this._virtualScrollController.removeItems(oldItems, oldItemsIndex);
            }

            if (cDetection.firefox || cDetection.isMobileSafari) {
               this._fixScrollTop(action, newItems, newItemsIndex, oldItems, oldItemsIndex);
            }
         },

         // Страшный хак для Firefox и ipad:
         // в 110 из коллекции вместо события replace стали приходить remove и add
         // из за этого в фф и на ipad дергается скролл, так как сначала убирается элемент, скролл подвигается вверх
         // затем добавляется элемент на место удаленного, но скролл остается на месте.
         // Поэтому компенсируем этот прыжок сами
         _beforeFixScrollTop: function(action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
            if (action == IBindCollection.ACTION_REMOVE) {
               this._ffScrollPosition = this._getScrollWatcher().getScrollContainer().scrollTop();
               this._ffRemoveIndex = oldItemsIndex;
            }
         },
         //продолжение хака
         _fixScrollTop: function(action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
            if (action == IBindCollection.ACTION_ADD) {
               if (this._ffRemoveIndex == newItemsIndex) {
                  this._scrollWatcher.scrollTo(this._ffScrollPosition);
               }
            }
            setTimeout(function(){
               this._ffScrollPosition = null;
               this._ffRemoveIndex = null;
            }.bind(this), 0);
         },

         // Получить количество записей которые нужно вычесть/прибавить к _offset при удалении/добавлении элементов
         _getAdditionalOffset: function(items) {
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
            var toolbar = this._getItemsToolbar(),
                toolbarTarget = toolbar.getCurrentTarget(),
                itemsActions = this.getItemsActions();

            if(toolbar && toolbarTarget && itemsActions){
               if(this._checkToolbarTarget(items, toolbarTarget.container.data('hash')) && (toolbar.isToolbarLocking() || this._options.itemsActionsInItemContainer)){
                   toolbar.unlockToolbar();
                   toolbar.hide();
               }
            }
         },

         _checkToolbarTarget: function (items, toolbarTargetHash) {
           var isEqual = false;

           items.forEach(function(item) {
               if (item.getHash() == toolbarTargetHash) {
                   isEqual = true;
               }
           });
           return isEqual;
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

         _prepareInfiniteScrollFn: function(){
            var topParent = this.getTopParent(),
                self = this;
   
            if (!this._scrollWatcher) {
               this._createScrollWatcher();
            }
   
            this._createLoadingIndicator();
            if (this._options.infiniteScroll == 'demand'){
               this._setInfiniteScrollState('down');
               return;
            }
            // Пока по умолчанию считаем что везде подгрузка вниз, и если указана 'up' - значит она просто перевернута
            this._setInfiniteScrollState('down', this._options.infiniteScroll == 'up');
            /**TODO Это специфическое решение из-за того, что нам нужно догружать данные пока не появится скролл
             * Если мы находися на панельке, то пока она скрыта все данные уже могут загрузиться, но новая пачка не загрузится
             * потому что контейнер невидимый*/
            if (cInstance.instanceOfModule(topParent, 'Lib/Control/FloatArea/FloatArea')){
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
         },

         _setInfiniteScrollState: function(mode, reverse){
            if (this._options.infiniteScroll){
               if (mode) {
                  this._infiniteScrollState.mode = mode;
               }
               if (reverse){
                  this._infiniteScrollState.reverse = reverse;
               }
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
               totalScrollOffset: this._options.infiniteScrollPreloadOffset,
               opener: this,
               element: this.getContainer().closest(this._options.infiniteScrollContainer),
               initOnBottom: this._options.infiniteScroll == 'up'
            };
            this._scrollWatcher = new ScrollWatcher(scrollWatcherConfig);
            this._inScrollContainerControl = this._scrollWatcher.getScrollContainer().hasClass('controls-ScrollContainer__content');
         },

         _onTotalScrollHandler: function(event, type){

            //---НАСЛЕДИЕ ИЛЬИ---
            //Догадкин в своих реестрах осуществляет подскролл к верху, при переключении типа отчетов.
            //поэтому идет изначальная загрузка вверх, потом присылает страницу с пустым рекордсетом, а дальше наша логика ломается, и мы не грузим вниз
            //если сначала грузить вниз, то мы отрабатываем нормально, т.к. уже защищены под этой же опцией
            //скорее надо переписать навигацию и очереди загрузок вниз/вверх

            //upd проставлять всегда оказалось не лучшей идее, потому что иногда scrollToItem он не делает. Попрошу его самого ставить флаг, когда делает
            if (this._options.task1173941879 && !this._has_task1173941879Fix) {
               type = 'bottom';
               this._has_task1173941879Fix = true;
            }


            var mode = this._infiniteScrollState.mode,
               scrollOnEdge =  (mode === 'up' && type === 'top') ||   // скролл вверх и доскролили до верхнего края
                               (mode === 'down' && type === 'bottom' && !this._infiniteScrollState.reverse) || // скролл вниз и доскролили до нижнего края
                               (mode === 'down' && type === 'top' && this._infiniteScrollState.reverse) || // скролл верх с запросом данных вниз и доскролили верхнего края
                               (this._options.infiniteScroll === 'both'),
               infiniteScroll = this._getOption('infiniteScroll'),
               loadType;

            /* Не меняем состояние скрола, пока идёт загрузка данных,
               иначе ломаются проверки в callback'e загрузки данных по скролу. */
            if (scrollOnEdge && this.getItems() && !this.isLoading()) {
               // Досткролили вверх, но на самом деле подгружаем данные как обычно, а рисуем вверх
               if (type == 'top' && this._infiniteScrollState.reverse) {
                  this._setInfiniteScrollState('down');
               } else {
                  this._setInfiniteScrollState(type == 'top' ? 'up' : 'down');
               }

               if (this._isCursorNavigation()) {
                  if (infiniteScroll === 'both') {
                     if (type === 'bottom') {
                        if (this.getListNavigation().hasNextPage('down')) {
                           loadType = 'down';
                        }
                     } else {
                        if(this.getListNavigation().hasNextPage('up')) {
                           loadType = 'up';
                        }
                     }
                  } else {
                     loadType = infiniteScroll;
                  }
               }

               this._scrollLoadNextPage(loadType);
            }
         },

         _isCursorNavigation: function() {
            return this._options.navigation && this._options.navigation.type === 'cursor';
         },

         /**
          * Функция догрузки данных пока не появится скролл
          * @private
          */
         _preScrollLoading: function(){
            var scrollDown = this._infiniteScrollState.mode === 'down' && !this._infiniteScrollState.reverse,
                infiniteScroll = this._getOption('infiniteScroll'),
                isCursorNavigation = this._isCursorNavigation();

            // При подгрузке в обе стороны необходимо определять направление, а не ориентироваться по state'у
            // Пока делаю так только при навигации по курсорам, чтобы не поломать остальной функционал
            if (isCursorNavigation) {
               if (infiniteScroll === 'both' || infiniteScroll === 'down') {
                  scrollDown = this.getListNavigation().hasNextPage('down');
               }
            }

            // Если  скролл вверху (при загрузке вверх) или скролл внизу (при загрузке вниз) или скролла вообще нет - нужно догрузить данные
            // //при подгрузке в обе стороны изначально может быть mode == 'down', но загрузить нужно вверх - так как скролл вверху
            if ((scrollDown && this.isScrollOnBottom()) || (!this._scrollWatcher.hasScroll() && infiniteScroll !== 'both')) {
               this._scrollLoadNextPage(isCursorNavigation ? 'down' : this._infiniteScrollState.mode);
            } else {
               if (infiniteScroll === 'both' && this.isScrollOnTop()){
                  this._setInfiniteScrollState('up');
                  this._scrollLoadNextPage(isCursorNavigation ? 'up' : null);
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
          * @param loadDemand Подгрузить данные следующей страницы, если включена подгрузка по кнопке 'Ещё'
          * @private
          */
         _scrollLoadNextPage: function (type) {
            var loadAllowed  = this.isInfiniteScroll() && (this._options.infiniteScroll !== 'demand' || type === 'demand'),
               more = this.getItems().getMetaData().more,
               isContainerVisible = isElementVisible(this.getContainer()),
               // отступ с учетом высоты loading-indicator
               hasScroll = this._scrollWatcher.hasScroll(this._getLoadingIndicatorHeight()),
               hasNextPage;

            if (this._isCursorNavigation()) {
               hasNextPage = this._listNavigation.hasNextPage(type || this._infiniteScrollState.mode);
            }
            else {
               hasNextPage = this._hasNextPage(more, this._scrollOffset.bottom);
            }

            //Если подгружаем элементы до появления скролла показываем loading-indicator рядом со списком, а не поверх него
            if(this._loadingIndicator) {
               this._loadingIndicator.toggleClass('controls-ListView-scrollIndicator_outside', !hasScroll);
            }

            this._updateScrollIndicatorTopThrottled(type);

            //Если в догруженных данных в датасете пришел n = false, то больше не грузим.
            if (loadAllowed && isContainerVisible && hasNextPage && !this.isLoading()) {
               this._loadNextPage(type);
            }
         },
         _getLoadingIndicatorHeight: function () {
            // Раньше высота считалась просто как this._loadingIndicator.height()
            // Сломалось после https://online.sbis.ru/opendoc.html?guid=981cf035-1404-4429-a1b3-859a85510269&des=
            // комит 4248b72d6c8994d4f94b2bfbd4d726705ef1e0da.
            // метод height временно делает контейнер видимым из-за чего на ipad дергаются реестры.
            // Если будут проблемы и надо будет срочно починить, то в крайнем случае можно попробовать
            // .controls-ListView-scrollIndicator { display: none !important}
            return this.getContainer().hasClass('controls-ListView__indicatorVisible') ? this._loadingIndicator.height() : 0;
         },
         /**
          * Обновляет положение ромашки, чтобы её не перекрывал фиксированный заголовок
          * @private
          */
         _updateScrollIndicatorTop: function(type) {
            var top = '';
            var isScrollingUp = type ? type === 'ud' : this._isScrollingUp();
            // Если скролим вверх и есть что загружать сверху
            if (isScrollingUp && this.getItems() && this._hasNextPage(this.getItems().getMetaData().more, this._scrollOffset.top) || !type && this._loadingIndicator.hasClass('controls-ListView-scrollIndicator__up')) {
               top = StickyHeaderManager.getStickyHeaderIntersectionHeight(this.getContainer()) - this._scrollWatcher.getScrollContainer().scrollTop();
            }
            this._loadingIndicator.css('top', top >= 0 ? top : 0);
         },


         /**
          *
          * @param more
          * @param offset Смещение
          * @param direction Проверять наличие записей до или после текущего смещения. Варианты: after / before
          * @returns {Boolean}
          * @private
          */
         _hasNextPage: function(more, offset, direction) {
            if (this._infiniteScrollState.mode === 'up') {
               var hasNextPage;
      
               if (!direction) {
                  direction = 'before';
               }
      
               //перезагрузка с сохранением страницы может произойти на нулевой странице
               //TODO: Должен быть один сценарий, для этого нужно, что бы оффсеты всегда считались и обновлялись до запроса
               if (direction === 'before') {
                  // А подгрузка вверх должна остановиться на нулевой странице и не запрашивать больше
                  hasNextPage = this._scrollOffset.top > 0;
               } else if (this._lastPageLoaded && direction === 'after') {
                  hasNextPage = offset < this._scrollOffset.bottom;
               } else {
                  hasNextPage = ListView.superclass._hasNextPage.apply(this, arguments);
               }
               return hasNextPage;
            } else {
               // Если загружена последняя страница, то вниз грузить больше не нужно
               // при этом смотреть на .getMetaData().more - бесполезно, так как при загруке страниц вверх more == true
               return !this._lastPageLoaded && ListView.superclass._hasNextPage.apply(this, arguments);
            }
         },

         _isScrollingUp: function () {
            return this._infiniteScrollState.mode == 'up' || (this._infiniteScrollState.mode == 'down' && this._infiniteScrollState.reverse === true);
         },

         _loadNextPage: function(type) {
            if (this._dataSource) {
               var offset = this._getNextOffset(),
                  self = this,
                  preparedFilter = this.getFilter();
               //показываем индикатор вверху, если подгрузка вверх или вниз но перевернутая
               var isScrollingUp = type ? type === 'up' : this._isScrollingUp();
               this._loadingIndicator.toggleClass('controls-ListView-scrollIndicator__up', isScrollingUp);
               
               if (isScrollingUp) {
                  if (this._scrollUpIndicator) {
                     this._showLoadingIndicator(type);
                  }
                  this._scrollUpIndicator = true;
               } else {
                  this._showLoadingIndicator(type);
               }
               this._toggleEmptyData(false);

               /*TODO перенос события для курсоров глубже, делаю под ифом, чтоб не сломать текущий функционал*/
               if (!this._options.navigation || this._options.navigation.type != 'cursor') {
                  this._notify('onBeforeDataLoad', preparedFilter, this.getSorting(), offset, this._limit);
               }

               var loadId = this._loadId++;
               this._loadQueue[loadId] = coreClone(this._infiniteScrollState);

               this._loader = this._callQuery(preparedFilter, this.getSorting(), offset, this._limit, type || this._infiniteScrollState.mode)
                  .addBoth(forAliveOnly(function(res) {
                     this._loader = null;
                     return res;
                  }, this))
                  .addCallback(forAliveOnly(function (dataSet) {
                     //ВНИМАНИЕ! Здесь стрелять onDataLoad нельзя! Либо нужно определить событие, которое будет
                     //стрелять только в reload, ибо между полной перезагрузкой и догрузкой данных есть разница!
                     //нам до отрисовки для пейджинга уже нужно знать, остались еще записи или нет
                     var state = this._loadQueue[loadId],
                        hasNextPage;
                     if (this._isCursorNavigation()) {
                        this._listNavigation.analyzeResponseParams(dataSet, type || state.mode);
                        hasNextPage = this._listNavigation.hasNextPage(type || state.mode);
                     }
                     else {
                        hasNextPage = this._hasNextPage(dataSet.getMetaData().more, this._scrollOffset.bottom);
                     }

                     this._updateScrollOffset();
                     //Нужно прокинуть наружу, иначе непонятно когда перестать подгружать
                     this._updateMetaData(dataSet.getMetaData());
                     if (!hasNextPage) {
                        this._toggleEmptyData(!this.getItems().getCount());
                     }
                     this._notify('onDataMerge', dataSet);
                     this._onDataMergeCallback(dataSet);
                     //Если данные пришли, нарисуем
                     if (dataSet.getCount()) {
                        //TODO: вскрылась проблема  проекциями, когда нужно рисовать какие-то определенные элементы и записи
                        //Возвращаем самостоятельную отрисовку данных, пришедших в загрузке по скроллу
                        if (this._isSlowDrawing(this._options.easyGroup)) {
                           this._needToRedraw = false;
                        }
                        this._drawPage(dataSet, (type && {mode: type}) || state);

                        if(this._dogNailSavedMode) {
                           this._setInfiniteScrollState(this._dogNailSavedMode);
                           this._dogNailSavedMode = null;
                        }

                        //И выключаем после отрисовки
                        if (this._isSlowDrawing(this._options.easyGroup)) {
                           this._needToRedraw = true;
                        }
                     } else {

                        if(this._dogNailSavedMode) {
                           this._setInfiniteScrollState(this._dogNailSavedMode);
                           this._dogNailSavedMode = null;
                        }

                        // Если пришла пустая страница, но есть еще данные - догрузим их
                        if (hasNextPage){
                           this._scrollLoadNextPage(type);
                        } else {
                           // TODO: Сделано только для контактов, которые присылают nav: true, а потом пустой датасет с nav: false
                           this._hideLoadingIndicator();

                           //TODO костыль для Догадкина и выпуска 50
                           //суть в том что грузится страница вниз, на ней не приходят записи => мы не попадаем в drawItemsCallback
                           //и не делаем проверку можно ли скроллить вверх, получается так что можно, но мы не грузим, из-за этого подгрузка вверх
                           //выполняется неожидаемо в момент первого движения скролла вниз, хотя должна была запросить сразу после начальной отрисовки списка
                           //страхуемся от этой ситуации, чтоб ничего не сломать https://online.sbis.ru/opendoc.html?guid=8da97ce8-7112-4f3f-8d2a-c6c6be03c74d&des=
                           if (!this._dogNailSavedMode) {
                              if ((this._options.task1173941879) && (this.isScrollOnTop())) {
                                 this._dogNailSavedMode = state.mode;
                                 this._setInfiniteScrollState(state.mode === 'up' ? 'down' : 'up');
                                 this._scrollLoadNextPage();
                              }
                           }
                        }
                     }
                  }, this))
                  .addErrback(forAliveOnly(function (error) {
                     this._hideLoadingIndicator();
                     //Здесь при .cancel приходит ошибка вида DeferredCanceledError
                     return error;
                  }, this));
            }
         },

         _updateMetaData: function(metaData) {
            var currentMetaData = this.getItems().getMetaData() || {};

            /* При загрузке данных, возможны 2 сценария:
             * 1) Итоги возвращают только для первой страницы, подразумевая что для всех остальных страниц они не изменятся
             * 2) Итоги возвращают при подгрузке каждой страницы.
             *
             * Обработаем первую ситуацию, перезаписав текщие итоги в метаданные.
             */
            if (currentMetaData.results && !metaData.results) {
               metaData.results = currentMetaData.results;
            }

            this.getItems().setMetaData(metaData);
         },

         _getNextOffset: function(){
            if (this._infiniteScrollState.mode == 'down' || this._infiniteScrollState.mode == 'demand'){
               if (this._getSourceNavigationType() == 'Offset') {
                  return Math.min(this._scrollOffset.bottom + this._limit, this._getRootCount());
               } else {
                  return this._scrollOffset.bottom + this._limit;
               }
            } else {
               // Math.max из-за того, что страница с записями может быть неполная, и при подгрузке вверх,
               // вычитая размер страницы можно получить отрицательный offset
               return Math.max(this._scrollOffset.top - this._limit, 0);
            }
         },

         _getRootCount: function(){
            return this._getItemsProjection().getCount();
         },

         _updateScrollOffset: function(){
            if (this._infiniteScrollState.mode === 'down' || this._infiniteScrollState.mode == 'demand') {
               //Если навигация по оффсетам, сдвиг произойдет в _onCollectionAddMoveRemove по общему механизму
               if (this._getSourceNavigationType() !== 'Offset') {
                  this._scrollOffset.bottom += this._limit;
               }
            } else {
               this._scrollOffset.top -= this._limit;
            }
         },
         _onDataMergeCallback: function(dataSet) {},
         _drawPage: function(dataSet, state){
            var at = null,
                self = this,
                toggleOverflowScrolling = function(on) {
                   self._getScrollContainer().css({'-webkit-overflow-scrolling': on ? '' : 'initial'});
                };
            //добавляем данные в начало или в конец в зависимости от того мы скроллим вверх или вниз
            if (state.mode === 'up' || (state.mode == 'down' && state.reverse)) {
               /* Ipad c overflowScrolling: touch отложенно рендерит dom, что приводит к скачкам (т.к. у нас кордината считается на момент загрузки)
                  https://stackoverflow.com/questions/8293978/single-finger-scroll-in-safari-not-rendering-html-until-scroll-finishes
                  Поэтому надо отключать. скролл будет останавливаться, но не будет скачков, что более критично */
               if(constants.browser.isMobileIOS) {
                  toggleOverflowScrolling(false);
               }
               this._needScrollCompensation = true;
               this._containerScrollHeight = this._scrollWatcher.getScrollHeight() - this._scrollWatcher.getScrollContainer().scrollTop();
               at = {at: 0};
            }
             // скрываем тулбар на время перерисовки т.к. если изменится количество элементов -> изменится размер таблицы,
             // то операции повиснут в воздухе до проверки в drawItemsCallback
             // ситуация аналогична с redraw
            this._hideItemsToolbar();
            //Achtung! Добавляем именно dataSet, чтобы не проверялся формат каждой записи - это экономит кучу времени
            var items;
            if (state.mode == 'down') {
               items = this.getItems().append(dataSet);
            } else {
               items = this.getItems().prepend(dataSet);
            }
            if(constants.browser.isMobileIOS) {
               toggleOverflowScrolling(true);
            }

            if (this._isSlowDrawing(this._options.easyGroup)) {
               this._drawItems(items, at);
            }

            this._needScrollCompensation = false;
            //TODO Пытались оставить для совместимости со старыми данными, но вызывает onCollectionItemChange!!!
            this._dataLoadedCallback();
            this._toggleEmptyData();
         },

         _setLoadMoreCaption: function(dataSet){
            var
               count,
               caption,
               more = dataSet.getMetaData().more;
            // Если число и больше pageSize то "Еще pageSize"
            if (typeof more === 'number') {
               $('.controls-ListView__counterValue', this._container.get(0)).text(more);
               $('.controls-ListView__counter', this._container.get(0)).removeClass('ws-hidden');

               count = more - (this._scrollOffset.bottom + this._options.pageSize);
               if (count > 0) {
                  caption = format({
                     count: count
                  }, rk('Еще $count$s$'));
               }
            } else {
               $('.controls-ListView__counter', this._container.get(0)).addClass('ws-hidden');
               if (more !== false) {
                  caption = rk('Еще') + '...';
               }
            }
            if (caption) {
               this._loadMoreButton.setCaption(caption);
               this._loadMoreButton.setVisible(true);
            } else {
               this._loadMoreButton.setVisible(false);
            }
         },

         _onLoadMoreButtonActivated: function(event){
            this._loadNextPage('down');
         },

         /**
          * Проверяет происходит ли в данный момент добавление по месту в начале списка.
          * Если происходит, вовзращает последнюю DOM ноду редактирования по месту.
          *
          * @returns {boolean}
          * @private
          */
         _isAddAtTop: function() {
            try {
               if (this._isAdd() && this._getItemsContainer().children().first().hasClass('controls-editInPlace')) {
                  var editingTr = this._getItemsContainer().children().eq(1);
                  return editingTr.hasClass('controls-editInPlace__editing') ? editingTr : false;
               }
            } catch(e) {}

            return false;
         },

         /**
          * Скролит табличное представление к указанному элементу
          * @param item Элемент, к которому осуществляется скролл
          * @param {Boolean} toBottom скроллить к нижней границе элемента, по умолчанию скролит к верхней
          * @param {Number} depth количество родительских контейнеров, лежащих в dom дереве ниже, которые будут проскролены
          * что бы элемент стал видимым. Учитываются только контейнеры на которых overflow-y установлен в auto или scroll.
          * По умолчанию равен бесконечности.
          */
         scrollToItem: function(item, toBottom, depth){
            var itemIndex;
            if (this.getItems()) {
               itemIndex = parseInt(this.getItems().getIndexByValue(item.getIdProperty(), item.getId()));
            }
            // Если item есть в DOM, то работаем будто нет виртуального скрола.
            // Если item удален из DOM, то считаем scrollTop через виртуальный скрол.
            if (this._options.virtualScrolling && this._virtualScrollController && itemIndex >= -1 && !this._virtualScrollController.isItemVisible(itemIndex)) {
               // Если происходит добавление по месту в начале списка, проскролим туда
               if (itemIndex === -1 && this._isAddAtTop()) {
                  this.scrollToFirstPage();
               }
               else if (itemIndex !== -1) {
                  var scrollTop = this._virtualScrollController.getScrollTopForItem(itemIndex);
                  // Если есть sticky header, надо его пересчитать после отрисовки записей виртуальным скролом
                  if (this._options.stickyHeader) {
                     this._virtualScrollResetStickyHead = true;
                  }
                  this._getScrollWatcher().scrollTo(scrollTop);
               }
            }
            else if (item.getId && item.getId instanceof Function) {
               this._scrollToItem(item.getId(), toBottom, depth);
            }
         },

         /**
          * Scroll to the beginning of the list.
          */
         scrollToFirstPage: function() {
            if (this._options.infiniteScroll == "down") {
               this._getScrollWatcher().scrollTo('top');
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
         isScrollOnTop: function() {
            return this._getScrollWatcher().isScrollOnTop();
         },

         _showLoadingIndicator: function(type) {
            var isScrollingUp = type ? type === 'up' : this._isScrollingUp();
            if (!this._loadingIndicator) {
               this._createLoadingIndicator();
            }
            this.getContainer().addClass('controls-ListView__indicatorVisible');
            
            //чтоб индикатор не перекрывал последние записи
            if (!isScrollingUp) {
               this.getContainer().addClass('controls-ListView-scrollIndicator__down');
            }
         },
         /**
          * Удаляет индикатор загрузки
          * @private
          */
         _hideLoadingIndicator: function () {
            if (this._loadingIndicator && !this._loader) {
               this.getContainer().removeClass('controls-ListView__indicatorVisible');
            }
            this.getContainer().removeClass('controls-ListView-scrollIndicator__down');
   
            //Т.к. индикатор загрузки отображается снизу списка, тем самым увеличивая его высоту (добавляется паддинг на высоту индикатора),
            //то после скрытия, высота списка уменьшается, и если в этот момент был отображён тулбар, он сместится
            //и будет отображаться некорректно, надо обновить положение тулбара
            if (this._itemsToolbar && this._itemsToolbar.isVisible() && this._hasHoveredItem()) {
               this._onChangeHoveredItem(this._hoveredItem);
            }
         },
         _createLoadingIndicator : function () {
            this._loadingIndicator = $('> .controls-ListView-scrollIndicator', this._container);
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
            if (typeof type === 'boolean') {
               this._allowInfiniteScroll = type;
            } else {
               if (type) {
                  this._options.infiniteScroll = type;
                  this._allowInfiniteScroll = true;

                  if (type === 'down') {
                     this._setInfiniteScrollState('down');
                  }
               }
            }
   
   
            if(this.isInfiniteScroll()) {
               this._prepareInfiniteScroll();
            }
   
            /* Если скролл - demand, надо скрыть/показать кнопку 'Еще' */
            if (type === 'demand') {
               if (this._loadMoreButton) {
                  this._loadMoreButton.show()
               } else {
                  this._initLoadMoreButton();
               }
            } else if(this._loadMoreButton) {
               this._loadMoreButton.hide();
            }
            
            if (type && !noLoad) {
               this._scrollLoadNextPage(type);
               return;
            }
            //НА саом деле если во время infiniteScroll произошла ошибка загрузки, я о ней не смогу узнать, но при выключении нужно убрать индикатор
            if (!type && this._loadingIndicator && this._loadingIndicator.is(':visible')){
               this._cancelLoading();
            }

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
            //
            if (hoveredItem.container) {
               if(this._options.itemsHover && !hoveredItem.container.hasClass('controls-EditAtPlace')) {
                  hoveredItem.container.addClass('controls-ListView__hoveredItem');
               }
               this._hoveredItem = hoveredItem;
            }
         },

         /**
          * Очищает текущий выделенный элемент
          * @private
          */
         _clearHoveredItem: function() {
            var hoveredItem = this.getHoveredItem(),
                hoveredItemCont = hoveredItem.container,
                emptyObject = {};

            hoveredItemCont && hoveredItemCont.removeClass('controls-ListView__hoveredItem');

            for(var key in hoveredItem) {
               if(hoveredItem.hasOwnProperty(key)) {
                  emptyObject[key] = null;
               }
            }
            return (this._hoveredItem = emptyObject);

         },

         _onDataLoad: function(list) {
            if (this._isCursorNavigation()) {
               this._listNavigation.analyzeResponseParams(list);
            }
            ListView.superclass._onDataLoad.call(this, list);
         },

         _dataLoadedCallback: function (resetPosition) {
            if (resetPosition) {
               this.scrollToFirstPage();
            }

            if (this._options.showPaging) {
               this._processPaging();
               this._updateOffset();
            }
            if (this.isInfiniteScroll()) {
               //Если нет следующей страницы - скроем индикатор загрузки
               if (!this._hasNextPage(this.getItems().getMetaData().more, this._scrollOffset.bottom) || this._options.infiniteScroll === 'demand') {
                  this._hideLoadingIndicator();
               }
               //Кнопки может не быть, когда список рендерится на сервере _dataLoadedCallback вызывается ещё в конструкторе, до инициализации компонентов
               if (this._options.infiniteScroll === 'demand' && this._loadMoreButton){
                  this._setLoadMoreCaption(this.getItems());
               }
            }
            this._observeResultsRecord(true);
            ListView.superclass._dataLoadedCallback.apply(this, arguments);
            this._needScrollCompensation = false;

            if (this._options.virtualScrolling && !this._virtualScrollController) {
               this._initVirtualScrolling();
               this._virtualScrollShouldReset = true;
            }
         },

         _getAjaxLoaderContainer: memoize(function () {
            return this.getContainer().find('.controls-AjaxLoader').eq(0);
         }, '_getAjaxLoaderContainer'),

         _toggleIndicator: function(show){
            this._showedLoading = show;
            if (show) {
               // Показываем контейнер который перекрывает контент, блокируя взаимодействие пользователя с таблицей.
               if (!this.isDestroyed() && this._showedLoading) {
                  this._showLoadingOverlay();
               }
               // После задержки показываем индикатор загрузки.
               if (!this._loadingIndicatorTimer) {
                  this._loadingIndicatorTimer = setTimeout(this._showIndicator.bind(this), INDICATOR_DELAY);
               }
            }
            else {
               clearTimeout(this._loadingIndicatorTimer);
               this._loadingIndicatorTimer = undefined;
               this._hideLoadingOverlayAndIndicator();
            }
         },
         _showLoadingOverlay: function() {
            this._getAjaxLoaderContainer().removeClass('ws-hidden');
         },
         _showIndicator: function () {
            var ajaxLoader = this._getAjaxLoaderContainer(),
               container = this.getContainer(),
               scrollContainer = this._getScrollContainer()[0],
               indicator, centerCord;

            this._loadingIndicatorTimer = undefined;
            ajaxLoader.addClass('controls-AjaxLoader__showIndication');
            indicator = ajaxLoader.find('.controls-AjaxLoader__outer');
            if(indicator.length && scrollContainer && scrollContainer.offsetHeight && container[0].offsetHeight > scrollContainer.offsetHeight) {
               /* Ищем кординату, которая находится по середине отображаемой области грида */
               centerCord =
                  (Math.max(scrollContainer.getBoundingClientRect().bottom, 0) - Math.max(container[0].getBoundingClientRect().top, 0))/2;
               /* Располагаем индикатор, учитывая прокрутку */
               indicator[0].style.top = centerCord + scrollContainer.scrollTop + 'px';
            } else {
               /* Если скрола нет, то сбросим кординату, чтобы индикатор сам расположился по середине */
               indicator[0].style.top = '';
            }
            if (constants.browser.isWinXP) {
               //В старых браузерах не работает top: 50%, если у родительского элемента высота задана через min-height,
               //из-за этого обрезается ромашка.
               ajaxLoader.height(ajaxLoader.height());
            }
         },
         _hideLoadingOverlayAndIndicator: function() {
            this._getAjaxLoaderContainer().addClass('ws-hidden').removeClass('controls-AjaxLoader__showIndication');
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
            var self = this;

            if (!this._pager) {
               requirejs(['SBIS3.CONTROLS/Pager'], function(pagerCtr) {
                  if(self._pager || self.isDestroyed()) {
                     return;
                  }

                  var more = self.getItems().getMetaData().more,
                     hasNextPage = self._hasNextPage(more),
                     pagingOptions = {
                        hideEndButton: self._options.hideEndButton,
                        recordsPerPage: self._options.pageSize || more,
                        currentPage: 1,
                        recordsCount: more || 0,
                        pagesLeftRight: 1,
                        onlyLeftSide: self._options.partialPaging, // (this._options.display.usePaging === 'parts')
                        rightArrow: hasNextPage
                     },
                     pagerContainer = self.getContainer().find('.controls-Pager-container').append('<div/>');

                  self._pager = new pagerCtr({
                     noSizePicker: self._options.noSizePicker,
                     noPagerAmount: self._options.noPagerAmount,
                     pageSize: self._options.pageSize,
                     opener: self,
                     element: pagerContainer.find('div'),
                     allowChangeEnable: false, //Запрещаем менять состояние, т.к. он нужен активный всегда
                     pagingOptions: pagingOptions,
                     handlers: {
                        onPageChange: function (event, pageNum, deferred) {
                           var more = self.getItems().getMetaData().more,
                              hasNextPage = self._hasNextPage(more, self._scrollOffset.bottom),
                              maxPage = self._pager.getPaging()._maxPage,
                              lastPage = self._options.navigation && self._options.navigation.lastPage,
                              pageNumber = pageNum;
                           
                           self._pager._lastPageReached = self._pager._lastPageReached || !hasNextPage;
                           //Старый Paging при включенной частичной навигации по нажатию кнопки "Перейти к последней странице" возвращает pageNum = 0 (у него индексы страниц начинаются с 1)
                           //В новом Pager'e индексация страниц начинается с 0 и такое поведение здесь не подходит
                           //Так же в режиме частичной навигации нет возможности высчитать номер последней страницы, поэтому
                           //при переходе к последней странице делаем так, чтобы мы переключились на последнюю доступную страницу.
                           if (pageNum === 0) {
                              if (self._pager._options.pagingOptions.onlyLeftSide && !lastPage) {
                                 pageNumber = self._pager._lastPageReached ? maxPage : (maxPage + 1);
                              }
                              //К комментарию выше. При полной навигации переходим на последнюю страницу, а не на последнюю доступную
                              if (typeof more === 'boolean' && self._options.partialPaging) {
                                 pageNumber = 0;
                              }
                           }

                           self._setPageSave(pageNumber);
                           self.setPage(pageNumber - 1);
                           self._pageChangeDeferred = deferred;
                        }
                     }
                  });
                  self._updateHoveredItemAfterRedraw();
                  self._pagerContainer = self.getContainer().find('.controls-Pager-container');
                  self._updatePaging();
                  self.sendCommand('resizeYourself');
               });
            } else {
               this._updatePaging();
            }
         },
         _prepareAdditionalFilterForCursor: function(filter, direction, position) {
            return this._listNavigation.prepareQueryParams(this._getItemsProjection(), direction, position);
         },
         _getQueryForCall: function(filter, sorting, offset, limit, direction){
            var
               query = new Query(),
               queryFilter = filter,
               addParams;
            if (this._isCursorNavigation()) {
               var options = this._dataSource.getOptions();
               options.navigationType = SbisService.prototype.NAVIGATION_TYPE.POSITION;
               this._dataSource.setOptions(options);

               queryFilter = coreClone(filter);
               if (offset === -1) {
                  addParams = this._prepareAdditionalFilterForCursor(filter, 'up', '');
               } else {
                  addParams = this._prepareAdditionalFilterForCursor(filter, direction);
               }
               cMerge(queryFilter, addParams.filter);
            }
            /*TODO перенос события для курсоров глубже, делаю под ифом, чтоб не сломать текущий функционал*/
            if (this._isCursorNavigation()) {
               this._notify('onBeforeDataLoad', queryFilter, sorting, offset, limit);
            }
            query.where(queryFilter)
               .offset(offset)
               .limit(limit)
               .orderBy(sorting)
               .meta({ hasMore: offset === -1 ? false : this._options.partialPaging});
            return query;
         },
         setPageSize: function(pageSize, noLoad) {
            if (this._pager) {
               this._pager.setPageSize(pageSize);
            }
            if (!noLoad && this._pager) {
               this._pager.getPaging().clearMaxPage();
               this._lastPageLoaded = false;
            }
            ListView.superclass.setPageSize.apply(this, arguments);
         },
         /**
          * Метод обработки интеграции с пейджингом
          */
         _updatePaging: function () {
            var more = this.getItems().getMetaData().more,
               nextPage = this._hasNextPage(more, this._scrollOffset.bottom, 'after'),
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
               this._pager.updateAmount(this.getItems().getCount(), more, numSelected);
            }
         },
         /**
          * Установить страницу по её номеру.
          * @remark
          * Метод установки номера страницы, с которой нужно открыть представление данных.
          * Работает при использовании постраничной навигации.
          * @param pageNumber Номер страницы.
          * @param noLoad Не загружать переданную страницу.
          * @param noScrollToPage Не скролить к переданной странице.
          * @example
          * <pre>
          *    if(DataGridView.getPage() > 0)
          *       DataGridView.setPage(0);
          * </pre>
          * @see getPage
          */
         setPage: function (pageNumber, noLoad, noScrollToPage) {
            pageNumber = parseInt(pageNumber, 10);
            var offset = this._offset;
            if (pageNumber == -1) {
               if (this._lastPageLoaded) {
                  this._getScrollWatcher().scrollTo('bottom');
               } else {
                  this._setLastPage(noLoad);
               }
            } else {
               if (this.isInfiniteScroll() && this._isPageLoaded(pageNumber)){
                  if (this._getItemsProjection() && this._getItemsProjection().getCount() && !noScrollToPage){
                     var itemIndex, projItem,  itemId, item;
                     itemIndex = pageNumber * this._options.pageSize - this._scrollOffset.top;
                     projItem = this._getItemsProjection().at(itemIndex);
                     //в некоторых условиях (например поиск в сообщениях) размер страницы, приходящей с сервера не соответствует указанному в настройке
                     //поэтому элемента с таким индексом может и не быть.
                     if(projItem) {
                        this._offset = this._options.pageSize * pageNumber;
                        this._scrollToProjItem(projItem);
                     }
                  }
               } else {
                  if (pageNumber === 0) {
                     this._setInfiniteScrollState('down');
                  }
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
                  // Сейчас обновление пэйджинга происходит в _dataLoadedCallback, который происходит раньше этой функции
                  // Поэтому обновим пейджинг еще раз, что бы он правильно отобразился, с правильным offset
                  this._updatePaging();
                  this._getScrollWatcher().scrollTo('bottom');
               }
               this._lastPageLoaded = true;
               /* Грузим последнюю страницу = > страниц точно больше 2ух. */
               if (this._scrollBinder) {
                  this._scrollBinder.moreThanTwo(true);
               }
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
            
            /* Т.к. без навигации мы не можем понять, загружена ли страница,
               то всегда возвращаем, что загружена.
               FIXME это костыль. https://online.sbis.ru/opendoc.html?guid=e403fe95-33ff-43f0-966b-e36eb0e43071 */
            if (!this._options.pageSize) {
               return true;
            } else {
               return (offset <= this._scrollOffset.bottom && offset >= this._scrollOffset.top);
            }
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
         setDataSource: function (source, noLoad) {
            if (!noLoad && this._pager) {
               this._pager.destroy();
               this._pager = undefined;
               this._pagerContainer = undefined;
            }
            if (this._mover) {
               this._mover.destroy();
               this._mover = undefined;
            }
            this._destroyEditInPlaceController();
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
          * Создаёт в списке новый элемент коллекции.
          * @remark
          * Команда инициирует создание в списке нового элемента коллекции через функционал <a href='/doc/platform/developmentapl/interface-development/components/list/list-settings/records-editing/edit-in-place/add-in-place/'>Добавление по месту</a>.
          * При создании элемента коллекции происходит событие {@link onBeginAdd}.
          * @param {Object} [options] Параметры вызова команды.
          * @param {String|Number} [options.parentId] Идентификатор узла, в который добавляют элемент коллекции. Параметр актуален для <a href='/doc/platform/developmentapl/interface-development/components/list/list-settings/list-types/#_4'>ирерахических списков</a>.
          * @param {WS.Data/Entity/Model} [options.preparedModel] Модель, используемая, чтобы предустановить значения полей созданного элемента коллекции.
          * @param {String} [options.addPosition=bottom] Расположение созданного элемента коллекции в режиме редактирования.
          * <ul>
          *     <li>top - отображается в начале списка;</li>
          *     <li>bottom - отображается в конце списка.</li>
          * </ul>
          * @param {Boolean} [withoutActivateEditor=false] В значении true в режиме редактирования созданного элемента коллекции фокус не установлен ни на один из редакторов (см. {@link SBIS3.CONTROLS/Columns.typedef editor}).
          * @example
          * Пример 1.
          * <pre>
          * myView.sendCommand('beginAdd', {
          *    parentId: folderID,
          *    model: modelConfig,
          *    addPosition: 'top'
          * });
          * </pre>
          *
          * Пример 2.
          * Производится создание элемента коллекции внутри узла иерархии, в который установлено проваливание.
          * Предустановлено значение для поля "Наименование". Отображение созданного элемента коллекции в режиме редактирования происходит в начале списка.
          * <pre>
          * var commandParams = {
          *    parentId: myView.getCurrentRoot(),
          *    preparedModel: {
          *       'Наименование': 'ООО "Тензор"',
          *    },
          *     addPosition: 'top',
          *     withoutActivateEditor: true
          * };
          * myView.sendCommand('beginAdd', commandParams);
          * </pre>
          *
          * @returns {*|Deferred} В случае ошибки, вернёт Deferred с текстом ошибки.
          * @command beginAdd
          * @see onBeginAdd
          * @see sendCommand
          */
         beginAdd: function(options, withoutActivateEditor) {
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
          * @param {WS.Data/Entity/Model|String|Number} record Элемент коллекции, для которого требуется активировать редактирование по месту.
          * @param {Boolean} [withoutActivateEditor] Запуск редактирования осуществляется без активации самого редактора
          * @example
          * <pre>
          *    myListView.sendCommand('beginEdit', record);
          * </pre>
          * @command beginEdit
          * @see sendCommand
          * @see cancelEdit
          * @see commitEdit
          * @see beginAdd
          * @see activateItem
          */
         beginEdit: function(record, withoutActivateEditor) {
            if (!(record instanceof Record)) {
               record = this.getItems().getRecordById(record);
            }
            if (!record) {
               return Deferred.fail();
            }
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
          * @command cancelEdit
          * @see sendCommand
          * @see beginEdit
          * @see commitEdit
          * @see beginAdd
          * @see activateItem
          */
         cancelEdit: function() {
            if (this._hasEditInPlace()) {
               return this._getEditInPlace().addCallback(function(editInPlace) {
                  var res = editInPlace.cancelEdit();
                  // вызываем _notifyOnSizeChanged, потому что при отмене редактирования изменились размеры
                  this._notifyOnSizeChanged(true);
                  return res;
               }.bind(this));
            } else {
               return Deferred.success();
            }
         },
         /**
          * Завершает редактирование по месту с сохранением изменений.
          * @remark
          * При выполнении команды происходят события {@link onEndEdit} и {@link onAfterEndEdit}.
          * @example
          * <pre>
          *    myListView.sendCommand('commitEdit');
          * </pre>
          * @command commitEdit
          * @see sendCommand
          * @see beginEdit
          * @see cancelEdit
          * @see beginAdd
          * @see activateItem
          */
         commitEdit: function(checkAutoAdd) {
            var
               self = this,
               eip = this._getEditInPlace();
            eip.addCallback(function(editInPlace) {
               // При сохранении добавляемой записи через галку в тулбаре необходимо автоматически запускать добавление (естественно, если такой режим включен)
               return checkAutoAdd && editInPlace.isAdd() && self._isModeAutoAdd() ? editInPlace.editNextTarget(true) : editInPlace.commitEdit(true);
            });
            return eip;
         },
         _destroyScrollWatcher: function() {
            if (this._scrollWatcher) {
               if (this._options.scrollPaging){
                  this._scrollWatcher.unsubscribe('onScroll', this._onScrollHandler);
               }
               this._scrollWatcher.unsubscribe('onTotalScroll', this._onTotalScrollHandler);
               this._scrollWatcher.destroy();
               this._scrollWatcher = undefined;
            }
         },
         destroy: function () {
            this._destroyEditInPlaceController();
            if (this._scrollBinder){
               this._scrollBinder.destroy();
               this._scrollBinder = null;
            }
            this._destroyScrollWatcher();
            if (this._pager) {
               this._pager.destroy();
               this._pager = undefined;
               this._pagerContainer = undefined;
            }
            if (this._scrollPager){
               if (!this._inScrollContainerControl) {
                  $(window).off('resize scroll', this._setScrollPagerPositionThrottled);
               }
               this._scrollPager.destroy();
            }
            if (this._listNavigation) {
               this._listNavigation.destroy();
            }
            if (this._mover) {
               this._mover.destroy();
            }
            this._toggleEventHandlers(this._container, false);

            //если запущен показ индикатора (а он срабатывает по таймеру - надо его отменить)
            if (this._loadingIndicatorTimer) {
               clearTimeout(this._loadingIndicatorTimer);
               this._loadingIndicatorTimer = undefined;
            }

            ListView.superclass.destroy.call(this);
            if (this._hasDragMove()) {
               this._getDragMove().destroy();
            }
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
            if (this._options.itemsDragNDrop != allowDragNDrop) {
               this._setItemsDragNDrop(allowDragNDrop);
            }
         },

         _setItemsDragNDrop: function(allowDragNDrop) {
            if (this.isEnabledMove()) {
               this._options.itemsDragNDrop = allowDragNDrop;
               this._getItemsContainer()[allowDragNDrop ? 'on' : 'off']('mousedown', '.js-controls-ListView__item', this._getDragInitHandler());
               if (this._dragMoveController) {
                  this._dragMoveController.setItemsDragNDrop(allowDragNDrop)
               }
            }
         },
         /**
          * возвращает метод который инициализирует dragndrop
          * @returns {function}
          * @private
          */
         _getDragInitHandler: function() {
            return this._dragInitHandler ? this._dragInitHandler : this._dragInitHandler  = (function(e){
               if (this._canDragStart(e)) {
                  this._initDrag.call(this, e);
               }
            }).bind(this);
         },
         /**
          * Создает контроллер который обрабатывает перемещение мышкой
          * @returns {*}
          * @private
          */
         _getDragMove: function () {
            if (!this._dragMoveController) {
               this._dragMoveController = new DragMove({
                  view: this,
                  mover: this._getMover(),
                  projection: this._getItemsProjection(),
                  useDragPlaceHolder: this._options.useDragPlaceHolder,
                  linkTemplateConfig: this._options.linkTemplateConfig,
                  dragEntity: this._options.dragEntity,
                  dragEntityList: this._options.dragEntityList,
                  itemsDragNDrop: this.getItemsDragNDrop(),
                  nodeProperty: this._options.nodeProperty,
                  enabled: this.isEnabledMove()
               });
            }
            return this._dragMoveController;
         },
         _hasDragMove: function () {
            return !!this._dragMoveController
         },
         _canDragStart: function(e) {
            //TODO: При попытке выделить текст в поле ввода, вместо выделения начинается перемещения элемента.
            //Как временное решение добавлена проверка на SBIS3.CONTROLS.TextBoxBase.
            //Необходимо разобраться можно ли на уровне TextBoxBase или Control для события mousedown
            //сделать stopPropagation, тогда от данной проверки можно будет избавиться.
            return this.isEnabled() && this._needProcessMouseEvent(e);
         },
         _needProcessMouseEvent: function(e) {
            return !cInstance.instanceOfModule($(e.target).wsControl(), 'SBIS3.CONTROLS/TextBox/TextBoxBase');
         },
         _beginDragHandler: function () {
            return this._getDragMove().beginDrag();
         },
         _endDragHandler: function () {
            this._getDragMove().endDrag();
            if (this._itemsToolbar && this._itemsToolbar.isVisible()) {
               this._itemsToolbar.recalculatePosition();
            }
         },
         _onDragHandler: function () {
            return this._getDragMove().drag();
         },
         _updateDragTarget: function () {
            return this._getDragMove().updateTarget();
         },
         _createAvatar: function () {
            return this._getDragMove().createAvatar();
         },
         /*DRAG_AND_DROP END*/
         //region moveMethods
         /**
          * Перемещает записи через диалог. По умолчанию берет все выделенные записи.
          * @param {Array} idArray Массив перемещаемых записей
          * @deprecated Используйте {@link SBIS3.CONTROLS/Action/List/InteractiveMove}.
          */
         moveRecordsWithDialog: function(idArray) {
            if (this.isEnabledMove()) {
               require(['SBIS3.CONTROLS/Action/List/InteractiveMove', 'WS.Data/Utils'], function (InteractiveMove, Utils) {
                  //Utils.logger.info(this._moduleName + 'Method "moveRecordsWithDialog" is deprecated and will be removed. Use "SBIS3.CONTROLS/Action/List/InteractiveMove"');
                  //В OperationMove ни как не передать инстанс экшена через шаблонизатор до решения этой проблемы перейти не получится
                  var
                     action = new InteractiveMove({
                        linkedObject: this,
                        parentProperty: this._options.parentProperty,
                        nodeProperty: this._options.nodeProperty,
                        dialogOptions: {
                           opener: this
                        },
                        moveStrategy: this.getMoveStrategy(),//todo пока передаем стратегию, после полного отказа от стратегий удалить
                        handlers: {
                           onExecuted: function () {
                              this.destroy();
                           }
                        }
                     }),
                     items = this.getItems(),
                     movedItems;
                  if (idArray) {
                     movedItems = [];
                     idArray.forEach(function (item, i) {
                        if (!cInstance.instanceOfModule(item, 'WS.Data/Entity/Record')) {
                           var temp = items.getRecordById(item);
                           if (!temp) {//чтобы отобразить элемент обязательно нужен рекорд, если он отсутсвует в основном рекордсете, то скоре всего он будет в выделенных
                              var enumerator = this.getSelectedItems().getEnumerator(),
                                 index = enumerator.getIndexByValue(this._options.idProperty, item);
                              temp = this.getSelectedItems().at(index);
                           }
                           if (temp) {
                              movedItems.push(temp);
                           }
                        } else {
                           movedItems.push(item);
                        }
                     }, this);
                  }
                  var filter = this._notify('onPrepareFilterOnMove', {});
                  action.execute({
                     movedItems: movedItems,
                     componentOptions: {
                        filter: filter
                     }
                  });
               }.bind(this));
            }
         },
         /**
          * Перемещает выделенные записи.
          * @deprecated Используйте метод {@link move}.
          * @param {WS.Data/Entity/Model|String} target  К какой записи переместить выделенные. Модель либо ее идентификатор.
          */
         selectedMoveTo: function(target) {
            this._getMover().move(
               this._normalizeItems(this.getSelectedItems(false)),
               target
            ).addCallback(function(res){
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
          * @deprecated Для внедрения собственной логики используйте события {@link onBeginMove} и {@link onEndMove}.
          * @returns {WS.Data/MoveStrategy/IMoveStrategy}
          */
         getMoveStrategy: function() {
            return this._moveStrategy || (this._moveStrategy = this._makeMoveStrategy());
         },
         /**
          * Создает стратегию перемещения в зависимости от источника данных
          * @deprecated Для внедрения собственной логики используйте события {@link onBeginMove} и {@link onEndMove}.
          * @returns {WS.Data/MoveStrategy/IMoveStrategy}
          * @private
          */
         _makeMoveStrategy: function () {
            if (this._options.moveStrategy) {
               return Di.resolve(this._options.moveStrategy, {
                  dataSource: this.getDataSource(),
                  hierField: this._options.parentProperty,
                  parentProperty: this._options.parentProperty,
                  nodeProperty: this._options.nodeProperty,
                  listView: this
               });
            }
         },
         /**
          * Устанавливает стратегию перемещения
          * @see WS.Data/MoveStrategy/IMoveStrategy
          * @deprecated Для внедрения собственной логики используйте события {@link onBeginMove} и {@link onEndMove}.
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
            if (!this._mover) {
               this._mover = Mover.make(this, {
                  moveStrategy: this.getMoveStrategy(),//todo пока передаем стратегию, после полного отказа от стратегий удалить
                  items: this.getItems(),
                  projection: this._getItemsProjection(),
                  parentProperty: this._options.parentProperty,
                  nodeProperty: this._options.nodeProperty,
                  dataSource: this.getDataSource()
               });
            }
            return this._mover
         },
         /**
          * возвращает true если есть мувер
          * @return {boolean}
          * @private
          */
         _hasMover: function () {
            return !!this._mover;
         },
         /**
          * Перемещает переданные записи
          * @param {Array} movedItems  Массив перемещаемых записей.
          * @param {WS.Data/Entity/Model} target Запись к которой надо преместить.
          * @param {MovePosition} position Позиционирование перемещения.
          * @return {Core/Deferred}
          * @example
          * <pre>
          *    new ListView({
          *       itemsActions: {
          *          name: 'moveSelected'
          *          tooltip: 'Переместить выделленые записи внутрь папки'
          *          onActivated: function(tr, id, record) {
          *             this.move(this.getSelectedItems().toArray(), record, 'on')
          *          }
          *       }
          *    })
          * </pre>
          */
         move: function(movedItems, target, position) {
            return this._getMover().move(movedItems, target, position);
         },
         /**
          * Возвращает включено ли перемещения на списке
          * @return {boolean}
          */
         isEnabledMove: function () {
            return this._options.enabledMove
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
                metaData;

            //Если нужно отписаться, или подписаться первый раз.
            //Проверка в связи с тем, что при подгрузке по скроллу рекордсет остается прежним и подписываться еще раз на нем не нужно.
            //В план на декабрь выписал задачу, чтобы  разобраться с подобными костылями при отрисовке строки итогов.
            //https://online.sbis.ru/opendoc.html?guid=e1020605-ea32-42e7-aa12-2f3bea86bb1d
            if (!this._onMetaDataResultsChange) {
               this._onMetaDataResultsChange = function onMetaDataResultsChange(){
                  this._headIsChanged = true;
                  this._redrawResults(true);
               }.bind(this);
               this._onRecordSetPropertyChange = function onRecordSetPropertyChange(event, data) {
                  // Событие так же стреляет при измении любого св-ва рекордсета (idProperty например),
                  // и в data придут не данные, а изменённое св-во
                  if (data.metaData && data.metaData.results) {
                     //При изменении мета-данных переподписываюсь на рекорд строки итогов и перерисовываю их.
                     this.subscribeTo(data.metaData.results, 'onPropertyChange', this._onMetaDataResultsChange);
                  }
                  this._onMetaDataResultsChange();
               }.bind(this);
            }

            if (needObserve !== this._isResultObserved()) { //Если нужно подписаться и подписки еще нет, либо если нужно отписаться и подписка есть
               if (this.getItems()) {
                  this[methodName](this.getItems(), 'onPropertyChange', this._onRecordSetPropertyChange);
                  metaData = this.getItems().getMetaData();
                  if (metaData && metaData.results) {
                     this[methodName](metaData.results, 'onPropertyChange', this._onMetaDataResultsChange);
                  }
               }
            }
         },

         _isResultObserved: function() {
            return this.getItems() && this.getItems().getEventHandlers('onPropertyChange').indexOf(this._onRecordSetPropertyChange) > -1;
         },
   
         /**
          * Устанавливает шаблон, который будет отображаться под элементами коллекции.
          * @param {Function} footerTpl.
          * @example
          * <pre>
          *     ListView.setFooterTpl(myFooterTpl);
          * </pre>
          * @see footerTpl
          */
         setFooterTpl: function(footerTpl) {
            this._options.footerTpl = footerTpl;
            this._redrawFoot();
         },

         _redrawFoot: function() {
            var newFooter,
                footerContainer = $('.controls-ListView__footer', this._container[0]);
   
            this._destroyControls(footerContainer);
            footerContainer.empty();
            
            if (typeof this._options.footerTpl === 'function') {
               newFooter = $(this._options.footerTpl(this._options));
               footerContainer.append(newFooter);
               this.reviveComponents(footerContainer);
            }
         },

         _redrawResults: function(revive){
            var resultsRow = $('.controls-ListView__results', this.getContainer()),
                insertMethod = this._options.resultsPosition == 'top' ? 'before' : 'after',
                resultsRecord = this.getItems() && this.getItems().getMetaData().results,
                markup;
            if (resultsRow.length){
               this._destroyControls(resultsRow);
               resultsRow.remove();
            }
            if (resultsRecord && this._options.resultsTpl && this._options.resultsPosition !== 'none'){
               markup = TemplateUtil.prepareTemplate(this._options.resultsTpl)({item: resultsRecord, multiselect: this._options.multiselect});
               this._getItemsContainer()[insertMethod](markup);
            }
            if (revive) {
               this.reviveComponents($('.controls-ListView__results', this.getContainer()));
            }
            this._resultsChanged = false;
         },

         _setNewDataAfterReload: function() {
            this._resultsChanged = true;
            if (this._options.task1175678591) { // https://online.sbis.ru/opendoc.html?guid=31bc2c39-ef26-4ff7-88f6-1066045262f3
               this._destroyScrollWatcher();
            }
            ListView.superclass._setNewDataAfterReload.apply(this, arguments);
            if (this._options.task1175678591) { // https://online.sbis.ru/opendoc.html?guid=31bc2c39-ef26-4ff7-88f6-1066045262f3
               this._prepareInfiniteScrollFn();
            }
            /* Если проекция заморожена, то перерисовывать результаты нельзя, т.к. отрисовка всего списка будет отложена,
               перерисуем, как проекция будет разморожена. */
            if (this._resultsChanged && this._getItemsProjection() && this._getItemsProjection().isEventRaising()) {
               this._redrawResults(true);
            }
         },

         /**
          * Удаляет записи из источника данных по переданным идентификаторам элементов коллекции.
          * @remark
          * При использовании метода для в классе {@link SBIS3.CONTROLS/Tree/CompositeView} или его наследниках, есть особенность перезагрузки данных.
          * Для режима отображения "Таблица" (table), который устанавливают с помощью опции {@link SBIS3.CONTROLS/Mixins/CompositeViewMixin#viewMode}, производится частичная перезагрузка данных в узлах иерархии.
          * Это означает, что данные списка будут обновлены быстрее: запрос на обновление будет произведён только для тех узлов, элементы которого удаляются методом.
          * Для списков любых других классов будет произведена полная перезагрузка списка записей, например как при методе {@link SBIS3.CONTROLS/ListView#reload}.
          * @param {Array|Number|String} idArray Массив с идентификаторами элементов коллекции.
          * Если нужно удалить одну запись, то в параметр передаётся простое значение - идентификатор элемента.
          * @param {String} [message] Текст, который будет использован в диалоговом окне перед началом удаления записей из источника.
          * Если параметр не передан, то для удаления нескольких записей будет использован текст "Удалить записи?", а для удаления одной записи - "Удалить текущую запись?".
          * @returns {Deferred} Возвращает объект deferred. На результат работы метода можно подписаться для решения прикладных задач.
          */
         deleteRecords: function(idArray, message) {
            var
                self = this,
                res = new Deferred(),
                beginDeleteResult;
            //Клонируем массив, т.к. он может являться ссылкой на selectedKeys, а после удаления мы сами вызываем removeItemsSelection.
            //В таком случае и наш idArray изменится по ссылке, и в событие onEndDelete уйдут некорректные данные
            idArray = Array.isArray(idArray) ? coreClone(idArray) : [idArray];
            message = message || (idArray.length !== 1 ? rk("Удалить записи?", "ОперацииНадЗаписями") : rk("Удалить текущую запись?", "ОперацииНадЗаписями"));
            require(['SBIS3.CONTROLS/Utils/InformationPopupManager'], function(InformationPopupManager) {
               InformationPopupManager.showConfirmDialog({
                  parent: self,
                  message: message,
                  hasCancelButton: false,
                  opener: self
               }, function() {
                  beginDeleteResult = self._notify('onBeginDelete', idArray);
                  if (beginDeleteResult instanceof Deferred) {
                     beginDeleteResult.addCallback(function(result) {
                        self._deleteRecords(idArray, result);
                     }).addErrback(function (result) {
                        InformationPopupManager.showMessageDialog({
                           parent: self,
                           message: result.message,
                           opener: self,
                           status: 'error'
                        });
                     });
                  } else {
                     self._deleteRecords(idArray, beginDeleteResult);
                  }
                  res.callback(true);
               }, function() {
                  res.callback(false);
               }, function() {
                  res.callback();
               });
            });

            return res;
         },

         _deleteRecords: function(idArray, beginDeleteResult) {
            var
               self = this,
               resultDeferred;

            if (beginDeleteResult === false) {
               beginDeleteResult = BeginDeleteResult.CANCEL;
               IoC.resolve('ILogger').log('onBeginDelete', 'Boolean result is deprecated. Use constants ListView.BeginDeleteResult.');
            }

            if (beginDeleteResult !== BeginDeleteResult.CANCEL) {
               this._toggleIndicator(true);
               this._deleteRecordsFromSource(idArray).addCallback(forAliveOnly(function (result) {
                  //Снимаем выделение до перезагрузки данных, т.к. удаляемые записи могут понадобиться, для определения
                  //иерархии в режиме массового выделения(useSelectAll = true).
                  self.removeItemsSelection(idArray);

                  //Если записи удалялись из DataSource, то перезагрузим реест. Если DataSource нет, то удалим записи из items
                  if (self.getDataSource() && beginDeleteResult !== BeginDeleteResult.WITHOUT_RELOAD) {
                     resultDeferred = self._reloadViewAfterDelete(idArray).addCallback(function () {
                        return result;
                     });
                  } else {
                     self._deleteRecordsFromRecordSet(idArray);
                     resultDeferred = Deferred.success(result);
                  }
                  return resultDeferred;
               }, this)).addErrback(function (result) {
                  require(['SBIS3.CONTROLS/Utils/InformationPopupManager'], function(InformationPopupManager) {
                     InformationPopupManager.showMessageDialog({
                        parent: self,
                        message: result.message,
                        opener: self,
                        status: 'error'
                     });
                  });
                  //Прокидываем ошибку дальше, чтобы она дошла до addBoth и мы смогли отдать её в событие onEndDelete
                  return result;
               }).addBoth(function (result) {
                  self._toggleIndicator(false);
                  self._notify('onEndDelete', idArray, result);
               });
            }
         },

         _deleteRecordsFromSource: function(idArray) {
            var source = this.getDataSource();
            return source ? source.destroy(idArray) : Deferred.success(true);
         },

         _deleteRecordsFromRecordSet: function(idArray) {
            var
               item,
               items = this.getItems();
            items.setEventRaising(false, true);
            for (var i = 0; i < idArray.length; i++) {
               item = items.getRecordById(idArray[i]);
               if (item) {
                  items.remove(item);
               }
            }
            items.setEventRaising(true, true);
            return Deferred.success(true);
         },

         _reloadViewAfterDelete: function() {
            return this.reload();
         },

         _initLoadMoreButton: function() {
            if (this._options.infiniteScroll == 'demand' && !this._loadMoreButton) {
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
         },
         setItemsHover: function( hoverMode) {
            this._options.itemsHover = hoverMode;
         }
      });

      ListView.BeginDeleteResult = BeginDeleteResult;

      return ListView.mixin([BreakClickBySelectMixin]);
   });
