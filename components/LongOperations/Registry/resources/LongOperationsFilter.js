define('SBIS3.CONTROLS/LongOperations/Registry/resources/LongOperationsFilter', [
      'Lib/Control/CompoundControl/CompoundControl',
      'tmpl!SBIS3.CONTROLS/LongOperations/Registry/resources/LongOperationsFilter/LongOperationsFilter',
      'css!SBIS3.CONTROLS/LongOperations/Registry/resources/LongOperationsFilter/LongOperationsFilter',
      'SBIS3.CONTROLS/DropdownList'
   ],
   function(CompoundControl, ContentTpl) {

      return CompoundControl.extend({
         _dotTplFn: ContentTpl
      });
   }
);