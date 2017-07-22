/**
 * Created by dv.zuev on 14.07.2017.
 */
define([
   'js!WSControls/Control/Base',
   'js!WSTest/TestSubControls/LogicParentTestControl'
], function (
   ParentControl, LogicParentTestControl
) {
   'use strict';

   describe('Action in template', function () {
      beforeEach(function () {
         if (typeof $ === 'undefined') {
            this.skip();
         }
      });
      describe('Action', function(){
         it('Call from subcontrol event', function(done) {

            var el = $('<div></div>'),
               testText = 'testText',
               logicParentTestControl = new LogicParentTestControl({
                  element: el,
                  testText: testText
               });
            setTimeout(function() {
               logicParentTestControl.getChildControlByName('ch1').launchTestEvent();
               assert.isTrue(logicParentTestControl._callbackresult === testText);

               done();

            }, 50);
         });

      });

   });

});