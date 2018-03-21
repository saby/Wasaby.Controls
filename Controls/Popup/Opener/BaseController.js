define('Controls/Popup/Opener/BaseController',
   [
      'Core/core-extend',
      'Core/Deferred'
   ],
   function (CoreExtend, cDeferred) {
      /**
       * Базовая стратегия
       * @category Popup
       * @class Controls/Popup/Opener/BaseController
       * @author Лощинин Дмитрий
       */
      var BaseController = CoreExtend.extend({
         /**
          * Добавление нового элемента
          * @function Controls/Popup/Opener/BaseController#elementCreated
          * @param element
          * @param width
          * @param height
          */
         elementCreated: function (element, width, height) {

         },

         /**
          * Обновление размеров элемента
          * @function Controls/Popup/Opener/BaseController#elementUpdated
          * @param element
          * @param width
          * @param height
          */
         elementUpdated: function (element, width, height) {

         },

         /**
          * Удаление элемента
          * @function Controls/Popup/Opener/BaseController#elementDestroyed
          * @param element
          */
         elementDestroyed: function (element) {
            return new cDeferred().callback();
         }
      });
      return BaseController;
   }
);