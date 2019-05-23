import Control = require('Core/Control');
import Template = require('wml!Controls/_popup/Opener/BaseOpener');
import ManagerController = require('Controls/_popup/Manager/ManagerController');
import Vdom = require('Vdom/Vdom');
import coreClone = require('Core/core-clone');
import CoreMerge = require('Core/core-merge');
import Env = require('Env/Env');
import Deferred = require('Core/Deferred');
import isNewEnvironment = require('Core/helpers/isNewEnvironment');
import {parse as parserLib, load} from 'Core/library';

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
       * @class Controls/_popup/Opener/BaseOpener
       * @mixes Controls/interface/IOpener
       * @control
       * @private
       * @author Красильников А.С.
       */
      var Base = Control.extend({
         _template: Template,
         _actionOnScroll: 'none',

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
            var cfg = this._getConfig(popupOptions || {});
            this._actionOnScroll = cfg.actionOnScroll;
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
            this._requireModules(cfg, controller).addCallback((result) => {
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
            }).addErrback(()=> {
               self._toggleIndicator(false);
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

               // todo https://online.sbis.ru/opendoc.html?guid=b954dff3-9aa5-4415-a9b2-7d3430bb20a5
               // If Opener was destroyed while template loading, then don't open popup.
               if (!self._destroyed || self._options.closePopupBeforeUnmount === false) {
                  return {
                     template: results[0],
                     controller: results[1]
                  };
               }
               return new Error('Opener was destroyed');
            });
         },

         /**
          * @param {String | Function} module
          * @return {Promise.<Function>}
          * @private
          */
         _requireModule: function(module) {
            return typeof module === 'string' ? load(module) : Promise.resolve(module);
         },

         _getConfig(popupOptions:Object): Object {
            let baseConfig = { ...this._options.popupOptions };

            // todo https://online.sbis.ru/opendoc.html?guid=770587ec-2016-4496-bc14-14787eb8e713
            let options = [
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
               'closeOnTargetScroll',
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
               'targetTracking',
               'locationStrategy',
               'actionOnScroll',
            ];

            // merge _options to popupOptions
            for (let i = 0; i < options.length; i++) {
               let option = options[i];
               if (this._options[option] !== undefined) {
                  baseConfig[option] = this._options[option];
               }
            }

            let templateOptions = {};
            CoreMerge(templateOptions, baseConfig.templateOptions || {});
            CoreMerge(templateOptions, popupOptions.templateOptions || {});
            let baseCfg = { ...baseConfig, ...popupOptions, templateOptions };

            if (baseCfg.hasOwnProperty('closeByExternalClick')) {
               Env.IoC.resolve('ILogger').warn(this._moduleName, 'Use option "closeOnOutsideClick" instead of "closeByExternalClick"');
               baseCfg.closeOnOutsideClick = baseCfg.closeByExternalClick;
            }
            if (baseCfg.hasOwnProperty('closeOnTargetScroll')) {
               Env.IoC.resolve('ILogger').warn(this._moduleName, 'Use option "actionOnScroll" instead of "closeOnTargetScroll"');
               if(baseCfg.closeOnTargetScroll) {
                  baseCfg.actionOnScroll = 'close';
               }
            }
            if (baseCfg.hasOwnProperty('targetTracking')) {
               Env.IoC.resolve('ILogger').warn(this._moduleName, 'Use option "actionOnScroll" instead of "targetTracking"');
               if(baseCfg.targetTracking) {
                  baseCfg.actionOnScroll = 'track';
               }
            }
            if(baseCfg.actionOnScroll) {
              this._actionOnScroll = baseCfg.actionOnScroll;
            }

            if (baseCfg.hasOwnProperty('isModal')) {
               Env.IoC.resolve('ILogger').warn(this._moduleName, 'Use option "modal" instead of "isModal"');
               baseCfg.modal = baseCfg.isModal;
            }

            if (baseCfg.hasOwnProperty('locationStrategy')) {
               Env.IoC.resolve('ILogger').warn(this._moduleName, 'Use option "fittingMode" instead of "locationStrategy"');
               baseCfg.fittingMode = baseCfg.locationStrategy;
            }

            // if the .opener property is not set, then set the defaultOpener or the current control
            if (!baseCfg.hasOwnProperty('opener')) {
               baseCfg.opener = Vdom.DefaultOpenerFinder.find(this) || this;
            }

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
          * @function Controls/_popup/Opener/Base#close
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
               if (this._actionOnScroll==='close') {
                  this._closeOnTargetScroll();
               } else if (this._actionOnScroll==='track') {
                  this._updatePopup();
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
          * @function Controls/_popup/Opener/Base#isOpened
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
                     cfg.theme = opener._options.theme;
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
               var libInfo = parserLib(cfg.template);

               deps.push(libInfo.name);
            }

            requirejs(deps, function(CompatibleOpener, Action, Tpl) {
               if (opener && opener._options.closeOnTargetScroll) {
                  cfg.closeOnTargetScroll = true;
               }

               if (libInfo && libInfo.path.length !== 0) {
                  cfg.template = Tpl;
                  libInfo.path.forEach(function(key) {
                     cfg.template = cfg.template[key];
                  });
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
            actionOnScroll: 'none',
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

      export = Base;

