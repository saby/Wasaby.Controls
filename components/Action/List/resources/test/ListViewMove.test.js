/**
 * Created by ganshinyao on 04.05.2016.
 */
/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(
   ['js!SBIS3.CONTROLS.Action.List.Move'],
   function (ListViewMove) {
      'use strict';

      describe('SBIS3.CONTROLS.Action.ListViewMove', function () {
         var moveAction,
            listView;

         beforeEach(function () {
            listView = {};
            moveAction = new ListViewMove({
               linkedObject: listView
            });
         });

         describe('.execute()', function () {
            it('should return an error', function () {
               assert.throw(function () {
                  moveAction.execute({from:1, to:2});
               });
            });
         });

      });
   }
);
