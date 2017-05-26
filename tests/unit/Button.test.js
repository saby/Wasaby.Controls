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
            primary: true
         };




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

      });

   });

});
