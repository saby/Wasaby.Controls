define('Controls/Popup/Opener/BaseOpener',
   [
      'Core/Control',
      'wml!Controls/Popup/Opener/BaseOpener',
      'Controls/Popup/Manager/ManagerController',
      'Vdom/Utils/DefaultOpenerFinder',
      'View/Runner/requireHelper',
      'Core/core-clone',
      'Core/core-merge',
      'Core/Deferred',
      'Core/helpers/isNewEnvironment'
   ],
   function(
      Control,
      Template,
      ManagerController,
      DefaultOpenerFinder,
      requireHelper,
      CoreClone,
      CoreMerge,
      Deferred,
      isNewEnvironment
   ) {
      var _private = {
         clearPopupIds: function(popupIds, opened, displayMode) {
            if (!opened && displayMode === 'single') {
               popupIds.length = 0;
            }
         }
      };

      /**
       * Базовый опенер
       * @category Popup
       * @class Controls/Popup/Opener/Base
       * @mixes Controls/interface/IOpener
       * @control
       * @private
       * @author Красильников А.С.
       */
      var Base = Control.extend({
         _template: Template,

         _beforeMount: function() {
            this._popupIds = [];
         },

         _beforeUnmount: function() {
            if (this._options.closePopupBeforeUnmount) {
               if (this._useVDOM()) {
                  this._popupIds.forEach(function(popupId) {
                     ManagerController.remove(popupId);
                  });
               } else if (this._action) { // todo Compatible: Для старого окружения не вызываем методы нового Manager'a
                  this._action.destroy();
                  this._action = null;
               }
            }
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

            _private.clearPopupIds(this._popupIds, this.isOpened(), this._options.displayMode);

            self._toggleIndicator(true);
            if (cfg.isCompoundTemplate) { // TODO Compatible: Если Application не успел загрузить совместимость - грузим сами.
               requirejs(['Controls/Popup/Compatible/Layer'], function(Layer) {
                  Layer.load().addCallback(function() {
                     self._openPopup(cfg, controller);
                  });
               });
            } else {
               self._openPopup(cfg, controller);
            }
         },

         _isPopupCreating: function() {
            return ManagerController.isPopupCreating(this._getCurrentPopupId());
         },

         _openPopup: function(cfg, controller) {
            var self = this;
            this._requireModules(cfg, controller).addCallback(function(result) {
               var
                  popupId = self._options.displayMode === 'single' ? self._getCurrentPopupId() : null;

               if (!self._isPopupCreating()) {
                  cfg._vdomOnOldPage = self._options._vdomOnOldPage;
                  Base.showDialog(result.template, cfg, result.controller, popupId, self).addCallback(function(result) {
                     if (self._useVDOM()) {
                        self._popupIds.push(result);
                        self._toggleIndicator(false);

                        // Call redraw to create emitter on scroll after popup opening
                        self._forceUpdate();
                     } else {
                        self._action = result;
                     }
                  });
               } else {
                  self._toggleIndicator(false);
               }
            });
         },

         // Ленивая загрузка шаблона
         _requireModules: function(config, controller) {
            if (this._openerListDeferred && !this._openerListDeferred.isReady()) {
               return (new Deferred()).errback('Protection against multiple invocation of the open method');
            }

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
            return typeof module === 'string' && !requireHelper.defined(module);
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
            cfg.opener = cfg.opener || DefaultOpenerFinder.find(this);
            return cfg;
         },

         _toggleIndicator: function(visible) {
            if (this._useVDOM()) {
               this._children.LoadingIndicator.toggleIndicator(visible);
            }
         },

         /**
          * Закрыть всплывающую панель
          * @function Controls/Popup/Opener/Base#show
          */
         close: function() {
            // TODO переработать метод close по задаче: https://online.sbis.ru/opendoc.html?guid=aec286ce-4116-472e-8267-f85a6a82a188
            if (this._getCurrentPopupId()) {
               ManagerController.remove(this._getCurrentPopupId());

               // Ещё нужно удалить текущий id из массива всех id
               this._popupIds.pop();
            } else if (!Base.isNewEnvironment() && this._action) {
               this._action.closeDialog();
            }
         },

         _scrollHandler: function(event) {
            // listScroll стреляет событием много раз, нужно обработать только непосредственно скролл списка
            if (this.isOpened() && event.type === 'scroll') {
               if (this._options.targetTracking) {
                  ManagerController.popupUpdated(this._getCurrentPopupId());
               } else if (this._options.closeOnTargetScroll) {
                  this._closeOnTargetScroll();
               }
            }
         },
         _closeOnTargetScroll: function() {
            this.close();
         },

         _getCurrentPopupId: function() {
            return this._popupIds[this._popupIds.length - 1];
         },

         /**
          * Получить признак, открыта или закрыта связанная всплывающая панель
          * @function Controls/Popup/Opener/Base#isOpened
          * @returns {Boolean} Признак открыта ли связанная всплывающая панель
          */
         isOpened: function() {
            // todo Compatible: Для старого окружения не вызываем методы нового Manager'a
            if (this._useVDOM()) {
               return !!ManagerController.find(this._getCurrentPopupId());
            }
            if (this._action) {
               return !!this._action.getDialog();
            }
            return null;
         },
         _useVDOM: function() {
            return Base.isNewEnvironment() || this._options._vdomOnOldPage;
         }
      });
      Base.showDialog = function(rootTpl, cfg, controller, popupId, opener) {
         var def = new Deferred();

         if (Base.isNewEnvironment() || cfg._vdomOnOldPage) {
            if (!Base.isNewEnvironment()) {
               Base.getManager().addCallback(function() {
                  Base._openPopup(popupId, cfg, controller, def);
               });
            } else if (Base.isVDOMTemplate(rootTpl) && !(cfg.templateOptions && cfg.templateOptions._initCompoundArea)) {
               Base._openPopup(popupId, cfg, controller, def);
            } else {
               requirejs(['Controls/Popup/Compatible/BaseOpener'], function(CompatibleOpener) {
                  CompatibleOpener._prepareConfigForOldTemplate(cfg, rootTpl);
                  Base._openPopup(popupId, cfg, controller, def);
               });
            }
         } else {
            var isFormController = false;
            var proto = rootTpl.prototype && rootTpl.prototype.__proto__;
            while (proto && !isFormController) {
               if (proto._moduleName === 'SBIS3.CONTROLS/FormController') {
                  isFormController = true;
               }
               proto = proto.__proto__;
            }

            var deps = ['Controls/Popup/Compatible/BaseOpener'];

            if (isFormController) {
               deps.push('SBIS3.CONTROLS/Action/List/OpenEditDialog');
            } else {
               deps.push('SBIS3.CONTROLS/Action/OpenDialog');
            }

            if (typeof cfg.template === 'string') {
               deps.push(cfg.template);
            }

            requirejs(deps, function(CompatibleOpener, Action, Tpl) {
               if (opener && opener._options.closeOnTargetScroll) {
                  cfg.closeOnTargetScroll = true;
               }

               var newCfg = CompatibleOpener._prepareConfigFromNewToOld(cfg, Tpl || cfg.template);
               var action;
               if (!opener || !opener._action) {
                  action = new Action({
                     closeByFocusOut: true,
                  });
               } else {
                  action = opener._action;
               }

               var dialog = action.getDialog(),
                  compoundArea = dialog && dialog._getTemplateComponent();
               if (compoundArea && !isFormController) {
                  // Перерисовываем открытый шаблон по новым опциям
                  CompatibleOpener._prepareConfigForNewTemplate(newCfg);
                  compoundArea.setTemplateOptions(newCfg.componentOptions.templateOptions);
                  dialog.setTarget && dialog.setTarget($(newCfg.target));
               } else {
                  action.closeDialog();
                  action._isExecuting = false;
                  action.execute(newCfg);
               }
               def.callback(action);
            });
         }
         return def;
      };

      Base._openPopup = function(popupId, cfg, controller, def) {
         if (popupId) {
            popupId = ManagerController.update(popupId, cfg);
         } else {
            popupId = ManagerController.show(cfg, controller);
         }
         def.callback(popupId);
      };

      Base.getDefaultOptions = function() {
         return {
            closePopupBeforeUnmount: true,
            displayMode: 'single',
            _vdomOnOldPage: false // Всегда открываем вдомную панель
         };
      };

      // TODO Compatible
      Base.isVDOMTemplate = function(templateClass) {
         // на VDOM классах есть св-во _template.
         // Если его нет, но есть _stable, значит это функция от tmpl файла
         return !!(templateClass.prototype && templateClass.prototype._template) || !!templateClass.stable || !!(templateClass[0] && templateClass[0].func);
      };

      // TODO Compatible
      Base.isNewEnvironment = function() {
         return isNewEnvironment();
      };

      // TODO Compatible
      Base.getManager = function() {
         var managerContainer = document.body.querySelector('.controls-PopupContainer');
         var deferred = new Deferred();
         if (!managerContainer) {
            managerContainer = document.createElement('div');
            managerContainer.classList.add('controls-PopupContainer');
            document.body.insertBefore(managerContainer, document.body.firstChild);

            require(['Core/Control', 'Controls/Popup/Compatible/ManagerWrapper'], function(control, ManagerWrapper) {
               var wrapper = control.createControl(ManagerWrapper, {}, managerContainer);

               // mount не синхронный, дожидаемся когда менеджер добавится в дом
               if (!wrapper._mounted) {
                  var intervalId = setInterval(function() {
                     if (wrapper._mounted) {
                        clearInterval(intervalId);
                        deferred.callback();
                     }
                  }, 20);
               } else {
                  deferred.callback();
               }
            });
            return deferred;
         }
         return deferred.callback();
      };

      Base._private = _private;

      return Base;
   });
