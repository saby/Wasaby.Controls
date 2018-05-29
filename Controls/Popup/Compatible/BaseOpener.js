/**
 * Created by as.krasilnikov on 26.04.2018.
 */
define('Controls/Popup/Compatible/BaseOpener', [
   'Core/core-merge',
   'Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea'
],
function(cMerge) {
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
      _prepareConfigForNewTemplate: function(cfg, templateClass) {
         cfg.componentOptions = {
            componentOptions: cfg.templateOptions || cfg.componentOptions || {},
            template: cfg.template,
            handlers: cfg.handlers
         };

         cfg.template = 'Controls/Popup/Compatible/CompoundAreaForNewTpl/CompoundArea';
         this._setSizes(cfg, templateClass);
      },

      _prepareConfigFromNewToOld: function(cfg) {
         var newCfg = cMerge(cfg, {
            templateOptions: cfg.templateOptions || {},
            componentOptions: cfg.templateOptions || {},
            template: cfg.template,
            type: cfg._type,
            handlers: cfg.handlers,
            _initCompoundArea: cfg._initCompoundArea,
            dialogOptions: {
               isStack: cfg._type === 'stack',
               target: cfg.target,
               modal: cfg.isModal
            },
            mode: (cfg._type === 'stack' || cfg._type === 'sticky') ? 'floatArea' : 'dialog'
         });
         if (cfg.hasOwnProperty('closeByExternalClick')) {
            cfg.autoHide = cfg.closeByExternalClick;
         }

         return newCfg;
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

         if (!cfg.minHeight) {
            cfg.minHeight = dimensions.minHeight ? parseInt(dimensions.minHeight, 10) : null;
         }
         if (!cfg.maxHeight) {
            cfg.maxHeight = dimensions.maxHeight ? parseInt(dimensions.maxHeight, 10) : null;
         }

         cfg.minHeight = cfg.minHeight || cfg.maxHeight;
         cfg.maxHeight = cfg.maxHeight || cfg.minHeight;

      }
   };
}
);
