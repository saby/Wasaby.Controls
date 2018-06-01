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
            this.close();
         },

         /**
          * Открыть всплывающую панель
          * @function Controls/Popup/Opener/Base#open
          * @param popupOptions конфигурация попапа
          * @param controller стратегия позиционирования попапа
          */
         open: function(popupOptions, controller) {
            var self = this;
            var cfg = this._getConfig(popupOptions);

            if (this._isExecuting) { //Если мы еще не обработали первый вызов, то дожидаемся его
               return;
            }
            this._isExecuting = true;

            if (Base.isNewEnvironment() && !this.isOpened()) { // удаляем неактуальный id
               this._popupId = null;
            }

            if (cfg.isCompoundTemplate) { //TODO Compatible: Если Application не успел загрузить совместимость - грузим сами.
               requirejs(['Controls/Popup/Compatible/Layer'], function(Layer) {
                  Layer.load().addCallback(function() {
                     self._openPopup(cfg, controller);
                  });
               });
            } else {
               self._openPopup(cfg, controller);
            }
         },

         _openPopup: function(cfg, controller) {
            var self = this;
            this._requireModules(cfg, controller).addCallback(function(result) {
               Base.showDialog(result.template, cfg, result.controller, self._popupId).addCallback(function(popupId) {
                  self._popupId = popupId;
                  self._isExecuting = false;
               });
            });
         },

         //Ленивая загрузка шаблона
         _requireModules: function(config, controller) {
            var deps = [];
            if (this._needRequireModule(config.template)) {
               deps.push(config.template);
            }
            if (this._needRequireModule(controller)) {
               deps.push(controller);
            }

            if (deps.length) {
               this._openerListDeferred = new Deferred();
               requirejs(deps, function() {
                  this._openerListDeferred.callback(this._getRequiredModules(config.template, controller));
               }.bind(this));
               return this._openerListDeferred;
            }
            return (new Deferred()).callback(this._getRequiredModules(config.template, controller));
         },

         _needRequireModule: function(module) {
            return typeof module === 'string' && !requirejs.defined(module);
         },

         _getRequiredModules: function(template, controller) {
            return {
               template: typeof template === 'string' ? requirejs(template) : template,
               controller: typeof controller === 'string' ? requirejs(controller) : controller
            };
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
            return !!ManagerController.find(this._popupId);
         }
      });
      Base.showDialog = function(rootTpl, cfg, controller, popupId) {
         var def = new Deferred();

         if (Base.isNewEnvironment()) {
            if (Base.isVDOMTemplate(rootTpl) && !(cfg.templateOptions && cfg.templateOptions._initCompoundArea)) {
               if (popupId) {
                  popupId = ManagerController.update(popupId, cfg);
               } else {
                  popupId = ManagerController.show(cfg, controller);
               }
               def.callback(popupId);
            } else {
               requirejs(['Controls/Popup/Compatible/BaseOpener'], function(CompatibleOpener) {
                  CompatibleOpener._prepareConfigForOldTemplate(cfg, rootTpl);
                  if (popupId) {
                     popupId = ManagerController.update(popupId, cfg);
                  } else {
                     popupId = ManagerController.show(cfg, controller);
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
