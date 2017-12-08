define(
   [
      'js!Controls/Popup/TargetCoords',
      'js!Controls/Popup/Opener/Sticky/Strategy',
      'js!Controls/Popup/Opener/Dialog/Strategy',
      'js!Controls/Popup/Opener/Stack/Strategy',
      'js!Controls/Popup/Opener/Notification/Strategy'
   ],

   function (TargetCoords, Sticky, Dialog, Stack, Notification) {
      'use strict';
      describe('Controls/Popup/Strategy', function () {
         describe('Controls/Popup/Opener/Sticky/Strategy', function () {
            it('Target coords', function() {
               var pos = TargetCoords.get($('#mocha-stats'));
               assert.isTrue(pos.top === 15);
               assert.isTrue(pos.height === 40);
            });
         });

         describe('Controls/Popup/Opener/Dialog/Strategy', function () {
            it('Dialog default positioning', function() {
               var pos = Dialog.getPosition();
               assert.isTrue(pos.top === 0);
               assert.isTrue(pos.left === 0);
            });
         });

         describe('Controls/Popup/Opener/Stack/Strategy', function () {
            it('First stack positioning', function() {
               var pos = Stack.getPosition();
               assert.isTrue(pos.top === 0);
               assert.isTrue(pos.right === 0);
               assert.isTrue(pos.bottom === 0);
            });
         });

         describe('Controls/Popup/Opener/Notification/Strategy', function () {
            it('First notification positioning', function() {
               var pos = Notification.getPosition();
               assert.isTrue(pos.right === 16);
               assert.isTrue(pos.bottom === 16);
            });
         });
      });
   }
);