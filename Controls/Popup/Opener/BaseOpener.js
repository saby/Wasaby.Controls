define('Controls/Popup/Opener/BaseOpener',
   [
      'Core/Control',
      'wml!Controls/Popup/Opener/BaseOpener',
      'Controls/Popup/Manager/ManagerController',
      'Core/vdom/Utils/DefaultOpenerFinder',
      'Core/core-clone',
      'Core/core-merge',
      'Core/Deferred',
      'Controls/Utils/isNewEnvironment'
   ],
   function(
      Control,
      Template,
      ManagerController,
      DefaultOpenerFinder,
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
       * @public
       * @author Красильников А.С.
       */
      var Base = Control.extend({
         _template: Template,

         _beforeMount: function() {
            this._popupIds = [];
         },

         _beforeUnmount: function() {
            if (this._options.closePopupBeforeUnmount) {
               if (Base.isNewEnvironment()) {
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
                  Base.showDialog(result.template, cfg, result.controller, popupId, self).addCallback(function(result) {
                     if (Base.isNewEnvironment()) {
                        self._popupIds.push(result);

                        //Call redraw to create emitter on scroll after popup opening
                        self._forceUpdate();
                     } else {
                        self._action = result;
                     }
                  });
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
            cfg.opener = cfg.opener || DefaultOpenerFinder.find(this);
            return cfg;
         },

         /**
          * Закрыть всплывающую панель
          * @function Controls/Popup/Opener/Base#show
          */
         close: function() {
            //TODO переработать метод close по задаче: https://online.sbis.ru/opendoc.html?guid=aec286ce-4116-472e-8267-f85a6a82a188
            if (this._getCurrentPopupId()) {
               ManagerController.remove(this._getCurrentPopupId());

               //Ещё нужно удалить текущий id из массива всех id
               this._popupIds.pop();
            } else if (!Base.isNewEnvironment() && this._action) {
               this._action.destroy();
               this._action = null;
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
            if (Base.isNewEnvironment()) {
               return !!ManagerController.find(this._getCurrentPopupId());
            }
            if (this._action) {
               return !!this._action.getDialog();
            }
            return null;
         }
      });
      Base.showDialog = function(rootTpl, cfg, controller, popupId, opener) {
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

            requirejs(deps, function(CompatibleOpener, Action) {
               if (opener && opener._options.closeOnTargetScroll) {
                  cfg.closeOnTargetScroll = true;
               }
               var newCfg = CompatibleOpener._prepareConfigFromNewToOld(cfg);
               var action;
               if (!opener || !opener._action) {
                  action = new Action({
                     closeByFocusOut: true,
                  });
               } else {
                  action = opener._action;
               }

               var dialog = action.getDialog();

               if (dialog && !isFormController) {
                  //Перерисовываем открытый шаблон по новым опциям
                  var compoundArea = dialog._getTemplateComponent();
                  CompatibleOpener._prepareConfigForNewTemplate(newCfg);
                  if (compoundArea) {
                     compoundArea.setInnerComponentOptions(newCfg.componentOptions.innerComponentOptions);
                     dialog.setTarget && dialog.setTarget($(newCfg.target));
                     dialog._recalcPosition && dialog._recalcPosition();
                  }
               } else {
                  action.closeDialog();
                  action.execute(newCfg);
               }
               def.callback(action);
            });
         }
         return def;
      };

      Base.getDefaultOptions = function() {
         return {
            closePopupBeforeUnmount: true,
            displayMode: 'single'
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
         return isNewEnvironment();
      };

      Base._private = _private;

      return Base;
   });
