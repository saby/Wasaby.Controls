define('js!WSTest/Focus/Case1',
   [
      'js!SBIS3.CORE.CompoundControl',
      'tmpl!WSTest/Focus/Case1'
   ], function (CompoundControl, dotTplFn) {

      var moduleClass = CompoundControl.extend({
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {}
         },

      });

      return moduleClass;
   });