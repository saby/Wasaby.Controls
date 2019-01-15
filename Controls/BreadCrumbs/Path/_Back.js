define('Controls/BreadCrumbs/Path/_Back', [
   'Core/Control',
   'wml!Controls/BreadCrumbs/Path/_Back'
], function(
   Control,
   template
) {
   'use strict';

   var Back = Control.extend({
      _template: template,

      _onBackButtonClick: function() {
         this._notify('backButtonClick', [], {
            bubbling: true
         });
      },

      _onArrowClick: function() {
         this._notify('arrowClick', [], {
            bubbling: true
         });
      }
   });

   return Back;
});
