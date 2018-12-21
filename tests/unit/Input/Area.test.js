define(
   [
      'Core/constants',
      'Controls/Input/Area',
      'tests/resources/ProxyCall',
      'Core/vdom/Synchronizer/resources/SyntheticEvent'
   ],
   function(constants, Area, ProxyCall, SyntheticEvent) {
      'use strict';
      describe('Controls.Input.Area', function() {
         var ctrl, calls;

         beforeEach(function() {
            calls = [];
            ctrl = new Area();
         });
         describe('Move to new line', function() {
            var event;
            var preventDefault = function() {};

            beforeEach(function() {
               ctrl.paste = ProxyCall.apply(ctrl.paste, 'paste', calls, true);
               preventDefault = ProxyCall.apply(preventDefault, 'preventDefault', calls, true);
            });

            it('The option newLineKey is equal to enter. Press enter.', function() {
               event = new SyntheticEvent({
                  keyCode: constants.key.enter,
                  ctrlKey: false,
                  altKey: false,
                  shiftKey: false,
                  preventDefault: preventDefault
               });
               ctrl._options.newLineKey = 'enter';

               ctrl._keyDownHandler(event);

               assert.equal(calls.length, 0);
            });
            it('The option newLineKey is equal to enter. Press ctrl + enter.', function() {
               event = new SyntheticEvent({
                  keyCode: constants.key.enter,
                  altKey: false,
                  ctrlKey: true,
                  shiftKey: false,
                  preventDefault: preventDefault
               });
               ctrl._options.newLineKey = 'enter';

               ctrl._keyDownHandler(event);

               assert.deepEqual(calls, [{
                  name: 'preventDefault',
                  arguments: []
               }]);
            });
            it('The option newLineKey is equal to enter. Press shift + enter.', function() {
               event = new SyntheticEvent({
                  keyCode: constants.key.enter,
                  altKey: false,
                  ctrlKey: false,
                  shiftKey: true,
                  preventDefault: preventDefault
               });
               ctrl._options.newLineKey = 'enter';

               ctrl._keyDownHandler(event);

               assert.deepEqual(calls, [{
                  name: 'preventDefault',
                  arguments: []
               }]);
            });
            it('The option newLineKey is equal to enter. Press alt + enter.', function() {
               event = new SyntheticEvent({
                  keyCode: constants.key.enter,
                  altKey: true,
                  ctrlKey: false,
                  shiftKey: false,
                  preventDefault: preventDefault
               });
               ctrl._options.newLineKey = 'enter';

               ctrl._keyDownHandler(event);

               assert.deepEqual(calls, [{
                  name: 'preventDefault',
                  arguments: []
               }]);
            });
            it('The option newLineKey is equal to enter. Press ctrl + shift + enter.', function() {
               event = new SyntheticEvent({
                  keyCode: constants.key.enter,
                  altKey: false,
                  ctrlKey: true,
                  shiftKey: true,
                  preventDefault: preventDefault
               });
               ctrl._options.newLineKey = 'enter';

               ctrl._keyDownHandler(event);

               assert.deepEqual(calls, [{
                  name: 'preventDefault',
                  arguments: []
               }]);
            });
            it('The option newLineKey is equal to enter. Press ctrl + alt + enter.', function() {
               event = new SyntheticEvent({
                  keyCode: constants.key.enter,
                  altKey: true,
                  ctrlKey: true,
                  shiftKey: false,
                  preventDefault: preventDefault
               });
               ctrl._options.newLineKey = 'enter';

               ctrl._keyDownHandler(event);

               assert.deepEqual(calls, [{
                  name: 'preventDefault',
                  arguments: []
               }]);
            });
            it('The option newLineKey is equal to enter. Press shift + alt + enter.', function() {
               event = new SyntheticEvent({
                  keyCode: constants.key.enter,
                  altKey: true,
                  ctrlKey: false,
                  shiftKey: true,
                  preventDefault: preventDefault
               });
               ctrl._options.newLineKey = 'enter';

               ctrl._keyDownHandler(event);

               assert.deepEqual(calls, [{
                  name: 'preventDefault',
                  arguments: []
               }]);
            });
            it('The option newLineKey is equal to enter. Press ctrl + shift + alt + enter.', function() {
               event = new SyntheticEvent({
                  keyCode: constants.key.enter,
                  altKey: true,
                  ctrlKey: true,
                  shiftKey: true,
                  preventDefault: preventDefault
               });
               ctrl._options.newLineKey = 'enter';

               ctrl._keyDownHandler(event);

               assert.deepEqual(calls, [{
                  name: 'preventDefault',
                  arguments: []
               }]);
            });
            it('The option newLineKey is equal to enter. Press b.', function() {
               event = new SyntheticEvent({
                  keyCode: constants.key.b,
                  altKey: false,
                  ctrlKey: false,
                  shiftKey: false,
                  preventDefault: preventDefault
               });
               ctrl._options.newLineKey = 'enter';

               ctrl._keyDownHandler(event);

               assert.deepEqual(calls.length, 0);
            });
            it('The option newLineKey is equal to ctrlEnter. Press enter.', function() {
               event = new SyntheticEvent({
                  keyCode: constants.key.enter,
                  altKey: false,
                  ctrlKey: false,
                  shiftKey: false,
                  preventDefault: preventDefault
               });
               ctrl._options.newLineKey = 'ctrlEnter';

               ctrl._keyDownHandler(event);

               assert.deepEqual(calls, [{
                  name: 'preventDefault',
                  arguments: []
               }]);
            });
            it('The option newLineKey is equal to ctrlEnter. Press ctrl + enter.', function() {
               event = new SyntheticEvent({
                  keyCode: constants.key.enter,
                  altKey: false,
                  ctrlKey: true,
                  shiftKey: false,
                  preventDefault: preventDefault
               });
               ctrl._options.newLineKey = 'ctrlEnter';

               ctrl._keyDownHandler(event);

               assert.deepEqual(calls, [{
                  name: 'paste',
                  arguments: ['\n']
               }]);
            });
         });
      });
   }
);
