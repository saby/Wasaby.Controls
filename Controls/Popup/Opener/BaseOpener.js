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
          * @param strategy стратегия позиционирования попапа
          */
         open: function(popupOptions, strategy) {
            var self = this;
            var cfg = this._getConfig(popupOptions);

            if (this.isOpened()) {
               this._popupId = ManagerController.update(this._popupId, cfg);
            } else {
               if (cfg.isCompoundTemplate) { //TODO Compatible: Если Application не успел загрузить совместимость - грузим сами.
                  requirejs(['Controls/Popup/Compatible/Layer'], function(Layer) {
                     Layer.load().addCallback(function() {
                        self._openPopup(cfg, strategy);
                     });
                  });
               } else {
                  self._openPopup(cfg, strategy);
               }
            }
         },

         _openPopup: function(cfg, strategy) {
            var self = this;
            this._getTemplate(cfg).addCallback(function(tpl) {
               Base.showDialog(tpl, cfg, strategy).addCallback(function(popupId) {
                  self._popupId = popupId;
               });
            });
         },

         //Ленивая загрузка шаблона
         _getTemplate: function(config) {
            if (typeof config.template === 'function') {
               return (new Deferred()).callback(config.template);
            } else if (requirejs.defined(config.template)) {
               return (new Deferred()).callback(requirejs(config.template));
            } else if (!this._openerListDeferred) {
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
            return !!ManagerController.find(this._popupId);
         }
      });
      Base.showDialog = function(rootTpl, cfg, strategy) {
         var def = new Deferred(),
            popupId = null;

         if (Base.isVDOMTemplate(rootTpl) && !(cfg.templateOptions && cfg.templateOptions._initCompoundArea)) {
            popupId = ManagerController.show(cfg, strategy);
            def.callback(popupId);
         } else {
            requirejs(['Controls/Popup/Compatible/BaseOpener'], function(CompatibleOpener) {
               CompatibleOpener._prepareConfigForOldTemplate(cfg, rootTpl);
               popupId = ManagerController.show(cfg, strategy);
               def.callback(popupId);
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

      return Base;
   }
);
