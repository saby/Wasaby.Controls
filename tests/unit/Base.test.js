/**
 * Created by dv.zuev on 18.05.2017.
 */
define([
   'Core/Control'
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


      describe('VDom API for Control', function(){
         it('_applyChangedOptions', function () {
            assert.isTrue(!baseDis.isEnabled());
            baseDis.applyNewOptions({enabled: true});
            assert.isTrue(baseDis.isEnabled());
         });

      });

   });

});
