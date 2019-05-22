define('Controls/Popup/Global', ['Core/Control', 'wml!Controls/Popup/Global/Global', 'Controls/Popup/Global/Openers', 'Core/Deferred'],
   function(Control, template, GlobalOpeners, Deferred) {
      var _private = {
         getPopupConfig: function(config) {
            var def = new Deferred();

            // Find opener for Infobox
            if (!config.opener) {
               requirejs(['Vdom/Vdom'], function(Vdom) {
                  config.opener = Vdom.DefaultOpenerFinder.find(config.target);
                  def.callback(config);
               });
               return def;
            }

            return def.callback(config);
         }
      };

      return Control.extend({
         _template: template,
         _afterMount: function() {
            var openerContainer = this._getOpenerContainer();
            this._globalOpeners = Control.createControl(GlobalOpeners, {}, openerContainer);

            // В старом окружении регистрируем GlobalPopup, чтобы к нему был доступ.
            // На вдоме ничего не зарегистрируется, т.к. слой совместимости там не подгрузится
            var ManagerWrapperControllerModule = 'Controls/Popup/Compatible/ManagerWrapper/Controller';
            if (requirejs.defined(ManagerWrapperControllerModule)) {
               requirejs(ManagerWrapperControllerModule).registerGlobalPopup(this);
            }
         },

         _getOpenerContainer: function() {
            // PopupGlobal - hoc, that wraps the body. we can't put opener on template, cause it's breaking  layout of page.
            var container = document.createElement('div');
            container.setAttribute('data-vdom-ignore', true);
            container.setAttribute('class', 'controls-PopupGlobal__container');
            var openersContainer = document.createElement('div');
            container.append(openersContainer);
            document.body.append(container);
            return openersContainer;
         },

         getPreviewer: function() {
            return this._globalOpeners.getPreviewer();
         },
         getInfoBox: function() {
            return this._globalOpeners.getInfoBox();
         },
         getDialog: function() {
            return this._globalOpeners.getDialog();
         },

         _openInfoBoxHandler: function(event, config) {
            var self = this;
            this._activeInfobox = event.target;
            _private.getPopupConfig(config).addCallback(function(popupConfig) {
               self.getInfoBox().open(popupConfig);
            });
         },

         _closeInfoBoxHandler: function(event, delay) {
            // TODO: fixed by https://online.sbis.ru/doc/d7b89438-00b0-404f-b3d9-cc7e02e61bb3
            var activeInf = this._activeInfobox && this._activeInfobox.get ? this._activeInfobox.get(0) : this._activeInfobox;
            var eventTarget = event.target && event.target.get ? event.target.get(0) : event.target;
            if (activeInf === eventTarget) {
               this._activeInfobox = null;
               this.getInfoBox().close(delay);
            }
         },

         // Needed to immediately hide the infobox after its target or one
         // of their parent components are hidden
         // Will be removed:
         // https://online.sbis.ru/opendoc.html?guid=1b793c4f-848a-4735-b96a-f0c1cf479fab
         _forceCloseInfoBoxHandler: function() {
            if (this._activeInfobox) {
               this._activeInfobox = null;
               this.getInfoBox().close(0);
            }
         },
         _openPreviewerHandler: function(event, config, type) {
            this._activePreviewer = event.target;
            this.getPreviewer().open(config, type);
         },

         _closePreviewerHandler: function(event, type) {
            this.getPreviewer().close(type);
         },

         _cancelPreviewerHandler: function(event, action) {
            this.getPreviewer().cancel(action);
         },
         _isPreviewerOpenedHandler: function(event) {
            if (this._activePreviewer === event.target) {
               return this.getPreviewer().isOpened();
            }
            return false;
         },
         _popupBeforeDestroyedHandler: function(event, popupCfg, popupList, popupContainer) {
            if (this._activeInfobox) {
               // If infobox is displayed inside the popup, then close infobox.
               if (this._needCloseInfoBox(this._activeInfobox, popupContainer)) {
                  this._activeInfobox = null;
                  this.getInfoBox().close(0);
               }
            }
         },

         _needCloseInfoBox: function(infobox, popup) {
            var parent = infobox.parentElement;
            while (parent) {
               if (parent === popup) {
                  return true;
               }
               parent = parent.parentElement;
            }
            return false;
         },

         /**
          * open modal dialog
          * @param event
          * @param {String | Function} template
          * @param {Object} templateOptions
          * @return {Promise.<void>} result promise
          * @private
          */
         _openDialogHandler: function(event, template, templateOptions) {
            var _this = this;

            // т.к. диалог может быть только один, отработаем колбек закрытия предыдущего, если он есть
            _this._onDialogClosed();

            _this.getDialog().open({
               template: template,
               templateOptions: templateOptions,
               eventHandlers: {
                  onClose: _this._onDialogClosed.bind(_this)
               }
            });

            //
            return new Promise(function(resolve, reject) {
               _this._closedDialodResolve = resolve;
            });
         },
         _onDialogClosed: function() {
            if (this._closedDialodResolve) {
               this._closedDialodResolve();
               delete this._closedDialodResolve;
            }
         },
         _beforeUnmount: function() {
            this._globalOpeners.destroy();
            this._globalOpeners = null;
         },

         _private: _private
      });
   });
