define('js!SBIS3.CONTROLS.Demo.DemoPanelComponent', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Demo.DemoPanelComponent',
   'js!SBIS3.CONTROLS.TabButtons'
], function (CompoundControl, SelectorAction, dotTplFn) {

   var DemoPanelComponent = CompoundControl.extend({
      _dotTplFn: dotTplFn,
      $protected: {

      },
      $constructor: function() {

      }

   });


   return DemoPanelComponent;
});
