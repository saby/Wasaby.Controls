/*global $ws, define, $ */
define('SBIS3.CONTROLS/Mixins/DragNDropMixin', [
    "Core/EventBus",
    "SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject",
    "WS.Data/Di",
    "Core/core-instance",
    'css!SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragNDropMixin'
], function ( EventBus,DragObject, Di, cInstance) {
    'use strict';
    /**
     * Миксин, задающий логику перемещения.
     * @remark Чтобы можно было перемещать элементы, нужно вызвать метод _initDrag в обработчиках событий mouseDown и touchStart HTML-элементов, которые надо перемещать. Подробнее {@link _initDrag}
     * @mixin SBIS3.CONTROLS/Mixins/DragNDropMixin
     * @public
     * @author Крайнов Д.О.
     * @see SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject
     * @see SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Entity
     */
    if (typeof window !== 'undefined') {
        var LEFT_BUTTON = 1,//Mouse left button flag
           SCROLL_BAR_WIDTH = 24,//Just approximate
           innerWidth = 0,
           isLeftButtonDown = false,
           eventBusChannel = EventBus.channel('DragAndDropChannel'),
           onMouseUp = function(e) {
              isLeftButtonDown = false;
              eventBusChannel.notify('onMouseup', e);
              //Сбрасывать драгндроп надо после того как выполнились все обработчики, нам неизвестен порядок выполнения
              // обработчиков может быть что первым mouseup поймает владелец и сбросит драгндроп
              DragObject.reset();
              $(document).off('mousemove touchmove', onMouseMove).off('mouseup touchend', onMouseUp);
           },
           onMouseMove = function (e) {
              //Probably 'mouseup' event doesn't trigger over scrollbars.
              //Detecting that left button is not hold yet on the window right edge.
              if (isLeftButtonDown && !(e.buttons & LEFT_BUTTON) && innerWidth - e.pageX < SCROLL_BAR_WIDTH) {
                 onMouseUp(e);
              } else {
                 eventBusChannel.notify('onMousemove', e);
              }
           };


    }

    var DragAndDropMixin = /**@lends SBIS3.CONTROLS/Mixins/DragNDropMixin.prototype*/{
        $protected: {
            /**
             * @event onBeginDrag При начале перемещения элемента. Если из события вернуть false, то перемещение будет отменено.
             * @param {Core/EventObject} eventObject Дескриптор события.
             * @param {SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject} dragObject Синглтон Drag'n'drop объект.
             * @see SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject
             */
            /**
             * @event onDragMove В процессе перемещения элемента, принадлежащего контролу, на каждое изменение его положения.
             * @remark Не важно над каким контролом находится элемент, событие происходит у контрола элемент которого перемещают.
             * @param {Core/EventObject} eventObject Дескриптор события.
             * @param {SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject} dragObject Синглтон Drag'n'drop объект.
             * @see SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject
             */
            /**
             * @event onDragOver В процессе перемещения элемента над контролом, на каждое изменение его положения. Элемент при этом может принадлежать другому контролу.
             * @remark Событие происходит у контрола над которым сейчас находится курсор мыши или палец, для touch интерфейса.
             * @param {Core/EventObject} eventObject Дескриптор события.
             * @param {SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject} dragObject Синглтон Drag'n'drop объект.
             * @see SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject
             */
            /**
             * @event onEndDrag При окончании перемещения элемента. Если из события вернуть false, то стандартное действие будет отменено.
             * @param {Core/EventObject} eventObject Дескриптор события.
             * @param {SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject} dragObject Синглтон Drag'n'drop объект.
             * @see SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject
             */

            _options:{
                /**
                 * @cfg {String|Function(): SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Entity}  Конструктор перемещаемой сущности.
                 * @example
                 * Зададим конструктор через Di в XHTML:
                 * <pre>
                 *    <component data-component="SBIS3.CONTROLS/ListView" name="listView">
                 *       <option name="dragEntity">dragentity.row</option>
                 *    </component>
                 * </pre>
                 * Зададим конструктор через di в js:
                 * <pre>
                 *    new ListView({
                *       dragEntity: 'dragentity.row'
                *    })
                 * </pre>
                 * или так:
                 * <pre>
                 *    require('SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Row', function(Row){
                *       new ListView({
                *          dragEntity: Row
                *       })
                *    })
                 * </pre>
                 * @see setDragEntity
                 */
                dragEntity: undefined,
                /**
                 * @cfg {String|Function(): WS.Data/Collection/List}  Конструктор списка перемещаемых сущностей по умолчанию {@link WS.Data/Collection/List}
                 */
                dragEntityList: 'collection.list',
                /**
                 * @cfg {Boolean} Признак, возможножности перемещения элементов с помощью DragNDrop.
                 */
                itemsDragNDrop: true
            },
            /**
             * @member {Number} Константа, показывающая на сколько пикселей надо сдвинуть мышь, чтобы началось перемещение.
             */
            _constShiftLimit: 3,
            _beginDragTarget:null

        },
        //region public
        $constructor: function () {
            this._publish('onDragMove', 'onBeginDrag', 'onEndDrag');
            EventBus.channel('DragAndDropChannel').subscribe('onMouseup', this._onMouseupOutside, this);
            EventBus.channel('DragAndDropChannel').subscribe('onMousemove', this._onMousemove, this);
        },

        after: {
            destroy: function() {
                EventBus.channel('DragAndDropChannel').unsubscribe('onMouseup', this._onMouseupOutside, this);
                EventBus.channel('DragAndDropChannel').unsubscribe('onMousemove', this._onMousemove, this);
            }
        },

        /**
         * Устанавливает конструктор перемещаемой сущности.
         * @param {SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Entity} dragEntityFactory
         * @see SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Entity
         */
        setDragEntity: function(dragEntityFactory) {
            this._options.dragEntity = dragEntityFactory;
        },
        /**
         * Возвращает признак возможно ли перемещение элементов с помощью DragNDrop.
         * @returns {Boolean}
         */
        getItemsDragNDrop: function(){
            return this._options.itemsDragNDrop;
        },
        /**
         * Установить возможность перемещения элементов с помощью DragNDrop.
         * @param {Boolean} itemsDragNDrop
         */
        setItemsDragNDrop: function(itemsDragNDrop){
            this._options.itemsDragNDrop = itemsDragNDrop;
        },

        //endregion public

        //region handlers
        /**
         * Срабатывает на окончание перемещения.
         * @remark Определяется в модуле, который подмешивает миксин.
         * @param {SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject} dragObject Синглтон Drag'n'drop объект.
         * @param {Boolean} droppable Cработал внутри droppable контейнера см {@link _findDragDropContainer}
         * @param {jQuery.Event} e Объект события. На touch устройствах в полях pageX, pageY находятся координаты touch.
         * @see SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject
         * @see _findDragDropContainer
         * @example
         * Добавим в рекордсет списочного контрола записи из перемещаемой сущности:
         * <pre>
         *    ...
         *    _endDragHandler: function(dragObject, droppable, e){
          *       if (droppable) {
          *          var items = this.getItems();
          *          dragObject.getSource().each(function(item){
          *             if ($ws.helpers.instanceOfModule(item, 'SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Row')){
          *                items.add(item.getModel());
          *             }
          *          },this)
          *       }
          *    }
         *    ...
         * </pre>
         */
        _endDragHandler: function(dragObject, droppable, e) {

        },
        /**
         * Срабатывает при перемещении (на каждое перемещение).
         * @remark Определяется в модуле, который подмешивает миксин.
         * @param {SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject} dragObject Синглтон Drag'n'drop объект.
         * @param {jQuery.Event} e Объект события. На touch устройствах в полях pageX, pageY находятся координаты touch.
         * @see SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject
         */
        _onDragHandler: function(dragObject, e) {

        },
        /**
         * Срабатывает при начале перемещения. Если вернуть false, перемещение не начнется.
         * @remark Определяется в модуле, который подмешивает миксин. Если контрол взамодействует с другими контролами через Drag'n'drop
         * то этот метод должен определить, что перемещает пользователь и установить в dragObject (см метод {@link SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject#setSource}).
         * @param {SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject} dragObject Синглтон Drag'n'drop объект.
         * @param {jQuery.Event} e Объект события. На touch устройствах в полях pageX, pageY находятся координаты touch.
         * @see SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject
         * @returns {Boolean} если вернуть false перемещение не начнется
         */
        _beginDragHandler: function(dragObject, e) {

        },
        /**
         *
         * Возвращает HTML-строку, содержащую аватар. Иконка аватара будет отображаться около курсора мыши при перемещении.
         * Определяется в модуле, который подмешивает миксин.
         * @example
         * <pre>
         *   ...
         *   _createAvatar: function(){
          *      return '<div class="icon-16 icon-Skeleton icon-error"></div>';
          *   }
         *   ...
         * </pre>
         * @param {SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject} dragObject Синглтон Drag'n'drop объект.
         * @param {jQuery.Event} e Объект события.
         * @returns {String}
         * @see SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject
         */
        _createAvatar: function(dragObject, e) {

        },
        /**
         * Обновляет target в dragObject {@link SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject#getTarget}.
         * @remark Срабатывает раньше пользовательских обработчиков событий onEndDrag, onDragMove. Это позволяет обеспечить в них актуальный target. Определяется в модуле, который подмешивает миксин.
         * @example
         * Например у контрола такая верстка:
         * <pre>
         *    <div>
         *       <div class="item" data-id="1">Первый</div>
         *       <div class="item" data-id="2">Второй</div>
         *       <div class="item" data-id="3">Третий</div>
         *    </div>
         * </pre>
         * перемещаются элементы с классом item.
         * <pre>
         *    ...
         *    _updateDragTarget: function(dragObject) {
          *       var row = dragObject.getTargetsDomElement(),
          *          target = null;
          *       if (row.hasClass('item')) {//Проверим что курсор находится над элементом с классом item
          *          target = this._makeDragEntity({
          *             owner: this,
          *             id: row.data('id')
          *          })
          *       }
          *       dragObject.setDragTarget(target)
          *    }
         *    ...
         * </pre>
         * @param {SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject} dragObject Синглтон Drag'n'drop объект.
         * @param {jQuery.Event} e Объект события
         * @see SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject
         */
        _updateDragTarget: function(dragObject, e) {

        },
        //endregion handlers

        //region protected

        /**
         * Показывает аватар
         * @param  {jQuery.Event} e Объект события.
         * @private
         */
        _showAvatar: function(e) {
            if (!DragObject.getAvatar()) {
               var avatar = this._createAvatar(DragObject, e);
               DragObject.setAvatar(avatar);
            }
        },
        /**
         * Инициализирует перемещение. Должен быть вызван в пользовательских обработчиках событий onMouseDown и touchStart для тех элементов, которые можно перемещать.
         * @example
         * Допустим у нашего контрола такая верстка:
         * <pre>
         *    <div>
         *       <h2>Список участников</h2>
         *       <table>
         *          <tr class="item"><td>1</td><td>первый</td></tr>
         *          <tr class="item"><td>1</td><td>первый</td></tr>
         *          <tr><td collspan="2">итого: 2</tr>
         *       </table>
         *    </div>
         * </pre>
         * и мы хотим перемещать только строки с классом item:
         * <pre>
         *    ...
         *    _onInit: function(){
          *       this.getContainer().on('mousedown touchstart', '.item', this._initDrag.bind(this))
          *    }
         *    ...
         * </pre>
         * @param {Event|jQuery.Event} clickEvent Объект события.
         */
        _initDrag: function(clickEvent) {
            var
                self = this,
                dragStrarter = function(bus, moveEvent){
                    self._preparePageXY(moveEvent);
                    if (!DragObject.isDragging() && self._isDrag(moveEvent, clickEvent)) {
                        self._beginDrag(clickEvent);
                        self._beginDragTarget = clickEvent.target;
                        EventBus.channel('DragAndDropChannel').unsubscribe('onMousemove', dragStrarter);
                    }
                };
            if (clickEvent.buttons & LEFT_BUTTON) {
               isLeftButtonDown = true;
               innerWidth = window.innerWidth;
            }
            $(document).on('mousemove touchmove', onMouseMove).on('mouseup touchend', onMouseUp);
            var clickEventOrigin = clickEvent.originalEvent || clickEvent;//в clickEvent.which может быть не определен, а в originalEvent он есть
            if ($(clickEventOrigin.target).closest('.controls-DragNDropMixin__notDraggable', self._getDragContainer()[0]).length === 0
               && ((clickEventOrigin.type == 'mousedown' && clickEventOrigin.which == LEFT_BUTTON) || clickEventOrigin.type != 'mousedown') //Для мышки проверям что нажата левая кнопка
            ) {
               EventBus.channel('DragAndDropChannel').subscribe('onMousemove', dragStrarter);
               EventBus.channel('DragAndDropChannel').once('onMouseup', function () {
                  EventBus.channel('DragAndDropChannel').unsubscribe('onMousemove', dragStrarter);
               });
               this._preventClickEvent(clickEvent);
            }
        },
        /**
         * Начало перемещения.
         * @param {jQuery.Event} e Объект события.
         */
        _beginDrag: function (e) {
            if (this._options.itemsDragNDrop) {
                DragObject.setDragging(true);
                DragObject.onDragHandler(e);
                if (this._beginDragHandler(DragObject, e) !== false) {
                   if (this._notify('onBeginDrag', DragObject, e) !== false) {
                      this._initDragOverlay();
                      this._showAvatar(e);
                      DragObject.setOwner(this);
                      DragObject.setDragging(true);
                   } else {
                        DragObject.reset();
                   }
                } else {
                    DragObject.reset();
                }
            }

        },
        /**
         * Вытаскивает координаты нажатия для tuch событий так же как для событий мыши.
         * @param {jQuery.Event} e Объект события.
         * @private
         */
        _preparePageXY: function(e) {
            if (e.type == "touchstart" || e.type == "touchmove") {
                e.pageX = e.originalEvent.touches[0].pageX;
                e.pageY = e.originalEvent.touches[0].pageY;
            } else if(e.type == "touchend") {
                e.pageX = e.originalEvent.changedTouches[0].pageX;
                e.pageY = e.originalEvent.changedTouches[0].pageY;
            }
        },
        /**
         * Метод определяет был ли сдвиг или просто кликнули по элементу.
         * @param {jQuery.Event} moveEvent Объект события.
         * @param {jQuery.Event} clickEvent Объект события.
         * @returns {boolean} если true то было смещение.
         * @private
         */
        _isDrag: function(moveEvent, clickEvent) {
            var
                moveX = moveEvent.pageX - clickEvent.pageX,
                moveY = moveEvent.pageY - clickEvent.pageY;

            if ((Math.abs(moveX) < this._constShiftLimit) && (Math.abs(moveY) < this._constShiftLimit)) {
                return false;
            }
            return true;
        },
        /**
         * Конец перемещения.
         * @param {jQuery.Event} e Объект события.
         * @param {Boolean} droppable Закончили над droppable контейнером.
         * @private
         */
        _endDrag: function (e, droppable) {
            //После опускания мыши, ещё раз позовём обработку перемещения, т.к. в момент перед отпусканием мог произойти
            //переход границы между сменой порядкового номера и перемещением в папку, а обработчик перемещения не вызваться,
            //т.к. он срабатывают так часто, насколько это позволяет внутренняя система взаимодействия с мышью браузера.
            $('.controls-DragNDropMixin-overlay').remove();
            if (droppable || e.type == "touchend") { //запускаем только если сработало внутри droppable контейнера, иначе таргета нет и нечего обновлять
                //touchend всегда срабатывает не над droppable контейнером, так что для него запускаем всегда
                this._updateDragTarget(DragObject, e);
            }

            this._breakClickBySelf(e.target);
            var res = this._notify('onEndDrag', DragObject, e);
            if (res !== false) {
                this._endDragHandler(DragObject, droppable, e);
            }
            this._position = null;
        },

        /**
         * Создает сущность перемещения.
         * @param {Object} options Объект с опциями которые будут переданы в конструктор сущности.
         * @returns {SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Entity}
         * @see SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Entity
         */
        _makeDragEntity: function(options) {
            return  Di.resolve(this._options.dragEntity, options);
        },
        /**
         *
         * @param options
         * @returns {*|Object|Array}
         * @private
         */
        _makeDragEntityList: function(options) {
            return Di.resolve(this._options.dragEntityList, options)
        },
        //endregion protected
        //region mouseHandler
        /**
         * Запускает обработчики перемещения.
         * @param {jQuery.Event} e Объект события.
         * @private
         */
        _onDrag: function (e) {
            var
                targetsControl = DragObject.getTargetsControl(),
                res,
                container = this._getDragContainer();
            this._updateDragTarget(DragObject, e);
            if (targetsControl === this) {
                container.addClass('controls-dragndrop');
                res = this._notify('onDragOver', DragObject, e);
            } else if (container.hasClass('controls-dragndrop')) {
                container.removeClass('controls-dragndrop')
            }
            if (DragObject.getOwner() === this) {
                this._notify('onDragMove', DragObject, e);
            }
            if (res !== false) {
                this._onDragHandler(DragObject, e);
            }
        },
        /**
         * Срабывает когда отпустили мышь за пределами контрола.
         * @param {Core/EventObject} buse Дескриптор события.
         * @param {jQuery.Event} e Объект события.
         */
        _onMouseupOutside: function(buse, e) {
            this._mouseUp(e, false);
        },
        /**
         * Обработчик на событие браузера - Mouseup, Touchend.
         * @param {jQuery.Event} e Объект события.
         * @param {Boolean} inside Признак того что перемещение закончилось внутри контрола.
         */
        _mouseUp: function(e) {
            //todo разобраться с опцией выключения dragndrop
            //https://inside.tensor.ru/opendoc.html?guid=55df5f10-14b3-465d-b53e-3783fc9085a0&description=
            //Задача в разработку 22.03.2016 /** * @cfg {String} Разрешено или нет перемещение элементов 'Drag-and-Drop' ...
            //itemsDragNDrop сейчас не обязательно false
            if (this._options.itemsDragNDrop) {
                this._preparePageXY(e);
                DragObject.onDragHandler(e);
                var target = DragObject.getTargetsControl();
                this._getDragContainer().removeClass('controls-dragndrop');
                target = target && cInstance.instanceOfMixin(target, 'SBIS3.CONTROLS/Mixins/DragNDropMixin') ? target : null;
                if (DragObject.isDragging() && ((target === this || DragObject.getOwner() === this))) {
                    //если есть таргет то запускаем _endDrag над таргетом иначе запускаем над тем кто начал
                    var container = this._getDragContainer(e, DragObject.getTargetsDomElement()),
                        inside = container.find(DragObject.getTargetsDomElement()).length > 0 ? true :false;
                    this._endDrag(e, inside);
                }
            }
        },
        /*
        * Возвращает контейнер внутри которого находятся элементы, которые можно перетаскивать
        */
        _getDragContainer : function () {
            return this.getContainer();
        },
        /**
         * Обработчик на событие перемещения курсора - Mousemove, Touchmove.
         * @param {Core/EventObject} buse Дескриптор события.
         * @param {jQuery.Event} e Объект события.
         */
        _onMousemove: function (buse, e) {
            if (this._options.itemsDragNDrop) {
                if (!DragObject.isDragging()) {
                    return;
                }
                this._preparePageXY(e);
                DragObject.onDragHandler(e);

                //если этот контрол начал перемещение или тащат над ним тогда стреяем событием _onDrag
                if (DragObject.getOwner() === this || DragObject.getTargetsControl() === this) {
                    //двигаем компонент
                    this._onDrag(e);
                    return false;
                }
            }
        },
       /**
        * Останавливает распространение клика если элемент бросили над самим собой либо над его родителем
        * @param target
        * @private
        */
       _breakClickBySelf: function (target) {
           if (this._beginDragTarget &&
              (this._beginDragTarget == target || $(target).find(this._beginDragTarget).length > 0)
           ) {
               $(target).one('click', function (event) {
                   event.preventDefault();
                   return false;
               });
           }
       },
       /**
        * Отменяет действие по умолчанию для клика что бы запретить выделение текста
        * @private
        */
       _preventClickEvent: function (e) {
          //preventDefault для touchStart запрещает клик, а текст по touch соытиям не выделяется
          if (e.type == 'mousedown') {
             e.preventDefault();
             //снимаем выделение с текста иначе не будут работать клики а выделение не будет сниматься по клику из за preventDefault
             var sel = window.getSelection();
             if (sel) {
                if (sel.removeAllRanges) {
                   sel.removeAllRanges();
                } else if (sel.empty) {
                   sel.empty();
                }
             }
          }
       },

       _initDragOverlay: function() {
          //Над каждым iframe создаем оверлей над которым будет двигаться курсор перемещения
          $('iframe:visible').each(function(i, frame){
             var rect = frame.getBoundingClientRect(),
                overlay = $('<div class="controls-DragNDropMixin-overlay">');
             overlay.css({
                width: rect.width,
                height: rect.height,
                left: frame.offsetLeft,
                top: frame.offsetTop
             });
             $(frame).parent().prepend(overlay);
          })
       }
    };

    return DragAndDropMixin;
});