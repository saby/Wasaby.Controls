/**
 * Created by dv.zuev on 18.05.2017.
 */
define([
   'Core/constants',
   'js!SBIS3.CORE.CompoundControl',
   'Core/helpers/collection-helpers'
], function (cConstants,
             focusTestControl) {
   'use strict';

   var scenario = {
      1: function (testControl) {
         fireClick(testControl.getChildControlByName('TextBox0'));
         childIsActive(testControl, 'TextBox0');
         childHasFocus(testControl, 'TextBox0');
         isActive(testControl);

         fireKeypress(testControl.getChildControlByName('TextBox0'), cConstants.key.tab);
         childIsActive(testControl, 'TextBox1');
         childIsActive(testControl, 'AreaAbstract1');
         childHasFocus(testControl, 'TextBox1');
         isActive(testControl);

         fireKeypress(testControl.getChildControlByName('TextBox1'), cConstants.key.tab);
         childHasFocus(testControl, 'TextBox3');

         fireClick(testControl.getChildControlByName('AreaAbstract1'));
         childHasFocus(testControl, 'TextBox3');

         fireKeypress(testControl.getChildControlByName('TextBox3'), cConstants.key.tab);
         // childIsNotInFocus(testControl, 'TextBox2');
         // childIsNotActive(testControl, 'AreaAbstract1');
         // notActive(testControl);
         //
         // fireClick(testControl.getChildControlByName('AreaAbstract1'));
         // childHasFocus(testControl, 'TextBox1');
      }

   };

   function notInFocus(control) {
      assert.isTrue(document.activeElement !== control._getElementToFocus()[0])
   }

   function hasFocus(control) {
      assert.isTrue(document.activeElement === control._getElementToFocus()[0])
   };

   function isActive(control) {
      assert.isTrue(control.isActive());
   }

   function notActive(control) {
      assert.isTrue(!control.isActive());
   }

   function fireClick(control) {
      control.getContainer().trigger('click');
   }

   function fireKeypress(control, keyCode) {
      var el = control.getContainer();
      var e = $.Event('keydown');
      e.which = keyCode; // Character 'A'
      el.trigger(e);
   };

   function childIsActive(caseControl, childName) {
      assert.isTrue(caseControl.getChildControlByName(childName).isActive());
   };

   function childIsNotActive(caseControl, childName) {
      assert.isTrue(!caseControl.getChildControlByName(childName).isActive());
   };

   function childHasFocus(caseControl, childName) {
      hasFocus(caseControl.getChildControlByName(childName));
   };

   function childIsNotInFocus(caseControl, childName) {
      notInFocus(caseControl.getChildControlByName(childName));
   };

   describe('Focus-tests', function () {
      var testControl;
      beforeEach(function () {
         if (typeof $ === 'undefined') {
            this.skip();
         }
         $('#mocha').append('<div id="component"></div>');
         $('#mocha').append('<div id="freeArea"></div>');

      });

      for (var i = 1; i <= 1; i++) {
         (function (i) {
            it('Case' + (i), function (done) {
               require(['tmpl!WSTest/Focus/Case' + i], function (caseTmpl) {
                  var comp = focusTestControl.extend({
                     _dotTplFn: caseTmpl
                  });
                  testControl = new comp({
                     element: 'component'
                  });
                  scenario[i](testControl); //Запускаем функцию проверки
                  done();
               });
            });
         })(i);
      }
      afterEach(function () {
         testControl && testControl.destroy();
      });

   });

});
