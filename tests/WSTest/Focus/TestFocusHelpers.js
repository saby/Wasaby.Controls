/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('js!WSTest/Focus/TestFocusHelpers', [
   'Core/constants'
], function (cConstants) {
   'use strict';
   var helper = {
      notInFocus: function (control) {
         assert.isTrue(document.activeElement !== control._getElementToFocus()[0])
      },

      hasFocus: function (control) {
         assert.isTrue(document.activeElement === control._getElementToFocus()[0])
      },

      isActive: function (control) {
         assert.isTrue(control.isActive());
      },

      notActive: function (control) {
         assert.isTrue(!control.isActive());
      },

      childIsActive: function (caseControl, childName) {
         helper.isActive(caseControl.getChildControlByName(childName));
      },

      childIsNotActive: function (caseControl, childName) {
         helper.notActive(caseControl.getChildControlByName(childName));
      },

      childHasFocus: function (caseControl, childName) {
         helper.hasFocus(caseControl.getChildControlByName(childName));
      },

      childIsNotInFocus: function (caseControl, childName) {
         helper.notInFocus(caseControl.getChildControlByName(childName));
      },
      checkFocusOnBody: function () {
         assert.isTrue($('body')[0] === document.activeElement);
      },

      fireClick: function (control) {
         control.getContainer().trigger('click');
      },

      focusOn: function (element) {
         element.focusin ? element.focusin() : $(element).focusin();
      },

      fireKeypress: function (control, keyCode) {
         var el = control.getContainer();
         var e = $.Event('keydown');
         e.which = keyCode;
         el.trigger(e);
      },

      fireTab: function (control) {
         helper.fireKeypress(control, cConstants.key.tab);
      },

      dropFocus: function () {
         $('body').focus();
      },

      setChildActive: function (control, childName, active) {
         helper.setControlActive(control.getChildControlByName(childName), active);
      },

      setControlActive: function (control, active) {
         control.setActive(active);
      },

      focusOnLastDiv: function () {
         assert.isTrue(document.activeElement === $('.ws-focus-out')[0]);
      },

      focusOnFirstDiv: function () {
         assert.isTrue(document.activeElement === $('.ws-focus-in')[0]);
      },

      checkFocusOn: function (className) {
         assert.isTrue(document.activeElement === $("." + className)[0]);
      }
   }
   return helper;
});