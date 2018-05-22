/**
 * Created by as.krasilnikov on 26.04.2018.
 */
define('Controls/Popup/Compatible/BaseOpener', [
   'Core/Deferred',
   'Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea'
],
function() {
   /**
       * Слой совместимости для базового опенера для открытия старых шаблонов
       */
   return {
      _prepareConfigForOldTemplate: function(cfg, templateClass) {
         cfg.templateOptions = {
            templateOptions: cfg.templateOptions || cfg.componentOptions || {},
            template: cfg.template,
            type: cfg._type,
            handlers: cfg.handlers,
            _initCompoundArea: cfg._initCompoundArea
         };

         if (cfg.hasOwnProperty('autoHide')) {
            cfg.closeByExternalClick = cfg.autoHide;
         }

         cfg.template = 'Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea';
         this._setSizes(cfg, templateClass);
      },

      //Берем размеры либо с опций, либо с дименшенов
      _setSizes: function(cfg, templateClass) {
         var dimensions = templateClass.dimensions || templateClass.prototype.dimensions || {};
         if (!cfg.minWidth) {
            cfg.minWidth = dimensions.minWidth ? parseInt(dimensions.minWidth, 10) : null;
         }
         if (!cfg.maxWidth) {
            cfg.maxWidth = dimensions.maxWidth ? parseInt(dimensions.maxWidth, 10) : null;
         }

         cfg.minWidth = cfg.minWidth || cfg.maxWidth;
         cfg.maxWidth = cfg.maxWidth || cfg.minWidth;
      }
   };
}
);
