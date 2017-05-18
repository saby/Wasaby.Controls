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
      }, testEvent = false;
      if (typeof window !== "undefined") {
         cfg.element = $("<div></div>").appendTo("body");
      }



      var button = new Button(cfg);
      button.subscribe('onActivated', function(){
         testEvent = true;
      });

      describe('Events', function(){
         it('MouseDown / MouseUp', function () {
            button._onMouseDown({});
            assert.isTrue(button._isActiveByClick);
            button._onMouseUp({});
            assert.isTrue(!button._isActiveByClick);
         });

         it('Click', function () {
            button._onClick({});
            assert.isTrue(button._isControlActive);
            button.setActive(false);
            assert.isTrue(!button._isControlActive);

         });

         it('onActivated launched', function(){
            assert.isTrue(testEvent);
            testEvent = false;
         });

         it('Enabled and Click', function () {
            assert.isTrue(button.isEnabled());
            button.setEnabled(false);
            assert.isTrue(!button.isEnabled());
            button._onClick({});
            assert.isTrue(!button._isControlActive);
         });

         it('onActivated not launched with disabled', function(){
            assert.isTrue(!testEvent);
         });

         it('onKeyDown', function(){
            button.setEnabled(true);
            assert.isTrue(button.isEnabled());
            var ev = new SyntheticEvent("onkeydown", {which:13});
            button._onKeyDown(ev);
            assert.isTrue(button._isControlActive);
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
