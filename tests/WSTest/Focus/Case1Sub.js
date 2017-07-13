define('js!WSTest/Focus/Case1Sub',
   [
      'js!SBIS3.CORE.CompoundControl',
      'tmpl!WSTest/Focus/Case1Sub'
   ], function (CompoundControl, dotTplFn) {

      var moduleClass = CompoundControl.extend({
         _dotTplFn: dotTplFn,

      });

      return moduleClass;
   });