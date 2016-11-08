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
            _scroll: undefined,
            _beginClientX: undefined,
            _beginClientY: undefined,
            _beginPosition: 0
         },

         $constructor: function() {
            this._publish('onScrollbarDrag');
         },

         init: function() {
            Scrollbar.superclass.init.call(this);

            this._thumb = this._container.find('.js-controls-Scrollbar__thumb');
            this._container.on('mousedown touchstart', this._scroll, this._initDrag.bind(this));
            this._calcThumbHeight();
         },

         getPosition: function() {
            return this._options.position;
         },

         setPosition: function(position) {
            var thumbHeight = this._thumb.height();
            position = position * this._getViewportRatio();
            if (position > this.getContentHeight()){
               position = containerHeight - thumbHeight;
            }
            this._options.position = position;
            this._setThumbPosition(position);
         },

         getContentHeight: function() {
            return this._options.contentHeight;
         },

         setContentHeight: function(contentHeight) {
            this._options.contentHeight = contentHeight;
            this._calcThumbHeight();
         },

         _setThumbPosition: function(position) {
            this._thumb.get(0).style.top = position + 'px';
         },

         _calcThumbHeight: function(){
            var containerHeight = this._container.height();
            this._thumb.height(Math.pow(containerHeight, 2) / this.getContentHeight());
         },

         _onResizeHandler: function() {
            this._calcThumbHeight();
         },

         // Отношение видимой части к размеру контента
         _getViewportRatio: function(){
            if (!this._viewportRatio){
               this._viewportRatio = this.getContainer().height() / this.getContentHeight();
            }
            return this._viewportRatio;
         },

         _beginDragHandler: function(dragObject, e) {
            this._beginClientX = e.clientX;
            this._beginClientY = e.clientY;
            this._beginPosition = this._options.position;
         },

         _onDragHandler: function(dragObject, e) {

            var y = e.clientY + this._beginPosition - this._beginClientY;

            if (y > this._container.height() - this._thumb.height()) {
               y = this._container.height() - this._thumb.height();
            } else if (y < 0) {
               y = 0;
            }
            y = y * (1 / this._getViewportRatio());
            this.setPosition(y);
            this._notify('onScrollbarDrag', y);
            e.preventDefault();
         },

         _endDragHandler: function(dragObject, droppable, e) {
            var y = this._options.position + e.clientY - this._beginClientY;
            this._options.position = y;
         },

         destroy: function() {
            Scrollbar.superclass.destroy.call(this);
            this.getContainer().off('mousedown touchstart');
         }
      });

      return Scrollbar;
   }
);