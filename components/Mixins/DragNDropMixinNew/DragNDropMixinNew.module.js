/*global $ws, define, $ */
define('js!SBIS3.CONTROLS.DragNDropMixinNew', [
   'js!SBIS3.CONTROLS.DragObject',
   'js!WS.Data/Di'
], function (DragObject, Di) {
   'use strict';
   /**
    * Миксин задающий логику перетаскивания
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
             * @event onBeginDrag Срабатывает когда инициализируется dragndrop. Если из события вернуть false то перетаскивание будет отменено
             * @param {$ws.proto.EventObject} eventObject Дескриптор события.
             * @param {SBIS3.CONTROLS.DragObject} dragObject Синглтон объект перемещения.
             */
            /**
             * @event onEndDrag Срабатывает когда элемент бросили
             * @param {$ws.proto.EventObject} eventObject Дескриптор события.
             * @param {SBIS3.CONTROLS.DragObject} dragObject Синглтон объект перемещения.
             */
            /**
             * @event onDragMove Срабатывает когда перетаскивают элемент этого контрола либо когда курсор мыши находится над контролом
             * @param {$ws.proto.EventObject} eventObject Дескриптор события.
             * @param {SBIS3.CONTROLS.DragObject} dragObject Синглтон объект перемещения.
             */
            _options:{
               dragEntity: undefined
            },
            _moveBeginX: null,
            _moveBeginY: null,
            //константа показывающая на сколько надо сдвинуть мышь, чтобы началось перемещение
            _constShiftLimit: 3,
            _dragEntity: undefined
         },
         //region public
         $constructor: function () {
            this._publish('onDragMove', 'onBeginDrag', 'onEndDrag');
            $ws.single.EventBus.channel('DragAndDropChannel').subscribe('onMouseup', this._onMouseupOutside, this);
            $ws.single.EventBus.channel('DragAndDropChannel').subscribe('onMousemove', this._onMousemove, this);
         },

         after: {
            init: function () {
               $(this.getContainer()).bind('mouseup touchend', this._onMouseupInside.bind(this));
            }
         },

         /**
          * проверяет наличие контейнера
          * @param element
          * @returns {jQuery}
          */
         isDragDropContainer: function (element) {
            return $(element).hasClass('genie-dragdrop');
         },

         /**
          *
          * @param dragEntityFactory
          */
         setDragEntity: function(dragEntityFactory) {
            this._options.dragEntity = dragEntityFactory;
            this._dragEntity = undefined;
         },
         //endregion public

         //region handlers
         _dropCache: function () {
         },
         /**
          * обработчик на Mousemove
          * @param e
          * @param element
          * @private
          */
         _onDrag: function (e, movable) {
            this._updateDragTarget(DragObject, e);
            var res = this._notify('onDragMove', DragObject, e);
            if (res !== false) {
              this._onDragHandler(DragObject, e);
            }
         },
         /**
          * оработчик на MoveOut
          * @param e
          * @param target
          * @private
          */
         _callMoveOutHandler: function (e) {
            throw new Error('Method callMoveOutHandler must be implemented');
         },
         /**
          * стандартный поиск контейнера
          * @param e
          * @param target
          * @returns {*}
          * @private
          */
         _findDragDropContainerStandart: function (e, target) {
            var elem = target;
            while (elem !== null && (!($(elem).hasClass('genie-dragdrop')))) {
               elem = elem.parentNode;
            }
            return elem;
         },
         /**
          * шаблонный метод endDropDown
          */
         _endDragHandler: function(dragObject, e) {

         },
         /**
          * шаблонный метод endDropDown
          */
         _onDragHandler: function(dragObject, e) {

         },
         /**
          * шаблонный метод beginDropDown
          */
         _beginDragHandler: function(dragObject, e) {

         },
         /**
          * Метод должен создать JQuery объект в котором будет лежать аватар
          * @returns {JQuery}
          */
         _createAvatar: function(dragObject, e) {

         },
         /**
          *
          */
         _updateDragTarget: function(dragObject, e) {

         },

         //endregion handlers

         //region protected
         /**
          * ищет контейнер
          * @param e
          * @param target
          * @returns {*}
          * @private
          */
         _findDragDropContainer: function (e, target) {
            return this._findDragDropContainerStandart(e, target);
         },

         /**
          * создает аватар
          * @param  {Event} e
          * @private
          */
         _showAvatar: function(e) {
            var avatar = this._createAvatar(DragObject, e);
            DragObject.setAvatar(avatar);
         },
         /**
          * инициализирует dragendrop
          * @param clickEvent
          * @private
          */
         _initDrag: function(clickEvent) {
            var
               self = this,
               dragStrarter = function(bus, moveEvent){
                  if (self._isDrag(moveEvent)) {
                     self._beginDrag(clickEvent);
                     $ws.single.EventBus.channel('DragAndDropChannel').unsubscribe('onMousemove', dragStrarter);
                  }
               };
            this._moveBeginX = clickEvent.pageX;
            this._moveBeginY = clickEvent.pageY;
            $ws.single.EventBus.channel('DragAndDropChannel').subscribe('onMousemove', dragStrarter);
            $ws.single.EventBus.channel('DragAndDropChannel').once('onMouseup', function(){
               $ws.single.EventBus.channel('DragAndDropChannel').unsubscribe('onMousemove', dragStrarter);
            });

         },
         /**
          * Начало перетаскивания
          * @param e
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
          * Метод определяет был ли сдвиг или просто кликнули по элементу
          * @param e
          * @returns {boolean} если true то было смещение
          * @private
          */
         _isDrag: function(e) {
            var
               moveX = e.pageX - this._moveBeginX,
               moveY = e.pageY - this._moveBeginY;

            if ((Math.abs(moveX) < this._constShiftLimit) && (Math.abs(moveY) < this._constShiftLimit)) {
               return false;
            }
            return true;
         },

         /**
          * Конец перетаскивания
          * @param {Event} e js событие
          * @param {Boolean} droppable Закончили над droppable контейнером
          * @private
          */
         _endDrag: function (e, droppable) {
            DragObject.onDragHandler(e);
            //После опускания мыши, ещё раз позовём обработку перемещения, т.к. в момент перед отпусканием мог произойти
            //переход границы между сменой порядкового номера и перемещением в папку, а обработчик перемещения не вызваться,
            //т.к. он срабатывают так часто, насколько это позволяет внутренняя система взаимодействия с мышью браузера.
            if (droppable) { //запускаем только если сработало внутри droppable контейнера, иначе таргета нет и нечего обновлять
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
          */
         _makeDragEntity: function(options) {
            return  Di.resolve(this._options.dragEntity, options);
         },
         //endregion protected
         //region mouseHandler
         /**
          * Срабывает когда отпустили мышь внутри контрола
          * @param {Event} e
          */
         _onMouseupInside: function (e) {
            this._mouseUp(e, true);
         },
         /**
          * Срабывает когда отпустили мышь за пределами контрола
          * @param buse
          * @param e
          */
         _onMouseupOutside: function(buse, e) {
            this._mouseUp(e, false);
         },

         _mouseUp: function(e, inside){
            var target = DragObject.getTargetsControl();
            target = target && $ws.helpers.instanceOfMixin('SBIS3.CONTROLS.DragNDropMixinNew', target) ? target : null;
            if (DragObject.isDragging() && ((target === this || !target && DragObject.getOwner() === this) || inside)) {
               //если есть таргет то запускаем _endDrag над таргетом иначе запускаем над тем кто начал
               this._endDrag(e, inside ? this._findDragDropContainer(e, e.target) : false);
            }
            this._moveBeginX = null;
            this._moveBeginY = null;
         },
         /**
          * Обработчик  на перемещение мыши
          * @param buse
          * @param e
          * @returns {boolean}
          */
         _onMousemove: function (buse, e) {
            // Если нет выделенных компонентов, то уходим
            if (!DragObject.isDragging()) {
               return;
            }
            DragObject.onDragHandler(e);

            //если этот контрол начал перемещение или тащат над ним тогда стреяем событием _onDrag
            if (DragObject.getOwner() === this || DragObject.getTargetsControl() === this ) {
               var
                  //определяем droppable контейнер
                  movable = this._findDragDropContainer(e, e.target);
               //двигаем компонент
               this._onDrag(e, movable);
               return false;
            }
         }

         //endregion mouseHandler
      };

   return DragAndDropMixin;
});