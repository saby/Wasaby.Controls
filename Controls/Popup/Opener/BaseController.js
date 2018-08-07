define('Controls/Popup/Opener/BaseController',
   [
      'Core/core-extend',
      'Core/Deferred',
      'Controls/Popup/Manager/ManagerController',
      'WS.Data/Utils'
   ],
   function(CoreExtend, Deferred, ManagerController, Utils) {
      var _private = {

         /*
          * Вернуть размеры контента
          * */
         getContentSizes: function(container) {
            return {
               width: container.offsetWidth,
               height: container.offsetHeight
            };
         },
         getMargins: function(config) {
            //create fakeDiv for calculate margins
            var fakeDiv = document.createElement('div');
            fakeDiv.classList = config.popupOptions.className;
            document.body.append(fakeDiv);

            var style = fakeDiv.currentStyle || window.getComputedStyle(fakeDiv);
            var margins = {
               top: parseInt(style.marginTop, 10),
               left: parseInt(style.marginLeft, 10)
            };

            fakeDiv.remove();
            return margins;
         }
      };

      /**
       * Базовая стратегия
       * @category Popup
       * @class Controls/Popup/Opener/BaseController
       * @author Красильников Андрей
       */
      var BaseController = CoreExtend.extend({

         /**
          * Добавление нового элемента
          * @function Controls/Popup/Opener/BaseController#elementCreated
          * @param element
          * @param container
          */
         elementCreated: function(element, container) {

         },

         /**
          * Обновление размеров элемента
          * @function Controls/Popup/Opener/BaseController#elementUpdated
          * @param element
          * @param container
          */
         elementUpdated: function(element, container) {

         },

         elementAfterUpdated: function(element, container) {

         },

         /**
          * Удаление элемента
          * @function Controls/Popup/Opener/BaseController#elementDestroyed
          * @param element
          */
         elementDestroyed: function(element) {
            return (new Deferred()).callback();
         },
         popupDeactivated: function(item) {
            if (item.popupOptions.closeByExternalClick) {
               ManagerController.remove(item.id);
            }
         },
         getDefaultConfig: function(item) {
            item.position = {
               top: -10000,
               left: -10000
            };
         },
         _getPopupSizes: function(config, container) {
            var sizes = _private.getContentSizes(container);
            return {
               width: config.popupOptions.maxWidth || sizes.width,
               height: config.popupOptions.maxHeight || sizes.height,
               margins: _private.getMargins(config, container)
            };
         },
         _checkContainer: function(item, container) {
            if (!container) {
               Utils.logger.error(this._moduleName, 'Ошибка при построении шаблона ' + item.popupOptions.template);
               return false;
            }
            return true;
         }
      });
      return BaseController;
   });
