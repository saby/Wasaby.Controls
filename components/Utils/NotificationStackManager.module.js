define('js!SBIS3.CONTROLS.Utils.NotificationStackManager',
   [
   "Core/WindowManager",
   "Core/EventBus",
   "js!SBIS3.CORE.Control"
],

   /**
    * Синглтон для работы со стеком нотификационных окон.
    * @class SBIS3.CONTROLS.Utils.NotificationStackManager
    * @author Степин П.В.
    */
   function( cWindowManager, EventBus, Control){
      'use strict';

      //Расстояние между блоками
      var BLOCK_MARGIN = 16;
      //Время через которое блоки скрываются
      var LIFE_TIME = 5000;

      //Отступ снизу
      var BOTTOM = 16;

      //Отступ справа
      var RIGHT = 16;

      var NotificationStackManager = Control.Control.extend( /** @lends SBIS3.CONTROLS.Utils.NotificationStackManager.prototype */ {
         $protected: {
            _options: {

            },
            _items: [],
            _hiddenItems: [],
            _windowsIdWithLifeTime: []
         },
         $constructor : function(){
         },

         init: function() {
            NotificationStackManager.superclass.init.call(this);

            var self = this;

            this._zIndex =  cWindowManager.getMaxZIndex() + 1;

            $(window).on('resize', function(){
               self._checkCapacity();
            });

            this.subscribeTo(EventBus.globalChannel(), 'FloatAreaZIndexChanged', function(e, zIndex){
               self._updateZIndex(zIndex);
            });
            this.subscribeTo(cWindowManager, 'zIndexChanged', function(e, zIndex){
               self._updateZIndex(zIndex);
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

         /**
          * Добавить нотификационной окно в стек
          * @param inst Инстанс нотификационного окна
          * @param {Boolean} notHide Не прятать окно по истичению времени жизни
          * @private
          */
         _appendNotification: function(inst, notHide){
            var self = this;
            var instId = inst.getId();

            //TODO Костыль для popupmixin. Исправить, как только он научится позиционироваться фиксированно
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
                  self._windowsIdWithLifeTime.splice(self._windowsIdWithLifeTime.indexOf(inst.getId()), 1);
               }, LIFE_TIME);
               this._windowsIdWithLifeTime.push(inst.getId());
            }

            this._updatePositions();
            this._checkCapacity();
         },

         _updateZIndex: function(zIndex){
            this._zIndex = Math.max(zIndex, cWindowManager.getMaxZIndex()) + 1;
            this._updatePositions();
         },

         /**
          * Удалить нотификационное окно из стека
          * @param instId Id Инстанса нотификационного окна
          * @private
          */
         _deleteNotification: function(instId){
            var index = this._getItemIndexById(instId);
            if(index !== -1){

               for(var i = 0, l = this._hiddenItems.length; i < l; i++){
                  if(this._hiddenItems[i].getId() === this._items[index].getId()){
                     this._hiddenItems.splice(i, 1);
                     break;
                  }
               }

               this._items[index].destroy();
               this._items.splice(index, 1);

               this._updatePositions();
               this._checkCapacity();
            }
         },

         /**
          * Проверирить, вместимость в окно браузера и при необходимости скрыть окна, которые не вмещаются
          * @private
          */
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

         /**
          * Пересчитать позиции нотификационных окон
          * @private
          */
         _updatePositions: function(){
            var bottom = BOTTOM;
            for(var i = 0, l = this._items.length; i < l; i++){
               var controlContainer = this._items[i].getContainer();
               var zIndex = this._zIndex;

               /*Самозакрывающиеся окна показываем выше всех модальных*/
               if(this._windowsIdWithLifeTime.indexOf(this._items[i].getId()) !== -1){
                  zIndex = 1000000;
               }

               controlContainer.css({
                  bottom: bottom,
                  right: RIGHT,
                  'z-index': zIndex
               });

               this._items[i]._zIndex = zIndex;

               bottom += controlContainer.height() + BLOCK_MARGIN;
            }
         },

         /**
          * Вернуть индекс нотификационного окно по его id
          * @private
          */
         _getItemIndexById: function(id){
            for(var i = 0, l = this._items.length; i < l; i++){
               if(this._items[i].getId() === id){
                  return i;
               }
            }
            return -1;
         }
      });

      return new NotificationStackManager();
   }
);