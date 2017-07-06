/**
 * Created by dv.zuev on 18.05.2017.
 */
define([
   'Core/vdom/Synchronizer/resources/SyntheticEvent',
   'js!WSDemo/MasterDetail/MasterControl/MasterControl'
], function (
   SyntheticEvent, MasterControl
) {
   'use strict';

   describe('CreateDestroy', function () {

      describe('SubControls', function(){
         it('SubControls', function() {
            var parentControl = new MasterControl({});
            assert.isTrue(parentControl.children.length > 0);
         });

      });

   });

});
