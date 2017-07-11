/**
 * Created by dv.zuev on 18.05.2017.
 */
define([
   'js!WSControls/Control/Base'
], function (
   Base
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

         it('_applyChangedOptions', function () {
            baseDis._afterApplyOptions(false, {}, {enabled: true});
            assert.isTrue(baseDis.isEnabled());
         });

      });

   });

});
