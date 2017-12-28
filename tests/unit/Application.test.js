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
         ctrl._beforeMount(cfg).addCallback(function(){
            assert.equal(ctrl.templateConfig, cfg.templateConfig, 'Property _tplConfig is incorrect before mounting');
            done();
         });
      });


   })
});