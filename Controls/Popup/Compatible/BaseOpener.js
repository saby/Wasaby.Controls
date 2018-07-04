/**
 * Created by as.krasilnikov on 26.04.2018.
 */
define('Controls/Popup/Compatible/BaseOpener', [
   'Core/core-merge',
   'Core/Context',
   'Core/Deferred',
   'Core/helpers/Number/randomId',
   'SBIS3.CONTROLS/Action/Utils/OpenDialogUtil',
   'Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea'
],
function(cMerge,
   Context,
   Deferred,
   randomId,
   OpenDialogUtil) {
   /**
       * Слой совместимости для базового опенера для открытия старых шаблонов
       */
   return {
      _prepareConfigForOldTemplate: function(cfg, templateClass) {
         cfg.templateOptions = {
            templateOptions: cfg.templateOptions || cfg.componentOptions || {},
            componentOptions: cfg.templateOptions || cfg.componentOptions || {},
            template: cfg.template,
            type: cfg._type,
            handlers: cfg.handlers,
            _initCompoundArea: cfg._initCompoundArea,

            //На каждое обновление конфига генерируем новый id, чтобы понять, что нужно перерисовать шаблон
            _compoundId: randomId('compound-')
         };

         if (cfg.target) {
            //нужно для миникарточки, они хотят работать с CompoundArea - и ей надо дать target
            //причем работают с jquery объектом
            cfg.templateOptions.target = cfg.target;
            cfg.target = cfg.target[0] ? cfg.target[0] : cfg.target;
         }

         if (cfg.record) { //от RecordFloatArea
            cfg.templateOptions.record = cfg.record;
         }
         if (cfg.parent) {
            cfg.templateOptions.__parentFromCfg = cfg.parent;
         }
         if (cfg.newRecord) { //от RecordFloatArea
            cfg.templateOptions.newRecord = cfg.newRecord;
         }

         if (cfg.context) {
            var destroyDef = new Deferred(),
               destrFunc = function() {
                  destroyDef.callback();
                  destroyDef = null;
               };

            if (cfg.context instanceof Context) {
               cfg.templateOptions.context = Context.createContext(destroyDef, {}, cfg.context);
            } else {
               cfg.templateOptions.context = Context.createContext(destroyDef, cfg.context ? cfg.context : {}, null);
            }

            if (!cfg.templateOptions.handlers) {
               cfg.templateOptions.handlers = {};
            }

            if (!cfg.templateOptions.handlers.onDestroy) {
               cfg.templateOptions.handlers.onDestroy = destrFunc;
            } else {
               if (cfg.templateOptions.handlers.onDestroy.push) {
                  cfg.templateOptions.handlers.onDestroy.push(destrFunc);
               } else {
                  cfg.templateOptions.handlers.onDestroy = [cfg.templateOptions.handlers.onDestroy, destrFunc];
               }
            }
         }

         if (cfg.linkedContext) {
            cfg.templateOptions.linkedContext = cfg.linkedContext;
         }

         if (cfg.maximize) {
            if (cfg.className) {
               cfg.className += ' ws-window';
            } else {
               cfg.className = 'ws-window';
            }
         }

         if (cfg.hasOwnProperty('autoHide')) {
            cfg.closeByExternalClick = cfg.autoHide;
         }

         cfg.templateOptions.caption = this._getCaption(cfg, templateClass);

         var revertPosition = {
            top: 'bottom',
            bottom: 'top',
            left: 'right',
            right: 'left'
         };

         if (cfg.hasOwnProperty('verticalAlign')) {
            cfg.verticalAlign = {side: revertPosition[cfg.verticalAlign]};
         }

         if (cfg._type === 'dialog' && !cfg.hasOwnProperty('modal')) {
            cfg.isModal = true;
         }

         if (cfg.hasOwnProperty('side')) {
            cfg.horizontalAlign = {side: revertPosition[cfg.side]};
         }

         if (cfg.hasOwnProperty('offset')) {
            if (cfg.offset.x) {
               cfg.horizontalAlign = cfg.horizontalAlign || {};
               cfg.horizontalAlign.offset = cfg.offset.x;
            }
            if (cfg.offset.y) {
               cfg.verticalAlign = cfg.verticalAlign || {};
               cfg.verticalAlign.offset = cfg.offset.y;
            }
         }

         cfg.corner = cfg.corner || {};
         if (cfg.direction !== 'right' && cfg.direction !== 'left') {
            cfg.direction = 'left';
         }
         cfg.corner.horizontal = revertPosition[cfg.direction];

         if (cfg.hasOwnProperty('border')) {
            cfg.templateOptions.hideCross = !cfg.border;
         }

         cfg.template = 'Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea';
         this._setSizes(cfg, templateClass);
      },
      _prepareConfigForNewTemplate: function(cfg, templateClass) {
         cfg.componentOptions = {innerComponentOptions: cfg.templateOptions || cfg.componentOptions};
         cfg.componentOptions.innerComponentOptions.template = cfg.template;
         cfg.template = 'Controls/Popup/Compatible/CompoundAreaForNewTpl/CompoundArea';
         cfg.animation = 'off';

         if (cfg.onResultHandler) { //передаем onResult - колбэк, объявленный на opener'e, в compoundArea.
            cfg.componentOptions.onResultHandler = cfg.onResultHandler;
         }

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
               handlers: cfg.handlers,
               border: false
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

         if (cfg.offset) {
            newCfg.dialogOptions.offset = cfg.offset;
         }

         if (newCfg.target) {
            newCfg.dialogOptions.target = $(newCfg.target);
         }

         if (newCfg.eventHandlers && newCfg.eventHandlers.onResult) {
            newCfg.dialogOptions.onResultHandler = newCfg.eventHandlers.onResult;
         }

         return newCfg;
      },

      //Берем размеры либо с опций, либо с дименшенов
      _setSizes: function(cfg, templateClass) {
         var dimensions = this._getDimensions(templateClass);
         var templateOptions = this._getTemplateOptions(templateClass);
         var minWidth = dimensions.minWidth || templateOptions.minWidth || dimensions.width || templateOptions.width;

         if (!cfg.minWidth) {
            cfg.minWidth = minWidth ? parseInt(minWidth, 10) : null;
         }
         if (!cfg.maxWidth) {
            cfg.maxWidth = parseInt(cfg.width || dimensions.maxWidth || templateOptions.maxWidth, 10) || null;
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
      },

      _getCaption: function(cfg, templateClass) {
         var dimensions = this._getDimensions(templateClass);
         var templateOptions = this._getTemplateOptions(templateClass);
         return cfg.title || cfg.caption ||
            dimensions.title || dimensions.caption ||
            templateClass.caption || templateClass.title ||
            cfg.templateOptions.title || cfg.templateOptions.caption ||
            templateOptions.title || templateOptions.caption;
      },

      _getDimensions: function(templateClass) {
         return templateClass.dimensions || templateClass.prototype.dimensions || {};
      },

      _getTemplateOptions: function(templateClass) {
         var initializer = (templateClass.prototype || templateClass)._initializer; //опции можно достать не везде
         return initializer ? OpenDialogUtil.getOptionsFromProto(templateClass) : {};
      }

   };
}
);
