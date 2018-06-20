/**
 * Created by as.krasilnikov on 26.04.2018.
 */
define('Controls/Popup/Compatible/BaseOpener', [
   'Core/core-merge',
   'Core/helpers/random-helpers',
   'Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea'
],
function(cMerge, Random) {
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
            _initCompoundArea: cfg._initCompoundArea,

            //На каждое обновление конфига генерируем новый id, чтобы понять, что нужно перерисовать шаблон
            _compoundId: Random.randomId('compound-')
         };

         if (cfg.target) {
            cfg.target = cfg.target[0] ? cfg.target[0] : cfg.target;
         }

         if (cfg.hasOwnProperty('autoHide')) {
            cfg.closeByExternalClick = cfg.autoHide;
         }

         cfg.template = 'Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea';
         this._setSizes(cfg, templateClass);
      },
      _prepareConfigForNewTemplate: function(cfg, templateClass) {
         cfg.componentOptions = cfg.templateOptions || cfg.componentOptions || {};
         cfg.componentOptions.template = cfg.template;
         cfg.template = 'Controls/Popup/Compatible/CompoundAreaForNewTpl/CompoundArea';
         cfg.animation = 'off';

         this._setSizes(cfg, templateClass);
      },

      _prepareConfigFromNewToOld: function(cfg) {
         var newCfg = cMerge(cfg, {
            templateOptions: cfg.templateOptions || {},
            componentOptions: cfg.templateOptions || {},
            template: cfg.template,
            _initCompoundArea: cfg._initCompoundArea,
            dialogOptions: {
               isStack: cfg._type === 'stack',
               target: cfg.target,
               modal: cfg.isModal,
               handlers: cfg.handlers
            },
            mode: (cfg._type === 'stack' || cfg._type === 'sticky') ? 'floatArea' : 'dialog'
         });
         if (cfg.hasOwnProperty('closeByExternalClick')) {
            cfg.autoHide = cfg.closeByExternalClick;
         }

         if (cfg.verticalAlign && cfg.verticalAlign.side === 'top') {
            newCfg.dialogOptions.direction = 'top';
         }

         if (cfg.corner && cfg.corner.vertical === 'bottom') {
            newCfg.dialogOptions.verticalAlign = 'bottom';
         }

         if (cfg.hideCross === true) {
            newCfg.dialogOptions.border = false;
         }

         if (cfg.offset) {
            newCfg.dialogOptions.offset = cfg.offset;
         }

         if (newCfg.target) {
            newCfg.dialogOptions.target = $(newCfg.target);
         }

         return newCfg;
      },

      //Берем размеры либо с опций, либо с дименшенов
      _setSizes: function(cfg, templateClass) {
         var dimensions = templateClass.dimensions || templateClass.prototype.dimensions || {};
         var dimensionsMinWidth = dimensions.minWidth || dimensions.width;

         if (!cfg.minWidth) {
            cfg.minWidth = dimensionsMinWidth ? parseInt(dimensionsMinWidth, 10) : null;
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
