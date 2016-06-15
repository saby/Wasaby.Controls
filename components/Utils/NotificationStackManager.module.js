define('js!SBIS3.CONTROLS.Utils.NotificationStackManager',
   [
      'js!SBIS3.CORE.Control'
   ],

   /**
    * Синглтон для работы со стеком нотификационных окон.
    * @class SBIS3.CONTROLS.Utils.NotificationStackManager
    * @public
    * @author Степин П.В.
    */
   function(Control){
      'use strict';

      //Расстояние между блоками
      var BLOCK_MARGIN = 16;
      //Время через которое блоки скрываются
      var LIFE_TIME = 5000;

      //Отступ снизу
      var BOTTOM = 16;

      //Отступ справа
      var RIGHT = 16;

      var module = Control.Control.extend({
         $protected: {
            _options: {

            },
            _items: [],
            _hiddenItems: [],

            //Минимальный z-index сделаем 100
            _zIndex: 100
         },
         $constructor : function(){
         },

         init: function() {
            module.superclass.init.call(this);

            var self = this;

            this._zIndex =  Math.max($ws.single.WindowManager.getMaxZIndex() + 1, 100);

            $(window).on('resize', function(){
               self._checkCapacity();
            });

            this.subscribeTo($ws.single.EventBus.globalChannel(), 'FloatAreaZIndexChanged', function(e, zIndex){
               self._zIndex = Math.max(zIndex + 1, 100);
               self._updatePositions();
            });
         },

         /**
          * Показать нотификационное окно
          * @param inst Инстанс нотификационного окна
          * @param {Boolean} notHide Не прятать окно по истичению времени жизни
          */
         showNotification: function(inst, notHide){
            notHide = !!notHide;

            if(this._getItemIndexById(inst.getId()) === -1){
               this._appendNotification(inst, notHide);
            }
         },

         _appendNotification: function(inst, notHide){
            var self = this;
            var instId = inst.getId();

            //TODO Костыль для popupmixin. Испарвить, как только он научиться пзиционироваться фиксированно
            inst.show();

            inst._fixed = true;
            inst._checkFixed = function(){};

            inst.getContainer().css({
               position: 'fixed',
               top: '',
               left: '',
               bottom: '-1000px',
               right: '-1000px'
            });
            //TODO Конец костыля

            this._items.unshift(inst);

            this.subscribeTo(inst, 'onClose', function(){
               self._deleteNotification(instId);
            });

            this.subscribeTo(inst, 'onSizeChange', function(){
               self._updatePositions();
            });

            if(!notHide){
               setTimeout(function(){
                  self._deleteNotification(instId);
               }, LIFE_TIME);
            }

            this._updatePositions();
            this._checkCapacity();
         },

         _deleteNotification: function(instId){
            var index = this._getItemIndexById(instId);
            if(index !== -1){

               this._items[index].destroy();
               this._items.splice(index, 1);

               this._updatePositions();
               this._checkCapacity();
            }
         },

         _checkCapacity: function(){
            var itemsLength = this._items.length;
            if(itemsLength){
               var upperVisibleItemIndex = itemsLength - this._hiddenItems.length - 1;


               if(upperVisibleItemIndex !== -1 && this._items[upperVisibleItemIndex].getContainer().offset().top <= 0){

                  while(upperVisibleItemIndex !== -1 && this._items[upperVisibleItemIndex].getContainer().offset().top <= 0){
                     //Скрываем последний видимый элемент
                     this._items[upperVisibleItemIndex].getContainer().addClass('ws-hidden');
                     this._hiddenItems.push(this._items[upperVisibleItemIndex]);
                     upperVisibleItemIndex--;
                  }

               }
               else {
                  for(var i = this._hiddenItems.length - 1; i >= 0; i--){
                     var itemContainer = this._hiddenItems[i].getContainer();
                     itemContainer.removeClass('ws-hidden');

                     if(itemContainer.offset().top <= 0){
                        //Показали лишку, скрываем последний показанный и выходим
                        itemContainer.addClass('ws-hidden');
                        return;
                     }
                     else {
                        this._hiddenItems.pop();
                     }
                  }
               }
            }
         },

         _updatePositions: function(){
            var bottom = BOTTOM;
            for(var i = 0, l = this._items.length; i < l; i++){
               var controlContainer = this._items[i].getContainer();

               controlContainer.css({
                  bottom: bottom,
                  right: RIGHT,
                  'z-index': this._zIndex
               });

               bottom += controlContainer.height() + BLOCK_MARGIN;
            }
         },

         _getItemIndexById: function(id){
            for(var i = 0, l = this._items.length; i < l; i++){
               if(this._items[i].getId() === id){
                  return i;
               }
            }
            return -1;
         }
      });

      return new module();
   }
);