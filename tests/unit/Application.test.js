/**
 * Created by dv.zuev on 27.12.2017.
 */
define([
   'Controls/Application',
   'Core/helpers/Function/runDelayed',
   'Core/helpers/URLHelpers'
], function(Application, runDelayed, URLHelpers){
   describe('Controls.Application', function () {

      beforeEach(function () {
         URLHelpers.test = "Привет!";
         URLHelpers.getPathTrue = URLHelpers.getPath;
         URLHelpers.getPath = function(){
            return 'test';
         }
      });
      it('_tplConfig init', function (done) {
         var cfg = {
               templateConfig: {prop1: 123},
               content: Application
            },
            ctrl = new Application(cfg);
         ctrl._beforeMount(cfg).addCallback(function(){
            assert.equal(ctrl._tplConfig, cfg.templateConfig, 'Property _tplConfig is incorrect before mounting');
            done();
         });
      });


      it('_tplConfig from string module', function (done) {
         var cfg = {
               templateConfig: 'Core/helpers/URLHelpers',
               content: Application
            },
            ctrl = new Application(cfg);
         ctrl._beforeMount(cfg).addCallback(function(){
            assert.equal(ctrl._tplConfig, "Привет!", 'Property _tplConfig is incorrect before mounting');
            done();
         });
      });

      afterEach(function () {
         URLHelpers.getPath = URLHelpers.getPathTrue;
      });
   })
});