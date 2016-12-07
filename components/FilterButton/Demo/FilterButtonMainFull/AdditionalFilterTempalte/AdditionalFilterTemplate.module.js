/**
 * Created by am.gerasimov on 05.07.2016.
 */
define('js!SBIS3.CONTROLS.Demo.AdditionalFilterTemplate', [
       'js!SBIS3.CORE.CompoundControl',
       'html!SBIS3.CONTROLS.Demo.AdditionalFilterTemplate',
       'css!SBIS3.CONTROLS.Demo.AdditionalFilterTemplate',
       'js!SBIS3.CONTROLS.ComboBox',
       'js!SBIS3.CONTROLS.FilterLink',
       'js!SBIS3.CONTROLS.FilterSelect'
    ],
    function(CompoundControl, ContentTpl) {

       var FilterContent = CompoundControl.extend({
          _dotTplFn: ContentTpl
       });

       return FilterContent;
    }
);