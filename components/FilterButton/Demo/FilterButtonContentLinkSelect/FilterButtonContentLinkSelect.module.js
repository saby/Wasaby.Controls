define('js!SBIS3.CONTROLS.Demo.FilterButtonContentLinkSelect', [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.CONTROLS.Demo.FilterButtonContentLinkSelect',
      'css!SBIS3.CONTROLS.Demo.FilterButtonContentLinkSelect'
   ],
   function(CompoundControl, ContentTpl) {

      var FilterButtonContentLinkSelect = CompoundControl.extend({
         _dotTplFn: ContentTpl
      });

      return FilterButtonContentLinkSelect;
   }
);