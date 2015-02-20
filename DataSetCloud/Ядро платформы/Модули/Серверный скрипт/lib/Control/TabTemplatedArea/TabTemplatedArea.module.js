/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.04.13
 * Time: 10:35
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.TabTemplatedArea", ["js!SBIS3.CORE.TemplatedArea"], function( TemplatedArea ) {

   "use strict";

   $ws.proto.TabTemplatedArea = TemplatedArea.extend({
      $protected: {
         _horizontalAlignment: 'Stretch',
         _verticalAlignment: 'Stretch'
      },

      _onResizeHandler: function() {
            this._tabAreaOnResizeHandler();
            $ws.proto.TabTemplatedArea.superclass._onResizeHandler.apply(this, arguments);
      },

      _tabAreaOnResizeHandler: function (){
         var container = this.getContainer().get(0);
         if(this._resizer){
            var hasHorizontalScrollbar = container.scrollWidth > container.clientWidth;
            var hasVerticalScrollbar = container.scrollHeight > container.clientHeight;
            /**
             * Фиксим багу с табами: при появлении у таба скроллов, Area не тянулась на область вне видимости(к которой можно прокрутить),
             * а только растягивалась на видимую область, из-за чего неправильно позиционировались все элементы, кроме привязанных к left и top.
             * Нижлежащий костыль заключается в том, что при появлении скроллов мы растягиваем внутренний грид на необходимые нам размеры.
             */
            var dtGrid = this.getContainer().find(' > .dt_grid, > .dt_layout');
            if(dtGrid.length){
               dtGrid.css({ 'min-height': '', 'min-width': ''});
               var style = {
                  minHeight: '',
                  minWidth: ''
               };
               if(this._horizontalAlignment == 'Stretch'){
                  var needWidth = Math.min(this._doGridCalculation? container.scrollWidth: Infinity, this._resizer.width());
                  if(hasHorizontalScrollbar){
                     style.minWidth = needWidth;
                  }
               }

               if(this._verticalAlignment == 'Stretch'){
                  var needHeight = Math.min(this._doGridCalculation? container.scrollHeight: Infinity, this._resizer.height());
                  if(hasVerticalScrollbar){
                     style.minHeight = needHeight;
                  }
               }
               // Используем attr style, чтобы положить туда !imporant иначе нас переопределит by #ourContainer { width: auto !important }
               dtGrid.css(style);
            }
         }
         if (this._resizer){
            var scrW = container.scrollWidth,
               scrH = container.scrollHeight,
               cntW = this._container.width(),
               cntH = this._container.height();
            // проверка, нужно ли очищать скроллы внутри области, иначе они начинают моргать при ресайзе браузера.
            if ((scrW <= cntW) && (scrH <= cntH)) {
               var self = this;
               // если оцищать скроллы и по вертикали, то Chrome не перерисовывает вложенные дивы, они получаются обрезанные.
               self._container.css('overflow-x', 'hidden');
               setTimeout(function () {
                  self._container.css('overflow-x', 'auto');
               }, 1000);
            }
         }
      }
   });

   return $ws.proto.TabTemplatedArea;

});