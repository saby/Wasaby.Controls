/**
 * Created by as.krasilnikov on 26.04.2018.
 */
define('Controls/Popup/Compatible/BaseOpener', [
   'Core/core-merge',
   'Core/Context',
   'Core/Deferred',
   'Core/helpers/random-helpers',
   'SBIS3.CONTROLS/Action/Utils/OpenDialogUtil',
   'Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea'
],
function(cMerge,
   Context,
   Deferred,
   Random,
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
            _mode: cfg._mode,

            // На каждое обновление конфига генерируем новый id, чтобы понять, что нужно перерисовать шаблон
            _compoundId: Random.randomId('compound-')
         };

         if (cfg.hoverTarget) {
            cfg.templateOptions.hoverTarget = cfg.hoverTarget;
         }

         if (cfg.target) {
            // нужно для миникарточки, они хотят работать с CompoundArea - и ей надо дать target
            // причем работают с jquery объектом
            cfg.templateOptions.target = cfg.target;
            cfg.target = cfg.target[0] ? cfg.target[0] : cfg.target;
         }

         if (cfg.record) { // от RecordFloatArea
            cfg.templateOptions.record = cfg.record;
         }
         if (cfg.parent) {
            cfg.templateOptions.__parentFromCfg = cfg.parent;
         }
         if (cfg.opener) {
            cfg.templateOptions.__openerFromCfg = cfg.opener;
         }
         if (cfg.newRecord) { // от RecordFloatArea
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
            } else if (cfg.templateOptions.handlers.onDestroy.push) {
               cfg.templateOptions.handlers.onDestroy.push(destrFunc);
            } else {
               cfg.templateOptions.handlers.onDestroy = [cfg.templateOptions.handlers.onDestroy, destrFunc];
            }
         }

         if (cfg.linkedContext) {
            cfg.templateOptions.linkedContext = cfg.linkedContext;
         }

         cfg.className = cfg.className || '';

         if (cfg.maximize) {
            cfg.className += ' ws-window';
         }

         cfg.closeByExternalClick = cfg.hasOwnProperty('autoHide') ? cfg.autoHide : true;

         cfg.templateOptions.caption = this._getCaption(cfg, templateClass);

         var revertPosition = {
            top: 'bottom',
            bottom: 'top',
            left: 'right',
            right: 'left',
            middle: 'center',
            center: 'center'
         };

         if (cfg.hasOwnProperty('verticalAlign')) {
            //Если object - значит api popupMixin'a, которое совпадает с новым api => ничего не меняем
            if (typeof cfg.verticalAlign !== 'object') {
               cfg.verticalAlign = {side: revertPosition[cfg.verticalAlign]};
            }
         }

         if (cfg._type === 'dialog' && !cfg.hasOwnProperty('modal')) {
            cfg.isModal = true;
         }

         if (cfg.hasOwnProperty('side')) {
            cfg.horizontalAlign = { side: revertPosition[cfg.side] };
         }

         if (cfg.horizontalAlign) {
            if (cfg.horizontalAlign.side === undefined) {
               delete cfg.horizontalAlign.side;
            }
            if (cfg.horizontalAlign.offset === undefined) {
               delete cfg.horizontalAlign.offset;
            }
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

         if (!cfg.hasOwnProperty('corner') || typeof cfg.corner !== 'object') {
            cfg.corner = {};
            if (cfg.direction !== 'right' && cfg.direction !== 'left') {
               cfg.direction = 'right';
            }
            cfg.corner.horizontal = revertPosition[cfg.direction];
         }

         if (cfg.hasOwnProperty('border')) {
            cfg.templateOptions.hideCross = !cfg.border;
         }

         if (cfg.hasOwnProperty('autoShow')) {
            cfg.templateOptions.autoShow = cfg.autoShow;
            cfg.templateOptions._isVisible = cfg.autoShow;
            if (!cfg.autoShow) {
               cfg.closeByExternalClick = false;
               cfg.className += ' ws-hidden';
            }
         }

         if (cfg.hasOwnProperty('autoCloseOnHide')) {
            cfg.templateOptions.autoCloseOnHide = cfg.autoCloseOnHide;
         }

         if (cfg.hasOwnProperty('modal')) {
            cfg.isModal = cfg.modal;
         }

         cfg.template = 'Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea';
         this._setSizes(cfg, templateClass);
      },
      _prepareConfigForNewTemplate: function(cfg, templateClass) {
         cfg.componentOptions = { innerComponentOptions: cfg.templateOptions || cfg.componentOptions };
         cfg.componentOptions.innerComponentOptions.template = cfg.template;
         cfg.template = 'Controls/Popup/Compatible/CompoundAreaForNewTpl/CompoundArea';
         cfg.animation = 'off';

         if (cfg.onResultHandler) { // передаем onResult - колбэк, объявленный на opener'e, в compoundArea.
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
            mode: (cfg._type === 'stack' || cfg._type === 'sticky' || cfg.target) ? 'floatArea' : 'dialog'
         });
         if (cfg.hasOwnProperty('closeByExternalClick')) {
            cfg.autoHide = cfg.closeByExternalClick;
         }

         if (cfg.hasOwnProperty('closeChildWindows')) {
            newCfg.dialogOptions.closeChildWindows = cfg.closeChildWindows;
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
            if (cfg.mode === 'floatArea') {
               newCfg.dialogOptions.fitWindow = true;
            }
         }

         if (newCfg.eventHandlers && newCfg.eventHandlers.onResult) {
            newCfg.dialogOptions.onResultHandler = newCfg.eventHandlers.onResult;
         }

         return newCfg;
      },

      // Берем размеры либо с опций, либо с дименшенов
      _setSizes: function(cfg, templateClass) {
         var dimensions = this._getDimensions(templateClass);
         var templateOptions = this._getTemplateOptions(templateClass);
         var minWidth = dimensions.minWidth || templateOptions.minWidth || dimensions.width || templateOptions.width;

         if (!cfg.minWidth) {
            cfg.minWidth = minWidth ? parseInt(minWidth, 10) : null;
         }
         if (!cfg.maxWidth) {
            cfg.maxWidth = parseInt(cfg.width || dimensions.maxWidth || templateOptions.maxWidth, 10) || undefined;
         }

         cfg.minWidth = cfg.minWidth || cfg.maxWidth;
         cfg.maxWidth = cfg.maxWidth || cfg.minWidth;

         if (!cfg.minHeight) {
            cfg.minHeight = dimensions.minHeight ? parseInt(dimensions.minHeight, 10) : undefined;
         }
         if (!cfg.maxHeight) {
            cfg.maxHeight = dimensions.maxHeight ? parseInt(dimensions.maxHeight, 10) : undefined;
         }

         cfg.minHeight = cfg.minHeight || cfg.maxHeight;
         cfg.maxHeight = cfg.maxHeight || cfg.minHeight;

         if (!cfg.minHeight) { // нет размеров - строимся по контенту
            cfg.autoHeight = true;
         }
         if (!cfg.minWidth) { // нет размеров - строимся по контенту
            cfg.autoWidth = true;
         }
      },

      _getCaption: function(cfg, templateClass) {
         var dimensions = this._getDimensions(templateClass);
         var compoundAreaOptions = cfg.templateOptions;
         var templateOptions = this._getTemplateOptions(templateClass);
         return cfg.title || cfg.caption ||
            dimensions.title || dimensions.caption ||
            templateClass.caption || templateClass.title ||
            compoundAreaOptions.title || compoundAreaOptions.caption ||
            templateOptions.title || templateOptions.caption;
      },

      _getDimensions: function(templateClass) {
         return templateClass.dimensions || templateClass.prototype.dimensions || {};
      },

      _getTemplateOptions: function(templateClass) {
         var initializer = (templateClass.prototype || templateClass)._initializer; // опции можно достать не везде
         return initializer ? OpenDialogUtil.getOptionsFromProto(templateClass) : {};
      }

   };
});
