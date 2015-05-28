/**
 * Created by as.suhoruchkin on 21.04.2015.
 */
define('js!SBIS3.CONTROLS.FilterButtonCustomItem', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.FilterButtonCustomItem',
   'js!SBIS3.CONTROLS.IconButton'
], function(CompoundControl, dotTplFn) {

   var FilterButtonCustomItem = CompoundControl.extend({
      _dotTplFn: dotTplFn,

      $protected: {
         _options: {
            caption: undefined,
            icon: 'sprite: icon-24 action-hover icon-Erase icon-error'
         }
      },
      init: function() {
         FilterButtonCustomItem.superclass.init.apply(this, arguments);
         var self = this;
         if (this.hasChildControlByName('removeButton')) {
            this.getChildControlByName('removeButton').subscribe('onActivated', function () {
               self.hide();
            });
         }
      },
      toString: function() {
         var control =  this.getChildControls()[0];
         return control ? control.toString() : undefined;
      }
   });

   return FilterButtonCustomItem;

});