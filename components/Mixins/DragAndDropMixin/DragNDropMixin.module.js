/*global $ws, define, $ */
define('js!SBIS3.CONTROLS.DragNDropMixin', [
    "Core/EventBus",
    "js!SBIS3.CONTROLS.DragObject",
    "js!WS.Data/Di",
    "Core/core-instance"
], function ( EventBus,DragObject, Di, cInstance) {
    'use strict';
    /**
     * Миксин, задающий логику перемещения.
     * @remark Чтобы можно было перемещать элементы, нужно вызвать метод _initDrag в обработчиках событий mouseDown и touchStart HTML-элементов, которые надо перемещать. Подробнее {@link _initDrag}
     * @mixin SBIS3.CONTROLS.DragNDropMixin
     * @public
     * @author Крайнов Дмитрий Олегович
     * @see SBIS3.CONTROLS.DragObject
     * @see SBIS3.CONTROLS.DragEntity.Entity
     */
    if (typeof window !== 'undefined') {
        var EventBusChannel = EventBus.channel('DragAndDropChannel');

        // Добавлены события для мультитач-девайсов
        // Для обработки используются уже существующие обработчики,
        // незначительно дополненные
        $(document).bind('mouseup touchend', function(e) {
            EventBusChannel.notify('onMouseup', e);
        });

        $(document).bind('mousemove touchmove', function (e) {
            EventBusChannel.notify('onMousemove', e);
        });

    }
    var DragAndDropMixin = /**@lends SBIS3.CONTROLS.DragNDropMixin.prototype*/{
        $protected: {
            /**
             * @event onBeginDrag При начале перемещения элемента. Если из события вернуть false, то перемещение будет отменено.
             * @param {$ws.proto.EventObject} eventObject Дескриптор события.
             * @param {SBIS3.CONTROLS.DragObject} dragObject Синглтон Drag'n'drop объект.
             * @see SBIS3.CONTROLS.DragObject
             */
            /**
             * @event onDragMove В процессе перемещения элемента, принадлежащего контролу, на каждое изменение его положения. Если из события вернуть false, то стандартное действие будет отменено.
             * @remark Не важно над каким контролом находится элемент, событие происходит у контрола элемент которого перемещают.
             * @param {$ws.proto.EventObject} eventObject Дескриптор события.
             * @param {SBIS3.CONTROLS.DragObject} dragObject Синглтон Drag'n'drop объект.
             * @see SBIS3.CONTROLS.DragObject
             */
            /**
             * @event onDragOver В процессе перемещения элемента над контролом, на каждое изменение его положения. Элемент при этом может принадлежать другому контролу.
             * @remark Событие происходит у контрола над которым сейчас находится курсор мыши или палец, для touch интерфейса.
             * @param {$ws.proto.EventObject} eventObject Дескриптор события.
             * @param {SBIS3.CONTROLS.DragObject} dragObject Синглтон Drag'n'drop объект.
             * @see SBIS3.CONTROLS.DragObject
             */
            /**
             * @event onEndDrag При окончании перемещения элемента. Если из события вернуть false, то стандартное действие будет отменено.
             * @param {$ws.proto.EventObject} eventObject Дескриптор события.
             * @param {SBIS3.CONTROLS.DragObject} dragObject Синглтон Drag'n'drop объект.
             * @see SBIS3.CONTROLS.DragObject
             */

            _options:{
                /**
                 * @cfg {String|Function(): SBIS3.CONTROLS.DragEntity.Entity}  Конструктор перемещаемой сущности.
                 * @example
                 * Зададим конструктор через Di в XHTML:
                 * <pre>
                 *    <component data-component="SBIS3.CONTROLS.ListView" name="listView">
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
                 *    require('SBIS3.CONTROLS.DragEntity.Row', function(Row){
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
            _constShiftLimit: 3
        },
        //region public
        $constructor: function () {
            this._publish('onDragMove', 'onBeginDrag', 'onEndDrag');
            EventBus.channel('DragAndDropChannel').subscribe('onMouseup', this._onMouseupOutside, this);
            EventBus.channel('DragAndDropChannel').subscribe('onMousemove', this._onMousemove, this);
        },

        after: {
            init: function () {
                //touchend всегда срабатывает над тем контейнером с которого начали тащить, поэтому его тут нет
                $(this._getDragContainer()).bind('mouseup', this._onMouseupInside.bind(this));
            },

            destroy: function() {
                EventBus.channel('DragAndDropChannel').unsubscribe('onMouseup', this._onMouseupOutside, this);
                EventBus.channel('DragAndDropChannel').unsubscribe('onMousemove', this._onMousemove, this);
            }
        },

        /**
         * Устанавливает конструктор перемещаемой сущности.
         * @param {SBIS3.CONTROLS.DragEntity.Entity} dragEntityFactory
         * @see SBIS3.CONTROLS.DragEntity.Entity
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
         * @param {SBIS3.CONTROLS.DragObject} dragObject Синглтон Drag'n'drop объект.
         * @param {Boolean} droppable Cработал внутри droppable контейнера см {@link _findDragDropContainer}
         * @param {Event} e Браузерное событие.
         * @see SBIS3.CONTROLS.DragObject
         * @see _findDragDropContainer
         * @example
         * Добавим в рекордсет списочного контрола записи из перемещаемой сущности:
         * <pre>
         *    ...
         *    _endDragHandler: function(dragObject, droppable, e){
          *       if (droppable) {
          *          var items = this.getItems();
          *          dragObject.getSource().each(function(item){
          *             if ($ws.helpers.instanseOfModule(item, 'SBIS3.CONTROLS.DragEntity.Row')){
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
         * @param {SBIS3.CONTROLS.DragObject} dragObject Синглтон Drag'n'drop объект.
         * @param {Event} e Браузерное событие.
         * @see SBIS3.CONTROLS.DragObject
         */
        _onDragHandler: function(dragObject, e) {

        },
        /**
         * Срабатывает при начале перемещения. Если вернуть false, перемещение не начнется.
         * @remark Определяется в модуле, который подмешивает миксин. Если контрол взамодействует с другими контролами через Drag'n'drop
         * то этот метод должен определить, что перемещает пользователь и установить в dragObject (см метод {@link SBIS3.CONTROLS.DragObject#setSource}).
         * @param {SBIS3.CONTROLS.DragObject} dragObject Синглтон Drag'n'drop объект.
         * @param {Event} e Браузерное событие.
         * @see SBIS3.CONTROLS.DragObject
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
         * @param {SBIS3.CONTROLS.DragObject} dragObject Синглтон Drag'n'drop объект.
         * @param {Event} e Браузерное событие.
         * @returns {String}
         * @see SBIS3.CONTROLS.DragObject
         */
        _createAvatar: function(dragObject, e) {

        },
        /**
         * Обновляет target в dragObject {@link SBIS3.CONTROLS.DragObject#getTarget}.
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
         * @param {SBIS3.CONTROLS.DragObject} dragObject Синглтон Drag'n'drop объект.
         * @param {Event} e Браузерное событие
         * @see SBIS3.CONTROLS.DragObject
         */
        _updateDragTarget: function(dragObject, e) {

        },
        /**
         * Возвращает контейнер, в котором лежат элементы.
         * @remark Если элемент бросили за пределами этого контейнера, то target (DragObject.getDragTarget()) будет пустой. Определяется в модуле, который подмешивает миксин.
         * @example
         * Пусть у нашего контрола такая верcтка:
         * <pre>
         *    <div>
         *       <h2>Заголовок</h2>
         *       <ul class="items-list">
         *          <li>Первый</li>
         *          <li>Второй</li>
         *       </ul>
         *    </div>
         * </pre>
         * тогда этот метод должен вернуть ul:
         * <pre>
         *    _findDragDropContainer (){
          *       return this.getContainer().find('ul');
          *    }
         * </pre>
         * @param {Event} e Браузерное событие.
         * @param {html} target DOM объект в котором надо искать Drag'n'drop контейнер.
         * @returns {html}
         * @private
         */
        _findDragDropContainer: function (e, target) {

        },
        //endregion handlers

        //region protected

        /**
         * Показывает аватар
         * @param  {Event} e Браузерное событие.
         * @private
         */
        _showAvatar: function(e) {
            var avatar = this._createAvatar(DragObject, e);
            DragObject.setAvatar(avatar);
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
         * @param {Event} clickEvent Браузерное событие.
         */
        _initDrag: function(clickEvent) {
            var
                self = this,
                dragStrarter = function(bus, moveEvent){
                    self._preparePageXY(moveEvent);
                    if (self._isDrag(moveEvent, clickEvent)) {
                        self._beginDrag(clickEvent);
                        EventBus.channel('DragAndDropChannel').unsubscribe('onMousemove', dragStrarter);
                    }
                };
            this._preparePageXY(clickEvent);
            EventBus.channel('DragAndDropChannel').subscribe('onMousemove', dragStrarter);
            EventBus.channel('DragAndDropChannel').once('onMouseup', function(){
                EventBus.channel('DragAndDropChannel').unsubscribe('onMousemove', dragStrarter);
            });

        },
        /**
         * Начало перемещения.
         * @param {Event} e Браузерное событие.
         */
        _beginDrag: function (e) {
            if (this._options.itemsDragNDrop) {
                DragObject.setDragging(true);
                DragObject.onDragHandler(e);
                if (this._beginDragHandler(DragObject, e) !== false) {
                    if (this._notify('onBeginDrag', DragObject, e) !== false) {
                        $('body').addClass('dragdropBody ws-unSelectable');
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
         * @param {Event} e Браузерное событие.
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
         * @param {Event} moveEvent Браузерное событие.
         * @param {Event} clickEvent Браузерное событие.
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
         * @param {Event} e Браузерное событие.
         * @param {Boolean} droppable Закончили над droppable контейнером.
         * @private
         */
        _endDrag: function (e, droppable) {
            //После опускания мыши, ещё раз позовём обработку перемещения, т.к. в момент перед отпусканием мог произойти
            //переход границы между сменой порядкового номера и перемещением в папку, а обработчик перемещения не вызваться,
            //т.к. он срабатывают так часто, насколько это позволяет внутренняя система взаимодействия с мышью браузера.
            if (droppable || e.type == "touchend") { //запускаем только если сработало внутри droppable контейнера, иначе таргета нет и нечего обновлять
                //touchend всегда срабатывает не над droppable контейнером, так что для него запускаем всегда
                this._updateDragTarget(DragObject, e);
            }
            DragObject.setDragging(false);
            var res = this._notify('onEndDrag', DragObject, e);
            if (res !== false) {
                this._endDragHandler(DragObject, droppable, e);
            }

            DragObject.reset();
            this._position = null;
            $('body').removeClass('dragdropBody cantDragDrop ws-unSelectable');
        },

        /**
         * Создает сущность перемещения.
         * @param {Object} options Объект с опциями которые будут переданы в конструктор сущности.
         * @returns {SBIS3.CONTROLS.DragEntity.Entity}
         * @see SBIS3.CONTROLS.DragEntity.Entity
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
         * @param {Event} e Браузерное событие.
         * @private
         */
        _onDrag: function (e) {
            var
                targetsControl = DragObject.getTargetsControl(),
                res;

            if (targetsControl === this) {
                this._updateDragTarget(DragObject, e);
                res = this._notify('onDragOver', DragObject, e);
            }
            if (DragObject.getOwner() === this) {
                this._notify('onDragMove', DragObject, e);
            }
            if (res !== false) {
                this._onDragHandler(DragObject, e);
            }
        },
        /**
         * Срабывает когда отпустили мышь внутри контрола.
         * @param {Event} e Браузерное событие.
         */
        _onMouseupInside: function (e) {
            this._mouseUp(e, true);
        },
        /**
         * Срабывает когда отпустили мышь за пределами контрола.
         * @param {$ws.proto.EventObject} buse Дескриптор события.
         * @param {Event} e Браузерное событие.
         */
        _onMouseupOutside: function(buse, e) {
            this._mouseUp(e, false);
        },
        /**
         * Обработчик на событие браузера - Mouseup, Touchend.
         * @param {Event} e Браузерное событие.
         * @param {Boolean} inside Признак того что перемещение закончилось внутри контрола.
         */
        _mouseUp: function(e, inside) {
            //todo разобраться с опцией выключения dragndrop
            //https://inside.tensor.ru/opendoc.html?guid=55df5f10-14b3-465d-b53e-3783fc9085a0&description=
            //Задача в разработку 22.03.2016 /** * @cfg {String} Разрешено или нет перемещение элементов 'Drag-and-Drop' ...
            //itemsDragNDrop сейчас не обязательно false
            if (this._options.itemsDragNDrop) {
                this._preparePageXY(e);
                DragObject.onDragHandler(e);
                var target = DragObject.getTargetsControl();
                target = target && cInstance.instanceOfMixin(target, 'SBIS3.CONTROLS.DragNDropMixin') ? target : null;
                if (DragObject.isDragging() && ((target === this || !target && DragObject.getOwner() === this) || inside)) {
                    //если есть таргет то запускаем _endDrag над таргетом иначе запускаем над тем кто начал
                    this._endDrag(e, inside ? this._findDragDropContainer(e, DragObject.getTargetsDomElemet()) : false);
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
         * @param {$ws.proto.EventObject} buse Дескриптор события.
         * @param {Event} e Браузерное событие.
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
        }

        //endregion mouseHandler
    };

    return DragAndDropMixin;
});