define('js!SBIS3.CONTROLS.Utils.NotificationManager',
   [
      'js!SBIS3.CORE.Control'
   ],
   function(Control){
      'use strict';

      //Расстояние между блоками
      var BLOCK_MARGIN = 16;
      //Время через которое блоки скрываются
      var LIFE_TIME = 5000;

      var module = Control.Control.extend({
         $protected: {
            _options: {

            },
            _items: [],
            _hiddenItems: [],

            //Отступ снизу
            _bottom: 16,

            //Отступ справа
            _right: 16
         },
         $constructor : function(){
         },

         init: function() {
            module.superclass.init.call(this);
            var self = this;

            $(window).on('resize', function(){
               self._checkCapacity();
            });
         },

         showNotification: function(inst, notHide){
            notHide = !!notHide;

            if(this._getItemIndexById(inst.getId()) === -1){
               this._appendNotification(inst, notHide);
            }
         },

         setPosition: function(obj){
            if(obj.hasOwnProperty('right')){
               this._right = parseInt(obj.right) || this._right;
            }

            if(obj.hasOwnProperty('bottom')){
               this._bottom = parseInt(obj.bottom) || this._bottom;
            }

            this._updatePositions();
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
               right: '-1000px',
               'z-index': '10000'
            });
            //TODO Конец костыля

            //Запрешаем активировать по клику, иначе открытые float area будут закрываться
            inst._options.activableByClick = false;

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
            var bottom = this._bottom;
            for(var i = 0, l = this._items.length; i < l; i++){
               var controlContainer = this._items[i].getContainer();

               controlContainer.css({
                  bottom: bottom,
                  right: this._right
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