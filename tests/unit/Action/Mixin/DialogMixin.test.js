/**
 * Created by mi.marachev on 09.08.2018.
 */
/**
 * Created by mi.marachev on 07.08.2018.
 */
define(
   [
      'SBIS3.CONTROLS/Action/Mixin/DialogMixin',
      'Controls/Popup/Opener/BaseOpener',
      'Controls/Popup/Compatible/BaseOpener',
      'Core/Context'
   ],

   function(DialogMixin, BaseOpener, CompatibleOpener, Context) {
      'use strict';

      var newConfig = {
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

      describe('components/Action/Mixin/DialogMixin', function () {
         describe('_createComponent', function () {
            it('_prepareCfgForNewEnvironment', function () {
               let config = {
                  isStack: true,
                  className: 'myClass',
                  template: 'testTmpl'
               };
               let meta = {
                  mode: 'stack'
               };
               var deps = DialogMixin._prepareCfgForNewEnvironment(meta, config);
               assert.equal(config._type, 'stack');
               assert.equal(config._popupComponent, 'floatArea');
               assert.equal(config.className, 'myClass controls-Stack');
               assert.isTrue(deps.indexOf('Controls/Popup/Opener/Stack/StackController') !== -1);
               assert.isTrue(deps.indexOf(config.template) !== -1);
               config = {
                  isStack: false,
                  target: 'testTarget'
               };
               meta = {
                  mode: 'sticky'
               };
               deps = DialogMixin._prepareCfgForNewEnvironment(meta, config);
               assert.equal(config._type, 'sticky');
               assert.isTrue(deps.indexOf('Controls/Popup/Opener/Sticky/StickyController') !== -1);
               config = {
                  isStack: false
               };
               meta = {
                  mode: 'dialog'
               };
               deps = DialogMixin._prepareCfgForNewEnvironment(meta, config);
               assert.equal(config._type, 'dialog');
               assert.isTrue(deps.indexOf('Controls/Popup/Opener/Dialog/DialogController') !== -1);
            });

            it('_prepareCfgForOldEnvironment', function () {
               let cfgTpl = {
                  prototype: {
                     _template: 'testTpl'
                  }
               };
               DialogMixin._prepareCfgForOldEnvironment(null, BaseOpener, CompatibleOpener, cfgTpl, newConfig);
               assert.equal(newConfig.className, 'testClass ws-invisible');
               assert.isTrue(newConfig.componentOptions._initCompoundArea instanceof Function);
               assert.isTrue(newConfig._openFromAction);
            })
         })
      })
   }
);
