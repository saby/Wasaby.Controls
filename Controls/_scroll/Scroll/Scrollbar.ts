import Control = require('Core/Control');
import Env = require('Env/Env');
import template = require('wml!Controls/_scroll/Scroll/Scrollbar/Scrollbar');
import 'Controls/event';
import 'css!theme?Controls/scroll';



      /**
       * Thin scrollbar.
       *
       * @class Controls/_scroll/resources/Scrollbar
       * @extends Core/Control
       *
       * @event scrollbarBeginDrag Начала перемещения ползунка мышью.
       * @param {SyntheticEvent} eventObject Дескриптор события.
       *
       * @event scrollbarEndDrag Конец перемещения ползунка мышью.
       * @param {SyntheticEvent} eventObject Дескриптор события.
       *
       * @name Controls/_scroll/resources/Scrollbar#position
       * @cfg {Number} Позиция ползунка спроецированная на контент.
       *
       * @name Controls/Container/resources/Scrollbar#contentSize
       * @cfg {Number} Размер контента на который проецируется тонкий скролл.
       * @remark Не может быть меньше размера контейнера или 0
       *
       * @name Controls/_scroll/resources/Scrollbar#style
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
             * Посчитать позицию ползунка учитывая граници за которые он не может выйти.
             * @param {number} position текущая позиция ползунка в контейнере ползунка.
             * @param {number} minPosition минимально допустимая позиция контейнера ползунка.
             * @param {number} maxPosition максимально допустимая позиция контейнера ползунка.
             * @return {number} позиция ползунка
             */
            calcPosition: function(position, minPosition, maxPosition) {
               return Math.min(Math.max(minPosition, position), maxPosition);
            },

            /**
             * Посчитать отношение размеров контейнера ползунка к контенту.
             * @param {number} scrollbarSize размер контейнера ползунка.
             * @param {number} contentSize размер контента.
             * @return {number} отношение размеров контейнера ползунка к контенту.
             */
            calcViewportRatio: function(scrollbarSize, contentSize) {
               return scrollbarSize / contentSize;
            },

            /**
             * Получить отношение размера контейнера ползунка к размеру контейнера, по которому может перемещаться ползунок.
             * @param {number} scrollbarSize размер контейнера ползунка.
             * @param {number} scrollbarAvailableSize размер контейнера по которому может перемещаться ползунок.
             * @param {number} thumbSize размер ползунка.
             * @param {number} contentSize размер контента.
             * @return {number} отношение размера контейнера ползунка к размеру контейнера, по которому может перемещаться ползунок.
             */
            calcScrollRatio: function(scrollbarSize, scrollbarAvailableSize, thumbSize, contentSize) {
               /**
                * If the content size is equal to the scrollbar size, then scrollRatio is not defined.
                * Thats why, we consider it equal 1.
                */
               return (scrollbarAvailableSize - thumbSize) / (contentSize - scrollbarSize) || 1;
            },

            /**
             * Посчитать размер ползунка.
             * @param thumb ползунок.
             * @param {number} scrollbarAvailableSize размер контейнера по которому может перемещаться ползунок.
             * @param {number} viewportRatio отношение размера контейнера ползунка к контенту.
             * @return {number} размер ползунка.
             */
            calcThumbSize: function(thumb, scrollbarAvailableSize, viewportRatio, direction) {
               var
                  thumbSize = scrollbarAvailableSize * viewportRatio,
                  minSize = parseFloat(getComputedStyle(thumb)[direction === 'vertical' ? 'min-height' : 'min-width']);

               return Math.max(minSize, thumbSize);
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
            calcScrollbarDelta: function(start, end, thumbSize) {
               return end - start - thumbSize / 2;
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

            /**
             * Позиция курсора относительно страницы, в начале перемещения.
             */
            _currentPageOffset: null,

            _afterMount: function() {
               this._resizeHandler();

               this._forceUpdate();
            },

            _afterUpdate: function(oldOptions) {
               var
                  shouldForceUpdate = false,
                  shouldForceUpdatePosition = false,
                  shouldUpdatePosition = !this._dragging && oldOptions.position !== this._options.position;

               if (oldOptions.contentSize !== this._options.contentSize) {
                  shouldForceUpdate = shouldForceUpdate || this._setSizes(this._options.contentSize);
                  shouldUpdatePosition = true;
               }
               if (shouldUpdatePosition) {
                  shouldForceUpdatePosition = this._setPosition(this._options.position);
                  shouldForceUpdate = shouldForceUpdate || shouldForceUpdatePosition;
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
               var
                  scrollbarSize = this._children.scrollbar[this._options.direction === 'vertical' ? 'clientHeight' : 'clientWidth'],

                  // todo тут можно убрать деление, в шаблоне Scrollbar.wml можно убрать умножение
                  // и переписать событие "positionChanged" (тогда логика станет понятной)
                  maxPosition = (scrollbarSize - this._thumbSize) / this._scrollRatio;

               position = _private.calcPosition(position, 0, maxPosition);

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
             * @param contentSize размер контента.
             * @return {boolean} изменились ли размеры.
             */
            _setSizes: function(contentSize) {
               var
                  verticalDirection = this._options.direction === 'vertical',
                  scrollbar = this._children.scrollbar,
                  scrollbarSize = scrollbar[verticalDirection ? 'offsetHeight' : 'offsetWidth'],
                  scrollbarAvailableSize = scrollbar[verticalDirection ? 'clientHeight' : 'clientWidth'],
                  thumbSize, scrollRatio;

               thumbSize = _private.calcThumbSize(
                  this._children.thumb,
                  scrollbarAvailableSize,
                  _private.calcViewportRatio(scrollbarSize, contentSize),
                  this._options.direction
               );
               scrollRatio = _private.calcScrollRatio(scrollbarSize, scrollbarAvailableSize, thumbSize, contentSize);

               if (this._thumbSize === thumbSize && this._scrollRatio === scrollRatio) {
                  return false;
               } else {
                  this._thumbSize = thumbSize;
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
                  verticalDirection = this._options.direction === 'vertical',
                  pageOffset = event.nativeEvent[verticalDirection ? 'pageY' : 'pageX'],
                  thumbOffset = this._children.thumb.getBoundingClientRect()[verticalDirection ? 'top' : 'left'],
                  delta;

               this._currentPageOffset = pageOffset;

               if (event.target.getAttribute('name') === 'scrollbar') {
                  delta = _private.calcScrollbarDelta(thumbOffset, pageOffset, this._thumbSize);
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
                  pageOffset = event.domEvent[this._options.direction === 'vertical' ? 'pageY' : 'pageX'],
                  delta = pageOffset - this._currentPageOffset;

               if (this._setPosition(this._position + delta / this._scrollRatio, true)) {
                  this._currentPageOffset = pageOffset;
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
               this._setPosition(this._position + _private.calcWheelDelta(Env.detection.firefox, event.nativeEvent.deltaY), true);

               event.preventDefault();
            },

            /**
             * Обработчик изменения размеров скролла.
             */
            _resizeHandler: function() {
               this._setSizes(this._options.contentSize);
               this._setPosition(this._options.position);
            }
         });

      Scrollbar.getDefaultOptions = function() {
         return {
            position: 0,
            direction: 'vertical'
         };
      };

      Scrollbar._private = _private;

      export = Scrollbar;

