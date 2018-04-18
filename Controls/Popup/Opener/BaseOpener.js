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
               this._getTemplate(cfg).addCallback(function(tpl) {
                  if (self._isVDOMTemplate(tpl)) {
                     self._popupId = ManagerController.show(cfg, strategy);
                  } else {
                     requirejs(['Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea'], function() {
                        self._prepareConfigForOldTemplate(cfg, tpl);
                        self._popupId = ManagerController.show(cfg, strategy);
                     });
                  }
               });
            }
         },

         //Ленивая загрузка шаблона
         _getTemplate: function(config) {
            if (typeof config.template === 'function') {
               return (new Deferred()).callback(config.template);
            } else if (requirejs.defined(config.template)) {
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
         },


         /* TODO COMPATIBLE */
         _isVDOMTemplate: function(templateClass) {
            //на VDOM классах есть св-во _template.
            //Если его нет, но есть _stable, значит это функция от tmpl файла
            return !!templateClass.prototype._template || !!templateClass.stable;
         },
         _prepareConfigForOldTemplate: function(cfg, templateClass) {
            cfg.templateOptions.component = cfg.template;
            cfg.template = 'Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea';
            this._setDimensions(cfg, templateClass);
         },
         _setDimensions: function(cfg, templateClass) {
            var dimensions = templateClass.dimensions;
            cfg.minWidth = dimensions.minWidth ? parseInt(dimensions.minWidth, 10) : null;
            cfg.maxWidth = dimensions.maxWidth ? parseInt(dimensions.maxWidth, 10) : null;
         }
      });
      return Base;
   }
);
