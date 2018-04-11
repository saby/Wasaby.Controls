define('Controls/Popup/Opener/BaseOpener',
   [
      'Core/Control',
      'Controls/Popup/Manager/ManagerController',
      'Core/core-clone',
      'Core/core-merge',
      'Core/Deferred'
   ],
   function(Control, ManagerController, CoreClone, CoreMerge, Deferred) {
      /**
       * Базовый опенер
       * @category Popup
       * @class Controls/Popup/Opener/Base
       * @control
       * @author Лощинин Дмитрий
       */
      var Base = Control.extend({
         _beforeUnmount: function() {
            this.close();
         },

         /**
          * Открыть всплывающую панель
          * @function Controls/Popup/Opener/Base#open
          * @param config конфигурация попапа
          * @param strategy стратегия позиционирования попапа
          */
         open: function(config, strategy) {
            var cfg = this._options.popupOptions ? CoreClone(this._options.popupOptions) : {};
            var self = this;
            CoreMerge(cfg, config || {});
            if (this.isOpened()) {
               this._popupId = ManagerController.update(this._popupId, cfg);
            } else {
               if (!cfg.opener) {
                  cfg.opener = this;
               }
               this._getTemplate(cfg).addCallback(function() {
                  self._popupId = ManagerController.show(cfg, strategy);
               });
            }
         },

         //Ленивая загрузка шаблона
         _getTemplate: function(config) {
            if (typeof config.template === 'function' || requirejs.defined(config.template)) {
               return (new Deferred()).callback(requirejs(config.template));
            } else if (!this._openerListDeferred) {
               this._openerListDeferred = new Deferred();
               requirejs([config.template], function(template) {
                  this._openerListDeferred.callback(template);
               }.bind(this));
            }
            return this._openerListDeferred;
         },

         /**
          * Закрыть всплывающую панель
          * @function Controls/Popup/Opener/Base#show
          */
         close: function() {
            if (this._popupId) {
               ManagerController.remove(this._popupId);
            }
         },

         /**
          * Получить признак, открыта или закрыта связанная всплывающая панель
          * @function Controls/Popup/Opener/Base#isOpened
          * @returns {Boolean} Признак открыта ли связанная всплывающая панель
          */
         isOpened: function() {
            return !!ManagerController.find(this._popupId);
         }
      });
      return Base;
   }
);
