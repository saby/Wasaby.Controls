/**
 * Created by dv.zuev on 27.12.2017.
 */
define([
   'Controls/Application'
], function(Application){
   describe('Controls.Application', function () {


      it('_tplConfig init', function (done) {
         var cfg = {
               templateConfig: {prop1: 123},
               content: Application
            },
            ctrl = new Application(cfg);

         ctrl._beforeMount(cfg).addCallback(function(conf){
            assert.equal(ctrl.templateConfig, cfg.templateConfig, 'Property templateConfig is incorrect before mounting');
            assert.equal(conf, cfg, '_beforeMount return bad value');
            done();
         });
      });


   })
});