/**
 * Created by iv.cheremushkin on 14.08.2014.
 */

define('js!SBIS3.CONTROLS.ListView',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CORE.CompoundActiveFixMixin',
      'js!SBIS3.CONTROLS.DSMixin',
      'js!SBIS3.CONTROLS.MultiSelectable',
      'js!SBIS3.CONTROLS.Selectable',
      'js!SBIS3.CONTROLS.DataBindMixin',
      'js!SBIS3.CONTROLS.DecorableMixin',
      'js!SBIS3.CONTROLS.ItemActionsGroup',
      'html!SBIS3.CONTROLS.ListView',
      'js!SBIS3.CONTROLS.CommonHandlers',
      'js!SBIS3.CONTROLS.MoveHandlers',
      'js!SBIS3.CONTROLS.Pager',
      'js!SBIS3.CONTROLS.EditInPlaceHoverController',
      'js!SBIS3.CONTROLS.EditInPlaceClickController',
      'js!SBIS3.CONTROLS.Link',
      'js!SBIS3.CONTROLS.ScrollWatcher',
      'is!browser?html!SBIS3.CONTROLS.ListView/resources/ListViewGroupBy',
      'is!browser?html!SBIS3.CONTROLS.ListView/resources/emptyData',
      'is!browser?js!SBIS3.CONTROLS.ListView/resources/SwipeHandlers'
   ],
   function (CompoundControl, CompoundActiveFixMixin, DSMixin, MultiSelectable,
             Selectable, DataBindMixin, DecorableMixin, ItemActionsGroup, dotTplFn,
             CommonHandlers, MoveHandlers, Pager, EditInPlaceHoverController, EditInPlaceClickController,
             Link, ScrollWatcher, groupByTpl, emptyDataTpl) {

      'use strict';

      var
         ITEMS_ACTIONS_HEIGHT = 20,
         START_NEXT_LOAD_OFFSET = 180;

      /**
       * Контрол, отображающий внутри себя набор однотипных сущностей.
       * Умеет отображать данные списком по определенному шаблону, а так же фильтровать и сортировать.
       * @class SBIS3.CONTROLS.ListView
       * @extends $ws.proto.Control
       * @author Крайнов Дмитрий Олегович
       * @mixes SBIS3.CONTROLS.DSMixin
       * @mixes SBIS3.CONTROLS.MultiSelectable
       * @mixes SBIS3.CONTROLS.Selectable
       * @mixes SBIS3.CONTROLS.DecorableMixin
       * @mixes SBIS3.CONTROLS.DataBindMixin
       * @control
       * @public
       * @cssModifier controls-ListView__withoutMarker Убирать маркер активной строки.
       * @cssModifier controls-ListView__showCheckBoxes Чекбоксы показываются не по ховеру, а сразу все.
       * @cssModifier controls-ListView__hideCheckBoxes Скрыть все чекбоксы.
       */

      /*TODO CommonHandlers MoveHandlers тут в наследовании не нужны*/
      var ListView = CompoundControl.extend([CompoundActiveFixMixin, DSMixin, MultiSelectable, Selectable, DataBindMixin, DecorableMixin, CommonHandlers, MoveHandlers], /** @lends SBIS3.CONTROLS.ListView.prototype */ {
         _dotTplFn: dotTplFn,
         /**
          * @event onChangeHoveredItem При переводе курсора мыши на другую запись
          * @remark
          * Событие срабатывает при смене записи под курсором мыши.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} hoveredItem Объект
          * @param {Number|String} hoveredItem.key ключ элемента представления данных
          * @param {jQuery|false} hoveredItem.container элемент представления данных
          * @param {Object} hoveredItem.position координаты контейнера элемента
          * @param {Number} hoveredItem.top отступ сверху
          * @param {Number} hoveredItem.left отступ слева
          * @param {Object} hoveredItem.size размеры контейнера элемента
          * @param {Number} hoveredItem.height высота
          * @param {Number} hoveredItem.width ширина
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
          * @see getItemsActions
          *
          * @event onItemClick При клике на запись
          * @remark
          * Событие срабатывает при любом клике под курсором мыши.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {String} id Ключ записи
          * @param {SBIS3.CONTROLS.Record} data запись
          * @param {jQuery} target html элемент на который кликнули

          *
          * @event onItemActivate При активации записи (клик с целью например редактирования или выбора)
          * @remark
          * Событие срабатывает при смене записи под курсором мыши.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} meta Объект
          * @param {String} meta.id ключ элемента представления данных
          * @param {SBIS3.CONTROLS.Record} meta.item запись
          */
         /**
          * @event onDataMerge Перед добавлением загруженных записей в основной dataSet
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
          * @event onItemValueChanged Возникает при смене значения в одном из полей редактирования по месту и потере фокуса этим полем
          * @deprecated Будет удалено в 3.7.3.100. Временное решение
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Array} difference Массив измененных полей
          * @param {Object} model Модель с измененными данными
          */
         /**
          * @event onShowEdit Возникает перед отображением редактирования.
          * @remark
          * Позволяет не отображать редактирование для определенных моделей.
          * Срабатывает только для редактирования в режиме "hover".
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} model Редактируемая модель
          * @returns {*} Возможные значения:
          * <ol>
          *    <li>false - отменить отображение редактирование;</li>
          *    <li>* - продолжить редактирование в штатном режиме.</li>
          * </ol>
          */
         /**
          * @event onBeginEdit Возникает перед началом редактирования
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} model Редактируемая модель
          * @returns {*} Возможные значения:
          * <ol>
          *    <li>$ws.proto.Deferred - запуск редактирования по завершению работы возвращенного Deferred;</li>
          *    <li>false - прервать редактирование;</li>
          *    <li>* - продолжить редактирование в штатном режиме.</li>
          * </ol>
          */
         /**
          * @event onEndEdit Возникает перед окончанием редактирования (и перед валидацией области редактирования)
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} model Редактируемая модель
          * @returns {*} Возможные значения:
          * <ol>
          *    <li>false - отменить редактирование;</li>
          *    <li>* - продолжить редактирование в штатном режиме.</li>
          * </ol>
          */
         /**
          * @event onAfterEndEdit Возникает после окончания редактирования по месту
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} model Отредактированная модель
          */
         $protected: {
            _floatCheckBox: null,
            _dotItemTpl: null,
            _itemsContainer: null,
            _actsContainer: null,
            _hoveredItem: {
               target: null,
               container: null,
               key: null,
               position: null,
               size: null
            },
            _loadingIndicator: undefined,
            _editInPlace: null,
            _hasScrollMore: true,
            _infiniteScrollOffset: null,
            _allowInfiniteScroll: true,
            _scrollIndicatorHeight: 32,
            _isLoadBeforeScrollAppears : true,
            _pageChangeDeferred : undefined,
            _pager : undefined,
            _previousGroupBy : undefined,

            _keysWeHandle: [
               $ws._const.key.up,
               $ws._const.key.down,
               $ws._const.key.space,
               $ws._const.key.enter,
               $ws._const.key.right,
               $ws._const.key.left
            ],
            _itemActionsGroup: null,
            _emptyData: undefined,
            _scrollWidth: undefined,
            _firstScrollTop : true,
            _options: {
               /**
                * @cfg {Boolean} Разрешить отсутствие выбранного элемента
                * @example
                * <pre>
                *     <option name="allowEmptySelection">false</option>
                * </pre>
                */
               allowEmptySelection: false,
               /**
                * @faq Почему нет флажков при включенной опции {@link SBIS3.CONTROLS.ListView#multiselect multiselect}?
                * Для отрисовки флажков необходимо в шаблоне отображания элемента прописать их место:
                * <pre>
                *     <div class="listViewItem" style="height: 30px;">\
                *        <span class="controls-ListView__itemCheckBox"></span>\
                *        {{=it.item.get("title")}}\
                *     </div>
                * </pre>
                * @bind SBIS3.CONTROLS.ListView#itemTemplate
                * @bind SBIS3.CONTROLS.ListView#multiselect
                */
               /**
                * @cfg {String} Шаблон отображения каждого элемента коллекции
                * @remark
                * !Важно: опция обязательна к заполнению!
                * @example
                * <pre>
                *     <div class="listViewItem" style="height: 30px;">\
                *        {{=it.item.get("title")}}\
                *     </div>
                * </pre>
                * @see multiselect
                */
               itemTemplate: '',
               /**
                * @typedef {Array} ItemsActions
                * @property {String} name Имя кнопки.
                * @property {String} icon Путь до иконки.
                * @property {String} caption Текст на кнопке.
                * @property {String} tooltip Всплывающая подсказка.
                * @property {Boolean} isMainAction Отображать ли кнопку на строке или только выпадающем в меню.
                * На строке кнопки отображаются в том же порядке, в каком они перечислены.
                * На строке может быть только три кнопки, полный список будет в меню.
                * @property {Function} onActivated Действие кнопки.
                * @editor icon ImageEditor
                * @translatable caption
                */
               /**
                * @cfg {ItemsActions[]} Набор действий над элементами, отображающийся в виде иконок
                * @remark
                * Можно использовать для массовых операций.
                * @example
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
                * @see setItemsActions
                */
               itemsActions: [{
                  name: 'delete',
                  icon: 'sprite:icon-16 icon-Erase icon-error',
                  tooltip: 'Удалить',
                  caption: 'Удалить',
                  isMainAction: true,
                  onActivated: function (item) {
                     this.deleteRecords(item.data('id'));
                  }
               },{
                  name: 'move',
                  icon: 'sprite:icon-16 icon-Move icon-primary action-hover',
                  tooltip: 'Перенести',
                  caption: 'Перенести',
                  isMainAction: false,
                  onActivated: function (item) {
                     this.selectedMoveTo(item.data('id'));
                  }
               }],
               /**
                * @cfg {Boolean} Разрешено или нет перемещение элементов "Drag-and-Drop"
                * @example
                * <pre>
                *     <option name="itemsDragNDrop">true</option>
                * </pre>
                */
               itemsDragNDrop: false,
               elemClickHandler: null,
               /**
                * @cfg {Boolean} Разрешить выбор нескольких строк
                * @remark
                * Позволяет выбрать несколько строк для одновременного взаимодействия с ними.
                * @example
                * <pre>
                *    <option name="multiselect">false</option>
                * </pre>
                * @see itemTemplate
                */
               multiselect: false,
               /**
                * @cfg {Boolean} Подгружать ли данные по скроллу
                * @example
                * <pre>
                *    <option name="infiniteScroll">true</option>
                * </pre>
                * @see isInfiniteScroll
                * @see setInfiniteScroll
                */
               infiniteScroll: false,
               /**
                * @cfg{String} Направление отслеживания скролла.
                * @remark
                * По умолчанию, подгрузка осуществялется "вниз". Мы поскроллили и записи подгрузились вниз.
                * Но можно настроить скролл так, что записи будут загружаться по скроллу к верхней границе контейнера.
                * Важно. Запросы к БЛ все так же будут уходить с увеличением номера страницы. V
                * Может использоваться для загрузки систории сообщений, например.
                * @variant bottom - подгрузка вниз. Параметр по умолчанию
                * @variant top - Подгрузка по скроллу "вверх".
                */
               infiniteScrollDirection: 'bottom',
               /**
                * @cfg {jQuery || String} Контейнер в котором будет скролл, если представление данных ограничено по высоте.
                * Можно передать Jquery-селектор, но поиск будет произведен от контейнера вверх.
                * @see isInfiniteScroll
                * @see setInfiniteScroll
                */
               infiniteScrollContainer: undefined,
               /**
                * @cfg {Boolean} Режим постраничной навигации
                * @remark
                * При частичной постраничной навигации заранее неизвестно общее количество страниц, режим пейджинга будет определн по параметру n из dataSource
                * Если пришел boolean, значит частичная постраничная навигация
                * Важно! В SBIS3.CONTROLS.TreeCompositeView особый режим навигации - в плоском списке и таблице автоматически работает
                * бесконечная подгрузка по скроллу (@see infiniteScroll), а вот в режиме плитки (tile) будет работать постраничная навигация
                * (при условии showPaging = true)
                * @example
                * <pre>
                *     <option name="showPaging">true</option>
                * </pre>
                * @see setPage
                * @see getPage
                * @see infiniteScroll
                * @see SBIS3.CONTROLS.TreeCompositeView
                */
               showPaging: false,
               /**
                * @cfg {String} Режим редактирования по месту
                * @variant "" Редактирование по месту отлючено
                * @variant click Отображение редактирования по клику
                * @variant click|autoadd Отображение редактирования по клику и включение режима автоматического добавления
                * @variant hover Отображение редактирования по наведению мыши
                * @variant hover|autoadd Отображение редактирования по наведению мыши и включение режима автоматического добавления
                * @remark
                * Режим автоматического добавления позволяет при завершении редактирования последнего элемента автоматически создавать новый
                * @example
                * <pre>
                *     <opt name="editInPlaceMode">click</opt>
                * </pre>
                */
               editMode: '',
               /**
                * @cfg {String} Шаблон строки редактирования по месту.
                * Данная опция обладает большим приоритетом, чем заданный в колонках редактор.
                * @example
                * <pre>
                *     <opt name="editingTemplate">
                *       <component data-component="SBIS3.CONTROLS.TextBox" style="vertical-align: middle; display: inline-block; width: 100%;">
                *          <opt name="text" bind="TextValue"></opt>
                *          <opts name="validators" type="array">
                *             <opts>
                *                <opt name="validator" type="function">js!SBIS3.CORE.CoreValidators:required</opt>
                *             </opts>
                *          </opts>
                *       </component>
                *     </opt>
                * </pre>
                */
               editingTemplate: undefined
            },
            _scrollWatcher : undefined
         },

         $constructor: function () {
            this._publish('onChangeHoveredItem', 'onItemClick', 'onItemActivate', 'onDataMerge', 'onItemValueChanged', 'onShowEdit', 'onBeginEdit', 'onEndEdit', 'onBeginAdd', 'onAfterEndEdit', 'onPrepareFilterOnMove');
            this._container.on('mousemove', this._mouseMoveHandler.bind(this))
                           .on('mouseleave', this._mouseLeaveHandler.bind(this));

            this._scrollWidth = $ws.helpers.getScrollWidth();
            
            this.initEditInPlace();
            $ws.single.CommandDispatcher.declareCommand(this, 'activateItem', this._activateItem);
            $ws.single.CommandDispatcher.declareCommand(this, 'beginAdd', this._beginAdd);
            $ws.single.CommandDispatcher.declareCommand(this, 'beginEdit', this._beginEdit);
            $ws.single.CommandDispatcher.declareCommand(this, 'cancelEdit', this._cancelEdit);
            $ws.single.CommandDispatcher.declareCommand(this, 'commitEdit', this._commitEdit);
         },

         init: function () {
            if (typeof this._options.pageSize === 'string') {
               this._options.pageSize = this._options.pageSize * 1;
            }
            this.setGroupBy(this._options.groupBy, false);
            this._drawEmptyData();
            this._prepareInfiniteScroll();
            ListView.superclass.init.call(this);
            this.reload();
            this._touchSupport = $ws._const.browser.isMobilePlatform;
            if (this._touchSupport){
            	this._getItemActionsContainer().addClass('controls-ItemsActions__touch-actions');
            	this._container.bind('swipe', this._swipeHandler.bind(this))
                               .bind('tap', this._tapHandler.bind(this))
                               .bind('touchmove',this._mouseMoveHandler.bind(this));
            }
         },
         _prepareInfiniteScroll: function(){
            var topParent = this.getTopParent(),
                  self = this,
                  scrollWatcherCfg = {};
            if (this.isInfiniteScroll()) {
               this._createLoadingIndicator();

               scrollWatcherCfg.checkOffset = START_NEXT_LOAD_OFFSET;
               scrollWatcherCfg.opener = this;
               if (this._options.infiniteScrollContainer) {
                  this._options.infiniteScrollContainer = this._options.infiniteScrollContainer instanceof jQuery
                        ? this._options.infiniteScrollContainer
                        : this.getContainer().closest(this._options.infiniteScrollContainer);
                  scrollWatcherCfg.element = this._options.infiniteScrollContainer;
               }
               /**TODO Это специфическое решение из-за того, что нам нужно догружать данные пока не появится скролл
                * Если мы находися на панельке, то пока она скрыта все данные уже могут загрузится, потому что проверка на то
                * появился ли скролл не пройдет и данные постоянно будут грузится, поэтому вызовем подгрузку только после того, как данные загрузятся*/
               if ($ws.helpers.instanceOfModule(topParent, 'SBIS3.CORE.FloatArea')){
                  this._isLoadBeforeScrollAppears = false;
                  topParent.once('onAfterShow', function(){
                     self._isLoadBeforeScrollAppears = true;
                     self._firstScrollTop = true;
                     self._loadBeforeScrollAppears();
                  });
               }

               this._scrollWatcher = new ScrollWatcher(scrollWatcherCfg);
               this._scrollWatcher.subscribe('onScroll', function(event, type){
                  //top || bottom
                  if (type === self._options.infiniteScrollDirection) {
                     self._nextLoad();
                  }
               });
            }
         },
         _keyboardHover: function (e) {
            var selectedKey = this.getSelectedKey();

            switch (e.which) {
               case $ws._const.key.up:
                  var previousItem = this.getPrevItemById(selectedKey);
                  previousItem ? this.setSelectedKey(previousItem.data('id')) : this.setSelectedKey(selectedKey);
                  break;
               case $ws._const.key.down:
                  var nextItem = this.getNextItemById(selectedKey);
                  nextItem ? this.setSelectedKey(nextItem.data('id')) : this.setSelectedKey(selectedKey);
                  break;
               case $ws._const.key.enter:
                  var selectedItem = $('[data-id="' + selectedKey + '"]', this._getItemsContainer());
                  this._elemClickHandler(selectedKey, this._dataSet.getRecordByKey(selectedKey), selectedItem);
                  break;
               case $ws._const.key.space:
                  var nextItem = this.getNextItemById(selectedKey);
                  this.toggleItemsSelection([selectedKey]);
                  nextItem ? this.setSelectedKey(nextItem.data('id')) : this.setSelectedKey(selectedKey);
                  break;
            }
            return false;
         },
         /**
          * Возвращает следующий элемент
          * @param id
          * @returns {*}
          */
         getNextItemById: function (id) {
            return this._getHtmlItem(id, true);
         },
         /**
          * Возвращает предыдущий элемент
          * @param id
          * @returns {jQuery}
          */
         getPrevItemById: function (id) {
            return this._getHtmlItem(id, false);
         },
         /**
          *
          * @param id - идентификатор элемента
          * @param isNext - если true вернет следующий элемент, пердыдущий
          * @returns {jQuery}
          * @private
          */
         // TODO Подумать, как решить данную проблему. Не надёжно хранить информацию в доме
         // Поиск следующего или предыдущего элемента коллекции с учётом вложенных контролов
         _getHtmlItem: function (id, isNext) {
            if($ws.helpers.instanceOfMixin(this._dataSet, 'SBIS3.CONTROLS.Data.Collection.IList')) {
               var index = this._dataSet.getIndex(this._dataSet.getRecordByKey(id)),
                  item;
               item = this._dataSet.at(isNext ? ++index : --index);
               if(item)
                  return $('.js-controls-ListView__item[data-id="' + item.getId() + '"]', this._getItemsContainer());
               else
                  return undefined;
            } else {
               var items = $('.js-controls-ListView__item', this._getItemsContainer()).not('.ws-hidden'),
                  selectedItem = $('[data-id="' + id + '"]', this._getItemsContainer()),
                  index = items.index(selectedItem),
                  siblingItem;
               if (isNext) {
                  if (index + 1 < items.length) {
                     siblingItem = items.eq(index + 1);
                  }
               }
               else {
                  if (index > 0) {
                     siblingItem = items.eq(index - 1);
                  }
               }
               if (siblingItem)
                  return this._dataSet.getRecordByKey(siblingItem.data('id')) ? siblingItem : this._getHtmlItem(siblingItem.data('id'), isNext);
               else
                  return undefined;
            }
         },
         _isViewElement: function (elem) {
            return  $ws.helpers.contains(this._getItemsContainer()[0], elem[0]);
         },
         _onClickHandler: function(e) {
            ListView.superclass._onClickHandler.apply(this, arguments);
            var $target = $(e.target),
                target = this._findItemByElement($target),
                id;

            if (target.length && this._isViewElement(target)) {
               id = target.data('id');
               this._elemClickHandler(id, this._dataSet.getRecordByKey(id), e.target);
            }
            if (this._options.multiselect && $target.length && $target.hasClass('controls-DataGridView__th__checkBox')){
               $target.hasClass('controls-DataGridView__th__checkBox__checked') ? this.setSelectedKeys([]) :this.setSelectedItemsAll();
               $target.toggleClass('controls-DataGridView__th__checkBox__checked');
            }
         },
         /**
          * Обрабатывает перемещения мышки на элемент представления
          * @param e
          * @private
          */
         _mouseMoveHandler: function (e) {
            var $target = $(e.target),
                target, targetKey, hoveredItem, hoveredItemClone;

            target = this._findItemByElement($target);

            if (target.length) {
               targetKey = target[0].getAttribute('data-id');
               hoveredItem = this.getHoveredItem();
               if (targetKey !== undefined && hoveredItem.key !== targetKey) {
                  this._clearHoveredItem();
                  this._setHoveredItem(hoveredItem = this._getElementData(target));

                  /* Надо делать клон и отдавать наружу только клон объекта, иначе,
                     если его кто-то испортит, испортится он у всех, в том числе и у нас */
                  hoveredItemClone = $ws.core.clone(hoveredItem);
                  this._notify('onChangeHoveredItem', hoveredItemClone);
                  this._onChangeHoveredItem(hoveredItemClone);
               }
            } else if (!this._isHoverControl($target)) {
               this._mouseLeaveHandler();
            }
         },

         _getElementData: function(target) {
            if (target.length){
               var cont = this._container[0],
                   containerCords = cont.getBoundingClientRect(),
                   targetKey = target[0].getAttribute('data-id'),
               //FIXME т.к. строка редактирования по местру спозиционирована абсолютно, то надо искать оригинальную строку
                   correctTarget = target.hasClass('controls-editInPlace') ?
                       this._getItemsContainer().find('[data-id="' + targetKey + '"]:not(.controls-editInPlace)') :
                       target,
                   targetCords = correctTarget[0].getBoundingClientRect();

               return {
                  key: targetKey,
                  record: this.getDataSet().getRecordByKey(targetKey),
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

         /**
          * Проверяет, относится ли переданный элемент,
          * к контролам которые отображаются по ховеру.
          * @param {jQuery} $target
          * @returns {boolean}
          * @private
          */
         _isHoverControl: function ($target) {
            var itemsActions = this.getItemsActions(),
                itemsActionsContainer = itemsActions && itemsActions.getContainer();
            return itemsActionsContainer && (itemsActionsContainer[0] === $target[0] || $.contains(itemsActionsContainer[0], $target[0]) || itemsActions.isItemActionsMenuVisible());
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
            if (this._options.itemsActions.length) {
         		if (target.container && !this._touchSupport){
                  this._showItemActions(target);
               } else {
                  this._hideItemActions();
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
            if(this._emptyData.length) {
               html ? this._emptyData.empty().html(html) : this._emptyData.remove();
            } else if(html) {
               this._drawEmptyData();
            }
         },
         _drawEmptyData: function() {
            var html = this._options.emptyHTML;
            this._emptyData = html && $(emptyDataTpl({emptyHTML: html})).appendTo(this._container);
         },
         _getItemTemplate: function () {
            return this._options.itemTemplate;
         },
         /**
          * Устанавливает шаблон отображения элемента
          * @param  {String} tpl Шаблон отображения каждого элемента коллекции
          * @example
          * <pre>
          *     DataGridView.setEmptyHTML('html!MyTemplate');
          * </pre>
          * @see emptyHTML
          */
         setItemTemplate: function(tpl) {
            this._options.itemTemplate = tpl;
         },

         _getItemsContainer: function () {
            return $('.controls-ListView__itemsContainer', this._container.get(0)).first();
         },

         _addItemAttributes: function(container) {
            container.addClass('js-controls-ListView__item');
            ListView.superclass._addItemAttributes.apply(this, arguments);
         },

         /* +++++++++++++++++++++++++++ */

         _elemClickHandler: function (id, data, target) {
            var $target = $(target);

            this.setSelectedKey(id);
            if (this._options.multiselect) {
               //TODO: оставить только js класс
               if ($target.hasClass('js-controls-ListView__itemCheckBox') || $target.hasClass('controls-ListView__itemCheckBox')) {
                  this.toggleItemsSelection([$target.closest('.controls-ListView__item').attr('data-id')]);
               }
               else {
                  this._notifyOnItemClick(id, data, target);
               }
            }
            else {
               this.setSelectedKeys([id]);
               this._notifyOnItemClick(id, data, target);
            }
         },
         _notifyOnItemClick: function(id, data, target) {
            var
                elClickHandler = this._options.elemClickHandler,
                res = this._notify('onItemClick', id, data, target);
            if (res !== false) {
               this._elemClickHandlerInternal(data, id, target);
               elClickHandler && elClickHandler.call(this, id, data, target);
            }
         },
         _elemClickHandlerInternal: function (data, id, target) {
            this._activateItem(id);
         },
         _drawSelectedItems: function (idArray) {
            $(".controls-ListView__item", this._container).removeClass('controls-ListView__item__multiSelected');
            for (var i = 0; i < idArray.length; i++) {
               $(".controls-ListView__item[data-id='" + idArray[i] + "']", this._container).addClass('controls-ListView__item__multiSelected');
            }
         },

         _drawSelectedItem: function (id) {
            $(".controls-ListView__item", this._container).removeClass('controls-ListView__item__selected');
            $(".controls-ListView__item[data-id='" + id + "']", this._container).addClass('controls-ListView__item__selected');
         },
         /**
          * Перезагружает набор записей представления данных с последующим обновлением отображения.
          * @example
          * <pre>
          *    var btn = new Button({
           *         element: "buttonReload",
           *         caption: 'reload offset: 450'
           *    }).subscribe('onActivated', function(event, id){
           *           //При нажатии на кнопку перезагрузим DataGridView  с 450ой записи
           *           DataGridViewBL.reload(DataGridViewBL._filter, DataGridViewBL.getSorting(), 450, DataGridViewBL._limit);
           *    });
          * </pre>
          */
         reload: function () {
            this._reloadInfiniteScrollParams();
            this._previousGroupBy = undefined;
            this._firstScrollTop = true;
            this._hideItemActions();
            this._destroyEditInPlace();
            return ListView.superclass.reload.apply(this, arguments);
         },
         _reloadInfiniteScrollParams : function(){
            if (this.isInfiniteScroll() || this._isAllowInfiniteScroll()) {
               //this._loadingIndicator = undefined;
               this._hasScrollMore = true;
               this._infiniteScrollOffset = this._offset;
               //После релоада придется заново догружать данные до появлени скролла. Но если мы на панели, то
               // подгружать данные начнем только после того, как она покажется
               if (this.getTopParent().isShow()){
                  this._isLoadBeforeScrollAppears = true;
               }

            }
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
         //********************************//
         //   БЛОК РЕДАКТИРОВАНИЯ ПО МЕСТУ //
         //*******************************//
         initEditInPlace: function() {
            this._notifyOnItemClick = this.beforeNotifyOnItemClick();
            if (this._options.editMode.indexOf('click') !== -1) {
               this.subscribe('onItemClick', this._onItemClickHandler);
            } else if (this._options.editMode.indexOf('hover') !== -1) {
               this.subscribe('onChangeHoveredItem', this._onChangeHoveredItemHandler);
            }
         },
         beforeNotifyOnItemClick: function() {
            var handler = this._notifyOnItemClick;
            return function() {
               var args = arguments;
               if (this._editInPlace) {
                  this._editInPlace.endEdit(true).addCallback(function() {
                     handler.apply(this, args)
                  }.bind(this));
               } else {
                  handler.apply(this, args)
               }
            }
         },
         setEditMode: function(editMode) {
            if (editMode !== this._options.editMode && (editMode === '' || editMode === 'click' || editMode === 'hover')) {
               if (this._options.editMode === 'click') {
                  this.unsubscribe('onItemClick', this._onItemClickHandler);
               } else if (this._options.editMode === 'hover') {
                  this.unsubscribe('onChangeHoveredItem', this._onChangeHoveredItemHandler);
               }
               this._destroyEditInPlace();
               this._options.editMode = editMode;
               if (this._options.editMode === 'click') {
                  this.subscribe('onItemClick', this._onItemClickHandler);
               } else if (this._options.editMode === 'hover') {
                  this.subscribe('onChangeHoveredItem', this._onChangeHoveredItemHandler);
               }
            }
         },

         getEditMode: function() {
            return this._options.editMode;
         },

         _onItemClickHandler: function(event, id, record, target) {
            this._getEditInPlace().edit($(target).closest('.js-controls-ListView__item'), record);
            event.setResult(false);
         },

         _onChangeHoveredItemHandler: function(event, hoveredItem) {
            var target = hoveredItem.container;
            if (target && !(target.hasClass('controls-editInPlace') || target.hasClass('controls-editInPlace__editing'))) {
               this._getEditInPlace().show(target, this._dataSet.getRecordByKey(hoveredItem.key));
            } else {
               this._getEditInPlace().hide();
            }
         },

         /**
          * @private
          */
         _getEditInPlace: function() {
            if (!this._editInPlace) {
               this._createEditInPlace();
            }
            return this._editInPlace;
         },

         _createEditInPlace: function() {
            var
               hoverMode = !$ws._const.isMobilePlatform && (this._options.editMode === 'hover|autoadd' || this._options.editMode === 'hover'),
               controller = hoverMode ? EditInPlaceHoverController : EditInPlaceClickController;
            this._editInPlace = new controller(this._getEditInPlaceConfig(hoverMode));
         },

         _destroyEditInPlace: function() {
            if (this._editInPlace) {
               this._editInPlace.destroy();
               this._editInPlace = null;
            }
         },

         _getEditInPlaceConfig: function(hoverMode) {
            //todo Герасимов, Сухоручкин: для hover-режима надо передать в опции метод
            //options.editFieldFocusHandler = this._editFieldFocusHandler.bind(this) - подумать, как это сделать
            var
               config = {
                  dataSet: this._dataSet,
                  ignoreFirstColumn: this._options.multiselect,
                  columns: this._options.columns,
                  dataSource: this._dataSource,
                  editingTemplate: this._options.editingTemplate,
                  itemsContainer: this._getItemsContainer(),
                  element: $('<div>'),
                  opener: this,
                  modeAutoAdd: this._options.editMode === 'click|autoadd' || this._options.editMode === 'hover|autoadd',
                  handlers: {
                     onItemValueChanged: function(event, difference, model) {
                        event.setResult(this._notify('onItemValueChanged', difference, model));
                     }.bind(this),
                     onBeginEdit: function(event, model) {
                        event.setResult(this._notify('onBeginEdit', model));
                     }.bind(this),
                     onBeginAdd: function(event, options) {
                        event.setResult(this._notify('onBeginAdd', options));
                     }.bind(this),
                     onEndEdit: function(event, model, withSaving) {
                        event.setResult(this._notify('onEndEdit', model, withSaving));
                     }.bind(this),
                     onAfterEndEdit: function(event, model, target, withSaving) {
                        if (withSaving) {
                           this.redrawItem(model);
                        }
                        event.setResult(this._notify('onAfterEndEdit', model, target, withSaving));
                     }.bind(this)
                  }
               };
            if (hoverMode) {
               config.handlers.onShowEdit = function(event, model) {
                  event.setResult(this._notify('onShowEdit', model));
               }.bind(this);
            }
            return config;
         },

         _getElementForRedraw: function(item) {
            // Даже не думать удалять ":not(...)". Это связано с тем, что при редактировании по месту может возникнуть задача перерисовать строку
            // DataGridView. В виду одинакового атрибута "data-id", это единственный способ отличить строку DataGridView от строки EditInPlace.
            return this._getItemsContainer().find('.js-controls-ListView__item[data-id="' + item.getKey() + '"]:not(".controls-editInPlace")');
         },

         //********************************//
         //   БЛОК ОПЕРАЦИЙ НАД ЗАПИСЬЮ    //
         //*******************************//

         _swipeHandler: function(e){
            var target = this._findItemByElement($(e.target)),
               item = this._getElementData(target);
            if (this._options.itemsActions.length) {
               if (e.direction == 'left'){
            		item.container ? this._showItemActions(item) : this._hideItemActions();
                  this._setHoveredItem(item)
               } else {
                  this._hideItemActions(true);
               }
            }
         },

         _tapHandler: function(e){
            var target = this._findItemByElement($(e.target));
            this.setSelectedKey(target.data('id'));
         },

         _findItemByElement: function(target){
            if(!target.length) {
               return [];
            }

            var elem = target.closest('.js-controls-ListView__item', this._getItemsContainer());

            // TODO Подумать, как решить данную проблему. Не надёжно хранить информацию в доме
            // TODO  В качестве возможного решения: сохранять ссылку на дом элемент
            /* Поиск элемента коллекции с учётом вложенных контролов,
               обязательно проверяем, что мы нашли, возможно это элемент вложенного контрола,
               тогда поднимемся на уровень выше и опять поищем */
            return elem[0] && this.getDataSet().getRecordByKey(elem[0].getAttribute('data-id')) ? elem : this._findItemByElement(elem.parent());
         },
         /**
          * Показывает оперцаии над записью для элемента
          * @private
          */
         _showItemActions: function (item) {
            //Создадим операции над записью, если их нет
            var itemsActions = this.getItemsActions();
            itemsActions.applyItemActions();

            //Если показывается меню, то не надо позиционировать операции над записью
            if (itemsActions.isItemActionsMenuVisible()) {
               return;
            }
            itemsActions.showItemActions(item, this._getItemActionsPosition(item));
            if (this._touchSupport){
               this._trackMove = $ws.helpers.trackElement(item.container, true);
               this._trackMove.subscribe('onMove', this._moveItemActions, this);
            }
         },
         _hideItemActions: function (animate) {
            var itemsActions = this.getItemsActions();
            if (itemsActions && !itemsActions.isItemActionsMenuVisible()) {
               itemsActions.hideItemActions(animate);
            }
            if (this._trackMove) {
               this._trackMove.unsubscribe('onMove', this._moveItemActions);
               this._trackMove = null;
            }
         },
         _moveItemActions: function(event, offset){
            this._getItemActionsContainer()[0].style.top = offset.top - this._container.offset().top + 'px';
         },
         _getItemActionsPosition: function (item) {
            return {
               top : item.position.top + ((item.size.height > ITEMS_ACTIONS_HEIGHT) ? item.size.height - ITEMS_ACTIONS_HEIGHT : 0 ),
               right : this._touchSupport ? item.position.top : this._container[0].offsetWidth - (item.position.left + item.size.width)
            };
         },
         /**
          * Создаёт операции над записью
          * @private
          */
         _drawItemActions: function () {
            return new ItemActionsGroup({
               items: this._options.itemsActions,
               element: this._getItemActionsContainer(),
               keyField: 'name',
               parent: this
            });
         },
         /**
          * Возвращает контейнер для операций над записью
          * @returns {*}
          * @private
          */
         _getItemActionsContainer: function() {
            var actionsContainer = this._container.find('> .controls-ListView__itemActions-container');

            return actionsContainer.length ? actionsContainer : $('<div class="controls-ListView__itemActions-container"/>').appendTo(this._container);
         },
         /**
          * Инициализирует операции над записью
          * @private
          */
         _initItemsActions: function () {
            this._itemActionsGroup = this._drawItemActions();
         },
         /**
          * Метод получения операций над записью.
          * @returns {Array} Массив операций над записью.
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
          * @see setItemActions
          */
         getItemsActions: function () {
            if (!this._itemActionsGroup && this._options.itemsActions.length) {
               this._initItemsActions();
            }
            return this._itemActionsGroup;
         },
         /**
          * Метод установки или замены кнопок операций над записью, заданных в опции {@link itemsActions}
          * @remark
          * В метод нужно передать массив обьектов.
          * @param {Array} items Объект формата {name: ..., icon: ..., caption: ..., onActivated: ..., isMainOption: ...}
          * @param {String} items.name Имя кнопки операции над записью.
          * @param {String} items.icon Иконка кнопки.
          * @param {String} items.caption Текст на кнопке.
          * @param {String} items.onActivated Обработчик клика по кнопке.
          * @param {String} items.tooltip Всплывающая подсказка.
          * @param {String} items.title Текст кнопки в выпадающем меню.
          * @param {String} items.isMainOption На строке ли кнопка (или в меню).
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
         setItemsActions: function (items) {
            this._options.itemsActions = items;
            this._itemActionsGroup ? this._itemActionsGroup.setItems(items) : this._initItemsActions();
         },
         //**********************************//
         //КОНЕЦ БЛОКА ОПЕРАЦИЙ НАД ЗАПИСЬЮ //
         //*********************************//
         _drawItems: function(records, at){
            if (this._options.infiniteScrollDirection === 'top' && !at) {
               at = {at : 0};
            }
            ListView.superclass._drawItems.apply(this, [records, at]);
         },
         _drawItemsCallback: function () {
            var hoveredItem = this.getHoveredItem().container;

            if (this.isInfiniteScroll()) {
               this._moveTopScroll();

               this._loadBeforeScrollAppears();
            }
            this._drawSelectedItems(this._options.selectedKeys);
            this._drawSelectedItem(this._options.selectedKey);

            /* Если после перерисовки выделенный элемент удалился из DOM дерава,
               то событие mouseLeave не сработает, поэтому вызовем руками метод */
            if(hoveredItem && !$.contains(this._getItemsContainer()[0], hoveredItem[0])) {
               this._mouseLeaveHandler();
            }

            this._notifyOnSizeChanged(true);
         },
         //-----------------------------------infiniteScroll------------------------
         //TODO Сделать подгрузку вверх
         //TODO (?) избавиться от _allowInfiniteScroll - пусть все будет завязано на опцию infiniteScroll
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
         isInfiniteScroll: function () {
            return this._options.infiniteScroll && this._allowInfiniteScroll;
         },
         //TODO Удалить, если везде заработает новая проверка в контейнерах
         //_onContainerScrollBottom: function () {
         //   return (this._loadingIndicator.offset().top - this.getContainer().offset().top - START_NEXT_LOAD_OFFSET < this.getContainer().height());
         //},
         /**
          *  Общая проверка и загрузка данных для всех событий по скроллу
          */
         _loadChecked: function (result) {
            if (result) {
               this._nextLoad();
            }
         },
         /**
          * Проверка на то, где будет скролл у ListView.
          * @returns {*}
          * @private
          */
         _isWindowScroll: function() {
            return this._options.infiniteScrollContainer === undefined;
         },
         _nextLoad: function () {
            var self = this,
               loadAllowed  = this._isAllowInfiniteScroll(),
               records;
            //Если в догруженных данных в датасете пришел n = false, то больше не грузим.
            if (loadAllowed && $ws.helpers.isElementVisible(this.getContainer()) &&
                  this._hasNextPage(this._dataSet.getMetaData().more, this._infiniteScrollOffset) && this._hasScrollMore && !this._isLoading()) {
               this._showLoadingIndicator();
               this._loader = this._callQuery(this.getFilter(), this.getSorting(), this._infiniteScrollOffset + this._limit, this._limit).addCallback($ws.helpers.forAliveOnly(function (dataSet) {
                  //ВНИМАНИЕ! Здесь стрелять onDataLoad нельзя! Либо нужно определить событие, которое будет
                  //стрелять только в reload, ибо между полной перезагрузкой и догрузкой данных есть разница!
                  self._loader = null;

                  self._hideLoadingIndicator();

                  //нам до отрисовки для пейджинга уже нужно знать, остались еще записи или нет
                  if (self._hasNextPage(dataSet.getMetaData().more, self._infiniteScrollOffset)) {
                     self._infiniteScrollOffset += self._limit;
                  } else {
                     self._hasScrollMore = false;
                     self._hideLoadingIndicator();
                  }
                  self._notify('onDataMerge', dataSet);
                  //Если данные пришли, нарисуем
                  if (dataSet.getCount()) {
                     records = dataSet._getRecords();
                     self._dataSet.merge(dataSet, {remove: false});
                     self._drawItems(records);
                     self._dataLoadedCallback();
                     self._toggleEmptyData();
                  }

               }, self)).addErrback(function (error) {
                  //Здесь при .cancel приходит ошибка вида DeferredCanceledError
                  return error;
               });
            }
         },
         _isAllowInfiniteScroll : function(){
            return this._allowInfiniteScroll;
         },
         _scrollTo: function (container) {
            var containerOffset = $(container).offset(),
               body = $('body'),
               needScroll = (body.scrollTop() >= containerOffset.top) || (containerOffset.top - body.scrollTop()) > $ws._const.$win.height() / 2;
            if (needScroll) {
               window.scrollTo(window.scrollX, containerOffset.top);
            }
         },
         _loadBeforeScrollAppears: function(){
            /*
            *   TODO убрать зависимость от опции autoHeight, перенести в scrollWatcher возможность отслежитвания скролла по переданному классу
            *   и все, что связано c GrowableHeight
            *   Так же убрать overflow:auto - прикладные разработчики сами будут его навешивать на нужный им див
            */
            /**
             * Если у нас автовысота, то подгружать данные надо пока размер контейнера не привысит размеры экрана (контейнера window)
             * Если же высота фиксированная, то подгружать данные в этой функции будем пока высота контейнера(ту, что фиксированно задали) не станет меньше высоты таблицы(table),
             * т.е. пока не появится скролл внутри контейнера
             */
            var  windowHeight = $(window).height(),
                checkHeights = this._isWindowScroll() ?
                this._container.height() < windowHeight :
                this._options.infiniteScrollContainer.height() >= this._container.find('.js-controls-View__scrollable').height();
                  //this._container.height() >= this._container.find('.js-controls-View__scrollable').height();
            //this._container.height() >= this._options.infiniteScrollContainer.height();
            //Если на странице появился скролл и мы достигли дна скролла
            if (this._isLoadBeforeScrollAppears && checkHeights){
               this._nextLoad();
            } else {
               this._isLoadBeforeScrollAppears = false;
               this._moveTopScroll();
               this._firstScrollTop = false;
            }
         },
         /**
          * Управляет доскролливанием в режиме подгрузки вверх
          * @private
          */
         _moveTopScroll : function(){
            if (this._options.infiniteScrollDirection == 'top'){
               //Если запускаем 1ый раз, то нужно поскроллить в самый низ, иначе взяли от балды 100 пикселей - отступ
               //сверху, чтобы пользователь понял, что вверх еще можно скроллить.
               this._scrollWatcher.scrollTo(this._firstScrollTop ? 'bottom' : 100);

            }
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
            this._scrollIndicatorHeight = this._loadingIndicator.height();
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
         setInfiniteScroll: function (allow, noLoad) {
            this._allowInfiniteScroll = allow;
            if (allow && !noLoad) {
               this._nextLoad();
               return;
            }
            //НА саом деле если во время infiniteScroll произошла ошибка загрузки, я о ней не смогу узнать, но при выключении нужно убрать индикатор
            if (!allow && this._loadingIndicator && this._loadingIndicator.is(':visible')){
               this._cancelLoading();
            }
            //Убираем текст Еще 10, если включили бесконечную подгрузку
            this.getContainer().find('.controls-TreePager-container').toggleClass('ws-hidden', allow);
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
          * @see getItemActions
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
               if (!this._hasNextPage(this._dataSet.getMetaData().more)) {
                  this._hideLoadingIndicator();
               }
            }
            ListView.superclass._dataLoadedCallback.apply(this, arguments);
         },
         _toggleIndicator: function(show){
            this._showedLoading = show;
            var self = this;
            if (show) {
               setTimeout(function(){
                  if (self._showedLoading) {
                     self._container.find('.controls-AjaxLoader').toggleClass('ws-hidden', false);
                  }
               }, 750);
            }
            else {
               self._container.find('.controls-AjaxLoader').toggleClass('ws-hidden', true);
            }
         },
         _toggleEmptyData: function(show) {
            if(this._emptyData) {
               this._emptyData.toggleClass('ws-hidden', !show);
            }
         },
         //------------------------Paging---------------------
         _processPaging: function() {
            this._processPagingStandart();
         },
         _processPagingStandart: function () {
            if (!this._pager) {
               var more = this._dataSet.getMetaData().more,
                  hasNextPage = this._hasNextPage(more),
                  pagingOptions = {
                     recordsPerPage: this._options.pageSize || more,
                     currentPage: 1,
                     recordsCount: more,
                     pagesLeftRight: 3,
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
                        self._setPageSave(pageNum);
                        self.setPage(pageNum - 1);
                        self._pageChangeDeferred = deferred;
                     }
                  }
               });
            }
            this._updatePaging();
         },
         /**
          * Метод обработки интеграции с пейджингом
          */
         _updatePaging: function () {
            var more = this._dataSet.getMetaData().more,
               nextPage = this.isInfiniteScroll() ? this._hasScrollMore : this._hasNextPage(more),
               numSelected = 0;
            if (this._pager) {
               //Если данных в папке нет, не рисуем Pager
               this._pager.getContainer().toggleClass('ws-hidden', !this._dataSet.getCount());
               var pageNum = this._pager.getPaging().getPage();
               if (this._pageChangeDeferred) { // только когда меняли страницу
                  this._pageChangeDeferred.callback([this.getPage() + 1, nextPage, nextPage]);//смотреть в DataSet мб ?
                  this._pageChangeDeferred = undefined;
               }
               //Если на странице больше нет записей - то устанавливаем предыдущую (если это возможно)
               if (this._dataSet.getCount() === 0 && pageNum > 1) {
                  this._pager.getPaging().setPage(1); //чтобы не перезагружать поставим 1ую. было : pageNum - 1
               }
               this._pager.getPaging().update(this.getPage(this.isInfiniteScroll() ? this._infiniteScrollOffset + this._options.pageSize : this._offset) + 1, more, nextPage);
               if (this._options.multiselect) {
                  numSelected = this.getSelectedKeys().length;
               }
               this._pager.updateAmount(this._dataSet.getCount(), nextPage, numSelected);
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
          * @see paging
          */
         setPage: function (pageNumber, noLoad) {
            pageNumber = parseInt(pageNumber, 10);
            var offset = this._offset;
            if (this._options.showPaging) {
               this._offset = this._options.pageSize * pageNumber;
               if (!noLoad && this._offset !== offset) {
                  this.reload();
               }
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
          * @see paging
          * @see setPage
          * @param {Number} [offset] - если передать, то номер страницы рассчитается от него
          */
         getPage: function (offset) {
            var offset = offset || this._offset,
                more = this._dataSet.getMetaData().more;
            //Если offset отрицательный, значит запросили последнюю страницу.
            return Math.ceil((offset < 0 ? more + offset : offset) / this._options.pageSize);
         },
         _updateOffset: function () {
            var more = this._dataSet.getMetaData().more,
               nextPage = this._hasNextPage(more);
            if (this.getPage() === -1) {
               this._offset = more - this._options.pageSize;
            }
         },
         //------------------------GroupBy---------------------
         _groupByDefaultMethod: function (record) {
            var curField = record.get(this._options.groupBy.field),
               result = curField !== this._previousGroupBy;
            this._previousGroupBy = curField;
            return result;
         },
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
            }
            this._destroyEditInPlace();
            ListView.superclass.setDataSource.apply(this, arguments);
         },

         _activateItem : function(id) {
            var
               item = this._dataSet.getRecordByKey(id);
            this._notify('onItemActivate', {id: id, item: item});
         },
         _beginAdd: function() {
            return this._getEditInPlace().add();
         },
         _beginEdit: function(record) {
            var target = this._getItemsContainer().find('.js-controls-ListView__item[data-id="' + record.getKey() + '"]:first');
            return this._getEditInPlace().edit(target, record);
         },
         _cancelEdit: function() {
            return this._getEditInPlace().endEdit();
         },
         _commitEdit: function() {
            return this._getEditInPlace().endEdit(true);
         },
         destroy: function () {
            this._destroyEditInPlace();
            if (this.isInfiniteScroll()) {
               this._scrollWatcher.destroy();
               this._scrollWatcher = undefined;
            }
            if (this._pager) {
               this._pager.destroy();
               this._pager = undefined;
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
            this._ladderCompare(rows);
         },
         _ladderCompare: function(rows){
            //TODO придрот - метод нужен только для адекватной работы лесенки при перемещении элементов местами
            for (var i = 1; i < rows.length; i++){
               var upperRow = $('.controls-ladder', rows[i - 1]),
                  lowerRow = $('.controls-ladder', rows[i]);
               for (var j = 0; j < lowerRow.length; j++){
                  lowerRow.eq(j).toggleClass('ws-invisible', upperRow.eq(j).html() == lowerRow.eq(j).html());
               }
            }
         }
      });

      return ListView;

   });
