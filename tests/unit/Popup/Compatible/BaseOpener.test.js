/**
 * Created by mi.marachev on 09.08.2018.
 */
/**
 * Created by mi.marachev on 07.08.2018.
 */
define(
   [
      'Controls/Popup/Compatible/BaseOpener',
      'Examples/DropdownList/MyDropdownList/MyDropdownList',
      'Core/core-instance',
      'Core/Deferred',
      'Core/Context'
   ],

   function(BaseOpener, DropdownExample, cInstance, Deferred, Context) {
      'use strict';

      var config = {
         maximize: true,
         _type: 'dialog',
         templateOptions: {},
         componentOptions: {},
         template: 'tmpl!/test/test/test',
         hoverTarget: 'testHoverTarget',
         record: 'testRecord',
         parent: 'testParent',
         opener: 'testOpener',
         newRecord: 'newTestRecord',
         handlers: 'testHandlers',
         linkedContext: 'testLinkedContext',
         closeButtonStyle: 'testStyle',
         border: false,
         autoShow: false,
         autoCloseOnHide: false,
         offset: {
            x: '25',
            y:25
         },
         target: ['testTarget'],
         className: 'testClass',
         verticalAlign: 'middle',
         side: 'left',
         _initCompoundArea: function() {
            return 'test'
         },
         context: new Context(),
         eventHandlers: {
            onResult: 'onResult',
            onClose: 'onclose'
         },
         enabled: true,
         draggable: true,
         closeChildWindows: true,
         closeOnTargetScroll: true
      };

      describe('Controls/Popup/Compatible/BaseOpener', function() {
         it('_prepareContext', function() {
            let newConfig = {
               templateOptions: {
                  handlers: {
                     onDestroy: []
                  }
               },
               context: {}
            };
            BaseOpener._prepareContext(newConfig);
            assert.isTrue(newConfig.templateOptions.handlers.onDestroy[0] instanceof Function);
            assert.isFalse(cInstance.instanceOfModule(newConfig.context,'Core/Abstract'));
            assert.isTrue(cInstance.instanceOfModule(newConfig.templateOptions.context,'Core/Abstract'));
            newConfig = {
               templateOptions: {
                  handlers: {
                     onDestroy: {}
                  }
               },
               context: {}
            };
            BaseOpener._prepareContext(newConfig);
            assert.isTrue(newConfig.templateOptions.handlers.onDestroy[1] instanceof Function);
            assert.isFalse(cInstance.instanceOfModule(newConfig.context,'Core/Abstract'));
            assert.isTrue(cInstance.instanceOfModule(newConfig.templateOptions.context,'Core/Abstract'));
            newConfig = {
               templateOptions: {},
               context: {}
            };
            BaseOpener._prepareContext(newConfig);
            assert.isTrue(newConfig.templateOptions.handlers.onDestroy instanceof Function);
            newConfig = {
               templateOptions: {}
            };
            let parentContext = new Context();
            BaseOpener._prepareContext(newConfig, parentContext);
            assert.isTrue(cInstance.instanceOfModule(newConfig.templateOptions.context, 'Core/Abstract'));
            assert.equal(newConfig.templateOptions.context.getPrevious(), parentContext);
         });

         it('_preparePopupCfgFromOldToNew', function() {
            config.autoHide = true;
            config.onResultHandler = function() {};
            config.onCloseHandler = function() {};
            BaseOpener._preparePopupCfgFromOldToNew(config);
            assert.equal(config.eventHandlers.onResult, config.onResultHandler);
            assert.equal(config.eventHandlers.onClose, config.onCloseHandler);

            assert.equal(config.templateOptions.target, config.target);
            assert.equal(config.className,'testClass');
            assert.equal(config.templateOptions.draggable, config.draggable);
            assert.isTrue(config.isModal);
            assert.isFalse(config.closeByExternalClick);
            assert.isTrue(cInstance.instanceOfModule(config.context,'Core/Abstract'));
            config.side = null;
            config.modal = true;
            config.horizontalAlign = {
               offset: undefined
            };
            config.offset = 0;
            config.closeByExternalClick = false;
            delete config.draggable;
            config._popupComponent = 'dialog';
            BaseOpener._preparePopupCfgFromOldToNew(config);
            assert.equal(config.templateOptions.draggable, true);
            assert.isFalse(config.closeByExternalClick);
            assert.isFalse(!!config.horizontalAlign.side);
            assert.isFalse(!!config.horizontalAlign.offset);
            assert.isTrue(config.isModal);
            config.direction = 'right';
            config.horizontalAlign = 'left';
            BaseOpener._preparePopupCfgFromOldToNew(config);
            assert.equal(config.direction,config.horizontalAlign.side);
            config.direction = 'top';
            config.verticalAlign = 'test';
            BaseOpener._preparePopupCfgFromOldToNew(config);
            assert.equal(config.direction,config.verticalAlign.side);
            delete config.direction;
            config.side = 'right';
            BaseOpener._preparePopupCfgFromOldToNew(config);
            assert.equal(config.direction, 'left');
            config.direction = 'top';
            config.horizontalAlign = 'left';
            config.verticalAlign = 'top';
            BaseOpener._preparePopupCfgFromOldToNew(config);
            assert.equal(config.horizontalAlign.side, 'left');

         });

         it('prepareNotificationConfig', function() {
            let template = () => {};
            let config = {
               template,
               opener: 'opener',
               templateOptions: {
                  myOpt: true
               }
            };
            BaseOpener.prepareNotificationConfig(config);
            assert.equal(config.template, 'Controls/Popup/Compatible/OldNotification');
            assert.equal(config.componentOptions.template, template);
            assert.equal(config.componentOptions.templateOptions, config.templateOptions);
            assert.equal(config.isVDOM, true);
            assert.equal(config.className, 'controls-OldNotification');
            assert.equal(config.opener, null);
         });

         it('_setSizes', function() {
            BaseOpener._setSizes(config, DropdownExample);
            assert.isTrue(config.autoWidth);
            assert.isTrue(config.autoHeight);
            let newConfig = {};
            newConfig.minWidth = 50;
            newConfig.maxWidth = 50;
            newConfig.minHeight = 50;
            newConfig.maxHeight = 50;
            assert.isFalse(!!newConfig.autoWidth);
            assert.isFalse(!!newConfig.autoHeight);
            var newClass = {};
            newConfig = {};
            newClass.dimensions = {
               minWidth: 30,
               maxWidth: 30,
               minHeight: 30,
               maxHeight: 30
            };
            BaseOpener._setSizes(newConfig,newClass);
            assert.isFalse(!!newConfig.autoWidth);
            assert.isFalse(!!newConfig.autoHeight);
            assert.equal(newConfig.minWidth, newClass.dimensions.minWidth);
            assert.equal(newConfig.maxWidth, newClass.dimensions.maxWidth);
            assert.equal(newConfig.minHeight, newClass.dimensions.minHeight);
            assert.equal(newConfig.maxHeight, newClass.dimensions.maxHeight);
         });

         it('_prepareConfigForOldTemplate', function() {
            BaseOpener._prepareConfigForOldTemplate(config, DropdownExample);
            assert.equal(config.templateOptions.hoverTarget,config.hoverTarget);
            assert.equal(config.templateOptions.record,config.record);
            assert.equal(config.templateOptions.__parentFromCfg,config.parent);
            assert.equal(config.templateOptions.__openerFromCfg,config.opener);
            assert.equal(config.templateOptions.newRecord,config.newRecord);
            assert.equal(config.templateOptions.linkedContext,config.linkedContext);
            assert.equal(config.className, 'testClass ws-window ws-hidden');
            assert.isTrue(config.templateOptions.hideCross);
            assert.isTrue(config.templateOptions.maximize);
            assert.isFalse(config.templateOptions.autoShow);
            assert.isFalse(config.templateOptions._isVisible);
            assert.isTrue(config.templateOptions.enabled);
            assert.equal(config.template, 'Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea');
            assert.isTrue(config.closeButtonStyle === 'testStyle');
            assert.isFalse(!!config.templateOptions.caption);
            let newConfig = config;
            newConfig.minWidth = '100';
            newConfig.maximized = false;
            newConfig.canMaximize = true;
            newConfig.maxWidth = 150;
            BaseOpener._prepareConfigForOldTemplate(newConfig, DropdownExample);
            assert.equal(newConfig.minimizedWidth, 100);
            assert.equal(newConfig.minWidth, 200);
            assert.isTrue(newConfig.templateOptions.canMaximize);
            assert.equal(newConfig.templateOptions.templateOptions.isPanelMaximized, newConfig.maximized);
            delete newConfig.context;
            delete newConfig.templateOptions.context;
            let parentContext = new Context();
            newConfig.parent = {
               getLinkedContext: function() {
                  return parentContext;
               }
            };
            BaseOpener._prepareConfigForOldTemplate(newConfig, DropdownExample);
            assert.isTrue(!!newConfig.templateOptions.context);
            assert.equal(newConfig.templateOptions.context.getPrevious(), parentContext);
         });

         it('_getCaption', function() {
            config.title = 'testTitle';
            let title = BaseOpener._getCaption(config, DropdownExample);
            assert.equal(title, 'testTitle');
         });

         it('_prepareConfigForNewTemplate', function() {
            let newConfig = {};
            newConfig.templateOptions = config.templateOptions;
            newConfig.template = 'Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea';
            newConfig.onResultHandler = 'onResultHandler';
            newConfig.onCloseHandler = 'onCloseHandler';
            BaseOpener._prepareConfigForNewTemplate(newConfig, DropdownExample);
            assert.isFalse(newConfig.border);
            assert.equal(newConfig.componentOptions.catchFocus, true);
            assert.equal(newConfig.componentOptions.templateOptions, config.templateOptions);
            assert.equal(newConfig.componentOptions.template,'Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea');
            assert.equal(newConfig.template, 'Controls/Popup/Compatible/CompoundAreaForNewTpl/CompoundArea');
            assert.equal(newConfig.animation, 'off');
            assert.equal(newConfig.componentOptions.onResultHandler, newConfig.onResultHandler);
            assert.equal(newConfig.componentOptions.onCloseHandler, newConfig.onCloseHandler);
         });

         it('_prepareConfigFromNewToOld', function() {

            //prevent test from falling cause of jQuery
            BaseOpener._prepareTarget = function(cfg) {
               return cfg.target
            };
            config.offset = {
               x:25,
               y:25
            };

            delete config.autoCloseOnHide;

            config.minWidth = 100;
            config.maxWidth = 1000;
            config.title = 'заголовок';

            config.target = 'testTarget';
            config.className = 'testClass';
            config.closeByExternalClick = false;
            let newConfig = BaseOpener._prepareConfigFromNewToOld(config);
            assert.equal(newConfig.templateOptions, config.templateOptions);
            assert.equal(newConfig.componentOptions, config.templateOptions);
            assert.equal(newConfig.template, config.template);
            assert.equal(newConfig._initCompoundArea, config._initCompoundArea);
            assert.isFalse(newConfig.dialogOptions.isStack);
            assert.equal(newConfig.target, config.target);
            assert.isTrue(newConfig.dialogOptions.modal);
            assert.equal(newConfig.dialogOptions.handlers, config.handlers);
            assert.equal(newConfig.dialogOptions.autoHide, config.closeByExternalClick);
            assert.equal(newConfig.dialogOptions.className, config.className);
            assert.equal(newConfig.dialogOptions.title, config.title);
            assert.isTrue(newConfig.dialogOptions.border);
            assert.equal(newConfig.mode, 'floatArea');
            assert.isTrue(newConfig.dialogOptions.fitWindow);
            assert.equal(newConfig.dialogOptions.onResultHandler, config.eventHandlers.onResult);
            assert.equal(newConfig.dialogOptions.onCloseHandler, config.eventHandlers.onClose);
            assert.isTrue(newConfig.dialogOptions.closeChildWindows);
            assert.equal(newConfig.dialogOptions.closeOnTargetScroll, config.closeOnTargetScroll);
            assert.equal(newConfig.dialogOptions.offset, config.offset);

            assert.equal(newConfig.dialogOptions.showOnControlsReady, false);
            assert.equal(newConfig.dialogOptions.autoCloseOnHide, true);
            assert.equal(newConfig.dialogOptions.minWidth, config.minWidth);
            assert.equal(newConfig.dialogOptions.maxWidth, config.maxWidth);
            let testconfig = {
               horizontalAlign: {
                  side: 'left',
                  offset: 10
               },
               verticalAlign: {
                  side: 'top',
                  offset: 15
               },
               corner: {
                  vertical: 'bottom'
               },
               mode: 'floatArea'
            };
            let vdomTemplate = { stable: true }; //state of vdom template
            let newTestConfig = BaseOpener._prepareConfigFromNewToOld(testconfig, vdomTemplate);
            assert.equal(newTestConfig.dialogOptions.direction, testconfig.horizontalAlign.side);
            assert.isFalse(newTestConfig.dialogOptions.border);
            assert.equal(newTestConfig.dialogOptions.verticalAlign, 'bottom');
            assert.equal(newTestConfig.dialogOptions.offset.x, 10);
            assert.equal(newTestConfig.dialogOptions.offset.y, 15);
            assert.equal(newTestConfig.dialogOptions.side, testconfig.corner.horizontal);
            testconfig.horizontalAlign = null;
            newTestConfig = BaseOpener._prepareConfigFromNewToOld(testconfig);
            assert.equal(newTestConfig.dialogOptions.direction, 'right');
            testconfig._type = 'stack';
            newTestConfig = BaseOpener._prepareConfigFromNewToOld(testconfig);
            assert.equal(newTestConfig.dialogOptions.direction, 'left');
         });

         it('_getDimensions', function() {
            var newClass = {};
            newClass.dimensions = {
               minWidth: 50,
               maxWidth: 50,
               minHeight: 50,
               maxHeight: 50
            };
            var dimensions = BaseOpener._getDimensions(newClass);
            assert.equal(newClass.dimensions, dimensions);
         })
      })
   }
);
