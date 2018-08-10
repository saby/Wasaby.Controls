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
         border: false,
         autoShow: false,
         autoCloseOnHide: false,
         offset: {
            x:25,
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
            onResult: 'onResult'
         },
         enabled: true,
         closeChildWindows: true
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
         });

         it('_preparePopupCfgFromOldToNew', function() {
            BaseOpener._preparePopupCfgFromOldToNew(config);
            assert.equal(config.templateOptions.target,config.target);
            assert.equal(config.className,'testClass');
            assert.isTrue(config.closeByExternalClick);
            assert.isTrue(config.isModal);
            assert.equal(config.verticalAlign.side,'center');
            assert.equal(config.horizontalAlign.side,'right');
            assert.equal(config.verticalAlign.offset, 25);
            assert.equal(config.horizontalAlign.offset,25);
            assert.equal(config.direction,'right');
            assert.equal(config.corner.horizontal,'left');
            assert.isTrue(cInstance.instanceOfModule(config.context,'Core/Abstract'));
            config.side = null;
            config.modal = true;
            BaseOpener._preparePopupCfgFromOldToNew(config);
            assert.isFalse(!!config.horizontalAlign.side);
            assert.isTrue(config.isModal);
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
            assert.isFalse(config.templateOptions.autoShow);
            assert.isFalse(config.templateOptions._isVisible);
            assert.isTrue(config.templateOptions.enabled);
            assert.equal(config.template, 'Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea');
            assert.isFalse(!!config.templateOptions.caption);
            let newConfig = config;
            newConfig.minWidth = 100;
            newConfig.maximized = false;
            newConfig.canMaximize = true;
            BaseOpener._prepareConfigForOldTemplate(newConfig, DropdownExample);
            assert.equal(newConfig.minimizedWidth, 100);
            assert.equal(newConfig.minWidth, 200);
            assert.isTrue(newConfig.templateOptions.canMaximize);
            assert.equal(newConfig.templateOptions.templateOptions.isPanelMaximized, newConfig.maximized);
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
            newConfig.onResultHandler = 'testHandler';
            BaseOpener._prepareConfigForNewTemplate(newConfig, DropdownExample);
            assert.isFalse(newConfig.border);
            assert.equal(newConfig.componentOptions.innerComponentOptions, config.templateOptions);
            assert.equal(newConfig.componentOptions.innerComponentOptions.template,'Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea');
            assert.equal(newConfig.template, 'Controls/Popup/Compatible/CompoundAreaForNewTpl/CompoundArea');
            assert.equal(newConfig.animation, 'off');
            assert.equal(newConfig.componentOptions.onResultHandler, newConfig.onResultHandler);
         });

         it('_prepareConfigFromNewToOld', function() {

            //prevent test from falling cause of jQuery
            BaseOpener._prepareTarget = function(cfg) {
               return cfg.target
            };
            config.target = 'testTarget';
            let newConfig = BaseOpener._prepareConfigFromNewToOld(config);
            assert.equal(newConfig.templateOptions, config.templateOptions);
            assert.equal(newConfig.componentOptions, config.templateOptions);
            assert.equal(newConfig.template, config.template);
            assert.equal(newConfig._initCompoundArea, config._initCompoundArea);
            assert.isFalse(newConfig.dialogOptions.isStack);
            assert.equal(newConfig.target, config.target);
            assert.isTrue(newConfig.dialogOptions.modal);
            assert.equal(newConfig.dialogOptions.handlers, config.handlers);
            assert.isFalse(newConfig.dialogOptions.border);
            assert.equal(newConfig.mode, 'floatArea');
            assert.isTrue(newConfig.dialogOptions.fitWindow);
            assert.equal(newConfig.dialogOptions.onResultHandler, config.eventHandlers.onResult);
            assert.isTrue(newConfig.dialogOptions.closeChildWindows);
            let testconfig = {
               horizontalAlign: {
                  side: 'left'
               },
               verticalAlign: {
                  side: 'top'
               },
               corner: {
                  vertical: 'bottom',
               },
               mode: 'floatArea'
            };
            let newTestConfig = BaseOpener._prepareConfigFromNewToOld(testconfig);
            assert.equal(newTestConfig.dialogOptions.direction, testconfig.horizontalAlign.side);
            assert.equal(newTestConfig.dialogOptions.verticalAlign, 'bottom');
            assert.equal(newTestConfig.dialogOptions.side, testconfig.corner.horizontal);
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
