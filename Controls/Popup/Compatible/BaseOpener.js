/**
 * Created by as.krasilnikov on 26.04.2018.
 */
define('Controls/Popup/Compatible/BaseOpener', [
   'Core/Deferred',
   'Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea'
],
function(cDeferred, CompoundArea) {
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
         this._setDimensions(cfg, templateClass);
      },
      _setDimensions: function(cfg, templateClass) {
         var dimensions = templateClass.dimensions || {};
         cfg.minWidth = dimensions.minWidth ? parseInt(dimensions.minWidth, 10) : null;
         cfg.maxWidth = dimensions.maxWidth ? parseInt(dimensions.maxWidth, 10) : null;
      }
   };
}
);
