define('SBIS3.CONTROLS/Utils/NotificationStackManager',
   [
   "Core/WindowManager",
   "Core/EventBus",
   "Lib/Control/Control",
   "Core/helpers/isNewEnvironment",
   "Controls/Popup/Opener/Notification/NotificationController"
],

   /**
    * Синглтон для работы со стеком нотификационных окон.
    * @class SBIS3.CONTROLS/Utils/NotificationStackManager
    * @author Красильников А.С.
    */
   function( cWindowManager, EventBus, Control, isNewEnvironment, NotificationController){
      'use strict';
      //Время через которое блоки скрываются
      var LIFE_TIME = 5000;

      var NotificationStackManager = Control.Control.extend( /** @lends SBIS3.CONTROLS/Utils/NotificationStackManager.prototype */ {
         $protected: {
            _items: [],
            _hiddenItems: [],
            _windowsIdWithLifeTime: []
         },
         init: function() {
            NotificationStackManager.superclass.init.call(this);

            var self = this;

            this._zIndex =  cWindowManager.getMaxZIndex() + 1;

            $(window).on('resize', function(){
               self._updatePositions();
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
          * @param {Boolean} notHide Не прятать окно по истечению времени жизни
          */
         showNotification: function(inst, notHide){
            notHide = !!notHide;

            // Всплывающие уведомления не должны принимать фокус при клике на них
            inst.getContainer().get(0).addEventListener('mousedown', function(event) {
               event.preventDefault();
            });

            if(this._getItemIndexById(inst.getId()) === -1){
               this._appendNotification(inst, notHide);
            }
         },

         /**
          * TODO Временное решение пока не будет найдено другое
          * https://online.sbis.ru/opendoc.html?guid=9579d6c6-a743-4b35-96ae-0d270d1cada0
          * @noShow
          */
         getZIndex: function(){
            return this._zIndex;
         },

         /**
          * Добавить нотификационной окно в стек
          * @param inst Инстанс нотификационного окна
          * @param {Boolean} notHide Не прятать окно по истечению времени жизни
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

            inst.getContainer().addClass('js-controls-NotificationStackPopup');

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
         },

         _updateZIndex: function(zIndex){
            var self = this;
            var maxWindow = cWindowManager.getMaxZWindow(function(win){
               //Не учитываем в поиске окна из стека
               return !self._items.some(function(item){
                  return item === win;
               });
            });
            this._zIndex = Math.max(zIndex, maxWindow ? maxWindow.getZIndex() : 0) + 1;
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
               this._items[index].destroy();
               this._items.splice(index, 1);

               this._updatePositions();
            }
         },

         /**
          * Пересчитать позиции нотификационных окон
          * @private
          */
         _updatePositions: function(){
            var
               bottom,
               containerOffset,
               getIntCss = function(container, cssName) {
                  return +container.css(cssName).replace('px', '');
               };
            for (var i = 0, l = this._items.length; i < l; i++){
               var
                  container = this._items[i].getContainer(),
                  oldZindex = this._items[i]._zIndex,
                  zIndex = this._zIndex;

               //Для первого окна запоминаем отступы
               if (!i) {
                   //Popupmixin при инициализации проставляет Margin, сбрасываем его чтобы получить margin из стилей
                  container.css('margin', '');
                  bottom = getIntCss(container, 'margin-bottom');
                  containerOffset = {
                     bottom: getIntCss(container, 'margin-bottom'),
                     right: getIntCss(container, 'margin-right')
                  };
                   //Обнуляем margin, при позиционировании он не нужен
                   container.css('margin', 0);
               }
               /*Самозакрывающиеся окна показываем выше всех модальных*/
               if(this._windowsIdWithLifeTime.indexOf(this._items[i].getId()) !== -1){
                  zIndex = 1000000;
               }

               /**
                * На VDOM позиционируемся через VDOM контроллер нотификационных окон.
                * Требуется для поддержки метода SBIS3.CONTROLS/Utils/InformationPopupManager::showCustomNotification
                * В нем подробно написано по какой причине так нужно делать.
                */
               if (isNewEnvironment()) {
                  var indexFakeItem = -1;
                  var iterator = 0;
                  var item;

                  /**
                   * Ищем в vdom контроллере нотификационных окон, элемент соотствующий элементу который хотим обновить.
                   */
                  while (indexFakeItem !== i) {
                     item = NotificationController._stack.at(iterator);

                     if (!item) {
                        break;
                     }
                     if (item._isFake) {
                        indexFakeItem++;
                     }

                     iterator++;
                  }
                  if (item) {
                     bottom = item.position.bottom + containerOffset.bottom;
                  }
               }

               container.css({
                  bottom: bottom,
                  right: containerOffset.right,
                  display: 'block',
                  'z-index': zIndex
               });

               //Удаляем старый zindex из manager'a, иначе он там зависнет навсегда
               cWindowManager.releaseZIndex(oldZindex);
               this._items[i]._zIndex = zIndex;

               bottom += container.outerHeight() + containerOffset.bottom;

               if(container.offset().top <= 0){
                  container.css('display', 'none');
               }
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
