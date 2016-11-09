define('js!SBIS3.CONTROLS.Scrollbar', [
      'js!SBIS3.CONTROLS.CompoundControl',
      'tmpl!SBIS3.CONTROLS.Scrollbar',
      'js!SBIS3.CONTROLS.DragNDropMixinNew',
      'Core/helpers/string-helpers'
   ],
   function(CompoundControl, dotTplFn, DragNDropMixinNew, strHelpers) {

      'use strict';

      var Scrollbar = CompoundControl.extend([DragNDropMixinNew], {
         _dotTplFn: dotTplFn,

         $protected: {
            _options: {
               position: 0,
               contentHeight: undefined
            },
            _thumb: undefined,
            _beginClient: undefined,
            _thumbPosition: 0,
            _viewportRatio: undefined,
            _thumbHeight: undefined,
            _containerHeight: undefined
         },

         $constructor: function() {
            this._publish('onScrollbarDrag');
         },

         init: function() {
            Scrollbar.superclass.init.call(this);

            this._thumb = this._container.find('.js-controls-Scrollbar__thumb');
            this._container.on('mousedown touchstart', '.js-controls-Scrollbar__thumb', this._getDragInitHandler());
            //this._container.on('mousedown touchstart', this._onClickDragHandler.bind(this));

            this._containerHeight = this._container.height();
            this._setViewportRatio();
         },

         getPosition: function() {
            return this._options.position;
         },

         setPosition: function(position) {
            var maxPosition = this.getContentHeight() - this._containerHeight;

            position = this._calcPosition(position, 0, maxPosition);
            this._options.position = position;
            this._setViewThumbPosition(this._setThumbPosition(position));
         },

         getContentHeight: function() {
            return this._options.contentHeight;
         },

         setContentHeight: function(contentHeight) {
            this._options.contentHeight = contentHeight;
            this._setViewportRatio();
            this._calcThumbHeight();
         },

         /**
          * Вернуть положение, требуется для того что бы проверять не превышает ли позиция свои границы.
          * если да то вернуть позицию как границу за которую мы вышли. bottom - нижняя граница,
          * top -верхняя граница.
          */
         _calcPosition: function(position, bottom, top) {
            if (position < bottom) {
               position = bottom;
            }
            else if (position > top) {
               position = top;
            }

            return position;
         },

         _onClickDragHandler: function(e) {
            alert('asd');
         },

         //Вернуть метод который инициализирует DragNDrop
         _getDragInitHandler: function() {
            return (function(e) {
               this._initDrag.call(this, e);
               e.preventDefault();
            }).bind(this);
         },

         //Сдвигаем ползунок на нужную позицию
         _setViewThumbPosition: function() {
            this._thumb.get(0).style.top = this._thumbPosition + 'px';
         },

         //Изменить позицию ползунка относительно позиции контента
         _setThumbPosition: function() {
            this._thumbPosition = this.getPosition() * this._viewportRatio;
         },

         //Высчитываем и задаём высоту ползунка
         _calcThumbHeight: function(){
            this._thumbHeight = this._containerHeight * this._viewportRatio;
            this._thumb.height(this._thumbHeight);
         },

         _onResizeHandler: function() {
            this._calcThumbHeight();
         },

         //Изменить отношение видимой части к размеру контента
         _setViewportRatio: function(){
            this._viewportRatio = this._containerHeight / this.getContentHeight();
         },

         _beginDragHandler: function(dragObject, e) {
            this._beginClient = e.clientY;
         },

         _onDragHandler: function(dragObject, e) {
            var
               newPosition = (this._thumbPosition + e.clientY - this._beginClient) / this._viewportRatio,
               position;

            this.setPosition(newPosition);
            position = this.getPosition();
            this._notify('onScrollbarDrag', position);

            this._beginClient = e.clientY - newPosition + position;
         },

         _endDragHandler: function(dragObject, droppable, e) {

         },

         destroy: function() {
            Scrollbar.superclass.destroy.call(this);

            this.getContainer().off('mousedown touchstart');
            this._scroll = undefined;
         }
      });

      return Scrollbar;
   }
);