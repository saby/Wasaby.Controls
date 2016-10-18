/**
 * Created by am.gerasimov on 12.10.2016.
 */
/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['js!SBIS3.CONTROLS.MultiSelector'], function (MultiSelector) {

   'use strict';
   describe('SBIS3.CONTROLS.MultiSelector', function () {
      var selectedKeys,
          multiSelector;

      beforeEach(function () {
         selectedKeys = [1, 2, 3, 4, 5];
         multiSelector = new MultiSelector({
            selectedKeys: selectedKeys
         });
      });

      afterEach(function () {
         selectedKeys = undefined;
         multiSelector = undefined;
      });

      describe('.getSelectedKeys', function (){
         it('should return selectedKeys', function (){
            assert.deepEqual(multiSelector.getSelectedKeys(), []);
         });
      });
   });
});