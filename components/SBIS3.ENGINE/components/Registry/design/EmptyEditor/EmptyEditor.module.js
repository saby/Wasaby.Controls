define('js!genie.EmptyEditor', ['js!genie.PropertyEditorSimple'], function (PropertyEditorSimple, dotTplFn) {
   'use strict';
   return PropertyEditorSimple.extend({
      _dotTplFn: dotTplFn,
      $constructor: function () {
         this.getContainer().css({minHeight: 0, margin: 0});
      }
   });
});