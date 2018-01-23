define('Controls/Container/Scrollbar/Scrollbar', [
      'Core/Control',
      'tmpl!Controls/Container/Scrollbar/Scrollbar',
      'Core/detection',
      'css!Controls/Container/Scrollbar/Scrollbar'
   ],
   function (Control, template, detection) {

      'use strict';

      /**
       * Класс контрола "Тонкий скролл".
       * @class SBIS3.CONTROLS/ScrollContainer/Scrollbar
       * @extends SBIS3.CONTROLS/CompoundControl
       *
       * @mixes SBIS3.CONTROLS/Mixins/DragNDropMixin
       *
       * @public
       * @control
       * @author Крайнов Дмитрий Олегович
       */
      var Scrollbar = Control.extend(/** @lends SBIS3.CONTROLS/ScrollContainer/Scrollbar.prototype */{
         /**
          * @event onScrollbarDrag Происходит при изменении позиции скролла.
          * @param {Core/EventObject} eventObject Дескриптор события.
          * @param {Number} position Позиция скролла.
          */
         _template: template,
         _viewportRatio: undefined,
         //Отношение видимой части трека к невидимой части контента
         _scrollRatio: undefined,
         _thumbHeight: undefined,
         _containerHeight: undefined,
         _containerOuterHeight: undefined,
         //Является ли высота ползунка константой
         _isConstThumb: undefined,
         _browserScrollbarMinHeight: undefined,
         position: 0,

         _afterMount: function () {
            this.position = this._options.position;
            this._containerHeight = this._children.scrollbar.offsetHeight;
            this._containerOuterHeight = this._children.scrollbar.offsetHeight;
            this._browserScrollbarMinHeight = parseFloat(getComputedStyle(this._children.thumb).minHeight);

            this._setViewportRatio();
            this._setThumbHeight();
            this._setScrollRatio();
            this._setThumbPosition();
         },
         /**
          *
          * @returns {*}
          */
         getPosition: function () {
            return this.position;
         },
         /**
          *
          * @param position
          */
         setPosition: function (position) {
            var maxPosition = this.getContentHeight() - this._containerOuterHeight;
            position = this._calcPosition(position, 0, maxPosition);
            this.position = position;
            this._setThumbPosition();
         },
         /**
          *
          * @returns {number|SBIS3.CONTROLS.ScrollContainer._scrollbar.contentHeight|*}
          */
         getContentHeight: function () {
            return this._options.contentHeight;
         },
         /**
          *
          * @param contentHeight
          */
         setContentHeight: function (contentHeight) {
            this._containerHeight = this._container.height();
            this._containerOuterHeight = this._container.outerHeight(true);
            this._options.contentHeight = contentHeight;
            this._setViewportRatio();
            this._setThumbHeight();
            this._setScrollRatio();
         },

         /**
          * Вернуть положение, требуется для того что бы проверять не превышает ли позиция свои границы.
          * если да то вернуть позицию как границу за которую мы вышли. bottom - нижняя граница,
          * top -верхняя граница.
          */
         _calcPosition: function (position, bottom, top) {
            if (position < bottom) {
               position = bottom;
            }
            else if (position > top) {
               position = top;
            }

            return position;
         },

         //Сдвигаем ползунок на нужную позицию
         _setThumbPosition: function () {
            if (this._children.thumb) {
               this._children.thumb.style.top = this._calcProjectionSize(this.getPosition(), this._scrollRatio) + 'px';
            }
         },

         //Высчитываем и задаём высоту ползунка
         _setThumbHeight: function () {
            this._thumbHeight = this._calcProjectionSize(this._containerHeight, this._viewportRatio);
            //Проверим не является ли высота ползунка меньше минимальной.
            if (this._thumbHeight < this._browserScrollbarMinHeight) {
               this._thumbHeight = this._browserScrollbarMinHeight;
               this._isConstThumb = true;
            } else {
               this._isConstThumb = false;
            }
            if (this._children.thumb) {
               this._children.thumb.style.height = this._thumbHeight + 'px';
            }
         },

         _calcProjectionSize: function (size, ratio) {
            return size * ratio;
         },

         _onResizeHandler: function () {
            this._containerHeight = this._container.height();
            this._containerOuterHeight = this._container.outerHeight(true);
            this._setThumbHeight();
         },

         //Изменить отношение видимой части к размеру контента
         _setViewportRatio: function () {
            /**
             * Если размер скроллирования меньше 1px, то нет смысла показывать скролл.
             * Это избавит нас от проблем связанных с разным поведением браузеров.
             * Например в FF: если контейнер, в котором лежит скроллбар, имеет высоту с дробной частью и
             * равной своему контенту, то его scrollHeight будет округлен в большую сторону. Если передать
             * такой scrollHeight в скроллбар, то по логике должен быть скроллбар, хотя это не так.
             */
            if (this.getContentHeight() - this._containerOuterHeight > 1) {
               this._viewportRatio = this._containerOuterHeight / this.getContentHeight();
            } else {
               this._viewportRatio = 1;
            }
         },

         _setScrollRatio: function () {
            this._scrollRatio = (this._children.scrollbar.offsetHeight - this._thumbHeight) / (this.getContentHeight() - this._containerOuterHeight);
         },
         _wheelHandler: function(event) {
            var deltaY;

            switch (event.type) {
               case 'wheel':
                  deltaY = event.nativeEvent.deltaY;
                  break;
               case 'MozMousePixelScroll':
                  deltaY = event.nativeEvent.detail;
                  break;
            }
            this.setPosition(this.getPosition() + deltaY);
            event.preventDefault();
         },
         _afterUpdate: function afterMount(options) {
            this.setPosition(options.position);
         }
      });

      return Scrollbar;
   }
);
