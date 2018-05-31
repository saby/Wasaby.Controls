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
       * @mixes Controls/interface/IOpener
       * @control
       * @public
       * @author Лощинин Дмитрий
       */
      var Base = Control.extend({
         _beforeUnmount: function() {
            if (this._options.closePopupBeforeUnmount) {
               this.close();
            }
         },

         /**
          * Открыть всплывающую панель
          * @function Controls/Popup/Opener/Base#open
          * @param popupOptions конфигурация попапа
          * @param strategy стратегия позиционирования попапа
          */
         open: function(popupOptions, strategy) {
            var self = this;
            var cfg = this._getConfig(popupOptions);

            if (this._isExecuting) { //Если мы еще не обработали первый вызов, то дожидаемся его
               return;
            }
            this._isExecuting = true;

            if (!this.isOpened()) { // удаляем неактуальный id
               this._popupId = null;
            }

            if (cfg.isCompoundTemplate) { //TODO Compatible: Если Application не успел загрузить совместимость - грузим сами.
               requirejs(['Controls/Popup/Compatible/Layer'], function(Layer) {
                  Layer.load().addCallback(function() {
                     self._openPopup(cfg, strategy);
                  });
               });
            } else {
               self._openPopup(cfg, strategy);
            }
         },

         _openPopup: function(cfg, strategy) {
            var self = this;
            this._getTemplate(cfg).addCallback(function(tpl) {
               Base.showDialog(tpl, cfg, strategy, self._popupId).addCallback(function(popupId) {
                  self._popupId = popupId;
                  self._isExecuting = false;
               });
            });
         },

         //Ленивая загрузка шаблона
         _getTemplate: function(config) {
            if (typeof config.template === 'function') {
               return (new Deferred()).callback(config.template);
            } else if (requirejs.defined(config.template)) {
               return (new Deferred()).callback(requirejs(config.template));
            } else if (!this._openerListDeferred || this._openerListDeferred.isReady()) {
               this._openerListDeferred = new Deferred();
               requirejs([config.template], function(template) {
                  this._openerListDeferred.callback(template);
               }.bind(this));
            }
            return this._openerListDeferred;
         },

         _getConfig: function(popupOptions) {
            var cfg = this._options.popupOptions ? CoreClone(this._options.popupOptions) : {};
            CoreMerge(cfg, popupOptions || {});
            cfg.opener = cfg.opener || this;
            return cfg;
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
            //todo Compatible: Для старого окружения не вызываем методы нового Manager'a
            return Base.isNewEnvironment() ? !!ManagerController.find(this._popupId) : null;
         }
      });
      Base.showDialog = function(rootTpl, cfg, strategy, popupId) {
         var def = new Deferred();

         if (Base.isNewEnvironment()) {
            if (Base.isVDOMTemplate(rootTpl) && !(cfg.templateOptions && cfg.templateOptions._initCompoundArea)) {
               if (popupId) {
                  popupId = ManagerController.update(popupId, cfg);
               } else {
                  popupId = ManagerController.show(cfg, strategy);
               }
               def.callback(popupId);
            } else {
               requirejs(['Controls/Popup/Compatible/BaseOpener'], function(CompatibleOpener) {
                  CompatibleOpener._prepareConfigForOldTemplate(cfg, rootTpl);
                  if (popupId) {
                     popupId = ManagerController.update(popupId, cfg);
                  } else {
                     popupId = ManagerController.show(cfg, strategy);
                  }
                  def.callback(popupId);
               });
            }
         } else {
            requirejs(['Controls/Popup/Compatible/BaseOpener', 'SBIS3.CONTROLS/Action/List/OpenEditDialog'], function(CompatibleOpener, OpenEditDialog) {
               var newCfg = CompatibleOpener._prepareConfigFromNewToOld(cfg);
               new OpenEditDialog().execute(newCfg);
               def.callback();
            });
         }
         return def;
      };

      Base.getDefaultOptions = function() {
         return {
            closePopupBeforeUnmount: true
         };
      };

      //TODO Compatible
      Base.isVDOMTemplate = function(templateClass) {
         //на VDOM классах есть св-во _template.
         //Если его нет, но есть _stable, значит это функция от tmpl файла
         return !!templateClass.prototype._template || !!templateClass.stable;
      };

      //TODO Compatible
      Base.isNewEnvironment = function() {
         return !!document.getElementsByTagName('html')[0].controlNodes;
      };

      return Base;
   }
);
