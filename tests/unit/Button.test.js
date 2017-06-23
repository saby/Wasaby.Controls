   /**
 * Created by dv.zuev on 18.05.2017.
 */
define([
   'js!SBIS3.CONTROLS.Button',
   'Core/vdom/Synchronizer/resources/SyntheticEvent'
], function (
   Button, SyntheticEvent
) {
   'use strict';

   describe('SBIS3.CONTROLS.Button', function () {

      var cfg = {
            command: "cmd",
            primary: true,
            class: "testClass"
         };


      var buttonPartial = new Button({ caption: "some<br>caption", hasPartial: true});
      describe('State', function() {
         it('caption is string', function () {
            assert.isTrue(typeof buttonPartial._options.caption === "string");
         });
      });


      var button = new Button(cfg);


      describe('Events', function(){
         it('MouseDown / MouseUp', function () {
            button._onMouseDown({});
            assert.isTrue(button._isActiveByClick);
            button._onMouseUp({});
            assert.isTrue(!button._isActiveByClick);
         });

         it('Click', function () {
            var testEvent,
            tempFunc = function(){
               testEvent = true;
            };
            button.subscribe('onActivated', tempFunc);
            testEvent = false;
            button._onMouseClick({});
            assert.isTrue(testEvent);
            testEvent = false;
            button.unsubscribe('onActivated', tempFunc);
            button._onMouseClick({});
            assert.isTrue(!testEvent);

         });

         it('Enabled and Click', function () {
            var testEvent,
               tempFunc = function(){
                  testEvent = true;
               };
            button.subscribe('onActivated', tempFunc);
            testEvent = false;
            assert.isTrue(button.isEnabled());
            button.setEnabled(false);
            assert.isTrue(!button.isEnabled());
            testEvent = false;
            button._onMouseClick({});
            assert.isTrue(!testEvent);
            button.unsubscribe('onActivated', tempFunc);
            button.setEnabled(true);
            assert.isTrue(button.isEnabled());
         });

         it('onKeyDown', function(){
            var testEvent,
               tempFunc = function(){
                  testEvent = true;
               };
            var ev = new SyntheticEvent("onkeydown", {key:'Enter'});
            button.subscribe('onActivated', tempFunc);
            testEvent = false;
            button._onKeyDown(ev);
            assert.isTrue(testEvent);
            button.unsubscribe('onActivated', tempFunc);
         });


         it('isDefaultButton', function(){
            assert.isTrue(button.isDefaultButton());
            button.setDefaultButton(false);
            assert.isTrue(!button.isDefaultButton());
            button.setDefaultButton(true);
            assert.isTrue(button.isDefaultButton());
         });

         it('icon', function(){
            assert.isTrue(!button.getIcon());
            button.setIcon("lol");
            assert.isTrue(button.getIcon()==="sprite:lol");
            button.setIcon();
            assert.isTrue(!button.getIcon());
         });

         it('touchClickOnce', function(){
            var clickEvent = 0;
            button.subscribe("onActivated", function() {
               clickEvent++;
            });
            button._onTouchStart();
            button._onTouchEnd();
            button._onMouseClick();
            assert.equal(clickEvent, 1);
            clickEvent = 0;
          });

         it('mouseDownEnabled', function() {
            button.setEnabled(true);
            button._isActiveByClick = false;
            button._onMouseDown();
            assert.isTrue(button._isActiveByClick);
         });

         it('mouseDownDisabled', function() {
            button.setEnabled(false);
            button._isActiveByClick = false;
            button._onMouseDown();
            assert.isTrue(!button._isActiveByClick);
         });

         it('ipadShortTapTouchEnd', function(done) {
            button._isActiveByClick = false;
            button._onTouchStart();
            button._onTouchEnd();
            assert.isTrue(button._isActiveByClick);
            setTimeout(function() {
               assert.isTrue(button._isActiveByClick);
               done();
            }, 500);
         });

         it('ipadShortTapTimeout', function(done) {
            var testEvent = false,
               tempFunc = function(){
                  testEvent = true;
               };
            button.subscribe('onPropertyChange', tempFunc);
            button._isActiveByClick = false;
            button._onTouchStart();
            button._onTouchEnd();

            setTimeout(function() {
               assert.isTrue(!button._isActiveByClick);
               assert.isTrue(testEvent);
               done();
            }, 1100);
         });

      });

   });

});
