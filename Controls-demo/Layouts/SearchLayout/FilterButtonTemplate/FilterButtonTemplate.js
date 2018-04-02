/**
 * Created by am.gerasimov on 28.03.2018.
 */
define('Controls-demo/Layouts/SearchLayout/FilterButtonTemplate/FilterButtonTemplate', [
   'SBIS3.CONTROLS/CompoundControl',
   'tmpl!Controls-demo/Layouts/SearchLayout/FilterButtonTemplate/FilterButtonTemplate'

], function (CompoundControl, template) {
   'use strict';
   
   var ModuleClass = CompoundControl.extend(
      {
         _dotTplFn: template
         
      });
   return ModuleClass;
});