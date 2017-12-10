define(
   [
      'js!Controls/Popup/Opener/Sticky/Strategy',
      'js!Controls/Popup/Opener/Dialog/Strategy',
      'js!Controls/Popup/Opener/Stack/Strategy',
      'js!Controls/Popup/Opener/Notification/Strategy'
   ],

   function (Sticky, Dialog, Stack, Notification) {
      'use strict';
      describe('Controls/Popup/Strategy', function () {
         describe('Controls/Popup/Opener/Sticky/Strategy', function () {
            it('horizontal alignment', function(){
               assert.equal(Sticky._horizontal({left: 80}, {}, 20), 80);
               assert.equal(Sticky._horizontal({left: 80}, {side: 'right'}, 20), 60);
               assert.equal(Sticky._horizontal({left: 80}, {side: 'right'}, 100), 80);
               assert.equal(Sticky._horizontal({left: 80}, {'offset': -30}, 20), 50);
               assert.equal(Sticky._horizontal({left: 80}, {'offset': -100}, 20), 80);
               assert.equal(Sticky._horizontal({left: 80}, {side: 'right', 'offset': -20}, 20), 40);
            });
            it('vertical alignment', function(){
               assert.equal(Sticky._vertical({top: 80}, {}, 20), 80);
               assert.equal(Sticky._vertical({top: 80}, {side: 'bottom'}, 20), 60);
               assert.equal(Sticky._vertical({top: 80}, {side: 'bottom'}, 100), 80);
               assert.equal(Sticky._vertical({top: 80}, {'offset': 20}, 20), 100);
               assert.equal(Sticky._vertical({top: 80}, {'offset': -100}, 20), 80);
               assert.equal(Sticky._vertical({top: 80}, {side: 'bottom', 'offset': -20}, 20), 40);
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