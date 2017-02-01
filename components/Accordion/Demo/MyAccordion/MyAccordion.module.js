define('js!SBIS3.CONTROLS.Demo.MyAccordion',
   [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.CONTROLS.Demo.MyAccordion',
      'css!SBIS3.CONTROLS.Demo.MyAccordion',
      'js!SBIS3.CONTROLS.Accordion',
      'js!SBIS3.CONTROLS.Demo.MyLink'
   ],
   function(CompoundControl, dotTplFn) {
      var moduleClass = CompoundControl.extend({
         _dotTplFn: dotTplFn
      });
      return moduleClass;
   }
);