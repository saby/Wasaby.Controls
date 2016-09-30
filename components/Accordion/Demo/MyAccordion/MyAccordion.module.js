define('js!SBIS3.CONTROLS.Demo.MyAccordion', [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.CONTROLS.Demo.MyAccordion',
      'css!SBIS3.CONTROLS.Demo.MyAccordion',
      'js!SBIS3.CONTROLS.Accordion',
      'html!SBIS3.CONTROLS.Demo.MyLink'
   ], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MyAccordion
    * @class SBIS3.CONTROLS.Demo.MyAccordion
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyAccordion.prototype */{
      _dotTplFn: dotTplFn
   });
   return moduleClass;
});