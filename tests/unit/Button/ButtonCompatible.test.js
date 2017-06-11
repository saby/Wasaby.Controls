/**
 * Created by dv.zuev on 18.05.2017.
 */
define([
   'js!SBIS3.CONTROLS.Button'
], function (
   Button
) {
   'use strict';

   describe('SBIS3.CONTROLS.Button Compatible', function () {

      var button = new Button({activableByClick:false});


      describe('Focus', function(){


         it('do not set active', function () {
            button._onMouseClick();
            assert.isTrue(!button._isControlActive);
         });

      });

   });

});
