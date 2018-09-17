define('Controls/Container/Scroll/Scrollbar',
   [
      'Core/Control',
      'Core/detection',
      'wml!Controls/Container/Scroll/Scrollbar/Scrollbar',
      'Controls/Event/Emitter',
      'css!?Controls/Container/Scroll/Scrollbar/Scrollbar'
   ],
   function(Control, detection, template) {

      'use strict';

      /**
       * Thin scrollbar.
       *
       * @class Controls/Container/resources/Scrollbar
       * @extends Core/Control
       *
       * @event scrollbarBeginDrag Начала перемещения ползунка мышью.
       * @param {SyntheticEvent} eventObject Дескриптор события.
       *
       * @event scrollbarEndDrag Конец перемещения ползунка мышью.
       * @param {SyntheticEvent} eventObject Дескриптор события.
       *
       * @name Controls/Container/resources/Scrollbar#position
       * @cfg {Number} Позиция ползунка спроецированная на контент.
       *
       * @name Controls/Container/resources/Scrollbar#contentHeight
       * @cfg {Number} Высота контента на который проецируется тонкий скролл.
       * @remark Не может быть меньше высоты контейнера или 0.
       *
       * @name Controls/Container/resources/Scrollbar#style
       * @cfg {String} Цветовая схема контейнера. Влияет на цвет тени и полоски скролла. Используется для того чтобы контейнер корректно отображался как на светлом так и на темном фоне.
       * @variant normal стандартная схема
       * @variant inverted противоположная схема
       *
       * @public
       * @control
       * @author Журавлев Максим Сергеевич
       */
      var
         _private = {

            /**
             * Позиция курсора относительно страницы, в начале перемещения.
             */
            currentPageY: null,

            /**
             * Посчитать позицию ползунка учитывая граници за которые он не может выйти.
             * @param {number} position позиция ползунка.
             * @param {number} bottom нижняя граница ползунка.
             * @param {number} top верхняя граница ползунка.
             * @return {number} позиция ползунка
             */
            calcPosition: function(position, bottom, top) {
               return Math.min(Math.max(bottom, position), top);
            },

            /**
             * Посчитать отношение высот контейнера ползунка к контенту.
             * @param {number} scrollbarHeight высота контейнера ползунка.
             * @param {number} contentHeight высота контента.
             * @return {number} отношение высот контейнера ползунка к контенту.
             */
            calcViewportRatio: function(scrollbarHeight, contentHeight) {
               return scrollbarHeight / contentHeight;
            },

            /**
             * Получить отношение высот отображения скрытого контента и самого скрытого контента.
             * @param {number} scrollbarHeight высота контейнера ползунка.
             * @param {number} scrollbarAvailableHeight высота контейнера по которому может перемещаться ползунок.
             * @param {number} thumbHeight высота ползунка.
             * @param {number} contentHeight высота контента.
             * @return {number} отношение высот отображения скрытого контента и самого скрытого контента.
             */
            calcScrollRatio: function(scrollbarHeight, scrollbarAvailableHeight, thumbHeight, contentHeight) {
               /**
                * If the content size is equal to the scrollbar size, then scrollRatio is not defined.
                * Thats why, we consider it equal 1.
                */
               return (scrollbarAvailableHeight - thumbHeight) / (contentHeight - scrollbarHeight) || 1;
            },

            /**
             * Посчитать высоту ползунка.
             * @param thumb ползунок.
             * @param {number} scrollbarAvailableHeight высота контейнера по которому может перемещаться ползунок.
             * @param {number} viewportRatio отношение высот контейнера ползунка к контенту.
             * @return {number} высота ползунка.
             */
            calcThumbHeight: function(thumb, scrollbarAvailableHeight, viewportRatio) {
               var
                  thumbHeight = scrollbarAvailableHeight * viewportRatio,
                  minHeight = parseFloat(getComputedStyle(thumb)['min-height']);

               return Math.max(minHeight, thumbHeight);
            },
            calcWheelDelta: function(firefox, delta) {
               /**
                * Определяем смещение ползунка.
                * В firefox в дескрипторе события в свойстве deltaY лежит маленькое значение,
                * поэтому установим его сами.
                * TODO: Нормальное значение есть в дескрипторе события MozMousePixelScroll в
                * свойстве detail, но на него нельзя подписаться.
                * https://online.sbis.ru/opendoc.html?guid=3e532f22-65a9-421b-ab0c-001e69d382c8
                */
               if (firefox) {
                  return Math.sign(delta) * 100;
               }

               return delta;
            },
            calcScrollbarDelta: function(start, end, thumbHeight) {
               return end - start - thumbHeight / 2;
            }
         },
         Scrollbar = Control.extend({
            _template: template,

            /**
             * Перемещается ли ползунок.
             * @type {boolean}
             */
            _dragging: false,

            /**
             * Позиция ползунка спроецированная на контент в границах трека.
             * @type {number}
             */
            _position: 0,

            _afterMount: function() {
               this._resizeHandler();

               this._forceUpdate();
            },

            _afterUpdate: function(oldOptions) {
               var
                  shouldForceUpdate = false,
                  shouldUpdatePosition = !this._dragging && oldOptions.position !== this._options.position;

               if (oldOptions.contentHeight !== this._options.contentHeight) {
                  shouldForceUpdate = shouldForceUpdate || this._setSizes(this._options.contentHeight);
                  shouldUpdatePosition = true;
               }
               if (shouldUpdatePosition) {
                  shouldForceUpdate = shouldForceUpdate || this._setPosition(this._options.position);
               }
               if (shouldForceUpdate) {
                  this._forceUpdate();
               }
            },

            /**
             * Изменить позицию ползунка.
             * @param {number} position новая позиция.
             * @param {boolean} notify стрелять ли событием при изменении позиции.
             * @return {boolean} изменилась ли позиция.
             */
            _setPosition: function(position, notify) {
               var top = (this._children.scrollbar.clientHeight - this._thumbHeight) / this._scrollRatio;

               position = _private.calcPosition(position, 0, top);

               if (this._position === position) {
                  return false;
               } else {
                  this._position = position;

                  if (notify) {
                     this._notify('positionChanged', [position]);
                  }

                  return true;
               }
            },

            /**
             * Изменить свойства контрола отвечающего за размеры.
             * @param contentHeight высота контента.
             * @return {boolean} изменились ли размеры.
             */
            _setSizes: function(contentHeight) {
               var
                  scrollbar = this._children.scrollbar,
                  scrollbarHeight = scrollbar.offsetHeight,
                  scrollbarAvailableHeight = scrollbar.clientHeight,
                  thumbHeight, scrollRatio;

               thumbHeight = _private.calcThumbHeight(
                  this._children.thumb,
                  scrollbarAvailableHeight,
                  _private.calcViewportRatio(scrollbarHeight, contentHeight)
               );
               scrollRatio = _private.calcScrollRatio(scrollbarHeight, scrollbarAvailableHeight, thumbHeight, contentHeight);

               if (this._thumbHeight === thumbHeight && this._scrollRatio === scrollRatio) {
                  return false;
               } else {
                  this._thumbHeight = thumbHeight;
                  this._scrollRatio = scrollRatio;

                  return true;
               }
            },

            /**
             * Обработчик начала перемещения ползунка мышью.
             * @param {SyntheticEvent} event дескриптор события.
             */
            _scrollbarBeginDragHandler: function(event) {
               var
                  pageY = event.nativeEvent.pageY,
                  thumbTop = this._children.thumb.getBoundingClientRect().top,
                  delta;

               _private.currentPageY = pageY;

               if (event.target.getAttribute('name') === 'scrollbar') {
                  delta = _private.calcScrollbarDelta(thumbTop, pageY, this._thumbHeight);
                  this._setPosition(this._position + delta / this._scrollRatio, true);
               } else {
                  this._children.dragNDrop.startDragNDrop(null, event);
               }
            },

            _scrollbarStartDragHandler: function() {
               this._dragging = true;
               this._notify('draggingChanged', [this._dragging]);
            },

            /**
             * Обработчик перемещения ползунка мышью.
             * @param {Event} event дескриптор события.
             */
            _scrollbarOnDragHandler: function(e, event) {
               var
                  pageY = event.domEvent.pageY,
                  delta = pageY - _private.currentPageY;

               if (this._setPosition(this._position + delta / this._scrollRatio, true)) {
                  _private.currentPageY = pageY;
               }
            },

            /**
             * Обработчик конца перемещения ползунка мышью.
             */
            _scrollbarEndDragHandler: function() {
               if (this._dragging) {
                  this._dragging = false;
                  this._notify('draggingChanged', [this._dragging]);
               }
            },

            /**
             * Обработчик прокрутки колесиком мыши.
             * @param {SyntheticEvent} event дескриптор события.
             */
            _wheelHandler: function(event) {
               this._setPosition(this._position + _private.calcWheelDelta(detection.firefox, event.nativeEvent.deltaY), true);

               event.preventDefault();
            },

            /**
             * Обработчик изменения размеров скролла.
             */
            _resizeHandler: function() {
               this._setSizes(this._options.contentHeight);
               this._setPosition(this._options.position);
            }
         });

      Scrollbar.getDefaultOptions = function() {
         return {
            position: 0,
            style: 'normal'
         };
      };

      Scrollbar._private = _private;

      return Scrollbar;
   }
);
