define('SBIS3.CONTROLS/LongOperations/Registry/resources/LongOperationsFilter', [
      'Lib/Control/CompoundControl/CompoundControl',
      'tmpl!SBIS3.CONTROLS/LongOperations/Registry/resources/LongOperationsFilter/LongOperationsFilter',
      'css!SBIS3.CONTROLS/LongOperations/Registry/resources/LongOperationsFilter/LongOperationsFilter',
      'SBIS3.CONTROLS/DropdownList',
      'optional!Staff/Choice'
   ],
   function(CompoundControl, ContentTpl) {

      var FilterContent = CompoundControl.extend({
         _dotTplFn: ContentTpl,
         $protected: {
            _options: {
               hideStaffFilter: false
            }
         },
         init: function(){
            FilterContent.superclass.init.call(this);
         }
      });

      return FilterContent;
   }
);