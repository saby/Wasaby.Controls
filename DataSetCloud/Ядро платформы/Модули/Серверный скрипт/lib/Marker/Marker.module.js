/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 23.04.13
 * Time: 14:09
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.Marker', ['css!SBIS3.CORE.Marker'], function( ) {

   'use strict';

   var MARKER_BIG_TRIGGER_HEIGHT = 32;

   /**
    * @singleton
    * @class $ws.single.Marker
    */
   $ws.single.Marker = new ($ws.core.extend({}, {
      /**
       * @lends $ws.single.Marker.prototype
       */
      $protected : {
         _offset : {
            top : 0,
            left: 0
         },
         _size: {
            classic: {
               top: {
                  height: 1
               },
               bottom: {
                  height: 2
               },
               left: {
                  width: 20,
                  height: 34
               },
               right: {
                  width: 20,
                  height: 34
               },
               topLeft: {
                  width: 69,
                  height: 10
               },
               topRight: {
                  width: 76,
                  height: 10
               },
               bottomLeft: {
                  width: 75,
                  height: 8
               },
               bottomRight: {
                  width: 68,
                  height: 8
               }
            },
            big: {
               top: {
                  height: 2
               },
               bottom: {
                  height: 2
               },
               left: {
                  width: 20,
                  height: 56
               },
               right: {
                  width: 20,
                  height: 56
               },
               topLeft: {
                  width: 92,
                  height: 11
               },
               topRight: {
                  width: 92,
                  height: 11
               },
               bottomLeft: {
                  width: 92,
                  height: 10
               },
               bottomRight: {
                  width: 92,
                  height: 10
               }
            }
         },
         _elements : {
            classic: {
               topLeft : null,
               topRight: null,
               bottomLeft: null,
               bottomRight: null,
               top : null,
               right:null,
               bottom :null,
               left :null
            },
            big: {
               topLeft : null,
               topRight: null,
               bottomLeft: null,
               bottomRight: null,
               top : null,
               right:null,
               bottom :null,
               left :null
            }
         },
         _type : 'classic',
         _ready : {
            big: false,
            classic: false
         },
         _target : null,
         _correctPos : {},
         _visible: false,
         _$container: undefined
      },
      _repositionIfVisible: function() {
         if(this._target && $('body').hasClass('ws-marker-visible-' + this._type)) {
            this.positionToElement(this._target, this._correctPos, this._type);
         }
      },
      _init : function(){
         if (!this._ready[this._type]){

            var fReposition = this._repositionIfVisible.bind(this),
                  self = this;

            this._ready[this._type] = true;
            this._createMarker();

            if ($ws._const.browser.isIE && $.browser.version < 9){
               $(document).keyup(function(e){
                  var keys = [187, 189, 107, 109, 96, 48];
                  if (e.ctrlKey){
                     for (var i = 0, l = keys.length; i < l; i++){
                        if (e.which == keys[i]){
                           fReposition();
                           break;
                        }
                     }
                  }
               });
               document.attachEvent('onmousewheel', function(e){
                  if (e.ctrlKey) {
                     fReposition();
                  }
               }.throttle(500));
            }
            $ws._const.$win.resize(fReposition);
            //запускаем таймер проверки на видимость маркированного элемента
            setInterval(function(){
               if(self._target && self._visible) {
                  self.toggle($ws.helpers.isElementVisible(self._target));
               }
            }, 50);
         }
      },
      /**
       * Скрывает(false)/показывает(true) маркер
       * param{Boolean} state флаг
       * */
      toggle: function(state){
         if(this._visible != state){
            this[state ? 'show' : 'hide']();
         }
      },
      /**
       * Показан ли маркер
       * @returns {Boolean}
       */
      isVisible: function() {
         return this._visible;
      },
      /**
       * Перемещает элементы маркера в указанный элемент
       * @param {jQuery} $container
       */
      moveContainerTo: function($container) {
         if (!this._$container) {
            this._init();
         }
         this._$container.prependTo($container);
         this._repositionIfVisible();
      },
      _createMarker : function(){
         var fragment = document.createDocumentFragment();
         this._$container = this._$container || $('<div class="ws-marker-container"></div>');
         for (var i in this._elements[this._type]){
            if (this._elements[this._type].hasOwnProperty(i)) {
               var e = document.createElement('div');
               e.className = 'ws-marker-' + this._type + ' ws-marker ws-marker-' + i;
               this._elements[this._type][i] = $(e);
               fragment.appendChild(e);
            }
         }
         this._$container.get(0).appendChild(fragment);
         $('body').prepend(this._$container);
      },
      _setWidth: function(w) {
         var sideWidth  = this._size[this._type].left.width + this._size[this._type].right.width;
         var topWidth = w - this._size[this._type].topLeft.width - this._size[this._type].topRight.width - sideWidth;
         var bottomWidth = w - this._size[this._type].bottomLeft.width - this._size[this._type].bottomRight.width - sideWidth;
         var t, b;
         this._elements[this._type].top.width(t = (topWidth > 0 ? topWidth : 0));
         this._elements[this._type].bottom.width(b = (bottomWidth > 0 ? bottomWidth : 2));
         return [ t, b ];
      },
      /**
       * Устанавливает ширину маркера
       * @param {Number} w ширина
       */
      setWidth : function(w){
         this._init();
         this._setWidth(w);
         this.setPosition(this._offset);
      },
      /**
       * Анализирует размер таргета и возвращает нужный тип маркера
       * @param {jQuery} target елемент для позиционирования
       */
      _getMarkerType: function(target){
         return target.height() < MARKER_BIG_TRIGGER_HEIGHT ? 'classic' : 'big';
      },
      /**
       * Позиционирование маркера на элементе
       * @param {jQuery} elem
       * @param {object} [c] - значения для корректировки положения маркера. Пример: {top: 0, left: -5, width: 10}
       * @param {String} [type] - тип маркера: по умолчанию маркер сам решит, какой тип нужен; можно указать classic или big
       */
      positionToElement : function(elem, c, type){
         var widthPlus = 0;
         type = type || this._getMarkerType(elem);
         if(this._type != type){
            this.hide();
            this._type = type;
         }
         this._init();
         if (elem && $ws.helpers.isElementVisible(elem)){
            this._target = elem;
            this._correctPos = c || {};
            // force reflow
            var
                  hint,
                  offset = elem.offset(),
                  containerOffset = this._$container.offset(),
                  outerHeight = elem.outerHeight(),
                  outerWidth = elem.outerWidth(),
                  zI = parseInt(elem.parents('body > *').css('z-index') ,10);

            offset.left -= containerOffset.left;
            offset.top -= containerOffset.top;

            offset.left += (this._correctPos.left || 0);
            offset.top += (outerHeight - this._size[this._type].left.height)/2 + (this._correctPos.top || 0);
            // добавляем проверку на скрытость элемента навигационной панели
            // чтобы на него случайно не поставился маркер
            if($ws.helpers.isElementVisible(elem)) {
               // style recalc
               this._show();
            }
            // style recal
            hint = this._setWidth(outerWidth + widthPlus  + (this._correctPos.width || 0));
            // style recalc
            this.setPosition(offset, hint);
            // style recalc
            this.setZIndex(isNaN(zI) ? 1 : zI + 1);
         }
      },
      /**
       * Переводит параметры оффсета к целочесленному виду
       * @param offset
       * @private
       */
      _prepareOffset: function(offset){
         for (var i in offset){
            if (offset.hasOwnProperty(i)){
               offset[i] = Math.round(offset[i]);
            }
         }
         return offset;
      },
      /**
       * Позиционирует маркер
       * @param {object} offset
       * @param {Object} [hint]
       */
      setPosition : function(offset, hint){
         this._init();
         offset = this._prepareOffset(offset);
         var
               top = offset.top,
               left = offset.left,
               topLeft = offset.left,
               bottomLeft;

         this._elements[this._type].left.css({ top: top, left: left}); //offset(offset);

         topLeft += this._size[this._type].left.width;
         bottomLeft = topLeft;
         this._elements[this._type].topLeft.css({top: top, left: topLeft});
         this._elements[this._type].bottomLeft.css({top: top + (this._size[this._type].left.height - this._size[this._type].bottomLeft.height), left: bottomLeft});

         topLeft += this._size[this._type].topLeft.width;
         bottomLeft += this._size[this._type].bottomLeft.width;
         this._elements[this._type].top.css({top: top, left: topLeft});
         this._elements[this._type].bottom.css({top: top + (this._size[this._type].left.height - this._size[this._type].bottom.height), left: bottomLeft});

         topLeft += hint ? hint[0] : this._elements[this._type].top.width();
         bottomLeft += hint ? hint[1] : this._elements[this._type].bottom.width();
         this._elements[this._type].topRight.css({top: top, left: topLeft});
         this._elements[this._type].bottomRight.css({top: top + (this._size[this._type].left.height - this._size[this._type].bottomRight.height), left: bottomLeft});

         offset.left = topLeft + this._size[this._type].topRight.width;

         this._elements[this._type].right.css(offset);

         this._offset = {
            top : top,
            left : left
         };
      },
      /**
       * Устанавливает zIndex для маркера
       * @param {Number} v - zIndex
       */
      setZIndex : function(v){
         $ws.helpers.forEach(this._elements[this._type], function(elt){
            elt.css('z-index', v);
         });
      },
      /**
       * Показывает маркер
       */
      _show: function() {
         this._visible = true;
         $('body').addClass('ws-marker-visible-' + this._type);
      },
      /**
       * Показывает маркер и пересчитывает его позицию
       */
      show: function() {
         if (!this._visible) {
            this._show();
            if (this._$container) {
               this._repositionIfVisible();
            }
         }
      },
      /**
       * Скрывает маркер
       */
      hide : function(){
         if (this._visible) {
            this._visible = false;
            $('body').removeClass('ws-marker-visible-' + this._type);
         }
      },
      /**
       * Возвращает элемент, на который позиционируется маркер
       */
      getTarget: function(){
         return this._target || $();
      }
   }))();

   return $ws.single.Marker;

});
