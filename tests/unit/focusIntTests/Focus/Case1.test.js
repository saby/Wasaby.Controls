/**
 * Created by dv.zuev on 18.05.2017.
 */
define([
   'js!WSTest/Focus/Case1',
   "Core/constants",
], function (
   Case1,
   cConstants
) {
   'use strict';

   function fireKeypress(el, keyCode) {
      var e = $.Event('keydown');
      e.which = keyCode; // Character 'A'
      $(el).trigger(e);
   };

   describe('FocusCase1', function () {
      var case1;
      beforeEach(function() {
         if (typeof $ === 'undefined') {
            this.skip();
         }
         $('#mocha').append('<div id="component"></div>');
         case1 = new Case1({
            element: 'component'
         });
         $('#mocha').append('<div id="freeArea"></div>');

      });
      describe('VDom API for Control', function(){
         it('Case1', function () {
            case1.getChildControlByName('TextBox0').getContainer().trigger('click');
            assert.isTrue(case1.getChildControlByName('TextBox0').isActive());
            assert.isTrue(document.activeElement === case1.getChildControlByName('TextBox0')._getElementToFocus()[0]);
            assert.isTrue(case1.isActive());

            fireKeypress(case1.getChildControlByName('TextBox0').getContainer()[0], cConstants.key.tab);
            assert.isTrue(case1.getChildControlByName('TextBox1').isActive());
            assert.isTrue(case1.getChildControlByName('AreaAbstract1').isActive());
            assert.isTrue(document.activeElement === case1.getChildControlByName('TextBox1')._getElementToFocus()[0]);
            assert.isTrue(case1.isActive());

            fireKeypress(case1.getChildControlByName('TextBox1').getContainer()[0], cConstants.key.tab);
            assert.isTrue(document.activeElement === case1.getChildControlByName('TextBox3')._getElementToFocus()[0]);

            case1.getChildControlByName('AreaAbstract1').getContainer().trigger('click');
            assert.isTrue(document.activeElement === case1.getChildControlByName('TextBox3')._getElementToFocus()[0]);

            fireKeypress(case1.getChildControlByName('TextBox3').getContainer()[0], cConstants.key.tab);
            assert.isTrue(document.activeElement !== case1.getChildControlByName('TextBox2')._getElementToFocus()[0]);
            // assert.isTrue(!case1.getChildControlByName('AreaAbstract1').isActive());
            // assert.isTrue(!case1.isActive());

            // case1.getChildControlByName('AreaAbstract1').getContainer().trigger('click');
            // assert.isTrue(document.activeElement === case1.getChildControlByName('TextBox1')._getElementToFocus()[0]);
         });

      });
      afterEach(function() {
         if (typeof $ === 'undefined') {
            this.skip();
         }
         $('#component').remove();
      });

   });

});
