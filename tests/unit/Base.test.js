/**
 * Created by dv.zuev on 18.05.2017.
 */
define([
   'js!WSControls/Control/Base',
   'Core/vdom/Synchronizer/resources/SyntheticEvent',
   'js!WSControls/Tests/TestSubControls/TestSubControlParent'
], function (
   Base, SyntheticEvent, Parent
) {
   'use strict';

   describe('WSControls/Control/Base', function () {

      var cfg = {
         enabled: false,
         visible: false
      };



      Base.iWantVDOM = true;
      var baseDis = new Base(cfg);
      var base = new Base({});


      describe('VDom API for Control', function(){
         it('_overrideChildrenOptions', function () {

            var childOpt = baseDis._overrideChildrenOptions({enabled: true, visible: true});
            assert.isTrue(childOpt.enabled===false);
            assert.isTrue(childOpt.visible===false);
            childOpt = base._overrideChildrenOptions({enabled: true, visible: true});
            assert.isTrue(childOpt.enabled);
            assert.isTrue(childOpt.visible);
         });

         it('getDefaultOptions', function () {
            var def = baseDis.getDefaultOptions();
            assert.isTrue(Object.isEmpty(def));
         });


         it('_overrideTemplateOpts', function () {
            var def = baseDis._overrideTemplateOpts('dontchangethis');
            assert.isTrue(def === 'dontchangethis');
         });

         it('_validateOptions', function () {
            var def = baseDis._validateOptions('dontchangethis');
            assert.isTrue(def === 'dontchangethis');
         });

         it('_applyChangedOptions', function () {
            baseDis._afterApplyOptions(false, {}, {enabled: true});
            assert.isTrue(baseDis.isEnabled());
         });

         it('SubControls', function() {
            var parentControl = new Parent({});
         });

      });

   });

});
