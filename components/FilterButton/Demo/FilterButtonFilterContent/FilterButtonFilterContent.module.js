define('js!SBIS3.CONTROLS.Demo.FilterButtonFilterContent', [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.CONTROLS.Demo.FilterButtonFilterContent',
      'css!SBIS3.CONTROLS.Demo.FilterButtonFilterContent',
      'js!SBIS3.CONTROLS.ComboBox',
      'js!SBIS3.CORE.FieldLink',
      'js!SBIS3.CONTROLS.Demo.FilterButtonContentLinkSelect'
   ],
   function(CompoundControl, ContentTpl) {

      var FilterContent = CompoundControl.extend({
         _dotTplFn: ContentTpl
      });

      return FilterContent;
   }
);