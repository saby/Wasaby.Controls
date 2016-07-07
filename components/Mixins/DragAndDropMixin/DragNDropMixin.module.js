/*global $ws, define, $ */
define('js!SBIS3.CONTROLS.DragNDropMixin', ['js!SBIS3.CONTROLS.DragObject'], function (DragObject) {
   'use strict';

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
      DRAG_AVATAR_OFFSET = 5,
      buildTplArgsLV = function (cfg) {
         var tplOptions = cfg._buildTplArgsSt.call(this, cfg);
         tplOptions.multiselect = cfg.multiselect;
         tplOptions.decorators = this._decorators;
         tplOptions.colorField = cfg.colorField;

         return tplOptions;
      },
      DragAndDropMixin = {
         $protected: {
            _moveBeginX: null,
            _moveBeginY: null,
            _shiftX: null,
            _shiftY: null,

            //текущий перемещаемый объект
            _currentComponent: null,
            //константа показывающая на сколько надо сдвинуть мышь, чтобы началось перемещение
            _constShiftLimit: 3,

            _position: null,
            _lines: []
         },
         //region public
         $constructor: function () {
            this._publish(['onDrag', 'onDragBegin', 'onDragEnd']);
            $ws.single.EventBus.channel('DragAndDropChannel').subscribe('onMouseup', this.onMouseupOutside, this);
            $ws.single.EventBus.channel('DragAndDropChannel').subscribe('onMousemove', this.onMousemove, this);
         },

         init: function(){
            $(this.getContainer()).bind('mouseup touchend', this.onMouseupInside.bind(this));
         },

         _getDragItems: function(key) {
            var keys = this._options.multiselect ? $ws.core.clone(this.getSelectedKeys()) : [];
            if (Array.indexOf(keys, key) === -1 && Array.indexOf(keys, String(key)) === -1) {
               keys.push(key);
            }
            return keys;
         },
         _canDragStart: function(e) {
            //TODO: При попытке выделить текст в поле ввода, вместо выделения начинается перемещения элемента.
            //Как временное решение добавлена проверка на SBIS3.CONTROLS.TextBoxBase.
            //Необходимо разобраться можно ли на уровне TextBoxBase или Control для события mousedown
            //сделать stopPropagation, тогда от данной проверки можно будет избавиться.
            return !this.isDragging() && this._options.enabled && !$ws.helpers.instanceOfModule($(e.target).wsControl(), 'SBIS3.CONTROLS.TextBoxBase');
         },



         preparePageXY: function (e) {
            if (e.type === "touchstart" || e.type === "touchmove") {
               e.pageX = e.originalEvent.touches[0].pageX;
               e.pageY = e.originalEvent.touches[0].pageY;
            }
         },

         /**
          * текущий активный компонент, либо по gdi (если переносим)
          * либо отдаем тип, если создаем из палитры
          * @param {Event} e
          * @param {Object} elementConfig
          */
         setCurrentElement: function (e, Source) {
            //координаты с которых начато движение
            this.preparePageXY(e);
            this._moveBeginX = e.pageX;
            this._moveBeginY = e.pageY;
            DragObject.setSource(Source);
            this._dropCache();
         },

         /**
          * Возвращает контрол с которого тащат элемент
          * @returns {*}
          */
         getDragOwner: function () {
            return DragObject.getOwner();
         },

         /**
          * Идет ли сейчас перетаскивание
          * @returns {*}
          */
         isDragging: function () {
            return DragObject.isDragging();
         },

         /**
          * проверяет наличие контейнера
          * @param element
          * @returns {*|jQuery}
          */
         isDragDropContainer: function (element) {
            return $(element).hasClass('genie-dragdrop');
         },
         /**
          * возвращает аватар
          * @returns {*}
          */
         getDragAvatar: function() {
            return DragObject.getAvatar();
         },
         /**
          * устанавливает аватар
          * @param {JQuery} avatar
          */
         setDragAvatar: function(avatar) {
            DragObject.setAvatar(avatar);
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
         _onDrag: function (e, element) {
            var res = this._notify('onDrag', DragObject, e);
            if (res !== false) {
              this._onDragHandler(e);
            }
            this._setAvatarPosition(e);
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
          * шаблонныйц метод endDropDown
          */
         _endDragHandler: function(e, dragObject){

         },
         /**
          * шаблонныйц метод endDropDown
          */
         _onDragHandler: function(e, dragObject) {

         },
         /**
          * шаблонныйц метод beginDropDown
          */
         _beginDragHandler: function(e, dragObject){

         },
         /**
          * Метод должен создать JQuery объект в котором будет лежать аватар
          * @returns {JQuery}
          */
         _createAvatar: function() {

         },
         /**
          *
          * @private
          */
         _getDragSource: function(){

         },
         /**
          *
          * @private
          */
         _getDragTarget: function(){

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
            var avatar = this._createAvatar();
            this.setDragAvatar(avatar);
            this._setAvatarPosition(e);
         },

         /**
          * устанавливает позицию аватара
          * @param  {Event} e
          * @private
          */
         _setAvatarPosition: function(e){
            //смещение нужно чтобы событие onmouseup сработало над контролом, а не над аватаром
            if (DragObject.getAvatar()) {
               DragObject.getAvatar().css({
                  'left': e.pageX + DRAG_AVATAR_OFFSET,
                  'top': e.pageY + DRAG_AVATAR_OFFSET
               });
            }
         },
         /**
          * Начало перетаскивания
          * @param e
          * @param movable
          */
         _beginDrag: function(e, movable) {
            this.preparePageXY(e);
            var
               moveX = e.pageX - this._moveBeginX,
               moveY = e.pageY - this._moveBeginY;

            //начинаем движение только если сдвинули сильно
            if ((Math.abs(moveX) < this._constShiftLimit) && (Math.abs(moveY) < this._constShiftLimit)) {
               return;
            }
            DragObject.reset();
            if (this._beginDragHandler(e, movable) !== false) {
               if (this._notify('onDragBegin', e, movable) !== false) {
                  this._showAvatar(e);
                  DragObject.setSource(
                     this._getDragSource(e)
                  );
                  DragObject.setDragging(true);
               }
            }
            //TODO: Сейчас появилась проблема, что если к компьютеру подключен touch-телевизор он не вызывает
            //preventDefault и при таскании элементов мышкой происходит выделение текста.
            //Раньше тут была проверка !$ws._const.compatibility.touch и preventDefault не вызывался для touch устройств
            //данная проверка была добавлена, потому что когда в строке были отрендерены кнопки, при нажатии на них
            //и выполнении preventDefault впоследствии не вызывался click. Написал демку https://jsfiddle.net/9uwphct4/
            //с воспроизведением сценария, на iPad и Android click отрабатывает. Возможно причина была ещё в какой-то
            //ошибке. При возникновении ошибок на мобильных устройствах нужно будет добавить проверку !$ws._const.browser.isMobilePlatform.
            e.preventDefault();
         },

         /**
          * Конец перетаскивание
          * @param {Event} e js событие
          * @param {Boolean} droppable Закончили над droppable контейнером
          * @private
          */
         _endDrag: function (e, droppable) {
            var res = this._notify('onDragEnd', DragObject, e);
            if (res !== false) {
               this._endDragHandler(e, DragObject);
            }

            DragObject.reset();
            this._position = null;
            DragObject.setDragging(false);
            $('body').removeClass('dragdropBody cantDragDrop');
         },
         //endregion protected
         //region mouseHandler
         /**
          *
          * @param e
          */
         onMouseupInside: function (e) {
            //определяем droppable контейнер
            if (this.isDragging()) {
               var droppable = this._findDragDropContainer(e, e.target);
               this._endDrag(e, droppable);
            }
         },

         onMouseupOutside: function(buse, e) {
            if (this.isDragging()) {
               this._endDrag(e, false);
            }
         },
         /**
          *
          * @param buse
          * @param e
          * @returns {boolean}
          */
         onMousemove: function (buse, e) {
            // Если нет выделенных компонентов, то уходим
            if (!DragObject.isDragging() ) {
               return;
            }

            var
            // определяем droppable контейнер
               movable = this._findDragDropContainer(e, e.target);
            $('body').addClass('dragdropBody');
            //двигаем компонент
            this._onDrag(e, movable);
            return false;
         }

         //endregion mouseHandler
      };

   return DragAndDropMixin;
});