define('Controls/Popup/Opener/BaseOpener',
   [
      'Core/Control',
      'wml!Controls/Popup/Opener/BaseOpener',
      'Controls/Popup/Manager/ManagerController',
      'Vdom/Vdom',
      'Core/core-clone',
      'Core/core-merge',
      'Env/Env',
      'Core/Deferred',
      'Core/helpers/isNewEnvironment',
      'Core/library'
   ],
   function(
      Control,
      Template,
      ManagerController,
      Vdom,
      coreClone,
      CoreMerge,
      Env,
      Deferred,
      isNewEnvironment,
      library
   ) {
      var _private = {
         clearPopupIds: function(popupIds, opened, displayMode) {
            if (!opened && displayMode === 'single') {
               popupIds.length = 0;
            }
         },
         compatibleOpen: function(self, cfg, controller) {
            requirejs(['Lib/Control/LayerCompatible/LayerCompatible'], function(Layer) {
               Layer.load().addCallback(function() {
                  self._openPopup(cfg, controller);
               });
            });
         }
      };

      /**
       * Base Popup opener
       * @category Popup
       * @class Controls/Popup/Opener/BaseOpener
       * @mixes Controls/interface/IOpener
       * @control
       * @private
       * @author Красильников А.С.
       */
      var Base = Control.extend({
         _template: Template,

         _beforeMount: function(options) {
            this._popupIds = [];

            if (options.popupOptions) {
               Env.IoC.resolve('ILogger').warn(this._moduleName, 'The "popupOptions" option will be removed. Use the configuration on the control options.');
            }
         },

         _afterMount: function() {
            this._openerUpdateCallback = this._updatePopup.bind(this);
            this._notify('registerOpenerUpdateCallback', [this._openerUpdateCallback], { bubbling: true });
         },

         _beforeUnmount: function() {
            this._notify('unregisterOpenerUpdateCallback', [this._openerUpdateCallback], { bubbling: true });
            this._toggleIndicator(false);
            if (this._options.closePopupBeforeUnmount) {
               if (this._useVDOM()) {
                  this._popupIds.forEach(function(popupId) {
                     ManagerController.remove(popupId);
                  });
               } else if (this._action) { // todo Compatible
                  this._action.destroy();
                  this._action = null;
               }
            }
         },

         open: function(popupOptions, controller) {
            var cfg = this._getConfig(popupOptions);
            _private.clearPopupIds(this._popupIds, this.isOpened(), this._options.displayMode);

            this._toggleIndicator(true);
            if (cfg.isCompoundTemplate) { // TODO Compatible: Если Application не успел загрузить совместимость - грузим сами.
               _private.compatibleOpen(this, cfg, controller);
            } else {
               this._openPopup(cfg, controller);
            }
         },

         _openPopup: function(cfg, controller) {
            var self = this;
            this._requireModules(cfg, controller).addCallback(function(result) {
               var
                  popupId = self._options.displayMode === 'single' ? self._getCurrentPopupId() : null;

               cfg._vdomOnOldPage = self._options._vdomOnOldPage;
               Base.showDialog(result.template, cfg, result.controller, popupId, self).addCallback(function(result) {
                  self._toggleIndicator(false);
                  if (self._useVDOM()) {
                     if (self._popupIds.indexOf(result) === -1) {
                        self._popupIds.push(result);
                     }

                     // Call redraw to create emitter on scroll after popup opening
                     self._forceUpdate();
                  } else {
                     self._action = result;
                  }
               });
               return result;
            });
         },

         // Lazy load template

         /**
          *
          * @param config
          * @param controller
          * @return {Promise.<{template: Function; controller: Function}>}
          * @private
          */
         _requireModules: function(config, controller) {
            var self = this;
            if (this._requireModulesPromise) {
               return this._requireModulesPromise;
            }
            return Promise.all([
               self._requireModule(config.template),
               self._requireModule(controller)
            ]).then(function(results) {
               return {
                  template: results[0],
                  controller: results[1]
               };
            });
         },

         /**
          * @param {String | Function} module
          * @return {Promise.<Function>}
          * @private
          */
         _requireModule: function(module) {
            return typeof module === 'string' ? library.load(module) : Promise.resolve(module);
         },

         _getConfig: function(popupOptions) {
            var baseConfig = coreClone(this._options.popupOptions || {});

            // TODO: CoreClone copies objects and arrays recursively and templates are represented
            // as arrays. Templates have 2 fields (`isDataArray` and `toString()`) which are not
            // enumerable and are not copied by coreClone, so the template can break.
            //
            // BaseOpener needs to have its own clone method, which does not recursively clone
            // templates.
            // https://online.sbis.ru/opendoc.html?guid=a3311385-0488-4558-8e96-b52984b2651a
            baseConfig.template = (popupOptions || {}).template || (this._options.popupOptions || {}).template;

            // todo https://online.sbis.ru/opendoc.html?guid=770587ec-2016-4496-bc14-14787eb8e713
            var options = [
               'closeByExternalClick',
               'isCompoundTemplate',
               'eventHandlers',
               'autoCloseOnHide',
               'autoClose',
               'type',
               'style',
               'message',
               'details',
               'yesCaption',
               'noCaption',
               'cancelCaption',
               'okCaption',
               'autofocus',
               'isModal',
               'modal',
               'closeOnOutsideClick',
               'className',
               'template',
               'templateOptions',
               'minWidth',
               'maxWidth',
               'maximize',
               'width',
               'resizable',
               'top',
               'autoHide',
               'left',
               'maxHeight',
               'minHeight',
               'draggable',
               'horizontalAlign',
               'verticalAlign',
               'offset',
               'direction',
               'corner',
               'targetPoint',
               'locationStrategy',
               'actionOnScroll',
            ];

            // merge _options to popupOptions
            for (var i = 0; i < options.length; i++) {
               var option = options[i];
               if (this._options[option] !== undefined) {
                  baseConfig[option] = this._options[option];
               }
            }

            var baseCfg = coreClone(baseConfig);
            CoreMerge(baseCfg, coreClone(popupOptions || {}));

            if (baseCfg.hasOwnProperty('closeByExternalClick')) {
               Env.IoC.resolve('ILogger').warn(this._moduleName, 'Use option "closeOnOutsideClick" instead of "closeByExternalClick"');
               baseCfg.closeOnOutsideClick = baseCfg.closeByExternalClick;
            }

            if (baseCfg.hasOwnProperty('isModal')) {
               Env.IoC.resolve('ILogger').warn(this._moduleName, 'Use option "modal" instead of "isModal"');
               baseCfg.modal = baseCfg.isModal;
            }

            if (baseCfg.hasOwnProperty('locationStrategy')) {
               Env.IoC.resolve('ILogger').warn(this._moduleName, 'Use option "fittingMode" instead of "locationStrategy"');
               baseCfg.fittingMode = baseCfg.locationStrategy;
            }

            // Opener can't be empty. If we don't find the defaultOpener, then install the current control
            baseCfg.opener = baseCfg.opener || Vdom.DefaultOpenerFinder.find(this) || this;
            this._prepareNotifyConfig(baseCfg);
            return baseCfg;
         },

         _prepareNotifyConfig: function(cfg) {
            this._notifyEvent = this._notifyEvent.bind(this);

            // Handlers for popup events
            cfg._events = {
               onOpen: this._notifyEvent,
               onResult: this._notifyEvent,
               onClose: this._notifyEvent
            };

            if (cfg.eventHandlers) {
               Env.IoC.resolve('ILogger').warn(this._moduleName, 'Use an opener subscription instead of popupOptions.eventHandlers');
            }
         },

         _notifyEvent: function(eventName, args) {
            // Trim the prefix "on" in the event name
            var event = eventName.substr(2);
            var newEvent = event.toLowerCase();
            this._notify(event, args);
            Env.IoC.resolve('ILogger').warn(this._moduleName, 'Use event "' + newEvent + '" instead of "popup' + event + '"');
            this._notify('popup' + event, args);
         },

         _toggleIndicator: function(visible) {
            if (visible) {
               var cfg = {
                  id: this._indicatorId,
                  message: rk('Загрузка')
               };
               this._indicatorId = this._notify('showIndicator', [cfg], { bubbling: true });
            } else if (this._indicatorId) {
               this._notify('hideIndicator', [this._indicatorId], { bubbling: true });
               this._indicatorId = null;
            }
         },

         /**
          * Closes a popup
          * @function Controls/Popup/Opener/Base#close
          */
         close: function() {
            var self = this;
            var popupId = this._getCurrentPopupId();
            if (this._getCurrentPopupId()) {
               ManagerController.remove(this._getCurrentPopupId()).addCallback(function() {
                  // todo: Перейти с массива на collection.list
                  if (self._popupIds.indexOf(popupId) > -1) {
                     self._popupIds.splice(self._popupIds.indexOf(popupId), 1);
                  }
               });
            } else if (!Base.isNewEnvironment() && this._action) {
               this._action.closeDialog();
            }
         },

         _scrollHandler: function(event) {
            if (this.isOpened() && event.type === 'scroll') {
               if (this._options.targetTracking) {
                  this._updatePopup();
               } else if (this._options.closeOnTargetScroll) {
                  this._closeOnTargetScroll();
               }
            }
         },

         _updatePopup: function() {
            ManagerController.popupUpdated(this._getCurrentPopupId());
         },

         _closeOnTargetScroll: function() {
            this.close();
         },

         _getCurrentPopupId: function() {
            return this._popupIds[this._popupIds.length - 1];
         },

         /**
          * State of whether the popup is open
          * @function Controls/Popup/Opener/Base#isOpened
          * @returns {Boolean} Is popup opened
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
                  Base.getZIndexUtil().addCallback(function(getZIndex) {
                     cfg.zIndex = cfg.zIndex || getZIndex(opener);
                     Base._openPopup(popupId, cfg, controller, def);
                  });
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

               // Check, if opened VDOM template on oldPage (we have compatible layer), then try reload template.
               if (compoundArea && compoundArea._moduleName === 'Controls/Popup/Compatible/CompoundAreaForNewTpl/CompoundArea' && !isFormController && compoundArea._options.template === newCfg.template) {
                  // Redraw template with new options
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

      Base.getZIndexUtil = function() {
         var deferred = new Deferred();
         var module = 'Controls/Utils/getZIndex';
         if (requirejs.defined(module)) {
            return deferred.callback(requirejs(module));
         }
         requirejs([module], function(getZIndex) {
            return deferred.callback(getZIndex);
         });
         return deferred;
      };

      Base._openPopup = function(popupId, cfg, controller, def) {
         if (popupId) {
            if (ManagerController.isPopupCreating(popupId)) {
               ManagerController.updateOptionsAfterInitializing(popupId, cfg);
            } else {
               popupId = ManagerController.update(popupId, cfg);
            }
         } else {
            popupId = ManagerController.show(cfg, controller);
         }
         def.callback(popupId);
      };

      Base.getDefaultOptions = function() {
         return {
            closePopupBeforeUnmount: true,
            displayMode: 'single',
            _vdomOnOldPage: false // Always open vdom panel
         };
      };

      // TODO Compatible
      Base.isVDOMTemplate = function(templateClass) {
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

               // wait until the Manager is added to the DOM
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
