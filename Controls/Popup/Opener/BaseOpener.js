define('Controls/Popup/Opener/BaseOpener',
   [
      'Core/Control',
      'tmpl!Controls/Popup/Opener/BaseOpener',
      'Controls/Popup/Manager/ManagerController',
      'Core/core-clone',
      'Core/core-merge',
      'Core/Deferred'
   ],
   function(Control, Template, ManagerController, CoreClone, CoreMerge, Deferred) {
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
         _template: Template,
         _popupIds: [],
         _currentPopupId: undefined,

         _beforeUnmount: function() {
            if (this._options.closePopupBeforeUnmount) {
               this._popupIds.forEach(function(popupId) {
                  ManagerController.remove(popupId);
               });
            }
         },

         /**
          * Открыть всплывающую панель
          * @function Controls/Popup/Opener/Base#open
          * @param popupOptions конфигурация попапа
          * @param controller стратегия позиционирования попапа
          * @param displayMode режим отображения попапа
          * @variant 'single' одновременно на экране может присутствовать только один попап
          * @variant 'multiple' одновременно на экране может присутствовать несколько попапов
          */
         open: function(popupOptions, controller, displayMode) {
            var self = this;
            var cfg = this._getConfig(popupOptions);
            var shouldCreateNewPopup = !this.isOpened() || displayMode === 'multiple';

            if (this._isExecuting) { // Если мы еще не обработали первый вызов, то дожидаемся его
               return;
            }
            this._isExecuting = true;

            if (shouldCreateNewPopup) { // удаляем неактуальный id
               this._currentPopupId = null;
            }

            if (cfg.isCompoundTemplate) { // TODO Compatible: Если Application не успел загрузить совместимость - грузим сами.
               requirejs(['Controls/Popup/Compatible/Layer'], function(Layer) {
                  Layer.load().addCallback(function() {
                     self._openPopup(cfg, controller);
                  });
               });
            } else {
               self._openPopup(cfg, controller, displayMode);
            }
         },

         _openPopup: function(cfg, controller, displayMode) {
            var self = this;
            this._requireModules(cfg, controller).addCallback(function(result) {
               Base.showDialog(result.template, cfg, result.controller, self._popupId).addCallback(function(result) {
                  self._isExecuting = false;
                  if (Base.isNewEnvironment()) {
                     self._popupIds.push(result);
                  } else {
                     self._action = result;
                  }
               });
            });
         },

         // Ленивая загрузка шаблона
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
            if (this._currentPopupId) {
               ManagerController.remove(this._currentPopupId);

               //Ещё нужно удалить текущий id из массива всех id
               this._popupIds.splice(this._popupIds.indexOf(this._currentPopupId), 1);
            } else if (!Base.isNewEnvironment() && this._action) {
               this._action.destroy();
               this._action = null;
            }
         },

         _scrollHandler: function(event) {
            // listScroll стреляет событием много раз, нужно обработать только непосредственно скролл списка
            if (this.isOpened() && event.type === 'listscroll') {
               if (this._options.targetTracking) {
                  ManagerController.popupUpdated(this._currentPopupId);
               } else if (this._options.closeOnTargetScroll) {
                  this._closeOnTargetScroll();
               }
            }
         },
         _closeOnTargetScroll: function() {
            this.close();
         },

         /**
          * Получить признак, открыта или закрыта связанная всплывающая панель
          * @function Controls/Popup/Opener/Base#isOpened
          * @returns {Boolean} Признак открыта ли связанная всплывающая панель
          */
         isOpened: function() {
            // todo Compatible: Для старого окружения не вызываем методы нового Manager'a
            return Base.isNewEnvironment() ? !!ManagerController.find(this._currentPopupId) : null;
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
               var action = new OpenEditDialog();
               action.execute(newCfg);
               def.callback(action);
            });
         }
         return def;
      };

      Base.getDefaultOptions = function() {
         return {
            closePopupBeforeUnmount: true
         };
      };

      // TODO Compatible
      Base.isVDOMTemplate = function(templateClass) {
         // на VDOM классах есть св-во _template.
         // Если его нет, но есть _stable, значит это функция от tmpl файла
         return !!templateClass.prototype._template || !!templateClass.stable;
      };

      // TODO Compatible
      Base.isNewEnvironment = function() {
         return !!document.getElementsByTagName('html')[0].controlNodes;
      };

      return Base;
   });
