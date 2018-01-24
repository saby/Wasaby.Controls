define(
   [
      'Controls/Popup/Opener/Stack/Strategy',
      'Controls/Popup/Opener/Sticky/Strategy',
      'Controls/Popup/Opener/Notification/Strategy',
      'Controls/Popup/Opener/Dialog/Strategy'
   ],

   function (Stack, Sticky, Notification, Dialog) {
      'use strict';
      describe('Controls/Popup/Opener/Strategy', function () {
         describe('Sticky', function () {
            var targetCoords = {
               top: 200,
               left: 300,
               width: 400,
               height: 400
            };
            it('sticky positioning', function() {
               var position = Sticky.getPosition(targetCoords, {
                  'vertical': 'top',
                  'horizontal': 'left'
               }, {}, {}, 300, 300, 1920, 1040);
               assert.isTrue(position.top === 200);
               assert.isTrue(position.left === 300);
            });

            it('sticky positioning with offset', function() {
               var position = Sticky.getPosition(targetCoords, {
                  'vertical': 'top',
                  'horizontal': 'left'
               }, {offset: 200}, {offset: 200}, 300, 300, 1920, 1040);
               assert.isTrue(position.top === 400);
               assert.isTrue(position.left === 500);
            });

            it('sticky positioning vertical align top', function() {
               var position = Sticky.getPosition(targetCoords, {
                  'vertical': 'top',
                  'horizontal': 'left'
               }, {}, {side: 'top'}, 100, 100, 1920, 1040);
               assert.isTrue(position.top === 100);
               assert.isTrue(position.left === 300);
            });

            it('sticky positioning horizontal align right', function() {
               var position = Sticky.getPosition(targetCoords, {
                  'vertical': 'top',
                  'horizontal': 'left'
               }, {side: 'left'}, {}, 300, 300, 1920, 1040);
               assert.isTrue(position.top === 200);
               assert.isTrue(position.left === 0);
            });

            it('sticky positioning vertical align top reversed', function() {
               var position = Sticky.getPosition(targetCoords, {
                  'vertical': 'top',
                  'horizontal': 'left'
               }, {}, {side: 'top'}, 300, 300, 1920, 1040);
               assert.isTrue(position.top === 600);
               assert.isTrue(position.left === 300);
            });

            it('sticky positioning horizontal align right reversed', function() {
               var position = Sticky.getPosition(targetCoords, {
                  'vertical': 'top',
                  'horizontal': 'left'
               }, {side: 'left'}, {}, 400, 300, 1920, 1040);
               assert.isTrue(position.top === 200);
               assert.isTrue(position.left === 700);
            });
         });

         describe('Dialog', function () {
            it('dialog positioning', function() {
               var position = Dialog.getPosition(1920, 1080, 200, 300);
               assert.isTrue(position.top === 390);
               assert.isTrue(position.left === 860);
            });
         });

         describe('Stack', function () {
            it('first stack positioning', function() {
               var position = Stack.getPosition(0, {top: 0, right: 0}, 1000, 1600);
               assert.isTrue(position.width === 1000);
               assert.isTrue(position.top === 0);
               assert.isTrue(position.right === 0);
               assert.isTrue(position.bottom === 0);
            });
            it('first stack positioning from target', function() {
               var position = Stack.getPosition(0, {top: 100, right: 100}, 1000, 1600);
               assert.isTrue(position.width === 1000);
               assert.isTrue(position.top === 100);
               assert.isTrue(position.right === 100);
               assert.isTrue(position.bottom === 0);
            });
            it('current panel is broader then previous', function() {
               var position = Stack.getPosition(1, {top: 0, right: 0}, 1200, 1600, 1000, 0);
               assert.isTrue(position.width === 1200);
               assert.isTrue(position.top === 0);
               assert.isTrue(position.right === 0);
               assert.isTrue(position.bottom === 0);
            });
            it('previous width is equal current width', function() {
               var position = Stack.getPosition(1, {top: 0, right: 0}, 1000, 1600, 1000, 0);
               assert.isTrue(position.width === 1000);
               assert.isTrue(position.top === 0);
               assert.isTrue(position.right === 100);
               assert.isTrue(position.bottom === 0);
            });
            it('previous width is equal current width from target', function() {
               var position = Stack.getPosition(1, {top: 100, right: 100}, 1000, 1600, 1000, 100);
               assert.isTrue(position.width === 1000);
               assert.isTrue(position.top === 100);
               assert.isTrue(position.right === 200);
               assert.isTrue(position.bottom === 0);
            });
            it('hidden stack positioning', function() {
               var position = Stack.getPosition(2, {top: 0, right: 0}, 1000, 1600, 1900, 0);
               assert.isTrue(position === null);
            });
         });

         describe('Notification', function () {
            it('first notification positioning', function() {
               var position = Notification.getPosition();
               assert.isTrue(position.right === 16);
               assert.isTrue(position.bottom === 16);
            });
         });
      });
   }
);