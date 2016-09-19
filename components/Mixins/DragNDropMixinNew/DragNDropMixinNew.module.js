/*global $ws, define, $ */
define('js!SBIS3.CONTROLS.DragNDropMixinNew', [
   'js!SBIS3.CONTROLS.DragObject',
   'js!WS.Data/Di'
], function (DragObject, Di) {
   'use strict';
   /**
    * Миксин задающий логику перетаскивания.
    * @remark Для того что бы можно было перетаскивать элементы нужно повесить метод _initDrag на mouseDown, touchStart html элементов которые надо перетаскивать
    * @mixin SBIS3.CONTROLS.DragNDropMixinNew
    * @public
    * @author Крайнов Дмитрий Олегович
    * @see SBIS3.CONTROLS.DragObject
    * @see SBIS3.CONTROLS.DragEntity.Entity
    */
   if (typeof window !== 'undefined') {
      var EventBusChannel = $ws.single.EventBus.channel('DragAndDropChannel');

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
   var

      buildTplArgsLV = function (cfg) {
         var tplOptions = cfg._buildTplArgsSt.call(this, cfg);
         tplOptions.multiselect = cfg.multiselect;
         tplOptions.decorators = this._decorators;
         tplOptions.colorField = cfg.colorField;

         return tplOptions;
      },
      DragAndDropMixin = /**@lends SBIS3.CONTROLS.DragNDropMixinNew.prototype*/{
         $protected: {
            /**
             * @event onBeginDrag Срабатывает когда начинают тащить элемент. Если из события вернуть false то перетаскивание будет отменено
             * @param {$ws.proto.EventObject} eventObject Дескриптор события.
             * @param {SBIS3.CONTROLS.DragObject} dragObject Синглтон объект dragndrop.
             * @see SBIS3.CONTROLS.DragObject
             */
            /**
             * @event onDragMove Срабатывает когда тащат элемент контрола, на каждое перемещение.
             * @param {$ws.proto.EventObject} eventObject Дескриптор события.
             * @param {SBIS3.CONTROLS.DragObject} dragObject Синглтон объект dragndrop.
             * @see SBIS3.CONTROLS.DragObject
             */
            /**
             * @event onDragOver Срабатывает когда элемент тащат над контролом, элемент может принадлежать другому контролу.
             * @param {$ws.proto.EventObject} eventObject Дескриптор события.
             * @param {SBIS3.CONTROLS.DragObject} dragObject Синглтон объект dragndrop.
             * @see SBIS3.CONTROLS.DragObject
             */
             /**
             * @event onEndDrag Срабатывает когда перестали тащить элемент
             * @param {$ws.proto.EventObject} eventObject Дескриптор события.
             * @param {SBIS3.CONTROLS.DragObject} dragObject Синглтон объект dragndrop.
             * @see SBIS3.CONTROLS.DragObject
             */

            _options:{
               /**
                * @cfg {string|SBIS3.CONTROLS.DragEntity.Entity}  Конструктор сущности перемещения
                * @example
                * Зададим конструктор через di в xhtml
                * <pre>
                *    <component data-component="SBIS3.CONTROLS.ListView" name="listView">
                *       <option name="dragEntity">dragentity.row</option>
                *    </component>
                * </pre>
                * Зададим конструктор через di в js
                * <pre>
                *    new ListView({
                *       dragEntity: 'dragentity.row'
                *    })
                * </pre>
                * или так
                * <pre>
                *    require('SBIS3.CONTROLS.DragEntity.Row', function(Row){
                *       new ListView({
                *          dragEntity: Row
                *       })
                *    })
                * </pre>
                * @see setDragEntity
                */
               dragEntity: ''
            },
            /**
             * @var {integer} Константа показывающая на сколько надо сдвинуть мышь, чтобы началось перемещение
             */
            _constShiftLimit: 3
         },
         //region public
         $constructor: function () {
            this._publish('onDragMove', 'onBeginDrag', 'onEndDrag');
            $ws.single.EventBus.channel('DragAndDropChannel').subscribe('onMouseup', this._onMouseupOutside, this);
            $ws.single.EventBus.channel('DragAndDropChannel').subscribe('onMousemove', this._onMousemove, this);
         },

         after: {
            init: function () {
               //touchend всегда срабатывает над тем контейнером с которого начали тащить, поэтому его тут нет
               $(this.getContainer()).bind('mouseup', this._onMouseupInside.bind(this));
            }
         },

         /**
          * Устанавливает конструктор сущностей перемещения
          * @param {SBIS3.CONTROLS.DragEntity.Entity} dragEntityFactory
          * @see SBIS3.CONTROLS.DragEntity.Entity
          */
         setDragEntity: function(dragEntityFactory) {
            this._options.dragEntity = dragEntityFactory;
         },
         //endregion public

         //region handlers
         /**
          * Метод срабатывает на окончание перетаскивания, должен быть определен в контроле который реализует миксин
          * @param {SBIS3.CONTROLS.DragObject} dragObject
          * @param {Boolean} droppable сработал внутри droppable контейнера см _findDragDropContainer
          * @param {Event} e объект события браузера
          * @see SBIS3.CONTROLS.DragObject
          * @see _findDragDropContainer
          * @example
          * <pre>
          *    ...
          *    _endDragHandler: function(dragObject, droppable, e){
          *       if (droppable) {
          *          dragObject.getSource().each(function(item){
          *             if ($ws.helpers.instanseOfModule(item, 'SBIS3.CONTROLS.DragEntity.Row')){
          *                this.add(item.getModel());
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
          * Метод срабатывает при перетаскивании, на каждое перемещение, должен быть определен в контроле который реализует миксин
          * @param {SBIS3.CONTROLS.DragObject} dragObject
          * @param {Event} e объект события браузера
          * @see SBIS3.CONTROLS.DragObject
          */
         _onDragHandler: function(dragObject, e) {

         },
         /**
          * Метод срабатывает на начало перетаскивания, должен быть определен в контроле который реализует миксин.
          * Он должен определить что перетаскивают и положить в dragObject, см метод setSource. Либо вернуть false.
          * @param {SBIS3.CONTROLS.DragObject} dragObject
          * @param {Event} e объект события браузера
          * @see SBIS3.CONTROLS.DragObject
          * @returns {Boolean} если вернуть false перетаскивание не начнется
          */
         _beginDragHandler: function(dragObject, e) {

         },
         /**
          * Метод должен вернуть html строку содержащую аватар, иконка которая отображается около курсора мыши при перетаскивании
          * @example
          * <pre>
          *   ...
          *   _createAvatar: function(){
          *      return '<div class="icon-16 icon-Skeleton icon-error"></div>';
          *   }
          *   ...
          * </pre>
          * @param {SBIS3.CONTROLS.DragObject} dragObject
          * @param {Event} e объект события браузера
          * @returns {String}
          * @see SBIS3.CONTROLS.DragObject
          */
         _createAvatar: function(dragObject, e) {

         },
         /**
          * Метод должен обновлять target в dragObject, срабатывает раньше пользовательских событий onEndDrag, onDragMove
          * нужен для того чтобы у пользователя был актуальный target, когда стреляют события.
          * <pre>
          *    <div>
          *       <div class="item" data-id="1">Первый</div>
          *       <div class="item" data-id="2">Второй</div>
          *       <div class="item" data-id="3">Третий</div>
          *    </div>
          * </pre>
          * <pre>
          *    ...
          *    _updateDragTarget: function(dragObject) {
          *       var row = dragObject.getTargetsDomElement(),
          *          target = null;
          *       if (row.hasClass('item')){
          *          target = this._makeDragEntity({
          *             owner: this,
          *             id: row.data('id')
          *          })
          *       }
          *       dragObject.setDragTarget(target)
          *    }
          *    ...
          * </pre>
          * @param {SBIS3.CONTROLS.DragObject} dragObject
          * @param {Event} e Объект события браузера
          * @see SBIS3.CONTROLS.DragObject
          */
         _updateDragTarget: function(dragObject, e) {

         },
         /**
          * Возвращает контейнер в котором лежат элементы.
          * Если элемент бросили за пределами этого контейнера то таргет (DragObject.getDragTarget()) будет пустой
          * @example
          * Пусть у нашего контрола такая верcтка
          * <pre>
          *    <div>
          *       <h2>Заголовок</h2>
          *       <ul class="items-list">
          *          <li>Первый</li>
          *          <li>Второй</li>
          *       </ul>
          *    </div>
          * </pre>
          * тогда этот метод должен вернуть ul
          * <pre>
          *    _findDragDropContainer (){
          *       return this.getContainer().find('ul');
          *    }
          * </pre>
          * @param {Event} e объект события браузера
          * @param {html} target html объект в котором надо искать dragndrop контейнер
          * @returns {html}
          * @private
          */
         _findDragDropContainer: function (e, target) {

         },
         //endregion handlers

         //region protected

         /**
          * Показывает аватар
          * @param  {Event} e Объект события браузера
          * @private
          */
         _showAvatar: function(e) {
            var avatar = this._createAvatar(DragObject, e);
            DragObject.setAvatar(avatar);
         },
         /**
          * Метод который начинет перетаскивание, его на повесить на onMouseDown, touchStart тем элементам которые можно перетаскивать
          * @example
          * Допустим у нашего контрола такая верстка
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
          * и мы хотим перетаскивать только строки с классом item
          * <pre>
          *    ...
          *    _onInit: function(){
          *       this.getContainer().on('mousedown', '.item', this._initDrag.bind(this))
          *    }
          *    ...
          * </pre>
          * @param {Event} clickEvent объект события браузера
          */
         _initDrag: function(clickEvent) {
            var
               self = this,
               dragStrarter = function(bus, moveEvent){
                  self._preparePageXY(moveEvent);
                  if (self._isDrag(moveEvent, clickEvent)) {
                     self._beginDrag(clickEvent);
                     $ws.single.EventBus.channel('DragAndDropChannel').unsubscribe('onMousemove', dragStrarter);
                  }
               };
            this._preparePageXY(clickEvent);
            $ws.single.EventBus.channel('DragAndDropChannel').subscribe('onMousemove', dragStrarter);
            $ws.single.EventBus.channel('DragAndDropChannel').once('onMouseup', function(){
               $ws.single.EventBus.channel('DragAndDropChannel').unsubscribe('onMousemove', dragStrarter);
            });

         },
         /**
          * Начало перетаскивания
          * @param {Event} e объект события браузера
          */
         _beginDrag: function(e) {
            DragObject.reset();
            DragObject.onDragHandler(e);
            if (this._beginDragHandler(DragObject, e) !== false) {
               $('body').addClass('dragdropBody ws-unSelectable');
               if (this._notify('onBeginDrag', DragObject, e) !== false) {
                  this._showAvatar(e);
                  DragObject.setOwner(this);
                  DragObject.setDragging(true);
               }
            }

         },
         /**
          * вытаскивает координаты нажатия для tuch событий так же как для событий мыши
          * @param {Event} e объект события браузера
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
          * Метод определяет был ли сдвиг или просто кликнули по элементу
          * @param {Event} moveEvent объект события браузера
          * @param {Event} clickEvent объект события браузера
          * @returns {boolean} если true то было смещение
          * @private
          */
         _isDrag: function(moveEvent, clickEvent) {
            var
               moveX = e.pageX - clickEvent._moveBeginX,
               moveY = e.pageY - clickEvent._moveBeginY;

            if ((Math.abs(moveX) < this._constShiftLimit) && (Math.abs(moveY) < this._constShiftLimit)) {
               return false;
            }
            return true;
         },

         /**
          * Конец перетаскивания
          * @param {Event} e объект события браузера
          * @param {Boolean} droppable Закончили над droppable контейнером
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
            var res = this._notify('onEndDrag', DragObject, e);
            if (res !== false) {
               this._endDragHandler(DragObject, droppable, e);
            }

            DragObject.reset();
            this._position = null;
            DragObject.setDragging(false);
            $('body').removeClass('dragdropBody cantDragDrop ws-unSelectable');
         },

         /**
          * Создает сущность перемещения.
          * @param {Object} options Объект с опциями которые будут переданы в конструктор сущности
          * @returns {*}
          * @see SBIS3.CONTROLS.DragEntity.Entity
          */
         _makeDragEntity: function(options) {
            return  Di.resolve(this._options.dragEntity, options);
         },
         //endregion protected
         //region mouseHandler
         /**
          * Обработчик на Mousemove
          * @param {Event} e объект события браузера
          * @private
          */
         _onDrag: function (e) {
            this._updateDragTarget(DragObject, e);
            var eventName = DragObject.getOwner() === this ? 'onDragMove' : 'onDragOver';
            var res = this._notify(eventName, DragObject, e);
            if (res !== false) {
               this._onDragHandler(DragObject, e);
            }
         },
         /**
          * Срабывает когда отпустили мышь внутри контрола
          * @param {Event} e объект события браузера
          */
         _onMouseupInside: function (e) {
            this._mouseUp(e, true);
         },
         /**
          * Срабывает когда отпустили мышь за пределами контрола
          * @param {$ws.proto.EventObject} buse
          * @param {Event} e объект события браузера
          */
         _onMouseupOutside: function(buse, e) {
            this._mouseUp(e, false);
         },
         /**
          * Обработчик на onMouseUp
          * @param {Event} e объект события браузера
          * @param {Boolean} inside
          */
         _mouseUp: function(e, inside){
            this._preparePageXY(e);
            DragObject.onDragHandler(e);
            var target = DragObject.getTargetsControl();
            target = target && $ws.helpers.instanceOfMixin(target, 'SBIS3.CONTROLS.DragNDropMixinNew') ? target : null;
            if (DragObject.isDragging() && ((target === this || !target && DragObject.getOwner() === this) || inside)) {
               //если есть таргет то запускаем _endDrag над таргетом иначе запускаем над тем кто начал
               this._endDrag(e, inside ? this._findDragDropContainer(e, DragObject.getTargetsDomElemet()) : false);
            }
            this._moveBeginX = null;
            this._moveBeginY = null;
         },
         /**
          * Обработчик  на перемещение мыши
          * @param {$ws.proto.EventObject} buse
          * @param {Event} e объект события браузера
          */
         _onMousemove: function (buse, e) {
            // Если нет выделенных компонентов, то уходим
            if (!DragObject.isDragging()) {
               return;
            }
            this._preparePageXY(e);
            DragObject.onDragHandler(e);

            //если этот контрол начал перемещение или тащат над ним тогда стреяем событием _onDrag
            if (DragObject.getOwner() === this || DragObject.getTargetsControl() === this ) {
               //двигаем компонент
               this._onDrag(e);
               return false;
            }
         }

         //endregion mouseHandler
      };

   return DragAndDropMixin;
});