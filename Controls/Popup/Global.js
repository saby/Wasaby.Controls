define('Controls/Popup/Global', ['Core/Control', 'wml!Controls/Popup/Global/Global', 'Core/Deferred'],
   function(Control, template, Deferred) {
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
         _openInfoBoxHandler: function(event, config) {
            var self = this;
            this._activeInfobox = event.target;
            _private.getPopupConfig(config).addCallback(function(popupConfig) {
               self._children.infoBoxOpener.open(popupConfig);
            });
         },

         _closeInfoBoxHandler: function(event) {
            if (this._activeInfobox === event.target) {
               this._activeInfobox = null;
               this._children.infoBoxOpener.close();
            }
         },

         // Needed to immediately hide the infobox after its target or one
         // of their parent components are hidden
         // Will be removed:
         // https://online.sbis.ru/opendoc.html?guid=1b793c4f-848a-4735-b96a-f0c1cf479fab
         _forceCloseInfoBoxHandler: function() {
            if (this._activeInfobox) {
               this._activeInfobox = null;
               this._children.infoBoxOpener.close(0);
            }
         },
         _openPreviewerHandler: function(event, config, type) {
            this._activePreviewer = event.target;
            this._children.previewerOpener.open(config, type);
         },

         _closePreviewerHandler: function(event, type) {
            this._children.previewerOpener.close(type);
         },

         _cancelPreviewerHandler: function(event, action) {
            this._children.previewerOpener.cancel(action);
         },
         _isPreviewerOpenedHandler: function(event) {
            if (this._activePreviewer === event.target) {
               return this._children.previewerOpener.isOpened();
            }
            return false;
         },
      });
   });
