define('Controls/Popup/Global', ['Core/Control', 'wml!Controls/Popup/Global/Global', 'Controls/popup', 'Core/Deferred'],
   function(Control, template, popup, Deferred) {
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
            this._previewerOpener = Control.createControl(popup.Previewer, {}, document.createElement('div'));
            this._infoBoxOpener = Control.createControl(popup.Infobox, {}, document.createElement('div'));
            this._dialogOpener = Control.createControl(popup.Dialog, {}, document.createElement('div'));
            // В старом окружении регистрируем GlobalPopup, чтобы к нему был доступ.
            // На вдоме ничего не зарегистрируется, т.к. слой совместимости там не подгрузится
            var ManagerWrapperControllerModule = 'Controls/Popup/Compatible/ManagerWrapper/Controller';
            if (requirejs.defined(ManagerWrapperControllerModule)) {
               requirejs(ManagerWrapperControllerModule).registerGlobalPopup(this);
            }
         },
         _openInfoBoxHandler: function(event, config) {
            var self = this;
            this._activeInfobox = event.target;
            _private.getPopupConfig(config).addCallback(function(popupConfig) {
               self._infoBoxOpener.open(popupConfig);
            });
         },

         _closeInfoBoxHandler: function(event, delay) {
            // TODO: fixed by https://online.sbis.ru/doc/d7b89438-00b0-404f-b3d9-cc7e02e61bb3
            var activeInf = this._activeInfobox && this._activeInfobox.get ? this._activeInfobox.get(0) : this._activeInfobox;
            var eventTarget = event.target && event.target.get ? event.target.get(0) : event.target;
            if (activeInf === eventTarget) {
               this._activeInfobox = null;
               this._infoBoxOpener.close(delay);
            }
         },

         // Needed to immediately hide the infobox after its target or one
         // of their parent components are hidden
         // Will be removed:
         // https://online.sbis.ru/opendoc.html?guid=1b793c4f-848a-4735-b96a-f0c1cf479fab
         _forceCloseInfoBoxHandler: function() {
            if (this._activeInfobox) {
               this._activeInfobox = null;
               this._infoBoxOpener.close(0);
            }
         },
         _openPreviewerHandler: function(event, config, type) {
            this._activePreviewer = event.target;
            this._previewerOpener.open(config, type);
         },

         _closePreviewerHandler: function(event, type) {
            this._previewerOpener.close(type);
         },

         _cancelPreviewerHandler: function(event, action) {
            this._previewerOpener.cancel(action);
         },
         _isPreviewerOpenedHandler: function(event) {
            if (this._activePreviewer === event.target) {
               return this._previewerOpener.isOpened();
            }
            return false;
         },
         _popupBeforeDestroyedHandler: function(event, popupCfg, popupList, popupContainer) {
            if (this._activeInfobox) {
               // If infobox is displayed inside the popup, then close infobox.
               if (this._needCloseInfoBox(this._activeInfobox, popupContainer)) {
                  this._activeInfobox = null;
                  this._infoBoxOpener.close(0);
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

            _this._dialogOpener.open({
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
            this._previewerOpener.destroy();
            this._infoBoxOpener.destroy();
            this._dialogOpener.destroy();

            this._previewerOpener = null;
            this._infoBoxOpener = null;
            this._dialogOpener = null;
         },

         _private: _private
      });
   });
