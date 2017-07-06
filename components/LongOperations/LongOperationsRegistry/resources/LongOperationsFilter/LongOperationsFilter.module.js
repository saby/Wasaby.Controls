define('js!SBIS3.CONTROLS.LongOperationsFilter', [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.CONTROLS.LongOperationsFilter',
      'css!SBIS3.CONTROLS.LongOperationsFilter',
      'js!SBIS3.CONTROLS.DropdownList',
      'optional!js!SBIS3.Staff.Choice'
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